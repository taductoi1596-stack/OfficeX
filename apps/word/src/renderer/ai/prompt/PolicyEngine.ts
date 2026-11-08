/**
 * PolicyEngine.ts
 *
 * Injects enterprise corporate policies into AI system prompts.
 */

export class PolicyEngine {
  /**
   * Generates a string containing all active corporate AI usage policies.
   */
  static getCorporatePolicy(): string {
    return `[CORPORATE POLICIES]
- Tone: Professional, constructive, and aligned with company values.
- Prohibited Topics: Do not discuss unannounced products, negative sentiment about competitors, or internal HR matters.
- Confidentiality: Do not generate code that circumvents security controls.
[/CORPORATE POLICIES]`;
  }

  /**
   * Injects policies into a given system prompt.
   */
  static injectPolicies(systemPrompt: string): string {
    const policies = this.getCorporatePolicy();
    // Prepend policies to the system prompt
    return policies + '\n\n' + systemPrompt;
  }
}
