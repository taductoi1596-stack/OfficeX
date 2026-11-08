import { CaretPosition, TextRange, normalizeRange } from '../models/Selection';

export class CaretManager {
  private position: CaretPosition = { index: 0 };
  private selection: TextRange | null = null;
  private documentLength: number = 0;

  public setDocumentLength(length: number): void {
    this.documentLength = length;
    // Constrain position and selection
    this.position.index = Math.min(this.position.index, length);
    if (this.selection) {
      this.selection.startIndex = Math.min(this.selection.startIndex, length);
      this.selection.endIndex = Math.min(this.selection.endIndex, length);
    }
  }

  public setCaret(index: number): void {
    this.position.index = Math.max(0, Math.min(index, this.documentLength));
    this.selection = null;
  }

  public getCaret(): CaretPosition {
    return { ...this.position };
  }

  public setSelection(startIndex: number, endIndex: number): void {
    this.selection = {
      startIndex: Math.max(0, Math.min(startIndex, this.documentLength)),
      endIndex: Math.max(0, Math.min(endIndex, this.documentLength))
    };
    this.position.index = this.selection.endIndex;
  }

  public getSelection(): TextRange | null {
    return this.selection ? { ...this.selection } : null;
  }

  public clearSelection(): void {
    this.selection = null;
  }

  public getNormalizedSelection(): TextRange | null {
    if (!this.selection) return null;
    return normalizeRange(this.selection);
  }
}
