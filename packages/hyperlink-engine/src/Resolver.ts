// ─────────────────────────────────────────────────────────────────────────────
// Resolver — Resolves hyperlink targets to their canonical destinations
// Ref: HYPERLINK_ENGINE.md §9, §10, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { Hyperlink, ResolvedLink } from './models/Hyperlink';

export class Resolver {
  /** Map of bookmarkName → position descriptor */
  private bookmarkRegistry = new Map<string, string>();

  registerBookmark(name: string, position: string): void {
    this.bookmarkRegistry.set(name, position);
  }

  unregisterBookmark(name: string): void {
    this.bookmarkRegistry.delete(name);
  }

  resolve(hyperlink: Hyperlink): ResolvedLink {
    const { linkType, target } = hyperlink;

    switch (linkType) {
      case 'url':
      case 'external': {
        // Ensure absolute URL
        const resolvedTarget = target.startsWith('http') || target.startsWith('mailto:')
          ? target
          : `https://${target}`;
        return { hyperlink, resolvedTarget, isExternal: true };
      }

      case 'email': {
        const resolvedTarget = target.startsWith('mailto:') ? target : `mailto:${target}`;
        return { hyperlink, resolvedTarget, isExternal: true };
      }

      case 'bookmark': {
        const position = this.bookmarkRegistry.get(target) ?? `#bookmark:${target}`;
        return { hyperlink, resolvedTarget: position, isExternal: false };
      }

      case 'cross-ref': {
        // Cross-refs typically map to section/heading IDs in the document
        const position = `#ref:${target}`;
        return { hyperlink, resolvedTarget: position, isExternal: false };
      }

      case 'internal': {
        // Internal links (page, sheet, slide, named range)
        return { hyperlink, resolvedTarget: `#internal:${target}`, isExternal: false };
      }

      default:
        return { hyperlink, resolvedTarget: target, isExternal: false };
    }
  }
}
