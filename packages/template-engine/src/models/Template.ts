// ─────────────────────────────────────────────────────────────────────────────
// Template Engine — Core Data Models
// Ref: TEMPLATE_ENGINE.md §6, §7-§13
// ─────────────────────────────────────────────────────────────────────────────

export type TemplateType =
  | 'document'   // Word documents
  | 'sheet'      // Excel worksheets
  | 'slide'      // PowerPoint presentations
  | 'theme'      // Color/font/effect templates
  | 'style'      // Paragraph/character/table styles
  | 'layout'     // Page/slide layout templates
  | 'corporate'; // Org-managed templates

export type TemplateCategory =
  | 'blank'
  | 'report'
  | 'letter'
  | 'contract'
  | 'resume'
  | 'invoice'
  | 'budget'
  | 'calendar'
  | 'dashboard'
  | 'presentation'
  | 'corporate'
  | 'custom';

// ─── Template Variable ────────────────────────────────────────────────────────

export interface TemplateVariable {
  /** Unique key used in template content, e.g. {{companyName}} */
  key: string;
  /** Human-readable label */
  label: string;
  /** Default value used when not provided */
  defaultValue: string;
  /** Whether this variable must be resolved before rendering */
  required: boolean;
}

// ─── Template Resource Reference ──────────────────────────────────────────────

export interface TemplateResource {
  id: string;
  type: 'image' | 'font' | 'icon' | 'style' | 'theme';
  uri: string;
}

// ─── Template Metadata ────────────────────────────────────────────────────────

export interface TemplateMetadata {
  author?: string;
  organization?: string;
  tags?: string[];
  language?: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  isCorporate: boolean;
  isReadOnly: boolean;
  /** Optional digital signature for enterprise templates */
  signature?: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description?: string;
  type: TemplateType;
  category: TemplateCategory;
  /** Placeholder variable definitions */
  variables: TemplateVariable[];
  /** External resource references */
  resources: TemplateResource[];
  /** Raw content model (serialized document structure) */
  contentModel: string;
  themeId?: string;
  layoutId?: string;
  permissions?: string[];
  metadata: TemplateMetadata;
}

// ─── Render Context ───────────────────────────────────────────────────────────

export interface TemplateRenderContext {
  /** Resolved variable values keyed by TemplateVariable.key */
  variables: Record<string, string>;
  /** Target locale for localized content */
  locale?: string;
  /** Override theme ID */
  themeId?: string;
}

// ─── Import/Export ────────────────────────────────────────────────────────────

export interface TemplatePackage {
  version: string;
  templates: Template[];
  exportedAt: number;
}
