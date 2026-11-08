/**
 * The fundamental unit of operation in the History Engine.
 * Every action that mutates the document MUST be encapsulated in a Command.
 */
export interface Command {
  /**
   * Identifies the type of command (e.g. 'InsertTextCommand')
   */
  readonly name: string;

  /**
   * Applies the change to the document.
   */
  execute(): void;

  /**
   * Reverses the change, restoring the document to its prior state.
   */
  undo(): void;

  /**
   * Re-applies the change (often identical to execute, but sometimes optimized).
   */
  redo(): void;
}
