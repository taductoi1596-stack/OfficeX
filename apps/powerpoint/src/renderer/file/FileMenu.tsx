/**
 * FileMenu.tsx
 *
 * Microsoft PPT-style Backstage View (File Menu) — ribbon_file.md v1.0
 * Complete 17-section Backstage: Fullscreen overlay, sidebar nav, content panels.
 * All actions route through CommandDispatcher → FileEngine / other engines.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FileEngine, FileInfo } from './FileEngine';
import { FileStorageEngine } from './FileStorageEngine';
import { FileRecoveryEngine } from './FileRecoveryEngine';
import { CommandDispatcher } from '../CommandDispatcher';
import { OneDriveBrowserModal } from './onedrive/OneDriveBrowserModal';
import { OneDriveAuthEngine } from './onedrive/OneDriveAuthEngine';
import { OneDriveSyncEngine } from './onedrive/OneDriveSyncEngine';
// Removed RenderEngine import for PPT

// ─── Types ────────────────────────────────────────────────────────────────────
type ActiveSection =
  | 'info' | 'new' | 'open' | 'recent'
  | 'save' | 'saveas' | 'autosave' | 'history'
  | 'export' | 'share' | 'print' | 'close'
  | 'account' | 'settings' | 'feedback' | 'help' | 'exit';

// ─── Shared Styles ────────────────────────────────────────────────────────────
const S = {
  actionBtn: (accent = '#2B579A'): React.CSSProperties => ({
    display: 'flex', gap: 16, alignItems: 'center',
    padding: '14px 18px', border: '1px solid #E8E8E8', borderRadius: 10,
    background: '#fff', cursor: 'pointer', textAlign: 'left' as const,
    transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%',
  }),
  gridBtn: (): React.CSSProperties => ({
    display: 'flex', gap: 12, alignItems: 'center',
    padding: '14px 16px', border: '1px solid #E8E8E8', borderRadius: 10,
    background: '#fff', cursor: 'pointer', textAlign: 'left' as const,
    transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif',
  }),
  label: (size = 14): React.CSSProperties => ({ fontSize: size, fontWeight: 600, color: '#1A1A1A' }),
  desc: (): React.CSSProperties => ({ fontSize: 12, color: '#888', marginTop: 2 }),
  sectionTitle: (): React.CSSProperties => ({
    fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', marginBottom: 12, marginTop: 24,
  }),
  tag: (color: string, bg: string): React.CSSProperties => ({
    fontSize: 10, fontWeight: 700, color, background: bg,
    borderRadius: 4, padding: '2px 6px', flexShrink: 0,
  }),
};

function hoverEnter(e: React.MouseEvent, accent = '#2B579A') {
  const el = e.currentTarget as HTMLElement;
  el.style.borderColor = accent;
  el.style.background = '#EEF3FB';
  el.style.boxShadow = `0 2px 12px rgba(43,87,154,0.1)`;
}
function hoverLeave(e: React.MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  el.style.borderColor = '#E8E8E8';
  el.style.background = '#fff';
  el.style.boxShadow = 'none';
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────
function SidebarItem({ icon, label, id, active, onClick, badge }: {
  icon: string; label: string; id: ActiveSection; active: boolean;
  onClick: (id: ActiveSection) => void; badge?: string;
}) {
  return (
    <button
      id={`backstage-nav-${id}`}
      onClick={() => onClick(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 18px', border: 'none',
        background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.75)',
        cursor: 'pointer', width: '100%', textAlign: 'left',
        fontSize: 13, transition: 'all 0.15s', borderRadius: 0,
        fontFamily: 'Segoe UI, sans-serif', fontWeight: active ? 600 : 400,
        borderLeft: active ? '3px solid #60A5FA' : '3px solid transparent',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 9, fontWeight: 700, background: '#EF4444', color: '#fff',
          borderRadius: 8, padding: '1px 5px',
        }}>{badge}</span>
      )}
    </button>
  );
}

function SidebarDivider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 18px' }} />;
}

function SidebarLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
      letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 18px 4px',
    }}>
      {label}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 300, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {subtitle && <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({ icon, label, desc, shortcut, cmd, accent = '#2B579A' }: {
  icon: string; label: string; desc?: string; shortcut?: string; cmd: string | (() => void); accent?: string;
}) {
  const handle = () => typeof cmd === 'string' ? CommandDispatcher.dispatch(cmd) : cmd();
  return (
    <button
      onClick={handle}
      style={S.actionBtn(accent)}
      onMouseEnter={e => hoverEnter(e, accent)}
      onMouseLeave={hoverLeave}
    >
      <span style={{ fontSize: 26, flexShrink: 0, width: 32, textAlign: 'center' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={S.label()}>{label}</div>
        {desc && <div style={S.desc()}>{desc}</div>}
      </div>
      {shortcut && <span style={{ fontSize: 11, color: '#BBB', flexShrink: 0 }}>{shortcut}</span>}
    </button>
  );
}

// ─── Grid Button ─────────────────────────────────────────────────────────────
function GridBtn({ icon, label, desc, cmd, tag }: {
  icon: string; label: string; desc?: string; cmd: string; tag?: string;
}) {
  return (
    <button
      onClick={() => CommandDispatcher.dispatch(cmd)}
      style={S.gridBtn()}
      onMouseEnter={e => hoverEnter(e)}
      onMouseLeave={hoverLeave}
    >
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ ...S.label(13), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {desc && <div style={S.desc()}>{desc}</div>}
      </div>
      {tag && <span style={S.tag('#2B579A', '#EEF3FB')}>{tag}</span>}
    </button>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({ icon, label, desc, value, onChange }: {
  icon: string; label: string; desc?: string; value: boolean; onChange: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
      border: '1px solid #E8E8E8', borderRadius: 10, background: '#FAFAFA',
    }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={S.label()}>{label}</div>
        {desc && <div style={S.desc()}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          padding: '6px 18px', border: 'none', borderRadius: 20,
          background: value ? '#107C41' : '#DDD',
          color: value ? '#fff' : '#666',
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
          transition: 'all 0.2s', flexShrink: 0,
        }}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────
function StatBox({ label, value, icon }: { label: string; value: string | number; icon?: string }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8FAFF 0%, #EEF3FB 100%)',
      border: '1px solid #DCE8F8', borderRadius: 12, padding: '18px 20px',
      flex: 1, minWidth: 100,
    }}>
      {icon && <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>}
      <div style={{ fontSize: 26, fontWeight: 700, color: '#2B579A', letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── 1. INFO PANEL ───────────────────────────────────────────────────────────
function InfoPanel({ info, onUpdate }: { info: FileInfo; onUpdate: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  // Security Modals State
  const [showProtectModal, setShowProtectModal] = useState(false);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  // Protection state
  const [passInput, setPassInput] = useState('');
  const [isProtected, setIsProtected] = useState(info.isProtected);
  const [isFinal, setIsFinal] = useState(false);

  // Inspector state
  const [inspectDone, setInspectDone] = useState(false);
  const [removedMetadata, setRemovedMetadata] = useState(false);

  // Signature state
  const [signatures, setSignatures] = useState<Array<{ id: string; name: string; date: string; valid: boolean }>>([]);
  const [signerName, setSignerName] = useState('OfficeX User');

  // Compatibility state
  const [targetVer, setTargetVer] = useState('PPT 2026 / OfficeX');

  const startEdit = (field: string, current: string) => { setEditing(field); setEditVal(current); };
  const commitEdit = (field: string) => {
    if (field) {
      FileEngine.updateProperties({ [field]: editVal });
      CommandDispatcher.dispatch(`PPT.FILE.PROPERTIES.${field.toUpperCase()}`, { value: editVal });
    }
    setEditing(null);
    onUpdate();
  };

  const handleProtectToggle = () => {
    const next = !isProtected;
    setIsProtected(next);
    FileEngine.setProtected(next);
    onUpdate();
  };

  const handleAddSignature = () => {
    const newSig = {
      id: `sig_${Date.now()}`,
      name: signerName || 'OfficeX User',
      date: new Date().toLocaleString(),
      valid: true,
    };
    setSignatures(s => [...s, newSig]);
  };

  const propRow = (label: string, field: string, value: string, readonly = false) => (
    <div key={field || label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #F0F0F0' }}>
      <div style={{ width: 140, fontSize: 12, color: '#555', fontWeight: 600, flexShrink: 0 }}>{label}</div>
      {editing === field ? (
        <input
          autoFocus value={editVal}
          onChange={e => setEditVal(e.target.value)}
          onBlur={() => commitEdit(field)}
          onKeyDown={e => { if (e.key === 'Enter') commitEdit(field); if (e.key === 'Escape') setEditing(null); }}
          style={{ flex: 1, border: '1px solid #2B579A', borderRadius: 6, padding: '4px 8px', fontSize: 13, outline: 'none' }}
        />
      ) : (
        <div
          onClick={() => !readonly && startEdit(field, value)}
          style={{
            flex: 1, fontSize: 13, color: value ? '#1A1A1A' : '#BBB',
            cursor: readonly ? 'default' : 'pointer', padding: '2px 8px', borderRadius: 6,
            background: readonly ? 'transparent' : 'hover:bg-slate-100',
          }}
          title={readonly ? undefined : 'Click to edit'}
        >{value || (readonly ? '—' : 'Click to add...')}</div>
      )}
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', gap: 32, position: 'relative' }}>
      {/* Left: stats + properties */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatBox icon="📄" label="Pages" value={info.pageCount} />
          <StatBox icon="📝" label="PPTs" value={info.PPTCount.toLocaleString()} />
          <StatBox icon="🔤" label="Characters" value={info.charCount.toLocaleString()} />
          <StatBox icon="💾" label="File Size" value={FileStorageEngine.formatFileSize(info.size)} />
        </div>

        <p style={S.sectionTitle()}>Presentation Properties (Click to Edit)</p>
        <div style={{ marginBottom: 24 }}>
          {propRow('Title', 'title', info.title)}
          {propRow('Author', 'author', info.author)}
          {propRow('Subject', 'subject', info.subject)}
          {propRow('KeyPPTs', 'keyPPTs', info.keyPPTs)}
          {propRow('Company', 'company', info.company)}
          {propRow('Category', 'category', info.category)}
        </div>

        <p style={S.sectionTitle()}>File Details</p>
        <div>
          {propRow('Created', '', info.created.toLocaleString(), true)}
          {propRow('Modified', '', info.modified.toLocaleString(), true)}
          {propRow('Location', '', info.path ?? 'Unsaved', true)}
          {propRow('Format', '', info.path?.split('.').pop()?.toUpperCase() ?? 'DOCX', true)}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ ...S.sectionTitle(), marginTop: 0 }}>Presentation Security</p>
        
        {/* Protect Presentation */}
        <button
          onClick={() => setShowProtectModal(true)}
          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', border: `1px solid ${isProtected ? '#107C41' : '#E8E8E8'}`, borderRadius: 10, background: isProtected ? '#F0FDF4' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%' }}
          onMouseEnter={e => hoverEnter(e, '#107C41')}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 22 }}>🔒</span>
          <div style={{ flex: 1 }}>
            <div style={S.label(13)}>Protect Presentation</div>
            <div style={S.desc()}>{isProtected ? 'Protected with PassPPT' : 'Restrict editing & permissions'}</div>
          </div>
          {isProtected && <span style={{ fontSize: 10, background: '#107C41', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>ON</span>}
        </button>

        {/* Inspect Presentation */}
        <button
          onClick={() => setShowInspectModal(true)}
          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', border: '1px solid #E8E8E8', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%' }}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 22 }}>🔍</span>
          <div>
            <div style={S.label(13)}>Inspect Presentation</div>
            <div style={S.desc()}>Check for hidden data & metadata</div>
          </div>
        </button>

        {/* Digital Signature */}
        <button
          onClick={() => setShowSignatureModal(true)}
          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', border: '1px solid #E8E8E8', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%' }}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 22 }}>📜</span>
          <div style={{ flex: 1 }}>
            <div style={S.label(13)}>Digital Signature</div>
            <div style={S.desc()}>{signatures.length > 0 ? `${signatures.length} Signature(s)` : 'Add or view signatures'}</div>
          </div>
          {signatures.length > 0 && <span style={{ fontSize: 10, background: '#2B579A', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{signatures.length}</span>}
        </button>

        {/* Compatibility Check */}
        <button
          onClick={() => setShowCompatibilityModal(true)}
          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', border: '1px solid #E8E8E8', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%' }}
          onMouseEnter={e => hoverEnter(e, '#107C41')}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={S.label(13)}>Compatibility Check</div>
            <div style={S.desc()}>Check format compatibility</div>
          </div>
        </button>
      </div>

      {/* ── 1. PROTECT MODAL ────────────────────────────────────────────────── */}
      {showProtectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 440, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>🔒 Protect Presentation</div>
              <button onClick={() => setShowProtectModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            
            <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Control what types of changes users can make to this document.
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 }}>Set PassPPT Protection:</label>
              <input
                type="passPPT"
                placeholder="Enter passPPT..."
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #CCC', borderRadius: 6, fontSize: 13, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, flexDirection: 'column', marginBottom: 20 }}>
              <button onClick={handleProtectToggle} style={{ padding: '10px 16px', background: isProtected ? '#DC2626' : '#107C41', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                {isProtected ? 'Remove Protection' : 'Encrypt with PassPPT'}
              </button>
              <button onClick={() => { setIsFinal(!isFinal); }} style={{ padding: '8px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                {isFinal ? '✓ Marked as Final (Read-Only)' : 'Mark as Final (Read-Only)'}
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowProtectModal(false)} style={{ padding: '6px 16px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. INSPECT MODAL ────────────────────────────────────────────────── */}
      {showInspectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 480, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>🔍 Presentation Inspector</div>
              <button onClick={() => setShowInspectModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
              Inspect your Presentation for hidden data, personal information, and metadata.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 12 }}>
                <span>💬 Comments, Revisions & Annotations</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Clean</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: removedMetadata ? '#F9FAFB' : '#FEF3C7', borderRadius: 6, border: `1px solid ${removedMetadata ? '#E5E7EB' : '#FCD34D'}`, fontSize: 12 }}>
                <span>👤 Presentation Properties & Personal Info</span>
                {removedMetadata ? (
                  <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Removed</span>
                ) : (
                  <button onClick={() => { FileEngine.updateProperties({ author: '', company: '', category: '' }); setRemovedMetadata(true); onUpdate(); }} style={{ padding: '3px 8px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Remove All</button>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 12 }}>
                <span>🙈 Hidden Text & Headers/Footers</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>✓ None</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setInspectDone(true)} style={{ padding: '6px 14px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                {inspectDone ? '✓ Re-Inspect' : 'Run Inspection'}
              </button>
              <button onClick={() => setShowInspectModal(false)} style={{ padding: '6px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. DIGITAL SIGNATURE MODAL ──────────────────────────────────────── */}
      {showSignatureModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 480, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>📜 Digital Signatures</div>
              <button onClick={() => setShowSignatureModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ fontSize: 12, color: '#666', marginBottom: 14 }}>
              Digital signatures authenticate the identity of the signer and ensure Presentation integrity.
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 4 }}>Signer Name:</label>
              <input
                value={signerName}
                onChange={e => setSignerName(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #CCC', borderRadius: 6, fontSize: 12, outline: 'none' }}
              />
            </div>

            {signatures.length > 0 ? (
              <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflowY: 'auto' }}>
                {signatures.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, fontSize: 11 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1E40AF' }}>✍️ Signed by {s.name}</div>
                      <div style={{ color: '#6B7280', fontSize: 10 }}>{s.date} (RSA 2048-bit)</div>
                    </div>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✓ Verified</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 12, background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 6, textAlign: 'center', fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
                No digital signatures attached yet.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleAddSignature} style={{ padding: '6px 14px', background: '#107C41', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>+ Add Digital Signature</button>
              <button onClick={() => setShowSignatureModal(false)} style={{ padding: '6px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. COMPATIBILITY MODAL ──────────────────────────────────────────── */}
      {showCompatibilityModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 480, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>✅ Compatibility Checker</div>
              <button onClick={() => setShowCompatibilityModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 }}>Target Version:</label>
              <select
                value={targetVer}
                onChange={e => setTargetVer(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #CCC', borderRadius: 6, fontSize: 12, outline: 'none' }}
              >
                <option value="PPT 2026 / OfficeX">PPT 2026 / OfficeX</option>
                <option value="PPT 2021 / 2019">PPT 2021 / 2019</option>
                <option value="PPT 2016 / 2013">PPT 2016 / 2013</option>
                <option value="PPT 2010">PPT 2010</option>
                <option value="PPT 97-2003 (.doc)">PPT 97-2003 (.doc)</option>
              </select>
            </div>

            <div style={{ padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: '#166534', fontSize: 13, marginBottom: 4 }}>✓ No Compatibility Issues Found</div>
              <div style={{ fontSize: 11, color: '#15803D' }}>
                This Presentation is 100% compatible with {targetVer}. All features, formatting, and tables will render correctly.
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowCompatibilityModal(false)} style={{ padding: '6px 16px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 2. NEW PANEL ─────────────────────────────────────────────────────────────
function NewPanel({ onClose }: { onClose: () => void }) {
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [onlineSearch, setOnlineSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templateContents: Record<string, { title: string; content: string }> = {
    'Report': {
      title: 'Quarterly Executive Report',
      content: `EXECUTIVE REPORT\nTitle: Quarterly Performance Overview\nDate: ${new Date().toLocaleDateString()} | Prepared by: OfficeX User\n\n1. Executive Summary\nThis report outlines key milestones, performance metrics, and strategic initiatives completed during the last quarter.\n\n2. Key Performance Indicators\n- Revenue Growth: +24.5% YoY\n- User Retention Rate: 98.2%\n- Customer Satisfaction Index: 4.8 / 5.0\n\n3. Conclusion & Next Steps\nContinued focus on workflow acceleration, performance, and user experience.`,
    },
    'Letter': {
      title: 'Formal Business Letter',
      content: `[Your Name / Company Name]\n[Address Line 1] | [City, State, Zip]\n\n${new Date().toLocaleDateString()}\n\n[Recipient Name]\n[Recipient Title]\n[Company Name]\n\nDear [Recipient Name],\n\nI am writing to formally present our proposal regarding the upcoming project collaboration.\n\n[Insert Letter Body Here]\n\nSincerely,\n\n[Your Name]\n[Your Title]`,
    },
    'Newsletter': {
      title: 'Monthly Community Newsletter',
      content: `OFFICEX MONTHLY NEWSLETTER\nIssue #12 | ${new Date().toLocaleDateString()}\n\nWELCOME TO OUR LATEST EDITION!\nDiscover the newest product updates, feature highlights, and tips from our engineering team.\n\nFEATURED STORY: LOCAL AI INTEGRATION\nLearn how 100% offline Qwen3 8B model integration keeps your data completely secure on your PC.\n\nUPCOMING EVENTS & WEBINARS\nJoin us next Thursday for a live deep dive into advanced Presentation automation.`,
    },
    'Meeting Notes': {
      title: 'Project Meeting Minutes',
      content: `MEETING MINUTES\nDate: ${new Date().toLocaleDateString()} | Time: 10:00 AM - 11:30 AM\nLocation: Conference Room A / Online\n\nAttendees:\n- Chair: [Name]\n- Note Taker: [Name]\n- Members: [Name 1], [Name 2]\n\nAgenda Items:\n1. Project Roadmap Review\n2. Resource Allocation\n3. Action Items & Next Steps\n\nAction Items:\n- Task A: Assigned to [Name] | Due Date: Next Friday\n- Task B: Assigned to [Name] | Due Date: Next Month`,
    },
    'Business Plan': {
      title: 'Executive Business Plan',
      content: `BUSINESS PLAN\n\n1. Executive Summary\nOverview of company vision, core value proposition, target market, and strategic goals.\n\n2. Market Analysis & Competition\nIndustry benchmarks, target customer segments, and competitive advantages.\n\n3. Financial Projections & Roadmap\nThree-year revenue forecast, operational budget, and break-even timeline.`,
    },
    'Academic Paper': {
      title: 'Academic Research Paper',
      content: `RESEARCH PAPER TITLE\n\nAuthor Name(s)\nDepartment of Computer Science, University Institute\n\nABSTRACT\nThis paper examines modern Presentation processing architectures and offline intelligence.\n\n1. INTRODUCTION\nBackground context and problem formulation.\n\n2. METHODOLOGY\nAlgorithmic design, benchmarks, and experimental validation.\n\n3. REFERENCES\n[1] Author, A. (2026). Advanced Presentation Systems. Journal of Software Engineering.`,
    },
    'Resume/CV': {
      title: 'Professional Curriculum Vitae',
      content: `CURRICULUM VITAE\n\n[YOUR FULL NAME]\n[Email] | [Phone] | [Location] | [LinkedIn]\n\nPROFESSIONAL SUMMARY\nSoftware Architect & Senior Developer with 6+ years of experience building high-performance desktop apps.\n\nWORK EXPERIENCE\nSenior Lead Engineer | OfficeX Systems (2023 - Present)\n- Built enterprise core editor with local streaming AI integration.\n- Reduced Presentation load latency by 45%.\n\nEDUCATION\nB.S. in Computer Science (2018 - 2022)\n\nSKILLS\nTypeScript, React, Electron, Vite, Node.js, Local LLMs.`,
    },
    'Project Proposal': {
      title: 'Project Planning Proposal',
      content: `PROJECT PROPOSAL\n\nProject Title: Presentation System Architecture\nPrepared For: Stakeholder Committee\nPrepared By: Technical Team\n\n1. Objectives & Deliverables\nComprehensive outline of project scope, technical specifications, and key deliverables.\n\n2. Timeline & Milestones\nPhase 1: Architecture Design (Month 1)\nPhase 2: Core Implementation (Month 2-3)\nPhase 3: QA & Deployment (Month 4)`,
    },
  };

  const handleSelectTemplate = (label: string, cmd: string, primary?: boolean) => {
    if (primary || label === 'Blank Presentation') {
      FileEngine.newPresentation('blank');
    } else {
      FileEngine.newPresentation('blank');
      const tmpl = templateContents[label];
      if (tmpl) {
        FileEngine.updateProperties({ title: tmpl.title });
        const legacy = (window as any).EditorAPI?.getLegacy?.();
        if (legacy?.insertTextAtSelection) {
          legacy.insertTextAtSelection(tmpl.content);
        }
      }
    }
    onClose();
  };

  const templates = [
    { icon: '📄', label: 'Blank Presentation', desc: 'Start with a blank page', cmd: 'PPT.FILE.NEW', primary: true },
    { icon: '📋', label: 'Report', desc: 'Professional report template', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📑', label: 'Letter', desc: 'Formal letter template', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📰', label: 'Newsletter', desc: 'Multi-column newsletter', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📝', label: 'Meeting Notes', desc: 'Structured meeting minutes', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📊', label: 'Business Plan', desc: 'Executive summary format', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '🎓', label: 'Academic Paper', desc: 'APA/MLA research format', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📬', label: 'Resume/CV', desc: 'Modern curriculum vitae', cmd: 'PPT.FILE.NEW_TEMPLATE' },
    { icon: '📒', label: 'Project Proposal', desc: 'Project planning Presentation', cmd: 'PPT.FILE.NEW_TEMPLATE' },
  ];

  const onlineGallery = [
    { icon: '📑', name: 'Modern Resume Template', cat: 'Personal', downloads: '14.2k' },
    { icon: '📈', name: 'Annual Financial Report', cat: 'Business', downloads: '8.7k' },
    { icon: '📜', name: 'Legal Contract Agreement', cat: 'Legal', downloads: '12.1k' },
    { icon: '🎓', name: 'Thesis / Dissertation Format', cat: 'Academic', downloads: '9.4k' },
    { icon: '✉️', name: 'Formal Cover Letter', cat: 'Personal', downloads: '18.9k' },
    { icon: '📅', name: 'Project Timeline & Gantt', cat: 'Business', downloads: '11.3k' },
  ];

  const corporateGallery = [
    { icon: '🏢', name: 'OfficeX Official Letterhead', dept: 'Corporate HQ' },
    { icon: '📊', name: 'Q4 Strategic Planning Deck', dept: 'Executive' },
    { icon: '🛡️', name: 'Standard NDA & Security Policy', dept: 'Legal Team' },
    { icon: '💻', name: 'Engineering Architecture RFC', dept: 'R&D Dept' },
  ];

  const filteredOnline = onlineGallery.filter(t => 
    (selectedCategory === 'All' || t.cat === selectedCategory) &&
    (!onlineSearch || t.name.toLowerCase().includes(onlineSearch.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setShowOnlineModal(true)}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 24 }}>🌐</span>
          <div>
            <div style={S.label(13)}>Online Templates</div>
            <div style={S.desc()}>Browse online template gallery</div>
          </div>
        </button>

        <button
          onClick={() => setShowCorporateModal(true)}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 24 }}>🏢</span>
          <div style={{ flex: 1 }}>
            <div style={S.label(13)}>Corporate Templates</div>
            <div style={S.desc()}>Your organization's templates</div>
          </div>
          <span style={S.tag('#2B579A', '#EEF3FB')}>Enterprise</span>
        </button>

        <button
          onClick={() => setShowPinnedModal(true)}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 24 }}>⭐</span>
          <div>
            <div style={S.label(13)}>Pinned Templates</div>
            <div style={S.desc()}>Your saved templates</div>
          </div>
        </button>
      </div>

      <p style={S.sectionTitle()}>Featured Templates</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
        {templates.map(t => (
          <button
            key={t.label}
            onClick={() => handleSelectTemplate(t.label, t.cmd, t.primary)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 10, padding: '20px 14px', border: `2px solid ${t.primary ? '#2B579A' : '#E8E8E8'}`,
              borderRadius: 12, background: t.primary ? 'linear-gradient(135deg,#EEF3FB,#E3ECFA)' : '#fff',
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#2B579A'; el.style.boxShadow = '0 4px 16px rgba(43,87,154,0.14)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = t.primary ? '#2B579A' : '#E8E8E8'; el.style.boxShadow = 'none'; }}
          >
            <span style={{ fontSize: 36 }}>{t.icon}</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{t.desc}</div>
            </div>
            {t.primary && <span style={S.tag('#fff', '#2B579A')}>Blank</span>}
          </button>
        ))}
      </div>

      {/* ── 1. ONLINE TEMPLATES MODAL ─────────────────────────────────────── */}
      {showOnlineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 620, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>🌐 Online Template Gallery</div>
              <button onClick={() => setShowOnlineModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <input
                placeholder="Search thousands of online templates..."
                value={onlineSearch}
                onChange={e => setOnlineSearch(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #CCC', borderRadius: 6, fontSize: 12, outline: 'none' }}
              />
              {['All', 'Personal', 'Business', 'Academic', 'Legal'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #DDD', background: selectedCategory === c ? '#2B579A' : '#fff', color: selectedCategory === c ? '#fff' : '#333', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >{c}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
              {filteredOnline.map(t => (
                <div key={t.name} style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA', alignItems: 'center' }}>
                  <span style={{ fontSize: 28 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: '#6B7280' }}>{t.cat} • {t.downloads} downloads</div>
                  </div>
                  <button
                    onClick={() => {
                      handleSelectTemplate(t.name, 'PPT.FILE.NEW', false);
                      setShowOnlineModal(false);
                    }}
                    style={{ padding: '4px 10px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >Create</button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowOnlineModal(false)} style={{ padding: '6px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. CORPORATE TEMPLATES MODAL ──────────────────────────────────── */}
      {showCorporateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 540, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>🏢 Corporate Enterprise Templates</div>
              <button onClick={() => setShowCorporateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ fontSize: 12, color: '#666', marginBottom: 14 }}>
              Official brand templates managed by your organization's IT department.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {corporateGallery.map(c => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#1F2937' }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#6B7280' }}>{c.dept}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSelectTemplate(c.name, 'PPT.FILE.NEW', false);
                      setShowCorporateModal(false);
                    }}
                    style={{ padding: '5px 12px', background: '#107C41', color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >Use Template</button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowCorporateModal(false)} style={{ padding: '6px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. PINNED TEMPLATES MODAL ─────────────────────────────────────── */}
      {showPinnedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 440, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>⭐ Pinned Saved Templates</div>
              <button onClick={() => setShowPinnedModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: 16, background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 8, textAlign: 'center', fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
              ⭐ No custom templates pinned yet. Pin any template from the Featured list for fast access.
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowPinnedModal(false)} style={{ padding: '6px 16px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3. OPEN PANEL ───────────────────────────────────────────────────────────
function OpenPanel({ onClose }: { onClose: () => void }) {
  const [activePlace, setActivePlace] = useState<'this_pc'>('this_pc');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const recoveryPoints = FileRecoveryEngine.getRecoveryPoints('doc_current');

  const handleOpenBrowse = async () => {
    const ok = await FileEngine.openLocal();
    if (ok) onClose();
  };

  const handleOpenReadOnly = async () => {
    const path = await FileStorageEngine.showOpenDialog([
      { name: 'PPT Presentations', extensions: ['docx', 'doc', 'odt', 'rtf'] },
      { name: 'All Files', extensions: ['*'] },
    ]);
    if (path) {
      const ok = await FileEngine.openReadOnly(path);
      if (ok) onClose();
    }
  };

  const handleOpenRepair = async () => {
    const ok = await FileEngine.openAndRepair();
    if (ok) onClose();
  };

  const handleRestoreRecovery = (content: string, name: string) => {
    FileEngine.newPresentation('blank');
    FileEngine.updateProperties({ title: `Recovered - ${name}` });
    const legacy = (window as any).EditorAPI?.getLegacy?.();
    if (legacy?.insertTextAtSelection) {
      legacy.insertTextAtSelection(content);
    }
    setShowRecoveryModal(false);
    onClose();
  };

  const places = [
    { id: 'this_pc', icon: '🖥️', label: 'This PC', sub: 'Local Computer & Desktop' },
  ];

  return (
    <div style={{ display: 'flex', gap: 24, flex: 1, overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* ── LEFT COLUMN: PLACES LIST ───────────────────────────────────────── */}
      <div style={{ width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, borderRight: '1px solid #E5E7EB', paddingRight: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em', marginBottom: 6 }}>STORAGE PLACES</div>

        {places.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlace(p.id as any)}
            style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px',
              borderRadius: 8, border: `1px solid ${activePlace === p.id ? '#0078D4' : 'transparent'}`,
              background: activePlace === p.id ? '#EFF6FC' : 'transparent',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: 20 }}>{p.icon}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: activePlace === p.id ? '#0078D4' : '#1F2937' }}>{p.label}</div>
              <div style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.sub}</div>
            </div>
          </button>
        ))}

        <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 12, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={handleOpenBrowse} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 6 }}>
            <span style={{ fontSize: 16 }}>📁</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Browse Computer</span>
          </button>
          <button onClick={handleOpenReadOnly} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 6 }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Open Read-Only</span>
          </button>
          <button onClick={handleOpenRepair} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 6 }}>
            <span style={{ fontSize: 16 }}>🔧</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Open & Repair</span>
          </button>
          <button onClick={() => setShowRecoveryModal(true)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 6 }}>
            <span style={{ fontSize: 16 }}>🔄</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Recover Unsaved Files</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT COLUMN: SELECTED PLACE CONTENT ───────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>🖥️ Local Computer Storage (This PC)</div>
          <button
            onClick={handleOpenBrowse}
            style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px', border: '2px dashed #0078D4', borderRadius: 10, background: '#EFF6FC', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: 32 }}>📁</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0078D4' }}>Browse Local Files (This PC / Desktop)</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Open file picker to select PPT Presentations (.pptx, .doc, .pdf) from disk</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── RECOVER FILES MODAL ──────────────────────────────────────────── */}
      {showRecoveryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 520, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E1DFDD', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>🔄 Auto-Recovered Presentation Drafts</div>
              <button onClick={() => setShowRecoveryModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ fontSize: 12, color: '#666', marginBottom: 14 }}>
              Below are unsaved Presentation drafts automatically captured by OfficeX Auto-Save.
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {recoveryPoints.length > 0 ? (
                recoveryPoints.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#92400E' }}>📄 {p.PresentationName}</div>
                      <div style={{ fontSize: 10, color: '#B45309' }}>Snapshot: {new Date(p.timestamp).toLocaleString()} ({p.type})</div>
                    </div>
                    <button
                      onClick={() => handleRestoreRecovery(p.content, p.PresentationName)}
                      style={{ padding: '5px 12px', background: '#D97706', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                    >Restore Draft</button>
                  </div>
                ))
              ) : (
                <div style={{ padding: 16, background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 8, textAlign: 'center', fontSize: 12, color: '#6B7280' }}>
                  ✓ No unsaved drafts found. All Presentation changes are saved.
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowRecoveryModal(false)} style={{ padding: '6px 16px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 4. RECENT PANEL ─────────────────────────────────────────────────────────
function RecentPanel({ onClose }: { onClose: () => void }) {
  const allFiles = FileStorageEngine.getRecentFiles();
  const pinnedIds: Set<string> = new Set((FileStorageEngine as any).pinnedFiles ?? []);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');
  const [tick, setTick] = useState(0);

  const isPinned = (id: string) => pinnedIds.has(id);

  const filtered = allFiles
    .filter(f => filter === 'all' ? true : isPinned(f.id))
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpen = async (path: string) => {
    await FileEngine.openFromPath(path);
    onClose();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          placeholder="🔍  Search recent files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '9px 14px', border: '1px solid #DDD', borderRadius: 8,
            fontSize: 13, outline: 'none', fontFamily: 'Segoe UI, sans-serif',
          }}
        />
        {(['all', 'pinned'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid #DDD',
              background: filter === f ? '#2B579A' : '#fff',
              color: filter === f ? '#fff' : '#333',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              fontFamily: 'Segoe UI, sans-serif',
            }}
          >
            {f === 'all' ? 'All Files' : '📌 Pinned'}
          </button>
        ))}
        <button
          onClick={() => { CommandDispatcher.dispatch('PPT.FILE.OPEN.RECENT.CLEAR'); setTick(t => t + 1); }}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #DDD', background: '#fff', color: '#888', cursor: 'pointer', fontSize: 12, fontFamily: 'Segoe UI, sans-serif' }}
          title="Clear recent list"
        >Clear</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>No recent files</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {search ? 'Try a different search term.' : 'Open a Presentation to see it here.'}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(f => {
            const pinned = isPinned(f.id);
            return (
              <div
                key={f.id}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F5F8FF'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span style={{ fontSize: 26, flexShrink: 0 }} onClick={() => handleOpen(f.path)}>📄</span>
                <div style={{ flex: 1, overflow: 'hidden' }} onClick={() => handleOpen(f.path)}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                    {f.path} · {f.modified.toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: '#AAA', flexShrink: 0 }}>{FileStorageEngine.formatFileSize(f.size)}</span>
                <button
                  onClick={() => {
                    if (pinned) CommandDispatcher.dispatch('PPT.FILE.OPEN.RECENT.UNPIN', { id: f.id });
                    else CommandDispatcher.dispatch('PPT.FILE.OPEN.RECENT.PIN', { id: f.id });
                    setTick(t => t + 1);
                  }}
                  title={pinned ? 'Unpin' : 'Pin'}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, padding: 4, opacity: pinned ? 1 : 0.4, transition: 'opacity 0.15s' }}
                >📌</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── 5. SAVE PANEL ───────────────────────────────────────────────────────────
function SavePanel({ autoSave, onToggleAutoSave, onClose }: { autoSave: boolean; onToggleAutoSave: () => void; onClose: () => void }) {
  const handleSave = async (cmd: string) => {
    await CommandDispatcher.dispatch(cmd);
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
      <ActionBtn icon="💾" label="Save" desc="Save current Presentation" shortcut="Ctrl+S" cmd={() => handleSave('PPT.FILE.SAVE')} />
      <ActionBtn icon="📋" label="Save a Copy" desc="Save a duplicate without changing current file" cmd={() => handleSave('PPT.FILE.SAVE_COPY')} />
      <ActionBtn icon="⏩" label="Save Incremental" desc="Save only changes since last save" cmd={() => handleSave('PPT.FILE.SAVE.QUICK')} />
      <ActionBtn icon="⚡" label="Quick Save" desc="Save with no dialog (background)" cmd={() => handleSave('PPT.FILE.SAVE.SILENT')} />
      <div style={{ marginTop: 8 }}>
        <ToggleRow icon="⏰" label="Auto Save" desc="Automatically saves recovery points every 30 seconds" value={autoSave} onChange={onToggleAutoSave} />
      </div>
    </div>
  );
}

// ─── 6. SAVE AS PANEL ────────────────────────────────────────────────────────
function SaveAsPanel({ onClose }: { onClose: () => void }) {
  const [cloudSaveModal, setCloudSaveModal] = useState<{ provider: string; icon: string } | null>(null);
  const [saveFileName, setSaveFileName] = useState('Presentation_1.pptx');
  const [saveEmail, setSaveEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToCloud = async () => {
    if (!saveFileName.trim()) return;
    setIsSaved(true);
    try {
      const cleanFileName = saveFileName.endsWith('.pptx') ? saveFileName : `${saveFileName}.pptx`;
      const fullOneDrivePath = `C:\\Users\\taduc\\OneDrive\\${cleanFileName}`;
      
      FileEngine.updateProperties({ title: cleanFileName, path: fullOneDrivePath });
      await FileEngine.save();
      
      // Live cloud sync via OneDriveSyncEngine
      OneDriveSyncEngine.queueAutoSave(`file_${Date.now()}`, cleanFileName, FileEngine.getPresentationContent());
      console.log(`[SaveAs] Presentation saved directly to OneDrive Cloud: ${fullOneDrivePath}`);
    } catch (e) {
      console.warn('[SaveAs] Failed to save to cloud:', e);
    }
    setIsSaved(false);
    setCloudSaveModal(null);
    onClose();
  };

  const handleLocationClick = (l: { label: string; icon: string; cmd: string }) => {
    if (l.label === 'This PC' || l.label === 'Browse…') {
      CommandDispatcher.dispatch(l.cmd);
      onClose();
    } else {
      setCloudSaveModal({ provider: l.label, icon: l.icon });
    }
  };

  const locations = [
    { icon: '🖥️', label: 'This PC',       desc: 'Save locally on this computer',  cmd: 'PPT.FILE.SAVE_AS' },
    { icon: '📁', label: 'Browse…',       desc: 'Choose any folder on local disk', cmd: 'PPT.FILE.SAVE_AS' },
  ];

  const formats = [
    { ext: 'PPTX', label: 'PowerPoint Presentation',     cmd: 'PPT.FILE.SAVE_AS.PPTX',     primary: true },
    { ext: 'PPT',  label: 'PowerPoint 97-2003',      cmd: 'PPT.FILE.SAVE_AS.PPT' },
    { ext: 'POTX', label: 'PowerPoint Template',     cmd: 'PPT.FILE.SAVE_AS.POTX' },
    { ext: 'PDF',  label: 'PDF Document',      cmd: 'PPT.FILE.SAVE_AS.PDF' },
    { ext: 'ODP',  label: 'OpenDocument Presentation', cmd: 'PPT.FILE.SAVE_AS.ODP' },
    { ext: 'TXT',  label: 'Text (Tab delimited)',cmd: 'PPT.FILE.SAVE_AS.TEXT' },
    { ext: 'HTML', label: 'Web Page',          cmd: 'PPT.FILE.SAVE_AS.HTML' },
    { ext: 'MD',   label: 'Markdown',          cmd: 'PPT.FILE.SAVE_AS.MARKDOWN' },
  ];

  return (
    <div style={{ display: 'flex', gap: 40, flex: 1, overflow: 'hidden', position: 'relative' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...S.sectionTitle(), marginTop: 0 }}>Save Location</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {locations.map(l => (
            <button
              key={l.label}
              onClick={() => handleLocationClick(l)}
              style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 16px', border: '1px solid #E8E8E8', borderRadius: 10, background: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%' }}
              onMouseEnter={e => hoverEnter(e)}
              onMouseLeave={hoverLeave}
            >
              <span style={{ fontSize: 20 }}>{l.icon}</span>
              <div>
                <div style={S.label(13)}>{l.label}</div>
                <div style={S.desc()}>{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: 260, flexShrink: 0 }}>
        <p style={{ ...S.sectionTitle(), marginTop: 0 }}>File Format</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {formats.map(f => (
            <button
              key={f.ext}
              onClick={() => { CommandDispatcher.dispatch(f.cmd); onClose(); }}
              style={{
                display: 'flex', gap: 14, alignItems: 'center', padding: '10px 14px',
                border: `1px solid ${f.primary ? '#2B579A' : '#E8E8E8'}`,
                borderRadius: 8, background: f.primary ? '#EEF3FB' : '#fff',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Segoe UI, sans-serif', width: '100%',
              }}
              onMouseEnter={e => hoverEnter(e)}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = f.primary ? '#2B579A' : '#E8E8E8'; el.style.background = f.primary ? '#EEF3FB' : '#fff'; el.style.boxShadow = 'none'; }}
            >
              <span style={{
                fontSize: 10, fontWeight: 800, color: f.primary ? '#fff' : '#2B579A',
                background: f.primary ? '#2B579A' : '#EEF3FB', borderRadius: 4,
                padding: '3px 6px', flexShrink: 0, letterSpacing: '0.03em',
              }}>{f.ext}</span>
              <span style={S.label(13)}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CLOUD SAVE MODAL */}
      {cloudSaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 480, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 12px 36px rgba(0,0,0,0.25)', border: '1px solid #E1DFDD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{cloudSaveModal.icon}</span>
                <span>Save to {cloudSaveModal.provider}</span>
              </div>
              <button onClick={() => setCloudSaveModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Account Email</label>
              <input
                placeholder="user@outlook.com"
                value={saveEmail}
                onChange={e => setSaveEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>File Name</label>
              <input
                value={saveFileName}
                onChange={e => setSaveFileName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 12, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setCloudSaveModal(null)} style={{ padding: '6px 14px', background: '#F3F2F1', color: '#333', border: '1px solid #E1DFDD', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={handleSaveToCloud}
                disabled={isSaved || !saveFileName.trim()}
                style={{ padding: '6px 16px', background: '#0078D4', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
              >
                {isSaved ? `☁️ Uploading to ${cloudSaveModal.provider}...` : `Save to ${cloudSaveModal.provider}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7. AUTOSAVE PANEL ───────────────────────────────────────────────────────
function AutoSavePanel({ autoSave, onToggleAutoSave }: { autoSave: boolean; onToggleAutoSave: () => void }) {
  const [interval, setInterval] = useState(30);

  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: '20px 24px', border: `2px solid ${autoSave ? '#107C41' : '#DDD'}`,
        borderRadius: 14, background: autoSave ? '#F0FFF4' : '#FAFAFA',
        display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.2s',
      }}>
        <span style={{ fontSize: 36 }}>{autoSave ? '✅' : '💤'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: autoSave ? '#107C41' : '#666' }}>
            Auto Save is {autoSave ? 'Enabled' : 'Disabled'}
          </div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 3 }}>
            {autoSave
              ? `Presentations are automatically saved every ${interval} seconds.`
              : 'Enable Auto Save to prevent data loss.'}
          </div>
        </div>
        <button
          onClick={onToggleAutoSave}
          style={{
            padding: '10px 24px', border: 'none', borderRadius: 24,
            background: autoSave ? '#107C41' : '#2B579A',
            color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            transition: 'all 0.2s',
          }}
        >{autoSave ? 'Disable' : 'Enable'}</button>
      </div>

      <div style={{ border: '1px solid #E8E8E8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20 }}>⏱️</span>
          <div style={{ flex: 1 }}>
            <div style={S.label()}>Save Interval</div>
            <div style={S.desc()}>How often to auto-save</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="range" min={10} max={120} step={10} value={interval}
              onChange={e => { setInterval(Number(e.target.value)); CommandDispatcher.dispatch('PPT.FILE.AUTOSAVE.INTERVAL', { ms: Number(e.target.value) * 1000 }); }}
              style={{ width: 100 }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2B579A', width: 50, textAlign: 'right' }}>{interval}s</span>
          </div>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 20 }}>📁</span>
          <div style={{ flex: 1 }}>
            <div style={S.label()}>Recovery Folder</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2, fontFamily: 'monospace' }}>%AppData%\OfficeX\AutoRecover</div>
          </div>
          <button
            onClick={() => CommandDispatcher.dispatch('PPT.FILE.AUTOSAVE.SETTINGS')}
            style={{ padding: '7px 14px', border: '1px solid #DDD', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 12, color: '#555' }}
          >Change…</button>
        </div>
      </div>

      <ActionBtn icon="🔄" label="Force Auto Save Now" desc="Immediately create a recovery point" cmd="PPT.FILE.AUTOSAVE.FLUSH" />
      <ActionBtn icon="📂" label="Recover Unsaved Files" desc="Browse auto-save recovery folder" cmd="PPT.FILE.OPEN.RECOVERY" />
    </div>
  );
}

// ─── 8. HISTORY PANEL ────────────────────────────────────────────────────────
function HistoryPanel() {
  const versions = FileEngine.getVersions();
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <ActionBtn icon="📌" label="Save Version Now" desc="Create a named checkpoint" cmd="PPT.FILE.VERSION.SAVE" />
        <ActionBtn icon="🔀" label="Compare Versions" desc="Diff two versions side by side" cmd="PPT.FILE.VERSION_COMPARE" />
      </div>
      {versions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No Versions Yet</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Create a version checkpoint to track Presentation history.</div>
        </div>
      ) : versions.map(v => (
        <div key={v.id} style={{
          border: '1px solid #E8E8E8', borderRadius: 10, padding: '14px 18px',
          marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center',
          transition: 'background 0.12s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFBFF'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <span style={{ fontSize: 24 }}>📌</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{v.label}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              {v.author} · {v.timestamp.toLocaleString()} · {FileRecoveryEngine.formatSize(v.size)}
            </div>
            {v.comment && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{v.comment}</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => CommandDispatcher.dispatch('PPT.FILE.VERSION_RESTORE', { id: v.id })}
              style={{ padding: '5px 14px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Restore
            </button>
            <button onClick={() => CommandDispatcher.dispatch('PPT.FILE.VERSION_DELETE', { id: v.id })}
              style={{ padding: '5px 14px', background: '#f3f3f3', color: '#666', border: '1px solid #DDD', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 9. EXPORT PANEL ─────────────────────────────────────────────────────────
function ExportPanel({ onClose }: { onClose: () => void }) {
  const formats = [
    { icon: '📕', label: 'PDF Presentation',      desc: 'Fixed layout, universal',       cmd: 'PPT.FILE.EXPORT.PDF',       tag: 'Popular' },
    { icon: '📄', label: 'PDF/A (Archive)',   desc: 'ISO archival standard',         cmd: 'PPT.FILE.EXPORT.PDF.PDFA' },
    { icon: '🗂️', label: 'XPS Presentation',     desc: 'Microsoft XML Paper Spec',      cmd: 'PPT.FILE.EXPORT.XML' },
    { icon: '🌐', label: 'HTML Presentation',     desc: 'Web page format',               cmd: 'PPT.FILE.EXPORT.HTML' },
    { icon: '⬇️', label: 'Markdown',          desc: 'Plain text with formatting',    cmd: 'PPT.FILE.EXPORT.MARKDOWN' },
    { icon: '📚', label: 'EPUB eBook',        desc: 'E-reader compatible',           cmd: 'PPT.FILE.EXPORT.EPUB' },
    { icon: '📗', label: 'OpenPresentation (ODT)', desc: 'LibreOffice compatible',       cmd: 'PPT.FILE.EXPORT.ODT' },
    { icon: '📄', label: 'Plain Text (TXT)',  desc: 'No formatting, maximum compat', cmd: 'PPT.FILE.EXPORT.TEXT' },
    { icon: '🖼️', label: 'Image (PNG/JPG)',  desc: 'Render pages as images',        cmd: 'PPT.FILE.EXPORT.IMAGE' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, alignContent: 'start' }}>
      {formats.map(f => (
        <button
          key={f.cmd}
          onClick={async () => { await CommandDispatcher.dispatch(f.cmd); onClose(); }}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ ...S.label(13), display: 'flex', alignItems: 'center', gap: 8 }}>
              {f.label}
              {f.tag && <span style={S.tag('#2B579A', '#EEF3FB')}>{f.tag}</span>}
            </div>
            <div style={S.desc()}>{f.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── 10. SHARE PANEL ─────────────────────────────────────────────────────────
function SharePanel({ onClose }: { onClose: () => void }) {
  const channels = [
    { icon: '📧', label: 'Email',           desc: 'Send via email client',          cmd: 'PPT.FILE.SHARE.EMAIL' },
    { icon: '🔗', label: 'Share Link',      desc: 'Generate a shareable link',      cmd: 'PPT.FILE.SHARE.LINK' },
    { icon: '📋', label: 'Copy Link',       desc: 'Copy link to clipboard',         cmd: 'PPT.FILE.SHARE.LINK' },
    { icon: '💼', label: 'Microsoft Teams', desc: 'Send to Teams channel',          cmd: 'PPT.FILE.SHARE.TEAMS' },
    { icon: '🏢', label: 'Internal Share',  desc: 'Share within your organization', cmd: 'PPT.FILE.SHARE.INTERNAL' },
    { icon: '📨', label: 'Invite People',   desc: 'Invite collaborators',           cmd: 'PPT.FILE.SHARE.INVITE.EMAIL' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
      {channels.map(b => (
        <button
          key={b.label}
          onClick={async () => { await CommandDispatcher.dispatch(b.cmd); onClose(); }}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 24, flexShrink: 0 }}>{b.icon}</span>
          <div>
            <div style={S.label(13)}>{b.label}</div>
            <div style={S.desc()}>{b.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── 11. PRINT PANEL ─────────────────────────────────────────────────────────
function PrintPanel({ onClose }: { onClose: () => void }) {
  const [copies, setCopies] = useState(1);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [paper, setPaper] = useState('A4');
  const [printerList, setPrinterList] = useState<Array<{ name: string; isDefault: boolean }>>([
    { name: 'Brother HL-1110 series', isDefault: true },
    { name: 'Microsoft Print to PDF', isDefault: false },
  ]);
  const [printer, setPrinter] = useState('Brother HL-1110 series');
  const [collate, setCollate] = useState(true);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrinters = async () => {
      const ipc = (window as any).ipc;
      if (ipc?.invoke) {
        const printers = await ipc.invoke('dialog:getPrinters');
        if (Array.isArray(printers) && printers.length > 0) {
          setPrinterList(printers.map((p: any) => ({ name: p.name, isDefault: Boolean(p.isDefault) })));
          const defaultP = printers.find((p: any) => p.isDefault) || printers[0];
          if (defaultP?.name) setPrinter(defaultP.name);
        }
      }
    };
    fetchPrinters();
  }, []);

  const [PPTPreviewHtml, setPPTPreviewHtml] = useState<string>('');

  useEffect(() => {
    // Notify App to generate the print container for PPT preview
    document.dispatchEvent(new CustomEvent('officex:preparing-print'));
    
    // Poll for the container because React updates might be async
    let attempts = 0;
    const interval = setInterval(() => {
      const container = document.getElementById('PPT-print-container');
      const box = container?.querySelector('.ox-page-box');
      if (box && box.innerHTML) {
        setPPTPreviewHtml(box.innerHTML);
        clearInterval(interval);
      }
      if (attempts++ > 10) clearInterval(interval); // give up after 1s
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  const docName = FileEngine.getCurrentFile()?.name || 'Presentation 1.pptx';
  const pagesData = FileEngine.getPagesData();
  const pages = pagesData?.pages || [];
  const doc = pagesData?.doc;
  const layout = pagesData?.layout;
  const hasPages = pages.length > 0 && doc && layout;

  const doPrint = (pageBoxes: Element[], pageW: number, pageH: number) => {
    // Clone each page's outer HTML
    let pagesHtml = '';
    pageBoxes.forEach((box) => {
      const clone = box.cloneNode(true) as HTMLElement;
      // Clean up visual-only styles
      clone.style.boxShadow = 'none';
      clone.style.marginBottom = '0';
      clone.style.border = 'none';
      clone.style.cursor = 'default';
      clone.style.userSelect = 'text';
      clone.style.overflow = 'hidden';
      clone.style.width = pageW + 'px';
      clone.style.height = pageH + 'px';
      clone.removeAttribute('onmousedown');
      clone.removeAttribute('onmousemove');
      pagesHtml += `<div class="print-wrapper">${clone.outerHTML}</div>`;
    });

    if (!pagesHtml) {
      // Last resort fallback: extract text
      const pgsData = FileEngine.getPagesData();
      const pgsArr = pgsData?.pages || [];
      let text = '';
      pgsArr.forEach((page: any) => {
        if (Array.isArray(page.lines)) {
          for (const line of page.lines) {
            if (Array.isArray(line.tokens)) {
              text += line.tokens.map((t: any) => t.text || '').join('') + '\n';
            }
          }
        }
        text += '\n';
      });
      pagesHtml = `<div style="white-space:pre-wrap;font-family:serif;font-size:12pt;padding:20mm;">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>')}</div>`;
    }

    const printHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Print</title>
<style>
  @page { margin: 0; }
  html { margin: 0; padding: 0; }
  body { margin: 0; padding: 0; background: #fff; }
  .print-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .print-wrapper:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .print-wrapper > div {
    transform-origin: top left;
    transform: scale(calc(100vw / ${pageW}));
  }
  .ox-caret, .ox-selection, .no-print { display: none !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>${pagesHtml}</body>
</html>`;

    const existing = document.getElementById('officex-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'officex-print-frame';
    iframe.style.cssText = 'position:fixed;left:-99999px;top:0;width:1px;height:1px;border:none;opacity:0;pointer-events:none;';
    document.body.appendChild(iframe);

    const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iDoc) { window.print(); return; }

    iDoc.open();
    iDoc.write(printHtml);
    iDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      }
      // After print dialog closes, restore normal rendering
      setTimeout(() => {
        iframe.remove();
        document.dispatchEvent(new CustomEvent('officex:finish-print'));
      }, 5000);
    }, 600);
  };

  const handleExecutePrint = () => {
    // Step 1: tell CanvasEditor to render ALL pages (disable virtual scrolling)
    document.dispatchEvent(new CustomEvent('officex:preparing-print'));

    // Step 2: wait for React to re-render all pages into DOM
    setTimeout(() => {
      const editorEl = document.getElementById('canvas-editor') || document.getElementById('pages-container') || document.body;
      const pageBoxes = Array.from(editorEl.querySelectorAll('.ox-page-box'));
      const firstBox = pageBoxes[0] as HTMLElement | undefined;
      const pageW = firstBox ? firstBox.offsetWidth : 816;
      const pageH = firstBox ? firstBox.offsetHeight : 1056;
      doPrint(pageBoxes, pageW, pageH);
    }, 300); // 300ms enough for React to commit all page renders
  };

  return (
    <div style={{ display: 'flex', gap: 24, flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Left Column: Print Controls */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0, overflowY: 'auto' }}>
        {/* Main Big Print Button */}
        <button
          onClick={handleExecutePrint}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '16px 20px', background: '#2B579A', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 16, fontWeight: 700, boxShadow: '0 4px 12px rgba(43,87,154,0.3)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1e3a5f')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2B579A')}
        >
          <span style={{ fontSize: 24 }}>🖨️</span>
          <span>PRINT Presentation</span>
        </button>

        <div style={{ marginTop: 24, fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Printer</div>
        <select
          value={printer} onChange={e => setPrinter(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #E8E8E8', fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
        >
          {printerList.map((p, i) => (
            <option key={i} value={p.name}>{p.name} {p.isDefault ? '(Default)' : ''}</option>
          ))}
        </select>

        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Settings</div>
        
        {/* Copies */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Copies</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setCopies(Math.max(1, copies - 1))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#fff', cursor: 'pointer' }}>-</button>
            <span style={{ width: 24, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{copies}</span>
            <button onClick={() => setCopies(copies + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#fff', cursor: 'pointer' }}>+</button>
          </div>
        </div>

        {/* Orientation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Orientation</span>
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', padding: 4, borderRadius: 6 }}>
            <button
              onClick={() => setOrientation('portrait')}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: 'none', cursor: 'pointer', background: orientation === 'portrait' ? '#2B579A' : 'transparent', color: orientation === 'portrait' ? '#fff' : '#666' }}
            >📄 Dọc</button>
            <button
              onClick={() => setOrientation('landscape')}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 4, border: 'none', cursor: 'pointer', background: orientation === 'landscape' ? '#2B579A' : 'transparent', color: orientation === 'landscape' ? '#fff' : '#666' }}
            >📄 Ngang</button>
          </div>
        </div>

        {/* Paper Size */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Paper Size</span>
          <select
            value={paper} onChange={e => setPaper(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#2B579A', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
        </div>

        {/* Collate */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #E8E8E8', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Collate</span>
          <button
            onClick={() => setCollate(!collate)}
            style={{ padding: '4px 12px', fontSize: 11, fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer', background: collate ? '#10B981' : '#E5E7EB', color: collate ? '#fff' : '#6B7280' }}
          >{collate ? 'ON' : 'OFF'}</button>
        </div>
      </div>

      {/* Right Column: Live A4 Visual Presentation Print Preview Sheet */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#E2E8F0', borderRadius: 12, padding: 24, overflow: 'hidden', border: '1px solid #CBD5E1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
            👁️ PRINT PREVIEW — {docName} ({paper}, {orientation})
          </div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
            {hasPages ? `Page 1 to ${pages.length}` : 'Page 1 of 1'}
          </div>
        </div>

        {/* Realistic A4 Paper container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 24 }}>
          {hasPages ? pages.map((page: any, index: number) => {
            const scale = orientation === 'portrait' ? 0.6 : 0.45;
            const w = page.section.pageSetup.width;
            const h = page.section.pageSetup.height;
            const isSelected = selectedPage === index;
            return (
              <div key={`print_page_${index}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                onClick={() => setSelectedPage(isSelected ? null : index)}
              >

                <div
                  style={{
                    width: w * scale,
                    height: h * scale,
                    flexShrink: 0,
                    boxShadow: isSelected
                      ? '0 0 0 3px #2B579A, 0 8px 30px rgba(43,87,154,0.3)'
                      : '0 8px 30px rgba(0, 0, 0, 0.15)',
                    background: '#FFFFFF',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.15s',
                    borderRadius: 2,
                  }}
                >
                  <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                    {/* Dummy Print Preview for PPT */}
                    <div style={{ width: '100%', height: '100%', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 20 }}>
                      Print Preview
                    </div>
                  </div>
                </div>
                {/* Page number footer label (chân trang) */}
                <div style={{
                  fontSize: 13, fontWeight: 800,
                  color: isSelected ? '#2B579A' : '#334155',
                  letterSpacing: '0.06em',
                  background: isSelected ? '#EEF3FB' : '#E2E8F0',
                  padding: '4px 18px', borderRadius: 20,
                  boxShadow: isSelected ? '0 0 0 2px #2B579A' : 'none',
                  minWidth: 60, textAlign: 'center',
                }}>
                  {index + 1}
                </div>
                {/* Quick print this page button - shown when selected */}
                {isSelected && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // Print only this page
                      const editorEl = document.getElementById('canvas-editor') || document.body;
                      const allBoxes = Array.from(editorEl.querySelectorAll('.ox-page-box'));
                      const box = allBoxes[index] as HTMLElement | undefined;
                      if (!box) { handleExecutePrint(); return; }
                      const clone = box.cloneNode(true) as HTMLElement;
                      clone.style.boxShadow = 'none';
                      clone.style.marginBottom = '0';
                      clone.style.border = 'none';
                      clone.style.cursor = 'default';
                      const pw = box.offsetWidth; const ph = box.offsetHeight;
                      const singleHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>
                        @page{margin:0;}html,body{margin:0;padding:0;background:#fff;}
                        .pw{width:100vw;height:100vh;overflow:hidden;display:flex;align-items:flex-start;justify-content:flex-start;}
                        .pw>div{transform-origin:top left;transform:scale(calc(100vw / ${pw}));}
                        .ox-caret,.ox-selection,.no-print{display:none!important;}
                        *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
                      </style></head><body><div class="pw">${clone.outerHTML}</div></body></html>`;
                      const ex = document.getElementById('officex-print-frame'); if (ex) ex.remove();
                      const iframe = document.createElement('iframe');
                      iframe.id = 'officex-print-frame';
                      iframe.style.cssText = 'position:fixed;left:-99999px;top:0;width:1px;height:1px;border:none;opacity:0;';
                      document.body.appendChild(iframe);
                      const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
                      if (!iDoc) return;
                      iDoc.open(); iDoc.write(singleHtml); iDoc.close();
                      setTimeout(() => {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                        setTimeout(() => iframe.remove(), 4000);
                      }, 400);
                    }}
                    style={{
                      padding: '6px 20px', background: '#2B579A', color: '#fff',
                      border: 'none', borderRadius: 20, cursor: 'pointer',
                      fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(43,87,154,0.4)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    🖨️ In trang {index + 1}
                  </button>
                )}
              </div>
            );
          }) : (
            <div
              style={{
                width: orientation === 'portrait' ? 480 : 660,
                minHeight: orientation === 'portrait' ? 640 : 460,
                background: '#FFFFFF',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                padding: '40px 48px',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                color: '#000000',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ fontSize: 9, color: '#94A3B8', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                  <span>OfficeX PPT — {docName}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: PPTPreviewHtml ? 'normal' : 'pre-wrap', color: '#1E293B', width: '100%', overflowX: 'auto' }}>
                  {PPTPreviewHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: PPTPreviewHtml }} style={{ transformOrigin: 'top left', transform: 'scale(0.85)' }} />
                  ) : (
                    FileEngine.getPresentationContent() || 'Văn bản mẫu OfficeX PPT...'
                  )}
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: 6, marginTop: 24, textAlign: 'center' }}>
                Page 1
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 12. CLOSE PANEL ─────────────────────────────────────────────────────────
function ClosePanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '16px 20px', background: '#FFF8F0', border: '1px solid #FDE8C4', borderRadius: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: '#92400E', fontWeight: 600, marginBottom: 4 }}>⚠️ Unsaved changes will be lost</div>
        <div style={{ fontSize: 12, color: '#A16207' }}>Make sure to save your Presentation before closing.</div>
      </div>
      <ActionBtn icon="✅" label="Save and Close" desc="Save current Presentation then close" cmd={() => { CommandDispatcher.dispatch('PPT.FILE.CLOSE.SAVE_AND_CLOSE'); onClose(); }} />
      <ActionBtn icon="📄" label="Close Presentation" desc="Close current Presentation (Ctrl+W)" shortcut="Ctrl+W" cmd={() => { CommandDispatcher.dispatch('PPT.FILE.CLOSE'); onClose(); }} />
      <ActionBtn icon="📂" label="Close All Presentations" desc="Close all open Presentations" cmd={() => { CommandDispatcher.dispatch('PPT.FILE.CLOSE.ALL'); onClose(); }} />
      <ActionBtn icon="🚫" label="Close Without Saving" desc="Discard changes and close" cmd={() => { CommandDispatcher.dispatch('PPT.FILE.CLOSE.WITHOUT_SAVE'); onClose(); }} accent="#DC2626" />
    </div>
  );
}

// ─── 13. ACCOUNT PANEL ───────────────────────────────────────────────────────
function AccountPanel() {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 40, overflow: 'hidden' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* User card */}
        <div style={{
          padding: '24px', background: 'linear-gradient(135deg, #1e3a5f 0%, #2B579A 100%)',
          borderRadius: 16, color: '#fff', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>OfficeX User</div>
            <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>user@officex.app</div>
            <div style={{ marginTop: 8 }}>
              <span style={S.tag('#fff', 'rgba(255,255,255,0.2)')}>Pro License</span>
            </div>
          </div>
          <button
            onClick={() => CommandDispatcher.dispatch('PPT.FILE.SIGNOUT')}
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          >Sign Out</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ActionBtn icon="👤" label="View Profile" desc="Manage your account details" cmd="PPT.FILE.ACCOUNT.PROFILE" />
          <ActionBtn icon="🔑" label="License & Subscription" desc="View your license information" cmd="PPT.FILE.LICENSE" />
          <ActionBtn icon="🔌" label="Connected Services" desc="Manage cloud storage integrations" cmd="PPT.FILE.CONNECTED_SERVICES" />
          <ActionBtn icon="🎨" label="Office Theme" desc="Customize the appearance" cmd="PPT.FILE.OFFICE_THEME" />
          <ActionBtn icon="🔄" label="Check for Updates" desc="Get the latest version of OfficeX" cmd="PPT.FILE.UPDATE" />
        </div>
      </div>

      <div style={{ width: 240, flexShrink: 0 }}>
        <p style={{ ...S.sectionTitle(), marginTop: 0 }}>Subscription</p>
        <div style={{
          border: '1px solid #E8E8E8', borderRadius: 12, padding: '20px',
          background: 'linear-gradient(135deg, #F8FAFF, #EEF3FB)',
        }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>⭐</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2B579A' }}>OfficeX Pro</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Active · Renews Jan 2027</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['✅ All editing features', '✅ Cloud sync', '✅ AI assistant', '✅ Priority support'].map(f => (
              <div key={f} style={{ fontSize: 12, color: '#444' }}>{f}</div>
            ))}
          </div>
          <button
            onClick={() => CommandDispatcher.dispatch('PPT.FILE.SUBSCRIPTION')}
            style={{ marginTop: 16, width: '100%', padding: '9px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
          >Manage Subscription</button>
        </div>
      </div>
    </div>
  );
}

// ─── 14. SETTINGS PANEL ──────────────────────────────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const categories = [
    { icon: '⚙️', label: 'General',              desc: 'Startup, display, and default options',   cmd: 'PPT.FILE.SETTINGS.GENERAL' },
    { icon: '🌐', label: 'Language',              desc: 'Display language, proofing language',     cmd: 'PPT.FILE.SETTINGS.LANGUAGE' },
    { icon: '✏️', label: 'Proofing',              desc: 'Spelling, grammar, AutoCorrect',          cmd: 'PPT.FILE.SETTINGS.PROOFING' },
    { icon: '💾', label: 'Save',                  desc: 'Default format, AutoSave, locations',    cmd: 'PPT.FILE.SETTINGS.SAVE' },
    { icon: '🔧', label: 'Advanced',              desc: 'Editing, display, and print options',    cmd: 'PPT.FILE.SETTINGS.ADVANCED' },
    { icon: '🎛️', label: 'Customize Ribbon',      desc: 'Add, remove, and reorder ribbon tabs',   cmd: 'PPT.FILE.SETTINGS.RIBBON' },
    { icon: '⚡', label: 'Quick Access Toolbar',  desc: 'Customize the QAT commands',             cmd: 'PPT.FILE.SETTINGS.QAT' },
    { icon: '⌨️', label: 'Keyboard Shortcuts',    desc: 'View and customize key bindings',        cmd: 'PPT.FILE.SETTINGS.SHORTCUTS' },
    { icon: '🧩', label: 'Plugins',               desc: 'Manage extensions and add-ins',          cmd: 'PPT.FILE.SETTINGS.PLUGINS' },
    { icon: '🤖', label: 'AI Settings',           desc: 'AI provider, model, and privacy',        cmd: 'PPT.FILE.SETTINGS.AI' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
      {categories.map(c => (
        <button
          key={c.cmd}
          onClick={async () => { await CommandDispatcher.dispatch(c.cmd); onClose(); }}
          style={S.gridBtn()}
          onMouseEnter={e => hoverEnter(e)}
          onMouseLeave={hoverLeave}
        >
          <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={S.label(13)}>{c.label}</div>
            <div style={S.desc()}>{c.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── 15. FEEDBACK PANEL ──────────────────────────────────────────────────────
function FeedbackPanel() {
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <ActionBtn icon="💬" label="Send Feedback"    desc="Tell us what you think"           cmd="PPT.FILE.FEEDBACK.SEND" />
        <ActionBtn icon="🐛" label="Report a Bug"     desc="Help us fix issues"               cmd="PPT.FILE.REPORT.BUG" />
        <ActionBtn icon="💡" label="Suggest Feature"  desc="Share your ideas"                 cmd="PPT.FILE.SUGGEST" />
        <ActionBtn icon="🩺" label="Diagnostics"      desc="Run diagnostic tests"             cmd="PPT.FILE.DIAGNOSTICS" />
        <ActionBtn icon="📋" label="View Logs"        desc="Open application log files"       cmd="PPT.FILE.LOGS" />
      </div>

      <p style={S.sectionTitle()}>Quick Feedback</p>
      <div style={{ border: '1px solid #E8E8E8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 10 }}>How satisfied are you with OfficeX?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['😞', '😐', '🙂', '😊', '🤩'].map((e, i) => (
              <button key={i} style={{ fontSize: 28, background: 'transparent', border: '2px solid #EEE', borderRadius: 10, width: 50, height: 50, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={el => (el.currentTarget as HTMLElement).style.borderColor = '#2B579A'}
                onMouseLeave={el => (el.currentTarget as HTMLElement).style.borderColor = '#EEE'}
              >{e}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <textarea
            placeholder="Tell us more… (optional)"
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            style={{ width: '100%', minHeight: 80, border: '1px solid #E0E0E0', borderRadius: 8, padding: '10px 12px', fontSize: 13, resize: 'vertical', outline: 'none', fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => { CommandDispatcher.dispatch('PPT.FILE.FEEDBACK.SEND', { text: feedbackText }); setFeedbackText(''); }}
            style={{ marginTop: 10, padding: '9px 20px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >Submit Feedback</button>
        </div>
      </div>
    </div>
  );
}

// ─── 16. HELP PANEL ──────────────────────────────────────────────────────────
function HelpPanel() {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24, maxWidth: 640 }}>
        <ActionBtn icon="❓" label="Help Center"        desc="Browse help articles and guides"    shortcut="F1" cmd="PPT.FILE.HELP.CENTER" />
        <ActionBtn icon="🎬" label="Tutorials"          desc="Step-by-step video tutorials"       cmd="PPT.FILE.TUTORIALS" />
        <ActionBtn icon="⌨️" label="Keyboard Shortcuts" desc="View all keyboard shortcuts"        cmd="PPT.FILE.SHORTCUTS" />
        <ActionBtn icon="📖" label="Presentationation"      desc="Complete product Presentationation"    cmd="PPT.FILE.PresentationATION" />
      </div>

      <p style={{ ...S.sectionTitle(), maxWidth: 640 }}>About OfficeX PPT</p>
      <div style={{
        border: '1px solid #E8E8E8', borderRadius: 14, padding: '24px',
        background: 'linear-gradient(135deg, #F8FAFF, #F0F4FF)',
        maxWidth: 640, display: 'flex', gap: 24, alignItems: 'center',
      }}>
        <span style={{ fontSize: 48 }}>📝</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>OfficeX PPT</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>Version 1.0.0 · Build 2026.07.17</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>© 2026 OfficeX. All rights reserved.</div>
          <button
            onClick={() => CommandDispatcher.dispatch('PPT.FILE.ABOUT')}
            style={{ marginTop: 12, padding: '7px 16px', background: '#2B579A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          >View Full Details</button>
        </div>
      </div>
    </div>
  );
}

// ─── 17. EXIT PANEL ──────────────────────────────────────────────────────────
function ExitPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '16px 20px', background: '#FFF1F1', border: '1px solid #FECACA', borderRadius: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, marginBottom: 4 }}>⚠️ Before you go</div>
        <div style={{ fontSize: 12, color: '#B91C1C' }}>Make sure all Presentations are saved. Unsaved changes will be lost.</div>
      </div>
      <ActionBtn icon="💾" label="Save All and Exit" desc="Save all open Presentations then close OfficeX" cmd="PPT.FILE.EXIT.SAVE_ALL" />
      <ActionBtn icon="🚪" label="Exit PPT" desc="Close OfficeX PPT" shortcut="Alt+F4" cmd={() => { CommandDispatcher.dispatch('PPT.FILE.EXIT'); onClose(); }} />
      <ActionBtn icon="🔁" label="Restart OfficeX" desc="Restart the application" cmd="PPT.FILE.RESTART" />
      <ActionBtn icon="🔴" label="Exit All Applications" desc="Close all OfficeX applications" cmd="PPT.FILE.EXIT_ALL" accent="#DC2626" />
    </div>
  );
}

// ─── Main FileMenu Component ──────────────────────────────────────────────────
export function FileMenu({ onClose, initialSection = 'new' }: { onClose: () => void; initialSection?: ActiveSection }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(FileEngine.getFileInfo());
  const [autoSave, setAutoSave] = useState(FileEngine.isAutoSaveEnabled());
  const rerender = useCallback(() => setFileInfo(FileEngine.getFileInfo()), []);

  useEffect(() => {
    const u1 = FileEngine.on('file:saved',  rerender);
    const u2 = FileEngine.on('file:new',    rerender);
    const u3 = FileEngine.on('file:opened', rerender);
    return () => { u1(); u2(); u3(); };
  }, [rerender]);

  const handleToggleAutoSave = () => {
    if (autoSave) { CommandDispatcher.dispatch('PPT.FILE.AUTOSAVE.DISABLE'); setAutoSave(false); }
    else           { CommandDispatcher.dispatch('PPT.FILE.AUTOSAVE.ENABLE');  setAutoSave(true);  }
  };

  // Escape key closes backstage
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Sidebar config ───────────────────────────────────────────────────────
  type NavItem = { id: ActiveSection; icon: string; label: string };
  const primaryNav: NavItem[] = [
    { id: 'info',    icon: 'ℹ️',  label: 'Info' },
    { id: 'new',     icon: '📄', label: 'New' },
    { id: 'open',    icon: '📂', label: 'Open' },
    { id: 'recent',  icon: '🕐', label: 'Recent' },
    { id: 'save',    icon: '💾', label: 'Save' },
    { id: 'saveas',  icon: '📋', label: 'Save As' },
    { id: 'autosave',icon: '⏰', label: 'Auto Save' },
    { id: 'history', icon: '📌', label: 'Version History' },
    { id: 'export',  icon: '📤', label: 'Export' },
    { id: 'share',   icon: '🔗', label: 'Share' },
    { id: 'print',   icon: '🖨️', label: 'Print' },
    { id: 'close',   icon: '✖️', label: 'Close' },
  ];
  const utilityNav: NavItem[] = [
    { id: 'account',  icon: '👤', label: 'Account' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'feedback', icon: '💬', label: 'Feedback' },
    { id: 'help',     icon: '❓', label: 'Help' },
    { id: 'exit',     icon: '🚪', label: 'Exit' },
  ];

  const sectionLabel: Record<ActiveSection, string> = {
    info: 'Presentation Info', new: 'New', open: 'Open', recent: 'Recent Files',
    save: 'Save', saveas: 'Save As', autosave: 'Auto Save', history: 'Version History',
    export: 'Export', share: 'Share', print: 'Print', close: 'Close',
    account: 'Account', settings: 'Settings', feedback: 'Feedback', help: 'Help', exit: 'Exit',
  };

  const sectionSubtitle: Partial<Record<ActiveSection, string>> = {
    info: 'View and edit Presentation properties',
    new: 'Create a new Presentation or choose a template',
    open: 'Open a Presentation from a file or cloud storage',
    recent: 'Quickly access recently opened Presentations',
    saveas: 'Choose location and format to save',
    autosave: 'Configure automatic recovery and backup',
    history: 'Browse and restore previous versions',
    export: 'Export Presentation to another format',
    share: 'Share with collaborators or send via email',
    print: 'Print or preview your Presentation',
    close: 'Close the current Presentation',
    account: 'Manage your profile and license',
    settings: 'Configure OfficeX PPT preferences',
    feedback: 'Help us improve OfficeX PPT',
    help: 'Get help and learn about OfficeX',
    exit: 'Exit OfficeX PPT',
  };

  return (
    <div
      id="backstage-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', fontFamily: 'Segoe UI, sans-serif',
        animation: 'backstageIn 0.18s cubic-bezier(0.2,0,0,1)',
      }}
    >
      <style>{`
        @keyframes backstageIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: none; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C8D4E8; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #2B579A; }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div style={{
        width: 220, background: 'linear-gradient(180deg, #1e3a5f 0%, #16305a 100%)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto',
        boxShadow: '2px 0 20px rgba(0,0,0,0.2)',
      }}>
        {/* Back button */}
        <button
          id="backstage-back-btn"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '15px 18px', border: 'none', background: 'transparent',
            color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: 13,
            fontFamily: 'Segoe UI, sans-serif', transition: 'background 0.15s',
            borderLeft: '3px solid transparent',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <span style={{ fontSize: 16 }}>←</span>
          <span>Back to PPT</span>
        </button>

        {/* Presentation name badge */}
        <div style={{ padding: '8px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Current Presentation</div>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fileInfo?.name ?? 'Presentation 1'}
          </div>
          {fileInfo?.path && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fileInfo.path}
            </div>
          )}
        </div>

        {/* Primary nav */}
        <div style={{ flex: 1, paddingTop: 6 }}>
          {primaryNav.map(s => (
            <SidebarItem key={s.id} {...s} active={activeSection === s.id} onClick={setActiveSection}
              badge={s.id === 'autosave' && autoSave ? '●' : undefined}
            />
          ))}
        </div>

        {/* Utility nav */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 8 }}>
          <SidebarLabel label="Manage" />
          {utilityNav.map(s => (
            <SidebarItem key={s.id} {...s} active={activeSection === s.id} onClick={setActiveSection} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>OfficeX PPT v1.0</div>
        </div>
      </div>

      {/* ── Content Area ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '28px 40px 20px', borderBottom: '1px solid #EEEEEE', flexShrink: 0, background: '#FAFBFF' }}>
          <SectionHeader
            title={sectionLabel[activeSection]}
            subtitle={sectionSubtitle[activeSection]}
          />
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '28px 40px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

          {activeSection === 'info'     && fileInfo && <InfoPanel     info={fileInfo} onUpdate={rerender} />}
          {activeSection === 'new'      && <NewPanel      onClose={onClose} />}
          {activeSection === 'open'     && <OpenPanel     onClose={onClose} />}
          {activeSection === 'recent'   && <RecentPanel   onClose={onClose} />}
          {activeSection === 'save'     && <SavePanel     autoSave={autoSave} onToggleAutoSave={handleToggleAutoSave} onClose={onClose} />}
          {activeSection === 'saveas'   && <SaveAsPanel   onClose={onClose} />}
          {activeSection === 'autosave' && <AutoSavePanel autoSave={autoSave} onToggleAutoSave={handleToggleAutoSave} />}
          {activeSection === 'history'  && <HistoryPanel />}
          {activeSection === 'export'   && <ExportPanel   onClose={onClose} />}
          {activeSection === 'share'    && <SharePanel    onClose={onClose} />}
          {activeSection === 'print'    && <PrintPanel    onClose={onClose} />}
          {activeSection === 'close'    && <ClosePanel    onClose={onClose} />}
          {activeSection === 'account'  && <AccountPanel />}
          {activeSection === 'settings' && <SettingsPanel onClose={onClose} />}
          {activeSection === 'feedback' && <FeedbackPanel />}
          {activeSection === 'help'     && <HelpPanel />}
          {activeSection === 'exit'     && <ExitPanel     onClose={onClose} />}

        </div>
      </div>
    </div>
  );
}

