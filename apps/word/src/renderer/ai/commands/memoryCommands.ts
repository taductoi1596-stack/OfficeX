/**
 * memoryCommands.ts
 * 
 * Command Registry for the Enterprise Chat Memory Engine.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

const noop = () => {};

export const MemoryCommands: CommandDefinition[] = [
  { id: 'WORD.AI.MEMORY.OPEN', name: 'Open Memory Settings', handler: noop },
  { id: 'WORD.AI.MEMORY.SEARCH', name: 'Search Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.RETRIEVE', name: 'Retrieve Memory Context', handler: noop },
  { id: 'WORD.AI.MEMORY.STORE', name: 'Store Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.UPDATE', name: 'Update Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.DELETE', name: 'Delete Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.COMPRESS', name: 'Compress Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.EXPORT', name: 'Export Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.IMPORT', name: 'Import Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.SYNC', name: 'Sync Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.BACKUP', name: 'Backup Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.RESTORE', name: 'Restore Memory', handler: noop },
  { id: 'WORD.AI.MEMORY.STATISTICS', name: 'Memory Statistics', handler: noop },
  { id: 'WORD.AI.MEMORY.SETTINGS', name: 'Memory Settings', handler: noop },
];
