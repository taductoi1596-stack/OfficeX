import type { RunFmt } from '../document/DocumentTypes';

export type LayoutToken = {
  text: string; x: number; width: number; fmt: RunFmt;
  paraIdx: number; charStart: number; charEnd: number;
};

export type LayoutLine = {
  tokens: LayoutToken[];
  y: number; height: number; baseline: number;
  bounds: { left: number; right: number };
  paraIdx: number; lineIdx: number;
  charStart: number; charEnd: number;
  colIdx?: number;
  xOffset?: number;
  yVisual?: number;
  pageIdx?: number;
};

export type LayoutPara = {
  paraIdx: number; lines: LayoutLine[];
  y: number; height: number;
  numberStr?: string;
};

export type LayoutResult = { paras: LayoutPara[]; totalH: number };
