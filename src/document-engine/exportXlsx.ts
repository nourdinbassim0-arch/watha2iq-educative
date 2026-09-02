import * as XLSX from 'xlsx';
import { StructuredDocument } from './types';

/**
 * Extracts tables and structured data from StructuredDocument and exports to a native Excel spreadsheet (.xlsx)
 */
export async function exportStructuredDocumentToXlsx(
  doc: StructuredDocument,
  onProgress?: (pct: number, message: string) => void
): Promise<Blob> {
  onProgress?.(20, 'جاري استخراج الجداول والبيانات إلى مصنف Excel...');

  const wb = XLSX.utils.book_new();

  // 1. Build Document Summary Sheet
  const summaryRows: any[][] = [
    ['المملكة المغربية - وزارة التربية الوطنية والتعليم الأولي والرياضة'],
    ['الأكاديمية الجهوية للتربية والتكوين', doc.metadata?.academy || ''],
    ['المديرية الإقليمية', doc.metadata?.directorate || ''],
    ['المؤسسة التعليمية', doc.metadata?.school || ''],
    ['الأستاذ(ة)', doc.metadata?.author || ''],
    ['المادة', doc.metadata?.subject || ''],
    ['المستوى الدراسي', doc.metadata?.grade || ''],
    ['السنة الدراسية', doc.metadata?.academicYear || ''],
    ['عنوان الوثيقة', doc.title || ''],
    [],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  // Enable RTL for Arabic view
  (wsSummary as any)['!views'] = [{ RTL: true }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'بيانات الوثيقة');

  onProgress?.(50, 'جاري إنشاء أوراق عمل الجداول وقوائم التنقيط...');

  // 2. Extract each TableNode to its own sheet
  let tableIndex = 1;
  for (const section of doc.sections) {
    for (const node of section.nodes) {
      if (node.type === 'table') {
        const tableData: any[][] = [];

        for (const row of node.rows) {
          const rowData: string[] = [];
          for (const cell of row.cells) {
            // Combine all text runs in cell
            const cellText = cell.children
              .map((c) => {
                if (c.type === 'paragraph' || c.type === 'heading') {
                  return c.children.map((t) => t.text).join(' ');
                }
                return '';
              })
              .filter(Boolean)
              .join(' | ');

            rowData.push(cellText);
          }
          tableData.push(rowData);
        }

        if (tableData.length > 0) {
          const wsTable = XLSX.utils.aoa_to_sheet(tableData);
          (wsTable as any)['!views'] = [{ RTL: true }];

          // Calculate auto column widths
          const maxCols = Math.max(...tableData.map((r) => r.length));
          const colsInfo: { wch: number }[] = [];
          for (let c = 0; c < maxCols; c++) {
            let maxLen = 12;
            for (const r of tableData) {
              const val = r[c] ? String(r[c]) : '';
              maxLen = Math.max(maxLen, Math.min(60, val.length + 3));
            }
            colsInfo.push({ wch: maxLen });
          }
          wsTable['!cols'] = colsInfo;

          const sheetName = `جدول ${tableIndex++}`;
          XLSX.utils.book_append_sheet(wb, wsTable, sheetName);
        }
      }
    }
  }

  onProgress?.(85, 'جاري تحزيم ملف Excel (.xlsx)...');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  onProgress?.(100, 'اكتمل إنشاء ملف Excel بنجاح!');
  return blob;
}
