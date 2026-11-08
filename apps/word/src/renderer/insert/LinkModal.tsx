import React, { useState } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';

interface LinkModalProps {
  onClose: () => void;
}

export function LinkModal({ onClose }: LinkModalProps) {
  const [displayText, setDisplayText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleInsert = () => {
    // In a real app, this would dispatch to the engine to insert the link at the cursor
    // CommandDispatcher.dispatch('WORD.INSERT.HYPERLINK', { text: displayText, url: linkUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]" onClick={onClose}>
      <div 
        className="bg-white w-[420px] rounded-lg shadow-2xl flex flex-col overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="text-[20px] font-semibold text-[#0f52ba]">Liên kết</div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-slate-700 font-medium">Văn bản hiển thị:</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-[14px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Văn bản cần hiển thị"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6 border-b border-slate-200">
              <button className="text-[13px] font-semibold text-slate-800 border-b-2 border-[#0f52ba] pb-2 px-1 text-center">
                Nhập<br/>Liên kết
              </button>
              <button className="text-[13px] text-slate-600 pb-2 px-1 text-center hover:text-slate-800">
                Đầu đề và Thẻ đánh dấu
              </button>
            </div>

            <div className="relative group/tooltip">
              <input 
                type="text" 
                className="w-full border border-slate-300 rounded px-3 py-1.5 text-[14px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Dán hoặc nhập liên kết"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-slate-200 shadow-md text-slate-700 text-[12px] px-3 py-1.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 before:content-[''] before:absolute before:-top-1.5 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-white before:drop-shadow-sm">
                Nhập Liên kết
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-5 gap-3 mt-4">
          <button 
            className={`px-6 py-1.5 rounded font-medium text-[14px] transition-colors ${linkUrl.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-default'}`}
            onClick={linkUrl.trim() ? handleInsert : undefined}
          >
            Chèn
          </button>
          <button 
            className="px-4 py-1.5 rounded font-medium text-[14px] text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
