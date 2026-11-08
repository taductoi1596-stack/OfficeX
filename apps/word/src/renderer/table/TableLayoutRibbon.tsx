import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RGroup } from '../SharedComponents';
import * as I from 'lucide-react';
import { EditorAPI } from '../editorApi';
import { SplitCellsModal } from './SplitCellsModal';
import { AltTextModal } from './AltTextModal';

// Select Icons
const IconSelectTable = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2b579a" strokeWidth="1.5" fill="#eff6ff" />
    <path d="M3 9h18 M3 15h18 M9 3v18 M15 3v18" stroke="#2b579a" strokeWidth="1.5" />
  </svg>
);

const IconSelectCol = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
    <rect x="9" y="3" width="6" height="18" fill="#3b82f6" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M3 9h18 M3 15h18" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const IconSelectRow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
    <rect x="3" y="9" width="18" height="6" fill="#3b82f6" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M9 3v18 M15 3v18" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const IconSelectCell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
    <rect x="9" y="9" width="6" height="6" fill="#3b82f6" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M3 9h18 M3 15h18 M9 3v18 M15 3v18" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

// Delete Icons
const IconDeleteTable = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="1.5" />
    <path d="M3 9h18 M3 15h18 M9 3v18 M15 3v18" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="17" cy="17" r="5" fill="#ef4444" stroke="white" strokeWidth="1" />
    <path d="M15 15l4 4M19 15l-4 4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconDeleteCol = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="1.5" />
    <rect x="9" y="3" width="6" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="17" cy="17" r="5" fill="#ef4444" stroke="white" strokeWidth="1" />
    <path d="M15 15l4 4M19 15l-4 4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconDeleteRow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="1.5" />
    <rect x="3" y="9" width="18" height="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="17" cy="17" r="5" fill="#ef4444" stroke="white" strokeWidth="1" />
    <path d="M15 15l4 4M19 15l-4 4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconDeleteCell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="1.5" />
    <rect x="9" y="9" width="6" height="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="17" cy="17" r="5" fill="#ef4444" stroke="white" strokeWidth="1" />
    <path d="M15 15l4 4M19 15l-4 4" stroke="white" strokeWidth="1.5" />
  </svg>
);

// Insert Icons
const IconInsertAbove = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="7" width="18" height="14" rx="1" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M3 14h18 M11 7v14" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="6" cy="5" r="4" fill="#22c55e" stroke="white" strokeWidth="1" />
    <path d="M6 3v4M4 5h4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconInsertBelow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="18" height="14" rx="1" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M3 10h18 M11 3v14" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="6" cy="19" r="4" fill="#22c55e" stroke="white" strokeWidth="1" />
    <path d="M6 17v4M4 19h4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconInsertLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="7" y="3" width="14" height="18" rx="1" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M7 11h14 M14 3v18" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="5" cy="6" r="4" fill="#22c55e" stroke="white" strokeWidth="1" />
    <path d="M5 4v4M3 6h4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconInsertRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="14" height="18" rx="1" stroke="#2b579a" strokeWidth="1.5" />
    <path d="M3 11h14 M10 3v18" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="19" cy="6" r="4" fill="#22c55e" stroke="white" strokeWidth="1" />
    <path d="M19 4v4M17 6h4" stroke="white" strokeWidth="1.5" />
  </svg>
);

