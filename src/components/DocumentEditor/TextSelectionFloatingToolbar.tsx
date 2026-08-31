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
    { label: 'صغير جداً (9pt)', size: '11px' },
    { label: 'صغير (10pt)', size: '13px' },
    { label: 'عادي (12pt)', size: '15px' },
    { label: 'متوسط (14pt)', size: '18px' },
    { label: 'كبير (16pt)', size: '21px' },
    { label: 'كبير جداً (18pt)', size: '24px' },
    { label: 'عنوان بارز (24pt)', size: '30px' },
    { label: 'عنوان رئيسي (30pt)', size: '38px' },
  ];

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setPosition(null);
        setSelectedText('');
        if (onSelectionChangeState) onSelectionChangeState(false);
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
      // Check if selection is within the canvas
      if (!container.contains(range.commonAncestorContainer)) {
        setPosition(null);
        setSelectedText('');
        if (onSelectionChangeState) onSelectionChangeState(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setPosition(null);
        return;
      }

      // Calculate position directly above selection
      const top = Math.max(10, rect.top + window.scrollY - 52);
      const left = Math.max(10, rect.left + window.scrollX + rect.width / 2);

      setPosition({ top, left });
      setSelectedText(text);
      if (onSelectionChangeState) onSelectionChangeState(true);
    };

    document.addEventListener('selectionchange', handleSelection);
    window.addEventListener('scroll', handleSelection, true);
    window.addEventListener('resize', handleSelection);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      window.removeEventListener('scroll', handleSelection, true);
      window.removeEventListener('resize', handleSelection);
    };
  }, [containerId, onSelectionChangeState]);

  // Apply rich styling to selected text
  const applyCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Keep focus
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowSizePicker(false);
  };

  // Wrap selected range with custom font size span
  const applyFontSize = (fontSizePx: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    const span = document.createElement('span');
    span.style.fontSize = fontSizePx;
    span.style.lineHeight = '1.3';
    span.appendChild(selectedContent);
    range.insertNode(span);
    
    // Reselect node
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    setShowSizePicker(false);
  };

  // Adjust font size increment/decrement on selected text
  const adjustSelectedFontSize = (deltaPx: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let parentElem = range.commonAncestorContainer as HTMLElement;
    if (parentElem.nodeType === Node.TEXT_NODE) {
      parentElem = parentElem.parentElement as HTMLElement;
    }

    // Determine current computed font size
    const computedSize = window.getComputedStyle(parentElem).fontSize;
    const currentPx = parseFloat(computedSize) || 14;
    const newPx = Math.max(8, Math.min(60, currentPx + deltaPx));

    applyFontSize(`${newPx}px`);
  };

  const applyTextColor = (colorHex: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    const span = document.createElement('span');
    span.style.color = colorHex;
    span.appendChild(selectedContent);
    range.insertNode(span);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    setShowColorPicker(false);
  };

  const applyHighlight = (bgHex: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    const span = document.createElement('span');
    span.style.backgroundColor = bgHex;
    span.style.padding = bgHex === 'transparent' ? '0' : '0.1em 0.25em';
    span.style.borderRadius = '3px';
    span.appendChild(selectedContent);
    range.insertNode(span);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    setShowHighlightPicker(false);
  };

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      id="floating-text-selection-toolbar"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
      className="bg-[#1e293b] text-white rounded-2xl shadow-2xl px-2 py-1.5 flex items-center gap-1 border border-slate-700 animate-in fade-in zoom-in-95 duration-100 select-none text-xs"
      onMouseDown={(e) => {
        // Prevent losing selection focus when clicking toolbar buttons
        e.preventDefault();
      }}
    >
      
      {/* Font Size Decrement (A-) */}
      <button
        onClick={() => adjustSelectedFontSize(-2)}
        title="تصغير حجم النص المحدد (A-)"
        className="px-2 py-1 hover:bg-slate-700 rounded-lg font-bold text-xs flex items-center gap-0.5 text-amber-300 transition-colors"
      >
        <span>A-</span>
      </button>

      {/* Font Size Preset Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setShowSizePicker(!showSizePicker);
            setShowColorPicker(false);
            setShowHighlightPicker(false);
          }}
          title="اختيار حجم محدد للنص المحدد"
          className="px-2 py-1 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 bg-slate-800 text-slate-200 border border-slate-700"
        >
          <Type className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">حجم الخط</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showSizePicker && (
          <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl w-44 z-50 space-y-0.5 max-h-56 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-400 px-2 py-1 border-b border-slate-800">
              تغيير حجم النص المحدد:
            </div>
            {fontSizes.map((f) => (
              <button
                key={f.size}
                onClick={() => applyFontSize(f.size)}
                className="w-full text-right px-2 py-1.5 rounded-lg text-xs hover:bg-emerald-800 hover:text-white text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>{f.label}</span>
                <span className="font-mono text-[10px] text-slate-400">{f.size}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Increment (A+) */}
      <button
        onClick={() => adjustSelectedFontSize(2)}
        title="تكبير حجم النص المحدد (A+)"
        className="px-2 py-1 hover:bg-slate-700 rounded-lg font-bold text-xs flex items-center gap-0.5 text-emerald-400 transition-colors"
      >
        <span>A+</span>
      </button>

      <div className="h-4 w-px bg-slate-700 mx-0.5"></div>

      {/* Bold */}
      <button
        onClick={() => applyCommand('bold')}
        title="عريض (Ctrl+B)"
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => applyCommand('italic')}
        title="مائل (Ctrl+I)"
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        onClick={() => applyCommand('underline')}
        title="تسطير (Ctrl+U)"
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-700 mx-0.5"></div>

      {/* Text Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowHighlightPicker(false);
            setShowSizePicker(false);
          }}
          title="تغيير لون النص المحدد"
          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors flex items-center gap-1"
        >
          <Palette className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-40 z-50">
            <div className="text-[10px] font-bold text-slate-400 mb-1.5 text-center">لون الخط:</div>
            <div className="grid grid-cols-3 gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => applyTextColor(c.hex)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className="w-7 h-7 rounded-lg border border-slate-600 hover:scale-110 transition-transform shadow-xs"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Highlight Background Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowColorPicker(false);
            setShowSizePicker(false);
          }}
          title="تمييز لون خلفية النص المحدد"
          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-colors"
        >
          <Highlighter className="w-3.5 h-3.5 text-yellow-400" />
        </button>

        {showHighlightPicker && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-44 z-50">
            <div className="text-[10px] font-bold text-slate-400 mb-1.5 text-center">تمييز خلفية النص:</div>
            <div className="grid grid-cols-3 gap-1.5">
              {highlights.map((h) => (
                <button
                  key={h.hex}
                  onClick={() => applyHighlight(h.hex)}
                  title={h.name}
                  style={{ backgroundColor: h.hex === 'transparent' ? '#334155' : h.hex }}
                  className="w-8 h-7 rounded-lg border border-slate-600 hover:scale-110 transition-transform text-[9px] font-bold text-slate-900 flex items-center justify-center shadow-xs"
                >
                  {h.hex === 'transparent' && <span className="text-white">×</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remove Formatting */}
      <button
        onClick={() => applyCommand('removeFormat')}
        title="إزالة التنسيق المخصص"
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
      >
        <RemoveFormatting className="w-3.5 h-3.5" />
      </button>

    </div>
  );
};
