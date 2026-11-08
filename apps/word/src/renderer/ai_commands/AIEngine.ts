import { AIProviderManager } from '../ai/AIProviderManager';
import { EditorAPI } from '../editorApi';
import { CommandDispatcher } from '../CommandDispatcher';

/**
 * AIEngine
 * 
 * Manages all global AI integrations: Chat, Generation, Translation, Agents, Memory, Vision.
 * Connects to Context Engine, Prompt Engine, AI Gateway, Document Engine.
 */
class AIEngineImpl {
  private events: Record<string, Function[]> = {};
  private activeStreamCancel: (() => void) | null = null;

  initialize() {
    console.log('[AIEngine] Initialized Local AI Engine (Qwen3 8B)');
  }

  dispose() {
    this.events = {};
  }

  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, payload?: any) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(payload));
    }
  }

  Panel(action: string) {
    import('../AIPanelManager').then(({ AIPanelManager }) => {
      const panelId = action === 'rewrite' ? 'rewrite' : action === 'summarize' ? 'summarize' : action === 'translate' ? 'translate' : 'chat';
      AIPanelManager.openPanel(panelId);
    });
  }

  Chat(action: string) {
    console.log('[AIEngine] Chat', action);
  }

  // ─── STREAMING INFERENCE ──────────────────────────────────────────────────

  private async executeStream(systemPrompt: string, promptPrefix: string) {
    if (this.activeStreamCancel) {
      this.activeStreamCancel();
    }

    const editor = EditorAPI.getLegacy();
    if (!editor) return;

    const selection = editor.getSelectedText();
    const paragraph = editor.getCurrentParagraph();
    
    // Provide intelligent context fallback
    let targetText = selection.trim().length > 0 ? selection : paragraph;
    
    // For Generate commands, if there is no text, we can use a generic instruction prompt or prompt dialog.
    // For now we will pass whatever the user has highlighted.
    
    const prompt = `${promptPrefix}\n\n${targetText}`;
    
    // Insert a newline to separate the AI's response if there's no selection
    if (selection.trim().length === 0) {
      editor.insertTextAtSelection('\n');
    }

    this.activeStreamCancel = AIProviderManager.streamChat(
      'ollama',
      'qwen3:8b', // Enforced Local Model
      prompt,
      systemPrompt,
      { operation: 'rewrite', temperature: 0.2 },
      (token) => {
        // Stream token directly into Canvas
        editor.insertTextAtSelection(token);
      },
      (fullText) => {
        this.activeStreamCancel = null;
        console.log('[AIEngine] Finished streaming generation.');
      },
      (error) => {
        this.activeStreamCancel = null;
        console.error('[AIEngine] Stream Error', error);
      }
    );
  }

  // ─── COMMAND HANDLERS ───────────────────────────────────────────────────

  Generate(action: string) {
    if (action === 'dialog') {
      CommandDispatcher.dispatch('WORD.AI.COPILOT.OPEN');
      return;
    }
    let prefix = 'Generate content based on the following context. Be detailed and well structured.';
    if (action === 'paragraph') prefix = 'Write a comprehensive paragraph about the following topic:';
    if (action === 'article') prefix = 'Write a full article based on this outline:';
    if (action === 'report') prefix = 'Write a formal report based on these details:';
    if (action === 'resume') prefix = 'Format the following information into a professional resume:';
    if (action === 'contract') prefix = 'Draft a formal contract based on these terms:';
    if (action === 'proposal') prefix = 'Create a business proposal for the following:';
    if (action === 'email') prefix = 'Write an email addressing the following points:';
    if (action === 'meeting') prefix = 'Create structured meeting notes and action items from this text:';
    if (action === 'checklist') prefix = 'Create a bulleted checklist from this text:';
    if (action === 'table') prefix = 'Create a markdown table organizing this data:';
    if (action === 'timeline') prefix = 'Generate a project timeline based on this input:';
    if (action === 'smartart') prefix = 'Generate a structured hierarchy (bulleted list) suitable for SmartArt conversion:';
    if (action === 'flowchart') prefix = 'Generate a mermaid.js flowchart for this process:';
    if (action === 'diagram') prefix = 'Generate a plantUML or mermaid diagram explaining this architecture:';
    if (action === 'code') prefix = 'Generate code for the following request:';
    if (action === 'formula') prefix = 'Generate an Excel formula for this calculation:';
    if (action === 'imageprompt') prefix = 'Create a highly detailed Midjourney image prompt based on this text:';
    if (action === 'caption') prefix = 'Write a short caption for the following context:';
    if (action === 'references') prefix = 'Generate academic references for the following topics in APA format:';
    if (action === 'bibliography') prefix = 'Create a bibliography from the following citations:';

    this.executeStream(
      'You are OfficeX Copilot. You generate professional document content.',
      prefix
    );
  }

  Rewrite(action: string) {
    if (action === 'dialog') {
      return this.executeStream('You are OfficeX Copilot, an expert editor.', 'Rewrite this text to improve clarity, flow, and professionalism. Text to rewrite:');
    }
    let prefix = 'Rewrite the following text:';
    if (action === 'professional') prefix = 'Rewrite the following text in a highly professional, business-appropriate tone:';
    if (action === 'academic') prefix = 'Rewrite the following text in an academic, scholarly tone using formal vocabulary:';
    if (action === 'friendly') prefix = 'Rewrite the following text in a warm, friendly, and conversational tone:';
    if (action === 'business') prefix = 'Rewrite the following text in a formal business tone:';
    if (action === 'technical') prefix = 'Rewrite the following text in a precise, technical tone:';
    if (action === 'formal') prefix = 'Rewrite the following text strictly formally:';
    if (action === 'casual') prefix = 'Rewrite the following text casually, like talking to a friend:';
    if (action === 'simplify') prefix = 'Simplify the following text so anyone can easily understand it:';
    if (action === 'expand') prefix = 'Expand the following text, adding more detail and elaboration:';
    if (action === 'shorten') prefix = 'Condense and shorten the following text while keeping the main points:';
    if (action === 'improve_writing') prefix = 'Improve the general writing, syntax, and flow of the following text:';
    if (action === 'fix_grammar') prefix = 'Fix all grammar, spelling, and punctuation errors in the following text without changing its meaning:';
    if (action === 'improve_tone') prefix = 'Make the tone of the following text more consistent and appropriate:';
    if (action === 'improve_readability') prefix = 'Improve the readability of the following text by splitting long sentences:';
    if (action === 'fix_punctuation') prefix = 'Fix only punctuation errors in this text:';

    this.executeStream(
      'You are OfficeX Copilot, an expert editor and copywriter.',
      prefix
    );
  }

  Summarize(action: string) {
    if (action === 'dialog') {
      return this.executeStream('You are OfficeX Copilot, an expert analyst.', 'Provide a clear and concise summary of the following text. Text:');
    }
    let prefix = 'Summarize the following text:';
    if (action === 'short') prefix = 'Provide a one-sentence summary of the following text:';
    if (action === 'detailed') prefix = 'Provide a detailed, multi-paragraph summary of the following text:';
    if (action === 'executive') prefix = 'Write a formal Executive Summary for the following document text:';
    if (action === 'bullet') prefix = 'Summarize the following text into bullet points:';
    if (action === 'key_points') prefix = 'Extract the key takeaways and important points from the following text:';
    if (action === 'one_sentence') prefix = 'Summarize the following text in exactly one short sentence:';

    this.executeStream(
      'You are OfficeX Copilot, an expert analyst.',
      prefix
    );
  }

  Translate(action: string) {
    if (action === 'dialog') {
      CommandDispatcher.dispatch('WORD.AI.COPILOT.OPEN');
      return;
    }
    let prefix = `Translate the following text into ${action.toUpperCase()}:`;
    if (action === 'auto') prefix = 'Identify the language and translate the text to English (if not English) or to the most logical target language:';
    if (action === 'en') prefix = 'Translate to English:';
    if (action === 'vi') prefix = 'Translate to Vietnamese:';
    if (action === 'zh') prefix = 'Translate to Chinese:';
    if (action === 'ja') prefix = 'Translate to Japanese:';
    if (action === 'ko') prefix = 'Translate to Korean:';
    if (action === 'fr') prefix = 'Translate to French:';
    if (action === 'de') prefix = 'Translate to German:';
    if (action === 'es') prefix = 'Translate to Spanish:';
    if (action === 'ru') prefix = 'Translate to Russian:';
    if (action === 'th') prefix = 'Translate to Thai:';

    this.executeStream(
      'You are OfficeX Copilot, a professional translator. Output ONLY the translated text, no explanations.',
      prefix
    );
  }

  Explain(action: string) {
    this.executeStream('You are OfficeX Copilot, a helpful tutor.', 'Explain this:');
  }

  Review(action: string) {
    this.executeStream('You are OfficeX Copilot, a meticulous reviewer.', 'Review this text for issues:');
  }
}

export const AIEngine = new AIEngineImpl();
