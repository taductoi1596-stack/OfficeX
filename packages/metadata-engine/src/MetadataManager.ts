// ─────────────────────────────────────────────────────────────────────────────
// Metadata Manager — Central orchestrator for the Metadata Engine
// Ref: METADATA_ENGINE.md §4, §5, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentMetadata, CoreProperties } from './models/Metadata';
import { CorePropertyManager } from './CorePropertyManager';
import { CustomPropertyManager } from './CustomPropertyManager';

export class MetadataManager {
  private documentId: string;
  readonly core: CorePropertyManager;
  readonly custom: CustomPropertyManager;

  private tags: string[] = [];
  private revision = {
    revisionNumber: 1,
    createdAt: Date.now(),
    lastModifiedAt: Date.now(),
    lastModifiedBy: undefined as string | undefined,
    saveCount: 0,
  };

  constructor(documentId: string, initial?: Partial<CoreProperties>) {
    this.documentId = documentId;
    this.core = new CorePropertyManager(initial);
    this.custom = new CustomPropertyManager();
  }

  // ─── Tags ─────────────────────────────────────────────────────────────────

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) this.tags.push(tag);
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  getTags(): string[] {
    return [...this.tags];
  }

  // ─── Revision ─────────────────────────────────────────────────────────────

  recordSave(userId?: string): void {
    this.revision.saveCount++;
    this.revision.revisionNumber++;
    this.revision.lastModifiedAt = Date.now();
    if (userId) this.revision.lastModifiedBy = userId;
  }

  getRevision() {
    return { ...this.revision };
  }

  // ─── Full Snapshot ─────────────────────────────────────────────────────────

  getSnapshot(): DocumentMetadata {
    return {
      documentId: this.documentId,
      core: this.core.get(),
      revision: this.getRevision(),
      customProperties: new Map(
        this.custom.getAll().map(p => [p.name, p])
      ),
      tags: this.getTags(),
    };
  }
}
