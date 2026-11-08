import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Collection, Document, MongoClient } from 'mongodb';
import { WindowsAppInstallerService, WORKPLACE_APPS } from './WindowsAppInstallerService';
import { SUBSCRIPTION_PLANS, DeviceTrialRecord, LicenseStatusResult, UserAccount, UserAccountStatus } from './LicenseService';

interface MongoUserDocument extends Document {
  _id: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  role?: string;
  isActive?: boolean;
  licenseStatus?: string;
  planId?: string;
  createdAt?: Date | number;
  approvedAt?: Date | number;
  expiresAt?: Date | number;
  licenseKey?: string;
  issuedBy?: string;
  registeredDeviceFingerprint?: string;
  registeredIp?: string;
  lastAutoUninstallAt?: Date | number;
}

let userCollectionPromise: Promise<Collection<MongoUserDocument>> | undefined;
let mongoClient: MongoClient | undefined;

function getDatabaseName(uri: string): string {
  return decodeURIComponent(new URL(uri).pathname.replace(/^\/+/, '')) || 'officex_db';
}

function getUserCollection(): Promise<Collection<MongoUserDocument>> {
  if (!userCollectionPromise) {
    const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/officex_db?replicaSet=rs0';
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    userCollectionPromise = mongoClient.connect()
      .then((client) => client.db(getDatabaseName(uri)).collection<MongoUserDocument>('User'))
      .catch((error) => {
        userCollectionPromise = undefined;
        mongoClient = undefined;
        throw error;
      });
  }
  return userCollectionPromise;
}

function toEpoch(value: Date | number | undefined, fallback = 0): number {
  if (value instanceof Date) return value.getTime();
  return typeof value === 'number' ? value : fallback;
}

function publicUser(user: UserAccount): Omit<UserAccount, 'passwordHash'> {
  const { passwordHash: _passwordHash, ...result } = user;
  return result;
}

export class MongoLicenseService {
  private readonly legacyLicenseFilePath: string;
  private readonly sessionFilePath: string;
  private readonly deviceTrialsFilePath: string;

