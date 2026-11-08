import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import * as I from '@officex/icons';
import { CommandDispatcher } from '../CommandDispatcher';

export function SmartArtDesignRibbon() {
  const exec = (cmd: string) => CommandDispatcher.dispatch(cmd);
  
  return (
    <div className="flex h-full w-full gap-2 px-2 overflow-x-auto select-none">
      <RGroup label="Create Graphic">
        <div className="flex gap-1 h-full items-center">
          <RBtn icon={I.IconPlus} title="Add Shape" onCmd={() => exec('WORD.SMARTART.ADD_SHAPE')} />
          <div className="flex flex-col justify-around h-[52px] w-[90px]">
            <button onClick={() => exec('WORD.SMARTART.PROMOTE')} className="flex items-center gap-1.5 px-2 h-6 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 w-full text-left">
              <I.IconUndo size={12} className="text-slate-600" /> Promote
            </button>
            <button onClick={() => exec('WORD.SMARTART.DEMOTE')} className="flex items-center gap-1.5 px-2 h-6 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 w-full text-left">
              <I.IconRedo size={12} className="text-slate-600" /> Demote
            </button>
          </div>
          <RBtn icon={I.IconAlignLeft} title="Text Pane" />
        </div>
      </RGroup>
      
      <RGroup label="Layouts">
        <div className="flex gap-1 h-full items-center px-4 border border-slate-200 bg-white rounded cursor-pointer hover:bg-slate-50">
           <span className="text-xs text-slate-500">Layout Gallery Placeholder</span>
        </div>
      </RGroup>

      <RGroup label="SmartArt Styles">
        <div className="flex gap-1 h-full items-center px-4 border border-slate-200 bg-white rounded cursor-pointer hover:bg-slate-50">
           <span className="text-xs text-slate-500">Style Gallery Placeholder</span>
        </div>
      </RGroup>
      
      <RGroup label="Reset">
        <RBtn icon={I.IconUndo} title="Reset Graphic" />
      </RGroup>
    </div>
  );
}
