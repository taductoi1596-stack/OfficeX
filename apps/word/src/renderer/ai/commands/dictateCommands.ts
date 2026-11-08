/**
 * dictateCommands.ts
 * 
 * Command Registry for the AI Dictate subsystem.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

const noop = () => {};

export const DictateCommands: CommandDefinition[] = [
  // --- Recording Commands ---
  { id: 'WORD.DICTATE.START', name: 'Start Dictation', shortcut: 'Ctrl+Alt+R', handler: noop },
  { id: 'WORD.DICTATE.STOP', name: 'Stop Dictation', shortcut: 'Ctrl+Alt+S', handler: noop },
  { id: 'WORD.DICTATE.PAUSE', name: 'Pause Dictation', shortcut: 'Ctrl+Alt+P', handler: noop },
  { id: 'WORD.DICTATE.RESUME', name: 'Resume Dictation', shortcut: 'Ctrl+Alt+Shift+P', handler: noop },
  { id: 'WORD.DICTATE.RESTART', name: 'Restart Recording', handler: noop },
  { id: 'WORD.DICTATE.CANCEL', name: 'Cancel Dictation', shortcut: 'Esc', handler: noop },

  // --- Streaming Commands ---
  { id: 'WORD.DICTATE.STREAM.START', name: 'Start Streaming', handler: noop },
  { id: 'WORD.DICTATE.STREAM.STOP', name: 'Stop Streaming', handler: noop },
  { id: 'WORD.DICTATE.STREAM.RECONNECT', name: 'Reconnect Streaming', handler: noop },
  { id: 'WORD.DICTATE.STREAM.RESET', name: 'Reset Streaming', handler: noop },
  { id: 'WORD.DICTATE.STREAM.STATUS', name: 'Streaming Status', handler: noop },

  // --- Recognition Commands ---
  { id: 'WORD.DICTATE.RECOGNIZE', name: 'Recognize Speech', handler: noop },
  { id: 'WORD.DICTATE.RECOGNIZE.OFFLINE', name: 'Recognize Offline', handler: noop },
  { id: 'WORD.DICTATE.RECOGNIZE.ONLINE', name: 'Recognize Online', handler: noop },
  { id: 'WORD.DICTATE.RECOGNIZE.HYBRID', name: 'Recognize Hybrid', handler: noop },
  { id: 'WORD.DICTATE.RECOGNIZE.RETRY', name: 'Retry Recognition', handler: noop },

  // --- Language Commands ---
  { id: 'WORD.DICTATE.LANGUAGE.AUTO', name: 'Language: Auto Detect', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.ENGLISH', name: 'Language: English', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.VIETNAMESE', name: 'Language: Vietnamese', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.CHINESE', name: 'Language: Chinese', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.JAPANESE', name: 'Language: Japanese', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.KOREAN', name: 'Language: Korean', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.FRENCH', name: 'Language: French', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.GERMAN', name: 'Language: German', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.SPANISH', name: 'Language: Spanish', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.ARABIC', name: 'Language: Arabic', handler: noop },
  { id: 'WORD.DICTATE.LANGUAGE.CUSTOM', name: 'Language: Custom', handler: noop },

  // --- Microphone Commands ---
  { id: 'WORD.DICTATE.MIC.OPEN', name: 'Open Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.CLOSE', name: 'Close Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.MUTE', name: 'Mute Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.UNMUTE', name: 'Unmute Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.SELECT', name: 'Select Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.REFRESH', name: 'Refresh Microphones', handler: noop },
  { id: 'WORD.DICTATE.MIC.TEST', name: 'Test Microphone', handler: noop },
  { id: 'WORD.DICTATE.MIC.VOLUME', name: 'Microphone Volume', handler: noop },
  { id: 'WORD.DICTATE.MIC.NOISE_REDUCTION', name: 'Toggle Noise Reduction', handler: noop },
  { id: 'WORD.DICTATE.MIC.ECHO_CANCEL', name: 'Toggle Echo Cancellation', handler: noop },

  // --- VAD Commands ---
  { id: 'WORD.DICTATE.VAD.ENABLE', name: 'Enable VAD', handler: noop },
  { id: 'WORD.DICTATE.VAD.DISABLE', name: 'Disable VAD', handler: noop },
  { id: 'WORD.DICTATE.VAD.AUTO', name: 'Auto VAD', handler: noop },
  { id: 'WORD.DICTATE.VAD.THRESHOLD', name: 'Set VAD Threshold', handler: noop },

  // --- Formatting Commands ---
  { id: 'WORD.DICTATE.FORMAT.AUTO', name: 'Auto Formatting', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.PUNCTUATION', name: 'Auto Punctuation', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.CAPITALIZATION', name: 'Auto Capitalization', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.PARAGRAPHS', name: 'Auto Paragraphs', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.LISTS', name: 'Format Lists', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.TABLES', name: 'Format Tables', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.HEADINGS', name: 'Format Headings', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.GRAMMAR', name: 'Grammar Correction', handler: noop },
  { id: 'WORD.DICTATE.FORMAT.SPELLING', name: 'Spelling Correction', handler: noop },

  // --- Voice Commands Engine ---
  { id: 'WORD.DICTATE.VOICE_COMMANDS.ENABLE', name: 'Enable Voice Commands', handler: noop },
  { id: 'WORD.DICTATE.VOICE_COMMANDS.DISABLE', name: 'Disable Voice Commands', handler: noop },
  { id: 'WORD.DICTATE.VOICE_COMMANDS.TRAIN', name: 'Train Voice Commands', handler: noop },
  { id: 'WORD.DICTATE.VOICE_COMMANDS.RESET', name: 'Reset Voice Commands', handler: noop },
  { id: 'WORD.DICTATE.VOICE_COMMANDS.TEST', name: 'Test Voice Commands', handler: noop },

  // --- Speaker Commands ---
  { id: 'WORD.DICTATE.SPEAKER.AUTO', name: 'Auto Speaker Detection', handler: noop },
  { id: 'WORD.DICTATE.SPEAKER.ENABLE', name: 'Enable Speaker ID', handler: noop },
  { id: 'WORD.DICTATE.SPEAKER.DISABLE', name: 'Disable Speaker ID', handler: noop },
  { id: 'WORD.DICTATE.SPEAKER.PROFILE', name: 'Speaker Profile', handler: noop },
  { id: 'WORD.DICTATE.SPEAKER.TRAIN', name: 'Train Speaker ID', handler: noop },
  { id: 'WORD.DICTATE.SPEAKER.DELETE', name: 'Delete Speaker Profile', handler: noop },

  // --- Insert Commands ---
  { id: 'WORD.DICTATE.INSERT', name: 'Insert Transcript', handler: noop },
  { id: 'WORD.DICTATE.REPLACE', name: 'Replace Selection', handler: noop },
  { id: 'WORD.DICTATE.INSERT_ABOVE', name: 'Insert Above', handler: noop },
  { id: 'WORD.DICTATE.INSERT_BELOW', name: 'Insert Below', shortcut: 'Ctrl+Shift+Enter', handler: noop },
  { id: 'WORD.DICTATE.NEW_DOCUMENT', name: 'Create Transcript Document', handler: noop },
  { id: 'WORD.DICTATE.APPEND', name: 'Append Transcript', handler: noop },

  // --- Clipboard Commands ---
  { id: 'WORD.DICTATE.COPY', name: 'Copy Dictation', shortcut: 'Ctrl+Shift+C', handler: noop },
  { id: 'WORD.DICTATE.COPY.TEXT', name: 'Copy as Text', handler: noop },
  { id: 'WORD.DICTATE.COPY.MARKDOWN', name: 'Copy as Markdown', handler: noop },
  { id: 'WORD.DICTATE.COPY.HTML', name: 'Copy as HTML', handler: noop },
  { id: 'WORD.DICTATE.COPY.JSON', name: 'Copy as JSON', handler: noop },

  // --- Export Commands ---
  { id: 'WORD.DICTATE.EXPORT.DOCX', name: 'Export to DOCX', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.PDF', name: 'Export to PDF', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.TXT', name: 'Export to TXT', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.HTML', name: 'Export to HTML', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.MARKDOWN', name: 'Export to Markdown', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.JSON', name: 'Export to JSON', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.XML', name: 'Export to XML', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.SRT', name: 'Export to SRT', handler: noop },
  { id: 'WORD.DICTATE.EXPORT.VTT', name: 'Export to VTT', handler: noop },

  // --- History Commands ---
  { id: 'WORD.DICTATE.HISTORY.OPEN', name: 'Open Dictation History', handler: noop },
  { id: 'WORD.DICTATE.HISTORY.SEARCH', name: 'Search History', handler: noop },
  { id: 'WORD.DICTATE.HISTORY.DELETE', name: 'Delete History Item', handler: noop },
  { id: 'WORD.DICTATE.HISTORY.RESTORE', name: 'Restore History Item', handler: noop },
  { id: 'WORD.DICTATE.HISTORY.CLEAR', name: 'Clear History', handler: noop },
  { id: 'WORD.DICTATE.HISTORY.EXPORT', name: 'Export History', handler: noop },

  // --- Audio Commands ---
  { id: 'WORD.DICTATE.AUDIO.RECORD', name: 'Record Audio', handler: noop },
  { id: 'WORD.DICTATE.AUDIO.PLAY', name: 'Play Audio', handler: noop },
  { id: 'WORD.DICTATE.AUDIO.PAUSE', name: 'Pause Audio', handler: noop },
  { id: 'WORD.DICTATE.AUDIO.STOP', name: 'Stop Audio', handler: noop },
  { id: 'WORD.DICTATE.AUDIO.DELETE', name: 'Delete Audio', handler: noop },
  { id: 'WORD.DICTATE.AUDIO.EXPORT', name: 'Export Audio', handler: noop },

  // --- Provider Commands ---
  { id: 'WORD.DICTATE.PROVIDER.OPEN', name: 'Open Provider Settings', handler: noop },
  { id: 'WORD.DICTATE.PROVIDER.SELECT', name: 'Select Provider', handler: noop },
  { id: 'WORD.DICTATE.PROVIDER.REFRESH', name: 'Refresh Providers', handler: noop },
  { id: 'WORD.DICTATE.MODEL.SELECT', name: 'Select Model', handler: noop },
  { id: 'WORD.DICTATE.MODEL.REFRESH', name: 'Refresh Models', handler: noop },

  // --- Settings Commands ---
  { id: 'WORD.DICTATE.SETTINGS.OPEN', name: 'Open Dictation Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.MICROPHONE', name: 'Microphone Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.LANGUAGE', name: 'Language Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.PROVIDER', name: 'Provider Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.MODEL', name: 'Model Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.NOISE', name: 'Noise Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.VOICE', name: 'Voice Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.STREAMING', name: 'Streaming Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.AUTO_FORMAT', name: 'Auto Format Settings', handler: noop },
  { id: 'WORD.DICTATE.SETTINGS.RESET', name: 'Reset Dictation Settings', handler: noop },
];
