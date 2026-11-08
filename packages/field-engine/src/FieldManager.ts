// ─────────────────────────────────────────────────────────────────────────────
// Field Manager — Central orchestrator for the Field Engine
// Ref: FIELD_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { Field, FieldContext } from './models/Field';
import { FieldParser } from './FieldParser';
import { FieldEvaluator } from './FieldEvaluator';
import { DependencyManager } from './DependencyManager';

function generateId(): string {
  return `fld-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class FieldManager {
  readonly parser = new FieldParser();
  readonly evaluator = new FieldEvaluator();
  readonly depsManager = new DependencyManager();

  private fields = new Map<string, Field>();

  private context: FieldContext = {
    pageNumber: 1,
    totalPages: 1,
    documentVariables: {},
    metadata: { author: 'Unknown' },
  };

  // ─── Context Updates ──────────────────────────────────────────────────────

  setContext(partialCtx: Partial<FieldContext>): void {
    this.context = { ...this.context, ...partialCtx };
  }

  setDocumentVariable(name: string, value: string): void {
    this.context.documentVariables[name] = value;
    this.invalidateByDependency(`var:${name}`);
  }

  // ─── Field CRUD ───────────────────────────────────────────────────────────

  createField(rawCode: string): Field {
    const field: Field = {
      fieldId: generateId(),
      rawCode,
      result: '',
      status: 'uninitialized',
      mode: 'auto',
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Parse and evaluate immediately
    const ast = this.parser.parse(rawCode);
    field.ast = ast;
    field.dependencies = this.depsManager.extractDependencies(ast);
    
    this.fields.set(field.fieldId, field);
    this.evaluateField(field);

    return field;
  }

  getField(fieldId: string): Field | undefined {
    return this.fields.get(fieldId);
  }

  getAllFields(): Field[] {
    return Array.from(this.fields.values());
  }

  removeField(fieldId: string): void {
    this.fields.delete(fieldId);
  }

  // ─── Evaluation ───────────────────────────────────────────────────────────

  evaluateField(field: Field): void {
    if (!field.ast) {
      field.ast = this.parser.parse(field.rawCode);
      field.dependencies = this.depsManager.extractDependencies(field.ast);
    }
    field.result = this.evaluator.evaluate(field.ast, this.context);
    field.status = 'valid';
    field.updatedAt = Date.now();
  }

  evaluateAll(): void {
    for (const field of this.fields.values()) {
      this.evaluateField(field);
    }
  }

  /**
   * Called when a subsystem changes (e.g., pagination finishes).
   * Recalculates only affected fields.
   */
  invalidateByDependency(depKey: string): void {
    for (const field of this.fields.values()) {
      if (field.dependencies.includes(depKey)) {
        field.status = 'stale';
        if (field.mode === 'auto') {
          this.evaluateField(field);
        }
      }
    }
  }
}
