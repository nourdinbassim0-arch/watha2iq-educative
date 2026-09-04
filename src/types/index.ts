export type DocumentType = 
  | 'fiche_pedagogique'       // الجذاذات والتخطيطات التربوية
  | 'charte_classe'           // ميثاق القسم
  | 'controle_devoir'         // الفروض والاختبارات
  | 'evaluation_soutien'      // أنشطة التقويم والدعم والمعالجة
  | 'grille_notation'         // شبكات التنقيط والتفريغ
  | 'fiche_activite'          // بطاقات الأنشطة والتمارين
  | 'resume_cours'            // ملخص درس وخطة درس
  | 'fiche_technique'         // بطاقة تقنية وتجريبية
  | 'rapport_conseil'         // تقارير مجالس الأقسام واجتماعات الأولياء
  | 'attestation_affiche'     // الشواهد والملصقات التربوية
  | 'registre_notes';         // سجل النقط والتقويم الشامل

export type TemplateDesignStyle = 'official' | 'modern' | 'minimal' | 'cards' | 'formal_bordered';

export type EducationLevel = 'primary' | 'middle' | 'high';

export type SubjectCategory = 'scientific' | 'literary_humanities' | 'physical_education';

export type DocumentLanguage = 'ar' | 'fr' | 'en';

export type ThemeColor = 'emerald' | 'crimson' | 'royal' | 'gold' | 'slate';

export type PageFormat = 
  | 'a4_portrait'
  | 'a4_landscape'
  | 'a3_portrait'
  | 'a3_landscape'
  | 'letter_portrait'
  | 'letter_landscape'
  | 'phone_story'
  | 'square';

export type ExportFormat = 'pdf' | 'png' | 'jpg';

export type UserPlan = 'FREE' | 'PRO';

export type SubscriptionStatus = 
  | 'ACTIVE' 
  | 'APPROVED' 
  | 'SUSPENDED' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'PENDING'
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'trialing' 
  | 'incomplete' 
  | 'none';

export interface UserSubscription {
  uid: string;
  provider?: 'paypal' | string;
  customerId?: string;
  subscriptionId?: string;
  planId?: string;
  plan: UserPlan;
  status: SubscriptionStatus | string;
  price?: number;
  pricePaidMad?: number;
  currency?: string;
  billingPeriod?: string;
  billingCycle?: string;
  startedAt?: any;
  currentPeriodStart?: any;
  currentPeriodEnd?: any;
  cancelAtPeriodEnd?: boolean;
  updatedAt?: any;
  paypalDetails?: any;
}

export interface UserDailyUsage {
  uid: string;
  date: string; // YYYY-MM-DD
  used: number;
  limit: number;
  updatedAt?: any;
}

export interface PlatformSettings {
  freeDailyLimit: number;
  platformNameAr: string;
  platformNameFr: string;
  maintenanceMode: boolean;
  proPriceMad: number;
  supportEmail: string;
}

export type FontFamily = 
  | 'tajawal' 
  | 'cairo' 
  | 'amiri' 
  | 'noto_naskh' 
  | 'ibm_plex' 
  | 'arial' 
  | 'times_new_roman' 
  | 'calibri' 
  | 'traditional_arabic';

export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'owner' | 'admin' | 'teacher';

export type HeaderTemplate = 'official' | 'center_logo' | 'minimal' | 'academic' | 'custom';

export interface HeaderFieldsVisibility {
  kingdom?: boolean;          // المملكة المغربية
  ministry?: boolean;         // وزارة التربية الوطنية والتعليم الأولي والرياضة
  academy?: boolean;          // الأكاديمية الجهوية للتربية والتكوين
  directorate?: boolean;      // المديرية الإقليمية
  schoolName?: boolean;       // اسم المؤسسة
  academicYear?: boolean;     // السنة الدراسية
  subject?: boolean;          // المادة
  grade?: boolean;            // المستوى
  teacher?: boolean;          // الأستاذ(ة)
  date?: boolean;             // التاريخ
}

export type LogoPosition = 'top_center' | 'top_right' | 'top_left' | 'custom';
export type LogoSize = 'sm' | 'md' | 'lg' | 'custom';

