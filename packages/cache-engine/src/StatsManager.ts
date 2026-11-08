export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalEntries: number;
  memoryUsedBytes: number;
}

/**
 * Statistics Manager tracks cache performance metrics.
 * Consumers (e.g. Diagnostics UI, AI tuning) can read hit ratio,
 * miss ratio, and eviction pressure at runtime.
 */
export class StatsManager {
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalEntries: 0,
    memoryUsedBytes: 0,
  };

  public recordHit(): void { this.stats.hits++; }
  public recordMiss(): void { this.stats.misses++; }
  public recordEviction(): void { this.stats.evictions++; }
  public recordEntryAdded(sizeBytes: number): void {
    this.stats.totalEntries++;
    this.stats.memoryUsedBytes += sizeBytes;
  }
  public recordEntryRemoved(sizeBytes: number): void {
    this.stats.totalEntries = Math.max(0, this.stats.totalEntries - 1);
    this.stats.memoryUsedBytes = Math.max(0, this.stats.memoryUsedBytes - sizeBytes);
  }

  public getStats(): Readonly<CacheStats> { return { ...this.stats }; }

  public get hitRatio(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }
}
