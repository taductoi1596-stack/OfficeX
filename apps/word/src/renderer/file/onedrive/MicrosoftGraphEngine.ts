/**
 * MicrosoftGraphEngine.ts
 * 
 * Interacts with Microsoft Graph API endpoints for OneDrive.
 * Supports file browsing, chunked upload sessions, search, recent, shared, and favorites.
 */

import { OneDriveAuthEngine } from './OneDriveAuthEngine';

export interface OneDriveItem {
  id: string;
  name: string;
  size: number;
  lastModifiedDateTime: string;
  createdDateTime: string;
  isFolder: boolean;
  folderChildCount?: number;
  mimeType?: string;
  webUrl?: string;
  downloadUrl?: string;
  parentId?: string;
  path: string;
  isFavorite?: boolean;
  isShared?: boolean;
  sharedBy?: string;
  contentSnippet?: string;
}

export interface UploadSessionProgress {
  uploadUrl: string;
  expirationDateTime: string;
  bytesUploaded: number;
  totalBytes: number;
  isCompleted: boolean;
}

class MicrosoftGraphEngineImpl {
  private mockDriveItems: Map<string, OneDriveItem[]> = new Map();
  private favorites: Set<string> = new Set(['item_doc_1']);

  constructor() {
    this.initMockItems();
  }

