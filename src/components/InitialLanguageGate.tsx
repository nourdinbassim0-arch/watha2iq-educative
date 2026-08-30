import React from 'react';
import { Language } from '../i18n/translations';
import { MoroccanOfficialEmblem } from './MoroccanOfficialEmblem';
import { Check, Sparkles, Globe } from 'lucide-react';

interface InitialLanguageGateProps {
  isOpen: boolean;
  onSelectLanguage: (lang: Language) => void;
}

export const InitialLanguageGate: React.FC<InitialLanguageGateProps> = ({
  isOpen,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-2xl border border-emerald-800/20 text-center relative overflow-hidden">
        {/* Subtle Moroccan background pattern accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-50 rounded-full blur-2xl pointer-events-none" />

        {/* Official Kingdom Emblem */}
        <div className="flex justify-center mb-5">
          <MoroccanOfficialEmblem size="lg" showMotto={true} language="ar" />
        </div>

        {/* Welcoming Titles in 3 Languages */}
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            مرحباً بكم في وثائقي التربوية
          </h2>
          <p className="text-sm font-semibold text-emerald-800">
            Bienvenue sur Wathaiqi Tarbawiya • Welcome to Moroccan Teachers Portal
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto pt-1">
            يرجى اختيار لغة المنصة والوثائق المفضلة للبدء. يمكنك تغييرها لاحقاً في أي وقت من الإعدادات.
          </p>
        </div>

        {/* 3 Large Language Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* 1. العربية */}
          <button
            type="button"
            id="initial-lang-ar"
            onClick={() => onSelectLanguage('ar')}
            className="p-5 rounded-2xl border-2 border-emerald-700/30 hover:border-[#065F46] bg-emerald-50/40 hover:bg-emerald-100/60 transition-all text-center flex flex-col items-center justify-between group active:scale-95 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🇲🇦</span>
            <span className="text-base font-black text-emerald-950 font-serif">العربية</span>
            <span className="text-[11px] font-semibold text-emerald-800 mt-1 bg-emerald-200/60 px-2 py-0.5 rounded-full">
              الواجهة والوثائق (RTL)
            </span>
          </button>

          {/* 2. Français */}
          <button
            type="button"
            id="initial-lang-fr"
            onClick={() => onSelectLanguage('fr')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#065F46] bg-slate-50/70 hover:bg-emerald-50/50 transition-all text-center flex flex-col items-center justify-between group active:scale-95 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🇫🇷</span>
            <span className="text-base font-black text-slate-900">Français</span>
            <span className="text-[11px] font-semibold text-slate-600 mt-1 bg-slate-200/60 px-2 py-0.5 rounded-full">
              Interface & Fiches (LTR)
            </span>
          </button>

          {/* 3. English */}
          <button
            type="button"
            id="initial-lang-en"
            onClick={() => onSelectLanguage('en')}
            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#065F46] bg-slate-50/70 hover:bg-emerald-50/50 transition-all text-center flex flex-col items-center justify-between group active:scale-95 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🇬🇧</span>
            <span className="text-base font-black text-slate-900">English</span>
            <span className="text-[11px] font-semibold text-slate-600 mt-1 bg-slate-200/60 px-2 py-0.5 rounded-full">
              UI & Templates (LTR)
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span>منصة مطابقة للتوجيهات الرسمية لوزارة التربية الوطنية والتعليم الأولي والرياضة</span>
        </div>
      </div>
    </div>
  );
};
