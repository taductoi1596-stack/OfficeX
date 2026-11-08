import React, { useState, useEffect, useRef } from 'react';
import { SpeechEngine, SpeechStatus, SPEECH_LANGUAGES } from './ai/workflow/SpeechEngine';
import { AudioCaptureEngine } from './ai/workflow/AudioCaptureEngine';
import { EditorAPI } from './editorApi';

function VolumeMeter({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(2));
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setBars(Array(12).fill(2));
      return;
    }

    const handleVolume = (data: Uint8Array) => {
      const newBars = Array.from({ length: 12 }, (_, i) => {
        const v = data[Math.floor(i * data.length / 12)] / 255;
        return Math.max(2, Math.round(v * 36));
      });
      setBars(newBars);
    };

    AudioCaptureEngine.subscribeVolume(handleVolume);

    return () => {
      AudioCaptureEngine.unsubscribeVolume(handleVolume);
    };
  }, [active]);

  return (
    <div className="flex items-end justify-center gap-[3px] h-[40px] w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[4px] rounded-sm transition-all duration-75"
          style={{
            height: `${h}px`,
            background: h > 28
              ? '#C50F1F'
              : h > 14
              ? '#F7630C'
              : '#107C41',
          }}
        />
      ))}
    </div>
  );
}

const MODES = [
  'Real-time Dictation',
  'Paragraph Dictation',
  'Meeting Dictation',
  'Lecture Dictation',
  'Interview',
  'Conversation',
  'Voice Notes',
  'Command Mode',
  'Custom',
];

