import { ResourceDescriptor } from './models/ResourceDescriptor';

export type LoaderFn = (descriptor: ResourceDescriptor) => Promise<unknown>;

/**
 * The ResourceLoader abstracts the actual I/O strategy.
 * A platform-specific adapter (Electron/Node.js/Browser) provides a
 * LoaderFn at runtime. This keeps the engine platform-agnostic.
 */
export class ResourceLoader {
  private loaderFn: LoaderFn;

  constructor(loaderFn: LoaderFn) {
    this.loaderFn = loaderFn;
  }

  public async load(descriptor: ResourceDescriptor): Promise<unknown> {
    return this.loaderFn(descriptor);
  }
}
