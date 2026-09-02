import React from 'react';
import { DocumentData } from '../../types';
import { DocumentRenderer } from '../../document-engine';
import { TextSelectionFloatingToolbar } from './TextSelectionFloatingToolbar';

interface DocumentPreviewCanvasProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField: (field: keyof DocumentData, value: any) => void;
  zoom?: number;
}

export const DocumentPreviewCanvas: React.FC<DocumentPreviewCanvasProps> = ({
  documentData,
  isEditable = true,
  onUpdateField,
  zoom = 1.0,
}) => {
  return (
    <div className="flex justify-center p-3 sm:p-6 overflow-x-auto bg-slate-200/70 min-h-[85vh] relative">
      {/* Floating Rich Text Selection Formatting Toolbar */}
      <TextSelectionFloatingToolbar containerId="document-render-canvas" />

      {/* Zoom transform container */}
      <div 
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150"
      >
        <DocumentRenderer
          documentData={documentData}
          isEditable={isEditable}
          onUpdateField={onUpdateField}
        />
      </div>
    </div>
  );
};
