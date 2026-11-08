/**
 * AISecurityEngine.ts
 *
 * Central gateway for AI Security. All AI operations must pass through this engine
 * for validation, classification checks, DLP scanning, and threat detection.
 */

import { DLPEngine } from './DLPEngine';
import { PermissionEngine } from './PermissionEngine';
import { ClassificationEngine } from './ClassificationEngine';
import { AuditEngine } from './AuditEngine';

export class AISecurityEngine {
  /**
   * Validates a request before it is allowed to hit the Prompt Builder or the LLM.
   * Throws an Error if the request violates enterprise policies.
   * 
   * @param rawContext The raw, unsanitized text from the document/user.
   * @param feature The AI feature being invoked (e.g. 'rewrite', 'chat').
   * @returns A safe, redacted version of the context.
   */
  static validateRequest(rawContext: string, feature: string): string {
    // 1. Identity & RBAC Check
    if (!PermissionEngine.canUseAI()) {
      const msg = 'User does not have permission to use AI features.';
      AuditEngine.logSecurityEvent('Violation', msg, feature);
      throw new Error(`[Security Violation] ${msg}`);
    }

    // 2. Classification Check
    if (!ClassificationEngine.validateClassificationForCloud()) {
      const msg = 'Document classification policy prohibits cloud AI processing.';
      AuditEngine.logSecurityEvent('Violation', msg, feature);
      throw new Error(`[Security Violation] ${msg}`);
    }

    // 3. Data Loss Prevention (DLP) Scan & Redact
    const safeContext = DLPEngine.redact(rawContext);
    if (safeContext !== rawContext) {
      AuditEngine.logSecurityEvent('DLP_Redaction', 'Sensitive data was redacted from the prompt context.', feature);
    }

    return safeContext;
  }

  /**
   * Validates the LLM's response before it is displayed to the user or inserted into the document.
   * Scans for prompt leakage or malicious content.
   */
  static validateResponse(response: string, feature: string): string {
    // 1. Threat Detection (Prompt Leakage Simulation)
    // If the model starts repeating our hidden policy headers...
    if (response.includes('[CORPORATE POLICIES]') || response.includes('Ignore previous instructions')) {
      const msg = 'Potential Prompt Injection or System Prompt Leakage detected in AI response.';
      AuditEngine.logSecurityEvent('Threat_Detected', msg, feature);
      
      // We block the response entirely and return a standard security error
      throw new Error(`[Security Alert] The AI generated an unsafe response. It has been blocked by Enterprise Policy.`);
    }

    // 2. Secondary DLP Scan on output (in case model hallucinates PII)
    const safeResponse = DLPEngine.redact(response);
    if (safeResponse !== response) {
      AuditEngine.logSecurityEvent('DLP_Redaction', 'Sensitive data was hallucinated by AI and redacted.', feature);
    }

    return safeResponse;
  }
}
