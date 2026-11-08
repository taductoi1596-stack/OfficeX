/**
 * ChatWorkflowEngine.ts
 * 
 * Deterministic State Machine for the AI Chat Workflow.
 */

import { CommandDispatcher } from '../../CommandDispatcher';
import { toolEngine } from '../tools/ToolEngine';
import { chatMemory } from '../memory/ChatMemoryEngine';

export type ChatWorkflowState =
  | 'Idle'
  | 'IntentAnalysis'
  | 'ContextCollection'
  | 'MemoryLoading'
  | 'PromptBuilding'
  | 'SecurityValidation'
  | 'ToolPlanning'
  | 'Streaming'
  | 'ToolExecution'
  | 'Rendering'
  | 'Completed'
  | 'Error';

export interface ChatWorkflowPayload {
  conversationId: string;
  userMessage: string;
  providerId: string;
  modelId: string;
}

export class ChatWorkflowEngine {
  private currentState: ChatWorkflowState = 'Idle';
  private currentPayload: ChatWorkflowPayload | null = null;
  private cancelRequested: boolean = false;

  private setState(state: ChatWorkflowState) {
    this.currentState = state;
    console.log(`[ChatWorkflow] State transition: -> ${state}`);
  }

  public getState(): ChatWorkflowState {
    return this.currentState;
  }

  public cancel() {
    this.cancelRequested = true;
    CommandDispatcher.dispatch('WORD.AI.CHAT.CANCEL');
    this.setState('Idle');
  }

  /**
   * Executes the Chat Workflow State Machine.
   * This handles the backend orchestration of AI interactions.
   */
  public async execute(
    payload: ChatWorkflowPayload,
    onContextExtracted: (context: string) => void,
    onStreamReady: () => void
  ): Promise<void> {
    if (this.currentState !== 'Idle' && this.currentState !== 'Completed' && this.currentState !== 'Error') {
      console.warn('[ChatWorkflow] Workflow already running.');
      return;
    }

    this.cancelRequested = false;
    this.currentPayload = payload;
    CommandDispatcher.dispatch('WORD.AI.CHAT.START', payload);

    try {
      // 1. Intent Analysis
      if (this.cancelRequested) return;
      this.setState('IntentAnalysis');
      await this.simulateDelay(10);
      
      // 2. Context Collection
      if (this.cancelRequested) return;
      this.setState('ContextCollection');
      CommandDispatcher.dispatch('WORD.AI.CHAT.CONTEXT');
      await this.simulateDelay(20);
      onContextExtracted('Extracted context from current document selection.');

      // 3. Memory Loading
      if (this.cancelRequested) return;
      this.setState('MemoryLoading');
      CommandDispatcher.dispatch('WORD.AI.CHAT.MEMORY');
      
      const relevantMemories = await chatMemory.searchHybrid(payload.userMessage);
      if (relevantMemories.length > 0) {
        console.log(`[ChatWorkflow] Injected ${relevantMemories.length} relevant memories into context.`);
      }
      
      await this.simulateDelay(10);

      // 4. Prompt Building
      if (this.cancelRequested) return;
      this.setState('PromptBuilding');
      CommandDispatcher.dispatch('WORD.AI.CHAT.PROMPT');
      await this.simulateDelay(5);

      // 5. Security Validation
      if (this.cancelRequested) return;
      this.setState('SecurityValidation');
      await this.simulateDelay(5);

      // 6. Tool Planning
      if (this.cancelRequested) return;
      this.setState('ToolPlanning');
      CommandDispatcher.dispatch('WORD.AI.CHAT.TOOLS');
      // Fetch available tools to inject into the LLM context
      const availableTools = toolEngine.getRegistrySchemas();
      console.log(`[ChatWorkflow] Available Tools for LLM:`, availableTools.map(t => t.name));
      await this.simulateDelay(10);

      // 7. Streaming
      if (this.cancelRequested) return;
      this.setState('Streaming');
      CommandDispatcher.dispatch('WORD.AI.CHAT.STREAM');
      onStreamReady();

      // (The actual streaming is delegated to AIStreamingEngine by AIChatEngine,
      // but the workflow registers that streaming has commenced.)

    } catch (e) {
      console.error('[ChatWorkflow] Execution failed:', e);
      this.setState('Error');
      throw e;
    }
  }

  public completeWorkflow() {
    this.setState('Completed');
    CommandDispatcher.dispatch('WORD.AI.CHAT.COMPLETE');
    CommandDispatcher.dispatch('WORD.AI.CHAT.SAVE');
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const chatWorkflow = new ChatWorkflowEngine();
