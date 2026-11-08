// ─────────────────────────────────────────────────────────────────────────────
// Mail Merge Engine — Core Data Models
// Ref: MAIL_MERGE_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type MergeStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type MergeRecord = Record<string, any>;

export interface FilterOption {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface MergeJob {
  jobId: string;
  templateId: string;
  dataSourceId: string;
  mergeFields: string[]; // List of fields found in the template
  recordsProcessed: number;
  totalRecords: number;
  outputFormat: 'docx' | 'pdf' | 'html';
  status: MergeStatus;
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  metadata: Record<string, any>;
  createdAt: number;
  completedAt?: number;
}
