import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class InsertCommentCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.COMMENT', 'New Comment', () => {}),
      cmd('WORD.INSERT.MENTION', 'Mention', () => {}),
      cmd('WORD.INSERT.RESOLVE', 'Resolve', () => {}),

      
    ];
  }
}