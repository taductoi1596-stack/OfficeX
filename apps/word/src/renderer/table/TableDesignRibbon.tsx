import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RGroup, RBtn } from '../SharedComponents';
import * as I from '@officex/icons';
import { useRibbonState } from '../RibbonController';
import { EditorAPI } from '../editorApi';
import { ColorPicker } from '@officex/ui';

const ArrowUp = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const ArrowDown = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const DropdownArrow = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><polyline points="6 12 12 18 18 12"></polyline></svg>;

const PaletteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#fff" />
    <circle cx="14" cy="7" r="2" fill="#ef4444" stroke="none" />
    <circle cx="18" cy="11" r="2" fill="#eab308" stroke="none" />
    <circle cx="8" cy="8" r="2" fill="#3b82f6" stroke="none" />
    <circle cx="6" cy="13" r="2" fill="#22c55e" stroke="none" />
    <circle cx="10" cy="16" r="2" fill="#a855f7" stroke="none" />
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
  </svg>
);



const BorderIcon = ({ top, bottom, left, right, horiz, vert }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
     <rect x="3" y="3" width="18" height="18" stroke="#cbd5e1" strokeDasharray="2,2" strokeWidth="1" />
     <line x1="3" y1="12" x2="21" y2="12" stroke="#cbd5e1" strokeDasharray="2,2" strokeWidth="1" />
     <line x1="12" y1="3" x2="12" y2="21" stroke="#cbd5e1" strokeDasharray="2,2" strokeWidth="1" />

     {top && <line x1="3" y1="3" x2="21" y2="3" stroke="#475569" strokeWidth="1.5" />}
     {bottom && <line x1="3" y1="21" x2="21" y2="21" stroke="#475569" strokeWidth="1.5" />}
     {left && <line x1="3" y1="3" x2="3" y2="21" stroke="#475569" strokeWidth="1.5" />}
     {right && <line x1="21" y1="3" x2="21" y2="21" stroke="#475569" strokeWidth="1.5" />}
     {horiz && <line x1="3" y1="12" x2="21" y2="12" stroke="#475569" strokeWidth="1.5" />}
     {vert && <line x1="12" y1="3" x2="12" y2="21" stroke="#475569" strokeWidth="1.5" />}
  </svg>
);

const borderItems = [
  { id: 'all', icon: <BorderIcon top bottom left right horiz vert /> },
  { id: 'bottom', icon: <BorderIcon bottom /> },
  { id: 'top', icon: <BorderIcon top /> },
  { id: 'left', icon: <BorderIcon left /> },
  { id: 'right', icon: <BorderIcon right /> },
  { id: 'outside', icon: <BorderIcon top bottom left right /> },
  { id: 'inside', icon: <BorderIcon horiz vert /> },
  { id: 'inside_h', icon: <BorderIcon horiz /> },
  { id: 'inside_v', icon: <BorderIcon vert /> },
  { id: 'none', icon: <BorderIcon /> },
];

