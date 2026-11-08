// ─────────────────────────────────────────────────────────────────────────────
// Protection Manager — Exposes high-level state checks for the current document
// Ref: RIGHTS_MANAGEMENT_ENGINE.md §7-§12
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentPermission } from './models/Rights';

export class ProtectionManager {
  private currentPermissions = new Set<DocumentPermission>();

  setCurrentPermissions(permissions: Set<DocumentPermission>): void {
    this.currentPermissions = permissions;
  }

  isViewOnly(): boolean {
    return this.currentPermissions.has('view') && !this.currentPermissions.has('edit');
  }

  canEdit(): boolean {
    return this.currentPermissions.has('edit');
  }

  canCopy(): boolean {
    return this.currentPermissions.has('copy');
  }

  canPrint(): boolean {
    return this.currentPermissions.has('print');
  }

  canExport(): boolean {
    return this.currentPermissions.has('export');
  }

  /**
   * Attempt to prevent screenshots (Best Effort)
   */
  shouldMitigateScreenshots(): boolean {
    // If user cannot copy, export or print, we also try to mitigate screenshots
    return !this.canCopy() && !this.canExport();
  }
}
