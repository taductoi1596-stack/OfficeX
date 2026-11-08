// ─────────────────────────────────────────────────────────────────────────────
// Metadata Engine — Core Data Models
// Ref: METADATA_ENGINE.md §6, §7, §9, §12
// ─────────────────────────────────────────────────────────────────────────────

export type ContentType =
  | 'word-document'
  | 'spreadsheet'
  | 'presentation'
  | 'template'
  | 'pdf'
  | 'custom';

export type CustomPropertyValue = string | number | boolean | Date;

export interface CoreProperties {
  title?: string;
  subject?: string;
  author?: string;
  description?: string;
  keywords?: string[];
  category?: string;
  language?: string;
  comments?: string;
  company?: string;
  department?: string;
  manager?: string;
  contentType: ContentType;
}

export interface RevisionMetadata {
  revisionNumber: number;
  versionLabel?: string;
  createdAt: number;
  lastModifiedAt: number;
  lastModifiedBy?: string;
  saveCount: number;
}

export interface CustomProperty {
  name: string;
  value: CustomPropertyValue;
  type: 'string' | 'number' | 'boolean' | 'date';
}

export interface DocumentMetadata {
  documentId: string;
  core: CoreProperties;
  revision: RevisionMetadata;
  customProperties: Map<string, CustomProperty>;
  tags: string[];
}
