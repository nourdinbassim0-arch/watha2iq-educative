import React from 'react';
import { DocumentData } from '../../types';
import { getDefaultFooterConfig, getDefaultSignaturesConfig } from '../../utils/documentDefaults';

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
  showPageNumbers: propShowPageNumbers,
  showSignatures: propShowSignatures,
  showFooterInfo: propShowFooterInfo,
  language = 'ar',
}) => {
  const isRtl = language === 'ar';
  const isFr = language === 'fr';

  const footerConfig = documentData.footerConfig || getDefaultFooterConfig(documentData);
  const signaturesConfig = documentData.signaturesConfig || getDefaultSignaturesConfig(documentData);

  // Master switch for signatures: must be explicitly true in signaturesConfig if present
  const isSignaturesActive =
    propShowSignatures !== false &&
    signaturesConfig.showSignatures !== false &&
    (documentData.showTeacherSignature ||
      documentData.showInspectorSignature ||
      signaturesConfig.items.some((i) => i.show));

  const isFooterActive =
    propShowFooterInfo !== false &&
    footerConfig.showFooter !== false &&
    documentData.showFooterInfo !== false;

  const showPageNumbers =
    propShowPageNumbers ??
    footerConfig.showPageNumbers ??
    documentData.showPageNumbers ??
    true;

  // If both signatures and footer are disabled, return null cleanly
  if (!isSignaturesActive && !isFooterActive) {
    return null;
  }

  // Active signature items
  const activeSignatures = signaturesConfig.items.filter((item) => item.show !== false);

  // Layout grid classes based on layout preset
  const getLayoutGridClass = () => {
    switch (signaturesConfig.layout) {
      case 'one_center':
        return 'grid grid-cols-1 max-w-xs mx-auto gap-4';
      case 'three_columns':
        return 'grid grid-cols-3 gap-4';
      case 'four_columns':
        return 'grid grid-cols-2 sm:grid-cols-4 gap-3';
      case 'two_columns':
      default:
        return 'grid grid-cols-2 gap-6';
    }
  };

  return (
    <footer
      id="document-official-footer"
      className="w-full mt-6 pt-3 select-none text-[10px] text-slate-600"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ---------------- 1. SIGNATURES SYSTEM ---------------- */}
      {isSignaturesActive && activeSignatures.length > 0 && (
        <div className="pb-4 mb-3 border-b border-dashed border-slate-300">
          <div className={getLayoutGridClass()}>
            {activeSignatures.map((sig) => (
              <div
                key={sig.id}
                className="flex flex-col items-center justify-between p-2.5 rounded-xl border border-slate-300/80 bg-slate-50/50 shadow-2xs text-center"
              >
                {/* Title */}
                <div className="font-bold text-slate-800 text-[10.5px] leading-tight mb-1">
                  {sig.title}
                </div>

                {/* Name / Role if provided */}
                {sig.name && (
                  <div className="text-[9.5px] font-semibold text-emerald-900 leading-tight">
                    {sig.name}
                  </div>
                )}
                {sig.role && (
                  <div className="text-[8.5px] text-slate-500 leading-tight">
                    {sig.role}
                  </div>
                )}

                {/* Stamp & Signature Space */}
                <div className="w-full mt-3 pt-4 border-b border-dotted border-slate-400 flex items-center justify-center text-[8.5px] text-slate-400">
                  <span className="opacity-60">{isRtl ? 'التوقيع والخاتم' : 'Signature & Cachet'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 2. DOCUMENT FOOTER LINE ---------------- */}
      {isFooterActive && (
        <div>
          {/* Subtle Decorative Footer Bar */}
          {footerConfig.showDecoration && (
            <div className="mb-2 flex items-center justify-center gap-2 opacity-50">
              <span className="h-px bg-slate-300 flex-1" />
              <span className="text-slate-400 text-[9px]">❖</span>
              <span className="h-px bg-slate-300 flex-1" />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-slate-500 text-[9.5px]">
            {/* Left/Right Branding & Document Meta */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-emerald-900">
                {footerConfig.customText || '«منصة وثائقي التربوية»'}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">{documentData.title}</span>
              {footerConfig.showAcademicYear && documentData.academicYear && (
                <>
                  <span>•</span>
                  <span>{documentData.academicYear}</span>
                </>
              )}
            </div>

            {/* Page Number Pill */}
            {showPageNumbers && (
              <div className="font-semibold text-slate-700 bg-slate-100 px-3 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                {isFr
                  ? `Page ${pageNumber} sur ${totalPages}`
                  : `الصفحة ${pageNumber} من ${totalPages}`}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
