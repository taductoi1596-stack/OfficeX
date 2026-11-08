const { FormulaParser } = require('./packages/spreadsheet-core/dist/formula/FormulaParser.js');
const { CalculationEngine } = require('./packages/spreadsheet-core/dist/calc/CalculationEngine.js');
const { DependencyGraph } = require('./packages/spreadsheet-core/dist/calc/DependencyGraph.js');
const { Worksheet } = require('./packages/spreadsheet-core/dist/model/Worksheet.js');

const sheet = new Worksheet('Sheet1');
const engine = new CalculationEngine(new FormulaParser(), new DependencyGraph());

engine.updateCell(sheet, 3, 3, '56');
engine.updateCell(sheet, 3, 4, '5656');
engine.updateCell(sheet, 3, 5, '=AVERAGE(C3:D3)');

console.log('Value is:', sheet.getCell(3, 5).value);
