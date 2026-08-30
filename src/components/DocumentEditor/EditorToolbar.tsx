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
  Globe2, 
  Maximize2,
  Minimize2,
  Type,
  Shield,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { DocumentData, PageFormat, ThemeColor, FontFamily } from '../../types';
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
}) => {
  const isRtl = documentData.language === 'ar';
  const showEmblem = documentData.showOfficialEmblem ?? true;
  const showLogo = documentData.showSchoolLogo ?? false;

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

  return (
    <div className="bg-white border-b border-[#E5E7EB] sticky top-16 z-30 shadow-2xs px-4 py-2.5" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Major Actions */}
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

          {/* AI Didactic Assistant */}
          <button
            id="editor-btn-ai-assist"
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-bold text-xs px-3 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span className="hidden md:inline">{isRtl ? 'المساعد الديداكتيكي' : 'Assistant IA'}</span>
          </button>
        </div>

        {/* Center / Right Side: Visual & Formatting Options */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Color Theme Selector */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl">
            {themeColors.map((tc) => (
              <button
                key={tc.id}
                type="button"
                title={tc.name}
                onClick={() => onUpdateField('themeColor', tc.id)}
                className={`w-5 h-5 rounded-md ${tc.bgClass} flex items-center justify-center transition-transform ${
                  documentData.themeColor === tc.id ? 'ring-2 ring-[#065F46] ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {documentData.themeColor === tc.id && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>

          {/* Font Family Dropdown */}
          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl px-2 py-1 shadow-2xs">
            <Type className="w-3.5 h-3.5 text-[#4B5563]" />
            <select
              value={documentData.fontFamily || 'tajawal'}
              onChange={(e) => onUpdateField('fontFamily', e.target.value as FontFamily)}
              className="bg-transparent text-xs font-semibold text-[#2D3436] outline-hidden cursor-pointer"
            >
              {fonts.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Page Format Dropdown */}
          <select
            value={documentData.pageFormat || 'a4_portrait'}
            onChange={(e) => onUpdateField('pageFormat', e.target.value as PageFormat)}
            className="bg-white border border-[#E5E7EB] rounded-xl px-2.5 py-1 text-xs font-semibold text-[#2D3436] focus:ring-2 focus:ring-[#065F46] shadow-2xs"
          >
            <option value="a4_portrait">A4 عمودي (210 × 297 مم)</option>
            <option value="a4_landscape">A4 أفقي (297 × 210 مم)</option>
            <option value="a3_portrait">A3 عمودي (297 × 420 مم)</option>
            <option value="a3_landscape">A3 أفقي (420 × 297 مم)</option>
            <option value="letter_portrait">Letter عمودي (216 × 279 مم)</option>
            <option value="letter_landscape">Letter أفقي (279 × 216 مم)</option>
            <option value="phone_story">هاتف عمودي (1080 × 1920)</option>
            <option value="square">مربع (1080 × 1080)</option>
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

          {/* Official Emblem Toggle */}
          <button
            onClick={() => onUpdateField('showOfficialEmblem', !showEmblem)}
            title="إظهار أو إخفاء الشعار الرسمي للمملكة"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors ${
              showEmblem 
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{showEmblem ? 'الشعار الرسمي ظاهر' : 'الشعار مخفي'}</span>
          </button>

          {/* School Logo Toggle */}
          <button
            onClick={() => onUpdateField('showSchoolLogo', !showLogo)}
            title="إظهار أو إخفاء شعار المؤسسة"
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors ${
              showLogo 
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' 
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{showLogo ? 'شعار المؤسسة' : '+ شعار المدرسة'}</span>
          </button>

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
    </div>
  );
};
