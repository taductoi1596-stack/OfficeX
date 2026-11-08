/**
 * RewriteDiffEngine.ts
 *
 * Wraps the MyersDiff algorithm to provide text-based diffing tailored for the
 * Rewrite Panel (words vs characters).
 */

import { MyersDiff, DiffHunk } from './MyersDiff';

export type DiffGranularity = 'character' | 'word' | 'sentence' | 'paragraph';

export interface TextDiffHunk {
  operation: 'insert' | 'delete' | 'equal';
  text: string;
}

export class RewriteDiffEngine {
  /**
   * Compares two strings based on the given granularity.
   */
  static compare(original: string, rewritten: string, granularity: DiffGranularity = 'word'): TextDiffHunk[] {
    let tokensOrig: string[];
    let tokensNew: string[];

    if (granularity === 'character') {
      tokensOrig = original.split('');
      tokensNew = rewritten.split('');
    } else if (granularity === 'word') {
      // Split by words/whitespace/punctuation but keep the delimiters
      const regex = /([\s\.,!?;:]+)/;
      tokensOrig = original.split(regex).filter(Boolean);
      tokensNew = rewritten.split(regex).filter(Boolean);
    } else if (granularity === 'sentence') {
      const regex = /([.?!]\s+)/;
      tokensOrig = original.split(regex).filter(Boolean);
      tokensNew = rewritten.split(regex).filter(Boolean);
    } else {
      // Paragraph
      const regex = /(\n+)/;
      tokensOrig = original.split(regex).filter(Boolean);
      tokensNew = rewritten.split(regex).filter(Boolean);
    }

    const rawHunks = MyersDiff.diff(tokensOrig, tokensNew);

    // Map the generic hunks back into text strings
    return rawHunks.map(hunk => ({
      operation: hunk.operation,
      text: hunk.items.join('')
    }));
  }

  /**
   * Computes statistics for the diff (e.g., words added, words removed).
   */
  static computeStatistics(hunks: TextDiffHunk[]) {
    let wordsAdded = 0;
    let wordsRemoved = 0;
    let charsAdded = 0;
    let charsRemoved = 0;

    for (const hunk of hunks) {
      if (hunk.operation === 'insert') {
        const words = hunk.text.trim().split(/\s+/).filter(Boolean).length;
        wordsAdded += words;
        charsAdded += hunk.text.length;
      } else if (hunk.operation === 'delete') {
        const words = hunk.text.trim().split(/\s+/).filter(Boolean).length;
        wordsRemoved += words;
        charsRemoved += hunk.text.length;
      }
    }

    return { wordsAdded, wordsRemoved, charsAdded, charsRemoved };
  }
}
