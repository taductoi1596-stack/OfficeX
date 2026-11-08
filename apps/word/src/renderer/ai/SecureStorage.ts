/**
 * SecureStorage.ts
 *
 * Simulates enterprise secure credential storage (e.g., Windows Credential Manager,
 * keychain, or encrypted local storage).
 *
 * In this web-based prototype, it uses a simple Base64 obfuscation wrapper
 * around localStorage. In a real desktop app, this would bridge to native secure enclaves.
 */

export class SecureStorage {
  private static readonly PREFIX = 'officex.secure.';

  /**
   * Store a secret key securely.
   */
  static setSecret(key: string, value: string): void {
    try {
      // Mock encryption: Base64 encoding for simulation purposes
      const encrypted = btoa(encodeURIComponent(value));
      localStorage.setItem(this.PREFIX + key, encrypted);
    } catch (e) {
      console.error('[SecureStorage] Failed to store secret', e);
    }
  }

  /**
   * Retrieve a secret key.
   */
  static getSecret(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(this.PREFIX + key);
      if (!encrypted) return null;
      // Mock decryption
      return decodeURIComponent(atob(encrypted));
    } catch (e) {
      console.error('[SecureStorage] Failed to retrieve secret', e);
      return null;
    }
  }

  /**
   * Remove a secret key.
   */
  static removeSecret(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  /**
   * Clear all stored secrets matching the prefix.
   */
  static clearAllSecrets(): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(this.PREFIX)) {
        localStorage.removeItem(k);
      }
    }
  }
}
