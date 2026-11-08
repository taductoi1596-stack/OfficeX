import { CommandDefinition } from '../CommandDispatcher';
import { InsertPictureEngine } from './InsertPictureEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertPictureCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.PICTURE', 'Pictures', () => InsertPictureEngine.Picture('file')),
      cmd('WORD.INSERT.PICTURE_DEVICE', 'Pictures From Device', () => InsertPictureEngine.Picture('file')),
      cmd('WORD.INSERT.PICTURE_ONLINE', 'Online Pictures', () => InsertPictureEngine.Picture('online')),
      cmd('WORD.INSERT.STOCK_IMAGE', 'Stock Images', () => InsertPictureEngine.Picture('stock')),
      cmd('WORD.INSERT.SCREENSHOT', 'Screenshot', () => InsertPictureEngine.Picture('screenshot')),
      cmd('WORD.INSERT.PHOTO_ALBUM', 'Photo Album', () => InsertPictureEngine.Picture('album')),
      cmd('WORD.INSERT.DRAWING', 'Drawing', () => {}),
      // 15. Registry: Bind command WORD.INSERT.PICTURE.FILE to native file picker.
      cmd('WORD.INSERT.PICTURE.FILE', 'Pictures from This Device', () => InsertPictureEngine.Picture('file')),
      
      cmd('WORD.INSERT.PICTURE.ONLINE', 'Online Pictures', () => InsertPictureEngine.Picture('online')),
      cmd('WORD.INSERT.PICTURE.STOCK', 'Stock Images', () => InsertPictureEngine.Picture('stock')),
    ];
  }
}
