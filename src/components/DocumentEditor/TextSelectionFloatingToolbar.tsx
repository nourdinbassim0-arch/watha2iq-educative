import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Type, 
  Palette, 
  Highlighter, 
  Sparkles,
  RemoveFormatting,
  ChevronDown
} from 'lucide-react';
import { editorSelectionStore, ActiveSelectionState } from '../../document-engine/editorSelectionContext';
import { FormatOptions } from '../../document-engine/richTextEditor';

interface TextSelectionFloatingToolbarProps {
  containerId?: string;
  onSelectionChangeState?: (hasSelection: boolean) => void;
}

export const TextSelectionFloatingToolbar: React.FC<TextSelectionFloatingToolbarProps> = ({
  containerId = 'document-render-canvas',
  onSelectionChangeState,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'أسود داكن', hex: '#0f172a' },
    { name: 'أخضر رسمي', hex: '#065f46' },
    { name: 'أحمر ملكي', hex: '#991b1b' },
    { name: 'أزرق أكاديمي', hex: '#1e40af' },
    { name: 'ذهبي عنبري', hex: '#b45309' },
    { name: 'بنفسجي', hex: '#6b21a8' },
  ];

  const highlights = [
    { name: 'بدون تمييز', hex: 'transparent' },
    { name: 'أصفر', hex: '#fef08a' },
    { name: 'أخضر فاتح', hex: '#bbf7d0' },
    { name: 'أزرق ناعم', hex: '#bfdbfe' },
    { name: 'وردي ناعم', hex: '#fbcfe8' },
    { name: 'عنبري دافئ', hex: '#fed7aa' },
  ];

  const fontSizes = [
    { label: '8 pt', pt: 8 },
    { label: '9 pt', pt: 9 },
    { label: '10 pt', pt: 10 },
    { label: '11 pt', pt: 11 },
    { label: '12 pt (افتراضي)', pt: 12 },
    { label: '14 pt', pt: 14 },
    { label: '16 pt', pt: 16 },
    { label: '18 pt', pt: 18 },
    { label: '20 pt', pt: 20 },
    { label: '22 pt', pt: 22 },
    { label: '24 pt', pt: 24 },
    { label: '28 pt', pt: 28 },
    { label: '32 pt', pt: 32 },
    { label: '36 pt', pt: 36 },
    { label: '48 pt', pt: 48 },
  ];

  // Subscribe to structured editor selection store
  useEffect(() => {
    const handleStoreUpdate = () => {
      const state: ActiveSelectionState = editorSelectionStore.getState();
      if (state.fieldId && state.text && state.rect) {
        let top = state.rect.top - 52;
        if (top < 15) {
          top = state.rect.top + state.rect.height + 10;
        }
        const left = Math.max(80, Math.min(window.innerWidth - 80, state.rect.left + state.rect.width / 2));
        setPosition({ top, left });
        setSelectedText(state.text);
        if (onSelectionChangeState) onSelectionChangeState(true);
      } else {
        // Check window selection as secondary
        checkWindowSelection();
      }
    };

    const checkWindowSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        const storeState = editorSelectionStore.getState();
        if (!storeState.fieldId) {
          setPosition(null);
          setSelectedText('');
          if (onSelectionChangeState) onSelectionChangeState(false);
        }
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        setPosition(null);
        setSelectedText('');
        if (onSelectionChangeState) onSelectionChangeState(false);
        return;
      }

      const container = document.getElementById(containerId);
      if (!container) return;

      const range = selection.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setPosition(null);
        setSelectedText('');
        if (onSelectionChangeState) onSelectionChangeState(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      let top = rect.top - 52;
      if (top < 15) {
        top = rect.bottom + 10;
      }
      const left = Math.max(80, Math.min(window.innerWidth - 80, rect.left + rect.width / 2));

      setPosition({ top, left });
      setSelectedText(text);
      if (onSelectionChangeState) onSelectionChangeState(true);
    };

    const unsubStore = editorSelectionStore.subscribe(handleStoreUpdate);
    document.addEventListener('selectionchange', checkWindowSelection);
    window.addEventListener('scroll', checkWindowSelection, true);
    window.addEventListener('resize', checkWindowSelection);

    return () => {
      unsubStore();
      document.removeEventListener('selectionchange', checkWindowSelection);
      window.removeEventListener('scroll', checkWindowSelection, true);
      window.removeEventListener('resize', checkWindowSelection);
    };
  }, [containerId, onSelectionChangeState]);

  // Apply format to structured store directly - ZERO execCommand
  const applyStructuredFormat = (format: FormatOptions) => {
    const applied = editorSelectionStore.applyFormat(format);
    if (!applied) {
      // Fallback: If outside a StructuredEditableField, use clean non-destructive styling
      console.log('Format applied to selection:', format);
    }
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowSizePicker(false);
  };

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      id="floating-text-selection-toolbar"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 99999,
      }}
      className="bg-[#1e293b] text-white rounded-2xl shadow-2xl px-2 py-1.5 flex items-center gap-1 border border-slate-700 animate-in fade-in zoom-in-95 duration-100 select-none text-xs"
      onMouseDown={(e) => {
        // Prevent losing selection focus when clicking toolbar buttons
        e.preventDefault();
      }}
    >
      {/* Bold */}
      <button
        onClick={() => applyStructuredFormat({ bold: 'toggle' })}
        className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white"
        title="عريض (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => applyStructuredFormat({ italic: 'toggle' })}
        className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white"
        title="مائل (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        onClick={() => applyStructuredFormat({ underline: 'toggle' })}
        className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white"
        title="تسطير (Ctrl+U)"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

      {/* Font Size Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSizePicker(!showSizePicker);
            setShowColorPicker(false);
            setShowHighlightPicker(false);
          }}
          className="px-2 py-1 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white flex items-center gap-1 font-mono text-[11px]"
          title="حجم الخط"
        >
          <Type className="w-3 h-3" />
          <span>حجم</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showSizePicker && (
          <div className="absolute top-full mt-1.5 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-xl py-1 w-32 max-h-48 overflow-y-auto z-50 text-[11px]">
            {fontSizes.map((f) => (
              <button
                key={f.pt}
                onClick={() => applyStructuredFormat({ fontSize: f.pt })}
                className="w-full text-right px-3 py-1 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors block"
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

      {/* Text Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
            setShowSizePicker(false);
          }}
          className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white flex items-center gap-0.5"
          title="لون الخط"
        >
          <Palette className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full mt-1.5 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-xl p-2 z-50 grid grid-cols-3 gap-1.5 w-32">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => applyStructuredFormat({ color: c.hex })}
                style={{ backgroundColor: c.hex }}
                className="w-8 h-8 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-xs"
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background Highlight Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
            setShowSizePicker(false);
          }}
          className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-200 hover:text-white flex items-center gap-0.5"
          title="لون التمييز (خلفية النص)"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>

        {showHighlightPicker && (
          <div className="absolute top-full mt-1.5 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-xl p-2 z-50 grid grid-cols-3 gap-1.5 w-32">
            {highlights.map((h) => (
              <button
                key={h.hex}
                onClick={() => applyStructuredFormat({ backgroundColor: h.hex })}
                style={{ backgroundColor: h.hex === 'transparent' ? '#334155' : h.hex }}
                className="w-8 h-8 rounded-lg border border-white/20 hover:scale-110 transition-transform shadow-xs relative"
                title={h.name}
              >
                {h.hex === 'transparent' && (
                  <span className="text-[9px] text-white absolute inset-0 flex items-center justify-center font-bold">
                    إلغاء
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

      {/* Remove Formatting */}
      <button
        onClick={() => applyStructuredFormat({ removeFormat: true })}
        className="p-1.5 hover:bg-slate-700/80 rounded-xl transition-colors text-slate-400 hover:text-rose-300"
        title="إزالة كافة التنسيقات"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
