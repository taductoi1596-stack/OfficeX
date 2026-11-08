import React, { useState } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { IconTable, IconEdit3, IconFileSpreadsheet, IconZap } from '@officex/icons';

export const TableGallery: React.FC = () => {
  const maxRows = 8;
  const maxCols = 10;
  
  const [hoverRow, setHoverRow] = useState(-1);
  const [hoverCol, setHoverCol] = useState(-1);

  const handleMouseMove = (r: number, c: number) => {
    setHoverRow(r);
    setHoverCol(c);
  };

  const handleMouseLeave = () => {
    setHoverRow(-1);
    setHoverCol(-1);
  };

  const handleClick = (r: number, c: number) => {
    console.log('[TableGallery] handleClick', r, c);
    CommandDispatcher.dispatch('WORD.INSERT.TABLE', { rows: r + 1, cols: c + 1 });
  };

  const hasSelection = hoverRow >= 0 && hoverCol >= 0;

  return (
    <div className="w-56 p-2 bg-white flex flex-col shadow-sm text-slate-800 text-xs">
      <div className="mb-2 font-semibold text-center text-[11px] text-slate-600">
        {hasSelection ? `${hoverCol + 1}x${hoverRow + 1} Table` : 'Insert Table'}
      </div>
      
      <div 
        className="flex flex-col gap-[2px] mx-auto mb-2 cursor-pointer"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxRows }).map((_, r) => (
          <div key={`r-${r}`} className="flex gap-[2px]">
            {Array.from({ length: maxCols }).map((_, c) => {
              const isSelected = r <= hoverRow && c <= hoverCol;
              return (
                <div
                  key={`c-${c}`}
                  onMouseMove={() => handleMouseMove(r, c)}
                  onClick={() => handleClick(r, c)}
                  className={`w-[14px] h-[14px] border transition-colors ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-100' 
                      : 'border-slate-300 bg-white hover:border-orange-400'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 my-1" />
      
      <button 
        className="text-left px-2 py-1.5 hover:bg-slate-100 rounded transition-colors flex items-center gap-2"
        onClick={() => CommandDispatcher.dispatch('WORD.INSERT.TABLE.DIALOG')}
      >
        <IconTable size={14} className="text-slate-600" />
        Insert Table...
      </button>
    </div>
  );
};
