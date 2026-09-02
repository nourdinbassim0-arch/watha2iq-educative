import React, { useState } from 'react';
import { 
  PlusCircle, 
  FolderHeart, 
  Edit3, 
  Download, 
  Copy, 
  Trash2, 
  Calendar, 
  School, 
  Sparkles, 
  Zap, 
  Search,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { DocumentData } from '../types';
import { useAuth } from '../context/AuthContext';
import { DOCUMENT_TYPE_LABELS } from '../data/curriculumData';

interface DashboardProps {
  documents: DocumentData[];
  onStartNewDocument: () => void;
  onOpenDocument: (doc: DocumentData) => void;
  onDuplicateDocument: (doc: DocumentData) => void;
  onDeleteDocument: (id: string) => void;
  onExportDocument: (doc: DocumentData) => void;
  onViewAccount: () => void;
  onViewPricing: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onStartNewDocument,
  onOpenDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onExportDocument,
  onViewAccount,
  onViewPricing,
}) => {
  const { profile, user, isPro, isOwner, dailyUsage, platformSettings } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = profile?.name || user?.displayName || 'الأستاذ(ة)';
  const dailyLimit = platformSettings.freeDailyLimit || 3;
  const remainingToday = Math.max(0, dailyLimit - (dailyUsage?.used || 0));

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (doc.title || '').toLowerCase().includes(query) ||
      (doc.subjectNameAr || '').toLowerCase().includes(query) ||
      (doc.grade || '').toLowerCase().includes(query) ||
      (doc.schoolName || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👋</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              مرحبًا بك، {displayName}
            </h2>
            {isPro || isOwner ? (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                <span>باقة PRO غير محدودة</span>
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                باقة مجانية ({remainingToday} وثائق متبقية اليوم)
              </span>
            )}
          </div>
          
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            فضاء التوثيق والتخطيط البيداغوجي المعتمد. يمكنك إنشاء جذاذة تربوية رسمية جديدة ومحررة بدقة، أو متابعة تعديل وتصدير وثائقك السابقة.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          id="dashboard-btn-create-doc"
          onClick={onStartNewDocument}
          className="inline-flex items-center gap-2.5 bg-[#065F46] hover:bg-[#044735] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#044735] shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ إنشاء وثيقة جديدة</span>
        </button>
      </div>

      {/* Main Section: My Documents */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-[#065F46]" />
              <span>وثائقي ({documents.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              جميع الوثائق والجذاذات المرتبطة بحسابك والمحفوظة في السحابة
            </p>
          </div>

          {/* Search bar (only if documents exist) */}
          {documents.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في وثائقك..."
                className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#065F46]"
              />
            </div>
          )}
        </div>

        {/* Empty State when user has no documents */}
        {documents.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto mb-4 border border-[#A7F3D0]">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              لا توجد وثائق بعد
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              ابدأ الآن بإنشاء أول جذاذة تربوية رسمية مطابقة للتوجيهات الوزارية المغربية.
            </p>
            <button
              onClick={onStartNewDocument}
              className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-xs transition-all border border-[#044735]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إنشاء وثيقة جديدة</span>
            </button>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs sm:text-sm text-slate-500">لا توجد وثائق مطابقة لكلمات البحث.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const labelObj = DOCUMENT_TYPE_LABELS[doc.documentType] || { ar: 'جذاذة تربوية', fr: 'Fiche' };
              const formattedDate = new Date(doc.updatedAt || doc.createdAt || Date.now()).toLocaleDateString('ar-MA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={doc.id}
                  id={`dashboard-doc-card-${doc.id}`}
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

                    <h4 className="font-bold text-slate-900 text-base line-clamp-2 mb-3 group-hover:text-[#065F46] transition-colors leading-snug">
                      {doc.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">المادة:</span>
                        <span className="font-bold text-slate-800">
                          {doc.language === 'fr' ? doc.subjectNameFr || doc.subjectNameAr : doc.subjectNameAr}
                        </span>
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

                  {/* Card Action Buttons */}
                  <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#065F46] hover:bg-[#044735] text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs transition-all border border-[#044735]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل ومعاينة</span>
                    </button>

                    <button
                      onClick={() => onExportDocument(doc)}
                      title="تحميل وتصدير الوثيقة (PDF / صورة)"
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#065F46] hover:bg-[#ECFDF5] text-slate-600 hover:text-[#065F46] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicateDocument(doc)}
                      title="استنساخ الوثيقة"
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الوثيقة؟')) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      title="حذف الوثيقة"
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

    </div>
  );
};
