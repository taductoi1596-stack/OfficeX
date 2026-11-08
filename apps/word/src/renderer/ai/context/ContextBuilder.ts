/**
 * ContextBuilder.ts
 *
 * Aggregates context from the document (metadata, selection, full text, structure).
 */

import { EditorAPI } from '../../editorApi';

export interface RawContext {
  metadata: Record<string, string>;
  selectedText: string;
  fullDocumentText: string;
}

export class ContextBuilder {
  static buildRawContext(): RawContext {
    const api = EditorAPI.getLegacy();
    
    if (!api) {
      return {
        metadata: {},
        selectedText: '',
        fullDocumentText: '',
      };
    }

    return {
      metadata: api.getDocumentMetadata(),
      selectedText: api.getSelectedText(),
      fullDocumentText: api.getFullDocumentText(),
    };
  }

  static formatToMarkdown(raw: RawContext): string {
    let out = '';

    // Metadata
    out += '[METADATA]\n';
    for (const [key, value] of Object.entries(raw.metadata)) {
      out += `${key}: ${value}\n`;
    }
    out += '[/METADATA]\n\n';

    // Full Document Context (if there's no selection, we emphasize the full doc)
    // In a real scenario, this is where chunking/ranking happens.
    // For this prototype, we'll include it if it's not too huge.
    out += '[DOCUMENT CONTEXT]\n';
    out += raw.fullDocumentText + '\n';
    out += '[/DOCUMENT CONTEXT]\n\n';

    // Selection
    if (raw.selectedText) {
      out += '[SELECTION]\n';
      out += raw.selectedText + '\n';
      out += '[/SELECTION]\n\n';
    }

    return out.trim();
  }
}
