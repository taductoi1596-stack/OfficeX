import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { execSync } from 'child_process';
import { WindowsAppInstallerService, WORKPLACE_APPS } from './WindowsAppInstallerService';

export type UserRole = 'admin' | 'user';
export type UserAccountStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface SubscriptionPlan {
  id: 'trial_3d' | '1m' | '3m' | '6m' | '1y';
  name: string;
  durationDays: number;
  durationMs: number;
  priceFormatted: string;
  tag?: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  trial_3d: {
    id: 'trial_3d',
    name: 'Dùng thử 3 Ngày Miễn phí',
    durationDays: 3,
    durationMs: 3 * 24 * 60 * 60 * 1000,
    priceFormatted: '0 VNĐ',
    tag: 'DÙNG THỬ (1 LẦN / MÁY)',
    features: [
      'Trải nghiệm đầy đủ 4 ứng dụng (Word, Excel, PPT, AI)',
      'Cài đặt trực tiếp vào Windows Control Panel & Desktop',
      'Được tự động gỡ cài đặt sạch sẽ khi hết 3 ngày',
      'Yêu cầu Quản trị viên (Admin) phê duyệt trước khi kích hoạt',
    ],
  },
  '1m': {
    id: '1m',
    name: 'Gói 1 Tháng Cá Nhân',
    durationDays: 30,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    priceFormatted: '99.000 VNĐ / tháng',
    features: [
      'Mở khóa toàn bộ Workplace Suite trong 30 ngày',
      'AI Assistant không giới hạn câu lệnh',
      'Hỗ trợ kỹ thuật ưu tiên 24/7',
      'Cập nhật tính năng mới liên tục',
    ],
  },
  '3m': {
    id: '3m',
    name: 'Gói 3 Tháng Tiêu Chuẩn',
    durationDays: 90,
    durationMs: 90 * 24 * 60 * 60 * 1000,
    priceFormatted: '269.000 VNĐ / 3 tháng',
    tag: 'PHỔ BIẾN',
    features: [
      'Tiết kiệm 10% so với gói tháng',
      'Đầy đủ tính năng cao cấp cho Word, Excel, PowerPoint',
      'Sao lưu & Khôi phục văn bản thông minh',
      'Hỗ trợ cài đặt trên 2 thiết bị PC',
    ],
  },
  '6m': {
    id: '6m',
    name: 'Gói 6 Tháng Bán Niên',
    durationDays: 180,
    durationMs: 180 * 24 * 60 * 60 * 1000,
    priceFormatted: '499.000 VNĐ / 6 tháng',
    tag: 'TIẾT KIỆM',
    features: [
      'Tiết kiệm 15% so với gói tháng',
      'Mở rộng bộ nhớ đệm AI & Mẫu báo cáo tài chính VIP',
      'Ưu tiên kết nối máy chủ tốc độ cao',
      'Hỗ trợ cài đặt trên 3 thiết bị PC',
    ],
  },
  '1y': {
    id: '1y',
    name: 'Gói 1 Năm Trọn Gói VIP',
    durationDays: 365,
    durationMs: 365 * 24 * 60 * 60 * 1000,
    priceFormatted: '899.000 VNĐ / năm',
    tag: 'TỐI ƯU NHẤT',
    features: [
      'Tiết kiệm tới 25% chi phí (Chỉ ~74k/tháng)',
      'Tất cả tính năng & Công cụ AI thông minh cao cấp nhất',
      'Bảo hành bản quyền 365 ngày trọn gói',
      'Không giới hạn thiết bị',
    ],
  },
};

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: UserRole;
  status: UserAccountStatus;
  planId: 'trial_3d' | '1m' | '3m' | '6m' | '1y';
  registeredAt: number;
  approvedAt?: number;
  expiresAt: number;
  licenseKey?: string;
  issuedBy?: string;
  registeredDeviceFingerprint?: string;
  registeredIp?: string;
  lastAutoUninstallAt?: number;
}

export interface DeviceTrialRecord {
  deviceId: string;
  hostname: string;
  ips: string[];
  macs: string[];
  userEmail: string;
  claimedAt: number;
  expiresAt: number;
}

