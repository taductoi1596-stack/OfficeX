// ─────────────────────────────────────────────────────────────────────────────
// Numbering Engine — Core Data Models
// Ref: NUMBERING_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type ListType = 'bullet' | 'numbered' | 'outline';
export type NumberFormat = 'arabic' | 'roman-upper' | 'roman-lower' | 'alpha-upper' | 'alpha-lower' | 'bullet';

export interface ListLevel {
  levelIndex: number;
  format: NumberFormat;
  startAt: number;
  prefix: string;
  suffix: string; // e.g., ".", ")"
  bulletChar?: string; // used if format is 'bullet'
}

export interface List {
  listId: string;
  listType: ListType;
  levels: Record<number, ListLevel>; // Map of levelIndex to ListLevel
  status: 'active' | 'deleted';
  metadata: Record<string, any>;
}

export interface ListItem {
  itemId: string;
  listId: string;
  levelIndex: number;
  targetObjectId: string; // e.g., Paragraph ID
  renderedText: string;   // e.g., "1.", "a)", "•"
}
