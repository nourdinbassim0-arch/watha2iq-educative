/**
 * Structured Document Model Types
 * Professional Document Engine for Moroccan Educational Platform
 */

export type PageSize = 'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL' | 'CUSTOM';
export type PageOrientation = 'portrait' | 'landscape';
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';
export type VerticalAlignment = 'top' | 'center' | 'bottom';
export type TextDirection = 'rtl' | 'ltr';

export interface PageMarginsMm {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PageSettings {
  size: PageSize;
  orientation: PageOrientation;
  margins: PageMarginsMm;
  headerDistanceMm?: number;
  footerDistanceMm?: number;
  customWidthMm?: number;
  customHeightMm?: number;
}

export interface BorderStyleDefinition {
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  size?: number; // in pt
  color?: string; // hex
}

export interface CellBorders {
  top?: BorderStyleDefinition;
  right?: BorderStyleDefinition;
  bottom?: BorderStyleDefinition;
  left?: BorderStyleDefinition;
}

export interface TextRunNode {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: number; // in pt (e.g. 10, 11, 12, 14, 16, 20, 24, 32)
  color?: string; // hex (e.g. '#065f46')
  backgroundColor?: string;
  direction?: TextDirection;
}

export interface ParagraphNode {
  type: 'paragraph';
  children: TextRunNode[];
  alignment?: TextAlignment;
  direction?: TextDirection;
  lineHeight?: number; // e.g. 1.15, 1.25, 1.5
  spacingBefore?: number; // in pt
  spacingAfter?: number; // in pt
  keepWithNext?: boolean;
  backgroundColor?: string;
  padding?: number; // in pt
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface HeadingNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4;
  children: TextRunNode[];
  alignment?: TextAlignment;
  direction?: TextDirection;
  lineHeight?: number;
  spacingBefore?: number;
  spacingAfter?: number;
  keepWithNext?: boolean;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface TableCellNode {
  children: (ParagraphNode | HeadingNode | ImageNode | SpacerNode | HorizontalRuleNode)[];
  widthPercentage?: number; // 0 to 100
  widthMm?: number;
  verticalAlignment?: VerticalAlignment;
  backgroundColor?: string;
  borders?: CellBorders;
  paddingMm?: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface TableRowNode {
  cells: TableCellNode[];
  heightMm?: number;
  keepTogether?: boolean;
  isHeader?: boolean;
}

export interface TableNode {
  type: 'table';
  rows: TableRowNode[];
  widthPercentage?: number; // default 100
  alignment?: 'left' | 'center' | 'right';
  direction?: TextDirection;
  repeatHeader?: boolean;
  borderColor?: string;
  borderWidth?: number;
}

export interface ImageNode {
  type: 'image';
  src: string; // url or data url
  alt?: string;
  widthMm?: number;
  heightMm?: number;
  alignment?: 'left' | 'center' | 'right';
  caption?: string;
}

export interface SpacerNode {
  type: 'spacer';
  heightMm: number;
}

export interface PageBreakNode {
  type: 'pageBreak';
}

export interface HorizontalRuleNode {
  type: 'horizontalRule';
  color?: string;
  thicknessPt?: number;
  spacingAfterPt?: number;
  spacingBeforePt?: number;
}

export interface CalloutBoxNode {
  type: 'callout';
  title?: string;
  icon?: string;
  children: DocumentNode[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  direction?: TextDirection;
}

export type DocumentNode =
  | ParagraphNode
  | HeadingNode
  | TableNode
  | ImageNode
  | SpacerNode
  | PageBreakNode
  | HorizontalRuleNode
  | CalloutBoxNode;

export interface DocumentSection {
  id?: string;
  title?: string;
  nodes: DocumentNode[];
}

export interface HeaderFooterConfig {
  showOnFirstPage?: boolean;
  nodes: DocumentNode[];
}

export interface StructuredDocument {
  schemaVersion: number; // 1
  id: string;
  title: string;
  language: 'ar' | 'fr' | 'en';
  page: PageSettings;
  metadata?: {
    author?: string;
    subject?: string;
    school?: string;
    academicYear?: string;
    grade?: string;
    directorate?: string;
    academy?: string;
    createdAt?: number | string;
    updatedAt?: number | string;
    documentType?: string;
  };
  header?: HeaderFooterConfig;
  footer?: HeaderFooterConfig;
  sections: DocumentSection[];
  watermarkText?: string;
}
