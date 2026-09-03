import React from 'react';
import { MoroccanOfficialEmblem } from '../../components/MoroccanOfficialEmblem';
import { DocumentData } from '../../types';
import { getDefaultHeaderConfig, getDefaultLogoConfig } from '../../utils/documentDefaults';

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
  language = 'ar',
}) => {
  if (showOfficialHeader === false || documentData.showOfficialHeader === false) {
    return null;
  }

  const isRtl = language === 'ar';
  const isFr = language === 'fr';

  const headerConfig = documentData.headerConfig || getDefaultHeaderConfig(documentData);
  const logoConfig = documentData.logoConfig || getDefaultLogoConfig(documentData);
  const visible = headerConfig.visibleFields || {};

  const template = headerConfig.template || 'official';
  const showLogo = logoConfig.show !== false && (documentData.showSchoolLogo !== false);
  const activeLogoUrl = logoConfig.useCustomLogo ? logoConfig.customLogoUrl : undefined;

  // Custom logo spacing calculations
  const headerBottomSpacing = headerConfig.spacingBelowHeaderMm ?? 4;
  const logoTopMargin = logoConfig.topMarginMm ?? 0;
  const logoBottomMargin = logoConfig.bottomMarginMm ?? 3;

  // Helper renderer for Institutional information (Right side in RTL)
  const renderInstitutionInfo = (textAlignment: 'start' | 'center' | 'end' = 'start') => (
    <div className={`flex flex-col ${textAlignment === 'center' ? 'items-center text-center' : textAlignment === 'end' ? 'items-end text-end' : 'items-start text-start'} space-y-1 text-xs text-slate-800 w-full overflow-visible`}>
      {visible.kingdom !== false && (
        <div className="font-bold text-[11px] text-emerald-950 font-serif leading-tight">
          {documentData.kingdomHeader || 'المملكة المغربية'}
        </div>
      )}

      {visible.ministry !== false && (
        <div className="font-semibold text-[9.5px] text-slate-700 leading-tight">
          {documentData.ministryHeader || 'وزارة التربية الوطنية والتعليم الأولي والرياضة'}
        </div>
      )}

      {visible.academy !== false && (
        <div className="text-[9.5px] text-slate-600 leading-tight">
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.academy || ''}
              onChange={(e) => onUpdateHeaderField('academy', e.target.value)}
              placeholder="الأكاديمية الجهوية..."
              className="bg-transparent border-b border-dashed border-slate-300 w-full text-[9.5px] py-0.5 outline-hidden editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="break-words font-medium">{documentData.academy || 'الأكاديمية الجهوية للتربية والتكوين'}</span>
          )}
        </div>
      )}

      {visible.directorate !== false && (
        <div className="text-[9.5px] text-slate-600 leading-tight">
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.directorate || ''}
              onChange={(e) => onUpdateHeaderField('directorate', e.target.value)}
              placeholder="المديرية الإقليمية..."
              className="bg-transparent border-b border-dashed border-slate-300 w-full text-[9.5px] py-0.5 outline-hidden editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="break-words font-medium">{documentData.directorate || 'المديرية الإقليمية'}</span>
          )}
        </div>
      )}

      {visible.schoolName !== false && (
        <div className="font-bold text-[10.5px] text-emerald-900 pt-0.5 leading-tight">
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.schoolName || ''}
              onChange={(e) => onUpdateHeaderField('schoolName', e.target.value)}
              placeholder="اسم المؤسسة التعليمية..."
              className="bg-transparent border-b border-dashed border-slate-300 font-bold w-full text-[10.5px] py-0.5 outline-hidden editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="break-words">{documentData.schoolName || 'المؤسسة التعليمية'}</span>
          )}
        </div>
      )}
    </div>
  );

  // Helper renderer for Educational metadata (Left side in RTL)
  const renderEducationalMeta = (textAlignment: 'start' | 'center' | 'end' = 'end') => (
    <div className={`flex flex-col ${textAlignment === 'center' ? 'items-center text-center' : textAlignment === 'start' ? 'items-start text-start' : 'items-end text-end'} space-y-1 text-xs text-slate-800 w-full overflow-visible`}>
      {visible.academicYear !== false && (
        <div className="text-[10.5px] leading-normal flex flex-wrap items-baseline gap-1">
          <span className="text-slate-600 font-medium">{isFr ? 'Année scolaire : ' : 'السنة الدراسية: '}</span>
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.academicYear || '2026 - 2027'}
              onChange={(e) => onUpdateHeaderField('academicYear', e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-300 min-w-[90px] text-center text-[10.5px] py-0.5 outline-hidden font-bold editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="font-bold text-emerald-950">{documentData.academicYear || '2026 - 2027'}</span>
          )}
        </div>
      )}

      {visible.subject !== false && (
        <div className="text-[10px] leading-normal flex flex-wrap items-baseline gap-1">
          <span className="font-medium text-slate-600">{isFr ? 'Matière : ' : 'المادة: '}</span>
          <span className="font-bold text-emerald-900">
            {isFr ? documentData.subjectNameFr || documentData.subjectNameAr : documentData.subjectNameAr || 'التربية الإسلامية'}
          </span>
        </div>
      )}

      {visible.grade !== false && (
        <div className="text-[10px] leading-normal flex flex-wrap items-baseline gap-1">
          <span className="font-medium text-slate-600">{isFr ? 'Niveau : ' : 'المستوى: '}</span>
          <span className="font-bold text-slate-900">{documentData.grade || (isFr ? 'Niveau' : 'جميع المستويات')}</span>
        </div>
      )}

      {visible.teacher !== false && (
        <div className="text-[10.5px] leading-normal flex flex-wrap items-baseline gap-1">
          <span className="font-medium text-slate-600">{isFr ? 'Enseignant(e) : ' : 'الأستاذ(ة): '}</span>
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.teacherName || ''}
              onChange={(e) => onUpdateHeaderField('teacherName', e.target.value)}
              placeholder="اسم الأستاذ..."
              className="bg-transparent border-b border-dashed border-slate-300 text-[10.5px] py-0.5 outline-hidden min-w-[120px] max-w-full text-center font-bold editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="font-bold text-slate-900 break-words">{documentData.teacherName || (isFr ? 'Enseignant(e)' : 'ذ. التربية الإسلامية')}</span>
          )}
        </div>
      )}

      {visible.date !== false && (
        <div className="text-[9.5px] text-slate-500 pt-0.5 leading-normal flex flex-wrap items-baseline gap-1">
          <span className="font-medium">{isFr ? 'Date : ' : 'التاريخ: '}</span>
          {isEditable && onUpdateHeaderField ? (
            <input
              type="text"
              value={documentData.documentDate || ''}
              onChange={(e) => onUpdateHeaderField('documentDate', e.target.value)}
              placeholder="التاريخ..."
              className="bg-transparent border-b border-dashed border-slate-300 text-[9.5px] py-0.5 outline-hidden min-w-[80px] text-center editor-only"
              data-editor-only="true"
            />
          ) : (
            <span className="font-medium">{documentData.documentDate || new Date().toLocaleDateString('ar-MA')}</span>
          )}
        </div>
      )}
    </div>
  );

  // Helper to render the logo
  const renderLogo = () => {
    if (!showLogo) return null;
    return (
      <div
        style={{
          marginTop: `${logoTopMargin}mm`,
          marginBottom: `${logoBottomMargin}mm`,
        }}
        className="flex flex-col items-center justify-center text-center transition-all"
      >
        <MoroccanOfficialEmblem
          size={logoConfig.size || 'md'}
          customWidthMm={logoConfig.customWidthMm}
          customHeightMm={logoConfig.customHeightMm}
          customLogoUrl={activeLogoUrl}
          showMotto={template === 'center_logo' ? (visible.kingdom === false && visible.ministry === false) : false}
          language={language}
        />
      </div>
    );
  };

  return (
    <header
      id="document-official-header"
      className="w-full relative select-none"
      style={{ marginBottom: `${headerBottomSpacing}mm` }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ----------------- TEMPLATE 1: OFFICIAL (رسمي) ----------------- */}
      {template === 'official' && (
        <div className="pb-3 border-b-2 border-emerald-900/80">
          {showLogo ? (
            <div className="grid grid-cols-12 items-center gap-2 sm:gap-4">
              {/* Right: Institution */}
              <div className="col-span-4">{renderInstitutionInfo('start')}</div>
              {/* Center: Logo */}
              <div className="col-span-4 flex items-center justify-center">{renderLogo()}</div>
              {/* Left: Metadata */}
              <div className="col-span-4">{renderEducationalMeta('end')}</div>
            </div>
          ) : (
            /* Reorganizes into balanced 2 columns when logo is hidden */
            <div className="grid grid-cols-2 items-center gap-6">
              <div>{renderInstitutionInfo('start')}</div>
              <div>{renderEducationalMeta('end')}</div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TEMPLATE 2: CENTERED LOGO (شعار مركزي) ----------------- */}
      {template === 'center_logo' && (
        <div className="pb-3 border-b-2 border-emerald-900/80 flex flex-col items-center">
          {showLogo && <div className="mb-2">{renderLogo()}</div>}
          <div className="w-full grid grid-cols-2 items-center gap-6 pt-1 border-t border-slate-200">
            <div>{renderInstitutionInfo('start')}</div>
            <div>{renderEducationalMeta('end')}</div>
          </div>
        </div>
      )}

      {/* ----------------- TEMPLATE 3: MINIMAL (بسيط) ----------------- */}
      {template === 'minimal' && (
        <div className="pb-2 border-b border-slate-400">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">{renderInstitutionInfo('start')}</div>
            {showLogo && (
              <div className="shrink-0 scale-90">
                <MoroccanOfficialEmblem
                  size="sm"
                  customLogoUrl={activeLogoUrl}
                  showMotto={false}
                  language={language}
                />
              </div>
            )}
            <div className="flex-1">{renderEducationalMeta('end')}</div>
          </div>
        </div>
      )}

      {/* ----------------- TEMPLATE 4: ACADEMIC (أكاديمي) ----------------- */}
      {template === 'academic' && (
        <div className="pb-3 border-b-2 border-emerald-800">
          {/* Top Center Logo & Title */}
          {showLogo && <div className="mb-2 flex justify-center">{renderLogo()}</div>}

          {/* Structured Educational Ribbon Card */}
          <div className="bg-emerald-50/60 border border-emerald-800/30 rounded-xl p-2.5 grid grid-cols-2 gap-4 shadow-2xs">
            <div>{renderInstitutionInfo('start')}</div>
            <div>{renderEducationalMeta('end')}</div>
          </div>
        </div>
      )}

      {/* ----------------- TEMPLATE 5: CUSTOM (مخصص) ----------------- */}
      {template === 'custom' && (
        <div className="pb-3 border-b-2 border-emerald-900/80">
          {logoConfig.position === 'top_center' && (
            <div className="grid grid-cols-12 items-center gap-3">
              <div className={showLogo ? 'col-span-4' : 'col-span-6'}>{renderInstitutionInfo('start')}</div>
              {showLogo && <div className="col-span-4 flex justify-center">{renderLogo()}</div>}
              <div className={showLogo ? 'col-span-4' : 'col-span-6'}>{renderEducationalMeta('end')}</div>
            </div>
          )}

          {logoConfig.position === 'top_right' && (
            <div className="grid grid-cols-12 items-center gap-3">
              {showLogo && <div className="col-span-3 flex justify-start">{renderLogo()}</div>}
              <div className={showLogo ? 'col-span-5' : 'col-span-6'}>{renderInstitutionInfo('start')}</div>
              <div className={showLogo ? 'col-span-4' : 'col-span-6'}>{renderEducationalMeta('end')}</div>
            </div>
          )}

          {logoConfig.position === 'top_left' && (
            <div className="grid grid-cols-12 items-center gap-3">
              <div className={showLogo ? 'col-span-5' : 'col-span-6'}>{renderInstitutionInfo('start')}</div>
              <div className={showLogo ? 'col-span-4' : 'col-span-6'}>{renderEducationalMeta('end')}</div>
              {showLogo && <div className="col-span-3 flex justify-end">{renderLogo()}</div>}
            </div>
          )}

          {logoConfig.position === 'custom' && (
            <div className="relative">
              <div className="grid grid-cols-2 items-center gap-4">
                <div>{renderInstitutionInfo('start')}</div>
                <div>{renderEducationalMeta('end')}</div>
              </div>
              {showLogo && (
                <div
                  style={{
                    position: 'relative',
                    marginTop: `${logoTopMargin}mm`,
                    marginBottom: `${logoBottomMargin}mm`,
                  }}
                  className="flex justify-center"
                >
                  {renderLogo()}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
