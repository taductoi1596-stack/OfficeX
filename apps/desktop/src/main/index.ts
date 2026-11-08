import 'reflect-metadata';
import {
  ServiceContainer,
  AppLifecycleService,
  StartupOrchestrator,
  StartupPhase,
  ShutdownManager,
  ShutdownPhase,
  ApiGatewayService,
  ApiIpcHandler,
  ILogger,
} from '@officex/desktop-runtime';

class ConsoleLogger extends ILogger {
  _isLogger = true;
  info(msg: string, ...args: any[]) { console.log('[INFO]', msg, ...args); }
  warn(msg: string, ...args: any[]) { console.warn('[WARN]', msg, ...args); }
  error(msg: string, ...args: any[]) { console.error('[ERROR]', msg, ...args); }
}
import { IpcRouter } from '@officex/ipc';
import { WindowFactory, WindowRegistry } from '@officex/window-manager';
import { FileService, DocumentLoader } from '@officex/file-system';
import { UpdateService, VersionManager, DownloadManager } from '@officex/updater';
import { RecoveryManager } from '@officex/recovery';
import { DialogService } from '@officex/platform-dialogs';
import { ClipboardService } from '@officex/platform-clipboard';
import { NotificationService } from '@officex/platform-notifications';
import { WindowsAppInstallerService, WORKPLACE_APPS, LicenseService, SUBSCRIPTION_PLANS } from '@officex/registry';
import { app, Tray, Menu, nativeImage, BrowserWindow as ElectronBrowserWindow, ipcMain as electronIpcMain } from 'electron';
import * as path from 'path';

// Helper: parse --app= and target file from argv
function parseTargetApp(args: string[]): { targetApp: string | null; targetFile: string | null } {
  let targetApp: string | null = null;
  let targetFile: string | null = null;

  for (let i = 1; i < args.length; i++) {
    const rawArg = args[i];
    if (!rawArg) continue;
    const arg = rawArg.replace(/^"|"$/g, '').trim();

    if (arg.startsWith('--app=')) {
      targetApp = arg.split('=')[1]?.toLowerCase() || null;
    } else if (arg === '--word') {
      targetApp = 'word';
    } else if (arg === '--excel') {
      targetApp = 'excel';
    } else if (arg === '--powerpoint' || arg === '--ppt') {
      targetApp = 'powerpoint';
    } else if (arg === '--ai') {
      targetApp = 'ai';
    } else if (!arg.startsWith('-') && !arg.startsWith('/')) {
      const ext = arg.split('.').pop()?.toLowerCase();
      if (['docx', 'doc', 'dotx', 'rtf', 'odt', 'txt', 'md'].includes(ext || '')) {
        if (!targetApp) targetApp = 'word';
        targetFile = arg;
      } else if (['xlsx', 'xls', 'csv', 'tsv', 'ods', 'xltx'].includes(ext || '')) {
        if (!targetApp) targetApp = 'excel';
        targetFile = arg;
      } else if (['pptx', 'ppt', 'potx', 'odp'].includes(ext || '')) {
        if (!targetApp) targetApp = 'powerpoint';
        targetFile = arg;
      } else if (targetApp && (arg.includes('\\') || arg.includes('/') || arg.includes('.'))) {
        targetFile = arg;
      }
    }
  }
  return { targetApp, targetFile };
}


function resolveAppUrl(appId: string): string {
  const { app: _electronApp } = require('electron');
  const { pathToFileURL } = require('url');
  const fs = require('fs');

  // 1. Packaged environment (.exe)
  if (_electronApp.isPackaged) {
    const packagedCandidates = [
      path.join(process.resourcesPath, appId, 'dist', 'index.html'),
      path.join(process.resourcesPath, appId, 'dist', 'renderer', 'index.html'),
      path.join(process.resourcesPath, 'apps', appId, 'dist', 'renderer', 'index.html'),
    ];
    for (const p of packagedCandidates) {
      if (fs.existsSync(p)) return pathToFileURL(p).href;
    }
  }

  // 2. Dev / unpackaged environment — check if built renderer dist file exists
  const _wsRoot = path.join(_electronApp.getAppPath(), '..', '..');
  const localCandidates = [
    path.join(_wsRoot, 'apps', appId, 'dist', 'renderer', 'index.html'),
    path.join(_wsRoot, 'apps', appId, 'dist', 'index.html'),
    path.join(_electronApp.getAppPath(), '..', appId, 'dist', 'renderer', 'index.html'),
    path.join(_electronApp.getAppPath(), '..', appId, 'dist', 'index.html'),
  ];
  for (const p of localCandidates) {
    if (fs.existsSync(p)) {
      return pathToFileURL(p).href;
    }
  }

  // 3. Fallback to Vite dev server ports
  const appMap: Record<string, string> = {
    launcher:   'http://localhost:5175',
    word:       'http://localhost:5181',
    excel:      'http://localhost:5182',
    powerpoint: 'http://localhost:5183',
    ai:         'http://localhost:5190',
    settings:   'http://localhost:5180',
    updater:    'http://localhost:5184',
  };
  return appMap[appId] || 'http://localhost:5175';
}


