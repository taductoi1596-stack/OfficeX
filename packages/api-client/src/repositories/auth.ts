import { AxiosInstance } from 'axios';

export class AuthApi {
  constructor(private client: AxiosInstance) {}

  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async register(email: string, password: string, displayName: string) {
    return this.client.post('/auth/register', { email, password, displayName });
  }

  async logout() {
    return this.client.post('/auth/logout');
  }
}
