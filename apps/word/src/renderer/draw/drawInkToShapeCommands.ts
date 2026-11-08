import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToShapeCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_SHAPE', 'Convert Shape', () => {}),
      cmd('WORD.DRAW.SHAPE_RECOGNITION', 'Recognize Shape', () => {}),
      cmd('WORD.DRAW.SHAPE_AUTOCORRECT', 'Auto Correct Shape', () => {}),
    ];
  }
}