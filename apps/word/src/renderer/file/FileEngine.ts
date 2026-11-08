/**
 * FileEngine.ts
 *
 * Enterprise File Engine for OfficeX Word.
 * Central orchestrator for all file operations.
 * All UI must go through this engine via CommandDispatcher → FileCommandRegistry → FileEngine.
 */

import { FilePermissionEngine } from './FilePermissionEngine';
import { FileStorageEngine, StorageProvider } from './FileStorageEngine';
import { FileRecoveryEngine } from './FileRecoveryEngine';
import { EditorAPI } from '../editorApi';
import { DocxParser } from './DocxParser';

export interface FileInfo {
  documentId: string;
  name: string;
  path: string | null;
  provider: StorageProvider;
  isModified: boolean;
  isReadOnly: boolean;
  isProtected: boolean;
  wordCount: number;
  pageCount: number;
  charCount: number;
  size: number;
  created: Date;
  modified: Date;
  author: string;
  title: string;
  subject: string;
  keywords: string;
  company: string;
  category: string;
  tags: string[];
}

export type FileEvent =
  | 'file:new' | 'file:opened' | 'file:closed' | 'file:saved'
  | 'file:exported' | 'file:imported' | 'file:renamed' | 'file:deleted'
  | 'file:recovery' | 'version:created' | 'version:restored'
  | 'autosave:triggered' | 'file:error' | 'file:modified';

class FileEngineImpl {
  private currentFile: FileInfo | null = null;
  private listeners: Map<FileEvent, Array<(data?: any) => void>> = new Map();
  private _docId = `doc_${Date.now()}`;

  // ── Init ────────────────────────────────────────────────────────────

  initialize() {
    // Mark this document as open (crash detection)
    FileRecoveryEngine.markDocumentOpen(this._docId);

    // Enable auto-save
    FileStorageEngine.enableAutoSave(() => {
      this.autoSave();
    });

    this.currentFile = {
      documentId: this._docId,
      name: 'Document 1',
      path: null,
      provider: 'local',
      isModified: false,
      isReadOnly: false,
      isProtected: false,
      wordCount: 0,
      pageCount: 1,
      charCount: 0,
      size: 0,
      created: new Date(),
      modified: new Date(),
      author: 'User',
      title: 'Document 1',
      subject: '',
      keywords: '',
      company: '',
      category: '',
      tags: [],
    };

    // Check for unrecovered documents on startup
    const unrecovered = FileRecoveryEngine.getUnrecoveredDocuments();
    if (unrecovered.length > 0) {
      console.log(`[FileEngine] Found ${unrecovered.length} unrecovered document(s).`);
    }
  }

