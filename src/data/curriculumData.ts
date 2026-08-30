import { EducationLevel, SubjectCategory } from '../types';

export interface SubjectConfig {
  id: string;
  category: SubjectCategory;
  nameAr: string;
  nameFr: string;
  isBilingual: boolean; // Has French option in Moroccan system
  supportedLevels: EducationLevel[];
  defaultUnits: { ar: string[]; fr: string[] };
}

export interface LevelConfig {
  id: EducationLevel;
  nameAr: string;
  description: string;
  grades: {
    id: string;
    nameAr: string;
    nameFr: string;
  }[];
}

export const EDUCATION_LEVELS: LevelConfig[] = [
  {
    id: 'primary',
    nameAr: 'التعليم الابتدائي',
    description: 'المنهاج المنقح للتعليم الابتدائي بالمغرب (من المستوى الأول إلى السادس)',
    grades: [
      { id: '1aep', nameAr: 'السنة الأولى ابتدائي', nameFr: '1ère Année de l\'Enseignement Primaire' },
      { id: '2aep', nameAr: 'السنة الثانية ابتدائي', nameFr: '2ème Année de l\'Enseignement Primaire' },
      { id: '3aep', nameAr: 'السنة الثالثة ابتدائي', nameFr: '3ème Année de l\'Enseignement Primaire' },
      { id: '4aep', nameAr: 'السنة الرابعة ابتدائي', nameFr: '4ème Année de l\'Enseignement Primaire' },
      { id: '5aep', nameAr: 'السنة الخامسة ابتدائي', nameFr: '5ème Année de l\'Enseignement Primaire' },
      { id: '6aep', nameAr: 'السنة السادسة ابتدائي', nameFr: '6ème Année de l\'Enseignement Primaire' },
    ],
  },
  {
    id: 'middle',
    nameAr: 'التعليم الثانوي الإعدادي',
    description: 'السلك الإعدادي العام والمسالك الدولية (خيار فرنسية)',
    grades: [
      { id: '1ac', nameAr: 'السنة الأولى ثانوي إعدادي', nameFr: '1ère Année du Cycle Secondaire Collégial' },
      { id: '2ac', nameAr: 'السنة الثانية ثانوي إعدادي', nameFr: '2ème Année du Cycle Secondaire Collégial' },
      { id: '3ac', nameAr: 'السنة الثالثة ثانوي إعدادي', nameFr: '3ème Année du Cycle Secondaire Collégial' },
    ],
  },
  {
    id: 'high',
    nameAr: 'التعليم الثانوي التأهيلي',
    description: 'الجذوع المشتركة وسلك الباكالوريا بجميع الشعب والمسالك المغربية',
    grades: [
      { id: 'tc_sci', nameAr: 'الجذع المشترك العلمي والتكنولوجي', nameFr: 'Tronc Commun Scientifique et Technologique' },
      { id: 'tc_lit', nameAr: 'الجذع المشترك للآداب والعلوم الإنسانية', nameFr: 'Tronc Commun Littéraire et Sciences Humaines' },
      { id: '1bac_sm', nameAr: 'الأولى باكالوريا - علوم رياضية', nameFr: '1ère Bac - Sciences Mathématiques' },
      { id: '1bac_ex', nameAr: 'الأولى باكالوريا - علوم تجريبية', nameFr: '1ère Bac - Sciences Expérimentales' },
      { id: '1bac_eco', nameAr: 'الأولى باكالوريا - علوم اقتصادية وتدبير', nameFr: '1ère Bac - Sciences Économiques et Gestion' },
      { id: '1bac_lit', nameAr: 'الأولى باكالوريا - آداب وعلوم إنسانية', nameFr: '1ère Bac - Lettres et Sciences Humaines' },
      { id: '2bac_pc', nameAr: 'الثانية باكالوريا - علوم فيزيائية', nameFr: '2ème Bac - Sciences Physiques' },
      { id: '2bac_svt', nameAr: 'الثانية باكالوريا - علوم الحياة والأرض', nameFr: '2ème Bac - Sciences de la Vie et de la Terre' },
      { id: '2bac_sm', nameAr: 'الثانية باكالوريا - علوم رياضية (أ / ب)', nameFr: '2ème Bac - Sciences Mathématiques (A / B)' },
      { id: '2bac_lit', nameAr: 'الثانية باكالوريا - آداب وعلوم إنسانية', nameFr: '2ème Bac - Lettres et Sciences Humaines' },
      { id: '2bac_eco', nameAr: 'الثانية باكالوريا - علوم اقتصادية ومحاسباتية', nameFr: '2ème Bac - Sciences Économiques et Gestion' },
    ],
  },
];

