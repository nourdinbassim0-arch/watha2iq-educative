import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  FileSpreadsheet, 
  ScrollText, 
  FileCheck, 
  HeartHandshake, 
  TableProperties, 
  Award, 
  FileText, 
  Download, 
  Edit3, 
  Globe2, 
  Check, 
  GraduationCap, 
  Filter
} from 'lucide-react';
import { DocumentData, DocumentType, EducationLevel } from '../types';
import { STARTER_TEMPLATES } from '../data/templatesData';
import { DOCUMENT_TYPE_LABELS, EDUCATION_LEVELS } from '../data/curriculumData';

interface TemplatesGalleryProps {
  onSelectTemplate: (template: DocumentData) => void;
  onDirectExport: (template: DocumentData) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onSelectTemplate,
  onDirectExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTemplates = STARTER_TEMPLATES.filter((tpl) => {
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subjectNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.subjectNameFr && tpl.subjectNameFr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tpl.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.grade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || tpl.level === selectedLevel;
    const matchesType = selectedType === 'all' || tpl.documentType === selectedType;

    return matchesSearch && matchesLevel && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold mb-3 border border-[#FDE68A]">
          <BookOpen className="w-4 h-4 text-[#D97706]" />
          <span>بنك الوثائق والنماذج التربوية الجاهزة</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#2D3436] mb-2">
          مكتبة النماذج الرسمية القابلة للتعديل
        </h2>
        <p className="text-[#6B7280] text-sm sm:text-base">
          تصفح نماذج جذاذات، مواثيق أقسام، وفروض محروسة وشبكات تنقيط متوافقة 100% مع المنهاج المغربي والتوجيهات البيداغوجية الرسمية.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Field */}
          <div className="sm:col-span-6 relative">
            <Search className="w-5 h-5 text-[#9CA3AF] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، المادة، الدرس، أو المستوى..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl pr-11 pl-4 py-2.5 text-sm text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-[#065F46] focus:bg-white transition-colors"
            />
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-sm text-[#374151] focus:outline-hidden focus:ring-2 focus:ring-[#065F46] font-semibold"
            >
              <option value="all">جميع الأسلاك التعليمية</option>
              <option value="primary">التعليم الابتدائي</option>
              <option value="middle">التعليم الثانوي الإعدادي</option>
              <option value="high">التعليم الثانوي التأهيلي</option>
            </select>
          </div>

          {/* Document Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-sm text-[#374151] focus:outline-hidden focus:ring-2 focus:ring-[#065F46] font-semibold"
            >
              <option value="all">جميع أنواع الوثائق</option>
              <option value="fiche_pedagogique">جذاذات وتخطيطات تربوية</option>
              <option value="charte_classe">مواثيق الأقسام</option>
              <option value="controle_devoir">فروض واختبارات</option>
              <option value="evaluation_soutien">أنشطة التقويم والدعم</option>
              <option value="grille_notation">شبكات التنقيط والتفريغ</option>
              <option value="rapport_conseil">تقارير مجالس الأقسام</option>
              <option value="attestation_affiche">الشواهد والملصقات</option>
            </select>
          </div>

        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] p-8">
          <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#1F2937]">لا توجد نماذج مطابقة لبحثك</h3>
          <p className="text-sm text-[#6B7280] mt-1">جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedType('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#ECFDF5] text-[#065F46] font-bold text-xs hover:bg-[#D1FAE5] transition-colors"
          >
            إعادة تعيين البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const labelObj = DOCUMENT_TYPE_LABELS[template.documentType];
            const isFr = template.language === 'fr';

            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#065F46]"
              >
                {/* Card Header Top bar */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      {labelObj.ar}
                    </span>

                    {isFr ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                        <Globe2 className="w-3 h-3" />
                        <span>Français (BIOF)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563]">
                        <span>بالعربية</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-[#1F2937] text-base group-hover:text-[#065F46] transition-colors leading-snug mb-2 line-clamp-2">
                    {template.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#374151]">المادة:</span>
                      <span>{isFr ? template.subjectNameFr || template.subjectNameAr : template.subjectNameAr}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#374151]">المستوى:</span>
                      <span className="text-[#4B5563]">{template.grade}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#374151]">المؤسسة:</span>
                      <span className="text-[#6B7280] truncate">{template.schoolName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Preview Details Mini Box */}
                <div className="px-5 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#6B7280] flex items-center justify-between">
                  <span className="text-[#6B7280] font-medium truncate max-w-[200px]">
                    {template.unitOrModule}
                  </span>
                  <span className="bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-md text-[10px] font-bold text-[#374151]">
                    {template.duration}
                  </span>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-[#F9FAFB]/60 border-t border-[#E5E7EB] flex items-center gap-2">
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#065F46] hover:bg-[#044735] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-95 border border-[#044735]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل ومعاينة</span>
                  </button>

                  <button
                    onClick={() => onDirectExport(template)}
                    title="تحميل مباشر"
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#065F46] bg-white hover:bg-[#ECFDF5] text-[#4B5563] hover:text-[#065F46] transition-colors"
                  >
                    <Download className="w-4 h-4" />
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
