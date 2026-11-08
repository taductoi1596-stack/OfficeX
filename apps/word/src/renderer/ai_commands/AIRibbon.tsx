import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconSparkles = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
  </svg>
);

const IconWrite = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconRewrite = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15A9 9 0 0 0 18.36 18.36L23 14"/>
  </svg>
);

const IconReview = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconTranslate = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconGenerate = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconInsert = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const IconResearch = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconSettings = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ─── Button Helpers ───────────────────────────────────────────────────────────
function LargeBtn({ icon: Icon, label, cmdId, color = 'text-blue-600' }: { icon: any; label: string; cmdId: string; color?: string }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        CommandDispatcher.dispatch(cmdId);
      }}
      className="flex flex-col items-center justify-center w-16 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors px-1 shrink-0"
      style={{ height: 52 }}
    >
      <Icon size={22} className={`${color} mb-0.5`} />
      <span className="text-[10px] text-slate-700 dark:text-slate-200 leading-tight text-center font-medium">{label}</span>
    </button>
  );
}

function SmallBtn({ label, cmdId, icon: Icon }: { label: string; cmdId: string; icon?: any }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        CommandDispatcher.dispatch(cmdId);
      }}
      className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
    >
      {Icon && <Icon size={12} className="text-slate-500" />}
      <span>{label}</span>
    </button>
  );
}

