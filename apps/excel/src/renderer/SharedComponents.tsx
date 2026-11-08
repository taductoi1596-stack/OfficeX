import React from 'react';

// ─── Ribbon button — uses onMouseDown+preventDefault to keep selection ─────────
export function RBtn({ icon: Icon, title, onCmd, active, size = 14 }: {
  icon: any; title?: string; onCmd?: () => void; active?: boolean; size?: number;
}) {
  return (
    <button
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // don't steal focus from contentEditable
        onCmd?.();
      }}
      className={`flex items-center justify-center w-7 h-7 rounded transition-colors ${
        active
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      <Icon size={size} />
    </button>
  );
}

// ─── Ribbon group ─────────────────────────────────────────────────────────────
export function RGroup({ label, children, onDialogClick }: { label: string; children: React.ReactNode, onDialogClick?: () => void }) {
  return (
    <div className="flex flex-col border-r border-border pr-2 mr-1 shrink-0 relative group" style={{ minHeight: 78 }}>
      <div className="flex items-start gap-0.5 flex-1 flex-wrap content-start pt-1">{children}</div>
      <div className="text-[9px] text-slate-400 text-center pb-0.5 mt-0.5">{label}</div>
      {onDialogClick && (
        <button 
          onClick={onDialogClick}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 flex items-center justify-center hover:bg-slate-200 text-slate-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          title={`${label} Settings`}
        >
          <svg viewBox="0 0 10 10" fill="currentColor" width="8" height="8">
            <path d="M1,8 L8,8 L8,1 L9,1 L9,9 L1,9 L1,8 Z M7.5,7.5 L7.5,2 L2,7.5 L7.5,7.5 Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
