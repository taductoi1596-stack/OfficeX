import { DocPara } from './document/DocumentTypes';
import { detectTableFromClipboard, ParsedTableData } from './table/TableParser';

export interface ClipboardHistoryItem {
  id: string;
  timestamp: number;
  textPreview: string;
  paras: DocPara[];
}

export type ClipboardPasteResult =
  | { type: 'internal'; paras: DocPara[] }
  | { type: 'table'; tableData: ParsedTableData }
  | { type: 'text'; text: string; html?: string };

class ClipboardEngineImpl {
  private history: ClipboardHistoryItem[] = [];
  private historyListeners = new Set<() => void>();

  /**
   * Copy paras to the system clipboard in both plain text and custom HTML formats.
   * Also adds the copied item to the internal Clipboard History.
   */
  async copy(paras: DocPara[], plainText: string) {
    try {
      // 1. Create a JSON representation for internal high-fidelity paste
      const internalJson = JSON.stringify(paras);
      
      // 2. Create HTML payload that embeds our internal JSON
      // This allows copying across tabs of the same app
      const htmlPayload = `<div data-officex="${encodeURIComponent(internalJson)}">${plainText.replace(/\n/g, '<br/>')}</div>`;

      // 3. Write to system clipboard
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([htmlPayload], { type: 'text/html' })
      });
      await navigator.clipboard.write([clipboardItem]);

      // 4. Update History
      this.addToHistory(paras, plainText);
    } catch (err) {
      console.error('ClipboardEngine copy failed:', err);
      // Fallback for non-secure contexts or browsers lacking ClipboardItem support
      await navigator.clipboard.writeText(plainText);
      this.addToHistory(paras, plainText);
    }
  }

  /**
   * Read from system clipboard.
   * Returns parsed DocPara[] if it's our internal format.
   * Returns ParsedTableData if it's a table (HTML or TSV).
   * Otherwise returns plain text string.
   */
  async paste(): Promise<ClipboardPasteResult> {
    try {
      let htmlContent = '';
      let textContent = '';

      if (navigator.clipboard && navigator.clipboard.read) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            if (item.types.includes('text/html')) {
              const blob = await item.getType('text/html');
              htmlContent = await blob.text();

              // Check internal OfficeX format
              const match = htmlContent.match(/data-officex="([^"]+)"/);
              if (match && match[1]) {
                try {
                  const paras: DocPara[] = JSON.parse(decodeURIComponent(match[1]));
                  if (Array.isArray(paras)) {
                    return { type: 'internal', paras };
                  }
                } catch (e) {
                  console.warn('Failed to parse internal clipboard JSON', e);
                }
              }
            }
            if (item.types.includes('text/plain')) {
              const blob = await item.getType('text/plain');
              textContent = await blob.text();
            }
          }
        } catch {}
      }

      if (!textContent && navigator.clipboard && navigator.clipboard.readText) {
        try {
          textContent = await navigator.clipboard.readText();
        } catch {}
      }

      // Check if it's a table (from HTML or TSV)
      const tableData = detectTableFromClipboard(htmlContent, textContent);
      if (tableData) {
        return { type: 'table', tableData };
      }

      return { type: 'text', text: textContent, html: htmlContent };
    } catch (err) {
      console.warn('ClipboardItem API failed, falling back to readText:', err);
      const text = await navigator.clipboard.readText().catch(() => '');
      const tableData = detectTableFromClipboard(undefined, text);
      if (tableData) {
        return { type: 'table', tableData };
      }
      return { type: 'text', text };
    }
  }

  /**
   * Adds an item to the history panel cache
   */
  private addToHistory(paras: DocPara[], plainText: string) {
    const preview = plainText.substring(0, 50) + (plainText.length > 50 ? '...' : '');
    const item: ClipboardHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      textPreview: preview || '(Empty)',
      paras: JSON.parse(JSON.stringify(paras)) // deep clone
    };

    this.history.unshift(item);
    if (this.history.length > 24) {
      this.history.pop();
    }
    this.notifyHistory();
  }

  getHistory(): ClipboardHistoryItem[] {
    return this.history;
  }

  clearHistory() {
    this.history = [];
    this.notifyHistory();
  }

  subscribeHistory(fn: () => void): () => void {
    this.historyListeners.add(fn);
    return () => this.historyListeners.delete(fn);
  }

  private notifyHistory() {
    this.historyListeners.forEach(fn => fn());
  }
}

export const ClipboardEngine = new ClipboardEngineImpl();
