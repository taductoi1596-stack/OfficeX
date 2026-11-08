import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageBordersCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.BORDER', 'Border Gallery', () => {}),
      cmd('WORD.DESIGN.BORDER_BOX', 'Box', () => {}),
      cmd('WORD.DESIGN.BORDER_SHADOW', 'Shadow', () => {}),
      cmd('WORD.DESIGN.BORDER_3D', '3D', () => {}),
      cmd('WORD.DESIGN.BORDER_CUSTOM', 'Custom Border', () => {}),
      cmd('WORD.DESIGN.BORDER_ART', 'Border Art', () => {}),
      cmd('WORD.DESIGN.BORDER_REMOVE', 'Remove Border', () => {}),
    ];
  }
}