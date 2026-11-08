import JSZip from 'jszip';
import type { DocModel, DocPara, DocRun, RunFmt, ParaFmt } from '../document/DocumentTypes';
import type { DocSection } from '../section/SectionTypes';

function uid(): string {
  return 'p_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}

function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'bmp': return 'image/bmp';
    case 'svg': return 'image/svg+xml';
    default: return 'image/png';
  }
}

function getElements(parent: Element | Document, localName: string): Element[] {
  if (!parent) return [];
  // 1. Try 'w:' prefix
  let list = Array.from(parent.getElementsByTagName('w:' + localName));
  if (list.length > 0) return list;
  // 2. Try bare localName
  list = Array.from(parent.getElementsByTagName(localName));
  if (list.length > 0) return list;
  // 3. Try getElementsByTagNameNS if available
  if (typeof (parent as any).getElementsByTagNameNS === 'function') {
    list = Array.from((parent as any).getElementsByTagNameNS('*', localName));
    if (list.length > 0) return list;
  }
  return [];
}

function getFirstElement(parent: Element | Document, localName: string): Element | null {
  const list = getElements(parent, localName);
  return list.length > 0 ? list[0] : null;
}

function getAttr(el: Element, attrName: string): string | null {
  if (!el) return null;
  return el.getAttribute('w:' + attrName) ||
         el.getAttribute(attrName) ||
         (el.getAttributeNS ? el.getAttributeNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', attrName) : null) ||
         null;
}

function tagMatches(el: Element, localName: string): boolean {
  if (!el) return false;
  const tn = (el.tagName || '').toLowerCase();
  const ln = (el.localName || '').toLowerCase();
  return ln === localName.toLowerCase() ||
         tn === localName.toLowerCase() ||
         tn === 'w:' + localName.toLowerCase() ||
         tn.endsWith(':' + localName.toLowerCase());
}

export class DocxParser {
  /**
   * Parse a .docx file buffer / Uint8Array / base64 into an OfficeX DocModel.
   */
  public static async parse(data: ArrayBuffer | Uint8Array | string): Promise<DocModel> {
    let zipInput: any = data;
    let loadOptions: any = undefined;

    if (typeof data === 'string') {
      const trimmed = data.trim();
      if (trimmed.startsWith('data:')) {
        const base64Index = trimmed.indexOf('base64,');
        if (base64Index !== -1) {
          zipInput = trimmed.substring(base64Index + 7);
          loadOptions = { base64: true };
        }
      } else if (trimmed.startsWith('UEsDB') || /^[A-Za-z0-9+/=\r\n]+$/.test(trimmed.slice(0, 100))) {
        zipInput = trimmed;
        loadOptions = { base64: true };
      } else if (data.startsWith('PK\x03\x04')) {
        const len = data.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = data.charCodeAt(i) & 0xff;
        }
        zipInput = bytes;
      }
    }

    const zip = await JSZip.loadAsync(zipInput, loadOptions);
    
    // 1. Read relationships to find media/images
    const imageMap = new Map<string, string>(); // rId -> base64 Data URL
    try {
      const relsFile = zip.file('word/_rels/document.xml.rels');
      if (relsFile) {
        const relsXml = await relsFile.async('text');
        const parser = new DOMParser();
        const relsDoc = parser.parseFromString(relsXml, 'text/xml');
        const relNodes = relsDoc.getElementsByTagName('Relationship');
        
        for (let i = 0; i < relNodes.length; i++) {
          const rel = relNodes[i];
          const id = rel.getAttribute('Id');
          const target = rel.getAttribute('Target');
          const type = rel.getAttribute('Type') || '';
          
          if (id && target && (type.includes('image') || target.includes('media/'))) {
            const cleanTarget = target.replace(/^\.\.\//, '').replace(/^word\//, '');
            const mediaFile = zip.file(`word/${cleanTarget}`) || zip.file(cleanTarget);
            if (mediaFile) {
              const base64 = await mediaFile.async('base64');
              const mime = getMimeType(cleanTarget);
              imageMap.set(id, `data:${mime};base64,${base64}`);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[DocxParser] Error parsing document relationships:', e);
    }

    // 2. Read word/document.xml
    const docFile = zip.file('word/document.xml');
    if (!docFile) {
      throw new Error('Invalid .docx file: word/document.xml not found');
    }

    const docXmlText = await docFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(docXmlText, 'text/xml');

    const body = getFirstElement(xmlDoc, 'body');
    if (!body) {
      throw new Error('Invalid .docx file: body element not found');
    }

    const paras: DocPara[] = [];
    let defaultPageSetup = {
      width: 816,
      height: 1056,
      marginTop: 96,
      marginBottom: 96,
      marginLeft: 96,
      marginRight: 96,
    };

    // Helper to parse run formatting
    const parseRunFmt = (rNode: Element): RunFmt => {
      const fmt: RunFmt = {};
      const rPr = getFirstElement(rNode, 'rPr');
      if (!rPr) return fmt;

      // Bold
      const b = getFirstElement(rPr, 'b');
      if (b) {
        const val = getAttr(b, 'val');
        fmt.bold = val === null || (val !== 'false' && val !== '0' && val !== 'off');
      }

      // Italic
      const it = getFirstElement(rPr, 'i');
      if (it) {
        const val = getAttr(it, 'val');
        fmt.italic = val === null || (val !== 'false' && val !== '0' && val !== 'off');
      }

      // Underline
      const u = getFirstElement(rPr, 'u');
      if (u) {
        const val = getAttr(u, 'val') || 'single';
        if (val !== 'none') {
          fmt.underline = true;
          if (val === 'double') fmt.doubleUnderline = true;
        }
      }

      // Strike
      const strike = getFirstElement(rPr, 'strike');
      if (strike) {
        const val = getAttr(strike, 'val');
        fmt.strike = val === null || (val !== 'false' && val !== '0' && val !== 'off');
      }

      // VertAlign (Superscript / Subscript)
      const vert = getFirstElement(rPr, 'vertAlign');
      if (vert) {
        const val = getAttr(vert, 'val');
        if (val === 'superscript') fmt.superscript = true;
        else if (val === 'subscript') fmt.subscript = true;
      }

      // Font size (w:sz in half-points: 24 = 12pt)
      const sz = getFirstElement(rPr, 'sz');
      if (sz) {
        const val = parseInt(getAttr(sz, 'val') || '24', 10);
        if (!isNaN(val) && val > 0) {
          fmt.fontSize = Math.round(val / 2);
        }
      }

      // Font Family
      const rFonts = getFirstElement(rPr, 'rFonts');
      if (rFonts) {
        const fontName = getAttr(rFonts, 'ascii') || getAttr(rFonts, 'hAnsi') || getAttr(rFonts, 'cs');
        if (fontName) fmt.fontFamily = fontName;
      }

      // Color
      const color = getFirstElement(rPr, 'color');
      if (color) {
        const val = getAttr(color, 'val');
        if (val && val !== 'auto') {
          fmt.color = '#' + val;
        }
      }

      // Highlight
      const highlight = getFirstElement(rPr, 'highlight');
      if (highlight) {
        const val = getAttr(highlight, 'val');
        if (val && val !== 'none') {
          fmt.highlight = val;
        }
      }

      return fmt;
    };

    // Helper to parse paragraph formatting
    const parseParaFmt = (pNode: Element): ParaFmt => {
      const fmt: ParaFmt = {};
      const pPr = getFirstElement(pNode, 'pPr');
      if (!pPr) return fmt;

      // Alignment
      const jc = getFirstElement(pPr, 'jc');
      if (jc) {
        const val = getAttr(jc, 'val') || '';
        if (val === 'center') fmt.align = 'center';
        else if (val === 'right') fmt.align = 'right';
        else if (val === 'both' || val === 'justify') fmt.align = 'justify';
        else if (val === 'distribute') fmt.align = 'distributed';
        else fmt.align = 'left';
      }

      // Spacing (twips: 20 twips = 1 pt)
      const spacing = getFirstElement(pPr, 'spacing');
      if (spacing) {
        const before = parseInt(getAttr(spacing, 'before') || '0', 10);
        const after = parseInt(getAttr(spacing, 'after') || '0', 10);
        if (!isNaN(before) && before > 0) fmt.spaceBefore = Math.round(before / 20);
        if (!isNaN(after) && after > 0) fmt.spaceAfter = Math.round(after / 20);
      }

      // Indentation (twips: 20 twips = 1 pt)
      const ind = getFirstElement(pPr, 'ind');
      if (ind) {
        const left = parseInt(getAttr(ind, 'left') || '0', 10);
        const right = parseInt(getAttr(ind, 'right') || '0', 10);
        const firstLine = parseInt(getAttr(ind, 'firstLine') || '0', 10);
        const hanging = parseInt(getAttr(ind, 'hanging') || '0', 10);
        if (!isNaN(left) && left > 0) fmt.leftIndent = Math.round(left / 20);
        if (!isNaN(right) && right > 0) fmt.rightIndent = Math.round(right / 20);
        if (!isNaN(firstLine) && firstLine > 0) fmt.firstLineIndent = Math.round(firstLine / 20);
        if (!isNaN(hanging) && hanging > 0) fmt.hangingIndent = Math.round(hanging / 20);
      }

      // Page break before
      if (getFirstElement(pPr, 'pageBreakBefore')) {
        fmt.pageBreak = true;
      }

      return fmt;
    };

    // Helper to process a single <w:p>
    const processParagraph = (pNode: Element, tableMeta?: Partial<ParaFmt>): DocPara => {
      const paraFmt: ParaFmt = {
        ...parseParaFmt(pNode),
        ...(tableMeta || {}),
      };

      const runs: DocRun[] = [];

      // Extract all children in DOM order (runs, text, drawings, breaks)
      const childNodes = Array.from(pNode.children);
      for (const child of childNodes) {
        // 1. Regular Run: <w:r>
        if (tagMatches(child, 'r')) {
          const runFmt = parseRunFmt(child);

          // Check for embedded drawing/image first
          const blips = child.getElementsByTagName('a:blip');
          const vImages = child.getElementsByTagName('v:imagedata');
          let rId = '';
          if (blips.length > 0) {
            rId = blips[0].getAttribute('r:embed') || blips[0].getAttribute('embed') || '';
          } else if (vImages.length > 0) {
            rId = vImages[0].getAttribute('r:id') || vImages[0].getAttribute('id') || '';
          }

          if (rId && imageMap.has(rId)) {
            const dataUrl = imageMap.get(rId)!;
            let w = 400;
            let h = 300;
            const extents = child.getElementsByTagName('wp:extent');
            if (extents.length > 0) {
              const cx = parseInt(extents[0].getAttribute('cx') || '0', 10);
              const cy = parseInt(extents[0].getAttribute('cy') || '0', 10);
              if (cx > 0 && cy > 0) {
                w = Math.min(600, Math.round(cx / 9525));
                h = Math.round((cy / 9525) * (w / (cx / 9525)));
              }
            }

            runs.push({
              id: uid(),
              text: '\uFFFC',
              fmt: {
                ...runFmt,
                inlineImage: dataUrl,
                imageWidth: w,
                imageHeight: h,
              }
            });
          }

          // Check text elements inside run
          let runText = '';
          for (const subChild of Array.from(child.children)) {
            if (tagMatches(subChild, 't')) {
              runText += subChild.textContent || '';
            } else if (tagMatches(subChild, 'br')) {
              runText += '\n';
            } else if (tagMatches(subChild, 'tab')) {
              runText += '\t';
            }
          }

          if (runText) {
            runs.push({
              id: uid(),
              text: runText,
              fmt: runFmt,
            });
          }
        } else if (tagMatches(child, 'hyperlink')) {
          const linkRuns = getElements(child, 'r');
          for (let ri = 0; ri < linkRuns.length; ri++) {
            const lr = linkRuns[ri];
            const fmt = {
              ...parseRunFmt(lr),
              color: '#0563C1',
              underline: true,
            };
            let text = '';
            for (const sc of Array.from(lr.children)) {
              if (tagMatches(sc, 't')) text += sc.textContent || '';
              else if (tagMatches(sc, 'br')) text += '\n';
            }
            if (text) {
              runs.push({ id: uid(), text, fmt });
            }
          }
        }
      }

      // If no runs were parsed, supply an empty run
      if (runs.length === 0) {
        runs.push({ id: uid(), text: '', fmt: {} });
      }

      return {
        id: uid(),
        runs,
        fmt: paraFmt,
      };
    };

    // Helper to process a table <w:tbl>
    const processTable = (tblNode: Element) => {
      const tableId = uid();
      const trNodes = Array.from(tblNode.children).filter(c => tagMatches(c, 'tr'));
      const numRows = trNodes.length;
      if (numRows === 0) return;

      const tblGrid = getFirstElement(tblNode, 'tblGrid');
      let colWidths: number[] = [];
      if (tblGrid) {
        const gridCols = getElements(tblGrid, 'gridCol');
        colWidths = gridCols.map(gc => {
          const w = parseInt(getAttr(gc, 'w') || '1440', 10);
          return Math.round(w / 20); // twips to pt
        });
      }

      for (let rIdx = 0; rIdx < numRows; rIdx++) {
        const trNode = trNodes[rIdx];
        const rowId = uid();
        const tcNodes = Array.from(trNode.children).filter(c => tagMatches(c, 'tc'));

        for (let cIdx = 0; cIdx < tcNodes.length; cIdx++) {
          const tcNode = tcNodes[cIdx];
          const cellId = uid();

          let colSpan = 1;
          let rowSpan = 1;
          const tcPr = getFirstElement(tcNode, 'tcPr');
          if (tcPr) {
            const gridSpan = getFirstElement(tcPr, 'gridSpan');
            if (gridSpan) {
              colSpan = parseInt(getAttr(gridSpan, 'val') || '1', 10) || 1;
            }
          }

          const tableMeta: Partial<ParaFmt> = {
            tableId,
            tableRowId: rowId,
            tableCellId: cellId,
            tableRowIdx: rIdx,
            tableColIdx: cIdx,
            tableColSpan: colSpan,
            tableRowSpan: rowSpan,
            tableColWidths: colWidths.length > 0 ? colWidths : [100, 100],
            tableHeaderRow: rIdx === 0,
            tableCellPadding: 6,
            spaceBefore: 0,
            spaceAfter: 0,
            borders: {
              top: { width: 1, style: 'solid' as any, color: '#D1D5DB' },
              bottom: { width: 1, style: 'solid' as any, color: '#D1D5DB' },
              left: { width: 1, style: 'solid' as any, color: '#D1D5DB' },
              right: { width: 1, style: 'solid' as any, color: '#D1D5DB' },
            },
          };

          const cellParas = Array.from(tcNode.children).filter(c => tagMatches(c, 'p'));
          if (cellParas.length > 0) {
            for (const cp of cellParas) {
              paras.push(processParagraph(cp, tableMeta));
            }
          } else {
            paras.push({
              id: uid(),
              runs: [{ id: uid(), text: '', fmt: {} }],
              fmt: tableMeta,
            });
          }
        }
      }
    };

    // 3. Process all top-level children of w:body
    const bodyChildren = Array.from(body.children);
    for (const child of bodyChildren) {
      if (tagMatches(child, 'p')) {
        paras.push(processParagraph(child));
      } else if (tagMatches(child, 'tbl')) {
        processTable(child);
      } else if (tagMatches(child, 'sectpr')) {
        const pgSz = getFirstElement(child, 'pgSz');
        if (pgSz) {
          const w = parseInt(getAttr(pgSz, 'w') || '12240', 10);
          const h = parseInt(getAttr(pgSz, 'h') || '15840', 10);
          if (!isNaN(w) && w > 0) defaultPageSetup.width = Math.round(w / 15);
          if (!isNaN(h) && h > 0) defaultPageSetup.height = Math.round(h / 15);
        }
        const pgMar = getFirstElement(child, 'pgMar');
        if (pgMar) {
          const top = parseInt(getAttr(pgMar, 'top') || '1440', 10);
          const bottom = parseInt(getAttr(pgMar, 'bottom') || '1440', 10);
          const left = parseInt(getAttr(pgMar, 'left') || '1440', 10);
          const right = parseInt(getAttr(pgMar, 'right') || '1440', 10);
          if (!isNaN(top)) defaultPageSetup.marginTop = Math.round(top / 15);
          if (!isNaN(bottom)) defaultPageSetup.marginBottom = Math.round(bottom / 15);
          if (!isNaN(left)) defaultPageSetup.marginLeft = Math.round(left / 15);
          if (!isNaN(right)) defaultPageSetup.marginRight = Math.round(right / 15);
        }
      }
    }

    if (paras.length === 0) {
      paras.push({ id: uid(), runs: [{ id: uid(), text: '', fmt: {} }], fmt: {} });
    }

    const sections: DocSection[] = [{
      id: uid(),
      startParaIdx: 0,
      endParaIdx: paras.length - 1,
      breakType: 'Continuous',
      pageSetup: defaultPageSetup,
      headers: [],
      footers: [],
    }];

    return {
      paras,
      sections,
    };
  }
}
