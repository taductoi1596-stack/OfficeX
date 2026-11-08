import { injectable } from 'tsyringe';
import { FileService } from './service';
import * as path from 'path';

@injectable()
export class DocumentLoader {
  constructor(private fileService: FileService) {}

  public async getApplicationType(filePath: string): Promise<'word' | 'excel' | 'powerpoint' | 'unknown'> {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.docx':
      case '.doc':
      case '.rtf':
      case '.txt':
      case '.md':
        return 'word';
      case '.xlsx':
      case '.xls':
      case '.csv':
        return 'excel';
      case '.pptx':
      case '.ppt':
        return 'powerpoint';
      default:
        return 'unknown';
    }
  }

  public async validateDocument(filePath: string): Promise<boolean> {
    const isValidPath = await this.fileService.validatePath(filePath);
    if (!isValidPath) return false;

    const metadata = await this.fileService.getMetadata(filePath);
    // basic sanity checks
    if (metadata.size === 0) return false;

    const appType = await this.getApplicationType(filePath);
    if (appType === 'unknown') return false;

    return true;
  }
}
