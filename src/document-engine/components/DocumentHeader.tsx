import React from 'react';
import { MoroccanOfficialEmblem } from '../../components/MoroccanOfficialEmblem';
import { DocumentData } from '../../types';

export interface DocumentHeaderProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateHeaderField?: (field: keyof DocumentData, value: any) => void;
  showOfficialHeader?: boolean;
  showSchoolLogo?: boolean;
  language?: 'ar' | 'fr' | 'en';
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentData,
  isEditable = false,
  onUpdateHeaderField,
  showOfficialHeader = true,
  showSchoolLogo = true,
  language = 'ar',
}) => {
  if (!showOfficialHeader) return null;

  const isRtl = language === 'ar';
  const isFr = language === 'fr';

  return (
    <header className="w-full pb-3 mb-4 border-b-2 border-slate-700/80 relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-12 items-center gap-2 sm:gap-4">
        
        {/* Right / Left Side (Academy & Directorate Info) */}
        <div className="col-span-4 text-center sm:text-start space-y-0.5 text-xs text-slate-800">
          <div className="font-bold text-[11px] text-emerald-950">
            {documentData.kingdomHeader || 'المملكة المغربية'}
          </div>
          
          <div className="font-semibold text-[10px] text-slate-700 leading-tight">
            {documentData.ministryHeader || 'وزارة التربية الوطنية والتعليم الأولي والرياضة'}
          </div>

          <div className="text-[10px] text-slate-600">
            {isEditable && onUpdateHeaderField ? (
              <input
                type="text"
                value={documentData.academy || ''}
                onChange={(e) => onUpdateHeaderField('academy', e.target.value)}
                placeholder="الأكاديمية الجهوية..."
                className="bg-transparent border-b border-dashed border-slate-300 w-full text-[10px] py-0.5 outline-hidden"
              />
            ) : (
              <span>{documentData.academy || 'الأكاديمية الجهوية للتربية والتكوين'}</span>
            )}
          </div>

          <div className="text-[10px] text-slate-600">
            {isEditable && onUpdateHeaderField ? (
              <input
                type="text"
                value={documentData.directorate || ''}
                onChange={(e) => onUpdateHeaderField('directorate', e.target.value)}
                placeholder="المديرية الإقليمية..."
                className="bg-transparent border-b border-dashed border-slate-300 w-full text-[10px] py-0.5 outline-hidden"
              />
            ) : (
              <span>{documentData.directorate || 'المديرية الإقليمية'}</span>
            )}
          </div>

          <div className="font-bold text-[10px] text-emerald-900 pt-0.5">
            {isEditable && onUpdateHeaderField ? (
              <input
                type="text"
                value={documentData.schoolName || ''}
                onChange={(e) => onUpdateHeaderField('schoolName', e.target.value)}
                placeholder="المؤسسة التعليمية..."
                className="bg-transparent border-b border-dashed border-slate-300 font-bold w-full text-[10px] py-0.5 outline-hidden"
              />
            ) : (
              <span>{documentData.schoolName || 'المؤسسة التعليمية'}</span>
            )}
          </div>
        </div>

        {/* Center: Moroccan Official Coat of Arms Emblem */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center">
          {showSchoolLogo && (
            <div className="scale-90 sm:scale-100 transform">
              <MoroccanOfficialEmblem size="md" showMotto={true} language={language} />
            </div>
          )}
        </div>

        {/* Opposite Side: Teacher, Subject, Academic Year & Class */}
        <div className="col-span-4 text-center sm:text-end space-y-0.5 text-xs text-slate-800">
          <div className="font-bold text-[11px] text-emerald-950">
            {isFr ? 'Année scolaire : ' : 'السنة الدراسية: '}
            {isEditable && onUpdateHeaderField ? (
              <input
                type="text"
                value={documentData.academicYear || '2026 - 2027'}
                onChange={(e) => onUpdateHeaderField('academicYear', e.target.value)}
                className="bg-transparent border-b border-dashed border-slate-300 w-24 text-center text-[10px] py-0.5 outline-hidden"
              />
            ) : (
              <span>{documentData.academicYear || '2026 - 2027'}</span>
            )}
          </div>

          <div className="text-[10px]">
            <span className="font-semibold text-slate-600">{isFr ? 'Matière : ' : 'المادة: '}</span>
            <span className="font-bold text-emerald-900">
              {isFr ? documentData.subjectNameFr || documentData.subjectNameAr : documentData.subjectNameAr}
            </span>
          </div>

          <div className="text-[10px]">
            <span className="font-semibold text-slate-600">{isFr ? 'Niveau : ' : 'المستوى: '}</span>
            <span className="font-bold text-slate-900">{documentData.grade}</span>
          </div>

          <div className="text-[10px]">
            <span className="font-semibold text-slate-600">{isFr ? 'Enseignant(e) : ' : 'الأستاذ(ة): '}</span>
            {isEditable && onUpdateHeaderField ? (
              <input
                type="text"
                value={documentData.teacherName || ''}
                onChange={(e) => onUpdateHeaderField('teacherName', e.target.value)}
                placeholder="اسم الأستاذ..."
                className="bg-transparent border-b border-dashed border-slate-300 text-[10px] py-0.5 outline-hidden w-28 text-center"
              />
            ) : (
              <span className="font-bold text-slate-800">{documentData.teacherName}</span>
            )}
          </div>

          {documentData.documentDate && (
            <div className="text-[9px] text-slate-500 pt-0.5">
              <span>{isFr ? 'Date : ' : 'التاريخ: '}</span>
              <span>{documentData.documentDate}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
