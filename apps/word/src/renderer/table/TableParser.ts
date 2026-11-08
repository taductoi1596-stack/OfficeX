/**
 * TableParser.ts
 *
 * Detects and parses copied tables from:
 * 1. HTML tables (<table>, <tr>, <td>/<th>)
 * 2. HTML div/grid tables ([role="table"], [role="grid"], class="table", etc.)
 * 3. TSV (Tab-Separated Values from Excel, Sheets)
 * 4. Line-separated tables (when copied from web pages as newline-separated blocks)
 */

export interface ParsedTableCell {
  text: string;
  bold?: boolean;
}

export interface ParsedTableData {
  title?: string;
  rows: ParsedTableCell[][];
  trailingText?: string;
}

/**
 * Parses an HTML string to detect <table> or div-based table elements.
 */
export function parseHtmlTable(html: string): ParsedTableData | null {
  if (!html) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. Check standard <table> element
    let table = doc.querySelector('table');

    // 2. If no <table>, check ARIA table or div-table
    if (!table) {
      const ariaTable = doc.querySelector('[role="table"], [role="grid"], .table, .ant-table, .MuiTable-root');
      if (ariaTable) {
        return parseAriaOrDivTable(ariaTable);
      }
      return null;
    }

    // Title detection (caption, or preceding heading/paragraph)
    let title: string | undefined;
    const caption = table.querySelector('caption');
    if (caption && caption.textContent?.trim()) {
      title = caption.textContent.trim();
    } else {
      let prev = table.previousElementSibling;
      if (prev && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'SPAN'].includes(prev.tagName)) {
        const t = prev.textContent?.trim();
        if (t && t.length < 120 && !t.includes('\n')) {
          title = t;
        }
      }
    }

    // Trailing text after table
    let trailingText: string | undefined;
    let next = table.nextElementSibling;
    if (next && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'SPAN'].includes(next.tagName)) {
      const t = next.textContent?.trim();
      if (t) trailingText = t;
    }

    const trElements = Array.from(table.querySelectorAll('tr'));
    if (trElements.length === 0) return null;

    const rows: ParsedTableCell[][] = [];

    for (let rIdx = 0; rIdx < trElements.length; rIdx++) {
      const tr = trElements[rIdx];
      const cells = Array.from(tr.querySelectorAll('th, td'));
      if (cells.length === 0) continue;

      const rowCells: ParsedTableCell[] = [];
      for (const cell of cells) {
        const isHeader = cell.tagName === 'TH' ||
                         !!cell.querySelector('strong, b') ||
                         cell.closest('thead') !== null;

        const text = (cell.textContent || '').trim().replace(/[ \t]+/g, ' ');
        rowCells.push({ text, bold: isHeader });
      }

      if (rowCells.length > 0) {
        rows.push(rowCells);
      }
    }

    if (rows.length >= 1) {
      const maxCols = Math.max(...rows.map(r => r.length));
      if (maxCols >= 2 || rows.length >= 2) {
        // Normalize column count
        for (const row of rows) {
          while (row.length < maxCols) {
            row.push({ text: '', bold: false });
          }
        }
        return { title, rows, trailingText };
      }
    }
  } catch (err) {
    console.warn('[TableParser] Error parsing HTML table:', err);
  }

  return null;
}

/**
 * Parses div-based tables (e.g. role="table", role="row", or class-based rows/cols).
 */
