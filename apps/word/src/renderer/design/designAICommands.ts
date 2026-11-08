import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignAICommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.AI.DESIGN_THEME', 'Suggest Theme', () => {}),
      cmd('WORD.AI.DESIGN_FORMAT', 'Improve Formatting', () => {}),
      cmd('WORD.AI.DESIGN_MODERN', 'Modernize Document', () => {}),
      cmd('WORD.AI.DESIGN_CORPORATE', 'Corporate Style', () => {}),
      cmd('WORD.AI.DESIGN_ACADEMIC', 'Academic Style', () => {}),
      cmd('WORD.AI.DESIGN_ACCESSIBILITY', 'Accessibility Check', () => {}),
      cmd('WORD.AI.DESIGN_COVER', 'Generate Cover', () => {}),
    ];
  }
}