import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'وثائقي التربوية Backend API' });
});

// Endpoint for AI Pedagogical Content Generation according to Moroccan Curriculum
app.post('/api/pedagogy/generate', async (req, res) => {
  try {
    const { documentType, level, grade, subject, language, topic, prompt } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a graceful Moroccan-aligned fallback if no API key is configured
      return res.status(200).json({
        success: true,
        isFallback: true,
        message: 'تم توليد المقترح وفق التوجيهات التربوية المغربية المعتمدة.',
        data: generateMoroccanFallback(documentType, subject, topic, language),
      });
    }

    const ai = getGeminiClient();
    const systemInstruction = `أنت خبير تربوي ومفتش تربوي معتمد في وزارة التربية الوطنية المغربية، وملم بالتوجيهات التربوية الرسمية والمنهاج المغربي المنقح، والتدريس بالكفايات وبيداغوجيا الإدماج والوضعيات المشكلة.
المهمة: توليد محتوى ديداكتيكي عالي الجودة لوثيقة تربوية (جذاذة، فرض، أنشطة دعم، أو ميثاق قسم) باللغة المحددة (${language === 'fr' ? 'الفرنسية' : 'العربية'}).
يجب أن يكون الناتج منظماً، دقيقاً، ويحتوي على الكفايات المستهدفة، الأهداف التعليمية الإجرائية، المكتسبات القبلية، ومراحل إنجاز الدرس (الوضعية المشكلة الاستكشافية، بناء التعلمات والأنشطة، التقويم والدعم).`;

    const userPrompt = `قم بإنشاء محتوى بيداغوجي متكامل للوثيقة التالية:
نوع الوثيقة: ${documentType}
السلك: ${level}
المستوى: ${grade}
المادة: ${subject}
عنوان الدرس / الموضوع: ${topic || 'درس نموذجي'}
توجيهات إضافية: ${prompt || 'احترام التوجيهات الرسمية للمنهاج المغربي'}

يرجى تقديم النتيجة بصيغة JSON واضحة تضم:
- generalCompetences: مصفوفة من الكفايات المستهدفة
- specificObjectives: مصفوفة من الأهداف التعلمية
- prerequisites: المكتسبات القبلية
- didacticResources: الوسائل والدعامات الديداكتيكية
- lessonStages: مصفوفة مراحل الدرس تضم (stageName, duration, teacherActivities, studentActivities, evaluationMode, didacticTools)
- diagnosticEval: أسئلة التقويم التشخيصي
- formativeEval: التقويم التكويني
- summativeEval: التقويم الإجمالي
- supportActivities: أنشطة الدعم والمعالجة`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { rawText: text };
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating pedagogy content:', error);
    return res.status(200).json({
      success: true,
      isFallback: true,
      data: generateMoroccanFallback(req.body.documentType, req.body.subject, req.body.topic, req.body.language),
    });
  }
});

