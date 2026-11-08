import { BrowserWindow } from 'electron';

export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  public createWindow(id: string, options: Electron.BrowserWindowConstructorOptions, loadUrl: string) {
    if (this.windows.has(id)) {
      this.windows.get(id)?.focus();
      return this.windows.get(id);
    }

    const win = new BrowserWindow(options);
    win.loadURL(loadUrl);

    win.on('closed', () => {
      this.windows.delete(id);
    });

    this.windows.set(id, win);
    return win;
  }

  public getWindow(id: string) {
    return this.windows.get(id);
  }

  public closeAll() {
    this.windows.forEach(win => win.close());
    this.windows.clear();
  }
}
