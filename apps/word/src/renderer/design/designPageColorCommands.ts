import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageColorCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.PAGE_COLOR', 'Page Color', () => {}),
      cmd('WORD.DESIGN.PAGE_GRADIENT', 'Gradient', () => {}),
      cmd('WORD.DESIGN.PAGE_TEXTURE', 'Texture', () => {}),
      cmd('WORD.DESIGN.PAGE_PATTERN', 'Pattern', () => {}),
      cmd('WORD.DESIGN.PAGE_FILL', 'Fill Effects', () => {}),
      cmd('WORD.DESIGN.PAGE_CLEAR', 'No Color', () => {}),
    ];
  }
}