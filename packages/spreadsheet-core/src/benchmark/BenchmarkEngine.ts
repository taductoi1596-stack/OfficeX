import { CalculationEngine } from '../calculation/CalculationEngine';

declare const process: any;

export class BenchmarkEngine {
  public static runBenchmark(engine: CalculationEngine, scenario: 'deep-chain' | 'broad-parallel' | 'volatile', count: number = 10000) {
    console.log(`\n=== Starting Benchmark: ${scenario} (${count} cells) ===`);
    
    // Clear engine
    // We assume a fresh engine is passed in for best results
    
    const startMemory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage().heapUsed : 0;
    const startTime = performance.now();
    
    if (scenario === 'deep-chain') {
      this.runDeepChain(engine, count);
    } else if (scenario === 'broad-parallel') {
      this.runBroadParallel(engine, count);
    } else if (scenario === 'volatile') {
      this.runVolatile(engine, count);
    }
    
    const endTime = performance.now();
    const endMemory = typeof process !== 'undefined' && process.memoryUsage ? process.memoryUsage().heapUsed : 0;
    
    const duration = endTime - startTime;
    const memoryDiffMb = (endMemory - startMemory) / 1024 / 1024;
    
    console.log(`Duration: ${duration.toFixed(2)} ms`);
    console.log(`Memory Used: ${memoryDiffMb.toFixed(2)} MB`);
    console.log('==================================================\n');
  }

  private static runDeepChain(engine: CalculationEngine, count: number) {
    // A1 = 1
    // A2 = A1 + 1
    // A3 = A2 + 1
    // ...
    engine.setCellValue('A1', 1);
    
    for (let i = 2; i <= count; i++) {
      engine.setCellFormula(`A${i}`, `A${i-1} + 1`);
    }
    
    // Trigger a full recalculation by updating the root
    console.log('Building complete. Triggering recalculation...');
    const t0 = performance.now();
    engine.setCellValue('A1', 100);
    const t1 = performance.now();
    console.log(`Recalculation alone took ${(t1-t0).toFixed(2)} ms`);
    
    const finalVal = engine.getCellValue(`A${count}`);
    console.log(`Final value at A${count} is ${finalVal} (Expected: ${100 + count - 1})`);
  }

  private static runBroadParallel(engine: CalculationEngine, count: number) {
    // A1 = 100
    // B1 = A1 * 1, B2 = A1 * 2, B3 = A1 * 3
    engine.setCellValue('A1', 100);
    
    for (let i = 1; i <= count; i++) {
      engine.setCellFormula(`B${i}`, `A1 * ${i}`);
    }
    
    console.log('Building complete. Triggering recalculation...');
    const t0 = performance.now();
    engine.setCellValue('A1', 200);
    const t1 = performance.now();
    console.log(`Recalculation alone took ${(t1-t0).toFixed(2)} ms`);
  }

  private static runVolatile(engine: CalculationEngine, count: number) {
    // A1..An = RAND()
    // Z1 = 1
    
    for (let i = 1; i <= count; i++) {
      engine.setCellFormula(`A${i}`, `RAND()`);
    }
    
    console.log('Building complete. Triggering recalculation via unrelated cell...');
    const t0 = performance.now();
    engine.setCellValue('Z1', 1);
    const t1 = performance.now();
    console.log(`Recalculation alone took ${(t1-t0).toFixed(2)} ms`);
  }
}
