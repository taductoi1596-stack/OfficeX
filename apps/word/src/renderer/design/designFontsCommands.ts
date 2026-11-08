import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignFontsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.FONTS', 'Theme Fonts', () => {}),
      cmd('WORD.DESIGN.HEADING_FONT', 'Heading Font', () => {}),
      cmd('WORD.DESIGN.BODY_FONT', 'Body Font', () => {}),
      cmd('WORD.DESIGN.FONT_PAIR', 'Custom Font Pair', () => {}),
      cmd('WORD.DESIGN.FONT_RESET', 'Reset Fonts', () => {}),
    ];
  }
}