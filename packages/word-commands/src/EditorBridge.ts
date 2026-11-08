export class EditorBridge {
  private editor: HTMLDivElement | null = null;

  setEditor(editor: HTMLDivElement) {
    this.editor = editor;
  }

  getEditor(): HTMLDivElement | null {
    return this.editor;
  }

  // ─── Inline Formatting ───────────────────────────────────────────────────────
  applyFormat(command: string, value?: string) {
    if (!this.editor) return;
    document.execCommand(command, false, value);
    this.editor.focus();
  }

  // ─── Alignment ─────────────────────────────────────────────────────────────
  applyAlignment(align: 'left' | 'center' | 'right' | 'justify') {
    if (!this.editor) return;
    const commandMap: Record<string, string> = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull'
    };
    document.execCommand(commandMap[align], false, undefined);
    this.editor.focus();
  }

  // ─── Block Formatting ──────────────────────────────────────────────────────
  applyBlock(tag: string) {
    if (!this.editor) return;
    document.execCommand('formatBlock', false, tag);
    this.editor.focus();
  }

  // ─── Lists & Indents ───────────────────────────────────────────────────────
  applyList(type: 'bullets' | 'numbering') {
    if (!this.editor) return;
    document.execCommand(type === 'bullets' ? 'insertUnorderedList' : 'insertOrderedList', false, undefined);
    this.editor.focus();
  }

  applyIndent(type: 'increase' | 'decrease') {
    if (!this.editor) return;
    document.execCommand(type === 'increase' ? 'indent' : 'outdent', false, undefined);
    this.editor.focus();
  }

  // ─── Clipboard & Selection ──────────────────────────────────────────────────
  selectAll() {
    if (!this.editor) return;
    document.execCommand('selectAll', false, undefined);
    this.editor.focus();
  }

  copy() {
    if (!this.editor) return;
    document.execCommand('copy', false, undefined);
    this.editor.focus();
  }

  cut() {
    if (!this.editor) return;
    document.execCommand('cut', false, undefined);
    this.editor.focus();
  }

  async paste() {
    if (!this.editor) return;
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch (e) {
      document.execCommand('paste', false, undefined);
    }
    this.editor.focus();
  }

  // ─── State Querying (for Ribbon UI) ─────────────────────────────────────────
  queryCommandState(command: string): boolean {
    if (!this.editor) return false;
    return document.queryCommandState(command);
  }

  queryCommandValue(command: string): string {
    if (!this.editor) return '';
    return document.queryCommandValue(command);
  }
}
