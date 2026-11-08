import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignWatermarkCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.WATERMARK', 'Watermark', () => {}),
      cmd('WORD.DESIGN.WATERMARK_TEXT', 'Custom Text', () => {}),
      cmd('WORD.DESIGN.WATERMARK_IMAGE', 'Picture Watermark', () => {}),
      cmd('WORD.DESIGN.WATERMARK_REMOVE', 'Remove Watermark', () => {}),
    ];
  }
}