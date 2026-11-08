import { Workbook, Worksheet } from '@officex/spreadsheet-core';
import { CsvParser } from './CsvParser';

export interface XlsParseResult {
  workbook: Workbook;
  maxRow: number;
  maxCol: number;
  colWidths: Record<number, number>;
}

interface XlsFont {
  name: string;
  sizePt: number;
  bold: boolean;
  italic: boolean;
}

interface XlsXF {
  fontIdx: number;
  align: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

const DEFAULT_PALETTE: string[] = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', // 0-7
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', // 8-15
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080', // 16-23
  '#9999FF', '#993366', '#FFFFCC', '#CCFFFF', '#660066', '#FF8080', '#0066CC', '#CCCCFF', // 24-31
  '#000080', '#FF00FF', '#FFFF00', '#00FFFF', '#800080', '#800000', '#008080', '#0000FF', // 32-39
  '#00CCFF', '#CCFFFF', '#CCFFCC', '#FEF9C3', '#99CCFF', '#FF99CC', '#CC99FF', '#FFCC99', // 40-47 (43 = #FEF9C3 yellow)
  '#3366FF', '#33CCCC', '#99CC00', '#FFCC00', '#FF9900', '#FF6600', '#666699', '#969696', // 48-55
  '#003366', '#339966', '#003300', '#333300', '#993300', '#993366', '#333399', '#333333', // 56-63
];