function LargeDropdownButton({ icon: Icon, label, items }: { icon: any; label: string; items: { id: string; label: string; onClick: () => void }[] }) {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 2, left: rect.left });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative inline-block shrink-0">
      <button
        ref={buttonRef}
        onMouseDown={handleToggle}
        className="flex flex-col items-center justify-center w-16 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors px-1 shrink-0"
        style={{ height: 52 }}
      >
        <Icon size={22} className="text-purple-600 mb-0.5" />
        <span className="text-[10px] text-slate-700 dark:text-slate-200 leading-tight text-center flex items-center gap-0.5 font-medium">
          {label} <IconChevronDown size={8} />
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 99999 }}
          className="flex flex-col py-1 w-48 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xl"
        >
          {items.map((item) => (
            <button
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
                setOpen(false);
              }}
              className="text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main AI Ribbon Component ─────────────────────────────────────────────────
export function AIRibbon() {
  return (
    <div className="flex gap-1 items-center h-full overflow-x-auto py-0.5">

      {/* GROUP 1: OfficeX AI */}
      <RGroup label="OfficeX AI">
        <LargeBtn icon={IconSparkles} label="OfficeX AI" cmdId="WORD.AI.OPEN" color="text-purple-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="New Chat" cmdId="WORD.AI.NEW_CHAT" />
          <SmallBtn label="Sidebar" cmdId="WORD.AI.OPEN_SIDEBAR" />
        </div>
        <LargeDropdownButton
          icon={IconSparkles}
          label="AI History"
          items={[
            { id: '1', label: 'Recent Chats', onClick: () => CommandDispatcher.dispatch('WORD.AI.RECENT_CHATS') },
            { id: '2', label: 'Pinned Chats', onClick: () => CommandDispatcher.dispatch('WORD.AI.PINNED_CHATS') },
            { id: '3', label: 'Chat History', onClick: () => CommandDispatcher.dispatch('WORD.AI.HISTORY') },
          ]}
        />
      </RGroup>

      {/* GROUP 2: Writing */}
      <RGroup label="Writing">
        <LargeBtn icon={IconWrite} label="Continue" cmdId="WORD.AI.CONTINUE" />
        <LargeBtn icon={IconRewrite} label="Rewrite" cmdId="WORD.AI.REWRITE" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Shorten" cmdId="WORD.AI.SHORTEN" />
          <SmallBtn label="Expand" cmdId="WORD.AI.EXPAND" />
        </div>
        <LargeDropdownButton
          icon={IconWrite}
          label="Tone & Style"
          items={[
            { id: '1', label: 'Professional', onClick: () => CommandDispatcher.dispatch('WORD.AI.REWRITE.PROFESSIONAL') },
            { id: '2', label: 'Academic', onClick: () => CommandDispatcher.dispatch('WORD.AI.REWRITE.ACADEMIC') },
            { id: '3', label: 'Friendly', onClick: () => CommandDispatcher.dispatch('WORD.AI.REWRITE.FRIENDLY') },
            { id: '4', label: 'Formal', onClick: () => CommandDispatcher.dispatch('WORD.AI.REWRITE.FORMAL') },
            { id: '5', label: 'Simplify', onClick: () => CommandDispatcher.dispatch('WORD.AI.REWRITE.SIMPLIFY') },
            { id: '6', label: 'Fix Grammar & Spelling', onClick: () => CommandDispatcher.dispatch('WORD.AI.GRAMMAR') },
            { id: '7', label: 'Improve Tone', onClick: () => CommandDispatcher.dispatch('WORD.AI.TONE') },
          ]}
        />
      </RGroup>

      {/* GROUP 3: Review */}
      <RGroup label="Review">
        <LargeBtn icon={IconReview} label="Review Doc" cmdId="WORD.AI.REVIEW" color="text-amber-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Selection" cmdId="WORD.AI.REVIEW_SELECTION" />
          <SmallBtn label="Accessibility" cmdId="WORD.AI.ACCESSIBILITY" />
        </div>
        <LargeDropdownButton
          icon={IconReview}
          label="Analysis"
          items={[
            { id: '1', label: 'Readability Check', onClick: () => CommandDispatcher.dispatch('WORD.AI.READABILITY') },
            { id: '2', label: 'Duplicate Detection', onClick: () => CommandDispatcher.dispatch('WORD.AI.DUPLICATE') },
            { id: '3', label: 'Contradiction Check', onClick: () => CommandDispatcher.dispatch('WORD.AI.CONTRADICTION') },
            { id: '4', label: 'Track Changes Review', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRACK_CHANGES_REVIEW') },
          ]}
        />
      </RGroup>

      {/* GROUP 4: Translate */}
      <RGroup label="Translate">
        <LargeBtn icon={IconTranslate} label="Translate" cmdId="WORD.AI.TRANSLATE" color="text-emerald-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Page" cmdId="WORD.AI.TRANSLATE_PAGE" />
          <SmallBtn label="Document" cmdId="WORD.AI.TRANSLATE_DOCUMENT" />
        </div>
        <LargeDropdownButton
          icon={IconTranslate}
          label="Languages"
          items={[
            { id: '1', label: 'Auto Detect Language', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.AUTO') },
            { id: '2', label: 'English', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.EN') },
            { id: '3', label: 'Vietnamese', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.VI') },
            { id: '4', label: 'Chinese', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.ZH') },
            { id: '5', label: 'Japanese', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.JA') },
            { id: '6', label: 'Korean', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.KO') },
            { id: '7', label: 'French', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.FR') },
            { id: '8', label: 'German', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.DE') },
            { id: '9', label: 'Spanish', onClick: () => CommandDispatcher.dispatch('WORD.AI.TRANSLATE.ES') },
          ]}
        />
      </RGroup>

      {/* GROUP 5: Generate */}
      <RGroup label="Generate">
        <LargeBtn icon={IconGenerate} label="Outline" cmdId="WORD.AI.OUTLINE" color="text-indigo-600" />
        <LargeBtn icon={IconGenerate} label="Summary" cmdId="WORD.AI.SUMMARIZE" color="text-blue-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Title" cmdId="WORD.AI.TITLE" />
          <SmallBtn label="TOC" cmdId="WORD.AI.TOC" />
        </div>
        <LargeDropdownButton
          icon={IconGenerate}
          label="More"
          items={[
            { id: '1', label: 'Generate FAQ', onClick: () => CommandDispatcher.dispatch('WORD.AI.FAQ') },
            { id: '2', label: 'Generate References', onClick: () => CommandDispatcher.dispatch('WORD.AI.REFERENCE') },
            { id: '3', label: 'Generate Metadata', onClick: () => CommandDispatcher.dispatch('WORD.AI.METADATA') },
          ]}
        />
      </RGroup>

      {/* GROUP 6: Insert */}
      <RGroup label="Insert">
        <LargeBtn icon={IconInsert} label="Table" cmdId="WORD.AI.TABLE" color="text-teal-600" />
        <LargeBtn icon={IconInsert} label="SmartArt" cmdId="WORD.AI.SMARTART" color="text-cyan-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Diagram" cmdId="WORD.AI.DIAGRAM" />
          <SmallBtn label="Timeline" cmdId="WORD.AI.TIMELINE" />
        </div>
        <LargeDropdownButton
          icon={IconInsert}
          label="Graphics"
          items={[
            { id: '1', label: 'Generate Mind Map', onClick: () => CommandDispatcher.dispatch('WORD.AI.MINDMAP') },
            { id: '2', label: 'Generate Flowchart', onClick: () => CommandDispatcher.dispatch('WORD.AI.FLOWCHART') },
            { id: '3', label: 'Generate Image Prompt', onClick: () => CommandDispatcher.dispatch('WORD.AI.IMAGEPROMPT') },
          ]}
        />
      </RGroup>

      {/* GROUP 7: Research */}
      <RGroup label="Research">
        <LargeBtn icon={IconResearch} label="Explain" cmdId="WORD.AI.EXPLAIN" color="text-violet-600" />
        <LargeBtn icon={IconResearch} label="Ask AI" cmdId="WORD.AI.ASK" color="text-fuchsia-600" />
        <div className="flex flex-col gap-0.5 justify-center">
          <SmallBtn label="Search" cmdId="WORD.AI.SEARCH" />
          <SmallBtn label="Similar" cmdId="WORD.AI.FIND_SIMILAR" />
        </div>
        <LargeDropdownButton
          icon={IconResearch}
          label="Study"
          items={[
            { id: '1', label: 'Generate Questions', onClick: () => CommandDispatcher.dispatch('WORD.AI.QUESTIONS') },
            { id: '2', label: 'Create Flash Cards', onClick: () => CommandDispatcher.dispatch('WORD.AI.FLASHCARD') },
          ]}
        />
      </RGroup>

      {/* GROUP 8: Settings */}
      <RGroup label="Settings">
        <LargeBtn icon={IconSettings} label="Settings" cmdId="WORD.AI.SETTINGS" color="text-slate-600" />
      </RGroup>

    </div>
  );
}
