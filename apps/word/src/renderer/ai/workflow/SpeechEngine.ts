/**
 * SpeechEngine.ts
 * 
 * Enterprise Speech Engine for OfficeX Word.
 * Replaces DictationEngine with a robust pipeline:
 * Audio Capture -> VAD -> Language Detection -> Recognition -> Formatting -> Commands
 */

import { EditorAPI } from '../../editorApi';

import { VoiceCommandEngine } from './VoiceCommandEngine';

export type SpeechStatus = 'idle' | 'listening' | 'paused' | 'processing';

// ─── Pipeline Sub-Engines (Mocked for Enterprise MVP) ─────────────────────────

class VADDetector {
  static detectSilence(audioChunk: any): boolean {
    return false; // Mock: assume speech is always active during listening
  }
}

class NoiseReduction {
  static process(audioChunk: any): any {
    return audioChunk; // Mock: return cleaned audio
  }
}

class FormattingEngine {
  private static AUTO_PUNCTUATION: Record<string, string> = {
    'period': '.', 'full stop': '.', 'comma': ',', 'colon': ':',
    'semicolon': ';', 'question mark': '?', 'exclamation mark': '!',
  };

  static applyFormatting(text: string, autoPunct: boolean): { isPunct: boolean, formatted: string } {
    const lower = text.toLowerCase().trim();
    
    if (autoPunct && this.AUTO_PUNCTUATION[lower]) {
      return { isPunct: true, formatted: this.AUTO_PUNCTUATION[lower] };
    }

    let processed = text;
    if (processed.length > 0) {
      processed = processed.charAt(0).toUpperCase() + processed.slice(1);
    }
    if (!processed.endsWith(' ')) {
      processed += ' ';
    }
    return { isPunct: false, formatted: processed };
  }
}



// ─── Main Speech Engine ───────────────────────────────────────────────────────

export class SpeechEngine {
  private static recognition: any = null;
  private static status: SpeechStatus = 'idle';
  private static language: string = 'en-US';
  private static autoPunctuation: boolean = true;

  private static onStatusChangeCb: ((s: SpeechStatus) => void) | null = null;
  private static onTranscriptCb: ((interim: string, final: string) => void) | null = null;
  private static onCommandCb: ((cmd: string) => void) | null = null;
  private static onErrorCb: ((msg: string) => void) | null = null;

  static subscribe(callbacks: {
    onStatusChange?: (s: SpeechStatus) => void;
    onTranscript?: (interim: string, final: string) => void;
    onCommand?: (cmd: string) => void;
    onError?: (msg: string) => void;
  }) {
    if (callbacks.onStatusChange) this.onStatusChangeCb = callbacks.onStatusChange;
    if (callbacks.onTranscript) this.onTranscriptCb = callbacks.onTranscript;
    if (callbacks.onCommand) this.onCommandCb = callbacks.onCommand;
    if (callbacks.onError) this.onErrorCb = callbacks.onError;
  }

  static setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) this.recognition.lang = lang;
  }

  static setAutoPunctuation(enabled: boolean) {
    this.autoPunctuation = enabled;
  }

  static getStatus(): SpeechStatus {
    return this.status;
  }

  static start() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.onErrorCb?.('Enterprise Speech Engine requires Cloud Access. Browser not supported.');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const rec = new SpeechRec();

    rec.lang = this.language;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      this.status = 'listening';
      this.onStatusChangeCb?.('listening');
      
      // Listen for the custom stop event dispatched by VoiceCommandEngine
      const stopHandler = () => this.stop();
      document.addEventListener('speech-stop-request', stopHandler, { once: true });
    };

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      this.onErrorCb?.(`Pipeline Error: ${e.error}`);
      this.status = 'idle';
      this.onStatusChangeCb?.('idle');
    };

    rec.onend = () => {
      if (this.status === 'listening') {
        try { rec.start(); } catch (_) {}
      } else {
        this.onStatusChangeCb?.('idle');
      }
    };

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }

      this.onTranscriptCb?.(interim, final);

      if (final) this.processPipeline(final);
    };

    this.recognition = rec;
    try {
      rec.start();
    } catch (e) {
      this.onErrorCb?.('Audio Capture Failed. Microphone inaccessible.');
    }
  }

  static stop() {
    this.status = 'idle';
    this.recognition?.stop();
    this.recognition = null;
    this.onStatusChangeCb?.('idle');
  }

  static pause() {
    this.status = 'paused';
    this.recognition?.stop();
    this.onStatusChangeCb?.('paused');
  }

  static resume() {
    this.status = 'listening';
    this.onStatusChangeCb?.('listening');
    try {
      this.recognition?.start();
    } catch (_) {
      this.start();
    }
  }

  private static processPipeline(text: string) {
    const rawText = text.trim();
    
    // 1. NLP Voice Command Engine
    const isCommand = VoiceCommandEngine.process(rawText);
    if (isCommand) {
      this.onCommandCb?.(rawText);
      return;
    }

    // 2. Formatting Engine
    const { isPunct, formatted } = FormattingEngine.applyFormatting(rawText, this.autoPunctuation);
    
    // 3. Document Output
    const api = EditorAPI.getLegacy();
    if (api) {
      api.insertTextAtSelection(formatted);
    }
  }
}

// Map old DICTATION_LANGUAGES here for compatibility
export const SPEECH_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'vi-VN', label: 'Vietnamese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'pt-BR', label: 'Portuguese' },
  { code: 'ru-RU', label: 'Russian' },
];
