import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface WorkplaceAppDefinition {
  id: string;
  name: string;
  displayName: string;
  regKey: string;
  version: string;
  publisher: string;
  description: string;
  fileExtensions: string[];
  progId: string;
  iconColor: string;
  sizeKb: number;
  cliArg: string;
  executableName: string;
}

export const WORKPLACE_APPS: Record<string, WorkplaceAppDefinition> = {
  word: {
    id: 'word',
    name: 'Word',
    displayName: 'Workplace Word',
    regKey: 'Workplace_Word',
    version: '1.0.0',
    publisher: 'Workplace Suite Inc.',
    description: 'Soạn thảo văn bản, báo cáo và tài liệu chuyên nghiệp (.docx, .doc)',
    fileExtensions: ['.docx', '.doc', '.dotx'],
    progId: 'Workplace.Word.Document',
    iconColor: '#2563eb',
    sizeKb: 135000,
    cliArg: '--app=word',
    executableName: 'Workplace-Word',
  },
  excel: {
    id: 'excel',
    name: 'Excel',
    displayName: 'Workplace Excel',
    regKey: 'Workplace_Excel',
    version: '1.0.0',
    publisher: 'Workplace Suite Inc.',
    description: 'Bảng tính chuyên nghiệp, hàm tính toán tự động và biểu đồ dữ liệu (.xlsx, .xls, .csv)',
    fileExtensions: ['.xlsx', '.xls', '.csv', '.xltx'],
    progId: 'Workplace.Excel.Sheet',
    iconColor: '#16a34a',
    sizeKb: 148000,
    cliArg: '--app=excel',
    executableName: 'Workplace-Excel',
  },
  powerpoint: {
    id: 'powerpoint',
    name: 'PowerPoint',
    displayName: 'Workplace PowerPoint',
    regKey: 'Workplace_PowerPoint',
    version: '1.0.0',
    publisher: 'Workplace Suite Inc.',
    description: 'Thiết kế slide trình chiếu, hiệu ứng chuyển động và AI Generator (.pptx, .ppt)',
    fileExtensions: ['.pptx', '.ppt', '.potx'],
    progId: 'Workplace.PowerPoint.Presentation',
    iconColor: '#ea580c',
    sizeKb: 142000,
    cliArg: '--app=powerpoint',
    executableName: 'Workplace-PowerPoint',
  },
  ai: {
    id: 'ai',
    name: 'AI Assistant',
    displayName: 'Workplace AI Assistant',
    regKey: 'Workplace_AI',
    version: '1.0.0',
    publisher: 'Workplace Suite Inc.',
    description: 'Trợ lý AI thông minh, phân tích dữ liệu, tự động hóa và viết nội dung',
    fileExtensions: [],
    progId: 'Workplace.AI.Bot',
    iconColor: '#9333ea',
    sizeKb: 98000,
    cliArg: '--app=ai',
    executableName: 'Workplace-AI',
  },
  suite: {
    id: 'suite',
    name: 'Suite',
    displayName: 'Workplace Suite Hub',
    regKey: 'Workplace_Suite',
    version: '1.0.0',
    publisher: 'Workplace Suite Inc.',
    description: 'Bộ ứng dụng văn phòng Workplace trọn bộ (Word, Excel, PowerPoint, AI)',
    fileExtensions: [],
    progId: 'Workplace.Suite.Hub',
    iconColor: '#4f46e5',
    sizeKb: 523000,
    cliArg: '',
    executableName: 'Workplace-Suite',
  },
};

export interface AppInstallStatus {
  id: string;
  isInstalled: boolean;
  displayName: string;
  version?: string;
  installLocation?: string;
  installDate?: string;
  desktopShortcutExists: boolean;
  startMenuShortcutExists: boolean;
  inControlPanel: boolean;
}

export class WindowsAppInstallerService {
  private workspaceRoot: string;
  private binDir: string;
  private downloadsDir: string;

  constructor(workspaceRoot?: string) {
    this.workspaceRoot = workspaceRoot || process.cwd();
    this.binDir = path.join(this.workspaceRoot, 'bin');
    this.downloadsDir = path.join(this.workspaceRoot, 'downloads');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    try {
      if (!fs.existsSync(this.binDir)) fs.mkdirSync(this.binDir, { recursive: true });
      if (!fs.existsSync(this.downloadsDir)) fs.mkdirSync(this.downloadsDir, { recursive: true });
    } catch {}
  }

