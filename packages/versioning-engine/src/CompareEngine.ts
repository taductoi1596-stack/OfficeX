// ─────────────────────────────────────────────────────────────────────────────
// Compare Engine — diffs two document versions
// Ref: VERSIONING_ENGINE.md §5
// ─────────────────────────────────────────────────────────────────────────────

import type { VersionDiff } from './models/Version';

export class CompareEngine {
  /**
   * Compare two version contents line-by-line and produce a summary diff.
   * In a real implementation this would use a Myers diff algorithm.
   */
  diff(
    fromVersionId: string,
    fromContent: string,
    toVersionId: string,
    toContent: string
  ): VersionDiff {
    const fromLines = fromContent.split('\n');
    const toLines = toContent.split('\n');

    const fromSet = new Set(fromLines);
    const toSet = new Set(toLines);

    let additions = 0;
    let deletions = 0;
    let modifications = 0;

    for (const line of toLines) {
      if (!fromSet.has(line)) additions++;
    }
    for (const line of fromLines) {
      if (!toSet.has(line)) deletions++;
    }

    // Rough modification estimate
    modifications = Math.min(additions, deletions);
    additions = Math.max(0, additions - modifications);
    deletions = Math.max(0, deletions - modifications);

    const totalChanges = additions + deletions + modifications;
    const summary =
      totalChanges === 0
        ? 'No changes'
        : `${additions} addition(s), ${deletions} deletion(s), ${modifications} modification(s)`;

    return {
      fromVersionId,
      toVersionId,
      additions,
      deletions,
      modifications,
      summary,
      timestamp: Date.now(),
    };
  }

  /**
   * Returns true if two version contents are identical.
   */
  isIdentical(contentA: string, contentB: string): boolean {
    return contentA === contentB;
  }
}
