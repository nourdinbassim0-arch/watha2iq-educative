import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  HeadingLevel,
  VerticalAlign,
} from 'docx';
import {
  StructuredDocument,
  DocumentNode,
  ParagraphNode,
  HeadingNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TextRunNode,
  CalloutBoxNode,
} from './types';
import { getPageDimensionsMm } from './documentModel';
import { mmToDxa, ptToDxa, ptToHalfPoints, getDocxFontName } from './fonts';

/**
 * Converts a hex color string (e.g. '#065f46') to Word 6-digit hex (e.g. '065f46')
 */
function cleanHex(color?: string, defaultColor = '000000'): string {
  if (!color) return defaultColor;
  return color.replace('#', '').trim();
}

/**
 * Converts TextAlignment to docx AlignmentType
 */
function mapAlignment(alignment?: string, isRtl = true): (typeof AlignmentType)[keyof typeof AlignmentType] {
  switch (alignment) {
    case 'center':
      return AlignmentType.CENTER;
    case 'left':
      return AlignmentType.LEFT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    case 'right':
    default:
      return isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT;
  }
}

/**
 * Converts TextRunNode into docx TextRun
 */
function convertTextRun(tr: TextRunNode, defaultFont = 'Tajawal'): TextRun {
  return new TextRun({
    text: tr.text || '',
    bold: tr.bold ?? false,
    italics: tr.italic ?? false,
    underline: tr.underline ? {} : undefined,
    font: tr.fontFamily || defaultFont,
    size: ptToHalfPoints(tr.fontSize || 10),
    color: cleanHex(tr.color, '000000'),
    shading: tr.backgroundColor
      ? {
          fill: cleanHex(tr.backgroundColor),
        }
      : undefined,
  });
}

/**
 * Converts ParagraphNode or HeadingNode into docx Paragraph
 */
function convertParagraph(p: ParagraphNode | HeadingNode, defaultFont = 'Tajawal'): Paragraph {
  const isRtl = p.direction !== 'ltr';
  const textRuns = p.children.map((child) => convertTextRun(child, defaultFont));

  let headingLevel: any = undefined;
  if (p.type === 'heading') {
    switch (p.level) {
      case 1:
        headingLevel = HeadingLevel.HEADING_1;
        break;
      case 2:
        headingLevel = HeadingLevel.HEADING_2;
        break;
      case 3:
        headingLevel = HeadingLevel.HEADING_3;
        break;
      case 4:
      default:
        headingLevel = HeadingLevel.HEADING_4;
        break;
    }
  }

  return new Paragraph({
    children: textRuns,
    alignment: mapAlignment(p.alignment, isRtl),
    bidirectional: isRtl,
    heading: headingLevel,
    spacing: {
      before: p.spacingBefore ? ptToDxa(p.spacingBefore) : 0,
      after: p.spacingAfter ? ptToDxa(p.spacingAfter) : ptToDxa(4),
      line: p.lineHeight ? Math.round(p.lineHeight * 240) : 276, // 1.15 line pitch
    },
    keepNext: p.keepWithNext,
    shading: p.backgroundColor
      ? {
          fill: cleanHex(p.backgroundColor),
        }
      : undefined,
  });
}

/**
 * Converts TableCellNode into docx TableCell
 */
