import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToolsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.UNDO', 'Undo Stroke', () => {}),
      cmd('WORD.DRAW.REDO', 'Redo Stroke', () => {}),
      cmd('WORD.DRAW.DUPLICATE', 'Duplicate Ink', () => {}),
      cmd('WORD.DRAW.DELETE', 'Delete Ink', () => {}),
      cmd('WORD.DRAW.GROUP', 'Group Ink', () => {}),
      cmd('WORD.DRAW.UNGROUP', 'Ungroup Ink', () => {}),
      cmd('WORD.DRAW.FRONT', 'Bring Forward', () => {}),
      cmd('WORD.DRAW.BACK', 'Send Backward', () => {}),
    ];
  }
}