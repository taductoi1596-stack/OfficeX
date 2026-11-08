import { ClipboardItem } from '../models/ClipboardItem';
import { ClipboardFormat } from '../models/ClipboardFormat';

export class FormatConverter {
  /**
   * Automatically enriches a ClipboardItem by generating fallback formats.
   * e.g. If HTML is provided, it generates PlainText.
   */
  public enrich(item: ClipboardItem): void {
    if (item.hasFormat(ClipboardFormat.HTML) && !item.hasFormat(ClipboardFormat.PlainText)) {
      const html = item.getData(ClipboardFormat.HTML);
      const plainText = this.stripHtmlTags(html);
      item.setData(ClipboardFormat.PlainText, plainText);
    }
    
    // Future expansions: 
    // OpenXML -> HTML -> PlainText
    // SVG -> PNG
  }

  private stripHtmlTags(html: string): string {
    // Very basic mock implementation for stripping tags
    return html.replace(/<[^>]*>?/gm, '');
  }
}
