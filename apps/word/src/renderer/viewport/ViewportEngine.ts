import { VisibleRange, Coordinate, ScreenCaret } from './ViewportTypes';
import { PageBox } from '../pagination/PaginationTypes';
import { LayoutResult } from '../layout/LayoutTypes';
import { HitTestEngine } from '../hittest/HitTestEngine';
import { Caret } from '../document/DocumentTypes';
import { CoordinateEngine } from '../coordinate/CoordinateEngine';

export class ViewportEngine {
  private static instance: ViewportEngine;

  private constructor() {}

  public static get(): ViewportEngine {
    if (!ViewportEngine.instance) {
      ViewportEngine.instance = new ViewportEngine();
    }
    return ViewportEngine.instance;
  }

  public calculateVisiblePages(
    scrollTop: number,
    clientHeight: number,
    pages: PageBox[],
    zoom: number,
    pageGap: number = 24
  ): VisibleRange {
    let currentY = 0;
    let s = 0;
    let e = 0;

    for (let i = 0; i < pages.length; i++) {
      const pageH = (pages[i].section.pageSetup.height + pageGap) * zoom;
      
      if (currentY + pageH > scrollTop && s === 0 && i !== 0) {
        s = i;
      }
      if (currentY > scrollTop + clientHeight) {
        e = i;
        break;
      }
      currentY += pageH;
    }
    
    if (e === 0) e = pages.length;
    
    // Add some buffer
    s = Math.max(0, s - 1);
    e = Math.min(pages.length, e + 1);
    
    return { start: s, end: e };
  }

  public calculateAutoScroll(
    sc: ScreenCaret,
    scrollTop: number,
    clientHeight: number,
    pages: PageBox[],
    zoom: number,
    pageGap: number = 24
  ): number | null {
    let top = 0;
    for (let i = 0; i < sc.pageIdx; i++) {
      top += (pages[i].section.pageSetup.height + pageGap) * zoom;
    }
    top += sc.localY * zoom;
    const bottom = top + sc.height * zoom;
    
    if (top < scrollTop + 40) {
      return Math.max(0, top - 40);
    }
    if (bottom > scrollTop + clientHeight - 40) {
      return bottom - clientHeight + 40;
    }
    return null; // No scrolling needed
  }

  // Map Screen mouse coordinates to Layout coordinate space
  public screenToDocument(
    clientX: number,
    clientY: number,
    containerRect: DOMRect,
    zoom: number
  ): Coordinate {
    const ce = CoordinateEngine.get();
    const windowPt = { x: clientX, y: clientY };
    const viewportPt = ce.WindowToViewport(windowPt, containerRect);
    return ce.ViewportToCanvas(viewportPt, zoom);
  }

  public hitTest(
    clientX: number,
    clientY: number,
    containerRect: DOMRect,
    pageIdx: number,
    pages: PageBox[],
    zoom: number
  ): Caret {
    const { x, y } = this.screenToDocument(clientX, clientY, containerRect, zoom);
    return HitTestEngine.get().hitTest(pageIdx, x, y, pages, pages[pageIdx]?.section.pageSetup);
  }
}
