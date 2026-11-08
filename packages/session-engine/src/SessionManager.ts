// ─────────────────────────────────────────────────────────────────────────────
// Session Manager — Central orchestrator for Session Engine
// Ref: SESSION_ENGINE.md §4, §5, §13
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Session,
  SessionDocument,
  WindowLayout,
  Workspace,
  SessionPreferences,
  WorkspaceType,
} from './models/Session';
import { RecentFilesManager } from './RecentFilesManager';
import { SessionStorageManager } from './SessionStorageManager';

function generateId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_PREFERENCES: SessionPreferences = {
  theme: 'system',
  language: 'en-US',
  defaultZoom: 1.0,
  defaultViewMode: 'print',
  accessibilityHighContrast: false,
  restoreOnStartup: true,
  maxRecentFiles: 50,
};

const DEFAULT_WORKSPACE: Workspace = {
  id: 'default',
  name: 'Default Workspace',
  type: 'editing',
  windowLayouts: [],
  activeWindowId: undefined,
};

// ─── Session Manager ──────────────────────────────────────────────────────────

export class SessionManager {
  private session: Session;
  readonly recentFiles: RecentFilesManager;
  private readonly storage: SessionStorageManager;

  constructor() {
    this.recentFiles = new RecentFilesManager();
    this.storage = new SessionStorageManager(
      typeof localStorage !== 'undefined' ? 'localStorage' : 'memory'
    );
    this.session = this._createBlankSession();
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  /** Start a new session, restoring from storage if configured */
  start(): void {
    if (this.session.preferences.restoreOnStartup) {
      const restored = this.restore();
      if (restored) return;
    }
    this.session = this._createBlankSession();
  }

  /** Persist current session to storage */
  save(): void {
    this.storage.save(this.session);
  }

  /** Restore session from storage — returns true if successful */
  restore(): boolean {
    const saved = this.storage.load();
    if (!saved) return false;
    this.session = saved;
    this.recentFiles.hydrate(this.recentFiles.serialize()); // rehydrate recent files
    return true;
  }

  /** End session and optionally clear storage */
  end(persist = true): void {
    if (persist) this.save();
    else this.storage.clear();
  }

  // ─── Document Tracking ──────────────────────────────────────────────────────

  openDocument(doc: Omit<SessionDocument, 'openedAt'>): void {
    const existing = this.session.openDocuments.find(
      (d) => d.documentId === doc.documentId
    );
    if (!existing) {
      this.session.openDocuments.push({ ...doc, openedAt: Date.now() });
    }
    this.session.activeDocumentId = doc.documentId;
  }

  closeDocument(documentId: string): void {
    this.session.openDocuments = this.session.openDocuments.filter(
      (d) => d.documentId !== documentId
    );
    // Update active to the last remaining document
    if (this.session.activeDocumentId === documentId) {
      const last = this.session.openDocuments.at(-1);
      this.session.activeDocumentId = last?.documentId;
    }
  }

  markDocumentUnsaved(documentId: string, unsaved: boolean): void {
    const doc = this.session.openDocuments.find((d) => d.documentId === documentId);
    if (doc) doc.isUnsaved = unsaved;
  }

  getOpenDocuments(): SessionDocument[] {
    return this.session.openDocuments;
  }

  getActiveDocumentId(): string | undefined {
    return this.session.activeDocumentId;
  }

  hasUnsavedDocuments(): boolean {
    return this.session.openDocuments.some((d) => d.isUnsaved);
  }

  // ─── Window Layout ──────────────────────────────────────────────────────────

  saveWindowLayout(layout: WindowLayout): void {
    const idx = this.session.workspace.windowLayouts.findIndex(
      (w) => w.windowId === layout.windowId
    );
    if (idx >= 0) {
      this.session.workspace.windowLayouts[idx] = layout;
    } else {
      this.session.workspace.windowLayouts.push(layout);
    }
  }

  removeWindowLayout(windowId: string): void {
    this.session.workspace.windowLayouts =
      this.session.workspace.windowLayouts.filter((w) => w.windowId !== windowId);
  }

  getWindowLayouts(): WindowLayout[] {
    return this.session.workspace.windowLayouts;
  }

  setActiveWindow(windowId: string): void {
    this.session.workspace.activeWindowId = windowId;
  }

  // ─── Workspace ──────────────────────────────────────────────────────────────

  switchWorkspace(type: WorkspaceType, name?: string): void {
    this.session.workspace = {
      ...this.session.workspace,
      type,
      name: name ?? type,
    };
  }

  getWorkspace(): Workspace {
    return this.session.workspace;
  }

  // ─── Preferences ────────────────────────────────────────────────────────────

  getPreferences(): SessionPreferences {
    return this.session.preferences;
  }

  updatePreferences(patch: Partial<SessionPreferences>): void {
    this.session.preferences = { ...this.session.preferences, ...patch };
  }

  // ─── Temporary State ────────────────────────────────────────────────────────

  addSearchHistory(term: string): void {
    const history = this.session.temporaryState.searchHistory;
    const updated = [term, ...history.filter((h) => h !== term)].slice(0, 100);
    this.session.temporaryState.searchHistory = updated;
  }

  addNavigationHistory(path: string): void {
    const history = this.session.temporaryState.navigationHistory;
    const updated = [path, ...history.filter((h) => h !== path)].slice(0, 50);
    this.session.temporaryState.navigationHistory = updated;
  }

  clearTemporaryState(): void {
    this.session.temporaryState = {
      searchHistory: [],
      navigationHistory: [],
      clipboardHistoryRefs: [],
    };
  }

  // ─── Diagnostics ────────────────────────────────────────────────────────────

  getSessionId(): string {
    return this.session.sessionId;
  }

  getSnapshot(): Session {
    return { ...this.session };
  }

  isActive(): boolean {
    return !!this.session.sessionId;
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private _createBlankSession(): Session {
    return {
      sessionId: generateId(),
      openDocuments: [],
      workspace: { ...DEFAULT_WORKSPACE },
      preferences: { ...DEFAULT_PREFERENCES },
      temporaryState: {
        searchHistory: [],
        navigationHistory: [],
        clipboardHistoryRefs: [],
      },
      createdAt: Date.now(),
      savedAt: Date.now(),
      metadata: {
        appVersion: '1.0.0',
        platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
      },
    };
  }
}
