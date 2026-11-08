import { Section } from '../models/DocumentModel';
import { LayoutParagraph, LayoutPage } from '../models/LayoutTree';

export class PaginationEngine {
  /**
   * Paginates a list of layout paragraphs into pages based on section constraints.
   */
  public paginate(paragraphs: LayoutParagraph[], section: Section, startPageNumber: number = 1): LayoutPage[] {
    const pages: LayoutPage[] = [];
    
    const pageAvailableWidth = section.pageWidth - section.marginLeft - section.marginRight;
    const pageAvailableHeight = section.pageHeight - section.marginTop - section.marginBottom;

    let currentPage: LayoutPage = this.createNewPage(startPageNumber, section);
    let currentY = 0;

    for (const para of paragraphs) {
      // Very basic pagination: If a paragraph exceeds available height, move it to next page
      // Note: A real engine would split the paragraph across pages (widow/orphan control)
      if (currentY + para.height > pageAvailableHeight && currentY > 0) {
        pages.push(currentPage);
        currentPage = this.createNewPage(++startPageNumber, section);
        currentY = 0;
      }

      para.x = section.marginLeft;
      para.y = section.marginTop + currentY;
      
      currentPage.paragraphs.push(para);
      currentY += para.height;
    }

    if (currentPage.paragraphs.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  }

  private createNewPage(pageNumber: number, section: Section): LayoutPage {
    return {
      type: 'page',
      pageNumber,
      width: section.pageWidth,
      height: section.pageHeight,
      paragraphs: []
    };
  }
}
