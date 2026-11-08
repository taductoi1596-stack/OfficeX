/**
 * VoiceCommandEngine.ts
 * 
 * NLP/Intent Routing Engine for Enterprise Voice Commands.
 * Parses spoken text, extracts parameters, handles chaining, and dispatches to the global CommandDispatcher.
 */

import { CommandDispatcher } from '../../CommandDispatcher';
import { EditorAPI } from '../../editorApi';

export interface ParsedIntent {
  commandId: string;
  parameters?: Record<string, any>;
  originalText: string;
}

export class VoiceCommandEngine {
  
  /**
   * Word to Number conversion map for extracting parameters like "font size fourteen".
   */
  private static numMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 
    'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18,
    'nineteen': 19, 'twenty': 20, 'twenty four': 24, 'thirty six': 36, 'forty eight': 48,
    '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10,
    '11':11, '12':12, '14':14, '16':16, '18':18, '24':24, '36':36, '48':48,
  };

  /**
   * The Regex Intent Map.
   * Maps spoken patterns to OfficeX global Command IDs.
   */
  private static intentMap: Array<{ pattern: RegExp; commandId: string; extractParams?: (match: RegExpMatchArray) => Record<string, any> }> = [
    // --- Editing ---
    { pattern: /^(delete that|remove that|delete last word)$/i, commandId: 'WORD.HOME.DELETE.WORD' },
    { pattern: /^(undo|undo that)$/i, commandId: 'WORD.HOME.UNDO' },
    { pattern: /^(redo|redo that)$/i, commandId: 'WORD.HOME.REDO' },
    { pattern: /^(copy|copy that)$/i, commandId: 'WORD.HOME.COPY' },
    { pattern: /^(cut|cut that)$/i, commandId: 'WORD.HOME.CUT' },
    { pattern: /^(paste|paste that)$/i, commandId: 'WORD.HOME.PASTE' },
    { pattern: /^(select all)$/i, commandId: 'WORD.HOME.SELECT.ALL' },
    { pattern: /^(new line|next line)$/i, commandId: 'WORD.HOME.NEW_LINE' },
    { pattern: /^(new paragraph|next paragraph)$/i, commandId: 'WORD.HOME.NEW_PARAGRAPH' },

    // --- Formatting ---
    { pattern: /^(bold that|make bold|bold)$/i, commandId: 'WORD.HOME.FONT.BOLD' },
    { pattern: /^(italic that|make italic|italic)$/i, commandId: 'WORD.HOME.FONT.ITALIC' },
    { pattern: /^(underline that|make underline|underline)$/i, commandId: 'WORD.HOME.FONT.UNDERLINE' },
    { pattern: /^(strikethrough)$/i, commandId: 'WORD.HOME.FONT.STRIKETHROUGH' },
    { pattern: /^(align left|left align)$/i, commandId: 'WORD.HOME.PARAGRAPH.ALIGN_LEFT' },
    { pattern: /^(align center|center align|center that)$/i, commandId: 'WORD.HOME.PARAGRAPH.ALIGN_CENTER' },
    { pattern: /^(align right|right align)$/i, commandId: 'WORD.HOME.PARAGRAPH.ALIGN_RIGHT' },
    { pattern: /^(justify)$/i, commandId: 'WORD.HOME.PARAGRAPH.JUSTIFY' },

    // --- Parameterized Commands ---
    { 
      pattern: /^(font size|set font size|size) (\w+|\d+)$/i, 
      commandId: 'WORD.HOME.FONT.SIZE',
      extractParams: (m) => ({ size: VoiceCommandEngine.parseNumber(m[2]) || 12 })
    },
    {
      pattern: /^(insert table) (\w+|\d+) by (\w+|\d+)$/i,
      commandId: 'WORD.INSERT.TABLE',
      extractParams: (m) => ({ rows: VoiceCommandEngine.parseNumber(m[2]) || 3, cols: VoiceCommandEngine.parseNumber(m[3]) || 3 })
    },

    // --- AI Subsystems ---
    { pattern: /^(summarize|summarize this|summarize that)$/i, commandId: 'WORD.AI.SUMMARIZE' },
    { pattern: /^(rewrite|rewrite this|rewrite that)$/i, commandId: 'WORD.AI.REWRITE' },
    { pattern: /^(translate|translate this|translate that)$/i, commandId: 'WORD.AI.TRANSLATE' },
    { pattern: /^(open chat|ask ai|chat with ai)$/i, commandId: 'WORD.AI.CHAT.OPEN' },
    { pattern: /^(stop dictation|stop listening)$/i, commandId: 'WORD.SPEECH.STOP' },
  ];

  /**
   * Evaluates if the text contains a voice command, processes chains, and dispatches them.
   * Returns true if at least one command was executed.
   */
  public static process(text: string): boolean {
    const raw = text.trim();
    if (!raw) return false;

    // Chaining support: split by " and " or " then "
    const fragments = raw.split(/\b(and|then)\b/i).map(f => f.trim()).filter(f => f && !['and', 'then'].includes(f.toLowerCase()));
    
    let executedAny = false;

    for (const fragment of fragments) {
      const intent = this.parseIntent(fragment);
      if (intent) {
        executedAny = true;
        this.executeIntent(intent);
      } else if (fragments.length === 1) {
        // If it's a single phrase and not a command, we don't execute anything
        return false;
      }
    }

    return executedAny;
  }

  /**
   * Maps a string fragment to a ParsedIntent using regex patterns.
   */
  private static parseIntent(phrase: string): ParsedIntent | null {
    const cleanPhrase = phrase.replace(/[.,!?]$/, '').trim(); // Remove trailing punctuation
    for (const { pattern, commandId, extractParams } of this.intentMap) {
      const match = cleanPhrase.match(pattern);
      if (match) {
        return {
          commandId,
          parameters: extractParams ? extractParams(match) : undefined,
          originalText: cleanPhrase
        };
      }
    }
    return null;
  }

  /**
   * Dispatches the parsed intent to the system or falls back to EditorAPI.
   */
  private static executeIntent(intent: ParsedIntent) {
    console.log(`[VoiceCommandEngine] Executing Intent: ${intent.commandId}`, intent.parameters);
    
    // Some commands like WORD.HOME.DELETE.WORD are not natively in the Dispatcher for simplicity,
    // so we handle core editor manipulation directly as a fallback.
    const api = EditorAPI.getLegacy();
    if (intent.commandId === 'WORD.HOME.DELETE.WORD') {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', ctrlKey: true, bubbles: true }));
      return;
    }
    if (intent.commandId === 'WORD.HOME.NEW_LINE') {
      api?.insertTextAtSelection('\n');
      return;
    }
    if (intent.commandId === 'WORD.HOME.NEW_PARAGRAPH') {
      api?.insertTextAtSelection('\n\n');
      return;
    }
    if (intent.commandId === 'WORD.SPEECH.STOP') {
      document.dispatchEvent(new CustomEvent('speech-stop-request'));
      return;
    }

    // Default: dispatch to the global event bus
    CommandDispatcher.dispatch(intent.commandId, intent.parameters);
  }

  /**
   * Helper to convert spoken numbers into integers.
   */
  private static parseNumber(word: string): number | null {
    const w = word.toLowerCase();
    return this.numMap[w] !== undefined ? this.numMap[w] : null;
  }
}