function convertTableCell(cell: TableCellNode, defaultFont = 'Tajawal'): TableCell {
  const cellParagraphs: Paragraph[] = [];

  for (const child of cell.children) {
    if (child.type === 'paragraph' || child.type === 'heading') {
      cellParagraphs.push(convertParagraph(child, defaultFont));
    } else if (child.type === 'spacer') {
      cellParagraphs.push(new Paragraph({ spacing: { after: ptToDxa(child.heightMm * 2) } }));
    }
  }

  if (cellParagraphs.length === 0) {
    cellParagraphs.push(new Paragraph({ children: [] }));
  }

  let verticalAlign: any = VerticalAlign.TOP;
  if (cell.verticalAlignment === 'center') verticalAlign = VerticalAlign.CENTER;
  if (cell.verticalAlignment === 'bottom') verticalAlign = VerticalAlign.BOTTOM;

  const bordersConfig: any = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
  };

  if (cell.borders) {
    if (cell.borders.top) {
      bordersConfig.top = {
        style: cell.borders.top.style === 'double' ? BorderStyle.DOUBLE : BorderStyle.SINGLE,
        size: Math.round((cell.borders.top.size || 1) * 4),
        color: cleanHex(cell.borders.top.color, 'CBD5E1'),
      };
    }
    if (cell.borders.bottom) {
      bordersConfig.bottom = {
        style: cell.borders.bottom.style === 'double' ? BorderStyle.DOUBLE : BorderStyle.SINGLE,
        size: Math.round((cell.borders.bottom.size || 1) * 4),
        color: cleanHex(cell.borders.bottom.color, 'CBD5E1'),
      };
    }
    if (cell.borders.right) {
      bordersConfig.right = {
        style: cell.borders.right.style === 'double' ? BorderStyle.DOUBLE : BorderStyle.SINGLE,
        size: Math.round((cell.borders.right.size || 1) * 4),
        color: cleanHex(cell.borders.right.color, 'CBD5E1'),
      };
    }
    if (cell.borders.left) {
      bordersConfig.left = {
        style: cell.borders.left.style === 'double' ? BorderStyle.DOUBLE : BorderStyle.SINGLE,
        size: Math.round((cell.borders.left.size || 1) * 4),
        color: cleanHex(cell.borders.left.color, 'CBD5E1'),
      };
    }
  }

  const widthPercentage = cell.widthPercentage || 50;

  return new TableCell({
    children: cellParagraphs,
    width: {
      size: widthPercentage,
      type: WidthType.PERCENTAGE,
    },
    verticalAlign,
    shading: cell.backgroundColor
      ? {
          fill: cleanHex(cell.backgroundColor),
        }
      : undefined,
    borders: bordersConfig,
    margins: {
      top: ptToDxa(cell.paddingMm ? cell.paddingMm * 2 : 4),
      bottom: ptToDxa(cell.paddingMm ? cell.paddingMm * 2 : 4),
      left: ptToDxa(cell.paddingMm ? cell.paddingMm * 2 : 4),
      right: ptToDxa(cell.paddingMm ? cell.paddingMm * 2 : 4),
    },
  });
}

/**
 * Converts TableNode into docx Table
 */
function convertTable(table: TableNode, defaultFont = 'Tajawal'): Table {
  const docxRows = table.rows.map(
    (row) =>
      new TableRow({
        tableHeader: row.isHeader ?? false,
        cantSplit: row.keepTogether ?? true,
        children: row.cells.map((cell) => convertTableCell(cell, defaultFont)),
      })
  );

  return new Table({
    rows: docxRows,
    width: {
      size: table.widthPercentage || 100,
      type: WidthType.PERCENTAGE,
    },
    alignment: AlignmentType.CENTER,
  });
}

/**
 * Converts CalloutBoxNode into a styled docx single-cell Table
 */
function convertCallout(callout: CalloutBoxNode, defaultFont = 'Tajawal'): Table {
  const calloutParagraphs: Paragraph[] = [];

  if (callout.title) {
    calloutParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: callout.title,
            bold: true,
            size: ptToHalfPoints(11),
            font: defaultFont,
            color: cleanHex(callout.textColor, '065F46'),
          }),
        ],
        alignment: AlignmentType.RIGHT,
        bidirectional: true,
        spacing: { after: ptToDxa(4) },
      })
    );
  }

  for (const child of callout.children) {
    if (child.type === 'paragraph' || child.type === 'heading') {
      calloutParagraphs.push(convertParagraph(child, defaultFont));
    }
  }

  const borderHex = cleanHex(callout.borderColor, 'CBD5E1');

  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: calloutParagraphs,
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: cleanHex(callout.backgroundColor, 'F8FAFC') },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: borderHex },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: borderHex },
              left: { style: BorderStyle.SINGLE, size: 6, color: borderHex },
              right: { style: BorderStyle.SINGLE, size: 18, color: cleanHex(callout.textColor, '065F46') }, // Thicker right accent border for Arabic RTL
            },
            margins: {
              top: ptToDxa(6),
              bottom: ptToDxa(6),
              left: ptToDxa(8),
              right: ptToDxa(8),
            },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/**
 * Generates a clean, fully formatted Word DOCX document from StructuredDocument
 */
