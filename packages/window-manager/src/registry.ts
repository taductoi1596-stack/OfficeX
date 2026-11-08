import { injectable } from 'tsyringe';
import { BrowserWindow } from 'electron';

export interface WindowMetadata {
  id: string;
  type: 'launcher' | 'settings' | 'document';
  documentPath?: string;
  browserWindow: BrowserWindow;
}

@injectable()
export class WindowRegistry {
  private windows = new Map<string, WindowMetadata>();

  public register(metadata: WindowMetadata) {
    this.windows.set(metadata.id, metadata);

    metadata.browserWindow.on('closed', () => {
      this.windows.delete(metadata.id);
    });
  }

  public get(id: string): WindowMetadata | undefined {
    return this.windows.get(id);
  }

  public getByDocumentPath(path: string): WindowMetadata | undefined {
    for (const [, metadata] of this.windows) {
      if (metadata.documentPath === path) {
        return metadata;
      }
    }
    return undefined;
  }

  public getAll(): WindowMetadata[] {
    return Array.from(this.windows.values());
  }

  public focus(id: string) {
    const win = this.windows.get(id);
    if (win) {
      if (win.browserWindow.isMinimized()) win.browserWindow.restore();
      win.browserWindow.show();
      win.browserWindow.focus();
    }
  }
}