export interface DocumentLogoConfig {
  show: boolean;
  position: LogoPosition;
  size: LogoSize;
  customWidthMm?: number;      // in mm (e.g. 35)
  customHeightMm?: number;     // in mm (e.g. 26)
  customPosX?: number;         // percentage (0-100) or offset
  customPosY?: number;
  useCustomLogo: boolean;      // true if user uploaded custom logo
  customLogoUrl?: string;      // data URL or image URL
  topMarginMm?: number;        // distance from page top / content
  bottomMarginMm?: number;     // distance below logo
  sideSpacingMm?: number;      // spacing between logo and ministry text
  titleSpacingMm?: number;     // spacing between logo/header and title
}

export interface DocumentHeaderConfig {
  template: HeaderTemplate;
  showOfficialHeader: boolean;
  visibleFields: HeaderFieldsVisibility;
  customHeaderTitle?: string;
  spacingBelowHeaderMm?: number;
}

export type PageBorderPreset = 'none' | 'simple' | 'islamic' | 'moroccan' | 'academic' | 'decorative';
export type BorderScope = 'full' | 'corners' | 'partial' | 'none';

export interface DocumentBorderConfig {
  preset: PageBorderPreset;
  scope: BorderScope;
  thickness: number;          // in pt/px: 1, 1.5, 2, 3
  color: string;              // hex
  insetMm: number;            // distance from page edge in mm (e.g. 6mm)
}

export type IslamicDecorationStyle = 
  | 'classic_islamic'       // 1. كلاسيكي إسلامي
  | 'moroccan_geometric'    // 2. مغربي هندسي
  | 'moroccan_zellij'       // 3. زليج مغربي
  | 'simple_islamic'        // 4. إسلامي بسيط
  | 'academic_green'        // 5. أخضر أكاديمي
  | 'geometric'             // 6. هندسي
  | 'corner_ornaments'      // 7. زخارف الزوايا
  | 'academic_official'     // 8. رسمي أكاديمي
  | 'top_only'              // 9. زخرفة علوية فقط
  | 'bottom_only';          // 10. زخرفة سفلية فقط

export type DecorationIntensityLevel = 'none' | 'light' | 'medium' | 'strong';

export interface DocumentDecorationConfig {
  style: IslamicDecorationStyle;
  intensity: DecorationIntensityLevel;
  primaryColor?: string;
  accentColor?: string;
}

export interface DocumentMarginConfig {
  preset: 'tight' | 'normal' | 'generous' | 'academic' | 'custom';
  topMm: number;
  bottomMm: number;
  rightMm: number;
  leftMm: number;
}

export type SignatureLayout = 'one_center' | 'two_columns' | 'three_columns' | 'four_columns' | 'custom';

export interface DocumentSignatureItem {
  id: string;
  title: string;       // مثلا: توقيع الأستاذ(ة)
  name: string;        // مثلا: ذ. محمد العلمي
  role?: string;
  show: boolean;
  order: number;
}

export interface DocumentSignaturesConfig {
  showSignatures: boolean; // Main ON/OFF switch!
  layout: SignatureLayout;
  items: DocumentSignatureItem[];
}

export interface DocumentFooterConfig {
  showFooter: boolean;
  showPageNumbers: boolean;
  customText?: string;
  showDecoration: boolean;
  showAcademicYear: boolean;
}

export interface CustomSignature {
  id: string;
  title: string;          // مثلا: توقيع الأستاذ(ة)، الإدارة التربوية، السيد المفتش، ولي أمر التلميذ
  name: string;           // الاسم الكامل للموقع
  show: boolean;
  role?: string;
  alignment?: 'right' | 'center' | 'left';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  plan?: UserPlan;
  isVerified?: boolean;
  phone?: string;
  academy?: string;
  directorate?: string;
  schoolName?: string;
  defaultSubject?: string;
  digitalSignatureUrl?: string;
  schoolLogoUrl?: string;
  createdAt: string | number;
  lastLogin?: string | number;
  avatarUrl?: string;
}

