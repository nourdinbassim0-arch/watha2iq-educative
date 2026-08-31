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
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { User, UserRole, ActivityLog } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  isFirebaseReady: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isOwner: boolean;
  isTeacher: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<{ success: boolean; message?: string }>;
  updateUserProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Firebase Auth state and Firestore Profile
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfile({
              id: fbUser.uid,
              name: data.fullName || fbUser.displayName || '',
              email: fbUser.email || '',
              phone: data.phone || '',
              role: data.role || 'TEACHER',
              status: data.status || 'ACTIVE',
              isVerified: fbUser.emailVerified || Boolean(data.isVerified),
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              avatarUrl: data.avatarUrl || fbUser.photoURL || '',
            });

            // Update lastLogin in background
            updateDoc(userDocRef, {
              lastLogin: serverTimestamp(),
              isVerified: fbUser.emailVerified,
            }).catch(() => {});
          } else {
            // First time user profile creation
            const newProfileData = {
              uid: fbUser.uid,
              fullName: fbUser.displayName || '',
              email: fbUser.email || '',
              role: 'TEACHER', // Safe default
              status: 'ACTIVE',
              isVerified: fbUser.emailVerified,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfileData);
            setProfile({
              id: fbUser.uid,
              name: fbUser.displayName || '',
              email: fbUser.email || '',
              role: 'TEACHER',
              status: 'ACTIVE',
              isVerified: fbUser.emailVerified,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          // Fallback minimal profile
          setProfile({
            id: fbUser.uid,
            name: fbUser.displayName || '',
            email: fbUser.email || '',
            role: 'TEACHER',
            status: 'ACTIVE',
            isVerified: fbUser.emailVerified,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
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
        message: 'خدمة تسجيل الدخول السحابية غير مفعلة حالياً. يمكنك استخدام المنصة وإعداد وتصدير الوثائق بحرية دون الحاجة لتسجيل الدخول.' 
      };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await reload(cred.user);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'تم حظر الحساب مؤقتاً بسبب كثرة المحاولات. يرجى المحاولة لاحقاً.';
      } else if (err.code === 'auth/user-disabled') {
        errorMsg = 'هذا الحساب معطل. يرجى التواصل مع الإدارة.';
      }
      return { success: false, message: errorMsg };
    }
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
        message: 'خدمة إنشاء الحسابات السحابية غير مفعلة حالياً. يمكنك الاستفادة من كافة خصائص التحرير والتصدير مباشرة.' 
      };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      // Update display name
      if (fullName.trim()) {
        await firebaseUpdateProfile(cred.user, { displayName: fullName.trim() });
      }

      // Create Firestore User Document
      const userDocRef = doc(db, 'users', cred.user.uid);
      await setDoc(userDocRef, {
        uid: cred.user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        role: 'TEACHER', // Enforced server/rule side as TEACHER
        status: 'ACTIVE',
        isVerified: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // Send standard verification link
      await sendEmailVerification(cred.user);

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح. تم إرسال رابط التحقق إلى بريدك الإلكتروني.',
      };
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMsg = 'حدث خطأ أثناء إنشاء الحساب.';
      if (err.code === 'auth/email-already-in-use') {
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
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    setProfile(null);
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
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      return { success: false, message: errorMsg };
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; message?: string }> => {
    if (!auth.currentUser) {
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
    if (!auth.currentUser) {
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
    if (!auth.currentUser) {
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

  const isOwner = profile?.role === 'OWNER';
  const isTeacher = profile?.role === 'TEACHER';
  const isAuthenticated = Boolean(user);
  const isEmailVerified = Boolean(user?.emailVerified);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isFirebaseReady: isFirebaseConfigured,
        isAuthenticated,
        isEmailVerified,
        isOwner,
        isTeacher,
        login,
        register,
        logout,
        resetPassword,
        resendVerificationEmail,
        refreshUser,
        updateUserPassword,
        updateUserProfile,
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
