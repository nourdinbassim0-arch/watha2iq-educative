import React from 'react';
import {
  StructuredDocument,
  DocumentNode,
  ParagraphNode,
  HeadingNode,
  TableNode,
  TableCellNode,
  CalloutBoxNode,
  SpacerNode,
  HorizontalRuleNode,
} from './types';
import { paginateDocument, PaginatedPage } from './pagination';
import { getPageDimensionsMm } from './documentModel';
import { getFontFamilyCSS } from './fonts';
import { getCellBorderCSS } from './tables';

interface DocumentRendererProps {
  document: StructuredDocument;
  zoom?: number; // scale multiplier, e.g. 1.0, 0.8, 1.2
  showPageNumbers?: boolean;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  document,
  zoom = 1.0,
  showPageNumbers = true,
}) => {
  const paginatedPages = React.useMemo(() => {
    return paginateDocument(document);
  }, [document]);

  const { widthMm, heightMm } = getPageDimensionsMm(document.page);
  const isRtl = document.language !== 'fr' && document.language !== 'en';
  const fontFamilyCss = getFontFamilyCSS();

  return (
    <div
      className="flex flex-col items-center gap-8 py-6 select-text"
      style={{
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: fontFamilyCss,
      }}
    >
      {paginatedPages.map((page, pageIdx) => (
        <div
          key={`page-${page.pageNumber}`}
          className="relative bg-white text-slate-900 shadow-xl border border-slate-200 rounded-sm transition-transform duration-200"
          style={{
            width: `${widthMm * 3.78 * zoom}px`, // mm to screen px approx
            minHeight: `${heightMm * 3.78 * zoom}px`,
            padding: `${document.page.margins.top * 3.78 * zoom}px ${
              document.page.margins.right * 3.78 * zoom
            }px ${(document.page.margins.bottom + 8) * 3.78 * zoom}px ${
              document.page.margins.left * 3.78 * zoom
            }px`,
            boxSizing: 'border-box',
          }}
        >
          {/* Page watermark if present */}
          {document.watermarkText && (
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden opacity-5"
              style={{
                transform: 'rotate(-35deg)',
              }}
            >
              <span className="text-7xl font-black text-slate-900 tracking-widest whitespace-nowrap">
                {document.watermarkText}
              </span>
            </div>
          )}

          {/* Render Page Nodes */}
          <div className="space-y-3">
            {page.nodes.map((node, nodeIdx) => (
              <RenderNode key={`node-${pageIdx}-${nodeIdx}`} node={node} isRtl={isRtl} zoom={zoom} />
            ))}
          </div>

          {/* Page Footer */}
          {showPageNumbers && (
            <div
              className="absolute flex items-center justify-between text-slate-400 text-[11px] border-t border-slate-100 pt-2"
              style={{
                bottom: `${document.page.margins.bottom * 3.78 * zoom * 0.6}px`,
                left: `${document.page.margins.left * 3.78 * zoom}px`,
                right: `${document.page.margins.right * 3.78 * zoom}px`,
              }}
            >
              <div className="font-medium truncate max-w-[60%]">
                {document.title || 'وثيقة تربوية'} - المنظومة التربوية
              </div>
              <div className="font-semibold text-slate-500">
                صفحة {page.pageNumber} من {page.totalPages}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface RenderNodeProps {
  node: DocumentNode;
  isRtl: boolean;
  zoom: number;
}

const RenderNode: React.FC<RenderNodeProps> = ({ node, isRtl, zoom }) => {
  switch (node.type) {
    case 'paragraph':
    case 'heading': {
      const isHeading = node.type === 'heading';
      const align = node.alignment || (isRtl ? 'right' : 'left');

      return (
        <div
          style={{
            textAlign: align,
            lineHeight: node.lineHeight || 1.35,
            marginTop: `${(node.spacingBefore || (isHeading ? 8 : 0)) * zoom}px`,
            marginBottom: `${(node.spacingAfter ?? (isHeading ? 6 : 4)) * zoom}px`,
            backgroundColor: node.backgroundColor,
            padding: node.padding ? `${node.padding * zoom}px` : undefined,
            borderRadius: node.borderRadius ? `${node.borderRadius}px` : undefined,
          }}
        >
          {node.children.map((run, rIdx) => {
            const size = (run.fontSize || (isHeading ? 16 : 10)) * zoom * 1.33;
            return (
              <span
                key={`run-${rIdx}`}
                style={{
                  fontWeight: run.bold ? 700 : 400,
                  fontStyle: run.italic ? 'italic' : 'normal',
                  textDecoration: run.underline ? 'underline' : 'none',
                  color: run.color || 'inherit',
                  fontSize: `${size}px`,
                  backgroundColor: run.backgroundColor,
                }}
              >
                {run.text}
              </span>
            );
          })}
        </div>
      );
    }

    case 'table': {
      return (
        <div className="w-full my-2 overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{
              width: `${node.widthPercentage || 100}%`,
              direction: isRtl ? 'rtl' : 'ltr',
              border: node.borderColor ? `${node.borderWidth || 1}px solid ${node.borderColor}` : undefined,
            }}
          >
            <tbody>
              {node.rows.map((row, rowIdx) => (
                <tr key={`r-${rowIdx}`}>
                  {row.cells.map((cell, cellIdx) => {
                    const borderStyles = getCellBorderCSS(cell.borders);
                    return (
                      <td
                        key={`c-${cellIdx}`}
                        style={{
                          width: cell.widthPercentage ? `${cell.widthPercentage}%` : undefined,
                          backgroundColor: cell.backgroundColor || (row.isHeader ? '#f8fafc' : undefined),
                          verticalAlign: cell.verticalAlignment || 'top',
                          padding: `${(cell.paddingMm || 2.5) * 3.78 * zoom * 0.7}px`,
                          ...borderStyles,
                        }}
                      >
                        {cell.children.map((child, chIdx) => (
                          <RenderNode key={`cell-ch-${chIdx}`} node={child} isRtl={isRtl} zoom={zoom} />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'callout': {
      return (
        <div
          className="rounded-lg p-3 my-3"
          style={{
            backgroundColor: node.backgroundColor || '#f8fafc',
            border: `1px solid ${node.borderColor || '#cbd5e1'}`,
            borderRight: isRtl ? `4px solid ${node.textColor || '#065f46'}` : undefined,
            borderLeft: !isRtl ? `4px solid ${node.textColor || '#065f46'}` : undefined,
          }}
        >
          {node.title && (
            <h4
              className="font-bold text-sm mb-1.5"
              style={{ color: node.textColor || '#065f46' }}
            >
              {node.title}
            </h4>
          )}
          <div className="space-y-1">
            {node.children.map((child, chIdx) => (
              <RenderNode key={`callout-ch-${chIdx}`} node={child} isRtl={isRtl} zoom={zoom} />
            ))}
          </div>
        </div>
      );
    }

    case 'spacer': {
      return <div style={{ height: `${node.heightMm * 3.78 * zoom}px` }} />;
    }

    case 'horizontalRule': {
      return (
        <hr
          style={{
            border: 'none',
            borderTop: `${(node.thicknessPt || 1) * zoom}px solid ${node.color || '#065f46'}`,
            marginTop: `${(node.spacingBeforePt || 4) * zoom}px`,
            marginBottom: `${(node.spacingAfterPt || 6) * zoom}px`,
          }}
        />
      );
    }

    case 'image': {
      return (
        <div
          className="my-2 flex"
          style={{
            justifyContent:
              node.alignment === 'center' ? 'center' : node.alignment === 'left' ? 'flex-start' : 'flex-end',
          }}
        >
          <img
            src={node.src}
            alt={node.alt || 'صورة'}
            style={{
              width: node.widthMm ? `${node.widthMm * 3.78 * zoom}px` : 'auto',
              maxHeight: node.heightMm ? `${node.heightMm * 3.78 * zoom}px` : '200px',
              objectFit: 'contain',
            }}
          />
        </div>
      );
    }

    default:
      return null;
  }
};
