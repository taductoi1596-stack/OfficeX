import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';

interface CustomPageSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomPageSizeModal({ isOpen, onClose }: CustomPageSizeModalProps) {
  const legacy = EditorAPI.getLegacy() as any;
  const currentSetup = legacy?.getPageSetup ? legacy.getPageSetup() : { width: 794, height: 1123 };

  const defaultW = ((currentSetup.width || 794) / 37.795).toFixed(2);
  const defaultH = ((currentSetup.height || 1123) / 37.795).toFixed(2);

  const [width, setWidth] = useState(defaultW);
  const [height, setHeight] = useState(defaultH);

  if (!isOpen) return null;

  const handleApply = () => {
    const wPx = Math.round((parseFloat(width) || 21) * 37.795);
    const hPx = Math.round((parseFloat(height) || 29.7) * 37.795);

    legacy?.setPageSetup?.({ width: wPx, height: hPx });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[400px] max-w-[95vw] overflow-hidden flex flex-col"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <span className="text-[15px] font-semibold text-slate-800">Kích thước trang tùy chỉnh</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <I.X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4 text-[13px] text-slate-700">
          <div className="flex flex-col gap-3">
            {/* Chiều rộng (Width) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Chiều rộng (Width):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full outline-none text-slate-800 bg-transparent"
                />
                <span className="text-slate-400 text-[12px]">cm</span>
              </div>
            </div>

            {/* Chiều cao (Height) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-slate-700">Chiều cao (Height):</label>
              <div className="flex items-center border border-slate-300 rounded px-2.5 py-1.5 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
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
