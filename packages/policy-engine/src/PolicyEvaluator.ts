// ─────────────────────────────────────────────────────────────────────────────
// Policy Evaluator — Evaluates categories of policies for a given context
// Ref: POLICY_ENGINE.md §4, §21
// ─────────────────────────────────────────────────────────────────────────────

import type { Policy, PolicyCategory, PolicyEvaluationResult } from './models/Policy';
import { RuleEngine } from './RuleEngine';

export class PolicyEvaluator {
  private ruleEngine: RuleEngine;
  private activePolicies: Policy[] = [];

  constructor(ruleEngine: RuleEngine) {
    this.ruleEngine = ruleEngine;
  }

  setPolicies(policies: Policy[]): void {
    this.activePolicies = policies.filter(p => p.status === 'active');
  }

  getPolicies(): Policy[] {
    return this.activePolicies;
  }

  /**
   * Evaluates all policies in a specific category for a given context.
   * Higher priority policies override lower priority ones.
   */
  evaluate(category: PolicyCategory, context: Record<string, any>): PolicyEvaluationResult {
    const relevantPolicies = this.activePolicies
      .filter(p => p.category === category)
      // Sort descending by priority so highest priority is evaluated first
      .sort((a, b) => b.priority - a.priority);

    // Default to allow if no policies restrict it
    let finalResult: PolicyEvaluationResult = { allowed: true, action: 'allow' };

    for (const policy of relevantPolicies) {
      // Check if policy scope applies to context (stub: assuming global for now)
      const isScopeMatch = policy.scope.includes('global') || 
                           (context.role && policy.scope.includes(`role:${context.role}`));
      
      if (!isScopeMatch) continue;

      for (const rule of policy.rules) {
        if (this.ruleEngine.evaluateConditions(rule.conditions, context)) {
          // First match determines the outcome for this priority level
          if (rule.action === 'deny') {
            return {
              allowed: false,
              action: 'deny',
              matchedPolicyId: policy.policyId,
              reason: `Denied by policy ${policy.name}`,
            };
          } else if (rule.action === 'allow' || rule.action === 'override') {
            finalResult = {
              allowed: true,
              action: rule.action,
              matchedPolicyId: policy.policyId,
            };
            // If it's an explicit override or allow at high priority, we can return early
            if (rule.action === 'override') return finalResult;
          }
        }
      }
    }

    return finalResult;
  }
}
