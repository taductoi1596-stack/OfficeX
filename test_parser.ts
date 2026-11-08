import { FormulaParser } from './packages/spreadsheet-core/src/formula/FormulaParser'; 
const parser = new FormulaParser(); 
console.log(parser.parseAndEvaluate('=AVERAGE(H9:I9)', (ref) => ref === 'H9' ? 25 : ref === 'I9' ? 63 : null));
