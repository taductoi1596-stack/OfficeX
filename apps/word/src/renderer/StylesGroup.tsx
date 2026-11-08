import React, { useState, useRef, useMemo } from 'react';
import { Dropdown } from '@officex/ui';
import { RGroup } from './SharedComponents';
import { CommandDispatcher } from './CommandDispatcher';
import { StyleEngine, StyleDef } from './StyleEngine';
import { EditorAPI } from './editorApi';

export function StylesGroup() {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, styleId: string} | null>(null);
  
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute filtered list
  const filteredStyles = useMemo(() => {
    let list = StyleEngine.getStylesList();
    if (searchQuery) {
      list = StyleEngine.searchStyles(searchQuery);
    }
    // Sort logic (Pinned first, Favorites next, then others)
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, expanded, contextMenu]); // deps to trigger re-render on context menu actions

  // Virtualization calculations
  const itemWidth = 74;
  const itemHeight = 60;
  const itemsPerRow = 5; // 400px / 74px ~ 5
  const rowHeight = itemHeight;
  const totalRows = Math.ceil(filteredStyles.length / itemsPerRow);
  const containerHeight = 300;
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight));
  const endRow = Math.min(totalRows, startRow + Math.ceil(containerHeight / rowHeight) + 1);
  
  const startIndex = startRow * itemsPerRow;
  const endIndex = endRow * itemsPerRow;
  const visibleStyles = expanded ? filteredStyles.slice(startIndex, endIndex) : StyleEngine.getQuickStyles().slice(0, 4);

  const applyStyle = (id: string) => {
    exec('WORD.STYLE.APPLY', id);
    EditorAPI.getLegacy()?.clearLivePreview();
    StyleEngine.incrementUsage(id);
    if (expanded) setExpanded(false);
  };

  const previewStyle = (id: string) => {
    const style = StyleEngine.getStyle(id);
    if (style) {
      EditorAPI.getLegacy()?.applyLivePreviewPara({ ...style.paraFmt, styleId: id });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, styleId: id });
  };

  return (
    <RGroup label="Styles" onDialogClick={() => exec('WORD.STYLEPANE.TOGGLE')}>
      <div className="flex h-[52px]">
        {/* Gallery Window */}
        <div 
          className={`relative border border-[#C6C6C6] bg-white transition-all duration-200 flex flex-col
            ${expanded ? 'w-[400px] h-[380px] absolute top-0 z-50 shadow-2xl' : 'w-[280px] h-auto p-0.5'}`}
        >
          {expanded && (
            <div className="flex items-center gap-2 p-2 border-b border-[#E5E5E5] bg-[#F3F3F3]">
              <input 
                type="text" 
                placeholder="Search styles..." 
                className="flex-1 px-2 py-1 text-xs border border-[#C6C6C6] rounded outline-none focus:border-[#2B579A]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="text-xs text-[#2B579A] hover:underline" onClick={() => { setExpanded(false); setSearchQuery(''); }}>Close</button>
            </div>
          )}

          {/* List Area */}
          <div 
            ref={containerRef}
            className={`w-full overflow-y-auto ${expanded ? 'h-[300px]' : 'h-auto overflow-hidden flex flex-wrap gap-1'}`}
            onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
          >
            {expanded ? (
              <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleStyles.map((style, idx) => {
                  const absoluteIndex = startIndex + idx;
                  const row = Math.floor(absoluteIndex / itemsPerRow);
                  const col = absoluteIndex % itemsPerRow;
                  return (
                    <StyleCard
                      key={style.id}
                      style={style}
                      applyStyle={applyStyle}
                      previewStyle={previewStyle}
                      onContextMenu={(e: React.MouseEvent) => handleContextMenu(e, style.id)}
                      containerStyle={{ position: 'absolute', top: row * rowHeight, left: col * itemWidth + 8 }}
                    />
                  );
                })}
              </div>
            ) : (
              visibleStyles.map(style => (
                <StyleCard key={style.id} style={style} applyStyle={applyStyle} previewStyle={previewStyle} />
              ))
            )}
          </div>

          {expanded && (
            <div className="w-full flex flex-col gap-1 border-t border-[#E5E5E5] pt-1 pb-1 px-1 bg-[#F3F3F3]">
              <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-2 py-1" onClick={() => { exec('WORD.STYLE.CLEAR_FORMATTING'); setExpanded(false); }}>
                Clear Formatting
              </button>
              <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-2 py-1" onClick={() => { setExpanded(false); exec('WORD.STYLEMANAGER.OPEN'); }}>
                Manage Styles...
              </button>
            </div>
          )}
        </div>
        
        {/* Toggle Buttons (Collapsed mode only) */}
        {!expanded && (
          <div className="flex flex-col w-4 border-y border-r border-[#C6C6C6] bg-[#F3F3F3]">
            <button className="h-1/3 border-b border-[#C6C6C6] flex items-center justify-center hover:bg-[#EAEAEA]">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button className="h-1/3 border-b border-[#C6C6C6] flex items-center justify-center hover:bg-[#EAEAEA]">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button className="h-1/3 flex items-center justify-center hover:bg-[#EAEAEA]" onClick={() => setExpanded(true)}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l6 6 6-6M6 14l6 6 6-6"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
          <div 
            className="fixed z-[101] w-48 bg-white border border-[#C6C6C6] shadow-lg flex flex-col py-1"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { exec('WORD.STYLE.GALLERY.PIN', contextMenu.styleId); setContextMenu(null); }}>
              Toggle Pin
            </button>
            <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { exec('WORD.STYLE.GALLERY.FAVORITE', contextMenu.styleId); setContextMenu(null); }}>
              Toggle Favorite
            </button>
            <div className="border-t border-[#E5E5E5] my-1" />
            <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => { applyStyle(contextMenu.styleId); setContextMenu(null); }}>
              Apply Style
            </button>
            <button className="text-[11px] text-left hover:bg-[#EAEAEA] px-4 py-1" onClick={() => setContextMenu(null)}>
              Modify...
            </button>
          </div>
        </>
      )}
    </RGroup>
  );
}

function StyleCard({ style, applyStyle, previewStyle, onContextMenu, containerStyle }: any) {
  return (
    <button
      style={containerStyle}
      className="w-[68px] h-14 border border-transparent hover:border-[#2B579A] hover:bg-[#EAEAEA] flex flex-col items-center justify-center p-1 rounded-sm relative"
      onClick={() => applyStyle(style.id)}
      onMouseEnter={() => previewStyle(style.id)}
      onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
      onContextMenu={onContextMenu}
    >
      {(style.isPinned || style.isFavorite) && (
        <div className="absolute top-0 right-0 p-[2px]">
          {style.isPinned ? <span title="Pinned">📌</span> : <span title="Favorite">⭐</span>}
        </div>
      )}
      <div 
        className="w-14 h-7 border border-[#E5E5E5] bg-white flex items-center justify-center mb-1 overflow-hidden pointer-events-none"
        style={{ 
          fontFamily: style.runFmt?.fontFamily || 'Calibri', 
          fontSize: Math.min((style.runFmt?.fontSize || 11) * 0.45, 12),
          color: style.runFmt?.color || '#000',
          fontWeight: style.runFmt?.bold ? 'bold' : 'normal',
          fontStyle: style.runFmt?.italic ? 'italic' : 'normal',
          textAlign: style.paraFmt?.align || 'left',
          backgroundColor: style.paraFmt?.shading || 'transparent'
        }}
      >
        AaBbCc
      </div>
      <div className="text-[10px] text-[#444] whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
        {style.name}
      </div>
    </button>
  );
}
