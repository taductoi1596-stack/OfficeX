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
  PresentationId?: string;
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
  private PresentationContext: Map<string, FilePermissionContext> = new Map();

  constructor() {
    // Default: grant all standard permissions for local user
    this.grantedPermissions = new Set([
      'read', 'write', 'delete', 'rename', 'share',
      'print', 'export', 'import', 'version', 'recovery', 'admin'
    ]);
  }

  setPresentationContext(PresentationId: string, ctx: FilePermissionContext) {
    this.PresentationContext.set(PresentationId, ctx);
  }

  getPresentationContext(PresentationId: string): FilePermissionContext {
    return this.PresentationContext.get(PresentationId) ?? {};
  }

  check(permission: FilePermission, PresentationId?: string): PermissionResult {
    if (!this.grantedPermissions.has(permission)) {
      return { granted: false, reason: `Permission '${permission}' not granted.` };
    }
    if (PresentationId) {
      const ctx = this.PresentationContext.get(PresentationId) ?? {};
      if (ctx.isReadOnly && (permission === 'write' || permission === 'delete' || permission === 'rename')) {
        return { granted: false, reason: 'Presentation is read-only.' };
      }
      if (ctx.isProtected && permission === 'write') {
        return { granted: false, reason: 'Presentation is protected. Remove protection to edit.' };
      }
      if (ctx.isEncrypted && permission !== 'read' && permission !== 'admin') {
        return { granted: false, reason: 'Cannot modify encrypted Presentation without decryption.' };
      }
    }
    return { granted: true };
  }

  require(permission: FilePermission, PresentationId?: string): void {
    const result = this.check(permission, PresentationId);
    if (!result.granted) throw new Error(result.reason ?? `Permission '${permission}' denied.`);
  }

  grant(permission: FilePermission) { this.grantedPermissions.add(permission); }
  revoke(permission: FilePermission) { this.grantedPermissions.delete(permission); }

  setReadOnly(PresentationId: string, readOnly: boolean) {
    const ctx = this.PresentationContext.get(PresentationId) ?? {};
    this.PresentationContext.set(PresentationId, { ...ctx, isReadOnly: readOnly });
  }

  setProtected(PresentationId: string, isProtected: boolean) {
    const ctx = this.PresentationContext.get(PresentationId) ?? {};
    this.PresentationContext.set(PresentationId, { ...ctx, isProtected });
  }
}

export const FilePermissionEngine = new FilePermissionEngineImpl();
