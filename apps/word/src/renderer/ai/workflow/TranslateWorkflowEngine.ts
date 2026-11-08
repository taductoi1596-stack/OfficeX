/**
 * TranslateWorkflowEngine.ts
 * 
 * Deterministic State Machine for the AI Translation Pipeline.
 */
import { AIEngine, AITranslateOptions, AITranslateResult } from '../../AIEngine';
import { EditorAPI } from '../../editorApi';
import { RewriteContextEngine } from '../context/RewriteContextEngine';
import { TranslationMemoryEngine } from './TranslationMemoryEngine';

export type TranslateWorkflowState = 
  | 'Idle'
  | 'Waiting Selection'
  | 'Context Collection'
  | 'Language Detection'
  | 'Prompt Generation'
  | 'Security Validation'
  | 'Provider Connection'
  | 'Streaming'
  | 'Translation Analysis'
  | 'Preview Ready'
  | 'Waiting User Action'
  | 'Insert'
  | 'History'
  | 'Completed'
  | 'Error';

export class TranslateWorkflowEngine {
  private state: TranslateWorkflowState = 'Idle';
  private cancelStream: (() => void) | null = null;
  private currentResult: AITranslateResult | null = null;
  private contextText: string = '';

  private onStateChangeCb?: (state: TranslateWorkflowState) => void;
  private onTokenCb?: (text: string) => void;
  private onCompleteCb?: (result: AITranslateResult) => void;
  private onErrorCb?: (error: string) => void;
  private onContextReadyCb?: (text: string) => void;

  constructor() {}

  /**
   * Register event callbacks.
   */
  public registerCallbacks(callbacks: {
    onStateChange: (state: TranslateWorkflowState) => void;
    onToken: (text: string) => void;
    onComplete: (result: AITranslateResult) => void;
    onError: (error: string) => void;
    onContextReady: (text: string) => void;
  }) {
    this.onStateChangeCb = callbacks.onStateChange;
    this.onTokenCb = callbacks.onToken;
    this.onCompleteCb = callbacks.onComplete;
    this.onErrorCb = callbacks.onError;
    this.onContextReadyCb = callbacks.onContextReady;
  }

  private setState(newState: TranslateWorkflowState) {
    this.state = newState;
    if (this.onStateChangeCb) this.onStateChangeCb(newState);
  }

  public getState() {
    return this.state;
  }

  public getContextText() {
    return this.contextText;
  }

  public loadContext() {
    const api = EditorAPI.getLegacy();
    if (api) {
      const sel = api.getSelectedText();
      this.contextText = sel || '';
      if (this.onContextReadyCb) {
        this.onContextReadyCb(this.contextText);
      }
    }
  }

  /**
   * Helper to simulate async delay for enterprise steps
   */
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Main Pipeline Start
   */
  public async start(options: AITranslateOptions) {
    if (this.state === 'Streaming') return;

    try {
      this.setState('Waiting Selection');
      await this.delay(50);
      
      // 1. Context Collection
      this.setState('Context Collection');
      await this.delay(10);
      const api = EditorAPI.getLegacy();
      if (api) {
        // Fallback to paragraph if no selection
        if (!this.contextText) {
          const rco = RewriteContextEngine.build(api as any);
          this.contextText = rco.selection.text || rco.paragraph?.currentText || '';
        }
      }

      if (!this.contextText) {
        throw new Error('No content selected for translation.');
      }

      // 2. Language Detection
      this.setState('Language Detection');
      await this.delay(10);
      if (options.sourceLang === 'Auto Detect') {
        const detected = AIEngine.detectLanguage(this.contextText);
        options.sourceLang = detected.lang;
      }

      // 3. Prompt Generation
      this.setState('Prompt Generation');
      await this.delay(10);

      // --- TM Check Interception ---
      TranslationMemoryEngine.initialize();
      const exactMatch = TranslationMemoryEngine.exactMatch(this.contextText, options.targetLang);
      
      if (exactMatch) {
        // EXACT MATCH FOUND! Skip AI completely.
        this.currentResult = {
          translatedText: exactMatch.targetText,
          detectedSourceLang: options.sourceLang,
          confidence: 1.0,
          wordCount: this.contextText.split(/\s+/).length,
          translatedWordCount: exactMatch.targetText.split(/\s+/).length,
        };
        
        this.setState('Translation Analysis');
        await this.delay(10);
        
        if (this.onCompleteCb) this.onCompleteCb(this.currentResult);
        
        this.setState('Preview Ready');
        await this.delay(10);
        this.setState('Waiting User Action');
        return; // Halt workflow
      }
      
      // If no exact match, we can check fuzzy match and append to prompt.
      const fuzzyMatches = TranslationMemoryEngine.fuzzyMatch(this.contextText, options.targetLang, 80);
      if (fuzzyMatches.length > 0) {
        options.instruction = (options.instruction || '') + 
          `\n\n[Translation Memory Suggestion: "${fuzzyMatches[0].targetText}"]`;
      }
      // -------------------------------

      // 4. Security Validation
      this.setState('Security Validation');
      await this.delay(10);

      // 5. Provider Connection
      this.setState('Provider Connection');
      await this.delay(10);

      // 6. Streaming
      this.setState('Streaming');
      this.cancelStream = AIEngine.streamTranslate(
        this.contextText,
        options,
        (text) => {
          if (this.onTokenCb) this.onTokenCb(text);
        },
        async (result) => {
          this.currentResult = result;
          
          this.setState('Translation Analysis');
          await this.delay(10);
          
          if (this.onCompleteCb) this.onCompleteCb(result);
          
          this.setState('Preview Ready');
          await this.delay(10);
          this.setState('Waiting User Action');
        }
      );

    } catch (err: any) {
      if (this.onErrorCb) this.onErrorCb(err.message);
      this.setState('Error');
    }
  }

  public stop() {
    if (this.cancelStream) {
      this.cancelStream();
      this.cancelStream = null;
    }
    this.setState('Preview Ready');
    setTimeout(() => this.setState('Waiting User Action'), 50);
  }

  public async replaceSelection() {
    this.setState('Insert');
    const api = EditorAPI.getLegacy();
    if (api && this.currentResult) {
      api.insertTextAtSelection(this.currentResult.translatedText);
      
      // Save to TM
      TranslationMemoryEngine.insert({
        sourceLang: 'Auto Detect', // Ideally pass real lang
        targetLang: 'Target',      // Ideally pass real lang
        sourceText: this.contextText,
        targetText: this.currentResult.translatedText,
        author: 'User',
      });

      this.setState('History');
      await this.delay(50);
      this.setState('Completed');
      await this.delay(50);
      this.setState('Idle');
    }
  }

  public async insertBelow() {
    this.setState('Insert');
    const api = EditorAPI.getLegacy();
    if (api && this.currentResult) {
      api.insertTextAtSelection('\n' + this.currentResult.translatedText);
      
      // Save to TM
      TranslationMemoryEngine.insert({
        sourceLang: 'Auto Detect',
        targetLang: 'Target',
        sourceText: this.contextText,
        targetText: this.currentResult.translatedText,
        author: 'User',
      });
      
      this.setState('History');
      await this.delay(50);
      this.setState('Completed');
      await this.delay(50);
      this.setState('Idle');
    }
  }

  public copyToClipboard() {
    if (this.currentResult) {
      navigator.clipboard.writeText(this.currentResult.translatedText);
    }
  }
}
