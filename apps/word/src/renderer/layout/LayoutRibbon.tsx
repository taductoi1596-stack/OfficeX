import React, { useState, useEffect } from 'react';
import { CommandDispatcher } from '../CommandDispatcher';
import { RGroup } from '../SharedComponents';
import { Dropdown } from '@officex/ui';
import { IconChevronDown } from '@officex/icons';
import { useRibbonState } from '../RibbonController';
import { EditorAPI } from '../editorApi';
import { LayoutEngine } from './LayoutEngine';
import { CustomMarginsModal } from './CustomMarginsModal';
import { CustomPageSizeModal } from './CustomPageSizeModal';
import { ColumnsModal } from './ColumnsModal';
import { LineNumberModal } from './LineNumberModal';

// ─── Custom Word-Style SVG Icons ─────────────────────────────────────────────

// Lề (Margins)
const IconMargins = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="#2563eb" strokeWidth="1.5" />
    <path d="M7 6v12M17 6v12M7 6h10M7 18h10" stroke="#3b82f6" strokeDasharray="1.5 1.5" />
  </svg>
);

// Hướng (Orientation)
const IconOrientation = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="#475569" />
    <path d="M15 16l3-3-3-3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13h9" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Kích cỡ (Size)
const IconSize = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="#0284c7" />
    <path d="M8 8h8M8 16h8" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M2 12h2M20 12h2" stroke="#0284c7" strokeWidth="1.5" />
  </svg>
);

// Cột (Columns)
const IconColumns = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="#334155" />
    <line x1="12" y1="6" x2="12" y2="18" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M7 7h2M7 11h2M7 15h2M15 7h2M15 11h2M15 15h2" stroke="#64748b" strokeWidth="1.2" />
  </svg>
);

// Nghỉ giải lao / Ngắt trang (Breaks)
const IconBreaks = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="7" rx="1" stroke="#475569" />
    <rect x="4" y="14" width="16" height="7" rx="1" stroke="#475569" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2" />
  </svg>
);

// Số dòng (Line Numbers)
const IconLineNumbers = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <text x="3" y="10" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb">1</text>
    <text x="3" y="19" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb">2</text>
    <line x1="10" y1="8" x2="20" y2="8" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="17" x2="20" y2="17" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Thụt lề Trái icon >≡
const IconIndentLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16M10 12h10M4 18h16M4 9l3 3-3 3" />
  </svg>
);

// Thụt lề Phải icon ≡<
const IconIndentRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16M4 12h10M4 18h16M20 9l-3 3 3 3" />
  </svg>
);

// Khoảng cách Trước ⤓
const IconSpacingBefore = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </svg>
);

// Khoảng cách Sau ⤒
const IconSpacingAfter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21V9M7 14l5-5 5 5M4 4h16" />
  </svg>
);

// Đường viền trang (Page Border)
const IconPageBorders = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M8 7h8M8 11h8M8 15h5" stroke="#94a3b8" strokeWidth="1.2" />
  </svg>
);

// Màu trang (Page Color)
const IconPageColor = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="7" y="3" width="14" height="18" rx="1.5" stroke="#475569" fill="#f8fafc" />
    <path d="M3 13l4-4 3 3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 17c0 1.5 1.5 2 2.5 2s1.5-.5 1.5-2c0-1.5-1.5-2.5-1.5-2.5S2 15.5 2 17z" fill="#0284c7" stroke="#0284c7" />
  </svg>
);

// Dialog Launcher Icon ⇲
const IconDialogLauncher = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#64748b" strokeWidth="1.5">
    <rect x="1" y="1" width="10" height="10" rx="1" stroke="#94a3b8" />
    <path d="M4 4h4v4M8 8L5 5" stroke="#475569" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Column SVG icons matching Word VN UI
const IconColOne = () => (
  <div className="w-[26px] h-[30px] border border-slate-600 bg-white rounded-[4px] p-1 flex flex-col justify-between shrink-0 shadow-2xs">
    <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
    <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
    <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
    <div className="h-[2px] bg-[#0284c7] rounded-full w-3/4" />
  </div>
);

const IconColTwo = () => (
  <div className="w-[26px] h-[30px] border border-slate-600 bg-white rounded-[4px] p-1 flex gap-1 justify-between shrink-0 shadow-2xs">
    <div className="w-1/2 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-2/3" />
    </div>
    <div className="w-1/2 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-2/3" />
    </div>
  </div>
);

const IconColThree = () => (
  <div className="w-[26px] h-[30px] border border-slate-600 bg-white rounded-[4px] p-1 flex gap-0.5 justify-between shrink-0 shadow-2xs">
    {[1, 2, 3].map((i) => (
      <div key={i} className="w-1/3 flex flex-col justify-between h-full">
        <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
        <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
        <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
        <div className="h-[2px] bg-[#0284c7] rounded-full w-1/2" />
      </div>
    ))}
  </div>
);

const IconColLeft = () => (
  <div className="w-[26px] h-[30px] border border-slate-600 bg-white rounded-[4px] p-1 flex gap-1 justify-between shrink-0 shadow-2xs">
    <div className="w-1/3 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
    </div>
    <div className="w-2/3 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-3/4" />
    </div>
  </div>
);

const IconColRight = () => (
  <div className="w-[26px] h-[30px] border border-slate-600 bg-white rounded-[4px] p-1 flex gap-1 justify-between shrink-0 shadow-2xs">
    <div className="w-2/3 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-3/4" />
    </div>
    <div className="w-1/3 flex flex-col justify-between h-full">
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
      <div className="h-[2px] bg-[#0284c7] rounded-full w-full" />
    </div>
  </div>
);

