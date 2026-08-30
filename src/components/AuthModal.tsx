import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

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
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isRtl = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMessage('تم تسجيل الدخول بنجاح!');
        setTimeout(onClose, 600);
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          setError('يرجى كتابة الاسم والنسب الكامل للأستاذ(ة).');
          setIsLoading(false);
          return;
        }
        await register(fullName, email, password);
        setSuccessMessage('تم إنشاء حسابك وتفعيله بنجاح!');
        setTimeout(onClose, 600);
      } else if (mode === 'forgot') {
        setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء العملية.');
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
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {mode === 'login' && (isRtl ? 'تسجيل الدخول إلى وثائقي التربوية' : 'Connexion à Wathaiqi')}
            {mode === 'register' && (isRtl ? 'إنشاء حساب أستاذ(ة) جديد' : 'Créer un compte Enseignant')}
            {mode === 'forgot' && (isRtl ? 'استعادة كلمة المرور' : 'Mot de passe oublié')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl ? 'لحفظ ومزامنة وثائقك وجذاذاتك وسجلات النقط بأمان' : 'Sauvegardez vos documents et registres pédagogiques'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Quick Google Login */}
        {mode !== 'forgot' && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isRtl ? 'المتابعة بحساب Google' : 'Continuer avec Google'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-400">{isRtl ? 'أو عبر البريد الإلكتروني' : 'ou par email'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'الاسم الكامل للأستاذ(ة)' : 'Nom et Prénom'}
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isRtl ? 'الأستاذ(ة) نور الدين بسيم' : 'ex. Pr. Nourdin'}
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isRtl ? 'البريد الإلكتروني المهني أو الشخصي' : 'Adresse Email'}
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

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {isRtl ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    {isRtl ? 'نسيت كلمة المرور؟' : 'Oublié ?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-slate-400`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⌛</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && (isRtl ? 'دخول فضاء الأستاذ' : 'Se connecter')}
                  {mode === 'register' && (isRtl ? 'تأكيد التسجيل' : 'S\'inscrire')}
                  {mode === 'forgot' && (isRtl ? 'إرسال رابط الاستعادة' : 'Envoyer')}
                </span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
          {mode === 'login' ? (
            <span>
              {isRtl ? 'ليس لديك حساب بعد؟ ' : 'Pas de compte ? '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold hover:underline"
              >
                {isRtl ? 'إنشاء حساب جديد' : 'Créer un compte'}
              </button>
            </span>
          ) : (
            <span>
              {isRtl ? 'لديك حساب بالفعل؟ ' : 'Vous avez un compte ? '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 font-bold hover:underline"
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
