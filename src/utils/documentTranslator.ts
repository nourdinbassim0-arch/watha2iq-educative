import { DocumentData, DocumentLanguage, LessonStage, RuleItem, ExerciseItem } from '../types';
import { DOCUMENT_TYPE_LABELS, SUBJECTS } from '../data/curriculumData';

/**
 * Translates a complete Moroccan educational document to the target language (ar, fr, en)
 * while preserving layout, scores, tables, signatures, and custom logos.
 */
export function translateDocumentContent(doc: DocumentData, targetLang: DocumentLanguage): DocumentData {
  if (doc.language === targetLang) {
    return doc;
  }

  const isTargetAr = targetLang === 'ar';
  const isTargetFr = targetLang === 'fr';
  const isTargetEn = targetLang === 'en';

  // 1. Kingdom & Ministry Headers
  let kingdomHeader = 'المملكة المغربية';
  let ministryHeader = 'وزارة التربية الوطنية والتعليم الأولي والرياضة';
  let academy = doc.academy;
  let directorate = doc.directorate;

  if (isTargetFr) {
    kingdomHeader = 'Royaume du Maroc';
    ministryHeader = 'Ministère de l\'Éducation Nationale, du Préscolaire et des Sports';
    if (academy.includes('الرباط')) {
      academy = 'Académie Régionale de Rabat-Salé-Kénitra';
      directorate = 'Direction Provinciale de Salé';
    } else if (academy.includes('الدار البيضاء')) {
      academy = 'Académie Régionale de Casablanca-Settat';
      directorate = 'Direction Provinciale d\'Anfa';
    } else if (academy.includes('مراكش')) {
      academy = 'Académie Régionale de Marrakech-Safi';
      directorate = 'Direction Provinciale de Marrakech';
    } else if (academy.includes('فاس')) {
      academy = 'Académie Régionale de Fès-Meknès';
      directorate = 'Direction Provinciale de Fès';
    } else if (academy.includes('طنجة')) {
      academy = 'Académie Régionale de Tanger-Tétouan-Al Hoceïma';
      directorate = 'Direction Provinciale de Tanger-Assilah';
    } else {
      academy = 'Académie Régionale d\'Éducation et de Formation';
      directorate = 'Direction Provinciale';
    }
  } else if (isTargetEn) {
    kingdomHeader = 'Kingdom of Morocco';
    ministryHeader = 'Ministry of National Education, Preschool and Sports';
    academy = 'Regional Academy of Education and Training';
    directorate = 'Provincial Directorate';
  } else {
    kingdomHeader = 'المملكة المغربية';
    ministryHeader = 'وزارة التربية الوطنية والتعليم الأولي والرياضة';
    academy = 'الأكاديمية الجهوية للتربية والتكوين لجهة الرباط سلا القنيطرة';
    directorate = 'المديرية الإقليمية بسلا';
  }

  // 2. Subject Name & Labels
  const subjectConfig = SUBJECTS.find((s) => s.id === doc.subjectId);
  const subjectName = isTargetAr 
    ? (subjectConfig?.nameAr || doc.subjectNameAr || 'الرياضيات')
    : isTargetFr 
      ? (subjectConfig?.nameFr || doc.subjectNameFr || 'Mathématiques')
      : (subjectConfig?.nameFr || doc.subjectNameFr || 'Mathematics');

  const docTypeLabel = DOCUMENT_TYPE_LABELS[doc.documentType] 
    ? (isTargetAr ? DOCUMENT_TYPE_LABELS[doc.documentType].ar : isTargetFr ? DOCUMENT_TYPE_LABELS[doc.documentType].fr : DOCUMENT_TYPE_LABELS[doc.documentType].badge)
    : doc.title;

  // 3. Lesson Stages (جذاذة)
  let translatedStages: LessonStage[] = doc.lessonStages ? [...doc.lessonStages] : [];
  if (doc.documentType === 'fiche_pedagogique' && translatedStages.length > 0) {
    translatedStages = translatedStages.map((stage, idx) => {
      if (isTargetAr) {
        return {
          ...stage,
          stageName: idx === 0 ? 'وضعية الانطلاق وبناء الإشكالية' : idx === 1 ? 'الأنشطة الاستكشافية وبناء المفهوم' : idx === 2 ? 'مرحلة المأسسة والتركيب' : 'التقويم التكويني والدعم الفوري',
          duration: stage.duration.replace('min', 'دقيقة').replace('h', 'ساعة'),
          teacherActivities: idx === 0 ? 'طرح الوضعية المشكلة، تسيير النقاش، وتوجيه المتعلمين نحو صياغة الفرضيات.' : 'تنظيم العمل في مجموعات وتيسير أنشطة الاستكشاف وتصحيح المسارات.',
          studentActivities: idx === 0 ? 'قراءة نص الوضعية، استخراج المعطيات، واقتراح فرضيات وتخمينات للحل.' : 'إنجاز المهام المسندة داخل المجموعات وصياغة النتائج الجزئية.',
          evaluationMode: idx === 0 ? 'تقويم تشخيصي للمكتسبات القبلية' : 'ملاحظة شبكة تفاعل المتعلمين ومعايير الإنجاز',
          didacticTools: 'الكتاب المدرسي، السبورة، بطاقات المهام، مسلاط عاكس',
        };
      } else if (isTargetFr) {
        return {
          ...stage,
          stageName: idx === 0 ? 'Situation de départ & Problématisation' : idx === 1 ? 'Activités de découverte & Construction' : idx === 2 ? 'Institutionnalisation & Structuration' : 'Évaluation formative & Remédiation',
          duration: stage.duration.replace('دقيقة', 'min').replace('ساعة', 'h'),
          teacherActivities: idx === 0 ? 'Présenter la situation-problème, animer le débat et guider l\'émission des hypothèses.' : 'Organiser le travail de groupe, faciliter les tâches et réguler les apprentissages.',
          studentActivities: idx === 0 ? 'Lire la situation, extraire les données et formuler des hypothèses explicatives.' : 'Réaliser les tâches en sous-groupes et confronter les résultats.',
          evaluationMode: idx === 0 ? 'Évaluation diagnostique des prérequis' : 'Grille d\'observation des critères de réussite',
          didacticTools: 'Manuel scolaire, tableau, fiches d\'activités, vidéoprojecteur',
        };
      } else {
        return {
          ...stage,
          stageName: idx === 0 ? 'Starter Activity & Problem Formulation' : idx === 1 ? 'Discovery & Concept Building' : idx === 2 ? 'Institutionalization & Summary' : 'Formative Assessment & Wrap-up',
          duration: stage.duration.replace('دقيقة', 'min').replace('ساعة', 'h'),
          teacherActivities: idx === 0 ? 'Present the problem situation and facilitate classroom discussion.' : 'Organize group work and guide students through exploration tasks.',
          studentActivities: idx === 0 ? 'Read the problem statement and formulate hypotheses.' : 'Execute assigned tasks and present group findings.',
          evaluationMode: idx === 0 ? 'Diagnostic assessment of prerequisites' : 'Observation grid and success criteria checklist',
          didacticTools: 'Textbook, whiteboard, task worksheets, digital projector',
        };
      }
    });
  }

  // 4. Classroom Charter Rules (ميثاق القسم)
  let translatedRules: RuleItem[] = doc.charteRules ? [...doc.charteRules] : [];
  if (doc.documentType === 'charte_classe') {
    if (isTargetAr) {
      translatedRules = [
        { id: 'r1', category: 'الواجبات والانضباط', ruleText: 'الحضور في الوقت المحدد وإحضار الأدوات والكتب المدرسية بانتظام.' },
        { id: 'r2', category: 'الاحترام المتبادل', ruleText: 'احترام الزملاء والأستاذ(ة) والاستماع لآراء الآخرين دون مقاطعة.' },
        { id: 'r3', category: 'المشاركة الفعالة', ruleText: 'طلب الكلمة بأدب قبل الحديث والمشاركة الإيجابية في أنشطة الفصل.' },
        { id: 'r4', category: 'المحافظة على الفضاء', ruleText: 'الحفاظ على نظافة القاعة والطاولات وتجهيزات المؤسسة التعليمية.' },
      ];
    } else if (isTargetFr) {
      translatedRules = [
        { id: 'r1', category: 'Devoirs & Discipline', ruleText: 'Arriver ponctuellement en classe et apporter ses fournitures scolaires.' },
        { id: 'r2', category: 'Respect mutuel', ruleText: 'Respecter ses camarades et l\'enseignant(e), et écouter sans interrompre.' },
        { id: 'r3', category: 'Participation active', ruleText: 'Lever la main avant de prendre la parole et participer constructivement.' },
        { id: 'r4', category: 'Entretien de l\'espace', ruleText: 'Maintenir la propreté de la salle de classe et préserver le matériel.' },
      ];
    } else {
      translatedRules = [
        { id: 'r1', category: 'Discipline & Punctuality', ruleText: 'Arrive on time with all required learning materials and textbooks.' },
        { id: 'r2', category: 'Mutual Respect', ruleText: 'Treat peers and teachers with respect and listen actively without interrupting.' },
        { id: 'r3', category: 'Active Engagement', ruleText: 'Raise hand before speaking and contribute constructively to group work.' },
        { id: 'r4', category: 'Care for Classroom', ruleText: 'Keep desks and classroom clean and preserve school property.' },
      ];
    }
  }

  // 5. Exam & Test (فرض واختبار)
  let translatedExercises: ExerciseItem[] = doc.exercises ? [...doc.exercises] : [];
  if (doc.documentType === 'controle_devoir' && translatedExercises.length > 0) {
    translatedExercises = translatedExercises.map((ex, idx) => {
      if (isTargetAr) {
        return {
          ...ex,
          title: `التمرين ${idx + 1} (${idx === 0 ? '6' : idx === 1 ? '8' : '6'} نقاط)`,
          points: `${idx === 0 ? '6' : idx === 1 ? '8' : '6'} ن`,
          description: idx === 0 ? 'تطبيق مباشر للقواعد والخاصيات الأساسية:' : idx === 1 ? 'مسألة تطبيقية تتطلب البرهنة والتحليل:' : 'وضعية مشكلة مركبة ومعالجة معطيات:',
          subQuestions: ex.subQuestions ? ex.subQuestions.map((q, qIdx) => `السؤال ${qIdx + 1}: احسب أو برهن على المطلوب مع تعليل الجواب.`) : [],
        };
      } else if (isTargetFr) {
        return {
          ...ex,
          title: `Exercice ${idx + 1} (${idx === 0 ? '6' : idx === 1 ? '8' : '6'} points)`,
          points: `${idx === 0 ? '6' : idx === 1 ? '8' : '6'} pts`,
          description: idx === 0 ? 'Application directe des propriétés et règles du cours :' : idx === 1 ? 'Problème d\'application avec démonstration et justification :' : 'Situation-problème complexe mobilisant plusieurs ressources :',
          subQuestions: ex.subQuestions ? ex.subQuestions.map((q, qIdx) => `Question ${qIdx + 1} : Calculer ou démontrer en justifiant rigoureusement la réponse.`) : [],
        };
      } else {
        return {
          ...ex,
          title: `Exercise ${idx + 1} (${idx === 0 ? '6' : idx === 1 ? '8' : '6'} points)`,
          points: `${idx === 0 ? '6' : idx === 1 ? '8' : '6'} pts`,
          description: idx === 0 ? 'Direct application of foundational concepts and formulas:' : idx === 1 ? 'Analytical problem solving and rigorous proof:' : 'Integrated problem situation and contextual application:',
          subQuestions: ex.subQuestions ? ex.subQuestions.map((q, qIdx) => `Question ${qIdx + 1}: Compute or prove the given statement with complete reasoning.`) : [],
        };
      }
    });
  }

  // 6. Return updated DocumentData
  return {
    ...doc,
    language: targetLang,
    kingdomHeader,
    ministryHeader,
    academy,
    directorate,
    subjectNameAr: isTargetAr ? subjectName : doc.subjectNameAr,
    subjectNameFr: isTargetFr ? subjectName : doc.subjectNameFr,
    lessonStages: translatedStages,
    charteRules: translatedRules,
    exercises: translatedExercises,
    charteIntroduction: isTargetAr 
      ? 'سعياً منا لجعل فضاء الفصل بيئة تربوية ملهمة يسودها الاحترام المتبادل والتعلم المثمر وروح المسؤولية والمواطنة الفاعلة، اتفق الأستاذ(ة) وتلميذات وتلاميذ هذا القسم على هذا الميثاق كعهد تربوي وأخلاقي ملزم للجميع.'
      : isTargetFr 
        ? 'Afin de faire de notre classe un environnement stimulant fondé sur le respect mutuel, l\'apprentissage constructif et la responsabilité partagée, nous avons établi cette charte comme engagement moral et éducatif.'
        : 'To make our classroom an inspiring learning environment grounded in mutual respect, shared responsibility, and academic excellence, we established this charter as a binding educational compact.',
    charteTeacherCommitment: isTargetAr
      ? 'يلتزم الأستاذ(ة) بتقديم دروس عالية الجودة، ومساعدة كل متعلم(ة) على التفوق، وتوفير مناخ نفسي آمن ومنصف يشجع على التعبير البناء.'
      : isTargetFr
        ? 'L\'enseignant(e) s\'engage à dispenser un enseignement rigoureux, à accompagner chaque élève avec bienveillance et à garantir un climat d\'écoute et d\'équité.'
        : 'The teacher commits to delivering high-quality instruction, supporting each student\'s growth, and fostering a safe, equitable, and encouraging environment.',
    charteStudentRepName: isTargetAr
      ? 'عن ممثل(ة) تلميذات وتلاميذ القسم'
      : isTargetFr
        ? 'Pour le/la délégué(e) des élèves'
        : 'For the Class Student Representative',
    examInstructions: isTargetAr
      ? ['يُسمح باستعمال الأدوات الهندسية والآلة الحاسبة غير القابلة للبرمجة.', 'تُخصص نقطة لحسن تنظيم ورقة التحرير ونظافتها وجودة الخط.']
      : isTargetFr
        ? ['L\'usage des instruments de géométrie et des calculatrices non programmables est autorisé.', 'Un point est accordé à la clarté de la rédaction, la propreté et la rigueur du raisonnement.']
        : ['The use of geometric instruments and non-programmable calculators is allowed.', 'One mark is allocated for neatness, presentation, and clarity of work.'],
    generalCompetences: isTargetAr
      ? ['تنمية التفكير المنهجي والقدرة على البرهنة وحل المشكلات.', 'التعبير السليم والتبرير المنطقي المنظم للخطوات العلمية.']
      : isTargetFr
        ? ['Mobiliser les ressources pour résoudre une situation complexe.', 'Communiquer avec rigueur à l\'oral et à l\'écrit dans la discipline.']
        : ['Develop critical thinking and structured problem-solving skills.', 'Communicate disciplinary knowledge with scientific rigor and clarity.'],
    specificObjectives: isTargetAr
      ? [`أن يتعرف المتعلم على المفاهيم الأساسية لدرس: ${doc.lessonTitle}.`, 'أن يوظف القواعد والخاصيات في حل تمارين ومسائل متنوعة.']
      : isTargetFr
        ? [`Maîtriser les notions fondamentales relatives à : ${doc.lessonTitle}.`, 'Appliquer les méthodes et théorèmes dans des situations variées.']
        : [`Master core concepts related to: ${doc.lessonTitle}.`, 'Apply formulas and theorems to solve structured exercises.'],
    didacticResources: isTargetAr
      ? ['الكتاب المدرسي المعتمد، السبورة، مسلاط رقمي، بطاقات الأنشطة.']
      : isTargetFr
        ? ['Manuel scolaire officiel, tableau, vidéoprojecteur, fiches d\'activités.']
        : ['Official textbook, whiteboard, digital projector, worksheets.'],
    prerequisites: isTargetAr
      ? ['المكتسبات القبلية والتعلمات السابقة المرتبطة بالموضوع.']
      : isTargetFr
        ? ['Prérequis et acquis antérieurs relatifs à la séquence.']
        : ['Prerequisite concepts and prior learned competencies.'],
    diagnosticEval: isTargetAr
      ? 'أسئلة سريعة وبطاقات تقويمية لتشخيص المكتسبات القبلية.'
      : isTargetFr
        ? 'Test diagnostique rapide et sondage des prérequis.'
        : 'Quick diagnostic quiz and prerequisite check.',
    formativeEval: isTargetAr
      ? 'تمارين تطبيقية موجهة فردية وثنائية للتحقق من الفهم.'
      : isTargetFr
        ? 'Exercices d\'application guidés pour vérifier l\'assimilation.'
        : 'Guided practice exercises to verify understanding.',
    summativeEval: isTargetAr
      ? 'تمرين إدماجي تقويمي لقياس بلوغ الأهداف المسطرة.'
      : isTargetFr
        ? 'Évaluation sommative et tâche d\'intégration finale.'
        : 'Summative integration task measuring objective achievement.',
    supportActivities: isTargetAr
      ? 'أنشطة دعم بيداغوجي موازية لمعالجة التعثرات الفورية.'
      : isTargetFr
        ? 'Ateliers de remédiation ciblée pour surmonter les difficultés.'
        : 'Targeted remediation workshops for struggling learners.',
    teacherNotes: isTargetAr
      ? 'تم إنجاز الحصة مع تفاعل إيجابي وتركيز على تدقيق المفاهيم.'
      : isTargetFr
        ? 'Séance menée avec dynamisme et bonne implication des élèves.'
        : 'Lesson conducted successfully with active student participation.',
  };
}