export interface UserProfile extends User {
  fullName?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  details?: string;
  timestamp: string | number | any;
  ipAddress?: string;
}

export interface LessonStage {
  id: string;
  stageName: string;            // مرحلة الدرس / الوضعية التعلمية
  duration: string;             // المدة
  teacherActivities: string;    // أنشطة الأستاذ(ة)
  studentActivities: string;    // أنشطة المتعلمين
  evaluationMode: string;       // أشكال التقويم والتشخيص
  didacticTools: string;        // الوسائل والدعامات
}

export interface RuleItem {
  id: string;
  category: string;
  ruleText: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  points: string;
  description: string;
  subQuestions: string[];
}

export interface StudentScoreItem {
  id: string;
  studentNumber: number;
  studentName: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  total: string;
  appreciation: string;
}

export interface RemediationActivity {
  id: string;
  difficulty: string;          // صعوبة التعلم المرصودة
  remediationObjective: string; // الهدف من المعالجة
  targetedStudents: string;    // الفئة المستهدفة / المجموعات
  activityDescription: string; // صيغة النشاط وإجراءات الدعم
  evaluationMetric: string;    // مؤشر التحقق والتقويم
}

// Gradebook Specific Types (سجل النقط والتقويم)
export interface GradebookMiddleHighRow {
  id: string;
  studentNumber: number;
  studentName: string;
  exam1: number | string;
  exam2: number | string;
  exam3: number | string;
  exam4: number | string;
  activities: number | string;
  notes: string;
  calculatedAverage?: number;
  rank?: number;
  appreciation?: string;
}

export interface PrimaryCompetencyIndicator {
  id: string;
  componentName: string;       // اسم المكون (مثال: القراءة، التراكيب، الحساب الذهني)
  indicatorDescription: string;// مؤشر التحقق
  maxScore?: number;
}

export interface PrimaryEvaluationStudentRow {
  id: string;
  studentNumber: number;
  studentName: string;
  ratings: Record<string, 'excellent' | 'veryGood' | 'good' | 'inProgress' | 'notAcquired' | number>;
  generalAppreciation: string;
  notes: string;
}

export interface GradebookCoefficients {
  exam1: number;
  exam2: number;
  exam3: number;
  exam4: number;
  activities: number;
}

export interface DocumentData {
  id: string;
  title: string;
  documentType: DocumentType;
  level: EducationLevel;
  grade: string;
  subjectCategory: SubjectCategory;
  subjectId: string;
  subjectNameAr: string;
  subjectNameFr?: string;
  language: DocumentLanguage;
  
  // Administrative info (Moroccan official header data)
  kingdomHeader: string;
  ministryHeader: string;
  academy: string;
  directorate: string;
  schoolName: string;
  teacherName: string;
  classGroup: string;
  academicYear: string;
  unitOrModule: string;
  lessonTitle: string;
  duration: string;
  documentDate: string;
  
  // Customization & Visual Styling
  themeColor: ThemeColor;
  templateDesign?: TemplateDesignStyle;
  fontFamily?: FontFamily;
  fontSize?: 'sm' | 'base' | 'lg';
  marginSize?: 'tight' | 'normal' | 'generous';
  borderStyle?: 'official' | 'zellij' | 'modern' | 'minimal';
  lineSpacing?: '1.0' | '1.15' | '1.25' | '1.5' | '1.8' | '2.0';
  textAlign?: 'right' | 'center' | 'left' | 'justify';
  customFontScale?: number;
  branchOrStream?: string;
  showOfficialHeader: boolean;
  showOfficialEmblem?: boolean;
  showSchoolLogo: boolean;
  customLogoUrl?: string;
  customSchoolLogoUrl?: string;
  showTeacherSignature: boolean;
  showSchoolSignature?: boolean;
  showInspectorSignature: boolean;
  showFooterInfo: boolean;
  showPageNumbers: boolean;
  pageFormat: PageFormat;
  watermarkText?: string;
  customSignatures?: CustomSignature[];

