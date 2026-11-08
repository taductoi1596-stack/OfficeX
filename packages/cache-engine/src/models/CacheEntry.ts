export type EvictionPolicy = 'LRU' | 'LFU' | 'Priority';
export type CacheState = 'valid' | 'stale' | 'evicted';

export interface CacheEntry<T = unknown> {
  readonly key: string;
  value: T;
  /** Estimated memory size in bytes */
  size: number;
  version: number;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  /** Keys of other cache entries this entry depends on */
  dependencies: string[];
  state: CacheState;
}
