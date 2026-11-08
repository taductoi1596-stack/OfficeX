import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SummaryTypesEngine } from './ai/workflow/SummaryTypesEngine';
import { SummarizeWorkflowEngine, SummarizeWorkflowState } from './ai/workflow/SummarizeWorkflowEngine';

export function AISummarizePane({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  // Use useMemo so the engine instance persists across renders
  const engine = useMemo(() => new SummarizeWorkflowEngine(), []);

  // UI States mapped from Workflow Engine
  const [workflowState, setWorkflowState] = useState<SummarizeWorkflowState>('Idle');
  const [resultText, setResultText] = useState('');
  const [coverage, setCoverage] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Local Form States
  const [scope, setScope] = useState<'Selection'|'Paragraph'|'Section'|'Document'>('Selection');
  const [summaryType, setSummaryType] = useState('Executive Summary');
  const [summaryLength, setSummaryLength] = useState('Medium');
  const [writingStyle, setWritingStyle] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('Executives');
  const [outputLanguage, setOutputLanguage] = useState('English');
  const [instruction, setInstruction] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'coverage' | 'history'>('preview');

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bind engine callbacks
    engine['onStateChangeCb'] = (st) => setWorkflowState(st);
    engine['onTokenCb'] = (text) => setResultText(text);
    engine['onCompleteCb'] = (fullText, cov) => {
      setResultText(fullText);
      setCoverage(cov);
      setInsights(engine.getInsights());
    };
    engine['onErrorCb'] = (err) => setErrorMsg(err);
  }, [engine]);

  // Auto-scroll result as streaming
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [resultText]);

  const handleGenerate = () => {
    setActiveTab('preview');
    engine.start({
      summaryType,
      summaryLength,
      writingStyle,
      targetAudience,
      outputLanguage,
      instruction,
      scope,
    });
  };

  const handleStop = () => engine.cancel();
  const handleInsertBelow = () => { engine.insertBelow(); onClose(); };
  const handleReplace = () => { engine.replaceSelection(); onClose(); };

  const isGenerating = workflowState === 'Streaming' || workflowState === 'Preparing Context' || workflowState === 'Provider Connection' || workflowState === 'Security Validation' || workflowState === 'Summary Analysis' || workflowState === 'Building Prompt';

  const groupedTypes = SummaryTypesEngine.getGroupedTypes();

  const tabCls = (t: string) =>
    `px-3 py-1 text-[11px] cursor-pointer border-b-2 transition-colors ${activeTab === t
      ? 'border-[#2B579A] text-[#2B579A] font-semibold'
      : 'border-transparent text-slate-500 hover:text-slate-700'}`;

  return (
    <div className={embedded ? "flex-1 flex flex-col font-segoe text-[12px] select-none h-full bg-white" : "absolute right-0 top-[110px] w-[380px] bottom-0 bg-white border-l border-[#E1DFDD] shadow-xl flex flex-col font-segoe text-[12px] z-[150] select-none"}>

      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E1DFDD]">
          <div className="font-semibold flex items-center gap-2 text-[#2B579A] text-[13px]">
            <span>📋</span> AI Summarize
          </div>
          <button onClick={onClose} className="w-6 h-6 hover:bg-[#F3F2F1] flex items-center justify-center rounded text-slate-500">✕</button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">

        {/* Error Banner */}
        {workflowState === 'Error' && (
          <div className="p-2 bg-[#FDE7E9] border border-[#F5C2C7] text-[#A80000] rounded flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Scope */}
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">Scope</label>
          <div className="mt-1 flex gap-1 bg-[#F3F2F1] p-1 rounded border border-[#E1DFDD]">
            {(['Selection', 'Paragraph', 'Section', 'Document'] as const).map(s => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`flex-1 py-1 text-[10px] rounded transition-colors ${scope === s ? 'bg-white shadow-sm font-semibold text-[#2B579A]' : 'text-slate-600 hover:bg-[#EAEAEA]'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Type (Grouped) */}
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">Summary Type</label>
          <div className="mt-1 flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {Object.entries(groupedTypes).map(([category, types]) => (
              <div key={category}>
                <div className="text-[9px] font-semibold text-slate-400 uppercase mb-1">{category}</div>
                <div className="grid grid-cols-2 gap-1">
                  {types.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSummaryType(t.name)}
                      title={t.instruction}
                      className={`px-2 py-1 text-[11px] text-left rounded border transition-colors truncate ${summaryType === t.name
                        ? 'bg-[#2B579A] text-white border-[#2B579A]'
                        : 'bg-white text-slate-600 border-[#E1DFDD] hover:border-[#2B579A] hover:text-[#2B579A]'}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Config row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Length</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={summaryLength} onChange={e => setSummaryLength(e.target.value)}>
              <option>One Sentence</option>
              <option>Short</option>
              <option>Medium</option>
              <option>Detailed</option>
              <option>Very Detailed</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Style</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={writingStyle} onChange={e => setWritingStyle(e.target.value)}>
              <option>Professional</option>
              <option>Business</option>
              <option>Academic</option>
              <option>Technical</option>
              <option>Simple</option>
              <option>Friendly</option>
              <option>Executive</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Audience</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={targetAudience} onChange={e => setTargetAudience(e.target.value)}>
              <option>Executives</option>
              <option>Managers</option>
              <option>Developers</option>
              <option>Students</option>
              <option>General Public</option>
              <option>Legal</option>
              <option>Marketing</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-500">Language</label>
            <select className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#2B579A] focus:outline-none"
              value={outputLanguage} onChange={e => setOutputLanguage(e.target.value)}>
              <option>English</option>
              <option>Vietnamese</option>
              <option>French</option>
              <option>German</option>
              <option>Spanish</option>
              <option>Japanese</option>
              <option>Chinese</option>
            </select>
          </div>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">Custom Instructions</label>
          <textarea
            className="mt-1 w-full p-2 border border-[#E1DFDD] rounded h-[48px] resize-none focus:border-[#2B579A] focus:outline-none"
            placeholder="e.g. Focus on risks and deadlines..."
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <div className="flex gap-2">
          {!isGenerating ? (
            <button onClick={handleGenerate}
              className="flex-1 py-1.5 bg-[#2B579A] text-white font-semibold rounded hover:bg-[#1A365D] flex items-center justify-center gap-1">
              <span>📋</span> Generate Summary
            </button>
          ) : (
            <button onClick={handleStop}
              className="flex-1 py-1.5 bg-[#C50F1F] text-white font-semibold rounded hover:bg-[#8B0000]">
              ⏹ Stop Generating
            </button>
          )}
          {resultText && !isGenerating && (
            <button onClick={handleGenerate}
              className="px-3 py-1.5 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4] text-slate-700">
              ↻
            </button>
          )}
        </div>

        {/* Result Tabs */}
        {resultText && (
          <div>
            <div className="flex border-b border-[#E1DFDD] mb-2">
              <button className={tabCls('preview')} onClick={() => setActiveTab('preview')}>Preview</button>
              <button className={tabCls('coverage')} onClick={() => setActiveTab('coverage')}>Coverage</button>
              <button className={tabCls('history')} onClick={() => setActiveTab('history')}>History</button>
            </div>

            {activeTab === 'preview' && (
              <div>
                <div
                  ref={resultRef}
                  className="p-3 bg-[#F4F8FA] border border-[#2B579A] rounded h-[200px] overflow-y-auto whitespace-pre-wrap text-[12px] leading-[1.6] shadow-inner"
                >
                  {resultText}
                  {isGenerating && <span className="animate-pulse text-[#2B579A]">▋</span>}
                </div>

                {!isGenerating && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <button onClick={handleReplace}
                      className="w-full py-1.5 bg-[#107C41] text-white font-semibold rounded hover:bg-[#0B5A2F]">
                      Replace Selection with Summary
                    </button>
                    <div className="flex gap-1.5">
                      <button onClick={handleInsertBelow}
                        className="flex-1 py-1 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4]">Insert Below</button>
                      <button onClick={() => navigator.clipboard.writeText(resultText)}
                        className="flex-1 py-1 bg-[#E1DFDD] border border-[#ADADAD] rounded hover:bg-[#C8C6C4]">Copy</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'coverage' && (
              <div className="flex flex-col gap-3 text-[12px]">
                {coverage && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-[#F0F4F8] rounded border border-[#E1DFDD] text-center">
                      <div className="text-[20px] font-bold text-[#2B579A]">{Math.max(0, coverage.compressionRatio)}%</div>
                      <div className="text-[10px] text-slate-500">Compression Ratio</div>
                    </div>
                    <div className="p-2 bg-[#F0F4F8] rounded border border-[#E1DFDD] text-center">
                      <div className="text-[20px] font-bold text-[#107C41]">{coverage.readingTimeSavedMin}m</div>
                      <div className="text-[10px] text-slate-500">Reading Time Saved</div>
                    </div>
                  </div>
                )}
                {insights && (
                  <>
                    {insights.mainTopic && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase text-slate-500 mb-1">Main Topic</div>
                        <div className="text-[#2B579A] font-semibold bg-[#F0F4F8] p-1 rounded">{insights.mainTopic}</div>
                      </div>
                    )}
                    {insights.actionItems && insights.actionItems.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase text-slate-500 mb-1">Action Items</div>
                        <ul className="list-disc list-inside space-y-1">
                          {insights.actionItems.map((a: string, i: number) => (
                            <li key={i} className="text-slate-700 bg-white border border-[#E1DFDD] px-1 rounded truncate">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {insights.entities && insights.entities.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase text-slate-500 mb-1">Extracted Entities</div>
                        <div className="flex flex-wrap gap-1">
                          {insights.entities.map((e: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-[#FFF4CE] text-[#7A6300] border border-[#F0D000] rounded text-[10px]">{e}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="flex flex-col gap-2">
                <div className="text-slate-400 italic text-center py-4">History managed by ContextEngine.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
