import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthApi } from './repositories/auth';
import { DocumentsApi } from './repositories/documents';
import { WorkspacesApi } from './repositories/workspaces';
import { StorageApi } from './repositories/storage';

export interface ApiClientConfig {
  baseURL: string;
  onUnauthorized?: () => void;
  getToken?: () => string | null;
  getRefreshToken?: () => string | null;
  onTokenRefreshed?: (accessToken: string, refreshToken: string) => void;
}

export class OfficeXApiClient {
  private axiosInstance: AxiosInstance;
  public auth: AuthApi;
  public documents: DocumentsApi;
  public workspaces: WorkspacesApi;
  public storage: StorageApi;

  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(private config: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();

    this.auth = new AuthApi(this.axiosInstance);
    this.documents = new DocumentsApi(this.axiosInstance);
    this.workspaces = new WorkspacesApi(this.axiosInstance);
    this.storage = new StorageApi(this.axiosInstance);
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
      if (this.config.getToken) {
        const token = this.config.getToken();
        if (token && req.headers) {
          req.headers.Authorization = `Bearer ${token}`;
        }
      }
      return req;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Unwrap our custom response format if needed
        if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
          return response.data.data;
        }
        return response.data;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.config.getRefreshToken?.();
            const userId = this.getUserIdFromToken(this.config.getToken?.());
            
            if (!refreshToken || !userId) {
              throw new Error('No refresh token or user context available');
            }

            const response = await axios.post(`${this.config.baseURL}/auth/refresh`, {
              userId,
              refreshToken,
            });

            const newAccessToken = response.data.data?.accessToken || response.data.accessToken;
            const newRefreshToken = response.data.data?.refreshToken || response.data.refreshToken;

            if (this.config.onTokenRefreshed) {
              this.config.onTokenRefreshed(newAccessToken, newRefreshToken);
            }

            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            this.onRefreshed(newAccessToken);

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.refreshSubscribers = [];
            if (this.config.onUnauthorized) {
              this.config.onUnauthorized();
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Return standard error shape
        if (error.response?.data) {
           return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private getUserIdFromToken(token: string | null | undefined): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }
}
