export type SerializationFormat =
  | 'json'       // Human-readable, APIs, AI
  | 'xml'        // Interoperability, config
  | 'binary'     // Internal storage, cache
  | 'openxml'    // DOCX/XLSX/PPTX
  | 'clipboard'  // OS clipboard fragments
  | 'cache'      // Warm-startup persistence
  | 'history';   // Command stacks / diffs

/**
 * The envelope wrapping every serialized payload.
 * Consumers verify the header before attempting deserialization.
 */
export interface SerializedEnvelope {
  /** Format identifier */
  format: SerializationFormat;
  /** Semantic version of the format schema */
  formatVersion: string;
  /** ISO-8601 creation timestamp */
  timestamp: string;
  /** Optional human-readable description / debug hint */
  description?: string;
  /** The actual serialized payload (format-specific) */
  payload: unknown;
  /** SHA-256 checksum of payload (hex string) for integrity validation */
  checksum?: string;
}
