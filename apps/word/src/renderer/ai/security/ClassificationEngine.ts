/**
 * ClassificationEngine.ts
 *
 * Reads document metadata and enforces data classification policies.
 */

import { EditorAPI } from '../../editorApi';

export type ClassificationLevel = 'Public' | 'Internal' | 'Confidential' | 'Highly Confidential' | 'Top Secret';

export class ClassificationEngine {
  /**
   * Identifies the classification of the current document.
   * In a real app, this reads Microsoft Purview or AIP sensitivity labels.
   */
  static getDocumentClassification(): ClassificationLevel {
    const api = EditorAPI.getLegacy();
    if (!api) return 'Internal'; // Default fallback

    const metadata = api.getDocumentMetadata();
    const label = metadata['sensitivityLabel'];
    
    if (label && ['Public', 'Internal', 'Confidential', 'Highly Confidential', 'Top Secret'].includes(label)) {
      return label as ClassificationLevel;
    }

    return 'Internal';
  }

  /**
   * Checks if the document classification permits cloud AI processing.
   */
  static validateClassificationForCloud(): boolean {
    const level = this.getDocumentClassification();
    
    // Policy: Top Secret cannot be sent to ANY AI provider.
    // Policy: Highly Confidential can only be processed by local offline models.
    if (level === 'Top Secret' || level === 'Highly Confidential') {
      return false;
    }

    return true;
  }
}
