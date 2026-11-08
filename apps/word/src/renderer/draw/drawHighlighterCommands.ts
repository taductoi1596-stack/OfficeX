import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawHighlighterCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.HIGHLIGHT', 'Highlighter', () => {}),
      cmd('WORD.DRAW.HIGHLIGHT_COLOR', 'Highlighter Color', () => {}),
    ];
  }
}