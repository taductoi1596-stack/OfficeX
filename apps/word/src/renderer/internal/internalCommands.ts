import { CommandDefinition } from '../CommandDispatcher';
import { InternalEngine } from './InternalEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InternalCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // APPLICATION
      cmd('WORD.INTERNAL.STARTUP', 'Initialize Application', () => InternalEngine.Application('startup')),
      cmd('WORD.INTERNAL.SHUTDOWN', 'Shutdown Application', () => InternalEngine.Application('shutdown')),
      cmd('WORD.INTERNAL.RESTART', 'Restart Runtime', () => InternalEngine.Application('restart')),
      cmd('WORD.INTERNAL.RELOAD', 'Reload Modules', () => InternalEngine.Application('reload')),
      cmd('WORD.INTERNAL.HEARTBEAT', 'Heartbeat', () => InternalEngine.Application('heartbeat')),

      // DOCUMENT
      cmd('WORD.INTERNAL.DOCUMENT.CREATE', 'Create Document', () => InternalEngine.Document('create')),
      cmd('WORD.INTERNAL.DOCUMENT.OPEN', 'Open Document', () => InternalEngine.Document('open')),
      cmd('WORD.INTERNAL.DOCUMENT.CLOSE', 'Close Document', () => InternalEngine.Document('close')),
      cmd('WORD.INTERNAL.DOCUMENT.RELOAD', 'Reload Document', () => InternalEngine.Document('reload')),
      cmd('WORD.INTERNAL.DOCUMENT.DIRTY', 'Mark Dirty', () => InternalEngine.Document('dirty')),
      cmd('WORD.INTERNAL.DOCUMENT.CLEAN', 'Mark Clean', () => InternalEngine.Document('clean')),
      cmd('WORD.INTERNAL.DOCUMENT.VALIDATE', 'Validate Document', () => InternalEngine.Document('validate')),
      cmd('WORD.INTERNAL.DOCUMENT.REPAIR', 'Repair Document', () => InternalEngine.Document('repair')),
      cmd('WORD.INTERNAL.DOCUMENT.LOCK', 'Lock Document', () => InternalEngine.Document('lock')),
      cmd('WORD.INTERNAL.DOCUMENT.UNLOCK', 'Unlock Document', () => InternalEngine.Document('unlock')),

      // LAYOUT
      cmd('WORD.INTERNAL.LAYOUT.INVALIDATE', 'Invalidate Layout', () => InternalEngine.Layout('invalidate')),
      cmd('WORD.INTERNAL.LAYOUT.RECALCULATE', 'Recalculate Layout', () => InternalEngine.Layout('recalculate')),
      cmd('WORD.INTERNAL.LAYOUT.PAGINATE', 'Pagination', () => InternalEngine.Layout('paginate')),
      cmd('WORD.INTERNAL.LAYOUT.REFLOW', 'Reflow Document', () => InternalEngine.Layout('reflow')),
      cmd('WORD.INTERNAL.LAYOUT.UPDATE', 'Update Layout', () => InternalEngine.Layout('update')),

      // RENDER
      cmd('WORD.INTERNAL.RENDER.INVALIDATE', 'Invalidate Render', () => InternalEngine.Render('invalidate')),
      cmd('WORD.INTERNAL.RENDER.REDRAW', 'Redraw Window', () => InternalEngine.Render('redraw')),
      cmd('WORD.INTERNAL.RENDER.REPAINT', 'Repaint', () => InternalEngine.Render('repaint')),
      cmd('WORD.INTERNAL.RENDER.GPU', 'GPU Render', () => InternalEngine.Render('gpu')),
      cmd('WORD.INTERNAL.RENDER.CPU', 'CPU Render', () => InternalEngine.Render('cpu')),
      cmd('WORD.INTERNAL.RENDER.PRINT', 'Print Render', () => InternalEngine.Render('print')),
      cmd('WORD.INTERNAL.RENDER.PDF', 'PDF Render', () => InternalEngine.Render('pdf')),

      // HISTORY
      cmd('WORD.INTERNAL.HISTORY.BEGIN', 'Begin Transaction', () => InternalEngine.History('begin')),
      cmd('WORD.INTERNAL.HISTORY.END', 'End Transaction', () => InternalEngine.History('end')),
      cmd('WORD.INTERNAL.HISTORY.UNDO', 'Undo Internal', () => InternalEngine.History('undo')),
      cmd('WORD.INTERNAL.HISTORY.REDO', 'Redo Internal', () => InternalEngine.History('redo')),
      cmd('WORD.INTERNAL.HISTORY.SNAPSHOT', 'Snapshot', () => InternalEngine.History('snapshot')),

      // CACHE
      cmd('WORD.INTERNAL.CACHE.LOAD', 'Load Cache', () => InternalEngine.Cache('load')),
      cmd('WORD.INTERNAL.CACHE.SAVE', 'Save Cache', () => InternalEngine.Cache('save')),
      cmd('WORD.INTERNAL.CACHE.CLEAR', 'Clear Cache', () => InternalEngine.Cache('clear')),
      cmd('WORD.INTERNAL.CACHE.REBUILD', 'Rebuild Cache', () => InternalEngine.Cache('rebuild')),
      cmd('WORD.INTERNAL.CACHE.THUMBNAIL', 'Thumbnail Cache', () => InternalEngine.Cache('thumbnail')),
      cmd('WORD.INTERNAL.CACHE.GLYPH', 'Glyph Cache', () => InternalEngine.Cache('glyph')),

      // CLIPBOARD
      cmd('WORD.INTERNAL.CLIPBOARD.COPY', 'Internal Copy', () => InternalEngine.Clipboard('copy')),
      cmd('WORD.INTERNAL.CLIPBOARD.PASTE', 'Internal Paste', () => InternalEngine.Clipboard('paste')),
      cmd('WORD.INTERNAL.CLIPBOARD.CLEAR', 'Clear Clipboard', () => InternalEngine.Clipboard('clear')),
      cmd('WORD.INTERNAL.CLIPBOARD.SERIALIZE', 'Serialize Clipboard', () => InternalEngine.Clipboard('serialize')),
      cmd('WORD.INTERNAL.CLIPBOARD.DESERIALIZE', 'Deserialize Clipboard', () => InternalEngine.Clipboard('deserialize')),

      // FILE
      cmd('WORD.INTERNAL.FILE.LOAD', 'Load File', () => InternalEngine.File('load')),
      cmd('WORD.INTERNAL.FILE.SAVE', 'Save File', () => InternalEngine.File('save')),
      cmd('WORD.INTERNAL.FILE.BACKGROUND', 'Background Save', () => InternalEngine.File('background')),
      cmd('WORD.INTERNAL.FILE.FLUSH', 'Flush Buffers', () => InternalEngine.File('flush')),
      cmd('WORD.INTERNAL.FILE.RECOVER', 'Recover File', () => InternalEngine.File('recover')),

      // PLUGIN
      cmd('WORD.INTERNAL.PLUGIN.LOAD', 'Load Plugin', () => InternalEngine.Plugin('load')),
      cmd('WORD.INTERNAL.PLUGIN.UNLOAD', 'Unload Plugin', () => InternalEngine.Plugin('unload')),
      cmd('WORD.INTERNAL.PLUGIN.EXECUTE', 'Execute Plugin', () => InternalEngine.Plugin('execute')),
      cmd('WORD.INTERNAL.PLUGIN.PERMISSION', 'Permission Check', () => InternalEngine.Plugin('permission')),

      // AI
      cmd('WORD.INTERNAL.AI.REQUEST', 'Send AI Request', () => InternalEngine.AI('request')),
      cmd('WORD.INTERNAL.AI.RESPONSE', 'Receive AI Response', () => InternalEngine.AI('response')),
      cmd('WORD.INTERNAL.AI.CACHE', 'AI Cache', () => InternalEngine.AI('cache')),
      cmd('WORD.INTERNAL.AI.CANCEL', 'Cancel AI', () => InternalEngine.AI('cancel')),

      // SPELLING
      cmd('WORD.INTERNAL.SPELL.RUN', 'Run Spell Engine', () => InternalEngine.Spelling('run')),
      cmd('WORD.INTERNAL.GRAMMAR.RUN', 'Run Grammar Engine', () => InternalEngine.Spelling('grammar')),
      cmd('WORD.INTERNAL.THESAURUS.RUN', 'Run Thesaurus', () => InternalEngine.Spelling('thesaurus')),

      // SEARCH
      cmd('WORD.INTERNAL.SEARCH.INDEX', 'Update Index', () => InternalEngine.Search('index')),
      cmd('WORD.INTERNAL.SEARCH.REBUILD', 'Rebuild Search', () => InternalEngine.Search('rebuild')),
      cmd('WORD.INTERNAL.SEARCH.CLEAR', 'Clear Search Cache', () => InternalEngine.Search('clear')),

      // SESSION
      cmd('WORD.INTERNAL.SESSION.SAVE', 'Save Session', () => InternalEngine.Session('save')),
      cmd('WORD.INTERNAL.SESSION.RESTORE', 'Restore Session', () => InternalEngine.Session('restore')),
      cmd('WORD.INTERNAL.SESSION.CLEAN', 'Clean Session', () => InternalEngine.Session('clean')),

      // RECOVERY
      cmd('WORD.INTERNAL.RECOVERY.CREATE', 'Create Recovery Point', () => InternalEngine.Recovery('create')),
      cmd('WORD.INTERNAL.RECOVERY.LOAD', 'Load Recovery', () => InternalEngine.Recovery('load')),
      cmd('WORD.INTERNAL.RECOVERY.DELETE', 'Delete Recovery', () => InternalEngine.Recovery('delete')),

      // SECURITY
      cmd('WORD.INTERNAL.SECURITY.CHECK', 'Security Check', () => InternalEngine.Security('check')),
      cmd('WORD.INTERNAL.SECURITY.PERMISSION', 'Permission Validation', () => InternalEngine.Security('permission')),
      cmd('WORD.INTERNAL.SECURITY.ENCRYPT', 'Encryption', () => InternalEngine.Security('encrypt')),
      cmd('WORD.INTERNAL.SECURITY.DECRYPT', 'Decryption', () => InternalEngine.Security('decrypt')),

      // TELEMETRY
      cmd('WORD.INTERNAL.TELEMETRY.LOG', 'Telemetry Event', () => InternalEngine.Telemetry('log')),
      cmd('WORD.INTERNAL.TELEMETRY.ERROR', 'Log Error', () => InternalEngine.Telemetry('error')),
      cmd('WORD.INTERNAL.TELEMETRY.WARNING', 'Log Warning', () => InternalEngine.Telemetry('warning')),
      cmd('WORD.INTERNAL.TELEMETRY.PERFORMANCE', 'Performance Metrics', () => InternalEngine.Telemetry('performance')),

      // DIAGNOSTICS
      cmd('WORD.INTERNAL.DIAG.RUN', 'Run Diagnostics', () => InternalEngine.Diagnostics('run')),
      cmd('WORD.INTERNAL.DIAG.DUMP', 'Memory Dump', () => InternalEngine.Diagnostics('dump')),
      cmd('WORD.INTERNAL.DIAG.CRASH', 'Crash Report', () => InternalEngine.Diagnostics('crash')),
      cmd('WORD.INTERNAL.DIAG.PROFILE', 'Performance Profile', () => InternalEngine.Diagnostics('profile')),

      // AUTOMATION
      cmd('WORD.INTERNAL.API.EXECUTE', 'Execute API', () => InternalEngine.Automation('execute')),
      cmd('WORD.INTERNAL.API.BATCH', 'Batch Commands', () => InternalEngine.Automation('batch')),
      cmd('WORD.INTERNAL.API.QUEUE', 'Queue Command', () => InternalEngine.Automation('queue')),
      cmd('WORD.INTERNAL.API.CANCEL', 'Cancel Command', () => InternalEngine.Automation('cancel')),

      // THREADS
      cmd('WORD.INTERNAL.THREAD.UI', 'UI Thread', () => InternalEngine.Thread('ui')),
      cmd('WORD.INTERNAL.THREAD.BACKGROUND', 'Background Thread', () => InternalEngine.Thread('background')),
      cmd('WORD.INTERNAL.THREAD.RENDER', 'Render Thread', () => InternalEngine.Thread('render')),
      cmd('WORD.INTERNAL.THREAD.IO', 'I/O Thread', () => InternalEngine.Thread('io')),

      // EVENTS
      cmd('WORD.INTERNAL.EVENT.DISPATCH', 'Dispatch Event', () => InternalEngine.Events('dispatch')),
      cmd('WORD.INTERNAL.EVENT.BROADCAST', 'Broadcast Event', () => InternalEngine.Events('broadcast')),
      cmd('WORD.INTERNAL.EVENT.SUBSCRIBE', 'Subscribe', () => InternalEngine.Events('subscribe')),
      cmd('WORD.INTERNAL.EVENT.UNSUBSCRIBE', 'Unsubscribe', () => InternalEngine.Events('unsubscribe')),
    ];
  }
}