const IconColMore = () => (
  <div className="w-[26px] h-[20px] flex items-center justify-center gap-1 shrink-0 text-slate-700">
    <div className="flex flex-col gap-[2px] w-2.5">
      <div className="h-[2px] bg-slate-700 rounded-full" />
      <div className="h-[2px] bg-slate-700 rounded-full" />
      <div className="h-[2px] bg-slate-700 rounded-full" />
    </div>
    <div className="flex flex-col gap-[2px] w-2.5">
      <div className="h-[2px] bg-slate-700 rounded-full" />
      <div className="h-[2px] bg-slate-700 rounded-full" />
      <div className="h-[2px] bg-slate-700 rounded-full" />
    </div>
  </div>
);

// Break SVG icons matching Word VN UI
const IconBreakPage = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative flex flex-col justify-between p-[3px] shrink-0 shadow-2xs">
    <div className="w-full h-[12px] border-b border-slate-400 border-dashed" />
    <svg className="absolute top-[8px] left-[8px]" width="14" height="16" viewBox="0 0 16 18" fill="none">
      <path d="M8 2V12M8 12L4 8M8 12L12 8" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="w-full h-[12px]" />
  </div>
);

const IconBreakCol = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative p-[3px] shrink-0 flex gap-[3px] shadow-2xs">
    <div className="w-1/2 h-full flex flex-col justify-between">
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-red-500 rounded-full" />
    </div>
    <div className="w-1/2 h-full flex flex-col justify-between">
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
    </div>
    <svg className="absolute top-[8px] left-[9px]" width="14" height="18" viewBox="0 0 16 20" fill="none">
      <path d="M3 2V10C3 12 5 14 7 14H12M12 14L9 11M12 14L9 17" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const IconBreakTextWrap = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative p-[3px] shrink-0 flex flex-col justify-between shadow-2xs">
    <div className="w-full h-[2px] bg-slate-400 rounded-full" />
    <div className="flex justify-between items-center gap-[3px]">
      <div className="w-[10px] h-[10px] bg-slate-200 border border-slate-500 rounded-[1px]" />
      <div className="flex-1 flex flex-col gap-[3px]">
        <div className="w-full h-[2px] bg-slate-400 rounded-full" />
        <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      </div>
    </div>
    <div className="w-full h-[2px] bg-slate-400 rounded-full" />
  </div>
);

const IconBreakNextPage = () => (
  <div className="w-[32px] h-[36px] relative shrink-0">
    <div className="w-[22px] h-[26px] border border-slate-600 bg-white rounded-[2px] absolute top-0 left-0 z-0" />
    <div className="w-[22px] h-[26px] border border-[#0284c7] bg-sky-50 rounded-[2px] absolute bottom-0 right-0 z-10 flex items-center justify-center shadow-xs">
      <span className="text-[11px] font-bold text-[#0284c7]">2</span>
    </div>
  </div>
);

const IconBreakContinuous = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative p-[3px] shrink-0 flex flex-col justify-between shadow-2xs">
    <div className="w-full h-[10px] flex flex-col justify-around">
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
    </div>
    <div className="w-full h-[1px] border-b border-[#0284c7] border-dashed my-[1px]" />
    <div className="w-full h-[10px] flex flex-col justify-around">
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
      <div className="w-full h-[2px] bg-slate-400 rounded-full" />
    </div>
  </div>
);

const IconBreakEvenPage = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative p-[3px] shrink-0 flex items-center justify-center shadow-2xs">
    <div className="w-[20px] h-[24px] border border-slate-600 rounded-[2px] flex items-center justify-center bg-slate-50">
      <span className="text-[12px] font-bold text-slate-800">2</span>
    </div>
  </div>
);

const IconBreakOddPage = () => (
  <div className="w-[32px] h-[36px] border border-slate-700 bg-white rounded-[3px] relative p-[3px] shrink-0 flex items-center justify-center shadow-2xs">
    <div className="w-[20px] h-[24px] border border-slate-600 rounded-[2px] flex items-center justify-center bg-slate-50">
      <span className="text-[12px] font-bold text-slate-800">1</span>
    </div>
  </div>
);

// ─── Large Ribbon Button ──────────────────────────────────────────────────────
interface LargeRibbonButtonProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick?: () => void;
}

function LargeRibbonButton({ icon: Icon, label, onClick }: LargeRibbonButtonProps) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      className="flex flex-col items-center justify-between h-[54px] min-w-[50px] px-1.5 py-1 rounded hover:bg-slate-200/80 active:bg-slate-300/80 transition-colors cursor-pointer"
    >
      <div className="flex-1 flex items-center justify-center">
        <Icon size={24} />
      </div>
      <span className="text-[11px] text-slate-700 font-normal leading-none flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
        {label} <IconChevronDown size={8} className="shrink-0 text-slate-500" />
      </span>
    </button>
  );
}

// ─── Number Input with Spin Buttons ─────────────────────────────────────────
interface SpinInputProps {
  value: number;
  unit: string;
  onChange: (newVal: number) => void;
  allowNegative?: boolean;
}

