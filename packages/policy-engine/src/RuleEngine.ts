// ─────────────────────────────────────────────────────────────────────────────
// Rule Engine — Deterministically evaluates policy conditions
// Ref: POLICY_ENGINE.md §4, §6
// ─────────────────────────────────────────────────────────────────────────────

import type { RuleCondition } from './models/Policy';

export class RuleEngine {
  /**
   * Evaluates a set of conditions against a context object.
   * All conditions must pass (AND logic).
   */
  evaluateConditions(conditions: RuleCondition[], context: Record<string, any>): boolean {
    if (conditions.length === 0) return true;

    for (const condition of conditions) {
      if (!this.evaluateSingleCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  private evaluateSingleCondition(condition: RuleCondition, context: Record<string, any>): boolean {
    const contextValue = context[condition.field];

    if (contextValue === undefined) {
      // If context lacks the field, the condition fails
      return false;
    }

    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value;
      case 'notEquals':
        return contextValue !== condition.value;
      case 'contains':
        if (Array.isArray(contextValue) || typeof contextValue === 'string') {
          return contextValue.includes(condition.value);
        }
        return false;
      case 'in':
        if (Array.isArray(condition.value)) {
          return condition.value.includes(contextValue);
        }
        return false;
      case 'greaterThan':
        return typeof contextValue === 'number' && contextValue > condition.value;
      case 'lessThan':
        return typeof contextValue === 'number' && contextValue < condition.value;
      default:
        console.warn(`[RuleEngine] Unsupported operator: ${condition.operator}`);
        return false;
    }
  }
}
