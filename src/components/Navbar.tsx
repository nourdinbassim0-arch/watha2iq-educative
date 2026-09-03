import React, { useState } from 'react';
import { 
  FileText, 
  FolderHeart, 
  PlusCircle, 
  Shield,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, translations } from '../i18n/translations';

interface NavbarProps {
  activeTab: 'landing' | 'home' | 'wizard' | 'editor' | 'saved' | 'account' | 'admin' | 'privacy' | 'pricing';
  setActiveTab: (tab: 'landing' | 'home' | 'wizard' | 'editor' | 'saved' | 'account' | 'admin' | 'privacy' | 'pricing') => void;
  savedCount: number;
  onQuickNew: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
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
  const { user, profile, isPro, isAuthenticated, isOwner, logout } = useAuth();
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
            onClick={() => setActiveTab(isAuthenticated ? 'home' : 'landing')}
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
                {isPro && (
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span>PRO</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            {isAuthenticated ? (
              // Authenticated Links
              <>
                <button
                  id="nav-btn-home"
                  onClick={() => setActiveTab('home')}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'home'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  لوحة التحكم
                </button>

                <button
                  id="nav-btn-wizard"
                  onClick={() => {
                    onQuickNew();
                    setActiveTab('wizard');
                  }}
                  className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'wizard'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#065F46]" />
                  <span>{t.navNewDoc}</span>
                </button>

                <button
                  id="nav-btn-saved"
                  onClick={() => setActiveTab('saved')}
                  className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'saved'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <FolderHeart className="w-3.5 h-3.5 text-rose-600" />
                  <span>وثائقي</span>
                  {savedCount > 0 && (
                    <span className="bg-[#065F46] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-btn-pricing"
                  onClick={() => setActiveTab('pricing')}
                  className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الباقات والأسعار</span>
                </button>

                {/* Owner link */}
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
                    <span>لوحة الإدارة</span>
                  </button>
                )}
              </>
            ) : (
              // Public Unauthenticated Links
              <>
                <button
                  onClick={() => setActiveTab('landing')}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'landing'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  الرئيسية
                </button>

                <button
                  onClick={() => {
                    onQuickNew();
                    setActiveTab('wizard');
                  }}
                  className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'wizard'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#065F46]" />
                  <span>إنشاء وثيقة</span>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  الاشتراكات والأسعار
                </button>

                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === 'privacy'
                      ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#A7F3D0]/70'
                      : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  الشروط والخصوصية
                </button>
              </>
            )}
          </nav>

          {/* Right Action Tools: Plan Badge, Language & User Account */}
          <div className="flex items-center gap-2">
            
            {/* Subscription status indicator for authenticated users */}
            {!isPro && isAuthenticated && (
              <button
                onClick={() => setActiveTab('pricing')}
                title="تفعيل اشتراك المنصة التربوية"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-black hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <span>تفعيل الاشتراك (49 درهم)</span>
              </button>
            )}

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

            {/* User Account or Auth Buttons */}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#065F46] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>إنشاء حساب</span>
                </button>
              </div>
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
          {isAuthenticated ? (
            <>
              <button
                onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                لوحة التحكم
              </button>
              <button
                onClick={() => { onQuickNew(); setActiveTab('wizard'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                {t.navNewDoc}
              </button>
              <button
                onClick={() => { setActiveTab('saved'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                وثائقي ({savedCount})
              </button>
              <button
                onClick={() => { setActiveTab('account'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                حساب الأستاذ
              </button>
              <button
                onClick={() => { setActiveTab('pricing'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                الباقات والأسعار
              </button>
              {isOwner && (
                <button
                  onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                  className="w-full text-right p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200"
                >
                  لوحة الإدارة (Owner)
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('landing'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                الرئيسية
              </button>
              <button
                onClick={() => { onQuickNew(); setActiveTab('wizard'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center justify-between"
              >
                <span>إنشاء وثيقة تربوية</span>
                <PlusCircle className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => { setActiveTab('pricing'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50"
              >
                الاشتراكات والأسعار
              </button>
              <button
                onClick={() => { setActiveTab('privacy'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 text-slate-500"
              >
                سياسة الخصوصية
              </button>
              <button
                onClick={() => { onOpenAuthModal('login'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => { onOpenAuthModal('register'); setIsMobileMenuOpen(false); }}
                className="w-full text-right p-2.5 rounded-xl bg-[#065F46] text-white font-bold"
              >
                إنشاء حساب أستاذ جديد
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
