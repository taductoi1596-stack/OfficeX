import { ImportJob, createImportJob, DetectedFormat, ParserType } from './models/ImportJob';

// ─────────────────────────────────────────────────────────────────────────────
// Import Manager (Core Engine Facade)
// Orchestrates the import of external documents.
// ─────────────────────────────────────────────────────────────────────────────
export class ImportManager {
  private activeJobs: Map<string, ImportJob> = new Map();

  /**
   * Initializes a new import job for a given file.
   */
  public createJob(sourceFile: string): ImportJob {
    const job = createImportJob(sourceFile);
    this.activeJobs.set(job.id, job);
    return job;
  }

  /**
   * Starts the import pipeline.
   * Format Detection -> Validation -> Parser Routing -> Specialized Parser
   */
  public async startImport(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) throw new Error(`ImportJob ${jobId} not found`);

    try {
      // 1. Detection
      job.status = 'detecting';
      job.detectedFormat = this.detectFormat(job.sourceFile);
      job.progress = 10;

      // 2. Routing
      job.parser = this.routeParser(job.detectedFormat);

      // 3. Validation
      job.status = 'validating';
      // Mock validation...
      job.progress = 30;

      // 4. Parsing
      job.status = 'parsing';
      // Mock parsing process...
      job.progress = 80;

      // 5. Completion
      job.status = 'completed';
      job.progress = 100;

    } catch (error: any) {
      job.status = 'failed';
      job.validationResult.errors.push(error?.message || 'Unknown error');
    }
  }

  private detectFormat(sourceFile: string): DetectedFormat {
    const ext = sourceFile.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'docx': return 'docx';
      case 'pdf': return 'pdf';
      case 'html': return 'html';
      case 'txt': return 'txt';
      default: return 'unknown';
    }
  }

  private routeParser(format: DetectedFormat): ParserType {
    switch (format) {
      case 'docx': 
      case 'xlsx': 
      case 'pptx': return 'openxml';
      case 'pdf': return 'pdf';
      case 'html': 
      case 'txt': return 'text';
      default: return 'none';
    }
  }

  public getJob(jobId: string): ImportJob | undefined {
    return this.activeJobs.get(jobId);
  }
}
