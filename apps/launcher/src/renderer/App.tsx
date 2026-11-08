import React, { useState, useEffect } from 'react';
import { Button, Card } from '@officex/ui';
import { 
  IconWord, IconExcel, IconPowerpoint, IconSettings, IconFileText, 
  IconPlus, IconFolderOpen, IconBot 
} from '@officex/icons';
import { 
  Search, Sparkles, Clock, Folder, HardDrive, FileSpreadsheet, 
  Presentation, FileText, ArrowRight, Upload, Star, ChevronRight,
  ExternalLink, Layers, Download, CheckCircle2, Trash2, Monitor,
  Package, ShieldCheck, AppWindow, RefreshCw, FolderDown, Laptop,
  User, Lock, Mail, Key, LogOut, Crown, Timer, AlertTriangle,
  Calendar, Zap, CreditCard, ShieldAlert, Check, X,
  UserCheck, UserX, UserMinus, Users, PlusCircle, Ban,
  Award, Printer, Copy, FileCheck, QrCode
} from 'lucide-react';
import '@officex/theme/dist/index.css';

const getIPC = () => (window as any).ipc || (window as any).electronAPI;

const launchApp = (appId: string, filePath?: string) => {
  const ipc = getIPC();
  if (ipc) {
    if (typeof ipc.launchApp === 'function') {
      ipc.launchApp(filePath ? { appId, filePath } : appId);
    } else {
      ipc.invoke('launch-app', filePath ? { appId, filePath } : appId);
    }
  } else {
    console.warn(`Cannot launch ${appId}, IPC not available.`);
  }
};

const openSettings = () => {
  const ipc = getIPC();
  if (ipc) {
    if (typeof ipc.openSettings === 'function') {
      ipc.openSettings();
    } else {
      ipc.invoke('open-settings');
    }
  } else {
    console.warn('Cannot open settings, IPC not available.');
  }
};

const openNativeFileDialog = async () => {
  const ipc = getIPC();
  if (!ipc) {
    alert('IPC không khả dụng.');
    return;
  }
  try {
    const res = await ipc.invoke('dialog:showOpenDialog', {
      title: 'Mở tệp tài liệu OfficeX',
      properties: ['openFile'],
      filters: [
        { name: 'Tất cả tài liệu OfficeX', extensions: ['docx', 'xlsx', 'pptx', 'oxdoc', 'txt', 'json'] },
        { name: 'Tài liệu Word (*.docx)', extensions: ['docx', 'doc'] },
        { name: 'Bảng tính Excel (*.xlsx)', extensions: ['xlsx', 'xls', 'csv'] },
        { name: 'Bài thuyết trình PowerPoint (*.pptx)', extensions: ['pptx', 'ppt'] },
        { name: 'Tất cả tệp (*.*)', extensions: ['*'] }
      ]
    });
    if (res && !res.canceled && res.filePaths && res.filePaths.length > 0) {
      const filePath = res.filePaths[0];
      const ext = filePath.split('.').pop()?.toLowerCase();
      let app = 'word';
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') app = 'excel';
      else if (ext === 'pptx' || ext === 'ppt') app = 'powerpoint';
      launchApp(app, filePath);
    }
  } catch (err) {
    console.error('Lỗi khi mở File Dialog:', err);
  }
};

type NavTab = 'home' | 'apps' | 'new' | 'open';

// ─── Templates Definition ─────────────────────────────────────────────────────
interface TemplateItem {
  id: string;
  title: string;
  app: 'word' | 'excel' | 'powerpoint';
  category: string;
  desc: string;
  badge?: string;
  color: string;
  icon: any;
}

const TEMPLATES: TemplateItem[] = [
  // Word Templates
  { id: 'w_blank', title: 'Tài liệu trống', app: 'word', category: 'word', desc: 'Bắt đầu với một trang tài liệu trắng', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: IconWord },
  { id: 'w_report', title: 'Báo cáo dự án', app: 'word', category: 'word', desc: 'Mẫu báo cáo chuyên nghiệp với mục lục & bảng biểu', badge: 'Phổ biến', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: IconWord },
  { id: 'w_resume', title: 'Sơ yếu lý lịch (CV)', app: 'word', category: 'word', desc: 'Thiết kế hiện đại, ấn tượng cho hồ sơ xin việc', badge: 'Mới', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: IconWord },
  { id: 'w_proposal', title: 'Đề xuất kinh doanh', app: 'word', category: 'word', desc: 'Bản kế hoạch tài chính và chiến lược kinh doanh', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: IconWord },
  
  // Excel Templates
  { id: 'e_blank', title: 'Sổ làm việc trống', app: 'excel', category: 'excel', desc: 'Bắt đầu với một bảng tính dữ liệu mới', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: IconExcel },
  { id: 'e_finance', title: 'Báo cáo tài chính', app: 'excel', category: 'excel', desc: 'Bảng theo dõi thu chi, doanh thu và lợi nhuận', badge: 'Hot', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: IconExcel },
  { id: 'e_budget', title: 'Quản lý ngân sách', app: 'excel', category: 'excel', desc: 'Biểu đồ phân bổ chi phí và hạn mức chi tiêu', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: IconExcel },
  { id: 'e_inventory', title: 'Quản lý kho hàng', app: 'excel', category: 'excel', desc: 'Kiểm kê số lượng hàng hoá, giá vốn và tồn kho', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: IconExcel },
  
  // PowerPoint Templates
  { id: 'p_blank', title: 'Bản trình bày trống', app: 'powerpoint', category: 'powerpoint', desc: 'Bắt đầu với một slide thuyết trình trắng', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: IconPowerpoint },
  { id: 'p_pitch', title: 'Startup Pitch Deck', app: 'powerpoint', category: 'powerpoint', desc: 'Bộ slide gọi vốn nhà đầu tư chuẩn quốc tế', badge: 'AI Ready', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: IconPowerpoint },
  { id: 'p_marketing', title: 'Chiến dịch Marketing', app: 'powerpoint', category: 'powerpoint', desc: 'Kế hoạch truyền thông, phân tích kênh & KPI', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: IconPowerpoint },
  { id: 'p_portfolio', title: 'Portfolio cá nhân', app: 'powerpoint', category: 'powerpoint', desc: 'Trình chiếu dự án nổi bật và kỹ năng chuyên môn', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: IconPowerpoint },
];

const RECENT_DOCUMENTS = [
  { id: '1', title: 'Kế hoạch phát triển sản phẩm Q4.docx', app: 'word', time: '10 phút trước', size: '245 KB' },
  { id: '2', title: 'Bảng tính doanh thu & chi phí 2026.xlsx', app: 'excel', time: '1 giờ trước', size: '1.2 MB' },
  { id: '3', title: 'Thuyết trình chiến lược kinh doanh.pptx', app: 'powerpoint', time: 'Hôm qua', size: '4.8 MB' },
  { id: '4', title: 'Báo cáo nghiên cứu thị trường.docx', app: 'word', time: '3 ngày trước', size: '890 KB' },
];

interface AppMetadata {
  id: string;
  name: string;
  title: string;
  ext: string;
  desc: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  icon: any;
  size: string;
  fileExts: string;
}

