import type { HeaderFooterModel, HeaderFooterSettings } from '../headerfooter/HeaderFooterTypes';
import type { DocSection } from '../section/SectionTypes';

export type RunFmt = {
  bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean;
  doubleUnderline?: boolean; doubleStrike?: boolean;
  superscript?: boolean; subscript?: boolean;
  smallCaps?: boolean; allCaps?: boolean; hiddenText?: boolean;
  fontSize?: number;   // pt  (default 12)
  fontFamily?: string; // (default Calibri)
  color?: string;      // CSS color
  highlight?: string;  // CSS background color
  letterSpacing?: number; // px or pt
  fontScale?: number;     // percentage (default 100)
  baselineShift?: number; // pt
  effects?: {
    shadow?: boolean;
    outline?: boolean;
    glow?: boolean;
    reflection?: boolean;
    emboss?: boolean;
    engrave?: boolean;
  };
  typography?: {
    kerning?: boolean;
    ligatures?: boolean;
    stylisticSets?: number[];
  };
  inlineImage?: string; // Base64 or URL
  imageWidth?: number;  // Display width in px
  imageHeight?: number; // Display height in px
  imageRotation?: number; // degrees, 0/90/180/270
  imageFlipH?: boolean;   // flip horizontal
  imageFlipV?: boolean;   // flip vertical
  inlineSmartArtId?: string; // Reference to a SmartArtObject in DocModel.smartArts
};

export type BorderStyle = 'single' | 'double' | 'dashed' | 'dotted' | 'thick';
export type BorderDef = { style: BorderStyle; width: number; color: string };
export type ParaBorders = {
  top?: BorderDef;
  bottom?: BorderDef;
  left?: BorderDef;
  right?: BorderDef;
  between?: BorderDef;
  padding?: number; // px from text
  shadow?: 'none' | 'drop' | 'bottom' | 'right';
};

export type ParaFmt = {
  styleId?: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'distributed';
  leftIndent?: number;     // px
  rightIndent?: number;    // px
  firstLineIndent?: number;// px
  hangingIndent?: number;  // px
  mirrorIndent?: boolean;
  spaceBefore?: number;    // px
  spaceAfter?: number;     // px
  lineSpacing?: number;    // multiplier (1.0 = single)
  listType?: 'bullet' | 'number' | 'multilevel' | null;
  listFormat?: string;     // 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'
  listFormatTemplate?: string; // e.g., '%0.%1.%2.'
  listFormatArray?: string[];  // ['decimal', 'decimal', 'decimal']
  listLevel?: number;      // 0-based
  numberPrefix?: string;
  numberSuffix?: string;
  listStartAt?: number;
  listRestart?: boolean;
  bulletType?: 'symbol' | 'image' | 'svg';
  bulletChar?: string;
  bulletFont?: string;
  bulletSize?: number;     // e.g., 100 for 100%, 150 for 150%
  bulletColor?: string;
  bulletImage?: string;    // Base64 or URL
  shading?: string;        // CSS color
  borders?: ParaBorders;
  textDirection?: 'ltr' | 'rtl';
  keepTogether?: boolean;
  keepNext?: boolean;
  pageBreak?: boolean;
  suppressLineNumbers?: boolean;

  // ─── Table Flat Tagging ───
  tableId?: string;
  tableRowId?: string;
  tableCellId?: string;
  tableColIdx?: number;
  tableRowIdx?: number;
  tableColSpan?: number;
  tableRowSpan?: number;
  isCovered?: boolean;
  tableSubColIdx?: number;
  tableSubCols?: number;
  tableSubRowIdx?: number;
  tableSubRows?: number;
  tableColWidths?: number[];
  tableBorders?: ParaBorders;
  tableBg?: string;
  tableCellPadding?: number;
  cellVAlign?: 'top' | 'middle' | 'bottom';
  minRowHeight?: number;
  
  // ─── Table Design & Styling ───
  tableStyleId?: string;       // e.g., 'Grid Table 1 Light'
  tableHeaderRow?: boolean;
  tableTotalRow?: boolean;
  tableBandedRows?: boolean;
  tableFirstColumn?: boolean;
  tableLastColumn?: boolean;
  tableBandedColumns?: boolean;
  tableAltTitle?: string;
  tableAltText?: string;
};

