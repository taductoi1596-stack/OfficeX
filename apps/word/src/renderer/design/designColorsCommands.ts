import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignColorsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.COLORS', 'Theme Colors', () => {}),
      cmd('WORD.DESIGN.ACCENT_COLORS', 'Accent Colors', () => {}),
      cmd('WORD.DESIGN.CUSTOM_COLORS', 'Custom Colors', () => {}),
      cmd('WORD.DESIGN.RESET_COLORS', 'Reset Colors', () => {}),
    ];
  }
}