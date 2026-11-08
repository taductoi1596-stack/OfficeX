export type CaretPosition = {
  index: number;
};

export type TextRange = {
  startIndex: number;
  endIndex: number;
};

export function isRangeEmpty(range: TextRange): boolean {
  return range.startIndex === range.endIndex;
}

export function normalizeRange(range: TextRange): TextRange {
  return {
    startIndex: Math.min(range.startIndex, range.endIndex),
    endIndex: Math.max(range.startIndex, range.endIndex),
  };
}