const SvgTable = ({ type, theme = 'slate' }: { type: number, theme?: string }) => {
  let cSolid = '#94a3b8';
  let cDashed = '#cbd5e1';
  let bgLight = '#f1f5f9';
  let bgDark = '#334155';

  if (theme === 'blue') {
    bgLight = '#eff6ff';
    bgDark = '#1d4ed8';
  } else if (theme === 'green') {
    bgLight = '#f0fdf4';
    bgDark = '#15803d';
  }

  const HeaderBg = <rect x="0" y="0" width="48" height="9" fill={bgDark} />;
  const BandedRows = <rect x="0" y="18" width="48" height="9" fill={bgLight} />;

  return (
    <svg width="48" height="36" viewBox="0 0 48 36" style={{ display: 'block', margin: 'auto' }}>
      {HeaderBg}
      {(type === 1 || type === 4 || type === 5 || type === 6 || type === 7) && BandedRows}

      {type === 1 && (
        <path d="M0 9h48" stroke={cSolid} strokeWidth="1" fill="none" />
      )}

      {type === 2 && (
        <path d="M0 0h48 M0 9h48 M0 18h48 M0 27h48 M0 36h48" stroke={cSolid} strokeWidth="1" fill="none" />
      )}

      {type === 3 && (
        <>
          <path d="M0 0h48 M0 9h48 M0 18h48 M0 27h48 M0 36h48" stroke={cDashed} strokeWidth="1" strokeDasharray="2,2" fill="none" />
          <path d="M0 0v36 M48 0v36 M12 0v36 M24 0v36 M36 0v36" stroke={cDashed} strokeWidth="1" strokeDasharray="2,2" fill="none" />
        </>
      )}

      {type === 4 && (
        <path d="M0 0h48 M0 9h48 M0 18h48 M0 27h48 M0 36h48" stroke={cSolid} strokeWidth="1" fill="none" />
      )}

      {type === 5 && (
        <path d="M0 0h48 M0 36h48 M0 9h48 M12 0v36" stroke={cSolid} strokeWidth="1" fill="none" />
      )}

      {type === 6 && (
        <>
          <path d="M0 0h48 M0 9h48 M0 36h48 M0 0v36 M48 0v36 M12 0v36 M24 0v36 M36 0v36" stroke={cSolid} strokeWidth="1" fill="none" />
          <path d="M0 18h48 M0 27h48" stroke={cDashed} strokeWidth="1" strokeDasharray="2,2" fill="none" />
        </>
      )}

      {type === 7 && (
        <>
          <path d="M0 0h48v36H0z M12 9v27 M24 9v27 M36 9v27 M0 9h48 M0 18h48 M0 27h48" stroke={cSolid} strokeWidth="1" fill="none" />
          <path d="M12 0v9 M24 0v9 M36 0v9" stroke="#ffffff" strokeWidth="1" fill="none" />
        </>
      )}
    </svg>
  );
};

