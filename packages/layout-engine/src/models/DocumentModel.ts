// ─────────────────────────────────────────────────────────────────────────────
// Document Model (Logical Data)
// ─────────────────────────────────────────────────────────────────────────────

export type TextRun = {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  isBold?: boolean;
  isItalic?: boolean;
};

export type Paragraph = {
  type: 'paragraph';
  runs: TextRun[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
  lineSpacing?: number;
  spacingBefore?: number;
  spacingAfter?: number;
  indent?: number;
};

export type Section = {
  type: 'section';
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  children: Paragraph[]; // Simplification: Only paragraphs for now
};

export type Document = {
  type: 'document';
  sections: Section[];
};
