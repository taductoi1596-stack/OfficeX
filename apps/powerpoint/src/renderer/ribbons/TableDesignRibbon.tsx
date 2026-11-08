import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { 
  IconTable, 
  IconChevronDown, 
  IconTrash, 
  IconCheck 
} from '@officex/icons';
import { Shape } from '@officex/presentation-core';

export interface TableStylePreset {
  id: string;
  name: string;
  category: 'plain' | 'light' | 'medium' | 'dark';
  variant: number;
  colorGroupId: string;
  colorGroupName: string;
  headerBg: string;
  headerText: string;
  evenBg: string;
  oddBg: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  hasOuterBorder?: boolean;
  hasInnerGrid?: boolean;
}

// 7 Standard Theme Color Columns (plus additional accent tones)
const THEME_COLORS = [
  { id: 'slate', name: 'Màu chủ đề 1 (Đen / Ghi)', primary: '#1e293b', secondary: '#334155', light: '#f8fafc', accent: '#f1f5f9', border: '#cbd5e1' },
  { id: 'navy', name: 'Màu chủ đề 2 (Xanh biển)', primary: '#1e3a8a', secondary: '#2563eb', light: '#eff6ff', accent: '#dbeafe', border: '#93c5fd' },
  { id: 'orange', name: 'Màu chủ đề 3 (Cam)', primary: '#c2410c', secondary: '#ea580c', light: '#fff7ed', accent: '#ffedd5', border: '#fdba74' },
  { id: 'green', name: 'Màu chủ đề 4 (Xanh lá)', primary: '#14532d', secondary: '#16a34a', light: '#f0fdf4', accent: '#dcfce7', border: '#86efac' },
  { id: 'cyan', name: 'Màu chủ đề 5 (Xanh lơ)', primary: '#0c4a6e', secondary: '#0284c7', light: '#f0f9ff', accent: '#e0f2fe', border: '#7dd3fc' },
  { id: 'purple', name: 'Màu chủ đề 6 (Tím)', primary: '#581c87', secondary: '#9333ea', light: '#faf5ff', accent: '#f3e8ff', border: '#d8b4fe' },
  { id: 'lime', name: 'Màu chủ đề 7 (Xanh lục)', primary: '#365314', secondary: '#65a30d', light: '#f7fee7', accent: '#ecfccb', border: '#bef264' },
];

