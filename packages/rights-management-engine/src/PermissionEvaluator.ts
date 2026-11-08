// ─────────────────────────────────────────────────────────────────────────────
// Permission Evaluator — Evaluates permissions for a specific user against a document
// Ref: RIGHTS_MANAGEMENT_ENGINE.md §16, §17
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentRights, DocumentPermission } from './models/Rights';

export class PermissionEvaluator {
  /**
   * Evaluates and aggregates all permissions granted to a specific user (and their groups)
   * for a given document.
   */
  evaluatePermissions(
    rights: DocumentRights | null,
    userId: string,
    userGroups: string[] = []
  ): Set<DocumentPermission> {
    const grantedPermissions = new Set<DocumentPermission>();

    if (!rights) {
      // If no rights are explicitly defined, assume open access for local docs.
      // In a strict enterprise environment, this might default to empty set instead.
      return new Set(['view', 'edit', 'comment', 'print', 'export', 'copy', 'share', 'manage_permissions']);
    }

    // Owner implicitly has all rights
    if (rights.ownerId === userId) {
      return new Set(['view', 'edit', 'comment', 'print', 'export', 'copy', 'share', 'manage_permissions']);
    }

    // Check expiration
    if (rights.expiration && Date.now() > rights.expiration) {
      // If expired, return empty set (no permissions, not even view)
      return grantedPermissions; 
    }

    // Aggregate user-specific permissions
    const userPerms = rights.userPermissions[userId] || [];
    userPerms.forEach(p => grantedPermissions.add(p));

    // Aggregate group-specific permissions
    userGroups.forEach(groupId => {
      const groupPerms = rights.groupPermissions[groupId] || [];
      groupPerms.forEach(p => grantedPermissions.add(p));
    });

    return grantedPermissions;
  }
}
