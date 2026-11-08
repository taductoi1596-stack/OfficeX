import { CalculationEngine } from './packages/spreadsheet-core/src/calculation/CalculationEngine';
import { MultithreadEngine } from './packages/spreadsheet-core/src/calculation/MultithreadEngine';

const engine = new CalculationEngine();

console.log('--- TEST 1: Volatile Functions ---');
engine.setCellFormula('A1', 'NOW()');
const firstTime = engine.getCellValue('A1');

// Wait 100ms
setTimeout(() => {
  // B1 is completely unrelated to A1
  engine.setCellValue('B1', 10);
  
  const secondTime = engine.getCellValue('A1');
  console.log('A1 (NOW()) initially:', firstTime);
  console.log('A1 (NOW()) after unrelated cell changed:', secondTime);
  
  if (secondTime !== firstTime) {
    console.log('[PASS] A1 recalculated successfully!');
  } else {
    console.log('[FAIL] A1 did not recalculate.');
  }
  
  console.log('\n--- TEST 2: Multithread Tiers ---');
  engine.setCellFormula('A2', '10');
  engine.setCellFormula('A3', '20');
  engine.setCellFormula('C1', 'A2 * 2'); // depends on A2
  engine.setCellFormula('C2', 'A3 * 2'); // depends on A3
  engine.setCellFormula('D1', 'C1 + C2'); // depends on C1, C2
  
  // To verify tiers, we can manually call the MultithreadEngine on the CalculationEngine's dependency graph
  // Since dependencyGraph is private, we'll cast it to any to read it for testing purposes
  const graph = (engine as any).dependencyGraph;
  
  // Simulate updating A2 and A3
  const tiers = MultithreadEngine.splitIndependentChains(graph, ['A2', 'A3']);
  
  console.log('Execution Tiers when A2 and A3 change:');
  tiers.forEach((tier, i) => {
    console.log(`Tier ${i + 1} (Parallelizable):`, tier);
  });
  
  // Expectation:
  // Tier 1: ['A2', 'A3'] (or just roots)
  // Tier 2: ['C1', 'C2'] (can run in parallel!)
  // Tier 3: ['D1']
  
  // Note: the roots themselves might be in Tier 1. Let's see what the output is!
}, 100);
