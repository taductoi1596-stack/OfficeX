// ─────────────────────────────────────────────────────────────────────────────
// CSV Provider — Simulates reading CSV data
// Ref: MAIL_MERGE_ENGINE.md §9
// ─────────────────────────────────────────────────────────────────────────────

import type { DataProvider } from './DataProvider';
import type { MergeRecord } from '../models/MergeJob';

export class CSVProvider implements DataProvider {
  id: string;
  private data: MergeRecord[];

  constructor(id: string, mockData: MergeRecord[]) {
    this.id = id;
    this.data = mockData;
  }

  async getAvailableFields(): Promise<string[]> {
    if (this.data.length === 0) return [];
    return Object.keys(this.data[0]);
  }

  async getRecordCount(): Promise<number> {
    return this.data.length;
  }

  async getRecords(offset: number, limit: number): Promise<MergeRecord[]> {
    return this.data.slice(offset, offset + limit);
  }
}
