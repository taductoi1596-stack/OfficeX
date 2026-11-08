/**
 * ExcelFontGroup.tsx
 * Font picker + size picker dạng dropdown có tìm kiếm, giống Word FontGroup
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ZoomIn, ZoomOut, Eraser } from 'lucide-react';
import {
  Bold, Italic, Underline, Strikethrough,
} from 'lucide-react';

const BASE_FONTS = [
  'Aptos', 'Arial', 'Calibri', 'Calibri Light', 'Cambria', 'Comic Sans MS', 'Consolas',
  'Courier New', 'Georgia', 'Impact', 'Inter', 'Roboto',
  'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
];

const FONT_SIZES = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

export interface ExcelFontState {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontColor: string;
  bgColor: string;
}

interface ExcelFontGroupProps {
  fontState: ExcelFontState;
  onFontChange: (change: Partial<ExcelFontState>) => void;
}

// ─── Nút nhỏ dùng cho Font Group ─────────────────────────────────────────────
function FBtn({ icon: Icon, title, onCmd, active, disabled, size = 15 }: {
  icon: any; title?: string; onCmd?: () => void; active?: boolean; disabled?: boolean; size?: number;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onCmd?.();
      }}
      style={{ transition: 'background-color 150ms ease, border-color 150ms ease' }}
      className={`flex items-center justify-center p-[5px] rounded-[5px] border border-transparent outline-none select-none
        ${disabled
          ? 'text-[#B8B8B8] cursor-default'
          : active
            ? 'bg-[#D4EBDF] border-[#5DB383] text-[#107C41]'
            : 'text-[#202020] hover:bg-[#EAEAEA] active:bg-[#D4EBDF] active:text-[#107C41]'
        }
      `}
    >
      <Icon size={size} color={disabled ? '#B8B8B8' : active ? '#107C41' : 'currentColor'} />
    </button>
  );
}

// ─── Font ComboBox ────────────────────────────────────────────────────────────
export function FontComboBox({ value, onChange, className = "w-[130px] h-[22px]", dropdownClassName = "w-[220px]" }: { value: string; onChange: (f: string) => void; className?: string; dropdownClassName?: string; }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [fonts, setFonts] = useState<string[]>(BASE_FONTS);
  const [scrollTop, setScrollTop] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayFont = search !== '' ? search : value;
  const filtered = fonts.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  // Load system fonts if available
  useEffect(() => {
    async function loadFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const local = await (window as any).queryLocalFonts();
          const names = Array.from(new Set(local.map((f: any) => f.family as string))) as string[];
          if (names.length > 0) setFonts(names.sort());
        } catch {}
      }
    }
    loadFonts();
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const ITEM_H = 24;
  const VISIBLE = 14;
  const total = filtered.length * ITEM_H;
  const startIdx = Math.max(0, Math.floor(scrollTop / ITEM_H) - 2);
  const endIdx = Math.min(filtered.length, startIdx + VISIBLE + 4);
  const visible = filtered.slice(startIdx, endIdx);

  return (
    <div className={`relative ${className.includes('w-full') ? 'w-full' : ''}`} ref={wrapperRef}>
      <div
        className={`flex items-center bg-white border rounded-[4px] transition-colors duration-150 cursor-text ${className}
          ${open ? 'border-[#107C41] ring-1 ring-[#107C41]' : 'border-[#D0D0D0] hover:border-[#5DB383]'}
        `}
        onClick={() => setOpen(true)}
      >
        <input
          type="text"
          className="w-full h-full bg-transparent outline-none px-1.5 text-[11px]"
          value={displayFont}
          style={{ fontFamily: value }}
          onChange={e => { setSearch(e.target.value); setOpen(true); setScrollTop(0); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onChange(search || value);
              setSearch('');
              setOpen(false);
            } else if (e.key === 'Escape') {
              setSearch('');
              setOpen(false);
            }
          }}
        />
        <button
          className="px-1 text-slate-400 hover:text-slate-600"
          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setOpen(o => !o); }}
        >
          <ChevronDown size={10} />
        </button>
      </div>

      {open && (
        <div
          className={`absolute top-full left-0 mt-1 max-h-[300px] overflow-auto bg-white border border-[#D6D6D6] rounded-[6px] z-50 py-1 ${dropdownClassName}`}
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.14)' }}
          onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-[#808080] sticky top-0 bg-white/95 border-b border-[#F0F0F0]">
            Tất cả phông chữ ({filtered.length})
          </div>
          <div style={{ height: total, position: 'relative' }}>
            {visible.map((font, i) => {
              const idx = startIdx + i;
              return (
                <div
                  key={font}
                  className={`absolute left-0 right-0 px-3 text-[12px] cursor-pointer flex items-center justify-between transition-colors duration-100
                    ${font === value ? 'bg-[#D4EBDF] text-[#107C41]' : 'text-[#202020] hover:bg-[#EAF5EF]'}
                  `}
                  style={{ top: idx * ITEM_H, height: ITEM_H, fontFamily: font }}
                  onMouseDown={e => {
                    e.preventDefault();
                    onChange(font);
                    setSearch('');
                    setOpen(false);
                  }}
                >
                  <span className="truncate pr-2">{font}</span>
                  {font === value && <span className="text-[#107C41] text-[10px] shrink-0">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FontSize ComboBox ────────────────────────────────────────────────────────
export function FontSizeComboBox({ value, onChange }: { value: number; onChange: (sz: number) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displaySize = search !== '' ? search : value.toString();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className={`flex items-center bg-white border rounded-[4px] h-[22px] w-[46px] transition-colors duration-150
          ${open ? 'border-[#107C41] ring-1 ring-[#107C41]' : 'border-[#D0D0D0] hover:border-[#5DB383]'}
        `}
        onClick={() => setOpen(true)}
      >
        <input
          type="text"
          className="w-full h-full bg-transparent outline-none px-1 text-[11px] text-center"
          value={displaySize}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = parseFloat(search);
              if (!isNaN(val) && val > 0 && val <= 1000) onChange(val);
              setSearch('');
              setOpen(false);
            } else if (e.key === 'Escape') {
              setSearch('');
              setOpen(false);
            }
          }}
        />
        <button
          className="pr-1 text-slate-400 hover:text-slate-600"
          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setOpen(o => !o); }}
        >
          <ChevronDown size={9} />
        </button>
      </div>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-[60px] max-h-[250px] overflow-auto bg-white border border-[#D6D6D6] rounded-[6px] z-50 py-1"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.14)' }}
        >
          {FONT_SIZES.map(sz => (
            <div
              key={sz}
              className={`px-2 py-0.5 text-[11px] text-center cursor-pointer transition-colors duration-100
                ${sz === value ? 'bg-[#D4EBDF] text-[#107C41]' : 'text-[#202020] hover:bg-[#EAF5EF]'}
              `}
              onMouseDown={e => {
                e.preventDefault();
                onChange(sz);
                setSearch('');
                setOpen(false);
              }}
            >
              {sz}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Color Picker Button ────────────────────────────────────────────────────────
export function ColorPickerButton({ title, value, onChange, isBg }: { title: string; value: string; onChange: (c: string) => void; isBg?: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const defaultColor = isBg ? '#FFFF00' : '#FF0000';
  const displayColor = value || defaultColor;

  // Excel Standard Theme Colors
  const themeColors = [
    '#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47',
    '#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e2f3', '#fbe5d5', '#ededed', '#fff2cc', '#deebf6', '#e2efd9',
    '#d8d8d8', '#595959', '#aeaaaa', '#adb9ca', '#b4c6e7', '#f7cbac', '#dbdbdb', '#ffe599', '#bdd7ee', '#c6e0b3',
    '#bfbfbf', '#3f3f3f', '#757070', '#8496b0', '#8eaadb', '#f4b083', '#c9c9c9', '#ffd966', '#9bc2e6', '#a8d08d',
    '#a5a5a5', '#262626', '#3a3838', '#323f4f', '#2f5496', '#c45911', '#7b7b7b', '#bf8f00', '#2e74b5', '#538135',
    '#7f7f7f', '#0c0c0c', '#161616', '#222a35', '#1f3864', '#833c0b', '#525252', '#7f5f00', '#1e4e79', '#375623'
  ];
  
  const standardColors = [
    '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
  ];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        title={title}
        className="flex items-center p-[5px] rounded-[5px] border border-transparent hover:bg-[#EAEAEA] transition-colors gap-0.5"
        onMouseDown={e => { e.preventDefault(); setOpen(!open); }}
      >
        <div className="flex flex-col items-center gap-0.5">
          {isBg ? (
            <>
              <div className="w-3.5 h-3.5 border border-slate-300 rounded-sm" style={{ background: displayColor }} />
              <div className="text-[8px] font-bold text-slate-500 leading-none">A</div>
            </>
          ) : (
            <>
              <div className="text-[12px] font-bold leading-none" style={{ color: displayColor }}>A</div>
              <div className="w-3.5 h-1 rounded-sm" style={{ background: displayColor }} />
            </>
          )}
        </div>
        <ChevronDown size={10} className="text-slate-500" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 p-2 bg-white border border-[#D6D6D6] rounded-[6px] z-50 flex flex-col gap-2 w-[184px]"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.14)' }}
        >
          {/* No Fill / Auto */}
          <button 
            className="flex items-center w-full px-2 py-1 text-xs text-left hover:bg-slate-100 border border-transparent rounded-sm text-slate-700"
            onMouseDown={e => {
              e.preventDefault();
              onChange('transparent');
              setOpen(false);
            }}
          >
            <div className="w-4 h-4 mr-2 border border-slate-300 rounded-sm bg-white overflow-hidden relative">
               <div className="absolute top-1/2 left-[-20%] right-[-20%] h-0.5 bg-red-500 transform -translate-y-1/2 rotate-45" />
            </div>
            {isBg ? 'Không Tô Màu' : 'Tự Động'}
          </button>
          
          <div className="text-[10px] font-semibold text-slate-500 border-b border-slate-200 pb-1 mt-1">Màu Chủ Đề</div>
          <div className="grid grid-cols-10 gap-0.5">
            {themeColors.map((c, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 cursor-pointer border border-transparent hover:border-slate-800 hover:scale-110 transition-transform"
                style={{ background: c, border: (c === '#ffffff' || c === '#f2f2f2') ? '1px solid #d1d5db' : undefined }}
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(c);
                  setOpen(false);
                }}
              />
            ))}
          </div>

          <div className="text-[10px] font-semibold text-slate-500 border-b border-slate-200 pb-1 mt-1">Màu Chuẩn</div>
          <div className="grid grid-cols-10 gap-0.5">
            {standardColors.map((c, i) => (
              <div
                key={`std-${i}`}
                className="w-3.5 h-3.5 cursor-pointer border border-transparent hover:border-slate-800 hover:scale-110 transition-transform"
                style={{ background: c }}
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(c);
                  setOpen(false);
                }}
              />
            ))}
          </div>

          <div className="mt-1 pt-1 border-t border-slate-200">
            <label className="text-[11px] text-slate-700 flex items-center justify-between cursor-pointer px-1 hover:bg-slate-100 py-1 rounded-sm">
              Thêm Màu...
              <input 
                type="color" 
                value={displayColor === 'transparent' ? defaultColor : displayColor} 
                onChange={e => onChange(e.target.value)}
                className="w-4 h-4 p-0 border-0 outline-none cursor-pointer rounded-sm"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ExcelFontGroup ────────────────────────────────────────────────────────────
