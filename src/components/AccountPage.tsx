import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  School,
  FileSignature,
  Upload,
  CheckCircle2,
  Cloud,
  Shield,
  Save,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface AccountPageProps {
  onNavigateAdmin?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateAdmin }) => {
  const { currentUser, updateProfile, isOwner, isAdmin } = useAuth();
  
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [academy, setAcademy] = useState(currentUser?.academy || 'أكاديمية جهة الدار البيضاء - سطات');
  const [directorate, setDirectorate] = useState(currentUser?.directorate || 'المديرية الإقليمية سطات');
  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || 'الثانوية التأهيلية ابن خلدون');
  const [defaultSubject, setDefaultSubject] = useState(currentUser?.defaultSubject || 'الرياضيات');
  const [signatureUrl, setSignatureUrl] = useState(currentUser?.digitalSignatureUrl || '');
  const [schoolLogoUrl, setSchoolLogoUrl] = useState(currentUser?.schoolLogoUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sigInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      academy,
      directorate,
      schoolName,
      defaultSubject,
      digitalSignatureUrl: signatureUrl,
      schoolLogoUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setSignatureUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setSchoolLogoUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" dir="rtl">
      
      {/* Account Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
            {fullName.charAt(0) || 'أ'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{fullName || 'الأستاذ(ة)'}</h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isOwner
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : isAdmin
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isOwner ? 'مالك المنصة (Owner)' : isAdmin ? 'مدير معتمد' : 'أستاذ(ة) ممارس'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">{currentUser?.email}</p>
          </div>
        </div>

        {isAdmin && onNavigateAdmin && (
          <button
            onClick={onNavigateAdmin}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>فتح لوحة الإدارة السرية</span>
          </button>
        )}
      </div>

      {/* Cloud Sync Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-3">
          <Cloud className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>المزامنة السحابية نشطة ومؤمنة: يتم حفظ جميع جذاذاتك ووثائقك التربوية في حسابك الخاص.</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
          متصل
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {savedSuccess && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>تم حفظ معلومات وتفضيلات الحساب بنجاح، وستطبق تلقائياً على كل وثيقة جديدة!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Personal Profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>المعلومات الشخصية والمهنية</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم والنسب الكامل</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني (للتسجيل)</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف (اختياري للتنبيهات)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06XXXXXXXX"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المادة والتخصص الافتراضي</label>
              <input
                type="text"
                value={defaultSubject}
                onChange={(e) => setDefaultSubject(e.target.value)}
                placeholder="مثال: الرياضيات / علوم الحياة والأرض"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
              />
            </div>
          </div>

          {/* Box 2: Institutional & Administrative Placement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span>التعيين الإداري الرسمي الافتراضي</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">الأكاديمية الجهوية للتربية والتكوين</label>
              <input
                type="text"
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المديرية الإقليمية</label>
              <input
                type="text"
                value={directorate}
                onChange={(e) => setDirectorate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المؤسسة التعليمية</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden font-bold text-[#065F46]"
              />
            </div>
          </div>

        </div>

        {/* Box 3: Signature & School Logo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <FileSignature className="w-4 h-4 text-emerald-700" />
            <span>التوقيع الرقمي وشعار المؤسسة الافتراضي</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Signature Upload */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">توقيع الأستاذ(ة) (PNG بخلفية شفافة)</span>
              {signatureUrl ? (
                <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                  <img src={signatureUrl} alt="Signature" className="h-12 object-contain" />
                  <button
                    type="button"
                    onClick={() => setSignatureUrl('')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => sigInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-medium">انقر لرفع صورة التوقيع</span>
                </button>
              )}
              <input type="file" ref={sigInputRef} onChange={handleSignatureUpload} accept="image/*" className="hidden" />
            </div>

            {/* School Logo Upload */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">شعار المؤسسة التعليمية (PNG / JPG)</span>
              {schoolLogoUrl ? (
                <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                  <img src={schoolLogoUrl} alt="School Logo" className="h-12 object-contain" />
                  <button
                    type="button"
                    onClick={() => setSchoolLogoUrl('')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-medium">انقر لرفع شعار المؤسسة</span>
                </button>
              )}
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع التعديلات</span>
          </button>
        </div>

      </form>

    </div>
  );
};
