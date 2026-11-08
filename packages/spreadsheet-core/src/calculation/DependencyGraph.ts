export class DependencyGraph {
  private dependencies = new Map<string, Set<string>>(); // A1 depends on B1, C1
  private dependents = new Map<string, Set<string>>(); // B1 is used by A1

  public addDependency(cell: string, dependsOn: string) {
    if (!this.dependencies.has(cell)) {
      this.dependencies.set(cell, new Set());
    }
    this.dependencies.get(cell)!.add(dependsOn);

    if (!this.dependents.has(dependsOn)) {
      this.dependents.set(dependsOn, new Set());
    }
    this.dependents.get(dependsOn)!.add(cell);
  }

  public getDependents(cell: string): Set<string> {
    return this.dependents.get(cell) || new Set();
  }

  public getDependencies(cell: string): Set<string> {
    return this.dependencies.get(cell) || new Set();
  }

  public clearDependencies(cell: string) {
    const oldDeps = this.getDependencies(cell);
    for (const dep of oldDeps) {
      if (this.dependents.has(dep)) {
        this.dependents.get(dep)!.delete(cell);
      }
    }
    this.dependencies.delete(cell);
  }

  /**
   * Returns a topologically sorted array of cells that need to be recalculated
   * when `startCell` changes.
   */
  public getTopologicalOrder(startCell: string): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const dfs = (cell: string) => {
      if (visited.has(cell)) return;
      if (visiting.has(cell)) {
        throw new Error(`Circular reference detected involving cell ${cell}`);
      }
      
      visiting.add(cell);

      const dependents = this.getDependents(cell);
      for (const dep of dependents) {
        dfs(dep);
      }

      visiting.delete(cell);
      visited.add(cell);
      order.unshift(cell); // Add to front for post-order
    };

    dfs(startCell);

    // The startCell itself shouldn't necessarily be recalculated 
    // if we just set its formula, but its dependents must. 
    // We'll return the full order including startCell at the beginning.
    // However, since it's unshift, startCell will be first.
    return order;
  }
}
