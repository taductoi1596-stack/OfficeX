/**
 * SummaryAnalyzer.ts
 * 
 * Synchronous heuristics-based parser to extract insights from the generated AI summary.
 * It identifies Action Items, Deadlines, Key Entities, and Main Topics without needing 
 * a secondary LLM request, thereby saving tokens and latency.
 */

export interface SummaryInsights {
  actionItems: string[];
  deadlines: string[];
  entities: string[];
  mainTopic: string;
}

export class SummaryAnalyzer {
  
  static analyze(summaryText: string): SummaryInsights {
    const lines = summaryText.split('\n');
    
    const actionItems: string[] = [];
    const deadlines: string[] = [];
    const entities: string[] = [];
    let mainTopic = 'General Overview'; // Default
    
    // Naive heuristics
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Detect Action Items (e.g. "- [ ] do something", "TODO: do something", "Action: do something")
      if (/^(-\s*\[\s*\]|TODO:|Action:)\s*(.*)/i.test(trimmed)) {
        actionItems.push(trimmed.replace(/^(-\s*\[\s*\]|TODO:|Action:)\s*/i, ''));
      }
      
      // Detect Deadlines (simple regex looking for "Due:", "Deadline:", or simple date formats)
      if (/(Due|Deadline)[:\s]+([a-zA-Z0-9/,-]+)/i.test(trimmed)) {
        const match = trimmed.match(/(Due|Deadline)[:\s]+([^.]+)/i);
        if (match && match[2]) {
          deadlines.push(match[2].trim());
        }
      }
      
      // Look for first heading to treat as Main Topic
      if (mainTopic === 'General Overview' && /^#+\s+(.*)/.test(trimmed)) {
        const match = trimmed.match(/^#+\s+(.*)/);
        if (match && match[1]) {
          mainTopic = match[1].trim();
        }
      }
    }
    
    // Naive entity extraction (Capitalized words that aren't at the start of a sentence)
    // Extremely simplistic, real implementation would use NLP.ts or a small local model.
    const words = summaryText.match(/\b[A-Z][a-z]+\b/g) || [];
    const uniqueEntities = new Set<string>();
    words.forEach(w => {
      if (w.length > 3 && !['This', 'That', 'There', 'They'].includes(w)) {
        uniqueEntities.add(w);
      }
    });
    
    return {
      actionItems,
      deadlines,
      entities: Array.from(uniqueEntities).slice(0, 5), // top 5
      mainTopic
    };
  }
}
