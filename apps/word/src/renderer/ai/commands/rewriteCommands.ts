/**
 * Rewrite Command Registry
 * 
 * Central registry for all AI Rewrite capabilities within OfficeX Word.
 */

import { CommandDefinition } from '../../CommandDispatcher';
import { EditorAPI } from '../../editorApi';

export const RewriteCommands: CommandDefinition[] = [
  // --- Rewrite Commands ---
  { id: 'WORD.AI.REWRITE.OPEN', name: 'Open Rewrite Panel', shortcut: 'Ctrl+Shift+R', icon: 'Sparkles', handler: () => { console.log('[RewriteCommand] Opened Rewrite Panel'); } },
  { id: 'WORD.AI.REWRITE.CLOSE', name: 'Close Rewrite Panel', shortcut: 'Esc', handler: () => { console.log('[RewriteCommand] Closed Rewrite Panel'); } },
  { id: 'WORD.AI.REWRITE.RUN', name: 'Execute Rewrite', shortcut: 'Ctrl+Enter', handler: () => { console.log('[RewriteCommand] Executing Rewrite'); } },
  { id: 'WORD.AI.REWRITE.STOP', name: 'Stop Streaming', shortcut: 'Esc', handler: () => { console.log('[RewriteCommand] Stopped Streaming'); } },
  { id: 'WORD.AI.REWRITE.CANCEL', name: 'Cancel Rewrite', handler: () => { console.log('[RewriteCommand] Cancelled'); } },
  { id: 'WORD.AI.REWRITE.RETRY', name: 'Retry Current Rewrite', shortcut: 'Ctrl+R', handler: () => { console.log('[RewriteCommand] Retrying Rewrite'); } },
  { id: 'WORD.AI.REWRITE.REGENERATE', name: 'Generate New Rewrite', shortcut: 'Ctrl+Shift+G', handler: () => { console.log('[RewriteCommand] Regenerating Rewrite'); } },
  { id: 'WORD.AI.REWRITE.RESET', name: 'Reset Rewrite Panel', handler: () => { console.log('[RewriteCommand] Resetting Rewrite Panel'); } },

  // --- Rewrite Mode Commands ---
  { id: 'WORD.AI.REWRITE.IMPROVE', name: 'Improve Writing', handler: () => { console.log('[RewriteCommand] Mode: Improve'); } },
  { id: 'WORD.AI.REWRITE.PARAPHRASE', name: 'Paraphrase', handler: () => { console.log('[RewriteCommand] Mode: Paraphrase'); } },
  { id: 'WORD.AI.REWRITE.EXPAND', name: 'Expand Text', handler: () => { console.log('[RewriteCommand] Mode: Expand'); } },
  { id: 'WORD.AI.REWRITE.SHORTEN', name: 'Shorten Text', handler: () => { console.log('[RewriteCommand] Mode: Shorten'); } },
  { id: 'WORD.AI.REWRITE.CONTINUE', name: 'Continue Writing', handler: () => { console.log('[RewriteCommand] Mode: Continue'); } },
  { id: 'WORD.AI.REWRITE.SIMPLIFY', name: 'Simplify Writing', handler: () => { console.log('[RewriteCommand] Mode: Simplify'); } },
  { id: 'WORD.AI.REWRITE.PROFESSIONAL', name: 'Professional Style', handler: () => { console.log('[RewriteCommand] Mode: Professional'); } },
  { id: 'WORD.AI.REWRITE.FORMAL', name: 'Formal Style', handler: () => { console.log('[RewriteCommand] Mode: Formal'); } },
  { id: 'WORD.AI.REWRITE.FRIENDLY', name: 'Friendly Style', handler: () => { console.log('[RewriteCommand] Mode: Friendly'); } },
  { id: 'WORD.AI.REWRITE.ACADEMIC', name: 'Academic Style', handler: () => { console.log('[RewriteCommand] Mode: Academic'); } },
  { id: 'WORD.AI.REWRITE.TECHNICAL', name: 'Technical Style', handler: () => { console.log('[RewriteCommand] Mode: Technical'); } },
  { id: 'WORD.AI.REWRITE.LEGAL', name: 'Legal Style', handler: () => { console.log('[RewriteCommand] Mode: Legal'); } },
  { id: 'WORD.AI.REWRITE.MARKETING', name: 'Marketing Style', handler: () => { console.log('[RewriteCommand] Mode: Marketing'); } },
  { id: 'WORD.AI.REWRITE.BUSINESS', name: 'Business Style', handler: () => { console.log('[RewriteCommand] Mode: Business'); } },
  { id: 'WORD.AI.REWRITE.CUSTOM', name: 'Custom Rewrite', handler: () => { console.log('[RewriteCommand] Mode: Custom'); } },

  // --- Tone Commands ---
  { id: 'WORD.AI.TONE.NEUTRAL', name: 'Neutral Tone', handler: () => { console.log('[RewriteCommand] Tone: Neutral'); } },
  { id: 'WORD.AI.TONE.PROFESSIONAL', name: 'Professional Tone', handler: () => { console.log('[RewriteCommand] Tone: Professional'); } },
  { id: 'WORD.AI.TONE.FORMAL', name: 'Formal Tone', handler: () => { console.log('[RewriteCommand] Tone: Formal'); } },
  { id: 'WORD.AI.TONE.CASUAL', name: 'Casual Tone', handler: () => { console.log('[RewriteCommand] Tone: Casual'); } },
  { id: 'WORD.AI.TONE.CONFIDENT', name: 'Confident Tone', handler: () => { console.log('[RewriteCommand] Tone: Confident'); } },
  { id: 'WORD.AI.TONE.PERSUASIVE', name: 'Persuasive Tone', handler: () => { console.log('[RewriteCommand] Tone: Persuasive'); } },
  { id: 'WORD.AI.TONE.CREATIVE', name: 'Creative Tone', handler: () => { console.log('[RewriteCommand] Tone: Creative'); } },
  { id: 'WORD.AI.TONE.EXECUTIVE', name: 'Executive Tone', handler: () => { console.log('[RewriteCommand] Tone: Executive'); } },
  { id: 'WORD.AI.TONE.FRIENDLY', name: 'Friendly Tone', handler: () => { console.log('[RewriteCommand] Tone: Friendly'); } },
  { id: 'WORD.AI.TONE.TECHNICAL', name: 'Technical Tone', handler: () => { console.log('[RewriteCommand] Tone: Technical'); } },
  { id: 'WORD.AI.TONE.CUSTOM', name: 'Custom Tone', handler: () => { console.log('[RewriteCommand] Tone: Custom'); } },

  // --- Length Commands ---
  { id: 'WORD.AI.LENGTH.SHORTER', name: 'Shorter', handler: () => { console.log('[RewriteCommand] Length: Shorter'); } },
  { id: 'WORD.AI.LENGTH.SLIGHTLY_SHORTER', name: 'Slightly Shorter', handler: () => { console.log('[RewriteCommand] Length: Slightly Shorter'); } },
  { id: 'WORD.AI.LENGTH.SAME', name: 'Keep Same', handler: () => { console.log('[RewriteCommand] Length: Same'); } },
  { id: 'WORD.AI.LENGTH.SLIGHTLY_LONGER', name: 'Slightly Longer', handler: () => { console.log('[RewriteCommand] Length: Slightly Longer'); } },
  { id: 'WORD.AI.LENGTH.LONGER', name: 'Longer', handler: () => { console.log('[RewriteCommand] Length: Longer'); } },
  { id: 'WORD.AI.LENGTH.MAXIMUM', name: 'Maximum Detail', handler: () => { console.log('[RewriteCommand] Length: Maximum'); } },

  // --- Preview Commands ---
  { id: 'WORD.AI.PREVIEW.OPEN', name: 'Open Preview', handler: () => { console.log('[RewriteCommand] Preview: Open'); } },
  { id: 'WORD.AI.PREVIEW.CLOSE', name: 'Close Preview', handler: () => { console.log('[RewriteCommand] Preview: Close'); } },
  { id: 'WORD.AI.PREVIEW.REFRESH', name: 'Refresh Preview', handler: () => { console.log('[RewriteCommand] Preview: Refresh'); } },
  { id: 'WORD.AI.PREVIEW.ZOOM_IN', name: 'Zoom In Preview', handler: () => { console.log('[RewriteCommand] Preview: Zoom In'); } },
  { id: 'WORD.AI.PREVIEW.ZOOM_OUT', name: 'Zoom Out Preview', handler: () => { console.log('[RewriteCommand] Preview: Zoom Out'); } },
  { id: 'WORD.AI.PREVIEW.RESET', name: 'Reset Preview', handler: () => { console.log('[RewriteCommand] Preview: Reset'); } },

  // --- Diff Commands ---
  { id: 'WORD.AI.DIFF.OPEN', name: 'Open Diff', handler: () => { console.log('[RewriteCommand] Diff: Open'); } },
  { id: 'WORD.AI.DIFF.CLOSE', name: 'Close Diff', handler: () => { console.log('[RewriteCommand] Diff: Close'); } },
  { id: 'WORD.AI.DIFF.INLINE', name: 'Inline Diff', handler: () => { console.log('[RewriteCommand] Diff: Inline'); } },
  { id: 'WORD.AI.DIFF.SIDE_BY_SIDE', name: 'Side-by-Side Diff', handler: () => { console.log('[RewriteCommand] Diff: Side-by-Side'); } },
  { id: 'WORD.AI.DIFF.UNIFIED', name: 'Unified Diff', handler: () => { console.log('[RewriteCommand] Diff: Unified'); } },
  { id: 'WORD.AI.DIFF.NEXT', name: 'Next Difference', handler: () => { console.log('[RewriteCommand] Diff: Next'); } },
  { id: 'WORD.AI.DIFF.PREVIOUS', name: 'Previous Difference', handler: () => { console.log('[RewriteCommand] Diff: Previous'); } },
  { id: 'WORD.AI.DIFF.SEARCH', name: 'Search Diff', handler: () => { console.log('[RewriteCommand] Diff: Search'); } },
  { id: 'WORD.AI.DIFF.FILTER', name: 'Filter Diff', handler: () => { console.log('[RewriteCommand] Diff: Filter'); } },
  { id: 'WORD.AI.DIFF.EXPORT', name: 'Export Diff', handler: () => { console.log('[RewriteCommand] Diff: Export'); } },

  // --- Accept / Reject Commands ---
  { id: 'WORD.AI.ACCEPT', name: 'Accept Rewrite', shortcut: 'Ctrl+Shift+A', handler: () => { console.log('[RewriteCommand] Accepted Rewrite'); } },
  { id: 'WORD.AI.ACCEPT.ALL', name: 'Accept All', handler: () => { console.log('[RewriteCommand] Accepted All'); } },
  { id: 'WORD.AI.REJECT', name: 'Reject Rewrite', shortcut: 'Ctrl+Shift+X', handler: () => { console.log('[RewriteCommand] Rejected Rewrite'); } },
  { id: 'WORD.AI.REJECT.ALL', name: 'Reject All', handler: () => { console.log('[RewriteCommand] Rejected All'); } },
  { id: 'WORD.AI.REPLACE', name: 'Replace Selection', handler: () => { console.log('[RewriteCommand] Replaced Selection'); } },
  { id: 'WORD.AI.INSERT.BELOW', name: 'Insert Below', shortcut: 'Ctrl+Shift+Enter', handler: () => { console.log('[RewriteCommand] Inserted Below'); } },
  { id: 'WORD.AI.COPY', name: 'Copy Rewrite', shortcut: 'Ctrl+Shift+C', handler: () => { console.log('[RewriteCommand] Copied to Clipboard'); } },
  { id: 'WORD.AI.EXPLAIN', name: 'Explain Rewrite', handler: () => { console.log('[RewriteCommand] Explained Rewrite'); } },
  { id: 'WORD.AI.COMPARE', name: 'Compare Rewrite', handler: () => { console.log('[RewriteCommand] Compared Rewrite'); } },
  { id: 'WORD.AI.SAVE.VERSION', name: 'Save Rewrite Version', handler: () => { console.log('[RewriteCommand] Saved Version'); } },

  // --- History Commands ---
  { id: 'WORD.AI.HISTORY.OPEN', name: 'Open History', handler: () => { console.log('[RewriteCommand] History: Open'); } },
  { id: 'WORD.AI.HISTORY.CLOSE', name: 'Close History', handler: () => { console.log('[RewriteCommand] History: Close'); } },
  { id: 'WORD.AI.HISTORY.SEARCH', name: 'Search History', handler: () => { console.log('[RewriteCommand] History: Search'); } },
  { id: 'WORD.AI.HISTORY.DELETE', name: 'Delete History', handler: () => { console.log('[RewriteCommand] History: Delete'); } },
  { id: 'WORD.AI.HISTORY.RESTORE', name: 'Restore History', handler: () => { console.log('[RewriteCommand] History: Restore'); } },
  { id: 'WORD.AI.HISTORY.EXPORT', name: 'Export History', handler: () => { console.log('[RewriteCommand] History: Export'); } },

  // --- Provider Commands ---
  { id: 'WORD.AI.PROVIDER.OPEN', name: 'Open Providers', handler: () => { console.log('[RewriteCommand] Provider: Open'); } },
  { id: 'WORD.AI.PROVIDER.SELECT', name: 'Select Provider', handler: () => { console.log('[RewriteCommand] Provider: Select'); } },
  { id: 'WORD.AI.PROVIDER.REFRESH', name: 'Refresh Providers', handler: () => { console.log('[RewriteCommand] Provider: Refresh'); } },
  { id: 'WORD.AI.MODEL.SELECT', name: 'Select Model', handler: () => { console.log('[RewriteCommand] Model: Select'); } },
  { id: 'WORD.AI.MODEL.REFRESH', name: 'Refresh Models', handler: () => { console.log('[RewriteCommand] Model: Refresh'); } },

  // --- Workflow Commands ---
  { id: 'WORD.AI.WORKFLOW.START', name: 'Start AI Workflow', handler: () => { console.log('[RewriteCommand] Workflow: Start'); } },
  { id: 'WORD.AI.WORKFLOW.PAUSE', name: 'Pause AI Workflow', handler: () => { console.log('[RewriteCommand] Workflow: Pause'); } },
  { id: 'WORD.AI.WORKFLOW.RESUME', name: 'Resume AI Workflow', handler: () => { console.log('[RewriteCommand] Workflow: Resume'); } },
  { id: 'WORD.AI.WORKFLOW.STOP', name: 'Stop AI Workflow', handler: () => { console.log('[RewriteCommand] Workflow: Stop'); } },
  { id: 'WORD.AI.WORKFLOW.RESTART', name: 'Restart AI Workflow', handler: () => { console.log('[RewriteCommand] Workflow: Restart'); } },

  // --- Settings Commands ---
  { id: 'WORD.AI.SETTINGS.OPEN', name: 'Open AI Settings', handler: () => { console.log('[RewriteCommand] Settings: Open'); } },
  { id: 'WORD.AI.SETTINGS.PROVIDER', name: 'Configure Provider Settings', handler: () => { console.log('[RewriteCommand] Settings: Provider'); } },
  { id: 'WORD.AI.SETTINGS.MODEL', name: 'Configure Model Settings', handler: () => { console.log('[RewriteCommand] Settings: Model'); } },
  { id: 'WORD.AI.SETTINGS.TEMPERATURE', name: 'Set AI Temperature', handler: () => { console.log('[RewriteCommand] Settings: Temperature'); } },
  { id: 'WORD.AI.SETTINGS.TOP_P', name: 'Set AI Top P', handler: () => { console.log('[RewriteCommand] Settings: Top P'); } },
  { id: 'WORD.AI.SETTINGS.MAX_TOKENS', name: 'Set AI Max Tokens', handler: () => { console.log('[RewriteCommand] Settings: Max Tokens'); } },
  { id: 'WORD.AI.SETTINGS.RESET', name: 'Reset AI Settings', handler: () => { console.log('[RewriteCommand] Settings: Reset'); } },

  // --- Context Commands ---
  { id: 'WORD.AI.REWRITE.CONTEXT.BUILD', name: 'Build Rewrite Context', handler: () => { console.log('[RewriteCommand] Context: Build'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.REFRESH', name: 'Refresh Rewrite Context', handler: () => { console.log('[RewriteCommand] Context: Refresh'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.EXPAND', name: 'Expand Rewrite Context', handler: () => { console.log('[RewriteCommand] Context: Expand'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.REDUCE', name: 'Reduce Rewrite Context', handler: () => { console.log('[RewriteCommand] Context: Reduce'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.CACHE', name: 'Cache Rewrite Context', handler: () => { console.log('[RewriteCommand] Context: Cache'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.CLEAR', name: 'Clear Context Cache', handler: () => { console.log('[RewriteCommand] Context: Clear Cache'); } },
  { id: 'WORD.AI.REWRITE.CONTEXT.EXPORT', name: 'Export Context Data', handler: () => { console.log('[RewriteCommand] Context: Export'); } }
];
