// ─────────────────────────────────────────────────────────────────────────────
// Custom Property Manager — Manages user-defined document properties
// Ref: METADATA_ENGINE.md §9
// ─────────────────────────────────────────────────────────────────────────────

import type { CustomProperty, CustomPropertyValue } from './models/Metadata';

export class CustomPropertyManager {
  private properties = new Map<string, CustomProperty>();

  set(name: string, value: CustomPropertyValue): void {
    let type: CustomProperty['type'];

    if (typeof value === 'string') type = 'string';
    else if (typeof value === 'number') type = 'number';
    else if (typeof value === 'boolean') type = 'boolean';
    else type = 'date';

    this.properties.set(name, { name, value, type });
  }

  get(name: string): CustomPropertyValue | undefined {
    return this.properties.get(name)?.value;
  }

  delete(name: string): boolean {
    return this.properties.delete(name);
  }

  getAll(): CustomProperty[] {
    return Array.from(this.properties.values());
  }

  has(name: string): boolean {
    return this.properties.has(name);
  }
}
