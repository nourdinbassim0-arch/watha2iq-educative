import React, { useState, useMemo, useRef } from 'react';
import {
  DocumentData,
  GradebookMiddleHighRow,
  PrimaryCompetencyIndicator,
  PrimaryEvaluationStudentRow,
  GradebookCoefficients,
} from '../types';
import {
  Plus,
  Trash2,
  Settings2,
  Printer,
  Download,
  FileSpreadsheet,
  Award,
  Calculator,
  RotateCcw,
  Sparkles,
  Upload,
  CheckCircle,
  Eye,
  EyeOff,
  BarChart2,
  TrendingUp,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { MoroccanOfficialEmblem } from './MoroccanOfficialEmblem';
import { exportDocument, triggerBrowserPrint } from '../utils/exportUtils';

interface GradebookManagerProps {
  documentData: DocumentData;
  onUpdateDocument: (updated: DocumentData) => void;
  language?: 'ar' | 'fr' | 'en';
}

const DEFAULT_COEFFICIENTS: GradebookCoefficients = {
  exam1: 25,
  exam2: 25,
  exam3: 25,
  exam4: 0,
  activities: 25,
};

const DEFAULT_MIDDLE_STUDENTS: GradebookMiddleHighRow[] = [
  { id: '1', studentNumber: 1, studentName: 'أحمد بن جلون', exam1: 16.5, exam2: 17, exam3: 15.5, exam4: '', activities: 18, notes: 'متميز ومنضبط' },
  { id: '2', studentNumber: 2, studentName: 'فاطمة الزهراء الإدريسي', exam1: 18, exam2: 19, exam3: 18.5, exam4: '', activities: 19.5, notes: 'مشاركة ممتازة' },
  { id: '3', studentNumber: 3, studentName: 'ياسين العلمي', exam1: 12.5, exam2: 11, exam3: 13, exam4: '', activities: 14, notes: 'يحتاج تركيزاً أكبر' },
  { id: '4', studentNumber: 4, studentName: 'مريم التازي', exam1: 14.5, exam2: 15, exam3: 16, exam4: '', activities: 16.5, notes: 'تطور ملحوظ' },
  { id: '5', studentNumber: 5, studentName: 'حمزة المنصوري', exam1: 9.5, exam2: 10, exam3: 11, exam4: '', activities: 12, notes: 'مستفيد من حصص الدعم' },
  { id: '6', studentNumber: 6, studentName: 'زينب الصقلي', exam1: 15, exam2: 16, exam3: 14, exam4: '', activities: 17, notes: 'مواظبة' },
];

const DEFAULT_PRIMARY_INDICATORS: PrimaryCompetencyIndicator[] = [
  { id: 'ind-1', componentName: 'القراءة والفهم', indicatorDescription: 'قراءة نص مشكول بطلاقة والإجابة عن أسئلة الفهم' },
  { id: 'ind-2', componentName: 'الظواهر اللغوية', indicatorDescription: 'توظيف التراكيب والصرف والتحويل بالشكل السليم' },
  { id: 'ind-3', componentName: 'الإنتاج الكتابي', indicatorDescription: 'إنتاج نص سردي أو وصفي قصير من 4 أسطر' },
  { id: 'ind-4', componentName: 'الحساب والعمليات', indicatorDescription: 'إنجاز العمليات الحسابية الأساسية بدقة' },
];

const DEFAULT_PRIMARY_STUDENTS: PrimaryEvaluationStudentRow[] = [
  {
    id: 'p-1',
    studentNumber: 1,
    studentName: 'سارة الفاسي',
    ratings: { 'ind-1': 'excellent', 'ind-2': 'veryGood', 'ind-3': 'excellent', 'ind-4': 'good' },
    generalAppreciation: 'مستوى ممتاز ومشاركة فعالة',
    notes: 'متمكنة من جميع الكفايات',
  },
  {
    id: 'p-2',
    studentNumber: 2,
    studentName: 'عمر الصقلي',
    ratings: { 'ind-1': 'good', 'ind-2': 'inProgress', 'ind-3': 'inProgress', 'ind-4': 'good' },
    generalAppreciation: 'مستوى متوسط يحتاج تعزيز الإنتاج',
    notes: 'مبرمج في خطة الدعم الفردي',
  },
  {
    id: 'p-3',
    studentNumber: 3,
    studentName: 'سلمى البقالي',
    ratings: { 'ind-1': 'excellent', 'ind-2': 'excellent', 'ind-3': 'veryGood', 'ind-4': 'excellent' },
    generalAppreciation: 'استيعاب متميز وتفوق في الحساب',
    notes: 'تستحق لوحة شرف',
  },
];

export const GradebookManager: React.FC<GradebookManagerProps> = ({
  documentData,
  onUpdateDocument,
  language = 'ar',
}) => {
  const isRtl = language === 'ar';
  const isMiddleHigh = documentData.level === 'middle' || documentData.level === 'high';
  
  const [gradebookType, setGradebookType] = useState<'middle_high' | 'primary'>(
    documentData.gradebookType || (isMiddleHigh ? 'middle_high' : 'primary')
  );

  const [coefficients, setCoefficients] = useState<GradebookCoefficients>(
    documentData.gradebookCoefficients || DEFAULT_COEFFICIENTS
  );

  const [showCoeffModal, setShowCoeffModal] = useState(false);
  const [showIndicatorsModal, setShowIndicatorsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStatsDrawer, setShowStatsDrawer] = useState(true);

  // Visibility Toggles
  const [showRank, setShowRank] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);
  const [showOfficialEmblem, setShowOfficialEmblem] = useState(documentData.showEmblem !== false);

  const [viewMode, setViewMode] = useState<'numeric' | 'appreciation' | 'both'>(
    documentData.gradebookViewMode || 'both'
  );

  const [middleStudents, setMiddleStudents] = useState<GradebookMiddleHighRow[]>(
    documentData.gradebookMiddleHighRows && documentData.gradebookMiddleHighRows.length > 0
      ? documentData.gradebookMiddleHighRows
      : DEFAULT_MIDDLE_STUDENTS
  );

  const [primaryIndicators, setPrimaryIndicators] = useState<PrimaryCompetencyIndicator[]>(
    documentData.primaryIndicators && documentData.primaryIndicators.length > 0
      ? documentData.primaryIndicators
      : DEFAULT_PRIMARY_INDICATORS
  );

  const [primaryStudents, setPrimaryStudents] = useState<PrimaryEvaluationStudentRow[]>(
    documentData.primaryStudentRows && documentData.primaryStudentRows.length > 0
      ? documentData.primaryStudentRows
      : DEFAULT_PRIMARY_STUDENTS
  );

  // New indicator form state
  const [newIndName, setNewIndName] = useState('');
  const [newIndDesc, setNewIndDesc] = useState('');

  // Import raw text state
  const [importText, setImportText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to compute honors
  const getAppreciation = (avg: number) => {
    if (avg >= 18) return 'ممتاز (تهنئة)';
    if (avg >= 16) return 'جيد جداً (تشجيع)';
    if (avg >= 14) return 'جيد (لوحة شرف)';
    if (avg >= 12) return 'مستحسن';
    if (avg >= 10) return 'متوسط';
    return 'دون العتبة (دعم)';
  };

  // Middle/High Calculated Table with Dynamic Average & Rank
  const calculatedMiddleStudents = useMemo(() => {
    const totalWeight =
      (coefficients.exam1 || 0) +
      (coefficients.exam2 || 0) +
      (coefficients.exam3 || 0) +
      (coefficients.exam4 || 0) +
      (coefficients.activities || 0);

    const safeTotalWeight = totalWeight > 0 ? totalWeight : 100;

    const scored = middleStudents.map((st) => {
      const e1 = typeof st.exam1 === 'number' ? st.exam1 : parseFloat(st.exam1 as string) || 0;
      const e2 = typeof st.exam2 === 'number' ? st.exam2 : parseFloat(st.exam2 as string) || 0;
      const e3 = typeof st.exam3 === 'number' ? st.exam3 : parseFloat(st.exam3 as string) || 0;
      const e4 = typeof st.exam4 === 'number' ? st.exam4 : parseFloat(st.exam4 as string) || 0;
      const act = typeof st.activities === 'number' ? st.activities : parseFloat(st.activities as string) || 0;

      const weightedSum =
        e1 * (coefficients.exam1 || 0) +
        e2 * (coefficients.exam2 || 0) +
        e3 * (coefficients.exam3 || 0) +
        e4 * (coefficients.exam4 || 0) +
        act * (coefficients.activities || 0);

      const avg = Number((weightedSum / safeTotalWeight).toFixed(2));
      return {
        ...st,
        calculatedAverage: avg,
        appreciation: getAppreciation(avg),
      };
    });

    // Compute Ranks
    const sortedAverages = [...scored].sort((a, b) => (b.calculatedAverage || 0) - (a.calculatedAverage || 0));
    return scored.map((st) => {
      const rank = sortedAverages.findIndex((s) => s.id === st.id) + 1;
      return { ...st, rank };
    });
  }, [middleStudents, coefficients]);

  // Statistics Calculation
  const classStats = useMemo(() => {
    if (gradebookType === 'middle_high') {
      const averages = calculatedMiddleStudents
        .map((s) => s.calculatedAverage || 0)
        .filter((v) => !isNaN(v) && v > 0);

      if (averages.length === 0) {
        return { average: 0, highest: 0, lowest: 0, passRate: 0, total: middleStudents.length, tiers: {} };
      }

      const sum = averages.reduce((a, b) => a + b, 0);
      const avg = Number((sum / averages.length).toFixed(2));
      const highest = Math.max(...averages);
      const lowest = Math.min(...averages);
      const passed = averages.filter((v) => v >= 10).length;
      const passRate = Math.round((passed / averages.length) * 100);

      const tiers = {
        excellent: averages.filter((v) => v >= 16).length,
        good: averages.filter((v) => v >= 12 && v < 16).length,
        average: averages.filter((v) => v >= 10 && v < 12).length,
        support: averages.filter((v) => v < 10).length,
      };

      return { average: avg, highest, lowest, passRate, total: middleStudents.length, tiers };
    } else {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        passRate: 100,
        total: primaryStudents.length,
        tiers: {
          acquired: primaryStudents.filter((s) => s.generalAppreciation.includes('ممتاز') || s.generalAppreciation.includes('متمكن')).length,
          inProgress: primaryStudents.filter((s) => s.generalAppreciation.includes('متوسط') || s.generalAppreciation.includes('طور')).length,
        },
      };
    }
  }, [gradebookType, calculatedMiddleStudents, middleStudents.length, primaryStudents]);

  // Actions: Add / Edit / Delete
  const handleAddMiddleStudent = () => {
    const nextNum = middleStudents.length + 1;
    const newStudent: GradebookMiddleHighRow = {
      id: `std-${Date.now()}`,
      studentNumber: nextNum,
      studentName: '',
      exam1: '',
      exam2: '',
      exam3: '',
      exam4: '',
      activities: '',
      notes: '',
    };
    const updated = [...middleStudents, newStudent];
    setMiddleStudents(updated);
    onUpdateDocument({ ...documentData, gradebookMiddleHighRows: updated });
  };

  const handleDeleteMiddleStudent = (id: string) => {
    const updated = middleStudents.filter((s) => s.id !== id);
    setMiddleStudents(updated);
    onUpdateDocument({ ...documentData, gradebookMiddleHighRows: updated });
  };

  const handleUpdateMiddleStudent = (id: string, field: keyof GradebookMiddleHighRow, val: any) => {
    const updated = middleStudents.map((s) => (s.id === id ? { ...s, [field]: val } : s));
    setMiddleStudents(updated);
    onUpdateDocument({ ...documentData, gradebookMiddleHighRows: updated });
  };

  const handleAddPrimaryStudent = () => {
    const nextNum = primaryStudents.length + 1;
    const newStudent: PrimaryEvaluationStudentRow = {
      id: `pstd-${Date.now()}`,
      studentNumber: nextNum,
      studentName: '',
      ratings: {},
      generalAppreciation: 'مكتسب ومتمكن',
      notes: '',
    };
    const updated = [...primaryStudents, newStudent];
    setPrimaryStudents(updated);
    onUpdateDocument({ ...documentData, primaryStudentRows: updated });
  };

  const handleDeletePrimaryStudent = (id: string) => {
    const updated = primaryStudents.filter((s) => s.id !== id);
    setPrimaryStudents(updated);
    onUpdateDocument({ ...documentData, primaryStudentRows: updated });
  };

  const handleUpdatePrimaryRating = (studentId: string, indicatorId: string, rating: any) => {
    const updated = primaryStudents.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          ratings: { ...s.ratings, [indicatorId]: rating },
        };
      }
      return s;
    });
    setPrimaryStudents(updated);
    onUpdateDocument({ ...documentData, primaryStudentRows: updated });
  };

  // Primary Indicator Manager Actions
  const handleAddIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndName.trim()) return;
    const newInd: PrimaryCompetencyIndicator = {
      id: `ind-${Date.now()}`,
      componentName: newIndName.trim(),
      indicatorDescription: newIndDesc.trim() || 'مؤشر كفاية مخصص',
    };
    const updated = [...primaryIndicators, newInd];
    setPrimaryIndicators(updated);
    onUpdateDocument({ ...documentData, primaryIndicators: updated });
    setNewIndName('');
    setNewIndDesc('');
  };

  const handleDeleteIndicator = (id: string) => {
    if (primaryIndicators.length <= 1) {
      alert('يجب الإبقاء على مؤشر تقويم واحد على الأقل.');
      return;
    }
    const updated = primaryIndicators.filter((i) => i.id !== id);
    setPrimaryIndicators(updated);
    onUpdateDocument({ ...documentData, primaryIndicators: updated });
  };

  // Import Parser
  const handleParseImport = () => {
    if (!importText.trim()) return;
    const lines = importText.trim().split('\n');
    const newRows: GradebookMiddleHighRow[] = [];
    const newPrimaryRows: PrimaryEvaluationStudentRow[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(/[,\t;|]+/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length === 0 || !parts[0]) return;

      const name = parts[0];
      const e1 = parts[1] || '';
      const e2 = parts[2] || '';
      const e3 = parts[3] || '';
      const act = parts[4] || '';

      newRows.push({
        id: `imp-${Date.now()}-${idx}`,
        studentNumber: idx + 1,
        studentName: name,
        exam1: e1,
        exam2: e2,
        exam3: e3,
        exam4: '',
        activities: act,
        notes: '',
      });

      newPrimaryRows.push({
        id: `imp-p-${Date.now()}-${idx}`,
        studentNumber: idx + 1,
        studentName: name,
        ratings: {},
        generalAppreciation: 'مكتسب ومتمكن',
        notes: '',
      });
    });

    if (newRows.length > 0) {
      if (gradebookType === 'middle_high') {
        setMiddleStudents(newRows);
        onUpdateDocument({ ...documentData, gradebookMiddleHighRows: newRows });
      } else {
        setPrimaryStudents(newPrimaryRows);
        onUpdateDocument({ ...documentData, primaryStudentRows: newPrimaryRows });
      }
      setShowImportModal(false);
      setImportText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  // Export & Print
  const handlePrint = () => {
    triggerBrowserPrint(documentData.pageFormat || 'a4_landscape');
  };

  const handleExportPDF = () => {
    exportDocument('gradebook-printable-area', documentData, 'pdf');
  };

  const handleExportExcelCSV = () => {
    let csv = '';
    if (gradebookType === 'middle_high') {
      csv = 'ر.ت,اسم التلميذ(ة),الفرض 1,الفرض 2,الفرض 3,الفرض 4,الأنشطة المندمجة,المعدل العام,الترتيب,التقدير,ملاحظات الأستاذ\n';
      calculatedMiddleStudents.forEach((st) => {
        csv += `"${st.studentNumber}","${st.studentName}","${st.exam1}","${st.exam2}","${st.exam3}","${st.exam4}","${st.activities}","${st.calculatedAverage}","${st.rank}","${st.appreciation}","${st.notes}"\n`;
      });
    } else {
      csv = 'ر.ت,اسم التلميذ(ة),' + primaryIndicators.map((i) => `"${i.componentName}"`).join(',') + ',التقدير العام,ملاحظات\n';
      primaryStudents.forEach((st) => {
        const ratings = primaryIndicators.map((i) => `"${st.ratings[i.id] || ''}"`).join(',');
        csv += `"${st.studentNumber}","${st.studentName}",${ratings},"${st.generalAppreciation}","${st.notes}"\n`;
      });
    }

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `سجل_النقط_${documentData.subjectNameAr || 'المادة'}_${documentData.grade || 'المستوى'}_2026-2027.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGradebookType('middle_high');
                onUpdateDocument({ ...documentData, gradebookType: 'middle_high' });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                gradebookType === 'middle_high'
                  ? 'bg-[#065F46] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              سجل الإعدادي والتأهيلي (نقط عددية ومعاملات)
            </button>

            <button
              onClick={() => {
                setGradebookType('primary');
                onUpdateDocument({ ...documentData, gradebookType: 'primary' });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                gradebookType === 'primary'
                  ? 'bg-[#065F46] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              سجل الابتدائي (مكونات وكفايات)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {gradebookType === 'middle_high' ? (
              <>
                <button
                  onClick={() => setShowCoeffModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
                >
                  <Settings2 className="w-4 h-4 text-amber-700" />
                  <span>تعديل المعاملات والأوزان</span>
                </button>

                <button
                  onClick={handleAddMiddleStudent}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#065F46] text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تلميذ(ة)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowIndicatorsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  <Settings2 className="w-4 h-4 text-emerald-700" />
                  <span>تعديل مكونات الكفايات ({primaryIndicators.length})</span>
                </button>

                <button
                  onClick={handleAddPrimaryStudent}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#065F46] text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تلميذ(ة)</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Upload className="w-4 h-4 text-blue-700" />
              <span>استيراد Excel / CSV</span>
            </button>

            <button
              onClick={handleExportExcelCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>تحميل PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#065F46] text-white hover:bg-emerald-900 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة السجل</span>
            </button>
          </div>
        </div>

        {/* Quick Toggles Sub-Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOfficialEmblem}
                onChange={(e) => {
                  setShowOfficialEmblem(e.target.checked);
                  onUpdateDocument({ ...documentData, showEmblem: e.target.checked });
                }}
                className="rounded-sm text-[#065F46] focus:ring-0"
              />
              <span className="font-semibold">إظهار الشعار الرسمي</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRank}
                onChange={(e) => setShowRank(e.target.checked)}
                className="rounded-sm text-[#065F46] focus:ring-0"
              />
              <span className="font-semibold">إظهار عمود الترتيب</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(e) => setShowNotes(e.target.checked)}
                className="rounded-sm text-[#065F46] focus:ring-0"
              />
              <span className="font-semibold">إظهار عمود الملاحظات</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSignatures}
                onChange={(e) => setShowSignatures(e.target.checked)}
                className="rounded-sm text-[#065F46] focus:ring-0"
              />
              <span className="font-semibold">إظهار خانات التوقيع والمصادقة</span>
            </label>
          </div>

          <button
            onClick={() => setShowStatsDrawer(!showStatsDrawer)}
            className="inline-flex items-center gap-1 text-[#065F46] hover:underline font-bold"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{showStatsDrawer ? 'إخفاء إحصائيات القسم' : 'عرض إحصائيات ونسب القسم'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Analytics / KPI Drawer */}
      {showStatsDrawer && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#065F46]" />
              <span>إحصائيات ونتائج القسم الإجمالية ({classStats.total} تلميذ(ة))</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">تحديث فوري وتلقائي</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-[11px] text-emerald-800 font-bold">معدل القسم العام</div>
              <div className="text-xl font-extrabold text-emerald-950 mt-1">
                {classStats.average > 0 ? `${classStats.average} / 20` : '—'}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="text-[11px] text-blue-800 font-bold">أعلى نقطة بالقسم</div>
              <div className="text-xl font-extrabold text-blue-950 mt-1">
                {classStats.highest > 0 ? `${classStats.highest} / 20` : '—'}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="text-[11px] text-purple-800 font-bold">نسبة الاستيفاء (≥ 10)</div>
              <div className="text-xl font-extrabold text-purple-950 mt-1">
                {classStats.passRate}%
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-[11px] text-amber-800 font-bold">أدنى نقطة بالقسم</div>
              <div className="text-xl font-extrabold text-amber-950 mt-1">
                {classStats.lowest > 0 ? `${classStats.lowest} / 20` : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet Canvas */}
      <div className="bg-slate-100 p-4 sm:p-8 rounded-3xl overflow-x-auto flex justify-center">
        
        <div
          id="gradebook-printable-area"
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full min-w-[950px] max-w-[1250px]"
        >
          {/* Moroccan Official Header */}
          <div className="border-b-2 border-[#065F46] pb-3 mb-5">
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              
              <div className="col-span-4 text-right space-y-0.5">
                <div className="font-bold text-slate-900">{documentData.kingdomHeader}</div>
                <div className="font-bold text-slate-800 text-[10px]">{documentData.ministryHeader}</div>
                <div className="text-slate-600 text-[10px]">{documentData.academy} - {documentData.directorate}</div>
                <div className="font-bold text-[#065F46] text-[11px]">{documentData.schoolName}</div>
              </div>

              <div className="col-span-4 flex flex-col items-center justify-center text-center">
                {showOfficialEmblem ? (
                  <MoroccanOfficialEmblem size="sm" showMotto={true} language="ar" />
                ) : (
                  <div className="text-sm font-bold text-[#065F46] font-serif">
                    المملكة المغربية • وزارة التربية الوطنية
                  </div>
                )}
                <div className="mt-1 px-3 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-[#065F46]">
                  {gradebookType === 'middle_high' ? 'سجل المراقبة المستمرة والنقط' : 'شبكة تقويم الكفايات والمكتسبات'}
                </div>
              </div>

              <div className="col-span-4 text-left space-y-0.5 text-[10px]">
                <div><span className="text-slate-500">المادة:</span> <strong className="text-slate-900">{documentData.subjectNameAr}</strong></div>
                <div><span className="text-slate-500">المستوى:</span> <strong className="text-slate-900">{documentData.grade} ({documentData.classGroup})</strong></div>
                <div><span className="text-slate-500">الأستاذ(ة):</span> <strong className="text-slate-900">{documentData.teacherName}</strong></div>
                <div><span className="text-slate-500">الموسم الدراسي:</span> <strong className="text-slate-900">{documentData.academicYear}</strong></div>
              </div>

            </div>
          </div>

          {/* Table View: Middle & Secondary */}
          {gradebookType === 'middle_high' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse border border-slate-300">
                <thead className="bg-[#065F46] text-white">
                  <tr>
                    <th className="border border-emerald-800 p-2 text-center w-10">ر.ت</th>
                    <th className="border border-emerald-800 p-2 min-w-[160px]">الاسم الكامل للتلميذ(ة)</th>
                    <th className="border border-emerald-800 p-2 text-center w-16">
                      <div>الفرض 1</div>
                      <div className="text-[9px] opacity-80 font-normal">({coefficients.exam1}%)</div>
                    </th>
                    <th className="border border-emerald-800 p-2 text-center w-16">
                      <div>الفرض 2</div>
                      <div className="text-[9px] opacity-80 font-normal">({coefficients.exam2}%)</div>
                    </th>
                    <th className="border border-emerald-800 p-2 text-center w-16">
                      <div>الفرض 3</div>
                      <div className="text-[9px] opacity-80 font-normal">({coefficients.exam3}%)</div>
                    </th>
                    {coefficients.exam4 > 0 && (
                      <th className="border border-emerald-800 p-2 text-center w-16">
                        <div>الفرض 4</div>
                        <div className="text-[9px] opacity-80 font-normal">({coefficients.exam4}%)</div>
                      </th>
                    )}
                    <th className="border border-emerald-800 p-2 text-center w-20">
                      <div>الأنشطة</div>
                      <div className="text-[9px] opacity-80 font-normal">({coefficients.activities}%)</div>
                    </th>
                    <th className="border border-emerald-800 p-2 text-center w-20 bg-amber-600 font-extrabold text-white">
                      المعدل العام
                    </th>
                    {showRank && (
                      <th className="border border-emerald-800 p-2 text-center w-14">الترتيب</th>
                    )}
                    <th className="border border-emerald-800 p-2 text-center min-w-[110px]">التقدير</th>
                    {showNotes && (
                      <th className="border border-emerald-800 p-2 min-w-[130px]">ملاحظات الأستاذ(ة)</th>
                    )}
                    <th className="border border-emerald-800 p-2 text-center w-10 no-print">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {calculatedMiddleStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-700 bg-slate-50">
                        {st.studentNumber}
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        <input
                          type="text"
                          value={st.studentName}
                          onChange={(e) => handleUpdateMiddleStudent(st.id, 'studentName', e.target.value)}
                          placeholder="اسم التلميذ..."
                          className="w-full bg-transparent outline-hidden font-bold"
                        />
                      </td>
                      <td className="border border-slate-300 p-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={st.exam1}
                          onChange={(e) => handleUpdateMiddleStudent(st.id, 'exam1', e.target.value)}
                          className="w-full text-center bg-transparent outline-hidden font-bold text-slate-800"
                        />
                      </td>
                      <td className="border border-slate-300 p-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={st.exam2}
                          onChange={(e) => handleUpdateMiddleStudent(st.id, 'exam2', e.target.value)}
                          className="w-full text-center bg-transparent outline-hidden font-bold text-slate-800"
                        />
                      </td>
                      <td className="border border-slate-300 p-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={st.exam3}
                          onChange={(e) => handleUpdateMiddleStudent(st.id, 'exam3', e.target.value)}
                          className="w-full text-center bg-transparent outline-hidden font-bold text-slate-800"
                        />
                      </td>
                      {coefficients.exam4 > 0 && (
                        <td className="border border-slate-300 p-1 text-center">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            value={st.exam4}
                            onChange={(e) => handleUpdateMiddleStudent(st.id, 'exam4', e.target.value)}
                            className="w-full text-center bg-transparent outline-hidden font-bold text-slate-800"
                          />
                        </td>
                      )}
                      <td className="border border-slate-300 p-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={st.activities}
                          onChange={(e) => handleUpdateMiddleStudent(st.id, 'activities', e.target.value)}
                          className="w-full text-center bg-transparent outline-hidden font-bold text-slate-800"
                        />
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-extrabold text-sm bg-amber-50 text-amber-900">
                        {st.calculatedAverage}
                      </td>
                      {showRank && (
                        <td className="border border-slate-300 p-2 text-center font-bold text-slate-700">
                          #{st.rank}
                        </td>
                      )}
                      <td className="border border-slate-300 p-2 text-center font-semibold text-xs text-slate-800">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            (st.calculatedAverage || 0) >= 14
                              ? 'bg-emerald-100 text-emerald-900'
                              : (st.calculatedAverage || 0) >= 10
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {st.appreciation}
                        </span>
                      </td>
                      {showNotes && (
                        <td className="border border-slate-300 p-1">
                          <input
                            type="text"
                            value={st.notes}
                            onChange={(e) => handleUpdateMiddleStudent(st.id, 'notes', e.target.value)}
                            placeholder="ملاحظة..."
                            className="w-full bg-transparent text-xs text-slate-700 outline-hidden"
                          />
                        </td>
                      )}
                      <td className="border border-slate-300 p-1 text-center no-print">
                        <button
                          onClick={() => handleDeleteMiddleStudent(st.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table View: Primary Competencies */}
          {gradebookType === 'primary' && (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse border border-slate-300">
                <thead className="bg-[#065F46] text-white">
                  <tr>
                    <th className="border border-emerald-800 p-2 text-center w-10">ر.ت</th>
                    <th className="border border-emerald-800 p-2 min-w-[160px]">الاسم الكامل للتلميذ(ة)</th>
                    {primaryIndicators.map((ind) => (
                      <th key={ind.id} className="border border-emerald-800 p-2 text-center min-w-[120px]">
                        <div className="font-bold">{ind.componentName}</div>
                        <div className="text-[9px] opacity-85 font-normal leading-tight mt-0.5">
                          {ind.indicatorDescription}
                        </div>
                      </th>
                    ))}
                    <th className="border border-emerald-800 p-2 text-center min-w-[130px] bg-amber-600 font-bold">
                      التقدير والقرار العام
                    </th>
                    {showNotes && (
                      <th className="border border-emerald-800 p-2 min-w-[130px]">ملاحظات ودعم</th>
                    )}
                    <th className="border border-emerald-800 p-2 text-center w-10 no-print">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {primaryStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="border border-slate-300 p-2 text-center font-bold text-slate-700 bg-slate-50">
                        {st.studentNumber}
                      </td>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        <input
                          type="text"
                          value={st.studentName}
                          onChange={(e) => {
                            const updated = primaryStudents.map((s) =>
                              s.id === st.id ? { ...s, studentName: e.target.value } : s
                            );
                            setPrimaryStudents(updated);
                          }}
                          placeholder="اسم التلميذ..."
                          className="w-full bg-transparent outline-hidden font-bold"
                        />
                      </td>

                      {primaryIndicators.map((ind) => {
                        const currentVal = st.ratings[ind.id] || 'good';
                        return (
                          <td key={ind.id} className="border border-slate-300 p-1 text-center">
                            <select
                              value={currentVal}
                              onChange={(e) => handleUpdatePrimaryRating(st.id, ind.id, e.target.value)}
                              className={`w-full text-center text-[10px] font-bold py-1 px-1 rounded-md border outline-hidden ${
                                currentVal === 'excellent'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : currentVal === 'veryGood'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : currentVal === 'good'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}
                            >
                              <option value="excellent">مكتسب بتفوق (+++)</option>
                              <option value="veryGood">مكتسب (++)</option>
                              <option value="good">في طور الاكتساب (+)</option>
                              <option value="needsSupport">غير مكتسب (-)</option>
                            </select>
                          </td>
                        );
                      })}

                      <td className="border border-slate-300 p-1">
                        <input
                          type="text"
                          value={st.generalAppreciation}
                          onChange={(e) => {
                            const updated = primaryStudents.map((s) =>
                              s.id === st.id ? { ...s, generalAppreciation: e.target.value } : s
                            );
                            setPrimaryStudents(updated);
                          }}
                          placeholder="التقدير العام..."
                          className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden"
                        />
                      </td>

                      {showNotes && (
                        <td className="border border-slate-300 p-1">
                          <input
                            type="text"
                            value={st.notes}
                            onChange={(e) => {
                              const updated = primaryStudents.map((s) =>
                                s.id === st.id ? { ...s, notes: e.target.value } : s
                              );
                              setPrimaryStudents(updated);
                            }}
                            placeholder="ملاحظات..."
                            className="w-full bg-transparent text-xs text-slate-600 outline-hidden"
                          />
                        </td>
                      )}

                      <td className="border border-slate-300 p-1 text-center no-print">
                        <button
                          onClick={() => handleDeletePrimaryStudent(st.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signature Boxes Block */}
          {showSignatures && (
            <div className="mt-8 pt-4 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[90px] flex flex-col justify-between">
                <span className="font-bold text-slate-800">توقيع وتأشيرة الأستاذ(ة):</span>
                <span className="text-[11px] text-slate-500 font-serif italic mt-6">{documentData.teacherName}</span>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[90px] flex flex-col justify-between">
                <span className="font-bold text-slate-800">توقيع السيد(ة) مدير(ة) المؤسسة:</span>
                <span className="text-[10px] text-slate-400 mt-6">(خاتم وتوقيع الإدارة)</span>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[90px] flex flex-col justify-between">
                <span className="font-bold text-slate-800">مفتش(ة) المقاطعة التربوية:</span>
                <span className="text-[10px] text-slate-400 mt-6">(تأشيرة المفتش التربوي)</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modal 1: Coefficients & Weights Config (Middle & High) */}
      {showCoeffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-700" />
                <span>ضبط معاملات وأوزان المراقبة المستمرة</span>
              </h3>
              <button
                onClick={() => setShowCoeffModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                حدد النسبة المئوية أو وزن كل فرض ونشاط. يتم حساب المعدل التلقائي بناء على هذه الأوزان:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الفرض 1 (%)</label>
                  <input
                    type="number"
                    value={coefficients.exam1}
                    onChange={(e) => setCoefficients({ ...coefficients, exam1: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الفرض 2 (%)</label>
                  <input
                    type="number"
                    value={coefficients.exam2}
                    onChange={(e) => setCoefficients({ ...coefficients, exam2: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الفرض 3 (%)</label>
                  <input
                    type="number"
                    value={coefficients.exam3}
                    onChange={(e) => setCoefficients({ ...coefficients, exam3: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الفرض 4 (إن وجد)</label>
                  <input
                    type="number"
                    value={coefficients.exam4}
                    onChange={(e) => setCoefficients({ ...coefficients, exam4: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">الأنشطة المندمجة والمشاركة (%)</label>
                  <input
                    type="number"
                    value={coefficients.activities}
                    onChange={(e) => setCoefficients({ ...coefficients, activities: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  onUpdateDocument({ ...documentData, gradebookCoefficients: coefficients });
                  setShowCoeffModal(false);
                }}
                className="px-5 py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                حفظ واعتماد المعاملات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Primary Indicators Config */}
      {showIndicatorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-700" />
                <span>إدارة مكونات وكفايات تقويم الابتدائي</span>
              </h3>
              <button
                onClick={() => setShowIndicatorsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Existing Indicators List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">المكونات الحالية ({primaryIndicators.length}):</span>
                {primaryIndicators.map((ind) => (
                  <div
                    key={ind.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{ind.componentName}</div>
                      <div className="text-[11px] text-slate-500">{ind.indicatorDescription}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteIndicator(ind.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Indicator Form */}
              <form onSubmit={handleAddIndicator} className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#065F46] block">إضافة مكون كفاية جديد:</span>
                <input
                  type="text"
                  required
                  placeholder="اسم المكون (مثال: التعبير الشفهي)..."
                  value={newIndName}
                  onChange={(e) => setNewIndName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-hidden"
                />
                <input
                  type="text"
                  placeholder="وصف المؤشر أو الكفاية المستهدفة..."
                  value={newIndDesc}
                  onChange={(e) => setNewIndDesc(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#065F46] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
                >
                  + إضافة المكون إلى الشبكة
                </button>
              </form>
            </div>

            <div className="flex items-center justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowIndicatorsModal(false)}
                className="px-5 py-2 bg-[#065F46] text-white font-bold text-xs rounded-xl"
              >
                إغلاق وتطبيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Import Excel / CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>استيراد لائحة التلاميذ من ملف Excel أو CSV</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                يمكنك رفع ملف CSV/TXT أو نسخ ولصق أسماء التلاميذ مباشرة (اسم التلميذ في كل سطر):
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, .txt"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>اختيار ملف من الحاسوب (.csv, .txt)</span>
              </button>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  أو الصق أسماء التلاميذ هنا مباشرة:
                </label>
                <textarea
                  rows={6}
                  placeholder={`محمد الإدريسي\nفاطمة الزهراء العلوي\nياسين بناني`}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleParseImport}
                disabled={!importText.trim()}
                className="px-5 py-2 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl disabled:opacity-50 transition-colors"
              >
                استيراد وتحديث الجدول
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
