import React from 'react';
import { 
  FileSpreadsheet, 
  ScrollText, 
  FileCheck, 
  BookOpen, 
  FolderHeart, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Layers, 
  DownloadCloud, 
  Globe2, 
  ShieldCheck, 
  Activity
} from 'lucide-react';
import { DocumentType } from '../types';

interface HeroBannerProps {
  onStartDoc?: (type: DocumentType) => void;
  onStartCreate?: (type: DocumentType) => void;
  onBrowseTemplates?: () => void;
  onExploreTemplates?: () => void;
  onViewSaved?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartDoc,
  onStartCreate,
  onBrowseTemplates,
  onExploreTemplates,
  onViewSaved,
}) => {
  const handleStart = onStartDoc || onStartCreate || (() => {});
  const handleBrowse = onBrowseTemplates || onExploreTemplates || (() => {});
  const handleSaved = onViewSaved || (() => {});
  return (
    <div className="relative overflow-hidden bg-gradient-to-l from-[#065F46] via-[#047857] to-[#065F46] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#044735] shadow-lg">
      {/* Subtle Moroccan geometric background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-0 right-20 w-80 h-80 bg-[#D97706]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        
        {/* Welcome Moroccan Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#044735]/80 border border-white/20 text-[#ECFDF5] text-xs sm:text-sm font-semibold shadow-inner mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#FDE68A]" />
          <span>المنهاج المغربي المنقح • التوجيهات التربوية الرسمية</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
          <span className="text-[#FDE68A]">2026 - 2027</span>
        </div>

        {/* Main Logo & Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          <span>وثائقي </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#FDE68A]">
            التربوية
          </span>
        </h1>

        {/* Required Welcome Statement */}
        <p className="text-lg sm:text-2xl text-white/90 font-medium max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
          «فضاؤك الذكي لإنشاء وثائقك التربوية بسهولة واحترافية.»
        </p>

        {/* 5 Primary Required Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-4xl mx-auto mb-12">
          
          <button
            id="hero-btn-create-fiche"
            onClick={() => handleStart('fiche_pedagogique')}
            className="group flex items-center gap-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-base px-6 py-3.5 rounded-2xl shadow-lg shadow-[#044735]/40 hover:shadow-xl transition-all duration-200 active:scale-95 border border-[#FDE68A]/30"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <span>+ إنشاء جذاذة</span>
          </button>

          <button
            id="hero-btn-create-charte"
            onClick={() => handleStart('charte_classe')}
            className="group flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-white/30 backdrop-blur-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ScrollText className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <span>إنشاء ميثاق القسم</span>
          </button>

          <button
            id="hero-btn-create-exam"
            onClick={() => handleStart('controle_devoir')}
            className="group flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-white/30 backdrop-blur-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4 text-[#FECACA]" />
            </div>
            <span>إنشاء فرض</span>
          </button>

          <button
            id="hero-btn-browse-templates"
            onClick={handleBrowse}
            className="group flex items-center gap-2.5 bg-[#044735]/80 hover:bg-[#044735] text-[#FDE68A] font-bold text-base px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-[#047857]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#065F46] flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <span>تصفح النماذج</span>
          </button>

          <button
            id="hero-btn-view-saved"
            onClick={handleSaved}
            className="group flex items-center gap-2.5 bg-[#044735]/80 hover:bg-[#044735] text-white font-bold text-base px-5 py-3.5 rounded-2xl shadow-md transition-all duration-200 active:scale-95 border border-[#047857]"
          >
            <div className="w-8 h-8 rounded-lg bg-[#065F46] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderHeart className="w-4 h-4 text-[#FECACA]" />
            </div>
            <span>وثائقي المحفوظة</span>
          </button>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right pt-6 border-t border-white/15">
          
          <div className="p-4 rounded-2xl bg-[#044735]/50 border border-white/10 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#065F46] text-[#A7F3D0] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">جميع الأسلاك والمستويات</h4>
              <p className="text-xs text-white/70 mt-1">
                التعليم الابتدائي، الثانوي الإعدادي، والثانوي التأهيلي مع جميع الشعب والمسالك.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#044735]/50 border border-white/10 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#065F46] text-[#A7F3D0] shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ثنائي اللغة للمواد العلمية</h4>
              <p className="text-xs text-white/70 mt-1">
                الرياضيات، الفيزياء والكيمياء، وعلوم الحياة والأرض بالعربية أو بالفرنسية (Biof).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#044735]/50 border border-white/10 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#065F46] text-[#A7F3D0] shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">جذاذات التربية البدنية EPS</h4>
              <p className="text-xs text-white/70 mt-1">
                نماذج متخصصة تشمل الإحماء، المهارات الحركية، السلامة، والتقويم البدني.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#044735]/50 border border-white/10 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#065F46] text-[#A7F3D0] shrink-0">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">تصدير فوري شامل 6 صيغ</h4>
              <p className="text-xs text-white/70 mt-1">
                تحميل PDF عالي الجودة، Word DOCX، صور PNG/JPG، صفحة HTML، وRTF بجميع المقاسات.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
