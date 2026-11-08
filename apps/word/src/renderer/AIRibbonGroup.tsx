/**
 * AIRibbonGroup.tsx
 * 
 * Enterprise AI Ribbon Group for OfficeX Word.
 * Implements the complete AI section of the Home tab ribbon:
 *   Rewrite | Summarize | Translate | Dictate | Chat
 * 
 * Matches Microsoft Word Copilot ribbon UX.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import {
  IconAI, IconDictate, IconTranslate, IconRewrite,
} from '@officex/icons';

// ─── Button Definitions ───────────────────────────────────────────────────────

type AIButtonState = 'enabled' | 'disabled' | 'busy' | 'streaming' | 'error' | 'permission-denied';

type AIRibbonButtonDef = {
  id: string;
  label: string;
  tooltip: string;
  description: string;
  shortcut: string;
  commandId: string;
  icon: any;
  automationId: string;
  ariaLabel: string;
};

const AI_BUTTONS: AIRibbonButtonDef[] = [
  {
    id: 'ai-rewrite',
    label: 'Rewrite',
    tooltip: 'Rewrite selected text using AI',
    description: 'Use AI to improve, rephrase, or transform selected text with custom tone and style.',
    shortcut: 'Ctrl+Shift+A',
    commandId: 'WORD.AI.REWRITE',
    icon: IconRewrite,
    automationId: 'AIRibbon_Rewrite',
    ariaLabel: 'AI Rewrite — rewrite selected text',
  },
  {
    id: 'ai-summarize',
    label: 'Summarize',
    tooltip: 'Summarize selected content or whole document',
    description: 'Generate executive summaries, key points, bullet lists, action items and more.',
    shortcut: 'Ctrl+Shift+S',
    commandId: 'WORD.AI.SUMMARIZE',
    icon: IconAI,
    automationId: 'AIRibbon_Summarize',
    ariaLabel: 'AI Summarize — generate document summary',
  },
  {
    id: 'ai-translate',
    label: 'Translate',
    tooltip: 'Translate selection or document to another language',
    description: 'Translate to 30+ languages with auto-detection, formatting preservation and terminology control.',
    shortcut: 'Ctrl+Shift+T',
    commandId: 'WORD.AI.TRANSLATE',
    icon: IconTranslate,
    automationId: 'AIRibbon_Translate',
    ariaLabel: 'AI Translate — translate to another language',
  },
  {
    id: 'ai-dictate',
    label: 'Dictate',
    tooltip: 'Convert speech to text with voice commands',
    description: 'Dictate text directly into your document. Supports voice commands and auto-punctuation.',
    shortcut: 'Ctrl+Shift+D',
    commandId: 'WORD.DICTATE.START',
    icon: IconDictate,
    automationId: 'AIRibbon_Dictate',
    ariaLabel: 'Dictate — speech to text',
  },
  {
    id: 'ai-chat',
    label: 'Chat',
    tooltip: 'Chat with your document using AI',
    description: 'Have a multi-turn conversation with AI that understands your document context.',
    shortcut: 'Ctrl+Shift+C',
    commandId: 'WORD.AI.CHAT.OPEN',
    icon: IconAI,
    automationId: 'AIRibbon_Chat',
    ariaLabel: 'AI Chat — document-aware AI assistant',
  },
];

// Track which panel is currently open globally
const PANEL_COMMANDS = new Set([
  'WORD.AI.REWRITE', 'WORD.AI.SUMMARIZE', 'WORD.AI.TRANSLATE',
  'WORD.DICTATE.START', 'WORD.AI.CHAT.OPEN',
]);

// ─── Tooltip Component ────────────────────────────────────────────────────────

function AIButtonTooltip({ def, visible }: { def: AIRibbonButtonDef; visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      role="tooltip"
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 8,
        background: '#323130',
        color: '#fff',
        borderRadius: 4,
        padding: '8px 10px',
        width: 200,
        boxShadow: '0 4px 16px rgba(0,0,0,0.22)',
        zIndex: 1000,
        pointerEvents: 'none',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{def.tooltip}</div>
      <div style={{ fontSize: 11, opacity: 0.85, lineHeight: 1.4 }}>{def.description}</div>
      <div style={{ marginTop: 5, fontSize: 10, opacity: 0.65 }}>
        Keyboard: <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.15)', padding: '1px 4px', borderRadius: 2 }}>{def.shortcut}</span>
      </div>
      {/* Tooltip arrow */}
      <div style={{
        position: 'absolute', bottom: -5, left: '50%',
        transform: 'translateX(-50%)',
        width: 10, height: 10, background: '#323130',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
      }} />
    </div>
  );
}

// ─── Single AI Ribbon Button ──────────────────────────────────────────────────

