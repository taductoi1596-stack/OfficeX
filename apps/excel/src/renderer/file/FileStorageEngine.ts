/**
 * FileStorageEngine.ts
 *
 * Abstraction layer for all storage backends:
 * Local filesystem, Cloud (OneDrive, Google Drive, Dropbox), Network shares.
 */

export type StorageProvider = 'local' | 'onedrive' | 'google_drive' | 'dropbox' | 'network';

export interface StorageFile {
  id: string;
  name: string;
  path: string;
  provider: StorageProvider;
  size: number;       // bytes
  modified: Date;
  created: Date;
  isReadOnly?: boolean;
  mimeType?: string;
}

export interface StorageResult {
  success: boolean;
  file?: StorageFile;
  data?: string;      // file content as string
  error?: string;
}

export interface CloudStatus {
  provider: StorageProvider;
  connected: boolean;
  user?: string;
  quota?: { used: number; total: number };
}

class FileStorageEngineImpl {
  // Simulated recent files registry
  private recentFiles: StorageFile[] = [];
  private pinnedFiles: Set<string> = new Set();
  private cloudStatuses: Map<StorageProvider, CloudStatus> = new Map();
  private _browserFileCache: Map<string, { file: File; text: string }> = new Map();
  private autoSaveEnabled = true;
  private autoSaveIntervalMs = 30000; // 30 seconds
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private autoSaveCallback: (() => void) | null = null;

  constructor() {
    this.cloudStatuses.set('local', { provider: 'local', connected: true });
    this.cloudStatuses.set('onedrive', { provider: 'onedrive', connected: false });
    this.cloudStatuses.set('google_drive', { provider: 'google_drive', connected: false });
    this.cloudStatuses.set('dropbox', { provider: 'dropbox', connected: false });
    this.cloudStatuses.set('network', { provider: 'network', connected: false });

    // Desktop test file ready in Recent List for quick opening
    const desktopTestFile: StorageFile = {
      id: 'recent_desktop_test',
      name: 'KiemTra_ToiTa_2026.xlsx',
      path: 'C:\\Users\\taduc\\Desktop\\KiemTra_ToiTa_2026.xlsx',
      provider: 'local',
      size: 512,
      created: new Date(),
      modified: new Date(),
    };
    this.recentFiles.unshift(desktopTestFile);
  }

  // ── File I/O ───────────────────────────────────────────────────────