export function ExcelFontGroup({ fontState, onFontChange }: ExcelFontGroupProps) {
  return (
    <div
      className="flex flex-col border-r border-[#D0D0D0] pr-2 mr-1 shrink-0"
      style={{ minHeight: 78 }}
    >
      {/* Row 1: Font family + size + grow/shrink + clear */}
      <div className="flex items-center gap-1 pt-1 flex-wrap">
        <FontComboBox
          value={fontState.fontFamily}
          onChange={f => onFontChange({ fontFamily: f })}
        />
        <FontSizeComboBox
          value={fontState.fontSize}
          onChange={sz => onFontChange({ fontSize: sz })}
        />
        <div className="w-px h-5 bg-[#E5E5E5] mx-0.5" />
        <FBtn
          icon={ZoomIn}
          title="Tăng cỡ chữ"
          onCmd={() => onFontChange({ fontSize: Math.min(1000, fontState.fontSize + 1) })}
          size={14}
        />
        <FBtn
          icon={ZoomOut}
          title="Giảm cỡ chữ"
          onCmd={() => onFontChange({ fontSize: Math.max(1, fontState.fontSize - 1) })}
          size={14}
        />
        <div className="w-px h-5 bg-[#E5E5E5] mx-0.5" />
        <FBtn
          icon={Eraser}
          title="Xóa định dạng"
          onCmd={() => onFontChange({ bold: false, italic: false, underline: false, strikethrough: false })}
          size={14}
        />
      </div>

      {/* Row 2: B I U S */}
      <div className="flex items-center gap-1 mt-1">
        <FBtn icon={Bold} title="In đậm (Ctrl+B)" active={fontState.bold} onCmd={() => onFontChange({ bold: !fontState.bold })} />
        <FBtn icon={Italic} title="In nghiêng (Ctrl+I)" active={fontState.italic} onCmd={() => onFontChange({ italic: !fontState.italic })} />
        <FBtn icon={Underline} title="Gạch chân (Ctrl+U)" active={fontState.underline} onCmd={() => onFontChange({ underline: !fontState.underline })} />
        <FBtn icon={Strikethrough} title="Gạch ngang" active={fontState.strikethrough} onCmd={() => onFontChange({ strikethrough: !fontState.strikethrough })} />

        {/* Border button */}
        <div className="w-px h-5 bg-[#E5E5E5] mx-0.5" />
        <ColorPickerButton 
          title="Màu tô ô" 
          value={fontState.bgColor} 
          onChange={c => onFontChange({ bgColor: c })} 
          isBg 
        />
        <ColorPickerButton 
          title="Màu chữ" 
          value={fontState.fontColor} 
          onChange={c => onFontChange({ fontColor: c })} 
        />
      </div>

      {/* Label */}
      <div className="text-[9px] text-slate-400 text-center pb-0.5 mt-auto">Phông chữ</div>
    </div>
  );
}
