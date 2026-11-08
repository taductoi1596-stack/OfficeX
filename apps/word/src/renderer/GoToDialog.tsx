import React, { useState, useEffect, useRef } from 'react';
import { EditorAPI } from './editorApi';
import { CommandDispatcher } from './CommandDispatcher';

export function GoToDialog({ onClose }: { onClose: () => void }) {
  const [targetType, setTargetType] = useState('Page');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const targetTypes = [
    'Page', 'Section', 'Line', 'Bookmark', 'Comment', 
    'Footnote', 'Endnote', 'Table', 'Graphic', 'Equation', 
    'Object', 'Heading'
  ];

  // Focus input automatically on open
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetType]);

  const handleGoTo = () => {
    const val = inputValue.trim();
    if (!val) return;

    const api = EditorAPI.getLegacy();
    if (!api) return;

    const num = parseInt(val, 10);
    if (isNaN(num)) return; // Phase 1: Only support absolute numeric inputs

    if (targetType === 'Page') {
      api.goToPage(num);
      // Optional: focus back on editor
      document.getElementById('canvas-editor-container')?.focus();
    } else if (targetType === 'Line') {
      api.goToLine(num);
      document.getElementById('canvas-editor-container')?.focus();
    } else if (targetType === 'Heading') {
      // Find heading index logic can be done via setSelection in a full engine.
      // We will route it to FindPane or just notify for now.
      alert(`Navigating to Heading ${num} is not fully implemented in this phase.`);
    } else {
      alert(`Navigation to ${targetType} is not implemented in this phase.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGoTo();
    if (e.key === 'Escape') onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      
      {/* Dialog Window */}
      <div 
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[480px] bg-[#F3F2F1] shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[#C6C6C6] z-[201] text-[12px] text-[#333] flex flex-col font-segoe select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#E5E5E5] cursor-move">
          <div className="font-semibold text-[13px]">Find and Replace</div>
          <button onClick={onClose} className="w-6 h-6 hover:bg-[#E00] hover:text-white flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex bg-white px-2 pt-2 gap-1 border-b border-[#C6C6C6]">
          <div className="px-4 py-1 hover:bg-[#F3F2F1] text-slate-500 cursor-pointer rounded-t">Find</div>
          <div className="px-4 py-1 hover:bg-[#F3F2F1] text-slate-500 cursor-pointer rounded-t">Replace</div>
          <div className="px-4 py-1 bg-[#F3F2F1] border border-[#C6C6C6] border-b-0 font-medium z-10 -mb-[1px] cursor-default rounded-t">Go To</div>
        </div>

        {/* Body */}
        <div className="p-4 flex gap-4 bg-[#F3F2F1]">
          {/* Left List */}
          <div className="w-1/3 flex flex-col gap-1">
            <label className="text-slate-600">Go to what:</label>
            <div className="bg-white border border-[#C6C6C6] h-40 overflow-y-auto">
              {targetTypes.map(t => (
                <div 
                  key={t}
                  className={`px-2 py-1 cursor-pointer truncate ${targetType === t ? 'bg-[#CDE6F7] text-black' : 'hover:bg-[#EAEAEA]'}`}
                  onClick={() => setTargetType(t)}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right Input */}
          <div className="w-2/3 flex flex-col gap-1">
            <label className="text-slate-600">Enter {targetType.toLowerCase()} number:</label>
            <input 
              ref={inputRef}
              type="text"
              className="w-full px-2 py-1 border border-[#C6C6C6] focus:border-[#2B579A] focus:outline-none"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="text-[11px] text-slate-500 mt-1 leading-tight">
              Enter + and - to move relative to the current location. Example: +4 will move forward four items.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#F3F2F1] flex justify-end gap-2 border-t border-[#E5E5E5]">
          <button className="px-4 py-1 min-w-[75px] bg-[#E1DFDD] border border-[#ADADAD] hover:bg-[#C8C6C4]" onClick={() => alert('Not implemented')}>Previous</button>
          <button className="px-4 py-1 min-w-[75px] bg-[#E1DFDD] border border-[#ADADAD] hover:bg-[#C8C6C4]" onClick={() => alert('Not implemented')}>Next</button>
          <button className="px-4 py-1 min-w-[75px] bg-[#2B579A] text-white border border-[#2B579A] hover:bg-[#1A365D]" onClick={handleGoTo}>Go To</button>
          <button className="px-4 py-1 min-w-[75px] bg-[#E1DFDD] border border-[#ADADAD] hover:bg-[#C8C6C4]" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}
