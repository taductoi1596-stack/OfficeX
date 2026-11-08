/**
 * FileEngine.ts
 *
 * Enterprise File Engine for OfficeX EXCEL.
 * Central orchestrator for all file operations.
 * All UI must go through this engine via CommandDispatcher → FileCommandRegistry → FileEngine.
 */

import { FilePermissionEngine } from './FilePermissionEngine';
import { FileStorageEngine, StorageProvider } from './FileStorageEngine';
import { FileRecoveryEngine } from './FileRecoveryEngine';
import { EditorAPI } from '../editorApi';

export interface FileInfo {
  WorkbookId: string;
  name: string;
  path: string | null;
  provider: StorageProvider;
  isModified: boolean;
  isReadOnly: boolean;
  isProtected: boolean;
  ExcelCount: number;
  pageCount: number;
  charCount: number;
  size: number;
  created: Date;
  modified: Date;
  author: string;
  title: string;
  subject: string;
  keyExcels: string;
  company: string;
  category: string;
  tags: string[];
}

export type FileEvent =
  | 'file:new' | 'file:opened' | 'file:closed' | 'file:saved'
  | 'file:exported' | 'file:imported' | 'file:renamed' | 'file:deleted'
  | 'file:recovery' | 'version:created' | 'version:restored'
  | 'autosave:triggered' | 'file:error';

class FileEngineImpl {
  private currentFile: FileInfo | null = null;
  private listeners: Map<FileEvent, Array<(data?: any) => void>> = new Map();
  private _docId = `doc_${Date.now()}`;
  private _dataProvider?: (targetPath?: string) => string;
  private _onLoad?: (content: any) => void;

  setDataProvider(provider: (targetPath?: string) => string) {
    this._dataProvider = provider;
  }

  setOnLoad(callback: (content: any) => void) {
    this._onLoad = callback;
  }

  // ── Init ────────────────────────────────────────────────────────────

  initialize() {
    // Mark this Workbook as open (crash detection)
    FileRecoveryEngine.markWorkbookOpen(this._docId);

    // Enable auto-save
    FileStorageEngine.enableAutoSave(() => {
      this.autoSave();
    });

    this.currentFile = {
      WorkbookId: this._docId,
      name: 'Workbook 1',
      path: null,
      provider: 'local',
      isModified: false,
      isReadOnly: false,
      isProtected: false,
      ExcelCount: 0,
      pageCount: 1,
      charCount: 0,
      size: 0,
      created: new Date(),
      modified: new Date(),
      author: 'User',
      title: 'Workbook 1',
      subject: '',
      keyExcels: '',
      company: '',
      category: '',
      tags: [],
    };

    // Check for unrecovered Workbooks on startup
    const unrecovered = FileRecoveryEngine.getUnrecoveredWorkbooks();
    if (unrecovered.length > 0) {
      console.log(`[FileEngine] Found ${unrecovered.length} unrecovered Workbook(s).`);
    }
  }

  dispose() {
    FileStorageEngine.disableAutoSave();
    if (this.currentFile) {
      FileRecoveryEngine.markWorkbookClosed(this.currentFile.WorkbookId);
    }
  }

  getCurrentFile(): FileInfo | null { return this.currentFile; }

  // ── Event System ────────────────────────────────────────────────────

  on(event: FileEvent, fn: (data?: any) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
    return () => {
      const arr = this.listeners.get(event)!;
      this.listeners.set(event, arr.filter(f => f !== fn));
    };
  }

