import { IpcRequest, IpcResponse } from './models';

// This runs in the renderer process via preload
export class IpcClient {
  private static generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  static async invoke<T = any>(channel: string, payload?: any): Promise<T> {
    const request: IpcRequest = {
      channel,
      payload,
      requestId: this.generateRequestId(),
      timestamp: Date.now()
    };

    // @ts-ignore - ipcRenderer is exposed via contextBridge
    const response: IpcResponse<T> = await window.electronAPI.invokeRaw(request);

    if (!response.success) {
      throw new Error(`[IPC Error: ${response.error?.code}] ${response.error?.message}`);
    }

    return response.data as T;
  }
}
