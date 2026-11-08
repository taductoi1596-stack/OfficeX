// ─────────────────────────────────────────────────────────────────────────────
// Field Parser — Parses raw field codes into AST
// Ref: FIELD_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { FieldAST, FieldType } from './models/Field';

export class FieldParser {
  /**
   * Extremely simplified parser for demonstration.
   * In a real implementation, this handles nested fields, quotes, and complex switches.
   * Example input: " DOCVARIABLE CompanyName \\* MERGEFORMAT "
   */
  parse(rawCode: string): FieldAST {
    const tokens = rawCode.trim().split(/\s+/);
    if (tokens.length === 0) {
      return { type: 'UNKNOWN', params: [], switches: {} };
    }

    const typeStr = tokens[0].toUpperCase();
    const type = this.resolveType(typeStr);
    
    const params: string[] = [];
    const switches: Record<string, string | boolean> = {};

    let currentSwitch: string | null = null;

    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.startsWith('\\')) {
        currentSwitch = token;
        switches[currentSwitch] = true; // default flag
      } else if (currentSwitch) {
        switches[currentSwitch] = token;
        currentSwitch = null;
      } else {
        params.push(token);
      }
    }

    return { type, params, switches };
  }

  private resolveType(typeStr: string): FieldType {
    const validTypes: FieldType[] = [
      'PAGE', 'NUMPAGES', 'DATE', 'TIME', 'AUTHOR', 'TOC', 
      'REF', 'HYPERLINK', 'INCLUDETEXT', 'SEQ', 'DOCVARIABLE', 'MERGEFIELD'
    ];
    if (validTypes.includes(typeStr as FieldType)) {
      return typeStr as FieldType;
    }
    return 'UNKNOWN';
  }
}