export const SUBJECTS: SubjectConfig[] = [
  // 1. المواد العلمية (Bilingual support: Arabic & French)
  {
    id: 'math',
    category: 'scientific',
    nameAr: 'الرياضيات',
    nameFr: 'Mathématiques',
    isBilingual: true,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [
        'الحساب والعمليات الأساسية والأنشطة العددية',
        'الهندسة والإنشاءات والتحويلات الهندسية',
        'القياس وتنظيم ومعالجة البيانات والإحصاء',
        'الدوال العددية وحساب النهايات والتكامل',
        'المتتاليات العددية والاحتمالات',
      ],
      fr: [
        'Calcul numérique et opérations algébriques',
        'Géométrie dans le plan et l\'espace',
        'Organisation et gestion de données - Statistiques',
        'Fonctions numériques, limites et continuité',
        'Suites numériques et calcul des probabilités',
      ],
    },
  },
  {
    id: 'physics_chemistry',
    category: 'scientific',
    nameAr: 'الفيزياء والكيمياء',
    nameFr: 'Physique-Chimie',
    isBilingual: true,
    supportedLevels: ['middle', 'high'],
    defaultUnits: {
      ar: [
        'المادة والتحولات الفيزيائية والكيميائية',
        'الضوء والصورة والظواهر البصرية',
        'الكهرباء والطاقة والقدرة الكهربائية',
        'الميكانيك والحركة والقوى وتطبيقات قوانين نيوتن',
        'الكيمياء العضوية والتحولات غير الكلية',
      ],
      fr: [
        'La matière et son environnement - Transformations chimiques',
        'Optique, lumière et propagation des ondes',
        'Électricité, circuits et énergie électrique',
        'Mécanique, mouvements, forces et lois de Newton',
        'Transformations non totales et cinétique chimique',
      ],
    },
  },
  {
    id: 'svt',
    category: 'scientific',
    nameAr: 'علوم الحياة والأرض',
    nameFr: 'Sciences de la Vie et de la Terre (SVT)',
    isBilingual: true,
    supportedLevels: ['middle', 'high'],
    defaultUnits: {
      ar: [
        'الظواهر الجيولوجية الخارجية والداخلية وتكتونية الصفائح',
        'علم البيئة والعلاقات الغذائية في الوسط الطبيعي',
        'وظائف الاقتيات والتنفس والدوران عند الإنسان',
        'علم المناعة والجهاز العصبي والعضلي',
        'الوراثة البشرية وتعبير الخبر الوراثي والتنوع الإحيائي',
      ],
      fr: [
        'Phénomènes géologiques externes et tectonique des plaques',
        'Écologie et relations trophiques dans un milieu naturel',
        'Nutrition humaine, respiration et circulation sanguine',
        'Système immunitaire et fonctionnement neuro-musculaire',
        'Génétique humaine et expression de l\'information génétique',
      ],
    },
  },

  // 2. المواد الأدبية والإنسانية
  {
    id: 'arabic',
    category: 'literary_humanities',
    nameAr: 'اللغة العربية',
    nameFr: 'Langue Arabe',
    isBilingual: false,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [
        'مكون النصوص القرائية والوظيفية والشعرية',
        'مكون الدرس اللغوي والظواهر التركيبية والصرفية',
        'مكون التعبير والإنشاء ومهارات الكتابة',
        'مكون المؤلفات الأدبية والمسرحية والرواية',
      ],
      fr: [],
    },
  },
  {
    id: 'islamic_education',
    category: 'literary_humanities',
    nameAr: 'التربية الإسلامية',
    nameFr: 'Éducation Islamique',
    isBilingual: false,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [
        'مدخل التزكية (القرآن الكريم والعقيدة)',
        'مدخل الاقتداء (السيرة النبوية الشريفة)',
        'مدخل الاستجابة (فقه العبادات والمعاملات)',
        'مدخل القسط (حق الله، حق النفس، حق الغير)',
        'مدخل الحكمة (إصلاح العمل وخدمة المجتمع)',
      ],
      fr: [],
    },
  },
  {
    id: 'history_geography',
    category: 'literary_humanities',
    nameAr: 'الاجتماعيات',
    nameFr: 'Histoire - Géographie et Éducation à la Citoyenneté',
    isBilingual: false,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [
        'مادة التاريخ (تاريخ المغرب والحضارات الإنسانية)',
        'مادة الجغرافيا (المجال المغربي والعالمي والتهيئة الترابية)',
        'التربية على المواطنة (الحقوق والواجبات والمؤسسات الدستورية)',
      ],
      fr: [],
    },
  },
  {
    id: 'philosophy',
    category: 'literary_humanities',
    nameAr: 'الفلسفة',
    nameFr: 'Philosophie',
    isBilingual: false,
    supportedLevels: ['high'],
    defaultUnits: {
      ar: [
        'مجزوءة الوضع البشري (الشخص والغير والتاريخ)',
        'مجزوءة المعرفة (النظرية والتجربة والحقيقة والعلوم الإنسانية)',
        'مجزوءة السياسة (الدولة والحق والعدالة والعنف)',
        'مجزوءة الأخلاق (الواجب والسعادة والحرية)',
      ],
      fr: [],
    },
  },
  {
    id: 'french',
    category: 'literary_humanities',
    nameAr: 'اللغة الفرنسية',
    nameFr: 'Français',
    isBilingual: false,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [],
      fr: [
        'Module de Lecture méthodique et analytique',
        'Langue, grammaire, conjugaison et lexique',
        'Production écrite et ateliers d\'écriture',
        'Étude des œuvres intégrales au programme marocain (La Boîte à Merveilles, Antigone, Le Dernier Jour d\'un Condamné, Candide...)',
      ],
    },
  },
  {
    id: 'english',
    category: 'literary_humanities',
    nameAr: 'اللغة الإنجليزية',
    nameFr: 'English',
    isBilingual: false,
    supportedLevels: ['middle', 'high'],
    defaultUnits: {
      ar: [
        'Unit 1: Cultural heritage and youth hobbies',
        'Unit 2: Education and future careers',
        'Unit 3: Science, technology and social media',
        'Unit 4: Environment, health and sustainable community',
      ],
      fr: [],
    },
  },

  // 3. التربية البدنية والرياضية
  {
    id: 'pe_eps',
    category: 'physical_education',
    nameAr: 'التربية البدنية والرياضية (EPS)',
    nameFr: 'Éducation Physique et Sportive (EPS)',
    isBilingual: true,
    supportedLevels: ['primary', 'middle', 'high'],
    defaultUnits: {
      ar: [
        'الرياضات الجماعية: كرة اليد، كرة السلة، كرة القدم، الكرة الطائرة',
        'الرياضات الفردية والجمباز: الجمباز الأرضي، القفز، التوازن',
        'ألعاب القوى: الجري السريع، سباق التناوب، الوثب الطولي، رمي الجلة',
        'اللياقة البدنية والصحة الحركية والسلامة الرياضية',
      ],
      fr: [
        'Sports collectifs: Handball, Basketball, Football, Volleyball',
        'Gymnastique au sol, agrès, équilibres et acrobaties',
        'Athlétisme: Vitesse, relais, saut en longueur, lancer de poids',
        'Condition physique, sécurité et hygiène sportive',
      ],
    },
  },
];

