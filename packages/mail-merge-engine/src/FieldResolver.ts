// ─────────────────────────────────────────────────────────────────────────────
// Field Resolver — Replaces merge fields with record data
// Ref: MAIL_MERGE_ENGINE.md §7, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { MergeRecord } from './models/MergeJob';

export class FieldResolver {
  /**
   * Extremely simplified template expansion.
   * Finds occurrences of {{FieldName}} and replaces them with data.
   * A real implementation integrates closely with Field Engine's MERGEFIELD evaluation.
   */
  resolveDocument(templateContent: string, record: MergeRecord): string {
    let result = templateContent;
    
    // 1. Process IF/ELSE conditions first
    // Format: {{IF FieldName="Value"}} True Text {{ELSE}} False Text {{ENDIF}}
    const ifRegex = /\{\{IF ([^=]+)="([^"]+)"\}\}([\s\S]*?)(?:\{\{ELSE\}\}([\s\S]*?))?\{\{ENDIF\}\}/g;
    result = result.replace(ifRegex, (match, field, value, trueText, falseText) => {
      const recordValue = String(record[field] || '');
      if (recordValue === value) {
        return trueText || '';
      } else {
        return falseText || '';
      }
    });

    // 2. Process standard field replacements
    for (const [key, value] of Object.entries(record)) {
      // Replace all instances of {{key}}
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    // Clean up unresolved fields (optional based on spec)
    result = result.replace(/\{\{[^}]+\}\}/g, '');
    
    return result;
  }
}
