import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignStyleSetCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.STYLE_SET', 'Style Gallery', () => {}),
      cmd('WORD.DESIGN.STYLE_MODERN', 'Modern', () => {}),
      cmd('WORD.DESIGN.STYLE_CLASSIC', 'Classic', () => {}),
      cmd('WORD.DESIGN.STYLE_ELEGANT', 'Elegant', () => {}),
      cmd('WORD.DESIGN.STYLE_PRO', 'Professional', () => {}),
      cmd('WORD.DESIGN.STYLE_MINIMAL', 'Minimal', () => {}),
      cmd('WORD.DESIGN.STYLE_CUSTOM', 'Custom Style Set', () => {}),
      cmd('WORD.DESIGN.STYLE_SAVE', 'Save Style Set', () => {}),
    ];
  }
}