import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignThemesCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.THEME', 'Themes Gallery', () => {}),
      cmd('WORD.DESIGN.THEME_BROWSE', 'Browse Themes', () => {}),
      cmd('WORD.DESIGN.THEME_SAVE', 'Save Current Theme', () => {}),
      cmd('WORD.DESIGN.THEME_RESET', 'Reset Theme', () => {}),
      cmd('WORD.DESIGN.THEME_OFFICE', 'Office Theme', () => {}),
      cmd('WORD.DESIGN.THEME_DARK', 'Dark Theme', () => {}),
      cmd('WORD.DESIGN.THEME_LIGHT', 'Light Theme', () => {}),
      cmd('WORD.DESIGN.THEME_CORPORATE', 'Corporate Theme', () => {}),
      cmd('WORD.DESIGN.THEME_ACADEMIC', 'Academic Theme', () => {}),
      cmd('WORD.DESIGN.THEME_BUSINESS', 'Business Theme', () => {}),
    ];
  }
}