const AlignIcon = ({ type }: { type: string }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" stroke="#94a3b8" />
      {type === 'tl' && <line x1="6" y1="7" x2="12" y2="7" stroke="#475569" strokeWidth="2" />}
      {type === 'tl' && <line x1="6" y1="10" x2="10" y2="10" stroke="#475569" strokeWidth="2" />}
      {type === 'tc' && <line x1="9" y1="7" x2="15" y2="7" stroke="#475569" strokeWidth="2" />}
      {type === 'tc' && <line x1="10" y1="10" x2="14" y2="10" stroke="#475569" strokeWidth="2" />}
      {type === 'tr' && <line x1="12" y1="7" x2="18" y2="7" stroke="#475569" strokeWidth="2" />}
      {type === 'tr' && <line x1="14" y1="10" x2="18" y2="10" stroke="#475569" strokeWidth="2" />}
      {type === 'ml' && <line x1="6" y1="11" x2="12" y2="11" stroke="#475569" strokeWidth="2" />}
      {type === 'ml' && <line x1="6" y1="14" x2="10" y2="14" stroke="#475569" strokeWidth="2" />}
      {type === 'mc' && <line x1="9" y1="11" x2="15" y2="11" stroke="#475569" strokeWidth="2" />}
      {type === 'mc' && <line x1="10" y1="14" x2="14" y2="14" stroke="#475569" strokeWidth="2" />}
      {type === 'mr' && <line x1="12" y1="11" x2="18" y2="11" stroke="#475569" strokeWidth="2" />}
      {type === 'mr' && <line x1="14" y1="14" x2="18" y2="14" stroke="#475569" strokeWidth="2" />}
      {type === 'bl' && <line x1="6" y1="15" x2="12" y2="15" stroke="#475569" strokeWidth="2" />}
      {type === 'bl' && <line x1="6" y1="18" x2="10" y2="18" stroke="#475569" strokeWidth="2" />}
      {type === 'bc' && <line x1="9" y1="15" x2="15" y2="15" stroke="#475569" strokeWidth="2" />}
      {type === 'bc' && <line x1="10" y1="18" x2="14" y2="18" stroke="#475569" strokeWidth="2" />}
      {type === 'br' && <line x1="12" y1="15" x2="18" y2="15" stroke="#475569" strokeWidth="2" />}
      {type === 'br' && <line x1="14" y1="18" x2="18" y2="18" stroke="#475569" strokeWidth="2" />}
    </svg>
  );
};

const DistributeRowsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2b579a]">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <rect x="3" y="10" width="18" height="4" rx="1" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
  </svg>
);

const DistributeColsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2b579a]">
    <rect x="4" y="3" width="4" height="18" rx="1" />
    <rect x="10" y="3" width="4" height="18" rx="1" />
    <rect x="16" y="3" width="4" height="18" rx="1" />
  </svg>
);