function parseAriaOrDivTable(container: Element): ParsedTableData | null {
  const rows: ParsedTableCell[][] = [];

  // Look for rows
  const rowElements = Array.from(container.querySelectorAll('[role="row"], .row, .tr, .table-row, .ant-table-row, .MuiTableRow-root'));
  if (rowElements.length >= 2) {
    for (const rEl of rowElements) {
      const cellElements = Array.from(rEl.querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], .cell, .col, .th, .td, .table-cell, .ant-table-cell, .MuiTableCell-root'));
      if (cellElements.length === 0) continue;

      const rowCells = cellElements.map(c => {
        const isHeader = c.getAttribute('role') === 'columnheader' || !!c.querySelector('strong, b') || c.tagName === 'TH';
        const text = (c.textContent || '').trim().replace(/[ \t]+/g, ' ');
        return { text, bold: isHeader };
      });
      rows.push(rowCells);
    }
  }

  if (rows.length >= 2) {
    const maxCols = Math.max(...rows.map(r => r.length));
    if (maxCols >= 2) {
      for (const row of rows) {
        while (row.length < maxCols) {
          row.push({ text: '', bold: false });
        }
      }
      return { rows };
    }
  }

  return null;
}

/**
 * Parses TSV (Tab-Separated Values) from Excel, Sheets, or tab-delimited text.
 */
export function parseTsvTable(text: string): ParsedTableData | null {
  if (!text) return null;

  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (rawLines.length === 0) return null;

  let title: string | undefined;
  let tableLines = rawLines;

  // Check if first line is a title (single column without tabs) followed by table lines with tabs
  if (rawLines.length >= 2 && !rawLines[0].includes('\t') && rawLines[1].includes('\t')) {
    title = rawLines[0];
    tableLines = rawLines.slice(1);
  }

  const hasTabs = tableLines.some(l => l.includes('\t'));
  if (!hasTabs) return null;

  const rows: ParsedTableCell[][] = [];

  for (let i = 0; i < tableLines.length; i++) {
    const line = tableLines[i];
    const cells = line.split('\t').map(c => c.trim());
    const isHeader = i === 0 && tableLines.length > 1;
    rows.push(cells.map(c => ({ text: c, bold: isHeader })));
  }

  const maxCols = Math.max(...rows.map(r => r.length));
  if (maxCols >= 2 && rows.length >= 1) {
    for (const row of rows) {
      while (row.length < maxCols) {
        row.push({ text: '', bold: false });
      }
    }
    return { title, rows };
  }

  return null;
}

/**
 * Parses line-separated tables (when copied from web browsers where block elements become separate lines).
 * Detects patterns like:
 * [Optional Title]
 * Header 1, Header 2, Header 3 ...
 * Val 1, Val 2, Val 3 ...
 * [Optional Trailing Text]
 */
export function parseLineSeparatedTable(text: string): ParsedTableData | null {
  if (!text) return null;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  // Require at least 7 lines and minimum 3 rows to avoid false positives on short documents
  if (lines.length < 7) return null;

  let bestResult: ParsedTableData | null = null;
  let bestScore = -1;

  // Try potential column counts K from 2 to 8
  for (let K = 2; K <= Math.min(8, Math.floor(lines.length / 2)); K++) {
    // Check startIdx: 0 (no title) or 1 (line 0 is title)
    for (const startIdx of [0, 1]) {
      const headers = lines.slice(startIdx, startIdx + K);
      // Headers should not be pure numbers
      if (headers.some(h => /^\d+$/.test(h))) continue;

      const remainingLines = lines.slice(startIdx + K);
      if (remainingLines.length < 2 * K) continue;

      const numFullRows = Math.floor(remainingLines.length / K);
      let validRows = 0;
      const rows: ParsedTableCell[][] = [];
      rows.push(headers.map(h => ({ text: h, bold: true })));

      for (let r = 0; r < numFullRows; r++) {
        const rowItems = remainingLines.slice(r * K, (r + 1) * K);
        // If the first item of a row looks like trailing text (e.g. starts with "5." or is a long sentence), stop
        if (rowItems[0].length > 30 && rowItems[0].includes(' ') && !/^\d+$/.test(rowItems[0])) {
          break;
        }
        rows.push(rowItems.map(item => ({ text: item, bold: false })));
        validRows++;
      }

      if (validRows >= 2) {
        // Compute quality score for this (K, startIdx) configuration
        let score = validRows * K * 10;

        // Check type consistency across columns in data rows
        for (let col = 0; col < K; col++) {
          const colValues = rows.slice(1).map(r => r[col]?.text ?? '');
          const numDigits = colValues.filter(v => /^\d+(\.\d+)?$/.test(v)).length;
          const ratio = numDigits / colValues.length;
          // If a column is uniformly numbers (ratio === 1) or uniformly text (ratio === 0), add strong bonus!
          if (ratio === 1 || ratio === 0) {
            score += 30;
          }
        }

        // Title bonus if startIdx === 1 and line 0 looks like title
        if (startIdx === 1) {
          const titleLine = lines[0];
          if (!/^\d+$/.test(titleLine) && titleLine.length < 50) {
            score += 25;
            // Extra bonus if titleLine is similar to one of the headers (e.g. "Marks" vs "Mark")
            if (headers.some(h => titleLine.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(titleLine.toLowerCase()))) {
              score += 50;
            }
          }
        }

        const title = startIdx === 1 ? lines[0] : undefined;
        const consumed = startIdx + K + validRows * K;
        const trailingLines = lines.slice(consumed);
        const trailingText = trailingLines.length > 0 ? trailingLines.join('\n') : undefined;

        if (score > bestScore) {
          bestScore = score;
          bestResult = { title, rows, trailingText };
        }
      }
    }
  }

  return bestResult;
}

