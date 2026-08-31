import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, X, AlertCircle, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, resetPassword, resendVerificationEmail, isFirebaseReady } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify_notice'>(initialMode);
  
  // Registration fields: Strictly start empty with zero defaults
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      handleClose();
    } else {
      setErrorMessage(res.message || 'فشل تسجيل الدخول.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    const res = await register(fullName, email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى بريدك الإلكتروني.');
      setMode('verify_notice');
    } else {
      setErrorMessage(res.message || 'حدث خطأ أثناء التسجيل.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('يرجى كتابة البريد الإلكتروني المسجل.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.');
    } else {
      setErrorMessage(res.message || 'تعذر إرسال رابط إعادة التعيين.');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const res = await resendVerificationEmail();
    setLoading(false);
    if (res.success) {
      setSuccessMessage(res.message || 'تمت إعادة الإرسال بنجاح.');
    } else {
      setErrorMessage(res.message || 'تعذر إعادة الإرسال.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        dir="rtl"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          
          <h2 className="text-xl font-bold">منصة وثائقي التربوية</h2>
          <p className="text-xs text-emerald-100 mt-1">
            {mode === 'login' && 'تسجيل الدخول إلى حسابك'}
            {mode === 'register' && 'إنشاء حساب أستاذ جديد'}
            {mode === 'forgot' && 'استعادة كلمة المرور'}
            {mode === 'verify_notice' && 'تأكيد الحساب'}
          </p>
        </div>

        <div className="p-6">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode: Login */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setMode('forgot');
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>

              <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">ليس لديك حساب بعد؟ </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setMode('register');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </form>
          )}

          {/* Mode: Register */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
              </button>

              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">لديك حساب بالفعل؟ </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setMode('login');
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* Mode: Forgot Password */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                أدخل بريدك الإلكتروني المسجل، وسنرسل لك رابطاً رسمياً وآمناً من Firebase لتعيين كلمة مرور جديدة.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-emerald-600/20 disabled:opacity-50"
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال رابط التعيين'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setMode('login');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* Mode: Verification Notice */}
          {mode === 'verify_notice' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                يرجى تأكيد بريدك الإلكتروني
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                تم إرسال رسالة تحتوي على رابط التحقق إلى <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. يرجى فتح بريدك والضغط على الرابط لتأكيد الحساب.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  {loading ? 'جارٍ الإرسال...' : 'إعادة إرسال رسالة التحقق'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  التوجه لتسجيل الدخول
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
