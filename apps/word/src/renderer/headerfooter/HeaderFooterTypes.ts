import type { DocPara } from '../document/DocumentTypes';

export type HeaderFooterType = 'default' | 'first' | 'even';

export interface HeaderFooterModel {
  id: string;
  type: HeaderFooterType;
  paras: DocPara[];
}

export interface HeaderFooterSettings {
  differentFirstPage: boolean;
  differentOddEven: boolean;
  linkToPrevious: boolean;
  // If we had a section engine, we might track section IDs here.
}

export interface WatermarkModel {
  id: string;
  text?: string;
  imageUri?: string;
  opacity: number;      // 0.0 to 1.0
  rotation: number;     // degrees
  scale: number;        // percentage
  diagonal: boolean;
}
