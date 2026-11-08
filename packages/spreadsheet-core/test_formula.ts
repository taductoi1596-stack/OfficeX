import { FormulaParser } from './src/formula/FormulaParser';

const parser = new FormulaParser();

const mockGetCellValue = (ref: string) => {
  if (ref === 'A1') return 10;
  if (ref === 'A2') return '20';
  if (ref === 'A3') return null;
  if (ref === 'A4') return '';
  return undefined;
};

console.log('Test 1 (=A1+A2):', parser.parseAndEvaluate('=A1+A2', mockGetCellValue));
console.log('Test 2 (=A1+A3):', parser.parseAndEvaluate('=A1+A3', mockGetCellValue));
console.log('Test 3 (=A1+A4):', parser.parseAndEvaluate('=A1+A4', mockGetCellValue));
console.log('Test 4 (=A1-A2):', parser.parseAndEvaluate('=A1-A2', mockGetCellValue));
console.log('Test 5 (=A1*A2):', parser.parseAndEvaluate('=A1*A2', mockGetCellValue));
console.log('Test 6 (=A1/A2):', parser.parseAndEvaluate('=A1/A2', mockGetCellValue));
