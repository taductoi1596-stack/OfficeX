/**
 * ChatMemoryEngine.ts
 * 
 * Enterprise Chat Memory Engine.
 * Simulates a Vector Database and Semantic Search Retrieval pipeline.
 */

import { CommandDispatcher } from '../../CommandDispatcher';

export type MemoryCategory = 'Conversation' | 'Document' | 'Project' | 'Enterprise' | 'Preference';

export interface MemoryObject {
  id: string;
  category: MemoryCategory;
  content: string;
  tags: string[];
  createdAt: Date;
  accessCount: number;
}

export class ChatMemoryEngine {
  private memoryStore: Map<string, MemoryObject> = new Map();

  /**
   * Initializes the Memory Engine (Simulating DB connection).
   */
  public async initialize(): Promise<void> {
    console.log('[ChatMemory] Engine initialized.');
    
    // Seed some MVP Enterprise Knowledge
    this.store({
      category: 'Enterprise',
      content: 'Company Policy: All documents must use Arial font size 12 and include a Confidential watermark if sharing externally.',
      tags: ['policy', 'formatting', 'confidentiality']
    });

    this.store({
      category: 'Preference',
      content: 'User prefers concise, bullet-point summaries rather than long paragraphs.',
      tags: ['preference', 'summary', 'format']
    });
  }

  /**
   * Stores a new memory object.
   */
  public store(memoryInit: Omit<MemoryObject, 'id' | 'createdAt' | 'accessCount'>): MemoryObject {
    const mem: MemoryObject = {
      id: `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
      accessCount: 0,
      ...memoryInit
    };
    
    this.memoryStore.set(mem.id, mem);
    CommandDispatcher.dispatch('WORD.AI.MEMORY.STORE', { id: mem.id });
    return mem;
  }

  /**
   * Simulates a Hybrid Search (Semantic + Keyword) across the vector DB.
   */
  public async searchHybrid(query: string, limit: number = 3): Promise<MemoryObject[]> {
    CommandDispatcher.dispatch('WORD.AI.MEMORY.SEARCH', { query });
    
    // MVP Mock: Simple keyword relevance scoring
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    
    const scoredMemories = Array.from(this.memoryStore.values()).map(mem => {
      let score = 0;
      const lowerContent = mem.content.toLowerCase();
      
      // Match content
      queryTokens.forEach(token => {
        if (lowerContent.includes(token)) score += 2;
      });

      // Match tags
      mem.tags.forEach(tag => {
        if (queryTokens.includes(tag.toLowerCase())) score += 5;
      });

      // Recency/Access boost
      score += mem.accessCount * 0.1;

      return { mem, score };
    });

    // Sort by descending score
    scoredMemories.sort((a, b) => b.score - a.score);

    // Return top N matching results (score > 0)
    const results = scoredMemories
      .filter(sm => sm.score > 0)
      .slice(0, limit)
      .map(sm => {
        sm.mem.accessCount++; // update access frequency
        return sm.mem;
      });

    CommandDispatcher.dispatch('WORD.AI.MEMORY.RETRIEVE', { count: results.length });
    return results;
  }

  public getStatistics() {
    CommandDispatcher.dispatch('WORD.AI.MEMORY.STATISTICS');
    return {
      totalMemories: this.memoryStore.size,
      memoryCategories: Array.from(this.memoryStore.values()).reduce((acc, mem) => {
        acc[mem.category] = (acc[mem.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const chatMemory = new ChatMemoryEngine();
// Fire-and-forget init for MVP
chatMemory.initialize();
