import React from 'react';
import { DocumentDecorations, DecorationTemplate, BorderType, DecorationIntensity } from './DocumentDecorations';
import { DocumentHeader } from './DocumentHeader';
import { DocumentFooter } from './DocumentFooter';
import { DocumentData } from '../../types';
import { getFontFamilyCSS } from '../fonts';

export interface DocumentPageProps {
  pageNumber?: number;
  totalPages?: number;
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof DocumentData, value: any) => void;
  orientation?: 'portrait' | 'landscape';
  marginSize?: 'tight' | 'normal' | 'generous' | 'custom';
  customMarginMm?: number;
  fontFamily?: string;
  fontSizePt?: number;
  lineHeight?: number;
  decorationTemplate?: DecorationTemplate;
  borderType?: BorderType;
  borderColor?: string;
  borderWidth?: number;
  decorationIntensity?: DecorationIntensity;
  children?: React.ReactNode;
  className?: string;
}

export const DocumentPage: React.FC<DocumentPageProps> = ({
  pageNumber = 1,
  totalPages = 1,
  documentData,
  isEditable = false,
  onUpdateField,
  orientation = 'portrait',
  marginSize = 'normal',
  customMarginMm,
  fontFamily = 'cairo',
  fontSizePt = 11,
  lineHeight = 1.6,
  decorationTemplate = 'classic',
  borderType = 'full',
  borderColor = '#065f46',
  borderWidth = 1.5,
  decorationIntensity = 'medium',
  children,
  className = '',
}) => {
  const isLandscape = orientation === 'landscape' || (documentData.pageFormat && documentData.pageFormat.includes('landscape'));

  // Margin calculation in mm
  let marginMm = 15;
  if (marginSize === 'tight') marginMm = 10;
  if (marginSize === 'generous') marginMm = 22;
  if (marginSize === 'custom' && customMarginMm) marginMm = customMarginMm;

  const fontCss = getFontFamilyCSS(fontFamily || documentData.fontFamily);

  return (
    <div
      data-document-page={pageNumber}
      className={`relative bg-white text-slate-900 mx-auto transition-all box-border doc-page-shadow border border-slate-200/80 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isLandscape ? 'w-[1122px] min-h-[793px]' : 'w-[794px] min-h-[1123px]'
      } ${className}`}
      style={{
        padding: `${marginMm}mm`,
        fontFamily: fontCss,
        fontSize: `${fontSizePt}pt`,
        lineHeight: lineHeight,
        color: '#1e293b',
        direction: documentData.language === 'fr' ? 'ltr' : 'rtl',
      }}
    >
      {/* 1. Page Frame & Vector Decorations */}
      <DocumentDecorations
        template={decorationTemplate}
        borderType={borderType}
        borderColor={borderColor}
        borderWidth={borderWidth}
        intensity={decorationIntensity}
      />

      {/* 2. Page Content Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-full">
        <div>
          {/* Official Moroccan Pedagogical Header */}
          <DocumentHeader
            documentData={documentData}
            isEditable={isEditable}
            onUpdateHeaderField={onUpdateField}
            showOfficialHeader={documentData.showOfficialHeader !== false}
            showSchoolLogo={documentData.showSchoolLogo !== false}
            language={documentData.language || 'ar'}
          />

          {/* Document Title Banner */}
          <div className="text-center my-3 pb-1">
            <h1 className="inline-block px-6 py-2 rounded-xl bg-emerald-900 text-white font-black text-sm sm:text-base tracking-wide shadow-2xs">
              {documentData.title || 'وثيقة تربوية'}
            </h1>
          </div>

          {/* Body Content */}
          <div className="mt-3">
            {children}
          </div>
        </div>

        {/* Official Pedagogical Footer */}
        <DocumentFooter
          documentData={documentData}
          pageNumber={pageNumber}
          totalPages={totalPages}
          showPageNumbers={documentData.showPageNumbers ?? true}
          showSignatures={documentData.showSignatures ?? true}
          showFooterInfo={documentData.showFooterInfo ?? true}
          language={documentData.language || 'ar'}
        />
      </div>
    </div>
  );
};
