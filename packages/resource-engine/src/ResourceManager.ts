import { ResourceDescriptor, ResourceType } from './models/ResourceDescriptor';
import { ResourceRegistry } from './ResourceRegistry';
import { ResourceCache } from './ResourceCache';
import { ResourceLoader } from './ResourceLoader';

/**
 * ResourceManager is the main public API of the Resource Engine.
 * It orchestrates the Registry (catalog), Cache (data), and Loader (I/O).
 * 
 * Usage:
 *  const rm = new ResourceManager(loader);
 *  rm.register({ id: 'font:arial', type: 'Font', ... });
 *  const fontData = await rm.resolve('font:arial');
 */
export class ResourceManager {
  private registry: ResourceRegistry = new ResourceRegistry();
  private cache: ResourceCache;
  private loader: ResourceLoader;

  constructor(loader: ResourceLoader, cacheSize?: number) {
    this.loader = loader;
    this.cache = new ResourceCache(cacheSize);
  }

  /** Register a resource descriptor into the catalog. */
  public register(descriptor: ResourceDescriptor): void {
    this.registry.register(descriptor);
  }

  /**
   * Resolve a resource by ID.
   * Checks cache first (fast path). If not cached, loads from I/O (slow path).
   */
  public async resolve(id: string): Promise<unknown> {
    // Fast path: already in cache
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const descriptor = this.registry.get(id);
    if (!descriptor) {
      throw new Error(`ResourceManager: Resource '${id}' not found in registry.`);
    }

    // Resolve dependencies first
    for (const depId of descriptor.dependencies) {
      await this.resolve(depId);
    }

    // Load the resource
    descriptor.cacheState = 'loading';
    const data = await this.loader.load(descriptor);
    this.cache.set(id, data);
    descriptor.cacheState = 'loaded';

    return data;
  }

  /** Look up all registered resources of a given type. */
  public listByType(type: ResourceType): ResourceDescriptor[] {
    return this.registry.getByType(type);
  }

  /** Evict a specific resource from cache to free memory. */
  public evict(id: string): void {
    const descriptor = this.registry.get(id);
    if (descriptor) {
      descriptor.cacheState = 'evicted';
    }
    this.cache.evict(id);
  }
}
