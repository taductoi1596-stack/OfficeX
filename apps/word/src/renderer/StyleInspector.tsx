import React, { useState, useEffect } from 'react';
import { useRibbonState } from './RibbonController';
import { StyleEngine } from './StyleEngine';
import { CommandDispatcher } from './CommandDispatcher';

interface StyleInspectorProps {
  onClose: () => void;
}

function formatPropName(prop: string): string {
  // e.g. spaceBefore -> Space Before
  const res = prop.replace(/([A-Z])/g, ' $1');
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function getOverrides(baseFmt: Record<string, any> = {}, currentFmt: Record<string, any> = {}) {
  const overrides: Record<string, any> = {};
  for (const [k, v] of Object.entries(currentFmt)) {
    if (k === 'styleId') continue;
    if (baseFmt[k] !== v) {
      overrides[k] = v;
    }
  }
  return overrides;
}

export function StyleInspector({ onClose }: StyleInspectorProps) {
  const rs = useRibbonState();
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  // Position state for floating drag (Basic implementation)
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const currentParaFmt = rs.currentParaFmt || {};
  const currentRunFmt = rs.currentRunFmt || {};
  
  const paraStyleId = currentParaFmt.styleId || 'Normal';
  const paraStyle = StyleEngine.getStyle(paraStyleId);
  const resolvedBaseParaFmt = StyleEngine.resolveParaFmt({ styleId: paraStyleId }); // just the base
  const paraOverrides = getOverrides(resolvedBaseParaFmt, currentParaFmt);

  const runStyleId = currentRunFmt.styleId || paraStyleId;
  const runStyle = StyleEngine.getStyle(runStyleId);
  const resolvedBaseRunFmt = StyleEngine.resolveRunFmt({ styleId: runStyleId });
  const runOverrides = getOverrides(resolvedBaseRunFmt, currentRunFmt);

  return (
    <div 
      className="fixed w-[280px] bg-white border border-[#C6C6C6] shadow-xl flex flex-col text-[11px] z-[150] text-[#333]"
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-1 border-b border-[#C6C6C6] bg-[#F3F3F3] cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1 font-semibold">
          <span className="text-base leading-none mt-[-2px]">🔍</span>
          Style Inspector
        </div>
        <button onClick={onClose} className="hover:bg-[#EAEAEA] rounded w-5 h-5 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px] p-2 flex flex-col gap-3">
        {/* Paragraph Formatting */}
        <div>
          <div className="font-semibold text-[#2B579A] border-b border-[#E5E5E5] mb-1 pb-1">Paragraph formatting</div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#E5E5E5] border border-[#C6C6C6] inline-block" />
              <span>{paraStyle?.name || 'Normal'}</span>
            </div>
            <button className="text-red-600 hover:bg-red-50 p-0.5 rounded" title="Reset to Style" onClick={() => exec('WORD.STYLEINSPECTOR.CLEAR_PARAGRAPH')}>
              ↺
            </button>
          </div>
          {Object.keys(paraOverrides).length > 0 && (
            <div className="mt-1 pl-4 text-[10px] text-slate-500">
              <div className="font-semibold italic text-[#666]">Plus:</div>
              {Object.entries(paraOverrides).map(([k, v]) => (
                <div key={k}>• {formatPropName(k)}: {String(v)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Text Level Formatting */}
        <div>
          <div className="font-semibold text-[#2B579A] border-b border-[#E5E5E5] mb-1 pb-1">Text level formatting</div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 border border-dotted border-[#999] inline-block text-center leading-[10px] text-[9px]">a</span>
              <span>Default Paragraph Font</span>
            </div>
            <button className="text-red-600 hover:bg-red-50 p-0.5 rounded" title="Clear Character Formatting" onClick={() => exec('WORD.STYLEINSPECTOR.CLEAR_CHARACTER')}>
              ↺
            </button>
          </div>
          {Object.keys(runOverrides).length > 0 && (
            <div className="mt-1 pl-4 text-[10px] text-slate-500">
              <div className="font-semibold italic text-[#666]">Plus:</div>
              {Object.entries(runOverrides).map(([k, v]) => (
                <div key={k}>• {formatPropName(k)}: {String(v)}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="border-t border-[#C6C6C6] bg-[#F3F3F3] p-1 flex justify-around">
        <button className="p-1 hover:bg-[#EAEAEA] rounded" title="Reveal Formatting" onClick={() => exec('WORD.STYLEINSPECTOR.REVEAL')}>
          👁️ Reveal
        </button>
        <button className="p-1 hover:bg-[#EAEAEA] rounded" title="Clear All Formatting" onClick={() => exec('WORD.STYLEINSPECTOR.CLEAR_ALL')}>
          🗑️ Clear All
        </button>
        <button className="p-1 hover:bg-[#EAEAEA] rounded" title="New Style">
          ➕ New
        </button>
      </div>
    </div>
  );
}
