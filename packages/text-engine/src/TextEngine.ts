import { ITextBuffer, SimpleTextBuffer } from './models/TextBuffer';
import { CaretManager } from './managers/CaretManager';
import { UndoManager, InsertTextCommand, DeleteTextCommand } from './managers/UndoManager';

export class TextEngine {
  private buffer: ITextBuffer;
  private caretManager: CaretManager;
  private undoManager: UndoManager;

  constructor() {
    this.buffer = new SimpleTextBuffer();
    this.caretManager = new CaretManager();
    this.undoManager = new UndoManager();
  }

  public insertText(text: string): void {
    const selection = this.caretManager.getNormalizedSelection();
    const prevCaretIndex = this.caretManager.getCaret().index;

    // If text is selected, delete it first
    if (selection && selection.startIndex !== selection.endIndex) {
      const deleteCmd = new DeleteTextCommand(
        this.buffer,
        this.caretManager,
        selection.startIndex,
        selection.endIndex - selection.startIndex,
        prevCaretIndex
      );
      this.undoManager.executeCommand(deleteCmd);
      this.caretManager.clearSelection();
    }

    const currentIndex = this.caretManager.getCaret().index;
    const insertCmd = new InsertTextCommand(
      this.buffer,
      this.caretManager,
      currentIndex,
      text,
      prevCaretIndex
    );
    this.undoManager.executeCommand(insertCmd);
  }

  public deleteBackward(): void {
    const selection = this.caretManager.getNormalizedSelection();
    const prevCaretIndex = this.caretManager.getCaret().index;

    if (selection && selection.startIndex !== selection.endIndex) {
      // Delete selection
      const deleteCmd = new DeleteTextCommand(
        this.buffer,
        this.caretManager,
        selection.startIndex,
        selection.endIndex - selection.startIndex,
        prevCaretIndex
      );
      this.undoManager.executeCommand(deleteCmd);
      this.caretManager.clearSelection();
    } else {
      // Delete one char backward
      if (prevCaretIndex > 0) {
        const deleteCmd = new DeleteTextCommand(
          this.buffer,
          this.caretManager,
          prevCaretIndex - 1,
          1,
          prevCaretIndex
        );
        this.undoManager.executeCommand(deleteCmd);
      }
    }
  }

  public undo(): void {
    this.undoManager.undo();
  }

  public redo(): void {
    this.undoManager.redo();
  }

  public getText(): string {
    return this.buffer.getText();
  }

  public getCaretIndex(): number {
    return this.caretManager.getCaret().index;
  }

  public setSelection(startIndex: number, endIndex: number): void {
    this.caretManager.setSelection(startIndex, endIndex);
  }
}
