// ─────────────────────────────────────────────────────────────────────────────
// Spell Check Manager — Central orchestrator for SpellCheck Engine
// Ref: SPELLCHECK.md §1, §12, §15
// ─────────────────────────────────────────────────────────────────────────────

import { DictionaryManager } from './DictionaryManager';
import { SpellChecker } from './SpellChecker';
import { GrammarChecker } from './GrammarChecker';
import { AutoCorrectManager } from './AutoCorrectManager';
import type { SpellIssue } from './models/Issue';

export class SpellCheckManager {
  readonly dictionary = new DictionaryManager();
  readonly autoCorrect = new AutoCorrectManager();
  
  private spellChecker = new SpellChecker(this.dictionary);
  private grammarChecker = new GrammarChecker();

  private defaultLanguage = 'en-US';

  setDefaultLanguage(lang: string): void {
    this.defaultLanguage = lang;
  }

  /**
   * Performs a full spell and grammar check on a block of text.
   */
  checkText(text: string, language: string = this.defaultLanguage): SpellIssue[] {
    const spellIssues = this.spellChecker.checkText(text, language);
    const grammarIssues = this.grammarChecker.checkText(text, language);
    
    // Sort issues by startOffset
    return [...spellIssues, ...grammarIssues].sort((a, b) => a.startOffset - b.startOffset);
  }

  /**
   * Ignored words will be skipped in subsequent checks.
   */
  ignoreAll(word: string): void {
    this.dictionary.ignoreWord(word);
  }

  /**
   * Check if the last typed word should be auto-corrected.
   */
  tryAutoCorrect(word: string): string | null {
    return this.autoCorrect.getCorrection(word);
  }
}
