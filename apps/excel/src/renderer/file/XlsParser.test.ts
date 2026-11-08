import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { XlsParser } from './XlsParser';

describe('XlsParser', () => {
  it('parses real binary .xls feedback form', async () => {
    const filePath = 'C:/Users/taduc/.gemini/antigravity/brain/1f194f84-a45c-4b1b-a99c-f3c1b7f353be/.user_uploaded/media_1793653363969_55ab3add.xls';
    if (!fs.existsSync(filePath)) {
      console.warn('Test file not found, skipping');
      return;
    }
    const buf = fs.readFileSync(filePath);
    const result = await XlsParser.parse(buf);

    expect(result.workbook).toBeDefined();
    expect(result.workbook.sheets.length).toBeGreaterThanOrEqual(1);

    const sheet = result.workbook.sheets[0];
    expect(sheet.name).toBe('eProject Status Report');

    // Check cells
    const titleCell = sheet.getCell(2, 2);
    expect(String(titleCell.value)).toContain('F e e d b a c k');

    const nameLabelCell = sheet.getCell(5, 3);
    expect(nameLabelCell.value).toBe('Name');

    const enrollCell = sheet.getCell(6, 3);
    expect(enrollCell.value).toBe('Enrollment No.');

    // Check yellow response cell
    const nameInputCell = sheet.getCell(5, 4);
    expect(nameInputCell.format?.backgroundColor).toBe('#FEF9C3');

    // Check merged cells
    expect(sheet.mergedCells.length).toBeGreaterThan(0);
  });
});