  constructor(_workspaceRoot?: string) {
    const configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'OfficeX');
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    this.legacyLicenseFilePath = path.join(configDir, 'user_license.json');
    this.sessionFilePath = path.join(configDir, 'user_session.json');
    this.deviceTrialsFilePath = path.join(configDir, 'device_trials.json');
    this.removeLegacyAccountFile();
  }

  private removeLegacyAccountFile(): void {
    if (!fs.existsSync(this.legacyLicenseFilePath)) return;
    try {
      fs.unlinkSync(this.legacyLicenseFilePath);
    } catch {
      try {
        fs.writeFileSync(this.legacyLicenseFilePath, JSON.stringify({ currentUser: null, users: [] }), 'utf-8');
      } catch (error) {
        console.error('[LicenseService] Could not clear legacy account file:', error);
      }
    }
  }

  private readCurrentUserId(): string | null {
    try {
      const session = JSON.parse(fs.readFileSync(this.sessionFilePath, 'utf-8'));
      return typeof session.userId === 'string' ? session.userId : null;
    } catch {
      return null;
    }
  }

  private writeCurrentUserId(userId: string | null): void {
    if (!userId) {
      try { fs.unlinkSync(this.sessionFilePath); } catch {}
      return;
    }
    fs.writeFileSync(this.sessionFilePath, JSON.stringify({ userId }), 'utf-8');
  }

  private toAccount(document: MongoUserDocument): UserAccount {
    const isAdmin = document.role === 'ADMIN' || document.role === 'SUPER_ADMIN' || document.role === 'admin';
    const status = (document.licenseStatus?.toLowerCase() as UserAccountStatus | undefined)
      || (document.isActive === false ? 'blocked' : isAdmin ? 'approved' : 'pending');
    const expiresAt = toEpoch(document.expiresAt, isAdmin ? Number.MAX_SAFE_INTEGER : 0);
    const createdAt = toEpoch(document.createdAt, Date.now());

    return {
      id: document._id,
      email: document.email,
      fullName: document.displayName || document.email,
      passwordHash: document.passwordHash,
      role: isAdmin ? 'admin' : 'user',
      status,
      planId: (document.planId as UserAccount['planId']) || (isAdmin ? '1y' : 'trial_3d'),
      registeredAt: createdAt,
      approvedAt: toEpoch(document.approvedAt) || undefined,
      expiresAt,
      licenseKey: document.licenseKey,
      issuedBy: document.issuedBy || 'OfficeX',
      registeredDeviceFingerprint: document.registeredDeviceFingerprint,
      registeredIp: document.registeredIp,
      lastAutoUninstallAt: toEpoch(document.lastAutoUninstallAt) || undefined,
    };
  }

  private async getCurrentUser(): Promise<UserAccount | null> {
    const userId = this.readCurrentUserId();
    if (!userId) return null;
    const users = await getUserCollection();
    const document = await users.findOne({ _id: userId });
    if (!document) this.writeCurrentUserId(null);
    return document ? this.toAccount(document) : null;
  }

  private async isCurrentUserAdmin(): Promise<boolean> {
    return (await this.getCurrentUser())?.role === 'admin';
  }

  public getDeviceFingerprintInfo(): {
    deviceId: string;
    hostname: string;
    primaryIp: string;
    allIps: string[];
    macs: string[];
  } {
    const hostname = os.hostname();
    const interfaces = os.networkInterfaces();
    const allIps: string[] = [];
    const macs: string[] = [];

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (!iface.internal && iface.family === 'IPv4') allIps.push(iface.address);
        if (iface.mac && iface.mac !== '00:00:00:00:00:00') macs.push(iface.mac);
      }
    }

    const primaryIp = allIps[0] || '127.0.0.1';
    const cpuModel = os.cpus()[0]?.model || '';
    const raw = `${hostname}|${os.platform()}|${os.arch()}|${cpuModel}|${macs.sort().join(',')}`;
    const deviceId = `WP-${crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16).toUpperCase()}`;
    return { deviceId, hostname, primaryIp, allIps, macs };
  }

  private readDeviceTrials(): DeviceTrialRecord[] {
    try {
      return JSON.parse(fs.readFileSync(this.deviceTrialsFilePath, 'utf-8'));
    } catch {
      return [];
    }
  }

  private writeDeviceTrials(trials: DeviceTrialRecord[]): void {
    try {
      fs.writeFileSync(this.deviceTrialsFilePath, JSON.stringify(trials, null, 2), 'utf-8');
    } catch (error) {
      console.error('[LicenseService] Failed to write device trial data:', error);
    }
  }

  private checkRegistryTrialMarker(): boolean {
    try {
      const { execSync } = require('child_process');
      const output = execSync('reg query "HKCU\\Software\\WorkplaceSuite" /v TrialClaimed', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      return output.includes('TrialClaimed');
    } catch {
      return false;
    }
  }

  private writeRegistryTrialMarker(email: string, date: number): void {
    try {
      const { execSync } = require('child_process');
      execSync('reg add "HKCU\\Software\\WorkplaceSuite" /v TrialClaimed /t REG_SZ /d "' + email + '|' + date + '" /f', { stdio: 'ignore' });
    } catch {}
  }

  public isDeviceEligibleForTrial(): { eligible: boolean; record?: DeviceTrialRecord; reason?: string } {
    const info = this.getDeviceFingerprintInfo();
    const match = this.readDeviceTrials().find((trial) => {
      if (trial.deviceId === info.deviceId || trial.hostname.toLowerCase() === info.hostname.toLowerCase()) return true;
      if (trial.ips.some((ip) => info.allIps.includes(ip) && ip !== '127.0.0.1')) return true;
      return trial.macs.some((mac) => info.macs.includes(mac));
    });

    if (match) {
      const date = new Date(match.claimedAt).toLocaleDateString('vi-VN');
      return {
        eligible: false,
        record: match,
        reason: `Máy tính (${info.hostname} - IP: ${info.primaryIp}) đã dùng thử vào ngày ${date} cho tài khoản ${match.userEmail}.`,
      };
    }
    if (this.checkRegistryTrialMarker()) {
      return { eligible: false, reason: `Máy tính này (${info.hostname}) đã ghi nhận lượt dùng thử trước đó.` };
    }
    return { eligible: true };
  }

  private recordDeviceTrialClaim(email: string, expiresAt: number): void {
    const info = this.getDeviceFingerprintInfo();
    const trials = this.readDeviceTrials();
    trials.push({
      deviceId: info.deviceId,
      hostname: info.hostname,
      ips: info.allIps,
      macs: info.macs,
      userEmail: email,
      claimedAt: Date.now(),
      expiresAt,
    });
    this.writeDeviceTrials(trials);
    this.writeRegistryTrialMarker(email, Date.now());
  }

  public async getStatus(): Promise<LicenseStatusResult> {
    const deviceInfo = this.getDeviceFingerprintInfo();
    const eligibility = this.isDeviceEligibleForTrial();
    const currentUser = await this.getCurrentUser();
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
        deviceInfo: { hostname: deviceInfo.hostname, primaryIp: deviceInfo.primaryIp, deviceId: deviceInfo.deviceId, isTrialClaimedOnDevice: !eligibility.eligible },
        installedAppsCount: 0,
      };
    }

    const isAdmin = currentUser.role === 'admin';
    const isPendingApproval = currentUser.status === 'pending';
    const isApproved = currentUser.status === 'approved';
    const isExpired = !isApproved || (!isAdmin && Date.now() >= currentUser.expiresAt);
    const canAccessApps = isApproved && !isExpired;
    const isTrial = currentUser.planId === 'trial_3d';
    const remainingMs = isAdmin ? Number.MAX_SAFE_INTEGER : isApproved ? Math.max(0, currentUser.expiresAt - Date.now()) : 0;
    const days = isAdmin ? 0 : Math.floor(remainingMs / 86400000);
    const hours = Math.floor((remainingMs % 86400000) / 3600000);
    const minutes = Math.floor((remainingMs % 3600000) / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    const formatted = isPendingApproval ? 'Đang chờ Admin duyệt'
      : currentUser.status === 'blocked' ? 'Tài khoản bị khóa'
        : currentUser.status === 'rejected' ? 'Đã bị từ chối'
          : isExpired ? 'Đã hết hạn'
            : isAdmin ? 'Vô hạn (Admin VIP)'
              : days > 0 ? `${days} ngày ${hours} giờ còn lại`
                : hours > 0 ? `${hours} giờ ${minutes} phút còn lại`
                  : `${minutes} phút ${seconds} giây còn lại`;
    const plan = SUBSCRIPTION_PLANS[currentUser.planId] || SUBSCRIPTION_PLANS.trial_3d;
    const licenseKey = currentUser.licenseKey || `WPS-2026-${crypto.createHash('sha256').update(currentUser.id + currentUser.email).digest('hex').substring(0, 16).toUpperCase()}`;

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
        registeredAtFormatted: new Date(currentUser.registeredAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        approvedAt: currentUser.approvedAt,
        expiresAt: currentUser.expiresAt,
        expiresAtFormatted: isAdmin ? 'Vô Hạn (VIP Vĩnh Viễn)' : new Date(currentUser.expiresAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        licenseKey,
        issuedBy: currentUser.issuedBy || 'OfficeX',
      },
      isAdmin,
      isPendingApproval,
      canAccessApps,
      isExpired,
      isTrial,
      timeRemaining: { totalMs: remainingMs, days, hours, minutes, seconds, formatted },
      deviceInfo: { hostname: deviceInfo.hostname, primaryIp: deviceInfo.primaryIp, deviceId: deviceInfo.deviceId, isTrialClaimedOnDevice: !eligibility.eligible },
      installedAppsCount: 0,
    };
  }

  public async register(payload: { email: string; fullName: string; password?: string; planId: UserAccount['planId'] }): Promise<{ success: boolean; message: string; code?: string; user?: Omit<UserAccount, 'passwordHash'>; pendingApproval?: boolean }> {
    const email = payload.email?.trim().toLowerCase();
    const fullName = payload.fullName?.trim();
    const password = payload.password || '';
    if (!email || !fullName || password.length < 6) {
      return { success: false, message: 'Vui lòng nhập họ tên, email và mật khẩu ít nhất 6 ký tự.' };
    }

    const plan = SUBSCRIPTION_PLANS[payload.planId] || SUBSCRIPTION_PLANS.trial_3d;
    if (plan.id === 'trial_3d') {
      const eligibility = this.isDeviceEligibleForTrial();
      if (!eligibility.eligible) return { success: false, code: 'TRIAL_ALREADY_USED', message: eligibility.reason || 'Thiết bị này đã dùng thử.' };
    }

    const users = await getUserCollection();
    if (await users.findOne({ email })) return { success: false, message: 'Email đã được đăng ký.' };

    const now = Date.now();
    const expiresAt = now + plan.durationMs;
    const document: MongoUserDocument = {
      _id: crypto.randomUUID(),
      email,
      passwordHash: await bcrypt.hash(password, 12),
      displayName: fullName,
      role: 'USER',
      isActive: true,
      licenseStatus: 'PENDING',
      planId: plan.id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
      expiresAt: new Date(expiresAt),
      licenseKey: `WPS-2026-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      issuedBy: 'OfficeX',
      registeredDeviceFingerprint: this.getDeviceFingerprintInfo().deviceId,
      registeredIp: this.getDeviceFingerprintInfo().primaryIp,
    };

    try {
      await users.insertOne(document);
    } catch (error: any) {
      if (error?.code === 11000) return { success: false, message: 'Email đã được đăng ký.' };
      throw error;
    }
    if (plan.id === 'trial_3d') this.recordDeviceTrialClaim(email, expiresAt);
    return {
      success: true,
      pendingApproval: true,
      message: `Đăng ký thành công! Tài khoản ${email} đang chờ quản trị viên phê duyệt.`,
      user: publicUser(this.toAccount(document)),
    };
  }

  public async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: Omit<UserAccount, 'passwordHash'>; pendingApproval?: boolean }> {
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail || !password) return { success: false, message: 'Vui lòng nhập email và mật khẩu.' };
    const users = await getUserCollection();
    const document = await users.findOne({ email: trimmedEmail });
    if (!document || !(await bcrypt.compare(password, document.passwordHash))) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác.' };
    }

    const user = this.toAccount(document);
    if (user.status === 'pending') return { success: false, pendingApproval: true, message: `Tài khoản ${user.email} đang chờ quản trị viên phê duyệt.` };
    if (user.status === 'blocked') return { success: false, message: `Tài khoản ${user.email} đã bị khóa.` };
    if (user.status === 'rejected') return { success: false, message: `Tài khoản ${user.email} đã bị từ chối.` };

    this.writeCurrentUserId(user.id);
    await users.updateOne({ _id: user.id }, { $set: { lastLoginAt: new Date(), updatedAt: new Date() } });
    return { success: true, message: `Đăng nhập thành công. Chào mừng ${user.fullName}.`, user: publicUser(user) };
  }

  public async logout(): Promise<{ success: boolean; message: string }> {
    this.writeCurrentUserId(null);
    return { success: true, message: 'Đã đăng xuất tài khoản.' };
  }

  public async close(): Promise<void> {
    if (mongoClient) await mongoClient.close();
    mongoClient = undefined;
    userCollectionPromise = undefined;
  }

  public async getAllUsers(): Promise<Omit<UserAccount, 'passwordHash'>[]> {
    if (!(await this.isCurrentUserAdmin())) return [];
    const users = await getUserCollection();
    const documents = await users.find({}).sort({ createdAt: -1 }).toArray();
    return documents.map((document) => publicUser(this.toAccount(document)));
  }

  public async approveUser(userId: string, customPlanId?: UserAccount['planId']): Promise<{ success: boolean; message: string; user?: Omit<UserAccount, 'passwordHash'> }> {
    if (!(await this.isCurrentUserAdmin())) return { success: false, message: 'Chỉ Admin mới được duyệt tài khoản.' };
    const users = await getUserCollection();
    const document = await users.findOne({ _id: userId });
    if (!document) return { success: false, message: 'Không tìm thấy người dùng.' };
    const plan = SUBSCRIPTION_PLANS[customPlanId || document.planId || 'trial_3d'] || SUBSCRIPTION_PLANS.trial_3d;
    const now = new Date();
    const updated = await users.findOneAndUpdate(
      { _id: userId },
      { $set: { licenseStatus: 'APPROVED', isActive: true, planId: plan.id, approvedAt: now, expiresAt: new Date(now.getTime() + plan.durationMs), updatedAt: now } },
      { returnDocument: 'after' },
    );
    const result = updated;
    if (!result) return { success: false, message: 'Không tìm thấy người dùng.' };
    const user = this.toAccount(result);
    if (plan.id === 'trial_3d') this.recordDeviceTrialClaim(user.email, user.expiresAt);
    return { success: true, message: `Đã phê duyệt ${user.email} với gói ${plan.name}.`, user: publicUser(user) };
  }

  public async rejectUser(userId: string): Promise<{ success: boolean; message: string }> {
    if (!(await this.isCurrentUserAdmin())) return { success: false, message: 'Chỉ Admin mới được từ chối tài khoản.' };
    const users = await getUserCollection();
    const target = await users.findOne({ _id: userId });
    if (!target) return { success: false, message: 'Không tìm thấy người dùng.' };
    if (target.role === 'ADMIN' || target.role === 'SUPER_ADMIN') return { success: false, message: 'Không thể từ chối tài khoản Admin.' };
    await users.updateOne({ _id: userId }, { $set: { licenseStatus: 'REJECTED', updatedAt: new Date() } });
    return { success: true, message: `Đã từ chối tài khoản ${target.email}.` };
  }

  public async blockUser(userId: string): Promise<{ success: boolean; message: string }> {
    if (!(await this.isCurrentUserAdmin())) return { success: false, message: 'Chỉ Admin mới được khóa tài khoản.' };
    const users = await getUserCollection();
    const target = await users.findOne({ _id: userId });
    if (!target) return { success: false, message: 'Không tìm thấy người dùng.' };
    if (target.role === 'ADMIN' || target.role === 'SUPER_ADMIN') return { success: false, message: 'Không thể khóa tài khoản Admin.' };
    await users.updateOne({ _id: userId }, { $set: { licenseStatus: 'BLOCKED', isActive: false, updatedAt: new Date() } });
    return { success: true, message: `Đã khóa tài khoản ${target.email}.` };
  }

  public async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    if (!(await this.isCurrentUserAdmin())) return { success: false, message: 'Chỉ Admin mới được xóa tài khoản.' };
    const users = await getUserCollection();
    const target = await users.findOne({ _id: userId });
    if (!target) return { success: false, message: 'Không tìm thấy người dùng.' };
    if (target.role === 'ADMIN' || target.role === 'SUPER_ADMIN') return { success: false, message: 'Không thể xóa tài khoản Admin.' };
    await users.deleteOne({ _id: userId });
    await mongoClient!.db(getDatabaseName(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/officex_db?replicaSet=rs0')).collection('Session').deleteMany({ userId });
    return { success: true, message: `Đã xóa tài khoản ${target.email}.` };
  }

  public async extendUserExpiry(userId: string, additionalDays: number): Promise<{ success: boolean; message: string; user?: Omit<UserAccount, 'passwordHash'> }> {
    if (!(await this.isCurrentUserAdmin())) return { success: false, message: 'Chỉ Admin mới được gia hạn tài khoản.' };
    const users = await getUserCollection();
    const target = await users.findOne({ _id: userId });
    if (!target) return { success: false, message: 'Không tìm thấy người dùng.' };
    const account = this.toAccount(target);
    const expiresAt = new Date(Math.max(account.expiresAt, Date.now()) + additionalDays * 86400000);
    const updated = await users.findOneAndUpdate(
      { _id: userId },
      { $set: { expiresAt, licenseStatus: 'APPROVED', isActive: true, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (!updated) return { success: false, message: 'Không tìm thấy người dùng.' };
    return { success: true, message: `Đã gia hạn ${additionalDays} ngày cho ${target.email}.`, user: publicUser(this.toAccount(updated)) };
  }

  public async upgradePlan(planId: UserAccount['planId']): Promise<{ success: boolean; message: string }> {
    const current = await this.getCurrentUser();
    if (!current) return { success: false, message: 'Vui lòng đăng nhập trước khi gia hạn.' };
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || plan.id === 'trial_3d') return { success: false, message: 'Gói bản quyền không hợp lệ.' };
    const expiresAt = new Date(Math.max(current.expiresAt, Date.now()) + plan.durationMs);
    const users = await getUserCollection();
    await users.updateOne({ _id: current.id }, { $set: { planId: plan.id, expiresAt, licenseStatus: 'APPROVED', isActive: true, updatedAt: new Date() }, $unset: { lastAutoUninstallAt: '' } });
    return { success: true, message: `Gia hạn thành công gói ${plan.name}.` };
  }

  public async canInstallApps(): Promise<{ allowed: boolean; reason?: string }> {
    const status = await this.getStatus();
    if (!status.isLoggedIn) return { allowed: false, reason: 'Vui lòng đăng nhập trước khi cài đặt ứng dụng.' };
    if (status.isAdmin) return { allowed: true };
    if (status.isPendingApproval) return { allowed: false, reason: 'Tài khoản đang chờ quản trị viên phê duyệt.' };
    if (!status.isExpired) return { allowed: true };
    return { allowed: false, reason: 'Bản quyền đã hết hạn. Vui lòng gia hạn.' };
  }

  public async resetInstallBlock(userId?: string): Promise<{ success: boolean; message: string }> {
    const current = await this.getCurrentUser();
    const targetId = userId || current?.id;
    if (!targetId) return { success: false, message: 'Không xác định được người dùng cần reset.' };
    if (userId && userId !== current?.id && current?.role !== 'admin') return { success: false, message: 'Chỉ Admin mới được reset cho tài khoản khác.' };
    const users = await getUserCollection();
    const result = await users.updateOne({ _id: targetId }, { $unset: { lastAutoUninstallAt: '' }, $set: { updatedAt: new Date() } });
    return result.matchedCount ? { success: true, message: 'Đã reset trạng thái cài đặt.' } : { success: false, message: 'Không tìm thấy người dùng.' };
  }

  public async checkAndEnforceExpiry(installerService: WindowsAppInstallerService): Promise<{ isExpired: boolean; autoUninstalled: string[] }> {
    const status = await this.getStatus();
    if (!status.isLoggedIn || !status.isExpired || status.isAdmin) return { isExpired: status.isExpired, autoUninstalled: [] };
    const current = await this.getCurrentUser();
    if (!current || (current.lastAutoUninstallAt && Date.now() - current.lastAutoUninstallAt <= 3600000)) {
      return { isExpired: true, autoUninstalled: [] };
    }

    const autoUninstalled: string[] = [];
    try {
      const appStatuses = await installerService.getAllAppsStatus();
      for (const appId of Object.keys(WORKPLACE_APPS)) {
        if (appStatuses[appId]?.isInstalled) {
          await installerService.uninstallApp(appId);
          autoUninstalled.push(appId);
        }
      }
    } catch (error) {
      console.error('[LicenseEnforcement] Error during batch uninstall:', error);
    }
    const users = await getUserCollection();
    await users.updateOne({ _id: current.id }, { $set: { lastAutoUninstallAt: new Date(), updatedAt: new Date() } });
    return { isExpired: true, autoUninstalled };
  }
}