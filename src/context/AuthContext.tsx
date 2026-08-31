import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuditLogItem, BroadcastAnnouncement } from '../types';
import { hashPassword, verifyPassword, generateOtpCode } from '../utils/security';

interface PendingOtp {
  email: string;
  code: string;
  expiresAt: number;
  type: 'register' | 'reset';
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  ownerEmail: string;
  applyOwnerEmail: (email: string) => boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (fullName: string, email: string, password?: string, role?: UserRole) => Promise<boolean>;
  sendEmailVerificationOtp: (email: string, type?: 'register' | 'reset') => Promise<{ code: string; expiresAt: number }>;
  verifyOtpAndRegister: (params: {
    fullName: string;
    email: string;
    password: string;
    code: string;
    role?: UserRole;
  }) => Promise<boolean>;
  requestPasswordResetOtp: (email: string) => Promise<{ code: string; expiresAt: number }>;
  resetPasswordWithOtp: (email: string, code: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  usersList: UserProfile[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (actionType: AuditLogItem['actionType'], performedBy: string, targetUserOrItem: string, details: string) => void;
  announcements: BroadcastAnnouncement[];
  addAnnouncement: (title: string, message: string, type?: 'info' | 'warning' | 'success') => void;
  deleteAnnouncement: (id: string) => void;
}

const DEFAULT_OWNER_EMAIL = 'nourdinbassim0@gmail.com';
const STORAGE_OWNER_EMAIL_KEY = 'wathaiqi_owner_email_v1';
const STORAGE_USERS_KEY = 'wathaiqi_users_v1';
const STORAGE_CURRENT_USER_KEY = 'wathaiqi_current_user_v1';
const STORAGE_LOGS_KEY = 'wathaiqi_audit_logs_v1';
const STORAGE_ANNOUNCEMENTS_KEY = 'wathaiqi_announcements_v1';
const STORAGE_PENDING_OTPS_KEY = 'wathaiqi_pending_otps_v1';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-owner-001',
    email: 'nourdinbassim0@gmail.com',
    fullName: 'الأستاذ نور الدين بسيم (مالك المنصة)',
    role: 'owner',
    phone: '0661000000',
    academy: 'أكاديمية جهة الدار البيضاء - سطات',
    directorate: 'المديرية الإقليمية سطات',
    schoolName: 'الثانوية التأهيلية ابن خلدون',
    defaultSubject: 'الرياضيات',
    isEmailVerified: true,
    createdAt: Date.now() - 30 * 86400000,
    lastLoginAt: Date.now(),
    status: 'active',
  },
  {
    id: 'usr-teacher-002',
    email: 'fatima.zahra@men.gov.ma',
    fullName: 'الأستاذة فاطمة الزهراء العلوي',
    role: 'teacher',
    phone: '0662112233',
    academy: 'أكاديمية جهة الرباط - سلا - القنيطرة',
    directorate: 'المديرية الإقليمية الرباط',
    schoolName: 'الثانوية الإعدادية يعقوب المنصور',
    defaultSubject: 'علوم الحياة والأرض',
    isEmailVerified: true,
    createdAt: Date.now() - 15 * 86400000,
    lastLoginAt: Date.now() - 2 * 86400000,
    status: 'active',
  },
  {
    id: 'usr-teacher-003',
    email: 'hassan.tazi@men.gov.ma',
    fullName: 'الأستاذ حسن التازي',
    role: 'admin',
    phone: '0663445566',
    academy: 'أكاديمية جهة مراكش - آسفي',
    directorate: 'المديرية الإقليمية مراكش',
    schoolName: 'مدرسة المسيرة الخضراء الابتدائية',
    defaultSubject: 'اللغة العربية والتربية الإسلامية',
    isEmailVerified: true,
    createdAt: Date.now() - 20 * 86400000,
    lastLoginAt: Date.now() - 1 * 86400000,
    status: 'active',
  },
];

