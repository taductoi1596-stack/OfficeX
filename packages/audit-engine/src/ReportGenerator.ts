// ─────────────────────────────────────────────────────────────────────────────
// Report Generator — Aggregates audit records into compliance reports
// Ref: AUDIT_ENGINE.md §16
// ─────────────────────────────────────────────────────────────────────────────

import type { AuditRecord, AuditCategory } from './models/AuditRecord';

export interface AuditReport {
  reportId: string;
  generatedAt: number;
  title: string;
  totalRecords: number;
  byCategory: Record<AuditCategory, number>;
  byResult: Record<string, number>;
  records: AuditRecord[];
}

export class ReportGenerator {
  private persistedRecords: AuditRecord[] = [];
  private readonly maxStoredRecords = 5000;

  ingest(records: AuditRecord[]): void {
    this.persistedRecords.push(...records);
    if (this.persistedRecords.length > this.maxStoredRecords) {
      this.persistedRecords.splice(0, this.persistedRecords.length - this.maxStoredRecords);
    }
  }

  generate(
    title: string,
    filter?: { category?: AuditCategory; userId?: string; since?: number }
  ): AuditReport {
    let records = [...this.persistedRecords];

    if (filter?.category) {
      records = records.filter(r => r.category === filter.category);
    }
    if (filter?.userId) {
      records = records.filter(r => r.userId === filter.userId);
    }
    if (filter?.since) {
      records = records.filter(r => r.timestamp >= filter.since!);
    }

    const byCategory = records.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1;
      return acc;
    }, {} as Record<AuditCategory, number>);

    const byResult = records.reduce((acc, r) => {
      acc[r.result] = (acc[r.result] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      reportId: `rep-${Date.now()}`,
      generatedAt: Date.now(),
      title,
      totalRecords: records.length,
      byCategory,
      byResult,
      records,
    };
  }

  getAllRecords(): AuditRecord[] {
    return [...this.persistedRecords];
  }

  clear(): void {
    this.persistedRecords = [];
  }
}
