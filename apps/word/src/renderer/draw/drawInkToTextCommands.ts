import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToTextCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_TEXT', 'Convert Text', () => {}),
      cmd('WORD.DRAW.HANDWRITING', 'Recognize Handwriting', () => {}),
      cmd('WORD.DRAW.LANGUAGE', 'Language', () => {}),
    ];
  }
}