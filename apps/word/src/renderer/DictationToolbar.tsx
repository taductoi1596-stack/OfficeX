import React, { useState, useEffect, useRef } from 'react';
import { SpeechEngine, SpeechStatus, SPEECH_LANGUAGES } from './ai/workflow/SpeechEngine';

function VolumeMeter({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(2));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setBars(Array(12).fill(2));
      if (animRef.current) cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      analyserRef.current = null;
      streamRef.current = null;
      return;
    }

    let mounted = true;

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        src.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!mounted || !analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(data);
          const newBars = Array.from({ length: 12 }, (_, i) => {
            const v = data[Math.floor(i * data.length / 12)] / 255;
            return Math.max(2, Math.round(v * 36));
          });
          setBars(newBars);
          animRef.current = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        // Fallback: animate random bars if no mic permission
        const animate = () => {
          if (!mounted) return;
          setBars(Array(12).fill(0).map(() => active ? 2 + Math.random() * (Math.random() > 0.7 ? 32 : 6) : 2));
          animRef.current = requestAnimationFrame(animate);
        };
        animate();
      });

    return () => {
      mounted = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [active]);

  return (
    <div className="flex items-end gap-[2px] h-[36px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-all duration-75"
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

export function SpeechToolbar({ onClose, embedded }: { onClose: () => void; embedded?: boolean }) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [language, setLanguage] = useState('en-US');
  const [autoPunct, setAutoPunct] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [lastError, setLastError] = useState('');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    SpeechEngine.subscribe({
      onStatusChange: (s: any) => {
        setStatus(s);
        if (s === 'idle') setInterimText('');
      },
      onTranscript: (interim: any, final: any) => {
        setInterimText(interim);
        if (final) {
          setLog(prev => [`✏️ "${final.trim()}"`, ...prev].slice(0, 20));
          setInterimText('');
        }
      },
      onCommand: (cmd: any) => {
        setLastCommand(cmd);
        setLog(prev => [`⚡ Command: ${cmd}`, ...prev].slice(0, 20));
      },
      onError: (msg: any) => {
        setLastError(msg);
        setLog(prev => [`❌ ${msg}`, ...prev].slice(0, 20));
      },
    });

    return () => {
      SpeechEngine.stop();
    };
  }, []);

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
      SpeechEngine.start();
    } else if (status === 'listening') {
      SpeechEngine.pause();
    } else if (status === 'paused') {
      SpeechEngine.resume();
    }
  };

  const handleStop = () => {
    SpeechEngine.stop();
    setInterimText('');
  };

  const isActive = status === 'listening';
  const isPaused = status === 'paused';
  
  const statusColor = ({
    idle: '#757575',
    listening: '#107C41',
    paused: '#F7630C',
    processing: '#2B579A',
  } as Record<string, string>)[status as string];

  const statusLabel = ({
    idle: 'Ready',
    listening: '● Listening...',
    paused: '⏸ Paused',
    processing: '⏳ Processing...',
  } as Record<string, string>)[status as string];

  

  

  return (
    <div
      style={embedded ? {
        display: 'flex', flexDirection: 'column', gap: 10, padding: 16, flex: 1, overflowY: 'auto',
        fontFamily: 'Segoe UI, sans-serif', fontSize: 12, userSelect: 'none', background: '#fff'
      } : {
        position: 'fixed',
        bottom: 56,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid #E1DFDD',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 520,
        maxWidth: 640,
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 12,
        userSelect: 'none',
      }}
    >
      {/* Top row: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Mic toggle button */}
        <button
          onClick={handleToggle}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: isActive ? '#C50F1F' : isPaused ? '#F7630C' : '#2B579A',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isActive ? '0 0 0 4px rgba(197,15,31,0.2)' : 'none',
            transition: 'all 0.2s',
          }}
          title={isActive ? 'Pause' : isPaused ? 'Resume' : 'Start Speech'}
        >
          {isActive ? '⏸' : isPaused ? '▶' : '🎙'}
        </button>

        {/* Volume Meter */}
        <VolumeMeter active={isActive} />

        {/* Status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: statusColor, fontSize: 11, marginBottom: 2 }}>
            {statusLabel}
          </div>
          {interimText && (
            <div style={{
              color: '#555', fontSize: 11, fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: 260,
            }}>
              {interimText}
            </div>
          )}
          {lastError && !isActive && (
            <div style={{ color: '#C50F1F', fontSize: 10 }}>{lastError}</div>
          )}
          {lastCommand && isActive && (
            <div style={{ color: '#8764B8', fontSize: 10 }}>⚡ {lastCommand}</div>
          )}
        </div>

        {/* Language Select */}
        <select
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          style={{
            padding: '3px 6px', border: '1px solid #E1DFDD', borderRadius: 4,
            fontSize: 11, background: '#fff', maxWidth: 140,
          }}
        >
          {SPEECH_LANGUAGES.map((l: any) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        {/* Auto Punct toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#555', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={autoPunct} onChange={e => handleAutoPunctChange(e.target.checked)} />
          Auto Punct.
        </label>

        {/* Stop button */}
        {(isActive || isPaused) && (
          <button
            onClick={handleStop}
            style={{
              padding: '4px 10px', border: '1px solid #E1DFDD', borderRadius: 4,
              background: '#F3F2F1', fontSize: 11, cursor: 'pointer',
              color: '#333',
            }}
          >
            Stop
          </button>
        )}

        {/* Close */}
        <button
          onClick={() => { SpeechEngine.stop(); onClose(); }}
          style={{
            width: 22, height: 22, border: 'none', background: 'none',
            fontSize: 14, cursor: 'pointer', color: '#757575',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Voice Commands Reference */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid #F3F2F1' }}>
        {[
          '"New line"', '"New paragraph"', '"Delete last word"',
          '"Bold that"', '"Undo"', '"Stop speech"',
          '"Period"', '"Comma"', '"Question mark"',
        ].map(cmd => (
          <span key={cmd} style={{
            padding: '1px 6px', background: '#F3F2F1', border: '1px solid #E1DFDD',
            borderRadius: 3, fontSize: 10, color: '#555', fontFamily: 'monospace',
          }}>
            {cmd}
          </span>
        ))}
      </div>

      {/* Live Log */}
      {log.length > 0 && (
        <div style={{
          maxHeight: 72, overflowY: 'auto', borderTop: '1px solid #F3F2F1',
          paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {log.map((entry, i) => (
            <div key={i} style={{ fontSize: 10, color: '#666', lineHeight: 1.4 }}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
}
