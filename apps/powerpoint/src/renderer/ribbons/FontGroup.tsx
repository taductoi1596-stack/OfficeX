import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ColorPicker } from '@officex/ui';
import { 
  IconBold, 
  IconItalic, 
  IconUnderline, 
  IconStrikethrough, 
  IconHighlight, 
  IconFontColor,
  IconChevronDown,
  IconSearch
} from '@officex/icons';
import { ShapeFormat } from '@officex/presentation-core';

interface FontGroupProps {
  currentFormat: ShapeFormat;
  onFormatChange: (format: Partial<ShapeFormat>) => void;
  disabled?: boolean;
}

export interface FontCategory {
  category: string;
  fonts: Array<{ name: string; label?: string; sample?: string }>;
}

const FONT_CATEGORIES: FontCategory[] = [
  {
    category: 'Phổ biến & Office',
    fonts: [
      { name: 'Inter', label: 'Inter (OfficeX Chuẩn)' },
      { name: 'Calibri', label: 'Calibri (Mặc định MS Office)' },
      { name: 'Arial', label: 'Arial' },
      { name: 'Segoe UI', label: 'Segoe UI' },
      { name: 'Roboto', label: 'Roboto' },
      { name: 'Open Sans', label: 'Open Sans' },
      { name: 'Montserrat', label: 'Montserrat' },
      { name: 'Poppins', label: 'Poppins' },
      { name: 'Lato', label: 'Lato' },
      { name: 'Helvetica', label: 'Helvetica' },
      { name: 'Verdana', label: 'Verdana' },
      { name: 'Tahoma', label: 'Tahoma' },
    ]
  },
  {
    category: 'Serif & Trang trọng',
    fonts: [
      { name: 'Times New Roman', label: 'Times New Roman' },
      { name: 'Georgia', label: 'Georgia' },
      { name: 'Playfair Display', label: 'Playfair Display' },
      { name: 'Merriweather', label: 'Merriweather' },
      { name: 'Garamond', label: 'Garamond' },
      { name: 'Cambria', label: 'Cambria' },
      { name: 'Book Antiqua', label: 'Book Antiqua' },
      { name: 'Palatino Linotype', label: 'Palatino Linotype' },
      { name: 'Baskerville', label: 'Baskerville' },
    ]
  },
  {
    category: 'Tiêu đề & Đậm chất (Display)',
    fonts: [
      { name: 'Impact', label: 'Impact' },
      { name: 'Bebas Neue', label: 'Bebas Neue' },
      { name: 'Oswald', label: 'Oswald' },
      { name: 'Anton', label: 'Anton' },
      { name: 'Archivo Black', label: 'Archivo Black' },
      { name: 'Trebuchet MS', label: 'Trebuchet MS' },
      { name: 'Century Gothic', label: 'Century Gothic' },
      { name: 'Franklin Gothic Medium', label: 'Franklin Gothic' },
    ]
  },
  {
    category: 'Viết tay & Nghệ thuật (Script)',
    fonts: [
      { name: 'Dancing Script', label: 'Dancing Script' },
      { name: 'Pacifico', label: 'Pacifico' },
      { name: 'Caveat', label: 'Caveat' },
      { name: 'Lobster', label: 'Lobster' },
      { name: 'Great Vibes', label: 'Great Vibes' },
      { name: 'Comic Sans MS', label: 'Comic Sans MS' },
    ]
  },
  {
    category: 'Đơn cách & Lập trình (Monospace)',
    fonts: [
      { name: 'Fira Code', label: 'Fira Code' },
      { name: 'Consolas', label: 'Consolas' },
      { name: 'Courier New', label: 'Courier New' },
      { name: 'Source Code Pro', label: 'Source Code Pro' },
      { name: 'Monaco', label: 'Monaco' },
    ]
  }
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 72, 80, 96];