export const DOCUMENT_TYPE_LABELS = {
  fiche_pedagogique: {
    ar: 'جذاذة تربوية وتخطيط ديداكتيكي',
    fr: 'Fiche pédagogique & Scénario didactique',
    badge: 'النموذج الرسمي',
    color: 'emerald',
    icon: 'FileSpreadsheet',
  },
  charte_classe: {
    ar: 'ميثاق القسم وقواعد العيش المشترك',
    fr: 'Charte de la classe',
    badge: 'تفاعلي وقابل للتوقيع',
    color: 'royal',
    icon: 'ScrollText',
  },
  controle_devoir: {
    ar: 'فرض محروس / اختبار تقويمي',
    fr: 'Contrôle continu & Évaluation',
    badge: 'مع سلم التنقيط',
    color: 'crimson',
    icon: 'FileCheck',
  },
  evaluation_soutien: {
    ar: 'أنشطة التقويم والدعم والمعالجة',
    fr: 'Activités de soutien & remédiation',
    badge: 'الدعم التربوي',
    color: 'gold',
    icon: 'HeartHandshake',
  },
  grille_notation: {
    ar: 'شبكة التنقيط وتفريغ النقط',
    fr: 'Grille d\'évaluation & de notation',
    badge: 'حساب المعايير',
    color: 'slate',
    icon: 'TableProperties',
  },
  fiche_activite: {
    ar: 'بطاقة الأنشطة والتمارين التطبيقية',
    fr: 'Fiche d\'activités & exercices',
    badge: 'أوراق عمل',
    color: 'emerald',
    icon: 'Layers',
  },
  rapport_conseil: {
    ar: 'تقرير مجلس القسم / اجتماع الأولياء',
    fr: 'Rapport du conseil de classe',
    badge: 'وثيقة إدارية',
    color: 'royal',
    icon: 'FileText',
  },
  attestation_affiche: {
    ar: 'شهادة تقديرية / ملصق تربوي حائطي',
    fr: 'Attestation d\'excellence & Affiche',
    badge: 'تصميم فخم للطباعة',
    color: 'gold',
    icon: 'Award',
  },
};

export const MOROCCAN_REGIONS = [
  'جهة طنجة - تطوان - الحسيمة',
  'جهة الشرق',
  'جهة فاس - مكناس',
  'جهة الرباط - سلا - القنيطرة',
  'جهة بني ملال - خنيفرة',
  'جهة الدار البيضاء - سطات',
  'جهة مراكش - آسفي',
  'جهة درعة - تافيلالت',
  'جهة سوس - ماسة',
  'جهة كلميم - واد نون',
  'جهة العيون - الساقية الحمراء',
  'جهة الداخلة - وادي الذهب',
];
