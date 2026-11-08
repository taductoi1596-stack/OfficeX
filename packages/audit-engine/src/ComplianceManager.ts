// ─────────────────────────────────────────────────────────────────────────────
// Compliance Manager — Classifies and tracks policy violations and security events
// Ref: AUDIT_ENGINE.md §13, §15, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { AuditRecord, AuditCategory } from './models/AuditRecord';

/** Categories that require immediate attention */
const SECURITY_CRITICAL_CATEGORIES: AuditCategory[] = [
  'policy_violation',
  'security',
];

export class ComplianceManager {
  private violations: AuditRecord[] = [];

  /**
   * Returns true if the record is a security-critical event
   * that should be flushed to storage immediately (not deferred).
   */
  isSecurityCritical(record: AuditRecord): boolean {
    return (
      SECURITY_CRITICAL_CATEGORIES.includes(record.category) ||
      record.result === 'denied' ||
      record.result === 'violation'
    );
  }

  /**
   * Track policy violations / security events separately for compliance reports.
   */
  trackViolation(record: AuditRecord): void {
    if (record.result === 'violation' || record.result === 'denied') {
      this.violations.push(record);
      if (this.violations.length > 500) {
        this.violations.shift();
      }
    }
  }

  getViolations(): AuditRecord[] {
    return [...this.violations];
  }

  getViolationCount(): number {
    return this.violations.length;
  }

  clearViolations(): void {
    this.violations = [];
  }
}
