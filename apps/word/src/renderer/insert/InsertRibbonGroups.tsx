/**
 * InsertRibbonGroups.tsx
 *
 * Implements the 16 groups for the Insert Ribbon as defined in ribbon_insert.md:
 * Pages, Tables, Illustrations, Shapes, Icons, 3D Models, SmartArt, Charts, Links,
 * Comments, Header & Footer, Text, Symbols, Media, AI, Plugins.
 */

import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';
import { EditorAPI } from '../editorApi';

import { CoverPageGallery } from './CoverPageGallery';
import { TableGallery } from './TableGallery';
import { QuickTablesGallery } from './QuickTablesGallery';
import { IconGallery } from './IconGallery';
import { LinkModal } from './LinkModal';
import { PageNumberModal } from './PageNumberModal';
import { SymbolModal } from './SymbolModal';

// ─── Shared UI Components ─────────────────────────────────────────────────────

export function LargeButton({ icon: Icon, label, onClick, disabled }: any) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      disabled={disabled}
      className={`flex flex-col items-center justify-center w-16 h-[52px] rounded transition-colors px-1 ${
        disabled ? 'opacity-50 cursor-default' : 'hover:bg-slate-200 cursor-pointer text-slate-700'
      }`}
    >
      <Icon size={24} className={disabled ? 'text-slate-400 mb-1' : 'text-slate-600 mb-1'} />
      <span className="text-[10px] leading-tight text-center whitespace-normal max-w-[60px] line-clamp-2" style={{ lineHeight: '1.1' }}>{label}</span>
    </button>
  );
}

