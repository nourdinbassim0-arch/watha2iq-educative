import React, { useState } from 'react';
import { 
  FolderHeart, 
  Search, 
  Trash2, 
  Edit3, 
  Copy, 
  Download, 
  FileText, 
  PlusCircle, 
  Calendar, 
  School, 
  Layers,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DocumentData, DocumentType } from '../types';
import { DOCUMENT_TYPE_LABELS } from '../data/curriculumData';

interface SavedDocumentsListProps {
  documents?: DocumentData[];
  savedDocs?: DocumentData[];
  onOpenDocument?: (doc: DocumentData) => void;
  onEditDocument?: (doc: DocumentData) => void;
  onDuplicateDocument?: (doc: DocumentData) => void;
  onDeleteDocument?: (id: string) => void;
  onExportDocument?: (doc: DocumentData) => void;
  onDirectExport?: (doc: DocumentData) => void;
  onCreateNew?: () => void;
  onStartNewDocument?: () => void;
}

export const SavedDocumentsList: React.FC<SavedDocumentsListProps> = ({
  documents,
  savedDocs,
  onOpenDocument,
  onEditDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onExportDocument,
  onDirectExport,
  onCreateNew,
  onStartNewDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Support both prop interfaces
  const docList = documents || savedDocs || [];
  const handleOpen = onOpenDocument || onEditDocument || (() => {});
  const handleDuplicate = onDuplicateDocument || (() => {});
  const handleDelete = onDeleteDocument || (() => {});
  const handleExport = onExportDocument || onDirectExport || (() => {});
  const handleNew = onCreateNew || onStartNewDocument || (() => {});

  const filteredDocs = docList.filter((doc) => {
    const matchesSearch = 
      (doc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.subjectNameAr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.grade || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.lessonTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || doc.documentType === filterType;

    return matchesSearch && matchesType;
  });

  const docTypesSummary: DocumentType[] = Array.from(new Set(docList.map(d => d.documentType)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold mb-2 border border-[#A7F3D0]">
            <FolderHeart className="w-3.5 h-3.5 text-[#065F46]" />
            <span>خزانة الوثائق المحفوظة للأستاذ(ة)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            وثائقي المحفوظة ({docList.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            جميع الجذاذات والفروض والمواثيق والشبكات التي قمت بإنشائها وتعديلها محفوظة محلياً، ويمكنك إعادة فتحها وتعديلها أو استنساخها وتحميلها بصيغة PDF وطباعتها في أي وقت.
          </p>
        </div>

        <button
          id="btn-new-doc-from-saved"
          onClick={handleNew}
          className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xs transition-all active:scale-95 border border-[#044735] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء وثيقة جديدة</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      {docList.length > 0 && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-saved-docs"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في وثائقك المحفوظة بالعنوان، المادة، المستوى أو المؤسسة..."
              className="w-full bg-white border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#065F46] shadow-2xs"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                filterType === 'all'
                  ? 'bg-[#065F46] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              الكل ({docList.length})
            </button>
            {docTypesSummary.map((dt) => {
              const count = docList.filter(d => d.documentType === dt).length;
              const label = DOCUMENT_TYPE_LABELS[dt]?.ar || dt;
              return (
                <button
                  key={dt}
                  onClick={() => setFilterType(dt)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    filterType === dt
                      ? 'bg-[#065F46] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {docList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto mb-4 border border-[#A7F3D0]">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            لا توجد وثائق محفوظة بعد
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            عند إنشاء وثيقة أو جذاذة والضغط على زر «حفظ الوثيقة» في شريط أدوات المحرر، ستظهر هنا فوراً للرجوع إليها وتعديلها وتحميلها.
          </p>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-xs transition-all border border-[#044735]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء أول وثيقة الآن</span>
          </button>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">لا توجد وثائق مطابقة لكلمات البحث أو التصنيف المحدد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const labelObj = DOCUMENT_TYPE_LABELS[doc.documentType] || { ar: 'وثيقة تربوية', fr: 'Document' };
            const formattedDate = new Date(doc.updatedAt || doc.createdAt || Date.now()).toLocaleDateString('ar-MA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={doc.id}
                id={`saved-doc-card-${doc.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      {labelObj.ar}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-3 group-hover:text-[#065F46] transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">المادة:</span>
                      <span className="font-bold text-slate-800">{doc.language === 'fr' ? doc.subjectNameFr || doc.subjectNameAr : doc.subjectNameAr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">المستوى:</span>
                      <span className="font-bold text-slate-800">{doc.grade}</span>
                    </div>
                    <div className="flex items-center justify-between truncate">
                      <span className="text-slate-500 font-semibold">المؤسسة:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">{doc.schoolName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpen(doc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#065F46] hover:bg-[#044735] text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs transition-all border border-[#044735]"
                    title="فتح الوثيقة في المحرر لتعديلها ومعاينتها"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل ومعاينة</span>
                  </button>

                  <button
                    onClick={() => handleExport(doc)}
                    title="تحميل وتصدير الوثيقة (PDF / Word)"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#065F46] hover:bg-[#ECFDF5] text-slate-600 hover:text-[#065F46] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(doc)}
                    title="استنساخ وإنشاء نسخة مكررة"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الوثيقة من خزانة وثائقك؟')) {
                        handleDelete(doc.id);
                      }
                    }}
                    title="حذف الوثيقة نهائياً"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-500 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
