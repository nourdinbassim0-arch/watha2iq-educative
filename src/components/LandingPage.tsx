import React from 'react';
import { 
  Sparkles, 
  FileSpreadsheet, 
  ShieldCheck, 
  DownloadCloud, 
  CheckCircle2, 
  ArrowLeft, 
  LogIn, 
  UserPlus, 
  Zap, 
  Layers, 
  BookOpen, 
  Check, 
  Clock, 
  FolderHeart,
  FileCheck
} from 'lucide-react';
import { MoroccanOfficialEmblem } from './MoroccanOfficialEmblem';
import { Language } from '../i18n/translations';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onViewPricing: () => void;
  onViewPrivacy: () => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onViewPricing,
  onViewPrivacy,
  language,
}) => {
  return (
    <div className="bg-[#FDFCFB] text-[#2D3436] min-h-screen font-sans" dir="rtl">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#065F46] via-[#047857] to-[#065F46] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#044735]">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D97706]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#044735]/80 border border-white/20 text-[#ECFDF5] text-xs sm:text-sm font-semibold shadow-inner mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FDE68A]" />
            <span>مطابق 100% للمنهاج المغربي والتوجيهات التربوية الرسمية</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
            <span className="text-[#FDE68A]">2026 - 2027</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            <span>أنشئ وثائقك وجذاذاتك التربوية</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#FDE68A]">
              بسهولة واحترافية متناهية
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-emerald-50 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            المنصة الرقمية الأولى لأساتذة المملكة المغربية لإعداد الجذاذات الرسمية، تخطيط التعلمات، وإدارة الوثائق البيداغوجية وفق التوجيهات الوزارية المعتمدة، مع التصدير الفوري بصيغة PDF وصور عالية الدقة.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-xl mx-auto mb-10">
            <button
              id="landing-btn-register"
              onClick={onOpenRegister}
              className="flex-1 min-w-[210px] flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-[#B45309] text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg shadow-[#044735]/50 hover:shadow-xl transition-all duration-200 active:scale-95 border border-[#FDE68A]/30 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>إنشاء حساب وتفعيل الاشتراك</span>
            </button>

            <button
              id="landing-btn-login"
              onClick={onOpenLogin}
              className="min-w-[150px] flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-base py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-white/30 backdrop-blur-xs cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              onClick={onViewPricing}
              className="min-w-[160px] flex items-center justify-center gap-2 bg-[#FDE68A]/20 hover:bg-[#FDE68A]/30 text-[#FDE68A] font-bold text-sm py-4 px-5 rounded-2xl border border-[#FDE68A]/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>الاشتراك: 49 درهم</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-100 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FDE68A]" />
              <span>ترويسة رسمية وشعار المملكة</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FDE68A]" />
              <span>حفظ سحابي مشفر وآمن</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FDE68A]" />
              <span>تصدير فائق الدقة (PDF / PNG)</span>
            </span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#065F46] font-bold text-xs bg-[#ECFDF5] px-3.5 py-1 rounded-full border border-[#A7F3D0]">
            بساطة وسرعة الإنجاز
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            كيف تعمل منصة وثائقي التربوية؟
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl mx-auto">
            ثلاث خطوات بسيطة فقط تفصلك عن إعداد جذاذة تربوية رسمية ومحكمة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs text-right relative">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center font-black text-lg mb-5 border border-[#A7F3D0]">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              اختر المادة والمستوى
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              حدد السلك الدراسي (ابتدائي، إعدادي، تأهيلي)، المادة، عنوان الدرس، والكفايات المستهدفة وفق المنهاج المغربي.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs text-right relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-black text-lg mb-5 border border-amber-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              حرّر ونسّق على المحرر الحي
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              استخدم محرر A4 الحقيقي لإضافة أو تعديل المقاطع الديداكتيكية، مهام الأستاذ والمتعلم، والتقويم مع الحفظ التلقائي.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs text-right relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg mb-5 border border-emerald-200">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              حمّل بصيغة PDF أو صورة
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              صدّر وثيقتك بضغطة زر واحدة كملف PDF رسمي جاهز للطباعة المباشرة أو كصورة عالية الوضوح للمشاركة.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 bg-slate-50/80 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#065F46] font-bold text-xs bg-[#ECFDF5] px-3.5 py-1 rounded-full border border-[#A7F3D0]">
              المميزات الحصرية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              كل ما يحتاجه الأستاذ(ة) في مكان واحد
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">الجذاذة التربوية الرسمية</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                تخطيط ديداكتيكي شامل يضم وضعية الانطلاق، بناء المفاهيم، المأسسة، والاستثمار مع شبكات معايير التقويم.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">الترويسة والهوية المغربية</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                مظهر رسمي يتضمن الشعار الملكي، الأكاديمية الجهوية، المديرية الإقليمية، واسم المؤسسة التعليمية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">تصدير PDF وصور عالي الدقة</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                توليد ملفات PDF بنصوص واضحة ودعم كامل لتشكيل الحروف العربية ومقاسات A4 القياسية بدون تشويه للجداول.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-4">
                <FolderHeart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">خزانة سحابية لوثائقك</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                جميع وثائقك وجذاذاتك محفوظة في حسابك الشخصي للرجوع إليها وتعديلها واستنساخها في أي وقت ومن أي جهاز.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">حفظ تلقائي فوري</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                لا داعي للقلق من فقدان التعديلات، المنصة تقوم بالحفظ التلقائي للوثيقة بمجرد الكتابة أو تغيير المحتوى.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1.5">تنسيق نصي حقيقي ودقيق</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                إمكانية تظليل أي جزء وتكبير الخط أو تلوينه، ضبط المحاذاة، وتعديل الجداول بكل سهولة وسلاسة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-l from-[#065F46] to-[#044735] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
          <MoroccanOfficialEmblem size="sm" showMotto={false} language="ar" />
          <h3 className="text-2xl sm:text-3xl font-black mt-4 mb-3">
            ابدأ الآن بإنشاء أول جذاذة تربوية رسمية
          </h3>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto mb-8">
            انضم إلى فضاء الأساتذة واستفد من الاشتراك الموحد (49 درهماً في الشهر أو في السنة) لتصميم وتصدير كافة وثائقك البيداغوجية الرسمية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 border border-[#FDE68A]/30 cursor-pointer"
            >
              إنشاء حساب وتفعيل الاشتراك
            </button>
            <button
              onClick={onOpenLogin}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={onViewPricing}
              className="text-emerald-200 hover:text-white font-bold text-sm px-4 py-3 cursor-pointer"
            >
              تفاصيل الاشتراك والأسعار (49 درهم)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
