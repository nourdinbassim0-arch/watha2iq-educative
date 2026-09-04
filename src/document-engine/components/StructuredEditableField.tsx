import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextRunNode } from '../types';
import { 
  runsToPlainText, 
  plainTextToRuns, 
  applyFormattingToRuns,
  FormatOptions 
} from '../richTextEditor';
import { editorSelectionStore } from '../editorSelectionContext';

export interface StructuredEditableFieldProps {
  id?: string;
  value: string | TextRunNode[];
  onChange?: (newValue: string, runs?: TextRunNode[]) => void;
  isEditable?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  dir?: 'rtl' | 'ltr' | 'auto';
  align?: 'right' | 'center' | 'left' | 'justify';
  fontSizePt?: number;
  fontFamily?: string;
  defaultColor?: string;
  fontWeight?: 'normal' | 'bold' | 'semibold';
  minHeight?: string | number;
}

export const StructuredEditableField: React.FC<StructuredEditableFieldProps> = ({
  id,
  value,
  onChange,
  isEditable = false,
  multiline = false,
  placeholder = '',
  className = '',
  style = {},
  dir = 'auto',
  align,
  fontSizePt,
  fontFamily,
  defaultColor,
  fontWeight,
  minHeight,
}) => {
  const fieldId = useRef(id || `field-${Math.random().toString(36).substring(2, 9)}`).current;
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Normalize initial runs
  const currentRuns: TextRunNode[] = Array.isArray(value)
    ? value
    : plainTextToRuns(value || '', {
        fontSize: fontSizePt,
        fontFamily,
        color: defaultColor,
        bold: fontWeight === 'bold',
      });

  const plainText = typeof value === 'string' ? value : runsToPlainText(currentRuns);

  // Auto-resize textarea to fit content without clipping
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, typeof minHeight === 'number' ? minHeight : 24)}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    if (isEditable && multiline) {
      adjustHeight();
    }
  }, [plainText, isEditable, multiline, adjustHeight]);

  // Handle selection inside textarea or editable container
  const handleSelection = useCallback(() => {
    if (!isEditable) return;

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;

      if (start !== end) {
        const text = plainText.substring(start, end);
        const rect = textareaRef.current.getBoundingClientRect();
        editorSelectionStore.setSelection(
          fieldId,
          text,
          currentRuns,
          start,
          end,
          {
            top: rect.top,
            left: rect.left + 20,
            width: rect.width,
            height: rect.height,
          },
          (newRuns) => {
            const newText = runsToPlainText(newRuns);
            if (onChange) {
              onChange(newText, newRuns);
            }
          }
        );
        return;
      }
    }

    // If collapsed or no selection
    const active = editorSelectionStore.getState();
    if (active.fieldId === fieldId) {
      editorSelectionStore.clearSelection();
    }
  }, [isEditable, fieldId, plainText, currentRuns, onChange]);

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && ['b', 'i', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      const format: FormatOptions = {};
      if (e.key.toLowerCase() === 'b') format.bold = 'toggle';
      if (e.key.toLowerCase() === 'i') format.italic = 'toggle';
      if (e.key.toLowerCase() === 'u') format.underline = 'toggle';

      const applied = editorSelectionStore.applyFormat(format);
      if (!applied && textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        if (start < end) {
          const updated = applyFormattingToRuns(currentRuns, start, end, format);
          if (onChange) {
            onChange(runsToPlainText(updated), updated);
          }
        }
      }
    }
  };

  const handleTextChange = (newText: string) => {
    if (!onChange) return;
    // Update runs while keeping existing formatting
    const updatedRuns = plainTextToRuns(newText, {
      fontSize: fontSizePt,
      fontFamily,
      color: defaultColor,
      bold: fontWeight === 'bold',
    });
    onChange(newText, updatedRuns);
  };

  // Render Display Mode / Print Mode (Zero chrome, zero clipping, vector text)
  if (!isEditable) {
    if (currentRuns.length > 0) {
      return (
        <span
          ref={containerRef}
          id={id}
          dir={dir}
          style={{
            textAlign: align,
            fontSize: fontSizePt ? `${fontSizePt}pt` : undefined,
            fontFamily,
            color: defaultColor,
            fontWeight,
            ...style,
          }}
          className={`inline-block ${className}`}
        >
          {currentRuns.map((run, i) => (
            <span
              key={i}
              style={{
                fontWeight: run.bold ? 'bold' : undefined,
                fontStyle: run.italic ? 'italic' : undefined,
                textDecoration: run.underline ? 'underline' : undefined,
                color: run.color,
                backgroundColor: run.backgroundColor && run.backgroundColor !== 'transparent' ? run.backgroundColor : undefined,
                fontSize: run.fontSize ? `${run.fontSize}pt` : undefined,
                fontFamily: run.fontFamily,
                padding: run.backgroundColor && run.backgroundColor !== 'transparent' ? '0.05em 0.2em' : undefined,
                borderRadius: run.backgroundColor && run.backgroundColor !== 'transparent' ? '2px' : undefined,
              }}
            >
              {run.text}
            </span>
          ))}
        </span>
      );
    }

    return (
      <span
        ref={containerRef}
        id={id}
        dir={dir}
        style={{
          textAlign: align,
          fontSize: fontSizePt ? `${fontSizePt}pt` : undefined,
          fontFamily,
          color: defaultColor,
          fontWeight,
          ...style,
        }}
        className={className}
      >
        {plainText || placeholder}
      </span>
    );
  }

  // Editable Mode: auto-growing textarea or clean single-line input
  if (multiline) {
    return (
      <div className="relative w-full group">
        <textarea
          ref={textareaRef}
          id={id}
          dir={dir}
          value={plainText}
          placeholder={placeholder}
          onChange={(e) => handleTextChange(e.target.value)}
          onSelect={handleSelection}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          onKeyDown={handleKeyDown}
          style={{
            textAlign: align,
            fontSize: fontSizePt ? `${fontSizePt}pt` : undefined,
            fontFamily,
            color: defaultColor,
            fontWeight,
            minHeight: minHeight || '2rem',
            lineHeight: '1.6',
            resize: 'none',
            overflow: 'hidden',
            ...style,
          }}
          className={`w-full bg-transparent border-b border-dashed border-slate-300 hover:border-emerald-400 focus:border-emerald-600 focus:outline-hidden transition-colors py-0.5 px-1 leading-relaxed rounded-xs ${className}`}
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      id={id}
      dir={dir}
      value={plainText}
      placeholder={placeholder}
      onChange={(e) => handleTextChange(e.target.value)}
      onSelect={handleSelection}
      onMouseUp={handleSelection}
      onKeyUp={handleSelection}
      onKeyDown={handleKeyDown}
      style={{
        textAlign: align,
        fontSize: fontSizePt ? `${fontSizePt}pt` : undefined,
        fontFamily,
        color: defaultColor,
        fontWeight,
        ...style,
      }}
      className={`bg-transparent border-b border-dashed border-slate-300 hover:border-emerald-400 focus:border-emerald-600 focus:outline-hidden transition-colors py-0.5 px-1 rounded-xs ${className}`}
    />
  );
};
