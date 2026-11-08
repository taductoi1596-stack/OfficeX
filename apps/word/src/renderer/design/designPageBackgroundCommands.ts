import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageBackgroundCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.PAGE_BACKGROUND', 'Page Background', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_IMAGE', 'Background Image', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_TEXTURE', 'Background Texture', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_PATTERN', 'Background Pattern', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_REMOVE', 'Remove Background', () => {}),
    ];
  }
}