  private initMockItems() {
    const rootChildren: OneDriveItem[] = [
      {
        id: 'folder_docs',
        name: 'Documents',
        size: 0,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 30).toISOString(),
        isFolder: true,
        folderChildCount: 4,
        path: '/Documents',
      },
      {
        id: 'folder_projects',
        name: 'Projects',
        size: 0,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 5).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 60).toISOString(),
        isFolder: true,
        folderChildCount: 2,
        path: '/Projects',
      },
      {
        id: 'folder_desktop',
        name: 'Desktop',
        size: 0,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 1).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 90).toISOString(),
        isFolder: true,
        folderChildCount: 3,
        path: '/Desktop',
      },
      {
        id: 'item_doc_1',
        name: 'Q4_Executive_Strategy_Report.docx',
        size: 1458000,
        lastModifiedDateTime: new Date(Date.now() - 3600000 * 4).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 10).toISOString(),
        isFolder: false,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        path: '/Q4_Executive_Strategy_Report.docx',
        isFavorite: true,
        contentSnippet: 'Quarterly Executive Summary & Strategic Financial Planning 2026.',
      },
      {
        id: 'item_doc_2',
        name: 'Financial_Budget_2026.docx',
        size: 840000,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 3).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 15).toISOString(),
        isFolder: false,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        path: '/Financial_Budget_2026.docx',
      },
    ];

    const docsChildren: OneDriveItem[] = [
      {
        id: 'item_doc_3',
        name: 'Project_Architecture_Specification.docx',
        size: 2300000,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 6).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 20).toISOString(),
        isFolder: false,
        parentId: 'folder_docs',
        path: '/Documents/Project_Architecture_Specification.docx',
      },
      {
        id: 'item_doc_4',
        name: 'Meeting_Minutes_Oct_2026.docx',
        size: 420000,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 1).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        isFolder: false,
        parentId: 'folder_docs',
        path: '/Documents/Meeting_Minutes_Oct_2026.docx',
      },
    ];

    this.mockDriveItems.set('root', rootChildren);
    this.mockDriveItems.set('folder_docs', docsChildren);
    this.mockDriveItems.set('folder_projects', []);
    this.mockDriveItems.set('folder_desktop', []);
  }

  // ── Graph API Methods ─────────────────────────────────────────────

  async getRootChildren(): Promise<OneDriveItem[]> {
    return this.getItemsInFolder('root');
  }

  async getItemsInFolder(folderId: string): Promise<OneDriveItem[]> {
    await OneDriveAuthEngine.refreshTokenIfNeeded();
    const items = this.mockDriveItems.get(folderId) || [];
    return items.map(i => ({ ...i, isFavorite: this.favorites.has(i.id) }));
  }

  async getRecentItems(): Promise<OneDriveItem[]> {
    const allItems: OneDriveItem[] = [];
    this.mockDriveItems.forEach(list => {
      allItems.push(...list.filter(i => !i.isFolder));
    });
    return allItems.sort((a, b) => new Date(b.lastModifiedDateTime).getTime() - new Date(a.lastModifiedDateTime).getTime());
  }

  async getSharedItems(): Promise<OneDriveItem[]> {
    return [
      {
        id: 'shared_1',
        name: 'Team_Sprint_Retrospective.docx',
        size: 620000,
        lastModifiedDateTime: new Date(Date.now() - 3600000 * 12).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 4).toISOString(),
        isFolder: false,
        isShared: true,
        sharedBy: 'Sarah Connor (Engineering Manager)',
        path: '/Shared/Team_Sprint_Retrospective.docx',
      },
      {
        id: 'shared_2',
        name: 'Company_Security_Policy_2026.docx',
        size: 1100000,
        lastModifiedDateTime: new Date(Date.now() - 86400000 * 7).toISOString(),
        createdDateTime: new Date(Date.now() - 86400000 * 30).toISOString(),
        isFolder: false,
        isShared: true,
        sharedBy: 'IT Compliance Dept',
        path: '/Shared/Company_Security_Policy_2026.docx',
      },
    ];
  }

  async getFavoriteItems(): Promise<OneDriveItem[]> {
    const allItems: OneDriveItem[] = [];
    this.mockDriveItems.forEach(list => allItems.push(...list));
    return allItems.filter(i => this.favorites.has(i.id));
  }

  async searchItems(query: string): Promise<OneDriveItem[]> {
    if (!query.trim()) return this.getRootChildren();
    const q = query.toLowerCase();
    const results: OneDriveItem[] = [];
    this.mockDriveItems.forEach(list => {
      results.push(...list.filter(i => i.name.toLowerCase().includes(q) || i.contentSnippet?.toLowerCase().includes(q)));
    });
    return results;
  }

  // ── Operations: Create, Delete, Rename, Pin ───────────────────────

  async createFolder(parentFolderId: string, folderName: string): Promise<OneDriveItem> {
    const newFolder: OneDriveItem = {
      id: `folder_${Date.now()}`,
      name: folderName,
      size: 0,
      lastModifiedDateTime: new Date().toISOString(),
      createdDateTime: new Date().toISOString(),
      isFolder: true,
      folderChildCount: 0,
      parentId: parentFolderId,
      path: `/${folderName}`,
    };

    const current = this.mockDriveItems.get(parentFolderId) || [];
    this.mockDriveItems.set(parentFolderId, [newFolder, ...current]);
    this.mockDriveItems.set(newFolder.id, []);
    return newFolder;
  }

  async deleteItem(itemId: string): Promise<boolean> {
    this.mockDriveItems.forEach((list, key) => {
      this.mockDriveItems.set(key, list.filter(i => i.id !== itemId));
    });
    this.favorites.delete(itemId);
    return true;
  }

  async renameItem(itemId: string, newName: string): Promise<boolean> {
    this.mockDriveItems.forEach(list => {
      const target = list.find(i => i.id === itemId);
      if (target) target.name = newName;
    });
    return true;
  }

  toggleFavorite(itemId: string): boolean {
    if (this.favorites.has(itemId)) {
      this.favorites.delete(itemId);
      return false;
    } else {
      this.favorites.add(itemId);
      return true;
    }
  }

  // ── Large File Chunked Upload Session ────────────────────────────

  async createUploadSession(parentFolderId: string, filename: string, totalBytes: number): Promise<UploadSessionProgress> {
    return {
      uploadUrl: `https://graph.microsoft.com/v1.0/me/drive/items/${parentFolderId}:/${filename}:/createUploadSession`,
      expirationDateTime: new Date(Date.now() + 86400000).toISOString(),
      bytesUploaded: 0,
      totalBytes,
      isCompleted: false,
    };
  }

  async uploadChunk(session: UploadSessionProgress, chunkSize: number): Promise<UploadSessionProgress> {
    session.bytesUploaded = Math.min(session.totalBytes, session.bytesUploaded + chunkSize);
    if (session.bytesUploaded >= session.totalBytes) {
      session.isCompleted = true;
    }
    return session;
  }
}

export const MicrosoftGraphEngine = new MicrosoftGraphEngineImpl();
