/**
 * DiffUtils.ts
 *
 * Lightweight word-level diffing utility for the Rewrite Panel.
 * Computes differences between two strings to highlight insertions and deletions.
 */

export type DiffType = 'add' | 'remove' | 'same';

export interface DiffPart {
  type: DiffType;
  value: string;
}

export class DiffUtils {
  /**
   * Computes a basic word-level diff between two strings.
   * Note: For a production Office app, this would use a robust LCS algorithm
   * like Myers diff or Google's diff-match-patch. For this prototype, we use
   * a simplified sequential matcher.
   */
  static computeWordDiff(oldStr: string, newStr: string): DiffPart[] {
    if (!oldStr && !newStr) return [];
    if (!oldStr) return [{ type: 'add', value: newStr }];
    if (!newStr) return [{ type: 'remove', value: oldStr }];

    // Split by words, preserving whitespace
    const splitRegex = /(\s+|\b)/;
    const oldWords = oldStr.split(splitRegex).filter(Boolean);
    const newWords = newStr.split(splitRegex).filter(Boolean);

    const diffs: DiffPart[] = [];
    let o = 0;
    let n = 0;

    // A very basic greedy matcher
    while (o < oldWords.length || n < newWords.length) {
      if (o < oldWords.length && n < newWords.length && oldWords[o] === newWords[n]) {
        // Match
        diffs.push({ type: 'same', value: oldWords[o] });
        o++;
        n++;
      } else {
        // Mismatch. Let's look ahead up to 5 words to find a synchronization point.
        let syncFound = false;
        for (let i = 1; i < 5; i++) {
          if (n + i < newWords.length && oldWords[o] === newWords[n + i]) {
            // New words were inserted
            diffs.push({ type: 'add', value: newWords.slice(n, n + i).join('') });
            n += i;
            syncFound = true;
            break;
          }
          if (o + i < oldWords.length && oldWords[o + i] === newWords[n]) {
            // Old words were removed
            diffs.push({ type: 'remove', value: oldWords.slice(o, o + i).join('') });
            o += i;
            syncFound = true;
            break;
          }
        }

        if (!syncFound) {
          // If no sync point found nearby, just mark current as removed/added
          if (o < oldWords.length) {
            diffs.push({ type: 'remove', value: oldWords[o] });
            o++;
          }
          if (n < newWords.length) {
            diffs.push({ type: 'add', value: newWords[n] });
            n++;
          }
        }
      }
    }

    // Merge consecutive parts of the same type for cleaner output
    const merged: DiffPart[] = [];
    for (const part of diffs) {
      if (merged.length > 0 && merged[merged.length - 1].type === part.type) {
        merged[merged.length - 1].value += part.value;
      } else {
        merged.push({ ...part });
      }
    }

    return merged;
  }
}
