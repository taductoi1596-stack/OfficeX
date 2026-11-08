import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as I from 'lucide-react';

interface AltTextModalProps {
  isOpen: boolean;
  initialTitle?: string;
  initialText?: string;
  onClose: () => void;
  onSave: (title: string, text: string) => void;
}

export function AltTextModal({ isOpen, initialTitle = '', initialText = '', onClose, onSave }: AltTextModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setText(initialText);
    }
  }, [isOpen, initialTitle, initialText]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title, text);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg shadow-2xl w-[480px] max-w-[95vw] overflow-hidden" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <span className="text-[15px] font-semibold text-[#1a1a1a]">Văn bản Thay thế</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <I.X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-700 font-medium">Tiêu đề</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] transition"
              placeholder="Nhập tiêu đề..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-700 font-medium">Mô tả</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full border border-slate-300 rounded px-3 py-2 text-[13px] outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] transition resize-y"
              placeholder="Nhập mô tả cho bảng..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#0078d4] hover:bg-[#006cbf] text-white text-[13px] font-medium rounded transition-colors"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-[13px] font-medium rounded border border-slate-300 transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