export function AIDictatePane({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [language, setLanguage] = useState('en-US');
  const [mode, setMode] = useState('Real-time Dictation');
  const [autoPunct, setAutoPunct] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [fullText, setFullText] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [lastError, setLastError] = useState('');
  const [log, setLog] = useState<string[]>([]);
  
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SpeechEngine.subscribe({
      onStatusChange: (s) => {
        setStatus(s);
        if (s === 'idle') setInterimText('');
      },
      onTranscript: (interim, final) => {
        setInterimText(interim);
        if (final) {
          const t = final.trim();
          setFullText(prev => prev ? prev + ' ' + t : t);
          setLog(prev => [`✏️ "${t}"`, ...prev].slice(0, 50));
          setInterimText('');
        }
      },
      onCommand: (cmd) => {
        setLastCommand(cmd);
        setLog(prev => [`⚡ Command: ${cmd}`, ...prev].slice(0, 50));
      },
      onError: (msg) => {
        setLastError(msg);
        setLog(prev => [`❌ ${msg}`, ...prev].slice(0, 50));
      },
    });

    return () => {
      SpeechEngine.stop();
    };
  }, []);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [fullText, interimText]);

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    SpeechEngine.setLanguage(code);
  };

  const handleAutoPunctChange = (v: boolean) => {
    setAutoPunct(v);
    SpeechEngine.setAutoPunctuation(v);
  };

  const handleToggle = () => {
    if (status === 'idle') {
      setLastError('');
      setLastCommand('');
      SpeechEngine.setLanguage(language);
      SpeechEngine.setAutoPunctuation(autoPunct);
      AudioCaptureEngine.start().then(() => {
        SpeechEngine.start();
      }).catch(err => {
        if (err.name === 'NotFoundError') {
          setLastError('No microphone detected. Please connect a microphone.');
        } else if (err.name === 'NotAllowedError') {
          setLastError('Microphone permission denied by system.');
        } else {
          setLastError(`Microphone error: ${err.message}`);
        }
      });
    } else if (status === 'listening') {
      SpeechEngine.pause();
      AudioCaptureEngine.stop();
    } else if (status === 'paused') {
      AudioCaptureEngine.start().then(() => {
        SpeechEngine.resume();
      }).catch(err => {
        if (err.name === 'NotFoundError') {
          setLastError('No microphone detected. Please connect a microphone.');
        } else if (err.name === 'NotAllowedError') {
          setLastError('Microphone permission denied by system.');
        } else {
          setLastError(`Microphone error: ${err.message}`);
        }
      });
    }
  };

  const handleStop = () => {
    SpeechEngine.stop();
    AudioCaptureEngine.stop();
    setInterimText('');
  };

  const handleReplace = () => {
    const api = EditorAPI.getLegacy();
    if (api && fullText) {
      api.insertTextAtSelection(fullText);
      onClose();
    }
  };

  const handleInsertBelow = () => {
    const api = EditorAPI.getLegacy();
    if (api && fullText) {
      api.insertTextAtSelection('\n' + fullText);
      onClose();
    }
  };

  const handleClear = () => {
    setFullText('');
    setLog([]);
  };

  const isActive = status === 'listening';
  const isPaused = status === 'paused';

  const statusColor = {
    idle: '#757575',
    listening: '#107C41',
    paused: '#F7630C',
    processing: '#2B579A',
  }[status];

  const statusLabel = {
    idle: 'Ready to dictate',
    listening: '● Listening...',
    paused: '⏸ Paused',
    processing: '⏳ Processing...',
  }[status];

  return (
    <div className={embedded ? "flex-1 flex flex-col font-segoe text-[12px] select-none h-full bg-white" : "absolute right-0 top-[110px] w-[400px] bottom-0 bg-white border-l border-[#E1DFDD] shadow-xl flex flex-col font-segoe text-[12px] z-[150] select-none"}>
      
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E1DFDD]">
          <div className="font-semibold flex items-center gap-2 text-[#C50F1F] text-[13px]">
            <span>🎙</span> AI Dictate
          </div>
          <button onClick={onClose} className="w-6 h-6 hover:bg-[#F3F2F1] flex items-center justify-center rounded text-slate-500">✕</button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        
        {/* Settings Area */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold uppercase text-slate-500">Language</label>
              <select
                className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#C50F1F] focus:outline-none text-[11px]"
                value={language} onChange={e => handleLanguageChange(e.target.value)}
              >
                {SPEECH_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-slate-500">Mode</label>
              <select
                className="mt-1 w-full px-2 py-1 border border-[#E1DFDD] rounded bg-white focus:border-[#C50F1F] focus:outline-none text-[11px]"
                value={mode} onChange={e => setMode(e.target.value)}
              >
                {MODES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600">
              <input type="checkbox" checked={autoPunct} onChange={e => handleAutoPunctChange(e.target.checked)}
                className="accent-[#C50F1F] w-3.5 h-3.5" />
              Automatic Punctuation
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600">
              <input type="checkbox" defaultChecked className="accent-[#C50F1F] w-3.5 h-3.5" />
              Voice Commands
            </label>
          </div>
        </div>

        {/* Big Mic Button & Volume */}
        <div className="flex flex-col items-center justify-center gap-3 py-4 border border-[#E1DFDD] rounded bg-[#F9F9F9]">
          <div className="text-[12px] font-semibold" style={{ color: statusColor }}>
            {statusLabel}
          </div>
          
          <button
            onClick={handleToggle}
            className="flex items-center justify-center rounded-full transition-all"
            style={{
              width: 72,
              height: 72,
              border: 'none',
              background: isActive ? '#C50F1F' : isPaused ? '#F7630C' : '#2B579A',
              color: '#fff',
              fontSize: 32,
              cursor: 'pointer',
              boxShadow: isActive ? '0 0 0 8px rgba(197,15,31,0.2)' : '0 4px 12px rgba(0,0,0,0.15)',
            }}
            title={isActive ? 'Pause (Ctrl+Alt+P)' : isPaused ? 'Resume' : 'Start Dictation (Ctrl+Alt+R)'}
          >
            {isActive ? '⏸' : isPaused ? '▶' : '🎙'}
          </button>
          
          <div className="w-full px-6 mt-2">
             <VolumeMeter active={isActive} />
          </div>

          {(isActive || isPaused) && (
            <button
              onClick={handleStop}
              className="mt-2 px-6 py-1.5 border border-[#E1DFDD] rounded-full bg-white hover:bg-[#F3F2F1] text-slate-700 text-[11px] shadow-sm font-semibold"
            >
              ⏹ Stop Dictation
            </button>
          )}
        </div>
        
        {/* Error / Command Badges */}
        {(lastError || lastCommand) && (
          <div className="flex flex-col gap-1">
            {lastError && !isActive && <div className="text-[11px] text-[#C50F1F] bg-[#FDE7E9] px-2 py-1 rounded">{lastError}</div>}
            {lastCommand && isActive && <div className="text-[11px] text-[#8764B8] bg-[#F3EEFA] px-2 py-1 rounded">⚡ {lastCommand}</div>}
          </div>
        )}

        {/* Live Transcript Box */}
        <div className="flex flex-col flex-1 min-h-[150px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Live Transcript</span>
            <button onClick={handleClear} className="text-[10px] text-slate-400 hover:text-[#C50F1F] underline">Clear</button>
          </div>
          <div
            ref={resultRef}
            className="flex-1 p-3 border border-[#E1DFDD] rounded bg-white overflow-y-auto shadow-inner text-[12px] whitespace-pre-wrap leading-relaxed text-slate-700"
          >
            {fullText}
            {interimText && <span className="text-slate-400 italic"> {interimText}</span>}
            {isActive && <span className="animate-pulse text-[#C50F1F] ml-1">▋</span>}
            {!fullText && !interimText && <span className="text-slate-300 italic">Transcript will appear here...</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={handleReplace} disabled={!fullText}
            className={`w-full py-2 font-semibold rounded text-white ${fullText ? 'bg-[#107C41] hover:bg-[#0B5A2F]' : 'bg-slate-300 cursor-not-allowed'}`}>
            Replace Selection
          </button>
          <div className="flex gap-2">
            <button onClick={handleInsertBelow} disabled={!fullText}
              className={`flex-1 py-1.5 border border-[#ADADAD] rounded ${fullText ? 'bg-[#E1DFDD] hover:bg-[#C8C6C4] text-slate-800' : 'bg-[#F3F2F1] text-slate-400 cursor-not-allowed'}`}>
              Insert Below
            </button>
            <button onClick={() => navigator.clipboard.writeText(fullText)} disabled={!fullText}
              className={`flex-1 py-1.5 border border-[#ADADAD] rounded ${fullText ? 'bg-[#E1DFDD] hover:bg-[#C8C6C4] text-slate-800' : 'bg-[#F3F2F1] text-slate-400 cursor-not-allowed'}`}>
              Copy text
            </button>
          </div>
        </div>
        
        {/* Voice Commands Reference */}
        <div className="mt-2 p-3 border border-[#E1DFDD] rounded bg-[#F9F9F9]">
          <div className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Supported Voice Commands</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              '"New line"', '"New paragraph"', '"Delete that"',
              '"Bold that"', '"Undo"', '"Stop dictation"',
              '"Period"', '"Comma"', '"Question mark"',
            ].map(cmd => (
              <span key={cmd} className="px-1.5 py-0.5 bg-white border border-[#E1DFDD] rounded text-[9px] color-[#555] font-mono shadow-sm">
                {cmd}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
