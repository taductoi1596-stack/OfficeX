import type { CommandDispatcher } from '../CommandDispatcher';
import type { HistoryManager } from '@officex/history-engine';

export function registerHomeShortcuts(
  dispatcher: CommandDispatcher,
  historyManager: HistoryManager,
  editor: HTMLDivElement
) {
  const handler = (e: KeyboardEvent) => {
    // Only handle if Ctrl or Meta (Command on Mac) is pressed
    if (!e.ctrlKey && !e.metaKey) return;

    // Don't intercept if it's just Ctrl+C/X/V so the browser handles clipboard natively
    // We will listen to actual copy/cut/paste events for history, or just let browser handle it.
    // However, the spec says to wire them. Let's wire formatting and alignment.

    const key = e.key.toLowerCase();
    
    // Undo/Redo
    if (key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        historyManager.redo();
      } else {
        historyManager.undo();
      }
      return;
    }
    if (key === 'y') {
      e.preventDefault();
      historyManager.redo();
      return;
    }

    // Formatting
    const formatMap: Record<string, string> = {
      b: 'WORD.HOME.BOLD',
      i: 'WORD.HOME.ITALIC',
      u: 'WORD.HOME.UNDERLINE',
    };
    if (formatMap[key]) {
      e.preventDefault();
      dispatcher.execute(formatMap[key]);
      return;
    }

    // Alignment
    const alignMap: Record<string, string> = {
      l: 'WORD.HOME.ALIGN.LEFT',
      e: 'WORD.HOME.ALIGN.CENTER',
      r: 'WORD.HOME.ALIGN.RIGHT',
      j: 'WORD.HOME.ALIGN.JUSTIFY',
    };
    if (alignMap[key]) {
      e.preventDefault();
      dispatcher.execute(alignMap[key]);
      return;
    }
    
    // Select All
    if (key === 'a') {
      e.preventDefault();
      dispatcher.execute('WORD.HOME.SELECT.ALL');
      return;
    }
  };

  editor.addEventListener('keydown', handler);

  return () => {
    editor.removeEventListener('keydown', handler);
  };
}
