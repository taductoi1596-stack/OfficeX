export enum StyleType {
  Character = 'Character',
  Paragraph = 'Paragraph',
  Table = 'Table',
  Numbering = 'Numbering'
}

/**
 * Representation of raw formatting properties (similar to CSS).
 * Any property that is `undefined` means it should be inherited from a parent style.
 */
export interface CharacterFormatting {
  fontFamily?: string;
  fontSize?: number; // In points (pt) or half-points (dxa) depending on engine design. Let's use pt for now.
  color?: string; // hex
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

export interface ParagraphFormatting {
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number; // Multiplier, e.g. 1.5
  spaceBefore?: number; // pt
  spaceAfter?: number; // pt
  indentLeft?: number; // pt
  indentRight?: number; // pt
  indentFirstLine?: number; // pt
}

export interface CombinedFormatting extends CharacterFormatting, ParagraphFormatting {}
