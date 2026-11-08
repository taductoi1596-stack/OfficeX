/**
 * audioCommands.ts
 * 
 * Command Registry for the Audio Capture Engine.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

export const AudioCommands: CommandDefinition[] = [
  { id: 'WORD.AUDIO.INITIALIZE', name: 'Audio: Initialize', handler: () => {} },
  { id: 'WORD.AUDIO.START', name: 'Audio: Start Capture', handler: () => {} },
  { id: 'WORD.AUDIO.STOP', name: 'Audio: Stop Capture', handler: () => {} },
  { id: 'WORD.AUDIO.PAUSE', name: 'Audio: Pause Capture', handler: () => {} },
  { id: 'WORD.AUDIO.RESUME', name: 'Audio: Resume Capture', handler: () => {} },
  { id: 'WORD.AUDIO.OPEN_DEVICE', name: 'Audio: Open Device', handler: () => {} },
  { id: 'WORD.AUDIO.CLOSE_DEVICE', name: 'Audio: Close Device', handler: () => {} },
  { id: 'WORD.AUDIO.SWITCH_DEVICE', name: 'Audio: Switch Device', handler: () => {} },
  { id: 'WORD.AUDIO.GET_DEVICES', name: 'Audio: Get Devices', handler: () => {} },
  { id: 'WORD.AUDIO.RESET', name: 'Audio: Reset Pipeline', handler: () => {} },
  { id: 'WORD.AUDIO.STATISTICS', name: 'Audio: Get Statistics', handler: () => {} },
];
