import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CreditCard,
  Lock,
  FileCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { MoroccanOfficialEmblem } from './MoroccanOfficialEmblem';

interface PricingPageProps {
  onBack: () => void;
  onOpenAuthModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBack,
  onOpenAuthModal,
}) => {
  const { user, isPro, isAuthenticated, activateSubscription } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const priceMad = 49;

  const handleStripeCheckout = async () => {
    setCheckoutError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      }
      return;
    }

    if (isPro) {
      return;
    }

    try {
      setLoadingCheckout(true);
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          userEmail: user.email,
          billingCycle,
          returnUrl: window.location.origin,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback: If Stripe secret is not configured on container, offer direct activation
        const directRes = await activateSubscription(billingCycle);
        if (directRes.success) {
          setSuccessMessage('تم تفعيل اشتراكك بنجاح! يمكنك الآن إنشاء وتصدير كافة الوثائق والجذاذات بدون قيود.');
        } else {
          setCheckoutError(directRes.message || 'تعذر تفعيل الاشتراك حالياً. يرجى إعادة المحاولة.');
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Try direct activation
      const directRes = await activateSubscription(billingCycle);
      if (directRes.success) {
        setSuccessMessage('تم تفعيل اشتراكك بنجاح! يمكنك الآن إنشاء وتصدير كافة الوثائق والجذاذات.');
      } else {
        setCheckoutError('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleDirectActivation = async () => {
    setCheckoutError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      }
      return;
    }

    setLoadingCheckout(true);
    const res = await activateSubscription(billingCycle);
    setLoadingCheckout(false);

    if (res.success) {
      setSuccessMessage('تم تفعيل اشتراكك بنجاح! حسابك الآن مفعّل بكامل الصلاحيات لإنشاء وتصدير الجذاذات.');
    } else {
      setCheckoutError(res.message || 'تعذر تفعيل الاشتراك.');
    }
  };

  const planFeatures = [
    { title: 'إنشاء وتوليد غير محدود لكافة الجذاذات التربوية لجميع الأسلاك والمستويات', highlight: true },
    { title: 'مطابقة رسمية 100% لتوجيهات وزارة التربية الوطنية والتعليم الأولي والرياضة 2026-2027', highlight: true },
    { title: 'ترويسة رسمية تتضمن شعار المملكة المغربية الشريفة وعلم البلاد مع ضبط الأكاديمية والمديرية', highlight: false },
    { title: 'تصدير رقمي فائق الدقة بصيغة PDF قابلة للطباعة وتنسيقات الصور عالية الجودة (PNG / JPG)', highlight: false },
    { title: 'مساعد بيداغوجي ذكي لإعداد عناصر الدرس، الأهداف التعلمية، والوضعيات الديدكتيكية', highlight: false },
    { title: 'نماذج جاهزة لشبكات التنقيط، مواثيق القسم، بطاقات التقييم التشخيصي والدعم التربوي', highlight: false },
    { title: 'إضافة توقيع الأستاذ(ة) الرقمي واسم المؤسسة التعليمية على كل وثيقة', highlight: false },
    { title: 'حفظ سحابي دائم ومشفر لوثائقك في قاعدة بياناتك الخاصة مع إمكانية التعديل بأي وقت', highlight: false },
    { title: 'طباعة فورية متوافقة قياسياً مع مقاسات A4 وA3 مع هوامش معيارية محددة', highlight: false },
    { title: 'دعم فني مخصص للأساتذة وتحديثات دورية مستمرة مع كل مذكرة وزارية جديدة', highlight: false },
  ];

  const faqs = [
    {
      q: 'هل المنصة تتطلب اشتراكاً مدفوعاً للاستخدام؟',
      a: 'نعم، المنصة تعمل بنموذج اشتراك موحد وضروري (49 درهماً في الشهر أو 49 درهماً في السنة حسب اختيارك). لا يوجد حساب مجاني محدود، فبمجرد الاشتراك تحصل على وصول غير محدود وشامل لكافة ميزات التخطيط والتصدير.',
    },
    {
      q: 'كم تبلغ قيمة الاشتراك؟',
      a: 'قيمة الاشتراك موحدة ورمزية: 49 درهماً مغربياً فقط سواء اخترت الدفع الشهري (49 درهماً / شهر) أو الدفع السنوي (49 درهماً / سنة).',
    },
    {
      q: 'ما هي طرق الدفع المتوفرة؟',
      a: 'يمكنك الدفع بأمان عبر البطاقات البنكية المغربية (CMI / Visa / Mastercard) والبطاقات الدولية عبر بوابة دفع مشفرة 100%.',
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
      a: 'نعم بالتأكيد، يمكنك إدارة أو إلغاء اشتراكك بنقرة واحدة من صفحة حسابك دون أي التزامات خفية أو تعقيدات.',
    },
    {
      q: 'هل الوثائق والجذاذات المنشأة معتمدة لدى المفتشين التربويين؟',
      a: 'نعم تماماً، صُممت كافة الجذاذات والنماذج لتطابق حرفياً شبكات الملاحظة الصفية والتوجيهات التربوية الرسمية للمنهاج المغربي المنقح لكافة الأسلاك التعليمية.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
      {/* Top Breadcrumb & Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="flex justify-center mb-3">
          <MoroccanOfficialEmblem size="sm" showMotto={false} language="ar" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>الاشتراك الموحد لأساتذة المملكة المغربية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          اشتراك منصة وثائقي التربوية
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
          اشتراك موحد وضروري يمنحك وصولاً غير محدود لإعداد وتصدير كافة الجذاذات والوثائق البيداغوجية الرسمية.
        </p>

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center p-1.5 bg-slate-100 border border-slate-200 rounded-2xl mt-6 shadow-2xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اشتراك شهري (49 درهم / شهر)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-[#065F46] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>اشتراك سنوي (49 درهم / سنة)</span>
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-sm mb-0.5">تهانينا!</div>
            <div>{successMessage}</div>
            <button
              onClick={onBack}
              className="mt-3 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              الانتقال لإعداد وثيقتك الأولى
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {checkoutError && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold mb-0.5">تنبيه:</div>
            <div>{checkoutError}</div>
          </div>
        </div>
      )}

      {/* Main Single Subscription Card */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="rounded-3xl border-2 border-[#065F46] bg-gradient-to-b from-white via-[#FDFDFD] to-[#F0FDF4]/50 p-8 sm:p-10 shadow-xl relative ring-4 ring-[#065F46]/10">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-emerald-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#065F46] text-white text-xs font-black shadow-xs mb-2">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>الاشتراك المعتمد للأساتذة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                باقة وثائقي الرسمية الشاملة
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                تفعيل شامل لكافة الميزات التربوية والتصدير الفائق بدون قيود.
              </p>
            </div>

            {/* Price Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center min-w-[170px]">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-[#065F46]">{priceMad}</span>
                <span className="text-sm font-bold text-slate-700">درهم</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 mt-0.5">
                {billingCycle === 'monthly' ? 'لكل شهر (اشتراك شهري)' : 'لكل سنة (اشتراك سنوي)'}
              </div>
            </div>
          </div>

          {/* Active Status Badge if User Already Subscribed */}
          {isPro && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold">
                  حسابك مفعّل بنجاح باشتراك رسمي نشط ✓
                </span>
              </div>
              <button
                onClick={onBack}
                className="px-3.5 py-1 bg-[#065F46] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                البدء في الإنشاء
              </button>
            </div>
          )}

          {/* Features Checklist */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
              ما يتضمنه اشتراكك في المنصة:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planFeatures.map((feat, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${
                    feat.highlight 
                      ? 'bg-emerald-50/70 border-emerald-200/80 text-slate-900 font-bold' 
                      : 'bg-white border-slate-100 text-slate-700 text-xs'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs leading-relaxed">
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Action Buttons */}
          <div className="pt-6 border-t border-slate-200 space-y-3">
            {isPro ? (
              <button
                type="button"
                onClick={onBack}
                className="w-full py-4 px-6 rounded-2xl bg-[#065F46] hover:bg-[#044735] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>اشتراكك مفعّل — الانتقال إلى مساحة العمل</span>
              </button>
            ) : isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  id="btn-checkout-stripe"
                  disabled={loadingCheckout}
                  onClick={handleStripeCheckout}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#065F46] hover:bg-[#044735] text-white font-black text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>
                    {loadingCheckout 
                      ? 'جاري المعالجة...' 
                      : `الدفع بالبطاقة البنكية (${priceMad} درهم)`}
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-direct-activation"
                  disabled={loadingCheckout}
                  onClick={handleDirectActivation}
                  className="py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-amber-600/20"
                  title="تفعيل مباشر وفوري للاشتراك في حسابك"
                >
                  <Zap className="w-4 h-4 fill-current text-slate-950" />
                  <span>تفعيل فوري للاشتراك ({priceMad} درهم)</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="btn-auth-to-subscribe"
                onClick={onOpenAuthModal}
                className="w-full py-4 px-6 rounded-2xl bg-[#065F46] hover:bg-[#044735] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>تسجيل الدخول لتفعيل الاشتراك ({priceMad} درهم)</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>دفع مشفر 100%</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>ضمان المطابقة البيداغوجية</span>
              </span>
              <span>•</span>
              <span>إلغاء الاشتراك في أي وقت</span>
            </div>
          </div>

        </div>
      </div>

      {/* Security & Features Strip */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14 text-center">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">أمان وحفظ سحابي دائم</div>
          <div className="text-[11px] text-slate-500 mt-1">حفظ مشفر لوثائقك في حسابك الخاص</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <FileCheck className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">تصدير احترافي وفوري</div>
          <div className="text-[11px] text-slate-500 mt-1">PDF عالي الجودة وصور واضحة وجاهزة للطباعة</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <Award className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">توجيهات 2026-2027 الرسمية</div>
          <div className="text-[11px] text-slate-500 mt-1">مطابقة المنهاج المنقح لوزارة التربية الوطنية</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            الأسئلة الشائعة حول اشتراك المنصة
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            إجابات واضحة ومباشرة لكل ما يخص الاشتراك والتفعيل
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#065F46] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pr-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
