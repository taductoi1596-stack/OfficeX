import type { DocModel, DocPara } from '../document/DocumentTypes';
import type { DocSection } from '../section/SectionTypes';
import type { HeaderFooterModel, HeaderFooterType, WatermarkModel } from './HeaderFooterTypes';

export class HeaderFooterEngine {
  private static instance: HeaderFooterEngine;

  private constructor() {}

  public static get(): HeaderFooterEngine {
    if (!HeaderFooterEngine.instance) {
      HeaderFooterEngine.instance = new HeaderFooterEngine();
    }
    return HeaderFooterEngine.instance;
  }

  public Initialize() {
    // Initialization hook for any cached structures
  }

  // Generate a blank HeaderFooterModel
  public CreateHeaderFooter(type: HeaderFooterType = 'default'): HeaderFooterModel {
    return {
      id: crypto.randomUUID(),
      type,
      paras: []
    };
  }

  // Get the active header for a specific page number (1-based index)
  public GetActiveHeader(section: DocSection, pageNumber: number): HeaderFooterModel | null {
    if (!section.headers || section.headers.length === 0) return null;
    
    const settings = section.headerFooterSettings;
    if (!settings) return section.headers.find(h => h.type === 'default') || null;

    if (settings.differentFirstPage && pageNumber === 1) {
      const firstPageHeader = section.headers.find(h => h.type === 'first');
      if (firstPageHeader) return firstPageHeader;
    }

    if (settings.differentOddEven) {
      const isEven = pageNumber % 2 === 0;
      const oddEvenHeader = section.headers.find(h => h.type === (isEven ? 'even' : 'default'));
      if (oddEvenHeader) return oddEvenHeader;
    }

    return section.headers.find(h => h.type === 'default') || null;
  }

  // Get the active footer for a specific page number (1-based index)
  public GetActiveFooter(section: DocSection, pageNumber: number): HeaderFooterModel | null {
    if (!section.footers || section.footers.length === 0) return null;
    
    const settings = section.headerFooterSettings;
    if (!settings) return section.footers.find(f => f.type === 'default') || null;

    if (settings.differentFirstPage && pageNumber === 1) {
      const firstPageFooter = section.footers.find(f => f.type === 'first');
      if (firstPageFooter) return firstPageFooter;
    }

    if (settings.differentOddEven) {
      const isEven = pageNumber % 2 === 0;
      const oddEvenFooter = section.footers.find(f => f.type === (isEven ? 'even' : 'default'));
      if (oddEvenFooter) return oddEvenFooter;
    }

    return section.footers.find(f => f.type === 'default') || null;
  }

  // Evaluates fields (like {PAGE}) in a paragraph for layout mapping
  // Note: This is a simplistic 1st-pass field evaluation designed for Render engine display
  public EvaluateFields(paras: DocPara[], pageNumber: number, totalPages: number): DocPara[] {
    return paras.map(p => ({
      ...p,
      runs: p.runs.map(r => {
        let text = r.text;
        if (text.includes('{PAGE}')) {
          text = text.replace(/\{PAGE\}/g, pageNumber.toString());
        }
        if (text.includes('{NUMPAGES}')) {
          text = text.replace(/\{NUMPAGES\}/g, totalPages.toString());
        }
        return { ...r, text };
      })
    }));
  }

  public ClearCache() {
    // Clear any internally memoized mappings
  }
}
