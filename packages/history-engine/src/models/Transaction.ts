import { Command } from './Command';

/**
 * A Transaction is a Composite Command.
 * It groups multiple granular commands into a single undoable action.
 * Example: "Insert Image" = InsertCommand + ResizeCommand + WrapTextCommand
 */
export class Transaction implements Command {
  public readonly name: string;
  private commands: Command[] = [];

  constructor(name: string = 'Transaction') {
    this.name = name;
  }

  public add(command: Command): void {
    this.commands.push(command);
  }

  public execute(): void {
    for (const cmd of this.commands) {
      cmd.execute();
    }
  }

  /**
   * Undoes all commands in reverse order.
   */
  public undo(): void {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  /**
   * Redoes all commands in the original order.
   */
  public redo(): void {
    for (let i = 0; i < this.commands.length; i++) {
      this.commands[i].redo();
    }
  }
}
