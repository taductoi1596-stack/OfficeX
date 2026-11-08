/**
 * voiceCommands.ts
 * 
 * Command Registry for the Voice Commands Engine.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

export const VoiceCommands: CommandDefinition[] = [
  { id: 'WORD.VOICE.START', name: 'Voice: Start Engine', handler: () => {} },
  { id: 'WORD.VOICE.STOP', name: 'Voice: Stop Engine', handler: () => {} },
  { id: 'WORD.VOICE.PARSE', name: 'Voice: Parse Intent', handler: () => {} },
  { id: 'WORD.VOICE.EXECUTE', name: 'Voice: Execute Intent', handler: () => {} },
  { id: 'WORD.VOICE.VALIDATE', name: 'Voice: Validate Command', handler: () => {} },
  { id: 'WORD.VOICE.CONFIRM', name: 'Voice: Confirm Action', handler: () => {} },
  { id: 'WORD.VOICE.UNDO', name: 'Voice: Undo Last Voice Action', handler: () => {} },
  { id: 'WORD.VOICE.REDO', name: 'Voice: Redo Last Voice Action', handler: () => {} },
  { id: 'WORD.VOICE.REGISTER', name: 'Voice: Register Custom Command', handler: () => {} },
  { id: 'WORD.VOICE.HISTORY', name: 'Voice: View History', handler: () => {} },
  { id: 'WORD.VOICE.SETTINGS', name: 'Voice: Settings', handler: () => {} },
];
