// ─────────────────────────────────────────────────────────────────────────────
// Batch Processor — Iterates through records and generates output
// Ref: MAIL_MERGE_ENGINE.md §14
// ─────────────────────────────────────────────────────────────────────────────

import type { MergeJob } from './models/MergeJob';
import type { DataProvider } from './providers/DataProvider';
import { FieldResolver } from './FieldResolver';
import { RecordFilter } from './RecordFilter';

export class BatchProcessor {
  private resolver = new FieldResolver();
  private recordFilter = new RecordFilter();

  async processBatch(
    job: MergeJob,
    provider: DataProvider,
    templateContent: string,
    onProgress: (processed: number, total: number) => void
  ): Promise<string[]> {
    job.status = 'processing';
    const outputs: string[] = [];
    const batchSize = 100;
    
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const records = await provider.getRecords(offset, batchSize);
      if (records.length === 0) {
        hasMore = false;
        break;
      }

      // Apply filter and sorting if available
      const processedRecords = this.recordFilter.apply(records, job.filterOptions, job.sortOptions);

      for (const record of processedRecords) {
        const output = this.resolver.resolveDocument(templateContent, record);
        outputs.push(output);
        
        job.recordsProcessed++;
        onProgress(job.recordsProcessed, job.totalRecords);
      }

      offset += records.length;
    }

    job.status = 'completed';
    job.completedAt = Date.now();
    return outputs;
  }
}