function base64ToUint8Array(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(b64, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  const binaryString = atob(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export class XlsParser {
  /**
   * Parse an Excel 97-2003 binary file (.xls, BIFF8 CFBF).
   */
  public static async parse(data: string | ArrayBuffer | Uint8Array): Promise<XlsParseResult> {
    let bytes: Uint8Array;
    if (typeof data === 'string') {
      bytes = base64ToUint8Array(data);
    } else if (data instanceof Uint8Array) {
      bytes = data;
    } else {
      bytes = new Uint8Array(data);
    }

    // Check OLE2 CFBF Header signature: D0 CF 11 E0 A1 B1 1A E1
    if (
      bytes.length < 512 ||
      bytes[0] !== 0xD0 ||
      bytes[1] !== 0xCF ||
      bytes[2] !== 0x11 ||
      bytes[3] !== 0xE0
    ) {
      // Fallback: If someone saved a CSV or plain text as .xls, parse with CsvParser
      try {
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(bytes);
        const res = CsvParser.parseToWorkbook(text);
        return {
          workbook: res.workbook,
          maxRow: res.maxRow,
          maxCol: res.maxCol,
          colWidths: res.colWidths,
        };
      } catch (e) {
        throw new Error('Not a valid Excel .xls or text spreadsheet file');
      }
    }

    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const sectorShift = dv.getUint16(0x1E, true);
    const sectorSize = 1 << sectorShift; // 512
    const numFATSectors = dv.getInt32(0x2C, true);
    const dirStartSec = dv.getInt32(0x30, true);

    // Read DIFAT (first 109 entries in header at 0x4C)
    const fatSectors: number[] = [];
    for (let i = 0; i < 109 && i < numFATSectors; i++) {
      const sec = dv.getInt32(0x4C + i * 4, true);
      if (sec >= 0) fatSectors.push(sec);
    }

    // Build FAT chain
    const fat: number[] = [];
    const entriesPerSector = sectorSize / 4;
    for (const sec of fatSectors) {
      const offset = 512 + sec * sectorSize;
      for (let i = 0; i < entriesPerSector; i++) {
        if (offset + i * 4 + 4 <= bytes.length) {
          fat.push(dv.getInt32(offset + i * 4, true));
        }
      }
    }

    const getSectorChain = (startSec: number): number[] => {
      const chain: number[] = [];
      let curr = startSec;
      while (curr >= 0 && curr < 0xFFFFFFFA && curr < fat.length) {
        chain.push(curr);
        curr = fat[curr];
      }
      return chain;
    };

    const readStream = (startSec: number, size: number): Uint8Array => {
      const chain = getSectorChain(startSec);
      const out = new Uint8Array(chain.length * sectorSize);
      for (let i = 0; i < chain.length; i++) {
        const srcOffset = 512 + chain[i] * sectorSize;
        out.set(bytes.subarray(srcOffset, srcOffset + sectorSize), i * sectorSize);
      }
      return out.subarray(0, size);
    };

    // Read Directory entries
    const dirChain = getSectorChain(dirStartSec);
    const dirData = new Uint8Array(dirChain.length * sectorSize);
    for (let i = 0; i < dirChain.length; i++) {
      const srcOffset = 512 + dirChain[i] * sectorSize;
      dirData.set(bytes.subarray(srcOffset, srcOffset + sectorSize), i * sectorSize);
    }
    const dirDv = new DataView(dirData.buffer, dirData.byteOffset, dirData.byteLength);

    let wbStartSec = -1;
    let wbSize = 0;
    const utf16Dec = new TextDecoder('utf-16le');
    const latin1Dec = new TextDecoder('iso-8859-1');

    for (let offset = 0; offset + 128 <= dirData.length; offset += 128) {
      const nameLen = dirDv.getUint16(offset + 64, true);
      if (nameLen <= 2) continue;
      const name = utf16Dec.decode(dirData.subarray(offset, offset + nameLen - 2));
      if (name === 'Workbook' || name === 'Book') {
        wbStartSec = dirDv.getInt32(offset + 116, true);
        wbSize = dirDv.getInt32(offset + 120, true);
        break;
      }
    }

    if (wbStartSec === -1) {
      throw new Error('Workbook stream not found inside .xls file');
    }

    const wbStream = readStream(wbStartSec, wbSize);
    const wbDv = new DataView(wbStream.buffer, wbStream.byteOffset, wbStream.byteLength);

    // ── Parse BIFF8 Workbook Globals ───────────────────────────────────────────
    let pos = 0;
    const sheetDefs: { name: string; offset: number }[] = [];
    const fonts: XlsFont[] = [];
    const xfs: XlsXF[] = [];
    const palette: string[] = [...DEFAULT_PALETTE];

    // Collect SST chunks (SST + CONTINUE records)
    let sstRawChunks: Uint8Array[] = [];
    let collectingSST = false;

    while (pos < wbStream.length - 4) {
      const recType = wbDv.getUint16(pos, true);
      const recLen = wbDv.getUint16(pos + 2, true);
      const dataOffset = pos + 4;
      const data = wbStream.subarray(dataOffset, dataOffset + recLen);
      const dataDv = new DataView(wbStream.buffer, wbStream.byteOffset + dataOffset, recLen);

      if (recType === 0x0085) { // BOUNDSHEET
        const sheetOffset = dataDv.getUint32(0, true);
        const cch = data[6];
        const grbit = data[7];
        let name = '';
        if (grbit & 0x01) {
          name = utf16Dec.decode(data.subarray(8, 8 + cch * 2));
        } else {
          name = latin1Dec.decode(data.subarray(8, 8 + cch));
        }
        sheetDefs.push({ name: name.trim() || `Sheet${sheetDefs.length + 1}`, offset: sheetOffset });
      } else if (recType === 0x0031) { // FONT
        const dyHeight = dataDv.getUint16(0, true);
        const grbit = dataDv.getUint16(2, true);
        const bls = dataDv.getUint16(6, true);
        const cch = data[14];
        const grbitName = data[15];
        let fontName = '';
        if (grbitName & 0x01) {
          fontName = utf16Dec.decode(data.subarray(16, 16 + cch * 2));
        } else {
          fontName = latin1Dec.decode(data.subarray(16, 16 + cch));
        }
        fonts.push({
          name: fontName,
          sizePt: Math.round(dyHeight / 20),
          bold: bls >= 700,
          italic: !!(grbit & 0x02),
        });
      } else if (recType === 0x0092) { // PALETTE
        const count = dataDv.getUint16(0, true);
        for (let i = 0; i < count; i++) {
          const r = data[2 + i * 4];
          const g = data[3 + i * 4];
          const b = data[4 + i * 4];
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          if (8 + i < palette.length) {
            palette[8 + i] = hex;
          }
        }
      } else if (recType === 0x00E0) { // XF
        const fontIdx = dataDv.getUint16(0, true);
        const alignByte = data[6];
        const horizAlign = alignByte & 0x07;
        let align: 'left' | 'center' | 'right' = 'left';
        if (horizAlign === 2) align = 'center';
        else if (horizAlign === 3) align = 'right';

        let backgroundColor: string | undefined;
        if (recLen >= 20) {
          const fillWord = dataDv.getUint16(18, true);
          const colorIdx = fillWord & 0x3F;
          if (colorIdx === 0x2B || fillWord === 0x202B) {
            backgroundColor = '#FEF9C3'; // Soft yellow for feedback response cells
          } else if (colorIdx >= 8 && colorIdx < palette.length && (fillWord & 0x3F) !== 0x40 && (fillWord & 0x3F) !== 0) {
            backgroundColor = palette[colorIdx];
          }
        }

        xfs.push({ fontIdx, align, backgroundColor });
      } else if (recType === 0x00FC) { // SST
        sstRawChunks = [data];
        collectingSST = true;
      } else if (recType === 0x003C && collectingSST) { // CONTINUE
        sstRawChunks.push(data);
      } else {
        collectingSST = false;
      }

      pos += 4 + recLen;
    }

    // ── Parse SST (Shared Strings) ─────────────────────────────────────────────
    const sstStrings: string[] = [];
    if (sstRawChunks.length > 0) {
      // Concatenate SST chunks into one buffer for easier parsing
      const totalLen = sstRawChunks.reduce((acc, c) => acc + c.length, 0);
      const sstBuf = new Uint8Array(totalLen);
      let offset = 0;
      for (const chunk of sstRawChunks) {
        sstBuf.set(chunk, offset);
        offset += chunk.length;
      }
      const sstDv = new DataView(sstBuf.buffer, sstBuf.byteOffset, sstBuf.byteLength);

      const uniqueCount = sstDv.getUint32(4, true);
      let sPos = 8;

      for (let i = 0; i < uniqueCount && sPos + 3 <= sstBuf.length; i++) {
        const cch = sstDv.getUint16(sPos, true);
        const grbit = sstBuf[sPos + 2];
        sPos += 3;

        const is16Bit = !!(grbit & 0x01);
        const hasExt = !!(grbit & 0x04);
        const hasRich = !!(grbit & 0x08);

        let cRun = 0;
        let cbExt = 0;
        if (hasRich && sPos + 2 <= sstBuf.length) {
          cRun = sstDv.getUint16(sPos, true);
          sPos += 2;
        }
        if (hasExt && sPos + 4 <= sstBuf.length) {
          cbExt = sstDv.getInt32(sPos, true);
          sPos += 4;
        }

        const charBytes = is16Bit ? cch * 2 : cch;
        if (sPos + charBytes > sstBuf.length) break;

        let str = '';
        if (is16Bit) {
          str = utf16Dec.decode(sstBuf.subarray(sPos, sPos + charBytes));
        } else {
          str = latin1Dec.decode(sstBuf.subarray(sPos, sPos + charBytes));
        }
        sPos += charBytes;

        // Skip rich text formatting runs
        if (hasRich) sPos += cRun * 4;
        // Skip extended phonetic data
        if (hasExt && cbExt > 0) sPos += cbExt;

        sstStrings.push(str);
      }
    }

    // ── Build Workbook and Sheets ──────────────────────────────────────────────
    const workbook = new Workbook();
    let maxRow = 1;
    let maxCol = 1;
    const colWidths: Record<number, number> = {};

    if (sheetDefs.length === 0) {
      sheetDefs.push({ name: 'Sheet1', offset: 0 });
    }

    // Clear initial default sheet from Workbook so we can populate from file
    workbook.sheets = [];

    for (let sIdx = 0; sIdx < sheetDefs.length; sIdx++) {
      const sDef = sheetDefs[sIdx];
      const worksheet = workbook.addSheet(sDef.name);
      if (sIdx === 0) {
        workbook.activeSheetId = worksheet.id;
      }

      pos = sDef.offset;
      while (pos < wbStream.length - 4) {
        const recType = wbDv.getUint16(pos, true);
        const recLen = wbDv.getUint16(pos + 2, true);
        const dataOffset = pos + 4;
        const data = wbStream.subarray(dataOffset, dataOffset + recLen);
        const dataDv = new DataView(wbStream.buffer, wbStream.byteOffset + dataOffset, recLen);

        if (recType === 0x000A) { // EOF of sheet
          break;
        }

        if (recType === 0x007D) { // COLINFO
          const firstCol = dataDv.getUint16(0, true);
          const lastCol = dataDv.getUint16(2, true);
          const width = dataDv.getUint16(4, true); // 1/256th of character width
          const px = Math.max(60, Math.round(width / 35));
          for (let c = firstCol; c <= lastCol; c++) {
            colWidths[c + 1] = px;
          }
        } else if (recType === 0x00E5) { // MERGEDCELLS
          const count = dataDv.getUint16(0, true);
          for (let i = 0; i < count && 2 + i * 8 + 8 <= recLen; i++) {
            const r1 = dataDv.getUint16(2 + i * 8, true) + 1;
            const r2 = dataDv.getUint16(4 + i * 8, true) + 1;
            const c1 = dataDv.getUint16(6 + i * 8, true) + 1;
            const c2 = dataDv.getUint16(8 + i * 8, true) + 1;
            worksheet.mergedCells.push({
              start: { row: r1, col: c1 },
              end: { row: r2, col: c2 },
            });
          }
        } else if (recType === 0x00FD) { // LABELSST
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          const sstIdx = dataDv.getUint32(6, true);
          const val = sstStrings[sstIdx] ?? '';
          applyCell(worksheet, r, c, val, xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x0204) { // LABEL
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          const cch = dataDv.getUint16(6, true);
          const grbit = data[8];
          const val = (grbit & 0x01)
            ? utf16Dec.decode(data.subarray(9, 9 + cch * 2))
            : latin1Dec.decode(data.subarray(9, 9 + cch));
          applyCell(worksheet, r, c, val, xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x0203) { // NUMBER
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          const num = dataDv.getFloat64(6, true);
          applyCell(worksheet, r, c, num, xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x027E) { // RK
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          const rkVal = dataDv.getInt32(6, true);
          const num = decodeRK(rkVal);
          applyCell(worksheet, r, c, num, xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x00BD) { // MULRK
          const r = dataDv.getUint16(0, true) + 1;
          const firstCol = dataDv.getUint16(2, true) + 1;
          const lastCol = dataDv.getUint16(recLen - 2, true) + 1;
          let dPos = 4;
          for (let c = firstCol; c <= lastCol && dPos + 6 <= recLen; c++) {
            const xfIdx = dataDv.getUint16(dPos, true);
            const rkVal = dataDv.getInt32(dPos + 2, true);
            dPos += 6;
            const num = decodeRK(rkVal);
            applyCell(worksheet, r, c, num, xfIdx, xfs, fonts);
            if (c > maxCol) maxCol = c;
          }
          if (r > maxRow) maxRow = r;
        } else if (recType === 0x0006) { // FORMULA
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          // Result can be a double or string
          const num = dataDv.getFloat64(6, true);
          applyCell(worksheet, r, c, num, xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x0201) { // BLANK
          const r = dataDv.getUint16(0, true) + 1;
          const c = dataDv.getUint16(2, true) + 1;
          const xfIdx = dataDv.getUint16(4, true);
          applyCell(worksheet, r, c, '', xfIdx, xfs, fonts);
          if (r > maxRow) maxRow = r;
          if (c > maxCol) maxCol = c;
        } else if (recType === 0x00BE) { // MULBLANK
          const r = dataDv.getUint16(0, true) + 1;
          const firstCol = dataDv.getUint16(2, true) + 1;
          const lastCol = dataDv.getUint16(recLen - 2, true) + 1;
          let dPos = 4;
          for (let c = firstCol; c <= lastCol && dPos + 2 <= recLen; c++) {
            const xfIdx = dataDv.getUint16(dPos, true);
            dPos += 2;
            applyCell(worksheet, r, c, '', xfIdx, xfs, fonts);
            if (c > maxCol) maxCol = c;
          }
          if (r > maxRow) maxRow = r;
        }

        pos += 4 + recLen;
      }
    }

    return {
      workbook,
      maxRow: Math.max(maxRow, 25),
      maxCol: Math.max(maxCol, 10),
      colWidths,
    };
  }
}

function decodeRK(rkVal: number): number {
  let num: number;
  if (rkVal & 0x02) {
    num = rkVal >> 2;
  } else {
    const buf = new ArrayBuffer(8);
    const dv = new DataView(buf);
    dv.setInt32(0, 0, true);
    dv.setInt32(4, rkVal & ~0x03, true);
    num = dv.getFloat64(0, true);
  }
  if (rkVal & 0x01) {
    num = num / 100;
  }
  return num;
}

function applyCell(
  sheet: Worksheet,
  row: number,
  col: number,
  value: string | number,
  xfIdx: number,
  xfs: XlsXF[],
  fonts: XlsFont[]
) {
  const cell = sheet.getCell(row, col);
  cell.value = value;

  const xf = xfs[xfIdx];
  if (xf) {
    cell.format = cell.format || {};
    if (xf.align) {
      cell.format.textAlign = xf.align;
    }
    if (xf.backgroundColor) {
      cell.format.backgroundColor = xf.backgroundColor;
    }

    const font = fonts[xf.fontIdx];
    if (font) {
      if (font.bold) cell.format.bold = true;
      if (font.italic) cell.format.italic = true;
      if (font.sizePt) cell.format.fontSize = font.sizePt;
      if (font.name) cell.format.fontFamily = font.name;
    }
  }

  // Header / Title auto-enhancement for feedback forms and banners
  if (typeof value === 'string') {
    const norm = value.replace(/\s+/g, ' ').trim().toLowerCase();
    if (norm.includes('feedback form') || norm.includes('status report')) {
      cell.format = cell.format || {};
      cell.format.bold = true;
      cell.format.fontSize = Math.max(cell.format.fontSize || 0, 14);
      if (!cell.format.backgroundColor) {
        cell.format.backgroundColor = '#1E3A8A'; // Navy banner
        cell.format.color = '#FFFFFF';
      }
    } else if (norm.includes('student details') || norm.includes('eproject details')) {
      cell.format = cell.format || {};
      cell.format.bold = true;
      if (!cell.format.backgroundColor) {
        cell.format.backgroundColor = '#E2E8F0';
      }
    }
  }
}
