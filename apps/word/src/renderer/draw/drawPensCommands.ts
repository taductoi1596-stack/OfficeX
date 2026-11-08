import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawPensCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.PEN', 'Pen', () => {}),
      cmd('WORD.DRAW.BALLPOINT', 'Ballpoint Pen', () => {}),
      cmd('WORD.DRAW.PENCIL', 'Pencil', () => {}),
      cmd('WORD.DRAW.CALLIGRAPHY', 'Calligraphy Pen', () => {}),
      cmd('WORD.DRAW.MARKER', 'Marker', () => {}),
      cmd('WORD.DRAW.BRUSH', 'Brush', () => {}),
      cmd('WORD.DRAW.CUSTOM', 'Custom Pen', () => {}),
      cmd('WORD.DRAW.FAVORITE', 'Favorites', () => {}),
      cmd('WORD.DRAW.COLOR', 'Color', () => {}),
      cmd('WORD.DRAW.THICKNESS', 'Thickness', () => {}),
      cmd('WORD.DRAW.OPACITY', 'Opacity', () => {}),
      cmd('WORD.DRAW.PRESSURE', 'Pressure', () => {}),
      cmd('WORD.DRAW.TIP', 'Tip Shape', () => {}),
      cmd('WORD.DRAW.SMOOTHING', 'Smoothing', () => {}),
    ];
  }
}