  dispose() {
    FileStorageEngine.disableAutoSave();
    if (this.currentFile) {
      FileRecoveryEngine.markDocumentClosed(this.currentFile.documentId);
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

  // ── New Document ────────────────────────────────────────────────────

  newDocument(type: 'blank' | 'default' | 'empty' = 'blank') {
    this._docId = `doc_${Date.now()}`;
    this.currentFile = {
      documentId: this._docId,
      name: 'Document 1',
      path: null,
      provider: 'local',
      isModified: false,
      isReadOnly: false,
      isProtected: false,
      wordCount: 0,
      pageCount: 1,
      charCount: 0,
      size: 0,
      created: new Date(),
      modified: new Date(),
      author: 'User',
      title: 'Document 1',
      subject: '',
      keywords: '',
      company: '',
      category: '',
      tags: [],
    };
    EditorAPI.getLegacy()?.clearDocument?.();
    if (type === 'default') {
      // Default template might have some predefined styles/text
    } else if (type === 'empty') {
      // Strictly empty
    }
    if (this.currentFile) {
      this.currentFile.isModified = false;
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
      { name: 'Word Documents', extensions: ['docx', 'doc', 'odt', 'rtf'] },
      { name: 'All Files', extensions: ['*'] },
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
        documentId: `doc_${Date.now()}`,
        name: result.file.name,
        path: path,
        title: result.file.name,
        subject: '',
        keywords: '',
        company: '',
        category: '',
        tags: [],
        size: result.file.size,
        created: new Date(),
        modified: result.file.modified,
        author: 'Tới Tạ',
        wordCount: 0,
        charCount: 0,
        pageCount: 1,
        isModified: false,
        isReadOnly: false,
        isProtected: false,
        provider: 'local',
      };
    }
    
    // Render content into editor canvas
    const legacy = EditorAPI.getLegacy();
    const fileData = result.data;

    try {
      if (fileData && typeof fileData === 'object' && fileData.isBinary) {
        if (fileData.fileType === 'docx') {
          const docModel = await DocxParser.parse(fileData.base64 || fileData.arrayBuffer);
          if (legacy?.setDocModel) {
            legacy.setDocModel(docModel);
          } else if (legacy?.setContent) {
            legacy.setContent(JSON.stringify(docModel));
          }
        } else if (fileData.fileType === 'pdf') {
          const text = await this.extractPdfText(path, fileData);
          if (text) {
            legacy?.setContent?.(text);
          } else {
            legacy?.setContent?.('[PDF Document: Không thể trích xuất văn bản từ tệp này]');
          }
        } else if (fileData.fileType === 'doc') {
          const text = fileData.text || '';
          if (text) {
            legacy?.setContent?.(text);
          } else {
            legacy?.setContent?.('[Word 97-2003 Document: Tệp định dạng nhị phân cũ]');
          }
        }
      } else if (typeof fileData === 'string') {
        const trimmed = fileData.trim();
        // Check if string is actually base64 DOCX or raw PK zip header
        if (fileData.startsWith('PK\x03\x04') || fileData.startsWith('UEsDB')) {
          try {
            const docModel = await DocxParser.parse(fileData);
            if (legacy?.setDocModel) legacy.setDocModel(docModel);
            else legacy?.setContent?.(JSON.stringify(docModel));
          } catch {
            legacy?.setContent?.(fileData);
          }
        } else if (trimmed.startsWith('{') && trimmed.includes('"paras"')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && Array.isArray(parsed.paras)) {
              if (legacy?.setDocModel) legacy.setDocModel(parsed);
              else legacy?.setContent?.(fileData);
            } else {
              legacy?.setContent?.(fileData);
            }
          } catch {
            legacy?.setContent?.(fileData);
          }
        } else {
          legacy?.setContent?.(fileData);
        }
      }
    } catch (err: any) {
      console.error('[FileEngine] Error rendering opened file:', err);
      if (typeof fileData === 'string') {
        legacy?.setContent?.(fileData);
      }
    }

