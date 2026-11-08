import { ipcMain } from 'electron';
import { IpcRequest, IpcResponse } from './models';

type HandlerFunction = (payload: any) => Promise<any> | any;

export class IpcRouter {
  private handlers = new Map<string, HandlerFunction>();

  public register(channel: string, handler: HandlerFunction) {
    if (this.handlers.has(channel)) {
      console.warn(`[IPC Router] Handler for channel ${channel} is already registered.`);
    }
    this.handlers.set(channel, handler);
  }

  public unregister(channel: string) {
    this.handlers.delete(channel);
    try {
      ipcMain.removeHandler(channel);
    } catch {}
  }

  public start() {
    ipcMain.handle('ipc-invoke', async (event, request: IpcRequest): Promise<IpcResponse> => {
      const { channel, payload, requestId } = request;
      const handler = this.handlers.get(channel);

      if (!handler) {
        return {
          success: false,
          requestId,
          timestamp: Date.now(),
          error: {
            code: 'NOT_FOUND',
            message: `No handler found for channel: ${channel}`
          }
        };
      }

      try {
        const result = await handler(payload);
        return {
          success: true,
          data: result,
          requestId,
          timestamp: Date.now()
        };
      } catch (error: any) {
        return {
          success: false,
          requestId,
          timestamp: Date.now(),
          error: {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message || 'An unexpected error occurred during IPC execution.',
            details: error.stack
          }
        };
      }
    });
    console.log('[IPC Router] Started successfully.');
  }

  public stop() {
    try {
      ipcMain.removeHandler('ipc-invoke');
      this.handlers.clear();
      console.log('[IPC Router] Stopped successfully.');
    } catch {
      // Safe to ignore if already removed
    }
  }
}
