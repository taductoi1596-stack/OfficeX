// ─────────────────────────────────────────────────────────────────────────────
// Audit Engine — Core Data Models
// Ref: AUDIT_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type AuditCategory =
  | 'login'
  | 'document'
  | 'print'
  | 'export'
  | 'sharing'
  | 'permission'
  | 'policy_violation'
  | 'admin'
  | 'security'
  | 'compliance';

export type AuditResult = 'success' | 'failure' | 'denied' | 'violation';

export interface AuditRecord {
  auditId: string;
  timestamp: number;

  /** Identity context */
  userId: string;
  organizationId?: string;
  deviceId?: string;

  /** What happened */
  category: AuditCategory;
  action: string;       // e.g. 'document.open', 'export.pdf', 'permission.revoke'
  targetResource?: string; // e.g. document ID, file path
  result: AuditResult;

  /** Additional context */
  policyId?: string;    // policy that was evaluated, if any
  metadata: Record<string, any>;

  /** Cryptographic integrity signature (stub) */
  signature?: string;
}
