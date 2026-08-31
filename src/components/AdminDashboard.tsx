import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  ShieldAlert,
  Users,
  FileText,
  Activity,
  UserCheck,
  UserX,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

interface FirestoreUserRecord {
  id: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  isVerified?: boolean;
  createdAt?: any;
  lastLogin?: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { profile, isOwner } = useAuth();
  const [usersList, setUsersList] = useState<FirestoreUserRecord[]>([]);
  const [totalDocsCount, setTotalDocsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 1. Fetch Users
      const usersQuery = query(collection(db, 'users'), limit(100));
      const usersSnap = await getDocs(usersQuery);
      const users: FirestoreUserRecord[] = [];
      usersSnap.forEach((d) => {
        users.push({ id: d.id, ...d.data() });
      });
      setUsersList(users);

      // 2. Fetch Document Stats
      const docsSnap = await getDocs(collection(db, 'documents'));
      setTotalDocsCount(docsSnap.size);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userRecord: FirestoreUserRecord) => {
    if (!isFirebaseConfigured || !db || userRecord.role === 'OWNER') return;
    const newStatus = userRecord.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    setActionLoading(userRecord.id);

    try {
      const userRef = doc(db, 'users', userRecord.id);
      await updateDoc(userRef, { status: newStatus });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userRecord.id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error('Failed to update user status in Firestore:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Guard: Not Owner
  if (!isOwner) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-3xl text-center shadow-lg" dir="rtl">
        <ShieldAlert className="w-16 h-16 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          منطقة محظورة (غير مصرح)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          لوحة الإدارة متاحة حصرياً لحسابات الإدارة (Owner) ولا تتوفر لحسابات الأساتذة العامة.
        </p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors inline-flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            لوحة الإدارة والمراقبة (Owner Portal)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة حسابات الأساتذة ومراقبة وثائق المنصة مباشرة من Firestore
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          العودة للمنصة
        </button>
      </div>

      {/* Real Statistics Grid (No mock statistics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي المستخدمين</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {loading ? '...' : usersList.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي الوثائق المحفوظة</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {loading ? '...' : totalDocsCount !== null ? totalDocsCount : 'غير متاح'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">حالة قاعدة البيانات</p>
            <p className="text-xs font-bold text-emerald-600">
              {isFirebaseConfigured ? 'Firebase متصل ونشط' : 'قيد التهيئة'}
            </p>
          </div>
        </div>
      </div>

      {/* Users Management Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            سجل مستخدمي المنصة
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم أو البريد..."
              className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                <th className="pb-3">المستخدم</th>
                <th className="pb-3">البريد الإلكتروني</th>
                <th className="pb-3">الدور</th>
                <th className="pb-3">التحقق</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {u.fullName || 'بدون اسم'}
                  </td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'OWNER'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}
                    >
                      {u.role || 'TEACHER'}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.isVerified ? (
                      <span className="text-emerald-600 font-medium text-[11px]">مفعل</span>
                    ) : (
                      <span className="text-amber-600 font-medium text-[11px]">غير مفعل</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'BLOCKED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'
                      }`}
                    >
                      {u.status === 'BLOCKED' ? 'معطل' : 'نشط'}
                    </span>
                  </td>
                  <td className="py-3 text-left">
                    {u.role !== 'OWNER' && (
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        disabled={actionLoading === u.id}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          u.status === 'BLOCKED'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                        {actionLoading === u.id
                          ? '...'
                          : u.status === 'BLOCKED'
                          ? 'تفعيل الحساب'
                          : 'تعطيل الحساب'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد سجلات مطابقة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
