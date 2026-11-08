// ─────────────────────────────────────────────────────────────────────────────
// Named Range Manager — Manages named ranges (primarily for spreadsheets)
// Ref: BOOKMARK_ENGINE.md §8
// ─────────────────────────────────────────────────────────────────────────────

export type NamedRangeScope = 'workbook' | 'worksheet';

export interface NamedRange {
  rangeId: string;
  name: string;
  reference: string; // e.g. "Sheet1!A1:C10" or "A1:A10"
  scope: NamedRangeScope;
  worksheetId?: string;
  isDynamic: boolean;
  metadata: Record<string, any>;
}

export class NamedRangeManager {
  private ranges = new Map<string, NamedRange>();

  create(
    name: string,
    reference: string,
    scope: NamedRangeScope = 'workbook',
    worksheetId?: string,
    isDynamic = false
  ): NamedRange {
    if (this.findByName(name, worksheetId)) {
      throw new Error(`Named range '${name}' already exists in this scope.`);
    }

    const range: NamedRange = {
      rangeId: `nr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      reference,
      scope,
      worksheetId,
      isDynamic,
      metadata: {},
    };
    this.ranges.set(range.rangeId, range);
    return range;
  }

  findByName(name: string, worksheetId?: string): NamedRange | undefined {
    return Array.from(this.ranges.values()).find(
      r => r.name === name && (worksheetId === undefined || r.worksheetId === worksheetId)
    );
  }

  getAll(): NamedRange[] {
    return Array.from(this.ranges.values());
  }

  delete(rangeId: string): void {
    this.ranges.delete(rangeId);
  }

  rename(rangeId: string, newName: string): void {
    const range = this.ranges.get(rangeId);
    if (range) range.name = newName;
  }
}
