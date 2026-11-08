/**
 * DLPEngine.ts
 *
 * Data Loss Prevention Engine.
 * Scans text and redacts sensitive information (PII, Secrets, Credentials)
 * before it leaves the local machine.
 */

export class DLPEngine {
  /**
   * Applies all DLP redaction rules to the provided text.
   */
  static redact(text: string): string {
    if (!text) return text;
    
    let safeText = text;
    
    // 1. Social Security Numbers (XXX-XX-XXXX)
    safeText = safeText.replace(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g, '[REDACTED_SSN]');
    
    // 2. Credit Cards (16 digits, optional spaces/dashes)
    safeText = safeText.replace(/\\b(?:\\d[ -]*?){13,16}\\b/g, '[REDACTED_CREDIT_CARD]');
    
    // 3. AWS Access Keys
    safeText = safeText.replace(/\\bAKIA[0-9A-Z]{16}\\b/g, '[REDACTED_AWS_KEY]');
    
    // 4. Bearer / JWT Tokens
    safeText = safeText.replace(/Bearer\\s+[A-Za-z0-9\\-\\_\\.]+/g, 'Bearer [REDACTED_TOKEN]');
    
    // 5. Basic Email masking (e.g. user@example.com -> u***@example.com)
    safeText = safeText.replace(/\\b([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})\\b/g, (match, p1, p2) => {
      return p1.substring(0, 1) + '***@' + p2;
    });

    return safeText;
  }
}
