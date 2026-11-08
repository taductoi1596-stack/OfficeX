// ─────────────────────────────────────────────────────────────────────────────
// Command Models — Core Interfaces for Word Command System
// Ref: WORD_COMMANDS.md §2
// ─────────────────────────────────────────────────────────────────────────────

export interface ICommandContext {
  documentId: string;
  // A simple reference to engines for execution (in a real app, this would be strictly typed)
  engines: Record<string, any>; 
  userToken?: string;
  payload?: any;
}

export interface ICommandResult {
  success: boolean;
  affectedNodes?: string[];
  errorMessage?: string;
}

export interface ICommand {
  id: string;
  displayName: string;
  category: string;
  
  execute(context: ICommandContext): Promise<ICommandResult> | ICommandResult;
  undo(context: ICommandContext): Promise<ICommandResult> | ICommandResult;
  redo(context: ICommandContext): Promise<ICommandResult> | ICommandResult;
  
  canExecute(context: ICommandContext): boolean;
  serialize(): string;
}
