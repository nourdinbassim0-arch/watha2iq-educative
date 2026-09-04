import React from 'react';
import { 
  DocumentData, 
  LessonStage, 
  RuleItem, 
  ExerciseItem, 
  StudentScoreItem 
} from '../../types';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  HeartHandshake, 
  Calculator, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { StructuredEditableField } from './StructuredEditableField';

export interface DocumentContentProps {
  documentData: DocumentData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof DocumentData, value: any) => void;
  language?: 'ar' | 'fr' | 'en';
}

export const DocumentContent: React.FC<DocumentContentProps> = ({
  documentData,
  isEditable = false,
  onUpdateField,
  language = 'ar',
}) => {
  const isFr = language === 'fr';

  // Helper for Lesson Stages
  const handleAddLessonStage = () => {
    if (!onUpdateField) return;
    const newStage: LessonStage = {
      id: `stage-${Date.now()}`,
      stageName: isFr ? "Nouvelle étape d'apprentissage" : 'مرحلة تعليمية جديدة',
      duration: '20 min',
      teacherActivities: isFr ? 'Consignes et orientation' : 'التوجيه وطرح الأسئلة ومواكبة المجموعات',
      studentActivities: isFr ? 'Réalisation des tâches' : 'الإنجاز والملاحظة وصياغة النتائج',
      evaluationMode: isFr ? 'Observation continue' : 'ملاحظة تشاركية',
      didacticTools: isFr ? 'Manuel' : 'الكتاب والدفاتر',
    };
    onUpdateField('lessonStages', [...(documentData.lessonStages || []), newStage]);
  };

  const handleUpdateLessonStage = (index: number, field: keyof LessonStage, value: any) => {
    if (!onUpdateField) return;
    const updated = [...(documentData.lessonStages || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('lessonStages', updated);
  };

  const handleDeleteLessonStage = (index: number) => {
    if (!onUpdateField) return;
    const updated = (documentData.lessonStages || []).filter((_, i) => i !== index);
    onUpdateField('lessonStages', updated);
  };

  // Helper for Charte Rules
  const handleAddCharteRule = () => {
    if (!onUpdateField) return;
    const newRule: RuleItem = {
      id: `rule-${Date.now()}`,
      category: isFr ? 'Discipline & Engagement' : 'انضباط والتزام',
      ruleText: isFr ? 'Nouvelle règle de conduite...' : 'بند جديد من بنود ميثاق القسم...',
    };
    onUpdateField('charteRules', [...(documentData.charteRules || []), newRule]);
  };

  const handleUpdateCharteRule = (index: number, field: keyof RuleItem, value: any) => {
    if (!onUpdateField) return;
    const updated = [...(documentData.charteRules || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('charteRules', updated);
  };

  const handleDeleteCharteRule = (index: number) => {
    if (!onUpdateField) return;
    const updated = (documentData.charteRules || []).filter((_, i) => i !== index);
    onUpdateField('charteRules', updated);
  };

  // Helper for Exercises
  const handleAddExercise = () => {
    if (!onUpdateField) return;
    const count = (documentData.exercises || []).length + 1;
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}`,
      title: isFr ? `Exercice ${count} : Application (4 points)` : `التمرين ${count}: تطبيق ومسألة (4 نقاط)`,
      points: '4',
      description: isFr ? "Énoncé de l'exercice..." : 'نص التمرين والمعطيات...',
      subQuestions: [
        isFr ? '1. Première question...' : '1. السؤال الأول...',
        isFr ? '2. Deuxième question...' : '2. السؤال الثاني...',
      ],
    };
    onUpdateField('exercises', [...(documentData.exercises || []), newEx]);
  };

  const handleUpdateExercise = (index: number, field: keyof ExerciseItem, value: any) => {
    if (!onUpdateField) return;
    const updated = [...(documentData.exercises || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateField('exercises', updated);
  };

  const handleDeleteExercise = (index: number) => {
    if (!onUpdateField) return;
    const updated = (documentData.exercises || []).filter((_, i) => i !== index);
    onUpdateField('exercises', updated);
  };

  // Helper for Student Scores
  const handleAddScoreRow = () => {
    if (!onUpdateField) return;
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
    if (!onUpdateField) return;
    const updated = [...(documentData.scoreRows || [])];
    const row = { ...updated[index], [field]: value };
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
    if (!onUpdateField) return;
    const updated = (documentData.scoreRows || []).filter((_, i) => i !== index);
    onUpdateField('scoreRows', updated);
  };

  return (
    <div className="space-y-5 text-xs text-slate-900 leading-relaxed">
      
      {/* ========================================================== */}
      {/* 1. FICHE PEDAGOGIQUE CONTENT */}
      {/* ========================================================== */}
      {documentData.documentType === 'fiche_pedagogique' && (
        <>
          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-slate-300 rounded-xl p-3.5 bg-slate-50/50">
            <div className="space-y-1.5">
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Matière : ' : 'المادة: '}</span>
                <span className="font-bold text-emerald-900">
                  {isFr ? documentData.subjectNameFr || documentData.subjectNameAr : documentData.subjectNameAr}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Unité / Module : ' : 'الوحدة / المجزوءة: '}</span>
                {isEditable && onUpdateField ? (
                  <input
                    type="text"
                    value={documentData.unitOrModule || ''}
                    onChange={(e) => onUpdateField('unitOrModule', e.target.value)}
                    className="bg-transparent border-b border-dashed border-slate-300 w-2/3 px-1"
                  />
                ) : (
                  <span>{documentData.unitOrModule}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Titre de la leçon : ' : 'عنوان الدرس: '}</span>
                {isEditable && onUpdateField ? (
                  <input
                    type="text"
                    value={documentData.lessonTitle || ''}
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
                <span className="font-bold text-slate-800">{isFr ? 'Volume horaire : ' : 'الغلاف الزمني: '}</span>
                {isEditable && onUpdateField ? (
                  <input
                    type="text"
                    value={documentData.duration || ''}
                    onChange={(e) => onUpdateField('duration', e.target.value)}
                    className="bg-transparent border-b border-dashed border-slate-300 w-1/2 px-1"
                  />
                ) : (
                  <span>{documentData.duration}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Classe : ' : 'القسم: '}</span>
                <span>{documentData.grade} ({documentData.classGroup})</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Enseignant(e) : ' : 'الأستاذ(ة): '}</span>
                <span>{documentData.teacherName}</span>
              </div>
            </div>
          </div>

          {/* Competences & Objectives Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-slate-300 rounded-xl p-3 bg-white">
              <h4 className="font-bold text-xs pb-1 mb-2 border-b border-emerald-200 text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isFr ? 'Compétences visées' : 'الكفايات المستهدفة'}</span>
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                {(documentData.generalCompetences || []).map((comp, idx) => (
                  <li key={idx}>
                    {isEditable && onUpdateField ? (
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

            <div className="border border-slate-300 rounded-xl p-3 bg-white">
              <h4 className="font-bold text-xs pb-1 mb-2 border-b border-emerald-200 text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isFr ? "Objectifs d'apprentissage" : 'الأهداف التعلمية الإجرائية'}</span>
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-700">
                {(documentData.specificObjectives || []).map((obj, idx) => (
                  <li key={idx}>
                    {isEditable && onUpdateField ? (
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

            <div className="border border-slate-300 rounded-xl p-3 bg-white">
              <h4 className="font-bold text-xs pb-1 mb-2 border-b border-emerald-200 text-emerald-950 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isFr ? 'Supports & Prérequis' : 'الوسائل والمكتسبات القبلية'}</span>
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div>
                  <span className="font-bold text-slate-800">{isFr ? 'Prérequis : ' : 'المكتسبات: '}</span>
                  <span>{(documentData.prerequisites || []).join('، ')}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">{isFr ? 'Ressources : ' : 'الوسائل: '}</span>
                  <span>{(documentData.didacticResources || []).join('، ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stages Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white text-[11px] font-bold">
                  <th className="p-2.5 border border-slate-700/40 w-1/5">{isFr ? 'Étape' : 'المرحلة'}</th>
                  <th className="p-2.5 border border-slate-700/40 w-16 text-center">{isFr ? 'Durée' : 'المدة'}</th>
                  <th className="p-2.5 border border-slate-700/40 w-1/4">{isFr ? "Activités de l'enseignant(e)" : 'أنشطة الأستاذ(ة)'}</th>
                  <th className="p-2.5 border border-slate-700/40 w-1/4">{isFr ? "Activités de l'apprenant(e)" : 'أنشطة المتعلم(ة)'}</th>
                  <th className="p-2.5 border border-slate-700/40 w-1/6">{isFr ? 'Évaluation & الوسائل' : 'التقويم والوسائل'}</th>
                  {isEditable && (
                    <th className="p-2.5 border border-slate-700/40 w-10 text-center no-print">حذف</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(documentData.lessonStages || []).map((stage, idx) => (
                  <tr key={stage.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="p-2.5 border border-slate-200 font-bold text-slate-900 align-top">
                      <StructuredEditableField
                        multiline
                        value={stage.stageName}
                        onChange={(val) => handleUpdateLessonStage(idx, 'stageName', val)}
                        isEditable={isEditable}
                        fontWeight="bold"
                        className="text-xs"
                      />
                    </td>
                    <td className="p-2.5 border border-slate-200 text-center align-top font-semibold text-slate-700">
                      <StructuredEditableField
                        value={stage.duration}
                        onChange={(val) => handleUpdateLessonStage(idx, 'duration', val)}
                        isEditable={isEditable}
                        align="center"
                        className="text-center font-bold text-xs"
                      />
                    </td>
                    <td className="p-2.5 border border-slate-200 align-top text-slate-800 leading-relaxed">
                      <StructuredEditableField
                        multiline
                        value={stage.teacherActivities}
                        onChange={(val) => handleUpdateLessonStage(idx, 'teacherActivities', val)}
                        isEditable={isEditable}
                        className="text-xs leading-relaxed"
                      />
                    </td>
                    <td className="p-2.5 border border-slate-200 align-top text-slate-800 leading-relaxed">
                      <StructuredEditableField
                        multiline
                        value={stage.studentActivities}
                        onChange={(val) => handleUpdateLessonStage(idx, 'studentActivities', val)}
                        isEditable={isEditable}
                        className="text-xs leading-relaxed"
                      />
                    </td>
                    <td className="p-2.5 border border-slate-200 align-top text-slate-700 text-[11px]">
                      {isEditable && onUpdateField ? (
                        <div className="space-y-1">
                          <StructuredEditableField
                            value={stage.evaluationMode}
                            onChange={(val) => handleUpdateLessonStage(idx, 'evaluationMode', val)}
                            isEditable={isEditable}
                            placeholder="التقويم..."
                            className="text-[10px] w-full"
                          />
                          <StructuredEditableField
                            value={stage.didacticTools}
                            onChange={(val) => handleUpdateLessonStage(idx, 'didacticTools', val)}
                            isEditable={isEditable}
                            placeholder="الوسائل..."
                            className="text-[10px] text-slate-500 w-full"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-emerald-900">{stage.evaluationMode}</div>
                          <div className="text-slate-500">{stage.didacticTools}</div>
                        </div>
                      )}
                    </td>
                    {isEditable && (
                      <td className="p-2.5 border border-slate-200 text-center align-middle no-print">
                        <button
                          type="button"
                          onClick={() => handleDeleteLessonStage(idx)}
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

            {isEditable && (
              <div className="p-2 bg-slate-50 border-t border-slate-200 text-center no-print">
                <button
                  type="button"
                  onClick={handleAddLessonStage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 font-bold text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Ajouter une étape' : 'إضافة مرحلة تعليمية جديدة'}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================== */}
      {/* 2. CHARTE DE CLASSE CONTENT */}
      {/* ========================================================== */}
      {documentData.documentType === 'charte_classe' && (
        <>
          {documentData.charteIntroduction && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 text-center">
              <div className="font-calligraphy text-base font-bold text-amber-950 mb-1">
                «ميثاق الحياة المشتركة والتعلم الإيجابي داخل فضاء الفصل»
              </div>
              <StructuredEditableField
                multiline
                value={documentData.charteIntroduction || ''}
                onChange={(val) => onUpdateField?.('charteIntroduction', val)}
                isEditable={isEditable}
                align="center"
                className="text-xs text-slate-800 leading-relaxed"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(documentData.charteRules || []).map((rule, idx) => (
              <div
                key={rule.id || idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start gap-3 relative"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-emerald-950 mb-1">{rule.category}</div>
                  <StructuredEditableField
                    multiline
                    value={rule.ruleText}
                    onChange={(val) => handleUpdateCharteRule(idx, 'ruleText', val)}
                    isEditable={isEditable}
                    className="text-xs text-slate-800 leading-relaxed"
                  />
                </div>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCharteRule(idx)}
                    className="text-slate-300 hover:text-rose-600 no-print"
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
                type="button"
                onClick={handleAddCharteRule}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة بند جديد للميثاق</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ========================================================== */}
      {/* 3. CONTROLE CONTINU / DEVOIR CONTENT */}
      {/* ========================================================== */}
      {documentData.documentType === 'controle_devoir' && (
        <>
          <div className="grid grid-cols-12 gap-2 border-2 border-slate-800 rounded-xl p-3 bg-slate-50">
            <div className="col-span-8 space-y-1">
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Nom et Prénom : ' : 'الاسم والنسب: '}</span>
                <span className="inline-block border-b border-dotted border-slate-600 w-48 text-transparent">................................</span>
              </div>
              <div>
                <span className="font-bold text-slate-800">{isFr ? 'Numéro / Groupe : ' : 'رقم الترتيب: '}</span>
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

          <div className="space-y-4">
            {(documentData.exercises || []).map((ex, idx) => (
              <div key={ex.id || idx} className="border border-slate-300 rounded-xl p-4 bg-white shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-sm text-emerald-950">{ex.title}</h4>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => handleDeleteExercise(idx)}
                      className="text-slate-300 hover:text-rose-600 no-print"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {ex.description && <p className="text-xs text-slate-800 leading-relaxed">{ex.description}</p>}
                {ex.subQuestions && (
                  <ul className="space-y-1.5 text-xs text-slate-700 pr-2">
                    {ex.subQuestions.map((q, qIdx) => (
                      <li key={qIdx} className="leading-relaxed">{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {isEditable && (
            <div className="text-center pt-2 no-print">
              <button
                type="button"
                onClick={handleAddExercise}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة تمرين جديد</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ========================================================== */}
      {/* 4. GRILLE DE NOTATION CONTENT */}
      {/* ========================================================== */}
      {(documentData.documentType === 'grille_notation' || documentData.documentType === 'registre_notes') && (
        <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-800 text-white text-[11px] font-bold">
                <th className="p-2 border border-slate-700/40 w-10 text-center">ر.ت</th>
                <th className="p-2 border border-slate-700/40 w-1/3">اسم التلميذ(ة)</th>
                <th className="p-2 border border-slate-700/40 w-16 text-center">معيار 1</th>
                <th className="p-2 border border-slate-700/40 w-16 text-center">معيار 2</th>
                <th className="p-2 border border-slate-700/40 w-16 text-center">معيار 3</th>
                <th className="p-2 border border-slate-700/40 w-16 text-center">المجموع</th>
                <th className="p-2 border border-slate-700/40 w-24 text-center">الملاحظة</th>
                {isEditable && <th className="p-2 border border-slate-700/40 w-10 text-center no-print">حذف</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(documentData.scoreRows || []).map((row, idx) => (
                <tr key={row.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="p-2 border border-slate-200 text-center">{row.studentNumber || idx + 1}</td>
                  <td className="p-2 border border-slate-200 font-bold text-slate-900">{row.studentName}</td>
                  <td className="p-2 border border-slate-200 text-center">{row.c1}</td>
                  <td className="p-2 border border-slate-200 text-center">{row.c2}</td>
                  <td className="p-2 border border-slate-200 text-center">{row.c3}</td>
                  <td className="p-2 border border-slate-200 text-center font-bold text-emerald-900 bg-emerald-50/50">{row.total}</td>
                  <td className="p-2 border border-slate-200 text-center text-slate-600">{row.appreciation}</td>
                  {isEditable && (
                    <td className="p-2 border border-slate-200 text-center no-print">
                      <button
                        type="button"
                        onClick={() => handleDeleteScoreRow(idx)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditable && (
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-center no-print">
              <button
                type="button"
                onClick={handleAddScoreRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-emerald-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة تلميذ(ة)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. CUSTOM RESUME / GENERIC SECTIONS */}
      {/* ========================================================== */}
      {documentData.customSections && documentData.customSections.length > 0 && (
        <div className="space-y-4 pt-2">
          {documentData.customSections.map((sec, idx) => (
            <div key={sec.id || idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
              {sec.title && (
                <h4 className="font-bold text-sm text-emerald-950 mb-2 pb-1 border-b border-slate-100">
                  {sec.title}
                </h4>
              )}
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {typeof sec.content === 'string' ? sec.content : JSON.stringify(sec.content)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
