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
  Layers
} from 'lucide-react';
import { DocumentData } from '../types';
import { DOCUMENT_TYPE_LABELS } from '../data/curriculumData';

interface SavedDocumentsListProps {
  documents: DocumentData[];
  onOpenDocument: (doc: DocumentData) => void;
  onDuplicateDocument: (doc: DocumentData) => void;
  onDeleteDocument: (id: string) => void;
  onExportDocument: (doc: DocumentData) => void;
  onCreateNew: () => void;
}

export const SavedDocumentsList: React.FC<SavedDocumentsListProps> = ({
  documents,
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onExportDocument,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subjectNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold mb-2 border border-[#FDE68A]">
            <FolderHeart className="w-3.5 h-3.5 text-[#D97706]" />
            <span>خزانة الوثائق الشخصية للأستاذ(ة)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D3436]">
            وثائقي المحفوظة ({documents.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            جميع الوثائق والجذاذات التي قمت بإنشائها وتعديلها محفوظة محلياً ويمكنك استرجاعها أو تعديلها في أي وقت.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 border border-[#044735]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء وثيقة جديدة</span>
        </button>
      </div>

      {/* Search Input */}
      {documents.length > 0 && (
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-[#9CA3AF] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في وثائقك المحفوظة..."
            className="w-full bg-white border border-[#E5E7EB] rounded-2xl pr-11 pl-4 py-3 text-sm text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-[#065F46] shadow-xs"
          />
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto mb-4">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-1">
            لا توجد وثائق محفوظة بعد
          </h3>
          <p className="text-sm text-[#6B7280] max-w-md mx-auto mb-6">
            عند إنشاء جذاذة أو ميثاق قسم أو فرض والضغط على «حفظ الوثيقة» في المحرر، ستظهر هنا مباشرة للرجوع إليها وتصديرها.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-sm transition-all border border-[#044735]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء أول وثيقة الآن</span>
          </button>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-6">
          <p className="text-sm text-[#6B7280]">لا توجد وثائق مطابقة لكلمة البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const labelObj = DOCUMENT_TYPE_LABELS[doc.documentType];
            const formattedDate = new Date(doc.updatedAt || doc.createdAt).toLocaleDateString('ar-MA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      {labelObj.ar}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-[#1F2937] text-base line-clamp-2 mb-2">
                    {doc.title}
                  </h3>

                  <div className="space-y-1 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#374151]">المادة:</span>
                      <span>{doc.language === 'fr' ? doc.subjectNameFr || doc.subjectNameAr : doc.subjectNameAr}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#374151]">المستوى:</span>
                      <span>{doc.grade}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <School className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                      <span className="text-[#6B7280] truncate">{doc.schoolName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#065F46] hover:bg-[#044735] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xs transition-all border border-[#044735]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل ومعاينة</span>
                  </button>

                  <button
                    onClick={() => onExportDocument(doc)}
                    title="تحميل الوثيقة"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#065F46] hover:bg-[#ECFDF5] text-[#4B5563] hover:text-[#065F46] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDuplicateDocument(doc)}
                    title="استنساخ الوثيقة"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#D97706] hover:bg-[#FFFBEB] text-[#4B5563] hover:text-[#D97706] transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    title="حذف الوثيقة"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:border-red-500 hover:bg-red-50 text-[#4B5563] hover:text-red-700 transition-colors"
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
