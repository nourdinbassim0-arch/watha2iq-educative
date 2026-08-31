import React, { useRef } from 'react';
import { DocumentData } from '../../types';
import { MoroccanOfficialEmblem } from '../MoroccanOfficialEmblem';
import { Upload, Trash2, Building2 } from 'lucide-react';

interface DocumentHeaderProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateHeaderField?: (field: keyof DocumentData, value: any) => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentData,
  isEditable = false,
  onUpdateHeaderField,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRtl = documentData.language === 'ar';
  const isFr = documentData.language === 'fr';
  const showEmblem = documentData.showOfficialEmblem ?? true;
  const showLogo = documentData.showSchoolLogo ?? false;
  const logoUrl = documentData.customSchoolLogoUrl || documentData.customLogoUrl;

  if (!documentData.showOfficialHeader) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateHeaderField?.('customSchoolLogoUrl', result);
        onUpdateHeaderField?.('showSchoolLogo', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onUpdateHeaderField?.('customSchoolLogoUrl', '');
    onUpdateHeaderField?.('customLogoUrl', '');
    onUpdateHeaderField?.('showSchoolLogo', false);
  };

  return (
    <div className="border-b-2 border-[#065F46] pb-3 mb-4 select-text" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 3-Column Official Moroccan Header Structure with Anti-Overflow Protection */}
      <div className="grid grid-cols-12 gap-2 items-center text-xs overflow-hidden">
        
        {/* Column 1: Ministry / Academy / Directorate / School */}
        <div className={`col-span-4 ${isRtl ? 'text-right' : 'text-left'} space-y-0.5 min-w-0`}>
          <div className="font-bold text-[11px] text-[#1F2937] leading-tight break-words">
            {isEditable ? (
              <input
                type="text"
                value={documentData.kingdomHeader}
                onChange={(e) => onUpdateHeaderField?.('kingdomHeader', e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-bold break-words"
              />
            ) : (
              <span className="block break-words">{documentData.kingdomHeader}</span>
            )}
          </div>

          <div className="font-bold text-[10px] text-[#374151] leading-tight break-words">
            {isEditable ? (
              <input
                type="text"
                value={documentData.ministryHeader}
                onChange={(e) => onUpdateHeaderField?.('ministryHeader', e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden break-words"
              />
            ) : (
              <span className="block break-words">{documentData.ministryHeader}</span>
            )}
          </div>

          <div className="text-[10px] text-[#4B5563] font-medium leading-snug break-words">
            {isEditable ? (
              <input
                type="text"
                value={documentData.academy}
                onChange={(e) => onUpdateHeaderField?.('academy', e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden break-words"
              />
            ) : (
              <span className="block break-words">{documentData.academy}</span>
            )}
          </div>

          <div className="text-[10px] text-[#6B7280] leading-snug break-words">
            {isEditable ? (
              <input
                type="text"
                value={documentData.directorate}
                onChange={(e) => onUpdateHeaderField?.('directorate', e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden break-words"
              />
            ) : (
              <span className="block break-words">{documentData.directorate}</span>
            )}
          </div>

          <div className="text-[11px] font-bold text-[#065F46] pt-0.5 leading-snug break-words">
            {isEditable ? (
              <input
                type="text"
                value={documentData.schoolName}
                onChange={(e) => onUpdateHeaderField?.('schoolName', e.target.value)}
                className="w-full bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-bold text-[#065F46] break-words"
              />
            ) : (
              <span className="block break-words">{documentData.schoolName}</span>
            )}
          </div>
        </div>

        {/* Column 2: Center - Official Moroccan Kingdom Emblem */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center shrink-0">
          {showEmblem ? (
            <MoroccanOfficialEmblem
              size="md"
              showMotto={true}
              language={documentData.language}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-lg">
              <span className="text-[10px] font-semibold">
                {isRtl ? 'تم إخفاء الشعار الرسمي' : 'Armoiries masquées'}
              </span>
            </div>
          )}
        </div>

        {/* Column 3: School Logo & Teacher / Class / Year Meta */}
        <div className={`col-span-4 ${isRtl ? 'text-left' : 'text-right'} space-y-1 text-[10px] min-w-0`}>
          
          {/* Institution School Custom Logo on opposite corner */}
          {showLogo && (
            <div className={`flex items-center ${isRtl ? 'justify-start' : 'justify-end'} mb-1.5`}>
              {logoUrl ? (
                <div className="relative group">
                  <img
                    src={logoUrl}
                    alt="School Logo"
                    className="h-12 w-auto max-w-[90px] object-contain rounded-md border border-[#E5E7EB] bg-white p-0.5 shadow-2xs"
                  />
                  {isEditable && (
                    <button
                      onClick={handleRemoveLogo}
                      title={isRtl ? 'حذف شعار المؤسسة' : 'Supprimer logo'}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                isEditable && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[9px] text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-1 rounded-md hover:bg-[#D1FAE5] transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{isRtl ? 'رفع شعار المؤسسة' : 'Ajouter logo'}</span>
                  </button>
                )
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="font-bold text-[#1F2937] leading-tight break-words">
            <span className="text-[#6B7280] font-normal">{isRtl ? 'السنة الدراسية: ' : isFr ? 'Année scolaire : ' : 'Academic Year: '}</span>
            {isEditable ? (
              <input
                type="text"
                value={documentData.academicYear}
                onChange={(e) => onUpdateHeaderField?.('academicYear', e.target.value)}
                className="bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-bold w-24 text-center"
              />
            ) : (
              <span>{documentData.academicYear}</span>
            )}
          </div>

          <div className="font-bold text-[#1F2937] leading-tight break-words">
            <span className="text-[#6B7280] font-normal">{isRtl ? 'الأستاذ(ة): ' : isFr ? 'Enseignant(e) : ' : 'Teacher: '}</span>
            {isEditable ? (
              <input
                type="text"
                value={documentData.teacherName}
                onChange={(e) => onUpdateHeaderField?.('teacherName', e.target.value)}
                className="bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-bold break-words"
              />
            ) : (
              <span className="break-words">{documentData.teacherName}</span>
            )}
          </div>

          <div className="text-[#4B5563] leading-tight break-words">
            <span className="text-[#6B7280] font-normal">{isRtl ? 'المستوى / الفوج: ' : isFr ? 'Niveau / Classe : ' : 'Grade / Group: '}</span>
            {isEditable ? (
              <input
                type="text"
                value={documentData.classGroup || documentData.grade}
                onChange={(e) => onUpdateHeaderField?.('classGroup', e.target.value)}
                className="bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-bold break-words"
              />
            ) : (
              <span className="break-words">{documentData.classGroup || documentData.grade}</span>
            )}
          </div>

          <div className="text-[#6B7280] leading-tight break-words">
            <span className="text-[#6B7280] font-normal">{isRtl ? 'التاريخ: ' : isFr ? 'Date : ' : 'Date: '}</span>
            {isEditable ? (
              <input
                type="text"
                value={documentData.documentDate}
                onChange={(e) => onUpdateHeaderField?.('documentDate', e.target.value)}
                className="bg-transparent border-b border-dashed border-[#D1D5DB] focus:border-[#065F46] outline-hidden font-mono"
              />
            ) : (
              <span>{documentData.documentDate}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
