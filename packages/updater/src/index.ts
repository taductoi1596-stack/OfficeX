import { injectable } from 'tsyringe';
import { EventEmitter } from 'events';
import { autoUpdater } from 'electron-updater';

@injectable()
export class VersionManager {
  public getCurrentVersion(): string {
    try {
      return require('electron').app.getVersion();
    } catch {
      return '1.0.0';
    }
  }
  
  public async checkForUpdates(): Promise<{ available: boolean, version?: string }> {
    try {
      const result = await autoUpdater.checkForUpdates();
      if (result && result.updateInfo) {
        return { available: true, version: result.updateInfo.version };
      }
    } catch (error) {
      console.warn('Update check failed:', error);
    }
    return { available: false };
  }
}

@injectable()
export class DownloadManager extends EventEmitter {
  private isDownloading = false;

  public async startDownload(): Promise<void> {
    if (this.isDownloading) return;
    this.isDownloading = true;

    return new Promise((resolve, reject) => {
      autoUpdater.on('download-progress', (progressObj) => {
        this.emit('progress', { progress: progressObj.percent, status: 'Downloading update package...' });
      });

      autoUpdater.on('update-downloaded', () => {
        this.isDownloading = false;
        this.emit('progress', { progress: 100, status: 'Download complete! Ready to install.' });
        resolve();
      });

      autoUpdater.on('error', (error) => {
        this.isDownloading = false;
        reject(error);
      });

      autoUpdater.downloadUpdate().catch(reject);
    });
  }
}

@injectable()
export class UpdateService {
  constructor(
    private versionManager: VersionManager,
    private downloadManager: DownloadManager
  ) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
  }

  public async checkAndDownload(onProgress: (data: any) => void): Promise<boolean> {
    const check = await this.versionManager.checkForUpdates();
    if (check.available) {
      this.downloadManager.on('progress', onProgress);
      try {
        await this.downloadManager.startDownload();
      } finally {
        this.downloadManager.off('progress', onProgress);
      }
      return true;
    }
    return false;
  }

  public async checkForUpdates(): Promise<{ hasUpdate: boolean; latestVersion?: string } | null> {
    try {
      const result = await this.versionManager.checkForUpdates();
      return {
        hasUpdate: result.available,
        latestVersion: result.version,
      };
    } catch {
      return null;
    }
  }
  
  public quitAndInstall() {
    autoUpdater.quitAndInstall();
  }
}

