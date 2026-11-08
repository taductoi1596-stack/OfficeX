/**
 * TokenOptimizer.ts
 *
 * Provides rough token estimation and chunking utilities to ensure context payloads
 * do not exceed the AI provider's context limits.
 */

export class TokenOptimizer {
  private static CHARS_PER_TOKEN = 4;

  /**
   * Roughly estimate token count for a given string.
   */
  static estimateTokens(text: string): number {
    return Math.ceil((text || '').length / this.CHARS_PER_TOKEN);
  }

  /**
   * Truncates text so it fits within a specific token limit.
   */
  static truncateToLimit(text: string, maxTokens: number): string {
    const estimated = this.estimateTokens(text);
    if (estimated <= maxTokens) return text;
    
    // Naive truncation
    const maxChars = maxTokens * this.CHARS_PER_TOKEN;
    return text.substring(0, maxChars) + '... (truncated due to length)';
  }

  /**
   * Chunk text into smaller pieces.
   * Useful for very large documents that need embedding or multi-step processing.
   */
  static chunk(text: string, chunkSizeTokens: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    const words = text.split(/\\s+/);

    for (const word of words) {
      if (this.estimateTokens(currentChunk + ' ' + word) > chunkSizeTokens) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = word;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + word;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }
}
