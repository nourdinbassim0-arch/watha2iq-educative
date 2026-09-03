import React from 'react';
import { 
  Download, 
  Printer, 
  Save, 
  Sparkles, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Minimize2,
  Type,
  Shield,
  Building2,
  Bold,
  Italic,
  Underline,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  Plus,
  Palette,
  Layers,
  FileSpreadsheet,
  Undo2,
  Redo2,
  PenTool,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';
import { DocumentData, PageFormat, ThemeColor, FontFamily, TemplateDesignStyle } from '../../types';
import { calculateFitWidthZoom, calculateFitPageZoom } from '../../utils/pageDimensions';

interface EditorToolbarProps {
  documentData: DocumentData;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenExportModal: () => void;
  onPrint: () => void;
  onSave: () => void;
  onOpenAiAssistant: () => void;
  onOpenCustomizer?: () => void;
  onUpdateField: (field: keyof DocumentData, value: any) => void;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  lastAutoSaved?: number | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  documentData,
  zoom,
  onZoomChange,
  onOpenExportModal,
  onPrint,
  onSave,
  onOpenAiAssistant,
  onOpenCustomizer,
  onUpdateField,
  isSaving = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  lastAutoSaved,
}) => {
  const isRtl = documentData.language === 'ar';
  const showEmblem = documentData.showOfficialEmblem ?? true;
  const showLogo = documentData.showSchoolLogo ?? false;
  const currentDesign = documentData.templateDesign || 'official';

  const themeColors: { id: ThemeColor; name: string; hex: string; bgClass: string }[] = [
    { id: 'emerald', name: 'الأخضر الزمردي الرسمي', hex: '#047857', bgClass: 'bg-[#065F46]' },
    { id: 'crimson', name: 'الأحمر المغربي الملكي', hex: '#b91c1c', bgClass: 'bg-rose-800' },
    { id: 'royal', name: 'الأزرق الأكاديمي', hex: '#1e3a8a', bgClass: 'bg-blue-900' },
    { id: 'gold', name: 'الذهبي التربوي', hex: '#b45309', bgClass: 'bg-amber-700' },
    { id: 'slate', name: 'الرمادي العصري', hex: '#334155', bgClass: 'bg-slate-800' },
  ];

  const fonts: { id: FontFamily; label: string }[] = [
    { id: 'tajawal', label: 'Tajawal (عصري متوازن)' },
    { id: 'cairo', label: 'Cairo (هندسي بارز)' },
    { id: 'amiri', label: 'Amiri (نسخي كلاسيكي)' },
    { id: 'noto_naskh', label: 'Noto Naskh Arabic' },
    { id: 'ibm_plex', label: 'IBM Plex Sans' },
    { id: 'arial', label: 'Arial' },
    { id: 'times_new_roman', label: 'Times New Roman' },
    { id: 'calibri', label: 'Calibri' },
    { id: 'traditional_arabic', label: 'Traditional Arabic' },
  ];

  const designStyles: { id: TemplateDesignStyle; label: string }[] = [
    { id: 'official', label: 'النمط الرسمي المعتمد' },
    { id: 'modern', label: 'النمط العصري المنظم' },
    { id: 'minimal', label: 'النمط الأكاديمي المبسط' },
    { id: 'cards', label: 'نمط البطاقات التفاعلية' },
    { id: 'formal_bordered', label: 'النمط المؤطر والمزخرف' },
  ];

  const handleFitWidth = () => {
    const container = document.getElementById('canvas-scroll-wrapper');
    const width = container ? container.clientWidth : window.innerWidth;
    const newZoom = calculateFitWidthZoom(width, documentData.pageFormat || 'a4_portrait');
    onZoomChange(newZoom);
  };

  const handleFitPage = () => {
    const container = document.getElementById('canvas-scroll-wrapper');
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    const newZoom = calculateFitPageZoom(width, height, documentData.pageFormat || 'a4_portrait');
    onZoomChange(newZoom);
  };

  // Adjust font scale safely between 80% and 130%
  const currentFontScale = documentData.customFontScale || 100;
  const handleScaleChange = (delta: number) => {
    const nextScale = Math.min(130, Math.max(80, currentFontScale + delta));
    onUpdateField('customFontScale', nextScale);
  };

  return (
    <div className="bg-white border-b border-[#E5E7EB] sticky top-16 z-30 shadow-xs select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* ROW 1: Major Document Actions & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100">
        
        {/* Left Actions: Export, Print, Save, AI */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Main Required Action: Download Document */}
          <button
            id="editor-btn-download"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 border border-[#044735]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isRtl ? 'تحميل وتصدير الوثيقة' : 'Télécharger / Exporter'}</span>
          </button>

          {/* Direct Print Button */}
          <button
            id="editor-btn-print"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#2D3436] font-bold text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] transition-all"
          >
            <Printer className="w-4 h-4 text-[#4B5563]" />
            <span className="hidden sm:inline">{isRtl ? 'طباعة فورية' : 'Imprimer'}</span>
          </button>

          {/* Save to Cloud/Local */}
          <button
            id="editor-btn-save"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:border-[#065F46] hover:bg-[#ECFDF5] text-[#2D3436] hover:text-[#065F46] font-bold text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#065F46]" />
            <span>{isSaving ? (isRtl ? 'جاري الحفظ...' : 'Enregistrement...') : (isRtl ? 'حفظ الوثيقة' : 'Enregistrer')}</span>
          </button>

          {/* Auto-Save Live Feedback Badge */}
          {lastAutoSaved && !isSaving && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRtl ? 'محفوظ تلقائياً' : 'Enregistré'}</span>
            </div>
          )}

          {/* Undo / Redo buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title={isRtl ? 'تراجع (Ctrl+Z)' : 'Annuler'}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title={isRtl ? 'إعادة (Ctrl+Y)' : 'Rétablir'}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-white hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Didactic Assistant */}
          <button
            id="editor-btn-ai-assist"
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-bold text-xs px-3 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="hidden md:inline">{isRtl ? 'المساعد الديداكتيكي' : 'Assistant IA'}</span>
          </button>

          {/* Design & Decorations Customizer Button */}
          {onOpenCustomizer && (
            <button
              id="editor-btn-customizer"
              onClick={onOpenCustomizer}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs px-3 py-2 rounded-xl transition-all"
              title="تخصيص الإطارات والزخارف المغربية والهيدر"
            >
              <Palette className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">{isRtl ? 'تصميم الوثيقة والزخارف' : 'Design & Décoration'}</span>
            </button>
          )}
        </div>

        {/* Right Actions: Page Format, Language, Zoom */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Page Format Dropdown */}
          <select
            value={documentData.pageFormat || 'a4_portrait'}
            onChange={(e) => onUpdateField('pageFormat', e.target.value as PageFormat)}
            className="bg-white border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#2D3436] focus:ring-2 focus:ring-[#065F46] shadow-2xs"
          >
            <option value="a4_portrait">A4 عمودي (210 × 297 مم)</option>
            <option value="a4_landscape">A4 أفقي (297 × 210 مم)</option>
            <option value="a3_portrait">A3 عمودي (297 × 420 مم)</option>
            <option value="a3_landscape">A3 أفقي (420 × 297 مم)</option>
            <option value="letter_portrait">Letter عمودي</option>
            <option value="letter_landscape">Letter أفقي</option>
          </select>

          {/* Language Switch */}
          <div className="flex items-center bg-[#F3F4F6] p-0.5 rounded-xl border border-[#E5E7EB]">
            {(['ar', 'fr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onUpdateField('language', lang)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  documentData.language === lang
                    ? 'bg-[#065F46] text-white shadow-2xs'
                    : 'text-[#4B5563] hover:text-[#1F2937]'
                }`}
              >
                {lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>

          {/* Zoom Controls Bar */}
          <div className="flex items-center gap-0.5 bg-[#F3F4F6] p-0.5 rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => onZoomChange(Math.max(0.4, Number((zoom - 0.1).toFixed(2))))}
              className="p-1 rounded-md text-[#4B5563] hover:text-[#1F2937] hover:bg-white"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onZoomChange(1.0)}
              className="text-[11px] font-mono font-bold text-[#2D3436] px-1.5 hover:bg-white rounded-md"
              title="إعادة ضبط الحجم (100%)"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              onClick={() => onZoomChange(Math.min(1.4, Number((zoom + 0.1).toFixed(2))))}
              className="p-1 rounded-md text-[#4B5563] hover:text-[#1F2937] hover:bg-white"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFitWidth}
              className="p-1 rounded-md text-[#4B5563] hover:text-[#065F46] hover:bg-white text-[10px] font-bold"
              title="ملاءمة العرض"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFitPage}
              className="p-1 rounded-md text-[#4B5563] hover:text-[#065F46] hover:bg-white text-[10px] font-bold"
              title="ملاءمة الصفحة"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ROW 2: Rich Word-Style Formatting & Section Tools Ribbon */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50/70">
        
        {/* Formatting Tools: Fonts, Sizes, Weights, Alignments */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Template Design Style Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
            <LayoutGrid className="w-3.5 h-3.5 text-[#065F46]" />
            <select
              value={currentDesign}
              onChange={(e) => onUpdateField('templateDesign', e.target.value as TemplateDesignStyle)}
              className="bg-transparent text-[11px] font-bold text-slate-800 outline-hidden cursor-pointer"
              title="نمط تصميم الوثيقة"
            >
              {designStyles.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Font Family Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl px-2 py-1 shadow-2xs">
            <Type className="w-3.5 h-3.5 text-[#4B5563]" />
            <select
              value={documentData.fontFamily || 'tajawal'}
              onChange={(e) => onUpdateField('fontFamily', e.target.value as FontFamily)}
              className="bg-transparent text-[11px] font-semibold text-[#2D3436] outline-hidden cursor-pointer max-w-[140px]"
            >
              {fonts.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Font Size & Dynamic Scaling */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-1.5 py-0.5 shadow-2xs">
            <button
              onClick={() => handleScaleChange(-5)}
              title="تصغير حجم خطوط الوثيقة لمنع تجاوز الصفحة"
              className="px-1.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
            >
              A-
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-700 px-1 border-x border-slate-200">
              {currentFontScale}%
            </span>
            <button
              onClick={() => handleScaleChange(5)}
              title="تكبير حجم خطوط الوثيقة"
              className="px-1.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md"
            >
              A+
            </button>
          </div>

          {/* Line Spacing Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500">التباعد:</span>
            <select
              value={documentData.lineSpacing || '1.15'}
              onChange={(e) => onUpdateField('lineSpacing', e.target.value)}
              className="bg-transparent text-[11px] font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="1.0">1.0 (مضغوط)</option>
              <option value="1.15">1.15 (عادي)</option>
              <option value="1.25">1.25 (مريح)</option>
              <option value="1.5">1.5 (متباعد)</option>
              <option value="2.0">2.0 (مزدوج)</option>
            </select>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => onUpdateField('textAlign', 'right')}
              title="محاذاة لليمين"
              className={`p-1 rounded-md transition-colors ${
                (documentData.textAlign || 'right') === 'right' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onUpdateField('textAlign', 'center')}
              title="محاذاة للوسط"
              className={`p-1 rounded-md transition-colors ${
                documentData.textAlign === 'center' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onUpdateField('textAlign', 'left')}
              title="محاذاة لليسار"
              className={`p-1 rounded-md transition-colors ${
                documentData.textAlign === 'left' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onUpdateField('textAlign', 'justify')}
              title="ضبط المحاذاة (Justify)"
              className={`p-1 rounded-md transition-colors ${
                documentData.textAlign === 'justify' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Theme Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 hidden sm:inline px-1">اللون:</span>
            {themeColors.map((tc) => (
              <button
                key={tc.id}
                type="button"
                title={tc.name}
                onClick={() => onUpdateField('themeColor', tc.id)}
                className={`w-4 h-4 rounded-md ${tc.bgClass} flex items-center justify-center transition-transform ${
                  documentData.themeColor === tc.id ? 'ring-2 ring-[#065F46] ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {documentData.themeColor === tc.id && (
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Right Section Tools: Official Emblems, Signatures, Margins */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Official Emblem & Logo Toggle */}
          <button
            onClick={() => {
              const next = !(documentData.logoConfig?.show ?? (showEmblem || showLogo));
              onUpdateField('showOfficialEmblem', next);
              onUpdateField('showSchoolLogo', next);
              onUpdateField('logoConfig', {
                ...(documentData.logoConfig || {}),
                show: next,
              });
            }}
            title="إظهار أو إخفاء الشعار في رأس الوثيقة"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
              (documentData.logoConfig?.show ?? (showEmblem || showLogo))
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' 
                : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{(documentData.logoConfig?.show ?? (showEmblem || showLogo)) ? 'الشعار: مفعّل' : 'الشعار: مخفي'}</span>
          </button>

          {/* Teacher Signature Toggle */}
          <button
            onClick={() => {
              const next = !(documentData.signaturesConfig?.showSignatures ?? documentData.showTeacherSignature);
              onUpdateField('showTeacherSignature', next);
              onUpdateField('showInspectorSignature', next);
              onUpdateField('signaturesConfig', {
                ...(documentData.signaturesConfig || { layout: 'two_columns', items: [] }),
                showSignatures: next,
              });
            }}
            title="إظهار أو إخفاء التوقيعات أسفل الوثيقة"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
              (documentData.signaturesConfig?.showSignatures ?? documentData.showTeacherSignature)
                ? 'bg-blue-50 border-blue-200 text-blue-800' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{(documentData.signaturesConfig?.showSignatures ?? documentData.showTeacherSignature) ? 'التوقيعات: مفعّلة' : 'التوقيعات: مخفية'}</span>
          </button>


        </div>

      </div>

    </div>
  );
};