// ─── SmartArt Data Model ───
export type SmartArtNode = {
  id: string;
  text: string;
  children: string[]; // IDs of child nodes
  parent: string | null;
  shape?: string;
  fill?: string;
  outline?: string;
  font?: Partial<RunFmt>;
};

export type SmartArtObject = {
  id: string;
  type: string;     // e.g., 'hierarchy', 'process', 'cycle'
  subType: string;  // e.g., 'orgchart', 'basic', 'radial'
  nodes: Record<string, SmartArtNode>;
  rootNodes: string[]; // IDs of top-level nodes
};

export type DocRun  = { id: string; text: string; fmt: RunFmt };
export type DocPara = { id: string; runs: DocRun[]; fmt: ParaFmt };
export type PageBorderDef = {
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
  width?: number;
  color?: string;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  applyTo?: 'all' | 'section' | 'firstPage' | 'exceptFirstPage';
};

export type PageSetup = {
  width: number; height: number;
  marginTop: number; marginBottom: number;
  marginLeft: number; marginRight: number;
  cols?: number;
  colLayout?: 'equal' | 'left' | 'right';
  lineNumbers?: 'none' | 'continuous' | 'restart-page' | 'restart-section' | 'suppress-para';
  lineNumberStart?: number;
  lineNumberStep?: number;
  pageBorder?: PageBorderDef;
  pageColor?: string;
  headerL?: string;
  headerC?: string;
  headerR?: string;
  footerL?: string;
  footerC?: string;
  footerR?: string;
  pageHeaders?: Record<number, { L?: string, C?: string, R?: string }>;
  pageFooters?: Record<number, { L?: string, C?: string, R?: string }>;
};
export type DocModel = { 
  paras: DocPara[]; 
  sections: DocSection[];
  smartArts?: Record<string, SmartArtObject>;
};

export type Caret    = { paraIdx: number; charOffset: number };
export type SelRange = { anchor: Caret; focus: Caret };

export type Style = { runFmt: Partial<RunFmt>; paraFmt: Partial<ParaFmt> };
export const STYLES: Record<string, Style> = {
  Normal:   { runFmt: { fontSize: 12, fontFamily: 'Calibri',       bold: false, italic: false, color: undefined }, paraFmt: { align: 'left',  spaceBefore: 0,  spaceAfter: 0,  lineSpacing: 1.0, listType: null } },
  Heading1: { runFmt: { fontSize: 16, fontFamily: 'Calibri Light', bold: false, italic: false, color: '#2F5496' }, paraFmt: { align: 'left',  spaceBefore: 12, spaceAfter: 0,  lineSpacing: 1.0, listType: null } },
  Heading2: { runFmt: { fontSize: 13, fontFamily: 'Calibri Light', bold: false, italic: false, color: '#2F5496' }, paraFmt: { align: 'left',  spaceBefore: 2,  spaceAfter: 0,  lineSpacing: 1.0, listType: null } },
  Heading3: { runFmt: { fontSize: 12, fontFamily: 'Calibri Light', bold: false, italic: false, color: '#1F3864' }, paraFmt: { align: 'left',  spaceBefore: 2,  spaceAfter: 0,  lineSpacing: 1.0, listType: null } },
  Title:    { runFmt: { fontSize: 28, fontFamily: 'Calibri Light', bold: false, italic: false, color: '#2F5496' }, paraFmt: { align: 'center', spaceBefore: 0, spaceAfter: 3,  lineSpacing: 1.0, listType: null } },
  Subtitle: { runFmt: { fontSize: 14, fontFamily: 'Calibri Light', bold: false, italic: true,  color: '#595959' }, paraFmt: { align: 'center', spaceBefore: 0, spaceAfter: 10, lineSpacing: 1.0, listType: null } },
  Quote:    { runFmt: { fontSize: 12, fontFamily: 'Calibri',       bold: false, italic: true,  color: '#595959' }, paraFmt: { align: 'center', spaceBefore: 5,  spaceAfter: 5, lineSpacing: 1.0, listType: null } },
};
