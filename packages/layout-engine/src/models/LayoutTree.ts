// ─────────────────────────────────────────────────────────────────────────────
// Layout Tree (Visual Positioning Data)
// ─────────────────────────────────────────────────────────────────────────────

export type LayoutRun = {
  type: 'run';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontFamily: string;
  fontSize: number;
};

export type LayoutLine = {
  type: 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  baseline: number;
  runs: LayoutRun[];
};

export type LayoutParagraph = {
  type: 'paragraph';
  x: number;
  y: number;
  width: number;
  height: number;
  lines: LayoutLine[];
};

export type LayoutPage = {
  type: 'page';
  pageNumber: number;
  width: number;
  height: number;
  paragraphs: LayoutParagraph[];
};

export type LayoutTree = {
  type: 'layout-tree';
  pages: LayoutPage[];
};
