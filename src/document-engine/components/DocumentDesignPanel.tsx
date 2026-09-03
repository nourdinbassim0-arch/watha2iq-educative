import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Sliders,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trash2,
  Plus,
  RotateCcw,
  Save,
  Download,
  Eye,
  EyeOff,
  PenTool,
  BookmarkCheck,
  Layers,
  X,
} from 'lucide-react';
import {
  DocumentData,
  HeaderTemplate,
  LogoPosition,
  LogoSize,
  PageBorderPreset,
  IslamicDecorationStyle,
  DecorationIntensityLevel,
  SignatureLayout,
  DocumentSignatureItem,
} from '../../types';
import {
  getDefaultLogoConfig,
  getDefaultHeaderConfig,
  getDefaultBorderConfig,
  getDefaultDecorationConfig,
  getDefaultMarginConfig,
  getDefaultSignaturesConfig,
  getDefaultFooterConfig,
  saveUserDesignPreset,
  loadUserDesignPreset,
} from '../../utils/documentDefaults';
import { MoroccanOfficialEmblem } from '../../components/MoroccanOfficialEmblem';

export interface DocumentDesignPanelProps {
  documentData: DocumentData;
  onUpdateField: (field: keyof DocumentData, value: any) => void;
  onClose?: () => void;
}

