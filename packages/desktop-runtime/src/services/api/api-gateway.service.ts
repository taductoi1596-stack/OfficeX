import { injectable, singleton } from 'tsyringe';
import { OfficeXApiClient } from '@officex/api-client';
import { ILogger } from '../../interfaces/ILogger';

@singleton()
@injectable()
export class ApiGatewayService {
  private client: OfficeXApiClient;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(private readonly logger: ILogger) {
    this.client = new OfficeXApiClient({
      baseURL: 'http://localhost:4000/api/v1',
      getToken: () => this.accessToken,
      getRefreshToken: () => this.refreshToken,
      onTokenRefreshed: (newAccess, newRefresh) => {
        this.accessToken = newAccess;
        this.refreshToken = newRefresh;
        this.logger.info('Tokens refreshed successfully');
      },
      onUnauthorized: () => {
        this.logger.warn('User is unauthorized. Need to login again.');
        // Notify renderers to show login screen
      },
    });
  }

  public get api(): OfficeXApiClient {
    return this.client;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
