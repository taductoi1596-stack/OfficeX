import React, { useState } from 'react';
import * as I from 'lucide-react';
import { ColorPicker } from '@officex/ui';
import { EditorAPI } from './editorApi';
import { useRibbonState } from './RibbonController';

export function MiniToolbar({ top, left, isInTable, onAction }: { top: number, left: number, isInTable: boolean, onAction: () => void }) {
  const legacyApi = EditorAPI.getLegacy() as any;
  const rs = useRibbonState();
  const [showColor, setShowColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const BASE_FONTS = [
    'Aptos', 'Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 
    'Courier New', 'Georgia', 'Impact', 'Inter', 'Roboto', 
    'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
  ];

  const [fontFamilies, setFontFamilies] = React.useState<string[]>(BASE_FONTS);
  
  React.useEffect(() => {
    if ('queryLocalFonts' in window) {
      (window as any).queryLocalFonts().then((fonts: any[]) => {
        const names = Array.from(new Set(fonts.map((f: any) => f.family))) as string[];
        setFontFamilies(Array.from(new Set([...BASE_FONTS, ...names])).sort());
      }).catch(console.warn);
    }
  }, []);

  const FONT_SIZES = [
    8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
  ];

  return (
    <div 
      className="absolute bg-white border border-slate-200 shadow-xl rounded flex items-center p-1 gap-1 z-[9999]"
      style={{ top, left }}
      onMouseDown={e => { 
        if ((e.target as HTMLElement).tagName !== 'SELECT') e.preventDefault(); 
        e.stopPropagation(); 
      }} // Prevent stealing focus and bubbling
      onMouseMove={e => e.stopPropagation()}
    >
      <select className="border border-slate-200 rounded px-1 py-0.5 text-xs w-24 h-6 focus:outline-none" value={rs.fontFamily} onChange={e => { legacyApi?.setFontFamily?.(e.target.value); onAction(); }}>
        {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      
      <select className="border border-slate-200 rounded px-1 py-0.5 text-xs w-12 h-6 focus:outline-none" value={rs.fontSize} onChange={e => { legacyApi?.setFontSize?.(parseFloat(e.target.value)); onAction(); }}>
        {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="w-px h-4 bg-slate-300 mx-0.5" />

      <button className={`w-6 h-6 flex items-center justify-center rounded font-bold transition-colors ${rs.active('WORD.HOME.BOLD') ? 'bg-[#D9E8FB] text-[#0F6CBD]' : 'hover:bg-slate-100 text-[#202020]'}`} onClick={() => { legacyApi?.toggleBold?.(); onAction(); }}>B</button>
      <button className={`w-6 h-6 flex items-center justify-center rounded italic font-serif transition-colors ${rs.active('WORD.HOME.ITALIC') ? 'bg-[#D9E8FB] text-[#0F6CBD]' : 'hover:bg-slate-100 text-[#202020]'}`} onClick={() => { legacyApi?.toggleItalic?.(); onAction(); }}>I</button>
      <button className={`w-6 h-6 flex items-center justify-center rounded underline transition-colors ${rs.active('WORD.HOME.UNDERLINE') ? 'bg-[#D9E8FB] text-[#0F6CBD]' : 'hover:bg-slate-100 text-[#202020]'}`} onClick={() => { legacyApi?.toggleUnderline?.(); onAction(); }}>U</button>

      <div className="w-px h-4 bg-slate-300 mx-0.5" />

      {/* Font Color */}
      <div className="relative">
        <button className="w-8 h-6 flex flex-col items-center justify-center rounded hover:bg-slate-100" onClick={() => setShowColor(!showColor)}>
          <span className="font-bold text-xs" style={{ lineHeight: 1 }}>A</span>
          <div className="w-4 h-1 bg-red-500 mt-0.5" />
        </button>
        {showColor && (
          <div className="absolute top-8 left-0 z-[10000]">
            <ColorPicker
              allowAutomatic={true}
              allowNoColor={false}
              onSelectColor={(c) => {
                legacyApi?.setFontColor?.(c === 'automatic' ? '' : c);
                setShowColor(false);
                onAction();
              }}
            />
          </div>
        )}
      </div>

      {/* Highlight Color */}
      <div className="relative">
        <button className="w-8 h-6 flex flex-col items-center justify-center rounded hover:bg-slate-100" onClick={() => setShowHighlight(!showHighlight)}>
          <span className="text-xs" style={{ lineHeight: 1 }}>ab</span>
          <div className="w-4 h-1 bg-yellow-400 mt-0.5" />
        </button>
        {showHighlight && (
          <div className="absolute top-8 left-0 z-[10000]">
            <ColorPicker
              allowAutomatic={false}
              allowNoColor={true}
              onSelectColor={(c) => {
                legacyApi?.setHighlight?.(c);
                setShowHighlight(false);
                onAction();
              }}
            />
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-slate-300 mx-0.5" />

      {/* Format Painter */}
      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100" title="Format Painter" onClick={onAction}>
        <I.Paintbrush className="w-4 h-4 text-slate-600" />
      </button>

      {isInTable && (
        <>
          <div className="w-px h-4 bg-slate-300 mx-0.5" />
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-green-600" title="Insert Row Below" onClick={() => { legacyApi?.insertRow?.('below'); onAction(); }}>
             <I.Table className="w-4 h-4" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-red-500" title="Delete Row" onClick={() => { legacyApi?.deleteRow?.(); onAction(); }}>
             <I.Trash2 className="w-4 h-4" />
          </button>
        </>
      )}

      <div className="w-px h-4 bg-slate-300 mx-0.5" />

      {/* Comment */}
      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100" title="New Comment" onClick={onAction}>
        <I.MessageSquarePlus className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
