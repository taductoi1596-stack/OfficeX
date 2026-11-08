import { ResourceDescriptor, ResourceType } from './models/ResourceDescriptor';

/**
 * The authoritative catalog of all known resources.
 * Stores lightweight descriptors (not the actual resource data).
 */
export class ResourceRegistry {
  private catalog: Map<string, ResourceDescriptor> = new Map();

  public register(descriptor: ResourceDescriptor): void {
    if (this.catalog.has(descriptor.id)) {
      console.warn(`ResourceRegistry: Resource '${descriptor.id}' is already registered. Overwriting.`);
    }
    this.catalog.set(descriptor.id, descriptor);
  }

  public unregister(id: string): void {
    this.catalog.delete(id);
  }

  public get(id: string): ResourceDescriptor | undefined {
    return this.catalog.get(id);
  }

  public getByType(type: ResourceType): ResourceDescriptor[] {
    return Array.from(this.catalog.values()).filter(r => r.type === type);
  }

  public has(id: string): boolean {
    return this.catalog.has(id);
  }

  public getAll(): ResourceDescriptor[] {
    return Array.from(this.catalog.values());
  }
}
