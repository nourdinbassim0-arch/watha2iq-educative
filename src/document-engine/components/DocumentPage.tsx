import React from 'react';
import { DocumentDecorations } from './DocumentDecorations';
import { DocumentHeader } from './DocumentHeader';
import { DocumentFooter } from './DocumentFooter';
import { DocumentData } from '../../types';
import { getFontFamilyCSS } from '../fonts';
import {
  getDefaultMarginConfig,
  getDefaultBorderConfig,
  getDefaultDecorationConfig,
  getDefaultLogoConfig,
} from '../../utils/documentDefaults';

export interface DocumentPageProps {
  pageNumber?: number;
  totalPages?: number;
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof DocumentData, value: any) => void;
  orientation?: 'portrait' | 'landscape';
  marginSize?: 'tight' | 'normal' | 'generous' | 'academic' | 'custom';
  customMarginMm?: number;
  fontFamily?: string;
  fontSizePt?: number;
  lineHeight?: number;
  decorationTemplate?: any;
  borderType?: any;
  borderColor?: string;
  borderWidth?: number;
  decorationIntensity?: any;
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
  fontFamily = 'cairo',
  fontSizePt = 11,
  lineHeight = 1.6,
  children,
  className = '',
}) => {
  const isLandscape =
    orientation === 'landscape' ||
    (documentData.pageFormat && documentData.pageFormat.includes('landscape'));

  // 1. Resolve Margin Settings from marginConfig (Top, Bottom, Right, Left in mm)
  const marginConfig = documentData.marginConfig || getDefaultMarginConfig(documentData);
  const topMm = marginConfig.topMm ?? 14;
  const bottomMm = marginConfig.bottomMm ?? 14;
  const rightMm = marginConfig.rightMm ?? 15;
  const leftMm = marginConfig.leftMm ?? 15;

  // 2. Resolve Border and Decoration configs
  const borderConfig = documentData.borderConfig || getDefaultBorderConfig(documentData);
  const decorationConfig = documentData.decorationConfig || getDefaultDecorationConfig(documentData);
  const logoConfig = documentData.logoConfig || getDefaultLogoConfig(documentData);

  const fontCss = getFontFamilyCSS(fontFamily || documentData.fontFamily);
  const titleSpacing = logoConfig.titleSpacingMm ?? 5;

  return (
    <div
      data-document-page={pageNumber}
      className={`relative bg-white text-slate-900 mx-auto transition-all box-border doc-page-shadow border border-slate-200/80 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isLandscape ? 'w-[1122px] min-h-[793px]' : 'w-[794px] min-h-[1123px]'
      } ${className}`}
      style={{
        // CSS padding order: top right bottom left
        padding: `${topMm}mm ${rightMm}mm ${bottomMm}mm ${leftMm}mm`,
        fontFamily: fontCss,
        fontSize: `${fontSizePt}pt`,
        lineHeight: lineHeight,
        color: '#1e293b',
        direction: documentData.language === 'fr' ? 'ltr' : 'rtl',
      }}
    >
      {/* 1. Page Frame & Vector Decorations */}
      <DocumentDecorations
        borderConfig={borderConfig}
        decorationConfig={decorationConfig}
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

          {/* Document Title Banner with balanced spacing */}
          {documentData.title && (
            <div
              style={{
                marginTop: `${titleSpacing}mm`,
                marginBottom: `${titleSpacing + 2}mm`,
              }}
              className="text-center select-none"
            >
              <h1 className="inline-block px-7 py-2 rounded-xl bg-emerald-900 text-white font-black text-sm sm:text-base tracking-wide shadow-2xs border border-emerald-950">
                {documentData.title}
              </h1>
            </div>
          )}

          {/* Body Content */}
          <div className="mt-2">
            {children}
          </div>
        </div>

        {/* Official Pedagogical Footer */}
        <DocumentFooter
          documentData={documentData}
          pageNumber={pageNumber}
          totalPages={totalPages}
          showPageNumbers={documentData.showPageNumbers ?? true}
          showSignatures={documentData.showTeacherSignature || documentData.showInspectorSignature}
          showFooterInfo={documentData.showFooterInfo ?? true}
          language={documentData.language || 'ar'}
        />
      </div>
    </div>
  );
};
