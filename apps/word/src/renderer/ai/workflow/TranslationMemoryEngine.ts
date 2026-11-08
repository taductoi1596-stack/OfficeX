/**
 * TranslationMemoryEngine.ts
 * 
 * Enterprise Translation Memory (TM) subsystem.
 * Handles Translation Units (TUs) storage, Exact Matching, and Fuzzy Matching via Levenshtein Distance.
 */

export interface TranslationUnit {
  id: string;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  targetText: string;
  timestamp: string;
  author: string;
  matchRate?: number; // Used during search
}

export class TranslationMemoryEngine {
  private static memory: TranslationUnit[] = [];

  /**
   * Initializes the TM with some sample Enterprise data for demonstration.
   */
  static initialize() {
    if (this.memory.length > 0) return;
    this.insert({
      sourceLang: 'English',
      targetLang: 'Vietnamese',
      sourceText: 'The Translation Workflow Engine coordinates the entire lifecycle of an AI translation request.',
      targetText: 'Translation Workflow Engine điều phối toàn bộ vòng đời của một yêu cầu dịch thuật AI.',
      author: 'System',
    });
    this.insert({
      sourceLang: 'English',
      targetLang: 'Vietnamese',
      sourceText: 'Every translation operation must follow a deterministic workflow.',
      targetText: 'Mỗi thao tác dịch thuật phải tuân theo một quy trình xác định.',
      author: 'System',
    });
  }

  /**
   * Inserts a new Translation Unit into the memory.
   */
  static insert(tuData: Omit<TranslationUnit, 'id' | 'timestamp'>) {
    const tu: TranslationUnit = {
      ...tuData,
      id: `TU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    // Duplicate check
    const isDuplicate = this.memory.some(
      m => m.sourceText === tu.sourceText && m.targetLang === tu.targetLang
    );
    if (!isDuplicate) {
      this.memory.push(tu);
    }
  }

  /**
   * Performs an Exact Match search (100% identical source).
   */
  static exactMatch(sourceText: string, targetLang: string): TranslationUnit | null {
    const normalizedSource = sourceText.trim();
    for (const tu of this.memory) {
      if (tu.targetLang === targetLang && tu.sourceText.trim() === normalizedSource) {
        return { ...tu, matchRate: 100 };
      }
    }
    return null;
  }

  /**
   * Performs a Fuzzy Match search using Levenshtein distance.
   * Returns matches above the specified threshold (e.g. 80%).
   */
  static fuzzyMatch(sourceText: string, targetLang: string, threshold: number = 80): TranslationUnit[] {
    const normalizedSource = sourceText.trim();
    const results: TranslationUnit[] = [];

    if (!normalizedSource) return results;

    for (const tu of this.memory) {
      if (tu.targetLang === targetLang) {
        const sim = this.calculateSimilarity(normalizedSource, tu.sourceText.trim());
        if (sim >= threshold) {
          results.push({ ...tu, matchRate: sim });
        }
      }
    }

    // Sort by match rate descending
    return results.sort((a, b) => (b.matchRate || 0) - (a.matchRate || 0));
  }

  /**
   * Calculates similarity percentage between two strings using Levenshtein distance.
   */
  private static calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length >= s2.length ? s1 : s2;
    const shorter = s1.length < s2.length ? s1 : s2;
    
    if (longer.length === 0) return 100;
    
    const distance = this.levenshtein(longer.toLowerCase(), shorter.toLowerCase());
    return Math.round(((longer.length - distance) / longer.length) * 100);
  }

  /**
   * In-memory Levenshtein distance algorithm.
   */
  private static levenshtein(a: string, b: string): number {
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i][j - 1] + 1,       // deletion
          matrix[i - 1][j] + 1,       // insertion
          matrix[i - 1][j - 1] + indicator // substitution
        );
      }
    }

    return matrix[a.length][b.length];
  }

  static getStatistics() {
    return {
      totalTranslationUnits: this.memory.length,
      languagesSupported: new Set(this.memory.map(m => m.targetLang)).size,
    };
  }
}
