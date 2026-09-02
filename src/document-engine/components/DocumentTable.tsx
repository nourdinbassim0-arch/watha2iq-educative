import React from 'react';

export interface ColumnDefinition {
  key: string;
  header: string;
  width?: string; // e.g. '20%', '100px'
  align?: 'right' | 'center' | 'left';
}

export interface DocumentTableProps {
  columns: ColumnDefinition[];
  rows: Record<string, any>[];
  themeColor?: string;
  isEditable?: boolean;
  onUpdateCell?: (rowIndex: number, columnKey: string, value: any) => void;
  onDeleteRow?: (rowIndex: number) => void;
  onAddRow?: () => void;
  headerBgClass?: string;
  className?: string;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  columns,
  rows,
  isEditable = false,
  onUpdateCell,
  onDeleteRow,
  onAddRow,
  headerBgClass = 'bg-emerald-800 text-white',
  className = '',
}) => {
  return (
    <div className={`border border-slate-300 rounded-xl overflow-hidden shadow-2xs my-3 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className={`${headerBgClass} text-[11px] font-bold`}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`p-2.5 border border-slate-700/40 text-${col.align || 'right'}`}
                >
                  {col.header}
                </th>
              ))}
              {isEditable && onDeleteRow && (
                <th className="p-2.5 border border-slate-700/40 w-10 text-center no-print">
                  إجراء
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                {columns.map((col) => {
                  const val = row[col.key] ?? '';
                  return (
                    <td
                      key={col.key}
                      className={`p-2.5 border border-slate-200 text-slate-800 align-top text-${col.align || 'right'}`}
                    >
                      {isEditable && onUpdateCell ? (
                        <textarea
                          rows={2}
                          value={val}
                          onChange={(e) => onUpdateCell(rowIdx, col.key, e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-600 rounded-sm text-xs p-0 resize-y"
                        />
                      ) : (
                        <span>{val}</span>
                      )}
                    </td>
                  );
                })}

                {isEditable && onDeleteRow && (
                  <td className="p-2.5 border border-slate-200 text-center align-middle no-print">
                    <button
                      type="button"
                      onClick={() => onDeleteRow(rowIdx)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="حذف الصف"
                    >
                      ✕
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditable && onAddRow && (
        <div className="p-2 bg-slate-50 border-t border-slate-200 text-center no-print">
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 font-bold text-xs transition-colors"
          >
            <span>+ إضافة صف جديد</span>
          </button>
        </div>
      )}
    </div>
  );
};
