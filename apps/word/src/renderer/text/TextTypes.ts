import type { RunFmt } from '../document/DocumentTypes';

export type TextToken = {
  text: string;
  width: number;
  fmt: RunFmt;
  paraIdx: number;
  charStart: number;
  charEnd: number;
};

export type TextLine = {
  tokens: TextToken[];
  width: number;
  height: number;
  baseline: number;
  charStart: number;
  charEnd: number;
};

export type TextPara = {
  paraIdx: number;
  lines: TextLine[];
};