function SpinInput({ value, unit, onChange, allowNegative = false }: SpinInputProps) {
  const [text, setText] = useState(`${value} ${unit}`);

  useEffect(() => {
    setText(`${value} ${unit}`);
  }, [value, unit]);

  const minLimit = allowNegative ? -100 : 0;

  const handleStep = (delta: number) => {
    const next = Math.round((value + delta) * 10) / 10;
    const clamped = Math.max(minLimit, next);
    onChange(clamped);
  };

  const handleBlur = () => {
    const match = text.match(/-?\d+(\.\d+)?/);
    if (match) {
      const num = parseFloat(match[0]);
      if (!isNaN(num)) {
        const clamped = Math.max(minLimit, num);
        onChange(clamped);
        return;
      }
    }
    setText(`${value} ${unit}`);
  };

  return (
    <div className="relative flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-blue-500 rounded h-[22px] w-[70px] px-1 shadow-sm transition-colors">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBlur();
          if (e.key === 'ArrowUp') { e.preventDefault(); handleStep(1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); handleStep(-1); }
        }}
        className="w-full text-[11px] text-slate-800 bg-transparent outline-none pr-3"
      />
      <div className="absolute right-[2px] top-0 bottom-0 flex flex-col justify-center gap-[1px]">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleStep(1); }}
          className="w-3.5 h-[9px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-t text-[7px] leading-none cursor-pointer border-b border-slate-200"
        >
          ▲
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleStep(-1); }}
          className="w-3.5 h-[9px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-b text-[7px] leading-none cursor-pointer"
        >
          ▼
        </button>
      </div>
    </div>
  );
}

