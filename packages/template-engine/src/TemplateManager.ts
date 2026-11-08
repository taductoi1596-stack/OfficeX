// ─────────────────────────────────────────────────────────────────────────────
// Template Manager — Orchestrator for the Template Engine
// Ref: TEMPLATE_ENGINE.md §4, §5, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { Template, TemplateRenderContext, TemplatePackage } from './models/Template';
import { VariableEngine } from './VariableEngine';
import { GalleryManager } from './GalleryManager';

// ─── Render Result ────────────────────────────────────────────────────────────

export interface TemplateRenderResult {
  /** Rendered content ready to be loaded into the Document Engine */
  content: string;
  templateId: string;
  resolvedVariables: Record<string, string>;
  unresolvedVariables: string[];
  warnings: string[];
}

// ─── Validation Result ────────────────────────────────────────────────────────

export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Template Manager ─────────────────────────────────────────────────────────

export class TemplateManager {
  readonly gallery: GalleryManager;
  private readonly variableEngine: VariableEngine;

  constructor() {
    this.gallery = new GalleryManager();
    this.variableEngine = new VariableEngine();

    // Register built-in blank templates
    this._registerBuiltins();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  render(
    templateId: string,
    context: TemplateRenderContext = { variables: {} }
  ): TemplateRenderResult {
    const template = this.gallery.getById(templateId);
    if (!template) {
      throw new Error(`[TemplateEngine] Template not found: ${templateId}`);
    }

    // Validate before rendering
    const validation = this.validate(template);
    const warnings: string[] = [...validation.warnings];

    if (!validation.valid) {
      throw new Error(
        `[TemplateEngine] Template validation failed: ${validation.errors.join(', ')}`
      );
    }

    // Resolve variables
    const { values, unresolved } = this.variableEngine.resolve(
      template.variables,
      context
    );

    if (unresolved.length > 0) {
      warnings.push(
        `Required variables not resolved: ${unresolved.join(', ')}`
      );
    }

    // Interpolate content
    const content = this.variableEngine.interpolate(template.contentModel, values);

    // Track usage in gallery
    this.gallery.markUsed(templateId);

    return {
      content,
      templateId,
      resolvedVariables: values,
      unresolvedVariables: unresolved,
      warnings,
    };
  }

  // ─── Validate ─────────────────────────────────────────────────────────────

  validate(template: Template): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!template.id) errors.push('Template must have an id');
    if (!template.name) errors.push('Template must have a name');
    if (!template.contentModel) errors.push('Template must have a contentModel');
    if (!template.type) errors.push('Template must have a type');

    // Security: warn about templates with executable-looking content
    if (/(<script|javascript:|eval\()/i.test(template.contentModel)) {
      warnings.push('Template content contains potentially unsafe patterns');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // ─── Import / Export ──────────────────────────────────────────────────────

  exportPackage(): TemplatePackage {
    return {
      version: '1.0',
      templates: this.gallery.getAll(),
      exportedAt: Date.now(),
    };
  }

  importPackage(pkg: TemplatePackage): { imported: number; skipped: number } {
    let imported = 0;
    let skipped = 0;

    for (const template of pkg.templates) {
      const validation = this.validate(template);
      if (validation.valid) {
        this.gallery.register(template);
        imported++;
      } else {
        skipped++;
      }
    }

    return { imported, skipped };
  }

  // ─── Corporate Policies ───────────────────────────────────────────────────

  getCorporateTemplates(): Template[] {
    return this.gallery.getAll().filter(t => t.metadata.isCorporate);
  }

  // ─── Built-in Templates ───────────────────────────────────────────────────

  private _registerBuiltins(): void {
    const now = Date.now();

    const blankDocument: Template = {
      id: 'builtin:blank-document',
      name: 'Blank Document',
      description: 'A clean, empty document',
      type: 'document',
      category: 'blank',
      variables: [],
      resources: [],
      contentModel: '',
      themeId: 'theme-default',
      layoutId: 'layout-standard',
      permissions: ['role:all'],
      metadata: {
        version: '1.0',
        createdAt: now,
        updatedAt: now,
        isCorporate: false,
        isReadOnly: true,
      },
    };

    const reportTemplate: Template = {
      id: 'builtin:report',
      name: 'Business Report',
      description: 'Professional report with title, sections, and footer',
      type: 'document',
      category: 'report',
      variables: [
        { key: 'title', label: 'Report Title', defaultValue: 'Business Report', required: true },
        { key: 'companyName', label: 'Company Name', defaultValue: 'Your Company', required: false },
        { key: 'author', label: 'Author', defaultValue: 'Your Name', required: false },
        { key: 'date', label: 'Date', defaultValue: '', required: false },
      ],
      resources: [],
      contentModel: '# {{title}}\n\nPrepared by: {{author}}\nCompany: {{companyName}}\nDate: {{date}}\n\n---\n\n## Executive Summary\n\n## Analysis\n\n## Conclusion\n',
      themeId: 'theme-corporate',
      layoutId: 'layout-report',
      permissions: ['role:employee', 'role:admin'],
      metadata: {
        version: '1.0',
        tags: ['report', 'business', 'professional'],
        createdAt: now,
        updatedAt: now,
        isCorporate: false,
        isReadOnly: true,
      },
    };

    const letterTemplate: Template = {
      id: 'builtin:letter',
      name: 'Business Letter',
      description: 'Standard business letter format',
      type: 'document',
      category: 'letter',
      variables: [
        { key: 'senderName', label: 'Sender Name', defaultValue: 'Your Name', required: true },
        { key: 'companyName', label: 'Company Name', defaultValue: 'Your Company', required: false },
        { key: 'recipientName', label: 'Recipient Name', defaultValue: 'Recipient', required: true },
        { key: 'date', label: 'Date', defaultValue: '', required: false },
      ],
      resources: [],
      contentModel: '{{companyName}}\n{{date}}\n\nDear {{recipientName}},\n\n[Body of letter]\n\nSincerely,\n{{senderName}}\n',
      themeId: 'theme-default',
      layoutId: 'layout-letter',
      permissions: ['role:all'],
      metadata: {
        version: '1.0',
        tags: ['letter', 'business', 'correspondence'],
        createdAt: now,
        updatedAt: now,
        isCorporate: false,
        isReadOnly: true,
      },
    };

    this.gallery.register(blankDocument);
    this.gallery.register(reportTemplate);
    this.gallery.register(letterTemplate);
  }
}