export const DocumentDesignPanel: React.FC<DocumentDesignPanelProps> = ({
  documentData,
  onUpdateField,
  onClose,
}) => {
  // Ensure we have active configs
  const logoConfig = documentData.logoConfig || getDefaultLogoConfig(documentData);
  const headerConfig = documentData.headerConfig || getDefaultHeaderConfig(documentData);
  const borderConfig = documentData.borderConfig || getDefaultBorderConfig(documentData);
  const decorationConfig = documentData.decorationConfig || getDefaultDecorationConfig(documentData);
  const marginConfig = documentData.marginConfig || getDefaultMarginConfig(documentData);
  const signaturesConfig = documentData.signaturesConfig || getDefaultSignaturesConfig(documentData);
  const footerConfig = documentData.footerConfig || getDefaultFooterConfig(documentData);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    header: true,
    logo: true,
    info: false,
    signatures: false,
    margins: false,
    border: false,
    decorations: false,
    footer: false,
    presets: false,
  });

  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showNotification = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 3000);
  };

  // Updaters
  const updateLogo = (patch: Partial<typeof logoConfig>) => {
    onUpdateField('logoConfig', { ...logoConfig, ...patch });
  };

  const updateHeader = (patch: Partial<typeof headerConfig>) => {
    onUpdateField('headerConfig', { ...headerConfig, ...patch });
  };

  const updateVisibleFields = (field: keyof typeof headerConfig.visibleFields, val: boolean) => {
    onUpdateField('headerConfig', {
      ...headerConfig,
      visibleFields: {
        ...headerConfig.visibleFields,
        [field]: val,
      },
    });
  };

  const updateBorder = (patch: Partial<typeof borderConfig>) => {
    onUpdateField('borderConfig', { ...borderConfig, ...patch });
  };

  const updateDecoration = (patch: Partial<typeof decorationConfig>) => {
    onUpdateField('decorationConfig', { ...decorationConfig, ...patch });
  };

  const updateMargin = (patch: Partial<typeof marginConfig>) => {
    onUpdateField('marginConfig', { ...marginConfig, ...patch });
  };

  const updateSignatures = (patch: Partial<typeof signaturesConfig>) => {
    onUpdateField('signaturesConfig', { ...signaturesConfig, ...patch });
  };

  const updateFooter = (patch: Partial<typeof footerConfig>) => {
    onUpdateField('footerConfig', { ...footerConfig, ...patch });
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateLogo({
        useCustomLogo: true,
        customLogoUrl: dataUrl,
        show: true,
      });
      showNotification('تم رفع الشعار المخصص بنجاح!');
    };
    reader.readAsDataURL(file);
  };

  // Preset Handlers
  const handleSavePreset = () => {
    saveUserDesignPreset(documentData);
    showNotification('تم حفظ إعدادات التصميم كنموذج مفضل لديك!');
  };

  const handleLoadPreset = () => {
    const preset = loadUserDesignPreset();
    if (!preset) {
      alert('لم يتم العثور على تصميم محفوظ مسبقاً.');
      return;
    }
    if (preset.logoConfig) onUpdateField('logoConfig', preset.logoConfig);
    if (preset.headerConfig) onUpdateField('headerConfig', preset.headerConfig);
    if (preset.borderConfig) onUpdateField('borderConfig', preset.borderConfig);
    if (preset.decorationConfig) onUpdateField('decorationConfig', preset.decorationConfig);
    if (preset.marginConfig) onUpdateField('marginConfig', preset.marginConfig);
    if (preset.signaturesConfig) onUpdateField('signaturesConfig', preset.signaturesConfig);
    if (preset.footerConfig) onUpdateField('footerConfig', preset.footerConfig);
    showNotification('تم استرجاع التصميم المحفوظ بنجاح!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد إعادة تعيين كافة إعدادات الهيدر والإطار والزخارف إلى المعايير الرسمية الافتراضية؟')) {
      onUpdateField('logoConfig', getDefaultLogoConfig(documentData));
      onUpdateField('headerConfig', getDefaultHeaderConfig(documentData));
      onUpdateField('borderConfig', getDefaultBorderConfig(documentData));
      onUpdateField('decorationConfig', getDefaultDecorationConfig(documentData));
      onUpdateField('marginConfig', getDefaultMarginConfig(documentData));
      onUpdateField('signaturesConfig', getDefaultSignaturesConfig(documentData));
      onUpdateField('footerConfig', getDefaultFooterConfig(documentData));
      showNotification('تمت استعادة الإعدادات الرسمية الافتراضية!');
    }
  };

  // Palette colors for borders
  const borderColors = [
    { name: 'أخضر ملكي رسمي', hex: '#065f46' },
    { name: 'كحلي أكاديمي', hex: '#1e3a8a' },
    { name: 'عنابي وقور', hex: '#831843' },
    { name: 'ذهبي مغربي', hex: '#b45309' },
    { name: 'رمادي فحمي', hex: '#334155' },
    { name: 'أسود كلاسيكي', hex: '#0f172a' },
  ];

  return (
    <div className="bg-white min-h-full flex flex-col text-slate-800 text-xs select-none" dir="rtl">
      {/* Drawer Top Header */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
          <Palette className="w-4 h-4 text-emerald-700" />
          <span>إعدادات تنسيق وتصميم الوثيقة</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="إغلاق اللوحة"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Feedback Toast */}
      {toastFeedback && (
        <div className="sticky top-12 z-30 mx-3 my-2 p-2 bg-emerald-900 text-white rounded-xl shadow-md text-[11px] font-bold flex items-center justify-between animate-fadeIn">
          <span>{toastFeedback}</span>
          <Check className="w-3.5 h-3.5 text-emerald-300" />
        </div>
      )}

      {/* Accordion Body */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        
        {/* ================= SECTION 1: HEADER LAYOUT & PRESETS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('header')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-700" />
              <span>1. نماذج ترويسة الوثيقة (Header Layouts)</span>
            </div>
            {openSections.header ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.header && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              <p className="text-[11px] text-slate-500">اختر النموذج البصري لرأس الوثيقة بما يناسب نوع المطبوع:</p>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'official' as HeaderTemplate,
                    title: 'النموذج 1 — رسمي (Official)',
                    desc: 'شعار المملكة في الوسط، مع بيانات الوزارة يميناً وبيانات المادة يساراً.',
                  },
                  {
                    id: 'center_logo' as HeaderTemplate,
                    title: 'النموذج 2 — شعار مركزي (Centered Logo)',
                    desc: 'شعار بارز في الأعلى تليه معلومات الوثيقة والمؤسسة مقسمة بالتساوي.',
                  },
                  {
                    id: 'minimal' as HeaderTemplate,
                    title: 'النموذج 3 — بسيط (Minimal)',
                    desc: 'ترويسة مقتضبة ومدمجة توفر مساحة كبرى لنص الوثيقة.',
                  },
                  {
                    id: 'academic' as HeaderTemplate,
                    title: 'النموذج 4 — أكاديمي (Academic)',
                    desc: 'شعار رسمي مع بطاقة تربوية مؤطرة للمعلومات الديداكتيكية.',
                  },
                  {
                    id: 'custom' as HeaderTemplate,
                    title: 'النموذج 5 — مخصص (Custom)',
                    desc: 'تحكم يدوي كامل في موضع الشعار والهوامش والحقول.',
                  },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => updateHeader({ template: tpl.id })}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-start justify-between gap-2 ${
                      headerConfig.template === tpl.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-[11.5px]">{tpl.title}</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{tpl.desc}</div>
                    </div>
                    {headerConfig.template === tpl.id && (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              {/* Spacing from Header to Title */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1">
                  <span>المسافة أسفل الترويسة والعنوان (مم):</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {logoConfig.titleSpacingMm ?? 5} مم
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={logoConfig.titleSpacingMm ?? 5}
                  onChange={(e) => updateLogo({ titleSpacingMm: Number(e.target.value) })}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: LOGO CONTROLS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('logo')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
              <span>2. الشعار الرسمي والمخصص (Logo)</span>
            </div>
            {openSections.logo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.logo && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              
              {/* Show / Hide Logo Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[11px] text-slate-800">إظهار الشعار في الوثيقة:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !logoConfig.show;
                    updateLogo({ show: next });
                    onUpdateField('showSchoolLogo', next);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    logoConfig.show
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {logoConfig.show ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{logoConfig.show ? 'ظاهر' : 'مخفي'}</span>
                </button>
              </div>

              {logoConfig.show && (
                <>
                  {/* Logo Size */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[11px] text-slate-700">حجم الشعار في رأس الوثيقة:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'sm' as LogoSize, label: 'صغير' },
                        { id: 'md' as LogoSize, label: 'متوسط (افتراضي)' },
                        { id: 'lg' as LogoSize, label: 'كبير' },
                        { id: 'custom' as LogoSize, label: 'مخصص' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => updateLogo({ size: s.id })}
                          className={`py-1.5 px-1 text-center rounded-lg border text-[10.5px] font-bold transition-all ${
                            logoConfig.size === s.id
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* If Custom Size Selected */}
                    {logoConfig.size === 'custom' && (
                      <div className="p-2 mt-1 rounded-lg bg-emerald-50/50 border border-emerald-200 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-600 font-bold block mb-1">
                            العرض (مم):
                          </label>
                          <input
                            type="number"
                            min="20"
                            max="70"
                            value={logoConfig.customWidthMm || 36}
                            onChange={(e) => updateLogo({ customWidthMm: Number(e.target.value) })}
                            className="w-full p-1.5 rounded-md border border-slate-300 text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-600 font-bold block mb-1">
                            الارتفاع (مم):
                          </label>
                          <input
                            type="number"
                            min="15"
                            max="60"
                            value={logoConfig.customHeightMm || 28}
                            onChange={(e) => updateLogo({ customHeightMm: Number(e.target.value) })}
                            className="w-full p-1.5 rounded-md border border-slate-300 text-center font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Logo Position */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[11px] text-slate-700">موضع الشعار:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'top_center' as LogoPosition, label: 'أعلى الوسط (موصى به)' },
                        { id: 'top_right' as LogoPosition, label: 'أعلى اليمين' },
                        { id: 'top_left' as LogoPosition, label: 'أعلى اليسار' },
                        { id: 'custom' as LogoPosition, label: 'موضع مخصص' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => updateLogo({ position: p.id })}
                          className={`py-1.5 px-2 rounded-lg border text-[10.5px] font-bold transition-all text-center ${
                            logoConfig.position === p.id
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Custom Logo Section */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="font-bold text-[11px] text-slate-800">صورة الشعار المستخدم:</div>
                    
                    {/* Active Logo Preview */}
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {logoConfig.useCustomLogo && logoConfig.customLogoUrl ? (
                            <img
                              src={logoConfig.customLogoUrl}
                              alt="شعار مخصص"
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <MoroccanOfficialEmblem size="xs" showMotto={false} language="ar" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-slate-800">
                            {logoConfig.useCustomLogo ? 'شعار مخصص مرفوع' : 'الشعار الرسمي للمملكة المغربية'}
                          </div>
                          <div className="text-[9.5px] text-slate-500">
                            {logoConfig.useCustomLogo ? 'تم رفع صورة مخصصة من جهازك' : 'فيكتور عالي الدقة يظهر بوضوح بالطباعة'}
                          </div>
                        </div>
                      </div>

                      {logoConfig.useCustomLogo && (
                        <button
                          type="button"
                          onClick={() => updateLogo({ useCustomLogo: false, customLogoUrl: '' })}
                          title="حذف الشعار المخصص واستعادة الشعار الرسمي"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Upload button */}
                    <div>
                      <label className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-600 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span>رفع شعار مخصص (مؤسسة / جمعية...)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {logoConfig.useCustomLogo && (
                      <button
                        type="button"
                        onClick={() => updateLogo({ useCustomLogo: false })}
                        className="w-full py-1 text-[10px] text-slate-600 hover:text-emerald-900 font-semibold"
                      >
                        العودة لشعار المملكة المغربية الرسمي
                      </button>
                    )}
                  </div>

                  {/* Logo Spacing Controls */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between text-[10.5px] font-semibold text-slate-700 mb-1">
                        <span>المسافة من أعلى الصفحة (مم):</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {logoConfig.topMarginMm ?? 0} مم
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={logoConfig.topMarginMm ?? 0}
                        onChange={(e) => updateLogo({ topMarginMm: Number(e.target.value) })}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10.5px] font-semibold text-slate-700 mb-1">
                        <span>المسافة أسفل الشعار (مم):</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {logoConfig.bottomMarginMm ?? 3} مم
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={logoConfig.bottomMarginMm ?? 3}
                        onChange={(e) => updateLogo({ bottomMarginMm: Number(e.target.value) })}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= SECTION 3: HEADER INFORMATION BLOCKS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('info')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>3. بيانات رأس الوثيقة (Header Fields)</span>
            </div>
            {openSections.info ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.info && (
            <div className="p-3 space-y-2 bg-white border-t border-slate-100">
              <p className="text-[11px] text-slate-500 mb-2">
                فعّل أو عطّل ظهور الحقول المؤسساتية والبيداغوجية حسب رغبتك:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'kingdom' as const, label: 'المملكة المغربية' },
                  { key: 'ministry' as const, label: 'وزارة التربية الوطنية' },
                  { key: 'academy' as const, label: 'الأكاديمية الجهوية' },
                  { key: 'directorate' as const, label: 'المديرية الإقليمية' },
                  { key: 'schoolName' as const, label: 'اسم المؤسسة التعليمية' },
                  { key: 'academicYear' as const, label: 'السنة الدراسية' },
                  { key: 'subject' as const, label: 'المادة الدراسية' },
                  { key: 'grade' as const, label: 'المستوى الدراسي' },
                  { key: 'teacher' as const, label: 'الأستاذ(ة)' },
                  { key: 'date' as const, label: 'تاريخ الوثيقة' },
                ].map((item) => {
                  const isVisible = headerConfig.visibleFields?.[item.key] !== false;
                  return (
                    <label
                      key={item.key}
                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                        isVisible
                          ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="text-[11px]">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={(e) => updateVisibleFields(item.key, e.target.checked)}
                        className="rounded-sm text-emerald-700 focus:ring-emerald-600 h-4 w-4"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 4: SIGNATURE SYSTEM ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('signatures')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-emerald-700" />
              <span>4. نظام التوقيعات والتأشيرات (Signatures)</span>
            </div>
            {openSections.signatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.signatures && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              
              {/* Master Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-[11px] text-slate-900 block">إظهار خانات التوقيع:</span>
                  <span className="text-[9.5px] text-slate-500">إذا تم التعطيل لن يظهر أي توقيع بالـ PDF</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !signaturesConfig.showSignatures;
                    updateSignatures({ showSignatures: next });
                    onUpdateField('showTeacherSignature', next);
                    onUpdateField('showInspectorSignature', next);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    signaturesConfig.showSignatures
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {signaturesConfig.showSignatures ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{signaturesConfig.showSignatures ? 'مفعّل' : 'معطّل'}</span>
                </button>
              </div>

              {signaturesConfig.showSignatures && (
                <>
                  {/* Signature Layout Presets */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-[11px] text-slate-700">توزيع وتخطيط التوقيعات:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'one_center' as SignatureLayout, label: 'توقيع واحد في الوسط' },
                        { id: 'two_columns' as SignatureLayout, label: 'توقيعان (يمين ويسار)' },
                        { id: 'three_columns' as SignatureLayout, label: 'ثلاثة توقيعات متوازية' },
                        { id: 'four_columns' as SignatureLayout, label: 'أربعة توقيعات' },
                      ].map((lay) => (
                        <button
                          key={lay.id}
                          type="button"
                          onClick={() => updateSignatures({ layout: lay.id })}
                          className={`py-1.5 px-2 rounded-lg border text-[10.5px] font-bold transition-all text-center ${
                            signaturesConfig.layout === lay.id
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {lay.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of Signatures */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="font-bold text-[11px] text-slate-800 block">الموقعون في أسفل الوثيقة:</label>
                    {signaturesConfig.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...signaturesConfig.items];
                              newItems[idx] = { ...item, title: e.target.value };
                              updateSignatures({ items: newItems });
                            }}
                            className="font-bold text-[11px] text-slate-800 bg-transparent border-b border-dashed border-slate-300 py-0.5 focus:border-emerald-600 outline-hidden w-40"
                          />
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.show !== false}
                                onChange={(e) => {
                                  const newItems = [...signaturesConfig.items];
                                  newItems[idx] = { ...item, show: e.target.checked };
                                  updateSignatures({ items: newItems });
                                }}
                                className="rounded-sm text-emerald-700"
                              />
                              <span>إظهار</span>
                            </label>
                            {signaturesConfig.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = signaturesConfig.items.filter((_, i) => i !== idx);
                                  updateSignatures({ items: newItems });
                                }}
                                className="text-rose-600 hover:text-rose-800 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="الاسم الكامل للموقع..."
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...signaturesConfig.items];
                              newItems[idx] = { ...item, name: e.target.value };
                              updateSignatures({ items: newItems });
                            }}
                            className="bg-white p-1 rounded-md border border-slate-200 text-[10px]"
                          />
                          <input
                            type="text"
                            placeholder="الصفة / المهمة..."
                            value={item.role || ''}
                            onChange={(e) => {
                              const newItems = [...signaturesConfig.items];
                              newItems[idx] = { ...item, role: e.target.value };
                              updateSignatures({ items: newItems });
                            }}
                            className="bg-white p-1 rounded-md border border-slate-200 text-[10px]"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Signature Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const newItem: DocumentSignatureItem = {
                          id: `sig-${Date.now()}`,
                          title: 'توقيع وتأشيرة',
                          name: '',
                          role: '',
                          show: true,
                          order: signaturesConfig.items.length + 1,
                        };
                        updateSignatures({ items: [...signaturesConfig.items, newItem] });
                      }}
                      className="w-full py-1.5 px-3 rounded-xl border border-dashed border-emerald-600 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1 hover:bg-emerald-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة موقع جديد</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= SECTION 5: PAGE MARGINS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('margins')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>5. هوامش الصفحة (Page Margins)</span>
            </div>
            {openSections.margins ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.margins && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              <p className="text-[11px] text-slate-500">اختر إحدى الإعدادات الجاهزة أو حدد الهوامش بالملمتر:</p>

              {/* Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  {
                    id: 'tight',
                    label: 'ضيقة (10 مم)',
                    apply: { preset: 'tight', topMm: 10, bottomMm: 10, rightMm: 10, leftMm: 10 },
                  },
                  {
                    id: 'normal',
                    label: 'عادية (15 مم) • افتراضي',
                    apply: { preset: 'normal', topMm: 14, bottomMm: 14, rightMm: 15, leftMm: 15 },
                  },
                  {
                    id: 'generous',
                    label: 'واسعة (22 مم)',
                    apply: { preset: 'generous', topMm: 20, bottomMm: 20, rightMm: 22, leftMm: 22 },
                  },
                  {
                    id: 'academic',
                    label: 'أكاديمية رسمية',
                    apply: { preset: 'academic', topMm: 18, bottomMm: 18, rightMm: 20, leftMm: 15 },
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateMargin(m.apply as any)}
                    className={`p-2 rounded-lg border text-center font-bold text-[10.5px] transition-all ${
                      marginConfig.preset === m.id
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Custom Sliders */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-[11px] text-slate-800">تعديل الهوامش يدوياً (مم):</div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                      <span>علوي:</span>
                      <span className="font-bold text-emerald-800">{marginConfig.topMm} مم</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="30"
                      value={marginConfig.topMm}
                      onChange={(e) => updateMargin({ preset: 'custom', topMm: Number(e.target.value) })}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                      <span>سفلي:</span>
                      <span className="font-bold text-emerald-800">{marginConfig.bottomMm} مم</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="30"
                      value={marginConfig.bottomMm}
                      onChange={(e) => updateMargin({ preset: 'custom', bottomMm: Number(e.target.value) })}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                      <span>يمين:</span>
                      <span className="font-bold text-emerald-800">{marginConfig.rightMm} مم</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="35"
                      value={marginConfig.rightMm}
                      onChange={(e) => updateMargin({ preset: 'custom', rightMm: Number(e.target.value) })}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                      <span>يسار:</span>
                      <span className="font-bold text-emerald-800">{marginConfig.leftMm} مم</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="35"
                      value={marginConfig.leftMm}
                      onChange={(e) => updateMargin({ preset: 'custom', leftMm: Number(e.target.value) })}
                      className="w-full accent-emerald-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 6: PAGE BORDER ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('border')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-emerald-700" />
              <span>6. إطار الصفحة (Page Border)</span>
            </div>
            {openSections.border ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.border && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              {/* Border Preset */}
              <div className="space-y-1.5">
                <label className="font-bold text-[11px] text-slate-700">نمط الإطار:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'moroccan' as PageBorderPreset, label: 'مغربي (افتراضي)' },
                    { id: 'islamic' as PageBorderPreset, label: 'إسلامي مزدوج' },
                    { id: 'academic' as PageBorderPreset, label: 'أكاديمي' },
                    { id: 'simple' as PageBorderPreset, label: 'بسيط' },
                    { id: 'decorative' as PageBorderPreset, label: 'زخرفي ثلاثي' },
                    { id: 'none' as PageBorderPreset, label: 'بدون إطار' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => updateBorder({ preset: b.id })}
                      className={`py-1.5 px-2 rounded-lg border text-[10.5px] font-bold text-center transition-all ${
                        borderConfig.preset === b.id
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {borderConfig.preset !== 'none' && (
                <>
                  {/* Border Color */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-bold text-[11px] text-slate-700">لون الإطار الرسمي:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {borderColors.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateBorder({ color: c.hex })}
                          className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold transition-all ${
                            borderConfig.color === c.hex
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thickness and Distance from Edge */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                    <div>
                      <div className="flex justify-between text-[10.5px] text-slate-700 mb-1">
                        <span>سُمك الإطار:</span>
                        <span className="font-bold text-emerald-800">{borderConfig.thickness} pt</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3.5"
                        step="0.5"
                        value={borderConfig.thickness}
                        onChange={(e) => updateBorder({ thickness: Number(e.target.value) })}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10.5px] text-slate-700 mb-1">
                        <span>المسافة من حافة الورقة:</span>
                        <span className="font-bold text-emerald-800">{borderConfig.insetMm} مم</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="12"
                        value={borderConfig.insetMm}
                        onChange={(e) => updateBorder({ insetMm: Number(e.target.value) })}
                        className="w-full accent-emerald-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= SECTION 7: ISLAMIC DECORATIONS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('decorations')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>7. مكتبة الزخارف المغربية والإسلامية</span>
            </div>
            {openSections.decorations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.decorations && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              
              {/* Decoration Intensity */}
              <div className="space-y-1.5">
                <label className="font-bold text-[11px] text-slate-700">شدة ووضوح الزخرفة في الوثيقة:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none' as DecorationIntensityLevel, label: 'بدون' },
                    { id: 'light' as DecorationIntensityLevel, label: 'خفيفة (افتراضي)' },
                    { id: 'medium' as DecorationIntensityLevel, label: 'متوسطة' },
                    { id: 'strong' as DecorationIntensityLevel, label: 'قوية' },
                  ].map((intl) => (
                    <button
                      key={intl.id}
                      type="button"
                      onClick={() => updateDecoration({ intensity: intl.id })}
                      className={`py-1.5 px-1 rounded-lg border text-[10.5px] font-bold text-center transition-all ${
                        decorationConfig.intensity === intl.id
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {intl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 10 Styles */}
              {decorationConfig.intensity !== 'none' && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-[11px] text-slate-700">اختر نمط الزخرفة (10 أنماط احترافية):</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'classic_islamic' as IslamicDecorationStyle, label: '1. كلاسيكي إسلامي' },
                      { id: 'moroccan_geometric' as IslamicDecorationStyle, label: '2. مغربي هندسي' },
                      { id: 'moroccan_zellij' as IslamicDecorationStyle, label: '3. زليج مغربي' },
                      { id: 'simple_islamic' as IslamicDecorationStyle, label: '4. إسلامي بسيط' },
                      { id: 'academic_green' as IslamicDecorationStyle, label: '5. أخضر أكاديمي' },
                      { id: 'geometric' as IslamicDecorationStyle, label: '6. هندسي متناظر' },
                      { id: 'corner_ornaments' as IslamicDecorationStyle, label: '7. زخارف الزوايا' },
                      { id: 'academic_official' as IslamicDecorationStyle, label: '8. رسمي أكاديمي' },
                      { id: 'top_only' as IslamicDecorationStyle, label: '9. شريط علوي فقط' },
                      { id: 'bottom_only' as IslamicDecorationStyle, label: '10. شريط سفلي فقط' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateDecoration({ style: st.id })}
                        className={`p-2 rounded-lg border text-right text-[10.5px] font-bold transition-all ${
                          decorationConfig.style === st.id
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= SECTION 8: DOCUMENT FOOTER ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('footer')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>8. تذييل الوثيقة (Footer)</span>
            </div>
            {openSections.footer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.footer && (
            <div className="p-3 space-y-3 bg-white border-t border-slate-100">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-[11px] text-slate-800">إظهار سطر التذييل:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !footerConfig.showFooter;
                    updateFooter({ showFooter: next });
                    onUpdateField('showFooterInfo', next);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    footerConfig.showFooter ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {footerConfig.showFooter ? 'ظاهر' : 'مخفي'}
                </button>
              </div>

              {footerConfig.showFooter && (
                <>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                      النص المخصص في التذييل:
                    </label>
                    <input
                      type="text"
                      value={footerConfig.customText || ''}
                      onChange={(e) => updateFooter({ customText: e.target.value })}
                      placeholder="مثلاً: المملكة المغربية • منصة وثائقي التربوية"
                      className="w-full p-2 text-[10.5px] rounded-lg border border-slate-200 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={footerConfig.showPageNumbers !== false}
                        onChange={(e) => {
                          updateFooter({ showPageNumbers: e.target.checked });
                          onUpdateField('showPageNumbers', e.target.checked);
                        }}
                        className="rounded-sm text-emerald-700"
                      />
                      <span className="text-[10px] font-bold text-slate-800">ترقيم الصفحات</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={footerConfig.showAcademicYear !== false}
                        onChange={(e) => updateFooter({ showAcademicYear: e.target.checked })}
                        className="rounded-sm text-emerald-700"
                      />
                      <span className="text-[10px] font-bold text-slate-800">السنة الدراسية</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ================= SECTION 9: SAVE & RESET PRESETS ================= */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => toggleSection('presets')}
            className="w-full px-3 py-2.5 flex items-center justify-between font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-700" />
              <span>9. حفظ واسترجاع النماذج المفضلة</span>
            </div>
            {openSections.presets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.presets && (
            <div className="p-3 space-y-2 bg-white border-t border-slate-100">
              <p className="text-[11px] text-slate-500">
                يمكنك حفظ نسق التنسيق الحالي لاستخدامه في كافة وثائقك القادمة، أو الرجوع للمواصفات الرسمية:
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSavePreset}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ تصميم الوثيقة كنموذج افتراضي</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadPreset}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>استرجاع التصميم المحفوظ مسبقاً</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة ضبط الإعدادات الرسمية الافتراضية</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
