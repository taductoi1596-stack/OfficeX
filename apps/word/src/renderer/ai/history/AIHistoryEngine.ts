/**
 * AIHistoryEngine.ts
 *
 * Core engine for recording, searching, and managing AI interactions.
 */

import { AIHistoryRecord, AIHistoryFeature, UserDecision } from './HistoryTypes';
import { aiHistoryDb } from './HistoryDatabase';
import { EditorAPI } from '../../editorApi';

function genId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export class AIHistoryEngine {
  
  /**
   * Helper to quickly snap the current state of the document.
   */
  static captureSnapshot(): AIHistoryRecord['snapshot'] {
    const api = EditorAPI.getLegacy();
    return {
      documentId: 'doc_1', // Mock
      documentVersion: 1,  // Mock
      originalText: api ? api.getFullDocumentText() : '',
      selectionStart: 0,   // Simplification for prototype
      selectionEnd: 0
    };
  }

  /**
   * Records a new AI transaction.
   */
  static async recordTransaction(
    feature: AIHistoryFeature,
    systemPrompt: string,
    userPrompt: string,
    response: string,
    telemetry: AIHistoryRecord['telemetry'],
    userDecision: UserDecision = 'pending',
    status: AIHistoryRecord['status'] = 'success',
    errorMessage?: string
  ): Promise<string> {
    const record: AIHistoryRecord = {
      id: genId(),
      timestamp: Date.now(),
      feature,
      systemPrompt,
      userPrompt,
      response,
      snapshot: this.captureSnapshot(),
      telemetry,
      status,
      userDecision,
      errorMessage
    };

    try {
      await aiHistoryDb.addRecord(record);
      return record.id;
    } catch (e) {
      console.error('Failed to record AI History', e);
      return '';
    }
  }

  /**
   * Retrieves all recorded transactions, sorted newest first.
   */
  static async search(): Promise<AIHistoryRecord[]> {
    return await aiHistoryDb.getAllRecords();
  }

  /**
   * Clears all history.
   */
  static async clear(): Promise<void> {
    await aiHistoryDb.clear();
  }

  /**
   * Updates an existing record's user decision (e.g., accepted, rejected).
   * Note: In a real system we'd need an update method in HistoryDatabase.
   * For the prototype, we simply expose the concept.
   */
  static markDecision(recordId: string, decision: UserDecision) {
    console.log(`[AIHistory] Record ${recordId} marked as ${decision}`);
    // implementation pending: aiHistoryDb.updateRecord(recordId, { userDecision: decision })
  }
}
