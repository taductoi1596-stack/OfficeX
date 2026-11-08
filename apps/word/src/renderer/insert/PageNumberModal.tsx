import React, { useState } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';

export function PageNumberModal({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState('1, 2, 3, 4...');
  const [numberingType, setNumberingType] = useState<'continue' | 'start'>('continue');
  const [startAt, setStartAt] = useState('1');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
      <div className="bg-white rounded shadow-lg w-[320px] text-[13px] text-slate-800 font-sans border border-slate-300">
        <div className="flex justify-between items-center p-4 pb-2">
          <h2 className="text-[#1e50a2] text-[17px] font-semibold">Cài đặt số trang</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <label className="w-[100px]">Định dạng số:</label>
            <div className="relative flex-1 group">
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="w-full border border-slate-400 rounded px-2 py-1 outline-none focus:border-blue-500 appearance-none bg-white"
              >
                <option value="1, 2, 3, 4...">1, 2, 3, 4...</option>
                <option value="a, b, c, d...">a, b, c, d...</option>
                <option value="A, B, C, D...">A, B, C, D...</option>
                <option value="i, ii, iii, iv...">i, ii, iii, iv...</option>
                <option value="I, II, III, IV...">I, II, III, IV...</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover:block z-10 w-max bg-white border border-slate-200 shadow p-1.5 text-xs text-[#0066cc] whitespace-nowrap">
                Chọn định dạng số cho số trang
                {/* Tooltip arrow */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />
              </div>
            </div>
          </div>

          <div className="font-semibold mb-3">Đánh số trang</div>
          
          <div className="flex flex-col gap-3 ml-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="numberingType"
                checked={numberingType === 'continue'}
                onChange={() => setNumberingType('continue')}
                className="w-3.5 h-3.5 accent-[#1e50a2] cursor-pointer"
              />
              <span>Tiếp tục từ phần trước</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="numberingType"
                checked={numberingType === 'start'}
                onChange={() => setNumberingType('start')}
                className="w-3.5 h-3.5 accent-[#1e50a2] cursor-pointer"
              />
              <span className="w-16">Bắt đầu lúc:</span>
              <input 
                type="number" 
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                disabled={numberingType === 'continue'}
                className="w-20 border border-slate-300 rounded bg-slate-100 px-1.5 py-0.5 outline-none focus:border-blue-500 disabled:bg-slate-100/50 disabled:text-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="bg-slate-50/50 p-3 pt-4 flex justify-center gap-3 border-t border-slate-200 rounded-b">
          <button 
            onClick={() => {
              CommandDispatcher.dispatch('WORD.INSERT.PAGE_NUMBER.FORMAT', { format, numberingType, startAt });
              onClose();
            }}
            className="w-[84px] bg-[#1e50a2] hover:bg-[#164082] text-white px-4 py-1.5 rounded text-[13px] font-semibold transition-colors shadow-sm"
          >
            OK
          </button>
          <button 
            onClick={onClose}
            className="w-[84px] bg-white border border-slate-300 hover:bg-slate-50 px-4 py-1.5 rounded text-[13px] transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
