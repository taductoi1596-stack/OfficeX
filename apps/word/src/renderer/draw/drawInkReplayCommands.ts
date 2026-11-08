import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkReplayCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.REPLAY', 'Replay', () => {}),
      cmd('WORD.DRAW.REPLAY_PAUSE', 'Pause', () => {}),
      cmd('WORD.DRAW.REPLAY_STOP', 'Stop', () => {}),
      cmd('WORD.DRAW.REPLAY_SPEED', 'Speed', () => {}),
    ];
  }
}