import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { v4 as uuidv4 } from 'uuid';

@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('upload-url')
  async getUploadUrl(
    @CurrentUser('id') userId: string,
    @Query('filename') filename: string,
  ) {
    const extension = filename.split('.').pop();
    const objectKey = `user-${userId}/${uuidv4()}.${extension}`;
    const url = await this.storageService.getPresignedUploadUrl(objectKey);
    
    return { uploadUrl: url, fileKey: objectKey };
  }

  @Get('download-url')
  async getDownloadUrl(
    @CurrentUser('id') userId: string, // Could be used to verify access in real app
    @Query('fileKey') fileKey: string,
  ) {
    const url = await this.storageService.getPresignedDownloadUrl(fileKey);
    return { downloadUrl: url };
  }
}
