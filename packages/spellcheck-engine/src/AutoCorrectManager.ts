// ─────────────────────────────────────────────────────────────────────────────
// AutoCorrect Manager — Applies on-the-fly corrections
// Ref: SPELLCHECK.md §9
// ─────────────────────────────────────────────────────────────────────────────

export class AutoCorrectManager {
  private rules: Map<string, string> = new Map([
    ['(c)', '©'],
    ['(r)', '®'],
    ['(tm)', '™'],
    ['teh', 'the'],
    ['dont', "don't"]
  ]);

  /**
   * Evaluates the recently typed word and returns its autocorrect replacement if any.
   * Called immediately after space or punctuation.
   */
  getCorrection(word: string): string | null {
    const replacement = this.rules.get(word.toLowerCase());
    if (!replacement) return null;

    // Preserve basic casing
    if (word[0] === word[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  addRule(trigger: string, replacement: string): void {
    this.rules.set(trigger.toLowerCase(), replacement);
  }
}