async function openApp(appId: string, filePath?: string) {
  const { app: _electronApp } = require('electron');
  const _wsRoot = _electronApp.isPackaged
    ? process.resourcesPath
    : path.join(_electronApp.getAppPath(), '..', '..');
  const licenseService = new LicenseService(_wsRoot);
  const status = await licenseService.getStatus();
  if (!status.isLoggedIn || !status.canAccessApps) {
    console.warn(`[LicenseLock] Blocked launching ${appId} - user not logged in, pending approval, or license expired.`);
    try {
      const { dialog } = require('electron');
      const msg = status.isPendingApproval
        ? `Tài khoản ${status.user?.email || ''} đang ở trạng thái CHỜ QUẢN TRỊ VIÊN PHÊ DUYỆT.\n\nVui lòng liên hệ Admin để được phê duyệt trước khi mở ứng dụng ${appId.toUpperCase()}!`
        : `Bạn chưa đăng nhập hoặc bản quyền Workplace đã hết hạn.\n\nVui lòng đăng ký (3 ngày dùng thử miễn phí) hoặc đăng nhập trên Workplace Launcher để sử dụng ${appId.toUpperCase()}!`;

      dialog.showMessageBox({
        type: 'warning',
        title: 'Workplace Suite - Yêu cầu Phê duyệt & Bản quyền',
        message: msg,
        buttons: ['Mở Workplace Launcher để Đăng nhập', 'Đóng'],
        defaultId: 0,
        cancelId: 1,
      }).then((res: any) => {
        if (res.response === 0) {
          openLauncher('requireAuth=true');
        }
      });
    } catch {
      openLauncher('requireAuth=true');
    }
    return;
  }

  const baseUrl = resolveAppUrl(appId);
  const finalUrl = filePath ? `${baseUrl}?file=${encodeURIComponent(filePath)}` : baseUrl;
  const factory = ServiceContainer.resolve<WindowFactory>(WindowFactory);
  return factory.create({
    type: 'document',
    url: finalUrl,
    documentPath: filePath,
    width: 1280, 
    height: 800,
  });
}

function openLauncher(query?: string) {
  const baseUrl = resolveAppUrl('launcher');
  const launcherUrl = query ? `${baseUrl}?${query}` : baseUrl;
  const factory = ServiceContainer.resolve<WindowFactory>(WindowFactory);
  return factory.create({ type: 'launcher', url: launcherUrl, width: 1050, height: 720, frame: true });
}



// ─────────────────────────────────────────────────────────────────────────────
// Phase: Bootstrap — Register all dependencies into the DI container
// ─────────────────────────────────────────────────────────────────────────────
ServiceContainer.registerSingleton(StartupOrchestrator, StartupOrchestrator);
ServiceContainer.registerSingleton(ShutdownManager, ShutdownManager);
ServiceContainer.registerSingleton(AppLifecycleService, AppLifecycleService);
ServiceContainer.registerSingleton(WindowRegistry, WindowRegistry);
ServiceContainer.registerSingleton(WindowFactory, WindowFactory);
ServiceContainer.registerSingleton(IpcRouter, IpcRouter);

// Core Services
ServiceContainer.registerSingleton(FileService, FileService);
ServiceContainer.registerSingleton(DocumentLoader, DocumentLoader);

// Platform Services
ServiceContainer.registerSingleton(DialogService, DialogService);
ServiceContainer.registerSingleton(ClipboardService, ClipboardService);
ServiceContainer.registerSingleton(NotificationService, NotificationService);

// Application Services
ServiceContainer.registerSingleton(VersionManager, VersionManager);
ServiceContainer.registerSingleton(DownloadManager, DownloadManager);
ServiceContainer.registerSingleton(UpdateService, UpdateService);
ServiceContainer.registerSingleton(RecoveryManager, RecoveryManager);
ServiceContainer.registerSingleton(ApiGatewayService, ApiGatewayService);
ServiceContainer.registerSingleton(ApiIpcHandler, ApiIpcHandler);
ServiceContainer.registerSingleton(ILogger as any, ConsoleLogger);

// ─────────────────────────────────────────────────────────────────────────────
// Resolve entry-point services
// ─────────────────────────────────────────────────────────────────────────────
const lifecycle = ServiceContainer.resolve<AppLifecycleService>(AppLifecycleService);
const orchestrator = lifecycle.getOrchestrator();
const shutdownManager = lifecycle.getShutdownManager();

