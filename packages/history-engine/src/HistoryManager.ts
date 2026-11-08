import { Command } from './models/Command';
import { Transaction } from './models/Transaction';

export class HistoryManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  
  // Maximum number of operations kept in memory
  private limit: number = 1000;

  // The active transaction, if any
  private currentTransaction: Transaction | null = null;

  public beginTransaction(name: string): void {
    if (this.currentTransaction) {
      throw new Error('A transaction is already in progress.');
    }
    this.currentTransaction = new Transaction(name);
  }

  public commitTransaction(): void {
    if (!this.currentTransaction) {
      throw new Error('No transaction in progress.');
    }
    
    // We execute the transaction to save it into history
    // Since individual commands within transaction might have been executed live,
    // in real implementation, you might just push without executing again.
    // For this boilerplate, we'll push it to undoStack directly.
    this.pushCommand(this.currentTransaction);
    this.currentTransaction = null;
  }

  /**
   * Executes a command. If a transaction is open, it gets added to the transaction.
   * If not, it executes immediately and goes to the undo stack.
   */
  public executeCommand(command: Command): void {
    command.execute();

    if (this.currentTransaction) {
      this.currentTransaction.add(command);
    } else {
      this.pushCommand(command);
    }
  }

  private pushCommand(command: Command): void {
    this.undoStack.push(command);
    // Clear redo stack because a new divergent history branch started
    this.redoStack = [];

    if (this.undoStack.length > this.limit) {
      this.undoStack.shift(); // Evict the oldest command
    }
  }

  public undo(): void {
    if (this.undoStack.length === 0) return;
    
    const command = this.undoStack.pop()!;
    command.undo();
    this.redoStack.push(command);
  }

  public redo(): void {
    if (this.redoStack.length === 0) return;
    
    const command = this.redoStack.pop()!;
    command.redo();
    this.undoStack.push(command);
  }

  public get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
