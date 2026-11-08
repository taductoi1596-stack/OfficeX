import { CalculationEngine } from './packages/spreadsheet-core/src/calculation/CalculationEngine';

const engine = new CalculationEngine();

// Setup source data
engine.setCellValue('A1', 1);
engine.setCellValue('A2', 2);
engine.setCellValue('A3', 3);

// Dynamic Array Formula: A1:A3 * 10
// In our syntax, parser parses this as BinaryOp with RangeReference and Number
console.log('--- TEST 1: Basic Array Broadcasting & Spilling ---');
engine.setCellFormula('C1', 'A1:A3*10');

// Verify C1, C2, C3 are populated
console.log('C1:', engine.getCellValue('C1')); // 10
console.log('C2:', engine.getCellValue('C2')); // 20
console.log('C3:', engine.getCellValue('C3')); // 30

console.log('\n--- TEST 2: #SPILL! Collision ---');
// Setup collision
engine.setCellValue('E2', 'Obstacle');

// Try spilling into E1:E3
engine.setCellFormula('E1', 'A1:A3*100');

console.log('E1:', engine.getCellValue('E1')); // Should be #SPILL!
console.log('E2:', engine.getCellValue('E2')); // Should be Obstacle
console.log('E3:', engine.getCellValue('E3')); // Should be undefined or whatever it was

console.log('\n--- TEST 3: Range Resolution ---');
// Test the new AddressConverter in getRangeValues
engine.setCellFormula('F1', 'SUM(A1:A3)');
console.log('SUM(A1:A3):', engine.getCellValue('F1')); // 1+2+3 = 6
