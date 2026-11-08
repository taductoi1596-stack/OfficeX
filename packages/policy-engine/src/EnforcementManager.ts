// ─────────────────────────────────────────────────────────────────────────────
// Enforcement Manager — Gatekeeper for sensitive operations
// Ref: POLICY_ENGINE.md §4, §13, §14
// ─────────────────────────────────────────────────────────────────────────────

import type { PolicyEvaluator } from './PolicyEvaluator';
import type { PolicyCategory } from './models/Policy';

export class EnforcementManager {
  private evaluator: PolicyEvaluator;

  constructor(evaluator: PolicyEvaluator) {
    this.evaluator = evaluator;
  }

  /**
   * Enforces a policy check before an action.
   * Throws an error if the action is denied by policy.
   */
  enforce(category: PolicyCategory, actionName: string, context: Record<string, any> = {}): void {
    const result = this.evaluator.evaluate(category, { ...context, action: actionName });

    if (!result.allowed) {
      throw new Error(`[PolicyEngine] Action '${actionName}' denied: ${result.reason}`);
    }

    if (result.action === 'audit') {
      // In a real system, send this to the Audit Engine
      // console.info(`[PolicyEngine] Audit log for action '${actionName}' under policy ${result.matchedPolicyId}`);
    }
  }

  /**
   * Non-throwing version of enforce, returns boolean.
   */
  canExecute(category: PolicyCategory, actionName: string, context: Record<string, any> = {}): boolean {
    const result = this.evaluator.evaluate(category, { ...context, action: actionName });
    return result.allowed;
  }
}
