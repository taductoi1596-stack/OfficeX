import { AxiosInstance } from 'axios';

export class WorkspacesApi {
  constructor(private client: AxiosInstance) {}

  async create(data: any) {
    return this.client.post('/workspaces', data);
  }

  async findAll() {
    return this.client.get('/workspaces');
  }

  async findOne(id: string) {
    return this.client.get(`/workspaces/${id}`);
  }

  async addMember(workspaceId: string, data: any) {
    return this.client.post(`/workspaces/${workspaceId}/members`, data);
  }
}
