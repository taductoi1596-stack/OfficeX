import { injectable } from 'tsyringe';
import { ipcMain } from 'electron';
import { ApiGatewayService } from './api-gateway.service';
import { ILogger } from '../../interfaces/ILogger';

@injectable()
export class ApiIpcHandler {
  constructor(
    private apiGateway: ApiGatewayService,
    private logger: ILogger
  ) {}

  public registerHandlers() {
    this.logger.info('Registering API IPC Handlers');

    ipcMain.handle('api:auth:login', async (_, { email, password }) => {
      try {
        const result = await this.apiGateway.api.auth.login(email, password);
        // Assuming backend returns { accessToken, refreshToken, user }
        const { accessToken, refreshToken, user } = (result as any).data || result;
        if (accessToken && refreshToken) {
          this.apiGateway.setTokens(accessToken, refreshToken);
        }
        return { success: true, user };
      } catch (error: any) {
        this.logger.error('Login failed via IPC', error);
        return { success: false, message: error.message || 'Login failed' };
      }
    });

    ipcMain.handle('api:documents:list', async () => {
      try {
        const result = await this.apiGateway.api.documents.findAll();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    });
    
    // Add other IPC handlers mapped to ApiGatewayService
  }
}
