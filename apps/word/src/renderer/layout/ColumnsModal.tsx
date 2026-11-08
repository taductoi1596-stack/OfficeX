import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';

interface ColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColumnsModal({ isOpen, onClose }: ColumnsModalProps) {
  const legacy = EditorAPI.getLegacy() as any;
  const currentSetup = legacy?.getPageSetup ? legacy.getPageSetup() : { cols: 1 };

  const [cols, setCols] = useState<number>(currentSetup.cols || 1);
  const [colLayout, setColLayout] = useState<'equal' | 'left' | 'right'>(currentSetup.colLayout || 'equal');

  if (!isOpen) return null;

  const handleApply = () => {
    legacy?.setPageSetup?.({ cols, colLayout });
    onClose();
  };

  const presets = [
    { id: 'one', title: 'Một', cols: 1, layout: 'equal' as const },
    { id: 'two', title: 'Hai', cols: 2, layout: 'equal' as const },
    { id: 'three', title: 'Ba', cols: 3, layout: 'equal' as const },
    { id: 'left', title: 'Trái', cols: 2, layout: 'left' as const },
    { id: 'right', title: 'Phải', cols: 2, layout: 'right' as const },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[440px] max-w-[95vw] overflow-hidden flex flex-col"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <span className="text-[15px] font-semibold text-slate-800">Cột (Columns)</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <I.X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4 text-[13px] text-slate-700">
          <span className="font-semibold text-slate-800">Mẫu cột sẵn có:</span>
          
          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-5 gap-2">
            {presets.map((p) => {
              const isSelected = cols === p.cols && colLayout === p.layout;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCols(p.cols);
                    setColLayout(p.layout);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0078d4] bg-blue-50/70 text-[#0078d4]'
                      : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-[32px] h-[36px] border border-slate-500 bg-white rounded-[1px] p-1 flex gap-1 items-center mb-1.5 shadow-2xs">
                    {p.cols === 1 && <div className="w-full h-full border border-[#0284c7] border-dashed" />}
                    {p.cols === 2 && p.layout === 'equal' && (
                      <>
                        <div className="w-1/2 h-full border border-[#0284c7] border-dashed" />
                        <div className="w-1/2 h-full border border-[#0284c7] border-dashed" />
                      </>
                    )}
                    {p.cols === 3 && (
                      <>
                        <div className="w-1/3 h-full border border-[#0284c7] border-dashed" />
                        <div className="w-1/3 h-full border border-[#0284c7] border-dashed" />
                        <div className="w-1/3 h-full border border-[#0284c7] border-dashed" />
                      </>
                    )}
                    {p.cols === 2 && p.layout === 'left' && (
                      <>
                        <div className="w-1/3 h-full border border-[#0284c7] border-dashed" />
                        <div className="w-2/3 h-full border border-[#0284c7] border-dashed" />
                      </>
                    )}
                    {p.cols === 2 && p.layout === 'right' && (
                      <>
                        <div className="w-2/3 h-full border border-[#0284c7] border-dashed" />
                        <div className="w-1/3 h-full border border-[#0284c7] border-dashed" />
                      </>
                    )}
                  </div>
                  <span className="text-[12px] font-medium leading-none">{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Number Input for custom columns */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-200 mt-1">
            <label className="font-medium text-slate-700">Số lượng cột:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={cols}
              onChange={(e) => {
                const val = Math.max(1, Math.min(5, parseInt(e.target.value) || 1));
                setCols(val);
                setColLayout('equal');
              }}
              className="w-20 border border-slate-300 rounded px-2.5 py-1 text-[13px] outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] border border-slate-300 text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-1.5 text-[13px] bg-[#0078d4] hover:bg-[#006cbd] text-white font-medium rounded transition-colors shadow-sm"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
