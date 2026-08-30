import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DocumentWizard } from './components/DocumentWizard';
import { TemplatesGallery } from './components/TemplatesGallery';
import { SavedDocumentsList } from './components/SavedDocumentsList';
import { EditorToolbar } from './components/DocumentEditor/EditorToolbar';
import { DocumentPreviewCanvas } from './components/DocumentEditor/DocumentPreviewCanvas';
import { ExportModal } from './components/ExportModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { GradebookManager } from './components/GradebookManager';
import { AccountPage } from './components/AccountPage';
import { PrivacyTermsPage } from './components/PrivacyTermsPage';
import { MoroccanOfficialEmblem } from './components/MoroccanOfficialEmblem';
import { InitialLanguageGate } from './components/InitialLanguageGate';
import { DocumentData, DocumentType } from './types';
import { STARTER_TEMPLATES } from './data/templatesData';
import { triggerBrowserPrint } from './utils/exportUtils';
import { translateDocumentContent } from './utils/documentTranslator';
import { useAuth } from './context/AuthContext';
import { Language, translations } from './i18n/translations';
import { 
  Sparkles, 
  Heart, 
  FileSpreadsheet, 
  CheckCircle2, 
  School, 
  BookOpen, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

const STORAGE_KEY = 'wathaiqi_tarbawiya_saved_docs_v2';
const LANG_STORAGE_KEY = 'wathaiqi_language_selected';

export function App() {
  const { currentUser, isOwner, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'home' | 'wizard' | 'editor' | 'templates' | 'saved' | 'gradebook' | 'account' | 'admin' | 'privacy'
  >('home');

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
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(() => {
    const defaultDoc = { ...STARTER_TEMPLATES[0] };
    if (currentUser) {
      defaultDoc.teacherName = currentUser.fullName || defaultDoc.teacherName;
      defaultDoc.academy = currentUser.academy || defaultDoc.academy;
      defaultDoc.directorate = currentUser.directorate || defaultDoc.directorate;
      defaultDoc.schoolName = currentUser.schoolName || defaultDoc.schoolName;
    }
    return defaultDoc;
  });

  // Saved documents in LocalStorage
  const [savedDocs, setSavedDocs] = useState<DocumentData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse saved documents from localStorage', e);
    }
    return [STARTER_TEMPLATES[0], STARTER_TEMPLATES[1], STARTER_TEMPLATES[2]];
  });

  // Editor Zoom level
  const [zoom, setZoom] = useState<number>(1.0);

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update HTML document direction and language dynamically
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

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

  // Save to localStorage whenever savedDocs updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDocs));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [savedDocs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Quick Action Handler from Hero
  const handleHeroStartDoc = (type: DocumentType) => {
    if (type === 'registre_notes') {
      setActiveTab('gradebook');
      return;
    }
    setWizardInitialType(type);
    setActiveTab('wizard');
  };

  // When a document is created in Wizard
  const handleDocumentCreated = (newDoc: DocumentData) => {
    // If it's a gradebook, open gradebook view
    if (newDoc.documentType === 'registre_notes') {
      setCurrentDoc(newDoc);
      setActiveTab('gradebook');
      showToast('تم إنشاء سجل النقط والتقويم بنجاح.');
      return;
    }

    setCurrentDoc(newDoc);
    setActiveTab('editor');
    showToast('تم إنشاء الوثيقة بنجاح! يمكنك الآن تعديلها ومعاينتها وتحميلها.');
  };

  // When selecting a template to edit
  const handleSelectTemplate = (tpl: DocumentData) => {
    const cloned: DocumentData = {
      ...tpl,
      id: `doc-${Date.now()}`,
      title: tpl.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentDoc(cloned);

    if (cloned.documentType === 'registre_notes') {
      setActiveTab('gradebook');
    } else {
      setActiveTab('editor');
    }
    showToast('تم فتح النموذج وجاهز للتعديل والتحميل.');
  };

  // Direct Export from Templates Gallery or Saved list
  const handleDirectExport = (doc: DocumentData) => {
    setCurrentDoc(doc);
    setIsExportModalOpen(true);
  };

  // Save Current Document into savedDocs
  const handleSaveDocument = () => {
    setIsSaving(true);
    const updatedDoc = {
      ...currentDoc,
      updatedAt: Date.now(),
    };
    setCurrentDoc(updatedDoc);

    setSavedDocs((prev) => {
      const index = prev.findIndex((d) => d.id === updatedDoc.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedDoc;
        return next;
      }
      return [updatedDoc, ...prev];
    });

    setTimeout(() => {
      setIsSaving(false);
      showToast('تم حفظ الوثيقة في خزانة وثائقك المحفوظة بنجاح.');
    }, 300);
  };

  // Duplicate a saved document
  const handleDuplicateDocument = (doc: DocumentData) => {
    const duplicated: DocumentData = {
      ...doc,
      id: `doc-${Date.now()}`,
      title: `${doc.title} (نسخة معدلة)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSavedDocs((prev) => [duplicated, ...prev]);
    showToast('تم إنشاء نسخة مكررة من الوثيقة.');
  };

  // Delete a saved document
  const handleDeleteDocument = (docId: string) => {
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
        onQuickNew={() => {
          setWizardInitialType('fiche_pedagogique');
          setActiveTab('wizard');
        }}
        language={language}
        onLanguageChange={handleSelectLanguage}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Dynamic Main Body Content based on activeTab */}
      <main className="flex-1">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div>
            <HeroBanner
              onStartDoc={handleHeroStartDoc}
              onStartCreate={handleHeroStartDoc}
              onBrowseTemplates={() => setActiveTab('templates')}
              onExploreTemplates={() => setActiveTab('templates')}
              onViewSaved={() => setActiveTab('saved')}
            />

            {/* Quick Template Picks on Homepage */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#D97706]" />
                    <span>نماذج تربوية مغربية سريعة الإنجاز</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    اختر نموذجاً معتمداً وابدأ تعديله مباشرة بضغطة زر
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('templates')}
                  className="text-xs font-bold text-[#065F46] hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>عرض جميع النماذج ({STARTER_TEMPLATES.length})</span>
                  <span>←</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STARTER_TEMPLATES.slice(0, 4).map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-2">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          {tpl.subjectNameAr}
                        </span>
                        <span>{tpl.grade}</span>
                      </div>
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-[#065F46] transition-colors">
                        {tpl.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleSelectTemplate(tpl)}
                        className="flex-1 py-1.5 bg-[#065F46] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold text-center transition-colors"
                      >
                        تعديل وتحميل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WIZARD */}
        {activeTab === 'wizard' && (
          <DocumentWizard
            initialType={wizardInitialType}
            onDocumentCreated={handleDocumentCreated}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {/* TAB 3: EDITOR CANVAS */}
        {activeTab === 'editor' && (
          <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <EditorToolbar
              documentData={currentDoc}
              zoom={zoom}
              onZoomChange={setZoom}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onPrint={handlePrint}
              onSave={handleSaveDocument}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              onUpdateField={handleUpdateCurrentDocField}
              isSaving={isSaving}
            />

            <div id="canvas-scroll-wrapper" className="flex-1 overflow-y-auto bg-slate-200/70">
              <DocumentPreviewCanvas
                documentData={currentDoc}
                isEditable={true}
                onUpdateField={handleUpdateCurrentDocField}
                zoom={zoom}
              />
            </div>
          </div>
        )}

        {/* TAB 4: GRADEBOOK & EVALUATION */}
        {activeTab === 'gradebook' && (
          <GradebookManager
            documentData={currentDoc}
            onUpdateDocument={(updated) => setCurrentDoc(updated)}
            language={language}
          />
        )}

        {/* TAB 5: TEMPLATES GALLERY */}
        {activeTab === 'templates' && (
          <TemplatesGallery
            onSelectTemplate={handleSelectTemplate}
            onDirectExport={handleDirectExport}
          />
        )}

        {/* TAB 6: SAVED DOCUMENTS */}
        {activeTab === 'saved' && (
          <SavedDocumentsList
            savedDocs={savedDocs}
            onEditDocument={(doc) => {
              setCurrentDoc(doc);
              if (doc.documentType === 'registre_notes') {
                setActiveTab('gradebook');
              } else {
                setActiveTab('editor');
              }
            }}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
            onDirectExport={handleDirectExport}
            onStartNewDocument={() => setActiveTab('wizard')}
          />
        )}

        {/* TAB 7: ACCOUNT & PROFILE */}
        {activeTab === 'account' && (
          <AccountPage onNavigateAdmin={() => setActiveTab('admin')} />
        )}

        {/* TAB 8: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard language={language} />
        )}

        {/* TAB 9: PRIVACY & TERMS */}
        {activeTab === 'privacy' && (
          <PrivacyTermsPage language={language} />
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
              onClick={() => setActiveTab('privacy')}
              className="hover:text-emerald-800 transition-colors"
            >
              سياسة الخصوصية والشروط
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="hover:text-emerald-800 transition-colors"
            >
              مكتبة الوثائق
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className="hover:text-emerald-800 transition-colors"
            >
              حساب الأستاذ
            </button>
            {isAdmin && (
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
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Initial Language Selection Gate (shown on first visit) */}
      <InitialLanguageGate
        isOpen={showLanguageGate}
        onSelectLanguage={handleSelectLanguage}
      />

    </div>
  );
}

export default App;
