/**
 * Interface defining the API for a Text Buffer.
 * In a real-world enterprise app, this would be backed by a Piece Table or Rope.
 */
export interface ITextBuffer {
  insert(index: number, text: string): void;
  delete(index: number, length: number): string;
  getText(index?: number, length?: number): string;
  getLength(): number;
}

/**
 * A simple String-based buffer for the initial foundation.
 */
export class SimpleTextBuffer implements ITextBuffer {
  private buffer: string = '';

  public insert(index: number, text: string): void {
    if (index < 0 || index > this.buffer.length) {
      throw new Error('Index out of bounds');
    }
    this.buffer = this.buffer.slice(0, index) + text + this.buffer.slice(index);
  }

  public delete(index: number, length: number): string {
    if (index < 0 || index + length > this.buffer.length) {
      throw new Error('Range out of bounds');
    }
    const deletedText = this.buffer.slice(index, index + length);
    this.buffer = this.buffer.slice(0, index) + this.buffer.slice(index + length);
    return deletedText;
  }

  public getText(index: number = 0, length?: number): string {
    if (length === undefined) {
      return this.buffer.slice(index);
    }
    return this.buffer.slice(index, index + length);
  }

  public getLength(): number {
    return this.buffer.length;
  }
}
