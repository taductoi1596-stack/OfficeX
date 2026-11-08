import { paraText } from './document/DocumentEngine';
import type { DocModel, DocPara } from './document/DocumentTypes';

export interface SearchResult {
  paraId: string;
  paraIndex: number;
  matchStart: number;
  matchLength: number;
  textPreview: string;
}

export class FindEngine {
  static searchAll(root: DocModel, query: string, matchCase = false): SearchResult[] {
    if (!query || query.trim() === '') return [];
    
    const results: SearchResult[] = [];
    const q = matchCase ? query : query.toLowerCase();

    // Iterate paragraphs
    root.paras.forEach((para: DocPara, index: number) => {
      const fullText = paraText(para);
      const textToSearch = matchCase ? fullText : fullText.toLowerCase();

      let startIndex = 0;
      let matchIdx = textToSearch.indexOf(q, startIndex);

      while (matchIdx !== -1) {
        // Construct preview snippet: 20 chars before and 40 chars after
        const previewStart = Math.max(0, matchIdx - 20);
        const previewEnd = Math.min(fullText.length, matchIdx + query.length + 40);
        const snippet = fullText.substring(previewStart, previewEnd);

        results.push({
          paraId: para.id,
          paraIndex: index,
          matchStart: matchIdx,
          matchLength: query.length,
          textPreview: (previewStart > 0 ? '...' : '') + snippet + (previewEnd < fullText.length ? '...' : '')
        });

        startIndex = matchIdx + query.length;
        matchIdx = textToSearch.indexOf(q, startIndex);
      }
    });

    return results;
  }
}
