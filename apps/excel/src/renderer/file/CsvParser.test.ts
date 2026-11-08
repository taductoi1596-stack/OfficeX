import { describe, it, expect } from 'vitest';
import { CsvParser } from './CsvParser';

const userCsvText = `,,
,e P r o j e c t s    F e e d b a c k    F o r m,
,,
,,
,Student Details,Name
,,Enrollment No.
,,Curriculum
,,Semester
,,Centre Name
,,
,Eprojects Details,Eproject Title
,,Duration of the projects 
,,Start Date (DD/MMM/YYYY)
,,End Date (DD/MMM/YYYY)
,,
,Select your choices available in the Dropdown list provided in the cell with yellow colour (shade),
,,
,,
,,
,Problem Statement provided in eProject Specification,
,,
,Solution to Technical Queries asked,
,,
,Interaction with the mentor,
,,
,Knowledge Enhacement,
,,
,Comments / Suggestions,`;

describe('CsvParser', () => {
  it('detects comma delimiter correctly', () => {
    const delim = CsvParser.detectDelimiter(userCsvText);
    expect(delim).toBe(',');
  });

  it('detects semicolon and tab delimiters', () => {
    const semiText = 'Name;Age;Country\nAlice;30;Vietnam\nBob;25;US';
    expect(CsvParser.detectDelimiter(semiText)).toBe(';');

    const tabText = 'Name\tAge\tCountry\nAlice\t30\tVietnam';
    expect(CsvParser.detectDelimiter(tabText)).toBe('\t');
  });

  it('parses user feedback form CSV into workbook without crashing or staying blank', () => {
    const result = CsvParser.parseToWorkbook(userCsvText);
    expect(result.workbook).toBeDefined();
    expect(result.maxRow).toBeGreaterThan(20);
    expect(result.maxCol).toBeGreaterThanOrEqual(3);

    const sheet = result.workbook.sheets[0];
    expect(sheet).toBeDefined();

    // Check Row 2 Col 2 (B2)
    const titleCell = sheet.getCell(2, 2);
    expect(titleCell.value).toBe('e P r o j e c t s    F e e d b a c k    F o r m');
    expect(titleCell.format?.fontWeight).toBe('bold');

    // Check Student Details (Row 5 Col 2) and Name (Row 5 Col 3)
    const secCell = sheet.getCell(5, 2);
    expect(secCell.value).toBe('Student Details');
    expect(secCell.format?.fontWeight).toBe('bold');

    const nameCell = sheet.getCell(5, 3);
    expect(nameCell.value).toBe('Name');

    // Check Curriculum (Row 7 Col 3)
    const currCell = sheet.getCell(7, 3);
    expect(currCell.value).toBe('Curriculum');

    // Check Problem statement row
    let foundRow = -1;
    for (let r = 1; r <= result.maxRow; r++) {
      if (sheet.getCell(r, 2).value === 'Problem Statement provided in eProject Specification') {
        foundRow = r;
        break;
      }
    }
    expect(foundRow).toBeGreaterThan(0);

    // Check yellow shaded response cell for problem statement
    const respCell = sheet.getCell(foundRow, 3);
    expect(respCell.format?.backgroundColor).toBe('#fef08a');

    // Check column widths
    expect(result.colWidths[2]).toBeGreaterThan(150); // Column B is wide enough for long labels
  });

  it('handles quotes with commas and escaped quotes', () => {
    const csv = 'City,"Description with, comma","Quote ""Test"""\nHanoi,"Capital of, Vietnam","Says ""Xin Chao"""';
    const rows = CsvParser.parseToRows(csv);
    expect(rows.length).toBe(2);
    expect(rows[0]).toEqual(['City', 'Description with, comma', 'Quote "Test"']);
    expect(rows[1]).toEqual(['Hanoi', 'Capital of, Vietnam', 'Says "Xin Chao"']);
  });

  it('exports worksheet back to CSV properly', () => {
    const res = CsvParser.parseToWorkbook(userCsvText);
    const exported = CsvParser.stringifyWorksheet(res.workbook.sheets[0]);
    expect(exported).toContain('e P r o j e c t s    F e e d b a c k    F o r m');
    expect(exported).toContain('Student Details');
    expect(exported).toContain('Name');
  });
});
