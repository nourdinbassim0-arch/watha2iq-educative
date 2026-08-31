import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  language?: 'ar' | 'fr' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  language = 'ar',
}) => {
  const {
    login,
    loginWithGoogle,
    sendEmailVerificationOtp,
    verifyOtpAndRegister,
    requestPasswordResetOtp,
    resetPasswordWithOtp,
    usersList,
  } = useAuth();

  const [mode, setMode] = useState<
    'login' | 'register' | 'verify_otp_register' | 'forgot' | 'verify_otp_reset'
  >(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated Email Notification
  const [generatedOtpDisplay, setGeneratedOtpDisplay] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMessage(null);
    setOtpCode('');
    setGeneratedOtpDisplay(null);
  }, [initialMode, isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const isRtl = language === 'ar';

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccessMessage('تم تسجيل الدخول بنجاح!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Registration: Validate & Send OTP to Email
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!fullName.trim()) {
      setError('يرجى إدخال الاسم والنسب الكامل للأستاذ(ة).');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    if (!password || password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 خانات أو أحرف على الأقل.');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة الكتابة.');
      return;
    }

    // Check if email already exists
    const exists = usersList.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      setError('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendEmailVerificationOtp(cleanEmail, 'register');
      setGeneratedOtpDisplay(res.code);
      setResendCooldown(45);
      setMode('verify_otp_register');
      setSuccessMessage(`تم إرسال رمز التحقق إلى ${cleanEmail}`);
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال رمز التحقق.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Registration: Verify OTP Code and Create Verified User
  const handleVerifyOtpRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtpAndRegister({
        fullName,
        email,
        password,
        code: otpCode.trim(),
      });
      setSuccessMessage('✓ تم التحقق من بريدك الإلكتروني وإنشاء حسابك بنجاح! مرحباً بك في وثائقي التربوية.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'رمز التحقق غير صحيح.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsLoading(true);
    try {
      const targetType = mode === 'verify_otp_reset' ? 'reset' : 'register';
      const res = await sendEmailVerificationOtp(email.trim().toLowerCase(), targetType);
      setGeneratedOtpDisplay(res.code);
      setResendCooldown(45);
      setSuccessMessage('تمت إعادة إرسال رمز تحقق جديد بنجاح.');
    } catch (err: any) {
      setError(err.message || 'تعذر إعادة إرسال الرمز.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Password Reset: Request OTP
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريدك الإلكتروني.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetOtp(cleanEmail);
      setGeneratedOtpDisplay(res.code);
      setResendCooldown(45);
      setMode('verify_otp_reset');
      setSuccessMessage(`تم إرسال رمز استعادة كلمة المرور إلى ${cleanEmail}`);
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال رمز الاستعادة.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Password Reset: Submit OTP and New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithOtp(email, otpCode, newPassword);
      setSuccessMessage('✓ تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => {
        setPassword('');
        setConfirmPassword('');
        setMode('login');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'فشل تحديث كلمة المرور.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMessage('تم تسجيل الدخول عبر حساب Google بنجاح!');
      setTimeout(onClose, 600);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول عبر Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 pt-1">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-[#065F46] rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
            {mode.includes('verify') ? (
              <KeyRound className="w-6 h-6 text-[#065F46]" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-[#065F46]" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            {mode === 'login' && (isRtl ? 'تسجيل الدخول إلى وثائقي التربوية' : 'Connexion à Wathaiqi')}
            {mode === 'register' && (isRtl ? 'إنشاء حساب أستاذ(ة) جديد' : 'Créer un compte Enseignant')}
            {mode === 'verify_otp_register' && (isRtl ? 'التحقق من البريد الإلكتروني' : 'Vérification de l\'Email')}
            {mode === 'forgot' && (isRtl ? 'استعادة كلمة المرور' : 'Mot de passe oublié')}
            {mode === 'verify_otp_reset' && (isRtl ? 'إعادة تعيين كلمة المرور' : 'Réinitialiser le mot de passe')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'verify_otp_register'
              ? 'يرجى إدخال رمز التحقق المرسل لتفعيل حسابك'
              : isRtl
              ? 'فضاء تربوي آمن لحفظ وتصدير وثائقك وجذاذاتك'
              : 'Espace sécurisé pour vos documents pédagogiques'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-fadeIn font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-start gap-2 animate-fadeIn font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 1: LOGIN FORM */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <div className="space-y-4">
            {/* Quick Google Login */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isRtl ? 'المتابعة بحساب Google' : 'Continuer avec Google'}</span>
              </button>

              <div className="relative my-3.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">أو بالبريد الإلكتروني وكلمة المرور</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'البريد الإلكتروني' : 'Adresse Email'}
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@men.gov.ma"
                    className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {isRtl ? 'كلمة المرور' : 'Mot de passe'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMessage(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] text-[#065F46] hover:underline font-medium cursor-pointer"
                  >
                    {isRtl ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 cursor-pointer`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>دخول فضاء الأستاذ</span>
                    <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: REGISTER FORM (STEP 1) */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الاسم والنسب الكامل للأستاذ(ة)
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: الأستاذ(ة) نور الدين بسيم"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني (سيتم إرسال رمز التحقق إليه)
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@men.gov.ma"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                كلمة المرور (6 خانات على الأقل)
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 cursor-pointer`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 cursor-pointer`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>إرسال رمز التحقق إلى البريد</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: EMAIL VERIFICATION OTP (STEP 2 OF REGISTER) */}
        {/* ========================================================================= */}
        {mode === 'verify_otp_register' && (
          <div className="space-y-4">
            
            {/* Live Email Inbox Simulation Banner */}
            <div className="p-4 bg-emerald-50/90 border-2 border-dashed border-emerald-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>رسالة تحقق جديدة في البريد الوارد:</span>
                </span>
                <span className="text-[10px] bg-emerald-200/70 px-2 py-0.5 rounded-full text-emerald-950 font-mono font-bold">
                  منصة وثائقي
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                <div className="text-slate-500 text-[11px]">
                  إلى: <span className="font-mono text-slate-800 font-semibold">{email}</span>
                </div>
                <div className="font-semibold text-slate-800">
                  رمز التحقق الخاص بك لتفعيل الحساب هو:
                </div>
                <div className="text-center py-2">
                  <span className="font-mono text-2xl font-black tracking-widest text-[#065F46] bg-emerald-100/80 px-4 py-1 rounded-xl border border-emerald-300 inline-block shadow-inner">
                    {generatedOtpDisplay || '......'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 text-center">
                  صالح لمدة 10 دقائق. استخدم هذا الرمز لإتمام التفعيل.
                </div>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtpRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-center">
                  أدخل رمز التحقق المكون من 6 أرقام
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="XXXXXX"
                  className="w-full py-3 text-center text-xl font-mono tracking-widest bg-slate-50 border-2 border-slate-300 focus:border-[#065F46] focus:bg-white rounded-2xl outline-hidden font-bold"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className={`font-semibold cursor-pointer ${
                    resendCooldown > 0
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-[#065F46] hover:underline flex items-center gap-1'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {resendCooldown > 0
                      ? `إعادة إرسال الرمز خلال (${resendCooldown} ثانية)`
                      : 'إعادة إرسال رمز جديد'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
                >
                  تعديل البريد / البيانات
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تأكيد وتفعيل الحساب الآن</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: FORGOT PASSWORD (STEP 1) */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              أدخل بريدك الإلكتروني المسجل في المنصة وسنرسل لك رمز تحقق آمن لإعادة تعيين كلمة المرور فوراً.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@men.gov.ma"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>إرسال رمز إعادة التعيين</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#065F46] font-bold hover:underline cursor-pointer"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 5: VERIFY OTP & RESET PASSWORD (STEP 2) */}
        {/* ========================================================================= */}
        {mode === 'verify_otp_reset' && (
          <div className="space-y-4">
            {/* Live Notification */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-700" />
                <span>رمز استعادة كلمة المرور لـ ({email}):</span>
              </div>
              <div className="text-center py-1 font-mono text-xl font-black text-amber-950">
                {generatedOtpDisplay || '......'}
              </div>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رمز التحقق (6 أرقام)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="XXXXXX"
                  className="w-full py-2 text-center font-mono text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 cursor-pointer`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full ${isRtl ? 'pr-9 pl-9' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 cursor-pointer`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>حفظ كلمة المرور الجديدة</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer Navigation Toggle */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
          {mode === 'login' && (
            <span>
              {isRtl ? 'ليس لديك حساب بعد؟ ' : 'Pas de compte ? '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('register');
                }}
                className="text-[#065F46] font-bold hover:underline cursor-pointer"
              >
                {isRtl ? 'إنشاء حساب جديد وتفعيله' : 'Créer un compte'}
              </button>
            </span>
          )}

          {(mode === 'register' || mode === 'verify_otp_register' || mode === 'forgot' || mode === 'verify_otp_reset') && (
            <span>
              {isRtl ? 'لديك حساب بالفعل؟ ' : 'Vous avez un compte ? '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                }}
                className="text-[#065F46] font-bold hover:underline cursor-pointer"
              >
                {isRtl ? 'تسجيل الدخول' : 'Se connecter'}
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
