// ─────────────────────────────────────────────────────────────────────────────
// Clear Clipboard Command
// Auto-generated from registry/home_commands.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class ClipboardClearCommand implements ICommand {
  id = 'WORD.HOME.CLIPBOARD.CLEAR';
  displayName = 'Clear Clipboard';
  category = 'Home';

  canExecute(context: ICommandContext): boolean {
    return !!context.engines.editorBridge;
  }

  execute(context: ICommandContext): ICommandResult {
    if (context.engines.editorBridge) {
      console.log(`[${this.id}] Executing...`);
    }
    return { success: true };
  }

  undo(context: ICommandContext): ICommandResult {
    console.log(`[${this.id}] Undo action...`);
    return { success: true };
  }

  redo(context: ICommandContext): ICommandResult {
    return this.execute(context);
  }

  serialize(): string {
    return JSON.stringify({ id: this.id });
  }
}
