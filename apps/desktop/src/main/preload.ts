import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipc', {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, callback: (...args: any[]) => void) => {
    const subscription = (_event: any, ...args: any[]) => callback(...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  invokeRaw: (request: any) => ipcRenderer.invoke('ipc-router', request),
  onRequestClose: (callback: () => void) => {
    const sub = () => callback();
    ipcRenderer.on('window:request-close', sub);
    return () => ipcRenderer.removeListener('window:request-close', sub);
  },
  
  api: {
    auth: {
      login: (email: string, password: string) => ipcRenderer.invoke('api:auth:login', { email, password }),
    },
    documents: {
      list: () => ipcRenderer.invoke('api:documents:list'),
    }
  },
  
  // Window Management
  closeWindow: () => ipcRenderer.invoke('window-close'),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  
  // App Management
  launchApp: (appId: string) => ipcRenderer.invoke('launch-app', appId),
  openSettings: () => ipcRenderer.invoke('open-settings'),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke('check-update'),
  onUpdateProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('update-progress', (event, data) => callback(data));
  },

  // Recovery
  getRecoveryItems: () => ipcRenderer.invoke('get-recovery-items'),
  resolveRecovery: (action: string) => ipcRenderer.invoke('resolve-recovery', action),
  simulateCrash: () => ipcRenderer.invoke('simulate-crash'),

  // Platform Services
  showDialog: (title: string, message: string) => ipcRenderer.invoke('show-dialog', { title, message }),
  copyToClipboard: (text: string) => ipcRenderer.invoke('copy-clipboard', text),
  readClipboardImage: () => ipcRenderer.invoke('read-clipboard-image'),
  readClipboardAll: () => ipcRenderer.invoke('clipboard:read-all'),
  showNotification: (title: string, body: string) => ipcRenderer.invoke('show-notification', { title, body }),

  // Startup status (Progressive Startup — Deferred phase)
  onStartupStatus: (callback: (event: any) => void) => {
    ipcRenderer.on('startup-status', (_event, data) => callback(data));
  },

  // Shutdown
  requestShutdown: () => ipcRenderer.invoke('request-shutdown'),
  onShutdownInitiated: (callback: () => void) => {
    ipcRenderer.on('shutdown-initiated', () => callback());
  },

  // App Installer & Windows Control Panel Integration
  appManager: {
    install: (appId: string) => ipcRenderer.invoke('app-manager:install', appId),
    uninstall: (appId: string) => ipcRenderer.invoke('app-manager:uninstall', appId),
    reinstall: (appId: string) => ipcRenderer.invoke('app-manager:reinstall', appId),
    getStatus: () => ipcRenderer.invoke('app-manager:getStatus'),
    openControlPanel: () => ipcRenderer.invoke('app-manager:openControlPanel'),
    downloadInstaller: (appId: string) => ipcRenderer.invoke('app-manager:downloadInstaller', appId),
  },

  // License, User Auth & Subscription
  license: {
    getStatus: () => ipcRenderer.invoke('license:getStatus'),
    getPlans: () => ipcRenderer.invoke('license:getPlans'),
    register: (data: any) => ipcRenderer.invoke('license:register', data),
    login: (data: any) => ipcRenderer.invoke('license:login', data),
    upgrade: (planId: string) => ipcRenderer.invoke('license:upgrade', planId),
    logout: () => ipcRenderer.invoke('license:logout'),
    checkAndEnforce: () => ipcRenderer.invoke('license:checkAndEnforce'),
    canInstall: () => ipcRenderer.invoke('license:canInstall'),
    resetInstallBlock: (userId?: string) => ipcRenderer.invoke('license:resetInstallBlock', userId ? { userId } : undefined),
    admin: {
      getUsers: () => ipcRenderer.invoke('license:admin:getUsers'),
      approveUser: (userId: string, planId?: string) => ipcRenderer.invoke('license:admin:approveUser', { userId, planId }),
      rejectUser: (userId: string) => ipcRenderer.invoke('license:admin:rejectUser', { userId }),
      blockUser: (userId: string) => ipcRenderer.invoke('license:admin:blockUser', { userId }),
      deleteUser: (userId: string) => ipcRenderer.invoke('license:admin:deleteUser', { userId }),
      extendUser: (userId: string, days: number) => ipcRenderer.invoke('license:admin:extendUser', { userId, days }),
    }
  }
});
