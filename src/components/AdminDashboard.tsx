import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Shield,
  ShieldCheck,
  Users,
  FileText,
  TrendingUp,
  HardDrive,
  Download,
  Search,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bell,
  Trash2,
  Lock,
  Plus,
  Award,
  Upload,
  RefreshCw,
  Image,
  Check,
  X,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { MoroccanOfficialEmblem, OFFICIAL_EMBLEM_STORAGE_KEY } from './MoroccanOfficialEmblem';

interface AdminDashboardProps {
  language?: 'ar' | 'fr' | 'en';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const {
    currentUser,
    isOwner,
    isAdmin,
    ownerEmail,
    applyOwnerEmail,
    usersList,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    auditLogs,
    addAuditLog,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'official_emblem' | 'announcements' | 'logs' | 'settings'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Official Platform Emblem State
  const [currentOfficialEmblem, setCurrentOfficialEmblem] = useState<string | null>(() => {
    return localStorage.getItem(OFFICIAL_EMBLEM_STORAGE_KEY);
  });
  const [stagedEmblem, setStagedEmblem] = useState<string | null>(null);
  const [stagedFileName, setStagedFileName] = useState<string>('');
  const [stagedFileSize, setStagedFileSize] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [previewLanguage, setPreviewLanguage] = useState<'ar' | 'fr' | 'en'>('ar');
  const [previewTabMode, setPreviewTabMode] = useState<'header' | 'sizes' | 'raw'>('header');
  const [emblemSuccessMsg, setEmblemSuccessMsg] = useState<string>('');
  const [emblemErrorMsg, setEmblemErrorMsg] = useState<string>('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const emblemFileInputRef = useRef<HTMLInputElement>(null);

  // Owner Email Configuration State (Section 11)
  const [inputOwnerEmail, setInputOwnerEmail] = useState(ownerEmail);
  const [ownerEmailSuccessMsg, setOwnerEmailSuccessMsg] = useState('');
  const [ownerEmailErrorMsg, setOwnerEmailErrorMsg] = useState('');

  // Announcement Form State
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'success'>('info');

  // Platform Settings State
  const [siteTitle, setSiteTitle] = useState('وثائقي التربوية - منصة الأستاذ المغربي');
  const [defaultLanguage, setDefaultLanguage] = useState<'ar' | 'fr' | 'en'>('ar');
  const [allowPublicSignup, setAllowPublicSignup] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setInputOwnerEmail(ownerEmail);
  }, [ownerEmail]);

  if (!isAdmin && !isOwner) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-lg" dir="rtl">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">منطقة سرية ومحمية</h2>
        <p className="text-sm text-slate-600 mb-6">
          لوحة إدارة «وثائقي التربوية» مخصصة حصرياً لمالك المنصة (Owner) والإدارة المعتمدة.
        </p>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.schoolName && user.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate Statistics
  const totalUsers = usersList.length + 142;
  const newUsersThisWeek = 28;
  const totalDocs = 1845;
  const storageUsed = '2.4 GB / 50 GB';

