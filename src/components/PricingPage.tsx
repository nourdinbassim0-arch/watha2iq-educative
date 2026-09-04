import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
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
import { PayPalSubscriptionButton } from './PayPalSubscriptionButton';

interface PricingPageProps {
  onBack: () => void;
  onOpenAuthModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBack,
  onOpenAuthModal,
}) => {
  const { user, isPro, isAuthenticated, subscription, verifyAndSyncPayPalSubscription } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const priceMad = 49;
  const paypalPlanId = 'P-9FX06719KN7892341NKNCWKY';

  const handlePayPalVerifiedSuccess = async (subscriptionId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const result = await verifyAndSyncPayPalSubscription(subscriptionId);
    if (result.success) {
      setSuccessMessage(result.message || 'تم تفعيل اشتراكك بنجاح! يمكنك الآن إنشاء وتصدير كافة الوثائق والجذاذات الرسمية.');
    } else {
      setErrorMessage(result.message || 'تعذر تأكيد اشتراك PayPal من الخادم. يرجى مراجعة الدعم.');
      throw new Error(result.message || 'فشل التحقق من الاشتراك لدى الخادم.');
    }
  };

  const planFeatures = [
    { title: 'إنشاء وتوليد غير محدود لكافة الجذاذات التربوية لجميع الأسلاك والمستويات', highlight: true },
    { title: 'مطابقة رسمية 100% لتوجيهات وزارة التربية الوطنية والتعليم الأولي والرياضة 2026-2027', highlight: true },
    { title: 'سجل تفريغ النوقط وشبكات المراقبة المستمرة لمكونات التعليم الابتدائي والإعدادي والتأهيلي', highlight: true },
    { title: 'ترويسة رسمية معتمدة تتضمن شعار المملكة المغربية الشريفة والمديرية والأكاديمية', highlight: false },
    { title: 'تصدير رقمي فائق الدقة بصيغة PDF قابلة للطباعة وتنسيقات الجداول والصور', highlight: false },
    { title: 'مساعد بيداغوجي ذكي لتحضير أنشطة التعليم والتعلم والتقويم والدعم', highlight: false },
    { title: 'إضافة توقيع الأستاذ(ة) واسم المؤسسة التعليمية على كل وثيقة رسمية', highlight: false },
    { title: 'حفظ سحابي دائم ومشفر لوثائقك في قاعدة بياناتك الخاصة مع إمكانية التعديل بأي وقت', highlight: false },
    { title: 'طباعة فورية متوافقة قياسياً مع مقاسات A4 وA3 مع هوامش معيارية محددة', highlight: false },
    { title: 'دعم فني مخصص للأساتذة وتحديثات دورية مستمرة مع كل مذكرة وزارية جديدة', highlight: false },
  ];

  const faqs = [
    {
      q: 'كم تبلغ قيمة الاشتراك في منصة وثائقي التربوية؟',
      a: 'قيمة الاشتراك السنوي الموحد هي 49 درهماً مغربياً فقط في السنة (49 درهم سنويًا). يمنحك هذا الاشتراك وصولاً غير محدود لكافة خدمات التخطيط، إعداد الجذاذات، وتفريغ النقط طيلة السنة الدراسية.',
    },
    {
      q: 'كيف تتم عملية الدفع والتفعيل عبر PayPal؟',
      a: 'تتم عملية الدفع بأمان وسرعة من خلال بوابة PayPal الرسمية العالمية المعتمدة بواسطة زر الاشتراك أدناه. بمجرد تأكيد العملية، يتحقق خادمنا تلقائياً من صحة الاشتراك ويقوم بتفعيل حسابك فوراً.',
    },
    {
      q: 'هل أحتاج إلى بطاقة بنكية دولية أم مغربية؟',
      a: 'يمكنك استخدام أي بطاقة بنكية مغربية مفعّلة للشراء عبر الإنترنت أو بطاقة دولية (Visa / Mastercard) عبر حساب PayPal الخاص بك بأمان تام.',
    },
    {
      q: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
      a: 'نعم بالتأكيد، يمكنك إدارة أو إيقاف تجديد اشتراكك في أي لحظة من خلال لوحة تحكم حسابك في PayPal دون أي تعقيدات أو مصاريف إضافية.',
    },
    {
      q: 'هل الوثائق والجذاذات مطابقة لتوجيهات المفتشين التربويين؟',
      a: 'نعم تماماً، صُممت كافة الوثائق وشبكات النقط والجذاذات لتطابق المعايير الرسمية الصادرة عن وزارة التربية الوطنية والتعليم الأولي والرياضة.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
      {/* Top Navigation */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى مساحة العمل</span>
        </button>

        <div className="flex justify-center mb-3">
          <MoroccanOfficialEmblem size="sm" showMotto={false} language="ar" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>الاشتراك الرسمي لأساتذة المملكة المغربية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          اشتراك منصة وثائقي التربوية
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
          اشتراك سنوي شامل يمنحك وصولاً غير محدود لإعداد وتفريغ وطباعة الجذاذات وسجلات النقط الرسمية.
        </p>

        {/* Real Plan Price Banner */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl mt-5 shadow-sm border border-slate-800">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold">باقة الاشتراك الموحدة:</span>
          <span className="text-base font-black text-amber-300">49 درهم سنويًا</span>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-sm mb-0.5">تهانينا! تم تفعيل الاشتراك بنجاح</div>
            <div>{successMessage}</div>
            <button
              onClick={onBack}
              className="mt-3 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              الانتقال لإعداد وثائقك التربوية
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold mb-0.5">تنبيه أثناء التفعيل:</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Main Single Subscription Card */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="rounded-3xl border-2 border-[#0A4D68] bg-gradient-to-b from-white via-[#FBFDFE] to-[#EBF7FB]/40 p-8 sm:p-10 shadow-xl relative ring-4 ring-[#05BFDB]/10">
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A4D68] text-white text-xs font-black shadow-xs mb-2">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>الاشتراك السنوي الرسمي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                باقة وثائقي التربوية الشاملة
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                تفعيل رسمي وشامل للجذاذات، سجلات تفريغ النقط، وشبكات المراقبة المستمرة.
              </p>
            </div>

            {/* Price Display */}
            <div className="bg-white border-2 border-[#05BFDB]/30 rounded-2xl p-4 text-center min-w-[190px] shadow-sm">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-[#0A4D68]">{priceMad}</span>
                <span className="text-sm font-bold text-slate-700">درهم</span>
              </div>
              <div className="text-xs font-black text-[#05BFDB] mt-0.5">
                سنويًا (لكامل السنة الدراسية)
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Plan ID: {paypalPlanId}
              </div>
            </div>
          </div>

          {/* Active Status Badge if User is Already Subscribed */}
          {isPro && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">
                    حسابك مفعّل بنجاح باشتراك سنوي رسمي نشط (49 درهم سنويًا) ✓
                  </span>
                  {subscription?.subscriptionId && (
                    <span className="text-[11px] text-emerald-800 font-mono">
                      معرف الاشتراك: {subscription.subscriptionId} ({subscription.status})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-[#0A4D68] text-white text-xs font-bold rounded-xl hover:bg-[#083c52] transition-colors cursor-pointer"
              >
                متابعة العمل في المنصة
              </button>
            </div>
          )}

          {/* Features Checklist */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
              ما يتضمنه اشتراكك السنوي:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planFeatures.map((feat, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${
                    feat.highlight 
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-900 font-bold' 
                      : 'bg-white border-slate-100 text-slate-700 text-xs'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#0A4D68] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs leading-relaxed">
                    {feat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real PayPal Subscription Section */}
          <div className="pt-6 border-t border-slate-200">
            {isPro ? (
              <div className="text-center py-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full py-4 px-6 rounded-2xl bg-[#0A4D68] hover:bg-[#083c52] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>اشتراكك مفعّل بنجاح — الانتقال إلى مساحة العمل</span>
                </button>
              </div>
            ) : isAuthenticated ? (
              <div>
                <div className="mb-4 text-center">
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    الدفع الآمن عبر بوابة PayPal المعتمدة (49 درهم سنويًا):
                  </div>
                  <div className="text-[11px] text-slate-500">
                    انقر على الزر الأصفر أدناه لإتمام الاشتراك وتفعيل حسابك تلقائياً
                  </div>
                </div>

                {/* The Real PayPal Button Component */}
                <div className="max-w-md mx-auto">
                  <PayPalSubscriptionButton
                    userEmail={user?.email || undefined}
                    userId={user?.uid || undefined}
                    onVerifiedSuccess={handlePayPalVerifiedSuccess}
                    onVerificationError={(err) => setErrorMessage(err)}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  type="button"
                  id="btn-auth-to-subscribe"
                  onClick={onOpenAuthModal}
                  className="w-full py-4 px-6 rounded-2xl bg-[#0A4D68] hover:bg-[#083c52] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>تسجيل الدخول للاشتراك عبر PayPal (49 درهم سنويًا)</span>
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  يرجى تسجيل الدخول أو إنشاء حساب لربط اشتراكك في PayPal بحسابك بشكل دائم
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 pt-5">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#05BFDB]" />
                <span>دفع مشفر وآمن عبر PayPal</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#0A4D68]" />
                <span>اشتراك سنوي 49 درهم سنويًا</span>
              </span>
              <span>•</span>
              <span>إمكانية إدارة أو إلغاء الاشتراك في أي وقت</span>
            </div>
          </div>

        </div>
      </div>

      {/* Security & Features Strip */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14 text-center">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-[#0A4D68] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">أمان وحفظ سحابي دائم</div>
          <div className="text-[11px] text-slate-500 mt-1">حفظ مشفر لوثائقك في حسابك الخاص</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <FileCheck className="w-6 h-6 text-[#0A4D68] mx-auto mb-2" />
          <div className="text-xs font-bold text-slate-900">تصدير احترافي وفوري</div>
          <div className="text-[11px] text-slate-500 mt-1">PDF عالي الجودة وسجلات نقط جاهزة للطباعة</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <Award className="w-6 h-6 text-[#0A4D68] mx-auto mb-2" />
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
            إجابات واضحة ومباشرة لكل ما يخص الاشتراك السنوي وبوابة الدفع
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#0A4D68] shrink-0" />
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
