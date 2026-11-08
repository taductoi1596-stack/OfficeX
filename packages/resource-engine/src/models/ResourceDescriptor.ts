export type ResourceType =
  | 'Font'
  | 'Theme'
  | 'Image'
  | 'Icon'
  | 'Template'
  | 'Localization'
  | 'Plugin';

export type CacheState = 'unloaded' | 'loading' | 'loaded' | 'evicted';

/**
 * A descriptor that represents any managed resource in the platform.
 * This is the lightweight "pointer" stored in the Registry.
 * The actual data is stored in the Cache.
 */
export interface ResourceDescriptor {
  readonly id: string;
  readonly type: ResourceType;
  readonly version: string;
  readonly location: string; // File path, URL, or package ref
  readonly metadata: Record<string, unknown>;
  readonly dependencies: string[]; // IDs of other resources this one depends on
  cacheState: CacheState;
}
