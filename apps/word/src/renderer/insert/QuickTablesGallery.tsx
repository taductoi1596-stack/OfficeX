import React from 'react';
import { CommandDispatcher } from '../CommandDispatcher';

const quickTables = [
  { id: 'calendar', name: 'Calendar', desc: 'Monthly view calendar template' },
  { id: 'matrix', name: 'Matrix', desc: 'Simple 2x2 comparison matrix' },
  { id: 'list', name: 'Tabular List', desc: 'Standard data list with header' },
  { id: 'report', name: 'Report', desc: 'Formal report table format' },
  { id: 'invoice', name: 'Invoice', desc: 'Standard invoice itemization' },
  { id: 'timeline', name: 'Timeline', desc: 'Project schedule and timeline' }
];

export const QuickTablesGallery: React.FC = () => {
  return (
    <div className="w-64 p-2 bg-white flex flex-col shadow-sm text-slate-800 text-xs max-h-96 overflow-y-auto">
      <div className="mb-2 font-semibold text-[11px] text-slate-600 px-2">
        Built-in Templates
      </div>
      
      <div className="flex flex-col gap-1">
        {quickTables.map(t => (
          <button
            key={t.id}
            onClick={() => CommandDispatcher.dispatch(`WORD.INSERT.TABLE.QUICK.${t.id.toUpperCase()}`)}
            className="flex flex-col items-start px-2 py-2 hover:bg-blue-50 rounded transition-colors text-left"
          >
            <span className="font-medium text-slate-700">{t.name}</span>
            <span className="text-[10px] text-slate-500">{t.desc}</span>
            <div className="mt-1 w-full h-8 border border-slate-200 bg-white grid grid-cols-4 grid-rows-3 gap-[1px] p-[1px]">
              {/* Dummy thumbnail visualization */}
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className={`bg-slate-100 ${i < 4 ? 'bg-slate-200' : ''}`} />
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-200 my-2" />
      
      <button 
        className="text-left px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600"
        onClick={() => CommandDispatcher.dispatch('WORD.INSERT.TABLE.QUICK.SAVE')}
      >
        Save Selection to Quick Tables Gallery...
      </button>
    </div>
  );
};
