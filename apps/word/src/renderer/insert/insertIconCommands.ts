import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class InsertIconCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.ICON', 'Office Icons', () => {}),
      cmd('WORD.INSERT.SVG', 'SVG', () => {}),
      cmd('WORD.INSERT.EMOJI', 'Emoji', () => {}),
      cmd('WORD.INSERT.STICKER', 'Sticker', () => {}),

      
    ];
  }
}