/**
 * UsageTracker.ts
 *
 * Tracks AI tokens, latency, and estimated costs per provider.
 */

export type UsageRecord = {
  timestamp: number;
  providerId: string;
  model: string;
  operation: 'chat' | 'rewrite' | 'summarize' | 'translate';
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  costEstimate: number; // in USD
};

export class UsageTracker {
  private static readonly STORAGE_KEY = 'officex.ai.usage';
  private static records: UsageRecord[] = [];

  static initialize() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.records = JSON.parse(data);
      }
    } catch (e) {
      console.error('[UsageTracker] Failed to load usage data', e);
    }
  }

  static track(record: Omit<UsageRecord, 'timestamp'>) {
    const fullRecord: UsageRecord = { ...record, timestamp: Date.now() };
    this.records.push(fullRecord);
    this._save();
  }

  static getMonthlyUsage(): { totalTokens: number; totalCost: number } {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = this.records.filter(r => r.timestamp > thirtyDaysAgo);
    
    let totalTokens = 0;
    let totalCost = 0;

    for (const r of recent) {
      totalTokens += (r.promptTokens + r.completionTokens);
      totalCost += r.costEstimate;
    }

    return { totalTokens, totalCost };
  }

  static clear() {
    this.records = [];
    this._save();
  }

  private static _save() {
    try {
      // Keep only last 1000 records to prevent bloating localStorage
      if (this.records.length > 1000) {
        this.records = this.records.slice(-1000);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.records));
    } catch (e) {
      console.error('[UsageTracker] Failed to save usage data', e);
    }
  }
}
