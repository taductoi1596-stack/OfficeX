// ─────────────────────────────────────────────────────────────────────────────
// Dependency Manager — Tracks field dependencies
// Ref: FIELD_ENGINE.md §20
// ─────────────────────────────────────────────────────────────────────────────

import type { FieldAST } from './models/Field';

export class DependencyManager {
  /**
   * Determine dependencies based on AST.
   * E.g. A PAGE field depends on 'pagination'
   * A DOCVARIABLE depends on 'var:<varName>'
   */
  extractDependencies(ast: FieldAST): string[] {
    const deps: string[] = [];

    switch (ast.type) {
      case 'PAGE':
      case 'NUMPAGES':
      case 'TOC':
        deps.push('pagination');
        break;

      case 'AUTHOR':
      case 'DATE':
      case 'TIME':
        deps.push('metadata');
        break;

      case 'DOCVARIABLE':
        if (ast.params[0]) {
          deps.push(`var:${ast.params[0]}`);
        }
        break;

      case 'REF':
        if (ast.params[0]) {
          deps.push(`bookmark:${ast.params[0]}`);
        }
        break;

      case 'MERGEFIELD':
        deps.push('mailmerge');
        break;
    }

    return deps;
  }
}
