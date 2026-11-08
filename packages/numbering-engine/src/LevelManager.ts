// ─────────────────────────────────────────────────────────────────────────────
// Level Manager — Manages counter state for lists
// Ref: NUMBERING_ENGINE.md §10, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { List, ListItem } from './models/List';

export class LevelManager {
  // Map of List ID -> Array of current counts per level
  private counters = new Map<string, number[]>();

  initializeList(listId: string): void {
    if (!this.counters.has(listId)) {
      this.counters.set(listId, [0, 0, 0, 0, 0, 0, 0, 0, 0]); // Max 9 levels in OpenXML
    }
  }

  /**
   * Gets the next count for a given level and resets deeper levels.
   */
  getNextCount(list: List, levelIndex: number): number {
    this.initializeList(list.listId);
    const counts = this.counters.get(list.listId)!;
    
    // Increment target level
    counts[levelIndex]++;
    
    // Reset all deeper levels
    for (let i = levelIndex + 1; i < counts.length; i++) {
      counts[i] = 0;
    }

    const currentCount = counts[levelIndex];
    const levelDefinition = list.levels[levelIndex];
    
    // Account for startAt
    const startOffset = levelDefinition ? (levelDefinition.startAt - 1) : 0;
    return currentCount + startOffset;
  }

  /**
   * Resets the entire list counter.
   */
  resetList(listId: string): void {
    this.counters.set(listId, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
}
