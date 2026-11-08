import { injectable } from 'tsyringe';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileMetadata {
  path: string;
  size: number;
  lastModified: Date;
  extension: string;
}

@injectable()
export class FileService {
  constructor() {}

  async readFile(filePath: string): Promise<Buffer> {
    try {
      return await fs.readFile(filePath);
    } catch (error: any) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  async writeFile(filePath: string, data: Buffer | string): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(filePath, data);
    } catch (error: any) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  async getMetadata(filePath: string): Promise<FileMetadata> {
    try {
      const stats = await fs.stat(filePath);
      return {
        path: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        extension: path.extname(filePath).toLowerCase()
      };
    } catch (error: any) {
      throw new Error(`Failed to get metadata for ${filePath}: ${error.message}`);
    }
  }

  async validatePath(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }
}