/**
 * Universal table detector from clipboard:
 * 1. Checks HTML tables (<table> and <div> tables)
 * 2. Checks TSV tab-delimited text (from Excel / Sheets)
 * 3. Checks line-separated table patterns (from web browser selections)
 */
/**
 * Returns true if the HTML is "rich" — meaning it has block-level structure
 * (headings, divs, paragraphs, code, lists, etc.) without any <table> element.
 * In that case, clipboard content is clearly non-table rich text and we should
 * NOT attempt the line-separated heuristic.
 */
function isRichHtmlWithoutTable(html: string): boolean {
  if (!html) return false;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    if (doc.querySelector('table')) return false; // has real table
    // Check for block-level elements that indicate formatted document content
    const richSelectors = 'h1,h2,h3,h4,h5,h6,pre,code,blockquote,ul,ol,li';
    const hasMeaningfulBlocks = doc.querySelectorAll(richSelectors).length > 0;
    // Also check if there are many block-level elements (divs/paragraphs)
    const blockCount = doc.querySelectorAll('p,div').length;
    return hasMeaningfulBlocks || blockCount >= 4;
  } catch {
    return false;
  }
}

export function detectTableFromClipboard(html?: string, text?: string): ParsedTableData | null {
  if (html) {
    const fromHtml = parseHtmlTable(html);
    if (fromHtml && fromHtml.rows.length >= 2) return fromHtml;
  }
  if (text && text.includes('\t')) {
    const fromTsv = parseTsvTable(text);
    if (fromTsv && fromTsv.rows.length >= 2) return fromTsv;
  }
  // Only attempt line-separated heuristic if the HTML is NOT rich structured content.
  // If the HTML has headings, code blocks, lists, or many block elements but no <table>,
  // it is clearly formatted text (not a table), and we must not misdetect it as one.
  if (text && !isRichHtmlWithoutTable(html || '')) {
    const fromLines = parseLineSeparatedTable(text);
    if (fromLines && fromLines.rows.length >= 2) return fromLines;
  }
  return null;
}

export type MixedContentBlock =
  | { type: 'text'; text: string }
  | { type: 'table'; tableData: ParsedTableData };

/**
 * Parses HTML clipboard content that may contain multiple tables mixed with text.
 * Returns an ordered array of text blocks and table blocks.
 *
 * If the HTML has NO tables, returns null so the caller falls back to plain text paste.
 * If the HTML has exactly 1 table and nothing else, returns a single-table result so
 * the existing doInsertTableWithData path is used.
 */
