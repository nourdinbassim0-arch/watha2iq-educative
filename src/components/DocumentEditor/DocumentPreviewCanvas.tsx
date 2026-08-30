import React from 'react';
import { 
  DocumentData, 
  LessonStage, 
  RuleItem, 
  ExerciseItem, 
  StudentScoreItem,
  ThemeColor, 
  PageFormat 
} from '../../types';
import { DocumentHeader } from './DocumentHeader';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Award, 
  Sparkles, 
  FileSpreadsheet, 
  CheckCircle2, 
  Calendar, 
  UserCheck, 
  ShieldAlert, 
  Activity,
  HeartHandshake
} from 'lucide-react';
import { getDimensionInfo } from '../../utils/pageDimensions';

interface DocumentPreviewCanvasProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField: (field: keyof DocumentData, value: any) => void;
  zoom?: number;
}

export const DocumentPreviewCanvas: React.FC<DocumentPreviewCanvasProps> = ({
  documentData,
  isEditable = true,
  onUpdateField,
  zoom = 1.0,
}) => {
  const isRtl = documentData.language === 'ar';
  const isFr = documentData.language === 'fr';
  const theme = documentData.themeColor || 'emerald';
  const pageFormat = documentData.pageFormat || 'a4_portrait';
  const dimInfo = getDimensionInfo(pageFormat);

  // Font family mapping
  const getFontFamilyCSS = () => {
    switch (documentData.fontFamily) {
      case 'cairo':
        return "'Cairo', system-ui, sans-serif";
      case 'amiri':
        return "'Amiri', 'Traditional Arabic', serif";
      case 'noto_naskh':
        return "'Noto Naskh Arabic', 'Amiri', serif";
      case 'ibm_plex':
        return "'IBM Plex Sans Arabic', system-ui, sans-serif";
      case 'arial':
        return "Arial, 'Tajawal', sans-serif";
      case 'times_new_roman':
        return "'Times New Roman', 'Amiri', serif";
      case 'calibri':
        return "Calibri, 'Tajawal', sans-serif";
      case 'traditional_arabic':
        return "'Traditional Arabic', 'Amiri', serif";
      case 'tajawal':
      default:
        return "'Tajawal', 'Cairo', system-ui, sans-serif";
    }
  };

  // Theme color styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'crimson':
        return {
          primaryBg: 'bg-rose-800',
          primaryText: 'text-rose-900',
          primaryBorder: 'border-rose-800',
          badgeBg: 'bg-rose-50',
          badgeText: 'text-rose-900',
          badgeBorder: 'border-rose-200',
          tableHeaderBg: 'bg-rose-800 text-white',
          sectionHeaderBg: 'bg-rose-100/90 text-rose-950 border-rose-300',
          accentBorder: 'border-rose-600',
        };
      case 'royal':
        return {
          primaryBg: 'bg-blue-900',
          primaryText: 'text-blue-950',
          primaryBorder: 'border-blue-900',
          badgeBg: 'bg-blue-50',
          badgeText: 'text-blue-950',
          badgeBorder: 'border-blue-200',
          tableHeaderBg: 'bg-blue-900 text-white',
          sectionHeaderBg: 'bg-blue-100/90 text-blue-950 border-blue-300',
          accentBorder: 'border-blue-700',
        };
      case 'gold':
        return {
          primaryBg: 'bg-amber-800',
          primaryText: 'text-amber-950',
          primaryBorder: 'border-amber-800',
          badgeBg: 'bg-amber-50',
          badgeText: 'text-amber-950',
          badgeBorder: 'border-amber-300',
          tableHeaderBg: 'bg-amber-800 text-white',
          sectionHeaderBg: 'bg-amber-100/90 text-amber-950 border-amber-300',
          accentBorder: 'border-amber-600',
        };
      case 'slate':
        return {
          primaryBg: 'bg-slate-800',
          primaryText: 'text-slate-900',
          primaryBorder: 'border-slate-800',
          badgeBg: 'bg-slate-100',
          badgeText: 'text-slate-900',
          badgeBorder: 'border-slate-300',
          tableHeaderBg: 'bg-slate-800 text-white',
          sectionHeaderBg: 'bg-slate-200 text-slate-900 border-slate-300',
          accentBorder: 'border-slate-600',
        };
      case 'emerald':
      default:
        return {
          primaryBg: 'bg-emerald-800',
          primaryText: 'text-emerald-950',
          primaryBorder: 'border-emerald-800',
          badgeBg: 'bg-emerald-50',
          badgeText: 'text-emerald-950',
          badgeBorder: 'border-emerald-200',
          tableHeaderBg: 'bg-emerald-800 text-white',
          sectionHeaderBg: 'bg-emerald-100/90 text-emerald-950 border-emerald-300',
          accentBorder: 'border-emerald-600',
        };
    }
  };

  const ts = getThemeStyles();

  // Helper for Lesson Stages
  const handleAddLessonStage = () => {
    const newStage: LessonStage = {
      id: `stage-${Date.now()}`,
      stageName: isFr ? 'Nouvelle étape d\'apprentissage' : 'مرحلة تعليمية جديدة',
      duration: '20 min',
      teacherActivities: isFr ? 'Consignes et orientation pédagogique' : 'التوجيه وطرح الأسئلة ومواكبة المجموعات',
      studentActivities: isFr ? 'Réalisation des tâches' : 'الإنجاز والملاحظة وصياغة النتائج',
      evaluationMode: isFr ? 'Observation continue' : 'ملاحظة تشاركية',
      didacticTools: isFr ? 'Manuel' : 'الكتاب والدفاتر',
    };
    onUpdateField('lessonStages', [...(documentData.lessonStages || []), newStage]);
  };

  const handleUpdateLessonStage = (index: number, field: keyof LessonStage, value: any) => {
    const updated = [...(documentData.lessonStages || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('lessonStages', updated);
  };

  const handleDeleteLessonStage = (index: number) => {
    const updated = (documentData.lessonStages || []).filter((_, i) => i !== index);
    onUpdateField('lessonStages', updated);
  };

  // Helper for Charte Rules
  const handleAddCharteRule = () => {
    const newRule: RuleItem = {
      id: `rule-${Date.now()}`,
      category: isFr ? 'Discipline & Engagement' : 'انضباط والتزام',
      ruleText: isFr ? 'Nouvelle règle de conduite...' : 'بند جديد من بنود ميثاق القسم...',
    };
    onUpdateField('charteRules', [...(documentData.charteRules || []), newRule]);
  };

  const handleUpdateCharteRule = (index: number, field: keyof RuleItem, value: any) => {
    const updated = [...(documentData.charteRules || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('charteRules', updated);
  };

  const handleDeleteCharteRule = (index: number) => {
    const updated = (documentData.charteRules || []).filter((_, i) => i !== index);
    onUpdateField('charteRules', updated);
  };

  // Helper for Exercises (Exam)
  const handleAddExercise = () => {
    const count = (documentData.exercises || []).length + 1;
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}`,
      title: isFr ? `Exercice ${count} : Application (4 points)` : `التمرين ${count}: تطبيق ومسألة (4 نقاط)`,
      points: '4 ن',
      description: isFr ? 'Énoncé de l\'exercice...' : 'نص التمرين والمعطيات...',
      subQuestions: [
        isFr ? '1. Première question...' : '1. السؤال الأول...',
        isFr ? '2. Deuxième question...' : '2. السؤال الثاني...',
      ],
    };
    onUpdateField('exercises', [...(documentData.exercises || []), newEx]);
  };

  const handleUpdateExercise = (index: number, field: keyof ExerciseItem, value: any) => {
    const updated = [...(documentData.exercises || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('exercises', updated);
  };

  const handleDeleteExercise = (index: number) => {
    const updated = (documentData.exercises || []).filter((_, i) => i !== index);
    onUpdateField('exercises', updated);
  };

  // Helper for Grille de notation
  const handleAddStudentScore = () => {
    const count = (documentData.scoreRows || []).length + 1;
    const newRow: StudentScoreItem = {
      id: `sc-${Date.now()}`,
      studentNumber: count,
      studentName: `تلميذ(ة) ${count}`,
      c1: '4.0',
      c2: '4.0',
      c3: '4.0',
      c4: '4.0',
      total: '16.00',
      appreciation: 'مستحسن',
    };
    onUpdateField('scoreRows', [...(documentData.scoreRows || []), newRow]);
  };

  const handleUpdateScoreRow = (index: number, field: keyof StudentScoreItem, value: any) => {
    const updated = [...(documentData.scoreRows || [])];
    const row = { ...updated[index], [field]: value };
    
    // Auto calculate total if C1..C4 changed
    if (['c1', 'c2', 'c3', 'c4'].includes(field)) {
      const v1 = parseFloat(row.c1 || '0') || 0;
      const v2 = parseFloat(row.c2 || '0') || 0;
      const v3 = parseFloat(row.c3 || '0') || 0;
      const v4 = parseFloat(row.c4 || '0') || 0;
      row.total = (v1 + v2 + v3 + v4).toFixed(2);
    }

    updated[index] = row;
    onUpdateField('scoreRows', updated);
  };

  const handleDeleteScoreRow = (index: number) => {
    const updated = (documentData.scoreRows || []).filter((_, i) => i !== index);
    onUpdateField('scoreRows', updated);
  };

  return (
    <div className="flex justify-center p-2 sm:p-6 overflow-x-auto bg-slate-200/70 min-h-[85vh]">
      
      {/* Zoom transform container */}
      <div 
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150"
      >
        
        {/* Render Canvas matching exact Paper dimensions */}
        <div
          id="document-render-canvas"
          className="bg-white text-slate-900 p-8 sm:p-12 doc-page-shadow rounded-xs border border-slate-300 relative select-text transition-all print:p-0 print:border-none print:shadow-none"
          style={{
            width: dimInfo.cssWidth,
            minHeight: dimInfo.cssMinHeight,
            direction: isRtl ? 'rtl' : 'ltr',
            textAlign: isRtl ? 'right' : 'left',
            fontFamily: getFontFamilyCSS(),
          }}
        >
          
          {/* Document Header (Ministry Hierarchy & Seal) */}
          <DocumentHeader
            documentData={documentData}
            isEditable={isEditable}
            onUpdateHeaderField={onUpdateField}
          />

          {/* Document Main Title Bar */}
          <div className={`p-3 rounded-xl ${ts.sectionHeaderBg} border mb-5 text-center`}>
            <div className="text-xs font-bold text-slate-600 mb-0.5">
              {isFr ? 'Document Pédagogique Officiel' : 'وثيقة تربوية رسمية'} • {documentData.grade}
            </div>
            {isEditable ? (
              <input
                type="text"
                value={documentData.title}
                onChange={(e) => onUpdateField('title', e.target.value)}
                className="w-full bg-transparent text-center font-black text-xl sm:text-2xl text-slate-900 border-b border-dashed border-slate-400 focus:border-emerald-700 outline-hidden tracking-tight"
              />
            ) : (
              <h2 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {documentData.title}
              </h2>
            )}
          </div>

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 1: FICHE PEDAGOGIQUE (الجذاذة التربوية الرسمية) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'fiche_pedagogique' && (
            <div className="space-y-5 text-xs">
              
              {/* Administrative & Methodological Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-slate-300 rounded-xl p-3.5 bg-slate-50/50">
                <div className="space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Discipline / Matière : ' : 'المادة: '}</span>
                    <span className="font-bold text-emerald-900">
                      {isFr ? documentData.subjectNameFr || documentData.subjectNameAr : documentData.subjectNameAr}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Unité / Module : ' : 'الوحدة / المجزوءة: '}</span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={documentData.unitOrModule}
                        onChange={(e) => onUpdateField('unitOrModule', e.target.value)}
                        className="bg-transparent border-b border-dashed border-slate-300 w-2/3 px-1"
                      />
                    ) : (
                      <span>{documentData.unitOrModule}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Titre de la leçon : ' : 'عنوان الدرس: '}</span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={documentData.lessonTitle}
                        onChange={(e) => onUpdateField('lessonTitle', e.target.value)}
                        className="bg-transparent border-b border-dashed border-slate-300 font-bold w-2/3 px-1 text-emerald-900"
                      />
                    ) : (
                      <span className="font-bold text-emerald-900">{documentData.lessonTitle}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Volume horaire / Durée : ' : 'الغلاف الزمني: '}</span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={documentData.duration}
                        onChange={(e) => onUpdateField('duration', e.target.value)}
                        className="bg-transparent border-b border-dashed border-slate-300 w-1/2 px-1"
                      />
                    ) : (
                      <span>{documentData.duration}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Classe / Groupe : ' : 'القسم / الفوج: '}</span>
                    <span>{documentData.grade} ({documentData.classGroup})</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Enseignant(e) : ' : 'الأستاذ(ة): '}</span>
                    <span>{documentData.teacherName}</span>
                  </div>
                </div>
              </div>

              {/* Competences, Objectives & Didactic Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* General Competences */}
                <div className="border border-slate-300 rounded-xl p-3 bg-white">
                  <h4 className={`font-bold text-xs pb-1 mb-2 border-b ${ts.primaryText} flex items-center gap-1.5`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Compétences visées' : 'الكفايات المستهدفة'}</span>
                  </h4>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                    {(documentData.generalCompetences || []).map((comp, idx) => (
                      <li key={idx}>
                        {isEditable ? (
                          <input
                            type="text"
                            value={comp}
                            onChange={(e) => {
                              const updated = [...(documentData.generalCompetences || [])];
                              updated[idx] = e.target.value;
                              onUpdateField('generalCompetences', updated);
                            }}
                            className="bg-transparent border-b border-dashed border-slate-200 w-[90%] inline-block"
                          />
                        ) : (
                          comp
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific Learning Objectives */}
                <div className="border border-slate-300 rounded-xl p-3 bg-white">
                  <h4 className={`font-bold text-xs pb-1 mb-2 border-b ${ts.primaryText} flex items-center gap-1.5`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Objectifs d\'apprentissage' : 'الأهداف التعلمية الإجرائية'}</span>
                  </h4>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                    {(documentData.specificObjectives || []).map((obj, idx) => (
                      <li key={idx}>
                        {isEditable ? (
                          <input
                            type="text"
                            value={obj}
                            onChange={(e) => {
                              const updated = [...(documentData.specificObjectives || [])];
                              updated[idx] = e.target.value;
                              onUpdateField('specificObjectives', updated);
                            }}
                            className="bg-transparent border-b border-dashed border-slate-200 w-[90%] inline-block"
                          />
                        ) : (
                          obj
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Didactic Resources & Prerequisites */}
                <div className="border border-slate-300 rounded-xl p-3 bg-white">
                  <h4 className={`font-bold text-xs pb-1 mb-2 border-b ${ts.primaryText} flex items-center gap-1.5`}>
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Supports & Prérequis' : 'الوسائل والمكتسبات القبلية'}</span>
                  </h4>
                  <div className="space-y-1.5 text-[11px] text-slate-700">
                    <div>
                      <span className="font-bold text-slate-800">{isFr ? 'Prérequis : ' : 'المكتسبات القبلية: '}</span>
                      <span>{(documentData.prerequisites || []).join('، ')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">{isFr ? 'Ressources : ' : 'الوسائل والدعامات: '}</span>
                      <span>{(documentData.didacticResources || []).join('، ')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Stages Table Header & Rows (بيداغوجيا الكفايات والمنهاج المغربي) */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className={`${ts.tableHeaderBg} text-[11px] font-bold`}>
                        <th className="p-2.5 border border-slate-700/40 w-1/5">
                          {isFr ? 'Étapes de la leçon' : 'مراحل الدرس'}
                        </th>
                        <th className="p-2.5 border border-slate-700/40 w-16 text-center">
                          {isFr ? 'Durée' : 'المدة'}
                        </th>
                        <th className="p-2.5 border border-slate-700/40 w-1/4">
                          {isFr ? 'Activités de l\'enseignant(e)' : 'أنشطة الأستاذ(ة) والتدبير الديداكتيكي'}
                        </th>
                        <th className="p-2.5 border border-slate-700/40 w-1/4">
                          {isFr ? 'Activités de l\'apprenant(e)' : 'أنشطة المتعلم(ة) ومهام الإنجاز'}
                        </th>
                        <th className="p-2.5 border border-slate-700/40 w-1/6">
                          {isFr ? 'Évaluation & Outils' : 'نمط التقويم والوسائل'}
                        </th>
                        {isEditable && (
                          <th className="p-2.5 border border-slate-700/40 w-10 text-center no-print">
                            إجراء
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(documentData.lessonStages || []).map((stage, idx) => (
                        <tr key={stage.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          
                          {/* Stage Name */}
                          <td className="p-2.5 border border-slate-200 font-bold text-slate-900 align-top">
                            {isEditable ? (
                              <textarea
                                rows={2}
                                value={stage.stageName}
                                onChange={(e) => handleUpdateLessonStage(idx, 'stageName', e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-600 rounded-sm font-bold text-xs p-0 resize-y"
                              />
                            ) : (
                              stage.stageName
                            )}
                          </td>

                          {/* Duration */}
                          <td className="p-2.5 border border-slate-200 text-center align-top font-semibold text-slate-700">
                            {isEditable ? (
                              <input
                                type="text"
                                value={stage.duration}
                                onChange={(e) => handleUpdateLessonStage(idx, 'duration', e.target.value)}
                                className="w-full bg-transparent text-center font-bold text-xs p-0"
                              />
                            ) : (
                              stage.duration
                            )}
                          </td>

                          {/* Teacher Activities */}
                          <td className="p-2.5 border border-slate-200 align-top text-slate-800 leading-relaxed">
                            {isEditable ? (
                              <textarea
                                rows={3}
                                value={stage.teacherActivities}
                                onChange={(e) => handleUpdateLessonStage(idx, 'teacherActivities', e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-600 rounded-sm text-xs p-0 resize-y"
                              />
                            ) : (
                              stage.teacherActivities
                            )}
                          </td>

                          {/* Student Activities */}
                          <td className="p-2.5 border border-slate-200 align-top text-slate-800 leading-relaxed">
                            {isEditable ? (
                              <textarea
                                rows={3}
                                value={stage.studentActivities}
                                onChange={(e) => handleUpdateLessonStage(idx, 'studentActivities', e.target.value)}
                                className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-600 rounded-sm text-xs p-0 resize-y"
                              />
                            ) : (
                              stage.studentActivities
                            )}
                          </td>

                          {/* Evaluation & Tools */}
                          <td className="p-2.5 border border-slate-200 align-top text-slate-700 text-[11px]">
                            {isEditable ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={stage.evaluationMode}
                                  onChange={(e) => handleUpdateLessonStage(idx, 'evaluationMode', e.target.value)}
                                  className="w-full bg-transparent border-b border-dashed border-slate-200 text-[10px]"
                                  placeholder="نمط التقويم..."
                                />
                                <input
                                  type="text"
                                  value={stage.didacticTools}
                                  onChange={(e) => handleUpdateLessonStage(idx, 'didacticTools', e.target.value)}
                                  className="w-full bg-transparent text-slate-500 text-[10px]"
                                  placeholder="الوسائل..."
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-semibold text-emerald-900">{stage.evaluationMode}</div>
                                <div className="text-slate-500">{stage.didacticTools}</div>
                              </div>
                            )}
                          </td>

                          {/* Delete Action Button */}
                          {isEditable && (
                            <td className="p-2.5 border border-slate-200 text-center align-middle no-print">
                              <button
                                onClick={() => handleDeleteLessonStage(idx)}
                                title="حذف المرحلة"
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isEditable && (
                  <div className="p-2 bg-slate-50 border-t border-slate-200 text-center no-print">
                    <button
                      onClick={handleAddLessonStage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 font-bold text-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isFr ? 'Ajouter une étape' : 'إضافة مرحلة تعليمية جديدة'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Evaluation & Remediation Synthesis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/60">
                  <h4 className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isFr ? 'Évaluation des acquis' : 'أنشطة التقويم (تشخيصي / تكويني / إجمالي)'}</span>
                  </h4>
                  <div className="text-[11px] text-slate-700 space-y-1">
                    <div>
                      <span className="font-bold">{isFr ? 'Diagnostique : ' : 'التقويم التشخيصي: '}</span>
                      <span>{documentData.diagnosticEval}</span>
                    </div>
                    <div>
                      <span className="font-bold">{isFr ? 'Sommatif : ' : 'التقويم الإجمالي: '}</span>
                      <span>{documentData.summativeEval}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/60">
                  <h4 className="font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-700" />
                    <span>{isFr ? 'Remédiation et Soutien' : 'أنشطة الدعم البيداغوجي والمعالجة'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {documentData.supportActivities || 'تنظيم ورشات دعم فارقي للتعثرات المفاهيمية المرصودة.'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 2: CHARTE DE CLASSE (ميثاق القسم) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'charte_classe' && (
            <div className="space-y-6 text-xs">
              
              {/* Introduction Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 text-center relative">
                <div className="font-calligraphy text-base font-bold text-amber-950 mb-1">
                  «ميثاق الحياة المشتركة والتعلم الإيجابي داخل فضاء الفصل»
                </div>
                {isEditable ? (
                  <textarea
                    rows={3}
                    value={documentData.charteIntroduction}
                    onChange={(e) => onUpdateField('charteIntroduction', e.target.value)}
                    className="w-full bg-transparent border-0 text-center text-xs text-slate-800 leading-relaxed p-1 focus:ring-1 focus:ring-amber-500 rounded-md"
                  />
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {documentData.charteIntroduction}
                  </p>
                )}
              </div>

              {/* Rules List Grid */}
              <div className="space-y-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>بنود وقواعد ميثاق القسم:</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(documentData.charteRules || []).map((rule, idx) => (
                    <div
                      key={rule.id || idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start gap-3 relative group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-xs text-emerald-950 mb-1">
                          {rule.category}
                        </div>
                        {isEditable ? (
                          <textarea
                            rows={2}
                            value={rule.ruleText}
                            onChange={(e) => handleUpdateCharteRule(idx, 'ruleText', e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-800 border-0 p-0 focus:ring-1 focus:ring-emerald-500"
                          />
                        ) : (
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {rule.ruleText}
                          </p>
                        )}
                      </div>

                      {isEditable && (
                        <button
                          onClick={() => handleDeleteCharteRule(idx)}
                          className="text-slate-300 hover:text-rose-600 no-print"
                          title="حذف البند"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditable && (
                  <div className="text-center pt-2 no-print">
                    <button
                      onClick={handleAddCharteRule}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة بند جديد للميثاق</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Teacher and Class Representatives Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-900 mb-1">التزام الأستاذ(ة):</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {documentData.charteTeacherCommitment}
                  </p>
                  <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
                    <span>توقيع الأستاذ(ة):</span>
                    <span className="font-bold text-slate-800">{documentData.teacherName}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-900 mb-1">التزام تلميذات وتلاميذ القسم:</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    نتعهد جميعاً بالاحترام التام لجميع بنود هذا الميثاق لضمان بيئة صفية تسودها الأخوة والاجتهاد والنجاح الجماعي.
                  </p>
                  <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
                    <span>توقيع ممثل(ة) القسم:</span>
                    <span className="font-bold text-slate-800">مصادق عليه من طرف التلاميذ</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 3: CONTROLE CONTINU / DEVOIR (فروض واختبارات) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'controle_devoir' && (
            <div className="space-y-6 text-xs">
              
              {/* Student Identification & Score Bar */}
              <div className="grid grid-cols-12 gap-2 border-2 border-slate-800 rounded-xl p-3 bg-slate-50">
                <div className="col-span-8 space-y-1">
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Nom et Prénom : ' : 'الاسم والنسب: '}</span>
                    <span className="inline-block border-b border-dotted border-slate-600 w-48 text-transparent">................................</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{isFr ? 'Numéro / Groupe : ' : 'رقم الترتيب / الفوج: '}</span>
                    <span className="inline-block border-b border-dotted border-slate-600 w-24 text-transparent">.......</span>
                    <span className="mr-4 font-bold text-slate-800">{isFr ? 'Classe : ' : 'القسم: '}</span>
                    <span>{documentData.grade}</span>
                  </div>
                </div>

                <div className="col-span-4 border-r-2 border-slate-800 pr-3 flex flex-col items-center justify-center text-center">
                  <div className="font-bold text-xs text-slate-700">{isFr ? 'Note globale' : 'النقطة المحصل عليها'}</div>
                  <div className="text-xl font-black text-rose-700 mt-1 border-2 border-dashed border-rose-400 px-4 py-1 rounded-lg bg-white">
                    .... / 20
                  </div>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold">{isFr ? 'Consignes importantes : ' : 'توجيهات وتعليمات: '}</span>
                <span>{(documentData.examInstructions || []).join(' • ')}</span>
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                {(documentData.exercises || []).map((ex, idx) => (
                  <div key={ex.id || idx} className="border border-slate-300 rounded-xl p-4 bg-white shadow-2xs space-y-2.5">
                    
                    {/* Exercise Title and Points */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      {isEditable ? (
                        <input
                          type="text"
                          value={ex.title}
                          onChange={(e) => handleUpdateExercise(idx, 'title', e.target.value)}
                          className="font-black text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 w-3/4"
                        />
                      ) : (
                        <h4 className="font-black text-sm text-slate-900">{ex.title}</h4>
                      )}

                      <span className="bg-rose-100 text-rose-900 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        {ex.points}
                      </span>
                    </div>

                    {/* Exercise Text/Description */}
                    {isEditable ? (
                      <textarea
                        rows={2}
                        value={ex.description}
                        onChange={(e) => handleUpdateExercise(idx, 'description', e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-800 border-0 p-0 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                      />
                    ) : (
                      <p className="text-xs text-slate-800 leading-relaxed">{ex.description}</p>
                    )}

                    {/* Sub Questions */}
                    <div className="space-y-2 pt-1">
                      {ex.subQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="text-xs text-slate-800 pr-2 flex items-start justify-between">
                          {isEditable ? (
                            <input
                              type="text"
                              value={q}
                              onChange={(e) => {
                                const updatedSub = [...ex.subQuestions];
                                updatedSub[qIdx] = e.target.value;
                                handleUpdateExercise(idx, 'subQuestions', updatedSub);
                              }}
                              className="w-full bg-transparent border-b border-dashed border-slate-200 text-xs"
                            />
                          ) : (
                            <span>{q}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Answer space indicator */}
                    <div className="h-12 border-b border-dotted border-slate-300 bg-slate-50/40 rounded-sm"></div>

                    {isEditable && (
                      <div className="flex justify-end pt-1 no-print">
                        <button
                          onClick={() => handleDeleteExercise(idx)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف هذا التمرين</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))}

                {isEditable && (
                  <div className="text-center pt-2 no-print">
                    <button
                      onClick={handleAddExercise}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isFr ? 'Ajouter un exercice' : 'إضافة تمرين جديد للفرض'}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 4: GRILLE DE NOTATION (شبكات التنقيط والتفريغ) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'grille_notation' && (
            <div className="space-y-4 text-xs">
              
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className={`${ts.tableHeaderBg} text-[11px] font-bold`}>
                        <th className="p-2 border border-slate-600 w-12 text-center">الرقم</th>
                        <th className="p-2 border border-slate-600 w-1/4">اسم ونسب التلميذ(ة)</th>
                        <th className="p-2 border border-slate-600 text-center w-20">معيار 1 (C1)</th>
                        <th className="p-2 border border-slate-600 text-center w-20">معيار 2 (C2)</th>
                        <th className="p-2 border border-slate-600 text-center w-20">معيار 3 (C3)</th>
                        <th className="p-2 border border-slate-600 text-center w-20">معيار 4 (C4)</th>
                        <th className="p-2 border border-slate-600 text-center w-24">المجموع / 20</th>
                        <th className="p-2 border border-slate-600">الملاحظة والتقدير</th>
                        {isEditable && <th className="p-2 border border-slate-600 w-10 text-center no-print">إجراء</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(documentData.scoreRows || []).map((row, idx) => (
                        <tr key={row.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-200 text-center font-bold text-slate-700">
                            {row.studentNumber}
                          </td>
                          <td className="p-2 border border-slate-200 font-bold text-slate-900">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.studentName}
                                onChange={(e) => handleUpdateScoreRow(idx, 'studentName', e.target.value)}
                                className="w-full bg-transparent text-xs font-bold"
                              />
                            ) : (
                              row.studentName
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-center">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.c1}
                                onChange={(e) => handleUpdateScoreRow(idx, 'c1', e.target.value)}
                                className="w-full text-center bg-transparent text-xs"
                              />
                            ) : (
                              row.c1
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-center">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.c2}
                                onChange={(e) => handleUpdateScoreRow(idx, 'c2', e.target.value)}
                                className="w-full text-center bg-transparent text-xs"
                              />
                            ) : (
                              row.c2
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-center">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.c3}
                                onChange={(e) => handleUpdateScoreRow(idx, 'c3', e.target.value)}
                                className="w-full text-center bg-transparent text-xs"
                              />
                            ) : (
                              row.c3
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-center">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.c4}
                                onChange={(e) => handleUpdateScoreRow(idx, 'c4', e.target.value)}
                                className="w-full text-center bg-transparent text-xs"
                              />
                            ) : (
                              row.c4
                            )}
                          </td>
                          <td className="p-2 border border-slate-200 text-center font-black text-emerald-900 bg-emerald-50/50">
                            {row.total}
                          </td>
                          <td className="p-2 border border-slate-200 text-slate-700 text-xs">
                            {isEditable ? (
                              <input
                                type="text"
                                value={row.appreciation}
                                onChange={(e) => handleUpdateScoreRow(idx, 'appreciation', e.target.value)}
                                className="w-full bg-transparent text-xs"
                              />
                            ) : (
                              row.appreciation
                            )}
                          </td>
                          {isEditable && (
                            <td className="p-2 border border-slate-200 text-center no-print">
                              <button
                                onClick={() => handleDeleteScoreRow(idx)}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isEditable && (
                  <div className="p-2 bg-slate-50 border-t border-slate-200 text-center no-print">
                    <button
                      onClick={handleAddStudentScore}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة تلميذ(ة) للشبكة</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 5: EVALUATION & SOUTIEN (أنشطة التقويم والدعم) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'evaluation_soutien' && (
            <div className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-300 rounded-xl p-4 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>التعثرات والصعوبات المرصودة:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    <li>صعوبة في تطبيق القواعد الرياضية / اللغوية أثناء الوضعيات المركبة.</li>
                    <li>الخلط بين المفاهيم المتشابهة ونقص في التبرير والاستدلال.</li>
                    <li>تعثر في تنظيم خطوات الإنجاز وإدارة الزمن المخصص للمهمة.</li>
                  </ul>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 bg-emerald-50/60 border-emerald-200">
                  <h4 className="font-bold text-sm text-emerald-950 mb-2 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-700" />
                    <span>خطة المعالجة والدعم البيداغوجي:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-900 list-disc list-inside">
                    <li>تنظيم ورشات عمل فارقية في مجموعات مصغرة حسب نوع التعثر.</li>
                    <li>تقديم بطاقات دعم مدرجة مع تمارين توجيهية مدعمة بأمثلة تطبيقية.</li>
                    <li>اعتماد بيداغوجيا الأقران وتشجيع التعلم التشاركي الإيجابي.</li>
                  </ul>
                </div>
              </div>

              {/* Remediation Exercises Table */}
              <div className="border border-slate-300 rounded-xl p-4 bg-white shadow-2xs">
                <h4 className="font-bold text-sm text-slate-900 mb-3">أنشطة التثبيت والتقويم البعدي:</h4>
                <div className="space-y-3 text-xs text-slate-800">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-900">النشاط الأول (تثبيت المفاهيم): </span>
                    <span>تمارين تفكيك وبناء المفاهيم الأساسية عبر وضعيات مبسطة وموجهة.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-emerald-900">النشاط الثاني (إعادة الاستثمار): </span>
                    <span>معالجة وضعية مشكلة دالة لقياس مدى تجاوز التعثرات المحصورة.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 6: RAPPORT DU CONSEIL / PV (تقارير المجالس) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'rapport_conseil' && (
            <div className="space-y-5 text-xs">
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-sm text-slate-900 mb-2">جدول أعمال المجلس:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>تقييم الحصيلة التربوية ونتائج المراقبة المستمرة للدورة الأولى.</li>
                  <li>رصد مواطن القوة والتعثرات لدى تلميذات وتلاميذ القسم.</li>
                  <li>تسطير برنامج الدعم والمعالجة وتوزيع المهام التربوية.</li>
                  <li>اقتراح قرارات التوجيه والتتبع الإداري والتربوي.</li>
                </ol>
              </div>

              <div className="border border-slate-300 rounded-xl p-4 bg-white">
                <h4 className="font-bold text-sm text-slate-900 mb-2">القرارات والتوصيات المتخذة:</h4>
                <p className="text-slate-700 leading-relaxed">
                  تم الاتفاق بالإجماع على تكثيف حصص الدعم البيداغوجي للمتعثرين في المواد الأساسية، وتثمين مجهودات التلاميذ المتفوقين عبر شواهد تقديرية، والتواصل مع أمهات وآباء وأولياء الأمور لتتبع الحالات التي تستدعي الرعاية.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT TYPE 7: ATTESTATION / CERTIFICATE (شهادة تقديرية) */}
          {/* ========================================================================= */}
          {documentData.documentType === 'attestation_affiche' && (
            <div className="py-8 px-6 border-4 border-double border-amber-600 rounded-3xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 text-center space-y-6">
              
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-800 shadow-md">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              <div>
                <h3 className="font-calligraphy text-3xl font-black text-amber-900 tracking-wider">
                  شـــهـــادة تــفــوق وتــقــديــر
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  تقديراً للمثابرة وحسن السلوك والنتائج الدراسية المتميزة
                </p>
              </div>

              <div className="py-4 border-y-2 border-amber-200/80 max-w-xl mx-auto space-y-2">
                <p className="text-sm text-slate-700">
                  تمنح إدارة وأطر المؤسسة هذه الشهادة التقديرية للتلميذ(ة):
                </p>
                <div className="font-calligraphy text-2xl font-black text-emerald-950">
                  محمد الإدريسي بن عبد الله
                </div>
                <p className="text-xs text-slate-600">
                  المسجل(ة) بمستوى: <span className="font-bold text-slate-900">{documentData.grade}</span> برسم السنة الدراسية: <span className="font-bold text-slate-900">{documentData.academicYear}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                متمنين له(ا) دوام التألق والنجاح في مساره(ا) الدراسي المستقبلي.
              </p>

            </div>
          )}

          {/* ========================================================================= */}
          {/* DOCUMENT FOOTER & OFFICIAL SIGNATURES */}
          {/* ========================================================================= */}
          <div className="mt-8 pt-4 border-t-2 border-slate-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs">
              
              {/* Teacher Signature */}
              {documentData.showTeacherSignature && (
                <div className="p-3 border border-dashed border-slate-300 rounded-xl">
                  <div className="font-bold text-slate-800 mb-1">{isFr ? 'Signature de l\'enseignant(e)' : 'توقيع الأستاذ(ة)'}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{documentData.teacherName}</div>
                  <div className="h-10"></div>
                </div>
              )}

              {/* School Administration Seal */}
              <div className="p-3 border border-dashed border-slate-300 rounded-xl">
                <div className="font-bold text-slate-800 mb-1">{isFr ? 'Cachet de l\'établissement' : 'خاتم وتأشيرة الإدارة التربوية'}</div>
                <div className="text-[10px] text-slate-500 font-medium">{documentData.schoolName}</div>
                <div className="h-10"></div>
              </div>

              {/* Pedagogical Inspector Signature (Fiche & Exams) */}
              {documentData.showInspectorSignature && (
                <div className="p-3 border border-dashed border-slate-300 rounded-xl col-span-2 sm:col-span-1">
                  <div className="font-bold text-slate-800 mb-1">{isFr ? 'Visa de l\'Inspection' : 'تأشيرة المفتش التربوي'}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{isFr ? 'Inspection Pédagogique' : 'التفتيش التربوي التخصصي'}</div>
                  <div className="h-10"></div>
                </div>
              )}

            </div>

            {/* Print & Document Generation Details */}
            {documentData.showFooterInfo && (
              <div className="mt-4 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>وثائقي التربوية • المملكة المغربية</span>
                <span>تاريخ التوليد: {documentData.documentDate}</span>
                {documentData.showPageNumbers && <span>صفحة 1 / 1</span>}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
