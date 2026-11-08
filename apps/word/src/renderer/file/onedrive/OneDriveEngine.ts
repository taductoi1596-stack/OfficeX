/**
 * OneDriveEngine.ts
 * 
 * Central Core Orchestrator Engine for Microsoft OneDrive Integration in OfficeX Word.
 * Coordinates AUTH_ENGINE, MICROSOFT_GRAPH_ENGINE, SYNC_ENGINE, and UI.
 */

import { OneDriveAuthEngine, MicrosoftUserProfile } from './OneDriveAuthEngine';
import { MicrosoftGraphEngine, OneDriveItem } from './MicrosoftGraphEngine';
import { OneDriveSyncEngine, SyncState } from './OneDriveSyncEngine';

export type OneDriveStatus = 'Connected' | 'Syncing' | 'Offline' | 'Uploading' | 'Downloading' | 'Conflict' | 'Auth_Required';

class SimpleEventEmitter {
  private listeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  on(event: string, fn: (...args: any[]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(fn);
  }

  off(event: string, fn: (...args: any[]) => void) {
    const list = this.listeners.get(event);
    if (list) {
      this.listeners.set(event, list.filter(l => l !== fn));
    }
  }

  emit(event: string, ...args: any[]) {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach(fn => fn(...args));
    }
  }
}

class OneDriveEngineImpl extends SimpleEventEmitter {
  private status: OneDriveStatus = 'Auth_Required';

  constructor() {
    super();
    this.updateStatus();
  }

  // ── Status Management ────────────────────────────────────────────────

  updateStatus(): OneDriveStatus {
    if (!OneDriveAuthEngine.isAuthenticated()) {
      this.status = 'Auth_Required';
    } else {
      const sync = OneDriveSyncEngine.getSyncState();
      if (sync === 'uploading') this.status = 'Uploading';
      else if (sync === 'downloading') this.status = 'Downloading';
      else if (sync === 'syncing') this.status = 'Syncing';
      else if (sync === 'conflict') this.status = 'Conflict';
      else if (sync === 'offline') this.status = 'Offline';
      else this.status = 'Connected';
    }
    this.emit('status:changed', this.status);
    return this.status;
  }

  getStatus(): OneDriveStatus {
    return this.updateStatus();
  }

  getUserProfile(): MicrosoftUserProfile | null {
    return OneDriveAuthEngine.getUserProfile();
  }

  // ── Command Actions Implementation ──────────────────────────────────

  async login(email?: string): Promise<boolean> {
    const res = await OneDriveAuthEngine.login(email || 'user@outlook.com', 'password123');
    this.updateStatus();
    if (res.success) {
      this.emit('login:success', res.profile);
    }
    return res.success;
  }

  async logout(): Promise<void> {
    await OneDriveAuthEngine.logout();
    this.updateStatus();
    this.emit('logout:success');
  }

  async openItem(item: OneDriveItem): Promise<boolean> {
    this.status = 'Downloading';
    this.emit('status:changed', this.status);

    const legacy = (window as any).EditorAPI?.getLegacy?.();
    const content = item.contentSnippet || `DOCUMENT OPENED FROM MICROSOFT ONEDRIVE\nFile: ${item.name}\nPath: ${item.path}\nSize: ${(item.size / 1024).toFixed(1)} KB\n\n1. Overview\nThis document is synced with Microsoft OneDrive cloud storage.\n\n2. Edits & Sync\nChanges made in OfficeX Word are auto-saved to OneDrive.`;

    if (legacy?.insertTextAtSelection) {
      legacy.insertTextAtSelection(content);
    }

    OneDriveSyncEngine.cacheDocument(item.id, item.name, content, item.path);
    this.status = 'Connected';
    this.emit('status:changed', this.status);
    this.emit('file:opened', item);
    return true;
  }

  async saveCurrentDocument(filename: string, content: string): Promise<boolean> {
    this.status = 'Uploading';
    this.emit('status:changed', this.status);

    await OneDriveSyncEngine.queueAutoSave(`file_${Date.now()}`, filename, content);
    this.status = 'Connected';
    this.emit('status:changed', this.status);
    return true;
  }
}

export const OneDriveEngine = new OneDriveEngineImpl();
