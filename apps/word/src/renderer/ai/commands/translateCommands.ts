/**
 * translateCommands.ts
 * 
 * Command Registry for the AI Translate subsystem.
 * Exposes standardized Command IDs for all Translation features.
 */

export interface CommandDefinition {
  id: string;
  name: string;
  shortcut?: string;
  handler: (api: any, payload?: unknown) => void;
}

export const TranslateCommands: CommandDefinition[] = [
  // --- Panel Commands ---
  { id: 'WORD.AI.TRANSLATE.OPEN', name: 'Open Translation Panel', shortcut: 'Ctrl+Shift+T', handler: () => { document.dispatchEvent(new CustomEvent('toggle-ai-translate-panel')); } },
  { id: 'WORD.AI.TRANSLATE.CLOSE', name: 'Close Translation Panel', shortcut: 'Esc', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TOGGLE', name: 'Toggle Translation Panel', handler: () => {} },

  // --- Translation Commands ---
  { id: 'WORD.AI.TRANSLATE.RUN', name: 'Translate', shortcut: 'Ctrl+Enter', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.STOP', name: 'Stop Translation', shortcut: 'Esc', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.CANCEL', name: 'Cancel Translation', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.RETRY', name: 'Retry Translation', shortcut: 'Ctrl+R', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.REGENERATE', name: 'Generate Alternative Translation', shortcut: 'Ctrl+Shift+G', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.RESET', name: 'Reset Translation Panel', handler: () => {} },

  // --- Scope Commands ---
  { id: 'WORD.AI.TRANSLATE.SCOPE.SELECTION', name: 'Scope: Selection', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.PARAGRAPH', name: 'Scope: Paragraph', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.PAGE', name: 'Scope: Page', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.SECTION', name: 'Scope: Section', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.CHAPTER', name: 'Scope: Chapter', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.DOCUMENT', name: 'Scope: Document', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.MULTI_DOCUMENT', name: 'Scope: Multi-Document', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.CUSTOM', name: 'Scope: Custom', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SCOPE.CLIPBOARD', name: 'Scope: Clipboard', handler: () => {} },

  // --- Source Language Commands ---
  { id: 'WORD.AI.TRANSLATE.SOURCE.AUTO', name: 'Source: Auto Detect', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.ENGLISH', name: 'Source: English', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.VIETNAMESE', name: 'Source: Vietnamese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.CHINESE', name: 'Source: Chinese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.JAPANESE', name: 'Source: Japanese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.KOREAN', name: 'Source: Korean', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.FRENCH', name: 'Source: French', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.GERMAN', name: 'Source: German', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.SPANISH', name: 'Source: Spanish', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.ARABIC', name: 'Source: Arabic', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SOURCE.CUSTOM', name: 'Source: Custom', handler: () => {} },

  // --- Target Language Commands ---
  { id: 'WORD.AI.TRANSLATE.TARGET.ENGLISH', name: 'Target: English', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.VIETNAMESE', name: 'Target: Vietnamese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.CHINESE', name: 'Target: Chinese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.JAPANESE', name: 'Target: Japanese', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.KOREAN', name: 'Target: Korean', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.FRENCH', name: 'Target: French', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.GERMAN', name: 'Target: German', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.SPANISH', name: 'Target: Spanish', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.ARABIC', name: 'Target: Arabic', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.TARGET.CUSTOM', name: 'Target: Custom', handler: () => {} },

  // --- Translation Mode Commands ---
  { id: 'WORD.AI.TRANSLATE.MODE.LITERAL', name: 'Mode: Literal', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.NATURAL', name: 'Mode: Natural', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.PROFESSIONAL', name: 'Mode: Professional', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.ACADEMIC', name: 'Mode: Academic', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.BUSINESS', name: 'Mode: Business', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.LEGAL', name: 'Mode: Legal', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.MEDICAL', name: 'Mode: Medical', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.TECHNICAL', name: 'Mode: Technical', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.MARKETING', name: 'Mode: Marketing', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.FRIENDLY', name: 'Mode: Friendly', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.FORMAL', name: 'Mode: Formal', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.MODE.CUSTOM', name: 'Mode: Custom', handler: () => {} },

  // --- Insert Commands ---
  { id: 'WORD.AI.TRANSLATE.REPLACE', name: 'Replace Selection', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.INSERT_ABOVE', name: 'Insert Above', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.INSERT_BELOW', name: 'Insert Below', shortcut: 'Ctrl+Shift+Enter', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.NEW_DOCUMENT', name: 'Create New Document', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.APPEND', name: 'Append Translation', handler: () => {} },

  // --- Copy Commands ---
  { id: 'WORD.AI.TRANSLATE.COPY', name: 'Copy Translation', shortcut: 'Ctrl+Shift+C', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.COPY.TEXT', name: 'Copy as Text', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.COPY.RTF', name: 'Copy as RTF', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.COPY.HTML', name: 'Copy as HTML', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.COPY.MARKDOWN', name: 'Copy as Markdown', handler: () => {} },

  // --- Export Commands ---
  { id: 'WORD.AI.TRANSLATE.EXPORT.DOCX', name: 'Export DOCX', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.PDF', name: 'Export PDF', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.HTML', name: 'Export HTML', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.MARKDOWN', name: 'Export Markdown', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.TXT', name: 'Export TXT', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.JSON', name: 'Export JSON', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.XML', name: 'Export XML', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.RTF', name: 'Export RTF', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.EXPORT.ODT', name: 'Export ODT', handler: () => {} },

  // --- Translation Memory Commands ---
  { id: 'WORD.AI.TM.OPEN', name: 'TM: Open', handler: () => {} },
  { id: 'WORD.AI.TM.SEARCH', name: 'TM: Search', handler: () => {} },
  { id: 'WORD.AI.TM.SUGGEST', name: 'TM: Suggest', handler: () => {} },
  { id: 'WORD.AI.TM.EXACT_MATCH', name: 'TM: Exact Match', handler: () => {} },
  { id: 'WORD.AI.TM.FUZZY_MATCH', name: 'TM: Fuzzy Match', handler: () => {} },
  { id: 'WORD.AI.TM.SEMANTIC_MATCH', name: 'TM: Semantic Match', handler: () => {} },
  { id: 'WORD.AI.TM.UPDATE', name: 'TM: Update', handler: () => {} },
  { id: 'WORD.AI.TM.DELETE', name: 'TM: Delete', handler: () => {} },
  { id: 'WORD.AI.TM.IMPORT', name: 'TM: Import', handler: () => {} },
  { id: 'WORD.AI.TM.EXPORT', name: 'TM: Export', handler: () => {} },
  { id: 'WORD.AI.TM.SYNC', name: 'TM: Sync', handler: () => {} },
  { id: 'WORD.AI.TM.BACKUP', name: 'TM: Backup', handler: () => {} },
  { id: 'WORD.AI.TM.RESTORE', name: 'TM: Restore', handler: () => {} },
  { id: 'WORD.AI.TM.STATISTICS', name: 'TM: Statistics', handler: () => {} },

  // --- Corporate Dictionary Commands ---
  { id: 'WORD.AI.GLOSSARY.OPEN', name: 'Glossary: Open', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.SEARCH', name: 'Glossary: Search', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.ADD', name: 'Glossary: Add', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.EDIT', name: 'Glossary: Edit', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.DELETE', name: 'Glossary: Delete', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.IMPORT', name: 'Glossary: Import', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.EXPORT', name: 'Glossary: Export', handler: () => {} },
  { id: 'WORD.AI.GLOSSARY.SYNC', name: 'Glossary: Sync', handler: () => {} },

  // --- History Commands ---
  { id: 'WORD.AI.TRANSLATE.HISTORY.OPEN', name: 'History: Open', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.HISTORY.SEARCH', name: 'History: Search', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.HISTORY.RESTORE', name: 'History: Restore', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.HISTORY.DELETE', name: 'History: Delete', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.HISTORY.CLEAR', name: 'History: Clear', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.HISTORY.EXPORT', name: 'History: Export', handler: () => {} },

  // --- Provider Commands ---
  { id: 'WORD.AI.PROVIDER.OPEN', name: 'Provider: Open Settings', handler: () => {} },
  { id: 'WORD.AI.PROVIDER.SELECT', name: 'Provider: Select', handler: () => {} },
  { id: 'WORD.AI.PROVIDER.REFRESH', name: 'Provider: Refresh', handler: () => {} },
  { id: 'WORD.AI.MODEL.SELECT', name: 'Provider: Select Model', handler: () => {} },
  { id: 'WORD.AI.MODEL.REFRESH', name: 'Provider: Refresh Model', handler: () => {} },

  // --- Settings Commands ---
  { id: 'WORD.AI.TRANSLATE.SETTINGS.OPEN', name: 'Settings: Open', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.LANGUAGE', name: 'Settings: Language', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.MODE', name: 'Settings: Mode', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.PROVIDER', name: 'Settings: Provider', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.MODEL', name: 'Settings: Model', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.TEMPERATURE', name: 'Settings: Temperature', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.TOP_P', name: 'Settings: Top P', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.MAX_TOKENS', name: 'Settings: Max Tokens', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SETTINGS.RESET', name: 'Settings: Reset', handler: () => {} },

  // --- Pipeline Event Commands (Internal) ---
  { id: 'WORD.AI.TRANSLATE.START', name: 'Pipeline: Start', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.DETECT_LANGUAGE', name: 'Pipeline: Detect Language', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.CONTEXT', name: 'Pipeline: Context', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.PROMPT', name: 'Pipeline: Prompt', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.SECURITY', name: 'Pipeline: Security', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.CONNECT', name: 'Pipeline: Connect', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.STREAM', name: 'Pipeline: Stream', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.VALIDATE', name: 'Pipeline: Validate', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.PREVIEW', name: 'Pipeline: Preview', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.INSERT', name: 'Pipeline: Insert', handler: () => {} },
  { id: 'WORD.AI.TRANSLATE.COMPLETE', name: 'Pipeline: Complete', handler: () => {} },
];
