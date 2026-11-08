/**
 * AIContextEngine.ts
 *
 * The central engine for providing intelligent context to AI operations.
 * It builds, compresses, ranks, and caches document contexts.
 */

import { ContextBuilder } from './ContextBuilder';
import { TokenOptimizer } from './TokenOptimizer';
import { aiContextCache } from './ContextCache';

export interface BuildContextOptions {
  operation: 'chat' | 'rewrite' | 'summarize' | 'translate';
  maxTokens?: number;
  forceRefresh?: boolean;
}

export class AIContextEngine {
  private static readonly DEFAULT_MAX_TOKENS = 16000;

  /**
   * Build the final context string for AI consumption.
   */
  static build(options: BuildContextOptions): string {
    const maxTokens = options.maxTokens || this.DEFAULT_MAX_TOKENS;
    const cacheKey = `${options.operation}_${maxTokens}`;

    if (!options.forceRefresh) {
      const cached = aiContextCache.get(cacheKey);
      if (cached) return cached;
    }

    // 1. Collect Raw Data
    const rawContext = ContextBuilder.buildRawContext();

    // 2. Format to Semantic Structure (Markdown)
    let formattedText = ContextBuilder.formatToMarkdown(rawContext);

    // 3. Token Optimization / Compression
    formattedText = TokenOptimizer.truncateToLimit(formattedText, maxTokens);

    // 4. Cache and Return
    aiContextCache.set(cacheKey, formattedText);
    return formattedText;
  }

  /**
   * Invalidate the cache (usually called on document edits).
   */
  static refresh() {
    aiContextCache.invalidate();
  }
}
