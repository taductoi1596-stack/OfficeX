/**
 * PromptTemplateEngine.ts
 *
 * Manages prompt templates and variable interpolation.
 */

export type PromptVariables = {
  tone?: string;
  length?: string;
  instruction?: string;
  summaryType?: string;
  targetLanguage?: string;
  [key: string]: string | undefined;
};

export class PromptTemplateEngine {
  private static templates: Record<string, string> = {
    rewrite: `You are an expert editor. Rewrite the provided text.
{{instruction}}
Target Tone: {{tone}}
Target Length: {{length}}`,

    summarize: `You are an expert analyst. Provide a summary of the provided text.
Summary Type: {{summaryType}}
Ensure the summary is concise and covers all major points.`,

    translate: `You are an expert professional translator.
Translate the provided text into {{targetLanguage}}.
Preserve all original formatting and context intent.`,

    chat: `You are the OfficeX AI Assistant. You are intelligent, helpful, and concise.
You assist the user in editing, understanding, and creating documents.
{{instruction}}`
  };

  /**
   * Retrieves and renders a template with the given variables.
   */
  static render(operation: string, variables: PromptVariables = {}): string {
    let template = this.templates[operation];
    if (!template) {
      return `You are a helpful AI Assistant. Operation: ${operation}`;
    }

    // Process known optional blocks (very simplistic template engine)
    if (variables.instruction) {
      template = template.replace('{{instruction}}', `Additional User Instruction: "${variables.instruction}"`);
    } else {
      template = template.replace('{{instruction}}\n', '');
      template = template.replace('{{instruction}}', '');
    }

    // Replace other variables
    return template.replace(/\\{\\{(\\w+)\\}\\}/g, (match, key) => {
      return variables[key] || 'Default';
    });
  }
}