  private emit(event: FileEvent, data?: any) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }

  // ── New Workbook ────────────────────────────────────────────────────

  newWorkbook(type: 'blank' | 'default' | 'empty' = 'blank') {
    this._docId = `doc_${Date.now()}`;
    this.currentFile = {
      WorkbookId: this._docId,
      name: 'Workbook 1',
      path: null,
      provider: 'local',
      isModified: false,
      isReadOnly: false,
      isProtected: false,
      ExcelCount: 0,
      pageCount: 1,
      charCount: 0,
      size: 0,
      created: new Date(),
      modified: new Date(),
      author: 'User',
      title: 'Workbook 1',
      subject: '',
      keyExcels: '',
      company: '',
      category: '',
      tags: [],
    };
    EditorAPI.getLegacy()?.clearWorkbook?.();
    if (type === 'default') {
      // Default template might have some predefined styles/text
    } else if (type === 'empty') {
      // Strictly empty
    }
    this.emit('file:new', this.currentFile);
  }

  openWelcomeScreen() {
    // Navigate to welcome screen
    console.log('[FileEngine] Open Welcome Screen');
  }

  // ── Open ────────────────────────────────────────────────────────────

  async openLocal(): Promise<boolean> {
    const path = await FileStorageEngine.showOpenDialog([
      { name: 'All Supported Spreadsheets (*.xlsx, *.csv, *.tsv, *.txt)', extensions: ['xlsx', 'xls', 'csv', 'tsv', 'txt', 'ods'] },
      { name: 'Excel Workbooks (*.xlsx, *.xls)', extensions: ['xlsx', 'xls'] },
      { name: 'CSV (Comma delimited) (*.csv)', extensions: ['csv'] },
      { name: 'TSV (Tab delimited) (*.tsv, *.txt)', extensions: ['tsv', 'txt'] },
      { name: 'All Files (*.*)', extensions: ['*'] },
    ]);
    if (!path) return false;
    return this.openFromPath(path);
  }

  async openFromPath(path: string): Promise<boolean> {
    FilePermissionEngine.require('read');
    const result = await FileStorageEngine.readFile(path, 'local');
    if (!result.success || !result.file) {
      this.emit('file:error', result.error);
      return false;
    }
    if (this.currentFile) {
      this.currentFile.name = result.file.name;
      this.currentFile.path = path;
      this.currentFile.modified = result.file.modified;
      this.currentFile.isModified = false;
    } else {
      this.currentFile = {
        WorkbookId: `doc_${Date.now()}`,
        name: result.file.name,
        path: path,
        title: result.file.name,
        subject: '',
        keyExcels: '',
        company: '',
        category: '',
        tags: [],
        size: result.file.size,
        created: new Date(),
        modified: result.file.modified,
        author: 'Tới Tạ',
        ExcelCount: 0,
        charCount: 0,
        pageCount: 1,
        isModified: false,
        isReadOnly: false,
        isProtected: false,
        provider: 'local',
      };
    }
    
    // Set text in legacy API / editor canvas
    const contentToSet = result.data !== undefined ? result.data : '';
    if (this._onLoad) {
      this._onLoad(contentToSet);
    } else {
      const legacy = EditorAPI.getLegacy();
      if (legacy?.setContent) {
        legacy.setContent(contentToSet);
      } else if (legacy?.clearWorkbook && legacy?.insertTextAtSelection) {
        legacy.clearWorkbook();
        legacy.insertTextAtSelection(contentToSet);
      } else if (legacy?.insertTextAtSelection) {
        legacy.insertTextAtSelection(contentToSet);
      }
    }

    FileStorageEngine.addToRecent(result.file);
    this.emit('file:opened', this.currentFile);
    this.emit('file:renamed', this.currentFile);
    return true;
  }

  async openReadOnly(path: string): Promise<boolean> {
    const ok = await this.openFromPath(path);
    if (ok && this.currentFile) {
      this.currentFile.isReadOnly = true;
      FilePermissionEngine.setReadOnly(this.currentFile.WorkbookId, true);
    }
    return ok;
  }

  async openAndRepair(): Promise<boolean> {
    const path = await FileStorageEngine.showOpenDialog([
      { name: 'Excel Workbooks', extensions: ['xlsx', 'xls', 'ods', 'csv'] },
      { name: 'All Files', extensions: ['*'] },
    ]);
    if (!path) return false;
    console.log(`[FileEngine] Attempting to repair: ${path}`);
    return this.openFromPath(path);
  }

  async openSafe(path: string): Promise<boolean> {
    console.log(`[FileEngine] Opening in safe mode: ${path}`);
    return this.openFromPath(path);
  }

  async openWorkspace(): Promise<boolean> {
    console.log(`[FileEngine] Opening Workspace...`);
    return true; // Stub
  }

  async restoreWorkspace(): Promise<boolean> {
    console.log(`[FileEngine] Restoring Workspace...`);
    return true; // Stub
  }

  async openFolder(): Promise<boolean> {
    console.log(`[FileEngine] Opening Folder...`);
    return true; // Stub
  }

  async openProject(): Promise<boolean> {
    console.log(`[FileEngine] Opening Project...`);
    return true; // Stub
  }

  async restoreAutoRecovery(): Promise<boolean> {
    console.log(`[FileEngine] Restoring Auto Recovery...`);
    return true; // Stub
  }

  async openExample(): Promise<boolean> {
    console.log(`[FileEngine] Opening Example document...`);
    this.newWorkbook();
    EditorAPI.getLegacy()?.insertTextAtSelection?.('This is a sample document.');
    return true;
  }

  async openLastWorkbook(): Promise<boolean> {
    const recent = FileStorageEngine.getRecentFiles();
    if (recent.length > 0) {
      return this.openFromPath(recent[0].path);
    }
    return false;
  }

  async openStartupWorkbook(): Promise<boolean> {
    console.log(`[FileEngine] Opening Startup document...`);
    return this.openLastWorkbook();
  }


  // ── Close ────────────────────────────────────────────────────────────

  close(): boolean {
    if (this.currentFile?.isModified) {
      // In a full app, we'd show a save dialog. For now auto-save.
      this.autoSave();
    }
    if (this.currentFile) {
      FileRecoveryEngine.markWorkbookClosed(this.currentFile.WorkbookId);
      this.emit('file:closed', this.currentFile);
    }
    this.currentFile = null;
    return true;
  }

  closeAll(): boolean {
    return this.close();
  }

  closeWithoutSave(): boolean {
    if (this.currentFile) {
      FileRecoveryEngine.markWorkbookClosed(this.currentFile.WorkbookId);
      this.emit('file:closed', this.currentFile);
    }
    this.currentFile = null;
    return true;
  }

  async saveAndClose(): Promise<boolean> {
    const saved = await this.save();
    if (saved) {
      return this.close();
    }
    return false;
  }

  // ── Save ────────────────────────────────────────────────────────────

  async save(): Promise<boolean> {
    if (!this.currentFile) {
      this.newWorkbook('blank');
    }
    if (!this.currentFile!.path) {
      return this.saveAs();
    }
    FilePermissionEngine.require('write', this.currentFile!.WorkbookId);

    const content = this.getWorkbookContent();
    const path = this.currentFile!.path!;

    const result = await FileStorageEngine.writeFile(path, content, this.currentFile!.provider);
    if (!result.success) {
      this.emit('file:error', result.error);
      return false;
    }

    this.currentFile!.isModified = false;
    this.currentFile!.modified = new Date();
    this.emit('file:saved', this.currentFile!);
    return true;
  }

  async saveAs(): Promise<boolean> {
    if (!this.currentFile) {
      this.newWorkbook('blank');
    }
    FilePermissionEngine.require('write');

    const defaultName = this.currentFile?.name || 'Workbook_1.xlsx';
    const path = await FileStorageEngine.showSaveDialog(defaultName, [
      { name: 'Excel Workbook (*.xlsx)', extensions: ['xlsx'] },
      { name: 'CSV (Comma delimited) (*.csv)', extensions: ['csv'] },
      { name: 'TSV (Tab delimited) (*.tsv)', extensions: ['tsv'] },
      { name: 'OfficeX Workbook (*.json)', extensions: ['json'] },
      { name: 'PDF (*.pdf)', extensions: ['pdf'] },
      { name: 'All Files (*.*)', extensions: ['*'] },
    ]);
    if (!path) return false;

    const content = this.getWorkbookContent(path);
    const result = await FileStorageEngine.writeFile(path, content, 'local');
    if (!result.success) {
      this.emit('file:error', result.error);
      return false;
    }

    if (this.currentFile) {
      const fileName = path.split(/[\\/]/).pop() ?? path;
      this.currentFile.path = path;
      this.currentFile.name = fileName;
      this.currentFile.title = fileName;
      this.currentFile.isModified = false;
      this.currentFile.modified = new Date();
      this.emit('file:saved', this.currentFile);
      this.emit('file:renamed', this.currentFile);
    }
    return true;
  }

  async saveCopy(): Promise<boolean> {
    if (!this.currentFile) {
      this.newWorkbook('blank');
    }
    const defaultName = `Copy_of_${this.currentFile?.name || 'Workbook_1.xlsx'}`;
    const path = await FileStorageEngine.showSaveDialog(defaultName);
    if (!path) return false;
    const content = this.getWorkbookContent();
    await FileStorageEngine.writeFile(path, content, 'local');
    return true;
  }

  async saveAll(): Promise<void> {
    await this.save();
  }

  async saveIfDirty(): Promise<boolean> {
    if (this.currentFile?.isModified) {
      return this.save();
    }
    return true;
  }

  async saveBackground(): Promise<boolean> {
    // Simulate a non-blocking background save
    this.autoSave();
    return true;
  }

  async saveAsFormat(format: string): Promise<boolean> {
    if (!this.currentFile) return false;
    FilePermissionEngine.require('write');

    const filterMap: Record<string, { name: string; ext: string }> = {
      pdf:      { name: 'PDF Workbook', ext: 'pdf' },
      xlsx:     { name: 'Excel Workbook', ext: 'xlsx' },
      xls:      { name: 'Excel 97-2003', ext: 'xls' },
      ods:      { name: 'OpenDocument Spreadsheet', ext: 'ods' },
      csv:      { name: 'CSV File', ext: 'csv' },
      html:     { name: 'HTML Workbook', ext: 'html' },
      markdown: { name: 'Markdown', ext: 'md' },
      txt:      { name: 'Plain Text', ext: 'txt' },
      xml:      { name: 'XML Workbook', ext: 'xml' },
    };
    
    const filter = filterMap[format];
    if (!filter) return false;

    const path = await FileStorageEngine.showSaveDialog(
      this.currentFile.name.replace(/\.[^/.]+$/, "") + "." + filter.ext,
      [{ name: filter.name, extensions: [filter.ext] }]
    );
    
    if (!path) return false;
    
    const content = this.getWorkbookContent();
    const result = await FileStorageEngine.writeFile(path, content, 'local');
    if (!result.success) {
      this.emit('file:error', result.error);
      return false;
    }

    this.currentFile.path = path;
    this.currentFile.name = path.split(/[\\/]/).pop() ?? path;
    this.currentFile.isModified = false;
    this.currentFile.modified = new Date();
    this.emit('file:saved', this.currentFile);
    return true;
  }

  async saveVersion(label?: string, comment?: string): Promise<void> {
    if (!this.currentFile) return;
    const content = this.getWorkbookContent();
    const version = FileRecoveryEngine.createVersion(this.currentFile.WorkbookId, content, label, comment);
    this.emit('version:created', version);
  }

  private async autoSave() {
    if (!this.currentFile || !this.currentFile.isModified) return;
    const content = this.getWorkbookContent();
    FileRecoveryEngine.saveRecoveryPoint(
      this.currentFile.WorkbookId,
      this.currentFile.name,
      content,
      'autosave'
    );
    this.emit('autosave:triggered', this.currentFile);
    console.log('[FileEngine] Auto-saved recovery point.');
  }

  markModified() {
    if (this.currentFile) this.currentFile.isModified = true;
  }

  // ── Export ──────────────────────────────────────────────────────────

  async exportAs(format: string): Promise<boolean> {
    if (!this.currentFile) return false;
    FilePermissionEngine.require('export');

    const filterMap: Record<string, { name: string; ext: string }> = {
      pdf:      { name: 'PDF Workbook', ext: 'pdf' },
      docx:     { name: 'Excel Workbook', ext: 'docx' },
      odt:      { name: 'OpenWorkbook Text', ext: 'odt' },
      html:     { name: 'HTML Workbook', ext: 'html' },
      markdown: { name: 'Markdown', ext: 'md' },
      txt:      { name: 'Plain Text', ext: 'txt' },
      xml:      { name: 'XML Workbook', ext: 'xml' },
      json:     { name: 'JSON', ext: 'json' },
      epub:     { name: 'EPUB eBook', ext: 'epub' },
    };

    const filter = filterMap[format];
    if (!filter) return false;

    const path = await FileStorageEngine.showSaveDialog(
      `${this.currentFile.name}.${filter.ext}`,
      [{ name: filter.name, extensions: [filter.ext] }]
    );
    if (!path) return false;

    const content = this.getWorkbookContent();
    const result = await FileStorageEngine.writeFile(path, content, 'local');
    if (result.success) this.emit('file:exported', { path, format });
    return result.success;
  }

  // ── Import ──────────────────────────────────────────────────────────

  async importFrom(format: string): Promise<boolean> {
    FilePermissionEngine.require('import');

    const filterMap: Record<string, { name: string; extensions: string[] }> = {
      docx:     { name: 'Excel Workbook', extensions: ['docx', 'doc'] },
      odt:      { name: 'OpenWorkbook Text', extensions: ['odt'] },
      rtf:      { name: 'Rich Text Format', extensions: ['rtf'] },
      html:     { name: 'HTML Workbook', extensions: ['html', 'htm'] },
      markdown: { name: 'Markdown', extensions: ['md', 'markdown'] },
      txt:      { name: 'Plain Text', extensions: ['txt'] },
      xml:      { name: 'XML Workbook', extensions: ['xml'] },
      json:     { name: 'JSON', extensions: ['json'] },
      pdf:      { name: 'PDF Workbook', extensions: ['pdf'] },
    };

    const filter = filterMap[format];
    const path = await FileStorageEngine.showOpenDialog(filter ? [filter] : undefined);
    if (!path) return false;

    // Special handling for PDF: read as binary via File API and extract text
    if (format === 'pdf') {
      try {
        // Try to get the actual File object from browser cache
        const cached = (FileStorageEngine as any)._browserFileCache?.get(path);
        const file: File | null = cached?.file || null;

        if (file) {
          // Use PDF.js CDN to extract text (dynamically imported)
          const pdfjsLib = await this._loadPdfJs();
          if (pdfjsLib) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getWorkbook({ data: arrayBuffer }).promise;
            let allText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items.map((item: any) => item.str).join(' ');
              allText += pageText + '\n\n';
            }
            if (allText.trim()) {
              EditorAPI.getLegacy()?.insertTextAtSelection?.(allText.trim());
              this.emit('file:imported', { path, format });
              return true;
            }
          }
        }

        // Fallback: IPC-based text extraction
        const ipc = (window as any).ipc || (window as any).electronAPI;
        if (ipc?.invoke) {
          try {
            const text = await ipc.invoke('pdf:extractText', path);
            if (text) {
              EditorAPI.getLegacy()?.insertTextAtSelection?.(text);
              this.emit('file:imported', { path, format });
              return true;
            }
          } catch {}
        }

        // Last resort: show friendly error instead of freezing
        alert('Không thể đọc nội dung file PDF này. Vui lòng thử file PDF khác hoặc chuyển đổi sang .xlsx trước.');
        return false;
      } catch (err: any) {
        console.error('PDF import error:', err);
        alert('Lỗi khi đọc file PDF: ' + (err?.message || 'Unknown error'));
        return false;
      }
    }

    // For non-PDF formats, read as text normally
    const result = await FileStorageEngine.readFile(path, 'local');
    if (!result.success) {
      this.emit('file:error', result.error);
      return false;
    }

    if (result.data) {
      EditorAPI.getLegacy()?.insertTextAtSelection?.(result.data);
    }
    this.emit('file:imported', { path, format });
    return true;
  }

  /** Dynamically load PDF.js from CDN */
  private async _loadPdfJs(): Promise<any> {
    try {
      if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
      return await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          const lib = (window as any).pdfjsLib;
          if (lib) lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib || null);
        };
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
      });
    } catch {
      return null;
    }
  }

  // ── Print ────────────────────────────────────────────────────────────

  print(): void {
    FilePermissionEngine.require('print');
    document.dispatchEvent(new CustomEvent('officex:open-print-menu'));
    this.emit('file:exported', { format: 'print' });
  }

  // ── Exit ─────────────────────────────────────────────────────────────

  async exit(): Promise<void> {
    if (this.currentFile?.isModified) {
      // In a real app, prompt the user
      // For now, we'll auto-save
      await this.save();
    }
    const ipc = (window as any).ipc;
    if (ipc) {
      await ipc.invoke('window-close');
    }
  }

  async forceExit(): Promise<void> {
    const ipc = (window as any).ipc;
    if (ipc) {
      await ipc.invoke('window-close');
    }
  }

  async saveAllAndExit(): Promise<void> {
    await this.saveAll();
    return this.exit();
  }

  // ── File Operations ──────────────────────────────────────────────────

  async rename(newName: string): Promise<boolean> {
    if (!this.currentFile) return false;
    FilePermissionEngine.require('rename', this.currentFile.WorkbookId);
    const old = this.currentFile.name;
    this.currentFile.name = newName;
    this.currentFile.title = newName;
    this.emit('file:renamed', { old, newName });
    return true;
  }

  async duplicate(): Promise<boolean> {
    if (!this.currentFile) return false;
    return this.saveCopy();
  }

  async revealInExplorer(): Promise<void> {
    if (this.currentFile?.path) {
      await FileStorageEngine.revealInExplorer(this.currentFile.path);
    }
  }

  // ── Properties ──────────────────────────────────────────────────────

  updateProperties(props: Partial<Pick<FileInfo, 'title' | 'author' | 'subject' | 'keyExcels' | 'company' | 'category' | 'tags' | 'path' | 'name'>>) {
    if (this.currentFile) {
      Object.assign(this.currentFile, props);
      this.emit('file:renamed', this.currentFile);
    }
  }

  getFileInfo(): FileInfo | null {
    if (!this.currentFile) return null;
    // Update Excel/char counts from editor
    const api = EditorAPI.getLegacy();
    const text = api?.getSelectedText?.() ?? '';
    return {
      ...this.currentFile,
      ExcelCount: text ? text.split(/\s+/).filter(Boolean).length : this.currentFile.ExcelCount,
      charCount: text ? text.length : this.currentFile.charCount,
    };
  }

  // ── Security ─────────────────────────────────────────────────────────

  setReadOnly(enabled: boolean) {
    if (!this.currentFile) return;
    this.currentFile.isReadOnly = enabled;
    FilePermissionEngine.setReadOnly(this.currentFile.WorkbookId, enabled);
  }

  setProtected(enabled: boolean) {
    if (!this.currentFile) return;
    this.currentFile.isProtected = enabled;
    FilePermissionEngine.setProtected(this.currentFile.WorkbookId, enabled);
  }

  // ── Auto Save Config ─────────────────────────────────────────────────

  enableAutoSave() { FileStorageEngine.enableAutoSave(() => this.autoSave()); }
  disableAutoSave() { FileStorageEngine.disableAutoSave(); }
  setAutoSaveInterval(ms: number) { FileStorageEngine.setAutoSaveInterval(ms); }
  isAutoSaveEnabled() { return FileStorageEngine.isAutoSaveEnabled(); }

  // ── Version / Recovery ───────────────────────────────────────────────

  getVersions() {
    return this.currentFile ? FileRecoveryEngine.getVersions(this.currentFile.WorkbookId) : [];
  }

  async restoreVersion(versionId: string): Promise<boolean> {
    const ver = FileRecoveryEngine.getVersion(versionId);
    if (!ver) return false;
    EditorAPI.getLegacy()?.insertTextAtSelection?.(ver.content);
    this.emit('version:restored', ver);
    return true;
  }

  getRecoveryPoints() {
    return this.currentFile ? FileRecoveryEngine.getRecoveryPoints(this.currentFile.WorkbookId) : [];
  }

  async restoreRecoveryPoint(id: string): Promise<boolean> {
    const points = this.getRecoveryPoints();
    const point = points.find(p => p.id === id);
    if (!point) return false;
    EditorAPI.getLegacy()?.insertTextAtSelection?.(point.content);
    this.emit('file:recovery', point);
    return true;
  }

  // ── Helpers ──────────────────────────────────────────────────────────

  getWorkbookContent(targetPath?: string): string {
    const target = targetPath || this.currentFile?.path || '';
    if (this._dataProvider) {
      return this._dataProvider(target);
    }
    const legacy = EditorAPI.getLegacy();
    if (legacy?.getFullWorkbookText) {
      return legacy.getFullWorkbookText();
    }
    return legacy?.getSelectedText?.() ?? '';
  }

  getPagesData(): { doc: any, layout: any, pages: any[] } | null {
    const legacy = EditorAPI.getLegacy();
    return legacy?.getPagesData?.() || null;
  }
}

export const FileEngine = new FileEngineImpl();
