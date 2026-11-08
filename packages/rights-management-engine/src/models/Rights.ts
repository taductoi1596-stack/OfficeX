// ─────────────────────────────────────────────────────────────────────────────
// Rights Management Engine — Core Data Models
// Ref: RIGHTS_MANAGEMENT_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentPermission =
  | 'view'
  | 'edit'
  | 'comment'
  | 'print'
  | 'export'
  | 'copy'
  | 'share'
  | 'manage_permissions';

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  showIdentity?: boolean; // Show viewer's email/name
  showTimestamp?: boolean;
  opacity?: number;
}

export interface EncryptionInfo {
  algorithm: string;
  keyId: string;
  isEncrypted: boolean;
}

export interface DocumentRights {
  rightsId: string;
  documentId: string;
  ownerId: string;
  
  /** Map of userId to granted permissions */
  userPermissions: Record<string, DocumentPermission[]>;
  /** Map of groupId to granted permissions */
  groupPermissions: Record<string, DocumentPermission[]>;
  
  expiration?: number; // timestamp
  encryption: EncryptionInfo;
  watermark: WatermarkConfig;
  
  metadata: Record<string, any>;
}
