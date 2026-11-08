/**
 * FilePermissionEngine.ts
 *
 * Enterprise Permission Engine for File Operations.
 * All file commands must pass permission checks before execution.
 */

export type FilePermission =
  | 'read'
  | 'write'
  | 'delete'
  | 'rename'
  | 'share'
  | 'print'
  | 'export'
  | 'import'
  | 'encrypt'
  | 'version'
  | 'recovery'
  | 'admin';

export interface FilePermissionContext {
  documentId?: string;
  filePath?: string;
  isReadOnly?: boolean;
  isProtected?: boolean;
  isEncrypted?: boolean;
  ownerOnly?: boolean;
}

export interface PermissionResult {
  granted: boolean;
  reason?: string;
}

class FilePermissionEngineImpl {
  private grantedPermissions: Set<FilePermission> = new Set();
  private documentContext: Map<string, FilePermissionContext> = new Map();

  constructor() {
    // Default: grant all standard permissions for local user
    this.grantedPermissions = new Set([
      'read', 'write', 'delete', 'rename', 'share',
      'print', 'export', 'import', 'version', 'recovery', 'admin'
    ]);
  }

  setDocumentContext(documentId: string, ctx: FilePermissionContext) {
    this.documentContext.set(documentId, ctx);
  }

  getDocumentContext(documentId: string): FilePermissionContext {
    return this.documentContext.get(documentId) ?? {};
  }

  check(permission: FilePermission, documentId?: string): PermissionResult {
    if (!this.grantedPermissions.has(permission)) {
      return { granted: false, reason: `Permission '${permission}' not granted.` };
    }
    if (documentId) {
      const ctx = this.documentContext.get(documentId) ?? {};
      if (ctx.isReadOnly && (permission === 'write' || permission === 'delete' || permission === 'rename')) {
        return { granted: false, reason: 'Document is read-only.' };
      }
      if (ctx.isProtected && permission === 'write') {
        return { granted: false, reason: 'Document is protected. Remove protection to edit.' };
      }
      if (ctx.isEncrypted && permission !== 'read' && permission !== 'admin') {
        return { granted: false, reason: 'Cannot modify encrypted document without decryption.' };
      }
    }
    return { granted: true };
  }

  require(permission: FilePermission, documentId?: string): void {
    const result = this.check(permission, documentId);
    if (!result.granted) throw new Error(result.reason ?? `Permission '${permission}' denied.`);
  }

  grant(permission: FilePermission) { this.grantedPermissions.add(permission); }
  revoke(permission: FilePermission) { this.grantedPermissions.delete(permission); }

  setReadOnly(documentId: string, readOnly: boolean) {
    const ctx = this.documentContext.get(documentId) ?? {};
    this.documentContext.set(documentId, { ...ctx, isReadOnly: readOnly });
  }

  setProtected(documentId: string, isProtected: boolean) {
    const ctx = this.documentContext.get(documentId) ?? {};
    this.documentContext.set(documentId, { ...ctx, isProtected });
  }
}

export const FilePermissionEngine = new FilePermissionEngineImpl();
