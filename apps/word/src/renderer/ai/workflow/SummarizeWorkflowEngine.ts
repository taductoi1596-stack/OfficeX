/**
 * SummarizeWorkflowEngine.ts
 *
 * Deterministic state machine managing the lifecycle of an AI Summarize operation.
 * Binds UI, Document API, AI Engine, Context Engine, and History together.
 */

import { EditorAPI } from '../../editorApi';
import { AIEngine, AISummarizeOptions, CoverageAnalysis } from '../../AIEngine';
import { RewriteContextEngine } from '../context/RewriteContextEngine';
import { AIHistoryEngine } from '../history/AIHistoryEngine';

export type SummarizeWorkflowState = 
  | 'Idle' 
  | 'Waiting Selection' 
  | 'Preparing Context' 
  | 'Building Prompt' 
  | 'Security Validation' 
  | 'Provider Connection' 
  | 'Streaming' 
  | 'Summary Analysis' 
  | 'Preview Ready' 
  | 'Waiting User Action' 
  | 'Completed' 
  | 'Error';

export interface SummarizeWorkflowOptions extends AISummarizeOptions {
  scope: 'Selection' | 'Paragraph' | 'Section' | 'Document';
}

import { SummaryAnalyzer, SummaryInsights } from './SummaryAnalyzer';

export class SummarizeWorkflowEngine {
  private state: SummarizeWorkflowState = 'Idle';
  private originalText: string = '';
  private resultText: string = '';
  private errorMessage: string = '';
  private coverage: CoverageAnalysis | null = null;
  private insights: SummaryInsights | null = null;
  
  private cancelProviderStream: (() => void) | null = null;
  
  // Callbacks for UI updates
  private onStateChangeCb?: (state: SummarizeWorkflowState) => void;
  private onTokenCb?: (token: string) => void;
  private onCompleteCb?: (fullText: string, coverage: CoverageAnalysis) => void;
  private onErrorCb?: (error: string) => void;

  constructor(
    onStateChange?: (state: SummarizeWorkflowState) => void,
    onToken?: (token: string) => void,
    onComplete?: (fullText: string, coverage: CoverageAnalysis) => void,
    onError?: (error: string) => void
  ) {
    this.onStateChangeCb = onStateChange;
    this.onTokenCb = onToken;
    this.onCompleteCb = onComplete;
    this.onErrorCb = onError;
  }

  private setState(newState: SummarizeWorkflowState) {
    this.state = newState;
    this.onStateChangeCb?.(newState);
  }

  getState() {
    return this.state;
  }

  getResult() {
    return this.resultText;
  }

  getCoverage() {
    return this.coverage;
  }

  getInsights() {
    return this.insights;
  }

  getError() {
    return this.errorMessage;
  }

  /**
   * Starts the summarize workflow pipeline asynchronously.
   */
  async start(options: SummarizeWorkflowOptions) {
    if (this.state === 'Streaming' || this.state === 'Preparing Context') return;
    
    this.resultText = '';
    this.errorMessage = '';
    this.coverage = null;
    this.insights = null;

    // 1. Context Loading
    this.setState('Preparing Context');
    const api = EditorAPI.getLegacy();
    if (!api) {
      this.handleError('Document Engine is not available.');
      return;
    }
    await this.delay(100);

    let targetText = '';
    if (options.scope === 'Selection') {
      const rco = RewriteContextEngine.build(api);
      targetText = rco.selection.text;
    } else if (options.scope === 'Document') {
      targetText = api.getFullDocumentText();
    } else if (options.scope === 'Paragraph') {
      targetText = (api as any).getPreviousParagraph?.() || ''; 
    }

    if (!targetText.trim()) {
      if (options.scope === 'Selection') {
          targetText = api.getFullDocumentText();
      } else {
          this.setState('Waiting Selection');
          this.handleError('No content available for summarization.');
          return;
      }
    }
    this.originalText = targetText;

    // 2. Building Prompt
    this.setState('Building Prompt');
    await this.delay(100);

    // 3. Security Validation
    this.setState('Security Validation');
    // Simulate DLP and Permission checks
    await this.delay(150);

    // 4. Provider Connection
    this.setState('Provider Connection');
    await this.delay(150);

    // 5. Begin Streaming phase
    this.setState('Streaming');
    
    this.cancelProviderStream = AIEngine.streamSummarize(
      this.originalText,
      options,
      (token) => {
        this.resultText += token;
        this.onTokenCb?.(this.resultText);
      },
      async (fullText, cov) => {
        this.resultText = fullText;
        this.coverage = cov;
        
        // 6. Summary Analysis
        this.setState('Summary Analysis');
        await this.delay(200);
        this.insights = SummaryAnalyzer.analyze(fullText);

        // 7. Preview Ready
        this.setState('Preview Ready');
        this.onCompleteCb?.(fullText, cov);
        
        // 8. Waiting User Action
        this.setState('Waiting User Action');
      }
    );
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Replaces selection with summary.
   */
  replaceSelection() {
    if (this.state !== 'Waiting User Action') return;
    
    const api = EditorAPI.getLegacy();
    if (api && this.resultText) {
      api.insertTextAtSelection(this.resultText);
      AIHistoryEngine.markDecision?.('last_record', 'accepted');
      this.setState('Completed');
    }
  }

  /**
   * Inserts the text below the current selection.
   */
  insertBelow() {
    if (this.state !== 'Waiting User Action') return;
    
    const api = EditorAPI.getLegacy();
    if (api && this.resultText) {
      api.insertTextAtSelection('\n\n' + this.resultText + '\n');
      AIHistoryEngine.markDecision?.('last_record', 'accepted');
      this.setState('Completed');
    }
  }

  /**
   * Discards the AI output.
   */
  reject() {
    if (this.state !== 'Waiting User Action') return;
    
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
    this.setState('Preview Ready');
    this.setState('Waiting User Action');
  }

  private handleError(errorMsg: string) {
    this.errorMessage = errorMsg;
    this.onErrorCb?.(errorMsg);
    this.setState('Error');
  }
}
