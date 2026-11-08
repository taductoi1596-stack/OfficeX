import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EditorAPI } from './editorApi';
import { DiffViewer } from './components/diff/DiffViewer';
import { RewriteWorkflowEngine, WorkflowState } from './ai/workflow/RewriteWorkflowEngine';

interface VersionRecord {
  id: string;
  timestamp: number;
  mode: string;
  tone: string;
  length: string;
  instruction: string;
  result: string;
}

export function AIPane({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  const [contextText, setContextText] = useState('');
  
  // Options
  const [mode, setMode] = useState('Improve Writing');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Keep Same');
  const [language, setLanguage] = useState('Auto Detect');
  const [instruction, setInstruction] = useState('');
  
  // State from Workflow Engine
  const [workflowState, setWorkflowState] = useState<WorkflowState>('Idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Version Management
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const [showDiff, setShowDiff] = useState(false);
  
  // Streaming buffer
  const [streamBuffer, setStreamBuffer] = useState('');

  // Workflow Engine Instance
  const engineRef = useRef<RewriteWorkflowEngine | null>(null);

  useEffect(() => {
    const api = EditorAPI.getLegacy();
    if (api) {
      setContextText(api.getSelectedText());
    }

    // Initialize the Workflow Engine
    engineRef.current = new RewriteWorkflowEngine(
      (state) => {
        setWorkflowState(state);
        if (state === 'Preview') {
          // Stream completed/cancelled, record the final version
          setVersions(prev => {
            const currentResult = engineRef.current?.getResult() || '';
            if (currentResult && !prev.find(v => v.result === currentResult)) {
              const newVer: VersionRecord = {
                id: Math.random().toString(36).substring(2, 9),
                timestamp: Date.now(),
                mode, tone, length, instruction,
                result: currentResult
              };
              setCurrentVersionIndex(prev.length);
              return [...prev, newVer];
            }
            return prev;
          });
        }
      },
      (buffer) => setStreamBuffer(buffer),
      (error) => setErrorMessage(error)
    );

    return () => {
      engineRef.current?.cancel();
    };
  }, []);

  const isGenerating = workflowState === 'Preparing' || workflowState === 'Streaming';
  
  // Display the live stream or the selected historical version
  const currentResult = isGenerating ? streamBuffer : (versions[currentVersionIndex]?.result || '');

  const handleGenerate = (isRetry = false) => {
    setStreamBuffer('');
    setShowDiff(false);
    setErrorMessage('');
    
    // Update context just in case user selected new text
    const api = EditorAPI.getLegacy();
    if (api) {
      setContextText(api.getSelectedText());
    }

    engineRef.current?.start({
      mode, tone, length, instruction, language
    });
  };

  const handleStop = () => {
    engineRef.current?.cancel();
  };

  const handleReplace = () => {
    // If not latest, we should sync the engine result first or let the UI handle it.
    // The engine's accept() injects its latest result. Since we support versioning,
    // we bypass engine's accept() if we are choosing a past version.
    const api = EditorAPI.getLegacy();
    if (api && currentResult) {
      api.insertTextAtSelection(currentResult);
      engineRef.current?.accept(); // Transitions to Completed
      onClose();
    }
  };

  const handleInsertBelow = () => {
    const api = EditorAPI.getLegacy();
    if (api && currentResult) {
      api.insertTextAtSelection('\n' + currentResult);
      // Let engine know we finished
      onClose();
    }
  };

  const renderDiff = () => {
    if (!currentResult || !contextText) return null;
    return <DiffViewer originalText={contextText} rewrittenText={currentResult} />;
  };

  return (
    <div className={embedded ? "flex-1 flex flex-col font-segoe text-[12px] select-none h-full bg-white" : "absolute right-0 top-[110px] w-[420px] bottom-0 bg-white border-l border-[#E1DFDD] shadow-2xl flex flex-col font-segoe text-[12px] z-[150] select-none transition-all"}>
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#F8F8F8] border-b border-[#E1DFDD]">
          <div className="font-semibold flex items-center gap-2 text-[#2B579A] text-[14px]">
            <span>✨</span> Rewrite Panel
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] bg-[#E1DFDD] text-slate-600 px-2 py-0.5 rounded-full flex items-center">GPT-4o</span>
            <span className={`text-[10px] ${isGenerating ? 'text-[#2B579A] font-bold' : 'text-slate-500'}`}>{workflowState}</span>
            <button onClick={onClose} className="w-6 h-6 hover:bg-[#E1DFDD] flex items-center justify-center rounded text-slate-500 transition-colors">✕</button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        
        {/* Error Alert */}
        {workflowState === 'Error' && errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-[11px] font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Configurations Grid */}
        <div className="grid grid-cols-2 gap-3 bg-[#FBFBFB] p-3 rounded border border-[#E1DFDD]">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Mode</label>
            <select className="p-1.5 border border-[#C6C6C6] rounded hover:border-[#2B579A] focus:outline-none bg-white transition-colors" value={mode} onChange={e => setMode(e.target.value)}>
              <option>Improve Writing</option>
              <option>Rewrite</option>
              <option>Professional</option>
              <option>Academic</option>
              <option>Business</option>
              <option>Friendly</option>
              <option>Summarize</option>
              <option>Explain</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Tone</label>
            <select className="p-1.5 border border-[#C6C6C6] rounded hover:border-[#2B579A] focus:outline-none bg-white transition-colors" value={tone} onChange={e => setTone(e.target.value)}>
              <option>Professional</option>
              <option>Neutral</option>
              <option>Confident</option>
              <option>Persuasive</option>
              <option>Casual</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Length</label>
            <select className="p-1.5 border border-[#C6C6C6] rounded hover:border-[#2B579A] focus:outline-none bg-white transition-colors" value={length} onChange={e => setLength(e.target.value)}>
              <option>Keep Same</option>
              <option>Shorter</option>
              <option>Slightly Shorter</option>
              <option>Longer</option>
              <option>Slightly Longer</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Language</label>
            <select className="p-1.5 border border-[#C6C6C6] rounded hover:border-[#2B579A] focus:outline-none bg-white transition-colors" value={language} onChange={e => setLanguage(e.target.value)}>
              <option>Auto Detect</option>
              <option>English</option>
              <option>Vietnamese</option>
              <option>Japanese</option>
              <option>French</option>
            </select>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase">Tell AI how to rewrite...</label>
          <textarea 
            className="w-full p-2.5 border border-[#C6C6C6] rounded resize-none h-[70px] focus:border-[#2B579A] focus:outline-none focus:ring-1 focus:ring-[#2B579A] transition-all bg-[#FAFAFA]"
            placeholder="e.g. Make it sound more enthusiastic and focus on metrics..."
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isGenerating ? (
            <button 
              className="flex-1 py-2 bg-[#2B579A] text-white font-semibold rounded shadow-sm hover:bg-[#1A365D] transition-colors flex justify-center items-center gap-2"
              onClick={() => handleGenerate(false)}
            >
              <span>✨</span> Rewrite
            </button>
          ) : (
            <button 
              className="flex-1 py-2 bg-red-600 text-white font-semibold rounded shadow-sm hover:bg-red-700 transition-colors"
              onClick={handleStop}
            >
              Stop Generating
            </button>
          )}
        </div>

        {/* Output Preview */}
        {(currentResult || isGenerating) && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-2">
                Preview
                {isGenerating && <span className="text-[#2B579A] animate-pulse normal-case text-[10px]">Streaming...</span>}
              </label>
              {!isGenerating && currentResult && (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer text-[11px] text-slate-600 hover:text-[#2B579A]">
                    <input type="checkbox" checked={showDiff} onChange={e => setShowDiff(e.target.checked)} />
                    Diff View
                  </label>
                  <div className="flex items-center gap-1 text-[11px] bg-[#F3F2F1] px-2 py-0.5 rounded-full">
                    <button disabled={currentVersionIndex <= 0} onClick={() => setCurrentVersionIndex(i => i - 1)} className="hover:text-[#2B579A] disabled:opacity-30">◀</button>
                    <span className="font-semibold w-12 text-center text-slate-600">v{currentVersionIndex + 1}/{versions.length}</span>
                    <button disabled={currentVersionIndex >= versions.length - 1} onClick={() => setCurrentVersionIndex(i => i + 1)} className="hover:text-[#2B579A] disabled:opacity-30">▶</button>
                  </div>
                </div>
              )}
            </div>
            
            {showDiff ? renderDiff() : (
              <div className="p-3 border border-[#2B579A] bg-[#F4F8FA] rounded h-[200px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed relative shadow-inner">
                {currentResult}
              </div>
            )}
            
            {!isGenerating && currentResult && (
              <div className="flex flex-col gap-2 mt-3">
                <button className="w-full py-2 bg-[#107C41] text-white font-semibold rounded shadow-sm hover:bg-[#0B5A2F] transition-colors" onClick={handleReplace}>
                  Accept & Replace
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-[#F3F2F1] text-slate-700 font-medium border border-[#ADADAD] hover:bg-[#E1DFDD] rounded transition-colors" onClick={handleInsertBelow}>
                    Insert Below
                  </button>
                  <button className="flex-1 py-1.5 bg-[#F3F2F1] text-slate-700 font-medium border border-[#ADADAD] hover:bg-[#E1DFDD] rounded transition-colors" onClick={() => handleGenerate(true)}>
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
