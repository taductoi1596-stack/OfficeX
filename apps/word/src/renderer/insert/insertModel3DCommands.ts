import { CommandDefinition } from '../CommandDispatcher';
import { InsertPictureEngine } from './InsertPictureEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class InsertModel3DCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.MODEL3D', 'Insert 3D Model', () => InsertPictureEngine.Picture('file')),
      cmd('WORD.INSERT.MODEL3D_ONLINE', 'Online Models', () => InsertPictureEngine.Picture('online')),
      cmd('WORD.INSERT.MODEL3D_ROTATE', 'Rotate', () => {}),
      cmd('WORD.INSERT.MODEL3D_RESET', 'Reset View', () => {}),
    ];
  }
}