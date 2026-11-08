// ─────────────────────────────────────────────────────────────────────────────
// JSON Provider — Mail Merge Data Provider for JSON objects
// Ref: MAIL_MERGE_ENGINE.md §4
// ─────────────────────────────────────────────────────────────────────────────

import type { DataProvider } from './DataProvider';
import type { MergeRecord } from '../models/MergeJob';

export class JSONProvider implements DataProvider {
  id: string;
  private data: MergeRecord[];

  constructor(id: string, jsonData: MergeRecord[]) {
    this.id = id;
    this.data = jsonData;
  }

  async getAvailableFields(): Promise<string[]> {
    if (this.data.length === 0) return [];
    // Assuming uniform object shapes
    return Object.keys(this.data[0]);
  }

  async getRecordCount(): Promise<number> {
    return this.data.length;
  }

  async getRecords(offset: number, limit: number): Promise<MergeRecord[]> {
    return this.data.slice(offset, offset + limit);
  }
}
