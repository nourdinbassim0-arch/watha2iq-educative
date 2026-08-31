import React, { useState } from 'react';
import { 
  FileText, 
  FolderHeart, 
  BookOpen, 
  PlusCircle, 
  Shield,
  User,
  LogOut,
  LogIn,
  Globe,
  FileSpreadsheet,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, translations } from '../i18n/translations';

interface NavbarProps {
  activeTab: 'home' | 'wizard' | 'editor' | 'templates' | 'saved' | 'gradebook' | 'account' | 'admin' | 'privacy';
  setActiveTab: (tab: 'home' | 'wizard' | 'editor' | 'templates' | 'saved' | 'gradebook' | 'account' | 'admin' | 'privacy') => void;
  savedCount: number;
  onQuickNew: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onQuickNew,
  language,
  onLanguageChange,
  onOpenAuthModal,
}) => {
  const { user, profile, isAuthenticated, isOwner, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[language];
  const isRtl = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-2xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo-container"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#065F46] border border-[#044735] text-white shadow-md shadow-[#065F46]/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-calligraphy text-xl font-bold text-[#FDE68A]">و</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D97706] rounded-full border-2 border-[#FDFCFB]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-[#2D3436] tracking-tight flex items-center gap-1">
                  <span>{language === 'ar' ? 'وثائقي' : 'Wathaiqi'}</span>
                  <span className="text-[#065F46]">{language === 'ar' ? 'التربوية' : 'Tarbawiya'}</span>
                </h1>
                <span className="bg-[#ECFDF5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A7F3D0] hidden sm:inline">
                  {t.moroccanTeacherSpace}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              id="nav-btn-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              {t.navHome}
            </button>

            <button
              id="nav-btn-wizard"
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'wizard'
                  ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#065F46]" />
              <span>{t.navNewDoc}</span>
            </button>

            <button
              id="nav-btn-editor"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#065F46]" />
              <span>{t.navEditor}</span>
            </button>

            <button
              id="nav-btn-gradebook"
              onClick={() => setActiveTab('gradebook')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'gradebook'
                  ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#065F46]" />
              <span>{t.navGradebook}</span>
            </button>

            <button
              id="nav-btn-templates"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'templates'
                  ? 'bg-[#FEF3C7] text-[#92400E] font-bold border border-[#FDE68A]'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t.navTemplates}</span>
            </button>

            <button
              id="nav-btn-saved"
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'saved'
                  ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                  : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.navSaved}</span>
              {savedCount > 0 && (
                <span className="bg-[#065F46] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Owner portal button only visible if role is verified OWNER */}
            {isOwner && (
              <button
                id="nav-btn-admin"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-amber-300 shadow-xs'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>لوحة الإدارة (Owner)</span>
              </button>
            )}
          </nav>

          {/* Right Action Tools: Language & User Account */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-[#F3F4F6] p-0.5 rounded-xl border border-[#E5E7EB] text-[11px] font-bold">
              {(['ar', 'fr', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => onLanguageChange(l)}
                  className={`px-2 py-1 rounded-lg transition-colors uppercase ${
                    language === l
                      ? 'bg-[#065F46] text-white shadow-2xs'
                      : 'text-[#4B5563] hover:text-[#1F2937]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* User Account / Login Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    activeTab === 'account'
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'حسابي'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title={t.logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#065F46] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 lg:hidden rounded-xl hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => { setActiveTab('wizard'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navNewDoc}
          </button>
          <button
            onClick={() => { setActiveTab('editor'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navEditor}
          </button>
          <button
            onClick={() => { setActiveTab('gradebook'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navGradebook}
          </button>
          <button
            onClick={() => { setActiveTab('templates'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navTemplates}
          </button>
          <button
            onClick={() => { setActiveTab('saved'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
          >
            {t.navSaved} ({savedCount})
          </button>
          {isOwner && (
            <button
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className="w-full text-right p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200"
            >
              {t.navAdmin}
            </button>
          )}
          <button
            onClick={() => { setActiveTab('privacy'); setIsMobileMenuOpen(false); }}
            className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 text-slate-500"
          >
            {t.navPrivacy}
          </button>
        </div>
      )}
    </header>
  );
};
