import React, { useState, useMemo, useRef } from 'react';
import { StyleEngine, StyleDef } from './StyleEngine';
import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';

interface StylePaneProps {
  onClose: () => void;
}

export function StylePane({ onClose }: StylePaneProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, styleId: string} | null>(null);

  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  // Compute filtered styles
  const filteredStyles = useMemo(() => {
    let list = StyleEngine.getStylesList();
    if (searchQuery) {
      list = StyleEngine.searchStyles(searchQuery);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, contextMenu]); // Trigger re-render after actions

  // Virtualization
  const itemHeight = 36;
  const containerHeight = window.innerHeight - 200; // rough estimation
  const totalHeight = filteredStyles.length * itemHeight;
  
  const startRow = Math.max(0, Math.floor(scrollTop / itemHeight));
  const endRow = Math.min(filteredStyles.length, startRow + Math.ceil(containerHeight / itemHeight) + 1);
  const visibleStyles = filteredStyles.slice(startRow, endRow);

  const applyStyle = (id: string) => {
    exec('WORD.STYLE.APPLY', id);
    EditorAPI.getLegacy()?.clearLivePreview();
    StyleEngine.incrementUsage(id);
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, styleId: id });
  };

  return (
    <div className="w-[300px] border-l border-[#C6C6C6] bg-[#F3F3F3] flex flex-col h-full select-none text-sm z-40 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#C6C6C6] bg-white">
        <span className="font-semibold text-slate-700">Styles</span>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center hover:bg-[#EAEAEA] rounded text-slate-500">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Toolbar & Search */}
      <div className="p-2 border-b border-[#C6C6C6] bg-[#F3F3F3] flex flex-col gap-2">
        <input 
          type="text" 
          placeholder="Search styles..." 
          className="w-full px-2 py-1 text-xs border border-[#C6C6C6] rounded outline-none focus:border-[#2B579A]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Virtualized List */}
      <div 
        className="flex-1 overflow-y-auto bg-white"
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleStyles.map((style, idx) => {
            const absoluteRow = startRow + idx;
            return (
              <div
                key={style.id}
                style={{ position: 'absolute', top: absoluteRow * itemHeight, left: 0, right: 0, height: itemHeight }}
                className="flex items-center gap-2 px-3 border-b border-[#F0F0F0] hover:bg-[#EAEAEA] cursor-pointer"
                onMouseEnter={() => {
                  const s = StyleEngine.getStyle(style.id);
                  if (s) EditorAPI.getLegacy()?.applyLivePreviewPara({ ...s.paraFmt, styleId: style.id });
                }}
                onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                onClick={() => applyStyle(style.id)}
                onContextMenu={(e) => handleContextMenu(e, style.id)}
              >
                <div 
                  className="w-6 h-6 flex items-center justify-center border border-[#E5E5E5] bg-white overflow-hidden pointer-events-none shrink-0"
                  style={{ 
                    fontFamily: style.runFmt?.fontFamily || 'Calibri', 
                    fontSize: Math.min((style.runFmt?.fontSize || 11) * 0.5, 14),
                    color: style.runFmt?.color || '#000',
                    fontWeight: style.runFmt?.bold ? 'bold' : 'normal',
                    fontStyle: style.runFmt?.italic ? 'italic' : 'normal'
                  }}
                >
                  Aa
                </div>
                <div className="flex-1 truncate text-[12px] text-slate-800">{style.name}</div>
                {(style.isPinned || style.isFavorite) && (
                  <div className="flex gap-1">
                    {style.isPinned && <span title="Pinned">📌</span>}
                    {style.isFavorite && <span title="Favorite">⭐</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Options */}
      <div className="p-1 border-t border-[#C6C6C6] bg-[#F3F3F3] flex justify-between">
        <button className="flex items-center justify-center p-1 px-2 text-[11px] hover:bg-[#EAEAEA] rounded" title="New Style">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          <span className="ml-1">New Style</span>
        </button>
        <button className="flex items-center justify-center p-1 px-2 text-[11px] hover:bg-[#EAEAEA] rounded" title="Style Inspector" onClick={() => exec('WORD.STYLEINSPECTOR.TOGGLE')}>
          🔍 Inspector
        </button>
        <button className="flex items-center justify-center p-1 px-2 text-[11px] hover:bg-[#EAEAEA] rounded" title="Manage Styles" onClick={() => exec('WORD.STYLEMANAGER.OPEN')}>
          ⚙️ Manage
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
          <div 
            className="fixed z-[101] w-48 bg-white border border-[#C6C6C6] shadow-lg flex flex-col py-1 text-xs"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button className="text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { applyStyle(contextMenu.styleId); setContextMenu(null); }}>Apply</button>
            <button className="text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { exec('WORD.STYLE.GALLERY.PIN', contextMenu.styleId); setContextMenu(null); }}>Toggle Pin</button>
            <button className="text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { exec('WORD.STYLE.GALLERY.FAVORITE', contextMenu.styleId); setContextMenu(null); }}>Toggle Favorite</button>
            <div className="border-t border-[#E5E5E5] my-1" />
            <button className="text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => setContextMenu(null)}>Modify...</button>
            <button className="text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => setContextMenu(null)}>Delete...</button>
          </div>
        </>
      )}
    </div>
  );
}
