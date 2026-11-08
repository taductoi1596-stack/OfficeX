// ─────────────────────────────────────────────────────────────────────────────
// Merge Manager — Central orchestrator for Mail Merge Engine
// Ref: MAIL_MERGE_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { MergeJob } from './models/MergeJob';
import type { DataProvider } from './providers/DataProvider';
import { BatchProcessor } from './BatchProcessor';

function generateJobId(): string {
  return `merge-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export class MergeManager {
  private batchProcessor = new BatchProcessor();
  private providers = new Map<string, DataProvider>();
  private jobs = new Map<string, MergeJob>();

  registerProvider(provider: DataProvider): void {
    this.providers.set(provider.id, provider);
  }

  async createJob(templateId: string, dataSourceId: string): Promise<MergeJob> {
    const provider = this.providers.get(dataSourceId);
    if (!provider) {
      throw new Error(`Data provider ${dataSourceId} not found`);
    }

    const totalRecords = await provider.getRecordCount();
    const availableFields = await provider.getAvailableFields();

    const job: MergeJob = {
      jobId: generateJobId(),
      templateId,
      dataSourceId,
      mergeFields: availableFields,
      recordsProcessed: 0,
      totalRecords,
      outputFormat: 'docx',
      status: 'pending',
      metadata: {},
      createdAt: Date.now()
    };

    this.jobs.set(job.jobId, job);
    return job;
  }

  async executeJob(jobId: string, templateContent: string): Promise<string[]> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    const provider = this.providers.get(job.dataSourceId);
    if (!provider) throw new Error('Data provider not found');

    console.log(`[MailMerge] Starting job ${job.jobId} for ${job.totalRecords} records...`);

    const outputs = await this.batchProcessor.processBatch(
      job, 
      provider, 
      templateContent, 
      (processed, total) => {
        // Optional: emit events for UI progress bar
        if (processed % 10 === 0 || processed === total) {
          console.log(`[MailMerge] Progress: ${processed}/${total}`);
        }
      }
    );

    console.log(`[MailMerge] Job ${job.jobId} completed successfully.`);
    return outputs;
  }
}
