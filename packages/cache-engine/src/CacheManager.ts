import { CacheProvider, CacheProviderOptions } from './CacheProvider';
import { StatsManager } from './StatsManager';

export type CacheType =
  | 'Layout'
  | 'Render'
  | 'Formula'
  | 'Image'
  | 'Font'
  | 'Theme'
  | 'Object'
  | 'Localization'
  | 'AI'
  | string; // Plugins may add custom types

interface RegistryEntry {
  type: CacheType;
  owner: string;
  provider: CacheProvider;
}

/**
 * The CacheManager is the central facade for the Cache Engine.
 * All engines request their typed CacheProvider from here.
 * 
 * Usage (Layout Engine):
 *   const cache = cacheManager.getOrCreate('Layout', 'layout-engine');
 *   cache.set('page:1', layoutResult, 4096);
 *   const hit = cache.get('page:1');
 */
export class CacheManager {
  private registry: Map<string, RegistryEntry> = new Map();
  private stats: StatsManager = new StatsManager();

  /**
   * Get an existing CacheProvider or create a new one.
   * @param type    The logical type of cache (e.g. 'Layout', 'Font')
   * @param owner   The engine that owns this cache (e.g. 'layout-engine')
   */
  public getOrCreate(
    type: CacheType,
    owner: string,
    options?: CacheProviderOptions
  ): CacheProvider {
    const id = `${type}:${owner}`;

    if (!this.registry.has(id)) {
      const provider = new CacheProvider(this.stats, options);
      this.registry.set(id, { type, owner, provider });
    }

    return this.registry.get(id)!.provider;
  }

  /**
   * Propagate dependency invalidation across ALL registered caches.
   * Call this when an Object Model node changes.
   */
  public invalidateDependents(sourceKey: string): void {
    for (const { provider } of this.registry.values()) {
      provider.invalidateDependents(sourceKey);
    }
  }

  /** Get combined stats across all registered caches. */
  public getStats() {
    return {
      ...this.stats.getStats(),
      hitRatio: this.stats.hitRatio,
      providerCount: this.registry.size,
    };
  }
}
