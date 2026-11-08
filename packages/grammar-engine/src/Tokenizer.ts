// ─────────────────────────────────────────────────────────────────────────────
// Tokenizer — Splits text into sentences and tokens
// Ref: GRAMMAR_ENGINE.md §8
// ─────────────────────────────────────────────────────────────────────────────

export interface Token {
  text: string;
  startOffset: number;
  endOffset: number;
}

export interface Sentence {
  text: string;
  startOffset: number;
  endOffset: number;
  tokens: Token[];
}

export class Tokenizer {
  /**
   * Naive sentence splitter. Assumes period, question mark, or exclamation mark followed by space is a boundary.
   */
  splitIntoSentences(text: string): Sentence[] {
    const sentences: Sentence[] = [];
    const sentenceRegex = /[^.!?]+[.!?]*/g;
    let match;

    while ((match = sentenceRegex.exec(text)) !== null) {
      const sentenceText = match[0].trim();
      if (!sentenceText) continue;

      const startOffset = match.index + match[0].indexOf(sentenceText);
      const endOffset = startOffset + sentenceText.length;

      sentences.push({
        text: sentenceText,
        startOffset,
        endOffset,
        tokens: this.tokenize(sentenceText, startOffset)
      });
    }

    return sentences;
  }

  private tokenize(text: string, baseOffset: number): Token[] {
    const tokens: Token[] = [];
    const wordRegex = /\b\w+\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      tokens.push({
        text: match[0],
        startOffset: baseOffset + match.index,
        endOffset: baseOffset + match.index + match[0].length
      });
    }

    return tokens;
  }
}
