import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';

// Using simple SVG icons for View tab
const IconPrintLayout = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="8" y1="4" x2="8" y2="20"/></svg>;
const IconReadMode = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconWebLayout = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconDraftView = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconCheckbox = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="9 12 12 15 15 9"/></svg>;
const IconZoom = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
const Icon100 = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M8 9v6M12 9v6M16 9v6"/><path d="M11 9h2M11 15h2M15 9h2M15 15h2"/></svg>;
const IconNewWindow = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const IconSplit = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 8 12 4 16 8"/><polyline points="8 16 12 20 16 16"/></svg>;
const IconSwitch = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>;
const IconDarkMode = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconAI = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="url(#ai-gradient)" strokeWidth="2"><defs><linearGradient id="ai-gradient" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#ai-gradient)" opacity="0.2"/><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>;

function LargeButton({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="flex flex-col items-center justify-center w-14 rounded hover:bg-slate-200 transition-colors px-1"
      style={{ height: 52 }}
    >
      <Icon size={24} className="text-slate-600 mb-1" />
      <span className="text-[10px] text-slate-700 leading-tight text-center">{label}</span>
    </button>
  );
}

function SmallButton({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full"
    >
      <Icon size={14} className="text-slate-600 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

export function ViewRibbon() {
  return (
    <>
      <RGroup label="Document Views">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconPrintLayout} label="Print Layout" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.PRINT')} />
          <LargeButton icon={IconReadMode} label="Read Mode" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.READ')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconWebLayout} label="Web Layout" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.WEB')} />
            <SmallButton icon={IconDraftView} label="Draft View" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.DRAFT')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Show">
        <div className="flex gap-1 mr-1 h-full items-center">
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconCheckbox} label="Ruler" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.SHOW.RULER')} />
            <SmallButton icon={IconCheckbox} label="Gridlines" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.SHOW.GRIDLINES')} />
          </div>
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconCheckbox} label="Navigation Pane" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.SHOW.NAVIGATION')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Zoom">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconZoom} label="Zoom" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.ZOOM')} />
          <LargeButton icon={Icon100} label="100%" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.ZOOM.100')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                  <IconZoom size={14} className="text-slate-600 shrink-0" /> Pages <IconChevronDown size={10} className="ml-auto" />
                </button>
              }
              items={[
                { id: '1', label: 'One Page', onClick: () => CommandDispatcher.dispatch('WORD.VIEW.ZOOM.WHOLEPAGE') },
                { id: '2', label: 'Multiple Pages', onClick: () => CommandDispatcher.dispatch('WORD.VIEW.ZOOM.MULTIPAGE') },
                { id: '3', label: 'Page Width', onClick: () => CommandDispatcher.dispatch('WORD.VIEW.ZOOM.PAGEWIDTH') }
              ]}
            />
          </div>
        </div>
      </RGroup>

      <RGroup label="Window">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconNewWindow} label="New Window" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.WINDOW.NEW')} />
          <LargeButton icon={IconSplit} label="Split" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.WINDOW.SPLIT')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconSwitch} label="View Side by Side" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.WINDOW.SIDEBYSIDE')} />
            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                  <IconSwitch size={14} className="text-slate-600 shrink-0" /> Switch <IconChevronDown size={10} className="ml-auto" />
                </button>
              }
              items={[
                { id: '1', label: 'Switch Windows', onClick: () => CommandDispatcher.dispatch('WORD.VIEW.WINDOW.SWITCH') }
              ]}
            />
          </div>
        </div>
      </RGroup>

      <RGroup label="Dark Mode">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconDarkMode} label="Dark Mode" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.DARKMODE')} />
        </div>
      </RGroup>

      <RGroup label="AI View">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAI} label="AI View" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.AI')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconAI} label="AI Summary" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.AI.SUMMARIZE')} />
            <SmallButton icon={IconAI} label="AI Outline" onClick={() => CommandDispatcher.dispatch('WORD.VIEW.AI.OUTLINE')} />
          </div>
        </div>
      </RGroup>
    </>
  );
}
