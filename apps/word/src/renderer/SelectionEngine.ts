export class SelectionEngine {
  
  /** Select the entire paragraph DOM element based on its ID */
  static selectParagraph(paraId: string): void {
    const el = document.querySelector(`[data-para-id="${paraId}"]`);
    if (!el) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /** Select all content in the editor */
  static selectAll(): void {
    const editor = document.getElementById('canvas-editor-container');
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /** Select the current word under the cursor or click target */
  static selectWord(targetNode: Node, offset: number): void {
    const selection = window.getSelection();
    if (!selection || targetNode.nodeType !== Node.TEXT_NODE) return;

    const text = targetNode.textContent || '';
    if (!text) return;

    // Expand left
    let start = offset;
    while (start > 0 && !/\s/.test(text[start - 1])) {
      start--;
    }

    // Expand right
    let end = offset;
    while (end < text.length && !/\s/.test(text[end])) {
      end++;
    }

    if (start < end) {
      const range = document.createRange();
      range.setStart(targetNode, start);
      range.setEnd(targetNode, end);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /** Clear any active selection */
  static clear(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }
}
