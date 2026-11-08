import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { XlsxParser } from './XlsxParser';

describe('XlsxParser', () => {
  it('parses in-memory XLSX package into Workbook', async () => {
    const zip = new JSZip();

    // 1. sharedStrings.xml
    const sst = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">
      <si><t>Project Title</t></si>
      <si><t>OfficeX Suite</t></si>
    </sst>`;
    zip.file('xl/sharedStrings.xml', sst);

    // 2. workbook.xml
    const wbXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
      <sheets>
        <sheet name="Summary" sheetId="1" r:id="rId1"/>
      </sheets>
    </workbook>`;
    zip.file('xl/workbook.xml', wbXml);

    // 3. workbook.xml.rels
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
    </Relationships>`;
    zip.file('xl/_rels/workbook.xml.rels', relsXml);

    // 4. sheet1.xml
    const wsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheetData>
        <row r="1">
          <c r="A1" t="s"><v>0</v></c>
          <c r="B1" t="s"><v>1</v></c>
        </row>
        <row r="2">
          <c r="A2"><v>100</v></c>
          <c r="B2"><v>200</v></c>
          <c r="C2"><f>A2+B2</f><v>300</v></c>
        </row>
      </sheetData>
    </worksheet>`;
    zip.file('xl/worksheets/sheet1.xml', wsXml);

    const base64 = await zip.generateAsync({ type: 'base64' });

    const result = await XlsxParser.parse(base64);
    expect(result.workbook).toBeDefined();
    expect(result.workbook.sheets.length).toBe(1);

    const sheet = result.workbook.sheets[0];
    expect(sheet.name).toBe('Summary');

    // A1 = "Project Title"
    expect(sheet.getCell(1, 1).value).toBe('Project Title');
    // B1 = "OfficeX Suite"
    expect(sheet.getCell(1, 2).value).toBe('OfficeX Suite');
    // A2 = 100
    expect(sheet.getCell(2, 1).value).toBe(100);
    // B2 = 200
    expect(sheet.getCell(2, 2).value).toBe(200);
    // C2 formula = "=A2+B2"
    expect(sheet.getCell(2, 3).formula).toBe('=A2+B2');
    expect(sheet.getCell(2, 3).value).toBe(300);
  });
});

