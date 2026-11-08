import { ClipboardItem } from './models/ClipboardItem';
import { FormatConverter } from './converters/FormatConverter';
import { OSClipboardAdapter } from './adapters/OSClipboardAdapter';

export class ClipboardManager {
  private history: ClipboardItem[] = [];
  private converter: FormatConverter = new FormatConverter();
  
  // The adapter injected by the host environment
  private osAdapter: OSClipboardAdapter | null = null;

  public setOSAdapter(adapter: OSClipboardAdapter) {
    this.osAdapter = adapter;
  }

  /**
   * Called by an OfficeX app when the user presses Ctrl+C.
   */
  public async copy(item: ClipboardItem): Promise<void> {
    // 1. Enrich formats (e.g. HTML -> PlainText)
    this.converter.enrich(item);
    
    // 2. Save to internal history
    this.history.unshift(item);
    if (this.history.length > 50) this.history.pop(); // Keep last 50 items

    // 3. Sync to external OS Clipboard so user can paste into Notepad
    if (this.osAdapter) {
      await this.osAdapter.writeToOS(item);
    }
  }

  /**
   * Called by an OfficeX app when the user presses Ctrl+V.
   * The app specifies which formats it prefers, in order of priority.
   */
  public async paste(preferredFormats: string[]): Promise<{ format: string, data: any } | null> {
    let topItem = this.history.length > 0 ? this.history[0] : null;

    // If internal history is empty, try pulling from OS Clipboard
    if (!topItem && this.osAdapter) {
      topItem = await this.osAdapter.readFromOS();
      if (topItem) {
        this.converter.enrich(topItem);
        this.history.unshift(topItem);
      }
    }

    if (!topItem) return null;

    // Negotiate format: Find the first format the App requested that exists in the item
    for (const format of preferredFormats) {
      if (topItem.hasFormat(format)) {
        return {
          format: format,
          data: topItem.getData(format)
        };
      }
    }

    // No compatible format found
    return null;
  }
}
