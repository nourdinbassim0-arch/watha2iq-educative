import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Frame, 
  Sliders, 
  Check, 
  Layers, 
  Sparkles,
  Maximize2,
  FileText
} from 'lucide-react';
import { DocumentData, PageFormat } from '../../types';
import { DOCUMENT_FONTS, STANDARD_FONT_SIZES } from '../fonts';
import { DecorationTemplate, BorderType, DecorationIntensity } from './DocumentDecorations';

export interface DocumentDesignPanelProps {
  documentData: DocumentData;
  onUpdateField: (field: keyof DocumentData, value: any) => void;
  decorationTemplate: DecorationTemplate;
  onChangeDecorationTemplate: (template: DecorationTemplate) => void;
  borderType: BorderType;
  onChangeBorderType: (type: BorderType) => void;
  borderColor: string;
  onChangeBorderColor: (color: string) => void;
  borderWidth: number;
  onChangeBorderWidth: (width: number) => void;
  decorationIntensity: DecorationIntensity;
  onChangeDecorationIntensity: (intensity: DecorationIntensity) => void;
  orientation: 'portrait' | 'landscape';
  onChangeOrientation: (orientation: 'portrait' | 'landscape') => void;
  marginSize: 'tight' | 'normal' | 'generous' | 'custom';
  onChangeMarginSize: (margin: 'tight' | 'normal' | 'generous' | 'custom') => void;
}

