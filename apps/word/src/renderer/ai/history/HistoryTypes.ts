/**
 * HistoryTypes.ts
 *
 * Data models for AI History Engine transactions.
 */

export type AIHistoryFeature = 'rewrite' | 'summarize' | 'translate' | 'chat' | 'dictation' | 'grammar';
export type AIHistoryStatus = 'success' | 'error' | 'cancelled';
export type UserDecision = 'accepted' | 'rejected' | 'modified' | 'pending';

export interface DocumentSnapshot {
  documentId?: string;
  documentVersion?: number;
  originalText: string;
  selectionStart?: number;
  selectionEnd?: number;
}

export interface TelemetryInfo {
  provider: string;
  model: string;
  tokensReceived: number;
  tokensPerSecond: number;
  elapsedMs: number;
  estimatedCost?: number;
}

export interface AIHistoryRecord {
  id: string;
  timestamp: number;
  feature: AIHistoryFeature;
  
  // Prompt & Result
  systemPrompt: string;
  userPrompt: string;
  response: string;

  // Context & Snapshot
  snapshot: DocumentSnapshot;
  
  // Stats
  telemetry: TelemetryInfo;
  status: AIHistoryStatus;
  
  // User Action
  userDecision: UserDecision;
  errorMessage?: string;
}
