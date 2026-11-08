/**
 * chatCommands.ts
 * 
 * Command Registry for the Enterprise AI Chat.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

const noop = () => {};

export const ChatCommands: CommandDefinition[] = [
  // --- Chat Panel ---
  { id: 'WORD.AI.CHAT.OPEN', name: 'Open AI Chat', shortcut: 'Ctrl+Shift+A', handler: () => { document.dispatchEvent(new CustomEvent('toggle-ai-chat-panel')); } },
  { id: 'WORD.AI.CHAT.CLOSE', name: 'Close AI Chat', shortcut: 'Esc', handler: noop },
  { id: 'WORD.AI.CHAT.TOGGLE', name: 'Toggle AI Chat', handler: noop },
  { id: 'WORD.AI.CHAT.PIN', name: 'Pin Chat Panel', handler: noop },
  { id: 'WORD.AI.CHAT.UNPIN', name: 'Unpin Chat Panel', handler: noop },
  { id: 'WORD.AI.CHAT.FLOAT', name: 'Floating Window', handler: noop },
  { id: 'WORD.AI.CHAT.DOCK', name: 'Dock Window', handler: noop },

  // --- Conversation ---
  { id: 'WORD.AI.CONVERSATION.NEW', name: 'New Conversation', shortcut: 'Ctrl+N', handler: noop },
  { id: 'WORD.AI.CONVERSATION.OPEN', name: 'Open Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.CLOSE', name: 'Close Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.RENAME', name: 'Rename Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.DELETE', name: 'Delete Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.DUPLICATE', name: 'Duplicate Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.PIN', name: 'Pin Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.UNPIN', name: 'Unpin Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.ARCHIVE', name: 'Archive Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.UNARCHIVE', name: 'Unarchive Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.SHARE', name: 'Share Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.EXPORT', name: 'Export Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.IMPORT', name: 'Import Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.SEARCH', name: 'Search Conversation', handler: noop },
  { id: 'WORD.AI.CONVERSATION.CLEAR', name: 'Clear Conversation', handler: noop },

  // --- Prompt ---
  { id: 'WORD.AI.PROMPT.SEND', name: 'Send Prompt', shortcut: 'Enter', handler: noop },
  { id: 'WORD.AI.PROMPT.MULTILINE', name: 'New Line', shortcut: 'Shift+Enter', handler: noop },
  { id: 'WORD.AI.PROMPT.STOP', name: 'Stop Streaming', shortcut: 'Esc', handler: noop },
  { id: 'WORD.AI.PROMPT.RETRY', name: 'Retry', shortcut: 'Ctrl+R', handler: noop },
  { id: 'WORD.AI.PROMPT.REGENERATE', name: 'Regenerate', shortcut: 'Ctrl+Shift+R', handler: noop },
  { id: 'WORD.AI.PROMPT.EDIT', name: 'Edit Prompt', handler: noop },
  { id: 'WORD.AI.PROMPT.COPY', name: 'Copy Prompt', handler: noop },
  { id: 'WORD.AI.PROMPT.DELETE', name: 'Delete Prompt', handler: noop },
  { id: 'WORD.AI.PROMPT.SAVE', name: 'Save Prompt', handler: noop },
  { id: 'WORD.AI.PROMPT.TEMPLATE', name: 'Prompt Template', handler: noop },

  // --- Streaming ---
  { id: 'WORD.AI.STREAM.START', name: 'Start Stream', handler: noop },
  { id: 'WORD.AI.STREAM.STOP', name: 'Stop Stream', handler: noop },
  { id: 'WORD.AI.STREAM.PAUSE', name: 'Pause Stream', handler: noop },
  { id: 'WORD.AI.STREAM.RESUME', name: 'Resume Stream', handler: noop },
  { id: 'WORD.AI.STREAM.RECONNECT', name: 'Reconnect Stream', handler: noop },
  { id: 'WORD.AI.STREAM.STATUS', name: 'Stream Status', handler: noop },

  // --- Response ---
  { id: 'WORD.AI.RESPONSE.COPY', name: 'Copy Response', shortcut: 'Ctrl+Shift+C', handler: noop },
  { id: 'WORD.AI.RESPONSE.INSERT', name: 'Insert Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.REPLACE', name: 'Replace Selection', handler: noop },
  { id: 'WORD.AI.RESPONSE.APPEND', name: 'Append Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.NEW_DOCUMENT', name: 'New Document from Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.EXPORT', name: 'Export Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.SHARE', name: 'Share Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.PRINT', name: 'Print Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.DELETE', name: 'Delete Response', handler: noop },
  { id: 'WORD.AI.RESPONSE.RETRY', name: 'Retry Response', handler: noop },

  // --- Insert ---
  { id: 'WORD.AI.INSERT.CURSOR', name: 'Insert at Cursor', handler: noop },
  { id: 'WORD.AI.INSERT.BELOW', name: 'Insert Below', handler: noop },
  { id: 'WORD.AI.INSERT.ABOVE', name: 'Insert Above', handler: noop },
  { id: 'WORD.AI.INSERT.CLIPBOARD', name: 'Insert to Clipboard', handler: noop },
  { id: 'WORD.AI.INSERT.NEW_PAGE', name: 'Insert in New Page', handler: noop },
  { id: 'WORD.AI.INSERT.NEW_DOCUMENT', name: 'Insert in New Document', handler: noop },

  // --- Replace ---
  { id: 'WORD.AI.REPLACE.SELECTION', name: 'Replace Selection', handler: noop },
  { id: 'WORD.AI.REPLACE.PARAGRAPH', name: 'Replace Paragraph', handler: noop },
  { id: 'WORD.AI.REPLACE.PAGE', name: 'Replace Page', handler: noop },
  { id: 'WORD.AI.REPLACE.DOCUMENT', name: 'Replace Document', handler: noop },

  // --- Attachments ---
  { id: 'WORD.AI.ATTACH.FILE', name: 'Attach File', handler: noop },
  { id: 'WORD.AI.ATTACH.IMAGE', name: 'Attach Image', handler: noop },
  { id: 'WORD.AI.ATTACH.DOCUMENT', name: 'Attach Document', handler: noop },
  { id: 'WORD.AI.ATTACH.PDF', name: 'Attach PDF', handler: noop },
  { id: 'WORD.AI.ATTACH.EXCEL', name: 'Attach Excel', handler: noop },
  { id: 'WORD.AI.ATTACH.POWERPOINT', name: 'Attach PowerPoint', handler: noop },
  { id: 'WORD.AI.ATTACH.REMOVE', name: 'Remove Attachment', handler: noop },
  { id: 'WORD.AI.ATTACH.CLEAR', name: 'Clear Attachments', handler: noop },

  // --- Context ---
  { id: 'WORD.AI.CONTEXT.SELECTION', name: 'Context: Selection', handler: noop },
  { id: 'WORD.AI.CONTEXT.PARAGRAPH', name: 'Context: Paragraph', handler: noop },
  { id: 'WORD.AI.CONTEXT.PAGE', name: 'Context: Page', handler: noop },
  { id: 'WORD.AI.CONTEXT.SECTION', name: 'Context: Section', handler: noop },
  { id: 'WORD.AI.CONTEXT.DOCUMENT', name: 'Context: Document', handler: noop },
  { id: 'WORD.AI.CONTEXT.MULTI_DOCUMENT', name: 'Context: Multi-Document', handler: noop },
  { id: 'WORD.AI.CONTEXT.WORKSPACE', name: 'Context: Workspace', handler: noop },
  { id: 'WORD.AI.CONTEXT.CLIPBOARD', name: 'Context: Clipboard', handler: noop },
  { id: 'WORD.AI.CONTEXT.CLEAR', name: 'Clear Context', handler: noop },

  // --- History ---
  { id: 'WORD.AI.HISTORY.OPEN', name: 'Open History', handler: noop },
  { id: 'WORD.AI.HISTORY.SEARCH', name: 'Search History', handler: noop },
  { id: 'WORD.AI.HISTORY.RESTORE', name: 'Restore History', handler: noop },
  { id: 'WORD.AI.HISTORY.DELETE', name: 'Delete History', handler: noop },
  { id: 'WORD.AI.HISTORY.CLEAR', name: 'Clear History', handler: noop },
  { id: 'WORD.AI.HISTORY.EXPORT', name: 'Export History', handler: noop },

  // --- Export ---
  { id: 'WORD.AI.EXPORT.DOCX', name: 'Export DOCX', handler: noop },
  { id: 'WORD.AI.EXPORT.PDF', name: 'Export PDF', handler: noop },
  { id: 'WORD.AI.EXPORT.HTML', name: 'Export HTML', handler: noop },
  { id: 'WORD.AI.EXPORT.MARKDOWN', name: 'Export Markdown', handler: noop },
  { id: 'WORD.AI.EXPORT.TXT', name: 'Export TXT', handler: noop },
  { id: 'WORD.AI.EXPORT.JSON', name: 'Export JSON', handler: noop },
  { id: 'WORD.AI.EXPORT.XML', name: 'Export XML', handler: noop },

  // --- Provider ---
  { id: 'WORD.AI.PROVIDER.OPEN', name: 'Open Provider Settings', handler: noop },
  { id: 'WORD.AI.PROVIDER.SELECT', name: 'Select Provider', handler: noop },
  { id: 'WORD.AI.PROVIDER.REFRESH', name: 'Refresh Provider', handler: noop },
  { id: 'WORD.AI.PROVIDER.TEST', name: 'Test Provider Connection', handler: noop },
  { id: 'WORD.AI.PROVIDER.STATUS', name: 'Provider Status', handler: noop },

  // --- Model ---
  { id: 'WORD.AI.MODEL.OPEN', name: 'Open Model Settings', handler: noop },
  { id: 'WORD.AI.MODEL.SELECT', name: 'Select Model', handler: noop },
  { id: 'WORD.AI.MODEL.REFRESH', name: 'Refresh Models', handler: noop },
  { id: 'WORD.AI.MODEL.INFO', name: 'Model Info', handler: noop },
  { id: 'WORD.AI.MODEL.COMPARE', name: 'Compare Models', handler: noop },

  // --- Settings ---
  { id: 'WORD.AI.SETTINGS.OPEN', name: 'Open AI Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.PROVIDER', name: 'Provider Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.MODEL', name: 'Model Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.MEMORY', name: 'Memory Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.CONTEXT', name: 'Context Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.STREAMING', name: 'Streaming Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.SECURITY', name: 'Security Settings', handler: noop },
  { id: 'WORD.AI.SETTINGS.RESET', name: 'Reset Settings', handler: noop },

  // --- Developer ---
  { id: 'WORD.AI.DEV.LOGS', name: 'AI Logs', handler: noop },
  { id: 'WORD.AI.DEV.DEBUG', name: 'AI Debug Mode', handler: noop },
  { id: 'WORD.AI.DEV.PROFILER', name: 'AI Profiler', handler: noop },
  { id: 'WORD.AI.DEV.TELEMETRY', name: 'AI Telemetry', handler: noop },
  { id: 'WORD.AI.DEV.RELOAD', name: 'Reload AI Engine', handler: noop },
  { id: 'WORD.AI.DEV.RESET', name: 'Reset AI Engine', handler: noop },

  // --- Backend Workflow Commands (from Module 28) ---
  { id: 'WORD.AI.CHAT.START', name: 'Chat: Start Workflow', handler: noop },
  { id: 'WORD.AI.CHAT.CONTEXT', name: 'Chat: Load Context', handler: noop },
  { id: 'WORD.AI.CHAT.MEMORY', name: 'Chat: Load Memory', handler: noop },
  { id: 'WORD.AI.CHAT.PROMPT', name: 'Chat: Build Prompt', handler: noop },
  { id: 'WORD.AI.CHAT.PROVIDER', name: 'Chat: Route Provider', handler: noop },
  { id: 'WORD.AI.CHAT.MODEL', name: 'Chat: Route Model', handler: noop },
  { id: 'WORD.AI.CHAT.EXECUTE', name: 'Chat: Execute AI', handler: noop },
  { id: 'WORD.AI.CHAT.STREAM', name: 'Chat: Stream Response', handler: noop },
  { id: 'WORD.AI.CHAT.TOOLS', name: 'Chat: Execute Tools', handler: noop },
  { id: 'WORD.AI.CHAT.RENDER', name: 'Chat: Render Response', handler: noop },
  { id: 'WORD.AI.CHAT.CANCEL', name: 'Chat: Cancel Workflow', handler: noop },
  { id: 'WORD.AI.CHAT.SAVE', name: 'Chat: Save Conversation', handler: noop },
  { id: 'WORD.AI.CHAT.COMPLETE', name: 'Chat: Complete Workflow', handler: noop },
];
