import { Collaborator, PresenceState } from './models/Presence';

type EventHandler = (payload: any) => void;

export class PresenceManager {
  private collaborators: Map<string, Collaborator> = new Map();
  private presences: Map<string, PresenceState> = new Map();
  private listeners: Map<string, Set<EventHandler>> = new Map();

  public addCollaborator(c: Collaborator) {
    this.collaborators.set(c.id, c);
    this.emit('collaborator:joined', c);
  }

  public removeCollaborator(id: string) {
    this.collaborators.delete(id);
    this.presences.delete(id);
    this.emit('collaborator:left', { id });
  }

  public updatePresence(state: PresenceState) {
    this.presences.set(state.collaboratorId, state);
    this.emit('presence:updated', state);
  }

  public getCollaborator(id: string): Collaborator | undefined {
    return this.collaborators.get(id);
  }

  public getAllPresences(): PresenceState[] {
    return Array.from(this.presences.values());
  }

  public on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  private emit(event: string, payload: any) {
    this.listeners.get(event)?.forEach(h => h(payload));
  }
}