    if (this.currentFile) {
      this.currentFile.isModified = false;
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
      FilePermissionEngine.setReadOnly(this.currentFile.documentId, true);
    }
    return ok;
  }

  async openAndRepair(): Promise<boolean> {
    const path = await FileStorageEngine.showOpenDialog([
      { name: 'Word Documents', extensions: ['docx', 'doc', 'odt', 'rtf'] },
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
    console.log(`[FileEngine] Opening Example Document...`);
    this.newDocument();
    EditorAPI.getLegacy()?.insertTextAtSelection?.('This is a sample document.');
    return true;
  }

  async openLastDocument(): Promise<boolean> {
    const recent = FileStorageEngine.getRecentFiles();
    if (recent.length > 0) {
      return this.openFromPath(recent[0].path);
    }
    return false;
  }

  async openStartupDocument(): Promise<boolean> {
    console.log(`[FileEngine] Opening Startup Document...`);
    return this.openLastDocument();
  }


  // ── Close ────────────────────────────────────────────────────────────

  // Đánh dấu document đã bị thay đổi (chưa lưu)
  markModified() {
    if (this.currentFile && !this.currentFile.isModified) {
      this.currentFile.isModified = true;
      this.emit('file:modified', this.currentFile);
    }
  }

  // Đặt lại trạng thái chưa chỉnh sửa (ví dụ khi mới mở file hoặc vừa lưu)
  resetModified() {
    if (this.currentFile) {
      this.currentFile.isModified = false;
      this.emit('file:saved', this.currentFile);
    }
  }

  isModified(): boolean {
    return this.currentFile?.isModified ?? false;
  }

  /**
   * Chỉ cần hỏi lưu khi document đã bị chỉnh sửa (isModified=true).
   * Trang trắng mới mở (path=null, isModified=false) → KHÔNG hỏi.
   * Mở file cũ chưa sửa (path có, isModified=false) → KHÔNG hỏi.
   */
  needsSavePrompt(): boolean {
    if (!this.currentFile) return false;
    return this.currentFile.isModified;
  }


  close(): boolean {
    // Không tự động lưu — UI sẽ hỏi người dùng nếu có thay đổi
    if (this.currentFile) {
      FileRecoveryEngine.markDocumentClosed(this.currentFile.documentId);
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
      FileRecoveryEngine.markDocumentClosed(this.currentFile.documentId);
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
      this.newDocument('blank');
    }
    if (!this.currentFile!.path) {
      return this.saveAs();
    }
    FilePermissionEngine.require('write', this.currentFile!.documentId);

    const content = this.getDocumentContent();
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
      this.newDocument('blank');
    }
    FilePermissionEngine.require('write');

    const defaultName = this.currentFile?.name || 'Document_1.docx';
    const path = await FileStorageEngine.showSaveDialog(defaultName, [
      { name: 'Word Document', extensions: ['docx'] },
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'Plain Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ]);
    if (!path) return false;

    const content = this.getDocumentContent();
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
      this.newDocument('blank');
    }
    const defaultName = `Copy_of_${this.currentFile?.name || 'Document_1.docx'}`;
    const path = await FileStorageEngine.showSaveDialog(defaultName);
    if (!path) return false;
    const content = this.getDocumentContent();
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
      pdf:      { name: 'PDF Document', ext: 'pdf' },
      docx:     { name: 'Word Document', ext: 'docx' },
      odt:      { name: 'OpenDocument Text', ext: 'odt' },
      html:     { name: 'HTML Document', ext: 'html' },
      markdown: { name: 'Markdown', ext: 'md' },
      txt:      { name: 'Plain Text', ext: 'txt' },
      xml:      { name: 'XML Document', ext: 'xml' },
    };
    
    const filter = filterMap[format];
    if (!filter) return false;

    const path = await FileStorageEngine.showSaveDialog(
      this.currentFile.name.replace(/\.[^/.]+$/, "") + "." + filter.ext,
      [{ name: filter.name, extensions: [filter.ext] }]
    );
    
    if (!path) return false;
    
    const content = format === 'txt' ? this.getFullDocumentText() : this.getDocumentContent();
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
    const content = this.getDocumentContent();
    const version = FileRecoveryEngine.createVersion(this.currentFile.documentId, content, label, comment);
    this.emit('version:created', version);
  }

  private async autoSave() {
    if (!this.currentFile || !this.currentFile.isModified) return;
    const content = this.getDocumentContent();
    FileRecoveryEngine.saveRecoveryPoint(
      this.currentFile.documentId,
      this.currentFile.name,
      content,
      'autosave'
    );
    this.emit('autosave:triggered', this.currentFile);
    console.log('[FileEngine] Auto-saved recovery point.');
  }

  // ── Export ──────────────────────────────────────────────────────────

  async exportAs(format: string): Promise<boolean> {
    if (!this.currentFile) return false;
    FilePermissionEngine.require('export');

    const filterMap: Record<string, { name: string; ext: string }> = {
      pdf:      { name: 'PDF Document', ext: 'pdf' },
      docx:     { name: 'Word Document', ext: 'docx' },
      odt:      { name: 'OpenDocument Text', ext: 'odt' },
      html:     { name: 'HTML Document', ext: 'html' },
      markdown: { name: 'Markdown', ext: 'md' },
      txt:      { name: 'Plain Text', ext: 'txt' },
      xml:      { name: 'XML Document', ext: 'xml' },
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

    const content = format === 'txt' ? this.getFullDocumentText() : this.getDocumentContent();
    const result = await FileStorageEngine.writeFile(path, content, 'local');
    if (result.success) this.emit('file:exported', { path, format });
    return result.success;
  }

  // ── Import ──────────────────────────────────────────────────────────

  async importFrom(format: string): Promise<boolean> {
    FilePermissionEngine.require('import');

    const filterMap: Record<string, { name: string; extensions: string[] }> = {
      docx:     { name: 'Word Document', extensions: ['docx', 'doc'] },
      odt:      { name: 'OpenDocument Text', extensions: ['odt'] },
      rtf:      { name: 'Rich Text Format', extensions: ['rtf'] },
      html:     { name: 'HTML Document', extensions: ['html', 'htm'] },
      markdown: { name: 'Markdown', extensions: ['md', 'markdown'] },
      txt:      { name: 'Plain Text', extensions: ['txt'] },
      xml:      { name: 'XML Document', extensions: ['xml'] },
      json:     { name: 'JSON', extensions: ['json'] },
      pdf:      { name: 'PDF Document', extensions: ['pdf'] },
    };

    const filter = filterMap[format];
    const path = await FileStorageEngine.showOpenDialog(filter ? [filter] : undefined);
    if (!path) return false;

    // Special handling for DOCX import
    if (format === 'docx') {
      const result = await FileStorageEngine.readFile(path, 'local');
      if (!result.success || !result.data) {
        this.emit('file:error', result.error);
        return false;
      }
      try {
        const raw = result.data;
        const input = (raw && typeof raw === 'object' && raw.isBinary) ? (raw.base64 || raw.arrayBuffer) : raw;
        const docModel = await DocxParser.parse(input);
        const legacy = EditorAPI.getLegacy();
        if (legacy) {
          for (const para of docModel.paras) {
            for (const run of para.runs) {
              if (run.fmt?.inlineImage) {
                legacy.insertImage?.(run.fmt.inlineImage, run.fmt.imageWidth || 400, run.fmt.imageHeight || 300);
              } else if (run.text) {
                legacy.insertTextAtSelection?.(run.text);
              }
            }
            legacy.insertTextAtSelection?.('\n');
          }
        }
        this.emit('file:imported', { path, format });
        return true;
      } catch (err: any) {
        console.error('[FileEngine] Error importing docx:', err);
        return false;
      }
    }

    // Special handling for PDF: read and extract text
    if (format === 'pdf') {
      try {
        const text = await this.extractPdfText(path);
        if (text) {
          EditorAPI.getLegacy()?.insertTextAtSelection?.(text);
          this.emit('file:imported', { path, format });
          return true;
        }
        alert('Không thể đọc nội dung file PDF này. Vui lòng thử file PDF khác hoặc chuyển đổi sang .docx trước.');
        return false;
      } catch (err: any) {
        console.error('PDF import error:', err);
        alert('Lỗi khi đọc file PDF: ' + (err?.message || 'Unknown error'));
        return false;
      }
    }

    // For non-PDF/non-DOCX formats, read as text normally
    const result = await FileStorageEngine.readFile(path, 'local');
    if (!result.success) {
      this.emit('file:error', result.error);
      return false;
    }

    if (result.data) {
      EditorAPI.getLegacy()?.insertTextAtSelection?.(typeof result.data === 'string' ? result.data : JSON.stringify(result.data));
    }
    this.emit('file:imported', { path, format });
    return true;
  }

  /** Shared helper to extract text from PDF via IPC or PDF.js */
  private async extractPdfText(path: string, fileData?: any): Promise<string> {
    // 1. Try IPC extraction
    const ipc = (window as any).ipc || (window as any).electronAPI;
    if (ipc && typeof ipc.invoke === 'function') {
      try {
        const text = await ipc.invoke('pdf:extractText', path);
        if (text && text.trim().length > 0) return text.trim();
      } catch {}
    }

    // 2. Try PDF.js CDN
    try {
      const pdfjsLib = await this._loadPdfJs();
      if (pdfjsLib) {
        let arrayBuffer = fileData?.arrayBuffer;
        if (!arrayBuffer && fileData?.base64) {
          const binaryString = atob(fileData.base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          arrayBuffer = bytes.buffer;
        }
        if (!arrayBuffer) {
          const cached = (FileStorageEngine as any)._browserFileCache?.get(path);
          if (cached?.file) {
            arrayBuffer = await cached.file.arrayBuffer();
          }
        }
        if (arrayBuffer) {
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let allText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(' ');
            allText += pageText + '\n\n';
          }
          if (allText.trim().length > 0) return allText.trim();
        }
      }
    } catch (e) {
      console.warn('[FileEngine] PDF.js extraction error:', e);
    }
    return '';
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
    FilePermissionEngine.require('rename', this.currentFile.documentId);
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

  updateProperties(props: Partial<Pick<FileInfo, 'title' | 'author' | 'subject' | 'keywords' | 'company' | 'category' | 'tags' | 'path' | 'name'>>) {
    if (this.currentFile) {
      Object.assign(this.currentFile, props);
      this.emit('file:renamed', this.currentFile);
    }
  }

  getFileInfo(): FileInfo | null {
    if (!this.currentFile) return null;
    // Update word/char counts from editor
    const api = EditorAPI.getLegacy();
    const text = api?.getSelectedText?.() ?? '';
    return {
      ...this.currentFile,
      wordCount: text ? text.split(/\s+/).filter(Boolean).length : this.currentFile.wordCount,
      charCount: text ? text.length : this.currentFile.charCount,
    };
  }

  // ── Security ─────────────────────────────────────────────────────────

  setReadOnly(enabled: boolean) {
    if (!this.currentFile) return;
    this.currentFile.isReadOnly = enabled;
    FilePermissionEngine.setReadOnly(this.currentFile.documentId, enabled);
  }

  setProtected(enabled: boolean) {
    if (!this.currentFile) return;
    this.currentFile.isProtected = enabled;
    FilePermissionEngine.setProtected(this.currentFile.documentId, enabled);
  }

  // ── Auto Save Config ─────────────────────────────────────────────────

  enableAutoSave() { FileStorageEngine.enableAutoSave(() => this.autoSave()); }
  disableAutoSave() { FileStorageEngine.disableAutoSave(); }
  setAutoSaveInterval(ms: number) { FileStorageEngine.setAutoSaveInterval(ms); }
  isAutoSaveEnabled() { return FileStorageEngine.isAutoSaveEnabled(); }

  // ── Version / Recovery ───────────────────────────────────────────────

  getVersions() {
    return this.currentFile ? FileRecoveryEngine.getVersions(this.currentFile.documentId) : [];
  }

  async restoreVersion(versionId: string): Promise<boolean> {
    const ver = FileRecoveryEngine.getVersion(versionId);
    if (!ver) return false;
    const legacy = EditorAPI.getLegacy();
    if (legacy?.setContent) {
      legacy.setContent(ver.content);
    } else {
      legacy?.insertTextAtSelection?.(ver.content);
    }
    this.emit('version:restored', ver);
    return true;
  }

  getRecoveryPoints() {
    return this.currentFile ? FileRecoveryEngine.getRecoveryPoints(this.currentFile.documentId) : [];
  }

  async restoreRecoveryPoint(id: string): Promise<boolean> {
    const points = this.getRecoveryPoints();
    const point = points.find(p => p.id === id);
    if (!point) return false;
    const legacy = EditorAPI.getLegacy();
    if (legacy?.setContent) {
      legacy.setContent(point.content);
    } else {
      legacy?.insertTextAtSelection?.(point.content);
    }
    this.emit('file:recovery', point);
    return true;
  }

  // ── Helpers ──────────────────────────────────────────────────────────

  getDocumentContent(): string {
    const legacy = EditorAPI.getLegacy();
    if (legacy?.getDocModel) {
      try {
        const model = legacy.getDocModel();
        if (model) return JSON.stringify(model);
      } catch {}
    }
    if (legacy?.getFullDocumentText) {
      return legacy.getFullDocumentText();
    }
    return legacy?.getSelectedText?.() ?? '';
  }

  getFullDocumentText(): string {
    const legacy = EditorAPI.getLegacy();
    if (legacy?.getFullDocumentText) {
      return legacy.getFullDocumentText();
    }
    if (legacy?.getDocModel) {
      try {
        const model = legacy.getDocModel();
        if (model?.paras) {
          return model.paras.map((p: any) => (p.runs || []).map((r: any) => r.text || '').join('')).join('\n');
        }
      } catch {}
    }
    return '';
  }

  getPagesData(): { doc: any, layout: any, pages: any[] } | null {
    const legacy = EditorAPI.getLegacy();
    return legacy?.getPagesData?.() || null;
  }
}

export const FileEngine = new FileEngineImpl();
if (typeof window !== 'undefined') {
  (window as any).FileEngine = FileEngine;
  (window as any).DocxParser = DocxParser;
}
