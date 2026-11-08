import JSZip from 'jszip';
import { Workbook, Worksheet, parseCellRef } from '@officex/spreadsheet-core';

export interface XlsxParseResult {
  workbook: Workbook;
  maxRow: number;
  maxCol: number;
  colWidths: Record<number, number>;
}

interface CellStyleInfo {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}

function getDOMParser(): { parseFromString: (xml: string, mime: string) => any } {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser();
  }
  try {
    const { DOMParser: XMLDOMParser } = require('@xmldom/xmldom');
    return new XMLDOMParser();
  } catch {
    throw new Error('No DOMParser available in this environment');
  }
}

export class XlsxParser {
  /**
   * Parse an XLSX file from base64 or ArrayBuffer.
   */
  public static async parse(data: string | ArrayBuffer | Uint8Array): Promise<XlsxParseResult> {
    const zip = new JSZip();
    const loadedZip = typeof data === 'string'
      ? await zip.loadAsync(data, { base64: true })
      : await zip.loadAsync(data);

    const domParser = getDOMParser();

    // 1. Shared Strings Table
    const sharedStrings: string[] = [];
    const sstFile = loadedZip.file('xl/sharedStrings.xml');
    if (sstFile) {
      const sstXml = await sstFile.async('text');
      const sstDoc = domParser.parseFromString(sstXml, 'application/xml');
      const siNodes = sstDoc.getElementsByTagName('si');
      for (let i = 0; i < siNodes.length; i++) {
        const si = siNodes[i];
        const tNodes = si.getElementsByTagName('t');
        let fullStr = '';
        for (let j = 0; j < tNodes.length; j++) {
          fullStr += tNodes[j].textContent || '';
        }
        sharedStrings.push(fullStr);
      }
    }

    // 2. Styles
    const cellStyles: CellStyleInfo[] = [];
    const stylesFile = loadedZip.file('xl/styles.xml');
    if (stylesFile) {
      try {
        const stylesXml = await stylesFile.async('text');
        const stylesDoc = domParser.parseFromString(stylesXml, 'application/xml');

        // Parse fills
        const fills: string[] = [];
        const fillNodes = stylesDoc.getElementsByTagName('fill');
        for (let i = 0; i < fillNodes.length; i++) {
          const fgColor = fillNodes[i].getElementsByTagName('fgColor')[0];
          if (fgColor) {
            const rgb = fgColor.getAttribute('rgb');
            if (rgb) {
              // Usually 8 hex characters: AARRGGBB -> convert to #RRGGBB
              const hex = rgb.length === 8 ? `#${rgb.substring(2)}` : `#${rgb}`;
              fills.push(hex);
            } else {
              fills.push('');
            }
          } else {
            fills.push('');
          }
        }

        // Parse fonts
        const fonts: { bold?: boolean; italic?: boolean; fontSize?: number; color?: string }[] = [];
        const fontNodes = stylesDoc.getElementsByTagName('font');
        for (let i = 0; i < fontNodes.length; i++) {
          const fontNode = fontNodes[i];
          const b = fontNode.getElementsByTagName('b').length > 0;
          const it = fontNode.getElementsByTagName('i').length > 0;
          const szNode = fontNode.getElementsByTagName('sz')[0];
          const sz = szNode ? parseFloat(szNode.getAttribute('val') || '11') : 11;
          const colorNode = fontNode.getElementsByTagName('color')[0];
          let color: string | undefined;
          if (colorNode) {
            const rgb = colorNode.getAttribute('rgb');
            if (rgb) color = rgb.length === 8 ? `#${rgb.substring(2)}` : `#${rgb}`;
          }
          fonts.push({ bold: b, italic: it, fontSize: sz, color });
        }

        // Parse cellXfs (style index mapping)
        const cellXfs = stylesDoc.getElementsByTagName('cellXfs')[0];
        if (cellXfs) {
          const xfNodes = cellXfs.getElementsByTagName('xf');
          for (let i = 0; i < xfNodes.length; i++) {
            const xf = xfNodes[i];
            const fontId = parseInt(xf.getAttribute('fontId') || '0', 10);
            const fillId = parseInt(xf.getAttribute('fillId') || '0', 10);
            const applyAlignment = xf.getAttribute('applyAlignment') === '1';
            let textAlign: 'left' | 'center' | 'right' | undefined;
            if (applyAlignment) {
              const alignNode = xf.getElementsByTagName('alignment')[0];
              if (alignNode) {
                const hAlign = alignNode.getAttribute('horizontal');
                if (hAlign === 'center') textAlign = 'center';
                else if (hAlign === 'right') textAlign = 'right';
                else if (hAlign === 'left') textAlign = 'left';
              }
            }

            const font = fonts[fontId] || {};
            const bg = fills[fillId] || undefined;

            cellStyles.push({
              bold: font.bold,
              italic: font.italic,
              fontSize: font.fontSize,
              color: font.color,
              backgroundColor: bg && bg !== '#000000' && bg !== '#FFFFFF' ? bg : undefined,
              textAlign,
            });
          }
        }
      } catch (err) {
        console.warn('[XlsxParser] Error parsing styles:', err);
      }
    }

    // 3. Sheet list in workbook.xml
    interface SheetMeta {
      name: string;
      sheetId: string;
      rId: string;
      path: string;
    }
    const sheetsMeta: SheetMeta[] = [];

    // Parse workbook relationships to find worksheet file paths
    const relsFile = loadedZip.file('xl/_rels/workbook.xml.rels');
    const rIdToTarget: Record<string, string> = {};
    if (relsFile) {
      const relsXml = await relsFile.async('text');
      const relsDoc = domParser.parseFromString(relsXml, 'application/xml');
      const relNodes = relsDoc.getElementsByTagName('Relationship');
      for (let i = 0; i < relNodes.length; i++) {
        const id = relNodes[i].getAttribute('Id') || '';
        const target = relNodes[i].getAttribute('Target') || '';
        rIdToTarget[id] = target.startsWith('worksheets/') ? `xl/${target}` : `xl/worksheets/${target.replace(/^.*[\\/]/, '')}`;
      }
    }

    const wbFile = loadedZip.file('xl/workbook.xml');
    if (wbFile) {
      const wbXml = await wbFile.async('text');
      const wbDoc = domParser.parseFromString(wbXml, 'application/xml');
      const sheetNodes = wbDoc.getElementsByTagName('sheet');
      for (let i = 0; i < sheetNodes.length; i++) {
        const name = sheetNodes[i].getAttribute('name') || `Sheet${i + 1}`;
        const sheetId = sheetNodes[i].getAttribute('sheetId') || String(i + 1);
        const rId = sheetNodes[i].getAttribute('r:id') || sheetNodes[i].getAttribute('id') || `rId${i + 1}`;
        const sheetPath = rIdToTarget[rId] || `xl/worksheets/sheet${i + 1}.xml`;
        sheetsMeta.push({ name, sheetId, rId, path: sheetPath });
      }
    }

    if (sheetsMeta.length === 0) {
      sheetsMeta.push({ name: 'Sheet1', sheetId: '1', rId: 'rId1', path: 'xl/worksheets/sheet1.xml' });
    }

    const wb = new Workbook();
    wb.sheets = []; // Clear default Sheet1

    let overallMaxRow = 1;
    let overallMaxCol = 1;
    const colMaxChars: Record<number, number> = {};

    // 4. Parse Worksheets
    for (const meta of sheetsMeta) {
      const wsFile = loadedZip.file(meta.path) || loadedZip.file(`xl/${meta.path}`) || loadedZip.file(`xl/worksheets/${meta.name}.xml`);
      const sheet = new Worksheet(meta.name);
      wb.sheets.push(sheet);
      if (!wb.activeSheetId) wb.activeSheetId = sheet.id;

      if (!wsFile) continue;

      const wsXml = await wsFile.async('text');
      const wsDoc = domParser.parseFromString(wsXml, 'application/xml');

      // Merged Cells
      const mergeNodes = wsDoc.getElementsByTagName('mergeCell');
      for (let i = 0; i < mergeNodes.length; i++) {
        const ref = mergeNodes[i].getAttribute('ref');
        if (ref) {
          const parts = ref.split(':');
          const startRef = parseCellRef(parts[0]);
          const endRef = parts[1] ? parseCellRef(parts[1]) : startRef;
          if (startRef && endRef) {
            sheet.mergedCells.push({
              start: { row: startRef.row, col: startRef.col },
              end: { row: endRef.row, col: endRef.col },
            });
          }
        }
      }

      // Cell Data
      const cNodes = wsDoc.getElementsByTagName('c');
      for (let i = 0; i < cNodes.length; i++) {
        const cNode = cNodes[i];
        const rAttr = cNode.getAttribute('r');
        if (!rAttr) continue;

        const coords = parseCellRef(rAttr);
        if (!coords) continue;

        const { row, col } = coords;
        if (row > overallMaxRow) overallMaxRow = row;
        if (col > overallMaxCol) overallMaxCol = col;

        const t = cNode.getAttribute('t');
        const s = cNode.getAttribute('s');
        const styleIdx = s ? parseInt(s, 10) : -1;

        const vNode = cNode.getElementsByTagName('v')[0];
        const fNode = cNode.getElementsByTagName('f')[0];
        const isNode = cNode.getElementsByTagName('is')[0];

        let cellValue: any = null;
        let formula: string | null = null;

        if (fNode) {
          formula = `=${fNode.textContent || ''}`;
        }

        if (t === 's' && vNode) {
          const idx = parseInt(vNode.textContent || '0', 10);
          cellValue = sharedStrings[idx] !== undefined ? sharedStrings[idx] : '';
        } else if (t === 'b' && vNode) {
          cellValue = vNode.textContent === '1';
        } else if (t === 'inlineStr' || t === 'str') {
          cellValue = isNode ? isNode.textContent : vNode ? vNode.textContent : '';
        } else if (vNode) {
          const raw = vNode.textContent || '';
          const num = Number(raw);
          cellValue = !isNaN(num) && raw.trim() !== '' ? num : raw;
        }

        const cell = sheet.getCell(row, col);
        if (cellValue !== null) cell.value = cellValue;
        if (formula) cell.formula = formula;

        // Apply style if available
        if (styleIdx >= 0 && cellStyles[styleIdx]) {
          const style = cellStyles[styleIdx];
          const fmt: any = {};
          if (style.bold) fmt.fontWeight = 'bold';
          if (style.italic) fmt.fontStyle = 'italic';
          if (style.fontSize) fmt.fontSize = style.fontSize;
          if (style.color) fmt.color = style.color;
          if (style.backgroundColor) fmt.backgroundColor = style.backgroundColor;
          if (style.textAlign) fmt.textAlign = style.textAlign;
          cell.format = { ...cell.format, ...fmt };
        }

        const strVal = String(cellValue || formula || '');
        if (!colMaxChars[col] || strVal.length > colMaxChars[col]) {
          colMaxChars[col] = strVal.length;
        }
      }
    }

    const colWidths: Record<number, number> = {};
    for (let c = 1; c <= Math.max(overallMaxCol, 26); c++) {
      const chars = colMaxChars[c] || 0;
      colWidths[c] = chars === 0 ? 96 : Math.min(450, Math.max(96, Math.ceil(chars * 7.8 + 28)));
    }

    return {
      workbook: wb,
      maxRow: overallMaxRow,
      maxCol: overallMaxCol,
      colWidths,
    };
  }
}
