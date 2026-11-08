import { Workbook, Worksheet, Cell } from '@officex/spreadsheet-core';

export interface CsvParseResult {
  workbook: Workbook;
  maxRow: number;
  maxCol: number;
  colWidths: Record<number, number>;
  delimiter: string;
}

export class CsvParser {
  /**
   * Auto-detect delimiter from the first few non-empty lines.
   * Checks comma, semicolon, tab, and pipe.
   */
  public static detectDelimiter(text: string): string {
    const candidates = [',', ';', '\t', '|'];
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(0, 10);

    if (lines.length === 0) return ',';

    const scores: Record<string, number> = { ',': 0, ';': 0, '\t': 0, '|': 0 };

    for (const d of candidates) {
      let count = 0;
      for (const line of lines) {
        // Count delimiters outside quotes
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQ = !inQ;
          else if (!inQ && line[i] === d) count++;
        }
      }
      scores[d] = count;
    }

    let bestDelim = ',';
    let maxScore = -1;
    for (const d of candidates) {
      if (scores[d] > maxScore) {
        maxScore = scores[d];
        bestDelim = d;
      }
    }

    return maxScore > 0 ? bestDelim : ',';
  }

  /**
   * Standard RFC 4180 CSV parser.
   * Properly parses quoted fields, escaped quotes (""), and multiline values.
   */
  public static parseToRows(text: string, customDelimiter?: string): string[][] {
    const delimiter = customDelimiter || this.detectDelimiter(text);
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    // Clean BOM
    const content = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < content.length && content[i + 1] === '"') {
            // Escaped quote "" -> "
            currentCell += '"';
            i++;
          } else {
            // End of quoted value
            inQuotes = false;
          }
        } else {
          currentCell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === delimiter) {
          currentRow.push(currentCell.trim());
          currentCell = '';
        } else if (char === '\n') {
          currentRow.push(currentCell.trim());
          rows.push(currentRow);
          currentRow = [];
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
    }

    // Append last cell / row
    currentRow.push(currentCell.trim());
    if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * Converts CSV/TSV/DSV text to an OfficeX Workbook instance.
   */
  public static parseToWorkbook(text: string, sheetName = 'Sheet1'): CsvParseResult {
    const delimiter = this.detectDelimiter(text);
    const rows = this.parseToRows(text, delimiter);

    const wb = new Workbook();
    // Default workbook comes with 'Sheet1'
    const sheet = wb.sheets[0] || wb.addSheet(sheetName);
    sheet.name = sheetName;

    let maxRow = rows.length;
    let maxCol = 1;
    const colMaxChars: Record<number, number> = {};

    // Check if this file is a form mentioning yellow cells / dropdowns
    const textLower = text.toLowerCase();
    const hasYellowInstruction = textLower.includes('yellow colour') || textLower.includes('yellow shade') || textLower.includes('yellow color');

    let isUnderFeedbackSection = false;

    rows.forEach((rowCells, rIdx) => {
      const r = rIdx + 1; // 1-based row
      if (rowCells.length > maxCol) {
        maxCol = rowCells.length;
      }

      // Check if this row is the yellow colour instruction
      const rowCombined = rowCells.join(' ').toLowerCase();
      if (rowCombined.includes('yellow colour') || rowCombined.includes('yellow color') || rowCombined.includes('dropdown list')) {
        isUnderFeedbackSection = true;
      }

      rowCells.forEach((cellVal, cIdx) => {
        const c = cIdx + 1; // 1-based col
        const valLen = cellVal ? cellVal.length : 0;
        if (!colMaxChars[c] || valLen > colMaxChars[c]) {
          colMaxChars[c] = valLen;
        }

        if (cellVal !== undefined && cellVal !== '') {
          const cell = sheet.getCell(r, c);

          // Formula check
          if (cellVal.startsWith('=')) {
            cell.formula = cellVal;
            cell.value = cellVal;
          } else {
            // Number check (avoid leading zero numeric strings like '0123')
            const isLeadingZeroNumber = /^0\d+$/.test(cellVal);
            const num = Number(cellVal);
            if (!isLeadingZeroNumber && !isNaN(num) && cellVal.trim() !== '') {
              cell.value = num;
            } else {
              cell.value = cellVal;
            }
          }

          // Smart styling for common forms/headers
          const normVal = cellVal.replace(/\s+/g, '').toLowerCase();
          const isTitle = (
            normVal.includes('feedbackform') ||
            normVal.includes('eproject') ||
            cellVal.toLowerCase().includes('feedback form') ||
            cellVal.toLowerCase().includes('eprojects') ||
            (valLen > 15 && cellVal.toUpperCase() === cellVal && /[A-Z]/.test(cellVal))
          );

          const isSectionHeader = (
            normVal.includes('studentdetails') ||
            normVal.includes('eprojectdetails') ||
            cellVal.toLowerCase().includes('student details') ||
            cellVal.toLowerCase().includes('eproject details') ||
            cellVal.toLowerCase().includes('eprojects details')
          );

          const isInstruction = (
            normVal.includes('dropdownlist') ||
            normVal.includes('yellowcolour') ||
            normVal.includes('yellowshade') ||
            cellVal.toLowerCase().includes('dropdown list') ||
            cellVal.toLowerCase().includes('yellow colour')
          );

          if (isTitle) {
            cell.format = {
              ...cell.format,
              fontWeight: 'bold',
              fontSize: 13,
              color: '#0f172a',
            };
          } else if (isSectionHeader) {
            cell.format = {
              ...cell.format,
              fontWeight: 'bold',
              fontSize: 11,
              backgroundColor: '#f1f5f9',
              color: '#1e293b',
            };
          } else if (isInstruction) {
            cell.format = {
              ...cell.format,
              fontStyle: 'italic',
              fontSize: 10,
              color: '#854d0e',
              backgroundColor: '#fefce8',
            };
          }
        }

        // If this row is in the feedback questionnaire section, give the response cell (Column C or D) a yellow shade!
        if (hasYellowInstruction && isUnderFeedbackSection && cellVal !== '' && (c === 2 || c === 3)) {
          // The next column is the answer/choice column
          const responseCol = c + 1;
          const respCell = sheet.getCell(r, responseCol);
          if (!respCell.value) {
            respCell.format = {
              ...respCell.format,
              backgroundColor: '#fef08a', // Soft yellow shade
              borders: {
                top: '1px solid #eab308',
                bottom: '1px solid #eab308',
                left: '1px solid #eab308',
                right: '1px solid #eab308',
              },
            };
          }
        }
      });
    });

    // Compute pleasant column widths so content isn't clipped
    const colWidths: Record<number, number> = {};
    for (let c = 1; c <= Math.max(maxCol, 26); c++) {
      const chars = colMaxChars[c] || 0;
      if (chars === 0) {
        colWidths[c] = 96;
      } else {
        // ~8px per char + 28px padding, clamped between 96 and 480
        colWidths[c] = Math.min(480, Math.max(96, Math.ceil(chars * 7.8 + 28)));
      }
    }

    return {
      workbook: wb,
      maxRow: Math.max(maxRow, 1),
      maxCol: Math.max(maxCol, 1),
      colWidths,
      delimiter,
    };
  }

  /**
   * Serializes a Worksheet to CSV or TSV string.
   */
  public static stringifyWorksheet(sheet: Worksheet, delimiter = ','): string {
    const cellsMap = sheet.getCellsMap();
    let maxR = 1;
    let maxC = 1;

    for (const cell of cellsMap.values()) {
      if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
        maxR = Math.max(maxR, cell.row);
        maxC = Math.max(maxC, cell.col);
      }
    }

    const lines: string[] = [];
    for (let r = 1; r <= maxR; r++) {
      const rowValues: string[] = [];
      for (let c = 1; c <= maxC; c++) {
        const cell = sheet.getCell(r, c);
        const val = cell.formula ? cell.formula : cell.value !== null && cell.value !== undefined ? String(cell.value) : '';

        // Escape if contains delimiter, quote, or newline
        if (val.includes(delimiter) || val.includes('"') || val.includes('\n')) {
          rowValues.push(`"${val.replace(/"/g, '""')}"`);
        } else {
          rowValues.push(val);
        }
      }
      lines.push(rowValues.join(delimiter));
    }

    return lines.join('\n');
  }
}
