// ─────────────────────────────────────────────────────────────────────────────
// Hyperlink Manager — Central orchestrator for the Hyperlink Engine
// Ref: HYPERLINK_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { Hyperlink, LinkType } from './models/Hyperlink';
import { Validator } from './Validator';
import { Resolver } from './Resolver';
import { NavigationManager } from './NavigationManager';

function generateId(): string {
  return `lnk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class HyperlinkManager {
  readonly validator: Validator;
  readonly resolver: Resolver;
  readonly navigation: NavigationManager;

  private links = new Map<string, Hyperlink>();

  constructor() {
    this.validator = new Validator();
    this.resolver = new Resolver();
    this.navigation = new NavigationManager();
  }

  // ─── Link Store ───────────────────────────────────────────────────────────

  createLink(
    linkType: LinkType,
    target: string,
    displayText: string,
    tooltip?: string,
    metadata: Record<string, any> = {}
  ): Hyperlink {
    const hyperlink: Hyperlink = {
      linkId: generateId(),
      linkType,
      displayText,
      target,
      tooltip,
      status: 'unchecked',
      metadata,
    };

    // Validate immediately
    hyperlink.status = this.validator.validate(hyperlink);

    this.links.set(hyperlink.linkId, hyperlink);
    return hyperlink;
  }

  getLink(linkId: string): Hyperlink | undefined {
    return this.links.get(linkId);
  }

  getAllLinks(): Hyperlink[] {
    return Array.from(this.links.values());
  }

  removeLink(linkId: string): void {
    this.links.delete(linkId);
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  /**
   * Validates, resolves, and navigates to a hyperlink.
   * Returns false if link is blocked (unsafe/invalid).
   */
  activateLink(linkId: string): boolean {
    const hyperlink = this.links.get(linkId);
    if (!hyperlink) return false;

    // Re-validate
    hyperlink.status = this.validator.validate(hyperlink);

    if (hyperlink.status === 'unsafe' || hyperlink.status === 'invalid') {
      return false;
    }

    const resolved = this.resolver.resolve(hyperlink);
    this.navigation.navigate(resolved);
    return true;
  }

  // ─── Bookmark Registry ────────────────────────────────────────────────────

  registerBookmark(name: string, position: string): void {
    this.resolver.registerBookmark(name, position);
    // Re-validate any unchecked bookmark links
    this.validator.invalidateCache();
  }

  // ─── Batch Validation ─────────────────────────────────────────────────────

  validateAll(): void {
    this.validator.invalidateCache();
    for (const link of this.links.values()) {
      link.status = this.validator.validate(link);
    }
  }

  getBrokenLinks(): Hyperlink[] {
    return this.getAllLinks().filter(l => l.status === 'broken' || l.status === 'invalid');
  }
}
