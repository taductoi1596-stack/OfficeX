// ─────────────────────────────────────────────────────────────────────────────
// Session Engine — Core Data Models
// Ref: SESSION_ENGINE.md §6-§16
// ─────────────────────────────────────────────────────────────────────────────

// ─── Window State ─────────────────────────────────────────────────────────────

export type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen';

export interface WindowLayout {
  windowId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: WindowState;
  /** Monitor index (for multi-monitor support) */
  monitorIndex: number;
  /** DPI scale of the monitor at save time */
  dpiScale: number;
  /** Whether the sidebar is visible */
  sidebarVisible: boolean;
  /** Ribbon state: collapsed or expanded */
  ribbonCollapsed: boolean;
  /** Current zoom level (e.g. 1.0 = 100%) */
  zoomLevel: number;
}

// ─── Open Document Entry ──────────────────────────────────────────────────────

export interface SessionDocument {
  documentId: string;
  filePath?: string;
  title: string;
  isUnsaved: boolean;
  /** Last known scroll position (for viewport restore) */
  scrollTop: number;
  scrollLeft: number;
  /** App type that owns this document */
  appType: 'word' | 'excel' | 'powerpoint';
  openedAt: number;
}

// ─── Workspace ────────────────────────────────────────────────────────────────

export type WorkspaceType =
  | 'editing'
  | 'presentation'
  | 'spreadsheet'
  | 'multi-document'
  | 'custom'
  | 'organization';

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  windowLayouts: WindowLayout[];
  activeWindowId?: string;
}

// ─── Recent File Entry ────────────────────────────────────────────────────────

export interface RecentFile {
  id: string;
  filePath: string;
  title: string;
  appType: 'word' | 'excel' | 'powerpoint';
  lastOpenedAt: number;
  isPinned: boolean;
  isCloud: boolean;
  /** Cloud storage URI (e.g. OneDrive, SharePoint) */
  cloudUri?: string;
}

// ─── User Preferences ─────────────────────────────────────────────────────────

export interface SessionPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  defaultZoom: number;
  defaultViewMode: 'print' | 'web' | 'outline';
  accessibilityHighContrast: boolean;
  /** Whether to restore last session on startup */
  restoreOnStartup: boolean;
  /** Max number of recent files to retain */
  maxRecentFiles: number;
}

// ─── Temporary State ──────────────────────────────────────────────────────────

export interface TemporaryState {
  searchHistory: string[];
  navigationHistory: string[];
  clipboardHistoryRefs: string[];
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface Session {
  sessionId: string;
  userId?: string;
  openDocuments: SessionDocument[];
  activeDocumentId?: string;
  workspace: Workspace;
  preferences: SessionPreferences;
  temporaryState: TemporaryState;
  createdAt: number;
  savedAt: number;
  metadata: {
    appVersion: string;
    platform: string;
  };
}
