import { DependencyGraph } from './DependencyGraph';

export class MultithreadEngine {
  /**
   * Analyzes the dependency graph and splits it into execution tiers.
   * All cells in the same tier can be calculated concurrently (multithreaded).
   * 
   * @param graph The populated dependency graph
   * @param cellsToUpdate The initial set of cells that changed
   * @returns An array of string arrays, where each string array is a parallel tier
   */
  public static splitIndependentChains(graph: DependencyGraph, cellsToUpdate: string[]): string[][] {
    // 1. Get topological order for the affected cells
    const allAffected = new Set<string>();
    for (const cell of cellsToUpdate) {
      const order = graph.getTopologicalOrder(cell);
      for (const node of order) {
        allAffected.add(node);
      }
    }

    const affectedArray = Array.from(allAffected);
    
    // 2. Build in-degree map for ONLY the affected cells
    const inDegree = new Map<string, number>();
    for (const cell of affectedArray) {
      inDegree.set(cell, 0);
    }

    for (const cell of affectedArray) {
      const dependents = (graph as any).dependents.get(cell) || new Set();
      for (const dep of dependents) {
        if (inDegree.has(dep)) {
          inDegree.set(dep, inDegree.get(dep)! + 1);
        }
      }
    }

    // 3. Group by Tiers using Kahn's algorithm
    const tiers: string[][] = [];
    let currentTier = affectedArray.filter(cell => inDegree.get(cell) === 0);

    while (currentTier.length > 0) {
      tiers.push(currentTier);
      const nextTier: string[] = [];

      for (const cell of currentTier) {
        const dependents = (graph as any).dependents.get(cell) || new Set();
        for (const dep of dependents) {
          if (inDegree.has(dep)) {
            const newDegree = inDegree.get(dep)! - 1;
            inDegree.set(dep, newDegree);
            if (newDegree === 0) {
              nextTier.push(dep);
            }
          }
        }
      }
      currentTier = nextTier;
    }

    return tiers;
  }
}
