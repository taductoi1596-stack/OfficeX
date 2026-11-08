/**
 * ContextCache.ts
 *
 * Caches recently built document contexts to avoid unnecessary re-parsing.
 * For the prototype, we simply store the last context payload and a timestamp.
 */

export interface CachedContext {
  payload: string;
  timestamp: number;
}

export class ContextCache {
  private cache = new Map<string, CachedContext>();
  private readonly TTL_MS = 10000; // 10 seconds TTL for fast-changing document

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.payload;
  }

  set(key: string, payload: string): void {
    this.cache.set(key, {
      payload,
      timestamp: Date.now(),
    });
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const aiContextCache = new ContextCache();
