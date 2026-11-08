/**
 * AIPanelHost.tsx
 *
 * The single right-dock container that hosts all AI panels.
 * Managed exclusively by AIPanelManager.
 *
 * Features:
 *  - Slide-in / slide-out animation (CSS transform + transition)
 *  - Drag-to-resize handle on the left edge
 *  - Header: panel title, dock switcher, pin, close
 *  - Provider status bar
 *  - Mounts all AI panel components; shows/hides via visibility
 *  - Focus management: focuses prompt input on open
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { AIPanelManager, PanelId, PanelManagerLayout, PanelState, DockPosition } from './AIPanelManager';
import { AIPane } from './AIPane';
import { AISummarizePane } from './AISummarizePane';
import { AITranslatePane } from './AITranslatePane';
import { AIDictatePane } from './AIDictatePane';
import { AIChatPane } from './AIChatPane';

// ─── Panel Icons ──────────────────────────────────────────────────────────────

const PANEL_ICONS: Record<PanelId, string> = {
  rewrite:   '✏️',
  summarize: '📋',
  translate: '🌐',
  dictate:   '🎙',
  chat:      '✨',
};

// ─── Resize Handle ────────────────────────────────────────────────────────────

function ResizeHandle({ dockPos, onResize }: { dockPos: DockPosition; onResize: (delta: number) => void }) {
  const dragging = useRef(false);
  const startX   = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = dockPos === 'right' ? startX.current - ev.clientX : ev.clientX - startX.current;
      startX.current = ev.clientX;
      onResize(delta);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        top: 0, bottom: 0,
        [dockPos === 'right' ? 'left' : 'right']: 0,
        width: 5,
        cursor: 'col-resize',
        zIndex: 10,
        background: 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(107,63,160,0.35)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
    />
  );
}

// ─── Panel Header ─────────────────────────────────────────────────────────────

function PanelHeader({
  title, panelId, pinned, dockPos,
  onClose, onTogglePin, onDock,
}: {
  title: string;
  panelId: PanelId;
  pinned: boolean;
  dockPos: DockPosition;
  onClose: () => void;
  onTogglePin: () => void;
  onDock: (pos: DockPosition) => void;
}) {
  const [showDockMenu, setShowDockMenu] = useState(false);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px',
        background: 'linear-gradient(135deg, #F4F0FA 0%, #EEE8F8 100%)',
        borderBottom: '1px solid rgba(107,63,160,0.18)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Icon + Title */}
      <span style={{ fontSize: 14 }}>{PANEL_ICONS[panelId]}</span>
      <span style={{
        flex: 1, fontFamily: 'Segoe UI, sans-serif', fontWeight: 700,
        fontSize: 12, color: '#3B1F80',
      }}>
        {title}
      </span>

      {/* Dock switcher */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDockMenu(v => !v)}
          title="Dock position"
          style={iconBtn}
          aria-label="Change dock position"
        >
          {dockPos === 'right' ? '⊟' : dockPos === 'left' ? '⊞' : '⊡'}
        </button>
        {showDockMenu && (
          <div
            style={{
              position: 'absolute', top: '100%', right: 0, zIndex: 200,
              background: '#fff', border: '1px solid #E1DFDD',
              borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              overflow: 'hidden', minWidth: 120,
            }}
            onMouseLeave={() => setShowDockMenu(false)}
          >
            {(['right', 'left', 'floating'] as DockPosition[]).map(p => (
              <button
                key={p}
                onClick={() => { onDock(p); setShowDockMenu(false); }}
                style={{
                  display: 'block', width: '100%', padding: '6px 12px',
                  textAlign: 'left', background: dockPos === p ? '#F4F0FA' : 'transparent',
                  border: 'none', cursor: 'pointer', fontSize: 11,
                  fontFamily: 'Segoe UI, sans-serif',
                  color: dockPos === p ? '#6B3FA0' : '#333',
                  fontWeight: dockPos === p ? 600 : 400,
                }}
              >
                {p === 'right' ? '⊟ Dock Right' : p === 'left' ? '⊞ Dock Left' : '⊡ Float'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pin toggle */}
      <button
        onClick={onTogglePin}
        title={pinned ? 'Unpin panel' : 'Pin panel'}
        style={{ ...iconBtn, color: pinned ? '#6B3FA0' : '#888' }}
        aria-label={pinned ? 'Unpin panel' : 'Pin panel'}
        aria-pressed={pinned}
      >
        {pinned ? '📌' : '📎'}
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        title="Close AI Panel (Esc)"
        style={{ ...iconBtn, color: '#666' }}
        aria-label="Close AI panel"
      >
        ✕
      </button>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 22, height: 22, border: 'none', background: 'none',
  cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center',
  justifyContent: 'center', borderRadius: 3, transition: 'background 0.1s',
  padding: 0,
};

// ─── Quick Panel Switcher Tabs ────────────────────────────────────────────────

const QUICK_PANELS: Array<{ id: PanelId; icon: string; label: string }> = [
  { id: 'rewrite',   icon: '✏️', label: 'Rewrite'   },
  { id: 'summarize', icon: '📋', label: 'Summarize' },
  { id: 'translate', icon: '🌐', label: 'Translate' },
  { id: 'dictate',   icon: '🎙', label: 'Dictate'   },
  { id: 'chat',      icon: '✨', label: 'Chat'       },
];

function PanelSwitcherTabs({ activePanelId, onSwitch }: {
  activePanelId: PanelId;
  onSwitch: (id: PanelId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="AI Panel switcher"
      style={{
        display: 'flex', borderBottom: '1px solid rgba(107,63,160,0.15)',
        background: '#FAF8FF', flexShrink: 0, overflowX: 'auto',
      }}
    >
      {QUICK_PANELS.map(p => {
        const active = p.id === activePanelId;
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSwitch(p.id)}
            style={{
              flex: 1, padding: '5px 4px', border: 'none', background: 'transparent',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 1,
              borderBottom: active ? '2px solid #6B3FA0' : '2px solid transparent',
              color: active ? '#6B3FA0' : '#888',
              transition: 'all 0.12s',
              fontSize: 9,
              fontFamily: 'Segoe UI, sans-serif',
              fontWeight: active ? 700 : 400,
            }}
          >
            <span style={{ fontSize: 13 }}>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Inner Panel Content ──────────────────────────────────────────────────────

/**
 * Mounts ALL panel components but only the active one is visible.
 * This preserves state (conversation, selections, etc.) across panel switches.
 */
function PanelContentArea({ activePanelId }: { activePanelId: PanelId }) {
  const noop = useCallback(() => {}, []);

  return (
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      {QUICK_PANELS.map(p => {
        const visible = p.id === activePanelId;
        return (
          <div
            key={p.id}
            role="tabpanel"
            aria-label={`${p.label} panel`}
            hidden={!visible}
            style={{
              position: 'absolute', inset: 0,
              display: visible ? 'flex' : 'none',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {p.id === 'rewrite'   && <AIPane       onClose={noop} embedded />}
            {p.id === 'summarize' && <AISummarizePane onClose={noop} embedded />}
            {p.id === 'translate' && <AITranslatePane onClose={noop} embedded />}
            {p.id === 'dictate'   && <AIDictatePane   onClose={noop} embedded />}
            {p.id === 'chat'      && <AIChatPane   onClose={noop} embedded />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Host ────────────────────────────────────────────────────────────────

export function AIPanelHost() {
  const [layout, setLayout] = useState<PanelManagerLayout>(AIPanelManager.getLayout());
  const [, setTick] = useState(0);

  // Subscribe to manager changes
  useEffect(() => {
    const unsub = AIPanelManager.subscribe((newLayout) => {
      setLayout({ ...newLayout });
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const activePanelId = layout.activePanelId;
  const isOpen = activePanelId !== null;

  // Keyboard: Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        AIPanelManager.closeActive();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleResize = useCallback((delta: number) => {
    AIPanelManager.setWidth(layout.panelWidth + delta);
  }, [layout.panelWidth]);

  const handleSwitch = useCallback((id: PanelId) => {
    AIPanelManager.openPanel(id);
  }, []);

  const activePanel = activePanelId ? AIPanelManager.getPanels().get(activePanelId) : null;

  // Slide-in/out transform
  const slideStyle: React.CSSProperties = {
    transform: isOpen ? 'translateX(0)' : (layout.dockPosition === 'right' ? 'translateX(100%)' : 'translateX(-100%)'),
    transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const positionStyle: React.CSSProperties =
    layout.dockPosition === 'floating'
      ? {
          position: 'fixed',
          top: 120, right: 20,
          width: layout.panelWidth,
          height: '70vh',
          borderRadius: 8,
          boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
        }
      : {
          position: 'absolute',
          top: 0, bottom: 0,
          [layout.dockPosition === 'right' ? 'right' : 'left']: 0,
          width: layout.panelWidth,
        };

  if (!isOpen && layout.dockPosition !== 'floating') return null;

  return (
    <div
      aria-label="AI Panel"
      role="complementary"
      style={{
        ...positionStyle,
        ...slideStyle,
        background: '#FFFFFF',
        borderLeft: layout.dockPosition === 'right' ? '1px solid rgba(107,63,160,0.2)' : 'none',
        borderRight: layout.dockPosition === 'left' ? '1px solid rgba(107,63,160,0.2)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 150,
        overflow: 'hidden',
        boxShadow: layout.dockPosition === 'right'
          ? '-4px 0 24px rgba(107,63,160,0.08)'
          : '4px 0 24px rgba(107,63,160,0.08)',
      }}
    >
      {/* Resize handle */}
      {isOpen && <ResizeHandle dockPos={layout.dockPosition === 'floating' ? 'right' : layout.dockPosition} onResize={handleResize} />}

      {/* Header */}
      {isOpen && activePanel && (
        <PanelHeader
          title={activePanel.title}
          panelId={activePanelId!}
          pinned={layout.pinned}
          dockPos={layout.dockPosition}
          onClose={() => AIPanelManager.closeActive()}
          onTogglePin={() => AIPanelManager.togglePin()}
          onDock={(pos) => AIPanelManager.setDock(pos)}
        />
      )}

      {/* Quick Switcher Tabs */}
      {isOpen && activePanelId && (
        <PanelSwitcherTabs activePanelId={activePanelId} onSwitch={handleSwitch} />
      )}

      {/* Panel Content — all mounted, active one visible */}
      {isOpen && activePanelId && (
        <PanelContentArea activePanelId={activePanelId} />
      )}
    </div>
  );
}
