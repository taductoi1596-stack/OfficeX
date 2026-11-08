/**
 * toolCommands.ts
 * 
 * Command Registry for the Enterprise AI Tool Calling Engine.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

const noop = () => {};

export const ToolCommands: CommandDefinition[] = [
  { id: 'WORD.AI.TOOL.REGISTER', name: 'Register AI Tool', handler: noop },
  { id: 'WORD.AI.TOOL.EXECUTE', name: 'Execute AI Tool', handler: noop },
  { id: 'WORD.AI.TOOL.CANCEL', name: 'Cancel Tool Execution', handler: noop },
  { id: 'WORD.AI.TOOL.VALIDATE', name: 'Validate Tool Schema', handler: noop },
  { id: 'WORD.AI.TOOL.PERMISSION', name: 'Request Tool Permission', handler: noop },
  { id: 'WORD.AI.TOOL.STATISTICS', name: 'Tool Usage Statistics', handler: noop },
  { id: 'WORD.AI.TOOL.RESET', name: 'Reset Tool Engine', handler: noop },
  { id: 'WORD.AI.TOOL.REGISTRY', name: 'Get Tool Registry', handler: noop },
];
