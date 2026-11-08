// ─────────────────────────────────────────────────────────────────────────────
// Rights Manager — Central orchestrator for the Rights Management Engine
// Ref: RIGHTS_MANAGEMENT_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentRights } from './models/Rights';
import { PermissionEvaluator } from './PermissionEvaluator';
import { ProtectionManager } from './ProtectionManager';
import { EncryptionManager } from './EncryptionManager';
import { WatermarkManager } from './WatermarkManager';

export class RightsManager {
  readonly permissions: PermissionEvaluator;
  readonly protection: ProtectionManager;
  readonly encryption: EncryptionManager;
  readonly watermark: WatermarkManager;

  private activeRights: DocumentRights | null = null;
  private currentUserId: string | null = null;
  private currentUserGroups: string[] = [];

  constructor() {
    this.permissions = new PermissionEvaluator();
    this.protection = new ProtectionManager();
    this.encryption = new EncryptionManager();
    this.watermark = new WatermarkManager();
  }

  // ─── Session ──────────────────────────────────────────────────────────────

  /**
   * Sets the current user identity for permission evaluation.
   */
  setCurrentUser(userId: string, groups: string[] = []): void {
    this.currentUserId = userId;
    this.currentUserGroups = groups;
    this.applyRights();
  }

  /**
   * Loads document rights and applies permissions for the current user.
   */
  loadDocumentRights(rights: DocumentRights | null): void {
    this.activeRights = rights;
    this.applyRights();

    // Configure watermark if rights include it
    if (rights?.watermark) {
      this.watermark.setConfig(rights.watermark);
    } else {
      this.watermark.clearConfig();
    }
  }

  /**
   * Clears rights (e.g. when document is closed)
   */
  clearDocumentRights(): void {
    this.activeRights = null;
    this.watermark.clearConfig();
    this.applyRights();
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private applyRights(): void {
    const grantedPermissions = this.permissions.evaluatePermissions(
      this.activeRights,
      this.currentUserId ?? '',
      this.currentUserGroups
    );
    this.protection.setCurrentPermissions(grantedPermissions);
  }

  // ─── Convenience ──────────────────────────────────────────────────────────

  getActiveRights(): DocumentRights | null {
    return this.activeRights;
  }

  isProtected(): boolean {
    return this.activeRights !== null;
  }
}
