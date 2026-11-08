import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import * as I from '@officex/icons';

export function SmartArtFormatRibbon() {
  return (
    <div className="flex h-full w-full gap-2 px-2 overflow-x-auto select-none">
      <RGroup label="Shape Styles">
        <div className="flex gap-1 h-full items-center">
          <div className="flex flex-col justify-around h-[52px] w-[100px]">
            <button className="flex items-center gap-1.5 px-2 h-6 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 w-full text-left">
              <I.IconEdit3 size={12} className="text-slate-600" /> Shape Fill
            </button>
            <button className="flex items-center gap-1.5 px-2 h-6 rounded hover:bg-slate-200 transition-colors text-[10px] text-slate-700 w-full text-left">
              <I.IconFontColor size={12} className="text-slate-600" /> Shape Outline
            </button>
          </div>
          <RBtn icon={I.IconRewrite} title="Shape Effects" />
        </div>
      </RGroup>
      
      <RGroup label="WordArt Styles">
        <div className="flex gap-1 h-full items-center px-4 border border-slate-200 bg-white rounded cursor-pointer hover:bg-slate-50">
           <span className="text-xs text-slate-500">WordArt Gallery Placeholder</span>
        </div>
      </RGroup>

      <RGroup label="Arrange">
        <div className="flex gap-1 h-full items-center">
          <RBtn icon={I.IconBorders} title="Position" />
          <RBtn icon={I.IconSelectionPane} title="Wrap Text" />
        </div>
      </RGroup>
      
      <RGroup label="Size">
        <div className="flex flex-col justify-center gap-1 h-[52px] w-[80px]">
          <input type="text" className="h-5 w-full text-[10px] border border-slate-300 rounded px-1" placeholder="Height" />
          <input type="text" className="h-5 w-full text-[10px] border border-slate-300 rounded px-1" placeholder="Width" />
        </div>
      </RGroup>
    </div>
  );
}
