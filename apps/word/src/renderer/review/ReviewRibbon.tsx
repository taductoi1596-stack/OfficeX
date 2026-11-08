import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';

// Using simple SVG icons for Review tab
const IconSpelling = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>; // simple ABC icon representation
const IconThesaurus = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const IconTranslate = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>;
const IconTrack = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const IconAccept = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconReject = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const IconComment = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconCompare = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const IconProtect = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconAccessibility = (props: any) => <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
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

export function ReviewRibbon() {
  return (
    <>
      <RGroup label="Proofing & Language">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconSpelling} label="Editor" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.EDITOR')} />
          <LargeButton icon={IconThesaurus} label="Thesaurus" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.THESAURUS')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-slate-200 transition-colors text-[11px] text-slate-700 w-full text-left">
                  <IconTranslate size={14} className="text-slate-600 shrink-0" /> Translate <IconChevronDown size={10} className="ml-auto" />
                </button>
              }
              items={[
                { id: '1', label: 'Translate Selection', onClick: () => CommandDispatcher.dispatch('WORD.REVIEW.TRANSLATE.SELECTION') },
                { id: '2', label: 'Translate Document', onClick: () => CommandDispatcher.dispatch('WORD.REVIEW.TRANSLATE.DOCUMENT') }
              ]}
            />
            <SmallButton icon={IconSpelling} label="Language" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.LANGUAGE')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Track Changes">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconTrack} label="Track Changes" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.TRACK')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <div className="flex items-center px-2">
              <span className="text-[11px] text-slate-700 mr-2">Markup:</span>
              <select className="h-6 text-[11px] border rounded px-1 bg-white" onChange={(e) => CommandDispatcher.dispatch('WORD.REVIEW.DISPLAY.' + e.target.value)}>
                <option value="ALL">All Markup</option>
                <option value="SIMPLE">Simple Markup</option>
                <option value="NONE">No Markup</option>
                <option value="ORIGINAL">Original</option>
              </select>
            </div>
            <SmallButton icon={IconTrack} label="Reviewing Pane" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.PANE')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Changes">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAccept} label="Accept" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.ACCEPT')} />
          <LargeButton icon={IconReject} label="Reject" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.REJECT')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconTrack} label="Previous" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.PREVIOUS')} />
            <SmallButton icon={IconTrack} label="Next" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.NEXT')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Comments">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconComment} label="New Comment" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMMENT')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconComment} label="Delete" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMMENT.DELETE')} />
            <SmallButton icon={IconComment} label="Resolve" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMMENT.RESOLVE')} />
          </div>
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconComment} label="Previous" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMMENT.PREVIOUS')} />
            <SmallButton icon={IconComment} label="Next" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMMENT.NEXT')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Compare & Protect">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconCompare} label="Compare" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.COMPARE')} />
          <LargeButton icon={IconProtect} label="Protect" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.PROTECT')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconProtect} label="Restrict Editing" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.RESTRICT')} />
          </div>
        </div>
      </RGroup>

      <RGroup label="Accessibility">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAccessibility} label="Check Issues" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.ACCESSIBILITY')} />
        </div>
      </RGroup>

      <RGroup label="AI Review">
        <div className="flex gap-1 mr-1 h-full items-center">
          <LargeButton icon={IconAI} label="AI Review" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.AI')} />
          <div className="flex flex-col justify-around" style={{ height: 52 }}>
            <SmallButton icon={IconAI} label="Improve Writing" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.AI.IMPROVE')} />
            <SmallButton icon={IconAI} label="Rewrite" onClick={() => CommandDispatcher.dispatch('WORD.REVIEW.AI.REWRITE')} />
          </div>
        </div>
      </RGroup>
    </>
  );
}
