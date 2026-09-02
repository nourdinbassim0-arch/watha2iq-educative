import type React from 'react';
import { TableNode, TableRowNode, TableCellNode, BorderStyleDefinition, CellBorders } from './types';
import { mmToPt, ptToPx } from './fonts';

export interface TableLayoutCalculation {
  totalWidthMm: number;
  columnWidthsMm: number[];
  columnWidthsPercentage: number[];
  rowCount: number;
  colCount: number;
  hasHeader: boolean;
}

/**
 * Calculates dimensions and column distributions for structured table nodes
 */
export function calculateTableLayout(table: TableNode, availableWidthMm: number): TableLayoutCalculation {
  const rowCount = table.rows.length;
  if (rowCount === 0) {
    return {
      totalWidthMm: availableWidthMm,
      columnWidthsMm: [],
      columnWidthsPercentage: [],
      rowCount: 0,
      colCount: 0,
      hasHeader: false,
    };
  }

  // Determine max column count
  let maxCols = 0;
  for (const row of table.rows) {
    maxCols = Math.max(maxCols, row.cells.length);
  }

  const tableWidthMm = table.widthPercentage
    ? (availableWidthMm * table.widthPercentage) / 100
    : availableWidthMm;

  // Compute column widths based on first row or explicit widths
  const columnWidthsPercentage: number[] = [];
  const firstRow = table.rows[0];
  let totalExplicitPercentage = 0;
  let explicitColsCount = 0;

  for (let i = 0; i < maxCols; i++) {
    const cell = firstRow.cells[i];
    if (cell && typeof cell.widthPercentage === 'number' && cell.widthPercentage > 0) {
      columnWidthsPercentage.push(cell.widthPercentage);
      totalExplicitPercentage += cell.widthPercentage;
      explicitColsCount++;
    } else {
      columnWidthsPercentage.push(0);
    }
  }

  // Fill in non-explicit columns equally
  const remainingPercentage = Math.max(0, 100 - totalExplicitPercentage);
  const remainingCols = maxCols - explicitColsCount;
  const defaultColPercentage = remainingCols > 0 ? remainingPercentage / remainingCols : 100 / maxCols;

  for (let i = 0; i < maxCols; i++) {
    if (columnWidthsPercentage[i] === 0) {
      columnWidthsPercentage[i] = Number(defaultColPercentage.toFixed(2));
    }
  }

  const columnWidthsMm = columnWidthsPercentage.map((pct) => (tableWidthMm * pct) / 100);
  const hasHeader = table.rows.some((r) => r.isHeader) || (table.repeatHeader ?? true);

  return {
    totalWidthMm: tableWidthMm,
    columnWidthsMm,
    columnWidthsPercentage,
    rowCount,
    colCount: maxCols,
    hasHeader,
  };
}

/**
 * Standard border generator for official Moroccan school documents
 */
export function createDefaultCellBorders(color = '#cbd5e1', size = 0.5): CellBorders {
  const border: BorderStyleDefinition = {
    style: 'solid',
    size,
    color,
  };
  return {
    top: border,
    right: border,
    bottom: border,
    left: border,
  };
}

/**
 * Convert Cell Borders to CSS inline styles
 */
export function getCellBorderCSS(borders?: CellBorders): React.CSSProperties {
  if (!borders) {
    return {
      border: '1px solid #cbd5e1',
    };
  }

  const styles: React.CSSProperties = {};

  if (borders.top) {
    styles.borderTop = `${borders.top.size || 1}px ${borders.top.style || 'solid'} ${borders.top.color || '#cbd5e1'}`;
  }
  if (borders.bottom) {
    styles.borderBottom = `${borders.bottom.size || 1}px ${borders.bottom.style || 'solid'} ${borders.bottom.color || '#cbd5e1'}`;
  }
  if (borders.right) {
    styles.borderRight = `${borders.right.size || 1}px ${borders.right.style || 'solid'} ${borders.right.color || '#cbd5e1'}`;
  }
  if (borders.left) {
    styles.borderLeft = `${borders.left.size || 1}px ${borders.left.style || 'solid'} ${borders.left.color || '#cbd5e1'}`;
  }

  return styles;
}
