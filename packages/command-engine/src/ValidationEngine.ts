import { Command } from '@officex/history-engine';

export type ValidationRule = (command: Command) => boolean;

export class ValidationEngine {
  private rules: ValidationRule[] = [];

  /**
   * Add a new security or business rule to the engine.
   * Example: Reject all modification commands if document is Read-Only.
   */
  public addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * Validate a command against all registered rules.
   * Returns true if all rules pass, false if any rule fails.
   */
  public validate(command: Command): boolean {
    for (const rule of this.rules) {
      if (!rule(command)) {
        return false; // Command blocked by rule
      }
    }
    return true; // Command passed all validations
  }
}
