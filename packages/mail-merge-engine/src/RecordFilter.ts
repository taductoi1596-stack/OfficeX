// ─────────────────────────────────────────────────────────────────────────────
// Record Filter — Applies filters and sorting to DataProvider records
// Ref: MAIL_MERGE_ENGINE.md §8
// ─────────────────────────────────────────────────────────────────────────────

import type { MergeRecord, FilterOption, SortOption } from './models/MergeJob';

export class RecordFilter {
  
  apply(records: MergeRecord[], filters?: FilterOption[], sorts?: SortOption[]): MergeRecord[] {
    let result = [...records];

    if (filters && filters.length > 0) {
      result = result.filter(record => {
        return filters.every(f => this.evaluateFilter(record, f));
      });
    }

    if (sorts && sorts.length > 0) {
      result = result.sort((a, b) => {
        for (const sort of sorts) {
          const valA = a[sort.field];
          const valB = b[sort.field];

          if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }

  private evaluateFilter(record: MergeRecord, filter: FilterOption): boolean {
    const value = record[filter.field];
    
    switch (filter.operator) {
      case 'equals': return value === filter.value;
      case 'not_equals': return value !== filter.value;
      case 'contains': return String(value).includes(String(filter.value));
      case 'greater_than': return value > filter.value;
      case 'less_than': return value < filter.value;
      default: return true;
    }
  }
}