export function TableLayoutRibbon() {
  const [height, setHeight] = useState('0,529');
  const [width, setWidth] = useState('0,529');
  const [align, setAlign] = useState('tl');

  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showAltTextModal, setShowAltTextModal] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const legacyApi = EditorAPI.getLegacy() as any;

  const closeAllMenus = () => {
    setShowSelectMenu(false);
    setShowDeleteMenu(false);
    setShowInsertMenu(false);
  };

  return (
    <div className="flex h-full items-start overflow-x-auto custom-scrollbar">
      {/* Hàng & Cột */}
      <RGroup label="Hàng & Cột">
        <div className="flex gap-1 h-full items-center">
          {/* Chọn */}
          <button 
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPos({ top: rect.bottom, left: rect.left });
              closeAllMenus();
              setShowSelectMenu(!showSelectMenu);
            }}
          >
            <I.MousePointer size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center">
              Chọn
              <I.ChevronDown size={10} className="text-slate-500 -mt-0.5" />
            </span>
          </button>
          {showSelectMenu && createPortal(
            <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl py-1 rounded-[6px] min-w-[140px] text-[13px] text-slate-700"
              style={{ top: dropdownPos.top + 4, left: dropdownPos.left }}>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.selectTable?.(); setShowSelectMenu(false); }}>
                <IconSelectTable />
                <span>Bảng</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.selectColumn?.(); setShowSelectMenu(false); }}>
                <IconSelectCol />
                <span>Cột</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.selectRow?.(); setShowSelectMenu(false); }}>
                <IconSelectRow />
                <span>Hàng</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.selectCell?.(); setShowSelectMenu(false); }}>
                <IconSelectCell />
                <span>Ô</span>
              </button>
            </div>,
            document.body
          )}

          {/* Xóa */}
          <button 
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPos({ top: rect.bottom, left: rect.left });
              closeAllMenus();
              setShowDeleteMenu(!showDeleteMenu);
            }}
          >
            <I.Trash2 size={20} className="text-red-500 p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center">
              Xóa
              <I.ChevronDown size={10} className="text-slate-500 -mt-0.5" />
            </span>
          </button>
          {showDeleteMenu && createPortal(
            <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl py-1 rounded-[6px] min-w-[150px] text-[13px] text-slate-700"
              style={{ top: dropdownPos.top + 4, left: dropdownPos.left }}>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.deleteTable?.(); setShowDeleteMenu(false); }}>
                <IconDeleteTable />
                <span>Xóa bỏ Bảng</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.deleteColumn?.(); setShowDeleteMenu(false); }}>
                <IconDeleteCol />
                <span>Xóa Cột</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.deleteRow?.(); setShowDeleteMenu(false); }}>
                <IconDeleteRow />
                <span>Xóa bỏ Hàng</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.deleteCell?.(); setShowDeleteMenu(false); }}>
                <IconDeleteCell />
                <span>Xóa ô</span>
              </button>
            </div>,
            document.body
          )}

          {/* Chèn */}
          <button 
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPos({ top: rect.bottom, left: rect.left });
              closeAllMenus();
              setShowInsertMenu(!showInsertMenu);
            }}
          >
            <I.Plus size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center">
              Chèn
              <I.ChevronDown size={10} className="text-slate-500 -mt-0.5" />
            </span>
          </button>
          {showInsertMenu && createPortal(
            <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl py-1 rounded-[6px] min-w-[170px] text-[13px] text-slate-700"
              style={{ top: dropdownPos.top + 4, left: dropdownPos.left }}>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.insertRow?.('above'); setShowInsertMenu(false); }}>
                <IconInsertAbove />
                <span>Chèn hàng ở trên</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.insertRow?.('below'); setShowInsertMenu(false); }}>
                <IconInsertBelow />
                <span>Chèn hàng bên dưới</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.insertColumn?.('left'); setShowInsertMenu(false); }}>
                <IconInsertLeft />
                <span>Chèn cột bên trái</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5" onClick={() => { legacyApi?.insertColumn?.('right'); setShowInsertMenu(false); }}>
                <IconInsertRight />
                <span>Chèn cột bên phải</span>
              </button>
            </div>,
            document.body
          )}
        </div>
      </RGroup>

      {/* Gộp */}
      <RGroup label="Gộp">
        <div className="flex gap-1 h-full items-center">
          <button 
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
            onClick={() => legacyApi?.mergeCells?.()}
          >
            <I.Grid size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center leading-tight">
              <span>Hợp</span><span>nhất</span>
            </span>
          </button>
          <button 
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
            onClick={() => setShowSplitModal(true)}
          >
            <I.Columns size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center leading-tight">
              <span>Phân</span><span>tách</span>
            </span>
          </button>
        </div>
      </RGroup>

      <SplitCellsModal 
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        onSplit={(c, r) => legacyApi?.splitCell?.(c, r)}
      />

      {/* Kích cỡ Ô */}
      <RGroup label="Kích cỡ Ô">
        <div className="flex gap-2 h-full items-center">
          <div className="flex flex-col gap-1 justify-center h-full px-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-700 w-[70px]">
                <I.ArrowUpDown size={12} className="text-[#2b579a]" /> Chiều cao:
              </div>
              <div className="flex items-center border border-slate-300 rounded overflow-hidden bg-white h-[20px] w-[75px]">
                <input 
                  type="text" 
                  className="w-full text-[11px] px-1 outline-none text-right" 
                  value={height + ' cm'} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.529;
                    setHeight(val.toString());
                    legacyApi?.setRowHeight?.(val * 37.8);
                  }} 
                />
                <div className="flex flex-col border-l border-slate-300 bg-slate-50 w-[16px] shrink-0">
                  <button 
                    onClick={() => {
                      const newH = Math.round(((parseFloat(height) || 0.529) + 0.1) * 100) / 100;
                      setHeight(newH.toString());
                      legacyApi?.setRowHeight?.(newH * 37.8);
                    }}
                    className="h-[10px] flex items-center justify-center hover:bg-slate-200 border-b border-slate-300"
                  >
                    <I.ChevronUp size={10} className="text-slate-600" />
                  </button>
                  <button 
                    onClick={() => {
                      const newH = Math.max(0.1, Math.round(((parseFloat(height) || 0.529) - 0.1) * 100) / 100);
                      setHeight(newH.toString());
                      legacyApi?.setRowHeight?.(newH * 37.8);
                    }}
                    className="h-[10px] flex items-center justify-center hover:bg-slate-200"
                  >
                    <I.ChevronDown size={10} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] text-slate-700 w-[70px]">
                <I.ArrowLeftRight size={12} className="text-[#2b579a]" /> Chiều rộng:
              </div>
              <div className="flex items-center border border-slate-300 rounded overflow-hidden bg-white h-[20px] w-[75px]">
                <input 
                  type="text" 
                  className="w-full text-[11px] px-1 outline-none text-right" 
                  value={width + ' cm'} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.529;
                    setWidth(val.toString());
                    legacyApi?.setColumnWidth?.(val * 37.8);
                  }} 
                />
                <div className="flex flex-col border-l border-slate-300 bg-slate-50 w-[16px] shrink-0">
                  <button 
                    onClick={() => {
                      const newW = Math.round(((parseFloat(width) || 0.529) + 0.1) * 100) / 100;
                      setWidth(newW.toString());
                      legacyApi?.setColumnWidth?.(newW * 37.8);
                    }}
                    className="h-[10px] flex items-center justify-center hover:bg-slate-200 border-b border-slate-300"
                  >
                    <I.ChevronUp size={10} className="text-slate-600" />
                  </button>
                  <button 
                    onClick={() => {
                      const newW = Math.max(0.2, Math.round(((parseFloat(width) || 0.529) - 0.1) * 100) / 100);
                      setWidth(newW.toString());
                      legacyApi?.setColumnWidth?.(newW * 37.8);
                    }}
                    className="h-[10px] flex items-center justify-center hover:bg-slate-200"
                  >
                    <I.ChevronDown size={10} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 justify-center h-full pr-1">
            <button 
              onClick={() => legacyApi?.distributeRows?.()}
              className="flex items-center gap-1.5 text-[11px] text-slate-700 hover:bg-slate-100 px-1.5 py-0.5 rounded"
            >
              <DistributeRowsIcon /> Phân phối các Hàng
            </button>
            <button 
              onClick={() => legacyApi?.distributeColumns?.()}
              className="flex items-center gap-1.5 text-[11px] text-slate-700 hover:bg-slate-100 px-1.5 py-0.5 rounded"
            >
              <DistributeColsIcon /> Phân phối các Cột
            </button>
          </div>
        </div>
      </RGroup>

      {/* Căn */}
      <RGroup label="Căn">
        <div className="flex items-center justify-center h-full px-2">
          <div className="grid grid-cols-3 gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200">
            {[
              { id: 'tl', align: 'left', vAlign: 'top' },
              { id: 'tc', align: 'center', vAlign: 'top' },
              { id: 'tr', align: 'right', vAlign: 'top' },
              { id: 'ml', align: 'left', vAlign: 'middle' },
              { id: 'mc', align: 'center', vAlign: 'middle' },
              { id: 'mr', align: 'right', vAlign: 'middle' },
              { id: 'bl', align: 'left', vAlign: 'bottom' },
              { id: 'bc', align: 'center', vAlign: 'bottom' },
              { id: 'br', align: 'right', vAlign: 'bottom' }
            ].map(cfg => (
              <button 
                key={cfg.id}
                onClick={() => {
                  setAlign(cfg.id);
                  legacyApi?.setCellAlignment?.(cfg.align as any, cfg.vAlign as any);
                }}
                className={`w-[22px] h-[22px] flex items-center justify-center rounded-[2px] transition-colors ${align === cfg.id ? 'bg-white border border-slate-300 shadow-sm' : 'hover:bg-slate-200 border border-transparent'}`}
              >
                <AlignIcon type={cfg.id} />
              </button>
            ))}
          </div>
        </div>
      </RGroup>

      {/* Dữ liệu */}
      <RGroup label="Dữ liệu">
        <div className="flex gap-1 h-full items-center">
          <button 
            onClick={() => legacyApi?.sortRowsAscending?.()}
            title="Sắp xếp tăng dần theo cột đầu tiên"
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
          >
            <I.ArrowDown size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center leading-tight">
              <span>Sắp xếp Tăng</span><span>dần</span>
            </span>
          </button>
          <button 
            onClick={() => legacyApi?.sortRowsDescending?.()}
            title="Sắp xếp giảm dần theo cột đầu tiên"
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
          >
            <I.ArrowUp size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center leading-tight">
              <span>Sắp xếp Giảm</span><span>dần</span>
            </span>
          </button>

        </div>
      </RGroup>

      {/* Bảng */}
      <RGroup label="Bảng">
        <div className="flex gap-1 h-full items-center">
          <button 
            onClick={() => setShowAltTextModal(true)}
            title="Đặt văn bản thay thế cho bảng"
            className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[48px]"
          >
            <I.Type size={20} className="text-[#2b579a] p-0.5" />
            <span className="text-[10px] text-slate-700 mt-0.5 flex flex-col items-center leading-tight">
              <span>Văn bản Thay</span><span>thế</span>
            </span>
          </button>
        </div>
      </RGroup>

      <AltTextModal
        isOpen={showAltTextModal}
        onClose={() => setShowAltTextModal(false)}
        onSave={(title, text) => legacyApi?.setAltText?.(title, text)}
      />
    </div>
  );
}
