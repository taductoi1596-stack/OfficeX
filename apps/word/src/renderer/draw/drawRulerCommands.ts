import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawRulerCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.RULER', 'Show Ruler', () => {}),
      cmd('WORD.DRAW.RULER_ROTATE', 'Rotate', () => {}),
      cmd('WORD.DRAW.RULER_SNAP', 'Snap', () => {}),
    ];
  }
}