import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SplitCellsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSplit: (cols: number, rows: number) => void;
}

export function SplitCellsModal({ isOpen, onClose, onSplit }: SplitCellsModalProps) {
  const [cols, setCols] = useState<number>(2);
  const [rows, setRows] = useState<number>(1);

  if (!isOpen) return null;

  const handleOk = () => {
    onSplit(Math.max(1, cols), Math.max(1, rows));
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-[380px] p-5 flex flex-col gap-4 text-slate-800 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">Tách ô</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-3 text-sm my-1">
          {/* Số cột */}
          <div className="flex items-center justify-between">
            <label className="text-slate-700 font-medium">Số cột:</label>
            <div className="flex items-center border border-slate-300 rounded overflow-hidden w-[140px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input 
                type="number" 
                min={1}
                max={63}
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1 text-sm outline-none"
              />
              <div className="flex flex-col border-l border-slate-300 bg-slate-50 w-[20px] shrink-0">
                <button 
                  onClick={() => setCols(c => Math.min(63, c + 1))}
                  className="h-[12px] flex items-center justify-center hover:bg-slate-200 border-b border-slate-300 text-[9px] text-slate-600"
                >
                  ▲
                </button>
                <button 
                  onClick={() => setCols(c => Math.max(1, c - 1))}
                  className="h-[12px] flex items-center justify-center hover:bg-slate-200 text-[9px] text-slate-600"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Số hàng */}
          <div className="flex items-center justify-between">
            <label className="text-slate-700 font-medium">Số hàng:</label>
            <div className="flex items-center border border-slate-300 rounded overflow-hidden w-[140px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input 
                type="number" 
                min={1}
                max={63}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1 text-sm outline-none"
              />
              <div className="flex flex-col border-l border-slate-300 bg-slate-50 w-[20px] shrink-0">
                <button 
                  onClick={() => setRows(r => Math.min(63, r + 1))}
                  className="h-[12px] flex items-center justify-center hover:bg-slate-200 border-b border-slate-300 text-[9px] text-slate-600"
                >
                  ▲
                </button>
                <button 
                  onClick={() => setRows(r => Math.max(1, r - 1))}
                  className="h-[12px] flex items-center justify-center hover:bg-slate-200 text-[9px] text-slate-600"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button 
            onClick={handleOk}
            className="px-5 py-1.5 bg-[#1b6ec2] hover:bg-[#15589c] text-white text-sm font-medium rounded transition-colors shadow-sm"
          >
            OK
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-sm font-medium rounded transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
