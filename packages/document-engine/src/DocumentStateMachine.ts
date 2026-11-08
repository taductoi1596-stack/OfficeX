import { DocumentState } from './models/Document';

/** Valid state transitions for the Document lifecycle. */
const VALID_TRANSITIONS: Record<DocumentState, DocumentState[]> = {
  new:           ['opening', 'editing', 'ready', 'saving', 'closing', 'error'],
  opening:       ['loading', 'ready', 'error'],
  loading:       ['ready', 'error'],
  ready:         ['editing', 'saving', 'closing', 'error'],
  editing:       ['saving', 'closing', 'synchronizing', 'error'],
  saving:        ['ready', 'editing', 'error'],
  synchronizing: ['editing', 'ready', 'error'],
  recovering:    ['ready', 'error'],
  closing:       ['closed', 'error'],
  closed:        [],
  error:         ['recovering', 'closed'],
};

/**
 * StateMachine enforces valid lifecycle transitions.
 * Any attempt to perform an illegal transition throws — preventing
 * the engine from entering an inconsistent state (e.g. saving a closed doc).
 */
export class DocumentStateMachine {
  private state: DocumentState;

  constructor(initial: DocumentState = 'new') {
    this.state = initial;
  }

  public get current(): DocumentState {
    return this.state;
  }

  public transition(next: DocumentState): void {
    const allowed = VALID_TRANSITIONS[this.state];
    if (!allowed.includes(next)) {
      throw new Error(
        `DocumentStateMachine: Invalid transition '${this.state}' → '${next}'.`
      );
    }
    this.state = next;
  }

  public canTransitionTo(next: DocumentState): boolean {
    return VALID_TRANSITIONS[this.state].includes(next);
  }
}
