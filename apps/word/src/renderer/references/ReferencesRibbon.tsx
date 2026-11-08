import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';

// Using simple SVG icons for References tab
const IconTOC = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="14" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>;
const IconFootnote = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M7 20v-5"/></svg>;
const IconCitation = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IconManageSources = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconBibliography = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const IconCaption = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg>;
const IconIndex = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>;
const IconAuthorities = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const IconAI = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="url(#ai-gradient)" strokeWidth="2"><defs><linearGradient id="ai-gradient" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient></defs><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#ai-gradient)" opacity="0.2"/><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>;
const IconCross = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;

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

export function ReferencesRibbon() {
  return (
    <>
      <RGroup label="Table of Contents">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconTOC} label="Table of Contents" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.TOC')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconTOC} label="Update Table" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.TOC.UPDATE')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Footnotes">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconFootnote} label="Insert Footnote" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.FOOTNOTE')} />
          <LargeButton icon={IconFootnote} label="Insert Endnote" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.ENDNOTE')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                  <IconFootnote size={14} className="text-slate-600 shrink-0" /> Next Footnote <IconChevronDown size={10} className="ml-auto" />
                </button>
              }
              items={[
                { id: '1', label: 'Next Footnote', onClick: () => CommandDispatcher.dispatch('WORD.REFERENCE.FOOTNOTE.NEXT') },
                { id: '2', label: 'Previous Footnote', onClick: () => CommandDispatcher.dispatch('WORD.REFERENCE.FOOTNOTE.PREVIOUS') },
                { id: '3', label: 'Next Endnote', onClick: () => CommandDispatcher.dispatch('WORD.REFERENCE.ENDNOTE.NEXT') },
                { id: '4', label: 'Previous Endnote', onClick: () => CommandDispatcher.dispatch('WORD.REFERENCE.ENDNOTE.PREVIOUS') }
              ]}
            />
          </div>
        </div>
      </RGroup>

      <RGroup label="Research & Citations">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconCitation} label="Insert Citation" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.CITATION')} />
          <LargeButton icon={IconManageSources} label="Manage Sources" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.CITATION.MANAGE')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <div className="flex items-center px-2">
              <span className="text-[11px] text-slate-700 mr-2">Style:</span>
              <select className="h-6 text-[11px] border rounded px-1 bg-white" onChange={(e) => CommandDispatcher.dispatch('WORD.REFERENCE.' + e.target.value)}>
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="CHICAGO">Chicago</option>
                <option value="IEEE">IEEE</option>
              </select>
            </div>
            <SmallButton icon={IconBibliography} label="Bibliography" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.BIBLIOGRAPHY')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Captions">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconCaption} label="Insert Caption" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.CAPTION')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconCaption} label="Insert Table of Figures" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.TABLEFIGURES')} />
            <SmallButton icon={IconCross} label="Cross-reference" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.CROSS')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Index">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconIndex} label="Mark Entry" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.INDEX.MARK')} />
          <LargeButton icon={IconIndex} label="Insert Index" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.INDEX')} />
        </div>
      </RGroup>

      <RGroup label="Table of Authorities">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAuthorities} label="Mark Citation" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.AUTHORITIES.MARK')} />
          <LargeButton icon={IconAuthorities} label="Insert Table of Authorities" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.AUTHORITIES')} />
        </div>
      </RGroup>

      <RGroup label="AI References">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAI} label="AI Citation" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.AI.CITATION')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconAI} label="Validate References" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.AI.VALIDATE')} />
            <SmallButton icon={IconAI} label="Find Missing" onClick={() => CommandDispatcher.dispatch('WORD.REFERENCE.AI.FIND')} />
          </div>
        </div>
      </RGroup>
    </>
  );
}
