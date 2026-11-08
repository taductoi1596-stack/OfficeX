export interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface PresenceState {
  collaboratorId: string;
  selection: {
    anchor: { objectId: string; offset: number } | null;
    focus: { objectId: string; offset: number } | null;
    isCollapsed: boolean;
  };
  cursorCoordinates: { x: number; y: number } | null;
}
