// ─────────────────────────────────────────────────────────────────────────────
// Navigation Manager — Handles hyperlink navigation with history support
// Ref: HYPERLINK_ENGINE.md §15
// ─────────────────────────────────────────────────────────────────────────────

import type { ResolvedLink } from './models/Hyperlink';

export class NavigationManager {
  private history: string[] = [];
  private historyIndex = -1;
  private readonly maxHistory = 50;

  /**
   * Navigates to a resolved link.
   * External links open in a new tab/system browser.
   * Internal links dispatch a custom event for the document viewport.
   */
  navigate(resolved: ResolvedLink): void {
    const { resolvedTarget, isExternal } = resolved;

    this.pushHistory(resolvedTarget);

    if (isExternal) {
      this.openExternal(resolvedTarget);
    } else {
      this.navigateInternal(resolvedTarget);
    }
  }

  canGoBack(): boolean {
    return this.historyIndex > 0;
  }

  canGoForward(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  goBack(): string | null {
    if (!this.canGoBack()) return null;
    this.historyIndex--;
    return this.history[this.historyIndex];
  }

  goForward(): string | null {
    if (!this.canGoForward()) return null;
    this.historyIndex++;
    return this.history[this.historyIndex];
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
    this.historyIndex = -1;
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private pushHistory(target: string): void {
    // Truncate forward history on new navigation
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(target);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;
  }

  private openExternal(url: string): void {
    // In Electron/browser, open external links safely
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private navigateInternal(target: string): void {
    // Dispatch custom event for the document viewport to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('officex:navigate', { detail: { target } }));
    }
  }
}
