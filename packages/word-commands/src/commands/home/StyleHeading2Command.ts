// ─────────────────────────────────────────────────────────────────────────────
// Heading 2 Command
// Auto-generated from registry/home_commands.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class StyleHeading2Command implements ICommand {
  id = 'WORD.HOME.STYLE.HEADING2';
  displayName = 'Heading 2';
  category = 'Home';

  canExecute(context: ICommandContext): boolean {
    return !!context.engines.editorBridge;
  }

  execute(context: ICommandContext): ICommandResult {
    if (context.engines.editorBridge) {
      context.engines.editorBridge.applyBlock('h2');
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
