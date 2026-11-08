import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';

interface CustomMarginsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSetup?: { marginTop: number; marginBottom: number; marginLeft: number; marginRight: number };
}

export function CustomMarginsModal({ isOpen, onClose, currentSetup }: CustomMarginsModalProps) {
  const defaultTop = ((currentSetup?.marginTop || 96) / 37.795).toFixed(2);
  const defaultBottom = ((currentSetup?.marginBottom || 96) / 37.795).toFixed(2);
  const defaultLeft = ((currentSetup?.marginLeft || 96) / 37.795).toFixed(2);
  const defaultRight = ((currentSetup?.marginRight || 96) / 37.795).toFixed(2);

  const [top, setTop] = useState(defaultTop);
  const [bottom, setBottom] = useState(defaultBottom);
  const [left, setLeft] = useState(defaultLeft);
  const [right, setRight] = useState(defaultRight);

  if (!isOpen) return null;

  const handleApply = () => {
    const topPx = (parseFloat(top) || 2.54) * 37.795;
    const bottomPx = (parseFloat(bottom) || 2.54) * 37.795;
    const leftPx = (parseFloat(left) || 2.54) * 37.795;
    const rightPx = (parseFloat(right) || 2.54) * 37.795;

    (EditorAPI.getLegacy() as any)?.setPageSetup?.({
      marginTop: Math.round(topPx),
      marginBottom: Math.round(bottomPx),
      marginLeft: Math.round(leftPx),
      marginRight: Math.round(rightPx),
    });

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[420px] max-w-[95vw] overflow-hidden flex flex-col"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <span className="text-[15px] font-semibold text-slate-800">Lề tùy chỉnh (Custom Margins)</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <I.X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4 text-[13px] text-slate-700">
          <div className="grid grid-cols-2 gap-4">
            {/* Trên cùng (Top) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Trên cùng (Top):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={top}
                  onChange={(e) => setTop(e.target.value)}
                  className="w-full outline-none text-slate-800 bg-transparent"
                />
                <span className="text-slate-400 text-[12px]">cm</span>
              </div>
            </div>

            {/* Dưới cùng (Bottom) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Dưới cùng (Bottom):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={bottom}
                  onChange={(e) => setBottom(e.target.value)}
                  className="w-full outline-none text-slate-800 bg-transparent"
                />
                <span className="text-slate-400 text-[12px]">cm</span>
              </div>
            </div>

            {/* Trái (Left) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Trái (Left):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={left}
                  onChange={(e) => setLeft(e.target.value)}
                  className="w-full outline-none text-slate-800 bg-transparent"
                />
                <span className="text-slate-400 text-[12px]">cm</span>
              </div>
            </div>

            {/* Phải (Right) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Phải (Right):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={right}
                  onChange={(e) => setRight(e.target.value)}
                  className="w-full outline-none text-slate-800 bg-transparent"
                />
                <span className="text-slate-400 text-[12px]">cm</span>
              </div>
            </div>
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