export const TABLE_STYLE_PRESETS: TableStylePreset[] = [
  // ── 1. Plain Tables (Tối giản) ──────────────────────────────────
  { id: 'plain-1', name: 'Bảng Đơn giản 1 (Lưới viền đầy đủ)', category: 'plain', variant: 1, colorGroupId: 'slate', colorGroupName: 'Đen / Ghi', headerBg: 'transparent', headerText: '#0f172a', evenBg: 'transparent', oddBg: 'transparent', borderColor: '#0f172a', borderWidth: 1, textColor: '#0f172a', hasInnerGrid: true },
  { id: 'plain-2', name: 'Bảng Đơn giản 2 (Không đường viền)', category: 'plain', variant: 2, colorGroupId: 'slate', colorGroupName: 'Đen / Ghi', headerBg: 'transparent', headerText: '#0f172a', evenBg: 'transparent', oddBg: 'transparent', borderColor: 'transparent', borderWidth: 0, textColor: '#0f172a', hasInnerGrid: false },
  { id: 'plain-3', name: 'Bảng Đơn giản 3 (Chỉ viền trên & dưới)', category: 'plain', variant: 3, colorGroupId: 'slate', colorGroupName: 'Đen / Ghi', headerBg: 'transparent', headerText: '#0f172a', evenBg: 'transparent', oddBg: 'transparent', borderColor: '#475569', borderWidth: 1, textColor: '#0f172a', hasInnerGrid: false },
  { id: 'plain-4', name: 'Bảng Đơn giản 4 (Hàng xen kẽ nhạt)', category: 'plain', variant: 4, colorGroupId: 'slate', colorGroupName: 'Đen / Ghi', headerBg: '#f1f5f9', headerText: '#0f172a', evenBg: '#ffffff', oddBg: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, textColor: '#0f172a', hasInnerGrid: true },
  { id: 'plain-5', name: 'Bảng Đơn giản 5 (Đường kẻ ngang xám)', category: 'plain', variant: 5, colorGroupId: 'slate', colorGroupName: 'Đen / Ghi', headerBg: '#e2e8f0', headerText: '#0f172a', evenBg: '#ffffff', oddBg: '#ffffff', borderColor: '#94a3b8', borderWidth: 1, textColor: '#0f172a', hasInnerGrid: false },

  // ── 2. Light Styles (Nhạt) - 4 Variants x 7 Colors = 28 Presets ──
  // Variant 1: Viền màu nhạt, nền trắng
  ...THEME_COLORS.map(c => ({
    id: `light-1-${c.id}`,
    name: `Kiểu Sáng 1 - ${c.name}`,
    category: 'light' as const,
    variant: 1,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: '#ffffff',
    headerText: c.secondary,
    evenBg: '#ffffff',
    oddBg: '#ffffff',
    borderColor: c.border,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 2: Header nhạt, thân kẻ sọc màu
  ...THEME_COLORS.map(c => ({
    id: `light-2-${c.id}`,
    name: `Kiểu Sáng 2 - ${c.name}`,
    category: 'light' as const,
    variant: 2,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.light,
    headerText: c.primary,
    evenBg: '#ffffff',
    oddBg: c.light,
    borderColor: c.border,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 3: Header màu nhẹ, thân xen kẽ dịu mát
  ...THEME_COLORS.map(c => ({
    id: `light-3-${c.id}`,
    name: `Kiểu Sáng 3 - ${c.name}`,
    category: 'light' as const,
    variant: 3,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.accent,
    headerText: c.primary,
    evenBg: '#ffffff',
    oddBg: c.light,
    borderColor: c.secondary,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 4: Header màu viền kép, nền xen kẽ nhẹ
  ...THEME_COLORS.map(c => ({
    id: `light-4-${c.id}`,
    name: `Kiểu Sáng 4 - ${c.name}`,
    category: 'light' as const,
    variant: 4,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.light,
    headerText: c.primary,
    evenBg: '#ffffff',
    oddBg: '#ffffff',
    borderColor: c.secondary,
    borderWidth: 1.5,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),

  // ── 3. Medium Styles (Trung bình) - 4 Variants x 7 Colors = 28 Presets ──
  // Variant 1: Header màu đậm chuẩn, thân xen kẽ
  ...THEME_COLORS.map(c => ({
    id: `medium-1-${c.id}`,
    name: `Kiểu Trung bình 1 - ${c.name}`,
    category: 'medium' as const,
    variant: 1,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.primary,
    headerText: '#ffffff',
    evenBg: '#ffffff',
    oddBg: c.light,
    borderColor: c.border,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 2: Header màu đậm + viền đậm đồng bộ
  ...THEME_COLORS.map(c => ({
    id: `medium-2-${c.id}`,
    name: `Kiểu Trung bình 2 - ${c.name}`,
    category: 'medium' as const,
    variant: 2,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.secondary,
    headerText: '#ffffff',
    evenBg: '#ffffff',
    oddBg: c.light,
    borderColor: c.secondary,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 3: Header màu phụ, dải xen kẽ đậm hơn
  ...THEME_COLORS.map(c => ({
    id: `medium-3-${c.id}`,
    name: `Kiểu Trung bình 3 - ${c.name}`,
    category: 'medium' as const,
    variant: 3,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.primary,
    headerText: '#ffffff',
    evenBg: '#ffffff',
    oddBg: c.accent,
    borderColor: c.primary,
    borderWidth: 1,
    textColor: '#1e293b',
    hasInnerGrid: true,
  })),
  // Variant 4: Header màu đậm + viền ngang dày
  ...THEME_COLORS.map(c => ({
    id: `medium-4-${c.id}`,
    name: `Kiểu Trung bình 4 - ${c.name}`,
    category: 'medium' as const,
    variant: 4,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.secondary,
    headerText: '#ffffff',
    evenBg: '#ffffff',
    oddBg: '#ffffff',
    borderColor: c.primary,
    borderWidth: 1.5,
    textColor: '#1e293b',
    hasInnerGrid: false,
  })),

  // ── 4. Dark Styles (Đậm) - 3 Variants x 7 Colors = 21 Presets ────
  // Variant 1: Header màu chủ đề, thân nền tối xám than
  ...THEME_COLORS.map(c => ({
    id: `dark-1-${c.id}`,
    name: `Kiểu Đậm 1 - ${c.name}`,
    category: 'dark' as const,
    variant: 1,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.primary,
    headerText: '#ffffff',
    evenBg: '#1e293b',
    oddBg: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    textColor: '#f8fafc',
    hasInnerGrid: true,
  })),
  // Variant 2: Header màu sáng rực, thân nền tối toàn bộ
  ...THEME_COLORS.map(c => ({
    id: `dark-2-${c.id}`,
    name: `Kiểu Đậm 2 - ${c.name}`,
    category: 'dark' as const,
    variant: 2,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.secondary,
    headerText: '#ffffff',
    evenBg: '#0f172a',
    oddBg: '#1e293b',
    borderColor: c.secondary,
    borderWidth: 1,
    textColor: '#ffffff',
    hasInnerGrid: true,
  })),
  // Variant 3: Toàn bộ bảng màu chủ đề tương phản cao
  ...THEME_COLORS.map(c => ({
    id: `dark-3-${c.id}`,
    name: `Kiểu Đậm 3 - ${c.name}`,
    category: 'dark' as const,
    variant: 3,
    colorGroupId: c.id,
    colorGroupName: c.name,
    headerBg: c.primary,
    headerText: '#ffffff',
    evenBg: c.primary,
    oddBg: c.secondary,
    borderColor: '#ffffff',
    borderWidth: 1,
    textColor: '#ffffff',
    hasInnerGrid: true,
  })),
];

interface TableDesignRibbonProps {
  selectedTable: Shape | null;
  onApplyTableStyle: (style: TableStylePreset) => void;
  onDeleteTable: () => void;
  onUpdateTableOptions: (options: {
    hasHeaderRow?: boolean;
    hasTotalRow?: boolean;
    hasBandedRows?: boolean;
    hasFirstCol?: boolean;
    hasLastCol?: boolean;
    hasBandedCols?: boolean;
  }) => void;
  tableOptions: {
    hasHeaderRow: boolean;
    hasTotalRow: boolean;
    hasBandedRows: boolean;
    hasFirstCol: boolean;
    hasLastCol: boolean;
    hasBandedCols: boolean;
  };
  onSetCellPadding: (padding: 'none' | 'narrow' | 'normal' | 'wide') => void;
}

// Mini realistic table preview card matching Microsoft PowerPoint
const TableThumbnail: React.FC<{ preset: TableStylePreset; onClick: () => void; isSelected?: boolean }> = ({
  preset,
  onClick,
  isSelected,
}) => {
  const isDark = preset.category === 'dark';
  return (
    <button
      className={`h-11 w-full rounded border overflow-hidden flex flex-col transition-all hover:scale-105 shadow-xs relative group ${isSelected ? 'ring-2 ring-orange-500 border-orange-500 scale-105' : 'border-slate-300 dark:border-slate-700 hover:border-orange-500'}`}
      style={{ backgroundColor: preset.evenBg || '#ffffff' }}
      onClick={onClick}
      title={preset.name}
    >
      {/* Header bar with 5 mini columns */}
      <div 
        className="h-3 w-full flex items-center justify-around px-0.5 border-b"
        style={{ 
          backgroundColor: preset.headerBg || (isDark ? '#0f172a' : '#f1f5f9'),
          borderColor: preset.borderColor || '#cbd5e1'
        }}
      >
        <div className="w-1.5 h-0.5 rounded-xs" style={{ backgroundColor: preset.headerText || '#ffffff' }} />
        <div className="w-1.5 h-0.5 rounded-xs" style={{ backgroundColor: preset.headerText || '#ffffff' }} />
        <div className="w-1.5 h-0.5 rounded-xs" style={{ backgroundColor: preset.headerText || '#ffffff' }} />
        <div className="w-1.5 h-0.5 rounded-xs" style={{ backgroundColor: preset.headerText || '#ffffff' }} />
        <div className="w-1.5 h-0.5 rounded-xs" style={{ backgroundColor: preset.headerText || '#ffffff' }} />
      </div>

      {/* Row 1 */}
      <div 
        className="flex-1 w-full flex items-center justify-around px-0.5 border-b"
        style={{ 
          backgroundColor: preset.oddBg || (isDark ? '#1e293b' : '#ffffff'),
          borderColor: preset.borderColor || '#e2e8f0'
        }}
      >
        <div className="w-1.5 h-0.5 rounded-xs opacity-60" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-60" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-60" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-60" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-60" style={{ backgroundColor: preset.textColor || '#64748b' }} />
      </div>

      {/* Row 2 */}
      <div 
        className="flex-1 w-full flex items-center justify-around px-0.5"
        style={{ 
          backgroundColor: preset.evenBg || (isDark ? '#0f172a' : '#f8fafc')
        }}
      >
        <div className="w-1.5 h-0.5 rounded-xs opacity-40" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-40" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-40" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-40" style={{ backgroundColor: preset.textColor || '#64748b' }} />
        <div className="w-1.5 h-0.5 rounded-xs opacity-40" style={{ backgroundColor: preset.textColor || '#64748b' }} />
      </div>
    </button>
  );
};

export const TableDesignRibbon: React.FC<TableDesignRibbonProps> = ({
  selectedTable,
  onApplyTableStyle,
  onDeleteTable,
  onUpdateTableOptions,
  tableOptions,
  onSetCellPadding,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [showMarginMenu, setShowMarginMenu] = useState(false);
  const [showStyleOptionsMenu, setShowStyleOptionsMenu] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const marginRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (galleryRef.current && !galleryRef.current.contains(e.target as Node)) setShowGallery(false);
      if (marginRef.current && !marginRef.current.contains(e.target as Node)) setShowMarginMenu(false);
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) setShowStyleOptionsMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const previewStrip = TABLE_STYLE_PRESETS.filter(s => s.id === 'plain-1' || s.id === 'medium-1-navy' || s.id === 'medium-1-orange' || s.id === 'medium-1-green' || s.id === 'medium-1-cyan' || s.id === 'medium-1-purple').slice(0, 6);

  const activePresetId = (selectedTable as any)?.tableStylePreset?.id;

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      {/* ── 1. Table Style Options (Tùy chọn Kiểu Bảng) ─────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={optionsRef}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasHeaderRow}
              onChange={(e) => onUpdateTableOptions({ hasHeaderRow: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Hàng đầu (Header)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasFirstCol}
              onChange={(e) => onUpdateTableOptions({ hasFirstCol: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Cột đầu</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasTotalRow}
              onChange={(e) => onUpdateTableOptions({ hasTotalRow: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Hàng tổng (Total)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasLastCol}
              onChange={(e) => onUpdateTableOptions({ hasLastCol: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Cột cuối</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasBandedRows}
              onChange={(e) => onUpdateTableOptions({ hasBandedRows: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Hàng xen kẽ</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={tableOptions.hasBandedCols}
              onChange={(e) => onUpdateTableOptions({ hasBandedCols: e.target.checked })}
              className="accent-orange-600 rounded"
            />
            <span>Cột xen kẽ</span>
          </label>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Tùy chọn Kiểu Bảng
        </span>
      </div>

      {/* ── 2. Table Styles Gallery Strip & Dropdown ───────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={galleryRef}>
        <div className="flex items-center gap-1.5">
          {/* Quick Preview Strip */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-border">
            {previewStrip.map((preset) => (
              <div key={preset.id} className="w-12">
                <TableThumbnail
                  preset={preset}
                  isSelected={activePresetId === preset.id}
                  onClick={() => onApplyTableStyle(preset)}
                />
              </div>
            ))}
          </div>

          {/* Expand Full Table Styles Gallery Dropdown Button */}
          <button
            className={`h-14 px-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${showGallery ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => setShowGallery(!showGallery)}
            title="Mở thư viện đầy đủ 80+ Kiểu Bảng (Table Styles Gallery)"
          >
            <div className="flex flex-col gap-0.5 items-center">
              <div className="w-4 h-2.5 border border-current rounded-xs flex flex-col justify-between p-0.5">
                <div className="w-full h-0.5 bg-current rounded-xs" />
              </div>
              <IconChevronDown size={10} className={showGallery ? 'text-white' : 'text-muted-foreground'} />
            </div>
            <span className="text-[9px] font-bold">Thêm</span>
          </button>
        </div>

        {/* ── Table Styles Gallery Full Dropdown Modal (Matching Real PowerPoint) ── */}
        {showGallery && (
          <div className="absolute left-0 top-full mt-1 z-[999] w-[560px] max-h-[560px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col animate-in fade-in duration-150">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTable size={16} className="text-orange-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  THƯ VIỆN KIỂU BẢNG (TABLE STYLES)
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-semibold">7 Màu chủ đề x Nhiều biến thể</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 max-h-[460px]">
              {/* Category 1: Nhạt (Light Styles) - 4 Rows */}
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center justify-between border-b pb-1">
                  <span>Nhạt (Light Styles)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">28 kiểu sáng</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4].map(v => (
                    <div key={v} className="grid grid-cols-7 gap-2">
                      {THEME_COLORS.map(c => {
                        const preset = TABLE_STYLE_PRESETS.find(p => p.category === 'light' && p.variant === v && p.colorGroupId === c.id)!;
                        return (
                          <TableThumbnail
                            key={preset.id}
                            preset={preset}
                            isSelected={activePresetId === preset.id}
                            onClick={() => {
                              onApplyTableStyle(preset);
                              setShowGallery(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Trung bình (Medium Styles) - 4 Rows */}
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center justify-between border-b pb-1">
                  <span>Trung bình (Medium Styles)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">28 kiểu tiêu chuẩn</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4].map(v => (
                    <div key={v} className="grid grid-cols-7 gap-2">
                      {THEME_COLORS.map(c => {
                        const preset = TABLE_STYLE_PRESETS.find(p => p.category === 'medium' && p.variant === v && p.colorGroupId === c.id)!;
                        return (
                          <TableThumbnail
                            key={preset.id}
                            preset={preset}
                            isSelected={activePresetId === preset.id}
                            onClick={() => {
                              onApplyTableStyle(preset);
                              setShowGallery(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Đậm (Dark Styles) - 3 Rows */}
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center justify-between border-b pb-1">
                  <span>Đậm (Dark Styles)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">21 kiểu sang trọng</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map(v => (
                    <div key={v} className="grid grid-cols-7 gap-2">
                      {THEME_COLORS.map(c => {
                        const preset = TABLE_STYLE_PRESETS.find(p => p.category === 'dark' && p.variant === v && p.colorGroupId === c.id)!;
                        return (
                          <TableThumbnail
                            key={preset.id}
                            preset={preset}
                            isSelected={activePresetId === preset.id}
                            onClick={() => {
                              onApplyTableStyle(preset);
                              setShowGallery(false);
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 4: Tối giản / Không màu (Plain) */}
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 border-b pb-1">
                  Không màu / Tối giản (Plain)
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {TABLE_STYLE_PRESETS.filter(p => p.category === 'plain').map(preset => (
                    <TableThumbnail
                      key={preset.id}
                      preset={preset}
                      isSelected={activePresetId === preset.id}
                      onClick={() => {
                        onApplyTableStyle(preset);
                        setShowGallery(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer: Clear Table / Delete Table */}
            <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 transition-colors"
                onClick={() => {
                  onDeleteTable();
                  setShowGallery(false);
                }}
              >
                <IconTrash size={13} />
                <span>Xóa Bảng</span>
              </button>

              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted text-slate-700 dark:text-slate-300 transition-colors"
                onClick={() => setShowGallery(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Kiểu Bảng
        </span>
      </div>

      {/* ── 3. Cell Margins & Layout (Lề của Ô) ─────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={marginRef}>
        <button
          className={`h-14 px-3 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showMarginMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
          onClick={() => setShowMarginMenu(!showMarginMenu)}
          title="Thiết lập khoảng cách lề bên trong ô"
        >
          <div className="w-5 h-5 border border-dashed border-current rounded flex items-center justify-center text-[10px] font-bold">
            ▢
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-semibold leading-none">Lề của Ô</span>
            <IconChevronDown size={8} className={showMarginMenu ? 'text-white' : 'text-muted-foreground'} />
          </div>
        </button>

        {showMarginMenu && (
          <div className="absolute left-0 top-full mt-1 z-[999] w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 animate-in fade-in duration-100">
            <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
              KHOẢNG CÁCH LỀ Ô
            </div>
            <button
              className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
              onClick={() => { onSetCellPadding('normal'); setShowMarginMenu(false); }}
            >
              Bình thường (6px)
            </button>
            <button
              className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
              onClick={() => { onSetCellPadding('narrow'); setShowMarginMenu(false); }}
            >
              Hẹp (2px)
            </button>
            <button
              className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
              onClick={() => { onSetCellPadding('wide'); setShowMarginMenu(false); }}
            >
              Rộng (12px)
            </button>
            <button
              className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
              onClick={() => { onSetCellPadding('none'); setShowMarginMenu(false); }}
            >
              Không lề (0px)
            </button>
          </div>
        )}

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Lề Ô
        </span>
      </div>

      {/* ── 4. Delete Table Action ─────────────────────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <button
          className="h-14 px-3 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-800 rounded flex flex-col items-center justify-center gap-1 transition-all"
          onClick={onDeleteTable}
          title="Xóa bảng này khỏi slide"
        >
          <IconTrash size={18} />
          <span className="text-[10px] font-semibold leading-none">Xóa Bảng</span>
        </button>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Xóa
        </span>
      </div>
    </div>
  );
};
