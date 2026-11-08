export type EventPriority = 'critical' | 'high' | 'normal' | 'low' | 'background';
export type EventState = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';

export interface OfficeEvent<T = any> {
  readonly id: string;
  readonly type: string; // e.g., "document:save", "input:keydown"
  readonly source: string;
  readonly target: string | null;
  readonly timestamp: number;
  readonly priority: EventPriority;
  state: EventState;
  readonly payload: T;
  readonly metadata: Record<string, any>;

  stopPropagation(): void;
  isPropagationStopped(): boolean;
}

export class BaseEvent<T> implements OfficeEvent<T> {
  public readonly id: string;
  public readonly timestamp: number;
  public state: EventState = 'pending';
  private _propagationStopped = false;

  constructor(
    public readonly type: string,
    public readonly payload: T,
    public readonly source: string = 'system',
    public readonly target: string | null = null,
    public readonly priority: EventPriority = 'normal',
    public readonly metadata: Record<string, any> = {}
  ) {
    this.id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.timestamp = Date.now();
  }

  stopPropagation(): void {
    this._propagationStopped = true;
  }

  isPropagationStopped(): boolean {
    return this._propagationStopped;
  }
}