function generateMoroccanFallback(docType: string, subject: string, topic: string, lang: string) {
  if (lang === 'fr') {
    return {
      generalCompetences: [
        'Développer la rigueur scientifique et l\'esprit critique face aux situations complexes.',
        'Mobiliser les ressources acquises pour résoudre des situations-problèmes concrètes.',
        'Communiquer à l\'aide du langage et du symbolisme propres à la discipline.',
      ],
      specificObjectives: [
        `Maîtriser les concepts fondamentaux relatifs à : ${topic || 'ce chapitre'}.`,
        'Appliquer les méthodes et démarches d\'investigation expérimentale ou déductive.',
        'Exploiter des documents, schémas et graphiques pour formuler des synthèses.',
      ],
      prerequisites: [
        'Les notions de base abordées lors des séquences pédagogiques antérieures.',
        'L\'habileté de manipulation des outils et des instruments didactiques.',
      ],
      didacticResources: [
        'Le manuel scolaire officiel en vigueur.',
        'Vidéoprojecteur, fiches d\'activités imprimées, tableau blanc.',
        'Matériel d\'expérimentation ou logiciels de simulation interactive.',
      ],
      lessonStages: [
        {
          stageName: 'Situation-problème de départ & Formulation des hypothèses',
          duration: '20 min',
          teacherActivities: 'Présenter une situation déclenchante motivante, guider les apprenants dans l\'émergence du questionnement didactique.',
          studentActivities: 'Analyser la situation, identifier les données utiles, émettre des hypothèses et proposer des pistes de résolution.',
          evaluationMode: 'Évaluation diagnostique orale et prise de notes des représentations initiales.',
          didacticTools: 'Support documentaire / capsule vidéo courte.',
        },
        {
          stageName: 'Activités d\'apprentissage & Construction du savoir',
          duration: '45 min',
          teacherActivities: 'Organiser le travail en petits groupes, réguler les échanges, apporter un étayage méthodologique adapté.',
          studentActivities: 'Réaliser les tâches assignées, confronter les résultats, rédiger un premier bilan partiel.',
          evaluationMode: 'Évaluation formative continue par observation des démarches.',
          didacticTools: 'Fiches guides d\'apprentissage collaboratif.',
        },
        {
          stageName: 'Synthèse, Institutionnalisation & Évaluation sommative',
          duration: '25 min',
          teacherActivities: 'Structurer le bilan collectif, fixer les règles et définitions institutionnelles au tableau.',
          studentActivities: 'Prendre des notes ordonnées, résoudre un exercice d\'application immédiate pour consolider l\'acquis.',
          evaluationMode: 'Évaluation sommative rapide sur cahier d\'exercices.',
          didacticTools: 'Tableau + cahier de cours.',
        },
      ],
      diagnosticEval: 'Questions directes de rappel des prérequis indispensables.',
      formativeEval: 'Observation continue de l\'implication et de la justesse des réponses.',
      summativeEval: 'Exercice d\'application directe en fin de séance.',
      supportActivities: 'Atelier de remédiation ciblée pour les élèves présentant des difficultés conceptuelles.',
    };
  }

  return {
    generalCompetences: [
      'تنمية الحس النقدي والمنهجي في مقاربة المعارف والظواهر المدروسة.',
      'توظيف المعارف والمهارات المكتسبة في معالجة وضعيات مشكلة دالة.',
      'الاستعمال السليم للمصطلحات والمفاهيم الخاصة بالمادة وفق المنهاج المغربي.',
    ],
    specificObjectives: [
      `التعرف على المفاهيم والقواعد الأساسية المرتبطة بـ: ${topic || 'موضوع الدرس'}.`,
      'تطبيق المكتسبات في إنجاز التمارين والأنشطة التطبيقية بدقة.',
      'صياغة استنتاجات وتركيب الخلاصات بأسلوب علمي ومنهجي رصين.',
    ],
    prerequisites: [
      'المكتسبات القبلية والتعلمات السابقة المرتبطة بالموضوع.',
      'المهارات المنهجية الأساسية في التحليل والاستنتاج.',
    ],
    didacticResources: [
      'الكتاب المدرسي المعتمد من وزارة التربية الوطنية.',
      'السبورة، مسلاط رقمي (Data show)، مطبوعات وبطاقات عمل.',
      'وسائل إيضاح ومجسمات أو برمجيات تفاعلية.',
    ],
    lessonStages: [
      {
        stageName: 'الوضعية المشكلة الاستكشافية (الانطلاق)',
        duration: '15 دقيقة',
        teacherActivities: 'طرح وضعية مشكلة واقعية تثير دافعية المتعلمين وتخلق لديهم خلخلة معرفية، وتوجيههم لصياغة الفرضيات.',
        studentActivities: 'استحضار المكتسبات السابقة، تفكيك عناصر الوضعية، والتعبير عن تمثلاتهم وتدوين الفرضيات الأولية.',
        evaluationMode: 'تقويم تشخيصي للتمثلات والمكتسبات القبلية.',
        didacticTools: 'سند بصري / نص الوضعية المشكلة.',
      },
      {
        stageName: 'بناء التعلمات والأنشطة الديداكتيكية',
        duration: '50 دقيقة',
        teacherActivities: 'تدبير وتوجيه الأنشطة التعلمية، مرافقة مجموعات العمل، وتيسير سبل البحث والبرهنة.',
        studentActivities: 'الاشتغال الفردي ثم التشاركي في مجموعات، معالجة المعطيات، واستخلاص القواعد والمفاهيم.',
        evaluationMode: 'تقويم تكويني مرحلي وتصحيح فوري للتعثرات.',
        didacticTools: 'كراسة المتعلم(ة) + بطاقات الأنشطة.',
      },
      {
        stageName: 'التركيب والمأسسة والتطبيق',
        duration: '25 دقيقة',
        teacherActivities: 'مساعدة المتعلمين على صياغة الخلاصة التركيبية للدرس، وتقديم تمرين تطبيقي للتحقق من بلوغ الأهداف.',
        studentActivities: 'تدوين ملخص الدرس على الدفتر وإنجاز التمرين التطبيقي بشكل فردي ومستقل.',
        evaluationMode: 'تقويم إجمالي عبر التمرين التطبيقي.',
        didacticTools: 'السبورة والدفاتر المدرسية.',
      },
    ],
    diagnosticEval: 'أسئلة شفهية وبطاقات سريعة لتشخيص مدى جاهزية المتعلمين.',
    formativeEval: 'ملاحظة الأداء أثناء إنجاز المهام ورصد مؤشرات التمكن.',
    summativeEval: 'تمرين تقويمي فردي لقياس مدى تحقق الأهداف المسطرة.',
    supportActivities: 'أنشطة دعم بيداغوجي موازية لتثبيت المفاهيم لدى المتعثرين.',
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`وثائقي التربوية Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
