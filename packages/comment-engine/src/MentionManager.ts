// ─────────────────────────────────────────────────────────────────────────────
// Mention Manager — Handles @mentions within comments
// Ref: COMMENT_ENGINE.md §10
// ─────────────────────────────────────────────────────────────────────────────

export class MentionManager {
  /**
   * Extracts @mentions from comment content.
   * In a real implementation, this would validate against a directory of users.
   */
  extractMentions(content: string): string[] {
    const mentions = new Set<string>();
    const regex = /@([a-zA-Z0-9_.-]+)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      mentions.add(match[1]); // match[1] is the username part
    }

    return Array.from(mentions);
  }

  notifyMentions(mentions: string[], threadId: string, author: string): void {
    if (mentions.length === 0) return;
    // Simulate sending notifications
    console.log(`[Notification] ${author} mentioned [${mentions.join(', ')}] in thread ${threadId}`);
  }
}
