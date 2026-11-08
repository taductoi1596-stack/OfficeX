// ─────────────────────────────────────────────────────────────────────────────
// Align Command
// Ref: WORD_COMMANDS.md §4 (HOME TAB - Paragraph Group)
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class AlignCommand implements ICommand {
  id = 'Cmd_Align';
  displayName = 'Align Paragraph';
  category = 'Paragraph';

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
    console.log(`[AlignCommand] Undo paragraph alignment...`);
    return { success: true };
  }

  redo(context: ICommandContext): ICommandResult {
    return this.execute(context);
  }

  serialize(): string {
    return JSON.stringify({ id: this.id });
  }
}
