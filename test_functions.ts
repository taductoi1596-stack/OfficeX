import { FunctionRegistry } from './packages/formula-engine/src/evaluator/FunctionRegistry';

const registry = new FunctionRegistry();

const logTest = (name: string, fnCall: () => any) => {
  try {
    const result = fnCall();
    console.log(`[PASS] ${name} ->`, result);
  } catch (e: any) {
    console.log(`[FAIL] ${name} ->`, e.message);
  }
};

console.log('--- MATH ENGINE ---');
const sum = registry.getFunction('SUM');
logTest('SUM(1, 2, [3, 4], "5")', () => sum(1, 2, [[3], [4]], "5")); // should be 15
logTest('MAX(10, 5, 20)', () => registry.getFunction('MAX')(10, 5, 20)); // 20
logTest('ROUND(3.14159, 2)', () => registry.getFunction('ROUND')(3.14159, 2)); // 3.14

console.log('\n--- LOGICAL ENGINE ---');
const or = registry.getFunction('OR');
logTest('OR(false, true)', () => or(false, true)); // true
logTest('AND([true, true], false)', () => registry.getFunction('AND')([[true, true]], false)); // false
logTest('IFERROR("#DIV/0!", "Error found")', () => registry.getFunction('IFERROR')('#DIV/0!', 'Error found')); // Error found

console.log('\n--- TEXT ENGINE ---');
logTest('CONCAT("A", ["B", "C"])', () => registry.getFunction('CONCAT')("A", [["B", "C"]])); // ABC
logTest('MID("Hello World", 7, 5)', () => registry.getFunction('MID')("Hello World", 7, 5)); // World

console.log('\n--- DATETIME ENGINE ---');
logTest('DATE(2023, 1, 2) - DATE(2023, 1, 1)', () => {
  const d1 = registry.getFunction('DATE')(2023, 1, 2);
  const d2 = registry.getFunction('DATE')(2023, 1, 1);
  return d1 - d2;
}); // 1

console.log('\n--- LOOKUP ENGINE ---');
const vlookup = registry.getFunction('VLOOKUP');
const table = [
  [1, 'Apple', 10],
  [2, 'Banana', 20],
  [3, 'Cherry', 30]
];
logTest('VLOOKUP(2, table, 2, false)', () => vlookup(2, table, 2, false)); // Banana
logTest('MATCH(3, [1, 2, 3], 0)', () => registry.getFunction('MATCH')(3, [[1, 2, 3]], 0)); // 3
logTest('INDEX(table, 3, 2)', () => registry.getFunction('INDEX')(table, 3, 2)); // Cherry