export function SmallButton({ icon: Icon, label, onClick, disabled }: any) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-2 h-7 rounded transition-colors text-[11px] w-full ${
        disabled ? 'opacity-50 cursor-default' : 'hover:bg-slate-200 cursor-pointer text-slate-700'
      }`}
    >
      <Icon size={14} className={disabled ? 'text-slate-400 shrink-0' : 'text-slate-600 shrink-0'} />
      <span className="truncate">{label}</span>
    </button>
  );
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const I = {
  Doc: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Break: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12" strokeDasharray="4 4"/></svg>,
  Section: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h16M4 16h16"/></svg>,
  Number: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>,
  Table: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  Image: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Shape: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Chart: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  SmartArt: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Text: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>,
  Header: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M2 7h20"/></svg>,
  Footer: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M2 17h20"/></svg>,
  Reference: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Link: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Bookmark: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Equation: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h12"/><path d="M20 7v10"/></svg>,
  Symbol: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Emoji: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Video: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  Audio: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  Object: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  AI: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="url(#ai-gradient)" strokeWidth="2"><defs><linearGradient id="ai-gradient" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#ai-gradient)" opacity="0.2"/><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>,
  Plugin: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>,
  Model3D: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/><polyline points="2 15.5 12 8.5 22 15.5"/><line x1="12" y1="2" x2="12" y2="8.5"/></svg>,
  Comment: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Pencil: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  Clock: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ChevronRight: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  HeaderFooterCombined: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <line x1="8" y1="7" x2="16" y2="7" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="17" x2="16" y2="17" stroke="#e67e22" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  PageNumberHash: (p: any) => (
    <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
      <g stroke="#3498db" strokeWidth="2" strokeLinecap="round">
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="11.5" y1="8" x2="10.5" y2="16" />
        <line x1="14.5" y1="8" x2="13.5" y2="16" />
      </g>
    </svg>
  ),
};

// Helper
const exec = (cmd: string) => CommandDispatcher.dispatch(cmd);

// ─── 1. Pages ─────────────────────────────────────────────────────────────────
export function PagesGroup() {
  return (
    <RGroup label="Pages">
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1 h-[52px]">
              <I.Doc size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Cover Page <IconChevronDown size={8} /></span>
            </button>
          }
        >
          <CoverPageGallery />
        </Dropdown>
      
      </div>
    </RGroup>
  );
}

// ─── 2. Tables ────────────────────────────────────────────────────────────────
export function TablesGroup() {
  return (
    <RGroup label="Tables" onDialogClick={() => exec('WORD.INSERT.TABLE.DIALOG')}>
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1 h-[52px]">
              <I.Table size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Table <IconChevronDown size={8} /></span>
            </button>
          }
          items={[
            { id: 'draw', label: 'Draw Table', onClick: () => exec('WORD.INSERT.DRAW_TABLE') },
            { id: 'quick', label: 'Quick Tables', onClick: () => exec('WORD.INSERT.QUICK_TABLE') },
            { id: 'convert', label: 'Convert Text to Table', onClick: () => exec('WORD.INSERT.CONVERT_TABLE') },
            { id: 'excel', label: 'Excel Spreadsheet', onClick: () => exec('WORD.INSERT.EXCEL') },
          ]}
        >
          <TableGallery />
        </Dropdown>
      </div>
    </RGroup>
  );
}

// ─── 3. Illustrations ─────────────────────────────────────────────────────────
export function IllustrationsGroup() {
  return (
    <RGroup label="Illustrations" onDialogClick={() => exec('WORD.INSERT.PICTURE.DIALOG')}>
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1 h-[52px]">
              <I.Image size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Pictures <IconChevronDown size={8} /></span>
            </button>
          }
          items={[
            { id: '1', label: 'Insert Picture', onClick: () => exec('WORD.INSERT.PICTURE') },
            { id: '2', label: 'This Device...', onClick: () => exec('WORD.INSERT.PICTURE_DEVICE') }
          ]}
        />
        <button 
          className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1 h-[52px]"
          onClick={() => exec('WORD.INSERT.DRAWING')}
        >
          <div className="relative mb-1">
            <I.Pencil size={24} className="text-slate-600" />
            <div className="absolute -bottom-1 -left-1 w-7 h-0 border-t-2 border-dashed border-slate-600"></div>
          </div>
          <span className="text-[10px] text-slate-700 leading-tight text-center">Đang vẽ</span>
        </button>
      </div>
    </RGroup>
  );
}

// ─── 4. Shapes ────────────────────────────────────────────────────────────────
export function ShapesGroup() {
  return (
    <RGroup label="Shapes">
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1 h-[52px]">
              <I.Shape size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Shapes <IconChevronDown size={8} /></span>
            </button>
          }
          items={[
            { id: '1', label: 'Shapes Gallery', onClick: () => exec('WORD.INSERT.SHAPE') },
            { id: '2', label: 'Connector', onClick: () => exec('WORD.INSERT.CONNECTOR') },
            { id: '3', label: 'Callout', onClick: () => exec('WORD.INSERT.CALLOUT') }
          ]}
        />
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Text} label="Text Box" onClick={() => exec('WORD.INSERT.TEXTBOX')} />
          <SmallButton icon={I.Text} label="WordArt" onClick={() => exec('WORD.INSERT.WORDART')} />
        </div>
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Shape} label="Drawing Canvas" onClick={() => exec('WORD.INSERT.CANVAS')} />
        </div>
      </div>
    </RGroup>
  );
}

// ─── 5. Icons ─────────────────────────────────────────────────────────────────
export function IconsGroup() {
  return (
    <RGroup label="Icons">
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-16 rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer">
              <I.Emoji size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5 whitespace-normal max-w-[60px] line-clamp-2">Office Icons <IconChevronDown size={8} className="shrink-0" /></span>
            </button>
          }
        >
          <IconGallery />
        </Dropdown>
      </div>
    </RGroup>
  );
}

// ─── 6. 3D Models ─────────────────────────────────────────────────────────────
export function Models3DGroup() {
  // Logic could check if supported, assuming always true for now
  return (
    <RGroup label="3D Models">
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-[60px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px]">
              <I.Model3D size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">3D Models <IconChevronDown size={8} /></span>
            </button>
          }
          items={[
            { id: '1', label: 'Insert 3D Model', onClick: () => exec('WORD.INSERT.MODEL3D') },
            { id: '2', label: 'Online Models...', onClick: () => exec('WORD.INSERT.MODEL3D_ONLINE') }
          ]}
        />
      </div>
    </RGroup>
  );
}



// ─── 9. Links ─────────────────────────────────────────────────────────────────
export function LinksGroup() {
  const [hoveredSubmenu, setHoveredSubmenu] = React.useState(false);
  const [showLinkModal, setShowLinkModal] = React.useState(false);

  return (
    <RGroup label="Liên kết">
      <div className="flex gap-1 h-full items-center">
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-[64px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer">
              <I.Link size={24} className="text-slate-600 mb-1" />
              <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Liên kết <IconChevronDown size={8} /></span>
            </button>
          }
        >
          <div className="flex flex-col py-1 w-[200px]">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-slate-700 text-[13px] text-left w-full" 
              onClick={() => {
                setShowLinkModal(true);
                exec('WORD.INSERT.HYPERLINK');
              }}
            >
              <I.Link size={16} className="text-slate-600" /> Chèn Đường dẫn
            </button>
            <div 
              className="flex items-center justify-between px-3 py-1.5 text-slate-400 text-[13px] relative cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <I.Clock size={16} className="text-slate-400" /> Các Liên kết Gần đây
              </div>
              <I.ChevronRight size={14} className="text-slate-300" />
            </div>
          </div>
        </Dropdown>
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Bookmark} label="Thẻ đánh dấu" onClick={() => exec('WORD.INSERT.BOOKMARK')} />
          <SmallButton icon={I.Reference} label="Mục lục" onClick={() => exec('WORD.INSERT.CROSS_REFERENCE')} />
        </div>
      </div>
      
      {showLinkModal && <LinkModal onClose={() => setShowLinkModal(false)} />}
    </RGroup>
  );
}

// ─── 10. Comments ─────────────────────────────────────────────────────────────
export function CommentsGroup() {
  return (
    <RGroup label="Comments">
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.Comment} label="Comment" onClick={() => exec('WORD.INSERT.COMMENT')} />
        <div className="flex flex-col justify-around h-[52px] w-[90px]">
          <SmallButton icon={I.Comment} label="Mention" onClick={() => exec('WORD.INSERT.MENTION')} />
          <SmallButton icon={I.Comment} label="Resolve" onClick={() => exec('WORD.INSERT.RESOLVE')} />
        </div>
      </div>
    </RGroup>
  );
}

// ─── 11. Header & Footer ──────────────────────────────────────────────────────
export function HeaderFooterGroup() {
  const [showPageNumberModal, setShowPageNumberModal] = React.useState(false);
  const [includeTotal, setIncludeTotal] = React.useState(true);

  const pageLabel = includeTotal ? '1/1' : '1';

  const positions = [
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_LEFT',    style: { top: 4, left: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_CENTER',  style: { top: 4, left: '50%', transform: 'translateX(-50%)' } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.TOP_RIGHT',   style: { top: 4, right: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_LEFT', style: { bottom: 4, left: 4 } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_CENTER', style: { bottom: 4, left: '50%', transform: 'translateX(-50%)' } },
    { cmd: 'WORD.INSERT.PAGE_NUMBER.BOTTOM_RIGHT',  style: { bottom: 4, right: 4 } },
  ];

  const pageNumberContent = (
    <div className="w-[228px] p-3 text-slate-700 font-sans">
      <div className="text-[12px] font-semibold text-[#1e3f70] mb-3">
        Thêm vào Đầu trang hoặc Chân trang
      </div>

      {/* 6 page thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
        {positions.map((pos, idx) => (
          <div
            key={idx}
            onClick={() => exec(pos.cmd)}
            style={{
              width: 60, height: 76,
              border: '1px solid #ccc',
              background: 'white',
              position: 'relative',
              cursor: 'pointer',
              borderRadius: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2b579a')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#ccc')}
          >
            <span style={{
              position: 'absolute',
              fontSize: 9,
              lineHeight: 1,
              color: idx === 2 || idx === 5 ? '#c0392b' : '#2b579a',
              whiteSpace: 'nowrap',
              ...pos.style as any,
            }}>{pageLabel}</span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: '#e2e8f0', margin: '4px 0 8px' }} />

      {/* Bao gồm Số Trang checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, padding: '2px 0', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={includeTotal}
          onChange={e => setIncludeTotal(e.target.checked)}
          style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2b579a' }}
        />
        Bao gồm Số Trang
      </label>

      <div style={{ height: 1, background: '#e2e8f0', margin: '8px 0 6px' }} />

      {/* Manage */}
      <div className="flex items-center gap-3 px-1 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px]" onClick={() => setShowPageNumberModal(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-slate-600">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Quản lý số trang</span>
      </div>

      {/* Remove */}
      <div className="flex items-center gap-3 px-1 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px]" onClick={() => exec('WORD.INSERT.PAGE_NUMBER.REMOVE')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-slate-600">
          <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
          <line x1="8" y1="7" x2="16" y2="7" stroke="#3498db" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="7" r="4" fill="white" stroke="none" />
          <path d="M14 5 l4 4 m-4 0 l4 -4" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Loại bỏ Số Trang</span>
      </div>
    </div>
  );

  return (
    <>
      <RGroup label="Đầu trang & Chân trang">
        <div className="flex gap-1 h-full items-center">
          <LargeButton 
            icon={I.HeaderFooterCombined} 
            label="Đầu trang & Chân trang" 
            onClick={() => exec('WORD.INSERT.HEADER.DIALOG')} 
          />
          <Dropdown
            trigger={
              <button className="flex flex-col items-center justify-center w-[54px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer">
                <I.PageNumberHash size={24} className="text-slate-600 mb-1" />
                <span className="text-[10px] text-slate-700 leading-tight text-center flex items-center gap-0.5">Số Trang <IconChevronDown size={8} className="shrink-0" /></span>
              </button>
            }
          >
            {pageNumberContent}
          </Dropdown>
        </div>
      </RGroup>
      
      {showPageNumberModal && <PageNumberModal onClose={() => setShowPageNumberModal(false)} />}
    </>
  );
}

// ─── 12. Text ─────────────────────────────────────────────────────────────────
export function TextGroup() {
  return (
    <RGroup label="Text" onDialogClick={() => exec('WORD.INSERT.TEXTBOX.DIALOG')}>
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.Text} label="Text Box" onClick={() => exec('WORD.INSERT.TEXTBOX')} />
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Text} label="Quick Parts" onClick={() => exec('WORD.INSERT.QUICKPART')} />
          <SmallButton icon={I.Text} label="Signature Line" onClick={() => exec('WORD.INSERT.SIGNATURE')} />
        </div>
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Text} label="Drop Cap" onClick={() => exec('WORD.INSERT.DROPCAP')} />
          <Dropdown
            trigger={
              <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                <I.Object size={14} className="text-slate-600 shrink-0" /> Object <IconChevronDown size={10} className="ml-auto" />
              </button>
            }
            items={[
              { id: '1', label: 'Insert Object', onClick: () => exec('WORD.INSERT.OBJECT') },
              { id: '2', label: 'File Attachment', onClick: () => exec('WORD.INSERT.FILE') }
            ]}
          />
        </div>
      </div>
    </RGroup>
  );
}

// ─── 13. Symbols ──────────────────────────────────────────────────────────────
const SYMBOL_ITEMS = [
  '•', '€', '£', '¥', '©',
  '®', '™', '±', '≠', '≤',
  '≥', '÷', '×', '∞', 'μ',
  'α', 'β', 'π', 'Ω', '∑',
  '°', 'Δ', '☺', '♥', '₹',
  'λ', 'θ', '√', '≈', '≡',
];

const EMOJI_ITEMS = [
  '😃', '😀', '😂', '🤣', '😄',
  '😅', '😆', '😝', '😉', '😊',
  '😋', '😎', '😍', '😘', '😗',
  '😙', '😚', '🙂', '🤗', '🤔',
  '😐', '😑', '😶', '🙄', '😏',
  '😣', '😥', '😮', '🤐', '😯',
  '😪', '😫', '😴', '😌', '😛',
  '😜', '🙃', '👍', '👏', '🙏',
  '🔥', '❤️', '🎉', '✨', '⭐',
  '💡', '🚀', '💯', '✅', '❌',
];

export function SymbolsGroup() {
  const [showSymbolModal, setShowSymbolModal] = React.useState<'symbol' | 'emoji' | null>(null);

  const insertText = (text: string) => {
    (EditorAPI.getLegacy() as any)?.insertTextAtSelection?.(text);
  };

  const symbolContent = (
    <div className="w-[230px] p-2 bg-white rounded-md shadow-xl border border-slate-200 text-slate-800 font-sans">
      <div className="grid grid-cols-5 gap-1 mb-2">
        {SYMBOL_ITEMS.map((sym, idx) => (
          <button
            key={idx}
            onClick={() => insertText(sym)}
            className="w-10 h-10 flex items-center justify-center text-[18px] hover:bg-blue-50 hover:text-blue-600 rounded border border-transparent hover:border-blue-200 transition-colors"
          >
            {sym}
          </button>
        ))}
      </div>
      <div className="h-[1px] bg-slate-200 my-1" />
      <button
        onClick={() => setShowSymbolModal('symbol')}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-700 text-left transition-colors font-medium"
      >
        <span className="text-[16px] text-slate-600">Ω</span>
        <span>Xem thêm Ký hiệu</span>
      </button>
    </div>
  );

  const emojiContent = (
    <div className="w-[230px] p-2 bg-white rounded-md shadow-xl border border-slate-200 text-slate-800 font-sans">
      <div className="grid grid-cols-5 gap-1 max-h-[250px] overflow-y-auto custom-scrollbar mb-2">
        {EMOJI_ITEMS.map((em, idx) => (
          <button
            key={idx}
            onClick={() => insertText(em)}
            className="w-10 h-10 flex items-center justify-center text-[20px] hover:bg-blue-50 rounded transition-colors"
          >
            {em}
          </button>
        ))}
      </div>
      <div className="h-[1px] bg-slate-200 my-1" />
      <button
        onClick={() => setShowSymbolModal('emoji')}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-700 text-left transition-colors font-medium"
      >
        <span className="text-[16px]">☺</span>
        <span>Xem thêm Emoji</span>
      </button>
    </div>
  );

  return (
    <RGroup label="Ký hiệu Emoji">
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.Equation} label="Phương trình" onClick={() => exec('WORD.INSERT.EQUATION')} />

        {/* Dropdown Ký hiệu */}
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-[54px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer text-slate-700">
              <span className="text-[18px] leading-none mb-1">Ω</span>
              <span className="text-[10px] leading-tight text-center flex items-center gap-0.5">
                Ký hiệu <IconChevronDown size={8} className="shrink-0" />
              </span>
            </button>
          }
        >
          {symbolContent}
        </Dropdown>

        {/* Dropdown Emoji */}
        <Dropdown
          trigger={
            <button className="flex flex-col items-center justify-center w-[54px] rounded hover:bg-slate-200 transition-colors px-1 h-[52px] cursor-pointer text-slate-700">
              <span className="text-[18px] leading-none mb-1">☺</span>
              <span className="text-[10px] leading-tight text-center flex items-center gap-0.5">
                Emoji <IconChevronDown size={8} className="shrink-0" />
              </span>
            </button>
          }
        >
          {emojiContent}
        </Dropdown>
      </div>

      <SymbolModal
        isOpen={!!showSymbolModal}
        type={showSymbolModal || 'symbol'}
        onClose={() => setShowSymbolModal(null)}
      />
    </RGroup>
  );
}

// ─── 14. Media ────────────────────────────────────────────────────────────────
export function MediaGroup() {
  return (
    <RGroup label="Media">
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.Video} label="Video" onClick={() => exec('WORD.INSERT.VIDEO')} />
        <LargeButton icon={I.Audio} label="Audio" onClick={() => exec('WORD.INSERT.AUDIO')} />
        <div className="flex flex-col justify-around h-[52px] w-[120px]">
          <SmallButton icon={I.Video} label="Screen Recording" onClick={() => exec('WORD.INSERT.SCREEN_RECORD')} />
          <Dropdown
            trigger={
              <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                <I.Image size={14} className="text-slate-600 shrink-0" /> Codes <IconChevronDown size={10} className="ml-auto" />
              </button>
            }
            items={[
              { id: '1', label: 'QR Code', onClick: () => exec('WORD.INSERT.QRCODE') },
              { id: '2', label: 'Barcode', onClick: () => exec('WORD.INSERT.BARCODE') }
            ]}
          />
        </div>
      </div>
    </RGroup>
  );
}

// ─── 15. AI ───────────────────────────────────────────────────────────────────
export function AIGroup() {
  return (
    <RGroup label="AI">
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.AI} label="AI Gen Image" onClick={() => exec('WORD.AI.GENERATE_IMAGE')} />
        <div className="flex flex-col justify-around h-[52px] w-[120px]">
          <SmallButton icon={I.SmartArt} label="Generate Diagram" onClick={() => exec('WORD.AI.GENERATE_DIAGRAM')} />
          <SmallButton icon={I.Table} label="Generate Table" onClick={() => exec('WORD.AI.GENERATE_TABLE')} />
        </div>
        <div className="flex flex-col justify-around h-[52px] w-[120px]">
          <SmallButton icon={I.Text} label="Generate Summary" onClick={() => exec('WORD.AI.GENERATE_SUMMARY')} />
          <SmallButton icon={I.Doc} label="Generate Cover" onClick={() => exec('WORD.AI.GENERATE_COVER')} />
        </div>
      </div>
    </RGroup>
  );
}

// ─── 16. Plugins ──────────────────────────────────────────────────────────────
export function PluginsGroup() {
  return (
    <RGroup label="Plugins">
      <div className="flex gap-1 h-full items-center">
        <LargeButton icon={I.Plugin} label="Marketplace" onClick={() => exec('WORD.PLUGIN.STORE')} />
        <div className="flex flex-col justify-around h-[52px] w-[110px]">
          <SmallButton icon={I.Plugin} label="Installed Plugins" onClick={() => exec('WORD.PLUGIN.INSTALLED')} />
          <SmallButton icon={I.Plugin} label="Plugin Manager" onClick={() => exec('WORD.PLUGIN.MANAGER')} />
        </div>
      </div>
    </RGroup>
  );
}
