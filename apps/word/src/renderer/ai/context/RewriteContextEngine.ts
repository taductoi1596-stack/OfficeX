/**
 * Rewrite Context Engine
 * 
 * Aggregates surrounding document context (selection, paragraph, metadata)
 * into a single Rewrite Context Object (RCO) for the AI.
 */

import { EditorAPI } from '../../editorApi';
import { RewriteContextObject } from './RewriteContextObject';

export class RewriteContextEngine {
  private static cache: Map<string, RewriteContextObject> = new Map();

  /**
   * Builds the comprehensive context object required for a rewrite request.
   */
  static build(api: any): RewriteContextObject {
    const selection = api.getSelectedText?.() || "";
    
    // In a real implementation, we would extract robust metadata from the document model.
    // For now, we mock the retrieval of surrounding context from EditorAPI.
    
    const previousParagraph = typeof (api as any).getPreviousParagraph === 'function' 
      ? (api as any).getPreviousParagraph() 
      : '';
    const nextParagraph = typeof (api as any).getNextParagraph === 'function' 
      ? (api as any).getNextParagraph() 
      : '';
    const formatting = typeof (api as any).getSelectionFormatting === 'function'
      ? (api as any).getSelectionFormatting()
      : { isBold: false, isItalic: false, isUnderline: false };
    const metadata = typeof (api as any).getDocumentMetadata === 'function'
      ? (api as any).getDocumentMetadata()
      : { title: 'Untitled Document', author: 'User' };

    const rco: RewriteContextObject = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      
      selection: {
        text: selection,
        length: selection.length,
        language: 'en-US', // Default
        formatting
      },
      
      paragraph: {
        previousText: previousParagraph,
        currentText: typeof (api as any).getCurrentParagraph === 'function' ? (api as any).getCurrentParagraph() : selection,
        nextText: nextParagraph,
      },
      
      document: {
        title: metadata.title,
        author: metadata.author,
        wordCount: Number(metadata.wordCount) || 0,
        documentType: 'Word Document'
      },
      
      enterprise: {
        department: 'Engineering',
        project: 'Project Alpha'
      },

      semantic: {
        detectedTone: 'Neutral',
        readingLevel: 'Intermediate'
      },
      
      tokenCountEstimate: this.estimateTokens(selection)
    };

    this.cache.set(rco.id, rco);
    return rco;
  }

  /**
   * Reduces and optimizes the RCO to save tokens.
   */
  static optimize(rco: RewriteContextObject): RewriteContextObject {
    // Trim whitespaces
    if (rco.selection.text) {
      rco.selection.text = rco.selection.text.trim();
    }
    if (rco.paragraph?.previousText) {
      rco.paragraph.previousText = rco.paragraph.previousText.trim();
    }
    if (rco.paragraph?.nextText) {
      rco.paragraph.nextText = rco.paragraph.nextText.trim();
    }
    return rco;
  }

  static getCached(id: string): RewriteContextObject | undefined {
    return this.cache.get(id);
  }

  static clearCache() {
    this.cache.clear();
  }

  private static estimateTokens(text: string): number {
    // Rough estimate: 1 token ~= 4 characters
    return Math.ceil(text.length / 4);
  }
}
