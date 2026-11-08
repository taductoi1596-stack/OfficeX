import { PageSetup, DocModel } from '../document/DocumentTypes';
import { LayoutResult } from '../layout/LayoutTypes';
import { HeaderFooterEngine } from '../headerfooter/HeaderFooterEngine';
import { LayoutEngine } from '../layout/LayoutEngine';
import { SectionEngine } from '../section/SectionEngine';
import { PageBox, PaginationEvent, PaginationEventType } from './PaginationTypes';

export class PaginationEngine {
  private static _instance: PaginationEngine;
  private listeners: ((event: PaginationEvent) => void)[] = [];
  
  // Cache of paginated results to avoid rebuilding on minor edits
  private pageCache: PageBox[] = [];
  private lastLayoutResult: LayoutResult | null = null;

  public static get(): PaginationEngine {
    if (!this._instance) {
      this._instance = new PaginationEngine();
    }
    return this._instance;
  }

  public subscribe(listener: (event: PaginationEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: PaginationEvent) {
    this.listeners.forEach(l => l(event));
  }

  /**
   * The core layout algorithm to distribute LayoutLines into PageBoxes.
   *
   * Key concept:
   *   rawLine.y  = absolute Y in LayoutEngine's infinite canvas (never changes)
   *   gTop       = cumulative page height consumed so far
   *   effectiveY = rawLine.y + yShift
   *                yShift accounts for extra "push to next page" gaps introduced
   *                when an image would overflow a column.
   *
   * When an image overflows the column bottom we add a gap so that
   * effectiveY lands at the start of the next page, without corrupting
   * the Y positions of subsequent lines (they inherit the same yShift).
   */
  public paginate(doc: DocModel, layout: LayoutResult): PageBox[] {
    const se = SectionEngine.get();
    const pages: PageBox[] = [];
    let pIdx = 0, gTop = 0;
    
    // Initialize first page with the section of the first paragraph (or a dummy if empty)
    let currentSection = doc.paras.length > 0 ? se.GetSectionForPara(doc, 0) : se.GetSectionForPara(doc, -1);
    let printH = currentSection.pageSetup.height - currentSection.pageSetup.marginTop - currentSection.pageSetup.marginBottom;
    
    let page: PageBox = { pageIdx: pIdx, lines: [], globalTop: 0, section: currentSection };

    const getColInfo = (setup: PageSetup) => {
      const cols = Math.max(1, setup?.cols || 1);
      const gap = 18;
      const totalW = Math.max(100, (setup?.width || 816) - (setup?.marginLeft || 96) - (setup?.marginRight || 96));
      const colLefts: number[] = [];
      if (cols <= 1) {
        colLefts.push(0);
      } else if (setup?.colLayout === 'left') {
        const w1 = (totalW - gap) * 0.35;
        colLefts.push(0, w1 + gap);
      } else if (setup?.colLayout === 'right') {
        const w1 = (totalW - gap) * 0.65;
        colLefts.push(0, w1 + gap);
      } else {
        const w = (totalW - (cols - 1) * gap) / cols;
        for (let i = 0; i < cols; i++) {
          colLefts.push(i * (w + gap));
        }
      }
      return { cols, colLefts };
    };

    let colInfo = getColInfo(currentSection.pageSetup);
    printH = Math.max(100, (currentSection.pageSetup?.height || 1056) - (currentSection.pageSetup?.marginTop || 96) - (currentSection.pageSetup?.marginBottom || 96));
    let pageCapH = Math.max(100, colInfo.cols * printH);

    // yShift: tổng offset cộng thêm vào rawLine.y để tính effectiveY.
    // Mỗi khi ảnh bị đẩy sang trang sau, chúng ta tăng yShift đúng bằng
    // khoảng trống bỏ trống trong cột hiện tại (printH - colLocalY).
    // Điều này đảm bảo tất cả các line SAU ảnh cũng dịch chuyển cùng lượng đó,
    // nên vị trí tương đối giữa chúng vẫn đúng.
    let yShift = 0;

    for (const lp of layout.paras) {
      const paraSection = se.GetSectionForPara(doc, lp.paraIdx);
      
      // If we cross a section boundary and it's a NextPage break
      if (paraSection.id !== currentSection.id) {
        if (paraSection.breakType === 'NextPage' || paraSection.breakType === 'OddPage' || paraSection.breakType === 'EvenPage') {
          if (page.lines.length > 0) {
            pages.push(page);
            pIdx++;
            gTop += pageCapH;
            currentSection = paraSection;
            colInfo = getColInfo(currentSection.pageSetup);
            printH = Math.max(100, (currentSection.pageSetup?.height || 1056) - (currentSection.pageSetup?.marginTop || 96) - (currentSection.pageSetup?.marginBottom || 96));
            pageCapH = Math.max(100, colInfo.cols * printH);
            page = { pageIdx: pIdx, lines: [], globalTop: gTop, section: currentSection };
          }
        }
        currentSection = paraSection;
        colInfo = getColInfo(currentSection.pageSetup);
        printH = Math.max(100, (currentSection.pageSetup?.height || 1056) - (currentSection.pageSetup?.marginTop || 96) - (currentSection.pageSetup?.marginBottom || 96));
        pageCapH = Math.max(100, colInfo.cols * printH);
        page.section = currentSection;
      }

      // Check for manual page break on the paragraph
      if (doc.paras[lp.paraIdx]?.fmt?.pageBreak) {
        if (page.lines.length > 0 && lp.paraIdx > currentSection.startParaIdx) {
          pages.push(page);
          pIdx++;
          gTop += pageCapH;
          page = { pageIdx: pIdx, lines: [], globalTop: gTop, section: currentSection };
        }
      }

      for (const rawLine of lp.lines) {
        // effectiveY = vị trí thực sau khi đã cộng offset từ các lần push ảnh trước
        const effectiveY = rawLine.y + yShift;

        // ── Standard overflow: advance pages until this line fits ──
        let safetyCounter = 0;
        while (effectiveY >= gTop + pageCapH && safetyCounter++ < 500) {
          pages.push(page);
          pIdx++;
          gTop += pageCapH;
          page = { pageIdx: pIdx, lines: [], globalTop: gTop, section: currentSection };
        }

        // Tính vị trí trong trang/cột hiện tại
        const relY = Math.max(0, effectiveY - gTop);
        const colIdx = Math.min(colInfo.cols - 1, Math.max(0, Math.floor(relY / printH)));
        const colLocalY = relY - colIdx * printH;
        const marginTopPx = currentSection.pageSetup?.marginTop || 96;

        // ── Image keep-together: đẩy ảnh sang trang sau nếu bị cắt ──
        //
        // Thay vì thay đổi gTop trực tiếp (gây sai vị trí lines sau),
        // ta tăng yShift đúng bằng khoảng còn lại trong cột hiện tại.
        // → tất cả lines sau đó đều tịnh tiến thêm cùng lượng này
        // → chúng sẽ bắt đầu từ đầu trang tiếp theo, đúng vị trí.
        const imgToken = rawLine.tokens.find(t => t.fmt?.inlineImage);
        if (imgToken) {
          const imgH = imgToken.fmt.imageHeight ?? rawLine.height;
          const imgBottomInCol = colLocalY + imgH;

          // DEBUG
          console.log('[Pagination] image detected:', {
            'rawLine.y': rawLine.y,
            effectiveY,
            colLocalY,
            imgH,
            imgBottomInCol,
            printH,
            willPush: imgBottomInCol > printH && imgH <= printH
          });

          // Ảnh sẽ bị cắt nếu đáy vượt quá chiều cao cột
          // Chỉ áp dụng nếu ảnh đủ nhỏ để vừa một trang (tránh loop vô hạn)
          if (imgBottomInCol > printH && imgH <= printH) {
            // Khoảng trống còn lại trong cột hiện tại trước khi ảnh bắt đầu
            // → đây là lượng chúng ta cần "nhảy qua" để sang đầu trang sau
            const gapToNextPage = printH - colLocalY;
            yShift += gapToNextPage;

            // effectiveY mới = rawLine.y + yShift_mới
            // = rawLine.y + yShift_cũ + gapToNextPage
            // = effectiveY + gapToNextPage
            // = colLocalY (trong gTop) + gapToNextPage + gTop
            // = printH + gTop  → đầu chính xác của cột tiếp theo / trang tiếp theo

            // Bây giờ tính lại vị trí với effectiveY mới
            const newEffectiveY = effectiveY + gapToNextPage;

            // Advance page nếu cần
            while (newEffectiveY >= gTop + pageCapH && safetyCounter++ < 500) {
              pages.push(page);
              pIdx++;
              gTop += pageCapH;
              page = { pageIdx: pIdx, lines: [], globalTop: gTop, section: currentSection };
            }

            const newRelY = Math.max(0, newEffectiveY - gTop);
            const newColIdx = Math.min(colInfo.cols - 1, Math.max(0, Math.floor(newRelY / printH)));
            const newColLocalY = newRelY - newColIdx * printH;
            const newYVisual = newColLocalY + marginTopPx;
            const newXOffset = colInfo.colLefts[newColIdx] || 0;

            page.lines.push({
              ...rawLine,
              colIdx: newColIdx,
              xOffset: newXOffset,
              yVisual: newYVisual,
              pageIdx: pIdx,
            });

            continue; // bỏ qua path thông thường bên dưới
          }
        }

        // ── Path thông thường ──
        const yVisual = colLocalY + marginTopPx;
        const xOffset = colInfo.colLefts[colIdx] || 0;

        page.lines.push({
          ...rawLine,
          colIdx,
          xOffset,
          yVisual,
          pageIdx: pIdx,
        });
      }
    }
    
    pages.push(page);
    
    // Evaluate and layout Header/Footers for each page
    const totalPages = pages.length;
    const hfe = HeaderFooterEngine.get();
    const le = LayoutEngine.get();

    for (let i = 0; i < totalPages; i++) {
      const pIdx = i; // 0-based index
      const pageNum = i + 1; // 1-based page number
      const section = pages[i].section;
      
      const activeHeader = hfe.GetActiveHeader(section, pageNum);
      if (activeHeader) {
        const evaluatedHeaderParas = hfe.EvaluateFields(activeHeader.paras, pageNum, totalPages);
        pages[i].headerLayout = le.calculateParas(evaluatedHeaderParas, () => section.pageSetup.width - section.pageSetup.marginLeft - section.pageSetup.marginRight);
      }

      const activeFooter = hfe.GetActiveFooter(section, pageNum);
      if (activeFooter) {
        const evaluatedFooterParas = hfe.EvaluateFields(activeFooter.paras, pageNum, totalPages);
        pages[i].footerLayout = le.calculateParas(evaluatedFooterParas, () => section.pageSetup.width - section.pageSetup.marginLeft - section.pageSetup.marginRight);
      }
    }

    // Check if pagination count changed
    if (this.pageCache.length !== pages.length) {
      this.emit({ type: 'PageReflow', totalPages: pages.length });
    }
    
    this.pageCache = pages;
    this.lastLayoutResult = layout;
    
    return pages;
  }
  
  public getPageCount(): number {
    return this.pageCache.length;
  }
  
  public getPage(index: number): PageBox | undefined {
    return this.pageCache[index];
  }
}
