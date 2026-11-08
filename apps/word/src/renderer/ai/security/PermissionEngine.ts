/**
 * PermissionEngine.ts
 *
 * Simulates Enterprise Identity and Role-Based Access Control (RBAC).
 */

export type UserRole = 'Guest' | 'Viewer' | 'Editor' | 'Administrator';

export class PermissionEngine {
  /**
   * Mock getting the current user's role.
   * In reality, this reads from Azure AD / JWT token.
   */
  static getCurrentUserRole(): UserRole {
    return 'Editor'; // Hardcoded mock
  }

  /**
   * Checks if the user is authorized to perform AI operations.
   */
  static canUseAI(): boolean {
    const role = this.getCurrentUserRole();
    // Enterprise Policy: Guests and Viewers cannot invoke AI generation costs.
    if (role === 'Guest' || role === 'Viewer') {
      return false;
    }
    return true;
  }
}
