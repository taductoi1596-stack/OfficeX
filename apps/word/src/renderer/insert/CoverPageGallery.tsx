import React, { useState } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { IconSearch, IconStar, IconPin, IconTrash, IconPlus, IconDownload, IconUpload } from '@officex/icons';

const COVER_TEMPLATES = [
  "Blank", "Austin", "Banded", "Conservative", "Facet", "Filigree", "Grid", 
  "Integral", "Ion", "Motion", "Perspective", "Sideline", "Slice", 
  "ViewMaster", "Whisp", "Annual Report", "Business", "Academic", 
  "Modern", "Creative", "Minimal", "Corporate", "Portfolio", 
  "Resume", "Magazine", "Newsletter", "Proposal", "Book", "Research"
];

export function CoverPageGallery() {
  const [search, setSearch] = useState('');

  const filtered = COVER_TEMPLATES.filter(t => t.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (templateId: string) => {
    CommandDispatcher.dispatch('WORD.INSERT.PAGE.COVER.TEMPLATE', { templateId });
  };

  return (
    <div className="w-[450px] bg-white text-slate-800 flex flex-col font-sans" style={{ maxHeight: '600px' }}>
      {/* Header / Search */}
      <div className="p-2 border-b border-slate-200 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-1 flex-1">
          <IconSearch size={14} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="bg-transparent border-none outline-none text-xs w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-2 overflow-y-auto flex-1 grid grid-cols-3 gap-2 bg-slate-50">
        {filtered.map(t => (
          <div 
            key={t} 
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-200 cursor-pointer transition-colors border border-transparent hover:border-slate-300"
            onClick={() => handleSelect(t)}
            title={t}
          >
            {/* Mock Thumbnail */}
            <div className="w-[100px] h-[140px] bg-white border border-slate-300 shadow-sm rounded flex flex-col relative overflow-hidden">
              <div className="h-6 bg-slate-100 border-b border-slate-200" />
              <div className="flex-1 p-2 flex flex-col gap-1">
                <div className="h-2 bg-slate-200 w-3/4 rounded" />
                <div className="h-1.5 bg-slate-100 w-1/2 rounded" />
                <div className="mt-auto h-8 bg-blue-50/50 rounded flex items-center justify-center">
                  <span className="text-[8px] text-blue-400 font-bold opacity-30">{t}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-center w-full truncate font-medium">{t}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center text-xs text-slate-500 py-4">No templates found.</div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-2 border-t border-slate-200 bg-slate-100 flex flex-col gap-1 text-[11px]">
        <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200 rounded text-left w-full transition-colors" onClick={() => CommandDispatcher.dispatch('WORD.INSERT.PAGE.COVER.IMPORT')}>
          <IconDownload size={12} className="text-slate-600" /> Import Cover Template
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200 rounded text-left w-full transition-colors" onClick={() => CommandDispatcher.dispatch('WORD.INSERT.PAGE.COVER.EXPORT')}>
          <IconUpload size={12} className="text-slate-600" /> Export Cover Template
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200 rounded text-left w-full transition-colors" onClick={() => CommandDispatcher.dispatch('WORD.INSERT.PAGE.COVER.NEW')}>
          <IconPlus size={12} className="text-slate-600" /> Create New Template
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-100 text-red-600 rounded text-left w-full transition-colors" onClick={() => CommandDispatcher.dispatch('WORD.INSERT.PAGE.COVER.DELETE')}>
          <IconTrash size={12} className="text-red-500" /> Delete Custom Template
        </button>
      </div>
    </div>
  );
}
