// ─────────────────────────────────────────────────────────────────────────────
// Variable Engine — Template variable resolution & interpolation
// Ref: TEMPLATE_ENGINE.md §15, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { TemplateVariable, TemplateRenderContext } from './models/Template';

export interface ResolvedVariables {
  values: Record<string, string>;
  /** Variables that could not be resolved */
  unresolved: string[];
}

export class VariableEngine {
  private readonly TOKEN_PATTERN = /\{\{(\w+)\}\}/g;

  // ─── Default system variables ───────────────────────────────────────────────

  private getSystemDefaults(): Record<string, string> {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      year: String(now.getFullYear()),
      month: now.toLocaleString('default', { month: 'long' }),
      timestamp: now.toISOString(),
    };
  }

  // ─── Resolve variables ──────────────────────────────────────────────────────

  resolve(
    definitions: TemplateVariable[],
    context: TemplateRenderContext
  ): ResolvedVariables {
    const systemDefaults = this.getSystemDefaults();
    const values: Record<string, string> = { ...systemDefaults };
    const unresolved: string[] = [];

    for (const def of definitions) {
      const provided = context.variables[def.key];
      if (provided !== undefined) {
        values[def.key] = provided;
      } else if (def.defaultValue) {
        values[def.key] = def.defaultValue;
      } else if (def.required) {
        unresolved.push(def.key);
      }
    }

    return { values, unresolved };
  }

  // ─── Interpolate a content string ───────────────────────────────────────────

  interpolate(content: string, values: Record<string, string>): string {
    return content.replace(this.TOKEN_PATTERN, (match, key) => {
      return values[key] !== undefined ? values[key] : match;
    });
  }

  // ─── List all tokens in a content string ────────────────────────────────────

  extractTokens(content: string): string[] {
    const tokens: string[] = [];
    let match: RegExpExecArray | null;
    const re = /\{\{(\w+)\}\}/g;
    while ((match = re.exec(content)) !== null) {
      tokens.push(match[1]);
    }
    return [...new Set(tokens)];
  }
}
