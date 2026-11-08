import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawCanvasCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.CANVAS_NEW', 'New Canvas', () => {}),
      cmd('WORD.DRAW.CANVAS_RESIZE', 'Resize Canvas', () => {}),
      cmd('WORD.DRAW.CANVAS_BACKGROUND', 'Background', () => {}),
      cmd('WORD.DRAW.CANVAS_GRID', 'Grid', () => {}),
      cmd('WORD.DRAW.CANVAS_GUIDES', 'Guides', () => {}),
    ];
  }
}