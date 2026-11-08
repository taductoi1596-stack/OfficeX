import React, { useState, useRef, useEffect } from 'react';
import { Button, ColorPicker } from '@officex/ui';
import { 
  IconChevronDown, 
  IconSelectionPane,
  IconSearch 
} from '@officex/icons';
import { ShapeType, ShapeFormat } from '@officex/presentation-core';

interface DrawingGroupProps {
  onAddShape: (type: ShapeType) => void;
  currentFormat: ShapeFormat;
  onFormatChange: (format: Partial<ShapeFormat>) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  hasSelection: boolean;
}

export interface ShapeItem {
  type: ShapeType;
  label: string;
  icon: React.ReactNode;
}

export interface ShapeSection {
  title: string;
  items: ShapeItem[];
}

export const ALL_SHAPE_SECTIONS: ShapeSection[] = [
  {
    title: 'Hình thường dùng',
    items: [
      { type: 'text', label: 'Hộp văn bản', icon: <span className="text-xs font-bold border border-dashed border-current px-1.5 py-0.5 rounded">A</span> },
      { type: 'rectangle', label: 'Hình chữ nhật', icon: <div className="w-5 h-4 border-2 border-current"></div> },
      { type: 'rounded-rect', label: 'Chữ nhật bo góc', icon: <div className="w-5 h-4 border-2 border-current rounded-sm"></div> },
      { type: 'circle', label: 'Hình tròn / Elip', icon: <div className="w-5 h-5 border-2 border-current rounded-full"></div> },
      { type: 'callout-rect', label: 'Chú thích chữ nhật', icon: <div className="w-5 h-4 border-2 border-current relative"><div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current absolute -bottom-1 left-1 bg-inherit"></div></div> },
      { type: 'star-5', label: 'Ngôi sao 5 cánh', icon: <span className="text-base">★</span> },
      { type: 'triangle', label: 'Tam giác cân', icon: <span className="text-base">▲</span> },
      { type: 'cylinder', label: 'Hình trụ', icon: <div className="w-4 h-5 border-2 border-current rounded-[4px/2px]"></div> },
      { type: 'cube', label: 'Hình lập phương', icon: <span className="text-base">⚂</span> },
      { type: 'line', label: 'Đường thẳng', icon: <div className="w-5 h-0.5 bg-current -rotate-45"></div> },
      { type: 'arrow-line', label: 'Mũi tên thẳng', icon: <span className="text-base">➔</span> },
      { type: 'double-arrow-line', label: 'Mũi tên 2 đầu', icon: <span className="text-base">↔</span> },
      { type: 'arrow-up', label: 'Mũi tên lên', icon: <span className="text-base">⇧</span> },
      { type: 'arrow-up-down', label: 'Mũi tên lên-xuống', icon: <span className="text-base">⇳</span> },
      { type: 'arrow-left-right', label: 'Mũi tên trái-phải', icon: <span className="text-base">⬄</span> },
    ]
  },
  {
    title: 'Đường (Lines)',
    items: [
      { type: 'line', label: 'Đường thẳng', icon: <div className="w-5 h-0.5 bg-current -rotate-45"></div> },
      { type: 'arrow-line', label: 'Mũi tên 1 đầu', icon: <span className="text-base">➔</span> },
      { type: 'double-arrow-line', label: 'Mũi tên 2 đầu', icon: <span className="text-base">↔</span> },
      { type: 'elbow-connector', label: 'Đường gấp khúc góc vuông', icon: <span className="text-sm font-mono font-bold">┌─</span> },
      { type: 'elbow-arrow', label: 'Mũi tên gấp khúc', icon: <span className="text-sm font-mono font-bold">└➔</span> },
      { type: 'curve', label: 'Đường cong lượn sóng', icon: <span className="text-sm font-mono font-bold">~</span> },
      { type: 'freeform', label: 'Đường tự do', icon: <span className="text-sm font-serif font-bold">∿</span> },
    ]
  },
  {
    title: 'Hình chữ nhật (Rectangles)',
    items: [
      { type: 'rectangle', label: 'Hình chữ nhật', icon: <div className="w-5 h-4 border-2 border-current"></div> },
      { type: 'rounded-rect', label: 'Chữ nhật bo tròn góc', icon: <div className="w-5 h-4 border-2 border-current rounded-sm"></div> },
      { type: 'snip-1-rect', label: 'Chữ nhật vát 1 góc', icon: <div className="w-5 h-4 border-2 border-current rounded-tr-md"></div> },
      { type: 'snip-2-rect', label: 'Chữ nhật vát 2 góc cùng phía', icon: <div className="w-5 h-4 border-2 border-current rounded-t-md"></div> },
      { type: 'snip-diag-rect', label: 'Chữ nhật vát 2 góc chéo', icon: <div className="w-5 h-4 border-2 border-current rounded-tl-md rounded-br-md"></div> },
      { type: 'round-1-rect', label: 'Chữ nhật bo 1 góc', icon: <div className="w-5 h-4 border-2 border-current rounded-tl-full"></div> },
      { type: 'round-2-rect', label: 'Chữ nhật bo 2 góc', icon: <div className="w-5 h-4 border-2 border-current rounded-t-full"></div> },
    ]
  },
  {
    title: 'Hình Cơ bản (Basic Shapes)',
    items: [
      { type: 'text', label: 'Hộp văn bản', icon: <span className="text-xs font-bold border border-dashed border-current px-1 rounded">A</span> },
      { type: 'circle', label: 'Hình tròn / Elip', icon: <div className="w-5 h-5 border-2 border-current rounded-full"></div> },
      { type: 'triangle', label: 'Tam giác cân', icon: <span className="text-base">▲</span> },
      { type: 'right-triangle', label: 'Tam giác vuông', icon: <span className="text-base">◢</span> },
      { type: 'parallelogram', label: 'Hình bình hành', icon: <span className="text-sm font-mono font-bold">▱</span> },
      { type: 'trapezoid', label: 'Hình thang', icon: <span className="text-sm font-mono font-bold">⏢</span> },
      { type: 'diamond', label: 'Hình thoi', icon: <span className="text-base">◆</span> },
      { type: 'pentagon', label: 'Ngũ giác đều (5 cạnh)', icon: <span className="text-base">⬟</span> },
      { type: 'hexagon', label: 'Lục giác đều (6 cạnh)', icon: <span className="text-base">⬢</span> },
      { type: 'heptagon', label: 'Thất giác (7 cạnh)', icon: <span className="text-[11px] font-bold border border-current rounded-full px-1">7</span> },
      { type: 'octagon', label: 'Bát giác (8 cạnh)', icon: <span className="text-base">⯃</span> },
      { type: 'decagon', label: 'Thập giác (10 cạnh)', icon: <span className="text-[10px] font-bold border border-current rounded-full px-0.5">10</span> },
      { type: 'dodecagon', label: 'Thập nhị giác (12 cạnh)', icon: <span className="text-[10px] font-bold border border-current rounded-full px-0.5">12</span> },
      { type: 'cylinder', label: 'Hình trụ', icon: <div className="w-4 h-5 border-2 border-current rounded-[4px/2px]"></div> },
      { type: 'cube', label: 'Hình lập phương', icon: <span className="text-base">⚂</span> },
      { type: 'donut', label: 'Hình vành khuyên / Bánh donut', icon: <span className="text-base">◎</span> },
      { type: 'no-symbol', label: 'Biển cấm', icon: <span className="text-base">⊘</span> },
      { type: 'arc', label: 'Vòng cung', icon: <span className="text-base">⌒</span> },
      { type: 'folded-corner', label: 'Tờ giấy gấp mép', icon: <span className="text-base">📄</span> },
      { type: 'smiley-face', label: 'Mặt cười', icon: <span className="text-base">☺</span> },
      { type: 'heart', label: 'Trái tim', icon: <span className="text-base text-rose-500">♥</span> },
      { type: 'lightning', label: 'Tia sét', icon: <span className="text-base text-amber-500">⚡</span> },
      { type: 'sun', label: 'Mặt trời', icon: <span className="text-base text-amber-500">☼</span> },
      { type: 'moon', label: 'Mặt trăng', icon: <span className="text-base">☽</span> },
      { type: 'cloud', label: 'Đám mây', icon: <span className="text-base">☁</span> },
      { type: 'plus', label: 'Dấu chữ thập', icon: <span className="text-base font-bold">✚</span> },
      { type: 'brackets', label: 'Cặp ngoặc vuông [ ]', icon: <span className="text-xs font-mono font-bold">[ ]</span> },
      { type: 'braces', label: 'Cặp ngoặc nhọn { }', icon: <span className="text-xs font-mono font-bold">{'{ }'}</span> },
    ]
  },
  {
    title: 'Mũi tên Hình khối (Block Arrows)',
    items: [
      { type: 'arrow-right', label: 'Mũi tên phải', icon: <span className="text-base">➡</span> },
      { type: 'arrow-left', label: 'Mũi tên trái', icon: <span className="text-base">⬅</span> },
      { type: 'arrow-up', label: 'Mũi tên lên', icon: <span className="text-base">⬆</span> },
      { type: 'arrow-down', label: 'Mũi tên xuống', icon: <span className="text-base">⬇</span> },
      { type: 'arrow-left-right', label: 'Mũi tên 2 đầu ngang', icon: <span className="text-base">⬄</span> },
      { type: 'arrow-up-down', label: 'Mũi tên 2 đầu dọc', icon: <span className="text-base">⇳</span> },
      { type: 'arrow-quad', label: 'Mũi tên 4 hướng', icon: <span className="text-base">✛</span> },
      { type: 'arrow-u-turn', label: 'Mũi tên chữ U', icon: <span className="text-base">↷</span> },
      { type: 'arrow-bent', label: 'Mũi tên góc vuông', icon: <span className="text-base">↳</span> },
      { type: 'arrow-chevron', label: 'Mũi tên khía Chevron', icon: <span className="text-base">»</span> },
      { type: 'arrow-pentagon', label: 'Mũi tên ngũ giác', icon: <span className="text-base">⭆</span> },
      { type: 'arrow-striped', label: 'Mũi tên sọc', icon: <span className="text-base">⮞</span> },
    ]
  },
  {
    title: 'Hình Phương trình (Equation Shapes)',
    items: [
      { type: 'math-plus', label: 'Dấu cộng (+)', icon: <span className="text-base font-bold">+</span> },
      { type: 'math-minus', label: 'Dấu trừ (-)', icon: <span className="text-base font-bold">-</span> },
      { type: 'math-multiply', label: 'Dấu nhân (×)', icon: <span className="text-base font-bold">×</span> },
      { type: 'math-divide', label: 'Dấu chia (÷)', icon: <span className="text-base font-bold">÷</span> },
      { type: 'math-equal', label: 'Dấu bằng (=)', icon: <span className="text-base font-bold">=</span> },
      { type: 'math-not-equal', label: 'Dấu khác (≠)', icon: <span className="text-base font-bold">≠</span> },
    ]
  },
  {
    title: 'Lưu đồ (Flowchart)',
    items: [
      { type: 'flowchart-process', label: 'Tiến trình (Process)', icon: <div className="w-5 h-4 border-2 border-current"></div> },
      { type: 'flowchart-decision', label: 'Quyết định (Decision)', icon: <span className="text-base">◆</span> },
      { type: 'flowchart-data', label: 'Dữ liệu Vào/Ra (Data)', icon: <span className="text-sm font-mono font-bold">▱</span> },
      { type: 'flowchart-terminator', label: 'Bắt đầu / Kết thúc', icon: <div className="w-5 h-3.5 border-2 border-current rounded-full"></div> },
      { type: 'flowchart-document', label: 'Tài liệu (Document)', icon: <span className="text-base">📄</span> },
      { type: 'flowchart-predefined', label: 'Tiến trình định sẵn', icon: <div className="w-5 h-4 border-2 border-current border-x-4"></div> },
      { type: 'flowchart-internal', label: 'Lưu trữ nội bộ', icon: <div className="w-5 h-4 border-2 border-current border-t-4"></div> },
    ]
  },
  {
    title: 'Sao và Biểu ngữ (Stars and Banners)',
    items: [
      { type: 'explosion-1', label: 'Sao nổ 1', icon: <span className="text-base">💥</span> },
      { type: 'explosion-2', label: 'Sao nổ 2', icon: <span className="text-base">✴</span> },
      { type: 'star-4', label: 'Ngôi sao 4 cánh', icon: <span className="text-base">✦</span> },
      { type: 'star-5', label: 'Ngôi sao 5 cánh', icon: <span className="text-base">★</span> },
      { type: 'star-6', label: 'Ngôi sao 6 cánh', icon: <span className="text-base">✶</span> },
      { type: 'star-8', label: 'Ngôi sao 8 cánh', icon: <span className="text-base">✵</span> },
      { type: 'star-10', label: 'Ngôi sao 10 cánh', icon: <span className="text-[10px] font-bold border border-current rounded-full px-0.5">10</span> },
      { type: 'star-12', label: 'Ngôi sao 12 cánh', icon: <span className="text-base">✹</span> },
      { type: 'star-16', label: 'Ngôi sao 16 cánh', icon: <span className="text-base">✺</span> },
      { type: 'star-24', label: 'Ngôi sao 24 cánh', icon: <span className="text-[9px] font-bold border border-current rounded-full px-0.5">24</span> },
      { type: 'star-32', label: 'Ngôi sao 32 cánh', icon: <span className="text-base">❂</span> },
      { type: 'ribbon-up', label: 'Ruy băng uốn cong lên', icon: <span className="text-sm font-serif font-bold">⌒</span> },
      { type: 'ribbon-down', label: 'Ruy băng uốn cong xuống', icon: <span className="text-sm font-serif font-bold">⌣</span> },
      { type: 'scroll-horizontal', label: 'Cuộn giấy ngang', icon: <span className="text-base">📜</span> },
      { type: 'scroll-vertical', label: 'Cuộn giấy dọc', icon: <span className="text-base">📃</span> },
      { type: 'wave-flag', label: 'Lá cờ lượn sóng', icon: <span className="text-base">⚑</span> },
    ]
  },
  {
    title: 'Khung chú thích (Callouts)',
    items: [
      { type: 'callout-rect', label: 'Chú thích hình chữ nhật', icon: <div className="w-5 h-4 border-2 border-current relative"><div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current absolute -bottom-1 left-1 bg-inherit"></div></div> },
      { type: 'callout-rounded', label: 'Chú thích chữ nhật bo góc', icon: <div className="w-5 h-4 border-2 border-current rounded-sm relative"><div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current absolute -bottom-1 left-1 bg-inherit"></div></div> },
      { type: 'callout-oval', label: 'Chú thích hình bầu dục / Oval', icon: <div className="w-5 h-4 border-2 border-current rounded-full relative"><div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current absolute -bottom-1 left-1 bg-inherit"></div></div> },
      { type: 'callout-cloud', label: 'Chú thích đám mây suy nghĩ', icon: <span className="text-base">💭</span> },
      { type: 'callout-line', label: 'Chú thích đường dẫn', icon: <span className="text-base">∠</span> },
    ]
  }
];

export const DrawingGroup: React.FC<DrawingGroupProps> = ({
  onAddShape,
  currentFormat,
  onFormatChange,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  hasSelection,
}) => {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showFillMenu, setShowFillMenu] = useState(false);
  const [showOutlineMenu, setShowOutlineMenu] = useState(false);
  const [showArrangeMenu, setShowArrangeMenu] = useState(false);
  const [shapeSearch, setShapeSearch] = useState('');

  const shapeMenuRef = useRef<HTMLDivElement>(null);
  const fillMenuRef = useRef<HTMLDivElement>(null);
  const outlineMenuRef = useRef<HTMLDivElement>(null);
  const arrangeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shapeMenuRef.current && !shapeMenuRef.current.contains(e.target as Node)) {
        setShowShapeMenu(false);
        setShapeSearch('');
      }
      if (fillMenuRef.current && !fillMenuRef.current.contains(e.target as Node)) setShowFillMenu(false);
      if (outlineMenuRef.current && !outlineMenuRef.current.contains(e.target as Node)) setShowOutlineMenu(false);
      if (arrangeMenuRef.current && !arrangeMenuRef.current.contains(e.target as Node)) setShowArrangeMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSections = ALL_SHAPE_SECTIONS.map(sec => {
    if (!shapeSearch.trim()) return sec;
    const q = shapeSearch.toLowerCase().trim();
    return {
      ...sec,
      items: sec.items.filter(i => i.label.toLowerCase().includes(q) || i.type.toLowerCase().includes(q))
    };
  }).filter(sec => sec.items.length > 0);

  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      <div className="flex items-center gap-1.5">
        {/* Main Shape Dropdown Button */}
        <div className="relative" ref={shapeMenuRef}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-14 px-2 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-0.5 transition-colors"
            onClick={() => setShowShapeMenu(!showShapeMenu)}
            title="Chèn Hình vẽ (Shapes)"
          >
            <div className="flex items-center gap-0.5">
              <div className="w-3.5 h-3.5 border-2 border-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
              <div className="w-3.5 h-3.5 border-2 border-orange-500 bg-orange-100 dark:bg-orange-900 rounded-none"></div>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-medium leading-none">Hình</span>
              <IconChevronDown size={9} className="text-muted-foreground" />
            </div>
          </button>

          {/* Full Office Shapes Palette Popup with Large Icons & Vertical Scrollbar */}
          {showShapeMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-[420px] max-h-[500px] overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl flex flex-col animate-in fade-in duration-100">
              {/* Search Bar */}
              <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <IconSearch size={14} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hình khối..."
                  value={shapeSearch}
                  onChange={(e) => setShapeSearch(e.target.value)}
                  className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
                {shapeSearch && (
                  <button onClick={() => setShapeSearch('')} className="text-xs text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                )}
              </div>

              {/* Categorized Shape Grid with Smooth Scrollbar */}
              <div className="flex-1 overflow-y-auto p-3 max-h-[440px] flex flex-col gap-3.5 scroll-smooth">
                {filteredSections.map((sec) => (
                  <div key={sec.title} className="flex flex-col gap-1.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                      {sec.title}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                      {sec.items.map((item) => (
                        <button
                          key={item.type}
                          onMouseDown={(e) => e.preventDefault()}
                          className="h-10 w-12 flex items-center justify-center rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/70 border border-slate-200/50 dark:border-slate-700/50 hover:border-orange-500 transition-all hover:scale-105 cursor-pointer shadow-xs"
                          onClick={() => {
                            onAddShape(item.type);
                            setShowShapeMenu(false);
                            setShapeSearch('');
                          }}
                          title={item.label}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shape Styling: Fill, Outline, Arrange */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            {/* Shape Fill Dropdown - Office Word ColorPicker */}
            <div className="relative" ref={fillMenuRef}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                className="h-6 px-1.5 hover:bg-muted border border-border rounded flex items-center gap-1 text-[10px] transition-colors"
                onClick={() => setShowFillMenu(!showFillMenu)}
                title="Tô màu hình (Shape Fill)"
              >
                <div className="w-3 h-3 rounded-sm border border-slate-400" style={{ backgroundColor: currentFormat.fillColor || 'transparent' }}></div>
                <span>Tô màu</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </button>

              {showFillMenu && (
                <div className="absolute left-0 top-full mt-1 z-[999]">
                  <ColorPicker
                    allowAutomatic={false}
                    allowNoColor={true}
                    onSelectColor={(color) => {
                      onFormatChange({ fillColor: color });
                      setShowFillMenu(false);
                    }}
                    onClose={() => setShowFillMenu(false)}
                  />
                </div>
              )}
            </div>

            {/* Shape Outline Dropdown - Office Word ColorPicker */}
            <div className="relative" ref={outlineMenuRef}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                className="h-6 px-1.5 hover:bg-muted border border-border rounded flex items-center gap-1 text-[10px] transition-colors"
                onClick={() => setShowOutlineMenu(!showOutlineMenu)}
                title="Viền hình (Shape Outline)"
              >
                <div className="w-3 h-3 rounded-sm border-2" style={{ borderColor: currentFormat.borderColor || '#000000' }}></div>
                <span>Viền</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </button>

              {showOutlineMenu && (
                <div className="absolute left-0 top-full mt-1 z-[999] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg p-2">
                  <ColorPicker
                    allowAutomatic={false}
                    allowNoColor={true}
                    onSelectColor={(color) => {
                      onFormatChange({
                        borderColor: color,
                        borderWidth: color === 'transparent' ? 0 : Math.max(1, currentFormat.borderWidth || 2)
                      });
                      setShowOutlineMenu(false);
                    }}
                    onClose={() => setShowOutlineMenu(false)}
                  />
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2">
                    <div className="text-[10px] font-semibold text-muted-foreground mb-1">ĐỘ DÀY ĐƯỜNG VIỀN</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 5].map(w => (
                        <button
                          key={w}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`flex-1 py-1 text-center text-xs rounded border ${currentFormat.borderWidth === w ? 'bg-orange-100 dark:bg-orange-950 border-orange-500 font-bold text-orange-600' : 'hover:bg-muted'}`}
                          onClick={() => {
                            onFormatChange({ borderWidth: w });
                            setShowOutlineMenu(false);
                          }}
                        >
                          {w}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Arrange Dropdown */}
          <div className="relative" ref={arrangeMenuRef}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              className="h-6 px-1.5 w-full hover:bg-muted border border-border rounded flex items-center justify-between text-[10px] transition-colors"
              onClick={() => setShowArrangeMenu(!showArrangeMenu)}
              title="Sắp xếp thứ tự lớp hiển thị"
            >
              <div className="flex items-center gap-1">
                <IconSelectionPane size={11} className="text-muted-foreground" />
                <span>Sắp xếp lớp</span>
              </div>
              <IconChevronDown size={8} className="text-muted-foreground" />
            </button>

            {showArrangeMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-44 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-md p-1">
                <button
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
                  onClick={() => { onBringToFront(); setShowArrangeMenu(false); }}
                >
                  Đưa lên trên cùng
                </button>
                <button
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
                  onClick={() => { onBringForward(); setShowArrangeMenu(false); }}
                >
                  Lên 1 lớp (Forward)
                </button>
                <button
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
                  onClick={() => { onSendBackward(); setShowArrangeMenu(false); }}
                >
                  Xuống 1 lớp (Backward)
                </button>
                <button
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40"
                  onClick={() => { onSendToBack(); setShowArrangeMenu(false); }}
                >
                  Đưa xuống dưới cùng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Vẽ hình
      </span>
    </div>
  );
};