export interface LicenseStatusResult {
  isLoggedIn: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: UserAccountStatus;
    planId: string;
    planName: string;
    registeredAt: number;
    registeredAtFormatted: string;
    approvedAt?: number;
    expiresAt: number;
    expiresAtFormatted: string;
    licenseKey: string;
    issuedBy: string;
  } | null;
  isAdmin: boolean;
  isPendingApproval: boolean;
  canAccessApps: boolean;
  isExpired: boolean;
  isTrial: boolean;
  timeRemaining: {
    totalMs: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
  };
  deviceInfo: {
    hostname: string;
    primaryIp: string;
    deviceId: string;
    isTrialClaimedOnDevice: boolean;
  };
  installedAppsCount: number;
}

export class LicenseService {
  private licenseFilePath: string;
  private deviceTrialsFilePath: string;

  constructor(_workspaceRoot?: string) {
    const configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'OfficeX');
    if (!fs.existsSync(configDir)) {
      try { fs.mkdirSync(configDir, { recursive: true }); } catch {}
    }
    this.licenseFilePath = path.join(configDir, 'user_license.json');
    this.deviceTrialsFilePath = path.join(configDir, 'device_trials.json');
    this.removeLegacyAdmins();
  }

  private removeLegacyAdmins(): void {
    const storage = this.readStorage();
    const legacyAdminIds = new Set(['usr_master_admin', 'usr_admin_taductoi']);
    const users = storage.users.filter((user) => !legacyAdminIds.has(user.id));
    const currentUser = storage.currentUser && legacyAdminIds.has(storage.currentUser.id)
      ? null
      : storage.currentUser;

    if (users.length !== storage.users.length || currentUser !== storage.currentUser) {
      this.writeStorage({ users, currentUser });
    }
  }

  /**
   * Calculate Hardware ID / Device Fingerprint and gather local IP addresses
   */
  public getDeviceFingerprintInfo(): {
    deviceId: string;
    hostname: string;
    primaryIp: string;
    allIps: string[];
    macs: string[];
  } {
    const hostname = os.hostname();
    const networkInterfaces = os.networkInterfaces();
    const allIps: string[] = [];
    const macs: string[] = [];

    for (const name of Object.keys(networkInterfaces)) {
      const ifaceList = networkInterfaces[name];
      if (ifaceList) {
        for (const iface of ifaceList) {
          if (!iface.internal && iface.family === 'IPv4') {
            allIps.push(iface.address);
          }
          if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
            macs.push(iface.mac);
          }
        }
      }
    }

    const primaryIp = allIps[0] || '127.0.0.1';
    const cpuModel = os.cpus()[0]?.model || '';
    const rawHardwareString = `${hostname}|${os.platform()}|${os.arch()}|${cpuModel}|${macs.sort().join(',')}`;
    const deviceId = 'WP-' + crypto.createHash('sha256').update(rawHardwareString).digest('hex').substring(0, 16).toUpperCase();

    return {
      deviceId,
      hostname,
      primaryIp,
      allIps,
      macs,
    };
  }

  private readStorage(): { currentUser: UserAccount | null; users: UserAccount[] } {
    if (!fs.existsSync(this.licenseFilePath)) {
      return { currentUser: null, users: [] };
    }
    try {
      const raw = fs.readFileSync(this.licenseFilePath, 'utf-8');
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.users)) {
        data.users = data.users.map((u: any) => {
          return {
            ...u,
            role: u.role || 'user',
            status: u.status || 'pending',
          };
        });
      }
      if (data && data.currentUser) {
        data.currentUser = {
          ...data.currentUser,
          role: data.currentUser.role || 'user',
          status: data.currentUser.status || 'pending',
        };
      }
      return data;
    } catch {
      return { currentUser: null, users: [] };
    }
  }

  private writeStorage(data: { currentUser: UserAccount | null; users: UserAccount[] }): void {
    try {
      fs.writeFileSync(this.licenseFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LicenseService] Failed to write license file:', err);
    }
  }

  private readDeviceTrials(): DeviceTrialRecord[] {
    if (!fs.existsSync(this.deviceTrialsFilePath)) {
      return [];
    }
    try {
      const raw = fs.readFileSync(this.deviceTrialsFilePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private writeDeviceTrials(trials: DeviceTrialRecord[]): void {
    try {
      fs.writeFileSync(this.deviceTrialsFilePath, JSON.stringify(trials, null, 2), 'utf-8');
    } catch (err) {
      console.error('[LicenseService] Failed to write device trials file:', err);
    }
  }

  /**
   * Check if Windows Registry contains a trial claim marker (anti-tamper fallback)
   */
  private checkRegistryTrialMarker(): boolean {
    try {
      const output = execSync('reg query "HKCU\\Software\\WorkplaceSuite" /v TrialClaimed', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      return output.includes('TrialClaimed');
    } catch {
      return false;
    }
  }

  /**
   * Save trial claim marker in Windows Registry
   */
  private writeRegistryTrialMarker(email: string, date: number): void {
    try {
      execSync('reg add "HKCU\\Software\\WorkplaceSuite" /v TrialClaimed /t REG_SZ /d "' + email + '|' + date + '" /f', { stdio: 'ignore' });
    } catch (e) {
      console.warn('[LicenseService] Could not write registry trial marker:', e);
    }
  }

  /**
   * Check if this computer / IP / Hardware ID has already used the 3-day free trial
   */
  public isDeviceEligibleForTrial(): { eligible: boolean; record?: DeviceTrialRecord; reason?: string } {
    const info = this.getDeviceFingerprintInfo();
    const trials = this.readDeviceTrials();

    const match = trials.find((t) => {
      if (t.deviceId === info.deviceId) return true;
      if (t.hostname.toLowerCase() === info.hostname.toLowerCase()) return true;
      const hasMatchingIp = t.ips.some((ip) => info.allIps.includes(ip) && ip !== '127.0.0.1');
      if (hasMatchingIp) return true;
      const hasMatchingMac = t.macs.some((mac) => info.macs.includes(mac));
      if (hasMatchingMac) return true;
      return false;
    });

    if (match) {
      const dateStr = new Date(match.claimedAt).toLocaleDateString('vi-VN');
      return {
        eligible: false,
        record: match,
        reason: `Máy tính (${info.hostname} - IP: ${info.primaryIp}) đã từng kích hoạt gói Dùng thử 3 Ngày vào ngày ${dateStr} cho tài khoản ${match.userEmail}. Mỗi máy tính chỉ được dùng thử 1 lần duy nhất!`,
      };
    }

    if (this.checkRegistryTrialMarker()) {
      return {
        eligible: false,
        reason: `Máy tính này (${info.hostname}) đã ghi nhận lượt dùng thử trước đó trong hệ thống Windows. Mỗi thiết bị chỉ được dùng thử 1 lần duy nhất!`,
      };
    }

    return { eligible: true };
  }

  /**
   * Record a claimed trial for this device
   */
  private recordDeviceTrialClaim(email: string, expiresAt: number): void {
    const info = this.getDeviceFingerprintInfo();
    const trials = this.readDeviceTrials();
    const now = Date.now();

    const newRecord: DeviceTrialRecord = {
      deviceId: info.deviceId,
      hostname: info.hostname,
      ips: info.allIps,
      macs: info.macs,
      userEmail: email,
      claimedAt: now,
      expiresAt,
    };

    trials.push(newRecord);
    this.writeDeviceTrials(trials);
    this.writeRegistryTrialMarker(email, now);
  }

  /**
   * Get current license & subscription status
   */
  public getStatus(): LicenseStatusResult {
    const { currentUser } = this.readStorage();
    const deviceInfo = this.getDeviceFingerprintInfo();
    const eligibility = this.isDeviceEligibleForTrial();

    if (!currentUser) {
      return {
        isLoggedIn: false,
        user: null,
        isAdmin: false,
        isPendingApproval: false,
        canAccessApps: false,
        isExpired: true,
        isTrial: false,
        timeRemaining: { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Chưa đăng nhập' },
        deviceInfo: {
          hostname: deviceInfo.hostname,
          primaryIp: deviceInfo.primaryIp,
          deviceId: deviceInfo.deviceId,
          isTrialClaimedOnDevice: !eligibility.eligible,
        },
        installedAppsCount: 0,
      };
    }

    const now = Date.now();
    const isAdmin = currentUser.role === 'admin';
    const isPendingApproval = currentUser.status === 'pending';
    const isApproved = currentUser.status === 'approved' || isAdmin;
    const isExpired = isApproved ? (now >= currentUser.expiresAt) : true;
    const canAccessApps = isApproved && !isExpired;
    const isTrial = currentUser.planId === 'trial_3d';

    const remainingMs = isApproved ? Math.max(0, currentUser.expiresAt - now) : 0;
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    let formatted = '';
    if (isPendingApproval) {
      formatted = 'Đang chờ Admin duyệt';
    } else if (currentUser.status === 'blocked') {
      formatted = 'Tài khoản bị khóa';
    } else if (currentUser.status === 'rejected') {
      formatted = 'Đã bị từ chối';
    } else if (isExpired) {
      formatted = 'Đã hết hạn';
    } else if (isAdmin) {
      formatted = 'Vô hạn (Admin VIP)';
    } else if (days > 0) {
      formatted = `${days} ngày ${hours} giờ còn lại`;
    } else if (hours > 0) {
      formatted = `${hours} giờ ${minutes} phút còn lại`;
    } else {
      formatted = `${minutes} phút ${seconds} giây còn lại`;
    }

    const plan = SUBSCRIPTION_PLANS[currentUser.planId] || SUBSCRIPTION_PLANS.trial_3d;
    const licenseKey = currentUser.licenseKey || ('WPS-2026-TDT-' + crypto.createHash('md5').update(currentUser.id + currentUser.email).digest('hex').substring(0, 8).toUpperCase() + '-' + crypto.createHash('sha256').update(currentUser.registeredAt.toString()).digest('hex').substring(0, 8).toUpperCase());
    const issuedBy = currentUser.issuedBy || 'TẠ ĐỨC TỚI';
    const registeredAtFormatted = new Date(currentUser.registeredAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const expiresAtFormatted = isAdmin 
      ? 'Vô Hạn (VIP Vĩnh Viễn)' 
      : new Date(currentUser.expiresAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    return {
      isLoggedIn: true,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        fullName: currentUser.fullName,
        role: currentUser.role,
        status: currentUser.status,
        planId: currentUser.planId,
        planName: plan.name,
        registeredAt: currentUser.registeredAt,
        registeredAtFormatted,
        approvedAt: currentUser.approvedAt,
        expiresAt: currentUser.expiresAt,
        expiresAtFormatted,
        licenseKey,
        issuedBy,
      },
      isAdmin,
      isPendingApproval,
      canAccessApps,
      isExpired,
      isTrial,
      timeRemaining: {
        totalMs: remainingMs,
        days,
        hours,
        minutes,
        seconds,
        formatted,
      },
      deviceInfo: {
        hostname: deviceInfo.hostname,
        primaryIp: deviceInfo.primaryIp,
        deviceId: deviceInfo.deviceId,
        isTrialClaimedOnDevice: !eligibility.eligible,
      },
      installedAppsCount: 0,
    };
  }

  /**
   * Register a new user with selected subscription tier (Requires Admin Approval)
   */
  public async register(payload: {
    email: string;
    fullName: string;
    password?: string;
    planId: 'trial_3d' | '1m' | '3m' | '6m' | '1y';
  }): Promise<{ success: boolean; message: string; code?: string; user?: any; pendingApproval?: boolean }> {
    const { email, fullName, password = '', planId } = payload;
    if (!email || !fullName) {
      return { success: false, message: 'Vui lòng điền đầy đủ Họ tên và Email!' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.trial_3d;
    const now = Date.now();
    const deviceInfo = this.getDeviceFingerprintInfo();

    // If trial plan, check device eligibility
    // EXCEPTION: If the same email is re-registering (upgrading plan), allow it
    if (plan.id === 'trial_3d') {
      const storage = this.readStorage();
      const existingUserForEmail = storage.users.find((u) => u.email.toLowerCase() === trimmedEmail);
      // Allow re-registration for same email even if device has trial record
      if (!existingUserForEmail) {
        const eligibility = this.isDeviceEligibleForTrial();
        if (!eligibility.eligible) {
          return {
            success: false,
            code: 'TRIAL_ALREADY_USED',
            message: eligibility.reason || `Máy tính này đã từng sử dụng gói Dùng thử 3 Ngày. Mỗi thiết bị / IP chỉ được dùng thử 1 lần duy nhất! Vui lòng chọn gói trả phí.`,
          };
        }
      }
    }

    const storage = this.readStorage();
    const existingIndex = storage.users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

    const role: UserRole = 'user';
    const status: UserAccountStatus = 'pending';
    const expiresAt = now + plan.durationMs;

    const licenseKey = 'WPS-2026-TDT-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const newUser: UserAccount = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      fullName: fullName.trim(),
      passwordHash: Buffer.from(password).toString('base64'),
      role,
      status,
      planId: plan.id,
      licenseKey,
      issuedBy: 'TẠ ĐỨC TỚI',
      registeredAt: now,
      expiresAt,
      registeredDeviceFingerprint: deviceInfo.deviceId,
      registeredIp: deviceInfo.primaryIp,
    };

    if (existingIndex >= 0) {
      storage.users[existingIndex] = newUser;
    } else {
      storage.users.push(newUser);
    }

    storage.currentUser = null;
    this.writeStorage(storage);

    // If trial was claimed, record in device ledger
    if (plan.id === 'trial_3d') {
      this.recordDeviceTrialClaim(trimmedEmail, expiresAt);
    }

    return {
      success: true,
      pendingApproval: true,
      message: `Đăng ký thành công! Tài khoản ${trimmedEmail} đang chờ quản trị viên phê duyệt.`,
      user: newUser,
    };
  }

  /**
   * Login user
   */
  public async login(email: string, password: string = ''): Promise<{ success: boolean; message: string; user?: any; pendingApproval?: boolean }> {
    if (!email) {
      return { success: false, message: 'Vui lòng nhập Email để đăng nhập!' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const storage = this.readStorage();
    const user = storage.users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return {
        success: false,
        message: `Tài khoản "${email}" chưa tồn tại. Vui lòng chuyển sang tab "Đăng ký mới" để tạo tài khoản!`,
      };
    }

    // Verify password if provided
    if (password) {
      const hash = Buffer.from(password).toString('base64');
      if (user.passwordHash && user.passwordHash !== hash) {
        return { success: false, message: 'Mật khẩu không chính xác!' };
      }
    }

    if (user.status === 'pending') {
      return {
        success: false,
        pendingApproval: true,
        message: `Tài khoản ${user.email} đang ở trạng thái CHỜ ADMIN PHÊ DUYỆT. Vui lòng liên hệ Quản trị viên để được phê duyệt trước khi đăng nhập!`,
      };
    }

    if (user.status === 'blocked') {
      return {
        success: false,
        message: `Tài khoản ${user.email} đã bị Quản trị viên KHÓA. Vui lòng liên hệ Admin để được mở khóa!`,
      };
    }

    if (user.status === 'rejected') {
      return {
        success: false,
        message: `Tài khoản ${user.email} đã bị TỪ CHỐI phê duyệt. Vui lòng liên hệ Admin!`,
      };
    }

    storage.currentUser = user;
    this.writeStorage(storage);

    return {
      success: true,
      message: `Đăng nhập thành công! Chào mừng ${user.fullName} (${user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}).`,
      user,
    };
  }

  // ── ADMIN MANAGEMENT METHODS ───────────────────────────────────────────────

  /**
   * Get all registered users (For Admin)
   */
  public getAllUsers(): UserAccount[] {
    const storage = this.readStorage();
    return storage.users;
  }

  /**
   * Approve a user account and activate their subscription duration from the moment of approval
   */
  public approveUser(userId: string, customPlanId?: 'trial_3d' | '1m' | '3m' | '6m' | '1y'): { success: boolean; message: string; user?: UserAccount } {
    const storage = this.readStorage();
    const user = storage.users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, message: 'Không tìm thấy người dùng!' };
    }

    const planId = customPlanId || user.planId || 'trial_3d';
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.trial_3d;
    const now = Date.now();

    user.status = 'approved';
    user.planId = plan.id;
    user.approvedAt = now;
    user.expiresAt = now + plan.durationMs;

    if (storage.currentUser && storage.currentUser.id === user.id) {
      storage.currentUser = user;
    }

    this.writeStorage(storage);

    // If trial plan was approved, record device trial
    if (plan.id === 'trial_3d') {
      this.recordDeviceTrialClaim(user.email, user.expiresAt);
    }

    return {
      success: true,
      message: `Đã phê duyệt tài khoản "${user.email}" với gói "${plan.name}" (Thời hạn: ${plan.durationDays} ngày)!`,
      user,
    };
  }

  /**
   * Reject a pending user account
   */
  public rejectUser(userId: string): { success: boolean; message: string } {
    const storage = this.readStorage();
    const user = storage.users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Không tìm thấy người dùng!' };
    if (user.role === 'admin') return { success: false, message: 'Không thể từ chối tài khoản Admin!' };

    user.status = 'rejected';
    if (storage.currentUser && storage.currentUser.id === user.id) {
      storage.currentUser = user;
    }
    this.writeStorage(storage);
    return { success: true, message: `Đã từ chối tài khoản "${user.email}".` };
  }

  /**
   * Block / Ban a user
   */
  public blockUser(userId: string): { success: boolean; message: string } {
    const storage = this.readStorage();
    const user = storage.users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Không tìm thấy người dùng!' };
    if (user.role === 'admin') return { success: false, message: 'Không thể khóa tài khoản Admin!' };

    user.status = 'blocked';
    if (storage.currentUser && storage.currentUser.id === user.id) {
      storage.currentUser = user;
    }
    this.writeStorage(storage);
    return { success: true, message: `Đã khóa tài khoản "${user.email}".` };
  }

  /**
   * Delete user permanently
   */
  public deleteUser(userId: string): { success: boolean; message: string } {
    const storage = this.readStorage();
    const index = storage.users.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, message: 'Không tìm thấy người dùng!' };
    if (storage.users[index].role === 'admin') return { success: false, message: 'Không thể xóa tài khoản Admin!' };

    const deleted = storage.users.splice(index, 1)[0];
    if (storage.currentUser && storage.currentUser.id === userId) {
      storage.currentUser = null;
    }
    this.writeStorage(storage);
    return { success: true, message: `Đã xóa tài khoản "${deleted.email}".` };
  }

  /**
   * Extend user subscription expiration by custom number of days
   */
  public extendUserExpiry(userId: string, additionalDays: number): { success: boolean; message: string; user?: UserAccount } {
    const storage = this.readStorage();
    const user = storage.users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Không tìm thấy người dùng!' };

    const now = Date.now();
    const base = user.expiresAt > now ? user.expiresAt : now;
    const additionalMs = additionalDays * 24 * 60 * 60 * 1000;
    user.expiresAt = base + additionalMs;
    user.status = 'approved';

    if (storage.currentUser && storage.currentUser.id === user.id) {
      storage.currentUser = user;
    }
    this.writeStorage(storage);

    return {
      success: true,
      message: `Đã gia hạn thêm ${additionalDays} ngày cho tài khoản "${user.email}". Hạn dùng mới: ${new Date(user.expiresAt).toLocaleDateString('vi-VN')}.`,
      user,
    };
  }

  /**
   * Upgrade or renew subscription plan
   */
  public async upgradePlan(planId: 'trial_3d' | '1m' | '3m' | '6m' | '1y'): Promise<{ success: boolean; message: string }> {
    const storage = this.readStorage();
    if (!storage.currentUser) {
      return { success: false, message: 'Vui lòng đăng nhập trước khi gia hạn hoặc nâng cấp gói!' };
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return { success: false, message: 'Gói bản quyền không hợp lệ!' };
    }

    if (plan.id === 'trial_3d') {
      return {
        success: false,
        message: 'Không thể nâng cấp lại gói dùng thử. Gói dùng thử chỉ áp dụng 1 lần duy nhất khi tạo tài khoản mới.',
      };
    }

    const now = Date.now();
    const baseTime = storage.currentUser.expiresAt > now ? storage.currentUser.expiresAt : now;
    const newExpiresAt = baseTime + plan.durationMs;

    storage.currentUser.planId = plan.id;
    storage.currentUser.expiresAt = newExpiresAt;
    storage.currentUser.status = 'approved';
    // Clear lastAutoUninstallAt so user can reinstall apps after upgrading
    delete storage.currentUser.lastAutoUninstallAt;

    const userIdx = storage.users.findIndex((u) => u.id === storage.currentUser!.id);
    if (userIdx >= 0) {
      storage.users[userIdx] = storage.currentUser;
    }

    this.writeStorage(storage);

    return {
      success: true,
      message: `Gia hạn thành công "${plan.name}"! Hạn dùng mới được kéo dài thêm ${plan.durationDays} ngày. Bạn có thể cài đặt lại ứng dụng ngay bây giờ!`,
    };
  }

  /**
   * Logout current user
   */
  public logout(): { success: boolean; message: string } {
    const storage = this.readStorage();
    storage.currentUser = null;
    this.writeStorage(storage);
    return { success: true, message: 'Đã đăng xuất tài khoản.' };
  }

  /**
   * Check if current logged-in user is allowed to install apps on this device.
   * - Admin: always allowed
   * - Approved + non-expired: always allowed (paid or trial)
   * - Same email as device trial claimant + now has paid plan: allowed (reinstall scenario)
   */
  public canInstallApps(): { allowed: boolean; reason?: string } {
    const status = this.getStatus();
    if (!status.isLoggedIn) {
      return { allowed: false, reason: 'Vui lòng đăng nhập trước khi cài đặt ứng dụng!' };
    }
    if (status.isAdmin) {
      return { allowed: true };
    }
    if (status.isPendingApproval) {
      return { allowed: false, reason: 'Tài khoản đang chờ Quản trị viên phê duyệt!' };
    }
    if (!status.isExpired) {
      return { allowed: true };
    }
    // Expired — check if it's just an auto-uninstall state that can be re-installed if they upgrade
    return { allowed: false, reason: 'Bản quyền đã hết hạn. Vui lòng gia hạn để cài đặt lại ứng dụng!' };
  }

  /**
   * Reset lastAutoUninstallAt for current user so they can reinstall apps.
   * Called automatically after upgradePlan, or manually by admin.
   */
  public resetInstallBlock(userId?: string): { success: boolean; message: string } {
    const storage = this.readStorage();
    const targetId = userId || storage.currentUser?.id;
    if (!targetId) {
      return { success: false, message: 'Không xác định được người dùng cần reset!' };
    }
    const user = storage.users.find((u) => u.id === targetId);
    if (!user) {
      return { success: false, message: 'Không tìm thấy người dùng!' };
    }
    delete user.lastAutoUninstallAt;
    if (storage.currentUser && storage.currentUser.id === targetId) {
      delete storage.currentUser.lastAutoUninstallAt;
    }
    this.writeStorage(storage);
    return { success: true, message: `Đã reset trạng thái cài đặt cho "${user.email}". Bạn có thể cài lại ứng dụng!` };
  }

  /**
   * Check if subscription has expired.
   * If expired -> AUTOMATICALLY UNINSTALL all standalone apps from Windows PC (Desktop, Start Menu, Control Panel).
   */
  public async checkAndEnforceExpiry(installerService: WindowsAppInstallerService): Promise<{
    isExpired: boolean;
    autoUninstalled: string[];
  }> {
    const status = this.getStatus();
    const autoUninstalled: string[] = [];

    if (status.isExpired) {
      console.log('[LicenseEnforcement] Subscription has expired! Triggering auto-uninstall of PC apps...');
      const storage = this.readStorage();

      const now = Date.now();
      if (!storage.currentUser?.lastAutoUninstallAt || (now - storage.currentUser.lastAutoUninstallAt > 60 * 60 * 1000)) {
        try {
          const allStatuses = await installerService.getAllAppsStatus();
          for (const appId of Object.keys(WORKPLACE_APPS)) {
            if (allStatuses[appId]?.isInstalled) {
              console.log(`[LicenseEnforcement] Auto-uninstalling expired app: ${appId}`);
              await installerService.uninstallApp(appId);
              autoUninstalled.push(appId);
            }
          }
        } catch (err) {
          console.error('[LicenseEnforcement] Error during batch uninstall:', err);
        }

        if (storage.currentUser) {
          storage.currentUser.lastAutoUninstallAt = now;
          this.writeStorage(storage);
        }
      }
    }

    return {
      isExpired: status.isExpired,
      autoUninstalled,
    };
  }
}
