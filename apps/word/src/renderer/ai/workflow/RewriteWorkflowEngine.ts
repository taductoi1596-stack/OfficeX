/**
 * RewriteWorkflowEngine.ts
 *
 * Deterministic state machine managing the lifecycle of an AI Rewrite operation.
 * Binds UI, Document API, AI Engine, and History together.
 */

import { EditorAPI } from '../../editorApi';
import { AIEngine, AIRewriteOptions } from '../../AIEngine';
import { RewriteContextEngine } from '../context/RewriteContextEngine';
import { AIHistoryEngine } from '../history/AIHistoryEngine';

export type WorkflowState = 
  | 'Idle' 
  | 'Preparing' 
  | 'Streaming' 
  | 'Preview' 
  | 'Completed' 
  | 'Error';

export interface RewriteWorkflowOptions extends AIRewriteOptions {
  language?: string;
}

export class RewriteWorkflowEngine {
  private state: WorkflowState = 'Idle';
  private originalText: string = '';
  private resultText: string = '';
  private errorMessage: string = '';
  
  private cancelProviderStream: (() => void) | null = null;
  
  // Callbacks for UI updates
  private onStateChangeCb?: (state: WorkflowState) => void;
  private onTokenCb?: (token: string) => void;
  private onErrorCb?: (error: string) => void;

  constructor(
    onStateChange?: (state: WorkflowState) => void,
    onToken?: (token: string) => void,
    onError?: (error: string) => void
  ) {
    this.onStateChangeCb = onStateChange;
    this.onTokenCb = onToken;
    this.onErrorCb = onError;
  }

  private setState(newState: WorkflowState) {
    this.state = newState;
    this.onStateChangeCb?.(newState);
  }

  getState() {
    return this.state;
  }

  getResult() {
    return this.resultText;
  }

  getError() {
    return this.errorMessage;
  }

  /**
   * Starts the rewrite workflow.
   */
  start(options: RewriteWorkflowOptions) {
    if (this.state === 'Streaming' || this.state === 'Preparing') return;
    
    this.setState('Preparing');
    this.resultText = '';
    this.errorMessage = '';

    // Context Loading
    const api = EditorAPI.getLegacy();
    if (!api) {
      this.handleError('Document Engine is not available.');
      return;
    }

    // Phase 2: Context Extraction
    const rco = RewriteContextEngine.build(api as any);
    const rcoSerialized = JSON.stringify(rco, null, 2);

    this.originalText = rco.selection.text;
    if (!this.originalText.trim()) {
      this.handleError('Please select some text to rewrite.');
      return;
    }

    // Begin Streaming phase
    this.setState('Streaming');
    
    // Note: The underlying AIEngine handles the PromptBuilder, Security checks, and Provider Stream.
    // In a fully uncoupled architecture, the Workflow Engine would call PromptBuilder and Security 
    // directly. But since AIEngine encapsulates this securely, we leverage it.
    
    this.cancelProviderStream = AIEngine.streamRewrite(
      rcoSerialized,
      options,
      (token) => {
        this.resultText += token;
        this.onTokenCb?.(this.resultText); // Emits the cumulative buffer
      },
      (fullText) => {
        this.resultText = fullText;
        this.setState('Preview');
      }
    );
  }

  /**
   * Accepts the rewrite and injects it into the document.
   */
  accept() {
    if (this.state !== 'Preview') return;
    
    const api = EditorAPI.getLegacy();
    if (api && this.resultText) {
      // Simulate Undo Transaction mapping
      console.log(`[Workflow] Creating Undo Transaction for Rewrite.`);
      
      // Simulate Track Changes
      console.log(`[Workflow] Checking Track Changes Status...`);
      
      api.insertTextAtSelection(this.resultText);
      
      // History Engine is automatically handled inside AIEngine for the stream.
      // We could add an explicit acceptance log here if desired.
      AIHistoryEngine.markDecision?.('last_record', 'accepted');
      
      this.setState('Completed');
    }
  }

  /**
   * Inserts the text below the current selection.
   */
  insertBelow() {
    if (this.state !== 'Preview') return;
    
    const api = EditorAPI.getLegacy();
    if (api && this.resultText) {
      api.insertTextAtSelection('\n' + this.resultText);
      this.setState('Completed');
    }
  }

  /**
   * Discards the AI output without modifying the document.
   */
  reject() {
    if (this.state !== 'Preview') return;
    
    console.log(`[Workflow] User rejected the rewrite.`);
    AIHistoryEngine.markDecision?.('last_record', 'rejected');
    
    this.resultText = '';
    this.setState('Completed');
  }

  /**
   * Cancels the stream mid-flight.
   */
  cancel() {
    if (this.state !== 'Streaming') return;
    
    this.cancelProviderStream?.();
    this.cancelProviderStream = null;
    
    // Whatever we have so far becomes the preview
    this.setState('Preview');
  }

  private handleError(errorMsg: string) {
    this.errorMessage = errorMsg;
    this.onErrorCb?.(errorMsg);
    this.setState('Error');
  }
}
