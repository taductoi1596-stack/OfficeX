// ─────────────────────────────────────────────────────────────────────────────
// Policy Manager — Central orchestrator for the Policy Engine
// Ref: POLICY_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { Policy } from './models/Policy';
import { RuleEngine } from './RuleEngine';
import { PolicyEvaluator } from './PolicyEvaluator';
import { EnforcementManager } from './EnforcementManager';

export class PolicyManager {
  readonly evaluator: PolicyEvaluator;
  readonly enforcement: EnforcementManager;
  private ruleEngine: RuleEngine;

  constructor() {
    this.ruleEngine = new RuleEngine();
    this.evaluator = new PolicyEvaluator(this.ruleEngine);
    this.enforcement = new EnforcementManager(this.evaluator);
  }

  // ─── Lifecycle & Sync ─────────────────────────────────────────────────────

  /**
   * Loads policies from local cache or cloud backend.
   */
  loadPolicies(policies: Policy[]): void {
    this.evaluator.setPolicies(policies);
    // console.log(`[PolicyEngine] Loaded ${policies.length} policies.`);
  }

  // ─── High-Level Helpers ───────────────────────────────────────────────────

  /**
   * Quick check for UI disabling (e.g. graying out the Print button)
   */
  canPrint(context: Record<string, any> = {}): boolean {
    return this.enforcement.canExecute('printing', 'print', context);
  }

  /**
   * Quick check for Export restrictions
   */
  canExportFormat(format: string, context: Record<string, any> = {}): boolean {
    return this.enforcement.canExecute('export', `export:${format}`, context);
  }

  /**
   * Check if a plugin is allowed to run
   */
  canRunPlugin(pluginId: string, context: Record<string, any> = {}): boolean {
    return this.enforcement.canExecute('plugin', 'run', { ...context, pluginId });
  }
}
