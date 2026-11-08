export interface Command {
  execute(): void;
  undo(): void;
}

export class CommandManager {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  public execute(command: Command) {
    command.execute();
    this.history.push(command);
    this.redoStack = []; // clear redo stack on new action
  }

  public undo() {
    if (this.history.length > 0) {
      const command = this.history.pop()!;
      command.undo();
      this.redoStack.push(command);
    }
  }

  public redo() {
    if (this.redoStack.length > 0) {
      const command = this.redoStack.pop()!;
      command.execute();
      this.history.push(command);
    }
  }
  
  public get canUndo() {
    return this.history.length > 0;
  }
  
  public get canRedo() {
    return this.redoStack.length > 0;
  }
}
