/**
 * speechCommands.ts
 * 
 * Command Registry for the Enterprise Speech Engine.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

export const SpeechCommands: CommandDefinition[] = [
  { id: 'WORD.SPEECH.START', name: 'Speech: Start', handler: () => {} },
  { id: 'WORD.SPEECH.STOP', name: 'Speech: Stop', handler: () => {} },
  { id: 'WORD.SPEECH.PAUSE', name: 'Speech: Pause', handler: () => {} },
  { id: 'WORD.SPEECH.RESUME', name: 'Speech: Resume', handler: () => {} },
  { id: 'WORD.SPEECH.RECOGNIZE', name: 'Speech: Recognize', handler: () => {} },
  { id: 'WORD.SPEECH.STREAM', name: 'Speech: Stream', handler: () => {} },
  { id: 'WORD.SPEECH.DETECT_LANGUAGE', name: 'Speech: Detect Language', handler: () => {} },
  { id: 'WORD.SPEECH.DETECT_SPEAKER', name: 'Speech: Detect Speaker', handler: () => {} },
  { id: 'WORD.SPEECH.EXECUTE_COMMAND', name: 'Speech: Execute Command', handler: () => {} },
  { id: 'WORD.SPEECH.EXPORT', name: 'Speech: Export Transcript', handler: () => {} },
  { id: 'WORD.SPEECH.RESET', name: 'Speech: Reset Engine', handler: () => {} },
];
