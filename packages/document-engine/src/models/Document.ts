/**
 * All valid states a Document may occupy.
 * The StateMachine enforces valid transitions between these states.
 */
export type DocumentState =
  | 'new'
  | 'opening'
  | 'loading'
  | 'ready'
  | 'editing'
  | 'saving'
  | 'synchronizing'
  | 'recovering'
  | 'closing'
  | 'closed'
  | 'error';

/** Core metadata fields (OpenXML-compatible). */
export interface DocumentMetadata {
  title: string;
  author: string;
  company?: string;
  subject?: string;
  keywords?: string[];
  language?: string;
  version: string;
  createdAt: Date;
  modifiedAt: Date;
  customProperties?: Record<string, unknown>;
}

/** The canonical representation of an open document. */
export interface Document {
  /** Stable UUID for this document session */
  id: string;
  /** Current lifecycle state */
  state: DocumentState;
  /** Whether the document has unsaved changes */
  isDirty: boolean;
  /** Document metadata (title, author, etc.) */
  metadata: DocumentMetadata;
  /** Absolute file path, or null for new unsaved documents */
  filePath: string | null;
}