export function TableDesignRibbon() {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showBordersMenu, setShowBordersMenu] = useState(false);
  const [showShadingMenu, setShowShadingMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [borderThickness, setBorderThickness] = useState(1.5);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const bordersRef = React.useRef<HTMLDivElement>(null);
  const shadingRef = React.useRef<HTMLDivElement>(null);

  const MiniTable = ({ type }: { type: number }) => {
    return (
      <div className={`w-[44px] h-[34px] border ${type === 1 || type === 7 ? 'border-slate-400' : 'border-slate-200'} flex flex-col bg-white overflow-hidden rounded-[1px]`}>
        {[0, 1, 2, 3].map(row => (
          <div key={row} className="flex-1 flex">
            {[0, 1, 2, 3].map(col => {
              const isHeader = row === 0;
              const isBandedRow = row % 2 !== 0;
              const isBandedCol = col % 2 !== 0;
              const isFirstCol = col === 0;

              let bg = 'bg-white';
              if (type === 7 && isHeader) bg = 'bg-slate-700';
              else if (type === 7 && isBandedRow) bg = 'bg-slate-100';
              else if (type === 5 && isBandedRow) bg = 'bg-slate-100';
              else if (type === 6 && isBandedCol) bg = 'bg-slate-100';
              else if (type === 4 && isFirstCol) bg = 'bg-slate-200';
              else if (type === 2 && isHeader) bg = 'bg-slate-50';

              let bBottom = type === 1 || type === 4 || type === 7 || (type === 3 && (row === 0 || row === 3)) ? 'border-b border-slate-300' : 'border-b border-dashed border-slate-200';
              let bRight = type === 1 || type === 7 || type === 4 ? 'border-r border-slate-300' : 'border-r border-dashed border-slate-200';
              if (row === 3) bBottom = '';
              if (col === 3) bRight = '';

              return <div key={col} className={`flex-1 ${bg} ${bBottom} ${bRight}`} />;
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full gap-2 px-2 select-none relative items-center">

      {/* Kiểu Bảng & Tùy chọn */}
      <div className="flex h-full items-center border-r border-border pr-3 gap-3">

        <div className="flex flex-col h-full justify-between items-center pb-[2px]">
          <div className="flex gap-2 h-[52px] items-center">
            <div className="flex h-[44px] items-center border border-slate-300 rounded-[3px] bg-white overflow-hidden shadow-sm">
              <div className="flex gap-[1px] p-[2px]">
                {[1, 2, 3, 4, 5, 6, 7].map(t => (
                  <div key={t} className="cursor-pointer hover:border-blue-400 hover:bg-blue-50 border border-transparent rounded-[1px]" onClick={() => (EditorAPI.getLegacy() as any)?.setTableStyle?.(`Style${t}`)}>
                    <SvgTable type={t} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-between border-l border-slate-300 bg-slate-50 h-full w-[16px]">
                <div className="flex-1 flex items-center justify-center cursor-pointer hover:bg-slate-200 text-slate-500"><ArrowUp /></div>
                <div className="flex-1 flex items-center justify-center cursor-pointer hover:bg-slate-200 text-slate-500 border-t border-slate-300"><ArrowDown /></div>
                <div className="flex-1 flex items-center justify-center cursor-pointer hover:bg-slate-200 text-slate-500 border-t border-slate-300" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropdownPos({ top: rect.bottom, left: rect.left });
                  setShowGallery(!showGallery);
                }}>
                  <DropdownArrow />
                </div>
              </div>
            </div>

            {showGallery && createPortal(
              <div
                className="fixed z-[9999] bg-white border border-slate-300 shadow-2xl p-4 w-[420px] flex flex-col gap-4"
                style={{ top: dropdownPos.top + 2, left: Math.max(10, dropdownPos.left - 390) }}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Bảng Xám (Slate Theme)</div>
                  <div className="flex gap-[1px]">
                    {[1, 2, 3, 4, 5, 6, 7].map(t => (
                      <div key={t} className="cursor-pointer hover:border-blue-400 hover:bg-blue-50 border border-transparent rounded-[1px]" onClick={() => { (EditorAPI.getLegacy() as any)?.setTableStyle?.(`Style${t}`); setShowGallery(false); }}>
                        <SvgTable type={t} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Bảng Xanh lam (Blue Theme)</div>
                  <div className="flex gap-[1px]">
                    {[1, 2, 3, 4, 5, 6, 7].map(t => (
                      <div key={t} className="cursor-pointer hover:border-blue-400 hover:bg-blue-50 border border-transparent rounded-[1px]" onClick={() => { (EditorAPI.getLegacy() as any)?.setTableStyle?.(`BlueStyle${t}`); setShowGallery(false); }}>
                        <SvgTable type={t} theme="blue" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Bảng Xanh lục (Green Theme)</div>
                  <div className="flex gap-[1px]">
                    {[1, 2, 3, 4, 5, 6, 7].map(t => (
                      <div key={t} className="cursor-pointer hover:border-blue-400 hover:bg-blue-50 border border-transparent rounded-[1px]" onClick={() => { (EditorAPI.getLegacy() as any)?.setTableStyle?.(`GreenStyle${t}`); setShowGallery(false); }}>
                        <SvgTable type={t} theme="green" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>,
              document.body
            )}

            <div className="relative flex flex-col h-full justify-center">
              <button className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPos({ top: rect.bottom, left: rect.left });
                setShowColorMenu(!showColorMenu);
              }}>
                <PaletteIcon />
                <span className="text-[10px] text-slate-700 flex items-center gap-0.5 mt-1">Màu <br />Bảng <DropdownArrow /></span>
              </button>
              {showColorMenu && createPortal(
                <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl z-50 rounded-[6px]"
                  style={{ top: dropdownPos.top + 4, left: dropdownPos.left, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ColorPicker
                    allowAutomatic={true}
                    onSelectColor={(c) => {
                      (EditorAPI.getLegacy() as any)?.setTableShading?.(c === 'automatic' ? '' : c);
                      setShowColorMenu(false);
                    }}
                  />
                </div>,
                document.body
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide">Kiểu Bảng</span>
        </div>

      </div>

      {/* Viền & Bóng */}
      <RGroup label="Viền & Bóng">
        <div className="flex gap-2 h-full items-center px-2">
          
          <div className="relative flex flex-col h-full justify-center" ref={bordersRef}>
            <button className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[50px]" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPos({ top: rect.bottom, left: rect.left });
              setShowBordersMenu(!showBordersMenu);
            }}>
              <I.IconBorders size={22} className="text-slate-700" />
              <span className="text-[10px] text-slate-700 flex items-center gap-0.5 mt-1">Viền <br/>bảng <DropdownArrow /></span>
            </button>
            {showBordersMenu && createPortal(
              <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl flex flex-col w-[220px] text-[13px] text-slate-700 py-2 rounded-[6px]"
                   style={{ top: dropdownPos.top + 4, left: dropdownPos.left, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                
                <div className="grid grid-cols-5 gap-1 px-3 pb-3 border-b border-slate-200">
                  {borderItems.map(item => (
                    <div key={item.id} className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-slate-100 cursor-pointer border border-transparent hover:border-slate-300 transition-colors"
                         onClick={() => { (EditorAPI.getLegacy() as any)?.setTableBorders?.(item.id, borderThickness, borderStyle, borderColor); setShowBordersMenu(false); }}>
                      {item.icon}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col pt-2">
                  <div className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-100 cursor-pointer group relative">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-[3px] items-center justify-center w-[16px]">
                        <div className="w-full h-[1.5px] bg-slate-500" />
                        <div className="w-full h-[2px] bg-slate-500" />
                        <div className="w-full h-[3px] bg-slate-500" />
                      </div>
                      <span>Độ dày</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-[11px]">{borderThickness} pt</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div className="hidden group-hover:block absolute top-[-8px] left-full pl-1 z-[10000]">
                      <div className="bg-white border border-[#D6D6D6] shadow-xl w-32 rounded-[6px] py-2">
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderThickness(0.5); }}>0.5 pt</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderThickness(1); }}>1 pt</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderThickness(1.5); }}>1.5 pt</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderThickness(3); }}>3 pt</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-100 cursor-pointer group relative">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-[3px] items-center justify-center w-[16px]">
                        <div className="w-full h-[1.5px] bg-slate-500" />
                        <div className="w-full h-[1.5px] border-t border-dashed border-slate-500" />
                        <div className="w-full h-[1.5px] border-t border-dotted border-slate-500" />
                      </div>
                      <span>Kiểu</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-[11px]">
                        {borderStyle === 'solid' ? 'Nét liền' : borderStyle === 'dashed' ? 'Nét đứt' : borderStyle === 'dotted' ? 'Chấm bi' : borderStyle === 'double' ? 'Nét đôi' : 'Đậm'}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div className="hidden group-hover:block absolute top-[-8px] left-full pl-1 z-[10000]">
                      <div className="bg-white border border-[#D6D6D6] shadow-xl w-32 rounded-[6px] py-2">
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderStyle('solid'); }}>Nét liền</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderStyle('dashed'); }}>Nét đứt</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderStyle('dotted'); }}>Chấm bi</button>
                        <button className="w-full text-left px-4 py-1.5 hover:bg-slate-100" onClick={(e) => { e.stopPropagation(); setBorderStyle('double'); }}>Nét đôi</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-100 cursor-pointer group relative">
                    <div className="flex items-center gap-3">
                      <I.IconShading size={16} className="text-slate-500" />
                      <span>Màu sắc</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <div className="w-3 h-3 rounded-sm border border-slate-200" style={{ backgroundColor: borderColor }}></div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div className="hidden group-hover:block absolute top-[-8px] left-full pl-1 z-[10000]">
                      <div className="bg-white border border-[#D6D6D6] shadow-xl rounded-[6px]" onClick={(e) => e.stopPropagation()}>
                        <ColorPicker
                          allowAutomatic={true}
                          onSelectColor={(c) => {
                            setBorderColor(c === 'automatic' ? '#000000' : c);
                            // We don't need to close the submenu explicitly because moving mouse away will hide it.
                            // But we can let the click bubble if we want to close the whole Borders menu, 
                            // or just do e.stopPropagation() as we did above.
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>,
              document.body
            )}
          </div>
          
          <div className="relative flex flex-col h-full justify-center" ref={shadingRef}>
            <button className="flex flex-col items-center gap-[2px] hover:bg-slate-100 p-1 rounded min-w-[50px]" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPos({ top: rect.bottom, left: rect.left });
              setShowShadingMenu(!showShadingMenu);
            }}>
              <I.IconShading size={22} className="text-slate-700" />
              <span className="text-[10px] text-slate-700 flex items-center gap-0.5 mt-1">Tô bóng <br/>Ô <DropdownArrow /></span>
            </button>
            {showShadingMenu && createPortal(
              <div className="fixed z-[9999] bg-white border border-[#D6D6D6] shadow-xl z-50 rounded-[6px]"
                   style={{ top: dropdownPos.top + 4, left: dropdownPos.left, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <ColorPicker 
                    allowAutomatic={true}
                    onSelectColor={(c) => { 
                      (EditorAPI.getLegacy() as any)?.setTableShading?.(c === 'automatic' ? '' : c); 
                      setShowShadingMenu(false); 
                    }} 
                  />
              </div>,
              document.body
            )}
          </div>
        </div>
      </RGroup>

    </div>
  );
}
