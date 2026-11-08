/**
 * ToolEngine.ts
 * 
 * Enterprise AI Tool Calling Engine.
 * Manages tool registration, permissions, and execution for LLM Function Calling.
 */

import { CommandDispatcher } from '../../CommandDispatcher';

export interface AIToolParameter {
  type: string;
  description: string;
  enum?: string[];
}

export interface AIToolSchema {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, AIToolParameter>;
    required?: string[];
  };
}

export interface AITool {
  id: string; // Internal command ID, e.g., 'WORD.INSERT.TABLE'
  schema: AIToolSchema; // Exposed to LLM
  requiresPermission: boolean;
  execute: (args: Record<string, any>) => Promise<any> | any;
}

export class ToolEngine {
  private tools: Map<string, AITool> = new Map();

  /**
   * Registers a new tool into the engine.
   */
  public register(tool: AITool) {
    this.tools.set(tool.schema.name, tool);
    CommandDispatcher.dispatch('WORD.AI.TOOL.REGISTER', { toolId: tool.id });
  }

  /**
   * Removes a tool from the registry.
   */
  public unregister(toolName: string) {
    this.tools.delete(toolName);
  }

  /**
   * Retrieves the JSON Schemas for all registered tools, formatted for OpenAI/Claude API.
   */
  public getRegistrySchemas(): AIToolSchema[] {
    CommandDispatcher.dispatch('WORD.AI.TOOL.REGISTRY');
    return Array.from(this.tools.values()).map(t => t.schema);
  }

  /**
   * Executes a tool requested by the LLM.
   */
  public async execute(toolName: string, args: Record<string, any>): Promise<any> {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      throw new Error(`Tool execution failed: Unknown tool '${toolName}'.`);
    }

    CommandDispatcher.dispatch('WORD.AI.TOOL.EXECUTE', { toolName, args });

    if (tool.requiresPermission) {
      CommandDispatcher.dispatch('WORD.AI.TOOL.PERMISSION', { toolName });
      // In a real enterprise app, we'd halt and prompt the user.
      // For MVP, we auto-grant or simulate delay.
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
      const result = await tool.execute(args);
      return result;
    } catch (e: any) {
      throw new Error(`Tool '${toolName}' execution failed: ${e.message}`);
    }
  }

  /**
   * Clears the tool registry.
   */
  public reset() {
    this.tools.clear();
    CommandDispatcher.dispatch('WORD.AI.TOOL.RESET');
  }
}

export const toolEngine = new ToolEngine();

// --- Pre-register some sample MVP Tools ---

toolEngine.register({
  id: 'WORD.CALC.COUNT_WORDS',
  requiresPermission: false,
  schema: {
    name: 'count_words',
    description: 'Counts the number of words in the given text.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The text to analyze.' }
      },
      required: ['text']
    }
  },
  execute: (args) => {
    const words = (args.text || '').trim().split(/\s+/).filter((w: string) => w.length > 0);
    return { wordCount: words.length };
  }
});

toolEngine.register({
  id: 'WORD.INSERT.TABLE',
  requiresPermission: true,
  schema: {
    name: 'insert_table',
    description: 'Generates and inserts a markdown table into the document.',
    parameters: {
      type: 'object',
      properties: {
        rows: { type: 'number', description: 'Number of rows' },
        cols: { type: 'number', description: 'Number of columns' }
      },
      required: ['rows', 'cols']
    }
  },
  execute: (args) => {
    return { success: true, message: `Inserted table with ${args.rows} rows and ${args.cols} cols.` };
  }
});
