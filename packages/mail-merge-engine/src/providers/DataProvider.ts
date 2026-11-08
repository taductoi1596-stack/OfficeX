// ─────────────────────────────────────────────────────────────────────────────
// Data Provider Interface
// Ref: MAIL_MERGE_ENGINE.md §8
// ─────────────────────────────────────────────────────────────────────────────

import type { MergeRecord } from '../models/MergeJob';

export interface DataProvider {
  /** The unique ID of this data source */
  id: string;
  
  /** Retrieves all available fields (columns) */
  getAvailableFields(): Promise<string[]>;
  
  /** Returns the total number of records, if known */
  getRecordCount(): Promise<number>;
  
  /** 
   * Fetches records. Implementations should ideally support pagination 
   * or streaming for large datasets.
   */
  getRecords(offset: number, limit: number): Promise<MergeRecord[]>;
}