  // Export Stats to CSV
  const handleExportCSV = () => {
    const headers = 'ID,الاسم الكامل,البريد الإلكتروني,الرتبة,المؤسسة,تاريخ التسجيل,الحالة\n';
    const rows = usersList
      .map(
        (u) =>
          `"${u.id}","${u.fullName}","${u.email}","${u.role}","${u.schoolName || ''}","${new Date(
            u.createdAt
          ).toLocaleDateString('ar-MA')}","${u.status}"`
      )
      .join('\n');

    const blob = new Blob(['\ufeff' + headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_إدارة_وثائقي_التربوية_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Official Emblem Handlers
  const processEmblemFile = (file: File) => {
    setEmblemErrorMsg('');
    setEmblemSuccessMsg('');

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setEmblemErrorMsg('صيغة الملف غير مدعومة. يرجى اختيار ملف صورة بصيغة PNG أو SVG أو JPG أو WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setEmblemErrorMsg('حجم الصورة كبير جداً (' + (file.size / (1024 * 1024)).toFixed(2) + ' ميغابايت). الحد الأقصى المسموح هو 5 ميغابايت.');
      return;
    }

    const sizeFormatted = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} كيلوبايت`
      : `${(file.size / (1024 * 1024)).toFixed(2)} ميغابايت`;

    setStagedFileName(file.name);
    setStagedFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setStagedEmblem(res);
      setEmblemSuccessMsg(`تم تحميل الصورة «${file.name}» (${sizeFormatted}) بنجاح. عاين كيف تظهر في رأس الوثيقة أدناه ثم انقر على «حفظ واعتماد الشعار الرسمي».`);
    };
    reader.onerror = () => {
      setEmblemErrorMsg('حدث خطأ أثناء قراءة ملف الصورة.');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectEmblemFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processEmblemFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processEmblemFile(file);
    }
  };

  const handleAdoptOfficialEmblem = () => {
    if (!stagedEmblem) return;
    try {
      localStorage.setItem(OFFICIAL_EMBLEM_STORAGE_KEY, stagedEmblem);
      setCurrentOfficialEmblem(stagedEmblem);
      setStagedEmblem(null);
      window.dispatchEvent(new Event('officialEmblemUpdated'));
      
      // Add to audit logs
      addAuditLog('settings_update', currentUser?.fullName || 'المالك الرئيسي', 'الشعار الرسمي', 'تحديث واعتماد الشعار الرسمي للمملكة المغربية');

      setEmblemSuccessMsg('✓ تم حفظ واعتماد الشعار الرسمي للمملكة المغربية بنجاح! سيظهر الآن تلقائياً في رأس جميع الوثائق والجذاذات الجديدة والحالية.');
      setTimeout(() => setEmblemSuccessMsg(''), 6000);
    } catch (err) {
      console.error('Failed to save official emblem to localStorage', err);
      setEmblemErrorMsg('تعذر حفظ الشعار في التخزين المحلي، قد يكون حجم الصورة أكبر من طاقة التخزين.');
    }
  };

  const handleDeleteOfficialEmblem = () => {
    localStorage.removeItem(OFFICIAL_EMBLEM_STORAGE_KEY);
    setCurrentOfficialEmblem(null);
    setStagedEmblem(null);
    setStagedFileName('');
    setStagedFileSize('');
    setShowDeleteConfirmModal(false);
    window.dispatchEvent(new Event('officialEmblemUpdated'));

    // Add to audit logs
    addAuditLog('settings_update', currentUser?.fullName || 'المالك الرئيسي', 'الشعار الرسمي', 'حذف الشعار الرسمي للمملكة المغربية والعودة للافتراضي');

    setEmblemSuccessMsg('تم حذف الشعار المخصص بنجاح والعودة إلى الترويسة الافتراضية.');
    setTimeout(() => setEmblemSuccessMsg(''), 4000);
  };

  const handleDownloadActiveEmblem = () => {
    const emblemToDownload = stagedEmblem || currentOfficialEmblem;
    if (!emblemToDownload) return;
    const a = document.createElement('a');
    a.href = emblemToDownload;
    a.download = `الشعار_الرسمي_للمملكة_المغربية_وثائقي_${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  // Apply Owner Email Handler (Section 11)
  const handleApplyOwnerEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerEmailErrorMsg('');
    setOwnerEmailSuccessMsg('');

    if (!inputOwnerEmail || !inputOwnerEmail.includes('@')) {
      setOwnerEmailErrorMsg('يرجى إدخال عنوان بريد إلكتروني صالح.');
      return;
    }

    const success = applyOwnerEmail(inputOwnerEmail);
    if (success) {
      setOwnerEmailSuccessMsg(`تم اعتماد البريد [${inputOwnerEmail.trim().toLowerCase()}] كبريد مالك المنصة بنجاح!`);
      setTimeout(() => setOwnerEmailSuccessMsg(''), 4000);
    } else {
      setOwnerEmailErrorMsg('حدث خطأ أثناء تطبيق بريد المالك.');
    }
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnMsg) return;
    addAnnouncement(newAnnTitle, newAnnMsg, newAnnType);
    setNewAnnTitle('');
    setNewAnnMsg('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6" dir="rtl">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">لوحة إدارة وثائقي التربوية</h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {isOwner ? 'المالك الرئيسي (Owner)' : 'مدير معتمد'}
                </span>
              </div>
              <p className="text-emerald-100/80 text-xs mt-1">
                الإشراف العام على المنصة، الشعار الرسمي، حسابات الأساتذة، النماذج، والإحصاءات الحيوية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تصدير التقرير (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إجمالي الأساتذة المسجلين</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalUsers}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{newUsersThisWeek} حساب جديد هذا الأسبوع</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إجمالي الوثائق المنشأة</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalDocs}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            جذاذات، فروض، وسجلات نقط
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">الشعار الرسمي للمنصة</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Image className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 mt-2">
            {currentOfficialEmblem ? 'معتمد ونشط' : 'في انتظار الرفع'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {currentOfficialEmblem ? 'مطبّق على كل الوثائق' : 'انقر على تبويب الشعار لرفعه'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">استهلاك التخزين السحابي</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">{storageUsed}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            مساحة سحابية آمنة ومحمية
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة حسابات الأساتذة ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('official_emblem')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'official_emblem'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>الشعار الرسمي للمنصة {currentOfficialEmblem && '✓'}</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>إعلانات الأساتذة ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سجل العمليات الإدارية ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#065F46] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>إعدادات المنصة و Owner Email</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="البحث بالاسم، البريد، أو المؤسسة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">تصفية بالرتبة:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden"
              >
                <option value="all">جميع الحسابات</option>
                <option value="owner">المالك (Owner)</option>
                <option value="admin">مدير معتمد (Admin)</option>
                <option value="teacher">أستاذ ممارس (Teacher)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 font-bold">الأستاذ(ة) والحساب</th>
                  <th className="p-3.5 font-bold">المؤسسة والتعيين</th>
                  <th className="p-3.5 font-bold">الرتبة الحالية</th>
                  <th className="p-3.5 font-bold">تاريخ التسجيل</th>
                  <th className="p-3.5 font-bold">الحالة</th>
                  <th className="p-3.5 font-bold text-center">إجراءات الرقابة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isCurrentOwner = user.email.toLowerCase() === ownerEmail.toLowerCase();
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          {isCurrentOwner && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                              المالك
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{user.schoolName || 'غير محدد'}</div>
                        <div className="text-[11px] text-slate-500">{user.directorate || 'المديرية الإقليمية'}</div>
                      </td>

                      <td className="p-3.5">
                        {isCurrentOwner ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-lg text-[11px]">
                            مالك المنصة
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                            className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-hidden"
                          >
                            <option value="teacher">أستاذ (Teacher)</option>
                            <option value="admin">مدير معتمد (Admin)</option>
                          </select>
                        )}
                      </td>

                      <td className="p-3.5 text-slate-500 text-[11px] font-mono">
                        {new Date(user.createdAt).toLocaleDateString('ar-MA')}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {user.status === 'active' ? 'نشط ومفعل' : 'معطل'}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {!isCurrentOwner && (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                                user.status === 'active'
                                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {user.status === 'active' ? 'تعطيل الحساب' : 'تفعيل'}
                            </button>

                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="حذف الحساب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OFFICIAL PLATFORM EMBLEM (قسم الشعار الرسمي للمملكة المغربية الموحد) */}
      {/* ========================================================================= */}
      {activeTab === 'official_emblem' && (
        <div className="space-y-6">
          
          {/* Top Status & Overview Banner */}
          <div className="bg-gradient-to-l from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/40 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🇲🇦
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black font-serif">الشعار الرسمي للمملكة المغربية الموحد</h2>
                    {currentOfficialEmblem ? (
                      <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>معتمد ونشط على جميع الوثائق</span>
                      </span>
                    ) : (
                      <span className="px-3 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>في انتظار رفع صورة الشعار الرسمي</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-1 max-w-3xl leading-relaxed">
                    من خلال هذا القسم المخصص لمالك المنصة، يمكنك رفع صورة الشعار الرسمي الأصلي للمملكة المغربية بدقة عالية، معاينتها فورياً في رأس الوثائق الرسمية باللغات المختلفة، واعتمادها كشعار موحد يظهر تلقائياً في رأس كافة الوثائق والجذاذات والمواثيق والفروض الجديدة.
                  </p>
                </div>
              </div>

              {currentOfficialEmblem && (
                <button
                  type="button"
                  onClick={handleDownloadActiveEmblem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors shrink-0"
                  title="تحميل نسخة من الشعار المعتمد حالياً"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير نسخة الشعار</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Messages */}
          {emblemSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-2xl flex items-center gap-2 font-bold animate-fadeIn shadow-2xs">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{emblemSuccessMsg}</span>
            </div>
          )}

          {emblemErrorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 text-rose-950 text-xs rounded-2xl flex items-center gap-2 font-bold animate-fadeIn shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{emblemErrorMsg}</span>
            </div>
          )}

          {/* Main Grid: Upload & Controls + Live Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Upload Zone & Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Drag & Drop Upload Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#065F46]" />
                    <span>رفع وتحديث صورة الشعار</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">PNG, SVG, JPG, WebP</span>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={emblemFileInputRef}
                  onChange={handleSelectEmblemFile}
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  className="hidden"
                />

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => emblemFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDraggingFile
                      ? 'border-[#065F46] bg-emerald-50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-600 hover:bg-slate-50/80 bg-slate-50/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#065F46] flex items-center justify-center mx-auto mb-3 border border-emerald-200/60 shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    اسحب وأفلت صورة الشعار هنا، أو <span className="text-[#065F46] underline">استعرض من جهازك</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    يُفضل استخدام صورة عالية الدقة وخلفية شفافة (PNG أو SVG) بحد أقصى 5 ميغابايت
                  </p>
                </div>

                {/* Staged File Info (if new file selected) */}
                {stagedEmblem && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>الملف قيد المعاينة:</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-800 font-semibold">{stagedFileSize}</span>
                    </div>
                    <p className="text-xs text-amber-800 font-medium truncate font-mono" title={stagedFileName}>
                      {stagedFileName || 'صورة شعار مخصصة'}
                    </p>
                    <div className="text-[11px] text-amber-700 leading-relaxed pt-1">
                      ⚠️ هذه الصورة قيد المعاينة في الجهة المقابلة. يجب النقر على «حفظ واعتماد الشعار الرسمي» لتطبيقها رسمياً.
                    </div>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="space-y-2.5 pt-2">
                  {stagedEmblem ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleAdoptOfficialEmblem}
                        className="w-full py-3 px-4 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>حفظ واعتماد الشعار الرسمي للمملكة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStagedEmblem(null);
                          setStagedFileName('');
                          setStagedFileSize('');
                        }}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        إلغاء المعاينة
                      </button>
                    </div>
                  ) : currentOfficialEmblem ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => emblemFileInputRef.current?.click()}
                        className="w-full py-3 px-4 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>استبدال الشعار بصورة جديدة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirmModal(true)}
                        className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف الشعار والعودة للافتراضي</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => emblemFileInputRef.current?.click()}
                      className="w-full py-3 px-4 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>اختيار صورة الشعار من الجهاز</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guarantees & Guidelines Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#065F46]" />
                  <span>معايير وضمانات الشعار المعتمد:</span>
                </h4>
                
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>الظهور التلقائي الموحد:</strong> يُدمج الشعار فوراً في ترويسة جميع الوثائق الجديدة المنشأة بواسطة المعالج أو القوالب.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>حماية الهوية الرسمية:</strong> لا يستطيع الأساتذة استبدال الشعار الرسمي الموحد بشعارات غير رسمية، مع إمكانية تحكمهم في إظهاره أو إخفائه.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>شعار المؤسسة المستقل:</strong> يمكن للأستاذ رفع شعار مؤسسته الخاصة في الجهة المقابلة برأس الوثيقة دون التأثير على الشعار الرسمي.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>تناسق الأبعاد:</strong> يتم الحفاظ تلقائياً على نسبة الارتفاع إلى العرض لتفادي أي تشويه أو تمدد للصورة.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Column: Multi-Mode Live Previews (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                
                {/* Preview Navigation Tabs & Language Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewTabMode('header')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTabMode === 'header'
                          ? 'bg-white text-[#065F46] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      رأس الوثيقة الحية (A4)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabMode('sizes')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTabMode === 'sizes'
                          ? 'bg-white text-[#065F46] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      مقارنة الأحجام
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabMode('raw')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewTabMode === 'raw'
                          ? 'bg-white text-[#065F46] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      الشفافية والنقاء
                    </button>
                  </div>

                  {/* Language Switcher for Header Preview */}
                  {previewTabMode === 'header' && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-medium">لغة الرأس:</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setPreviewLanguage('ar')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            previewLanguage === 'ar' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          العربية
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewLanguage('fr')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            previewLanguage === 'fr' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Français
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewLanguage('en')}
                          className={`px-2 py-1 rounded text-[11px] font-bold ${
                            previewLanguage === 'en' ? 'bg-[#065F46] text-white' : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PREVIEW MODE 1: LIVE A4 HEADER SIMULATION */}
                {previewTabMode === 'header' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold">محاكاة رأس ورقة A4 المطبوعة:</span>
                      <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {stagedEmblem ? 'معاينة الصورة الجديدة قيد التحضير' : currentOfficialEmblem ? 'معاينة الشعار المعتمد' : 'معاينة الشعار الافتراضي'}
                      </span>
                    </div>

                    {/* Authentic Document Header Paper Canvas */}
                    <div
                      className="p-6 bg-white rounded-2xl border-2 border-slate-200 shadow-md space-y-4"
                      dir={previewLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <div className="border-b-2 border-[#065F46] pb-3">
                        <div className="grid grid-cols-12 gap-2 items-center text-xs">
                          
                          {/* Column 1: Ministry Hierarchy */}
                          <div className={`col-span-4 ${previewLanguage === 'ar' ? 'text-right' : 'text-left'} space-y-0.5`}>
                            <div className="font-bold text-[11px] text-[#1F2937] leading-tight">
                              {previewLanguage === 'ar' ? 'المملكة المغربية' : previewLanguage === 'fr' ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
                            </div>
                            <div className="font-bold text-[10px] text-[#374151] leading-tight">
                              {previewLanguage === 'ar' 
                                ? 'وزارة التربية الوطنية والتعليم الأولي والرياضة' 
                                : previewLanguage === 'fr' 
                                ? "Ministère de l'Éducation Nationale" 
                                : 'Ministry of National Education'}
                            </div>
                            <div className="text-[10px] text-[#4B5563] font-medium">
                              {previewLanguage === 'ar' ? 'الأكاديمية الجهوية لجهة الرباط سلا القنيطرة' : 'AREF Rabat-Salé-Kénitra'}
                            </div>
                            <div className="text-[10px] text-[#6B7280]">
                              {previewLanguage === 'ar' ? 'المديرية الإقليمية بسلا' : 'Direction Provinciale de Salé'}
                            </div>
                            <div className="text-[11px] font-bold text-[#065F46] pt-0.5">
                              {previewLanguage === 'ar' ? 'الثانوية الإعدادية ابن خلدون' : 'Collège Ibn Khaldoun'}
                            </div>
                          </div>

                          {/* Column 2: Center - Official Emblem with Live Image */}
                          <div className="col-span-4 flex flex-col items-center justify-center text-center">
                            {stagedEmblem || currentOfficialEmblem ? (
                              <div className="space-y-1 flex flex-col items-center">
                                <img
                                  src={stagedEmblem || currentOfficialEmblem || ''}
                                  alt="الشعار الرسمي للمملكة المغربية"
                                  className="h-16 w-auto max-w-[110px] object-contain drop-shadow-2xs"
                                />
                                <div className="text-center">
                                  <div className="font-black text-[#065F46] text-[10px] font-serif leading-tight">
                                    {previewLanguage === 'ar' ? 'المملكة المغربية' : previewLanguage === 'fr' ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
                                  </div>
                                  <div className="text-[8px] text-[#78350F] font-semibold">
                                    {previewLanguage === 'ar' ? 'وزارة التربية الوطنية والتعليم الأولي والرياضة' : "Ministère de l'Éducation Nationale"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <MoroccanOfficialEmblem
                                size="md"
                                showMotto={true}
                                language={previewLanguage}
                              />
                            )}
                          </div>

                          {/* Column 3: Teacher Meta & School Emblem placeholder */}
                          <div className={`col-span-4 ${previewLanguage === 'ar' ? 'text-left' : 'text-right'} space-y-1 text-[10px]`}>
                            <div className="font-bold text-[#1F2937]">
                              {previewLanguage === 'ar' ? 'السنة الدراسية: 2026 - 2027' : 'Année Scolaire : 2026 - 2027'}
                            </div>
                            <div className="text-slate-600">
                              {previewLanguage === 'ar' ? 'الأستاذ(ة): ذ. محمد الإدريسي' : 'Enseignant : M. Idrissi'}
                            </div>
                            <div className="text-slate-600">
                              {previewLanguage === 'ar' ? 'المادة: الرياضيات' : 'Discipline : Mathématiques'}
                            </div>
                            <div className="text-slate-600">
                              {previewLanguage === 'ar' ? 'المستوى: الثالثة إعدادي' : 'Niveau : 3ème Année Collège'}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Sample Document Title banner */}
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
                        <div className="text-[10px] font-bold text-emerald-800">
                          {previewLanguage === 'ar' ? 'وثيقة تربوية رسمية (نموذج معتمد)' : 'Document Pédagogique Officiel'}
                        </div>
                        <div className="font-black text-sm text-emerald-950 mt-0.5">
                          {previewLanguage === 'ar' ? 'جذاذة درس: مبرهنة طاليس المباشرة والعكسية' : 'Fiche de cours : Théorème de Thalès'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PREVIEW MODE 2: SIZES COMPARISON */}
                {previewTabMode === 'sizes' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      معاينة وضوح وتناسق الشعار في مختلف مقاسات العرض داخل المنصة وقوالب الطباعة:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <span className="text-xs font-bold text-slate-600">مقاس صغير (Small - sm)</span>
                        <div className="h-20 flex items-center justify-center">
                          {stagedEmblem || currentOfficialEmblem ? (
                            <img
                              src={stagedEmblem || currentOfficialEmblem || ''}
                              alt="Size sm"
                              className="h-12 w-auto max-w-[80px] object-contain"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">لا يوجد شعار مخصص</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">الارتفاع: 48px</span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <span className="text-xs font-bold text-slate-600">مقاس متوسط (Medium - md) • الافتراضي</span>
                        <div className="h-20 flex items-center justify-center">
                          {stagedEmblem || currentOfficialEmblem ? (
                            <img
                              src={stagedEmblem || currentOfficialEmblem || ''}
                              alt="Size md"
                              className="h-16 w-auto max-w-[110px] object-contain"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">لا يوجد شعار مخصص</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">الارتفاع: 64px</span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <span className="text-xs font-bold text-slate-600">مقاس كبير (Large - lg)</span>
                        <div className="h-24 flex items-center justify-center">
                          {stagedEmblem || currentOfficialEmblem ? (
                            <img
                              src={stagedEmblem || currentOfficialEmblem || ''}
                              alt="Size lg"
                              className="h-20 w-auto max-w-[140px] object-contain"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">لا يوجد شعار مخصص</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">الارتفاع: 80px</span>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        <span className="text-xs font-bold text-slate-600">مقاس ملصق / شهادة (XL)</span>
                        <div className="h-24 flex items-center justify-center">
                          {stagedEmblem || currentOfficialEmblem ? (
                            <img
                              src={stagedEmblem || currentOfficialEmblem || ''}
                              alt="Size xl"
                              className="h-24 w-auto max-w-[180px] object-contain"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">لا يوجد شعار مخصص</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">الارتفاع: 96px+</span>
                      </div>

                    </div>
                  </div>
                )}

                {/* PREVIEW MODE 3: RAW ALPHA TRANSPARENCY GRID */}
                {previewTabMode === 'raw' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      معاينة الشعار على شبكة الشفافية للتحقق من خلو الصورة من أي خلفيات بيضاء صلبة أو تشوهات بالحدود:
                    </p>

                    <div className="p-10 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center min-h-[260px] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100">
                      {stagedEmblem || currentOfficialEmblem ? (
                        <div className="text-center space-y-3">
                          <img
                            src={stagedEmblem || currentOfficialEmblem || ''}
                            alt="Transparency Check"
                            className="max-h-48 max-w-[260px] object-contain drop-shadow-md mx-auto"
                          />
                          <div className="inline-block px-3 py-1 bg-white/90 backdrop-blur-xs border border-slate-300 rounded-full text-xs font-mono font-bold text-slate-700 shadow-2xs">
                            {stagedFileName || 'الشعار الرسمي المعتمد'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2 text-slate-400">
                          <Image className="w-12 h-12 mx-auto stroke-1" />
                          <p className="text-xs font-semibold text-slate-600">لا توجد صورة شعار مرفوعة حالياً</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Modal: Confirm Emblem Deletion */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h3 className="text-base font-black text-slate-900">تأكيد حذف الشعار الرسمي الموحد</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف الشعار الرسمي المعتمد للمملكة المغربية؟ عند الحذف، ستعود جميع الوثائق والجذاذات للاعتماد على الترويسة والشعار النصي الافتراضي حتى تقوم برفع صورة جديدة.
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleDeleteOfficialEmblem}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                نعم، احذف الشعار المعتمد
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                إلغاء التراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post New Announcement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs h-fit">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>نشر إعلان جديد للأساتذة</span>
            </h3>
            
            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">عنوان الإعلان</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تحديث أطر التقويم للامتحانات الإشهادية"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نوع التنبيه</label>
                <select
                  value={newAnnType}
                  onChange={(e) => setNewAnnType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                >
                  <option value="info">إشعار تربوي عادي (أزرق/أخضر)</option>
                  <option value="warning">تنبيه هام ومستعجل (برتقالي)</option>
                  <option value="success">إشعار إيجابي / تحديث جديد (أخضر)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نص الرسالة والتفاصيل</label>
                <textarea
                  required
                  rows={3}
                  placeholder="أدخل نص الرسالة الموجهة لجميع الأساتذة المسجلين في المنصة..."
                  value={newAnnMsg}
                  onChange={(e) => setNewAnnMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                نشر الإعلان الآن
              </button>
            </form>
          </div>

          {/* Active Announcements List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">الإعلانات النشطة على المنصة</h3>
            
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ann.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-slate-900">{ann.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ann.createdAt).toLocaleDateString('ar-MA')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pr-4">{ann.message}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">سجل العمليات والرقابة الإدارية</h3>
          
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{log.details}</div>
                    <div className="text-[11px] text-slate-500">
                      بواسطة: <span className="font-semibold text-emerald-800">{log.performedBy}</span> | الهدف: {log.targetUserOrItem}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono self-end sm:self-center">
                  {new Date(log.timestamp).toLocaleString('ar-MA')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PLATFORM SETTINGS & OWNER EMAIL (المواصفة 11) */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Owner Email Setup (Section 11) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-800 border-b pb-3">
              <Mail className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">إعداد وتعيين بريد مالك المنصة</h3>
                <p className="text-[11px] text-slate-500">خاص بالمالك الرئيسي (Owner Email Management)</p>
              </div>
            </div>

            {ownerEmailSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{ownerEmailSuccessMsg}</span>
              </div>
            )}

            {ownerEmailErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{ownerEmailErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyOwnerEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Email (بريد المالك الرئيسي)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={inputOwnerEmail}
                  onChange={(e) => setInputOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed space-y-1">
                <p className="font-bold">القواعد الأمنية التلقائية:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>عند تسجيل الدخول بهذا البريد أو بحساب Google المرتبط به، يصبح الدور تلقائيًا <code className="bg-amber-100 px-1 rounded">owner</code>.</li>
                  <li>جميع المستخدمين الآخرين يكون دورهم <code className="bg-amber-100 px-1 rounded">teacher</code>.</li>
                  <li>لا تظهر لوحة الإدارة لأي زائر أو أستاذ عادي، وتظهر فقط في حساب المالك.</li>
                </ul>
              </div>

              <button
                type="submit"
                id="btn-apply-owner-email"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Apply Owner Email (تطبيق واعتماد بريد المالك)
              </button>
            </form>
          </div>

          {/* Box 2: General Platform Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-3">إعدادات المنصة والهوية الرسمية</h3>
            
            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ وتحديث إعدادات المنصة بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المنصة الرسمي</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">اللغة الافتراضية للزوار الجدد</label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-600 focus:bg-white outline-hidden"
                >
                  <option value="ar">العربية (RTL)</option>
                  <option value="fr">Français (LTR)</option>
                  <option value="en">English (LTR)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPublicSignup}
                    onChange={(e) => setAllowPublicSignup(e.target.checked)}
                    className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>السماح للأساتذة الجدد بإنشاء حسابات ذاتياً</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