// ─── Main Layout Ribbon ───────────────────────────────────────────────────────
export function LayoutRibbon() {
  const rs = useRibbonState();
  const currentFmt = rs.currentParaFmt || {};

  const [leftIndentCm, setLeftIndentCm] = useState<number>(Math.round(((currentFmt.leftIndent || 0) / 37.795) * 10) / 10);
  const [rightIndentCm, setRightIndentCm] = useState<number>(Math.round(((currentFmt.rightIndent || 0) / 37.795) * 10) / 10);
  const [spaceBefore, setSpaceBefore] = useState<number>(currentFmt.spaceBefore || 0);
  const [spaceAfter, setSpaceAfter] = useState<number>(currentFmt.spaceAfter !== undefined ? currentFmt.spaceAfter : 0);
  const [showCustomMarginsModal, setShowCustomMarginsModal] = useState(false);
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showLineNumberModal, setShowLineNumberModal] = useState(false);
  const [borderSubMenu, setBorderSubMenu] = useState<'main' | 'width' | 'style' | 'color' | 'applyTo'>('main');

  useEffect(() => {
    if (currentFmt.leftIndent !== undefined) setLeftIndentCm(Math.round((currentFmt.leftIndent / 37.795) * 10) / 10);
    if (currentFmt.rightIndent !== undefined) setRightIndentCm(Math.round((currentFmt.rightIndent / 37.795) * 10) / 10);
    if (currentFmt.spaceBefore !== undefined) setSpaceBefore(currentFmt.spaceBefore);
    if (currentFmt.spaceAfter !== undefined) setSpaceAfter(currentFmt.spaceAfter);
  }, [currentFmt.leftIndent, currentFmt.rightIndent, currentFmt.spaceBefore, currentFmt.spaceAfter]);

  const updateParaFmt = (updates: Record<string, any>) => {
    const legacy = EditorAPI.getLegacy() as any;
    if (legacy?.applyParaFmt) {
      legacy.applyParaFmt(updates);
    } else if (legacy?.setParaFmt) {
      legacy.setParaFmt(updates);
    }
  };

  const marginPresets = [
    {
      id: 'normal',
      title: 'Chuẩn',
      top: '2,54 cm', bottom: '2,54 cm', left: '2,54 cm', right: '2,54 cm',
      inset: { top: 6, bottom: 6, left: 6, right: 6 },
      onClick: () => LayoutEngine.SetMargins('normal'),
    },
    {
      id: 'narrow',
      title: 'Hẹp',
      top: '1,27 cm', bottom: '1,27 cm', left: '1,27 cm', right: '1,27 cm',
      inset: { top: 3, bottom: 3, left: 3, right: 3 },
      onClick: () => LayoutEngine.SetMargins('narrow'),
    },
    {
      id: 'moderate',
      title: 'Vừa phải',
      top: '2,54 cm', bottom: '2,54 cm', left: '1,905 cm', right: '1,905 cm',
      inset: { top: 6, bottom: 6, left: 4.5, right: 4.5 },
      onClick: () => LayoutEngine.SetMargins('moderate'),
    },
    {
      id: 'wide',
      title: 'Rộng',
      top: '2,54 cm', bottom: '2,54 cm', left: '5,08 cm', right: '5,08 cm',
      inset: { top: 6, bottom: 6, left: 10, right: 10 },
      onClick: () => LayoutEngine.SetMargins('wide'),
    },
    {
      id: 'office2003',
      title: 'Mặc định Office 2003',
      top: '2,54 cm', bottom: '2,54 cm', left: '3,175 cm', right: '3,175 cm',
      inset: { top: 6, bottom: 6, left: 7.5, right: 7.5 },
      onClick: () => LayoutEngine.SetMargins('office2003'),
    },
  ];

  const marginsDropdownContent = (
    <div className="w-[300px] p-1.5 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      {marginPresets.map((preset) => (
        <button
          key={preset.id}
          onClick={preset.onClick}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left group border border-transparent hover:border-slate-300 cursor-pointer"
        >
          {/* Mini Page Thumbnail */}
          <div className="w-[34px] h-[42px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs">
            <div
              className="absolute border border-[#0284c7]"
              style={{
                top: preset.inset.top,
                bottom: preset.inset.bottom,
                left: preset.inset.left,
                right: preset.inset.right,
              }}
            />
          </div>

          {/* Details matching Word VN screenshot */}
          <div className="flex flex-col text-[11px] text-slate-600 leading-tight">
            <span className="font-bold text-slate-800 text-[13px] mb-0.5">{preset.title}</span>
            <div className="grid grid-cols-2 gap-x-2">
              <span>Trên cùng: {preset.top}</span>
              <span>Dưới cùng: {preset.bottom}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              <span>Trái: {preset.left}</span>
              <span>Phải: {preset.right}</span>
            </div>
          </div>
        </button>
      ))}

      <div className="h-[1px] bg-slate-200 my-1" />

      {/* Lề tùy chỉnh */}
      <button
        onClick={() => setShowCustomMarginsModal(true)}
        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <div className="w-[34px] h-[42px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs">
          <div className="absolute inset-[6px] border border-[#0284c7]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0284c7] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
            ★
          </div>
        </div>
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Lề tùy chỉnh</span>
          <span className="text-slate-500">Xác định lề tùy chỉnh</span>
        </div>
      </button>
    </div>
  );

  const orientationDropdownContent = (
    <div className="w-[240px] p-1.5 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      <button
        onClick={() => LayoutEngine.SetOrientation('portrait')}
        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer mb-1"
      >
        {/* Portrait Page Thumbnail */}
        <div className="w-[28px] h-[36px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs flex items-center justify-center">
          <div className="w-[18px] h-[26px] border border-[#0284c7] border-dashed" />
        </div>
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang Dọc (Portrait)</span>
          <span className="text-slate-500">Định hướng trang chiều đứng</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.SetOrientation('landscape')}
        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        {/* Landscape Page Thumbnail */}
        <div className="w-[36px] h-[28px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs flex items-center justify-center">
          <div className="w-[26px] h-[18px] border border-[#0284c7] border-dashed" />
        </div>
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang Ngang (Landscape)</span>
          <span className="text-slate-500">Định hướng trang chiều ngang</span>
        </div>
      </button>
    </div>
  );

  const sizePresets = [
    {
      id: 'letter',
      label: 'Letter',
      dim: '21,59 cm x 27,94 cm',
      thumbStyle: { width: 26, height: 34 },
      onClick: () => LayoutEngine.SetPaperSize('letter'),
    },
    {
      id: 'legal',
      label: 'Pháp lý',
      dim: '21,59 cm x 35,56 cm',
      thumbStyle: { width: 24, height: 38 },
      onClick: () => LayoutEngine.SetPaperSize('legal'),
    },
    {
      id: 'executive',
      label: 'Executive',
      dim: '18,415 cm x 26,67 cm',
      thumbStyle: { width: 24, height: 32 },
      onClick: () => LayoutEngine.SetPaperSize('executive'),
    },
    {
      id: 'a4',
      label: 'A4',
      dim: '21,003 cm x 29,702 cm',
      thumbStyle: { width: 25, height: 35 },
      onClick: () => LayoutEngine.SetPaperSize('a4'),
    },
    {
      id: 'a5',
      label: 'A5',
      dim: '14,801 cm x 21,003 cm',
      thumbStyle: { width: 20, height: 28 },
      onClick: () => LayoutEngine.SetPaperSize('a5'),
    },
  ];

  const sizeDropdownContent = (
    <div className="w-[280px] p-1.5 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      {sizePresets.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left group border border-transparent hover:border-slate-300 cursor-pointer"
        >
          {/* Mini Page Thumbnail */}
          <div className="w-[34px] h-[42px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs flex items-center justify-center">
            <div
              className="border border-[#0284c7]"
              style={{ width: item.thumbStyle.width, height: item.thumbStyle.height }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="font-bold text-slate-800 text-[13px] mb-0.5">{item.label}</span>
            <span className="text-slate-500 text-[11px]">{item.dim}</span>
          </div>
        </button>
      ))}

      <div className="h-[1px] bg-slate-200 my-1" />

      {/* Kích thước trang tùy chỉnh */}
      <button
        onClick={() => setShowCustomSizeModal(true)}
        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <div className="w-[34px] h-[42px] border border-slate-600 bg-white relative rounded-[1px] shrink-0 shadow-xs flex items-center justify-center">
          <div className="w-[25px] h-[34px] border border-[#0284c7]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0284c7] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
            ★
          </div>
        </div>
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Kích thước trang tùy chỉnh</span>
          <span className="text-slate-500 text-[11px]">Xác định kích cỡ trang tùy chỉnh</span>
        </div>
      </button>
    </div>
  );
  const columnsDropdownContent = (
    <div className="w-[180px] p-1 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      {[
        { id: 'one', label: 'Một', Icon: IconColOne, onClick: () => LayoutEngine.SetColumns('one') },
        { id: 'two', label: 'Hai', Icon: IconColTwo, onClick: () => LayoutEngine.SetColumns('two') },
        { id: 'three', label: 'Ba', Icon: IconColThree, onClick: () => LayoutEngine.SetColumns('three') },
        { id: 'left', label: 'Trái', Icon: IconColLeft, onClick: () => LayoutEngine.SetColumns('left') },
        { id: 'right', label: 'Phải', Icon: IconColRight, onClick: () => LayoutEngine.SetColumns('right') },
      ].map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full flex items-center gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
        >
          <item.Icon />
          <span className="text-[13px] text-slate-800 font-medium">{item.label}</span>
        </button>
      ))}

      <div className="h-[1px] bg-slate-200 my-1" />

      <button
        onClick={() => setShowColumnsModal(true)}
        className="w-full flex items-center gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconColMore />
        <span className="text-[13px] text-slate-800 font-medium">Nhiều cột hơn</span>
      </button>
    </div>
  );

  const breaksDropdownContent = (
    <div className="w-[330px] max-h-[460px] overflow-y-auto p-1 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      {/* Group 1: Ngắt trang */}
      <div className="text-[12px] font-bold text-slate-900 px-2 py-1 flex items-center gap-1">
        <span>Ngắt trang</span>
      </div>
      
      <button
        onClick={() => LayoutEngine.InsertBreak('page')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakPage />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang</span>
          <span className="text-slate-500 text-[11px] leading-tight">Đánh dấu điểm mà tại đó một trang kết thúc và trang tiếp theo bắt đầu.</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.InsertBreak('column')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakCol />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Cột</span>
          <span className="text-slate-500 text-[11px] leading-tight">Cho biết văn bản theo sau ngắt cột sẽ bắt đầu ở cột tiếp theo.</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.InsertBreak('textwrap')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakTextWrap />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Ngắt dòng chữ</span>
          <span className="text-slate-500 text-[11px] leading-tight">Tách văn bản xung quanh các đối tượng trên trang web, chẳng hạn như văn bản chú thích khỏi văn bản chính.</span>
        </div>
      </button>

      <div className="h-[1px] bg-slate-200 my-1.5" />

      {/* Group 2: Ngắt phần */}
      <div className="text-[12px] font-bold text-slate-900 px-2 py-1 flex items-center gap-1">
        <span>Ngắt phần</span>
      </div>

      <button
        onClick={() => LayoutEngine.InsertBreak('sectionnext')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakNextPage />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang tiếp theo</span>
          <span className="text-slate-500 text-[11px] leading-tight">Chèn ngắt phần và bắt đầu phần mới trên trang tiếp theo.</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.InsertBreak('sectioncontinuous')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakContinuous />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Liên tục</span>
          <span className="text-slate-500 text-[11px] leading-tight">Chèn ngắt phần và bắt đầu phần mới trên cùng một trang.</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.InsertBreak('evenpage')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakEvenPage />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang chẵn</span>
          <span className="text-slate-500 text-[11px] leading-tight">Chèn ngắt phần và bắt đầu phần mới trên trang mang số chẵn tiếp theo.</span>
        </div>
      </button>

      <button
        onClick={() => LayoutEngine.InsertBreak('oddpage')}
        className="w-full flex items-start gap-3 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <IconBreakOddPage />
        <div className="flex flex-col text-[11px] leading-tight">
          <span className="font-bold text-slate-800 text-[13px] mb-0.5">Trang lẻ</span>
          <span className="text-slate-500 text-[11px] leading-tight">Chèn ngắt phần và bắt đầu phần mới trên trang mang số lẻ tiếp theo.</span>
        </div>
      </button>
    </div>
  );

  const currentSetup = (EditorAPI.getLegacy() as any)?.getPageSetup?.() || {};
  const activeLineMode = currentSetup.lineNumbers || 'none';

  const lineNumbersDropdownContent = (
    <div className="w-[240px] p-1 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans">
      {[
        { id: 'none', label: 'Không có', onClick: () => (EditorAPI.getLegacy() as any)?.setPageSetup?.({ lineNumbers: 'none' }) },
        { id: 'continuous', label: 'Liên tục', onClick: () => (EditorAPI.getLegacy() as any)?.setPageSetup?.({ lineNumbers: 'continuous' }) },
        { id: 'restart-page', label: 'Khởi động lại mỗi trang', onClick: () => (EditorAPI.getLegacy() as any)?.setPageSetup?.({ lineNumbers: 'restart-page' }) },
        { id: 'restart-section', label: 'Khởi động lại mỗi mục', onClick: () => (EditorAPI.getLegacy() as any)?.setPageSetup?.({ lineNumbers: 'restart-section' }) },
        { id: 'suppress-para', label: 'Chặn cho Đoạn văn hiện tại', onClick: () => (EditorAPI.getLegacy() as any)?.applyParaFmt?.({ suppressLineNumbers: true }) },
      ].map((item) => {
        const isChecked = activeLineMode === item.id;
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
          >
            <span className="w-4 text-slate-800 text-[13px] font-bold text-center">
              {isChecked ? '✓' : ''}
            </span>
            <span className="text-[13px] text-slate-800 font-medium">{item.label}</span>
          </button>
        );
      })}

      <div className="h-[1px] bg-slate-200 my-1" />

      <button
        onClick={() => setShowLineNumberModal(true)}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left border border-transparent hover:border-slate-300 cursor-pointer"
      >
        <span className="w-4" />
        <span className="text-[13px] text-slate-800 font-medium">Tùy chọn đánh số dòng...</span>
      </button>
    </div>
  );

  const currentBorder = currentSetup.pageBorder || {
    top: false, bottom: false, left: false, right: false,
    style: 'solid', width: 1, color: '#000000', applyTo: 'all'
  };

  const updatePageBorder = (patch: Partial<any>) => {
    const updated = {
      top: currentBorder.top ?? true,
      bottom: currentBorder.bottom ?? true,
      left: currentBorder.left ?? true,
      right: currentBorder.right ?? true,
      style: currentBorder.style || 'solid',
      width: currentBorder.width || 1,
      color: currentBorder.color || '#000000',
      applyTo: currentBorder.applyTo || 'all',
      ...patch,
    };
    (EditorAPI.getLegacy() as any)?.setPageSetup?.({ pageBorder: updated });
  };

  const pageBorderDropdownContent = (
    <div
      className="w-[260px] p-2 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans flex flex-col gap-1.5"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {borderSubMenu === 'main' && (
        <>
          {/* Title */}
          <span className="text-[13px] font-bold text-slate-800 px-1">Tùy chọn viền</span>

          {/* Quick Preset Icons Row (5 Mini Thumbnail Icons) */}
          <div className="flex items-center justify-between px-1 py-1">
            <button
              title="Khung (Tất cả các cạnh)"
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ top: true, bottom: true, left: true, right: true });
              }}
              className={`w-9 h-11 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                currentBorder.top && currentBorder.bottom && currentBorder.left && currentBorder.right
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-5 h-7 border-2 border-blue-600 bg-white" />
            </button>

            <button
              title="Viền dưới"
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ top: false, bottom: true, left: false, right: false });
              }}
              className={`w-9 h-11 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                !currentBorder.top && currentBorder.bottom && !currentBorder.left && !currentBorder.right
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-5 h-7 border-b-2 border-blue-600 bg-white relative" />
            </button>

            <button
              title="Viền trên"
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ top: true, bottom: false, left: false, right: false });
              }}
              className={`w-9 h-11 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                currentBorder.top && !currentBorder.bottom && !currentBorder.left && !currentBorder.right
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-5 h-7 border-t-2 border-blue-600 bg-white relative" />
            </button>

            <button
              title="Viền trái"
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ top: false, bottom: false, left: true, right: false });
              }}
              className={`w-9 h-11 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                !currentBorder.top && !currentBorder.bottom && currentBorder.left && !currentBorder.right
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-5 h-7 border-l-2 border-blue-600 bg-white relative" />
            </button>

            <button
              title="Viền phải"
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ top: false, bottom: false, left: false, right: true });
              }}
              className={`w-9 h-11 border rounded flex items-center justify-center transition-colors cursor-pointer ${
                !currentBorder.top && !currentBorder.bottom && !currentBorder.left && currentBorder.right
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="w-5 h-7 border-r-2 border-blue-600 bg-white relative" />
            </button>
          </div>

          <div className="h-[1px] bg-slate-200 my-0.5" />

          {/* 4 Interactive Submenu Items */}
          {/* 1. Độ dày */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('width');
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">≡</span>
              <span>Độ dày</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[12px]">{currentBorder.width || 1} pt</span>
              <span>›</span>
            </div>
          </button>

          {/* 2. Kiểu */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('style');
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">∷</span>
              <span>Kiểu</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[12px]">
                {currentBorder.style === 'dashed' ? 'Nét đứt' : currentBorder.style === 'dotted' ? 'Nét chấm' : currentBorder.style === 'double' ? 'Nét đôi' : 'Nét liền'}
              </span>
              <span>›</span>
            </div>
          </button>

          {/* 3. Màu sắc */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('color');
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">✎</span>
              <span>Màu sắc</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <div className="w-4 h-4 rounded border border-slate-400" style={{ backgroundColor: currentBorder.color || '#000000' }} />
              <span>›</span>
            </div>
          </button>

          {/* 4. Áp dụng cho */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('applyTo');
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-100 rounded text-[13px] text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px]">📄</span>
              <span>Áp dụng cho</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[12px]">
                {currentBorder.applyTo === 'firstPage' ? 'Trang đầu tiên' : currentBorder.applyTo === 'exceptFirstPage' ? 'Trừ trang đầu' : 'Toàn bộ tài liệu'}
              </span>
              <span>›</span>
            </div>
          </button>

          <div className="h-[1px] bg-slate-200 my-0.5" />

          {/* Clear Action */}
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              (EditorAPI.getLegacy() as any)?.setPageSetup?.({ pageBorder: undefined });
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-red-50 text-red-600 rounded transition-colors text-left border border-transparent hover:border-red-200 cursor-pointer"
          >
            <span className="text-[14px]">🗑</span>
            <span className="text-[13px] font-medium">Loại bỏ đường viền trang</span>
          </button>
        </>
      )}

      {/* Sub-menu 1: Độ dày */}
      {borderSubMenu === 'width' && (
        <div className="flex flex-col gap-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('main');
            }}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#2563eb] hover:underline px-1 py-1 cursor-pointer"
          >
            <span>‹</span> <span>Quay lại</span>
          </button>
          <span className="text-[12px] font-bold text-slate-700 px-1">Chọn độ dày viền:</span>
          {[0.5, 1, 1.5, 2.25, 3, 4.5, 6].map((w) => (
            <button
              key={w}
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ width: w });
                setBorderSubMenu('main');
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                (currentBorder.width || 1) === w ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-800'
              }`}
            >
              <span className="text-[12px]">{w} pt</span>
              <div
                className="w-24 bg-slate-800 rounded-xs"
                style={{ height: `${Math.max(1, w)}px` }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Sub-menu 2: Kiểu */}
      {borderSubMenu === 'style' && (
        <div className="flex flex-col gap-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('main');
            }}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#2563eb] hover:underline px-1 py-1 cursor-pointer"
          >
            <span>‹</span> <span>Quay lại</span>
          </button>
          <span className="text-[12px] font-bold text-slate-700 px-1">Chọn kiểu viền:</span>
          {[
            { id: 'solid', label: 'Nét liền', borderStyle: 'solid' },
            { id: 'dashed', label: 'Nét đứt', borderStyle: 'dashed' },
            { id: 'dotted', label: 'Nét chấm', borderStyle: 'dotted' },
            { id: 'double', label: 'Nét đôi', borderStyle: 'double' },
          ].map((item) => (
            <button
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ style: item.id as any });
                setBorderSubMenu('main');
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                (currentBorder.style || 'solid') === item.id ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-800'
              }`}
            >
              <span className="text-[12px]">{item.label}</span>
              <div
                className="w-24 border-b-2 border-slate-800"
                style={{ borderStyle: item.borderStyle }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Sub-menu 3: Màu sắc */}
      {borderSubMenu === 'color' && (
        <div className="flex flex-col gap-2 p-1" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('main');
            }}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#2563eb] hover:underline cursor-pointer"
          >
            <span>‹</span> <span>Quay lại</span>
          </button>
          <span className="text-[12px] font-bold text-slate-700">Chọn màu sắc viền:</span>

          {/* 20 Curated Color Swatches */}
          <div className="grid grid-cols-5 gap-1.5">
            {[
              '#000000', '#4b5563', '#9ca3af', '#e5e7eb', '#ffffff',
              '#dc2626', '#991b1b', '#ea580c', '#d97706', '#eab308',
              '#16a34a', '#14532d', '#06b6d4', '#0284c7', '#2563eb',
              '#1e3a8a', '#7c3aed', '#db2777', '#881337', '#78350f'
            ].map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  updatePageBorder({ color: c });
                  setBorderSubMenu('main');
                }}
                className={`w-7 h-7 rounded border border-slate-300 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs ${
                  currentBorder.color === c ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Custom Hex Code Input */}
          <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-200" onMouseDown={(e) => e.stopPropagation()}>
            <span className="text-[12px] text-slate-600 font-medium">Mã màu:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 focus-within:border-blue-500">
              <div
                className="w-4 h-4 rounded border border-slate-400 shrink-0"
                style={{ backgroundColor: currentBorder.color || '#000000' }}
              />
              <input
                type="text"
                value={currentBorder.color || '#000000'}
                onChange={(e) => updatePageBorder({ color: e.target.value })}
                className="w-20 text-[11px] text-slate-800 bg-transparent outline-none font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-menu 4: Áp dụng cho */}
      {borderSubMenu === 'applyTo' && (
        <div className="flex flex-col gap-1">
          <button
            onMouseDown={(e) => {
              e.preventDefault(); e.stopPropagation();
              setBorderSubMenu('main');
            }}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#2563eb] hover:underline px-1 py-1 cursor-pointer"
          >
            <span>‹</span> <span>Quay lại</span>
          </button>
          <span className="text-[12px] font-bold text-slate-700 px-1">Áp dụng đường viền cho:</span>
          {[
            { id: 'all', label: 'Toàn bộ tài liệu' },
            { id: 'firstPage', label: 'Chỉ trang đầu tiên' },
            { id: 'exceptFirstPage', label: 'Tất cả trừ trang đầu' },
          ].map((item) => (
            <button
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                updatePageBorder({ applyTo: item.id as any });
                setBorderSubMenu('main');
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer ${
                (currentBorder.applyTo || 'all') === item.id ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-800'
              }`}
            >
              <span className="text-[12px]">{item.label}</span>
              {(currentBorder.applyTo || 'all') === item.id && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const themeColorColumns = [
    ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'],
    ['#000000', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'],
    ['#e2e8f0', '#f3f4f6', '#e5e7eb', '#cbd5e1', '#9ca3af', '#6b7280'],
    ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'],
    ['#0284c7', '#e0f2fe', '#bae6fd', '#38bdf8', '#0284c7', '#0369a1'],
    ['#ea580c', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#c2410c'],
    ['#15803d', '#dcfce7', '#bbf7d0', '#86efac', '#22c55e', '#166534'],
    ['#0369a1', '#e0f2fe', '#7dd3fc', '#0284c7', '#0369a1', '#075985'],
    ['#7e22ce', '#f3e8ff', '#e9d5ff', '#c084fc', '#a855f7', '#6b21a8'],
    ['#65a30d', '#ecfccb', '#d9f99d', '#a3e635', '#65a30d', '#3f6212'],
  ];

  const standardColors = [
    '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050',
    '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
  ];

  const setPageColor = (color?: string) => {
    (EditorAPI.getLegacy() as any)?.setPageSetup?.({ pageColor: color });
  };

  const pageColorDropdownContent = (
    <div
      className="w-[250px] p-2 bg-white rounded-md shadow-2xl border border-slate-200 text-slate-800 font-sans flex flex-col gap-2"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className="text-[13px] font-bold text-slate-800 px-1">Màu trang</span>

      {/* Main Theme Color Grid (10 Columns x 6 Rows) */}
      <div className="flex flex-col gap-1 px-1">
        {/* Row 0: Top Primary Theme Colors */}
        <div className="grid grid-cols-10 gap-1">
          {themeColorColumns.map((col, cIdx) => (
            <button
              key={`top-${cIdx}`}
              title={col[0]}
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                setPageColor(col[0] === '#ffffff' ? undefined : col[0]);
              }}
              className="w-5 h-5 border border-slate-300 rounded-xs hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: col[0] }}
            />
          ))}
        </div>

        {/* Rows 1-5: Tints / Shades */}
        <div className="grid grid-cols-10 gap-1 pt-1">
          {[1, 2, 3, 4, 5].map((rowIdx) =>
            themeColorColumns.map((col, cIdx) => (
              <button
                key={`shade-${rowIdx}-${cIdx}`}
                title={col[rowIdx]}
                onMouseDown={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  setPageColor(col[rowIdx]);
                }}
                className="w-5 h-5 border border-slate-200 rounded-xs hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: col[rowIdx] }}
              />
            ))
          )}
        </div>
      </div>

      <div className="h-[1px] bg-slate-200 my-0.5" />

      {/* Standard Colors Section */}
      <div className="flex flex-col gap-1.5 px-1">
        <span className="text-[12px] font-semibold text-slate-700">Màu Chuẩn</span>
        <div className="grid grid-cols-10 gap-1">
          {standardColors.map((c) => (
            <button
              key={c}
              title={c}
              onMouseDown={(e) => {
                e.preventDefault(); e.stopPropagation();
                setPageColor(c);
              }}
              className="w-5 h-5 rounded-xs border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-slate-200 my-0.5" />

      {/* Option 1: Không màu */}
      <button
        onMouseDown={(e) => {
          e.preventDefault(); e.stopPropagation();
          setPageColor(undefined);
        }}
        className="w-full flex items-center gap-2.5 px-2 py-1.5 hover:bg-slate-100 rounded transition-colors text-left cursor-pointer"
      >
        <div className="w-4 h-4 border border-slate-300 rounded bg-white flex items-center justify-center text-[10px] text-slate-400">
          ✕
        </div>
        <span className="text-[13px] text-slate-800 font-medium">Không màu</span>
      </button>

      {/* Option 2: Thêm màu */}
      <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 rounded transition-colors" onMouseDown={(e) => e.stopPropagation()}>
        <span className="text-[14px]">🎨</span>
        <span className="text-[13px] text-slate-800 font-medium shrink-0">Thêm màu:</span>
        <input
          type="text"
          value={currentSetup.pageColor || '#ffffff'}
          onChange={(e) => setPageColor(e.target.value)}
          className="w-20 px-1 py-0.5 text-[11px] font-mono bg-slate-50 border border-slate-300 rounded outline-none focus:border-blue-500"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Thiết lập Trang (Page Setup) */}
      <RGroup label="Thiết lập Trang">
        <div className="flex items-center gap-1">
          {/* Lề */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconMargins} label="Lề" />}
          >
            {marginsDropdownContent}
          </Dropdown>

          {/* Hướng */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconOrientation} label="Hướng" />}
          >
            {orientationDropdownContent}
          </Dropdown>

          {/* Kích cỡ */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconSize} label="Kích cỡ" />}
          >
            {sizeDropdownContent}
          </Dropdown>

          {/* Cột */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconColumns} label="Cột" />}
          >
            {columnsDropdownContent}
          </Dropdown>

          {/* Nghỉ giải lao / Ngắt trang */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconBreaks} label="Nghỉ giải lao" />}
          >
            {breaksDropdownContent}
          </Dropdown>

          {/* Số dòng */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconLineNumbers} label="Số dòng" />}
          >
            {lineNumbersDropdownContent}
          </Dropdown>
        </div>
      </RGroup>

      {/* 2. Đoạn văn (Paragraph) */}
      <RGroup label="Đoạn văn">
        <div className="relative flex flex-col justify-between h-[54px] px-1 font-sans">
          {/* Top headers */}
          <div className="flex items-center text-[11px] font-normal text-slate-700 mb-0.5">
            <span className="w-[120px]">Thụt lề</span>
            <span className="w-[120px]">Khoảng cách</span>
          </div>

          {/* Form Rows */}
          <div className="flex gap-4 items-center">
            {/* Left: Thụt lề (Trái & Phải) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <IconIndentLeft />
                <span className="w-[32px] text-slate-600">Trái:</span>
                <SpinInput
                  value={leftIndentCm}
                  unit="cm"
                  allowNegative={true}
                  onChange={(val) => {
                    setLeftIndentCm(val);
                    updateParaFmt({ leftIndent: Math.round(val * 37.795) });
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <IconIndentRight />
                <span className="w-[32px] text-slate-600">Phải:</span>
                <SpinInput
                  value={rightIndentCm}
                  unit="cm"
                  allowNegative={true}
                  onChange={(val) => {
                    setRightIndentCm(val);
                    updateParaFmt({ rightIndent: Math.round(val * 37.795) });
                  }}
                />
              </div>
            </div>

            {/* Right: Khoảng cách (Trước & Sau) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <IconSpacingBefore />
                <span className="w-[36px] text-slate-600">Trước:</span>
                <SpinInput
                  value={spaceBefore}
                  unit="pt"
                  allowNegative={true}
                  onChange={(val) => {
                    setSpaceBefore(val);
                    updateParaFmt({ spaceBefore: val });
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <IconSpacingAfter />
                <span className="w-[36px] text-slate-600">Sau:</span>
                <SpinInput
                  value={spaceAfter}
                  unit="pt"
                  allowNegative={true}
                  onChange={(val) => {
                    setSpaceAfter(val);
                    updateParaFmt({ spaceAfter: val });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Small Dialog Launcher at bottom right of Paragraph group */}
          <button
            title="Thiết lập Đoạn văn..."
            onMouseDown={(e) => {
              e.preventDefault();
              CommandDispatcher.dispatch('WORD.HOME.PARAGRAPH.DIALOG');
            }}
            className="absolute right-0 bottom-[-18px] p-0.5 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            <IconDialogLauncher />
          </button>
        </div>
      </RGroup>

      {/* 3. Nền Trang (Page Background) */}
      <RGroup label="Nền Trang">
        <div className="flex items-center gap-1">
          {/* Đường viền trang */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconPageBorders} label="Đường viền trang" />}
          >
            {pageBorderDropdownContent}
          </Dropdown>

          {/* Màu trang */}
          <Dropdown
            trigger={<LargeRibbonButton icon={IconPageColor} label="Màu trang" />}
          >
            {pageColorDropdownContent}
          </Dropdown>
        </div>
      </RGroup>

      {/* Modal Lề tùy chỉnh */}
      <CustomMarginsModal
        isOpen={showCustomMarginsModal}
        onClose={() => setShowCustomMarginsModal(false)}
      />

      {/* Modal Kích thước trang tùy chỉnh */}
      <CustomPageSizeModal
        isOpen={showCustomSizeModal}
        onClose={() => setShowCustomSizeModal(false)}
      />

      {/* Modal Nhiều cột hơn */}
      <ColumnsModal
        isOpen={showColumnsModal}
        onClose={() => setShowColumnsModal(false)}
      />

      {/* Modal Tùy chọn đánh số dòng */}
      <LineNumberModal
        isOpen={showLineNumberModal}
        onClose={() => setShowLineNumberModal(false)}
        currentMode={activeLineMode}
      />
    </>
  );
}
