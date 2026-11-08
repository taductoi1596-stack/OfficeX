import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignFormatCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.FORMAT', 'Format Gallery', () => {}),
      cmd('WORD.DESIGN.FORMAT_RESET', 'Reset Formatting', () => {}),
      cmd('WORD.DESIGN.FORMAT_IMPORT', 'Import Formatting', () => {}),
      cmd('WORD.DESIGN.FORMAT_EXPORT', 'Export Formatting', () => {}),
    ];
  }
}