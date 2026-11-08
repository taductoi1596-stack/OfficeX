// ─────────────────────────────────────────────────────────────────────────────
// Policy Engine — Core Data Models
// Ref: POLICY_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type PolicyCategory = 
  | 'organization'
  | 'feature'
  | 'admin'
  | 'device'
  | 'cloud'
  | 'plugin'
  | 'printing'
  | 'export'
  | 'ai'
  | 'security';

export type PolicyStatus = 'active' | 'inactive' | 'draft';

export type EnforcementAction = 'allow' | 'deny' | 'audit' | 'override';

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
  value: any;
}

export interface Rule {
  ruleId: string;
  conditions: RuleCondition[];
  action: EnforcementAction;
}

export interface Policy {
  policyId: string;
  name: string;
  category: PolicyCategory;
  scope: string[]; // e.g. ['group:engineering', 'user:admin'] or ['global']
  priority: number; // Higher number = higher precedence
  rules: Rule[];
  status: PolicyStatus;
  metadata: Record<string, any>;
  lastUpdated: number;
}

export interface PolicyEvaluationResult {
  allowed: boolean;
  action: EnforcementAction;
  matchedPolicyId?: string;
  reason?: string;
}
