import React from 'react';
import { DocumentData } from '../../types';

export interface DocumentFooterProps {
  documentData: DocumentData;
  pageNumber?: number;
  totalPages?: number;
  showPageNumbers?: boolean;
  showSignatures?: boolean;
  showFooterInfo?: boolean;
  language?: 'ar' | 'fr' | 'en';
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  documentData,
  pageNumber = 1,
  totalPages = 1,
  showPageNumbers = true,
  showSignatures = true,
  showFooterInfo = true,
  language = 'ar',
}) => {
  const isRtl = language === 'ar';
  const isFr = language === 'fr';

  return (
    <footer className="w-full mt-6 pt-3 border-t border-slate-300/80 text-[10px] text-slate-500 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Signatures Block (when enabled) */}
      {showSignatures && (documentData.showTeacherSignature || documentData.showInspectorSignature) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 mb-3 border-b border-dashed border-slate-200 text-center">
          {documentData.showTeacherSignature && (
            <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="font-bold text-slate-800 text-[10px]">
                {isFr ? 'Signature de l\'enseignant(e)' : 'توقيع الأستاذ(ة)'}
              </div>
              <div className="h-8 flex items-end justify-center text-[9px] text-slate-400">
                ....................................
              </div>
            </div>
          )}

          {documentData.showInspectorSignature && (
            <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="font-bold text-slate-800 text-[10px]">
                {isFr ? 'Visa de l\'Inspecteur(trice)' : 'تأشيرة السيد(ة) المفتش(ة)'}
              </div>
              <div className="h-8 flex items-end justify-center text-[9px] text-slate-400">
                ....................................
              </div>
            </div>
          )}

          <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50 hidden sm:block">
            <div className="font-bold text-slate-800 text-[10px]">
              {isFr ? 'Cachet de l\'Établissement' : 'خاتم إدارة المؤسسة'}
            </div>
            <div className="h-8 flex items-end justify-center text-[9px] text-slate-400">
              ....................................
            </div>
          </div>
        </div>
      )}

      {/* Footer Info Line */}
      {showFooterInfo && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-950">«منصة وثائقي التربوية»</span>
            <span>•</span>
            <span>{documentData.title}</span>
            <span>•</span>
            <span>{documentData.academicYear || '2026-2027'}</span>
          </div>

          {showPageNumbers && (
            <div className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {isFr
                ? `Page ${pageNumber} sur ${totalPages}`
                : `الصفحة ${pageNumber} من ${totalPages}`}
            </div>
          )}
        </div>
      )}
    </footer>
  );
};
