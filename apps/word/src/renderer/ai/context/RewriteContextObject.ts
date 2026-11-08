/**
 * Rewrite Context Object (RCO)
 * 
 * Defines the structured data model for AI rewrite context.
 */

export interface SelectionContext {
  text: string;
  length: number;
  language?: string;
  formatting?: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    font?: string;
    style?: string;
  };
}

export interface ParagraphContext {
  previousText?: string;
  currentText: string;
  nextText?: string;
  alignment?: string;
  isList?: boolean;
}

export interface DocumentContext {
  title?: string;
  author?: string;
  wordCount: number;
  documentType?: string;
}

export interface EnterpriseContext {
  department?: string;
  project?: string;
  approvedTerms?: string[];
  restrictedTerms?: string[];
}

export interface SemanticContext {
  detectedTone?: string;
  readingLevel?: string;
}

export interface RewriteContextObject {
  id: string;
  timestamp: number;
  
  selection: SelectionContext;
  paragraph?: ParagraphContext;
  document?: DocumentContext;
  enterprise?: EnterpriseContext;
  semantic?: SemanticContext;
  
  tokenCountEstimate: number;
}