  /**
   * Run a shell command asynchronously returning a promise.
   * Rejects if the command exits with a non-zero code.
   */
  private runCmd(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, { windowsHide: true }, (err: any, stdout: string, stderr: string) => {
        if (err) {
          const errorMsg = stderr?.trim() || err.message || 'Unknown error';
          console.warn(`[WindowsAppInstaller] Command failed: ${cmd}`);
          console.warn(`[WindowsAppInstaller] Error: ${errorMsg}`);
          reject(new Error(errorMsg));
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * Like runCmd but silently swallows errors — use for registry ops where key may not exist.
   */
  private async runCmdSafe(cmd: string): Promise<string> {
    try {
      return await this.runCmd(cmd);
    } catch {
      return '';
    }
  }

  /**
   * Check if registry key exists in HKCU Uninstall
   */
  public async isAppInstalledInRegistry(regKey: string): Promise<boolean> {
    try {
      const output = await this.runCmd(`reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${regKey}"`);
      return output.includes('DisplayName');
    } catch {
      return false;
    }
  }

  private getWindowsDesktopPath(): string {
    const userProfile = process.env.USERPROFILE || 'C:\\Users\\' + (process.env.USERNAME || 'User');
    // Try reading real Desktop from Windows registry (most reliable)
    try {
      const { execSync } = require('child_process');
      const result = execSync(
        'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v Desktop',
        { encoding: 'utf8' }
      );
      const match = result.match(/Desktop\s+REG_SZ\s+(.+)/);
      if (match) {
        let p = match[1].trim();
        // Expand env variables like %USERPROFILE%
        p = p.replace(/%([^%]+)%/g, (_: string, key: string) => process.env[key] || '');
        if (fs.existsSync(p)) return p;
      }
    } catch {}
    // Fallback: OneDrive Desktop
    const oneDriveDesktop = path.join(userProfile, 'OneDrive', 'Desktop');
    if (fs.existsSync(oneDriveDesktop)) return oneDriveDesktop;
    return path.join(userProfile, 'Desktop');
  }

  /**
   * Get all possible Desktop folder paths (including OneDrive Desktop, local Desktop, Public Desktop)
   */
  private getAllDesktopPaths(appName: string): string[] {
    const userProfile = process.env.USERPROFILE || 'C:\\Users\\' + (process.env.USERNAME || 'User');
    const publicProfile = process.env.PUBLIC || 'C:\\Users\\Public';
    const realDesktop = this.getWindowsDesktopPath();
    const candidates = new Set<string>([
      path.join(realDesktop, `${appName}.lnk`),
      path.join(userProfile, 'Desktop', `${appName}.lnk`),
      path.join(userProfile, 'OneDrive', 'Desktop', `${appName}.lnk`),
      path.join(publicProfile, 'Desktop', `${appName}.lnk`),
    ]);
    return Array.from(candidates);
  }

  /**
   * Get desktop and start menu shortcut paths
   */
  private getShortcutPaths(appName: string) {
    const userProfile = process.env.USERPROFILE || 'C:\\Users\\' + (process.env.USERNAME || 'User');
    const appData = process.env.APPDATA || path.join(userProfile, 'AppData', 'Roaming');
    
    const allDesktopPaths = this.getAllDesktopPaths(appName);
    const realDesktop = this.getWindowsDesktopPath();
    const desktopPath = path.join(realDesktop, `${appName}.lnk`);

    const startMenuFolder = path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Workplace Suite');
    const startMenuPath = path.join(startMenuFolder, `${appName}.lnk`);

    return { desktopPath, startMenuFolder, startMenuPath, allDesktopPaths };
  }

  /**
   * Resolve target executable for shortcuts, scripts and file associations.
   * On client/packaged machines, returns the installed Workplace Launcher.exe directly.
   * On dev machines, falls back to electron.exe in node_modules.
   */
  private getExecutableTarget(): { exePath: string; appEntryArg: string; isPackaged: boolean } {
    const candidates = [
      path.join(path.dirname(this.workspaceRoot), 'Workplace Launcher.exe'),
      path.join(path.dirname(this.workspaceRoot), 'OfficeX.exe'),
      path.join(this.workspaceRoot, 'Workplace Launcher.exe'),
      path.join(this.workspaceRoot, 'OfficeX.exe'),
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        return { exePath: cand, appEntryArg: '', isPackaged: true };
      }
    }

    const devExe = path.join(this.workspaceRoot, 'apps', 'desktop', 'node_modules', 'electron', 'dist', 'electron.exe');
    const devExeFallback = path.join(this.workspaceRoot, 'node_modules', 'electron', 'dist', 'electron.exe');
    const exePath = fs.existsSync(devExe) ? devExe : devExeFallback;
    const appEntry = path.join(this.workspaceRoot, 'apps', 'desktop');
    return { exePath, appEntryArg: `"${appEntry}"`, isPackaged: false };
  }

  /**
   * Create launcher executable script / batch file in bin directory
   */
  public createLauncherScript(appDef: WorkplaceAppDefinition): string {
    this.ensureDirectories();
    const cmdPath = path.join(this.binDir, `${appDef.executableName}.cmd`);
    const vbsPath = path.join(this.binDir, `${appDef.executableName}.vbs`);
    const { exePath, appEntryArg, isPackaged } = this.getExecutableTarget();

    // Batch script to start app
    const cmdContent = isPackaged
      ? `@echo off
setlocal
cd /d "${this.workspaceRoot}"
if "%~1"=="" (
    start "" "${exePath}" ${appDef.cliArg}
) else (
    start "" "${exePath}" ${appDef.cliArg} "%~1"
)
`
      : `@echo off
setlocal
cd /d "${this.workspaceRoot}"
if "%~1"=="" (
    start "" "${exePath}" ${appEntryArg} ${appDef.cliArg}
) else (
    start "" "${exePath}" ${appEntryArg} ${appDef.cliArg} "%~1"
)
`;
    fs.writeFileSync(cmdPath, cmdContent, 'utf-8');

    // VBS script for silent windowless launch from shortcuts
    const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "${this.workspaceRoot.replace(/\\/g, '\\\\')}"
WshShell.Run """${cmdPath.replace(/\\/g, '\\\\')}"" " & WScript.Arguments(0), 0, False
`;
    fs.writeFileSync(vbsPath, vbsContent, 'utf-8');

    return cmdPath;
  }

  /**
   * Create uninstaller script for an app
   */
  public createUninstallScript(appDef: WorkplaceAppDefinition): string {
    const scriptsDir = path.join(this.workspaceRoot, 'scripts');
    if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });

    const uninstallerBatPath = path.join(scriptsDir, `uninstall-${appDef.id}.cmd`);
    const uninstallCmd = `@echo off
echo Dang go cai dat ${appDef.displayName}...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '${path.join(this.workspaceRoot, 'scripts', 'install-app.ps1').replace(/'/g, "''")}' -Action uninstall -AppId '${appDef.id}' }"
echo ${appDef.displayName} da duoc go bo khoi Windows.
`;
    fs.writeFileSync(uninstallerBatPath, uninstallCmd, 'utf-8');
    return uninstallerBatPath;
  }

  /**
   * Create Windows Shortcuts on Desktop and Start Menu using PowerShell
   */
  public async createShortcuts(appDef: WorkplaceAppDefinition, _targetExePath?: string): Promise<boolean> {
    const { desktopPath, startMenuFolder, startMenuPath } = this.getShortcutPaths(appDef.displayName);

    if (!fs.existsSync(startMenuFolder)) {
      try { fs.mkdirSync(startMenuFolder, { recursive: true }); } catch {}
    }

    const { exePath, appEntryArg, isPackaged } = this.getExecutableTarget();
    const shortcutArgs = isPackaged ? appDef.cliArg : `${appEntryArg} ${appDef.cliArg}`.trim();
    const iconPath = path.join(this.workspaceRoot, 'resources', 'icons', `${appDef.id}.ico`);
    const fallbackIcon = fs.existsSync(iconPath) 
      ? `${iconPath},0` 
      : `${exePath},0`;

    const psScript = `
$WshShell = New-Object -comObject WScript.Shell

# Desktop Shortcut
$Shortcut = $WshShell.CreateShortcut('${desktopPath.replace(/'/g, "''")}')
$Shortcut.TargetPath = '${exePath.replace(/'/g, "''")}'
$Shortcut.Arguments = '${shortcutArgs.replace(/'/g, "''")}'
$Shortcut.WorkingDirectory = '${this.workspaceRoot.replace(/'/g, "''")}'
$Shortcut.Description = '${appDef.description.replace(/'/g, "''")}'
$Shortcut.IconLocation = '${fallbackIcon.replace(/'/g, "''")}'
$Shortcut.Save()

# Start Menu Shortcut
$Shortcut2 = $WshShell.CreateShortcut('${startMenuPath.replace(/'/g, "''")}')
$Shortcut2.TargetPath = '${exePath.replace(/'/g, "''")}'
$Shortcut2.Arguments = '${shortcutArgs.replace(/'/g, "''")}'
$Shortcut2.WorkingDirectory = '${this.workspaceRoot.replace(/'/g, "''")}'
$Shortcut2.Description = '${appDef.description.replace(/'/g, "''")}'
$Shortcut2.IconLocation = '${fallbackIcon.replace(/'/g, "''")}'
$Shortcut2.Save()
`;

    const tempPs = path.join(os.tmpdir(), `create_shortcut_${appDef.id}.ps1`);
    fs.writeFileSync(tempPs, psScript, 'utf-8');

    try {
      await this.runCmd(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempPs}"`);
      return true;
    } catch (err) {
      console.error('[CreateShortcuts Error]', err);
      return false;
    } finally {
      try { fs.unlinkSync(tempPs); } catch {}
    }
  }

  /**
   * Register file associations for document types (.docx, .xlsx, .pptx)
   */
  public async registerFileAssociations(appDef: WorkplaceAppDefinition, _launcherCmd?: string): Promise<void> {
    if (!appDef.fileExtensions || appDef.fileExtensions.length === 0) return;

    const { exePath, appEntryArg, isPackaged } = this.getExecutableTarget();
    const iconPath = path.join(this.workspaceRoot, 'resources', 'icons', `${appDef.id}.ico`);
    const openCommandStr = isPackaged
      ? `\\"${exePath}\\" ${appDef.cliArg} \\"%1\\"`
      : `\\"${exePath}\\" ${appEntryArg} ${appDef.cliArg} \\"%1\\"`;

    for (const ext of appDef.fileExtensions) {
      const regCommands = [
        `reg add "HKCU\\Software\\Classes\\${ext}" /ve /t REG_SZ /d "${appDef.progId}" /f`,
        `reg add "HKCU\\Software\\Classes\\${appDef.progId}" /ve /t REG_SZ /d "${appDef.displayName} Document" /f`,
        `reg add "HKCU\\Software\\Classes\\${appDef.progId}\\DefaultIcon" /ve /t REG_SZ /d "${iconPath},0" /f`,
        `reg add "HKCU\\Software\\Classes\\${appDef.progId}\\shell\\open\\command" /ve /t REG_SZ /d "${openCommandStr}" /f`,
      ];
      for (const cmd of regCommands) {
        await this.runCmdSafe(cmd);
      }
    }
  }

  /**
   * Unregister file associations
   */
  public async unregisterFileAssociations(appDef: WorkplaceAppDefinition): Promise<void> {
    if (!appDef.fileExtensions || appDef.fileExtensions.length === 0) return;

    for (const ext of appDef.fileExtensions) {
      await this.runCmdSafe(`reg delete "HKCU\\Software\\Classes\\${appDef.progId}" /f`);
    }
  }

  /**
   * Register application into Windows Control Panel (Programs and Features)
   */
  public async registerInControlPanel(appDef: WorkplaceAppDefinition, uninstallerCmd: string): Promise<boolean> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const regPath = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${appDef.regKey}`;
    const iconPath = path.join(this.workspaceRoot, 'resources', 'icons', `${appDef.id}.ico`);
    const displayIcon = fs.existsSync(iconPath) 
      ? `${iconPath},0` 
      : `${path.join(this.workspaceRoot, 'node_modules', 'electron', 'dist', 'electron.exe')},0`;

    const commands = [
      `reg add "${regPath}" /v DisplayName /t REG_SZ /d "${appDef.displayName}" /f`,
      `reg add "${regPath}" /v DisplayVersion /t REG_SZ /d "${appDef.version}" /f`,
      `reg add "${regPath}" /v Publisher /t REG_SZ /d "${appDef.publisher}" /f`,
      `reg add "${regPath}" /v InstallLocation /t REG_SZ /d "${this.workspaceRoot}" /f`,
      `reg add "${regPath}" /v DisplayIcon /t REG_SZ /d "${displayIcon}" /f`,
      `reg add "${regPath}" /v UninstallString /t REG_SZ /d "\\"${uninstallerCmd}\\"" /f`,
      `reg add "${regPath}" /v QuietUninstallString /t REG_SZ /d "\\"${uninstallerCmd}\\"" /f`,
      `reg add "${regPath}" /v EstimatedSize /t REG_DWORD /d ${appDef.sizeKb} /f`,
      `reg add "${regPath}" /v InstallDate /t REG_SZ /d "${today}" /f`,
      `reg add "${regPath}" /v Comments /t REG_SZ /d "${appDef.description}" /f`,
      `reg add "${regPath}" /v URLInfoAbout /t REG_SZ /d "https://officex.local" /f`,
      `reg add "${regPath}" /v NoModify /t REG_DWORD /d 1 /f`,
      `reg add "${regPath}" /v NoRepair /t REG_DWORD /d 1 /f`,
    ];

    for (const cmd of commands) {
      await this.runCmdSafe(cmd);
    }
    return true;
  }

  /**
   * Install standalone application into Windows & Control Panel
   */
  public async installApp(appId: string): Promise<{ success: boolean; message: string }> {
    const appDef = WORKPLACE_APPS[appId];
    if (!appDef) {
      return { success: false, message: `Không tìm thấy thông tin ứng dụng: ${appId}` };
    }

    try {
      const scriptPath = require('path').join(this.workspaceRoot, 'scripts', 'install-app.ps1');
      const fs = require('fs');
      
      console.log(`[InstallApp] workspaceRoot = ${this.workspaceRoot}`);
      console.log(`[InstallApp] scriptPath = ${scriptPath}`);
      console.log(`[InstallApp] scriptExists = ${fs.existsSync(scriptPath)}`);

      if (!fs.existsSync(scriptPath)) {
        return {
          success: false,
          message: `Không tìm thấy script cài đặt tại: ${scriptPath}. Workspace root có thể đang sai.`,
        };
      }

      const output = await this.runCmd(
        `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}" -Action install -AppId "${appId}"`
      );
      console.log(`[InstallApp] PowerShell output:`, output);

      return {
        success: true,
        message: `Đã cài đặt thành công ${appDef.displayName}! Ứng dụng đã xuất hiện trong Control Panel, Start Menu và Desktop.`,
      };
    } catch (err: any) {
      console.error(`[InstallApp Error] ${appId}:`, err);
      return { success: false, message: `Lỗi khi cài đặt: ${err?.message || err}` };
    }
  }

  /**
   * Uninstall application from Windows & Control Panel
   */
  public async uninstallApp(appId: string): Promise<{ success: boolean; message: string }> {
    const appDef = WORKPLACE_APPS[appId];
    if (!appDef) {
      return { success: false, message: `Không tìm thấy thông tin ứng dụng: ${appId}` };
    }

    try {
      // 1. Direct filesystem removal of all possible desktop and start menu shortcuts
      const { allDesktopPaths, startMenuPath } = this.getShortcutPaths(appDef.displayName);
      for (const p of allDesktopPaths) {
        try {
          if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch {}
      }
      try {
        if (fs.existsSync(startMenuPath)) fs.unlinkSync(startMenuPath);
      } catch {}

      // 2. Direct registry delete from Control Panel
      try {
        await this.runCmdSafe(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${appDef.regKey}" /f`);
        if (appDef.progId) {
          await this.runCmdSafe(`reg delete "HKCU\\Software\\Classes\\${appDef.progId}" /f`);
        }
      } catch {}

      // 3. PowerShell uninstall script for complete system cleanup and shell refresh
      const scriptPath = path.join(this.workspaceRoot, 'scripts', 'install-app.ps1');
      if (fs.existsSync(scriptPath)) {
        await this.runCmdSafe(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}" -Action uninstall -AppId "${appId}"`);
      }

      return {
        success: true,
        message: `Đã gỡ cài đặt thành công ${appDef.displayName} khỏi hệ thống Windows và Desktop.`,
      };
    } catch (err: any) {
      console.error(`[UninstallApp Error] ${appId}:`, err);
      return { success: false, message: `Lỗi khi gỡ cài đặt: ${err?.message || err}` };
    }
  }

  /**
   * Get install status of all Workplace apps
   */
  public async getAllAppsStatus(): Promise<Record<string, AppInstallStatus>> {
    const results: Record<string, AppInstallStatus> = {};

    for (const [id, appDef] of Object.entries(WORKPLACE_APPS)) {
      const inControlPanel = await this.isAppInstalledInRegistry(appDef.regKey);
      const { allDesktopPaths, startMenuPath } = this.getShortcutPaths(appDef.displayName);
      const desktopShortcutExists = allDesktopPaths.some((p) => fs.existsSync(p));
      const startMenuShortcutExists = fs.existsSync(startMenuPath);

      results[id] = {
        id,
        isInstalled: inControlPanel || desktopShortcutExists,
        displayName: appDef.displayName,
        version: appDef.version,
        installLocation: this.workspaceRoot,
        desktopShortcutExists,
        startMenuShortcutExists,
        inControlPanel,
      };
    }

    return results;
  }

  /**
   * Open Windows Control Panel directly (Programs & Features)
   */
  public async openControlPanel(): Promise<void> {
    await this.runCmd('start "" "appwiz.cpl"');
  }

  /**
   * Open Windows Settings (Installed Apps)
   */
  public async openWindowsSettingsApps(): Promise<void> {
    await this.runCmd('start ms-settings:appsfeatures');
  }

  /**
   * Generate standalone installer package files into downloads/ directory
   */
  public generateStandaloneInstallerFiles(appDef: WorkplaceAppDefinition): { installerBat: string; installerPs1: string } {
    this.ensureDirectories();

    const batPath = path.join(this.downloadsDir, `Setup-${appDef.executableName}.cmd`);
    const ps1Path = path.join(this.downloadsDir, `Setup-${appDef.executableName}.ps1`);

    const batContent = `@echo off
title Cài đặt ${appDef.displayName}
echo ========================================================
echo   TRÌNH CÀI ĐẶT ĐỘC LẬP: ${appDef.displayName}
echo   Nhà phát hành: ${appDef.publisher} (v${appDef.version})
echo ========================================================
echo.
echo Dang tien hanh cai dat vao Windows va Control Panel...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { & '${path.join(this.workspaceRoot, 'scripts', 'install-app.ps1').replace(/'/g, "''")}' -Action install -AppId '${appDef.id}' }"
echo.
echo ========================================================
echo   HOAN TAT CAI DAT ${appDef.displayName}!
echo   Ung dung da duoc dang ky vao Windows Control Panel.
echo ========================================================
pause
`;
    fs.writeFileSync(batPath, batContent, 'utf-8');

    const ps1Content = `# Trình cài đặt PowerShell cho ${appDef.displayName}
$Workspace = "${this.workspaceRoot.replace(/"/g, '`"')}"
$ScriptPath = Join-Path $Workspace "scripts\\install-app.ps1"
Write-Host "Dang cai dat ${appDef.displayName}..." -ForegroundColor Cyan
& $ScriptPath -Action install -AppId "${appDef.id}"
Write-Host "Cai dat thanh cong ${appDef.displayName} vao Windows Control Panel!" -ForegroundColor Green
`;
    fs.writeFileSync(ps1Path, ps1Content, 'utf-8');

    return { installerBat: batPath, installerPs1: ps1Path };
  }

  /**
   * Generate all standalone installer packages for all apps
   */
  public generateAllStandalonePackages(): void {
    for (const appDef of Object.values(WORKPLACE_APPS)) {
      this.generateStandaloneInstallerFiles(appDef);
    }
  }
}