const APPS_LIST: AppMetadata[] = [
  {
    id: 'word',
    name: 'Word',
    title: 'Workplace Word',
    ext: '.DOCX',
    desc: 'Soạn thảo văn bản, báo cáo và đề án chuyên nghiệp',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    textColor: 'text-blue-400',
    icon: IconWord,
    size: '135 MB',
    fileExts: '.docx, .doc, .dotx',
  },
  {
    id: 'excel',
    name: 'Excel',
    title: 'Workplace Excel',
    ext: '.XLSX',
    desc: 'Bảng tính, công thức tự động và biểu đồ dữ liệu',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/20',
    textColor: 'text-green-400',
    icon: IconExcel,
    size: '148 MB',
    fileExts: '.xlsx, .xls, .csv',
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint',
    title: 'Workplace PowerPoint',
    ext: '.PPTX',
    desc: 'Thiết kế slide trình chiếu, hiệu ứng và AI Generator',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/20',
    textColor: 'text-orange-400',
    icon: IconPowerpoint,
    size: '142 MB',
    fileExts: '.pptx, .ppt, .potx',
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    title: 'Workplace AI Assistant',
    ext: 'AI BOT',
    desc: 'Trợ lý sáng tạo, phân tích tài liệu và viết nội dung',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    textColor: 'text-purple-400',
    icon: IconBot,
    size: '98 MB',
    fileExts: 'Tích hợp Copilot',
  },
];

// Available Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'trial_3d',
    name: 'Dùng thử 3 Ngày',
    durationDays: 3,
    price: '0 VNĐ',
    badge: 'MIỄN PHÍ',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Trải nghiệm trọn bộ 4 ứng dụng (Word, Excel, PPT, AI), tự động gỡ sạch sau 3 ngày.',
    features: ['Đầy đủ tính năng cao cấp', 'Cài đặt trực tiếp vào Windows PC', 'Tự động gỡ sạch khi hết hạn'],
  },
  {
    id: '1m',
    name: 'Gói 1 Tháng',
    durationDays: 30,
    price: '99.000 VNĐ',
    period: '/ tháng',
    badge: 'CÁ NHÂN',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    desc: 'Phù hợp làm việc ngắn hạn, làm dự án hoặc thử nghiệm tính năng đầy đủ.',
    features: ['Mở khóa 30 ngày sử dụng', 'AI Assistant không giới hạn', 'Hỗ trợ kỹ thuật 24/7'],
  },
  {
    id: '3m',
    name: 'Gói 3 Tháng',
    durationDays: 90,
    price: '269.000 VNĐ',
    period: '/ 3 tháng',
    badge: 'PHỔ BIẾN',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    desc: 'Lựa chọn tiêu chuẩn, tiết kiệm 10% chi phí so với mua từng tháng.',
    features: ['Tiết kiệm 10% chi phí', 'Sao lưu & Khôi phục thông minh', 'Kích hoạt trên 2 máy tính'],
  },
  {
    id: '6m',
    name: 'Gói 6 Tháng',
    durationDays: 180,
    price: '499.000 VNĐ',
    period: '/ 6 tháng',
    badge: 'TIẾT KIỆM',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    desc: 'Dành cho văn phòng và nhóm làm việc, tiết kiệm 15% chi phí.',
    features: ['Tiết kiệm 15% chi phí', 'Bộ nhớ đệm AI mở rộng', 'Kích hoạt trên 3 máy tính'],
  },
  {
    id: '1y',
    name: 'Gói 1 Năm VIP',
    durationDays: 365,
    price: '899.000 VNĐ',
    period: '/ năm',
    badge: 'TỐI ƯU NHẤT',
    badgeColor: 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-yellow-300 border-yellow-500/40',
    isBestValue: true,
    desc: 'Trọn gói 365 ngày VIP không giới hạn, chỉ ~74.000 VNĐ / tháng.',
    features: ['Tiết kiệm tối đa 25%', 'Toàn bộ tính năng cao cấp nhất', 'Bảo hành bản quyền 365 ngày', 'Không giới hạn thiết bị'],
  },
];