  // Professional Layout & Design Engine Configurations
  logoConfig?: DocumentLogoConfig;
  headerConfig?: DocumentHeaderConfig;
  borderConfig?: DocumentBorderConfig;
  decorationConfig?: DocumentDecorationConfig;
  marginConfig?: DocumentMarginConfig;
  signaturesConfig?: DocumentSignaturesConfig;
  footerConfig?: DocumentFooterConfig;
  
  // Content specific to Fiche Pédagogique (جذاذة تربوية)
  generalCompetences?: string[];
  specificObjectives?: string[];
  didacticResources?: string[];
  prerequisites?: string[];
  lessonStages?: LessonStage[];
  diagnosticEval?: string;
  formativeEval?: string;
  summativeEval?: string;
  supportActivities?: string;
  teacherNotes?: string;

  // Content specific to Résumé de cours / Plan de cours (ملخص درس وخطة درس)
  resumeSections?: {
    id: string;
    title: string;
    content: string;
    keyPoints?: string[];
  }[];

  // Content specific to Fiche Technique / Expérimentale (بطاقة تقنية وتجريبية)
  technicalSheetSections?: {
    id: string;
    title: string;
    objective: string;
    materials: string[];
    steps: string[];
    securityRules: string[];
    schemaDescription?: string;
  }[];

  // Content specific to Custom Dynamic Sections
  customSections?: {
    id: string;
    title: string;
    type: 'text' | 'table' | 'bullets' | 'qa';
    content: any;
  }[];

  // Content specific to EPS (التربية البدنية والرياضية)
  epsWarmUp?: {
    general: string;
    specific: string;
    duration: string;
  };
  epsMotorSkills?: string[];
  epsSafetyGuidelines?: string[];
  epsCollectiveActivity?: string;
  epsPhysicalAssessment?: string;
  epsCompetitionRules?: string;

  // Content specific to Charte de classe (ميثاق القسم)
  charteIntroduction?: string;
  charteRules?: RuleItem[];
  charteTeacherCommitment?: string;
  charteStudentRepName?: string;

  // Content specific to Contrôle / Devoir (فروض واختبارات)
  examInstructions?: string[];
  exercises?: ExerciseItem[];
  examTotalPoints?: string;
  gradingCriteria?: string[];
  exerciseTotalCalculationMode?: 'auto' | 'manual';

  // Content specific to Évaluation et Soutien (أنشطة التقويم والدعم)
  identifiedGaps?: string[];
  remediationPlan?: RemediationActivity[];
  supportTimeline?: string;

  // Content specific to Grille de notation (شبكة التنقيط والتفريغ)
  evaluationCriteriaNames?: string[];
  scoreRows?: StudentScoreItem[];

  // Content specific to Registre des Notes (سجل النقط والتقويم الشامل)
  gradebookType?: 'middle_high' | 'primary';
  gradebookCoefficients?: GradebookCoefficients;
  gradebookMiddleHighRows?: GradebookMiddleHighRow[];
  primaryIndicators?: PrimaryCompetencyIndicator[];
  primaryStudentRows?: PrimaryEvaluationStudentRow[];
  gradebookViewMode?: 'numeric' | 'appreciation' | 'both';

  // Content specific to Rapport de Conseil (تقارير مجالس الأقسام)
  meetingType?: string;
  meetingDate?: string;
  attendeesCount?: string;
  generalResultsOverview?: string;
  strengthsObserved?: string[];
  weaknessesObserved?: string[];
  councilDecisions?: string[];

  // Content specific to Attestation / Affiche (شواهد وملصقات)
  attestationRecipient?: string;
  attestationReason?: string;
  attestationAppreciation?: string;
  attestationDate?: string;

  createdAt: number;
  updatedAt: number;
  userId?: string;
  isPublicTemplate?: boolean;
}

// Audit Log for Owner Dashboard
export interface AuditLogItem {
  id: string;
  timestamp: number;
  actionType: 'user_registered' | 'role_changed' | 'user_disabled' | 'user_enabled' | 'template_published' | 'template_deleted' | 'settings_updated';
  performedBy: string;
  targetUserOrItem: string;
  details: string;
}

// Broadcast Announcement
export interface BroadcastAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: number;
}
