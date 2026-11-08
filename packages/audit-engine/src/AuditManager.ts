// ─────────────────────────────────────────────────────────────────────────────
// Audit Manager — Central orchestrator for the Audit Engine
// Ref: AUDIT_ENGINE.md §4, §5, §24
// ─────────────────────────────────────────────────────────────────────────────

import type { AuditRecord, AuditCategory, AuditResult } from './models/AuditRecord';
import { EventCollector } from './EventCollector';
import { ComplianceManager } from './ComplianceManager';
import { ReportGenerator } from './ReportGenerator';

function generateId(): string {
  return `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Stub: compute a lightweight integrity signature for a record.
 * In production, use HMAC-SHA256 with a server-provided key.
 */
function signRecord(record: AuditRecord): string {
  return `sig-${record.auditId}-${record.timestamp}`;
}

export class AuditManager {
  readonly collector: EventCollector;
  readonly compliance: ComplianceManager;
  readonly reporter: ReportGenerator;

  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private currentUserId: string = 'anonymous';
  private currentOrganizationId?: string;
  private currentDeviceId?: string;

  constructor() {
    this.collector = new EventCollector();
    this.compliance = new ComplianceManager();
    this.reporter = new ReportGenerator();
  }

  // ─── Identity Context ─────────────────────────────────────────────────────

  setCurrentUser(userId: string, organizationId?: string, deviceId?: string): void {
    this.currentUserId = userId;
    this.currentOrganizationId = organizationId;
    this.currentDeviceId = deviceId;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  start(flushIntervalMs: number = 30_000): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => this.flush(), flushIntervalMs);
  }

  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush on shutdown
  }

  // ─── Event Recording ──────────────────────────────────────────────────────

  record(
    category: AuditCategory,
    action: string,
    result: AuditResult,
    targetResource?: string,
    metadata: Record<string, any> = {}
  ): void {
    const record: AuditRecord = {
      auditId: generateId(),
      timestamp: Date.now(),
      userId: this.currentUserId,
      organizationId: this.currentOrganizationId,
      deviceId: this.currentDeviceId,
      category,
      action,
      targetResource,
      result,
      metadata,
    };

    // Sign the record for tamper detection
    record.signature = signRecord(record);

    // Track violations
    this.compliance.trackViolation(record);

    if (this.compliance.isSecurityCritical(record)) {
      // Security-critical events: bypass queue and flush immediately
      this.reporter.ingest([record]);
    } else {
      this.collector.enqueue(record);
    }
  }

  // ─── Convenience Helpers ──────────────────────────────────────────────────

  recordDocumentOpen(docId: string): void {
    this.record('document', 'document.open', 'success', docId);
  }

  recordExportAttempt(format: string, result: AuditResult, docId?: string): void {
    this.record('export', `export.${format}`, result, docId, { format });
  }

  recordPrintAttempt(result: AuditResult, docId?: string): void {
    this.record('print', 'print.request', result, docId);
  }

  recordPolicyViolation(policyId: string, action: string, docId?: string): void {
    this.record('policy_violation', action, 'violation', docId, { policyId });
  }

  recordPermissionChange(targetUserId: string, change: string, docId?: string): void {
    this.record('permission', `permission.${change}`, 'success', docId, { targetUserId });
  }

  // ─── Flush ────────────────────────────────────────────────────────────────

  private flush(): void {
    const batch = this.collector.extractBatch(100);
    if (batch.length > 0) {
      this.reporter.ingest(batch);
    }
  }
}
