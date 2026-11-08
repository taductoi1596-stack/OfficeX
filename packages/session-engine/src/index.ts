// @officex/session-engine — Public API
export type {
  Session,
  SessionDocument,
  WindowLayout,
  WindowState,
  Workspace,
  WorkspaceType,
  RecentFile,
  SessionPreferences,
  TemporaryState,
} from './models/Session';

export { RecentFilesManager } from './RecentFilesManager';

export { SessionStorageManager } from './SessionStorageManager';
export type { StorageBackend } from './SessionStorageManager';

export { SessionManager } from './SessionManager';
