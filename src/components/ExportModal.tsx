import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  FileType, 
  Image as ImageIcon, 
  Globe, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  FileSpreadsheet,
  Layers,
  Settings2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentData, ExportFormat, PageFormat } from '../types';
import { exportDocument, generateCleanFileName, triggerBrowserPrint } from '../utils/exportUtils';
import { getDimensionInfo } from '../utils/pageDimensions';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: DocumentData;
  onUpdatePageFormat?: (format: PageFormat) => void;
  onUpdateFooterToggle?: (showFooter: boolean, showPages: boolean) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  documentData,
  onUpdatePageFormat,
  onUpdateFooterToggle,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedPageFormat, setSelectedPageFormat] = useState<PageFormat>(documentData.pageFormat || 'a4_portrait');
  const [includeFooterDate, setIncludeFooterDate] = useState<boolean>(documentData.showFooterInfo ?? true);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(documentData.showPageNumbers ?? true);
  
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const formatsList: { id: ExportFormat; title: string; description: string; icon: any; badge: string; color: string }[] = [
    {
      id: 'pdf',
      title: 'مستند PDF للطباعة والمشاركة',
      description: 'ملف PDF رسمي عالي الدقة مع الحفاظ الكامل على الخطوط والجداول والتنسيق المغربي.',
      icon: FileSpreadsheet,
      badge: 'الخيار الأكثر شيوعاً',
      color: 'emerald',
    },
    {
      id: 'docx',
      title: 'مستند Word قابل للتعديل (DOCX)',
      description: 'ملف وورد متوافق مع Microsoft Word مع دعم اتجاه الكتابة RTL والجداول القابلة للتحرير.',
      icon: FileText,
      badge: 'قابل للتعديل لاحقاً',
      color: 'blue',
    },
    {
      id: 'png',
      title: 'صورة فائقة الدقة (PNG)',
      description: 'صورة رقمية واضحة بنقاء عالي مناسبة للمشاركة الرقمية والطباعة.',
      icon: ImageIcon,
      badge: 'دقة عالية 2x',
      color: 'amber',
    },
    {
      id: 'jpg',
      title: 'صورة قياسية (JPG)',
      description: 'صورة مضغوطة بحجم مثالي للمشاركة عبر واتساب والبريد الإلكتروني.',
      icon: ImageIcon,
      badge: 'حجم خفيف',
      color: 'orange',
    },
    {
      id: 'html',
      title: 'صفحة ويب تفاعلية (HTML)',
      description: 'ملف صفحة مستقلة يمكن فتحها مباشرة على أي متصفح هاتف أو حاسوب دون برامج إضافية.',
      icon: Globe,
      badge: 'مستقلة وتفاعلية',
      color: 'teal',
    },
    {
      id: 'rtf',
      title: 'نص منسق (RTF)',
      description: 'صيغة نصية قياسية مدعومة في جميع معالجات النصوص وWordpad وLibreOffice.',
      icon: FileType,
      badge: 'توافق شامل',
      color: 'slate',
    },
  ];

  const pageFormatsList: { id: PageFormat; label: string; desc: string }[] = [
    { id: 'a4_portrait', label: 'A4 عمودي', desc: 'الخيار الافتراضي للوثائق والجذاذات التربوية' },
    { id: 'a4_landscape', label: 'A4 أفقي', desc: 'مناسب للجداول العريضة وشبكات التنقيط المفصلة' },
    { id: 'a3_portrait', label: 'A3 عمودي', desc: 'مقاس كبير للملصقات والمخططات الحائطية' },
    { id: 'a3_landscape', label: 'A3 أفقي', desc: 'مقاس عريض للملصقات والجداول التوليفية' },
    { id: 'letter_portrait', label: 'Letter عمودي', desc: 'مقاس الرسائل القياسي (8.5 × 11 بوصة)' },
    { id: 'letter_landscape', label: 'Letter أفقي', desc: 'مقاس Letter أفقي' },
    { id: 'phone_story', label: 'مقاس شاشة الهاتف (1080 × 1920)', desc: 'مناسب للمشاركة والنشر على الهاتف' },
    { id: 'square', label: 'مقاس مربع (1080 × 1080)', desc: 'مناسب للنشر والمجموعات التربوية' },
  ];

  const expectedFileName = generateCleanFileName(documentData, selectedFormat);

  const handleStartExport = async () => {
    setIsExporting(true);
    setIsSuccess(false);
    setProgress(10);
    setProgressMessage('جاري تهيئة الوثيقة...');

    // Apply layout preferences if modified
    onUpdatePageFormat?.(selectedPageFormat);
    onUpdateFooterToggle?.(includeFooterDate, includePageNumbers);

    // Short wait to ensure render reflects state
    await new Promise((r) => setTimeout(r, 150));

    try {
      await exportDocument(
        'document-render-canvas',
        {
          ...documentData,
          pageFormat: selectedPageFormat,
          showFooterInfo: includeFooterDate,
          showPageNumbers: includePageNumbers,
        },
        selectedFormat,
        (prog, msg) => {
          setProgress(prog);
          setProgressMessage(msg);
        }
      );

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Export error:', err);
      alert('حدث خطأ أثناء تحميل الوثيقة: ' + (err.message || 'يرجى المحاولة مرة أخرى'));
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      triggerBrowserPrint();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-[#065F46] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                تحميل وتصدير الوثيقة
              </h3>
              <p className="text-xs text-[#D1FAE5]">
                اختر الصيغة والمقاس المطلوب للتحميل الفوري أو الطباعة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Format Selection Grid */}
          <div>
            <label className="block text-sm font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <FileType className="w-4 h-4 text-[#065F46]" />
              <span>1. اختر صيغة التصدير المطلوبة:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formatsList.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                const IconComponent = fmt.icon;

                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3.5 rounded-2xl text-right transition-all border-2 flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#065F46] bg-[#ECFDF5] shadow-xs ring-2 ring-[#065F46]/20'
                        : 'border-[#E5E7EB] hover:border-[#A7F3D0] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-[#065F46] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-[#1F2937] text-sm">{fmt.title}</h4>
                        <span className="text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#4B5563] px-1.5 py-0.5 rounded-md">
                          {fmt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                        {fmt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paper Size Selection */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <label className="block text-sm font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#065F46]" />
              <span>2. قياس الورق وتخطيط الصفحة:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pageFormatsList.map((pf) => {
                const isSelected = selectedPageFormat === pf.id;
                return (
                  <button
                    key={pf.id}
                    type="button"
                    onClick={() => {
                      setSelectedPageFormat(pf.id);
                      onUpdatePageFormat?.(pf.id);
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-right border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] font-bold shadow-2xs'
                        : 'border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#4B5563]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{pf.label}</div>
                      <div className="text-[11px] text-[#6B7280] font-normal">{pf.desc}</div>
                    </div>
                    {isSelected && <span className="w-2.5 h-2.5 bg-[#065F46] rounded-full"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles & Naming */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#374151]">
              <label className="flex items-center gap-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={includeFooterDate}
                  onChange={(e) => setIncludeFooterDate(e.target.checked)}
                  className="rounded-md text-[#065F46] focus:ring-[#065F46] w-4 h-4"
                />
                <span>إظهار تاريخ الإنشاء في تذييل الوثيقة</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="rounded-md text-[#065F46] focus:ring-[#065F46] w-4 h-4"
                />
                <span>إظهار أرقام الصفحات</span>
              </label>
            </div>

            {/* Generated Filename Preview */}
            <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs flex items-center justify-between gap-2">
              <span className="text-[#6B7280] font-medium">اسم الملف التلقائي:</span>
              <code className="font-mono text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0] font-bold truncate max-w-sm">
                {expectedFileName}
              </code>
            </div>
          </div>

          {/* Progress & Success Notification */}
          {isExporting && (
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#065F46]">
                <span>{progressMessage}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#A7F3D0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#065F46] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#065F46] shrink-0" />
              <div className="text-xs font-bold">
                تم تحميل الوثيقة بنجاح! تم حفظ الملف في مجلد التنزيلات بجهازك.
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#2D3436] font-bold text-xs shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-[#4B5563]" />
            <span>طباعة مباشرة (Print)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[#4B5563] hover:bg-[#E5E7EB] text-xs font-bold transition-colors"
            >
              إغلاق
            </button>

            <button
              type="button"
              id="btn-confirm-export"
              disabled={isExporting}
              onClick={handleStartExport}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white font-bold text-sm px-7 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all disabled:opacity-50 border border-[#044735]"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الوثيقة الآن</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
