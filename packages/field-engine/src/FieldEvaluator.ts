// ─────────────────────────────────────────────────────────────────────────────
// Field Evaluator — Executes AST and returns the display string
// Ref: FIELD_ENGINE.md §7 - §18
// ─────────────────────────────────────────────────────────────────────────────

import type { FieldAST, FieldContext } from './models/Field';

export class FieldEvaluator {
  evaluate(ast: FieldAST, context: FieldContext): string {
    switch (ast.type) {
      case 'PAGE':
        return context.pageNumber?.toString() ?? '1';
        
      case 'NUMPAGES':
        return context.totalPages?.toString() ?? '1';
        
      case 'DATE':
      case 'TIME': {
        // Very basic formatting logic, ignore switches for simplicity here
        const d = new Date();
        return ast.type === 'DATE' ? d.toLocaleDateString() : d.toLocaleTimeString();
      }

      case 'AUTHOR':
        return context.metadata['author'] ?? 'Unknown Author';

      case 'DOCVARIABLE': {
        if (ast.params.length === 0) return '!Error: No variable name!';
        const varName = ast.params[0];
        return context.documentVariables[varName] ?? `!Error: Unknown var ${varName}!`;
      }

      case 'TOC':
        return '{ Table of Contents Placeholder }';

      case 'REF':
        return `{ Reference to ${ast.params[0] ?? '?'} }`;

      case 'HYPERLINK':
        return ast.params[0] ?? '';

      default:
        return `!Error: Unsupported field type ${ast.type}!`;
    }
  }
}
