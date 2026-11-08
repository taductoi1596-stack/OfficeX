export type ParagraphData = {
  id: string;
  html: string;
};

export type PageData = {
  id: string;
  paragraphs: ParagraphData[];
};

export class LivePaginationEngine {
  public static readonly PAGE_HEIGHT = 1056; // 11in at 96dpi
  public static readonly PAGE_MARGINS = 96 * 2; // 1in top and bottom
  public static readonly PRINTABLE_HEIGHT = LivePaginationEngine.PAGE_HEIGHT - LivePaginationEngine.PAGE_MARGINS;

  /**
   * Repaginates the document model based on the live DOM.
   * Note: This is an expensive operation that should be debounced or run on structural mutations.
   * @param pages The current OM pages
   * @param container The DOM element containing the rendered pages
   * @returns A new OM array of pages if pagination changed, or null if no change.
   */
  public static repaginate(pages: PageData[], container: HTMLElement): PageData[] | null {
    let hasChanges = false;
    const newPages: PageData[] = [];
    
    // We must capture the updated HTML from the DOM because the user might have typed Enter
    // which creates new <div>s without data-id or page-paragraph classes.
    const pageContents = Array.from(container.querySelectorAll('.page-content'));
    const parsedParagraphs: ParagraphData[] = [];
    const seenIds = new Set<string>();

    pageContents.forEach(contentNode => {
      // Iterate over immediate children of page-content (these are the paragraphs)
      Array.from(contentNode.childNodes).forEach(child => {
        if (child.nodeType === 1) { // ELEMENT_NODE
          const element = child as HTMLElement;
          let existingId = element.getAttribute('data-id');
          
          // Browser clones elements on Enter, which copies the data-id!
          // If we've already seen this ID, we must generate a new one.
          if (!existingId || seenIds.has(existingId)) {
            existingId = `p-${Math.random().toString(36).substring(2, 9)}`;
          }
          seenIds.add(existingId);
          
          parsedParagraphs.push({
            id: existingId,
            html: element.innerHTML || '<br/>'
          });
          // For measurement later
          element.setAttribute('data-parsed-id', parsedParagraphs[parsedParagraphs.length - 1].id);
        } else if (child.nodeType === 3 && child.textContent?.trim()) { // TEXT_NODE
          // Browser somehow inserted naked text
          parsedParagraphs.push({
            id: `p-${Math.random().toString(36).substring(2, 9)}`,
            html: child.textContent || ''
          });
        }
      });
    });

    if (parsedParagraphs.length === 0) {
      parsedParagraphs.push({ id: `p-init`, html: '<br/>' });
    }
    
    // Now perform the pagination logic
    let currentPage: PageData = { id: `page-${Math.random()}`, paragraphs: [] };
    let currentY = 0;
    
    for (const para of parsedParagraphs) {
      // Find the DOM node we just parsed to measure its height
      const node = container.querySelector(`[data-parsed-id="${para.id}"]`) as HTMLElement;
      let pHeight = 24; // fallback minimum height
      if (node) {
        pHeight = node.getBoundingClientRect().height;
      }
      
      if (currentY > 0 && currentY + pHeight > this.PRINTABLE_HEIGHT) {
        // Break to new page
        newPages.push(currentPage);
        currentPage = { id: `page-${Math.random()}`, paragraphs: [] };
        currentY = 0;
      }
      
      currentPage.paragraphs.push(para);
      currentY += pHeight;
    }
    
    if (currentPage.paragraphs.length > 0) {
      newPages.push(currentPage);
    }
    
    // Always ensure at least one page
    if (newPages.length === 0) {
      newPages.push({ id: `page-init`, paragraphs: [{ id: `p-init`, html: '<br/>' }] });
    }
    
    // Check if lengths are different or page mappings changed
    if (newPages.length !== pages.length) {
      hasChanges = true;
    } else {
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].paragraphs.length !== newPages[i].paragraphs.length) {
          hasChanges = true;
          break;
        }
        for (let j = 0; j < pages[i].paragraphs.length; j++) {
          if (pages[i].paragraphs[j].id !== newPages[i].paragraphs[j].id) {
            hasChanges = true;
            break;
          }
        }
      }
    }
    
    return hasChanges ? newPages : null;
  }
}