export const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'apps' | 'new' | 'open' | 'admin'>('home');
  const [newFilter, setNewFilter] = useState<'all' | 'word' | 'excel' | 'powerpoint'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // App installation state
  const [appStatus, setAppStatus] = useState<Record<string, any>>({});
  const [loadingApp, setLoadingApp] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);

  // User Auth & Subscription state
  const [licenseStatus, setLicenseStatus] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'register' | 'login' | 'upgrade'>('register');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    password: '',
    planId: 'trial_3d' as 'trial_3d' | '1m' | '3m' | '6m' | '1y',
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Management state
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all');

  const fetchAdminUsers = async () => {
    const ipc = getIPC();
    if (ipc) {
      setAdminLoading(true);
      try {
        const users = await ipc.invoke('license:admin:getUsers');
        if (Array.isArray(users)) {
          setAdminUsers(users);
        }
      } catch (err) {
        console.warn('Could not fetch admin users:', err);
      } finally {
        setAdminLoading(false);
      }
    }
  };

  const handleApproveUser = async (userId: string, planId?: string) => {
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:admin:approveUser', { userId, planId });
      if (res && res.success) {
        showToast('Phê duyệt thành công', res.message, 'success');
        await fetchAdminUsers();
        await fetchLicense();
      } else {
        showToast('Lỗi duyệt', res?.message || 'Không thể phê duyệt', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi', err?.message || String(err), 'error');
    }
  };

  const handleRejectUser = async (userId: string) => {
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:admin:rejectUser', { userId });
      if (res && res.success) {
        showToast('Đã từ chối', res.message, 'info');
        await fetchAdminUsers();
      }
    } catch (err: any) {
      showToast('Lỗi', err?.message || String(err), 'error');
    }
  };

  const handleBlockUser = async (userId: string) => {
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:admin:blockUser', { userId });
      if (res && res.success) {
        showToast('Đã khóa tài khoản', res.message, 'info');
        await fetchAdminUsers();
      }
    } catch (err: any) {
      showToast('Lỗi', err?.message || String(err), 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:admin:deleteUser', { userId });
      if (res && res.success) {
        showToast('Đã xóa', res.message, 'info');
        await fetchAdminUsers();
      }
    } catch (err: any) {
      showToast('Lỗi', err?.message || String(err), 'error');
    }
  };

  const handleExtendUser = async (userId: string, days: number) => {
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:admin:extendUser', { userId, days });
      if (res && res.success) {
        showToast('Gia hạn thành công', res.message, 'success');
        await fetchAdminUsers();
      }
    } catch (err: any) {
      showToast('Lỗi', err?.message || String(err), 'error');
    }
  };

  // Fetch installation status from Windows Registry / Electron IPC
  const fetchStatus = async () => {
    const ipc = getIPC();
    if (ipc) {
      try {
        const res = await ipc.invoke('app-manager:getStatus');
        if (res && typeof res === 'object') {
          setAppStatus(res);
        }
      } catch (err) {
        console.warn('Could not fetch app status:', err);
      }
    }
  };

  // Fetch license & subscription status
  const fetchLicense = async () => {
    const ipc = getIPC();
    if (ipc) {
      try {
        const res = await ipc.invoke('license:getStatus');
        if (res) {
          setLicenseStatus(res);
          if (res.isAdmin) {
            fetchAdminUsers();
          }
          // If expired, trigger auto-uninstall check
          if (res.isExpired && res.isLoggedIn && !res.isAdmin) {
            ipc.invoke('license:checkAndEnforce');
          }
        }
      } catch (err) {
        console.warn('Could not fetch license status:', err);
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLicense();
    // Check initial auth condition on mount
    const params = new URLSearchParams(window.location.search);
    const isExplicitRequire = params.get('requireAuth') === 'true';
    const ipc = getIPC();
    if (ipc) {
      ipc.invoke('license:getStatus').then((res: any) => {
        if (res && (!res.isLoggedIn || isExplicitRequire)) {
          setAuthTab('register');
          setShowAuthModal(true);
        } else if (res && res.isExpired && !res.isAdmin) {
          setAuthTab('upgrade');
          setShowAuthModal(true);
        }
      });
    }
    // Live countdown update every second
    const liveTimer = setInterval(fetchLicense, 1000);
    // App status update every 30s
    const statusTimer = setInterval(fetchStatus, 30000);
    return () => {
      clearInterval(liveTimer);
      clearInterval(statusTimer);
    };
  }, []);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ title, desc, type });
    setTimeout(() => setToast(null), 6000);
  };

  const handleLaunchApp = (appId: string, filePath?: string) => {
    if (!licenseStatus?.isLoggedIn) {
      showToast('Yêu cầu Đăng nhập', 'Vui lòng đăng nhập tài khoản để sử dụng ứng dụng!', 'error');
      setAuthTab('register');
      setShowAuthModal(true);
      return;
    }
    if (licenseStatus?.isPendingApproval) {
      showToast('Tài khoản Chờ duyệt', 'Tài khoản của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Admin!', 'error');
      return;
    }
    if (licenseStatus?.isExpired && !licenseStatus?.isAdmin) {
      showToast('Bản quyền đã hết hạn', 'Gói dịch vụ đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng ứng dụng!', 'error');
      setAuthTab('upgrade');
      setShowAuthModal(true);
      return;
    }
    launchApp(appId, filePath);
  };

  const handleInstallApp = async (appId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const ipc = getIPC();
    if (!ipc) {
      alert('Không tìm thấy kết nối nền tảng Electron.');
      return;
    }

    let status = licenseStatus;
    if (!status) {
      try {
        status = await ipc.invoke('license:getStatus');
        if (status) setLicenseStatus(status);
      } catch {}
    }

    // Check login & license before installing
    if (status && !status.isLoggedIn) {
      showToast('Yêu cầu Đăng nhập', 'Vui lòng đăng nhập hoặc đăng ký trước khi cài đặt ứng dụng vào máy tính!', 'error');
      setAuthTab('register');
      setShowAuthModal(true);
      return;
    }

    if (status && status.isPendingApproval) {
      showToast('Tài khoản Chờ duyệt', 'Tài khoản của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Admin để được phê duyệt!', 'error');
      return;
    }

    if (status && status.isExpired && !status.isAdmin) {
      showToast('Bản quyền đã hết hạn', 'Vui lòng gia hạn gói dịch vụ để cài đặt và sử dụng ứng dụng trên PC.', 'error');
      setAuthTab('upgrade');
      setShowAuthModal(true);
      return;
    }

    // Optimistic UI update
    setAppStatus(prev => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        id: appId,
        isInstalled: true,
        inControlPanel: true,
        desktopShortcutExists: true,
      }
    }));

    setLoadingApp(appId);
    try {
      const res = await ipc.invoke('app-manager:install', appId);
      if (res && res.success) {
        showToast('Cài đặt thành công!', res.message || `Đã cài đặt ${appId} vào Windows & Control Panel`, 'success');
      } else {
        showToast('Cài đặt thất bại', res?.message || 'Có lỗi xảy ra', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi cài đặt', err?.message || String(err), 'error');
    } finally {
      setLoadingApp(null);
      await fetchStatus();
    }
  };

  const handleUninstallApp = async (appId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic UI update immediately
    setAppStatus(prev => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        id: appId,
        isInstalled: false,
        inControlPanel: false,
        desktopShortcutExists: false,
      }
    }));

    setLoadingApp(appId);
    const ipc = getIPC();
    if (!ipc) {
      setLoadingApp(null);
      return;
    }
    try {
      const res = await ipc.invoke('app-manager:uninstall', appId);
      if (res && res.success) {
        showToast('Gỡ cài đặt hoàn tất', res.message || `Đã gỡ cài đặt ${appId}`, 'info');
      } else {
        showToast('Lỗi khi gỡ', res?.message || 'Không thể gỡ cài đặt', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi khi gỡ cài đặt', err?.message || String(err), 'error');
    } finally {
      setLoadingApp(null);
      await fetchStatus();
    }
  };

  const handleDownloadInstaller = async (appId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('app-manager:downloadInstaller', appId);
      if (res && res.success) {
        showToast('Đã tạo bộ cài đặt standalone', `Tệp cài đặt độc lập (.exe/.cmd) đã được lưu vào thư mục downloads/`, 'success');
      }
    } catch (err: any) {
      showToast('Lỗi tải bộ cài', err?.message || String(err), 'error');
    }
  };

  const handleOpenControlPanel = async () => {
    const ipc = getIPC();
    if (ipc) {
      await ipc.invoke('app-manager:openControlPanel');
      showToast('Đã mở Windows Control Panel', 'Kiểm tra các ứng dụng Workplace trong danh sách Programs and Features', 'info');
    }
  };

  const handleInstallAll = async () => {
    if (licenseStatus && licenseStatus.isExpired && licenseStatus.isLoggedIn) {
      showToast('Bản quyền đã hết hạn', 'Vui lòng gia hạn gói dịch vụ để cài đặt các ứng dụng.', 'error');
      setAuthTab('upgrade');
      setShowAuthModal(true);
      return;
    }
    setLoadingApp('all');
    for (const app of APPS_LIST) {
      await handleInstallApp(app.id);
    }
    setLoadingApp(null);
    showToast('Hoàn tất cài đặt toàn bộ Suite!', 'Tất cả ứng dụng đã được đăng ký vào Windows Control Panel & Desktop', 'success');
  };

  // Auth & Subscription Submit Handlers
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authForm.fullName || !authForm.email) {
      setAuthError('Vui lòng nhập đầy đủ Họ tên và Email!');
      return;
    }
    setAuthLoading(true);
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:register', authForm);
      if (res && res.success) {
        if (res.pendingApproval) {
          showToast('Đăng ký thành công - Chờ Admin duyệt', res.message, 'info');
          setAuthTab('login');
          setAuthError(res.message);
        } else {
          showToast('Đăng ký thành công!', res.message, 'success');
          await fetchLicense();
          setShowAuthModal(false);
          setShowCertificateModal(true);
        }
      } else {
        setAuthError(res?.message || 'Đăng ký thất bại.');
      }
    } catch (err: any) {
      setAuthError(err?.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authForm.email) {
      setAuthError('Vui lòng nhập Email!');
      return;
    }
    setAuthLoading(true);
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:login', { email: authForm.email, password: authForm.password });
      if (res && res.success) {
        showToast('Đăng nhập thành công!', res.message, 'success');
        await fetchLicense();
        setShowAuthModal(false);
      } else {
        setAuthError(res?.message || 'Đăng nhập thất bại.');
      }
    } catch (err: any) {
      setAuthError(err?.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpgradeSubmit = async (planId: string) => {
    setAuthLoading(true);
    const ipc = getIPC();
    if (!ipc) return;
    try {
      const res = await ipc.invoke('license:upgrade', { planId });
      if (res && res.success) {
        showToast('Gia hạn thành công!', res.message, 'success');
        // Reset install block so user can reinstall apps immediately after upgrade
        try {
          await ipc.invoke('license:resetInstallBlock');
        } catch {}
        await fetchLicense();
        await fetchStatus();
        setShowAuthModal(false);
      } else {
        setAuthError(res?.message || 'Gia hạn thất bại.');
      }
    } catch (err: any) {
      setAuthError(err?.message || String(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleReinstallApp = async (appId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ipc = getIPC();
    if (!ipc) return;

    // Verify license allows install
    let status = licenseStatus;
    if (!status) {
      try { status = await ipc.invoke('license:getStatus'); } catch {}
    }
    if (status && status.isExpired && !status.isAdmin) {
      showToast('Bản quyền đã hết hạn', 'Vui lòng gia hạn gói dịch vụ để cài đặt lại ứng dụng trên PC.', 'error');
      setAuthTab('upgrade');
      setShowAuthModal(true);
      return;
    }

    setLoadingApp(appId);
    // Optimistic UI
    setAppStatus(prev => ({
      ...prev,
      [appId]: { ...(prev[appId] || {}), id: appId, isInstalled: true, inControlPanel: true, desktopShortcutExists: true },
    }));
    try {
      const res = await ipc.invoke('app-manager:reinstall', appId);
      if (res && res.success) {
        showToast('Cài đặt lại thành công!', res.message || `Đã cài đặt lại ${appId.toUpperCase()} vào Windows & Control Panel`, 'success');
      } else {
        showToast('Cài lại thất bại', res?.message || 'Có lỗi xảy ra', 'error');
      }
    } catch (err: any) {
      showToast('Lỗi cài lại', err?.message || String(err), 'error');
    } finally {
      setLoadingApp(null);
      await fetchStatus();
    }
  };

  const handleLogout = async () => {
    const ipc = getIPC();
    if (ipc) {
      await ipc.invoke('license:logout');
      showToast('Đã đăng xuất', 'Tài khoản đã được đăng xuất khỏi máy.', 'info');
      await fetchLicense();
    }
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchCat = newFilter === 'all' || t.category === newFilter;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredRecent = RECENT_DOCUMENTS.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const installedCount = Object.values(appStatus).filter((s: any) => s?.isInstalled || s?.inControlPanel).length;

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden font-sans select-none relative">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div className="w-64 bg-[#1e293b]/80 border-r border-slate-700/60 flex flex-col pt-6 pb-4 px-4 shadow-xl backdrop-blur-lg z-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
            WP
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Workplace
            </h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Workplace Suite</span>
          </div>
        </div>

        {/* User License & Subscription Status Card in Sidebar */}
        <div className="mb-5 p-3 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-md">
          {licenseStatus?.isLoggedIn ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {licenseStatus.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate max-w-[100px]" title={licenseStatus.user?.fullName}>
                      {licenseStatus.user?.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[100px]" title={licenseStatus.user?.email}>
                      {licenseStatus.user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={13} />
                </button>
              </div>

              {/* Plan Badge & Expiry Countdown */}
              <div className="pt-2 border-t border-slate-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Crown size={11} className="text-yellow-400" />
                    <span>Gói hiện tại:</span>
                  </span>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${
                    licenseStatus.isExpired 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : licenseStatus.isTrial
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {licenseStatus.user?.planName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Timer size={11} className={licenseStatus.isExpired ? 'text-red-400' : 'text-emerald-400'} />
                    <span>Thời hạn:</span>
                  </span>
                  <span className={`font-semibold ${
                    licenseStatus.isExpired 
                      ? 'text-red-400' 
                      : licenseStatus.timeRemaining?.days <= 1 
                      ? 'text-amber-400 animate-pulse' 
                      : 'text-emerald-400'
                  }`}>
                    {licenseStatus.timeRemaining?.formatted}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="py-1 px-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    title="Xem Giấy Chứng Nhận Bản Quyền của Tác giả Tạ Đức Tới"
                  >
                    <Award size={11} className="text-yellow-400" />
                    <span>Giấy Phép</span>
                  </button>

                  <button
                    onClick={() => { setAuthTab('upgrade'); setShowAuthModal(true); }}
                    className="py-1 px-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all shadow-sm"
                  >
                    <Zap size={11} />
                    <span>{licenseStatus.isExpired ? 'Gia hạn' : 'Nâng cấp'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center py-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles size={14} />
                <span>Dùng thử 3 Ngày Miễn Phí</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Đăng ký ngay để mở khóa toàn bộ tính năng và tự gỡ khi hết hạn.
              </p>
              <button
                onClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
                className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1"
              >
                <User size={13} />
                <span>Đăng ký / Đăng nhập</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'home' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <IconFileText size={18} className={activeTab === 'home' ? 'text-blue-400' : 'text-slate-400'} />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'apps' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Laptop size={18} className={activeTab === 'apps' ? 'text-blue-400' : 'text-slate-400'} />
              <span>Cài đặt App PC</span>
            </div>
            {installedCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                {installedCount} đã cài
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'new' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <IconPlus size={18} className={activeTab === 'new' ? 'text-blue-400' : 'text-slate-400'} />
            <span>Tạo mới</span>
          </button>

          <button
            onClick={() => setActiveTab('open')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'open' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <IconFolderOpen size={18} className={activeTab === 'open' ? 'text-blue-400' : 'text-slate-400'} />
            <span>Mở tệp</span>
          </button>

          {/* Admin Management Navigation Button */}
          {licenseStatus?.isAdmin && (
            <button
              onClick={() => { setActiveTab('admin'); fetchAdminUsers(); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'admin' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-amber-400" />
                <span className="font-bold">Quản trị & Duyệt</span>
              </div>
              {adminUsers.filter((u: any) => u.status === 'pending').length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-extrabold animate-pulse">
                  {adminUsers.filter((u: any) => u.status === 'pending').length} chờ
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Windows Control Panel Quick Action */}
        <div className="mb-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Windows Control Panel</span>
            </span>
          </div>
          <button
            onClick={handleOpenControlPanel}
            className="w-full py-1.5 px-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-600/40 shadow-sm"
          >
            <Monitor size={12} />
            <span>Mở Control Panel (Programs)</span>
          </button>
        </div>

        {/* Settings button */}
        <button
          onClick={openSettings}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"
        >
          <IconSettings size={16} />
          <span>Cài đặt Workplace</span>
        </button>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0f172a] via-[#131d35] to-[#0b1120] overflow-y-auto">
        {/* Top Header */}
        <div className="h-14 border-b border-slate-800/80 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-20 bg-[#0f172a]/70">
          <div className="flex items-center gap-3 w-80">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mẫu, tài liệu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Header License Pill */}
            {licenseStatus?.isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/10"
                  title="Xem Giấy Chứng Nhận Bản Quyền - Tác giả Tạ Đức Tới"
                >
                  <Award size={14} className="text-yellow-400" />
                  <span>Giấy Phép: TẠ ĐỨC TỚI</span>
                </button>

                <div 
                  onClick={() => { setAuthTab('upgrade'); setShowAuthModal(true); }}
                  className="cursor-pointer px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 text-xs transition-all"
                  title="Bấm để xem chi tiết hoặc gia hạn gói"
                >
                  <Crown size={13} className={licenseStatus.isExpired ? 'text-red-400' : 'text-yellow-400'} />
                  <span className="font-semibold text-slate-200">{licenseStatus.user?.planName}</span>
                  <span className="text-slate-500">•</span>
                  <span className={`font-mono text-[11px] font-bold ${
                    licenseStatus.isExpired ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {licenseStatus.timeRemaining?.formatted}
                  </span>
                </div>
              </>
            ) : (
              <button
                onClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>Đăng ký Dùng thử 3 Ngày</span>
              </button>
            )}

            <button 
              onClick={handleOpenControlPanel}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <Monitor size={13} className="text-blue-400" />
              <span>Control Panel</span>
            </button>

            <button 
              onClick={() => handleLaunchApp('ai')}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-500/20 flex items-center gap-2"
            >
              <Sparkles size={13} />
              <span>Copilot AI</span>
            </button>
          </div>
        </div>

        {/* Pending Approval Warning Banner */}
        {licenseStatus?.isLoggedIn && licenseStatus?.isPendingApproval && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-amber-200">
              <Clock size={20} className="text-amber-400 flex-shrink-0 animate-spin" />
              <div>
                <div className="font-bold text-sm text-amber-300">Tài khoản đang CHỜ QUẢN TRỊ VIÊN PHÊ DUYỆT</div>
                <div className="text-xs text-amber-200/80 mt-0.5">
                  Tài khoản ({licenseStatus.user?.email}) đã đăng ký thành công. Vui lòng liên hệ quản trị viên để được duyệt trước khi mở và sử dụng các ứng dụng.
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40"
            >
              Đổi tài khoản khác
            </button>
          </div>
        )}

        {/* Expired Warning Banner if applicable */}
        {licenseStatus?.isExpired && licenseStatus?.isLoggedIn && !licenseStatus?.isPendingApproval && (
          <div className="bg-red-500/15 border-b border-red-500/30 px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-red-200">
              <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
              <span>
                <strong>Bản quyền đã hết hạn:</strong> Các ứng dụng PC đã được tự động gỡ cài đặt. Vui lòng gia hạn gói để tiếp tục sử dụng Workplace Suite!
              </span>
            </div>
            <button
              onClick={() => { setAuthTab('upgrade'); setShowAuthModal(true); }}
              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              <Zap size={12} />
              <span>Gia hạn ngay</span>
            </button>
          </div>
        )}

        {/* ── TAB 1: HOME ────────────────────────────────────────────────── */}
        {activeTab === 'home' && (
          <div className="p-8 max-w-6xl w-full mx-auto space-y-10">
            {/* Hero Welcome */}
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {getGreeting()}, <span className="text-blue-400 font-extrabold">{licenseStatus?.user?.fullName || 'Workplace Suite'}</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">Cài đặt từng ứng dụng độc lập vào PC để sử dụng như phần mềm máy tính</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('apps')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-all flex items-center gap-2"
                >
                  <Package size={14} />
                  <span>Quản lý Ứng dụng & Control Panel</span>
                </button>
              </div>
            </div>

            {/* App Launch & Download Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span>Ứng dụng Độc lập (Standalone Apps)</span>
                </h3>
                <span className="text-xs text-slate-500">Bấm "Cài vào PC" để hiện trong Control Panel & Màn hình Desktop</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {APPS_LIST.map((app) => {
                  const Icon = app.icon;
                  const isInstalled = appStatus[app.id]?.isInstalled || appStatus[app.id]?.inControlPanel;
                  const isLoading = loadingApp === app.id || loadingApp === 'all';

                  return (
                    <div 
                      key={app.id}
                      className="group relative p-5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 transition-all duration-200 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        {/* Header icon & badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl ${app.color} border group-hover:scale-105 transition-transform`}>
                            <Icon size={32} />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[11px] font-semibold ${app.textColor}/90 ${app.badgeBg} px-2.5 py-0.5 rounded-full border ${app.badgeBorder}`}>
                              {app.ext}
                            </span>
                            {isInstalled ? (
                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={11} /> Đã cài PC
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Chưa cài vào máy</span>
                            )}
                          </div>
                        </div>

                        {/* App info */}
                        <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                          {app.title}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                          {app.desc}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
                        {/* Open Button */}
                        <button
                          onClick={() => handleLaunchApp(app.id)}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                        >
                          <span>Mở ứng dụng</span>
                          <ArrowRight size={13} />
                        </button>

                        {/* Install / Download to PC Button */}
                        <div className="flex items-center gap-2">
                          {isInstalled ? (
                            <button
                              onClick={(e) => handleUninstallApp(app.id, e)}
                              disabled={isLoading}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-[11px] font-medium transition-all border border-slate-600/40 hover:border-red-500/30 flex items-center justify-center gap-1"
                              title="Gỡ cài đặt khỏi Windows & Control Panel"
                            >
                              <Trash2 size={12} />
                              <span>Gỡ cài đặt</span>
                            </button>
                          ) : licenseStatus?.isLoggedIn && !licenseStatus?.isExpired && !licenseStatus?.isPendingApproval ? (
                            // License valid, app not installed → show reinstall if was previously uninstalled, or fresh install
                            <button
                              onClick={(e) => handleInstallApp(app.id, e)}
                              disabled={isLoading}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold transition-all border border-emerald-500/30 flex items-center justify-center gap-1"
                            >
                              {isLoading ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <Download size={12} />
                              )}
                              <span>Cài đặt vào PC</span>
                            </button>
                          ) : licenseStatus?.isLoggedIn && licenseStatus?.isExpired && !licenseStatus?.isAdmin ? (
                            // Expired — show upgrade prompt inline
                            <button
                              onClick={() => { setAuthTab('upgrade'); setShowAuthModal(true); }}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-[11px] font-semibold transition-all border border-red-500/30 flex items-center justify-center gap-1"
                            >
                              <Zap size={12} />
                              <span>Gia hạn để cài lại</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleInstallApp(app.id, e)}
                              disabled={isLoading}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold transition-all border border-emerald-500/30 flex items-center justify-center gap-1"
                            >
                              {isLoading ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : (
                                <Download size={12} />
                              )}
                              <span>Cài đặt vào PC</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => handleDownloadInstaller(app.id, e)}
                            className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-all border border-slate-600/40"
                            title="Tải bộ cài đặt độc lập (.exe/.cmd) về máy"
                          >
                            <FolderDown size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Files Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} />
                  <span>Tài liệu gần đây</span>
                </h3>
                <button 
                  onClick={openNativeFileDialog}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>Mở từ máy tính</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden divide-y divide-slate-700/40">
                {filteredRecent.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => handleLaunchApp(doc.app)}
                    className="p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                        {doc.app === 'word' && <IconWord size={20} />}
                        {doc.app === 'excel' && <IconExcel size={20} />}
                        {doc.app === 'powerpoint' && <IconPowerpoint size={20} />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-200 group-hover:text-blue-400 transition-colors">
                          {doc.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{doc.time}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: APPS MANAGER ────────────────────────────────────────── */}
        {activeTab === 'apps' && (
          <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Laptop size={28} className="text-blue-400" />
                  <span>Quản lý Ứng dụng Máy tính & Control Panel</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Cài đặt, quản lý và gỡ cài đặt các ứng dụng Workplace Suite như một phần mềm Windows chuẩn mực.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleInstallAll}
                  disabled={loadingApp !== null}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Download size={15} />
                  <span>Cài đặt tất cả ({APPS_LIST.length} ứng dụng)</span>
                </button>
              </div>
            </div>

            {/* Apps Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {APPS_LIST.map((app) => {
                const Icon = app.icon;
                const status = appStatus[app.id];
                const isInstalled = status?.isInstalled || status?.inControlPanel;
                const isLoading = loadingApp === app.id || loadingApp === 'all';

                return (
                  <div 
                    key={app.id}
                    className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3.5 rounded-2xl ${app.color} border`}>
                        <Icon size={36} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-white">{app.title}</h3>
                          <span className={`text-[11px] font-semibold ${app.textColor} ${app.badgeBg} px-2.5 py-0.5 rounded-full border ${app.badgeBorder}`}>
                            {app.ext}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{app.desc}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                            Dung lượng: {app.size}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                            Định dạng: {app.fileExts}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="text-slate-300 font-medium">Trạng thái tích hợp Windows:</div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className={status?.inControlPanel ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            • Control Panel: {status?.inControlPanel ? 'Đã đăng ký' : 'Chưa'}
                          </span>
                          <span className={status?.desktopShortcutExists ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                            • Desktop Shortcut: {status?.desktopShortcutExists ? 'Có' : 'Không'}
                          </span>
                        </div>
                      </div>

                      {isInstalled ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px] flex items-center gap-1">
                          <CheckCircle2 size={12} /> Đã cài đặt
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-700/40 text-slate-400 font-medium border border-slate-700 text-[11px]">
                          Chưa cài đặt
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleLaunchApp(app.id)}
                        className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                      >
                        <span>Mở ứng dụng</span>
                        <ArrowRight size={14} />
                      </button>

                      {isInstalled ? (
                        <button
                          onClick={(e) => handleUninstallApp(app.id, e)}
                          disabled={isLoading}
                          className="py-2 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all border border-red-500/30 flex items-center gap-1.5"
                        >
                          <Trash2 size={13} />
                          <span>Gỡ cài đặt</span>
                        </button>
                      ) : licenseStatus?.isLoggedIn && !licenseStatus?.isExpired && !licenseStatus?.isPendingApproval ? (
                        // Valid license, not installed → Install or Reinstall
                        <button
                          onClick={(e) => handleInstallApp(app.id, e)}
                          disabled={isLoading}
                          className="py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5"
                        >
                          {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                          <span>Cài đặt vào PC</span>
                        </button>
                      ) : licenseStatus?.isLoggedIn && licenseStatus?.isExpired && !licenseStatus?.isAdmin ? (
                        // Expired → prompt to renew first
                        <button
                          onClick={() => { setAuthTab('upgrade'); setShowAuthModal(true); }}
                          className="py-2 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold transition-all border border-red-500/30 flex items-center gap-1.5"
                        >
                          <Zap size={13} />
                          <span>Gia hạn để cài lại</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleInstallApp(app.id, e)}
                          disabled={isLoading}
                          className="py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5"
                        >
                          {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                          <span>Cài đặt vào PC</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDownloadInstaller(app.id, e)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all border border-slate-700"
                        title="Tạo bộ cài đặt standalone (.exe/.cmd)"
                      >
                        <FolderDown size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: NEW TEMPLATES ────────────────────────────────────────── */}
        {activeTab === 'new' && (
          <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Tạo tài liệu mới</h2>
              <p className="text-slate-400 text-sm mt-1">Chọn từ các mẫu tài liệu được thiết kế sẵn hoặc bắt đầu với trang trắng.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 border-b border-slate-800 pb-4">
              {(['all', 'word', 'excel', 'powerpoint'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setNewFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    newFilter === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab === 'all' && 'Tất cả mẫu'}
                  {tab === 'word' && 'Tài liệu Word'}
                  {tab === 'excel' && 'Bảng tính Excel'}
                  {tab === 'powerpoint' && 'Bài thuyết trình PPT'}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredTemplates.map(template => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    onClick={() => handleLaunchApp(template.app)}
                    className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 transition-all cursor-pointer group flex flex-col justify-between h-52 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${template.color} border group-hover:scale-105 transition-transform`}>
                          <Icon size={24} />
                        </div>
                        {template.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {template.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                        {template.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                        {template.desc}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300 gap-1 pt-2 border-t border-slate-700/40">
                      <span>Sử dụng mẫu này</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: OPEN FILE ───────────────────────────────────────────── */}
        {activeTab === 'open' && (
          <div className="p-8 max-w-4xl w-full mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Mở tệp từ thiết bị</h2>
              <p className="text-slate-400 text-sm mt-1">Duyệt qua các ổ đĩa trên máy tính hoặc kéo thả tệp vào đây để chỉnh sửa.</p>
            </div>

            {/* Big Drop/Browse Zone */}
            <div 
              onClick={openNativeFileDialog}
              className="p-12 rounded-3xl border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 bg-slate-800/30 hover:bg-slate-800/50 transition-all text-center cursor-pointer group flex flex-col items-center justify-center space-y-4"
            >
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform border border-blue-500/20 shadow-lg shadow-blue-500/10">
                <Upload size={36} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Bấm để chọn tệp tài liệu từ máy tính
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Hỗ trợ định dạng Word (.docx, .doc), Excel (.xlsx, .csv), PowerPoint (.pptx, .ppt)
                </p>
              </div>
              <button className="px-5 py-2 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md">
                Duyệt thư mục máy tính
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 5: ADMIN MANAGEMENT & APPROVALS ────────────────────────── */}
        {activeTab === 'admin' && (
          <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Quản Trị Người Dùng & Phê Duyệt</h2>
                    <p className="text-slate-400 text-xs mt-0.5">Duyệt tài khoản mới đăng ký, cấp quyền dùng thử, gia hạn và quản lý thành viên Workplace Suite.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAdminUsers}
                  disabled={adminLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all shadow-sm"
                >
                  <RefreshCw size={14} className={adminLoading ? 'animate-spin' : ''} />
                  <span>Làm mới danh sách</span>
                </button>
              </div>
            </div>

            {/* Admin Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Tổng người dùng</div>
                  <div className="text-xl font-extrabold text-white">{adminUsers.length}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-medium">Chờ duyệt</div>
                  <div className="text-xl font-extrabold text-amber-400">
                    {adminUsers.filter((u: any) => u.status === 'pending').length}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <UserCheck size={20} />
                </div>
                <div>
                  <div className="text-xs text-emerald-300 font-medium">Đã phê duyệt</div>
                  <div className="text-xl font-extrabold text-emerald-400">
                    {adminUsers.filter((u: any) => u.status === 'approved').length}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Ban size={20} />
                </div>
                <div>
                  <div className="text-xs text-red-300 font-medium">Đã khóa / Từ chối</div>
                  <div className="text-xl font-extrabold text-red-400">
                    {adminUsers.filter((u: any) => u.status === 'blocked' || u.status === 'rejected').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              {(['all', 'pending', 'approved', 'blocked'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAdminFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    adminFilter === tab
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab === 'all' && `Tất cả (${adminUsers.length})`}
                  {tab === 'pending' && `Chờ duyệt (${adminUsers.filter((u: any) => u.status === 'pending').length})`}
                  {tab === 'approved' && `Đã duyệt (${adminUsers.filter((u: any) => u.status === 'approved').length})`}
                  {tab === 'blocked' && `Bị khóa / Từ chối (${adminUsers.filter((u: any) => u.status === 'blocked' || u.status === 'rejected').length})`}
                </button>
              ))}
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Tài khoản & Email</th>
                    <th className="py-3.5 px-4">Vai trò</th>
                    <th className="py-3.5 px-4">Gói đăng ký</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Thời hạn còn lại</th>
                    <th className="py-3.5 px-4 text-right">Hành động của Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {adminUsers
                    .filter((u: any) => {
                      if (adminFilter === 'pending') return u.status === 'pending';
                      if (adminFilter === 'approved') return u.status === 'approved';
                      if (adminFilter === 'blocked') return u.status === 'blocked' || u.status === 'rejected';
                      return true;
                    })
                    .map((u: any) => {
                      const isPending = u.status === 'pending';
                      const isApproved = u.status === 'approved';
                      const isBlocked = u.status === 'blocked';
                      const isRejected = u.status === 'rejected';
                      const isAdmin = u.role === 'admin';

                      const plan = SUBSCRIPTION_PLANS[u.planId] || { name: u.planId };
                      const remainingMs = isApproved ? Math.max(0, (u.expiresAt || 0) - Date.now()) : 0;
                      const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

                      return (
                        <tr key={u.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-100 flex items-center gap-2">
                              <span>{u.fullName}</span>
                              {isAdmin && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[9px] border border-amber-500/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{u.email}</div>
                            {u.registeredIp && (
                              <div className="text-[10px] text-slate-500 font-mono">IP: {u.registeredIp}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-300 uppercase text-[10px]">
                              {u.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200">{plan.name}</div>
                            <div className="text-[10px] text-slate-400">
                              Đăng ký: {new Date(u.registeredAt).toLocaleDateString('vi-VN')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isPending && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px] flex items-center gap-1 w-fit">
                                <Clock size={11} className="animate-spin" /> Chờ duyệt
                              </span>
                            )}
                            {isApproved && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle2 size={11} /> Đã phê duyệt
                              </span>
                            )}
                            {isBlocked && (
                              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[10px] flex items-center gap-1 w-fit">
                                <Ban size={11} /> Đã khóa
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                                <X size={11} /> Từ chối
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {isAdmin ? (
                              <span className="font-mono text-amber-400 font-bold">Vô hạn (Admin VIP)</span>
                            ) : isApproved ? (
                              <span className="font-mono text-emerald-400 font-bold">
                                {remainingDays > 0 ? `${remainingDays} ngày còn lại` : 'Đã hết hạn'}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">Chưa kích hoạt</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending: Show Approve & Reject buttons */}
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleApproveUser(u.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                                    title="Phê duyệt kích hoạt tài khoản ngay"
                                  >
                                    <Check size={12} />
                                    <span>Duyệt</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectUser(u.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400 font-medium text-[11px] border border-slate-600 transition-all"
                                    title="Từ chối yêu cầu đăng ký"
                                  >
                                    <X size={12} />
                                    <span>Từ chối</span>
                                  </button>
                                </>
                              )}

                              {/* If Approved: Show extend buttons */}
                              {isApproved && !isAdmin && (
                                <>
                                  <button
                                    onClick={() => handleExtendUser(u.id, 30)}
                                    className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-semibold text-[10px] border border-blue-500/30 transition-all"
                                    title="Gia hạn thêm 30 ngày sử dụng"
                                  >
                                    +30 Ngày
                                  </button>
                                  <button
                                    onClick={() => handleExtendUser(u.id, 365)}
                                    className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-[10px] border border-indigo-500/30 transition-all"
                                    title="Gia hạn thêm 1 năm sử dụng"
                                  >
                                    +1 Năm
                                  </button>
                                  <button
                                    onClick={() => handleBlockUser(u.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-all"
                                    title="Khóa tài khoản"
                                  >
                                    <Ban size={12} />
                                  </button>
                                </>
                              )}

                              {/* If Blocked: Allow Unblocking */}
                              {isBlocked && (
                                <button
                                  onClick={() => handleApproveUser(u.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold text-[11px] border border-emerald-500/30 transition-all"
                                  title="Mở khóa tài khoản"
                                >
                                  Mở khóa
                                </button>
                              )}

                              {/* Delete button (except admin) */}
                              {!isAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-all"
                                  title="Xóa tài khoản vĩnh viễn"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {adminUsers.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Chưa có người dùng nào đăng ký.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── AUTH & SUBSCRIPTION MODAL ─────────────────────────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  <Crown size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {authTab === 'register' && 'Đăng ký & Chọn gói Bản quyền'}
                    {authTab === 'login' && 'Đăng nhập Tài khoản'}
                    {authTab === 'upgrade' && 'Nâng cấp & Gia hạn Bản quyền'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trải nghiệm Workplace Suite đầy đủ trên PC với các gói thời hạn linh hoạt
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab selector */}
            <div className="flex border-b border-slate-800 px-6 pt-2 bg-slate-900/40">
              <button
                onClick={() => { setAuthTab('register'); setAuthError(null); }}
                className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
                  authTab === 'register' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Đăng ký mới (Chọn gói)
              </button>

              <button
                onClick={() => { setAuthTab('login'); setAuthError(null); }}
                className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
                  authTab === 'login' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Đăng nhập
              </button>

              <button
                onClick={() => { setAuthTab('upgrade'); setAuthError(null); }}
                className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
                  authTab === 'upgrade' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Gói Bản quyền & Gia hạn
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {authError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle size={15} className="flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* ── TAB: REGISTER ── */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <User size={13} className="text-blue-400" />
                        <span>Họ và tên</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={authForm.fullName}
                        onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Mail size={13} className="text-blue-400" />
                        <span>Địa chỉ Email</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key size={13} className="text-blue-400" />
                      <span>Mật khẩu</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Plan Selection Cards */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Crown size={14} className="text-yellow-400" />
                        <span>Chọn gói thời hạn bản quyền:</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Hết hạn sẽ tự động gỡ sạch khỏi PC
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SUBSCRIPTION_PLANS.map((plan) => {
                        const isTrial = plan.id === 'trial_3d';
                        const isTrialClaimed = isTrial && licenseStatus?.deviceInfo?.isTrialClaimedOnDevice;
                        const isSelected = authForm.planId === plan.id;
                        return (
                          <div
                            key={plan.id}
                            onClick={() => {
                              if (isTrialClaimed) {
                                showToast('Đã hết lượt dùng thử', 'Máy tính này đã từng dùng gói dùng thử 3 ngày. Vui lòng chọn gói bản quyền.', 'info');
                              }
                              setAuthForm({ ...authForm, planId: plan.id as any });
                            }}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10'
                                : isTrialClaimed
                                ? 'bg-slate-900/60 border-slate-800 opacity-75'
                                : 'bg-slate-800/40 border-slate-700/70 hover:border-slate-600'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-white">{plan.name}</span>
                                {isTrialClaimed ? (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                    ĐÃ DÙNG TRÊN MÁY NÀY
                                  </span>
                                ) : (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${plan.badgeColor}`}>
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-extrabold text-blue-400">{plan.price}</span>
                                {plan.period && <span className="text-[10px] text-slate-400">{plan.period}</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 leading-tight pt-1">{plan.desc}</p>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 font-mono">
                                {isTrial ? '1 lần duy nhất / máy tính' : `Thời lượng: ${plan.durationDays} ngày`}
                              </span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-600'
                              }`}>
                                {isSelected && <Check size={10} />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auto-uninstall Notice */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2">
                    <ShieldAlert size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Cơ chế tự động:</strong> Khi hết thời hạn gói (ví dụ sau 3 ngày dùng thử), các ứng dụng Workplace đã cài vào PC sẽ tự động được gỡ bỏ an toàn khỏi Desktop & Control Panel. Bạn có thể gia hạn bất kỳ lúc nào để kích hoạt lại!
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {authLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    <span>Hoàn tất Đăng ký & Bắt đầu sử dụng</span>
                  </button>
                </form>
              )}

              {/* ── TAB: LOGIN ── */}
              {authTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail size={13} className="text-blue-400" />
                      <span>Email tài khoản</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key size={13} className="text-blue-400" />
                      <span>Mật khẩu</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Chưa có tài khoản? Nhập email để tự động kích hoạt <strong>3 ngày dùng thử miễn phí</strong>!
                  </p>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {authLoading ? <RefreshCw size={14} className="animate-spin" /> : <User size={14} />}
                    <span>Đăng nhập vào Workplace</span>
                  </button>
                </form>
              )}

              {/* ── TAB: UPGRADE & RENEW ── */}
              {authTab === 'upgrade' && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                      <Crown size={16} className="text-yellow-400" />
                      <span>Chọn gói gia hạn để tiếp tục sử dụng</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Gia hạn thời gian sử dụng giúp duy trì toàn bộ ứng dụng PC và dữ liệu đã tạo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          plan.isBestValue
                            ? 'bg-gradient-to-br from-yellow-500/10 via-slate-800 to-amber-500/10 border-yellow-500/50 shadow-lg'
                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{plan.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${plan.badgeColor}`}>
                              {plan.badge}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-extrabold text-blue-400">{plan.price}</span>
                            {plan.period && <span className="text-xs text-slate-400">{plan.period}</span>}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{plan.desc}</p>
                          
                          <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check size={11} className="text-emerald-400 flex-shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => handleUpgradeSubmit(plan.id)}
                          disabled={authLoading}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            plan.isBestValue
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 shadow-md shadow-yellow-500/20'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                          }`}
                        >
                          <Zap size={13} />
                          <span>Kích hoạt {plan.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── OFFICIAL SOFTWARE LICENSE CERTIFICATE MODAL (TẠ ĐỨC TỚI) ───────── */}
      {showCertificateModal && licenseStatus?.isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl my-6 p-2 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_50px_rgba(234,179,8,0.35)]">
            <div className="relative bg-[#090d1a] border-2 border-yellow-500/50 rounded-[22px] p-6 md:p-8 text-slate-100 overflow-hidden shadow-inner">
              
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
                <div className="text-8xl font-black rotate-[-25deg] text-yellow-400 text-center tracking-widest leading-tight">
                  TẠ ĐỨC TỚI<br />OFFICIAL LICENSE
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
                title="Đóng"
              >
                <X size={20} />
              </button>

              {/* Certificate Header */}
              <div className="text-center relative z-10 space-y-1 border-b border-yellow-500/30 pb-5">
                <div className="text-[11px] font-bold tracking-[0.2em] text-yellow-400 uppercase">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[10px] text-slate-400 tracking-wider">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <div className="text-xs text-yellow-500/80 tracking-widest my-1 font-serif">
                  ✦ ✦ ✦
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-wider font-serif pt-1">
                  GIẤY CHỨNG NHẬN BẢN QUYỀN PHẦN MỀM
                </h2>
                <div className="text-xs text-slate-300 font-medium">
                  OFFICIAL SOFTWARE LICENSE & DIGITAL OWNERSHIP CERTIFICATE
                </div>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
                  Hệ sinh thái phần mềm: <strong className="text-white">WORKPLACE SUITE (Word • Excel • PowerPoint • AI)</strong>
                </div>
              </div>

              {/* Certificate Body Details */}
              <div className="py-6 relative z-10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* Licensor (Tác quyền) */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-yellow-500/30 space-y-1">
                    <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-yellow-400" />
                      <span>Đơn vị cấp quyền & Bản quyền tác giả:</span>
                    </div>
                    <div className="text-sm font-extrabold text-white">
                      TẠ ĐỨC TỚI
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tác giả & Kiến trúc sư trưởng hệ thống phần mềm
                    </div>
                  </div>

                  {/* Licensee (Chủ sở hữu) */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={13} className="text-blue-400" />
                      <span>Chủ sở hữu giấy phép (Licensee):</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {licenseStatus?.user?.fullName || 'Khách hàng'}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono truncate" title={licenseStatus?.user?.email}>
                      {licenseStatus?.user?.email}
                    </div>
                  </div>

                  {/* License Key */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Key size={13} className="text-amber-400" />
                        <span>Mã bản quyền số (License Serial Key):</span>
                      </div>
                      <button
                        onClick={() => {
                          if (licenseStatus?.user?.licenseKey) {
                            navigator.clipboard.writeText(licenseStatus.user.licenseKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold flex items-center gap-1 transition-all"
                      >
                        {copiedKey ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedKey ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                      </button>
                    </div>
                    <div className="text-sm md:text-base font-mono font-bold text-yellow-300 tracking-wider bg-slate-950/80 p-2 rounded-lg border border-yellow-500/20 select-all">
                      {licenseStatus?.user?.licenseKey || 'WPS-2026-TDT-OFFICIAL'}
                    </div>
                  </div>

                  {/* Registered & Expiry Dates */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-400" />
                      <span>Ngày đăng ký kích hoạt:</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400">
                      {licenseStatus?.user?.registeredAtFormatted || 'Vừa kích hoạt'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Gói: <strong className="text-slate-200">{licenseStatus?.user?.planName}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Timer size={13} className="text-red-400" />
                      <span>Ngày hết hạn bản quyền:</span>
                    </div>
                    <div className={`text-xs font-bold ${licenseStatus?.isAdmin ? 'text-yellow-400' : 'text-amber-400'}`}>
                      {licenseStatus?.user?.expiresAtFormatted || 'Theo quy định gói'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Tình trạng: <strong className="text-emerald-400">Hợp lệ & Đang hoạt động</strong>
                    </div>
                  </div>

                  {/* Hardware ID & Verification */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-0.5 md:col-span-2 text-[11px]">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Mã phần cứng máy tính (Hardware Fingerprint):</span>
                      <span className="font-mono text-slate-300 font-bold">{licenseStatus?.deviceInfo?.deviceId}</span>
                    </div>
                  </div>
                </div>

                {/* Seal & Signatures */}
                <div className="pt-4 border-t border-yellow-500/20 flex items-center justify-between">
                  {/* Gold Official Stamp */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-400/80 flex flex-col items-center justify-center p-1 text-center bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      <Award size={18} className="text-yellow-400" />
                      <span className="text-[7px] font-black text-yellow-300 uppercase leading-none mt-0.5">BẢN QUYỀN</span>
                      <span className="text-[6px] font-bold text-yellow-200/90 tracking-tighter">TẠ ĐỨC TỚI</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-yellow-300">CHỨNG THỰC BẢN QUYỀN SỐ</div>
                      <div className="text-[10px] text-slate-400">Được bảo hộ & cấp quyền sử dụng hợp pháp trên Windows</div>
                    </div>
                  </div>

                  {/* Digital Signature */}
                  <div className="text-center space-y-0.5">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Tác quyền & Cấp phép
                    </div>
                    <div className="text-base font-serif italic font-bold text-yellow-300 tracking-wider py-0.5 select-none">
                      Tạ Đức Tới
                    </div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                      TẠ ĐỨC TỚI
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <Printer size={14} className="text-blue-400" />
                  <span>In / Lưu Giấy Phép (PDF)</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Xác nhận & Bắt đầu sử dụng</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Notification Toast ────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-900/30' 
              : toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-900/30'
              : 'bg-slate-900/90 border-blue-500/50 text-slate-100 shadow-blue-900/30'
          }`}>
            <div className="mt-0.5">
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
              {toast.type === 'error' && <Trash2 size={18} className="text-red-400" />}
              {toast.type === 'info' && <Package size={18} className="text-blue-400" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs">{toast.title}</h4>
              <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{toast.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
