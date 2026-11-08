import { injectable } from 'tsyringe';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { WindowRegistry } from './registry';
import path from 'path';

export interface CreateWindowOptions {
  type: 'launcher' | 'settings' | 'document';
  id?: string;
  documentPath?: string;
  url: string;
  width?: number;
  height?: number;
  frame?: boolean;
}

@injectable()
export class WindowFactory {
  constructor(private registry: WindowRegistry) {}

  public create(options: CreateWindowOptions): BrowserWindow {
    const id = options.id || Math.random().toString(36).substr(2, 9);
    
    // Check if launcher already open — focus instead of creating duplicate
    if (options.type === 'launcher') {
      const existing = this.registry.getAll().find(w => w.type === 'launcher');
      if (existing) {
        this.registry.focus(existing.id);
        return existing.browserWindow;
      }
    }

    // Check if document already open
    if (options.type === 'document' && options.documentPath) {
      const existing = this.registry.getByDocumentPath(options.documentPath);
      if (existing) {
        this.registry.focus(existing.id);
        return existing.browserWindow;
      }
    }

    const fs = require('fs');
    const { app: elApp } = require('electron');
    const appPath = elApp?.getAppPath ? elApp.getAppPath() : process.cwd();
    const candidatePreloads = [
      path.join(appPath, 'dist/main/preload.js'),
      path.join(appPath, 'apps/desktop/dist/main/preload.js'),
      path.join(process.cwd(), 'apps/desktop/dist/main/preload.js'),
      path.join(process.cwd(), 'dist/main/preload.js'),
      path.join(__dirname, 'preload.js'),
    ];
    let resolvedPreload = candidatePreloads.find((p: string) => fs.existsSync(p)) || candidatePreloads[0];

    const windowOptions: BrowserWindowConstructorOptions = {
      width: options.width || 1280,
      height: options.height || 800,
      show: false,  // ← Ẩn cho đến khi ready-to-show để tránh màn hình đen
      frame: options.frame !== undefined ? options.frame : true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false,
        preload: resolvedPreload,
      }
    };

    // Set background color theo loại window để tránh flash trắng/đen khi load
    if (options.type === 'launcher') {
      windowOptions.frame = true;
      windowOptions.backgroundColor = '#181825';
    } else if (options.type === 'document') {
      windowOptions.backgroundColor = '#1e1e2e';  // Dark editor background
    } else {
      windowOptions.backgroundColor = '#181825';
    }

    const win = new BrowserWindow(windowOptions);

    // Intercept external window popups and open in user's default browser (Chrome/Edge)
    win.webContents.setWindowOpenHandler(({ url }) => {
      if ((url.startsWith('http://') || url.startsWith('https://')) && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });

    // Intercept window close on document windows: let renderer ask to save if modified
    if (options.type === 'document') {
      win.on('close', (e: any) => {
        if ((win as any).__forceClose) return;
        e.preventDefault();
        win.webContents.send('window:request-close');
      });
    }

    // Hiển thị window khi nội dung đã render xong — tránh màn hình đen/trắng
    // Triple-safety pattern: ready-to-show → did-finish-load → fallback timeout
    let hasShown = false;
    const showWindow = (reason: string) => {
      if (hasShown) return;
      hasShown = true;
      console.log(`[WindowFactory] Showing window via: ${reason} | url=${options.url.substring(0, 80)}`);
      if (!win.isDestroyed()) {
        win.show();
        win.focus();
      }
    };

    // 1. Best: fires after first paint (instant, smooth)
    win.once('ready-to-show', () => showWindow('ready-to-show'));

    // 2. Backup: fires after HTML+JS finishes loading (always fires)
    win.webContents.once('did-finish-load', () => setTimeout(() => showWindow('did-finish-load'), 100));

    // 3. Last resort: show after 5s no matter what (prevent permanently hidden window)
    setTimeout(() => showWindow('5s-fallback'), 5000);

    win.loadURL(options.url);
    console.log(`[WindowFactory] Loading URL: ${options.url.substring(0, 100)}`);

    this.registry.register({
      id,
      type: options.type,
      documentPath: options.documentPath,
      browserWindow: win
    });

    return win;
  }
}
