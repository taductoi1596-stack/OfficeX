export class DependencyGraph {
  // Maps a cell reference (e.g. 'Sheet1!A1') to the cells that depend on it
  private dependencies: Map<string, Set<string>> = new Map();

  public addDependency(producer: string, consumer: string) {
    if (!this.dependencies.has(producer)) {
      this.dependencies.set(producer, new Set());
    }
    this.dependencies.get(producer)!.add(consumer);
  }

  public getDependents(producer: string): string[] {
    const dependents = this.dependencies.get(producer);
    return dependents ? Array.from(dependents) : [];
  }

  public clearDependencies(consumer: string) {
    // In a real system, we'd also maintain a reverse map (consumer -> producers)
    // to efficiently remove the consumer from all producers' sets.
    this.dependencies.forEach((consumers) => {
      consumers.delete(consumer);
    });
  }
}
