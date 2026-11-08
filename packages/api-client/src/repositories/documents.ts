import { AxiosInstance } from 'axios';

export class DocumentsApi {
  constructor(private client: AxiosInstance) {}

  async create(data: any) {
    return this.client.post('/documents', data);
  }

  async findAll() {
    return this.client.get('/documents');
  }

  async findOne(id: string) {
    return this.client.get(`/documents/${id}`);
  }

  async update(id: string, data: any) {
    return this.client.patch(`/documents/${id}`, data);
  }

  async delete(id: string) {
    return this.client.delete(`/documents/${id}`);
  }
}
