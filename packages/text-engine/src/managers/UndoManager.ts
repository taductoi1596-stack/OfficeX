import { ITextBuffer } from '../models/TextBuffer';
import { CaretManager } from './CaretManager';

export interface Command {
  execute(): void;
  undo(): void;
}

export class InsertTextCommand implements Command {
  constructor(
    private buffer: ITextBuffer,
    private caretManager: CaretManager,
    private index: number,
    private text: string,
    private prevCaretIndex: number
  ) {}

  execute(): void {
    this.buffer.insert(this.index, this.text);
    this.caretManager.setDocumentLength(this.buffer.getLength());
    this.caretManager.setCaret(this.index + this.text.length);
  }

  undo(): void {
    this.buffer.delete(this.index, this.text.length);
    this.caretManager.setDocumentLength(this.buffer.getLength());
    this.caretManager.setCaret(this.prevCaretIndex);
  }
}

export class DeleteTextCommand implements Command {
  private deletedText: string = '';

  constructor(
    private buffer: ITextBuffer,
    private caretManager: CaretManager,
    private index: number,
    private length: number,
    private prevCaretIndex: number
  ) {}

  execute(): void {
    this.deletedText = this.buffer.delete(this.index, this.length);
    this.caretManager.setDocumentLength(this.buffer.getLength());
    this.caretManager.setCaret(this.index);
  }

  undo(): void {
    this.buffer.insert(this.index, this.deletedText);
    this.caretManager.setDocumentLength(this.buffer.getLength());
    this.caretManager.setCaret(this.prevCaretIndex);
  }
}

export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  public executeCommand(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack on new action
  }

  public undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  public redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }
}
