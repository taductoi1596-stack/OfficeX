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
  WorkbookId?: string;
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
  private WorkbookContext: Map<string, FilePermissionContext> = new Map();

  constructor() {
    // Default: grant all standard permissions for local user
    this.grantedPermissions = new Set([
      'read', 'write', 'delete', 'rename', 'share',
      'print', 'export', 'import', 'version', 'recovery', 'admin'
    ]);
  }

  setWorkbookContext(WorkbookId: string, ctx: FilePermissionContext) {
    this.WorkbookContext.set(WorkbookId, ctx);
  }

  getWorkbookContext(WorkbookId: string): FilePermissionContext {
    return this.WorkbookContext.get(WorkbookId) ?? {};
  }

  check(permission: FilePermission, WorkbookId?: string): PermissionResult {
    if (!this.grantedPermissions.has(permission)) {
      return { granted: false, reason: `Permission '${permission}' not granted.` };
    }
    if (WorkbookId) {
      const ctx = this.WorkbookContext.get(WorkbookId) ?? {};
      if (ctx.isReadOnly && (permission === 'write' || permission === 'delete' || permission === 'rename')) {
        return { granted: false, reason: 'Workbook is read-only.' };
      }
      if (ctx.isProtected && permission === 'write') {
        return { granted: false, reason: 'Workbook is protected. Remove protection to edit.' };
      }
      if (ctx.isEncrypted && permission !== 'read' && permission !== 'admin') {
        return { granted: false, reason: 'Cannot modify encrypted Workbook without decryption.' };
      }
    }
    return { granted: true };
  }

  require(permission: FilePermission, WorkbookId?: string): void {
    const result = this.check(permission, WorkbookId);
    if (!result.granted) throw new Error(result.reason ?? `Permission '${permission}' denied.`);
  }

  grant(permission: FilePermission) { this.grantedPermissions.add(permission); }
  revoke(permission: FilePermission) { this.grantedPermissions.delete(permission); }

  setReadOnly(WorkbookId: string, readOnly: boolean) {
    const ctx = this.WorkbookContext.get(WorkbookId) ?? {};
    this.WorkbookContext.set(WorkbookId, { ...ctx, isReadOnly: readOnly });
  }

  setProtected(WorkbookId: string, isProtected: boolean) {
    const ctx = this.WorkbookContext.get(WorkbookId) ?? {};
    this.WorkbookContext.set(WorkbookId, { ...ctx, isProtected });
  }
}

export const FilePermissionEngine = new FilePermissionEngineImpl();