const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: Date.now() - 1200000,
    actionType: 'user_registered',
    performedBy: 'نظام المنصة',
    targetUserOrItem: 'nourdinbassim0@gmail.com',
    details: 'تسجيل وتفعيل حساب مالك المنصة الرئيسي مع التحقق من البريد',
  },
  {
    id: 'log-2',
    timestamp: Date.now() - 800000,
    actionType: 'template_published',
    performedBy: 'مالك المنصة',
    targetUserOrItem: 'جذاذة التناسبية 3AC',
    details: 'نشر نموذج ديداكتيكي رسمي جديد للمستوى الثالث إعدادي',
  },
];

const INITIAL_ANNOUNCEMENTS: BroadcastAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'تحديث المنهاج الدراسي 2026-2027',
    message: 'تم تحديث جميع نماذج الجذاذات والمراقبة المستمرة وسجل النقط وفق التوجيهات التربوية الرسمية لوزارة التربية الوطنية.',
    type: 'info',
    active: true,
    createdAt: Date.now() - 86400000,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ownerEmail, setOwnerEmail] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_OWNER_EMAIL_KEY);
      return (stored && stored.trim()) ? stored.trim() : DEFAULT_OWNER_EMAIL;
    } catch {
      return DEFAULT_OWNER_EMAIL;
    }
  });

  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
      // Default to owner user
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LOGS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ANNOUNCEMENTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Pending OTPs map
  const [pendingOtps, setPendingOtps] = useState<Record<string, PendingOtp>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PENDING_OTPS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_OWNER_EMAIL_KEY, ownerEmail);
    } catch (e) {
      console.error(e);
    }
  }, [ownerEmail]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error(e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PENDING_OTPS_KEY, JSON.stringify(pendingOtps));
    } catch (e) {
      console.error(e);
    }
  }, [pendingOtps]);

  const addAuditLog = (
    actionType: AuditLogItem['actionType'],
    performedBy: string,
    targetUserOrItem: string,
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      actionType,
      performedBy,
      targetUserOrItem,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const applyOwnerEmail = (newEmail: string): boolean => {
    if (!newEmail || !newEmail.includes('@')) {
      return false;
    }
    const cleanEmail = newEmail.trim().toLowerCase();
    setOwnerEmail(cleanEmail);

    // Update users: the new email gets 'owner' role, other owners demoted to admin/teacher
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === cleanEmail) {
          return { ...u, role: 'owner' as UserRole };
        }
        if (u.role === 'owner' && u.email.toLowerCase() !== cleanEmail) {
          return { ...u, role: 'teacher' as UserRole };
        }
        return u;
      })
    );

    // If current user is logged in with this email, update role
    if (currentUser) {
      if (currentUser.email.toLowerCase() === cleanEmail) {
        setCurrentUser((prev) => (prev ? { ...prev, role: 'owner' } : null));
      }
    }

    addAuditLog('role_changed', currentUser?.fullName || 'النظام', cleanEmail, 'تحديث واعتماد البريد الإلكتروني لمالك المنصة');
    return true;
  };

  /**
   * Generates and registers an OTP code for email verification
   */
  const sendEmailVerificationOtp = async (
    email: string,
    type: 'register' | 'reset' = 'register'
  ): Promise<{ code: string; expiresAt: number }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('يرجى إدخال بريد إلكتروني صحيح.');
    }

    const code = generateOtpCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setPendingOtps((prev) => ({
      ...prev,
      [cleanEmail]: {
        email: cleanEmail,
        code,
        expiresAt,
        type,
      },
    }));

    return { code, expiresAt };
  };

  /**
   * Completes account creation after OTP email verification
   */
  const verifyOtpAndRegister = async (params: {
    fullName: string;
    email: string;
    password: string;
    code: string;
    role?: UserRole;
  }): Promise<boolean> => {
    const cleanEmail = params.email.trim().toLowerCase();
    const enteredCode = params.code.trim();

    if (!params.fullName.trim()) {
      throw new Error('يرجى كتابة الاسم والنسب الكامل للأستاذ(ة).');
    }

    if (!params.password || params.password.length < 6) {
      throw new Error('يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل.');
    }

    // Check if user already exists
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
    }

    // Verify OTP
    const pending = pendingOtps[cleanEmail];
    if (!pending || pending.code !== enteredCode) {
      throw new Error('رمز التحقق غير صحيح. يرجى التأكد من الرمز المكون من 6 أرقام وإعادة المحاولة.');
    }

    if (Date.now() > pending.expiresAt) {
      throw new Error('انتهت صلاحية رمز التحقق (أكثر من 10 دقائق). يرجى النقر على "إعادة إرسال الرمز".');
    }

    const passwordHash = await hashPassword(params.password);
    const isOwnerMatch = cleanEmail === ownerEmail.toLowerCase();
    const finalRole: UserRole = isOwnerMatch ? 'owner' : (params.role || 'teacher');

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: params.fullName.trim(),
      role: finalRole,
      passwordHash,
      isEmailVerified: true,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      status: 'active',
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Clean up OTP
    setPendingOtps((prev) => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    addAuditLog('user_registered', newUser.fullName, cleanEmail, `إنشاء حساب جديد وتفعيله برمز التحقق البريدي (الدور: ${finalRole})`);
    return true;
  };

  /**
   * Request password reset OTP
   */
  const requestPasswordResetOtp = async (email: string): Promise<{ code: string; expiresAt: number }> => {
    const cleanEmail = email.trim().toLowerCase();
    const user = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني.');
    }
    return sendEmailVerificationOtp(cleanEmail, 'reset');
  };

  /**
   * Resets password using valid OTP code
   */
  const resetPasswordWithOtp = async (email: string, code: string, newPassword: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const enteredCode = code.trim();

    if (!newPassword || newPassword.length < 6) {
      throw new Error('يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل.');
    }

    const pending = pendingOtps[cleanEmail];
    if (!pending || pending.code !== enteredCode) {
      throw new Error('رمز التحقق غير صحيح. يرجى التأكد من الرمز.');
    }

    if (Date.now() > pending.expiresAt) {
      throw new Error('انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.');
    }

    const user = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('لم يتم العثور على المستخدم.');
    }

    const newHash = await hashPassword(newPassword);
    const updatedUser = {
      ...user,
      passwordHash: newHash,
    };

    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    if (currentUser?.id === user.id) {
      setCurrentUser(updatedUser);
    }

    // Clean up OTP
    setPendingOtps((prev) => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    addAuditLog('settings_updated', user.fullName, user.email, 'إعادة تعيين وتحديث كلمة المرور بنجاح');
    return true;
  };

  /**
   * Changes password for currently logged-in user
   */
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentUser) throw new Error('يرجى تسجيل الدخول أولاً.');
    if (!newPassword || newPassword.length < 6) {
      throw new Error('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف أو أرقام على الأقل.');
    }

    if (currentUser.passwordHash) {
      const isValid = await verifyPassword(oldPassword, currentUser.passwordHash);
      if (!isValid) {
        throw new Error('كلمة المرور الحالية غير صحيحة.');
      }
    }

    const newHash = await hashPassword(newPassword);
    const updatedUser = {
      ...currentUser,
      passwordHash: newHash,
    };

    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addAuditLog('settings_updated', currentUser.fullName, currentUser.email, 'تغيير كلمة المرور من إعدادات الحساب');
    return true;
  };

  /**
   * Secure login with exact password checking
   */
  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('يرجى إدخال البريد الإلكتروني.');
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    const isOwnerMatch = cleanEmail === ownerEmail.toLowerCase();

    if (!existing) {
      throw new Error('لم يتم العثور على حساب بهذا البريد الإلكتروني. يرجى النقر على «إنشاء حساب جديد» أولاً.');
    }

    if (existing.status === 'disabled') {
      throw new Error('هذا الحساب معطل مؤقتاً من قبل إدارة المنصة. يرجى التواصل مع الدعم.');
    }

    // Strict password verification
    if (existing.passwordHash) {
      if (!password) {
        throw new Error('يرجى إدخال كلمة المرور.');
      }
      const isMatch = await verifyPassword(password, existing.passwordHash);
      if (!isMatch) {
        throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كتابة كلمة المرور المعتمدة وإعادة المحاولة.');
      }
    } else {
      // If user had no passwordHash set yet (legacy initial user), set it on first login if provided
      if (password && password.length >= 4) {
        const hash = await hashPassword(password);
        existing.passwordHash = hash;
      }
    }

    const updated: UserProfile = {
      ...existing,
      role: isOwnerMatch ? ('owner' as UserRole) : existing.role,
      lastLoginAt: Date.now(),
    };

    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
    addAuditLog('user_registered', existing.fullName, existing.email, 'تسجيل دخول ناجح للمنصة بكلمة المرور');
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const isOwnerMatch = ownerEmail.toLowerCase();
    const existingOwner = usersList.find((u) => u.email.toLowerCase() === isOwnerMatch);
    if (existingOwner) {
      setCurrentUser(existingOwner);
      return true;
    }
    return login(ownerEmail);
  };

  const register = async (
    fullName: string,
    email: string,
    password?: string,
    role: UserRole = 'teacher'
  ): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const isOwnerMatch = cleanEmail === ownerEmail.toLowerCase();
    const finalRole: UserRole = isOwnerMatch ? 'owner' : role;
    const passwordHash = password ? await hashPassword(password) : undefined;

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName.trim(),
      role: finalRole,
      passwordHash,
      isEmailVerified: true,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      status: 'active',
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    addAuditLog('user_registered', fullName, cleanEmail, `إنشاء حساب جديد بصلاحية ${finalRole}`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;
    if (target.email.toLowerCase() === ownerEmail.toLowerCase() && newRole !== 'owner') {
      alert('لا يمكن تغيير رتبة مالك المنصة الرئيسي.');
      return;
    }

    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    addAuditLog('role_changed', currentUser?.fullName || 'المالك', target.email, `تغيير الرتبة إلى ${newRole}`);
  };

  const toggleUserStatus = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;
    if (target.email.toLowerCase() === ownerEmail.toLowerCase()) {
      alert('لا يمكن تعطيل حساب مالك المنصة الرئيسي.');
      return;
    }

    const nextStatus = target.status === 'active' ? 'disabled' : 'active';
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
    addAuditLog(
      nextStatus === 'disabled' ? 'user_disabled' : 'user_enabled',
      currentUser?.fullName || 'المالك',
      target.email,
      `${nextStatus === 'disabled' ? 'تعطيل' : 'تفعيل'} الحساب`
    );
  };

  const deleteUser = (userId: string) => {
    const target = usersList.find((u) => u.id === userId);
    if (!target) return;
    if (target.email.toLowerCase() === ownerEmail.toLowerCase()) {
      alert('لا يمكن حذف حساب مالك المنصة الرئيسي.');
      return;
    }

    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    addAuditLog('user_disabled', currentUser?.fullName || 'المالك', target.email, 'حذف حساب المستخدم');
  };

  const addAnnouncement = (title: string, message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newAnn: BroadcastAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      type,
      active: true,
      createdAt: Date.now(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('settings_updated', currentUser?.fullName || 'المالك', title, 'إضافة ونشر إعلان عام للأساتذة');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const isOwner = !!currentUser && (currentUser.role === 'owner' || currentUser.email.toLowerCase() === ownerEmail.toLowerCase());
  const isAdmin = isOwner || currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isOwner,
        isAdmin,
        ownerEmail,
        applyOwnerEmail,
        login,
        loginWithGoogle,
        register,
        sendEmailVerificationOtp,
        verifyOtpAndRegister,
        requestPasswordResetOtp,
        resetPasswordWithOtp,
        logout,
        updateProfile,
        changePassword,
        usersList,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        auditLogs,
        addAuditLog,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
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

