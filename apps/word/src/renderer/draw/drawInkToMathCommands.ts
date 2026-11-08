import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToMathCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_MATH', 'Convert Equation', () => {}),
      cmd('WORD.DRAW.FORMULA', 'Recognize Formula', () => {}),
      cmd('WORD.DRAW.MATH_EDITOR', 'Math Editor', () => {}),
    ];
  }
}