import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DocumentWizard } from './components/DocumentWizard';
import { SavedDocumentsList } from './components/SavedDocumentsList';
import { EditorToolbar } from './components/DocumentEditor/EditorToolbar';
import { DocumentPreviewCanvas } from './components/DocumentEditor/DocumentPreviewCanvas';
import { DocumentDesignPanel } from './document-engine';
import { ExportModal } from './components/ExportModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountPage } from './components/AccountPage';
import { PrivacyTermsPage } from './components/PrivacyTermsPage';
import { PricingPage } from './components/PricingPage';
import { MoroccanOfficialEmblem } from './components/MoroccanOfficialEmblem';
import { InitialLanguageGate } from './components/InitialLanguageGate';
import { DocumentData, DocumentType } from './types';
import { triggerBrowserPrint } from './utils/exportUtils';
import { translateDocumentContent } from './utils/documentTranslator';
import { documentService } from './services/documentService';
import { useAuth } from './context/AuthContext';
import { Language, translations } from './i18n/translations';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'wathaiqi_tarbawiya_saved_docs_v2';
const LANG_STORAGE_KEY = 'wathaiqi_language_selected';

// Create a clean default official Moroccan Fiche Pédagogique template
function createBlankFiche(teacherName?: string): DocumentData {
  return {
    id: `doc-${Date.now()}`,
    title: 'جذاذة درس: مهارات التعبير والإنشاء والتواصل',
    documentType: 'fiche_pedagogique',
    level: 'middle',
    grade: 'الثالثة ثانوي إعدادي',
    subjectCategory: 'literary_humanities',
    subjectId: 'arabic',
    subjectNameAr: 'اللغة العربية',
    subjectNameFr: 'Langue Arabe',
    language: 'ar',
    kingdomHeader: 'المملكة المغربية',
    ministryHeader: 'وزارة التربية الوطنية والتعليم الأولي والرياضة',
    academy: 'الأكاديمية الجهوية للتربية والتكوين',
    directorate: 'المديرية الإقليمية',
    schoolName: 'مؤسسة التميز التعليمية',
    teacherName: teacherName || 'أستاذ(ة) المادة',
    classGroup: '3 / 1 و 3 / 2',
    academicYear: '2026 - 2027',
    unitOrModule: 'المجال الاجتماعي والاقتصادي',
    lessonTitle: 'مهارة كتابة نص سردي متماسك',
    duration: 'ساعة واحدة (60 دقيقة)',
    documentDate: new Date().toISOString().split('T')[0],
    themeColor: 'emerald',
    showOfficialHeader: true,
    showSchoolLogo: true,
    showTeacherSignature: true,
    showInspectorSignature: true,
    showFooterInfo: true,
    showPageNumbers: true,
    pageFormat: 'a4_portrait',
    generalCompetences: [
      'الكفاية التواصلية: توظيف قواعد اللغة والتعبير السليم شفهياً وكتابياً.',
      'الكفاية المنهجية: اكتساب خطوات التخطيط وتحرير نص سردي مستوفٍ للعناصر.',
      'الكفاية الثقافية: إغناء الرصيد المعرفي بوقائع وشخصيات من البيئة المغربية.'
    ],
    specificObjectives: [
      'أن يتعرف المتعلم على بنية النص السردي وعناصره الأساسية.',
      'أن يكتسب القدرة على صياغة حبكة سردية متدرجة.',
      'أن ينتج المتعلم نصاً سردياً قصيراً محترماً لعلامات الترقيم وسلامة التركيب.'
    ],
    didacticResources: [
      'الكتاب المدرسي المعتمد (المختار في اللغة العربية)',
      'السبورة الصفية والدفاتر المدرسية',
      'نصوص سردية منتقاة وأوراق عمل تطبيقية'
    ],
    prerequisites: [
      'مفهوم الجملة الفعلية والاسمية وأدوات الربط.',
      'علامات الترقيم الأساسية (النقطة، الفاصلة، المزدوجتان).',
      'القدرة على التعبير الشفهي حول أحداث واقعية.'
    ],
    lessonStages: [
      {
        id: 'st-1',
        stageName: 'الوضعية المشكلة والتمهيد',
        duration: '10 د',
        teacherActivities: 'طرح وضعية انطلاق واقعية حول حدث مؤثر لاستثارة مكتسبات المتعلمين وتوجيه انتباههم.',
        studentActivities: 'استحضار المكتسبات السابقة والتفاعل مع الإشكالية المطروحة والمشاركة في صياغة الفرضيات.',
        evaluationMode: 'مدى دقة استحضار أدوات الربط والقدرة على التعبير السليم.',
        didacticTools: 'السبورة / أسئلة استكشافية'
      },
      {
        id: 'st-2',
        stageName: 'مرحلة الاكتشاف وبناء التعلمات',
        duration: '25 د',
        teacherActivities: 'عرض نموذج نص سردي، وإبراز عناصره (الشخصيات، الزمان، المكان، العقدة، الحل) وتأطير النقاش.',
        studentActivities: 'قراءة النص قراءة فاحصة، استخراج المؤشرات الزمنية والمكانية، وتحديد عناصر الحكاية.',
        evaluationMode: 'القدرة على استخراج عناصر السرد والتمييز بين السرد والوصف.',
        didacticTools: 'الكتاب المدرسي / أوراق العمل'
      },
      {
        id: 'st-3',
        stageName: 'مرحلة المأسسة والاستنتاج',
        duration: '15 د',
        teacherActivities: 'مساعدة المتعلمين على تركيب خلاصة منهجية شاملة لخطوات كتابة نص سردي وتدوينها.',
        studentActivities: 'المشاركة الفعالة في صياغة القواعد والخطوات وتدوين الخلاصة التركيبية على الدفاتر.',
        evaluationMode: 'سلامة الصياغة واستيعاب الخطوات المنهجية للسرد.',
        didacticTools: 'السبورة الصفية / دفاتر الدروس'
      },
      {
        id: 'st-4',
        stageName: 'التقويم الإجمالي والاستثمار',
        duration: '10 د',
        teacherActivities: 'تكليف المتعلمين بإنتاج فقرة سردية قصيرة تطبيقاً للخطوات المكتسبة وتقديم تغذية راجعة فورية.',
        studentActivities: 'إنجاز النشاط الفردي، تبادل الإنتاجات للتصحيح الذاتي والتصحيح المتبادل.',
        evaluationMode: 'احترام خطوات السرد وسلامة اللغة ورسم علامات الترقيم.',
        didacticTools: 'دفاتر التمارين'
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function App() {
  const { user, profile, isOwner, isPro, recordDocumentGeneration, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'landing' | 'home' | 'wizard' | 'editor' | 'saved' | 'account' | 'admin' | 'privacy' | 'pricing'
  >(() => {
    return isAuthenticated ? 'home' : 'landing';
  });

  // Keep activeTab in sync with auth state changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'landing') {
      setActiveTab('home');
    }
  }, [isAuthenticated]);

  // Initial Language Gate State
  const [showLanguageGate, setShowLanguageGate] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
        return savedLang;
      }
    } catch {}
    return 'ar';
  });

  const [wizardInitialType, setWizardInitialType] = useState<DocumentType>('fiche_pedagogique');

  // Active Document loaded in Editor
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(() => createBlankFiche(profile?.name));

  // Saved documents: Synchronized strictly with Firestore for authenticated users
  const [savedDocs, setSavedDocs] = useState<DocumentData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved documents', e);
    }
    return [];
  });

  // Editor Zoom level
  const [zoom, setZoom] = useState<number>(1.0);

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load User Documents from Firestore when user changes
  useEffect(() => {
    if (user?.uid) {
      documentService.getUserDocuments(user.uid).then((docs) => {
        if (docs) {
          setSavedDocs(docs);
        }
      });
    } else {
      setSavedDocs([]);
    }
  }, [user?.uid]);

  // Update HTML document direction and language dynamically
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Real auto-save to Firestore (with debouncing) when active document changes
  useEffect(() => {
    if (!user?.uid || !currentDoc?.id) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      await documentService.saveDocument(user.uid, currentDoc);
      setIsSaving(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentDoc, user?.uid]);

  // Handle Language selection from Gate or Navbar
  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
    setShowLanguageGate(false);
    
    // Automatically translate the current active document to match the selected language
    setCurrentDoc((prevDoc) => translateDocumentContent(prevDoc, newLang));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Quick Action Handler to start new document
  const handleStartNewDoc = () => {
    setWizardInitialType('fiche_pedagogique');
    setActiveTab('wizard');
  };

  // When a document is created in Wizard
  const handleDocumentCreated = (newDoc: DocumentData) => {
    // 1. Immediately set active document and switch to editor tab
    setCurrentDoc(newDoc);
    setActiveTab('editor');
    showToast('تم إنشاء الوثيقة التربوية بنجاح! يمكنك الآن تعديلها ومعاينتها وتحميلها.');

    // 2. Perform usage tracking and Firestore saving asynchronously in background
    if (isAuthenticated) {
      if (!isPro && !isOwner) {
        recordDocumentGeneration().catch((err) => {
          console.warn('Daily usage record notice:', err);
        });
      }

      if (user?.uid) {
        documentService.saveDocument(user.uid, newDoc)
          .then(() => {
            setSavedDocs((prev) => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);
          })
          .catch((err) => {
            console.warn('Auto-save to cloud notice:', err);
          });
      }
    }
  };

  // Direct Export from Dashboard or Saved list
  const handleDirectExport = (docData: DocumentData) => {
    setCurrentDoc(docData);
    setIsExportModalOpen(true);
  };

  // Open Document in Editor
  const handleOpenDocument = (docData: DocumentData) => {
    setCurrentDoc(docData);
    setActiveTab('editor');
  };

  // Save Current Document into Firestore and State
  const handleSaveDocument = async () => {
    setIsSaving(true);
    const updatedDoc: DocumentData = {
      ...currentDoc,
      updatedAt: Date.now(),
    };
    setCurrentDoc(updatedDoc);

    if (user?.uid) {
      await documentService.saveDocument(user.uid, updatedDoc);
    }

    setSavedDocs((prev) => {
      const index = prev.findIndex((d) => d.id === updatedDoc.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedDoc;
        return next;
      }
      return [updatedDoc, ...prev];
    });

    setIsSaving(false);
    showToast('تم حفظ الوثيقة بنجاح.');
  };

  // Duplicate a saved document
  const handleDuplicateDocument = async (docData: DocumentData) => {
    const duplicated: DocumentData = {
      ...docData,
      id: `doc-${Date.now()}`,
      title: `${docData.title} (نسخة معدلة)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (user?.uid) {
      await documentService.saveDocument(user.uid, duplicated);
    }

    setSavedDocs((prev) => [duplicated, ...prev]);
    showToast('تم إنشاء نسخة مكررة من الوثيقة.');
  };

  // Delete a saved document
  const handleDeleteDocument = async (docId: string) => {
    if (user?.uid) {
      await documentService.deleteDocument(user.uid, docId);
    }
    setSavedDocs((prev) => prev.filter((d) => d.id !== docId));
    showToast('تم حذف الوثيقة بنجاح.');
  };

  // Direct Print
  const handlePrint = () => {
    triggerBrowserPrint(currentDoc.pageFormat || 'a4_portrait');
  };

  // Update specific field on currentDoc
  const handleUpdateCurrentDocField = (field: keyof DocumentData, value: any) => {
    setCurrentDoc((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isRtl = language === 'ar';
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D3436] flex flex-col font-sans selection:bg-[#065F46] selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Platform Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedDocs.length}
        onQuickNew={handleStartNewDoc}
        language={language}
        onLanguageChange={handleSelectLanguage}
        onOpenAuthModal={openAuth}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* PUBLIC UNPROTECTED TAB: LANDING */}
        {!isAuthenticated && activeTab === 'landing' && (
          <LandingPage
            onOpenLogin={() => openAuth('login')}
            onOpenRegister={() => openAuth('register')}
            onViewPricing={() => setActiveTab('pricing')}
            onViewPrivacy={() => setActiveTab('privacy')}
            language={language}
          />
        )}

        {/* AUTHENTICATED TAB 1: DASHBOARD */}
        {isAuthenticated && (activeTab === 'home' || activeTab === 'landing') && (
          <Dashboard
            documents={savedDocs}
            onStartNewDocument={handleStartNewDoc}
            onOpenDocument={handleOpenDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
            onExportDocument={handleDirectExport}
            onViewAccount={() => setActiveTab('account')}
            onViewPricing={() => setActiveTab('pricing')}
          />
        )}

        {/* TAB 2: WIZARD */}
        {activeTab === 'wizard' && (
          <DocumentWizard
            initialType={wizardInitialType}
            onDocumentCreated={handleDocumentCreated}
            onCancel={() => setActiveTab(isAuthenticated ? 'home' : 'landing')}
          />
        )}

        {/* TAB 3: REAL EDITOR CANVAS */}
        {activeTab === 'editor' && (
          <div className="flex flex-col min-h-[calc(100vh-4rem)] relative">
            <EditorToolbar
              documentData={currentDoc}
              zoom={zoom}
              onZoomChange={setZoom}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onPrint={handlePrint}
              onSave={handleSaveDocument}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              onOpenCustomizer={() => setIsDesignPanelOpen((prev) => !prev)}
              onUpdateField={handleUpdateCurrentDocField}
              isSaving={isSaving}
            />

            <div className="flex-1 flex overflow-hidden relative">
              <div id="canvas-scroll-wrapper" className="flex-1 overflow-y-auto bg-slate-200/70">
                <DocumentPreviewCanvas
                  documentData={currentDoc}
                  isEditable={true}
                  onUpdateField={handleUpdateCurrentDocField}
                  zoom={zoom}
                />
              </div>

              {/* Design & Decorations Panel Drawer */}
              {isDesignPanelOpen && (
                <div className="w-80 sm:w-96 border-s border-slate-200 bg-white shadow-xl z-20 overflow-y-auto no-print">
                  <DocumentDesignPanel
                    documentData={currentDoc}
                    onUpdateField={handleUpdateCurrentDocField}
                    onClose={() => setIsDesignPanelOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUTHENTICATED TAB 4: SAVED DOCUMENTS */}
        {isAuthenticated && activeTab === 'saved' && (
          <SavedDocumentsList
            documents={savedDocs}
            savedDocs={savedDocs}
            onEditDocument={handleOpenDocument}
            onOpenDocument={handleOpenDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
            onDirectExport={handleDirectExport}
            onStartNewDocument={handleStartNewDoc}
          />
        )}

        {/* AUTHENTICATED TAB 5: ACCOUNT & PROFILE */}
        {isAuthenticated && activeTab === 'account' && (
          <AccountPage onBack={() => setActiveTab('home')} />
        )}

        {/* AUTHENTICATED TAB 6: ADMIN DASHBOARD (OWNER ONLY) */}
        {isAuthenticated && activeTab === 'admin' && (
          <AdminDashboard onBack={() => setActiveTab('home')} />
        )}

        {/* GENERAL TAB: PRIVACY & TERMS */}
        {activeTab === 'privacy' && (
          <PrivacyTermsPage language={language} />
        )}

        {/* GENERAL TAB: PRICING & PLANS */}
        {activeTab === 'pricing' && (
          <PricingPage
            onBack={() => setActiveTab(isAuthenticated ? 'home' : 'landing')}
            onOpenAuthModal={() => openAuth('register')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-xs text-slate-500 no-print" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MoroccanOfficialEmblem size="sm" showMotto={false} language="ar" />
            <div>
              <span className="font-bold text-slate-800">«وثائقي التربوية»</span>
              <span className="mx-2">•</span>
              <span>منصة التوثيق والتخطيط البيداغوجي لأساتذة المملكة المغربية</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pricing')}
              className="text-[#065F46] hover:text-emerald-900 font-bold transition-colors"
            >
              الاشتراكات والأسعار
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className="hover:text-emerald-800 transition-colors"
            >
              سياسة الخصوصية والشروط
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => setActiveTab('account')}
                className="hover:text-emerald-800 transition-colors"
              >
                حساب الأستاذ
              </button>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="hover:text-emerald-800 transition-colors font-bold text-[#065F46]"
              >
                تسجيل الدخول
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-amber-800 hover:text-amber-950 font-bold"
              >
                لوحة الإدارة
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isExportModalOpen && (
        <ExportModal
          documentData={currentDoc}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isAiAssistantOpen && (
        <AiAssistantModal
          documentData={currentDoc}
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          onApplyChanges={(updated) => {
            setCurrentDoc(updated);
            showToast('تم تطبيق مقترحات الذكاء الاصطناعي على الوثيقة بنجاح!');
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Initial Language Selection Gate */}
      <InitialLanguageGate
        isOpen={showLanguageGate}
        onSelectLanguage={handleSelectLanguage}
      />

    </div>
  );
}

export default App;
