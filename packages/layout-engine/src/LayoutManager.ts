import { Document, Section } from './models/DocumentModel';
import { LayoutTree, LayoutPage, LayoutParagraph } from './models/LayoutTree';
import { IMeasurementEngine, MockMeasurementEngine } from './engines/MeasurementEngine';
import { LineBreakingEngine } from './engines/LineBreakingEngine';
import { ParagraphLayoutEngine } from './engines/ParagraphLayoutEngine';
import { PaginationEngine } from './engines/PaginationEngine';

export class LayoutManager {
  private measurementEngine: IMeasurementEngine;
  private lineBreakingEngine: LineBreakingEngine;
  private paragraphLayoutEngine: ParagraphLayoutEngine;
  private paginationEngine: PaginationEngine;

  constructor(measurementEngine?: IMeasurementEngine) {
    // Default to Mock measurement if none provided
    this.measurementEngine = measurementEngine || new MockMeasurementEngine();
    this.lineBreakingEngine = new LineBreakingEngine(this.measurementEngine);
    this.paragraphLayoutEngine = new ParagraphLayoutEngine(this.lineBreakingEngine);
    this.paginationEngine = new PaginationEngine();
  }

  /**
   * Layouts an entire document into a visual Layout Tree
   */
  public layoutDocument(document: Document): LayoutTree {
    const allPages: LayoutPage[] = [];
    let startPageNumber = 1;

    for (const section of document.sections) {
      const availableWidth = section.pageWidth - section.marginLeft - section.marginRight;
      const layoutParagraphs: LayoutParagraph[] = [];

      // 1. Layout all paragraphs independently (infinite vertical space assumption initially)
      for (const paragraph of section.children) {
        const layoutPara = this.paragraphLayoutEngine.layoutParagraph(paragraph, availableWidth);
        layoutParagraphs.push(layoutPara);
      }

      // 2. Paginate the layouted paragraphs
      const sectionPages = this.paginationEngine.paginate(layoutParagraphs, section, startPageNumber);
      
      allPages.push(...sectionPages);
      startPageNumber += sectionPages.length;
    }

    return {
      type: 'layout-tree',
      pages: allPages
    };
  }
}