export function parseHtmlMixedContent(html: string): MixedContentBlock[] | null {
  if (!html) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const tables = doc.querySelectorAll('table');
    if (tables.length === 0) return null;

    const blocks: MixedContentBlock[] = [];

    // Walk the body's top-level children
    const children = Array.from(doc.body.childNodes);

    // Helper: collect text from a node recursively (no tables inside)
    const collectText = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      const el = node as Element;
      if (el.tagName === 'TABLE') return ''; // skip, handled separately
      if (el.tagName === 'BR') return '\n';
      const blockTags = ['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'ARTICLE'];
      const childText = Array.from(el.childNodes).map(collectText).join('');
      if (blockTags.includes(el.tagName)) {
        return childText.trimEnd() + '\n';
      }
      return childText;
    };

    // Walk top level: collect text nodes and table nodes in order
    const processNode = (node: Node) => {
      const el = node as Element;

      if (node.nodeType === Node.TEXT_NODE) {
        const t = (node.textContent || '').trim();
        if (t) {
          const last = blocks[blocks.length - 1];
          if (last?.type === 'text') last.text += ' ' + t;
          else blocks.push({ type: 'text', text: t });
        }
        return;
      }

      if (el.tagName === 'TABLE') {
        // Parse this table
        const tableRows = parseTableElement(el);
        if (tableRows && tableRows.rows.length >= 1) {
          blocks.push({ type: 'table', tableData: tableRows });
        }
        return;
      }

      // Check if this element contains a table (nested)
      const innerTables = el.querySelectorAll('table');
      if (innerTables.length > 0) {
        // Has nested tables — recurse to extract text & tables in order
        Array.from(el.childNodes).forEach(processNode);
        return;
      }

      // No tables inside — collect as text block
      const t = collectText(node).trim();
      if (t) {
        const last = blocks[blocks.length - 1];
        if (last?.type === 'text') last.text += '\n' + t;
        else blocks.push({ type: 'text', text: t });
      }
    };

    children.forEach(processNode);

    // Filter out empty blocks
    const filtered = blocks.filter(b => {
      if (b.type === 'text') return b.text.trim().length > 0;
      return b.tableData.rows.length >= 1;
    });

    if (filtered.length === 0) return null;
    // Only return multi-block result if there is at least one table
    if (!filtered.some(b => b.type === 'table')) return null;

    return filtered;
  } catch (err) {
    console.warn('[TableParser] parseHtmlMixedContent error:', err);
    return null;
  }
}

/**
 * Parses a single HTMLTableElement into ParsedTableData.
 */
function parseTableElement(table: Element): ParsedTableData | null {
  // Title: preceding heading/paragraph
  let title: string | undefined;
  let prev = table.previousElementSibling;
  while (prev) {
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'SPAN', 'STRONG'].includes(prev.tagName)) {
      const t = prev.textContent?.trim();
      if (t && t.length < 120 && !t.includes('\n')) {
        title = t;
      }
      break;
    }
    break;
  }

  const caption = table.querySelector('caption');
  if (caption?.textContent?.trim()) title = caption.textContent.trim();

  const trElements = Array.from(table.querySelectorAll('tr'));
  if (trElements.length === 0) return null;

  const rows: ParsedTableCell[][] = [];
  for (const tr of trElements) {
    const cells = Array.from(tr.querySelectorAll('th, td'));
    if (cells.length === 0) continue;

    const rowCells: ParsedTableCell[] = cells.map(cell => {
      const isHeader = cell.tagName === 'TH' ||
                       !!cell.querySelector('strong, b') ||
                       cell.closest('thead') !== null;
      const text = (cell.textContent || '').trim().replace(/[ \t]+/g, ' ');
      return { text, bold: isHeader };
    });

    if (rowCells.length > 0) rows.push(rowCells);
  }

  if (rows.length === 0) return null;

  const maxCols = Math.max(...rows.map(r => r.length));
  if (maxCols < 1) return null;

  for (const row of rows) {
    while (row.length < maxCols) row.push({ text: '', bold: false });
  }

  return { title, rows };
}