  async readFile(path: string, provider: StorageProvider = 'local'): Promise<StorageResult> {
    try {
      if (provider === 'local') {
        const ipc = (window as any).ipc || (window as any).electronAPI;
        if (ipc && typeof ipc.invoke === 'function') {
          try {
            const content = await ipc.invoke('fs:readFile', path);
            if (content !== undefined && content !== null) {
              const fileObj = this.makeFileInfo(path, provider, content);
              this.addToRecent(fileObj);
              return { success: true, data: content, file: fileObj };
            }
          } catch {}
        }
        // Browser fallback: check memory cache or localStorage
        const cached = this._browserFileCache.get(path);
        const stored = localStorage.getItem(`officex_file_${path}`);
        const content = cached?.text || stored || `[Workbook content of ${path}]`;
        const fileObj = this.makeFileInfo(path, provider, content);
        this.addToRecent(fileObj);
        return {
          success: true,
          data: content,
          file: fileObj
        };
      }
      return { success: false, error: 'Storage provider not available.' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async writeFile(path: string, content: string, provider: StorageProvider = 'local'): Promise<StorageResult> {
    try {
      if (provider === 'local') {
        const fullPath = (path.includes('\\') || path.includes('/')) ? path : `C:\\Users\\taduc\\Desktop\\${path}`;

        // Cache in memory and localStorage for instant opening
        this._browserFileCache.set(fullPath, { file: new File([content], fullPath), text: content });
        try { localStorage.setItem(`officex_file_${fullPath}`, content); } catch {}

        const ipc = (window as any).ipc || (window as any).electronAPI;
        if (ipc && typeof ipc.invoke === 'function') {
          try {
            await ipc.invoke('fs:writeFile', fullPath, content);
          } catch {}
        }
        const file = this.makeFileInfo(fullPath, provider, content);
        this.addToRecent(file);
        return { success: true, file };
      }
      return { success: false, error: 'Storage provider not available.' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async showOpenDialog(filters?: Array<{ name: string; extensions: string[] }>): Promise<string | null> {
    const desktopPath = 'C:\\Users\\taduc\\Desktop';
    const defaultFilters = [
      { name: 'All Supported Spreadsheets (*.xlsx, *.csv, *.tsv, *.txt)', extensions: ['xlsx', 'xls', 'csv', 'tsv', 'txt', 'ods'] },
      { name: 'Excel Workbooks (*.xlsx, *.xls)', extensions: ['xlsx', 'xls'] },
      { name: 'CSV (Comma delimited) (*.csv)', extensions: ['csv'] },
      { name: 'TSV (Tab delimited) (*.tsv, *.txt)', extensions: ['tsv', 'txt'] },
      { name: 'All Files (*.*)', extensions: ['*'] },
    ];
    const ipc = (window as any).ipc || (window as any).electronAPI;
    if (ipc && typeof ipc.invoke === 'function') {
      try {
        const result = await ipc.invoke('dialog:showOpenDialog', { defaultPath: desktopPath, filters: filters || defaultFilters, properties: ['openFile'] });
        if (result?.filePaths?.[0]) return result.filePaths[0];
        if (result?.canceled) return null;
      } catch {}
    }

    if (typeof (window as any).showOpenFilePicker === 'function') {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [{
            description: 'Spreadsheet & Data Files (*.xlsx, *.csv, *.tsv, *.txt)',
            accept: {
              'text/csv': ['.csv'],
              'text/tab-separated-values': ['.tsv'],
              'text/plain': ['.txt'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }
          }]
        });
        if (handle && handle.name) {
          const file = await handle.getFile();
          const text = await file.text();
          const fullPath = `C:\\Users\\taduc\\Desktop\\${handle.name}`;
          this._browserFileCache.set(fullPath, { file, text });
          return fullPath;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return null;
      }
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      const exts = filters?.flatMap(f => f.extensions.map(e => e === '*' ? '*' : `.${e}`)).join(',') || '*';
      input.accept = exts;
      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (file) {
          try {
            const text = await file.text();
            this._browserFileCache.set(file.name, { file, text });
            resolve(file.name);
          } catch {
            resolve(file.name);
          }
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  async showSaveDialog(defaultName?: string, filters?: Array<{ name: string; extensions: string[] }>): Promise<string | null> {
    const defaultFileName = defaultName || 'Workbook_1.xlsx';
    const desktopPath = `C:\\Users\\taduc\\Desktop\\${defaultFileName}`;

    const ipc = (window as any).ipc || (window as any).electronAPI;
    if (ipc && typeof ipc.invoke === 'function') {
      try {
        const result = await ipc.invoke('dialog:showSaveDialog', { defaultPath: desktopPath, filters });
        if (result?.filePath) return result.filePath;
        if (result?.canceled) return null;
      } catch {}
    }

    if (typeof (window as any).showSaveFilePicker === 'function') {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [{
            description: 'Excel Workbook (*.xlsx)',
            accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
          }]
        });
        if (handle && handle.name) {
          return `C:\\Users\\taduc\\Desktop\\${handle.name}`;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return null;
      }
    }

    // Interactive prompt fallback allowing custom path and file renaming
    const chosen = window.prompt('📁 Save As — Choose folder path and file name:', desktopPath);
    if (!chosen || !chosen.trim()) return null;
    return chosen.trim();
  }

  async revealInExplorer(path: string): Promise<void> {
    const ipc = (window as any).ipc;
    if (ipc) await ipc.invoke('shell:showItemInFolder', path);
  }

  // ── Recent Files ───────────────────────────────────────────────────

  addToRecent(file: StorageFile) {
    this.recentFiles = [file, ...this.recentFiles.filter(f => f.path !== file.path)].slice(0, 50);
  }

  getRecentFiles(): StorageFile[] {
    return this.recentFiles;
  }

  clearRecent() {
    this.recentFiles = this.recentFiles.filter(f => this.pinnedFiles.has(f.id));
  }

  pinFile(fileId: string) { this.pinnedFiles.add(fileId); }
  unpinFile(fileId: string) { this.pinnedFiles.delete(fileId); }
  isFilePinned(fileId: string): boolean { return this.pinnedFiles.has(fileId); }
  removeFromRecent(fileId: string) { this.recentFiles = this.recentFiles.filter(f => f.id !== fileId); }

  // ── Auto Save ──────────────────────────────────────────────────────

  enableAutoSave(callback: () => void, intervalMs?: number) {
    this.autoSaveEnabled = true;
    this.autoSaveCallback = callback;
    if (intervalMs) this.autoSaveIntervalMs = intervalMs;
    this.startAutoSave();
  }

  disableAutoSave() {
    this.autoSaveEnabled = false;
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  setAutoSaveInterval(ms: number) {
    this.autoSaveIntervalMs = ms;
    if (this.autoSaveEnabled) {
      this.disableAutoSave();
      if (this.autoSaveCallback) this.enableAutoSave(this.autoSaveCallback, ms);
    }
  }

  isAutoSaveEnabled(): boolean { return this.autoSaveEnabled; }
  getAutoSaveInterval(): number { return this.autoSaveIntervalMs; }

  private startAutoSave() {
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = setInterval(() => {
      if (this.autoSaveCallback) this.autoSaveCallback();
    }, this.autoSaveIntervalMs);
  }

  // ── Cloud Status ───────────────────────────────────────────────────

  getCloudStatus(provider: StorageProvider): CloudStatus {
    return this.cloudStatuses.get(provider) ?? { provider, connected: false };
  }

  getAllCloudStatuses(): CloudStatus[] {
    return Array.from(this.cloudStatuses.values());
  }

  // ── Helpers ────────────────────────────────────────────────────────

  private makeFileInfo(path: string, provider: StorageProvider, content: string): StorageFile {
    const name = path.split(/[\\/]/).pop() ?? path;
    return {
      id: `${provider}:${path}`,
      name,
      path,
      provider,
      size: new Blob([content]).size,
      modified: new Date(),
      created: new Date(),
      mimeType: this.getMimeType(name),
    };
  }

  private getMimeType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    const mimes: Record<string, string> = {
      docx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      doc: 'application/msExcel',
      odt: 'application/vnd.oasis.opendocument.text',
      pdf: 'application/pdf',
      txt: 'text/plain',
      html: 'text/html',
      md: 'text/markdown',
      rtf: 'application/rtf',
      xml: 'application/xml',
      json: 'application/json',
    };
    return mimes[ext] ?? 'application/octet-stream';
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }



  async labelVersion(versionId: string, label: string): Promise<boolean> {
    console.log('[FileStorageEngine] labelVersion()', versionId, label);
    return true;
  }
}

export const FileStorageEngine = new FileStorageEngineImpl();
