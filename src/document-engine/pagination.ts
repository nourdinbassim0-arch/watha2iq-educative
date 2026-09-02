import {
  StructuredDocument,
  DocumentNode,
  PageSettings,
  TableNode,
  TableRowNode,
  ParagraphNode,
  HeadingNode,
  CalloutBoxNode,
} from './types';
import { getUsablePageAreaMm } from './documentModel';

export interface PaginatedPage {
  pageNumber: number;
  totalPages: number;
  nodes: DocumentNode[];
  pageSettings: PageSettings;
}

/**
 * Estimates the height of a DocumentNode in millimeters
 */
export function estimateNodeHeightMm(node: DocumentNode, availableWidthMm: number): number {
  switch (node.type) {
    case 'pageBreak':
      return 9999; // Forces a page break

    case 'spacer':
      return node.heightMm || 5;

    case 'horizontalRule':
      return 3;

    case 'paragraph': {
      let textLength = 0;
      for (const child of node.children) {
        textLength += child.text?.length || 0;
      }
      // Approx chars per line at 10pt on standard width: ~80 chars in 170mm
      const charsPerLine = Math.max(30, Math.floor((availableWidthMm / 170) * 80));
      const lineCount = Math.max(1, Math.ceil(textLength / charsPerLine));
      const fontSizePt = node.children[0]?.fontSize || 10;
      const lineHeightMm = (fontSizePt * 1.35 * 25.4) / 72;
      const spacingBeforeMm = ((node.spacingBefore || 0) * 25.4) / 72;
      const spacingAfterMm = ((node.spacingAfter || 6) * 25.4) / 72;
      const paddingMm = ((node.padding || 0) * 25.4) / 72;
      return lineCount * lineHeightMm + spacingBeforeMm + spacingAfterMm + paddingMm * 2;
    }

    case 'heading': {
      const headingFontSizes: Record<number, number> = { 1: 22, 2: 18, 3: 15, 4: 13 };
      const fontSizePt = headingFontSizes[node.level] || 16;
      const heightMm = (fontSizePt * 1.5 * 25.4) / 72;
      const spacingBeforeMm = ((node.spacingBefore || 8) * 25.4) / 72;
      const spacingAfterMm = ((node.spacingAfter || 6) * 25.4) / 72;
      return heightMm + spacingBeforeMm + spacingAfterMm;
    }

    case 'table': {
      let totalTableHeight = 0;
      for (const row of node.rows) {
        totalTableHeight += estimateTableRowHeightMm(row, availableWidthMm);
      }
      return totalTableHeight + 4; // Margin/borders
    }

    case 'callout': {
      let calloutContentHeight = 10; // Title & padding
      for (const child of node.children) {
        calloutContentHeight += estimateNodeHeightMm(child, availableWidthMm - 10);
      }
      return calloutContentHeight;
    }

    case 'image':
      return node.heightMm || 40;

    default:
      return 10;
  }
}

/**
 * Estimates table row height based on cell contents
 */
export function estimateTableRowHeightMm(row: TableRowNode, availableWidthMm: number): number {
  if (row.heightMm && row.heightMm > 0) return row.heightMm;

  let maxCellHeight = 6;
  const colCount = Math.max(1, row.cells.length);
  const cellWidthMm = availableWidthMm / colCount;

  for (const cell of row.cells) {
    let cellHeight = (cell.paddingMm || 2) * 2;
    for (const child of cell.children) {
      cellHeight += estimateNodeHeightMm(child, cellWidthMm - 4);
    }
    maxCellHeight = Math.max(maxCellHeight, cellHeight);
  }

  return maxCellHeight;
}

/**
 * Paginates a StructuredDocument into logical pages
 */
export function paginateDocument(doc: StructuredDocument): PaginatedPage[] {
  const { widthMm, heightMm } = getUsablePageAreaMm(doc.page);
  const pages: { nodes: DocumentNode[] }[] = [{ nodes: [] }];
  let currentPageIndex = 0;
  let currentHeightUsedMm = 0;

  for (const section of doc.sections) {
    for (const node of section.nodes) {
      if (node.type === 'pageBreak') {
        pages.push({ nodes: [] });
        currentPageIndex++;
        currentHeightUsedMm = 0;
        continue;
      }

      // If the node is a large table, intelligently split rows across pages
      if (node.type === 'table' && node.rows.length > 3) {
        const headerRow = node.rows.find((r) => r.isHeader) || (node.repeatHeader ? node.rows[0] : null);
        const rowsToProcess = node.rows;
        let currentTableRows: TableRowNode[] = [];

        for (let rIdx = 0; rIdx < rowsToProcess.length; rIdx++) {
          const row = rowsToProcess[rIdx];
          const rowHeight = estimateTableRowHeightMm(row, widthMm);

          if (currentHeightUsedMm + rowHeight > heightMm && currentTableRows.length > 0) {
            // Push current table chunk to page
            pages[currentPageIndex].nodes.push({
              ...node,
              rows: currentTableRows,
            });

            // Start new page
            pages.push({ nodes: [] });
            currentPageIndex++;
            currentHeightUsedMm = 0;
            currentTableRows = [];

            // Repeat header on new page if configured
            if (node.repeatHeader && headerRow && row !== headerRow) {
              currentTableRows.push(headerRow);
              currentHeightUsedMm += estimateTableRowHeightMm(headerRow, widthMm);
            }
          }

          currentTableRows.push(row);
          currentHeightUsedMm += rowHeight;
        }

        if (currentTableRows.length > 0) {
          pages[currentPageIndex].nodes.push({
            ...node,
            rows: currentTableRows,
          });
        }
        continue;
      }

      // General node pagination
      const nodeHeight = estimateNodeHeightMm(node, widthMm);

      if (currentHeightUsedMm + nodeHeight > heightMm && pages[currentPageIndex].nodes.length > 0) {
        // Start a new page
        pages.push({ nodes: [node] });
        currentPageIndex++;
        currentHeightUsedMm = nodeHeight;
      } else {
        pages[currentPageIndex].nodes.push(node);
        currentHeightUsedMm += nodeHeight;
      }
    }
  }

  const totalPages = Math.max(1, pages.length);

  return pages.map((p, idx) => ({
    pageNumber: idx + 1,
    totalPages,
    nodes: p.nodes,
    pageSettings: doc.page,
  }));
}
