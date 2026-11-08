/**
 * VoiceGroup.tsx
 *
 * Voice ribbon group for Home tab.
 * Per ribbon_home.md: Dictate, Transcribe, Read Aloud, Voice Settings.
 *
 * Dynamic Visibility: Hidden if Voice not available.
 * All commands route through CommandDispatcher → WORD.VOICE.*
 */

import React, { useState, useEffect, useRef } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import { RGroup } from './SharedComponents';

// ─── Voice availability check ─────────────────────────────────────────────────
// Check if browser supports Web Speech API
function isVoiceAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window ||
     'speechSynthesis' in window)
  );
}

// ─── Voice Button ─────────────────────────────────────────────────────────────

type VoiceButtonDef = {
  id: string;
  icon: string;
  label: string;
  tooltip: string;
  shortcut?: string;
  cmd: string;
  color: string;
  activeColor: string;
};

const VOICE_BUTTONS: VoiceButtonDef[] = [
  {
    id: 'dictate',
    icon: '🎤',
    label: 'Dictate',
    tooltip: 'Start speech-to-text dictation',
    shortcut: 'Ctrl+Shift+D',
    cmd: 'WORD.VOICE.DICTATE',
    color: '#C50F1F',
    activeColor: '#C50F1F',
  },
  {
    id: 'transcribe',
    icon: '🔊',
    label: 'Transcribe',
    tooltip: 'Transcribe audio from file or microphone',
    cmd: 'WORD.VOICE.TRANSCRIBE',
    color: '#0F6CBD',
    activeColor: '#0F6CBD',
  },
  {
    id: 'read-aloud',
    icon: '📢',
    label: 'Read Aloud',
    tooltip: 'Read document aloud using text-to-speech',
    cmd: 'WORD.VOICE.READ_ALOUD',
    color: '#107C41',
    activeColor: '#107C41',
  },
  {
    id: 'settings',
    icon: '⚙️',
    label: 'Settings',
    tooltip: 'Voice settings and preferences',
    cmd: 'WORD.VOICE.SETTINGS',
    color: '#616161',
    activeColor: '#2B579A',
  },
];

function VoiceBtn({
  def,
  isActive,
  onClick,
}: {
  def: VoiceButtonDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pressed, setPressed] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 600);
  };
  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full mb-2 left-1/2 z-50 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            className="bg-[#323130] text-white text-[11px] px-2 py-1.5 rounded-[4px] whitespace-nowrap"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          >
            <div className="font-semibold mb-0.5">{def.tooltip}</div>
            {def.shortcut && (
              <div className="text-[10px] opacity-70">
                Keyboard:{' '}
                <span className="font-mono bg-white/15 px-1 rounded">{def.shortcut}</span>
              </div>
            )}
          </div>
          <div
            className="absolute bottom-[-4px] left-1/2 w-2 h-2 bg-[#323130]"
            style={{ transform: 'translateX(-50%) rotate(45deg)' }}
          />
        </div>
      )}

      <button
        title={def.tooltip}
        aria-pressed={isActive}
        onMouseDown={(e) => {
          e.preventDefault();
          setPressed(true);
          onClick();
        }}
        onMouseUp={() => setPressed(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          width: 48,
          height: 56,
          border: isActive ? `1px solid ${def.color}` : '1px solid transparent',
          borderRadius: 4,
          background: isActive
            ? `${def.color}18`
            : pressed
            ? `${def.color}12`
            : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.12s ease',
          outline: 'none',
        }}
        onMouseOver={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background = `${def.color}10`;
            (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${def.color}40`;
          }
        }}
        onMouseOut={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid transparent';
          }
        }}
      >
        {/* Dictate shows animated mic when active */}
        <span style={{ fontSize: def.id === 'dictate' && isActive ? 20 : 18, lineHeight: 1 }}>
          {def.icon}
        </span>
        {/* Active pulse for dictate */}
        {def.id === 'dictate' && isActive && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#C50F1F',
              animation: 'voicePulse 1s ease-in-out infinite',
            }}
          />
        )}
        <span
          style={{
            fontSize: 10,
            color: isActive ? def.activeColor : '#424242',
            fontWeight: isActive ? 600 : 400,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {def.label}
        </span>
      </button>
    </div>
  );
}

// ─── Main VoiceGroup ──────────────────────────────────────────────────────────

export function VoiceGroup() {
  const [activeCmd, setActiveCmd] = useState<string | null>(null);
  const voiceAvailable = isVoiceAvailable();

  // Listen for voice command dispatches to track active state
  useEffect(() => {
    const unsubs = VOICE_BUTTONS.map((btn) =>
      CommandDispatcher.subscribe(btn.cmd, () => {
        setActiveCmd((prev) => (prev === btn.cmd ? null : btn.cmd));
      })
    );
    return () => unsubs.forEach((fn) => fn());
  }, []);

  // Dynamic visibility: hidden if voice not available
  if (!voiceAvailable) return null;

  return (
    <>
      <style>{`
        @keyframes voicePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>

      <RGroup label="Voice">
        <div className="flex items-center gap-0.5 pt-1">
          {VOICE_BUTTONS.map((btn) => (
            <VoiceBtn
              key={btn.id}
              def={btn}
              isActive={activeCmd === btn.cmd}
              onClick={() => CommandDispatcher.dispatch(btn.cmd)}
            />
          ))}
        </div>
      </RGroup>
    </>
  );
}
