import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignSpacingCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.SPACING', 'Paragraph Spacing', () => {}),
      cmd('WORD.DESIGN.SPACING_COMPACT', 'Compact', () => {}),
      cmd('WORD.DESIGN.SPACING_OPEN', 'Open', () => {}),
      cmd('WORD.DESIGN.SPACING_RELAXED', 'Relaxed', () => {}),
      cmd('WORD.DESIGN.SPACING_NONE', 'No Paragraph Space', () => {}),
      cmd('WORD.DESIGN.SPACING_CUSTOM', 'Custom Spacing', () => {}),
    ];
  }
}