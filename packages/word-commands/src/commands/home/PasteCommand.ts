// ─────────────────────────────────────────────────────────────────────────────
// Paste Command
// Auto-generated from registry/home_commands.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class PasteCommand implements ICommand {
  id = 'WORD.HOME.PASTE';
  displayName = 'Paste';
  category = 'Home';

  canExecute(context: ICommandContext): boolean {
    return !!context.engines.editorBridge;
  }

  async execute(context: ICommandContext): Promise<ICommandResult> {
    if (context.engines.editorBridge) {
      context.engines.editorBridge.paste();
    }
    return { success: true };
  }

  undo(context: ICommandContext): ICommandResult {
    console.log(`[${this.id}] Undo action...`);
    return { success: true };
  }

  async redo(context: ICommandContext): Promise<ICommandResult> {
    return this.execute(context);
  }

  serialize(): string {
    return JSON.stringify({ id: this.id });
  }
}
