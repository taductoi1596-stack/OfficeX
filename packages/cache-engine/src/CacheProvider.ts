import { CacheEntry } from './models/CacheEntry';
import { StatsManager } from './StatsManager';

export interface CacheProviderOptions {
  maxEntries?: number;
  maxMemoryBytes?: number;
}

/**
 * A single, typed, LRU-backed cache store.
 * Any engine (Layout, Render, Formula, Font...) can instantiate its own
 * CacheProvider and register it with the CacheManager.
 */
export class CacheProvider<T = unknown> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private readonly maxEntries: number;
  private readonly maxMemoryBytes: number;
  private readonly stats: StatsManager;
  private currentMemoryBytes = 0;

  constructor(stats: StatsManager, options: CacheProviderOptions = {}) {
    this.maxEntries = options.maxEntries ?? 4096;
    this.maxMemoryBytes = options.maxMemoryBytes ?? 256 * 1024 * 1024; // 256 MB
    this.stats = stats;
  }

  public get<K extends T>(key: string): K | undefined {
    const entry = this.store.get(key);
    if (!entry || entry.state !== 'valid') {
      this.stats.recordMiss();
      return undefined;
    }

    // Promote to MRU
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.store.delete(key);
    this.store.set(key, entry);

    this.stats.recordHit();
    return entry.value as K;
  }

  public set(key: string, value: T, sizeBytes = 0, dependencies: string[] = []): void {
    // Overwrite existing entry
    if (this.store.has(key)) {
      const old = this.store.get(key)!;
      this.currentMemoryBytes -= old.size;
      this.stats.recordEntryRemoved(old.size);
      this.store.delete(key);
    }

    // Evict until within budget
    while (
      (this.store.size >= this.maxEntries || this.currentMemoryBytes + sizeBytes > this.maxMemoryBytes) &&
      this.store.size > 0
    ) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      size: sizeBytes,
      version: 1,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      dependencies,
      state: 'valid',
    };

    this.store.set(key, entry);
    this.currentMemoryBytes += sizeBytes;
    this.stats.recordEntryAdded(sizeBytes);
  }

  public invalidate(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.state = 'stale';
    }
  }

  public delete(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      this.currentMemoryBytes -= entry.size;
      this.stats.recordEntryRemoved(entry.size);
      this.store.delete(key);
    }
  }

  /**
   * Invalidate all entries that depend on a given key.
   * Called when a document object changes and its dependents must be stale.
   */
  public invalidateDependents(sourceKey: string): void {
    for (const [, entry] of this.store) {
      if (entry.dependencies.includes(sourceKey)) {
        entry.state = 'stale';
      }
    }
  }

  private evictLRU(): void {
    const oldestKey = this.store.keys().next().value;
    if (oldestKey !== undefined) {
      const entry = this.store.get(oldestKey)!;
      this.currentMemoryBytes -= entry.size;
      this.stats.recordEntryRemoved(entry.size);
      this.stats.recordEviction();
      entry.state = 'evicted';
      this.store.delete(oldestKey);
    }
  }

  public get size(): number { return this.store.size; }
  public get memoryUsedBytes(): number { return this.currentMemoryBytes; }
}