export const DocumentDesignPanel: React.FC<DocumentDesignPanelProps> = ({
  documentData,
  onUpdateField,
  decorationTemplate,
  onChangeDecorationTemplate,
  borderType,
  onChangeBorderType,
  borderColor,
  onChangeBorderColor,
  borderWidth,
  onChangeBorderWidth,
  decorationIntensity,
  onChangeDecorationIntensity,
  orientation,
  onChangeOrientation,
  marginSize,
  onChangeMarginSize,
}) => {
  const templatesList: { id: DecorationTemplate; label: string; desc: string }[] = [
    { id: 'classic', label: 'كلاسيكي مغربي', desc: 'إطار رسمي مزدوج مع زوايا هندسية' },
    { id: 'academic', label: 'أكاديمي رسمي', desc: 'إطار مدرسي رصين مع شارة التميز' },
    { id: 'geometric', label: 'هندسي عصري', desc: 'زخارف هندسية دقيقة متناسقة' },
    { id: 'elegant', label: 'أنيق وانسيابي', desc: 'حواف ناعمة ومنحنيات جمالية' },
    { id: 'minimal', label: 'بسيط وخفيف', desc: 'خطوط هادئة وتركيز كامل على المحتوى' },
    { id: 'none', label: 'بدون إطار', desc: 'صفحة نقية بدون أي زخارف' },
  ];

  const borderTypesList: { id: BorderType; label: string }[] = [
    { id: 'full', label: 'إطار كامل' },
    { id: 'corners', label: 'زوايا فقط' },
    { id: 'partial', label: 'علوي وسفلي' },
    { id: 'none', label: 'بدون حدود' },
  ];

  const colorsList = [
    { name: 'أخضر ملكي رسمي', value: '#065f46' },
    { name: 'كحلي أكاديمي', value: '#1e3a8a' },
    { name: 'عنابي وقور', value: '#831843' },
    { name: 'رمادي فحمي', value: '#334155' },
    { name: 'بني تقليدي', value: '#78350f' },
    { name: 'أسود كلاسيكي', value: '#0f172a' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-5 text-right" dir="rtl">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
          <Palette className="w-4 h-4 text-emerald-700" />
          <span>لوحة تصميم وتنسيق الوثيقة</span>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
          تعديل حي وفوري
        </span>
      </div>

      {/* 1. Page Orientation & Margins */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-emerald-700" />
          <span>1. اتجاه الصفحة وهوامش الورق:</span>
        </label>

        {/* Orientation Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              onChangeOrientation('portrait');
              onUpdateField('pageFormat', 'a4_portrait' as PageFormat);
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              orientation === 'portrait'
                ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>A4 عمودي (Portrait)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeOrientation('landscape');
              onUpdateField('pageFormat', 'a4_landscape' as PageFormat);
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              orientation === 'landscape'
                ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>A4 أفقي (Landscape)</span>
          </button>
        </div>

        {/* Margins */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'tight', label: 'ضيق (10 مم)' },
            { id: 'normal', label: 'عادي (15 مم)' },
            { id: 'generous', label: 'عريض (22 مم)' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onChangeMarginSize(m.id as any);
                onUpdateField('marginSize', m.id);
              }}
              className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold text-center transition-colors ${
                marginSize === m.id
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Arabic Typography */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-emerald-700" />
          <span>2. نوع الخط العربي وحجمه:</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {Object.values(DOCUMENT_FONTS).slice(0, 6).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onUpdateField('fontFamily', f.id)}
              className={`p-2 rounded-xl border text-right transition-all flex items-center justify-between ${
                documentData.fontFamily === f.id || (!documentData.fontFamily && f.id === 'cairo')
                  ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs truncate">{f.nameAr.split('-')[0]}</span>
              {documentData.fontFamily === f.id && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Font Size & Line Height */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1">
            <label className="text-[11px] text-slate-600 mb-1 block">حجم الخط الأساسي:</label>
            <select
              value={documentData.fontSize || 11}
              onChange={(e) => onUpdateField('fontSize', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800"
            >
              {STANDARD_FONT_SIZES.map((sz) => (
                <option key={sz} value={sz}>{sz} pt</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-[11px] text-slate-600 mb-1 block">تباعد الأسطر:</label>
            <select
              value={documentData.lineHeight || 1.6}
              onChange={(e) => onUpdateField('lineHeight', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800"
            >
              <option value={1.3}>متقارب (1.3)</option>
              <option value={1.6}>متوسط رسمي (1.6)</option>
              <option value={1.8}>مريح (1.8)</option>
              <option value={2.0}>مزدوج (2.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Decorative Frame & Borders */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Frame className="w-3.5 h-3.5 text-emerald-700" />
          <span>3. الزخرفة وإطار الصفحة:</span>
        </label>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 gap-2">
          {templatesList.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onChangeDecorationTemplate(tmpl.id)}
              className={`p-2 rounded-xl border text-right transition-all ${
                decorationTemplate === tmpl.id
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold">{tmpl.label}</div>
              <div className="text-[10px] text-slate-500 font-normal">{tmpl.desc}</div>
            </button>
          ))}
        </div>

        {/* Border Type Selector */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {borderTypesList.map((bt) => (
            <button
              key={bt.id}
              type="button"
              onClick={() => onChangeBorderType(bt.id)}
              className={`py-1 px-1.5 rounded-lg border text-[10px] text-center transition-colors ${
                borderType === bt.id
                  ? 'border-emerald-700 bg-emerald-900 text-white font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>

        {/* Border Color Palette */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-600 shrink-0">لون الإطار:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {colorsList.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() => onChangeBorderColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  borderColor === c.value ? 'scale-110 border-white ring-2 ring-emerald-600' : 'border-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Border Width & Intensity */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-slate-600 mb-1 block">سُمك الإطار:</label>
            <select
              value={borderWidth}
              onChange={(e) => onChangeBorderWidth(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs"
            >
              <option value={1}>رفيع (1 px)</option>
              <option value={1.5}>عادي (1.5 px)</option>
              <option value={2}>سميك (2 px)</option>
              <option value={3}>عريض (3 px)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-600 mb-1 block">كثافة الزخرفة:</label>
            <select
              value={decorationIntensity}
              onChange={(e) => onChangeDecorationIntensity(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-xs"
            >
              <option value="light">خفيفة وهادئة</option>
              <option value="medium">متوسطة</option>
              <option value="strong">بارزة وواضحة</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Official Toggles */}
      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={documentData.showOfficialHeader !== false}
            onChange={(e) => onUpdateField('showOfficialHeader', e.target.checked)}
            className="rounded-md text-emerald-700 focus:ring-emerald-700 w-4 h-4"
          />
          <span>إظهار الترويسة المغربية الرسمية</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={documentData.showSchoolLogo !== false}
            onChange={(e) => onUpdateField('showSchoolLogo', e.target.checked)}
            className="rounded-md text-emerald-700 focus:ring-emerald-700 w-4 h-4"
          />
          <span>إظهار شعار المملكة وشعار الوزارة</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={documentData.showTeacherSignature ?? true}
            onChange={(e) => onUpdateField('showTeacherSignature', e.target.checked)}
            className="rounded-md text-emerald-700 focus:ring-emerald-700 w-4 h-4"
          />
          <span>إظهار خانة توقيع الأستاذ(ة)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={documentData.showInspectorSignature ?? true}
            onChange={(e) => onUpdateField('showInspectorSignature', e.target.checked)}
            className="rounded-md text-emerald-700 focus:ring-emerald-700 w-4 h-4"
          />
          <span>إظهار خانة تأشيرة المفتش(ة)</span>
        </label>
      </div>

    </div>
  );
};
