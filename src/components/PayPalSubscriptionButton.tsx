import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscriptionButtonProps {
  onVerifiedSuccess: (subscriptionId: string) => void;
  onVerificationError?: (errorMsg: string) => void;
  userEmail?: string;
  userId?: string;
}

const PAYPAL_PLAN_ID = 'P-9FX06719KN7892341NKNCWKY';
const DEFAULT_CLIENT_ID = 'BAAk98rn2Og1ZDfG46qCezPchnnXFTHoCd5mIqIqC2MMU6aKdXgvJxmCtMrJZQJUMxYUwrNueAQWlukGHA';

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  onVerifiedSuccess,
  onVerificationError,
  userEmail,
  userId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState<boolean>(false);
  const [loadingSdk, setLoadingSdk] = useState<boolean>(true);
  const [sdkError, setSdkError] = useState<string | null>(null);
  
  // Subscription flow states
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID || DEFAULT_CLIENT_ID).trim();

  // Load PayPal SDK script cleanly once
  useEffect(() => {
    let isMounted = true;
    const scriptId = 'paypal-sdk-subscription-script';

    const loadPayPalScript = () => {
      // Check if already in window
      if (window.paypal && window.paypal.Buttons) {
        if (isMounted) {
          setSdkReady(true);
          setLoadingSdk(false);
        }
        return;
      }

      // Check if script tag already exists in DOM
      const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMounted) {
            setSdkReady(true);
            setLoadingSdk(false);
          }
        });
        existingScript.addEventListener('error', () => {
          if (isMounted) {
            setSdkError('تعذر تحميل بوابة الدفع من PayPal. يرجى التحقق من اتصالك بالإنترنت.');
            setLoadingSdk(false);
          }
        });
        return;
      }

      // Create and inject the official SDK script
      setLoadingSdk(true);
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription`;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.async = true;

      script.onload = () => {
        if (isMounted) {
          setSdkReady(true);
          setLoadingSdk(false);
        }
      };

      script.onerror = () => {
        if (isMounted) {
          setSdkError('تعذر تحميل بوابة PayPal الآمنة. يرجى التحقق من الاتصال وإعادة المحاولة.');
          setLoadingSdk(false);
        }
      };

      document.head.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  // Render PayPal Buttons once SDK is ready
  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.paypal) return;

    // Clear previous button render in container
    containerRef.current.innerHTML = '';

    let buttonsInstance: any = null;

    try {
      buttonsInstance = window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: (_data: any, actions: any) => {
          setErrorMessage(null);
          return actions.subscription.create({
            plan_id: PAYPAL_PLAN_ID,
            custom_id: userId || '',
            subscriber: userEmail ? { email_address: userEmail } : undefined,
          });
        },
        onApprove: async (data: any) => {
          const subscriptionId = data?.subscriptionID;
          if (!subscriptionId) {
            setErrorMessage('تعذر العثور على معرّف الاشتراك من PayPal.');
            return;
          }

          // Important: We do NOT blindly trust the client or alert(data.subscriptionID)!
          // Initiate authoritative server-side verification
          setVerifying(true);
          setErrorMessage(null);

          try {
            await onVerifiedSuccess(subscriptionId);
            setVerificationSuccess(true);
          } catch (err: any) {
            const msg = err?.message || 'تعذر التحقق من الاشتراك من خلال الخادم.';
            setErrorMessage(msg);
            if (onVerificationError) {
              onVerificationError(msg);
            }
          } finally {
            setVerifying(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal Button Error:', err);
          setErrorMessage('حدث خطأ أثناء معالجة عملية الدفع عبر PayPal. يرجى إعادة المحاولة.');
        },
        onCancel: () => {
          setErrorMessage('تم إلغاء عملية الاشتراك قبل إتمامها.');
        },
      });

      if (buttonsInstance.isEligible()) {
        buttonsInstance.render(containerRef.current).catch((renderErr: any) => {
          console.warn('PayPal render error:', renderErr);
        });
      } else {
        setErrorMessage('وسيلة الدفع عبر PayPal غير متاحة لمتصفحك حالياً.');
      }
    } catch (err: any) {
      console.error('Error instantiating PayPal buttons:', err);
      setSdkError('حدث خطأ أثناء تهيئة زر الاشتراك.');
    }

    return () => {
      try {
        if (buttonsInstance && typeof buttonsInstance.close === 'function') {
          buttonsInstance.close();
        }
      } catch (e) {
        // Ignore close error on unmount
      }
    };
  }, [sdkReady, userId, userEmail, onVerifiedSuccess, onVerificationError]);

  return (
    <div className="w-full" dir="rtl">
      {/* Verification In Progress Notification */}
      {verifying && (
        <div className="p-4 mb-4 rounded-2xl bg-[#0A4D68]/10 border border-[#05BFDB]/40 text-[#0A4D68] flex items-center gap-3 shadow-xs animate-pulse">
          <Loader2 className="w-5 h-5 text-[#05BFDB] animate-spin shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-sm">تم إنشاء الاشتراك، جارٍ التحقق من الدفع...</div>
            <div className="text-slate-600 mt-0.5">
              يتم الآن التحقق من صحة الاشتراك مع خوادم PayPal وتفعيل باقة حسابك بصورة رسمية.
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {verificationSuccess && (
        <div className="p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-sm">تم تفعيل اشتراكك بنجاح!</div>
            <div className="text-emerald-700 mt-0.5">
              حسابك الآن مفعّل بالكامل في باقة «وثائقي التربوية» لمدة سنة كاملة.
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 mb-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold mb-0.5">تنبيه بشأن عملية الدفع:</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* SDK Loading State */}
      {loadingSdk && (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#0A4D68] animate-spin" />
          <span className="text-xs font-bold text-slate-700">جاري تحميل خيارات الدفع الآمنة...</span>
          <span className="text-[11px] text-slate-500">الاتصال المباشر مع PayPal</span>
        </div>
      )}

      {/* SDK Load Error */}
      {sdkError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold mb-1">تعذر تحميل بوابة PayPal</div>
            <p className="text-amber-800 leading-relaxed mb-3">{sdkError}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      )}

      {/* PayPal Button Render Container */}
      <div 
        id={`paypal-button-container-${PAYPAL_PLAN_ID}`}
        ref={containerRef} 
        className={`w-full min-h-[50px] transition-opacity duration-200 ${
          loadingSdk || verifying ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Security note */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#065F46]" />
        <span>دفع سنوي معتمد ومشفر عبر بوابة PayPal الرسمية (Plan: P-9FX06719KN7892341NKNCWKY)</span>
      </div>
    </div>
  );
};
