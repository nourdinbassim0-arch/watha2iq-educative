import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle } from 'lucide-react';
import { MoroccanOfficialEmblem } from './MoroccanOfficialEmblem';

interface PrivacyTermsPageProps {
  language?: 'ar' | 'fr' | 'en';
}

export const PrivacyTermsPage: React.FC<PrivacyTermsPageProps> = ({ language = 'ar' }) => {
  const isRtl = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs text-center space-y-3">
        <MoroccanOfficialEmblem size="sm" showMotto={true} language="ar" className="mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900 font-serif">
          {isRtl ? 'سياسة الخصوصية وشروط الاستخدام التربوي' : 'Politique de Confidentialité & Conditions'}
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          {isRtl
            ? 'منصة «وثائقي التربوية» مصممة خصيصاً لخدمة الأساتذة المغاربة وفق المعايير الأخلاقية والمهنية لحماية المعطيات ذات الطابع الشخصي.'
            : 'Conforme aux standards de protection des données et d\'éthique pédagogique au Maroc.'}
        </p>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-sm font-bold text-[#065F46]">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2>1. حماية المعطيات والخصوصية المدرسية (Loi 09-08)</h2>
          </div>
          <p className="text-slate-700">
            تلتزم منصة <strong>«وثائقي التربوية»</strong> بالاحترام الصارم لسرية المعطيات الشخصية للأساتذة والتلاميذ المسجلين في الجذاذات وسجلات النقط وفق القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.
          </p>
          <ul className="list-disc pr-5 space-y-1 text-slate-600">
            <li>تبقى بيانات التلاميذ والنقط محصورة في حساب الأستاذ ولا يتم مشاركتها أو معالجتها لأغراض تجارية.</li>
            <li>تُخزن الوثائق بشكل آمن مع إمكانية حذفها أو تصديرها من قبل الأستاذ في أي وقت.</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-sm font-bold text-[#065F46]">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h2>2. الملكية الفكرية والاستخدام البيداغوجي</h2>
          </div>
          <p className="text-slate-700">
            جميع النماذج والجذاذات والوثائق المتوفرة على المنصة مخصصة للاستخدام التربوي والمهني الداخلي للأساتذة وأطر الإدارة التربوية.
          </p>
          <ul className="list-disc pr-5 space-y-1 text-slate-600">
            <li>يحق للأستاذ تعديل وتكييف وطباعة وتوزيع الوثائق داخل فصله الدراسي والمؤسسة التعليمية التابع لها.</li>
            <li>يُمنع إعادة بيع أو استغلال البرمجية تجارياً بدون إذن كتابي من مالك المنصة.</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-sm font-bold text-[#065F46]">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h2>3. أمان الحسابات وصلاحيات الوصول</h2>
          </div>
          <p className="text-slate-700">
            يتحمل الأستاذ مسؤولية الحفاظ على سرية كلمة المرور الخاصة بحسابه، وتوفر المنصة آليات تحقق ومزامنة سحابية مشفرة لضمان استرجاع الوثائق في أي وقت.
          </p>
        </div>

      </div>

    </div>
  );
};
