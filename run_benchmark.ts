import { CalculationEngine } from './packages/spreadsheet-core/src/calculation/CalculationEngine';
import { BenchmarkEngine } from './packages/spreadsheet-core/src/benchmark/BenchmarkEngine';

console.log('--- OFFICEX EXCEL BENCHMARK ---');

const count = 5000;

// Deep Chain
const engine1 = new CalculationEngine();
BenchmarkEngine.runBenchmark(engine1, 'deep-chain', count);

// Broad Parallel
const engine2 = new CalculationEngine();
BenchmarkEngine.runBenchmark(engine2, 'broad-parallel', count);

// Volatile
const engine3 = new CalculationEngine();
BenchmarkEngine.runBenchmark(engine3, 'volatile', count);
