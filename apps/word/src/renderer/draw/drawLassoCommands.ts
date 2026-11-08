import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawLassoCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.LASSO', 'Lasso Select', () => {}),
      cmd('WORD.DRAW.RECT_SELECT', 'Rectangle Select', () => {}),
      cmd('WORD.DRAW.FREE_SELECT', 'Free Select', () => {}),
    ];
  }
}