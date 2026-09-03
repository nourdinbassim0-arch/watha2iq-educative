import React from 'react';
import { DocumentData } from '../../types';
import { DocumentPage } from './DocumentPage';
import { DocumentContent } from './DocumentContent';
import { DecorationTemplate, BorderType, DecorationIntensity } from './DocumentDecorations';

export interface DocumentRendererProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof DocumentData, value: any) => void;
  containerId?: string;
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
  className?: string;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  documentData,
  isEditable = false,
  onUpdateField,
  containerId = 'document-render-canvas',
  orientation,
  marginSize,
  customMarginMm,
  fontFamily,
  fontSizePt,
  lineHeight,
  decorationTemplate = 'classic',
  borderType = 'full',
  borderColor = '#065f46',
  borderWidth = 1.5,
  decorationIntensity = 'medium',
  className = '',
}) => {
  // Determine layout settings from props or documentData
  const activeOrientation = orientation || (documentData.pageFormat?.includes('landscape') ? 'landscape' : 'portrait');
  const activeMargin = marginSize || documentData.marginSize || 'normal';
  const activeFont = fontFamily || documentData.fontFamily || 'cairo';
  const activeFontSize = fontSizePt || documentData.fontSize || 11;

  return (
    <div
      id={containerId}
      className={`printable-document-container print-document document-content flex flex-col items-center justify-center gap-8 ${className}`}
    >
      {/* Page 1 (Primary High-Fidelity Page) */}
      <DocumentPage
        pageNumber={1}
        totalPages={1}
        documentData={documentData}
        isEditable={isEditable}
        onUpdateField={onUpdateField}
        orientation={activeOrientation}
        marginSize={activeMargin}
        customMarginMm={customMarginMm}
        fontFamily={activeFont}
        fontSizePt={activeFontSize}
        lineHeight={lineHeight || 1.6}
        decorationTemplate={decorationTemplate}
        borderType={borderType}
        borderColor={borderColor}
        borderWidth={borderWidth}
        decorationIntensity={decorationIntensity}
      >
        <DocumentContent
          documentData={documentData}
          isEditable={isEditable}
          onUpdateField={onUpdateField}
          language={documentData.language || 'ar'}
        />
      </DocumentPage>
    </div>
  );
};
