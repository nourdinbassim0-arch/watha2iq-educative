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
  Flame,
  Award,
  AlertCircle,
} from 'lucide-react';

interface PricingPageProps {
  onBack: () => void;
  onOpenAuthModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBack,
  onOpenAuthModal,
}) => {
  const { user, profile, plan, isPro, isAuthenticated, platformSettings } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const monthlyPriceMad = platformSettings.proPriceMad || 49;
  const annualPriceMad = Math.round(monthlyPriceMad * 10); // 2 months free

  const handleUpgradeClick = async () => {
    setCheckoutError(null);
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
          returnUrl: window.location.origin,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        setCheckoutError(data.message);
      } else {
        setCheckoutError('تعذر بدء عملية الدفع حالياً. يرجى المحاولة لاحقاً.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError('حدث خطأ في الاتصال بخدمة الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const freeFeatures = [
    { title: 'إنشاء 3 وثائق تربوية يومياً', included: true },
    { title: 'النماذج الأساسية للجذاذات ومواثيق الأقسام', included: true },
    { title: 'تصدير مستندات PDF الرسمية عالية الجودة', included: true },
    { title: 'تصدير الصور الرقمية (PNG / JPG)', included: true },
    { title: 'الطباعة المباشرة المتوافقة مع A4 وA3', included: true },
    { title: 'استخدام غير محدود للوثائق', included: false },
    { title: 'المساعد البيداغوجي الذكي بالذكاء الاصطناعي', included: false },
    { title: 'إضافة التوقيع الرقمي وشعار المؤسسة المخصص', included: false },
    { title: 'أولوية المعالجة والدعم الفني المباشر', included: false },
  ];

  const proFeatures = [
    { title: 'إنشاء غير محدود للوثائق والجذاذات يومياً', included: true },
    { title: 'جميع النماذج الرسمية لجميع الأسلاك التعليمية', included: true },
    { title: 'تصدير فائق الدقة (High DPI) لمستندات PDF والصور', included: true },
    { title: 'مساعد بيداغوجي ذكي متوافق مع المنهاج المغربي', included: true },
    { title: 'إضافة شعار المؤسسة وتوقيع الأستاذ(ة) الرقمي', included: true },
    { title: 'شبكات التنقيط والتفريغ وسجلات النقط المتقدمة', included: true },
    { title: 'حفظ سحابي دائم وغير محدود في حسابك', included: true },
    { title: 'الوصول المبكر لكافة التحديثات والمذكرات الوزارية', included: true },
    { title: 'دعم فني سريع ومخصص للأستاذ', included: true },
  ];

  const faqs = [
    {
      q: 'هل يمكنني استخدام المنصة مجاناً؟',
      a: 'نعم بكل تأكيد! تتيح الخطة المجانية لجميع الأساتذة إنشاء حتى 3 وثائق رسمية يومياً وتحميلها بصيغة PDF وصور عالية الدقة دون أي قيود على الجودة.',
    },
    {
      q: 'ما هي وسائل الدفع المقبولة في المغرب؟',
      a: 'ندعم الدفع الآمن عبر البطاقات البنكية المغربية (CMI / Visa / Mastercard) وجميع بطاقات الدفع الإلكتروني الدولية مع تشفير بنكي كامل.',
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
      a: 'نعم، يمكنك إلغاء اشتراكك بنقرة واحدة من صفحة حسابك في أي وقت دون أي التزام أو رسوم إضافية، وسيظل حسابك نشطاً حتى نهاية الفترة المدفوعة.',
    },
    {
      q: 'هل الوثائق مطابقة للتوجيهات الرسمية لوزارة التربية الوطنية؟',
      a: 'نعم 100%، تم إعداد وهندسة كافة النماذج والجذاذات وفق آخر المذكرات والتوجيهات التربوية الرسمية للمنهاج المغربي المنقح لكافة الأسلاك والمستويات.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      {/* Top Breadcrumb & Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>خطط وأسعار شفافة ومصممة للأساتذة</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          اختر الخطة المناسبة لاحتياجاتك التربوية
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          استفد من أدوات احترافية لإعداد الجذاذات والفروض والمواثيق المدرسية بجودة متقنة ووفق المنهاج المغربي.
        </p>

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl mt-6">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اشتراك شهري
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-[#065F46] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>اشتراك سنوي</span>
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-md">
              وفر شهرين
            </span>
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {checkoutError && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">تنبيه بخصوص بوابة الدفع:</div>
            <div>{checkoutError}</div>
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
        
        {/* FREE PLAN */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xs flex flex-col justify-between relative hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                الخطة الأساسية
              </span>
              {plan === 'FREE' && isAuthenticated && !isPro && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  خطتك الحالية
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              حساب الأستاذ المجاني
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              مثالي للاستخدام اليومي الخفيف لإعداد وتصدير الوثائق الأساسية.
            </p>

            <div className="mb-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-slate-900">0</span>
              <span className="text-sm font-bold text-slate-600">درهم / دائماً</span>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
              {freeFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  {feat.included ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold">-</span>
                    </div>
                  )}
                  <span className={feat.included ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            المتابعة بالخطة المجانية
          </button>
        </div>

        {/* PRO PLAN (RECOMMENDED) */}
        <div className="rounded-3xl border-2 border-[#065F46] bg-gradient-to-b from-white to-[#ECFDF5]/30 p-7 sm:p-9 shadow-xl flex flex-col justify-between relative ring-4 ring-[#065F46]/10">
          <div className="absolute -top-3.5 right-8 bg-[#065F46] text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#044735]">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>الأكثر طلباً للأساتذة</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065F46] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                الخطة الاحترافية الشاملة
              </span>
              {isPro && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  أنت مشترك بالفعل ✓
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              اشتراك الأستاذ الاحترافي (PRO)
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              وصول غير محدود لجميع الأدوات والمساعد الذكي والتخصيص المؤسساتي الكامل.
            </p>

            <div className="mb-6 flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-[#065F46]">
                {billingCycle === 'monthly' ? monthlyPriceMad : annualPriceMad}
              </span>
              <span className="text-sm font-bold text-slate-600">
                درهم / {billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}
              </span>
            </div>

            <div className="space-y-3 pt-6 border-t border-emerald-100 mb-8">
              {proFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-4 h-4 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-bold">
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            id="btn-upgrade-pro"
            disabled={loadingCheckout || isPro}
            onClick={handleUpgradeClick}
            className="w-full py-3.5 px-4 rounded-xl bg-[#065F46] hover:bg-[#044735] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-[#044735]"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>
              {isPro 
                ? 'أنت مشترك في باقة PRO' 
                : loadingCheckout 
                ? 'جاري التحويل لبوابة الدفع...' 
                : 'الترقية إلى الباقة الاحترافية الآن'}
            </span>
          </button>
        </div>

      </div>

      {/* Security & Guarantees Strip */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 text-center">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <ShieldCheck className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">دفع آمن ومحمي 100%</div>
          <div className="text-[11px] text-slate-500 mt-1">تشفير بنكي عالي المستوى</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <CreditCard className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">إلغاء الاشتراك بأي وقت</div>
          <div className="text-[11px] text-slate-500 mt-1">دون أي التزام أو تعقيدات</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <Award className="w-6 h-6 text-[#065F46] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">مطابقة تربوية رسمية</div>
          <div className="text-[11px] text-slate-500 mt-1">وفق التوجيهات الوزارية 2026-2027</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            الأسئلة الشائعة حول الباقات والاشتراك
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            إجابات واضحة عن كل ما يخص الدفع والخدمات
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
