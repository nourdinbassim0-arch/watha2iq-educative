export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  appName: string;
  appTagline: string;
  moroccanTeacherSpace: string;
  officialMinistryGuidelines: string;

  // Nav
  navHome: string;
  navNewDoc: string;
  navEditor: string;
  navTemplates: string;
  navSaved: string;
  navGradebook: string;
  navAccount: string;
  navAdmin: string;
  navPrivacy: string;
  login: string;
  logout: string;
  register: string;

  // Common Actions
  save: string;
  saving: string;
  download: string;
  print: string;
  edit: string;
  delete: string;
  duplicate: string;
  cancel: string;
  confirm: string;
  close: string;
  apply: string;
  search: string;
  filter: string;
  preview: string;
  back: string;
  next: string;
  finish: string;
  createNew: string;
  exportDoc: string;
  aiAssistant: string;
  undo: string;
  redo: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  fitWidth: string;
  fitPage: string;

  // Document Types
  docTypes: {
    fiche_pedagogique: string;
    charte_classe: string;
    controle_devoir: string;
    evaluation_soutien: string;
    grille_notation: string;
    fiche_activite: string;
    rapport_conseil: string;
    attestation_affiche: string;
    registre_notes: string;
  };

  // Education Cycles
  cycles: {
    primary: string;
    middle: string;
    high: string;
  };

  // Subject Categories
  categories: {
    scientific: string;
    literary_humanities: string;
    physical_education: string;
  };

  // Page Formats
  pageFormats: {
    a4_portrait: string;
    a4_landscape: string;
    a3_portrait: string;
    a3_landscape: string;
    letter_portrait: string;
    letter_landscape: string;
    phone_story: string;
    square: string;
  };

  // Theme names
  themes: {
    emerald: string;
    crimson: string;
    royal: string;
    gold: string;
    slate: string;
  };

  // Fonts
  fonts: {
    tajawal: string;
    cairo: string;
    amiri: string;
    notoNaskh: string;
    ibmPlex: string;
    arial: string;
    timesNewRoman: string;
    calibri: string;
    traditionalArabic: string;
  };

  // Header options
  header: {
    showOfficialEmblem: string;
    hideOfficialEmblem: string;
    showSchoolLogo: string;
    hideSchoolLogo: string;
    uploadSchoolLogo: string;
    kingdomHeader: string;
    ministryHeader: string;
    academy: string;
    directorate: string;
    school: string;
    teacher: string;
    academicYear: string;
    classGroup: string;
    date: string;
    duration: string;
  };

  // Gradebook terms
  gradebook: {
    title: string;
    subtitle: string;
    num: string;
    studentName: string;
    exam1: string;
    exam2: string;
    exam3: string;
    exam4: string;
    activities: string;
    notes: string;
    average: string;
    appreciation: string;
    addStudent: string;
    coefficients: string;
    rank: string;
    ratingSystem: string;
    numericScores: string;
    appreciationRatings: string;
    both: string;
    primaryCompetencies: string;
    component: string;
    indicator: string;
    ratingOptions: {
      excellent: string;
      veryGood: string;
      good: string;
      inProgress: string;
      notAcquired: string;
    };
  };

  // Admin / Owner
  admin: {
    dashboardTitle: string;
    dashboardSubtitle: string;
    restrictedNotice: string;
    stats: {
      totalUsers: string;
      newUsersThisWeek: string;
      totalDocuments: string;
      topSubjects: string;
      topDocTypes: string;
      storageUsed: string;
    };
    userManagement: string;
    templateManagement: string;
    auditLogs: string;
    announcements: string;
    platformSettings: string;
    exportAdminData: string;
    roleTeacher: string;
    roleAdmin: string;
    roleOwner: string;
    statusActive: string;
    statusDisabled: string;
    changeRole: string;
    disableAccount: string;
    enableAccount: string;
    searchUser: string;
  };

  // User Account
  account: {
    title: string;
    personalInfo: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    schoolInfo: string;
    defaultAcademy: string;
    defaultDirectorate: string;
    defaultSchool: string;
    defaultSubject: string;
    signatureAndLogo: string;
    uploadSignature: string;
    uploadLogo: string;
    savedPreferences: string;
    cloudSyncStatus: string;
    synced: string;
    syncNow: string;
  };

  // Design Customization
  customization: {
    title: string;
    colorPalette: string;
    fontFamily: string;
    fontSize: string;
    pageLayout: string;
    margins: string;
    decorations: string;
    showPageNumbers: string;
    showFooterDate: string;
    watermark: string;
    savePreset: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'وثائقي التربوية',
    appTagline: 'المنصة المغربية الشاملة للأساتذة لإنشاء وتعديل وحفظ وتصدير الوثائق والجذاذات التربوية',
    moroccanTeacherSpace: 'فضاء الأستاذ(ة) المغربي(ة)',
    officialMinistryGuidelines: 'مواكبة لمستجدات المنهاج الدراسي المنقح والتوجيهات التربوية لوزارة التربية الوطنية والتعليم الأولي والرياضة',

    navHome: 'الرئيسية',
    navNewDoc: 'إنشاء وثيقة جديدة',
    navEditor: 'محرر الوثيقة',
    navTemplates: 'مكتبة النماذج',
    navSaved: 'وثائقي المحفوظة',
    navGradebook: 'سجل النقط والتقويم',
    navAccount: 'حسابي',
    navAdmin: 'لوحة إدارة وثائقي التربوية',
    navPrivacy: 'الخصوصية والشروط',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'إنشاء حساب جديد',

    save: 'حفظ الوثيقة',
    saving: 'جاري الحفظ...',
    download: 'تحميل الوثيقة',
    print: 'طباعة فورية',
    edit: 'تعديل',
    delete: 'حذف',
    duplicate: 'استنساخ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    close: 'إغلاق',
    apply: 'تطبيق',
    search: 'بحث...',
    filter: 'تصفية',
    preview: 'معاينة',
    back: 'السابق',
    next: 'التالي',
    finish: 'إنهاء والفتح في المحرر',
    createNew: 'إنشاء وثيقة جديدة',
    exportDoc: 'تصدير وتحميل الوثيقة',
    aiAssistant: 'المساعد الديداكتيكي الذكي',
    undo: 'تراجع',
    redo: 'إعادة',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    resetZoom: '100%',
    fitWidth: 'ملاءمة العرض',
    fitPage: 'ملاءمة الصفحة',

    docTypes: {
      fiche_pedagogique: 'جذاذة وتخطيط تربوي',
      charte_classe: 'ميثاق وقواعد القسم',
      controle_devoir: 'فرض واختبار محروس',
      evaluation_soutien: 'أنشطة التقويم والدعم والمعالجة',
      grille_notation: 'شبكة التفريغ والتنقيط',
      fiche_activite: 'بطاقة التمارين والأنشطة',
      rapport_conseil: 'تقرير مجلس القسم واجتماع الأولياء',
      attestation_affiche: 'شهادة تقديرية وملصق تربوي',
      registre_notes: 'سجل النقط والتقويم الشامل',
    },

    cycles: {
      primary: 'التعليم الابتدائي',
      middle: 'التعليم الثانوي الإعدادي',
      high: 'التعليم الثانوي التأهيلي',
    },

    categories: {
      scientific: 'المواد العلمية (BIOF / العربية)',
      literary_humanities: 'المواد الأدبية والإنسانية',
      physical_education: 'التربية البدنية والرياضية (EPS)',
    },

    pageFormats: {
      a4_portrait: 'A4 عمودي (210 × 297 مم)',
      a4_landscape: 'A4 أفقي (297 × 210 مم)',
      a3_portrait: 'A3 عمودي (297 × 420 مم)',
      a3_landscape: 'A3 أفقي (420 × 297 مم)',
      letter_portrait: 'Letter عمودي (216 × 279 مم)',
      letter_landscape: 'Letter أفقي (279 × 216 مم)',
      phone_story: 'هاتف عمودي (1080 × 1920 بكسل)',
      square: 'منشور مربع (1080 × 1080 بكسل)',
    },

    themes: {
      emerald: 'رسمي مغربي (أخضر زمردي وذهبي)',
      crimson: 'ملكي أحمر (عنابي وذهبي)',
      royal: 'أكاديمي أزرق (أزرق ملكي وفضي)',
      gold: 'تراثي دافئ (كهرماني وعسلي)',
      slate: 'بسيط عصري (رمادي احترافي)',
    },

    fonts: {
      tajawal: 'Tajawal (عصري متوازن)',
      cairo: 'Cairo (هندسي واضح)',
      amiri: 'Amiri (نسخي كلاسيكي فاخر)',
      notoNaskh: 'Noto Naskh Arabic (معياري رسمي)',
      ibmPlex: 'IBM Plex Sans Arabic (تقني حديث)',
      arial: 'Arial',
      timesNewRoman: 'Times New Roman',
      calibri: 'Calibri',
      traditionalArabic: 'Traditional Arabic',
    },

    header: {
      showOfficialEmblem: 'إظهار الشعار الرسمي للمملكة',
      hideOfficialEmblem: 'إخفاء الشعار الرسمي',
      showSchoolLogo: 'إظهار شعار المؤسسة',
      hideSchoolLogo: 'إخفاء شعار المؤسسة',
      uploadSchoolLogo: 'رفع شعار المؤسسة (PNG/JPG)',
      kingdomHeader: 'المملكة المغربية',
      ministryHeader: 'وزارة التربية الوطنية والتعليم الأولي والرياضة',
      academy: 'الأكاديمية الجهوية للتربية والتكوين',
      directorate: 'المديرية الإقليمية',
      school: 'المؤسسة التعليمية',
      teacher: 'الأستاذ(ة)',
      academicYear: 'الموسم الدراسي',
      classGroup: 'القسم / الفوج',
      date: 'التاريخ',
      duration: 'المدة الزمنية',
    },

    gradebook: {
      title: 'سجل النقط والتقويم الدراسي',
      subtitle: 'مسك النقط والمراقبة المستمرة وحساب المعدلات تلقائياً',
      num: 'ر.ت',
      studentName: 'الاسم الكامل للتلميذ(ة)',
      exam1: 'الفرض 1',
      exam2: 'الفرض 2',
      exam3: 'الفرض 3',
      exam4: 'الفرض 4',
      activities: 'الأنشطة المندمجة',
      notes: 'ملاحظات وتوجيهات',
      average: 'المعدل العام',
      appreciation: 'التقدير',
      addStudent: 'إضافة تلميذ(ة)',
      coefficients: 'تعديل المعاملات والأوزان',
      rank: 'الترتيب',
      ratingSystem: 'نظام التقويم',
      numericScores: 'نقط عددية (0 - 20)',
      appreciationRatings: 'تقديرات ديداكتيكية',
      both: 'النقط والتقديرات معاً',
      primaryCompetencies: 'مكونات المادة ومؤشرات التقويم (الابتدائي)',
      component: 'المكون / المجال',
      indicator: 'مؤشر الكفاية المستهدفة',
      ratingOptions: {
        excellent: 'ممتاز',
        veryGood: 'جيد جداً',
        good: 'جيد',
        inProgress: 'في طور الاكتساب',
        notAcquired: 'غير مكتسب',
      },
    },

    admin: {
      dashboardTitle: 'لوحة إدارة وثائقي التربوية',
      dashboardSubtitle: 'إدارة المنصة، المستخدمين، النماذج، الإحصاءات العامة وسجل العمليات',
      restrictedNotice: 'منطقة سرية ومخصصة لمالك المنصة والإدارة المعتمدة فقط.',
      stats: {
        totalUsers: 'إجمالي الحسابات المسجلة',
        newUsersThisWeek: 'حسابات جديدة هذا الأسبوع',
        totalDocuments: 'إجمالي الوثائق المنشأة',
        topSubjects: 'أكثر المواد استعمالاً',
        topDocTypes: 'أكثر الوثائق طلباً',
        storageUsed: 'مساحة التخزين المستعملة',
      },
      userManagement: 'إدارة حسابات الأساتذة',
      templateManagement: 'إدارة مكتبة النماذج العامة',
      auditLogs: 'سجل العمليات الإدارية',
      announcements: 'إعلانات ورسائل الأساتذة',
      platformSettings: 'إعدادات المنصة العامة',
      exportAdminData: 'تصدير التقرير الإداري (CSV/PDF)',
      roleTeacher: 'أستاذ(ة)',
      roleAdmin: 'مدير مساعد',
      roleOwner: 'مالك المنصة (Owner)',
      statusActive: 'نشط ومفعل',
      statusDisabled: 'معطل مؤقتاً',
      changeRole: 'تغيير الدور',
      disableAccount: 'تعطيل الحساب',
      enableAccount: 'إعادة تفعيل الحساب',
      searchUser: 'البحث عن أستاذ بالاسم أو البريد...',
    },

    account: {
      title: 'إعدادات حسابي وملفي المهني',
      personalInfo: 'المعلومات الشخصية والمهنية',
      fullName: 'الاسم والنسب الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف (اختياري)',
      role: 'الصفة / الدور',
      schoolInfo: 'بيانات التعيين الإداري الافتراضية',
      defaultAcademy: 'الأكاديمية الجهوية الافتراضية',
      defaultDirectorate: 'المديرية الإقليمية الافتراضية',
      defaultSchool: 'اسم المؤسسة التعليمية',
      defaultSubject: 'المادة والتخصص',
      signatureAndLogo: 'التوقيع وشعار المؤسسة الافتراضي',
      uploadSignature: 'رفع صورة التوقيع الرقمي',
      uploadLogo: 'رفع شعار المؤسسة التعليمية',
      savedPreferences: 'تفضيلات المحرر والتصدير',
      cloudSyncStatus: 'حالة المزامنة السحابية',
      synced: 'جميع وثائقك متزامنة ومحفوظة بأمان',
      syncNow: 'مزامنة الآن',
    },

    customization: {
      title: 'لوحة تخصيص التصميم والخطوط',
      colorPalette: 'لوحة الألوان والسمة العامة',
      fontFamily: 'نوع الخط العربي',
      fontSize: 'حجم الخط الأساسي',
      pageLayout: 'تخطيط الصفحة وهوامش الطباعة',
      margins: 'الهوامش الداخلية',
      decorations: 'إظهار الزخارف والإطارات',
      showPageNumbers: 'إظهار أرقام الصفحات',
      showFooterDate: 'إظهار تاريخ الإنشاء بالتذييل',
      watermark: 'علامة مائية مخصصة',
      savePreset: 'حفظ هذا التصميم كقالب افتراضي',
    },
  },

  fr: {
    appName: 'Wathaiqi Tarbawiya',
    appTagline: 'Plateforme marocaine dédiée aux enseignant(e)s pour créer, éditer, sauvegarder et exporter leurs documents pédagogiques',
    moroccanTeacherSpace: 'Espace Enseignant(e) Maroc',
    officialMinistryGuidelines: 'Conforme au curriculum révisé et aux orientations pédagogiques du Ministère de l\'Éducation Nationale',

    navHome: 'Accueil',
    navNewDoc: 'Créer un document',
    navEditor: 'Éditeur',
    navTemplates: 'Modèles',
    navSaved: 'Mes Documents',
    navGradebook: 'Registre des notes',
    navAccount: 'Mon Compte',
    navAdmin: 'Administration',
    navPrivacy: 'Confidentialité & Conditions',
    login: 'Connexion',
    logout: 'Déconnexion',
    register: 'Créer un compte',

    save: 'Enregistrer',
    saving: 'Enregistrement...',
    download: 'Télécharger',
    print: 'Imprimer',
    edit: 'Modifier',
    delete: 'Supprimer',
    duplicate: 'Dupliquer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    close: 'Fermer',
    apply: 'Appliquer',
    search: 'Rechercher...',
    filter: 'Filtrer',
    preview: 'Aperçu',
    back: 'Précédent',
    next: 'Suivant',
    finish: 'Terminer et ouvrir',
    createNew: 'Nouveau document',
    exportDoc: 'Exporter le document',
    aiAssistant: 'Assistant Pédagogique IA',
    undo: 'Annuler',
    redo: 'Rétablir',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
    resetZoom: '100%',
    fitWidth: 'Ajuster largeur',
    fitPage: 'Page entière',

    docTypes: {
      fiche_pedagogique: 'Fiche pédagogique & planification',
      charte_classe: 'Charte & règles de vie de classe',
      controle_devoir: 'Devoir surveillé & contrôle continu',
      evaluation_soutien: 'Évaluation, soutien & remédiation',
      grille_notation: 'Grille de notation & décharge',
      fiche_activite: 'Fiche d\'exercices & d\'activités',
      rapport_conseil: 'Rapport de conseil de classe & réunions',
      attestation_affiche: 'Attestation de mérite & affiche scolaire',
      registre_notes: 'Registre des notes & évaluation',
    },

    cycles: {
      primary: 'Enseignement Primaire',
      middle: 'Enseignement Secondaire Collégial',
      high: 'Enseignement Secondaire Qualifiant',
    },

    categories: {
      scientific: 'Matières Scientifiques (BIOF / Arabe)',
      literary_humanities: 'Lettres & Sciences Humaines',
      physical_education: 'Éducation Physique & Sportive (EPS)',
    },

    pageFormats: {
      a4_portrait: 'A4 Portrait (210 × 297 mm)',
      a4_landscape: 'A4 Paysage (297 × 210 mm)',
      a3_portrait: 'A3 Portrait (297 × 420 mm)',
      a3_landscape: 'A3 Paysage (420 × 297 mm)',
      letter_portrait: 'Letter Portrait (216 × 279 mm)',
      letter_landscape: 'Letter Paysage (279 × 216 mm)',
      phone_story: 'Format Téléphone (1080 × 1920 px)',
      square: 'Format Carré (1080 × 1080 px)',
    },

    themes: {
      emerald: 'Officiel Marocain (Émeraude & Or)',
      crimson: 'Royal Pourpre (Bordeaux & Or)',
      royal: 'Académique Bleu (Bleu Royal & Argent)',
      gold: 'Traditionnel Ambré (Miel & Cuivre)',
      slate: 'Moderne Minimaliste (Gris Ardoise)',
    },

    fonts: {
      tajawal: 'Tajawal',
      cairo: 'Cairo',
      amiri: 'Amiri',
      notoNaskh: 'Noto Naskh Arabic',
      ibmPlex: 'IBM Plex Sans Arabic',
      arial: 'Arial',
      timesNewRoman: 'Times New Roman',
      calibri: 'Calibri',
      traditionalArabic: 'Traditional Arabic',
    },

    header: {
      showOfficialEmblem: 'Afficher les Armoiries Officielles',
      hideOfficialEmblem: 'Masquer les Armoiries',
      showSchoolLogo: 'Afficher le logo de l\'établissement',
      hideSchoolLogo: 'Masquer le logo',
      uploadSchoolLogo: 'Importer le logo de l\'école',
      kingdomHeader: 'Royaume du Maroc',
      ministryHeader: 'Ministère de l\'Éducation Nationale, du Préscolaire et des Sports',
      academy: 'Académie Régionale d\'Éducation et de Formation',
      directorate: 'Direction Provinciale',
      school: 'Établissement scolaire',
      teacher: 'Professeur(e)',
      academicYear: 'Année scolaire',
      classGroup: 'Classe / Groupe',
      date: 'Date',
      duration: 'Durée',
    },

    gradebook: {
      title: 'Registre des notes et évaluation',
      subtitle: 'Gestion des notes, contrôle continu et calcul automatique des moyennes',
      num: 'N°',
      studentName: 'Nom et Prénom de l\'élève',
      exam1: 'Devoir 1',
      exam2: 'Devoir 2',
      exam3: 'Devoir 3',
      exam4: 'Devoir 4',
      activities: 'Activités intégrées',
      notes: 'Observations & Remarques',
      average: 'Moyenne Générale',
      appreciation: 'Appréciation',
      addStudent: 'Ajouter un(e) élève',
      coefficients: 'Modifier les coefficients',
      rank: 'Rang',
      ratingSystem: 'Mode d\'évaluation',
      numericScores: 'Notes chiffrées (0 - 20)',
      appreciationRatings: 'Appréciations qualitatives',
      both: 'Notes & Appréciations',
      primaryCompetencies: 'Composantes & Indicateurs de compétences (Primaire)',
      component: 'Composante / Domaine',
      indicator: 'Indicateur de compétence',
      ratingOptions: {
        excellent: 'Excellent',
        veryGood: 'Très bien',
        good: 'Bien',
        inProgress: 'En cours d\'acquisition',
        notAcquired: 'Non acquis',
      },
    },

    admin: {
      dashboardTitle: 'Tableau de bord Administration',
      dashboardSubtitle: 'Gestion de la plateforme, utilisateurs, modèles et journal d\'audit',
      restrictedNotice: 'Accès réservé exclusivement au propriétaire et administrateurs.',
      stats: {
        totalUsers: 'Comptes enregistrés',
        newUsersThisWeek: 'Nouveaux cette semaine',
        totalDocuments: 'Documents générés',
        topSubjects: 'Matières les plus utilisées',
        topDocTypes: 'Types de documents populaires',
        storageUsed: 'Espace utilisé',
      },
      userManagement: 'Gestion des enseignants',
      templateManagement: 'Bibliothèque des modèles',
      auditLogs: 'Journal des audits',
      announcements: 'Annonces & Messages',
      platformSettings: 'Paramètres généraux',
      exportAdminData: 'Exporter le rapport (CSV/PDF)',
      roleTeacher: 'Enseignant(e)',
      roleAdmin: 'Administrateur',
      roleOwner: 'Propriétaire (Owner)',
      statusActive: 'Actif',
      statusDisabled: 'Désactivé',
      changeRole: 'Modifier le rôle',
      disableAccount: 'Désactiver le compte',
      enableAccount: 'Réactiver le compte',
      searchUser: 'Rechercher par nom ou email...',
    },

    account: {
      title: 'Mon Compte & Profil Professionnel',
      personalInfo: 'Informations personnelles',
      fullName: 'Nom et Prénom',
      email: 'Adresse Email',
      phone: 'Téléphone (optionnel)',
      role: 'Statut / Rôle',
      schoolInfo: 'Affectation administrative par défaut',
      defaultAcademy: 'Académie régionale',
      defaultDirectorate: 'Direction provinciale',
      defaultSchool: 'Nom de l\'établissement',
      defaultSubject: 'Matière enseignée',
      signatureAndLogo: 'Signature & Logo de l\'établissement',
      uploadSignature: 'Téléverser votre signature',
      uploadLogo: 'Téléverser le logo',
      savedPreferences: 'Préférences d\'export et éditeur',
      cloudSyncStatus: 'Synchronisation Cloud',
      synced: 'Tous vos documents sont synchronisés et sécurisés',
      syncNow: 'Synchroniser maintenant',
    },

    customization: {
      title: 'Personnalisation & Mise en page',
      colorPalette: 'Palette de couleurs',
      fontFamily: 'Police de caractères',
      fontSize: 'Taille du texte',
      pageLayout: 'Mise en page et marges',
      margins: 'Marges internes',
      decorations: 'Bordures et ornements',
      showPageNumbers: 'Numérotation des pages',
      showFooterDate: 'Date de génération en bas de page',
      watermark: 'Filigrane personnalisé',
      savePreset: 'Enregistrer comme modèle personnel',
    },
  },

  en: {
    appName: 'Wathaiqi Tarbawiya',
    appTagline: 'Comprehensive Moroccan platform for teachers to create, edit, save and export pedagogical documents',
    moroccanTeacherSpace: 'Moroccan Teachers Portal',
    officialMinistryGuidelines: 'Aligned with the Moroccan Ministry of National Education revised curriculum and guidelines',

    navHome: 'Home',
    navNewDoc: 'New Document',
    navEditor: 'Editor',
    navTemplates: 'Templates',
    navSaved: 'My Documents',
    navGradebook: 'Gradebook & Assessment',
    navAccount: 'My Account',
    navAdmin: 'Administration',
    navPrivacy: 'Privacy & Terms',
    login: 'Sign In',
    logout: 'Sign Out',
    register: 'Create Account',

    save: 'Save Document',
    saving: 'Saving...',
    download: 'Download',
    print: 'Print Now',
    edit: 'Edit',
    delete: 'Delete',
    duplicate: 'Duplicate',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    apply: 'Apply',
    search: 'Search...',
    filter: 'Filter',
    preview: 'Preview',
    back: 'Back',
    next: 'Next',
    finish: 'Finish & Open in Editor',
    createNew: 'Create New Document',
    exportDoc: 'Export Document',
    aiAssistant: 'AI Didactic Assistant',
    undo: 'Undo',
    redo: 'Redo',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: '100%',
    fitWidth: 'Fit Width',
    fitPage: 'Fit Page',

    docTypes: {
      fiche_pedagogique: 'Lesson Plan & Pedagogical Sheet',
      charte_classe: 'Classroom Charter & Rules',
      controle_devoir: 'Continuous Assessment & Exam',
      evaluation_soutien: 'Assessment, Remediation & Support',
      grille_notation: 'Grading Rubric & Score Sheet',
      fiche_activite: 'Worksheet & Activity Card',
      rapport_conseil: 'Class Council & Parent Meeting Report',
      attestation_affiche: 'Certificate of Merit & Poster',
      registre_notes: 'Comprehensive Gradebook & Evaluation',
    },

    cycles: {
      primary: 'Primary Education',
      middle: 'Middle / Lower Secondary School',
      high: 'High / Upper Secondary School',
    },

    categories: {
      scientific: 'Scientific Subjects (BIOF / Arabic)',
      literary_humanities: 'Literary & Humanities',
      physical_education: 'Physical Education & Sports (PE)',
    },

    pageFormats: {
      a4_portrait: 'A4 Portrait (210 × 297 mm)',
      a4_landscape: 'A4 Landscape (297 × 210 mm)',
      a3_portrait: 'A3 Portrait (297 × 420 mm)',
      a3_landscape: 'A3 Landscape (420 × 297 mm)',
      letter_portrait: 'Letter Portrait (216 × 279 mm)',
      letter_landscape: 'Letter Landscape (279 × 216 mm)',
      phone_story: 'Mobile Story (1080 × 1920 px)',
      square: 'Square Post (1080 × 1080 px)',
    },

    themes: {
      emerald: 'Moroccan Official (Emerald & Gold)',
      crimson: 'Royal Crimson (Bordeaux & Gold)',
      royal: 'Academic Royal (Royal Blue & Silver)',
      gold: 'Traditional Amber (Honey & Bronze)',
      slate: 'Minimal Slate (Professional Gray)',
    },

    fonts: {
      tajawal: 'Tajawal',
      cairo: 'Cairo',
      amiri: 'Amiri',
      notoNaskh: 'Noto Naskh Arabic',
      ibmPlex: 'IBM Plex Sans Arabic',
      arial: 'Arial',
      timesNewRoman: 'Times New Roman',
      calibri: 'Calibri',
      traditionalArabic: 'Traditional Arabic',
    },

    header: {
      showOfficialEmblem: 'Show Official Kingdom Emblem',
      hideOfficialEmblem: 'Hide Official Emblem',
      showSchoolLogo: 'Show School Logo',
      hideSchoolLogo: 'Hide School Logo',
      uploadSchoolLogo: 'Upload School Logo (PNG/JPG)',
      kingdomHeader: 'Kingdom of Morocco',
      ministryHeader: 'Ministry of National Education, Preschool and Sports',
      academy: 'Regional Academy for Education and Training',
      directorate: 'Provincial Directorate',
      school: 'School Institution',
      teacher: 'Teacher',
      academicYear: 'Academic Year',
      classGroup: 'Class / Group',
      date: 'Date',
      duration: 'Duration',
    },

    gradebook: {
      title: 'Gradebook & Assessment Register',
      subtitle: 'Student grading, continuous assessment, and automatic weighted average calculation',
      num: 'No.',
      studentName: 'Student Full Name',
      exam1: 'Exam 1',
      exam2: 'Exam 2',
      exam3: 'Exam 3',
      exam4: 'Exam 4',
      activities: 'Integrated Activities',
      notes: 'Observations & Guidance',
      average: 'General Average',
      appreciation: 'Honors / Appreciation',
      addStudent: 'Add Student',
      coefficients: 'Edit Weights / Coefficients',
      rank: 'Rank',
      ratingSystem: 'Evaluation System',
      numericScores: 'Numeric Scores (0 - 20)',
      appreciationRatings: 'Didactic Ratings',
      both: 'Scores & Ratings Combined',
      primaryCompetencies: 'Subject Components & Competency Indicators (Primary)',
      component: 'Component / Domain',
      indicator: 'Targeted Competency Indicator',
      ratingOptions: {
        excellent: 'Excellent',
        veryGood: 'Very Good',
        good: 'Good',
        inProgress: 'In Progress',
        notAcquired: 'Not Acquired',
      },
    },

    admin: {
      dashboardTitle: 'Owner Admin Portal',
      dashboardSubtitle: 'Platform oversight, user management, templates repository, analytics & audit trails',
      restrictedNotice: 'Confidential area restricted to the platform owner and authorized managers.',
      stats: {
        totalUsers: 'Total Registered Accounts',
        newUsersThisWeek: 'New Users This Week',
        totalDocuments: 'Total Documents Created',
        topSubjects: 'Most Used Subjects',
        topDocTypes: 'Most Popular Doc Types',
        storageUsed: 'Storage Consumed',
      },
      userManagement: 'Teachers Accounts Management',
      templateManagement: 'Public Templates Repository',
      auditLogs: 'Administrative Audit Trails',
      announcements: 'Teacher Broadcasts & Announcements',
      platformSettings: 'General Platform Settings',
      exportAdminData: 'Export Administrative Report (CSV/PDF)',
      roleTeacher: 'Teacher',
      roleAdmin: 'Assistant Admin',
      roleOwner: 'Platform Owner',
      statusActive: 'Active & Verified',
      statusDisabled: 'Temporarily Disabled',
      changeRole: 'Change Role',
      disableAccount: 'Disable Account',
      enableAccount: 'Re-enable Account',
      searchUser: 'Search teacher by name or email...',
    },

    account: {
      title: 'My Account & Professional Profile',
      personalInfo: 'Personal & Professional Details',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number (Optional)',
      role: 'Status / Role',
      schoolInfo: 'Default Administrative Placement',
      defaultAcademy: 'Regional Academy',
      defaultDirectorate: 'Provincial Directorate',
      defaultSchool: 'School Name',
      defaultSubject: 'Subject & Specialty',
      signatureAndLogo: 'Default Signature & School Logo',
      uploadSignature: 'Upload Digital Signature',
      uploadLogo: 'Upload School Logo',
      savedPreferences: 'Editor & Export Preferences',
      cloudSyncStatus: 'Cloud Sync Status',
      synced: 'All your documents are securely synchronized in cloud storage',
      syncNow: 'Sync Now',
    },

    customization: {
      title: 'Design & Typography Customization',
      colorPalette: 'Color Palette & Theme',
      fontFamily: 'Arabic / Latin Font Family',
      fontSize: 'Base Font Size',
      pageLayout: 'Page Layout & Print Margins',
      margins: 'Internal Margins',
      decorations: 'Borders & Moroccan Geometric Accents',
      showPageNumbers: 'Show Page Numbers',
      showFooterDate: 'Show Generated Date in Footer',
      watermark: 'Custom Watermark Text',
      savePreset: 'Save as Default Personal Preset',
    },
  },
};
