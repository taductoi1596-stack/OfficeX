import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignEffectsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.EFFECT', 'Effects', () => {}),
      cmd('WORD.DESIGN.SHADOW', 'Shadow', () => {}),
      cmd('WORD.DESIGN.REFLECTION', 'Reflection', () => {}),
      cmd('WORD.DESIGN.GLOW', 'Glow', () => {}),
      cmd('WORD.DESIGN.SOFT_EDGE', 'Soft Edge', () => {}),
      cmd('WORD.DESIGN.BEVEL', 'Bevel', () => {}),
      cmd('WORD.DESIGN.ROTATION', '3D Rotation', () => {}),
    ];
  }
}