import type { Align } from './interfaces';

export interface IEditorAPI {
  // Run formatting
  toggleBold(): void;
  toggleItalic(): void;
  toggleUnderline(): void;
  toggleStrike(): void;
  toggleSuperscript(): void;
  toggleSubscript(): void;
  increaseFontSize(): void;
  decreaseFontSize(): void;
  setFontFamily(name: string): void;
  setFontSize(pt: number): void;
  setFontColor(color: string): void;
  setHighlight(color: string): void;
  clearFormatting(): void;
  setRunFmt(fmt: Record<string, any>): void;

  // Advanced Run formatting
  applyLivePreview(fmt: Record<string, any>): void;
  clearLivePreview(): void;
  setTypography(props: Record<string, any>): void;
  setTextEffects(props: Record<string, any>): void;
  toggleDoubleUnderline(): void;
  toggleDoubleStrike(): void;
  toggleSmallCaps(): void;
  toggleAllCaps(): void;
  toggleHidden(): void;

  // Paragraph formatting
  setAlign(a: Align): void;
  indentIncrease(): void;
  indentDecrease(): void;
  setLeftIndent(val: number): void;
  setRightIndent(val: number): void;
  setFirstLineIndent(val: number): void;
  setHangingIndent(val: number): void;
  previewIndentIncrease(): void;
  previewIndentDecrease(): void;
  toggleBullets(): void;
  setBulletChar(char: string, font?: string): void;
  setBulletImage(src: string): void;
  setBulletColor(color: string): void;
  setBulletSize(pct: number): void;
  toggleNumbering(): void;
  promoteListLevel(): void;
  demoteListLevel(): void;
  setNumberingFormat(format: string, prefix?: string, suffix?: string): void;
  setNumberingStart(startAt: number): void;
  setLineSpacing(n: number): void;
  setParaFmt(fmt: Record<string, any>): void;
  setBorders(borders: Record<string, any> | null): void;
  setBorder(type: 'top'|'bottom'|'left'|'right'|'between'|'all'|'outside'|'inside'|'none', def?: any): void;
  applyLivePreviewPara(fmt: Record<string, any>): void;
  sortParagraphs(options?: Record<string, any>): void;
  toggleFormatMarks(): void;

  // Styles
  applyStyle(name: string): void;

  // Clipboard
  copy(): void;
  cut(): void;
  paste(): void;
  pasteText(): void;
  pasteHTML(): void;
  pasteSpecial(): void;
  toggleFormatPainter(): void;
  toggleClipboardPanel(): void;

  // Edit
  undo(): void;
  redo(): void;
  selectAll(): void;
  showFind(): void;
  showReplace(): void;

  // Navigation / Go To
  setSelection(paraIdxOrId: string | number, startOffset: number, endOffset: number): void;
  goToPage(pageNum: number): void;
  goToLine(lineNum: number): void;

  // AI Integration
  getSelectedText(): string;
  insertTextAtSelection(text: string): void;
  getPreviousParagraph(): string;
  getCurrentParagraph(): string;
  getNextParagraph(): string;
  getSelectionFormatting(): any;
  getDocumentMetadata(): Record<string, string>;
  getFullDocumentText(): string;

  // Insert & Document
  insertBlankPage(): void;
  insertCoverPage(templateId: string): void;
  insertPageBreak(): void;
  clearDocument(): void;
  setContent(text: string): void;
  insertTable(rows: number, cols: number): void;
  setDrawTableMode(enabled: boolean): void;
  insertQuickTable(template: string): void;
  insertExcelTable(type: string): void;
  convertTableToText(options?: any): void;

  // View
  setZoom(level: number): void;

  // State
  getState(): any;

  // Tables
  insertRow(position: 'above' | 'below'): void;
  insertColumn(position: 'left' | 'right'): void;
  deleteRow(): void;
  deleteColumn(): void;
  deleteTable(): void;
  setTableOption?(option: Record<string, boolean>): void;
  setTableStyle?(styleId: string): void;
  setTableShading?(color: string): void;
  setTableBorders?(borders: any): void;
  mergeCells?(): void;
  splitCell?(rows?: number, cols?: number): void;
  setColumnWidth?(width: number): void;
  setRowHeight?(height: number): void;
  distributeColumns?(): void;
  distributeRows?(): void;
  setCellAlignment?(align: 'left' | 'center' | 'right', vAlign: 'top' | 'middle' | 'bottom'): void;
  sortRowsAscending?(): void;
  sortRowsDescending?(): void;
  setAltText?(altTitle: string, altText: string): void;
  selectTable?(tableId?: string): void;
  selectColumn?(): void;
  selectRow?(): void;
  selectCell?(): void;
  setPageSetup?(setup: any): void;
  insertBreak?(type: string): void;
  getPageSetup?(): any;
  applyParaFmt?(fmt: any): void;
  insertComment?(text: string): void;
  getPagesData?(): { doc: any, layout: any, pages: any[] } | null;

  // Images
  insertImage(src: string, width: number, height: number): void;

  // SmartArt
  insertSmartArt(type: string, subType?: string): void;
  addSmartArtNode(): void;
  promoteSmartArtNode(): void;
  demoteSmartArtNode(): void;

  // Full Document Model (Persistence / Save / Load)
  getDocModel?(): any;
  setDocModel?(doc: any): void;
}
