import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('document-tasks')
export class DocumentProcessor extends WorkerHost {
  private readonly logger = new Logger(DocumentProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
    
    switch (job.name) {
      case 'export-pdf':
        return this.handleExportPdf(job.data);
      case 'index-search':
        return this.handleIndexSearch(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleExportPdf(data: any) {
    this.logger.log(`Exporting document ${data.documentId} to PDF...`);
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.logger.log(`Export completed for document ${data.documentId}`);
  }

  private async handleIndexSearch(data: any) {
    this.logger.log(`Indexing document ${data.documentId} for full-text search...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.logger.log(`Indexing completed for document ${data.documentId}`);
  }
}
