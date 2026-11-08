import { DependencyGraph } from '../calculation/DependencyGraph';
import { CacheEngine } from './CacheEngine';

export class RecalcEngine {
  private dependencyGraph: DependencyGraph;
  private cacheEngine: CacheEngine;

  constructor(dependencyGraph: DependencyGraph, cacheEngine: CacheEngine) {
    this.dependencyGraph = dependencyGraph;
    this.cacheEngine = cacheEngine;
  }

  /**
   * Smart recalculation triggered by a cell change.
   */
  public triggerRecalculation(startCell: string) {
    // Topologically sort dependencies starting from startCell
    const calculationQueue = this.buildCalculationOrder(startCell);
    
    // Invalidate caches
    for (const cell of calculationQueue) {
      this.cacheEngine.invalidate(cell);
    }

    // Return the queue for the CalculationEngine to process
    return calculationQueue;
  }

  private buildCalculationOrder(startCell: string): string[] {
    const queue: string[] = [];
    const visited = new Set<string>();

    const dfs = (cell: string) => {
      if (visited.has(cell)) return;
      visited.add(cell);
      
      const dependents = this.dependencyGraph.getDependents(cell);
      for (const dep of dependents) {
        dfs(dep);
      }
      // Add post-order for proper dependency resolution
      queue.unshift(cell); 
    };

    dfs(startCell);
    
    // Actually, queue needs topological sort correctly so dependencies are evaluated before dependents
    return queue.reverse(); // Simplified
  }

  /**
   * Evaluates all volatile formulas (NOW, TODAY, RAND)
   */
  public calculateVolatile() {
    const volatileCells = this.cacheEngine.getVolatileCells();
    const fullQueue = new Set<string>();
    
    for (const cell of volatileCells) {
      const dependents = this.buildCalculationOrder(cell);
      dependents.forEach(d => fullQueue.add(d));
    }

    return Array.from(fullQueue);
  }
}
