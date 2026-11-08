/**
 * ClipboardGroup.tsx
 *
 * Clipboard ribbon group for Home tab.
 * Per ribbon_home.md: Paste, Paste Special, Paste Keep Source,
 * Paste Merge Formatting, Paste Text Only, Cut, Copy,
 * Copy As Picture, Format Painter, Clipboard Pane.
 *
 * All commands route through CommandDispatcher → WORD.CLIPBOARD.*
 */

import React, { useState, useRef, useEffect } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import { useRibbonState } from './RibbonController';
import { RGroup } from './SharedComponents';
import {
  IconPaste, IconCut, IconCopy, IconFormatPainter, IconChevronDown,
} from '@officex/icons';

// ─── Local Button Component ───────────────────────────────────────────────────

function CBtn({
  icon: Icon,
  title,
  onCmd,
  active = false,
  disabled = false,
  size = 14,
  children,
}: {
  icon?: any;
  title?: string;
  onCmd?: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: number;
  children?: React.ReactNode;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onCmd?.();
      }}
      className={`flex items-center justify-center gap-1 w-7 h-7 rounded transition-colors duration-150 ${
        disabled
          ? 'text-[#B8B8B8] cursor-default'
          : active
          ? 'bg-[#D9E8FB] border border-[#9BC2F5] text-[#0F6CBD]'
          : 'text-[#424242] hover:bg-[#EAEAEA] border border-transparent'
      }`}
    >
      {Icon && <Icon size={size} />}
      {children}
    </button>
  );
}

// ─── Paste Dropdown ───────────────────────────────────────────────────────────

function PasteButton() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const pasteOptions = [
    {
      id: 'keep-source',
      label: 'Keep Source Formatting',
      sublabel: 'Ctrl+Shift+K',
      icon: '📄',
      cmd: 'WORD.CLIPBOARD.PASTE_KEEP_SOURCE',
    },
    {
      id: 'merge',
      label: 'Merge Formatting',
      sublabel: '',
      icon: '📋',
      cmd: 'WORD.CLIPBOARD.PASTE_MERGE',
    },
    {
      id: 'text-only',
      label: 'Keep Text Only',
      sublabel: 'Ctrl+Shift+V',
      icon: 'T',
      cmd: 'WORD.CLIPBOARD.PASTE_TEXT',
    },
    { id: 'sep', label: '', sublabel: '', icon: '', cmd: '' },
    {
      id: 'special',
      label: 'Paste Special...',
      sublabel: 'Alt+Ctrl+V',
      icon: '⚙',
      cmd: 'WORD.CLIPBOARD.PASTE_SPECIAL',
    },
  ];

  return (
    <div className="flex flex-col items-center mr-1" ref={wrapperRef}>
      {/* Large Paste Icon */}
      <button
        title="Paste (Ctrl+V)"
        onMouseDown={(e) => { e.preventDefault(); exec('WORD.CLIPBOARD.PASTE'); }}
        className="flex flex-col items-center justify-center w-10 h-10 rounded hover:bg-[#EAEAEA] transition-colors border border-transparent active:bg-[#D9E8FB]"
      >
        <IconPaste size={24} className="text-[#424242]" />
      </button>

      {/* Paste Label + Caret */}
      <button
        className="flex items-center justify-center w-10 h-4 rounded hover:bg-[#EAEAEA] transition-colors text-[9px] text-[#424242] gap-0.5"
        onClick={() => setOpen(!open)}
      >
        Paste <IconChevronDown size={8} />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 w-52 bg-white border border-[#D0D0D0] rounded-[4px] shadow-xl py-1"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.14)' }}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-wider border-b border-[#F0F0F0] mb-1">
            Paste Options
          </div>
          {pasteOptions.map((opt) => {
            if (opt.id === 'sep') return <div key="sep" className="border-t border-[#F0F0F0] my-1" />;
            return (
              <button
                key={opt.id}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-[12px] text-[#202020] hover:bg-[#EAF2FD] transition-colors text-left"
                onClick={() => { exec(opt.cmd); setOpen(false); }}
              >
                <span className="w-5 text-center text-[14px]">{opt.icon}</span>
                <span className="flex-1">{opt.label}</span>
                {opt.sublabel && (
                  <span className="text-[10px] text-[#888]">{opt.sublabel}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main ClipboardGroup ──────────────────────────────────────────────────────

export function ClipboardGroup() {
  const rs = useRibbonState();
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  return (
    <RGroup label="Clipboard" onDialogClick={() => exec('WORD.CLIPBOARD.PANE')}>
      <div className="flex items-start gap-0.5 relative">
        {/* Paste Button (large, with dropdown) */}
        <PasteButton />

        {/* Secondary buttons: Cut, Copy, Copy As Picture, Format Painter */}
        <div className="flex flex-col gap-0.5 pt-1">
          <CBtn
            icon={IconCut}
            title="Cut (Ctrl+X)"
            onCmd={() => exec('WORD.CLIPBOARD.CUT')}
          />
          <CBtn
            icon={IconCopy}
            title="Copy (Ctrl+C)"
            onCmd={() => exec('WORD.CLIPBOARD.COPY')}
          />
          <CBtn
            icon={() => (
              <span className="text-[11px] font-semibold text-[#424242]">📷</span>
            )}
            title="Copy As Picture"
            onCmd={() => exec('WORD.CLIPBOARD.COPY_AS_IMAGE')}
          />
          <CBtn
            icon={IconFormatPainter}
            title="Format Painter (Ctrl+Shift+C) — Click to copy, double-click to lock"
            onCmd={() => exec('WORD.CLIPBOARD.FORMAT_PAINTER')}
            active={rs.active('WORD.HOME.FORMAT.PAINTER')}
          />
        </div>
      </div>
    </RGroup>
  );
}
