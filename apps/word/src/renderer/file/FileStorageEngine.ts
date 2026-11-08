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
  data?: any;      // file content as string or binary descriptor object
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
  private _browserFileCache: Map<string, { file: File; text?: string }> = new Map();
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
      name: 'KiemTra_ToiTa_2026.docx',
      path: 'C:\\Users\\taduc\\Desktop\\KiemTra_ToiTa_2026.docx',
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
              const fileObj = this.makeFileInfo(path, provider, typeof content === 'string' ? content : '');
              if (content && typeof content === 'object' && content.size) {
                fileObj.size = content.size;
              }
              this.addToRecent(fileObj);
              return { success: true, data: content, file: fileObj };
            }
          } catch {}
        }
        // Browser fallback: check memory cache or localStorage
        const cached = this._browserFileCache.get(path);
        if (cached?.file) {
          try {
            const arrayBuf = await cached.file.arrayBuffer();
            const u8 = new Uint8Array(arrayBuf);
            if (u8.length >= 4 && u8[0] === 0x50 && u8[1] === 0x4B && u8[2] === 0x03 && u8[3] === 0x04) {
              const fileObj = this.makeFileInfo(path, provider, '');
              fileObj.size = u8.length;
              this.addToRecent(fileObj);
              return {
                success: true,
                data: { isBinary: true, arrayBuffer: arrayBuf, fileType: 'docx', size: u8.length },
                file: fileObj
              };
            }
            if (u8.length >= 4 && u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46) {
              const fileObj = this.makeFileInfo(path, provider, '');
              fileObj.size = u8.length;
              this.addToRecent(fileObj);
              return {
                success: true,
                data: { isBinary: true, arrayBuffer: arrayBuf, fileType: 'pdf', size: u8.length },
                file: fileObj
              };
            }
            if (u8.length >= 4 && u8[0] === 0xD0 && u8[1] === 0xCF && u8[2] === 0x11 && u8[3] === 0xE0) {
              const fileObj = this.makeFileInfo(path, provider, '');
              fileObj.size = u8.length;
              this.addToRecent(fileObj);
              return {
                success: true,
                data: { isBinary: true, arrayBuffer: arrayBuf, fileType: 'doc', size: u8.length },
                file: fileObj
              };
            }
            const text = new TextDecoder('utf-8').decode(u8);
            const fileObj = this.makeFileInfo(path, provider, text);
            this.addToRecent(fileObj);
            return { success: true, data: text, file: fileObj };
          } catch {}
        }
        const stored = localStorage.getItem(`officex_file_${path}`);
        const content = cached?.text || stored || `[Document content of ${path}]`;
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
            await ipc.invoke('fs:writeFile', { path: fullPath, content }, content);
          } catch {}
        } else if (typeof document !== 'undefined') {
          try {
            const fileName = fullPath.split(/[\\/]/).pop() || 'Document.docx';
            const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    const ipc = (window as any).ipc || (window as any).electronAPI;
    if (ipc && typeof ipc.invoke === 'function') {
      try {
        const result = await ipc.invoke('dialog:showOpenDialog', { defaultPath: desktopPath, filters, properties: ['openFile'] });
        if (result?.filePaths?.[0]) return result.filePaths[0];
        if (result?.canceled) return null;
      } catch {}
    }

    if (typeof (window as any).showOpenFilePicker === 'function') {
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [{
            description: 'Word Documents',
            accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', '.doc', '.pdf', '.txt'] }
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

  private _customSaveDialogHandler: ((defaultName: string, filters?: Array<{ name: string; extensions: string[] }>) => Promise<string | null>) | null = null;

  setSaveDialogHandler(handler: ((defaultName: string, filters?: Array<{ name: string; extensions: string[] }>) => Promise<string | null>) | null) {
    this._customSaveDialogHandler = handler;
  }

  async showSaveDialog(defaultName?: string, filters?: Array<{ name: string; extensions: string[] }>): Promise<string | null> {
    const defaultFileName = defaultName || 'Document_1.docx';

    if (this._customSaveDialogHandler) {
      const customResult = await this._customSaveDialogHandler(defaultFileName, filters);
      if (customResult !== undefined) {
        return customResult;
      }
    }

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
            description: 'Word Document (*.docx)',
            accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
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
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
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
