import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TranslateWorkflowEngine, TranslateWorkflowState } from './ai/workflow/TranslateWorkflowEngine';

const LANGUAGES = [
  'Auto Detect',
  'English', 'Vietnamese', 'Chinese', 'Japanese', 'Korean',
  'French', 'German', 'Spanish', 'Italian', 'Portuguese',
  'Russian', 'Arabic', 'Thai', 'Dutch', 'Polish',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek',
  'Hebrew', 'Turkish', 'Hindi', 'Indonesian', 'Malay',
  'Czech', 'Hungarian', 'Romanian', 'Ukrainian', 'Slovak',
];

const MODES = [
  'Natural Translation', 'Literal Translation', 'Professional',
  'Business', 'Academic', 'Legal', 'Medical', 'Technical',
  'Marketing', 'Software', 'Documentation',
];

const DOMAINS = [
  'General', 'IT / Software', 'Engineering', 'Medical', 'Legal',
  'Finance', 'Education', 'Government', 'Marketing', 'Manufacturing',
];

type TranslationHistory = {
  id: number;
  srcLang: string;
  tgtLang: string;
  original: string;
  translated: string;
  timestamp: string;
};

export function AITranslatePane({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  const [contextText, setContextText] = useState('');
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('Vietnamese');
  const [mode, setMode] = useState('Natural Translation');
  const [tone, setTone] = useState('Professional');
  const [domain, setDomain] = useState('General');
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [instruction, setInstruction] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [detectedLang, setDetectedLang] = useState('');
  const [activeView, setActiveView] = useState<'split' | 'translated' | 'history'>('split');
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [nextHistId, setNextHistId] = useState(1);
  const [workflowState, setWorkflowState] = useState<TranslateWorkflowState>('Idle');

  const resultRef = useRef<HTMLDivElement>(null);

  // Engine instantiation
  const engine = useMemo(() => new TranslateWorkflowEngine(), []);

  useEffect(() => {
    engine.registerCallbacks({
      onStateChange: (st) => {
        setWorkflowState(st);
        setIsGenerating(
          st === 'Waiting Selection' || 
          st === 'Context Collection' || 
          st === 'Language Detection' || 
          st === 'Prompt Generation' || 
          st === 'Security Validation' || 
          st === 'Provider Connection' || 
          st === 'Streaming' ||
          st === 'Translation Analysis'
        );
      },
      onToken: (text) => setResultText(text),
      onComplete: (res) => {
        setResult(res);
        setResultText(res.translatedText);
        setDetectedLang(res.detectedSourceLang);
        setNextHistId(prev => {
          const newId = prev + 1;
          setHistory(h => [{
            id: newId,
            srcLang: res.detectedSourceLang,
            tgtLang: targetLang,
            original: engine.getContextText().substring(0, 100),
            translated: res.translatedText.substring(0, 100),
            timestamp: new Date().toLocaleTimeString(),
          }, ...h].slice(0, 10));
          return newId;
        });
      },
      onError: (err) => setResultText(`[Error: ${err}]`),
      onContextReady: (text) => setContextText(text)
    });
    
    // Auto load context and detect language on mount
    engine.loadContext();
    const sel = engine.getContextText();
    if (sel && sourceLang === 'Auto Detect') {
       // We can detect language if there is context
    }
  }, [engine, sourceLang, targetLang]);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [resultText]);

  const handleSwapLanguages = () => {
    if (sourceLang !== 'Auto Detect') {
      const prev = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prev);
    }
  };

  const handleTranslate = () => {
    if (isGenerating) return;
    setResultText('');
    setResult(null);
    setActiveView('split');

    engine.start({
      sourceLang, targetLang, mode, tone, domain,
      preserveFormatting, instruction,
    });
  };

  const handleStop = () => {
    engine.stop();
  };

  const handleReplace = () => {
    engine.replaceSelection();
    onClose();
  };

  const handleInsertBelow = () => {
    engine.insertBelow();
    onClose();
  };

  const tabCls = (t: string) =>
    `px-3 py-1 text-[11px] cursor-pointer border-b-2 transition-colors ${
      activeView === t
        ? 'border-[#2B579A] text-[#2B579A] font-semibold'
        : 'border-transparent text-slate-500 hover:text-slate-700'}`;

  const confidencePct = result ? Math.round(result.confidence * 100) : null;

  return (
    <div className={embedded ? "flex-1 flex flex-col font-segoe text-[12px] select-none h-full bg-white" : "absolute right-0 top-[110px] w-[400px] bottom-0 bg-white border-l border-[#E1DFDD] shadow-xl flex flex-col font-segoe text-[12px] z-[150] select-none"}>

      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E1DFDD]">
          <div className="font-semibold flex items-center gap-2 text-[#2B579A] text-[13px]">
            <span>🌐</span> AI Translate
          </div>
          <button onClick={onClose} className="w-6 h-6 hover:bg-[#F3F2F1] flex items-center justify-center rounded text-slate-500">✕</button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

        {/* Language Selector Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase text-slate-500">Source</label>
            <select
              className="w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={sourceLang} onChange={e => setSourceLang(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
            {detectedLang && sourceLang === 'Auto Detect' && (
              <div className="text-[10px] text-[#107C41]">🔍 Detected: {detectedLang}</div>
            )}
          </div>

          {/* Swap button */}
          <button
            onClick={handleSwapLanguages}
            className="mt-4 w-8 h-8 flex items-center justify-center border border-[#E1DFDD] rounded hover:bg-[#F3F2F1] hover:border-[#2B579A] transition-colors text-slate-600"
            title="Swap languages"
          >⇄</button>

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase text-slate-500">Target</label>
            <select
              className="w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={targetLang} onChange={e => setTargetLang(e.target.value)}
            >
              {LANGUAGES.filter(l => l !== 'Auto Detect').map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Mode & Domain */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Mode</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={mode} onChange={e => setMode(e.target.value)}>
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Domain</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={domain} onChange={e => setDomain(e.target.value)}>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tone + Preserve Formatting */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-slate-500">Tone</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={tone} onChange={e => setTone(e.target.value)}>
              {['Neutral', 'Formal', 'Professional', 'Friendly', 'Casual', 'Academic', 'Technical'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-1.5 mt-4 cursor-pointer text-[11px] text-slate-600">
            <input type="checkbox" checked={preserveFormatting} onChange={e => setPreserveFormatting(e.target.checked)}
              className="accent-[#2B579A] w-3.5 h-3.5" />
            Preserve Formatting
          </label>
        </div>

        {/* Custom Instruction */}
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">Instructions</label>
          <textarea
            className="mt-1 w-full p-2 border border-[#E1DFDD] rounded h-[44px] resize-none focus:border-[#2B579A] focus:outline-none"
            placeholder="e.g. Keep all proper nouns in English..."
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
          />
        </div>

        {/* Translate Button */}
        <div className="flex gap-2">
          {!isGenerating ? (
            <button onClick={handleTranslate}
              className="flex-1 py-1.5 bg-[#2B579A] text-white font-semibold rounded hover:bg-[#1A365D] flex items-center justify-center gap-1">
              <span>🌐</span> Translate
            </button>
          ) : (
            <button onClick={handleStop}
              className="flex-1 py-1.5 bg-[#C50F1F] text-white font-semibold rounded hover:bg-[#8B0000]">
              ⏹ Stop
            </button>
          )}
          {result && !isGenerating && (
            <button onClick={handleTranslate}
              className="px-3 py-1.5 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4] text-slate-700" title="Retry">
              ↻
            </button>
          )}
        </div>

        {/* Results area */}
        {resultText && (
          <div>
            {/* Stats bar */}
            {result && (
              <div className="flex gap-2 mb-2">
                <div className="flex-1 p-1.5 bg-[#F0F4F8] rounded border border-[#E1DFDD] text-center">
                  <div className="text-[14px] font-bold text-[#2B579A]">{confidencePct}%</div>
                  <div className="text-[9px] text-slate-500 uppercase">Detect Confidence</div>
                </div>
                <div className="flex-1 p-1.5 bg-[#F0F4F8] rounded border border-[#E1DFDD] text-center">
                  <div className="text-[14px] font-bold text-[#107C41]">{result.wordCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Source Words</div>
                </div>
                <div className="flex-1 p-1.5 bg-[#F0F4F8] rounded border border-[#E1DFDD] text-center">
                  <div className="text-[14px] font-bold text-[#8764B8]">{result.translatedWordCount}</div>
                  <div className="text-[9px] text-slate-500 uppercase">Trans. Words</div>
                </div>
              </div>
            )}

            {/* View Tabs */}
            <div className="flex border-b border-[#E1DFDD] mb-2">
              <button className={tabCls('split')} onClick={() => setActiveView('split')}>Side by Side</button>
              <button className={tabCls('translated')} onClick={() => setActiveView('translated')}>Translation</button>
              <button className={tabCls('history')} onClick={() => setActiveView('history')}>History</button>
            </div>

            {activeView === 'split' && (
              <div className="flex gap-1 h-[200px]">
                {/* Source */}
                <div className="flex-1 flex flex-col">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    {result?.detectedSourceLang ?? sourceLang}
                  </div>
                  <div className="flex-1 p-2 border border-[#E1DFDD] rounded bg-[#F9F9F9] overflow-y-auto text-[11px] whitespace-pre-wrap text-slate-600">
                    {contextText || <span className="italic text-slate-400">No source text</span>}
                  </div>
                </div>
                {/* Translated */}
                <div className="flex-1 flex flex-col">
                    <div className="text-[10px] font-semibold text-[#2B579A] uppercase mb-1 flex items-center justify-between">
                      <span>{targetLang}</span>
                      {workflowState !== 'Idle' && workflowState !== 'Preview Ready' && (
                        <span className="text-slate-500 lowercase font-normal italic">{workflowState}...</span>
                      )}
                    </div>
                    <div
                      ref={resultRef}
                      className="flex-1 p-2 border border-[#2B579A] rounded bg-[#F4F8FA] overflow-y-auto text-[11px] whitespace-pre-wrap shadow-inner"
                    >
                      {resultText}
                      {workflowState === 'Streaming' && <span className="animate-pulse text-[#2B579A]">▋</span>}
                    </div>
                </div>
              </div>
            )}

            {activeView === 'translated' && (
              <div
                ref={resultRef}
                className="p-3 border border-[#2B579A] rounded bg-[#F4F8FA] h-[200px] overflow-y-auto text-[12px] whitespace-pre-wrap shadow-inner"
              >
                {resultText}
                {isGenerating && <span className="animate-pulse text-[#2B579A]">▋</span>}
              </div>
            )}

            {activeView === 'history' && (
              <div className="flex flex-col gap-2 h-[200px] overflow-y-auto">
                {history.length === 0 && <div className="text-slate-400 italic text-center py-4">No history</div>}
                {history.map(h => (
                  <div key={h.id}
                    className="border border-[#E1DFDD] rounded p-2 bg-[#F9F9F9] cursor-pointer hover:border-[#2B579A]"
                    onClick={() => { setResultText(h.translated); setActiveView('translated'); }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-[#2B579A] text-[11px]">{h.srcLang} → {h.tgtLang}</span>
                      <span className="text-slate-400 text-[10px]">{h.timestamp}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] truncate">{h.translated}...</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            {!isGenerating && result && (
              <div className="mt-2 flex flex-col gap-1.5">
                <button onClick={handleReplace}
                  className="w-full py-1.5 bg-[#107C41] text-white font-semibold rounded hover:bg-[#0B5A2F]">
                  Replace Selection with Translation
                </button>
                <div className="flex gap-1.5">
                  <button onClick={handleInsertBelow}
                    className="flex-1 py-1 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4]">Insert Below</button>
                  <button onClick={() => navigator.clipboard.writeText(result.translatedText)}
                    className="flex-1 py-1 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4]">Copy</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
