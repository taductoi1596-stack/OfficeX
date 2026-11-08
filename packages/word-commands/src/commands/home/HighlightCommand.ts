// ─────────────────────────────────────────────────────────────────────────────
// Text Highlight Command
// Auto-generated from registry/home_commands.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class HighlightCommand implements ICommand {
  id = 'WORD.HOME.HIGHLIGHT';
  displayName = 'Text Highlight';
  category = 'Home';

  canExecute(context: ICommandContext): boolean {
    return !!context.engines.editorBridge;
  }

  execute(context: ICommandContext): ICommandResult {
    if (context.engines.editorBridge) {
      context.engines.editorBridge.applyFormat('backColor', 'yellow');
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
