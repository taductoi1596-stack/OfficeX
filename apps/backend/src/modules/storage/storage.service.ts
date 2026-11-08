import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: Minio.Client;
  private documentBucket: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint')!,
      port: this.configService.get<number>('minio.port')!,
      useSSL: this.configService.get<boolean>('minio.useSSL')!,
      accessKey: this.configService.get<string>('minio.accessKey')!,
      secretKey: this.configService.get<string>('minio.secretKey')!,
    });
    this.documentBucket = this.configService.get<string>('minio.buckets.documents') || 'documents';
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.documentBucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.documentBucket, 'us-east-1');
      }
    } catch (error) {
      console.error('Error initializing MinIO bucket:', error);
    }
  }

  async getPresignedUploadUrl(objectName: string, expiryInSeconds = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedPutObject(this.documentBucket, objectName, expiryInSeconds);
    } catch (err) {
      throw new InternalServerErrorException('Could not generate presigned URL');
    }
  }

  async getPresignedDownloadUrl(objectName: string, expiryInSeconds = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(this.documentBucket, objectName, expiryInSeconds);
    } catch (err) {
      throw new InternalServerErrorException('Could not generate presigned URL');
    }
  }
}
