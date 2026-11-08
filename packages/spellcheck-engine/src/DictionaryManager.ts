// ─────────────────────────────────────────────────────────────────────────────
// Dictionary Manager — Manages dictionaries and ignore lists
// Ref: SPELLCHECK.md §6, §8
// ─────────────────────────────────────────────────────────────────────────────

export class DictionaryManager {
  private customWords = new Set<string>();
  private ignoredWords = new Set<string>(); // Ignore All

  // In a real implementation, this would load language-specific tries or bloom filters.
  // We'll mock a small built-in dictionary for demo purposes.
  private builtInDictionary = new Set<string>([
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
    'hello', 'world', 'office', 'document', 'spell', 'check', 'grammar',
    'architecture', 'engine', 'manager', 'validator'
  ]);

  /**
   * Adds a word to the user's custom dictionary.
   */
  addCustomWord(word: string): void {
    this.customWords.add(word.toLowerCase());
  }

  /**
   * Adds a word to the active session's ignore list (Ignore All).
   */
  ignoreWord(word: string): void {
    this.ignoredWords.add(word.toLowerCase());
  }

  /**
   * Clears the current session's ignore list.
   */
  clearIgnoredWords(): void {
    this.ignoredWords.clear();
  }

  /**
   * Checks if a word is recognized as correct (in dictionary or ignored).
   */
  isWordValid(word: string): boolean {
    const lower = word.toLowerCase();
    
    if (this.ignoredWords.has(lower)) {
      return true;
    }
    if (this.customWords.has(lower)) {
      return true;
    }
    if (this.builtInDictionary.has(lower)) {
      return true;
    }

    return false;
  }
}