export async function exportStructuredDocumentToDocx(
  doc: StructuredDocument,
  onProgress?: (pct: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, 'جاري تحويل عناصر الوثيقة إلى تنسيق Word DOCX...');

  const { widthMm, heightMm } = getPageDimensionsMm(doc.page);
  const defaultFont = getDocxFontName();
  const childrenElements: (Paragraph | Table)[] = [];

  // Iterate sections and nodes
  for (let sIdx = 0; sIdx < doc.sections.length; sIdx++) {
    const section = doc.sections[sIdx];

    for (let nIdx = 0; nIdx < section.nodes.length; nIdx++) {
      const node = section.nodes[nIdx];

      switch (node.type) {
        case 'paragraph':
        case 'heading':
          childrenElements.push(convertParagraph(node, defaultFont));
          break;

        case 'table':
          childrenElements.push(convertTable(node, defaultFont));
          break;

        case 'callout':
          childrenElements.push(convertCallout(node, defaultFont));
          break;

        case 'spacer':
          childrenElements.push(
            new Paragraph({
              spacing: { after: mmToDxa(node.heightMm || 4) },
              children: [],
            })
          );
          break;

        case 'pageBreak':
          childrenElements.push(
            new Paragraph({
              children: [new PageBreak()],
            })
          );
          break;

        case 'horizontalRule':
          childrenElements.push(
            new Paragraph({
              spacing: {
                before: ptToDxa(node.spacingBeforePt || 4),
                after: ptToDxa(node.spacingAfterPt || 6),
              },
              border: {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: (node.thicknessPt || 1) * 6,
                  color: cleanHex(node.color, '065F46'),
                },
              },
              children: [],
            })
          );
          break;
      }
    }
  }

  onProgress?.(60, 'جاري إعداد هوامش وترقيم صفحات Word...');

  // Build Footer with Page Numbers in Arabic
  const docFooter = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        bidirectional: true,
        children: [
          new TextRun({
            text: `${doc.title || 'وثيقة تربوية'}  |  صفحة `,
            font: defaultFont,
            size: ptToHalfPoints(8.5),
            color: '64748B',
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            font: defaultFont,
            size: ptToHalfPoints(8.5),
            bold: true,
            color: '065F46',
          }),
          new TextRun({
            text: ' من ',
            font: defaultFont,
            size: ptToHalfPoints(8.5),
            color: '64748B',
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            font: defaultFont,
            size: ptToHalfPoints(8.5),
            bold: true,
            color: '065F46',
          }),
        ],
      }),
    ],
  });

  const docx = new DocxDocument({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: mmToDxa(widthMm),
              height: mmToDxa(heightMm),
              orientation: doc.page.orientation,
            },
            margin: {
              top: mmToDxa(doc.page.margins.top),
              bottom: mmToDxa(doc.page.margins.bottom),
              left: mmToDxa(doc.page.margins.left),
              right: mmToDxa(doc.page.margins.right),
            },
          },
        },
        footers: {
          default: docFooter,
        },
        children: childrenElements,
      },
    ],
  });

  onProgress?.(85, 'جاري تجميع حزمة ملف Word (.docx)...');
  const blob = await Packer.toBlob(docx);
  onProgress?.(100, 'اكتمل إنشاء ملف Word!');
  return blob;
}
