// ─────────────────────────────────────────────────────────────────────────────
// Hyperlink Engine — Core Data Models
// Ref: HYPERLINK_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type LinkType =
  | 'url'
  | 'email'
  | 'bookmark'
  | 'cross-ref'
  | 'internal'
  | 'external';

export type LinkStatus = 'valid' | 'invalid' | 'broken' | 'unchecked' | 'unsafe';

export interface Hyperlink {
  linkId: string;
  linkType: LinkType;
  displayText: string;
  target: string;        // Raw target: URL, bookmark name, cross-ref id, etc.
  tooltip?: string;
  status: LinkStatus;
  metadata: Record<string, any>;
}

export interface ResolvedLink {
  hyperlink: Hyperlink;
  resolvedTarget: string; // Absolute URL, position string, etc.
  isExternal: boolean;
}
