/**
 * EditingGroup.tsx
 *
 * Editing ribbon group for Home tab.
 * Per ribbon_home.md: Find, Advanced Find, Replace, Go To,
 * Select (All / Objects / Selection Pane).
 *
 * All commands route through CommandDispatcher → WORD.EDIT.*
 */

import React, { useState, useRef, useEffect } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import { RGroup } from './SharedComponents';
import {
  IconFind, IconReplace, IconSelectAll, IconChevronDown,
} from '@officex/icons';

// ─── Local Button ─────────────────────────────────────────────────────────────

function EBtn({
  icon: Icon,
  label,
  shortcut,
  onCmd,
  disabled = false,
}: {
  icon: any;
  label: string;
  shortcut?: string;
  onCmd: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={shortcut ? `${label} (${shortcut})` : label}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onCmd();
      }}
      className={`flex items-center gap-1.5 px-2 h-[22px] rounded transition-colors duration-150 text-[11px] w-full
        ${disabled
          ? 'text-[#B8B8B8] cursor-default'
          : 'text-[#424242] hover:bg-[#EAEAEA] border border-transparent hover:border-[#D0D0D0]'
        }`}
    >
      <Icon size={13} />
      <span>{label}</span>
    </button>
  );
}

// ─── Select Dropdown ──────────────────────────────────────────────────────────

function SelectDropdown() {
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

  const selectItems = [
    { id: 'all', label: 'Select All', shortcut: 'Ctrl+A', cmd: 'WORD.EDIT.SELECT_ALL' },
    { id: 'sep1', label: '', shortcut: '', cmd: '' },
    { id: 'obj', label: 'Select Objects', shortcut: '', cmd: 'WORD.EDIT.SELECT_OBJECT' },
    { id: 'pane', label: 'Selection Pane...', shortcut: '', cmd: 'WORD.EDIT.SELECTION_PANE' },
  ];

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        onMouseDown={(e) => { e.preventDefault(); setOpen(!open); }}
        className="flex items-center gap-1.5 px-2 h-[22px] rounded transition-colors duration-150 text-[11px] text-[#424242] hover:bg-[#EAEAEA] border border-transparent hover:border-[#D0D0D0] w-full"
        title="Select"
      >
        <IconSelectAll size={13} />
        <span className="flex-1 text-left">Select</span>
        <IconChevronDown size={9} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-0.5 w-44 bg-white border border-[#D0D0D0] rounded-[4px] shadow-xl z-50 py-1"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
        >
          {selectItems.map((item) => {
            if (item.id.startsWith('sep')) {
              return <div key={item.id} className="border-t border-[#F0F0F0] my-1" />;
            }
            return (
              <button
                key={item.id}
                className="w-full flex items-center justify-between px-3 py-1 text-[12px] text-[#202020] hover:bg-[#EAF2FD] transition-colors text-left"
                onClick={() => { exec(item.cmd); setOpen(false); }}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-[10px] text-[#888] ml-2">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main EditingGroup ────────────────────────────────────────────────────────

export function EditingGroup() {
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  return (
    <RGroup label="Editing">
      <div className="flex flex-col justify-around w-[90px]" style={{ height: 56 }}>
        <EBtn
          icon={IconFind}
          label="Find"
          shortcut="Ctrl+F"
          onCmd={() => exec('WORD.EDIT.FIND')}
        />
        <EBtn
          icon={IconReplace}
          label="Replace"
          shortcut="Ctrl+H"
          onCmd={() => exec('WORD.EDIT.REPLACE')}
        />
        <SelectDropdown />
      </div>
    </RGroup>
  );
}
