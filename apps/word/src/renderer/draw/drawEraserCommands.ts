import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawEraserCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.ERASER', 'Eraser', () => {}),
      cmd('WORD.DRAW.POINT_ERASER', 'Point Eraser', () => {}),
      cmd('WORD.DRAW.STROKE_ERASER', 'Stroke Eraser', () => {}),
      cmd('WORD.DRAW.OBJECT_ERASER', 'Object Eraser', () => {}),
      cmd('WORD.DRAW.CLEAR', 'Clear Ink', () => {}),
    ];
  }
}