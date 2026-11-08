import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';

interface LineNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode?: 'none' | 'continuous' | 'restart-page' | 'restart-section' | 'suppress-para';
}

export function LineNumberModal({ isOpen, onClose, currentMode = 'none' }: LineNumberModalProps) {
  const [mode, setMode] = useState<'none' | 'continuous' | 'restart-page' | 'restart-section'>(
    currentMode === 'suppress-para' ? 'none' : currentMode
  );
  const [startAt, setStartAt] = useState('1');
  const [step, setStep] = useState('1');

  if (!isOpen) return null;

  const handleApply = () => {
    (EditorAPI.getLegacy() as any)?.setPageSetup?.({
      lineNumbers: mode,
      lineNumberStart: parseInt(startAt, 10) || 1,
      lineNumberStep: parseInt(step, 10) || 1,
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
        className="bg-white rounded-lg shadow-2xl w-[400px] max-w-[95vw] overflow-hidden flex flex-col"
        style={{ fontFamily: 'Segoe UI, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <span className="text-[15px] font-semibold text-slate-800">Tùy chọn đánh số dòng (Line Numbers)</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <I.X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-[13px] text-slate-700">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-800">Chế độ đánh số dòng:</label>
            <div className="flex flex-col gap-1.5 pl-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lineNumMode"
                  checked={mode === 'none'}
                  onChange={() => setMode('none')}
                  className="accent-[#2563eb]"
                />
                <span>Không có (None)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lineNumMode"
                  checked={mode === 'continuous'}
                  onChange={() => setMode('continuous')}
                  className="accent-[#2563eb]"
                />
                <span>Liên tục (Continuous)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lineNumMode"
                  checked={mode === 'restart-page'}
                  onChange={() => setMode('restart-page')}
                  className="accent-[#2563eb]"
                />
                <span>Khởi động lại mỗi trang (Restart Each Page)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lineNumMode"
                  checked={mode === 'restart-section'}
                  onChange={() => setMode('restart-section')}
                  className="accent-[#2563eb]"
                />
                <span>Khởi động lại mỗi mục (Restart Each Section)</span>
              </label>
            </div>
          </div>

          <div className="h-[1px] bg-slate-200 my-1" />

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="text-[12px] text-slate-600">Bắt đầu từ số:</label>
            <input
              type="number"
              min="1"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded text-[13px] text-slate-800 outline-none focus:border-[#2563eb]"
            />

            <label className="text-[12px] text-slate-600">Đếm theo bước:</label>
            <input
              type="number"
              min="1"
              value={step}
              onChange={(e) => setStep(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded text-[13px] text-slate-800 outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#2563eb] rounded hover:bg-[#1d4ed8] transition-colors shadow-xs"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
