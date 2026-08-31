import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ScrollText, 
  FileCheck, 
  HeartHandshake, 
  TableProperties, 
  Layers, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Globe2, 
  School, 
  User, 
  Clock, 
  BookOpen, 
  Calendar, 
  GraduationCap
} from 'lucide-react';
import { 
  DocumentType, 
  EducationLevel, 
  SubjectCategory, 
  DocumentLanguage, 
  DocumentData,
  LessonStage,
  RuleItem,
  ExerciseItem
} from '../types';
import { 
  EDUCATION_LEVELS, 
  SUBJECTS, 
  DOCUMENT_TYPE_LABELS,
  MOROCCAN_REGIONS
} from '../data/curriculumData';

interface DocumentWizardProps {
  initialType?: DocumentType;
  onDocumentCreated: (doc: DocumentData) => void;
}

export const DocumentWizard: React.FC<DocumentWizardProps> = ({
  initialType = 'fiche_pedagogique',
  onDocumentCreated,
}) => {
  // Wizard States
  const [docType, setDocType] = useState<DocumentType>(initialType);
  const [level, setLevel] = useState<EducationLevel>('middle');
  const [grade, setGrade] = useState<string>('السنة الثالثة ثانوي إعدادي');
  const [subjectCategory, setSubjectCategory] = useState<SubjectCategory>('scientific');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [language, setLanguage] = useState<DocumentLanguage>('ar');

  // Administrative details with realistic Moroccan defaults
  const [schoolName, setSchoolName] = useState('الثانوية الإعدادية ابن خلدون');
  const [academy, setAcademy] = useState('الأكاديمية الجهوية للتربية والتكوين لجهة الرباط سلا القنيطرة');
  const [directorate, setDirectorate] = useState('المديرية الإقليمية بسلا');
  const [teacherName, setTeacherName] = useState('الأستاذ(ة): ذ. محمد الإدريسي');
  const [classGroup, setClassGroup] = useState('3 / 1 و 3 / 2');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [unitOrModule, setUnitOrModule] = useState('الحساب الجبري والمعادلات');
  const [lessonTitle, setLessonTitle] = useState('الحساب الحرفي والمعادلات من الدرجة الأولى');
  const [duration, setDuration] = useState('4 حصص (4 ساعات)');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Sync Level & Grade options
  const currentLevelConfig = EDUCATION_LEVELS.find((l) => l.id === level) || EDUCATION_LEVELS[1];
  
  useEffect(() => {
    if (currentLevelConfig.grades.length > 0) {
      setGrade(currentLevelConfig.grades[0].nameAr);
    }
  }, [level]);

  // Filter subjects based on selected category and supported level
  const availableSubjects = SUBJECTS.filter((s) => {
    const categoryMatches = s.category === subjectCategory;
    const levelSupported = s.supportedLevels.includes(level);
    return categoryMatches && levelSupported;
  });

  // Keep selected subject valid
  useEffect(() => {
    if (availableSubjects.length > 0) {
      const exists = availableSubjects.some((s) => s.id === selectedSubjectId);
      if (!exists) {
        setSelectedSubjectId(availableSubjects[0].id);
      }
    }
  }, [subjectCategory, level, availableSubjects, selectedSubjectId]);

  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];

  // Auto update language for French/English subjects
  useEffect(() => {
    if (currentSubject.id === 'french') {
      setLanguage('fr');
    } else if (currentSubject.category !== 'scientific' && currentSubject.id !== 'pe_eps') {
      setLanguage('ar');
    }
  }, [currentSubject]);

  // Dynamic context generator for topic, unit and title based on Document Type & Subject
  useEffect(() => {
    const isFrench = language === 'fr';
    
    if (docType === 'charte_classe') {
      setUnitOrModule(isFrench ? 'Vie scolaire et citoyenneté' : 'الحياة المدرسية والسلوك المدني والعيش المشترك');
      setLessonTitle(isFrench ? 'Règlement Intérieur et Charte de Classe' : 'ميثاق وقانون القسم والعيش المشترك');
    } else if (docType === 'controle_devoir') {
      setUnitOrModule(isFrench ? 'Évaluation continue' : 'المراقبة المستمرة الدورية');
      setLessonTitle(isFrench ? `Contrôle continu N°1 - ${currentSubject.nameFr}` : `فرض محروس رقم 1 - مادة ${currentSubject.nameAr}`);
    } else if (docType === 'evaluation_soutien') {
      setUnitOrModule(isFrench ? 'Dispositif de soutien' : 'أنشطة الدعم والمعالجة البيداغوجية');
      setLessonTitle(isFrench ? `Plan de remédiation - ${currentSubject.nameFr}` : `خطة الدعم التربوي والمعالجة البيداغوجية - مادة ${currentSubject.nameAr}`);
    } else if (docType === 'grille_notation') {
      setUnitOrModule(isFrench ? 'Suivi et notation' : 'تفريغ وتتبع نقط المراقبة المستمرة');
      setLessonTitle(isFrench ? `Grille d'évaluation sommative - ${currentSubject.nameFr}` : `شبكة تفريغ نتائج المراقبة المستمرة - مادة ${currentSubject.nameAr}`);
    } else if (docType === 'rapport_conseil') {
      setUnitOrModule(isFrench ? 'Gestion pédagogique' : 'مجالس المؤسسة والتوجيه التربوي');
      setLessonTitle(isFrench ? 'Bilan trimestriel des résultats scolaires' : 'تقرير تركيبي لاجتماع مجلس القسم');
    } else if (docType === 'attestation_affiche') {
      setUnitOrModule(isFrench ? 'Encouragement et mérite' : 'الحياة المدرسية وتشجيع التميز');
      setLessonTitle(isFrench ? 'Reconnaissance du mérite scolaire' : 'شهادة تقدير وتشجيع للتفوق الدراسي');
    } else if (docType === 'fiche_activite') {
      setUnitOrModule(isFrench ? 'Travaux dirigés et TP' : 'الأنشطة التطبيقية والداعمة');
      setLessonTitle(isFrench ? `Fiche d'exercices d'application - ${currentSubject.nameFr}` : `بطاقة أنشطة تطبيقية وتمارين للدعم - مادة ${currentSubject.nameAr}`);
    } else if (docType === 'resume_cours') {
      setUnitOrModule(isFrench ? 'Synthèse de cours' : 'ملخصات الدروس والخرائط الذهنية');
      setLessonTitle(isFrench ? `Résumé méthodique - ${currentSubject.nameFr}` : `ملخص شامل ومركّز للدرس - مادة ${currentSubject.nameAr}`);
    } else {
      // Fiche pedagogique
      const subjectMap: Record<string, { ar: string; fr: string; unitAr: string; unitFr: string }> = {
        math: { ar: 'الحساب الحرفي والمعادلات من الدرجة الأولى', fr: 'Calcul littéral et équations', unitAr: 'الحساب الجبري والمعادلات', unitFr: 'Calcul algébrique' },
        physics_chemistry: { ar: 'المقاومة الكهربائية وقانون أوم', fr: 'Résistance électrique et loi d\'Ohm', unitAr: 'الكهرباء والطاقة', unitFr: 'Électricité' },
        life_earth_sciences: { ar: 'الهضم والامتصاص المعوي والتربية الغذائية', fr: 'Digestion et absorption intestinale', unitAr: 'وظائف الاقتيات والتربية الصحية', unitFr: 'Fonctions de nutrition' },
        arabic: { ar: 'مكون القراءة: النص القرائي وقضايا معاصرة', fr: 'Lecture méthodique et étude de texte', unitAr: 'المجال الاجتماعي والاقتصادي', unitFr: 'Domaine social' },
        french: { ar: 'دراسة النص الأدبي والتعبير الكتابي', fr: 'Étude de texte et production écrite', unitAr: 'La nouvelle réaliste', unitFr: 'La nouvelle réaliste' },
        islamic_studies: { ar: 'مدخل التزكية: سورة الحشر والقرآن الكريم', fr: 'Éducation islamique : Tazkia', unitAr: 'مدخل التزكية والاقتداء', unitFr: 'Tazkia & Valeurs' },
        history_geography: { ar: 'المغرب: الكفاح من أجل الاستقلال وإتمام الوحدة الترابية', fr: 'Histoire et Géographie du Maroc', unitAr: 'المغرب والعالم المعاصر', unitFr: 'Le Maroc et le monde' },
        philosophy: { ar: 'مجزوءة الوضع البشري: مفهوم الشخص والهوية', fr: 'La condition humaine : La personne', unitAr: 'مجزوءة الوضع البشري', unitFr: 'La condition humaine' },
        english: { ar: 'Reading Comprehension & Grammar Structure', fr: 'Reading Comprehension & Grammar', unitAr: 'Unit 1: Education and Ambition', unitFr: 'Unit 1: Education' },
        pe_eps: { ar: 'الجمباز الأرضي والتوافق الحركي الجماعي', fr: 'Gymnastique au sol et coordination', unitAr: 'الأنشطة البدنية والرياضية', unitFr: 'Activités Physiques et Sportives' },
      };

      const match = subjectMap[currentSubject.id];
      if (match) {
        setUnitOrModule(isFrench ? match.unitFr : match.unitAr);
        setLessonTitle(isFrench ? match.fr : match.ar);
      } else {
        const units = isFrench ? currentSubject.defaultUnits.fr : currentSubject.defaultUnits.ar;
        if (units && units.length > 0) setUnitOrModule(units[0]);
        setLessonTitle(isFrench ? `Leçon : ${currentSubject.nameFr}` : `درس في مادة ${currentSubject.nameAr}`);
      }
    }
  }, [docType, currentSubject, language]);

  const handleCreateDocument = async () => {
    setIsGeneratingAi(true);

    const isFr = language === 'fr';
    const subjNameAr = currentSubject.nameAr;
    const subjNameFr = currentSubject.nameFr;

    let initialLessonStages: LessonStage[] = [];
    let initialCharteRules: RuleItem[] = [];
    let initialExercises: ExerciseItem[] = [];

    // Provide rich realistic starting structures tailored by document type
    if (docType === 'fiche_pedagogique') {
      if (currentSubject.id === 'pe_eps') {
        initialLessonStages = [
          {
            id: 'eps-s1',
            stageName: isFr ? 'Échauffement général et dynamique' : 'الإحماء العام والتنشيط الحركي',
            duration: '15 min',
            teacherActivities: isFr ? 'Diriger la course et les étirements articulaires' : 'توجيه الجري التدرجي وحركات تليين المفاصل والعضلات',
            studentActivities: isFr ? 'Mobiliser l\'appareil locomoteur et cardio-respiratoire' : 'الجري المنظم، حركات التمدد، والتنشيط العضلي العام',
            evaluationMode: isFr ? 'Observation de l\'engagement moteur' : 'ملاحظة وتيرة التنفس والاستعداد الحركي',
            didacticTools: isFr ? 'Plots, chronomètre' : 'أقماع، ميقاتي، صافرة',
          },
          {
            id: 'eps-s2',
            stageName: isFr ? 'Situation d\'apprentissage principal' : 'الوضعية التعليمية الأساسية',
            duration: '40 min',
            teacherActivities: isFr ? 'Explication de la consigne technique et régulation' : 'شرح النموذج الحركي السليم وتصحيح وضعية التموضع',
            studentActivities: isFr ? 'Répétition du geste technique dans un contexte varié' : 'تكرار المهارة المستهدفة في وضعيات حركية متنوعة',
            evaluationMode: isFr ? 'Critères de réussite techniques' : 'شبكة تقويم معايير الإنجاز والنجاح',
            didacticTools: isFr ? 'Ballons, chasubles' : 'كرات، صدريات ملونة',
          },
          {
            id: 'eps-s3',
            stageName: isFr ? 'Match d\'application & Retour au calme' : 'المباراة التطبيقية والعودة للهدوء',
            duration: '35 min',
            teacherActivities: isFr ? 'Arbitrage, observation et bilan pédagogique' : 'تحكيم المقابلة ورصد السلوكات وحصيلة الحصة',
            studentActivities: isFr ? 'Appliquer la compétence en compétition loyale' : 'التطبيق في إطار تنافسي شريف واستخلاص النتائج',
            evaluationMode: isFr ? 'Évaluation sommative des compétences' : 'تقويم جماعي لروح الفريق والمهارة',
            didacticTools: isFr ? 'Terrain complet' : 'الملعب كاملاً',
          },
        ];
      } else {
        initialLessonStages = [
          {
            id: 's-1',
            stageName: isFr ? '1. Situation déclenchante & Problématique' : '1. الوضعية الاستكشافية والانطلاق (تمهيد)',
            duration: '20 min',
            teacherActivities: isFr 
              ? 'Présenter la situation-problème concrète, orienter le questionnement des élèves.'
              : 'طرح وضعية مشكلة واقعية تثير دافعية المتعلمين، وتوجيههم لنمذجة المسألة وصياغة الفرضيات.',
            studentActivities: isFr
              ? 'Analyser les données, mobiliser les prérequis et formuler des hypothèses explicatives.'
              : 'استحضار المكتسبات القبلية، الملاحظة الدقيقة، وصياغة تخمينات وفرضيات أولية للحل.',
            evaluationMode: isFr ? 'Évaluation diagnostique des acquis' : 'تقويم تشخيصي تشاركي وتدوين الفرضيات على السبورة.',
            didacticTools: isFr ? 'Projecteur / Fiche documentaire' : 'الكتاب المدرسي + بطاقات الوضعية المشكلة.',
          },
          {
            id: 's-2',
            stageName: isFr ? '2. Activités de recherche & Construction' : '2. بناء المفاهيم والأنشطة الديداكتيكية',
            duration: '45 min',
            teacherActivities: isFr
              ? 'Encadrer le travail d\'investigation, réguler les ateliers et valider les étapes.'
              : 'تيسير وتوجيه مهام البحث، تدبير المجموعات، ومساعدة المتعلمين على استخلاص القواعد والمفاهيم.',
            studentActivities: isFr
              ? 'Réaliser l\'activité de recherche, traiter les informations et rédiger les résultats.'
              : 'الاشتغال الفردي ثم التشاركي في مجموعات، معالجة المعطيات، وتدوين الاستنتاجات الجزئية.',
            evaluationMode: isFr ? 'Évaluation formative continue' : 'تقويم تكويني مرحلي وتصحيح التعثرات المرصودة.',
            didacticTools: isFr ? 'Manuel scolaire, matériel didactique' : 'السبورة + أدوات القياس وكراسة الأنشطة.',
          },
          {
            id: 's-3',
            stageName: isFr ? '3. Institutionnalisation & Bilan de cours' : '3. المأسسة والخلاصة التركيبية',
            duration: '30 min',
            teacherActivities: isFr
              ? 'Synthétiser les conclusions, énoncer formellement les définitions et propriétés.'
              : 'مساعدة المتعلمين على صياغة النص الرياضي / العلمي النهائي وتثبيت القواعد في الدفاتر.',
            studentActivities: isFr
              ? 'Participer à l\'élaboration du résumé et prendre des notes structurées.'
              : 'المشاركة الفعالة في صياغة الملخص وتدوين القواعد الرياضية والتعاريف الأساسية.',
            evaluationMode: isFr ? 'Vérification de la prise de notes' : 'مراقبة تنظيم الدفاتر وجودة التدوين.',
            didacticTools: isFr ? 'Tableau, cahier de cours' : 'السبورة والدفاتر المدرسية.',
          },
          {
            id: 's-4',
            stageName: isFr ? '4. Réinvestissement & Évaluation sommative' : '4. الاستثمار والتقويم الإجمالي',
            duration: '25 min',
            teacherActivities: isFr
              ? 'Proposer des exercices d\'application gradués et apporter un soutien individualisé.'
              : 'اقتراح تمرين تطبيقي توليفي مركب وتشكيل مجموعات دعم ومعالجة فورية.',
            studentActivities: isFr
              ? 'Résoudre individuellement l\'exercice d\'application et vérifier ses acquis.'
              : 'حل التمرين التطبيقي بشكل مستقل وتطبيق الخاصيات المدروسة بدقة وبخطوات مبررة.',
            evaluationMode: isFr ? 'Évaluation sommative individuelle' : 'تقويم إجمالي فردي بشبكة معايير مصغرة.',
            didacticTools: isFr ? 'Série d\'exercices imprimée' : 'أوراق التقييم التكويني الذاتي.',
          },
        ];
      }
    } else if (docType === 'charte_classe') {
      initialCharteRules = [
        { id: 'cr-1', category: 'الاحترام المتبادل واللباقة', ruleText: 'احترام الأستاذ(ة) والزملاء، والتحدث بلباقة وأدب رفيع، ونبذ السخرية والتنمر بجميع أشكاله اللفظية والمعنوية.' },
        { id: 'cr-2', category: 'المواظبة والانضباط الزمني', ruleText: 'الحضور في الوقت المحدد للحصة دون أي تأخر، وتجنب الغياب إلا بعذر مقبول مع الإدلاء بالإذن الإداري قبل الدخول.' },
        { id: 'cr-3', category: 'الأدوات والاستعداد المدرسي', ruleText: 'إحضار جميع الأدوات المدرسية والكتب والدفاتر الخاصة بالحصة، مع الحفاظ على هندام مدرسي لائق ومحترم.' },
        { id: 'cr-4', category: 'المشاركة والعمل الجماعي', ruleText: 'الإنصات باهتمام أثناء الشرح، طلب الكلمة برفع اليد دون تشويش، والتعاون الإيجابي مع أعضاء الفريق في الورشات التشاركية.' },
        { id: 'cr-5', category: 'نظافة وسلامة فضاء الفصل', ruleText: 'المحافظة التامة على نظافة الحجرة الدراسية، سلامة الطاولات، الجدران، والسبورة، وإطفاء الأجهزة عند مغادرة القاعة.' },
        { id: 'cr-6', category: 'الهواتف والأجهزة الإلكترونية', ruleText: 'يُمنع منعاً كلياً استعمال الهاتف المحمول داخل الفصل الدراسي إلا بتوجيه واستعمال بيداغوجي صريح من الأستاذ(ة).' },
        { id: 'cr-7', category: 'الأمانة العلمية والاجتهاد', ruleText: 'إنجاز الواجبات المنزلية والبحوث باستمرار، والاعتماد على الذات في فروض المراقبة المستمرة ونبذ الغش نهائياً.' },
      ];
    } else if (docType === 'controle_devoir') {
      initialExercises = [
        {
          id: 'ex-init-1',
          title: isFr ? 'Exercice 1 : Restitution des connaissances (6 points)' : 'التمرين الأول: استرداد المعارف والمفاهيم (6 نقاط)',
          points: '6 ن',
          description: isFr ? 'Répondre par vrai ou faux et définir les concepts clés :' : 'أجب بصحيح أو خطأ وعرف المفاهيم الأساسية التالية:',
          subQuestions: [
            isFr ? '1. Définir les notions clés du chapitre.' : '1. عرف المصطلحات والمفاهيم المركزية للدرس (2 ن).',
            isFr ? '2. Cocher la bonne réponse pour chaque proposition.' : '2. أجب بصحيح أو خطأ مع تصحيح العبارات الخاطئة (2 ن).',
            isFr ? '3. Relier chaque élément à sa définition correspondante.' : '3. صل بسهم كل عنصر بمدلوله العلمي الدقيق (2 ن).',
          ],
        },
        {
          id: 'ex-init-2',
          title: isFr ? 'Exercice 2 : Raisonnement scientifique et calcul (8 points)' : 'التمرين الثاني: الاستدلال العلمي والتطبيق الرياضي (8 نقاط)',
          points: '8 ن',
          description: isFr ? 'Soit les données expérimentales et la figure géométrique ci-dessous :' : 'انطلاقاً من المعطيات والشكل الهندسي المرفق:',
          subQuestions: [
            isFr ? '1. Appliquer les formules et justifier les étapes de calcul.' : '1. اذكر الخاصية الرياضية / الفيزيائية الواجب تطبيقها مبرراً اختيارك (2.5 ن).',
            isFr ? '2. Calculer les grandeurs demandées avec les unités internationales.' : '2. احسب القيم المطلوبة مع تحديد وحدات القياس العالمية بدقة (3.5 ن).',
            isFr ? '3. Interpréter le résultat obtenu.' : '3. فسر النتيجة المحصل عليها واستخلص استنتاجاً دالاً (2 ن).',
          ],
        },
        {
          id: 'ex-init-3',
          title: isFr ? 'Exercice 3 : Situation-problème d\'intégration (6 points)' : 'التمرين الثالث: مسألة إدماجية ووضعية مركبة (6 نقاط)',
          points: '6 ن',
          description: isFr ? 'Résolution d\'un problème concret mobilisant plusieurs acquis :' : 'معالجة وضعية مشكلة واقعية تدمج موارد الوحدة:',
          subQuestions: [
            isFr ? '1. Analyser la situation et identifier les contraintes.' : '1. حلل عناصر الوضعية وحدد المعطيات الأساسية المساعدة على الحل (2 ن).',
            isFr ? '2. Proposer une solution argumentée et structurée.' : '2. اقترح حلاً مبرراً ومنظماً مدعماً بالبراهين والعمليات المناسبة (4 ن).',
          ],
        },
      ];
    }

    const newDoc: DocumentData = {
      id: `doc-${Date.now()}`,
      title: isFr 
        ? `${DOCUMENT_TYPE_LABELS[docType].fr} : ${lessonTitle}`
        : (docType === 'charte_classe' || docType === 'attestation_affiche' || docType === 'rapport_conseil'
            ? lessonTitle
            : `${DOCUMENT_TYPE_LABELS[docType].ar}: ${lessonTitle}`),
      documentType: docType,
      level,
      grade,
      subjectCategory,
      subjectId: selectedSubjectId,
      subjectNameAr: subjNameAr,
      subjectNameFr: subjNameFr,
      language,
      kingdomHeader: isFr ? 'Royaume du Maroc' : 'المملكة المغربية',
      ministryHeader: isFr 
        ? 'Ministère de l\'Éducation Nationale, du Préscolaire et des Sports' 
        : 'وزارة التربية الوطنية والتعليم الأولي والرياضة',
      academy,
      directorate,
      schoolName,
      teacherName,
      classGroup,
      academicYear,
      unitOrModule,
      lessonTitle,
      duration,
      documentDate,
      themeColor: docType === 'charte_classe' ? 'royal' : docType === 'controle_devoir' ? 'crimson' : 'emerald',
      templateDesign: 'official',
      showOfficialHeader: true,
      showOfficialEmblem: true,
      showSchoolLogo: true,
      showTeacherSignature: true,
      showSchoolSignature: true,
      showInspectorSignature: docType === 'fiche_pedagogique',
      showFooterInfo: true,
      showPageNumbers: true,
      pageFormat: docType === 'grille_notation' ? 'a4_landscape' : 'a4_portrait',
      
      // Competences & objectives
      generalCompetences: [
        isFr ? 'Mobiliser les ressources pour résoudre une situation complexe.' : 'تنمية التفكير المنهجي والقدرة على البرهنة وحل المشكلات.',
        isFr ? 'Communiquer avec rigueur à l\'oral et à l\'écrit.' : 'التعبير السليم والتبرير المنطقي المنظم للخطوات العلمية.',
      ],
      specificObjectives: [
        isFr ? `Maîtriser les notions clés de : ${lessonTitle}.` : `أن يتعرف المتعلم على المفاهيم الأساسية لدرس: ${lessonTitle}.`,
        isFr ? 'Appliquer les règles et méthodes dans des exercices variés.' : 'أن يوظف القواعد والخاصيات في حل تمارين ومسائل متنوعة.',
        isFr ? 'Développer l\'autonomie et la rigueur dans le raisonnement.' : 'أن يبرهن على النتائج بأسلوب دقيق ويحترم الخطوات الرياضية والمنهجية.',
      ],
      didacticResources: [
        isFr ? 'Manuel officiel agréé, vidéoprojecteur, tableau.' : 'الكتاب المدرسي المعتمد، السبورة، مسلاط رقمي، أدوات هندسية.',
        isFr ? 'Fiches d\'activités imprimées pour le travail d\'équipe.' : 'أوراق عمل وبطاقات تقويمية للمجموعات التشاركية.',
      ],
      prerequisites: [
        isFr ? 'Les prérequis de la séquence didactique précédente.' : 'المكتسبات القبلية والتعلمات السابقة المرتبطة بالموضوع.',
      ],
      lessonStages: initialLessonStages,
      diagnosticEval: isFr ? 'QCM rapide de vérification des prérequis.' : 'أسئلة سريعة وبطاقات تقويمية لتشخيص المكتسبات القبلية.',
      formativeEval: isFr ? 'Exercices d\'application guidés.' : 'تمارين تطبيقية موجهة فردية وثنائية للتحقق من الفهم.',
      summativeEval: isFr ? 'Exercice d\'intégration et bilan sommmatif.' : 'تمرين إدماجي تقويمي لقياس بلوغ الأهداف المسطرة.',
      supportActivities: isFr ? 'Atelier de remédiation ciblée.' : 'أنشطة دعم بيداغوجي موازية لمعالجة التعثرات الفورية.',
      teacherNotes: isFr ? 'Séance réalisée avec dynamisme.' : 'تم إنجاز الحصة مع تفاعل إيجابي وتركيز على تدقيق المفاهيم.',

      // Specialized fields
      charteIntroduction: 'سعياً منا لجعل فضاء الفصل بيئة تربوية ملهمة يسودها الاحترام المتبادل والتعلم المثمر وروح المسؤولية والمواطنة الفاعلة، اتفق الأستاذ(ة) وتلميذات وتلاميذ هذا القسم على هذا الميثاق كعهد تربوي وأخلاقي ملزم للجميع.',
      charteRules: initialCharteRules,
      charteTeacherCommitment: 'يلتزم الأستاذ(ة) بتقديم دروس عالية الجودة، ومساعدة كل متعلم(ة) على التفوق، وتوفير مناخ نفسي آمن ومنصف يشجع على التعبير البناء.',
      charteStudentRepName: 'عن ممثل(ة) تلميذات وتلاميذ القسم',

      examTotalPoints: '20 / 20',
      examInstructions: [
        'يُسمح باستعمال الأدوات الهندسية والآلة الحاسبة العلمية غير القابلة للبرمجة.',
        'تُمنح نقطة واحدة لحسن تنظيم ورقة التحرير ووضوح الخط وجودة التبريرات.',
      ],
      exercises: initialExercises,

      // Score rows for Grille
      evaluationCriteriaNames: ['فهم المقروء والتحليل (5ن)', 'التطبيق والتراكيب (5ن)', 'التعبير والإنتاج (6ن)', 'المواظبة والمشاركة (4ن)'],
      scoreRows: [
        { id: 'sc-1', studentNumber: 1, studentName: 'أحمد الإدريسي', c1: '4.5', c2: '4.5', c3: '5.0', c4: '4.0', total: '18.00', appreciation: 'متميز جداً' },
        { id: 'sc-2', studentNumber: 2, studentName: 'سارة العلمي', c1: '4.0', c2: '4.5', c3: '5.5', c4: '4.0', total: '18.00', appreciation: 'ممتازة وواظبة' },
        { id: 'sc-3', studentNumber: 3, studentName: 'ياسين بنسودة', c1: '3.5', c2: '3.0', c3: '4.0', c4: '3.5', total: '14.00', appreciation: 'حسن' },
        { id: 'sc-4', studentNumber: 4, studentName: 'فاطمة الزهراء الشاوي', c1: '4.5', c2: '5.0', c3: '5.5', c4: '4.0', total: '19.00', appreciation: 'أداء راقٍ ومتميز' },
      ],

      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setIsGeneratingAi(false);
    onDocumentCreated(newDoc);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Title & Introduction */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-bold mb-3 border border-[#A7F3D0]">
          <Sparkles className="w-4 h-4 text-[#065F46]" />
          <span>منشئ الوثائق التربوية المغربية</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#2D3436] mb-2">
          إنشاء وثيقة تربوية جديدة
        </h2>
        <p className="text-[#6B7280] text-sm sm:text-base max-w-2xl mx-auto">
          اختر نوع الوثيقة والسلك والمادة لإنشاء وثيقة متكاملة ومطابقة للتوجيهات الرسمية، جاهزة للمعاينة والتعديل والتحميل بجميع الصيغ.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-[#E5E7EB]">
        
        {/* Step 1: Select Document Type */}
        <div className="p-6 sm:p-8">
          <label className="block text-base font-bold text-[#2D3436] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#065F46] text-white text-xs font-black flex items-center justify-center">1</span>
            <span>اختر نوع الوثيقة التربوية</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((typeKey) => {
              const labelObj = DOCUMENT_TYPE_LABELS[typeKey];
              const isSelected = docType === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  id={`select-doc-type-${typeKey}`}
                  onClick={() => setDocType(typeKey)}
                  className={`p-4 rounded-2xl text-right transition-all border-2 flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-[#065F46] bg-[#ECFDF5] shadow-xs ring-2 ring-[#065F46]/20'
                      : 'border-[#E5E7EB] hover:border-[#A7F3D0] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#065F46] text-white' : 'bg-[#F3F4F6] text-[#4B5563] group-hover:bg-[#ECFDF5] group-hover:text-[#065F46]'}`}>
                      {typeKey === 'fiche_pedagogique' && <FileSpreadsheet className="w-5 h-5" />}
                      {typeKey === 'charte_classe' && <ScrollText className="w-5 h-5" />}
                      {typeKey === 'controle_devoir' && <FileCheck className="w-5 h-5" />}
                      {typeKey === 'evaluation_soutien' && <HeartHandshake className="w-5 h-5" />}
                      {typeKey === 'grille_notation' && <TableProperties className="w-5 h-5" />}
                      {typeKey === 'fiche_activite' && <Layers className="w-5 h-5" />}
                      {typeKey === 'rapport_conseil' && <FileText className="w-5 h-5" />}
                      {typeKey === 'attestation_affiche' && <Award className="w-5 h-5" />}
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#065F46] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-[#1F2937] text-sm leading-snug">
                      {labelObj.ar}
                    </h4>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-md">
                      {labelObj.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Cycle & Grade Selection */}
        <div className="p-6 sm:p-8 bg-[#F9FAFB]">
          <label className="block text-base font-bold text-[#2D3436] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#065F46] text-white text-xs font-black flex items-center justify-center">2</span>
            <span>اختيار السلك والمستوى الدراسي</span>
          </label>

          {/* Education Level Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {EDUCATION_LEVELS.map((lvl) => {
              const isSelected = level === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  id={`select-level-${lvl.id}`}
                  onClick={() => setLevel(lvl.id)}
                  className={`p-3.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#065F46] bg-white shadow-xs font-bold text-[#065F46] ring-2 ring-[#065F46]/20'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563]'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{lvl.nameAr}</div>
                    <div className="text-[11px] text-[#6B7280] line-clamp-1">{lvl.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Grade Selector Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                المستوى الدراسي بالتحديد:
              </label>
              <select
                id="select-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#1F2937] focus:outline-hidden focus:ring-2 focus:ring-[#065F46] focus:border-[#065F46] shadow-xs"
              >
                {currentLevelConfig.grades.map((g) => (
                  <option key={g.id} value={g.nameAr}>
                    {g.nameAr} {language === 'fr' ? `(${g.nameFr})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                تصنيف المادة:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#E5E7EB] p-1 rounded-xl">
                <button
                  type="button"
                  id="cat-btn-scientific"
                  onClick={() => setSubjectCategory('scientific')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    subjectCategory === 'scientific'
                      ? 'bg-white text-[#065F46] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#1F2937]'
                  }`}
                >
                  مواد علمية
                </button>
                <button
                  type="button"
                  id="cat-btn-literary"
                  onClick={() => setSubjectCategory('literary_humanities')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    subjectCategory === 'literary_humanities'
                      ? 'bg-white text-[#065F46] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#1F2937]'
                  }`}
                >
                  أدبية وإنسانية
                </button>
                <button
                  type="button"
                  id="cat-btn-pe"
                  onClick={() => setSubjectCategory('physical_education')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    subjectCategory === 'physical_education'
                      ? 'bg-white text-[#065F46] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#1F2937]'
                  }`}
                >
                  تربية بدنية (EPS)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Subject & Language Selection */}
        <div className="p-6 sm:p-8">
          <label className="block text-base font-bold text-[#2D3436] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#065F46] text-white text-xs font-black flex items-center justify-center">3</span>
            <span>المادة ولغة التدريس</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            {availableSubjects.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  id={`subject-select-${sub.id}`}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] font-bold ring-2 ring-[#065F46]/20'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] text-[#4B5563]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{sub.nameAr}</div>
                    <div className="text-xs text-[#6B7280] font-normal">{sub.nameFr}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#065F46]" />}
                </button>
              );
            })}
          </div>

          {/* Bilingual Language Selector for Scientific and Bilingual Subjects */}
          {(currentSubject.category === 'scientific' || currentSubject.isBilingual) && (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#92400E] shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#78350F] text-sm">
                    لغة إنجاز وتدريس مادة {currentSubject.nameAr}:
                  </h4>
                  <p className="text-xs text-[#92400E]">
                    اختر اللغة الرسمية للجذاذة والوثيقة (المسار العام بالعربية / المسار الدولي خيار فرنسية BIOF).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#FDE68A]/60 p-1 rounded-xl self-stretch sm:self-auto justify-center">
                <button
                  type="button"
                  id="lang-btn-ar"
                  onClick={() => setLanguage('ar')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    language === 'ar'
                      ? 'bg-[#065F46] text-white shadow-xs'
                      : 'text-[#374151] hover:text-[#111827]'
                  }`}
                >
                  اللغة العربية (المسار العام)
                </button>

                <button
                  type="button"
                  id="lang-btn-fr"
                  onClick={() => setLanguage('fr')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    language === 'fr'
                      ? 'bg-[#065F46] text-white shadow-xs'
                      : 'text-[#374151] hover:text-[#111827]'
                  }`}
                >
                  Français (Option Internationale)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Administrative & Lesson Details */}
        <div className="p-6 sm:p-8 bg-[#F9FAFB]">
          <label className="block text-base font-bold text-[#2D3436] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#065F46] text-white text-xs font-black flex items-center justify-center">4</span>
            <span>البيانات الإدارية والتفاصيل الديداكتيكية</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-[#065F46]" />
                <span>المؤسسة التعليمية:</span>
              </label>
              <input
                id="input-school-name"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="مثال: الثانوية الإعدادية ابن خلدون"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#065F46]" />
                <span>اسم الأستاذ(ة):</span>
              </label>
              <input
                id="input-teacher-name"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="الأستاذ(ة): ذ. ..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                المديرية الإقليمية:
              </label>
              <input
                id="input-directorate"
                type="text"
                value={directorate}
                onChange={(e) => setDirectorate(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="المديرية الإقليمية..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                الأكاديمية الجهوية:
              </label>
              <select
                id="input-academy"
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-xs text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
              >
                {MOROCCAN_REGIONS.map((reg) => (
                  <option key={reg} value={`الأكاديمية الجهوية للتربية والتكوين لـ ${reg}`}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                القسم / الفوج:
              </label>
              <input
                id="input-class-group"
                type="text"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="مثال: 3 / 1 و 3 / 2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                السنة الدراسية:
              </label>
              <input
                id="input-academic-year"
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="2026 - 2027"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#065F46]" />
                <span>الوحدة / المجزوءة / المجال:</span>
              </label>
              <input
                id="input-unit-module"
                type="text"
                value={unitOrModule}
                onChange={(e) => setUnitOrModule(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="الوحدة الأولى..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1">
                عنوان الدرس / النشاط / الفرض:
              </label>
              <input
                id="input-lesson-title"
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm font-semibold text-[#111827] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="مثال: مبرهنة طاليس..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#065F46]" />
                <span>المدة الزمنية / الغلاف الزمني:</span>
              </label>
              <input
                id="input-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#065F46] shadow-xs"
                placeholder="مثال: 4 حصص (4 ساعات)"
              />
            </div>

          </div>
        </div>

        {/* Action Button: Create Document */}
        <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#6B7280]">
            سيتم فتح محرر الوثيقة مباشرة بعد الإنشاء لتعديل النصوص والجداول والطباعة والتحميل.
          </div>

          <button
            type="button"
            id="btn-submit-create-doc"
            onClick={handleCreateDocument}
            disabled={isGeneratingAi}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#065F46] hover:bg-[#044735] text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-sm transition-all active:scale-95 disabled:opacity-50 border border-[#044735]"
          >
            {isGeneratingAi ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>جاري إعداد محتوى الوثيقة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#FDE68A]" />
                <span>إنشاء الوثيقة والانتقال للمحرر</span>
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
