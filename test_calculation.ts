import { CalculationEngine } from './packages/spreadsheet-core/src/calculation/CalculationEngine';

const engine = new CalculationEngine();

// Setup initial values
engine.setCellValue('A1', 10);
engine.setCellValue('B1', 20);

// Setup formulas with dependencies
engine.setCellFormula('C1', 'A1+B1');        // Depends on A1, B1. Should be 30
engine.setCellFormula('D1', 'C1*2');         // Depends on C1. Should be 60
engine.setCellFormula('E1', 'D1+A1');        // Depends on D1, A1. Should be 70

console.log("Initial state:");
console.log("A1:", engine.getCellValue('A1'));
console.log("B1:", engine.getCellValue('B1'));
console.log("C1:", engine.getCellValue('C1'));
console.log("D1:", engine.getCellValue('D1'));
console.log("E1:", engine.getCellValue('E1'));

console.log("\nChanging A1 to 50...");
// This should trigger A1 -> C1, E1. C1 -> D1. D1 -> E1. 
// Topological order should guarantee C1 evaluates before D1, and D1 before E1.
engine.setCellValue('A1', 50);

console.log("New state:");
console.log("C1 (A1+B1):", engine.getCellValue('C1')); // 50+20 = 70
console.log("D1 (C1*2):", engine.getCellValue('D1'));  // 70*2 = 140
console.log("E1 (D1+A1):", engine.getCellValue('E1')); // 140+50 = 190

// Test errors and circular dependency (mock setup since parser handles valid strings)
// Our parser from previous checkpoints might not have `=` parsing properly if it was not fully complete,
// so let's test comparison operators if parser supports them, or just rely on manual AST testing.
