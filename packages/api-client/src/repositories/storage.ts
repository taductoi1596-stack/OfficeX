import { AxiosInstance } from 'axios';

export class StorageApi {
  constructor(private client: AxiosInstance) {}

  async getUploadUrl(filename: string) {
    return this.client.get(`/storage/upload-url?filename=${encodeURIComponent(filename)}`);
  }

  async getDownloadUrl(fileKey: string) {
    return this.client.get(`/storage/download-url?fileKey=${encodeURIComponent(fileKey)}`);
  }
}
