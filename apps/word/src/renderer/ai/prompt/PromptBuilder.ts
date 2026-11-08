/**
 * PromptBuilder.ts
 *
 * Orchestrates the generation of fully formed, context-aware, secure prompts.
 * No external UI module should concatenate prompts manually.
 */

import { AIContextEngine, BuildContextOptions } from '../context/AIContextEngine';
import { PromptTemplateEngine, PromptVariables } from './PromptTemplateEngine';
import { PolicyEngine } from './PolicyEngine';

export interface BuildPromptOptions {
  operation: 'chat' | 'rewrite' | 'summarize' | 'translate';
  variables?: PromptVariables;
  maxContextTokens?: number;
}

export class PromptBuilder {
  /**
   * Assembles the final System Prompt and User Prompt layers.
   * 
   * @returns an object containing `systemPrompt` (instructions + policies + context)
   * and `safeUserPrompt` (if user input needs to be redacted).
   */
  static build(options: BuildPromptOptions, userContent?: string): { systemPrompt: string; safeUserPrompt?: string } {
    
    // 1. Load Base Template
    let systemPrompt = PromptTemplateEngine.render(options.operation, options.variables);

    // 2. Inject Context
    const contextOptions: BuildContextOptions = {
      operation: options.operation,
      maxTokens: options.maxContextTokens
    };
    const documentContext = AIContextEngine.build(contextOptions);
    
    systemPrompt += `\n\n--- DOCUMENT CONTEXT START ---\n${documentContext}\n--- DOCUMENT CONTEXT END ---\n`;

    // 3. Inject Policies
    systemPrompt = PolicyEngine.injectPolicies(systemPrompt);

    // 4. Return
    let safeUserPrompt: string | undefined = undefined;
    if (userContent) {
      safeUserPrompt = userContent;
    }

    return { systemPrompt, safeUserPrompt };
  }
}
