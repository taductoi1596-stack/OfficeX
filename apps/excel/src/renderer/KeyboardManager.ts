import { CommandDispatcher } from './CommandDispatcher';

export class KeyboardManager {
  private static isInitialized = false;
  private static isEditing = false;

  public static setEditingState(editing: boolean) {
    this.isEditing = editing;
  }

  public static initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public static dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.isInitialized = false;
  }

  private static handleKeyDown = (e: KeyboardEvent) => {
    // Determine if user is typing in a non-grid input field (like a dialog)
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
    const isCellInput = target.id && target.id.startsWith('cell-input-');

    // Global Shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          CommandDispatcher.dispatch('EXCEL.FORMAT.BOLD');
          return;
        case 'i':
          e.preventDefault();
          CommandDispatcher.dispatch('EXCEL.FORMAT.ITALIC');
          return;
        case 'u':
          e.preventDefault();
          CommandDispatcher.dispatch('EXCEL.FORMAT.UNDERLINE');
          return;
        case 'x':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.EDIT.CUT');
          }
          return;
        case 'c':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.EDIT.COPY');
          }
          return;
        case 'v':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            if (e.shiftKey) {
              CommandDispatcher.dispatch('EXCEL.EDIT.PASTE_VALUES');
            } else {
              CommandDispatcher.dispatch('EXCEL.EDIT.PASTE');
            }
          }
          return;
        case 'z':
          if (!this.isEditing) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.UNDO');
          }
          return;
        case 'y':
          if (!this.isEditing) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.REDO');
          }
          return;
        case 'a':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.SELECT.ALL');
          }
          return;
        case 's':
          e.preventDefault();
          if (e.shiftKey) {
            CommandDispatcher.dispatch('EXCEL.FILE.SAVE_AS');
          } else {
            CommandDispatcher.dispatch('EXCEL.FILE.SAVE');
          }
          return;
        case 'o':
          e.preventDefault();
          CommandDispatcher.dispatch('EXCEL.FILE.OPEN');
          return;
        case 'p':
          e.preventDefault();
          CommandDispatcher.dispatch('EXCEL.FILE.PRINT');
          return;
        case 't':
          if (e.shiftKey) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.AI.TRANSLATE');
          }
          return;
        case 'd':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.EDIT.FILL_DOWN');
          }
          return;
        case 'r':
          if (!this.isEditing && (!isInput || isCellInput)) {
            e.preventDefault();
            CommandDispatcher.dispatch('EXCEL.EDIT.FILL_RIGHT');
          }
          return;
      }
    }

    // Deletion shortcuts outside editing
    if (!this.isEditing && (!isInput || isCellInput) && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      CommandDispatcher.dispatch('EXCEL.EDIT.CLEAR_CONTENTS');
      return;
    }
  };
}