export const FontGroup: React.FC<FontGroupProps> = ({
  currentFormat,
  onFormatChange,
}) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [fontSearch, setFontSearch] = useState('');

  const [activeHighlightColor, setActiveHighlightColor] = useState('#fef08a');
  const [activeFontColor, setActiveFontColor] = useState('#000000');

  const fontMenuRef = useRef<HTMLDivElement>(null);
  const sizeMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const highlightMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
        setFontSearch('');
      }
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(e.target as Node)) setShowSizeMenu(false);
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) setShowColorMenu(false);
      if (highlightMenuRef.current && !highlightMenuRef.current.contains(e.target as Node)) setShowHighlightMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showFontMenu && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showFontMenu]);

  // Filter fonts according to search query
  const filteredCategories = useMemo(() => {
    if (!fontSearch.trim()) return FONT_CATEGORIES;
    const q = fontSearch.toLowerCase().trim();
    return FONT_CATEGORIES.map(cat => ({
      ...cat,
      fonts: cat.fonts.filter(f => f.name.toLowerCase().includes(q) || (f.label && f.label.toLowerCase().includes(q)))
    })).filter(cat => cat.fonts.length > 0);
  }, [fontSearch]);

  const handleGrowFont = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const current = currentFormat.fontSize || 18;
    const next = FONT_SIZES.find(s => s > current) || current + 4;
    onFormatChange({ fontSize: next });
  };

  const handleShrinkFont = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const current = currentFormat.fontSize || 18;
    const prev = [...FONT_SIZES].reverse().find(s => s < current) || Math.max(8, current - 4);
    onFormatChange({ fontSize: prev });
  };

  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      {/* Row 1: Font Family, Size, Grow, Shrink */}
      <div className="flex items-center gap-1">
        {/* Font Family Dropdown */}
        <div className="relative" ref={fontMenuRef}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-2 w-32 bg-background hover:bg-muted border border-input rounded text-xs flex items-center justify-between font-sans transition-colors"
            onClick={() => setShowFontMenu(!showFontMenu)}
            title="Chọn phông chữ"
          >
            <span className="truncate max-w-[90px]" style={{ fontFamily: currentFormat.fontFamily || 'Inter' }}>
              {currentFormat.fontFamily || 'Inter'}
            </span>
            <IconChevronDown size={11} className="shrink-0 text-muted-foreground ml-1" />
          </button>

          {showFontMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-64 max-h-80 overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg flex flex-col animate-in fade-in duration-100">
              {/* Search Box */}
              <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50">
                <IconSearch size={12} className="text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm phông chữ..."
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
                {fontSearch && (
                  <button onClick={() => setFontSearch('')} className="text-xs text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                )}
              </div>

              {/* Categorized Font List */}
              <div className="flex-1 overflow-y-auto p-1 max-h-64">
                {filteredCategories.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">Không tìm thấy phông chữ</div>
                ) : (
                  filteredCategories.map(cat => (
                    <div key={cat.category} className="mb-2">
                      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-0.5 tracking-wider">
                        {cat.category}
                      </div>
                      {cat.fonts.map(font => {
                        const isSelected = currentFormat.fontFamily === font.name;
                        return (
                          <button
                            key={font.name}
                            onMouseDown={(e) => e.preventDefault()}
                            className={`w-full px-2 py-1.5 text-left flex items-center justify-between rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors group ${isSelected ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 font-semibold' : ''}`}
                            onClick={() => {
                              onFormatChange({ fontFamily: font.name });
                              setShowFontMenu(false);
                              setFontSearch('');
                            }}
                          >
                            <span style={{ fontFamily: font.name }} className="text-sm">
                              {font.label || font.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground group-hover:text-orange-500 opacity-60 font-sans">
                              Aa
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative" ref={sizeMenuRef}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-1.5 w-14 bg-background hover:bg-muted border border-input rounded text-xs flex items-center justify-between transition-colors"
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            title="Cỡ chữ"
          >
            <span>{currentFormat.fontSize || 18}</span>
            <IconChevronDown size={11} className="shrink-0 text-muted-foreground ml-0.5" />
          </button>

          {showSizeMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-16 max-h-56 overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-md p-1">
              {FONT_SIZES.map(size => (
                <button
                  key={size}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`w-full px-2 py-0.5 text-center text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 ${currentFormat.fontSize === size ? 'bg-orange-100 dark:bg-orange-950 font-semibold text-orange-600' : ''}`}
                  onClick={() => {
                    onFormatChange({ fontSize: size });
                    setShowSizeMenu(false);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grow / Shrink Font Buttons */}
        <button
          onMouseDown={handleGrowFont}
          className="h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center text-xs font-semibold hover:text-orange-600 transition-colors"
          title="Tăng cỡ chữ (Ctrl+Shift+>)"
        >
          <span className="leading-none text-[11px] font-bold">A<sup className="text-[8px] font-bold">^</sup></span>
        </button>
        <button
          onMouseDown={handleShrinkFont}
          className="h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center text-xs font-semibold hover:text-orange-600 transition-colors"
          title="Giảm cỡ chữ (Ctrl+Shift+<)"
        >
          <span className="leading-none text-[10px]">A<sub className="text-[8px] font-bold">v</sub></span>
        </button>
      </div>

      {/* Row 2: B, I, U, Strike, Highlight, Color, Clear */}
      <div className="flex items-center gap-0.5">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ bold: !currentFormat.bold });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.bold ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold' : ''}`}
          title="In đậm (Ctrl+B)"
        >
          <IconBold size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ italic: !currentFormat.italic });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.italic ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="In nghiêng (Ctrl+I)"
        >
          <IconItalic size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ underline: !currentFormat.underline });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.underline ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Gạch chân (Ctrl+U)"
        >
          <IconUnderline size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ strikethrough: !currentFormat.strikethrough });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.strikethrough ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Gạch ngang chữ"
        >
          <IconStrikethrough size={13} />
        </button>

        {/* Text Highlight Color - Office Word ColorPicker */}
        <div className="relative flex items-center rounded border border-transparent hover:bg-muted transition-colors" ref={highlightMenuRef}>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormatChange({ highlightColor: activeHighlightColor });
            }}
            className="h-6 px-1 flex flex-col items-center justify-center"
            title="Màu nổi bật văn bản (Nhấp để áp dụng)"
          >
            <IconHighlight size={13} />
            <div 
              className="w-3.5 h-[3px] rounded-sm -mt-0.5 border border-slate-300"
              style={{ backgroundColor: (currentFormat.highlightColor && currentFormat.highlightColor !== 'transparent') ? currentFormat.highlightColor : activeHighlightColor }}
            />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-0.5 flex items-center justify-center hover:bg-muted-foreground/20 rounded-r"
            onClick={() => setShowHighlightMenu(!showHighlightMenu)}
            title="Chọn màu nổi bật khác"
          >
            <IconChevronDown size={8} className="text-muted-foreground" />
          </button>

          {showHighlightMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999]">
              <ColorPicker
                allowAutomatic={false}
                allowNoColor={true}
                onSelectColor={(c) => {
                  setActiveHighlightColor(c);
                  onFormatChange({ highlightColor: c });
                  setShowHighlightMenu(false);
                }}
                onClose={() => setShowHighlightMenu(false)}
              />
            </div>
          )}
        </div>

        {/* Font Color - Office Word ColorPicker */}
        <div className="relative flex items-center rounded border border-transparent hover:bg-muted transition-colors" ref={colorMenuRef}>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onFormatChange({ color: activeFontColor });
            }}
            className="h-6 px-1 flex flex-col items-center justify-center"
            title="Màu phông chữ (Nhấp để áp dụng)"
          >
            <IconFontColor size={13} />
            <div 
              className="w-3.5 h-[3px] rounded-sm -mt-0.5" 
              style={{ backgroundColor: currentFormat.color || activeFontColor }} 
            />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-0.5 flex items-center justify-center hover:bg-muted-foreground/20 rounded-r"
            onClick={() => setShowColorMenu(!showColorMenu)}
            title="Chọn màu phông chữ khác"
          >
            <IconChevronDown size={8} className="text-muted-foreground" />
          </button>

          {showColorMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999]">
              <ColorPicker
                allowAutomatic={true}
                allowNoColor={false}
                onSelectColor={(c) => {
                  const resolved = c === 'automatic' ? '#000000' : c;
                  setActiveFontColor(resolved);
                  onFormatChange({ color: resolved });
                  setShowColorMenu(false);
                }}
                onClose={() => setShowColorMenu(false)}
              />
            </div>
          )}
        </div>

        {/* Clear Formatting Button */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({
              fontFamily: 'Inter',
              fontSize: 18,
              bold: false,
              italic: false,
              underline: false,
              strikethrough: false,
              color: '#0f172a',
              highlightColor: 'transparent',
            });
          }}
          className="h-6 px-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          title="Xóa mọi định dạng"
        >
          <span>✕</span>
        </button>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Phông chữ
      </span>
    </div>
  );
};