// Handle secondary instance launch (e.g. user clicks Word shortcut when Launcher is already open)
lifecycle.onSecondInstance((commandLine) => {
  console.log('[SecondInstance] Received command line:', commandLine);
  const { targetApp, targetFile } = parseTargetApp(commandLine);
  if (targetApp && ['word', 'excel', 'powerpoint', 'ai'].includes(targetApp)) {
    console.log(`[SecondInstance] Opening Standalone Application: ${targetApp.toUpperCase()} (File: ${targetFile || 'None'})...`);
    void openApp(targetApp, targetFile || undefined).catch((error) => console.error('[SecondInstance] Could not open app:', error));
  } else {
    console.log('[SecondInstance] Focusing Launcher...');
    openLauncher();
  }
});
const ipcRouter = ServiceContainer.resolve<IpcRouter>(IpcRouter);
const windowFactory = ServiceContainer.resolve<WindowFactory>(WindowFactory);
const recoveryManager = ServiceContainer.resolve<RecoveryManager>(RecoveryManager);
const updateService = ServiceContainer.resolve<UpdateService>(UpdateService);
const notificationService = ServiceContainer.resolve<NotificationService>(NotificationService);
const dialogService = ServiceContainer.resolve<DialogService>(DialogService);
const clipboardService = ServiceContainer.resolve<ClipboardService>(ClipboardService);
const apiIpcHandler = ServiceContainer.resolve<ApiIpcHandler>(ApiIpcHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Register Shutdown Phase Handlers
// These run during controlled shutdown (before-quit)
// ─────────────────────────────────────────────────────────────────────────────
shutdownManager.registerPhase(ShutdownPhase.DataSave, async () => {
  // Mark a clean shutdown so RecoveryManager knows there was no crash
  recoveryManager.clearCrashState();
  console.log('[Shutdown:DataSave] Crash state cleared — clean exit recorded.');
});

shutdownManager.registerPhase(ShutdownPhase.BackgroundStop, async () => {
  // Cancel any ongoing background work (future: cancel deferred orchestrator tasks)
  console.log('[Shutdown:BackgroundStop] Background tasks signalled to stop.');
}, /* nonCritical */ true);

shutdownManager.registerPhase(ShutdownPhase.WindowClose, async () => {
  const { BrowserWindow } = require('electron');
  const windows = BrowserWindow.getAllWindows();
  console.log(`[Shutdown:WindowClose] Closing ${windows.length} window(s)...`);
  // Destroy windows gracefully — we override close prevention during shutdown
  for (const win of windows) {
    if (!win.isDestroyed()) {
      win.webContents.send('shutdown-initiated'); // Notify renderer
      win.destroy();
    }
  }
}, /* nonCritical */ true);

shutdownManager.registerPhase(ShutdownPhase.LogFlush, async () => {
  console.log('[Shutdown:LogFlush] Flushing logs... Done.');
  // Future: flush to file logger
}, /* nonCritical */ true);

shutdownManager.registerPhase(ShutdownPhase.RuntimeDispose, async () => {
  // Stop IPC router so no new messages are processed
  ipcRouter.stop?.();
  console.log('[Shutdown:RuntimeDispose] IPC Router stopped. Runtime disposed.');
}, /* nonCritical */ true);

// Emergency-save handler: write recovery info on uncontrolled exit
shutdownManager.registerPhase(ShutdownPhase.DataSave, async () => {
  // This is also registered so it runs during emergencyShutdown()
  // The RecoveryManager already persists state on simulate-crash,
  // so here we just log the emergency event.
  console.warn('[Shutdown:DataSave:Emergency] Emergency data save complete.');
});

// ─────────────────────────────────────────────────────────────────────────────
// Listen to startup & shutdown events — forward to Renderer via IPC
// ─────────────────────────────────────────────────────────────────────────────
orchestrator.onStatus((event: any) => {
  try {
    const { BrowserWindow } = require('electron');
    BrowserWindow.getAllWindows().forEach((win: any) => {
      if (!win.isDestroyed()) win.webContents.send('startup-status', event);
    });
  } catch { /* Electron not yet initialized */ }
});

shutdownManager.onStatus((event: any) => {
  console.log(`[Shutdown Event] phase=${event.phase} status=${event.status} duration=${event.duration ?? '-'}ms`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Bootstrap
// ─────────────────────────────────────────────────────────────────────────────
lifecycle.bootstrap(async () => {
  // ── Phase: Services ────────────────────────────────────────────────────────
  await orchestrator.run([
    {
      phase: StartupPhase.Services,
      task: async () => {
        ipcRouter.start();
        apiIpcHandler.registerHandlers();

        const { ipcMain } = require('electron');
        const registerBoth = (channel: string, handler: (payload?: any) => Promise<any> | any) => {
          ipcRouter.register(channel, handler);
          try {
            ipcMain.removeHandler(channel);
            ipcMain.handle(channel, async (_event: any, ...args: any[]) => {
              const payload = args.length === 1 ? args[0] : (args.length === 0 ? undefined : args);
              return await handler(payload);
            });
          } catch {}
        };

        // Window & App management
        registerBoth('open-settings', async () => {
          windowFactory.create({ type: 'settings', url: resolveAppUrl('settings'), width: 800, height: 600 });
          return true;
        });

        registerBoth('launch-app', async (payload: unknown) => {
          const licenseStatus = await licenseService.getStatus();
          if (!licenseStatus.isLoggedIn) {
            notificationService.show('Yêu cầu Đăng nhập', 'Vui lòng đăng nhập tài khoản để sử dụng ứng dụng!');
            return { success: false, requireAuth: true, message: 'Vui lòng đăng nhập để mở ứng dụng!' };
          }
          if (licenseStatus.isPendingApproval) {
            notificationService.show('Tài khoản Chờ duyệt', 'Tài khoản của bạn đang chờ Quản trị viên duyệt. Vui lòng liên hệ Admin để được phê duyệt!');
            return { success: false, requireAuth: true, isPending: true, message: 'Tài khoản đang chờ Admin duyệt!' };
          }
          if (licenseStatus.isExpired && !licenseStatus.isAdmin) {
            notificationService.show('Bản quyền đã hết hạn', 'Gói bản quyền đã hết hạn. Vui lòng gia hạn để tiếp tục sử dụng!');
            return { success: false, requireAuth: true, isExpired: true, message: 'Gói bản quyền đã hết hạn!' };
          }

          const appId = typeof payload === 'string' ? payload : (payload as any)?.appId;
          const documentPath = typeof payload === 'object' ? (payload as any)?.filePath : undefined;
          const baseUrl = resolveAppUrl(appId as string);
          const finalUrl = documentPath ? `${baseUrl}?file=${encodeURIComponent(documentPath)}` : baseUrl;
          windowFactory.create({ 
            type: 'document', 
            url: finalUrl, 
            documentPath,
            width: 1280, 
            height: 800 
          });
          return true;
        });

        // ── App Manager & Windows Control Panel Integration Handlers ─────────
        // Smart workspace root resolution:
        // - DEV mode:       app.getAppPath() = apps/desktop  →  go 2 levels up = OfficeX
        // - PACKAGED (.exe): process.resourcesPath contains extraResources
        const { app: electronApp } = require('electron');
        const isPackaged = electronApp.isPackaged;
        const workspaceRoot = isPackaged
          ? process.resourcesPath
          : path.join(electronApp.getAppPath(), '..', '..');
        console.log(`[AppManager] mode=${isPackaged ? 'packaged' : 'dev'} workspaceRoot=${workspaceRoot}`);
        const installerService = new WindowsAppInstallerService(workspaceRoot);

        registerBoth('app-manager:install', async (payload: any) => {
          const appId = typeof payload === 'string' ? payload : (payload?.appId || payload?.id);
          console.log('[IPC:AppManager] Installing app:', appId);
          const result = await installerService.installApp(appId);
          if (result.success) {
            notificationService.show('Cài đặt thành công', `Ứng dụng ${appId.toUpperCase()} đã được đăng ký vào Windows Control Panel & Desktop!`);
          }
          return result;
        });

        registerBoth('app-manager:uninstall', async (payload: any) => {
          const appId = typeof payload === 'string' ? payload : (payload?.appId || payload?.id);
          console.log('[IPC:AppManager] Uninstalling app:', appId);
          const result = await installerService.uninstallApp(appId);
          if (result.success) {
            notificationService.show('Gỡ cài đặt thành công', `Đã gỡ ${appId.toUpperCase()} khỏi Windows Control Panel.`);
          }
          return result;
        });

        registerBoth('app-manager:getStatus', async () => {
          return await installerService.getAllAppsStatus();
        });

        registerBoth('app-manager:openControlPanel', async () => {
          console.log('[IPC:AppManager] Opening Windows Control Panel (appwiz.cpl)...');
          await installerService.openControlPanel();
          return true;
        });

        registerBoth('app-manager:downloadInstaller', async (payload: any) => {
          const appId = typeof payload === 'string' ? payload : (payload?.appId || payload?.id);
          const appDef = WORKPLACE_APPS[appId];
          if (!appDef) return { success: false, message: 'Ứng dụng không tồn tại' };
          const files = installerService.generateStandaloneInstallerFiles(appDef);
          return { success: true, message: `Đã tạo bộ cài đặt tại: ${files.installerBat}`, files };
        });

        // ── License, User Auth & Subscription IPC Handlers ───────────────────
        const licenseService = new LicenseService(workspaceRoot);

        registerBoth('license:getStatus', async () => {
          return await licenseService.getStatus();
        });

        registerBoth('license:getPlans', async () => {
          return SUBSCRIPTION_PLANS;
        });

        registerBoth('license:register', async (payload: any) => {
          const result = await licenseService.register(payload);
          if (result.success) {
            notificationService.show('Đăng ký thành công', result.message);
          }
          return result;
        });

        registerBoth('license:login', async (payload: any) => {
          const result = await licenseService.login(payload?.email, payload?.password);
          if (result.success) {
            notificationService.show('Đăng nhập thành công', result.message);
          }
          return result;
        });

        registerBoth('license:upgrade', async (payload: any) => {
          const planId = typeof payload === 'string' ? payload : payload?.planId;
          const result = await licenseService.upgradePlan(planId);
          if (result.success) {
            notificationService.show('Gia hạn thành công', result.message);
          }
          return result;
        });

        registerBoth('license:logout', async () => {
          return licenseService.logout();
        });

        // ── Admin Management IPC Handlers ────────────────────────────────────
        registerBoth('license:admin:getUsers', async () => {
          return licenseService.getAllUsers();
        });

        registerBoth('license:admin:approveUser', async (payload: any) => {
          const userId = typeof payload === 'string' ? payload : payload?.userId;
          const planId = payload?.planId;
          const result = await licenseService.approveUser(userId, planId);
          if (result.success) {
            notificationService.show('Đã phê duyệt người dùng', result.message);
          }
          return result;
        });

        registerBoth('license:admin:rejectUser', async (payload: any) => {
          const userId = typeof payload === 'string' ? payload : payload?.userId;
          const result = await licenseService.rejectUser(userId);
          if (result.success) {
            notificationService.show('Đã từ chối', result.message);
          }
          return result;
        });

        registerBoth('license:admin:blockUser', async (payload: any) => {
          const userId = typeof payload === 'string' ? payload : payload?.userId;
          const result = await licenseService.blockUser(userId);
          if (result.success) {
            notificationService.show('Đã khóa tài khoản', result.message);
          }
          return result;
        });

        registerBoth('license:admin:deleteUser', async (payload: any) => {
          const userId = typeof payload === 'string' ? payload : payload?.userId;
          return await licenseService.deleteUser(userId);
        });

        registerBoth('license:admin:extendUser', async (payload: any) => {
          const userId = payload?.userId;
          const days = payload?.days || 30;
          const result = await licenseService.extendUserExpiry(userId, days);
          if (result.success) {
            notificationService.show('Gia hạn thành công', result.message);
          }
          return result;
        });

        registerBoth('license:checkAndEnforce', async () => {
          const result = await licenseService.checkAndEnforceExpiry(installerService);
          if (result.isExpired && result.autoUninstalled.length > 0) {
            notificationService.show(
              'Bản quyền hết hạn',
              `Tài khoản đã hết hạn. Đã tự động gỡ ${result.autoUninstalled.length} ứng dụng khỏi PC. Vui lòng gia hạn để tiếp tục sử dụng!`
            );
          }
          return result;
        });

        // ── Reinstall Support Handlers ────────────────────────────────────────
        registerBoth('license:canInstall', async () => {
          return await licenseService.canInstallApps();
        });

        registerBoth('license:resetInstallBlock', async (payload?: any) => {
          const userId = payload?.userId;
          const result = await licenseService.resetInstallBlock(userId);
          if (result.success) {
            notificationService.show('Đã mở khóa cài đặt', result.message);
          }
          return result;
        });

        // ── App Reinstall Handler (uninstall + install in sequence) ──────────
        registerBoth('app-manager:reinstall', async (payload: any) => {
          const appId = typeof payload === 'string' ? payload : (payload?.appId || payload?.id);
          console.log('[IPC:AppManager] Reinstalling app:', appId);
          // Step 1: uninstall cleanly
          await installerService.uninstallApp(appId);
          // Small delay to let Windows release file handles
          await new Promise((r) => setTimeout(r, 800));
          // Step 2: install fresh
          const result = await installerService.installApp(appId);
          if (result.success) {
            notificationService.show('Cài đặt lại thành công', `${appId.toUpperCase()} đã được cài đặt lại vào Windows!`);
          }
          return result;
        });

        // Run initial license expiry check on startup
        setTimeout(async () => {
          try {
            const res = await licenseService.checkAndEnforceExpiry(installerService);
            if (res.isExpired && res.autoUninstalled.length > 0) {
              notificationService.show(
                'Bản quyền hết hạn',
                `Đã tự động gỡ ${res.autoUninstalled.length} ứng dụng khỏi Windows do hết hạn bản quyền.`
              );
            }
          } catch (e) {
            console.error('[LicenseStartupCheck Error]', e);
          }
        }, 3000);

        // Graceful shutdown via IPC (from renderer's close button or menu)
        registerBoth('request-shutdown', async () => {
          console.log('[IPC] request-shutdown received — initiating graceful shutdown...');
          require('electron').app.quit(); // triggers before-quit → ShutdownManager
          return true;
        });

        // Window controls
        registerBoth('read-clipboard-image', async () => {
          const { clipboard } = require('electron');
          const img = clipboard.readImage();
          if (img && !img.isEmpty()) {
            return img.toDataURL();
          }
          
          const html = clipboard.readHTML();
          if (html) {
            const match = html.match(/<img[^>]+src="([^">]+)"/);
            if (match) {
              const src = match[1];
              if (src.startsWith('data:image/')) return src;
              return src; 
            }
          }
          return null;
        });

        // Read full clipboard: text + html + standalone image
        registerBoth('clipboard:read-all', async () => {
          const { clipboard } = require('electron');
          const text = clipboard.readText() || '';
          const html = clipboard.readHTML() || '';
          const imgNative = clipboard.readImage();
          const image = (imgNative && !imgNative.isEmpty()) ? imgNative.toDataURL() : null;
          return { text, html, image };
        });

        registerBoth('window-close', async () => {
          const { BrowserWindow } = require('electron');
          const focused = BrowserWindow.getFocusedWindow();
          if (focused) {
            (focused as any).__forceClose = true;
            focused.close();
          }
          return true;
        });

        registerBoth('window-minimize', async () => {
          const { BrowserWindow } = require('electron');
          BrowserWindow.getFocusedWindow()?.minimize();
          return true;
        });

        registerBoth('window-maximize', async () => {
          const { BrowserWindow } = require('electron');
          const win = BrowserWindow.getFocusedWindow();
          win?.isMaximized() ? win.unmaximize() : win?.maximize();
          return true;
        });

        // Printer IPC Handlers
        ipcRouter.register('dialog:getPrinters', async () => {
          const { BrowserWindow } = require('electron');
          const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
          if (win) {
            try {
              return await win.webContents.getPrintersAsync();
            } catch (err) {
              console.error('[GetPrinters Error]', err);
            }
          }
          return [];
        });

        ipcRouter.register('dialog:print', async (options?: any) => {
          const { BrowserWindow } = require('electron');
          const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
          if (!win) return false;

          try {
            const printers = await win.webContents.getPrintersAsync();
            const targetName = options?.printer || options?.deviceName;
            const matchedPrinter = printers.find((p: any) => p.name === targetName || p.displayName === targetName)
              || printers.find((p: any) => p.name.toLowerCase().includes('brother') || p.name.toLowerCase().includes('printer'))
              || printers.find((p: any) => p.isDefault)
              || printers[0];

            const printOptions: any = {
              silent: false,
              printBackground: true,
              color: true,
              copies: Number(options?.copies) || 1,
              landscape: options?.orientation === 'landscape',
            };

            if (matchedPrinter && matchedPrinter.name) {
              printOptions.deviceName = matchedPrinter.name;
            }

            console.log('[Electron Print] Sending print job to device:', printOptions.deviceName || 'default');
            win.webContents.print(printOptions, (success: boolean, failureReason: string) => {
              console.log('[Electron Print Result]', success, failureReason);
              if (!success) {
                console.log('[Electron Print Fallback] Retrying with non-silent print dialog...');
                win.webContents.print({ silent: false, printBackground: true });
              }
            });
            return true;
          } catch (err) {
            console.error('[Electron Print Exception]', err);
            win.webContents.print({ silent: false, printBackground: true });
            return false;
          }
        });

        // Update
        registerBoth('check-update', async () => {
          const win = windowFactory.create({ type: 'launcher', url: resolveAppUrl('updater'), width: 500, height: 400, frame: false });
          setTimeout(async () => {
            await updateService.checkAndDownload((progressData: any) => {
              win.webContents.send('update-progress', progressData);
            });
          }, 1500);
          return true;
        });

        registerBoth('quit-and-install', async () => {
          updateService.quitAndInstall();
          return true;
        });

        // Recovery
        registerBoth('get-recovery-items', async () => recoveryManager.getRecoveryItems());

        registerBoth('resolve-recovery', async (_action: 'recover' | 'discard') => {
          recoveryManager.clearCrashState();
          const { app: _appRef } = require('electron');
          const _launcherHtml = require('path').join(process.resourcesPath, 'launcher', 'dist', 'index.html');
          const _launcherUrl = _appRef.isPackaged
            ? `file://${_launcherHtml}`
            : 'http://localhost:5175';
          windowFactory.create({ type: 'launcher', url: _launcherUrl, width: 900, height: 650, frame: false });
          return true;
        });

        registerBoth('simulate-crash', async () => {
          console.log('[IPC] Simulating crash — saving recovery state and exiting...');
          recoveryManager.setCrashState([
            { id: 'sim-1', appName: 'Word',  fileName: 'Draft_Report.docx',  timestamp: Date.now() - 60000  },
            { id: 'sim-2', appName: 'Excel', fileName: 'Q4_Financials.xlsx', timestamp: Date.now() - 120000 },
          ]);
          require('electron').app.exit(0); // bypass ShutdownManager (simulate crash)
          return true;
        });

        // Platform Services
        registerBoth('show-dialog', async (opts: any) => {
          console.log('[IPC] show-dialog received:', opts);
          const title = (opts && typeof opts === 'object' && opts.title) || (typeof opts === 'string' ? opts : 'OfficeX Alert');
          const message = (opts && typeof opts === 'object' && opts.message) || (typeof opts === 'string' ? opts : 'OfficeX platform test dialog message.');
          await dialogService.showMessage(title, message);
          return true;
        });

        registerBoth('copy-clipboard', async (payload: any) => {
          console.log('[IPC] copy-clipboard received:', payload);
          const text = typeof payload === 'string' ? payload : (payload?.text || 'OfficeX diagnostic string ✓');
          clipboardService.writeText(text);
          return true;
        });

        registerBoth('show-notification', async (payload: any) => {
          console.log('[IPC] show-notification received:', payload);
          const title = (payload && typeof payload === 'object' && payload.title) || 'OfficeX';
          const body = (payload && typeof payload === 'object' && payload.body) || (typeof payload === 'string' ? payload : 'Test notification body from OfficeX!');
          notificationService.show(title, body);
          return true;
        });

        // ── File I/O & Native Dialog Handlers ─────────────────────────────
        const { dialog: electronDialog, BrowserWindow } = require('electron');
        const fsPromises = require('fs').promises;
        const fsSync = require('fs');

        ipcMain.handle('dialog:showSaveDialog', async (event: any, opts: any) => {
          const win = (event?.sender ? BrowserWindow.fromWebContents(event.sender) : null) || BrowserWindow.getFocusedWindow();
          return win ? electronDialog.showSaveDialog(win, opts) : electronDialog.showSaveDialog(opts);
        });

        ipcMain.handle('dialog:showOpenDialog', async (event: any, opts: any) => {
          const win = (event?.sender ? BrowserWindow.fromWebContents(event.sender) : null) || BrowserWindow.getFocusedWindow();
          return win ? electronDialog.showOpenDialog(win, opts) : electronDialog.showOpenDialog(opts);
        });

        ipcMain.handle('dialog:getPrinters', async (event: any) => {
          const win = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
          if (win) {
            try {
              return await win.webContents.getPrintersAsync();
            } catch (err) {
              console.error('[GetPrinters Error]', err);
            }
          }
          return [];
        });

        ipcMain.handle('dialog:print', async (event: any, options?: any) => {
          const win = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
          if (!win) return false;

          try {
            const printers = await win.webContents.getPrintersAsync();
            const targetName = options?.printer || options?.deviceName;
            const matchedPrinter = printers.find((p: any) => p.name === targetName || p.displayName === targetName)
              || printers.find((p: any) => p.name.toLowerCase().includes('brother') || p.name.toLowerCase().includes('printer'))
              || printers.find((p: any) => p.isDefault)
              || printers[0];

            const printOptions: any = {
              silent: false,
              printBackground: true,
              color: true,
              copies: Number(options?.copies) || 1,
              landscape: options?.orientation === 'landscape',
            };

            if (matchedPrinter && matchedPrinter.name) {
              printOptions.deviceName = matchedPrinter.name;
            }

            console.log('[Electron Print] Sending print job to device:', printOptions.deviceName || 'default');
            win.webContents.print(printOptions, (success: boolean, failureReason: string) => {
              console.log('[Electron Print Result]', success, failureReason);
              if (!success) {
                console.log('[Electron Print Fallback] Retrying with non-silent print dialog...');
                win.webContents.print({ silent: false, printBackground: true });
              }
            });
            return true;
          } catch (err) {
            console.error('[Electron Print Exception]', err);
            win.webContents.print({ silent: false, printBackground: true });
            return false;
          }
        });

        const handleReadFile = async (filePathOrOpts: any) => {
          const targetPath = typeof filePathOrOpts === 'string' ? filePathOrOpts : filePathOrOpts?.path;
          if (!targetPath) return '';
          try {
            const buf = await fsPromises.readFile(targetPath);
            const ext = path.extname(targetPath).toLowerCase().replace('.', '');
            // 1. ZIP / OpenXML (.docx, .xlsx, .pptx): PK\x03\x04
            if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x03 && buf[3] === 0x04) {
              const fileType = ['xlsx', 'xls', 'xltx', 'xlsm'].includes(ext) ? 'xlsx' : ['pptx', 'ppt', 'potx'].includes(ext) ? 'pptx' : 'docx';
              return { isBinary: true, base64: buf.toString('base64'), fileType, size: buf.length };
            }
            // 2. PDF: %PDF- (0x25, 0x50, 0x44, 0x46)
            if (buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
              return { isBinary: true, base64: buf.toString('base64'), fileType: 'pdf', size: buf.length };
            }
            // 3. Legacy Word 97-2003 .doc / Excel .xls: 0xD0, 0xCF, 0x11, 0xE0
            if (buf.length >= 4 && buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0) {
              const str16 = buf.toString('utf16le');
              const chunks16 = str16.match(/[\p{L}\p{N}\p{P}\s]{4,}/gu) || [];
              const text16 = chunks16
                .map((c: string) => c.trim())
                .filter((c: string) => c.length >= 4 && !c.includes('\0') && !/^[\x00-\x1F]+$/.test(c))
                .join('\n');
              return { isBinary: true, base64: buf.toString('base64'), fileType: ext === 'xls' ? 'xls' : 'doc', text: text16, size: buf.length };
            }
            // 4. Check for UTF-16 LE BOM (0xFF, 0xFE)
            if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
              return buf.subarray(2).toString('utf16le');
            }
            // 5. Check for UTF-8 BOM (0xEF, 0xBB, 0xBF)
            if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
              return buf.subarray(3).toString('utf-8');
            }
            // 6. Default: UTF-8 text (OfficeX JSON, .csv, .tsv, .txt, etc.)
            return buf.toString('utf-8');
          } catch (err) {
            console.error('[fs:readFile Error]', err);
            return '';
          }
        };

        registerBoth('pdf:extractText', async (filePathOrOpts: any) => {
          const targetPath = typeof filePathOrOpts === 'string' ? filePathOrOpts : filePathOrOpts?.path;
          if (!targetPath) return '';
          try {
            const buf = await fsPromises.readFile(targetPath);
            const zlib = require('zlib');
            const str = buf.toString('binary');
            const matches = [...str.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)];
            const textParts: string[] = [];
            for (const m of matches) {
              let decompressed: Buffer | null = null;
              const rawData = Buffer.from(m[1], 'binary');
              try {
                decompressed = zlib.inflateSync(rawData);
              } catch {
                try {
                  decompressed = zlib.inflateRawSync(rawData);
                } catch {
                  decompressed = rawData;
                }
              }
              if (decompressed) {
                const s = decompressed.toString('latin1');
                const tjRegex = /\(([^)]+)\)\s*Tj/g;
                let tjMatch;
                while ((tjMatch = tjRegex.exec(s)) !== null) {
                  if (tjMatch[1] && tjMatch[1].length > 1) textParts.push(tjMatch[1]);
                }
                const arrRegex = /\[(.*?)\]\s*TJ/g;
                let arrMatch;
                while ((arrMatch = arrRegex.exec(s)) !== null) {
                  const subMatches = arrMatch[1].match(/\(([^)]+)\)/g);
                  if (subMatches) {
                    const joined = subMatches.map(p => p.slice(1, -1)).join('');
                    if (joined && joined.length > 1) textParts.push(joined);
                  }
                }
              }
            }
            return textParts.join(' ').replace(/\s+/g, ' ').trim();
          } catch (e) {
            console.error('[pdf:extractText Error]', e);
            return '';
          }
        });

        ipcMain.handle('fs:readFile', async (_event: any, filePathOrOpts: any) => {
          return handleReadFile(filePathOrOpts);
        });

        ipcMain.handle('fs:writeFile', async (_event: any, pathOrOpts: any, contentStr?: string) => {
          const targetPath = typeof pathOrOpts === 'string' ? pathOrOpts : pathOrOpts?.path;
          const targetContent = typeof pathOrOpts === 'string' ? (contentStr !== undefined ? contentStr : '') : (pathOrOpts?.content !== undefined ? pathOrOpts.content : (contentStr || ''));
          if (!targetPath) return false;
          try {
            await fsPromises.writeFile(targetPath, targetContent, 'utf-8');
            return true;
          } catch (err) {
            console.error('[FS:writeFile Error]', err);
            return false;
          }
        });

        ipcMain.handle('fs:exists', async (_event: any, filePath: string) => {
          return fsSync.existsSync(filePath);
        });

        // IPCRouter registrations
        ipcRouter.register('dialog:showSaveDialog', async (opts: any) => {
          const win = BrowserWindow.getFocusedWindow();
          return win ? electronDialog.showSaveDialog(win, opts) : electronDialog.showSaveDialog(opts);
        });

        ipcRouter.register('dialog:showOpenDialog', async (opts: any) => {
          const win = BrowserWindow.getFocusedWindow();
          return win ? electronDialog.showOpenDialog(win, opts) : electronDialog.showOpenDialog(opts);
        });

        ipcRouter.register('fs:readFile', async (filePathOrOpts: any) => {
          return handleReadFile(filePathOrOpts);
        });

        ipcRouter.register('fs:writeFile', async (pathOrOpts: any, contentStr?: string) => {
          const targetPath = typeof pathOrOpts === 'string' ? pathOrOpts : pathOrOpts?.path;
          const targetContent = typeof pathOrOpts === 'string' ? (contentStr !== undefined ? contentStr : '') : (pathOrOpts?.content !== undefined ? pathOrOpts.content : (contentStr || ''));
          if (!targetPath) return false;
          await fsPromises.writeFile(targetPath, targetContent, 'utf-8');
          return true;
        });
      },
    },

    // ── Phase: Recovery ──────────────────────────────────────────────────────
    {
      phase: StartupPhase.Recovery,
      task: async () => {
        if (recoveryManager.isCrashed()) {
          console.log('[Recovery] Crash detected! Launching Recovery Center...');
          windowFactory.create({ type: 'launcher', url: 'http://localhost:5185', width: 600, height: 500, frame: false });
          throw new Error('RECOVERY_MODE');
        }
      },
    },

    // ── Phase: Ready — Launch App or Launcher ──────────────────────────────
    {
      phase: StartupPhase.Ready,
      task: async () => {
        // Parse CLI arguments using shared helper
        const { targetApp, targetFile } = parseTargetApp(process.argv);

        // ── Mở app hoặc launcher ─────────────────────────────────────────────
        if (targetApp && ['word', 'excel', 'powerpoint', 'ai'].includes(targetApp)) {
          console.log(`[Ready] Opening Standalone Application: ${targetApp.toUpperCase()} (File: ${targetFile || 'None'})...`);
          await openApp(targetApp, targetFile || undefined);
        } else {
          console.log('[Ready] Opening Workplace Suite Hub / Launcher...');
          openLauncher();
        }
      },
    },
  ]).catch((err: Error) => {
    if (err.message !== 'RECOVERY_MODE') {
      console.error('[Startup] Critical phase failed:', err);
    }
  });


  // ── Phase: Deferred ──────────────────────────────────────────────────────
  orchestrator.defer([
    {
      name: 'Silent Update Check',
      task: async () => {
        await new Promise((r) => setTimeout(r, 2000));
        const result = await updateService.checkForUpdates();
        const { BrowserWindow } = require('electron');
        const allWins = BrowserWindow.getAllWindows();

        const message = result?.hasUpdate
          ? `Update available: v${result.latestVersion}`
          : 'OfficeX is up to date';

        if (result?.hasUpdate) {
          notificationService.show('OfficeX Update Available', `Version ${result.latestVersion} is ready to download.`);
        }

        allWins.forEach((win: any) => {
          if (!win.isDestroyed()) {
            win.webContents.send('startup-status', { phase: 'Deferred', status: 'completed', message });
          }
        });
      },
    },
  ]);
});
