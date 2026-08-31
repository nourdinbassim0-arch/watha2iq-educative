import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface AccountPageProps {
  onBack: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onBack }) => {
  const {
    user,
    profile,
    logout,
    resendVerificationEmail,
    updateUserPassword,
    updateUserProfile,
    refreshUser,
  } = useAuth();

  const [fullName, setFullName] = useState(profile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [verifyMsg, setVerifyMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setLoadingProfile(true);

    const res = await updateUserProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    setLoadingProfile(false);
    if (res.success) {
      setProfileMsg({ type: 'success', text: res.message || 'تم تحديث البيانات بنجاح.' });
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'فشل تحديث البيانات.' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'يجب ألا تقل كلمة المرور عن 6 أحرف.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' });
      return;
    }

    setLoadingPass(true);
    const res = await updateUserPassword(newPassword);
    setLoadingPass(false);

    if (res.success) {
      setPassMsg({ type: 'success', text: res.message || 'تم تغيير كلمة المرور بنجاح.' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassMsg({ type: 'error', text: res.message || 'تعذر تغيير كلمة المرور.' });
    }
  };

  const handleResendVerification = async () => {
    setVerifyMsg(null);
    setLoadingVerify(true);
    const res = await resendVerificationEmail();
    setLoadingVerify(false);

    if (res.success) {
      setVerifyMsg({ type: 'success', text: res.message || 'تم إرسال رابط التحقق.' });
    } else {
      setVerifyMsg({ type: 'error', text: res.message || 'تعذر إرسال الرابط.' });
    }
  };

  const handleCheckStatus = async () => {
    setLoadingVerify(true);
    await refreshUser();
    setLoadingVerify(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      {/* Top Breadcrumb / Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <UserIcon className="w-7 h-7 text-emerald-600" />
            إدارة الحساب الشخصي
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة بيانات الأستاذ، الأمان والتحقق من الحساب
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 font-bold text-2xl shadow-inner mb-4">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {profile?.name || user?.displayName || 'أستاذ'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>الدور:</span>
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[11px]">
                  {profile?.role === 'OWNER' ? 'مدير المنصة (Owner)' : 'أستاذ (Teacher)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>حالة البريد:</span>
                {user?.emailVerified ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    مفعل ومؤكد
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    غير مؤكد
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="mt-6 w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>

          {/* Verification Status Card */}
          {!user?.emailVerified && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300">
                    تأكيد البريد الإلكتروني
                  </h3>
                  <p className="text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                    يرجى الضغط على رابط التحقق المرسل لبريدك لضمان أمان حسابك بالكامل.
                  </p>

                  {verifyMsg && (
                    <p className={`mt-2 font-medium ${verifyMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {verifyMsg.text}
                    </p>
                  )}

                  <div className="mt-3 flex flex-col gap-1.5">
                    <button
                      onClick={handleResendVerification}
                      disabled={loadingVerify}
                      className="w-full py-2 px-3 rounded-lg bg-amber-600 text-white font-semibold text-[11px] hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                      {loadingVerify ? 'جارٍ الإرسال...' : 'إعادة إرسال رابط التحقق'}
                    </button>
                    <button
                      onClick={handleCheckStatus}
                      className="w-full py-1.5 px-3 rounded-lg text-amber-800 dark:text-amber-300 font-semibold text-[11px] hover:bg-amber-100/50 flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      تحديث الحالة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Edit Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Details Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-600" />
              البيانات الشخصية
            </h3>

            {profileMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (غير قابل للتغيير المباشر)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف (اختياري)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06XXXXXXXX"
                    className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {loadingProfile ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              تغيير كلمة المرور
            </h3>

            {passMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {passMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="6 أحرف على الأقل"
                    className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loadingPass}
                  className="py-2.5 px-6 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {loadingPass ? 'جارٍ التغيير...' : 'تحديث كلمة المرور'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