function AIRibbonButton({
  def,
  state,
  isActive,
  onClick,
}: {
  def: AIRibbonButtonDef;
  state: AIButtonState;
  isActive: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pressed, setPressed] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disabled = state === 'disabled' || state === 'permission-denied';
  const busy = state === 'busy' || state === 'streaming';

  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 600);
  };
  const handleMouseLeave = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  // State-based visual
  const getStateIndicator = () => {
    if (state === 'streaming') return <span style={{ position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: '50%', background: '#107C41', animation: 'aiBlink 1s infinite' }} />;
    if (state === 'busy') return <span style={{ position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: '50%', background: '#F7630C', animation: 'aiBlink 0.5s infinite' }} />;
    if (state === 'error') return <span style={{ position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: '50%', background: '#C50F1F' }} />;
    if (state === 'permission-denied') return <span style={{ position: 'absolute', top: 2, right: 2, fontSize: 8, color: '#C50F1F' }}>🔒</span>;
    return null;
  };

  const iconColor = disabled ? '#ADADAD' : isActive ? '#6B3FA0' : '#5B4FCF';

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AIButtonTooltip def={def} visible={showTooltip && !disabled} />
      <button
        id={def.automationId}
        data-automation-id={def.automationId}
        aria-label={def.ariaLabel}
        aria-disabled={disabled}
        aria-pressed={isActive}
        aria-keyshortcuts={def.shortcut}
        title={def.tooltip}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        onMouseDown={(e) => { e.preventDefault(); if (!disabled && !busy) { setPressed(true); onClick(); } }}
        onMouseUp={() => setPressed(false)}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !disabled && !busy) { e.preventDefault(); onClick(); } }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          width: 54,
          height: 62,
          border: isActive ? '1px solid #6B3FA0' : '1px solid transparent',
          borderRadius: 4,
          background: isActive
            ? 'rgba(107,63,160,0.10)'
            : pressed
            ? 'rgba(107,63,160,0.15)'
            : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          transition: 'all 0.12s ease',
          outline: 'none',
          padding: 0,
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
          if (!disabled && !isActive) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,63,160,0.08)';
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(107,63,160,0.3)';
          }
        }}
        onMouseOut={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.border = '1px solid transparent';
          }
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 2px #6B3FA0';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        {/* State indicator dot */}
        {getStateIndicator()}

        {/* Icon */}
        <div style={{ position: 'relative' }}>
          {busy ? (
            <div style={{
              width: 20, height: 20,
              border: '2px solid rgba(107,63,160,0.2)',
              borderTopColor: '#6B3FA0',
              borderRadius: '50%',
              animation: 'aiSpin 0.8s linear infinite',
            }} />
          ) : (
            <def.icon
              size={20}
              className={undefined}
            />
          )}
        </div>

        {/* Label */}
        <span style={{
          fontSize: 10,
          fontFamily: 'Segoe UI, sans-serif',
          color: disabled ? '#ADADAD' : isActive ? '#4B2880' : '#3B2080',
          fontWeight: isActive ? 600 : 400,
          letterSpacing: 0,
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {def.label}
        </span>
      </button>
    </div>
  );
}

// ─── AI Ribbon Group ──────────────────────────────────────────────────────────

export type AIRibbonGroupProps = {
  /** Override state per button ID. Default: 'enabled' */
  buttonStates?: Partial<Record<string, AIButtonState>>;
};

export function AIRibbonGroup({ buttonStates = {} }: AIRibbonGroupProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // Listen to command dispatches to track which panel is open
  useEffect(() => {
    const unsubs = AI_BUTTONS.map(btn => {
      return CommandDispatcher.subscribe(btn.commandId, () => {
        setActivePanel(prev => prev === btn.commandId ? null : btn.commandId);
      });
    });
    return () => unsubs.forEach(fn => fn());
  }, []);

  const handleClick = useCallback((cmd: string) => {
    CommandDispatcher.dispatch(cmd);
  }, []);

  return (
    <>
      {/* Keyframe animations via inline style tag */}
      <style>{`
        @keyframes aiBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes aiSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Group wrapper — matches Office Ribbon group visual */}
      <div
        role="group"
        aria-label="AI Features"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E1DFDD',
          paddingLeft: 8,
          paddingRight: 4,
          height: '100%',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        {/* Button row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
          }}
        >
          {AI_BUTTONS.map(btn => (
            <AIRibbonButton
              key={btn.id}
              def={btn}
              state={buttonStates[btn.id] ?? 'enabled'}
              isActive={activePanel === btn.commandId}
              onClick={() => handleClick(btn.commandId)}
            />
          ))}
        </div>

        {/* Group label bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: '1px 2px',
          borderTop: '1px solid rgba(107,63,160,0.12)',
          marginTop: 1,
        }}>
          <span style={{
            fontSize: 9.5,
            fontFamily: 'Segoe UI, sans-serif',
            color: '#5B4FCF',
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            userSelect: 'none',
          }}>
            AI ✨
          </span>
        </div>
      </div>
    </>
  );
}
