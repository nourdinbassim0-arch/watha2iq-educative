import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  reload,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { User, UserRole, UserPlan, UserSubscription, UserDailyUsage, PlatformSettings } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: User | null;
  plan: UserPlan;
  isPro: boolean;
  subscription: UserSubscription | null;
  dailyUsage: UserDailyUsage | null;
  platformSettings: PlatformSettings;
  loading: boolean;
  isFirebaseReady: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isOwner: boolean;
  isTeacher: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  loginDemo: (targetRole?: 'TEACHER' | 'OWNER') => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<{ success: boolean; message?: string }>;
  updateUserProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<{ success: boolean; message?: string }>;
  checkUsageAllowed: () => boolean;
  recordDocumentGeneration: () => Promise<{ allowed: boolean; remaining: number; reason?: string }>;
  updatePlatformSettings?: (settings: Partial<PlatformSettings>) => Promise<boolean>;
}

const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  freeDailyLimit: 3,
  platformNameAr: 'وثائقي التربوية',
  platformNameFr: 'Wathaiqi Tarbawiya',
  maintenanceMode: false,
  proPriceMad: 49,
  supportEmail: 'contact@wathaiqi.ma',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [plan, setPlan] = useState<UserPlan>('FREE');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [dailyUsage, setDailyUsage] = useState<UserDailyUsage | null>(null);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const getTodayDateString = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Listen to platform settings
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const settingsRef = doc(db, 'settings', 'platform');
      const unsub = onSnapshot(settingsRef, (snap) => {
        if (snap.exists()) {
          setPlatformSettings({ ...DEFAULT_PLATFORM_SETTINGS, ...snap.data() } as PlatformSettings);
        }
      }, (err) => {
        console.warn('Settings snapshot warning:', err.message);
      });
      return () => unsub();
    } catch (e) {}
  }, []);

  // Sync Firebase Auth state, Profile, Subscription and Usage
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      const storedDemo = localStorage.getItem('wathaiqi_demo_session');
      if (storedDemo) {
        try {
          const parsed = JSON.parse(storedDemo);
          setUser(parsed.user);
          setProfile(parsed.profile);
          setPlan(parsed.plan || 'PRO');
          setDailyUsage(parsed.dailyUsage);
        } catch (e) {}
      }
      setLoading(false);
      return;
    }

    let unsubUserDoc: (() => void) | null = null;
    let unsubSubDoc: (() => void) | null = null;
    let unsubUsageDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      // Clean up previous listeners
      if (unsubUserDoc) unsubUserDoc();
      if (unsubSubDoc) unsubSubDoc();
      if (unsubUsageDoc) unsubUsageDoc();

      if (fbUser) {
        localStorage.removeItem('wathaiqi_demo_session');
        setUser(fbUser);
        // Immediate fallback profile from fbUser so UI is instantly responsive
        const ownerEmail = (import.meta.env.VITE_OWNER_EMAIL || 'nourdinbassim0@gmail.com').toLowerCase();
        const isOwnerAccount = fbUser.email?.toLowerCase() === ownerEmail;
        setProfile({
          id: fbUser.uid,
          name: fbUser.displayName || 'أستاذ المادة',
          email: fbUser.email || '',
          phone: '',
          role: isOwnerAccount ? 'OWNER' : 'TEACHER',
          status: 'ACTIVE',
          plan: isOwnerAccount ? 'PRO' : 'FREE',
          isVerified: fbUser.emailVerified,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatarUrl: fbUser.photoURL || '',
        });
        if (isOwnerAccount) {
          setPlan('PRO');
        }

        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          
          // User doc snapshot
          unsubUserDoc = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              const userPlan: UserPlan = isOwnerAccount ? 'PRO' : (data.plan === 'PRO' ? 'PRO' : 'FREE');
              setPlan(userPlan);
              setProfile({
                id: fbUser.uid,
                name: data.fullName || fbUser.displayName || '',
                email: fbUser.email || '',
                phone: data.phone || '',
                role: isOwnerAccount ? 'OWNER' : (data.role || 'TEACHER'),
                status: data.status || 'ACTIVE',
                plan: userPlan,
                isVerified: fbUser.emailVerified || Boolean(data.isVerified),
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                avatarUrl: data.avatarUrl || fbUser.photoURL || '',
              });
            } else {
              // Create default profile if not present
              setDoc(userDocRef, {
                uid: fbUser.uid,
                fullName: fbUser.displayName || '',
                email: fbUser.email || '',
                role: isOwnerAccount ? 'OWNER' : 'TEACHER',
                plan: isOwnerAccount ? 'PRO' : 'FREE',
                status: 'ACTIVE',
                isVerified: fbUser.emailVerified,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
              }).catch((e) => console.warn('User doc init caught:', e.message));
            }
          }, (err) => {
            console.warn('User snapshot handled:', err.message);
          });

          // Subscription doc snapshot
          const subDocRef = doc(db, 'subscriptions', fbUser.uid);
          unsubSubDoc = onSnapshot(subDocRef, (snap) => {
            if (snap.exists()) {
              const subData = snap.data() as UserSubscription;
              setSubscription(subData);
              if (subData.status === 'active' || subData.status === 'trialing' || isOwnerAccount) {
                setPlan('PRO');
              }
            } else {
              setSubscription(null);
            }
          }, (err) => {
            console.warn('Subscription snapshot handled:', err.message);
          });

          // Daily Usage doc snapshot
          const usageDocRef = doc(db, 'usage', fbUser.uid);
          unsubUsageDoc = onSnapshot(usageDocRef, (snap) => {
            const today = getTodayDateString();
            if (snap.exists()) {
              const uData = snap.data();
              if (uData.date === today) {
                setDailyUsage({
                  uid: fbUser.uid,
                  date: today,
                  used: uData.used || 0,
                  limit: platformSettings.freeDailyLimit || 3,
                });
              } else {
                setDailyUsage({
                  uid: fbUser.uid,
                  date: today,
                  used: 0,
                  limit: platformSettings.freeDailyLimit || 3,
                });
              }
            } else {
              setDailyUsage({
                uid: fbUser.uid,
                date: today,
                used: 0,
                limit: platformSettings.freeDailyLimit || 3,
              });
            }
          }, (err) => {
            console.warn('Usage snapshot handled:', err.message);
          });

        } catch (err) {
          console.error('Error in user auth subscriptions:', err);
        }
      } else {
        const storedDemo = localStorage.getItem('wathaiqi_demo_session');
        if (storedDemo) {
          try {
            const parsed = JSON.parse(storedDemo);
            setUser(parsed.user);
            setProfile(parsed.profile);
            setPlan(parsed.plan || 'PRO');
            setDailyUsage(parsed.dailyUsage || {
              uid: parsed.user?.uid || 'demo-teacher-uid',
              date: getTodayDateString(),
              used: 0,
              limit: 999,
            });
            setLoading(false);
            return;
          } catch (e) {
            localStorage.removeItem('wathaiqi_demo_session');
          }
        }
        setUser(null);
        setProfile(null);
        setPlan('FREE');
        setSubscription(null);
        setDailyUsage(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubUserDoc) unsubUserDoc();
      if (unsubSubDoc) unsubSubDoc();
      if (unsubUsageDoc) unsubUsageDoc();
    };
  }, [platformSettings.freeDailyLimit]);

  const isOwner = profile?.role === 'OWNER';
  const isTeacher = profile?.role === 'TEACHER';
  const isPro = plan === 'PRO' || isOwner;
  const isAuthenticated = Boolean(user);
  const isEmailVerified = Boolean(user?.emailVerified);

  const checkUsageAllowed = (): boolean => {
    if (isPro || isOwner) return true;
    if (!dailyUsage) return true;
    const limit = platformSettings.freeDailyLimit || 3;
    return dailyUsage.used < limit;
  };

  const recordDocumentGeneration = async (): Promise<{ allowed: boolean; remaining: number; reason?: string }> => {
    if (isPro || isOwner) {
      return { allowed: true, remaining: 9999 };
    }

    if (!isFirebaseConfigured || !db || !user) {
      // Local fallback
      return { allowed: true, remaining: 2 };
    }

    const today = getTodayDateString();
    const usageRef = doc(db, 'usage', user.uid);
    const limit = platformSettings.freeDailyLimit || 3;

    try {
      const res = await runTransaction(db, async (transaction) => {
        const usageSnap = await transaction.get(usageRef);
        let currentUsed = 0;

        if (usageSnap.exists()) {
          const data = usageSnap.data();
          if (data.date === today) {
            currentUsed = Number(data.used) || 0;
          }
        }

        if (currentUsed >= limit) {
          return { allowed: false, remaining: 0, reason: 'DAILY_LIMIT_REACHED' };
        }

        const newUsed = currentUsed + 1;
        transaction.set(usageRef, {
          uid: user.uid,
          date: today,
          used: newUsed,
          limit,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        return { allowed: true, remaining: Math.max(0, limit - newUsed) };
      });

      return res;
    } catch (err) {
      console.error('Usage transaction error:', err);
      return { allowed: true, remaining: 1 };
    }
  };

  const updatePlatformSettings = async (newSettings: Partial<PlatformSettings>): Promise<boolean> => {
    if (!isFirebaseConfigured || !db || !isOwner) return false;
    try {
      const settingsRef = doc(db, 'settings', 'platform');
      await setDoc(settingsRef, { ...platformSettings, ...newSettings }, { merge: true });
      setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
      return true;
    } catch (e) {
      console.error('Failed to update platform settings:', e);
      return false;
    }
  };

  const refreshUser = async () => {
    if (auth?.currentUser) {
      await reload(auth.currentUser);
      setUser({ ...auth.currentUser });
      if (profile) {
        setProfile({
          ...profile,
          isVerified: auth.currentUser.emailVerified,
        });
      }
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { 
        success: false, 
        message: 'خدمة تسجيل الدخول السحابية غير مفعلة حالياً.' 
      };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await reload(cred.user);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'تسجيل الدخول بالبريد الإلكتروني غير مفعّل في لوحة Firebase Console. يرجى استخدام تسجيل الدخول المباشر بحساب Google أدناه أو تفعيل موفر البريد في Firebase.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'تم حظر الحساب مؤقتاً بسبب كثرة المحاولات. يرجى المحاولة لاحقاً.';
      } else if (err.code === 'auth/user-disabled') {
        errorMsg = 'هذا الحساب معطل. يرجى التواصل مع الإدارة.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { 
        success: false, 
        message: 'خدمة تسجيل الدخول السحابية غير مفعلة حالياً.' 
      };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      
      if (cred.user && db) {
        try {
          const userDocRef = doc(db, 'users', cred.user.uid);
          const snap = await getDoc(userDocRef);
          const ownerEmail = (import.meta.env.VITE_OWNER_EMAIL || 'nourdinbassim0@gmail.com').toLowerCase();
          const isOwnerAccount = cred.user.email?.toLowerCase() === ownerEmail;

          if (!snap.exists()) {
            await setDoc(userDocRef, {
              uid: cred.user.uid,
              fullName: cred.user.displayName || 'أستاذ المادة',
              email: cred.user.email || '',
              phone: '',
              role: isOwnerAccount ? 'OWNER' : 'TEACHER',
              plan: isOwnerAccount ? 'PRO' : 'FREE',
              status: 'ACTIVE',
              isVerified: cred.user.emailVerified,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              avatarUrl: cred.user.photoURL || '',
            });
          } else {
            await updateDoc(userDocRef, {
              lastLogin: serverTimestamp(),
              ...(cred.user.photoURL ? { avatarUrl: cred.user.photoURL } : {}),
              ...(isOwnerAccount ? { role: 'OWNER', plan: 'PRO' } : {}),
            });
          }
        } catch (dbErr) {
          console.warn('Firestore doc sync error (non-fatal):', dbErr);
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      let errorMsg = 'حدث خطأ أثناء تسجيل الدخول بحساب Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'تم إلغاء طلب تسجيل الدخول.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'المتصفح منع فتح النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'موفر تسجيل الدخول بـ Google غير مفعّل في لوحة Firebase Console. يرجى تفعيله من قسم Authentication > Sign-in method.';
      } else if (err.code === 'auth/unauthorized-domain') {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'ais-dev-cr7y6mlsuc26jppqmyax2m-308155720568.europe-west2.run.app';
        errorMsg = `نطاق التطبيق (${hostname}) غير مسجل في Authorized Domains بمشروع Firebase. يمكنك استخدام البريد الإلكتروني وكلمة المرور أدناه مباشرة للدخول.`;
      }
      return { success: false, message: errorMsg };
    }
  };

  const loginDemo = async (targetRole: 'TEACHER' | 'OWNER' = 'TEACHER'): Promise<{ success: boolean; message?: string }> => {
    const isOwnerTarget = targetRole === 'OWNER';
    const mockUser: any = {
      uid: isOwnerTarget ? 'demo-admin-uid' : 'demo-teacher-uid',
      email: isOwnerTarget ? 'nourdinbassim0@gmail.com' : 'professeur.demo@wathaiqi.ma',
      displayName: isOwnerTarget ? 'المشرف العام (حساب تجريبي)' : 'أستاذ ممارس (حساب تجريبي)',
      emailVerified: true,
      isAnonymous: false,
    };
    const mockProfile: User = {
      id: mockUser.uid,
      name: mockUser.displayName,
      email: mockUser.email,
      phone: '0612345678',
      role: targetRole,
      status: 'ACTIVE',
      plan: 'PRO',
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      avatarUrl: '',
    };
    const mockUsage: UserDailyUsage = {
      uid: mockUser.uid,
      date: getTodayDateString(),
      used: 0,
      limit: 999,
    };

    localStorage.setItem('wathaiqi_demo_session', JSON.stringify({
      user: mockUser,
      profile: mockProfile,
      plan: 'PRO',
      dailyUsage: mockUsage,
    }));

    setUser(mockUser);
    setPlan('PRO');
    setProfile(mockProfile);
    setDailyUsage(mockUsage);
    return { success: true };
  };

  const register = async (
    fullName: string,
    email: string,
    pass: string,
    phone?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth || !db) {
      return { 
        success: false, 
        message: 'خدمة إنشاء الحسابات السحابية غير مفعلة حالياً.' 
      };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      if (fullName.trim()) {
        await firebaseUpdateProfile(cred.user, { displayName: fullName.trim() });
      }

      try {
        const userDocRef = doc(db, 'users', cred.user.uid);
        await setDoc(userDocRef, {
          uid: cred.user.uid,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone?.trim() || '',
          role: 'TEACHER',
          plan: 'FREE',
          status: 'ACTIVE',
          isVerified: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } catch (dbErr) {
        console.warn('Firestore doc write caught (non-fatal):', dbErr);
      }

      try {
        await sendEmailVerification(cred.user);
      } catch (e) {
        console.warn('Email verification send skipped:', e);
      }

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح. تم إرسال رابط التحقق إلى بريدك الإلكتروني.',
      };
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = 'حدث خطأ أثناء إنشاء الحساب.';
      if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'إنشاء الحسابات بالبريد الإلكتروني غير مفعّل في لوحة Firebase Console. يرجى تسجيل الدخول مباشرة بحساب Google أو تفعيل Email/Password في Firebase.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'البريد الإلكتروني مستخدم بالفعل.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'كلمة المرور ضعيفة. يرجى استخدام 6 أحرف على الأقل.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('wathaiqi_demo_session');
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    setProfile(null);
    setPlan('FREE');
    setSubscription(null);
    setDailyUsage(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, message: 'خدمة استعادة كلمة المرور غير متاحة حالياً.' };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.',
      };
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errorMsg = 'تعذر إرسال رابط إعادة التعيين.';
      if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'خدمة إعادة تعيين كلمة المرور غير مفعّلة في إعدادات Firebase Console.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      return { success: false, message: 'يجب تسجيل الدخول أولاً لإعادة إرسال رسالة التحقق.' };
    }

    try {
      await sendEmailVerification(auth.currentUser);
      return {
        success: true,
        message: 'تمت إعادة إرسال رابط التحقق إلى بريدك الإلكتروني.',
      };
    } catch (err: any) {
      console.error('Resend verification error:', err);
      return {
        success: false,
        message: 'تعذر إرسال رسالة التحقق. يرجى الانتظار دقيقة والمحاولة مجدداً.',
      };
    }
  };

  const updateUserPassword = async (newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      return { success: false, message: 'المستخدم غير مسجل.' };
    }

    try {
      await firebaseUpdatePassword(auth.currentUser, newPass);
      return { success: true, message: 'تم تحديث كلمة المرور بنجاح.' };
    } catch (err: any) {
      console.error('Update password error:', err);
      let errorMsg = 'تعذر تغيير كلمة المرور.';
      if (err.code === 'auth/requires-recent-login') {
        errorMsg = 'يرجى تسجيل الدخول مجدداً لتأكيد هويتك قبل تغيير كلمة المرور.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'كلمة المرور ضعيفة جداً.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const updateUserProfile = async (data: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!auth?.currentUser) {
      return { success: false, message: 'المستخدم غير مسجل.' };
    }

    try {
      if (data.fullName) {
        await firebaseUpdateProfile(auth.currentUser, { displayName: data.fullName });
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
        updatedAt: serverTimestamp(),
      });

      if (profile) {
        setProfile({
          ...profile,
          ...(data.fullName ? { name: data.fullName } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
          ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
        });
      }

      return { success: true, message: 'تم تحديث البيانات بنجاح.' };
    } catch (err: any) {
      console.error('Update profile error:', err);
      return { success: false, message: 'حدث خطأ أثناء حفظ التعديلات.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        plan,
        isPro,
        subscription,
        dailyUsage,
        platformSettings,
        loading,
        isFirebaseReady: isFirebaseConfigured,
        isAuthenticated,
        isEmailVerified,
        isOwner,
        isTeacher,
        login,
        loginWithGoogle,
        loginDemo,
        register,
        logout,
        resetPassword,
        resendVerificationEmail,
        refreshUser,
        updateUserPassword,
        updateUserProfile,
        checkUsageAllowed,
        recordDocumentGeneration,
        updatePlatformSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
