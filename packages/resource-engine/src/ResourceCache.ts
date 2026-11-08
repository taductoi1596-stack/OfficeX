/**
 * A simple LRU (Least Recently Used) cache for loaded resource data.
 * Evicts the least-recently-accessed entry when the max size is exceeded.
 */
export class ResourceCache {
  private store: Map<string, unknown> = new Map(); // Map preserves insertion order
  private readonly maxSize: number;

  constructor(maxSize: number = 512) {
    this.maxSize = maxSize;
  }

  public set(id: string, data: unknown): void {
    // If key exists, delete to re-insert at the end (most recently used)
    if (this.store.has(id)) {
      this.store.delete(id);
    }

    // Evict LRU if at capacity
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(id, data);
  }

  public get(id: string): unknown | undefined {
    if (!this.store.has(id)) return undefined;

    // Promote to most recently used by re-inserting
    const data = this.store.get(id);
    this.store.delete(id);
    this.store.set(id, data);
    return data;
  }

  public has(id: string): boolean {
    return this.store.has(id);
  }

  public evict(id: string): void {
    this.store.delete(id);
  }

  public get size(): number {
    return this.store.size;
  }
}
