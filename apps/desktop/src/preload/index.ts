import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipc', {
  invoke: (channel: string, payload?: any) => {
    const requestId = Math.random().toString(36).substring(2, 11);
    return ipcRenderer.invoke('ipc-invoke', { channel, payload, requestId })
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error?.message || 'IPC request failed');
        }
        return response.data;
      });
  },
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
  removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, listener);
  }
});
