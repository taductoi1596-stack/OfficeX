import { StyleRegistry } from './StyleRegistry';
import { CombinedFormatting } from '../models/StyleTypes';

export class StyleResolver {
  private registry: StyleRegistry;

  constructor(registry: StyleRegistry) {
    this.registry = registry;
  }

  /**
   * Recursively resolves the final computed formatting for a given style ID.
   * It merges properties from parent styles, allowing child styles to override them.
   */
  public resolveStyle(styleId: string): CombinedFormatting {
    return this._resolveRecursive(styleId, new Set<string>());
  }

  private _resolveRecursive(styleId: string, visited: Set<string>): CombinedFormatting {
    // 1. Prevent infinite loops (e.g. A based on B, B based on A)
    if (visited.has(styleId)) {
      console.warn(`Circular style inheritance detected at: ${styleId}`);
      return {};
    }
    visited.add(styleId);

    // 2. Fetch the style
    const style = this.registry.getStyle(styleId);
    if (!style) {
      return {}; // Unknown style, return empty
    }

    // 3. Base case: No parent
    if (!style.basedOnId) {
      return { ...style.formatting }; // Clone local formatting
    }

    // 4. Recursive case: Inherit from parent, then merge local overrides
    const parentFormatting = this._resolveRecursive(style.basedOnId, visited);
    
    // Merge: Child overrides parent
    const merged: CombinedFormatting = { ...parentFormatting };
    for (const key of Object.keys(style.formatting)) {
      const k = key as keyof CombinedFormatting;
      if (style.formatting[k] !== undefined) {
        // @ts-ignore - Safe because we are iterating keys of the same interface
        merged[k] = style.formatting[k];
      }
    }

    return merged;
  }
}
