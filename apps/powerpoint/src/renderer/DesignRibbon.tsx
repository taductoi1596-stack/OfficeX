import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { 
  IconSparkles, 
  IconChevronDown, 
  IconUpload, 
  IconCheck,
  IconSearch,
  IconAI
} from '@officex/icons';
import { DesignTheme, DESIGN_THEMES } from './ribbons/DesignerModal';

export interface SlideSizeOption {
  id: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  desc: string;
  icon: string;
}

export const SLIDE_SIZES: SlideSizeOption[] = [
  { id: 'widescreen', name: 'Màn hình rộng (16:9)', ratio: '16:9', width: 960, height: 540, desc: 'Tỷ lệ tiêu chuẩn cho màn hình máy tính, TV & máy chiếu hiện đại', icon: '🖥️' },
  { id: 'standard', name: 'Màn hình chuẩn (4:3)', ratio: '4:3', width: 800, height: 600, desc: 'Tỷ lệ truyền thống cho tài liệu học thuật & máy chiếu cũ', icon: '📺' },
  { id: 'vertical', name: 'Khổ dọc Story (9:16)', ratio: '9:16', width: 540, height: 960, desc: 'Tỷ lệ dọc cho điện thoại, Reels & TikTok slide', icon: '📱' },
  { id: 'a4', name: 'Khổ giấy A4 / In ấn', ratio: 'A4', width: 794, height: 1123, desc: 'Kích thước chuẩn cho in ấn tài liệu & báo cáo', icon: '📄' },
];

export interface ColorPalettePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent1: string;
  accent2: string;
  bg: string;
}

export const COLOR_PALETTES: ColorPalettePreset[] = [
  { id: 'office-classic', name: 'Office Mặc định', primary: '#2563eb', secondary: '#f97316', accent1: '#10b981', accent2: '#8b5cf6', bg: '#ffffff' },
  { id: 'cyber-cyan', name: 'Công nghệ Cyber', primary: '#0284c7', secondary: '#06b6d4', accent1: '#3b82f6', accent2: '#6366f1', bg: '#0f172a' },
  { id: 'sunset-ruby', name: 'Hoàng hôn Ruby', primary: '#e11d48', secondary: '#f97316', accent1: '#f59e0b', accent2: '#ec4899', bg: '#fff1f2' },
  { id: 'emerald-forest', name: 'Rừng Ngọc Lục Bảo', primary: '#059669', secondary: '#10b981', accent1: '#84cc16', accent2: '#14b8a6', bg: '#f0fdf4' },
  { id: 'royal-luxury', name: 'Hoàng gia Gold', primary: '#d97706', secondary: '#eab308', accent1: '#f59e0b', accent2: '#78350f', bg: '#18181b' },
  { id: 'deep-violet', name: 'Tím Huyền bí', primary: '#7c3aed', secondary: '#a855f7', accent1: '#c084fc', accent2: '#ec4899', bg: '#1e1b4b' },
  { id: 'monochrome', name: 'Tối giản Đơn sắc', primary: '#0f172a', secondary: '#334155', accent1: '#64748b', accent2: '#94a3b8', bg: '#f8fafc' },
];

export interface FontPairPreset {
  id: string;
  name: string;
  titleFont: string;
  bodyFont: string;
  preview: string;
}

export const FONT_PAIRS: FontPairPreset[] = [
  { id: 'office', name: 'Office Chuẩn (Calibri / Arial)', titleFont: 'Arial', bodyFont: 'Arial', preview: 'Aa Bb Cc' },
  { id: 'modern', name: 'Hiện đại (Inter / Roboto)', titleFont: 'Inter', bodyFont: 'Roboto', preview: 'Aa Bb Cc' },
  { id: 'luxury', name: 'Sang trọng (Playfair / Montserrat)', titleFont: 'Playfair Display', bodyFont: 'Montserrat', preview: 'Aa Bb Cc' },
  { id: 'creative', name: 'Kỷ nguyên mới (Outfit / Sans)', titleFont: 'Outfit', bodyFont: 'Inter', preview: 'Aa Bb Cc' },
  { id: 'academic', name: 'Học thuật (Times New Roman / Georgia)', titleFont: 'Times New Roman', bodyFont: 'Georgia', preview: 'Aa Bb Cc' },
  { id: 'code', name: 'Công nghệ (Fira Code / Mono)', titleFont: 'Fira Code', bodyFont: 'Inter', preview: 'Aa Bb Cc' },
];

export const BACKGROUND_PRESETS = [
  { id: 'bg-white', name: 'Trắng tinh', value: '#ffffff', desc: 'Sạch sẽ, cổ điển' },
  { id: 'bg-cream', name: 'Kem ngà nhạt', value: '#fdfbf7', desc: 'Thư giãn mắt' },
  { id: 'bg-slate-light', name: 'Ghi nhạt', value: '#f8fafc', desc: 'Hiện đại nhẹ nhàng' },
  { id: 'bg-blue-soft', name: 'Xanh băng dịu', value: '#f0f9ff', desc: 'Tươi mới' },
  { id: 'bg-rose-soft', name: 'Hồng phấn pastel', value: '#fff1f2', desc: 'Ấm áp' },
  { id: 'bg-dark-obsidian', name: 'Đen Obsidian', value: '#0f172a', desc: 'Dark mode cao cấp' },
  { id: 'bg-dark-zinc', name: 'Than chì', value: '#18181b', desc: 'Sang trọng' },
  { id: 'bg-dark-indigo', name: 'Tím đêm Indigo', value: '#1e1b4b', desc: 'Huyền bí' },
  { id: 'bg-grad-cyan', name: 'Gradient Cyber', value: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)', desc: 'Đậm chất công nghệ' },
  { id: 'bg-grad-sunset', name: 'Gradient Sunset', value: 'linear-gradient(135deg, #4c0519 0%, #831843 50%, #9a3412 100%)', desc: 'Rực rỡ lôi cuốn' },
  { id: 'bg-grad-emerald', name: 'Gradient Emerald', value: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', desc: 'Thịnh vượng tài chính' },
  { id: 'bg-grad-gold', name: 'Gradient Hoàng kim', value: 'linear-gradient(135deg, #1c1917 0%, #451a03 100%)', desc: 'Đẳng cấp thương gia' },
];

interface DesignRibbonProps {
  onApplyTheme: (theme: DesignTheme) => void;
  onApplyColorPalette: (palette: ColorPalettePreset) => void;
  onApplyFontPair: (fonts: FontPairPreset) => void;
  onApplyBackground: (bg: string, applyToAll?: boolean) => void;
  onSetSlideSize: (size: SlideSizeOption) => void;
  onToggleDesigner: () => void;
  currentBackground?: string;
  currentSlideSize?: string;
  isDesignerOpen: boolean;
}

export const DesignRibbon: React.FC<DesignRibbonProps> = ({
  onApplyTheme,
  onApplyColorPalette,
  onApplyFontPair,
  onApplyBackground,
  onSetSlideSize,
  onToggleDesigner,
  currentBackground = '#ffffff',
  currentSlideSize = 'widescreen',
  isDesignerOpen,
}) => {
  const [showThemeGallery, setShowThemeGallery] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showBgStyleMenu, setShowBgStyleMenu] = useState(false);
  const [showSlideSizeMenu, setShowSlideSizeMenu] = useState(false);
  const [showFormatBgModal, setShowFormatBgModal] = useState(false);

  const [customSolidColor, setCustomSolidColor] = useState('#ffffff');
  const [gradientColor1, setGradientColor1] = useState('#1e40af');
  const [gradientColor2, setGradientColor2] = useState('#0f172a');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [bgTab, setBgTab] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [onlineBgUrl, setOnlineBgUrl] = useState('');
  const [applyAllSlides, setApplyAllSlides] = useState(true);

  const themeRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const bgStyleRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setShowThemeGallery(false);
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColorMenu(false);
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) setShowFontMenu(false);
      if (bgStyleRef.current && !bgStyleRef.current.contains(e.target as Node)) setShowBgStyleMenu(false);
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setShowSlideSizeMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onApplyBackground(`url('${reader.result}') center / cover no-repeat`, applyAllSlides);
          setShowFormatBgModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const previewThemes = DESIGN_THEMES.slice(0, 5);

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      <input
        type="file"
        ref={bgFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleBgFileUpload}
      />

      {/* ── 1. Group: CHỦ ĐỀ (Themes Gallery) ──────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={themeRef}>
        <div className="flex items-center gap-1.5">
          {/* Quick Theme Cards Preview Strip */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-border">
            {previewThemes.map((theme) => (
              <button
                key={theme.id}
                className="w-16 h-12 rounded border border-slate-300 dark:border-slate-700 hover:border-orange-500 overflow-hidden flex flex-col justify-between p-1.5 transition-all hover:scale-105 shadow-xs group"
                style={{ background: theme.background }}
                onClick={() => onApplyTheme(theme)}
                title={`${theme.name} (${theme.category})`}
              >
                <div 
                  className="text-[9px] font-extrabold truncate w-full text-left leading-none"
                  style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
                >
                  Tiêu đề
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="w-4 h-2 rounded-xs" style={{ backgroundColor: theme.cardStyle.fillColor, border: `1px solid ${theme.cardStyle.borderColor}` }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                </div>
              </button>
            ))}
          </div>

          {/* Expand Full Themes Gallery Button */}
          <button
            className={`h-14 px-2.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${showThemeGallery ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => setShowThemeGallery(!showThemeGallery)}
            title="Mở toàn bộ Thư viện Chủ đề Thiết kế (Themes Gallery)"
          >
            <div className="w-5 h-4 border border-current rounded flex items-center justify-center text-[10px]">
              🎨
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">Chủ đề</span>
              <IconChevronDown size={8} className={showThemeGallery ? 'text-white' : 'text-muted-foreground'} />
            </div>
          </button>
        </div>

        {/* ── Full Themes Gallery Dropdown Modal ── */}
        {showThemeGallery && (
          <div className="absolute left-0 top-full mt-1 z-[999] w-[580px] max-h-[500px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col animate-in fade-in duration-150">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🎨</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  THƯ VIỆN CHỦ ĐỀ TRÌNH CHIẾU (THEMES)
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-semibold">{DESIGN_THEMES.length} Mẫu thiết kế chuẩn</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[400px]">
              {['Doanh nghiệp', 'Tối & Sang trọng', 'Sáng tạo', 'Học thuật & Tối giản'].map((category) => {
                const categoryThemes = DESIGN_THEMES.filter(t => t.category === category);
                if (categoryThemes.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-1">
                      {category}
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {categoryThemes.map(theme => (
                        <button
                          key={theme.id}
                          className="h-20 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-orange-500 p-2 flex flex-col justify-between text-left transition-all hover:scale-105 shadow-xs group"
                          style={{ background: theme.background }}
                          onClick={() => {
                            onApplyTheme(theme);
                            setShowThemeGallery(false);
                          }}
                          title={theme.description}
                        >
                          <div>
                            <div 
                              className="text-[11px] font-extrabold truncate leading-tight"
                              style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
                            >
                              {theme.name}
                            </div>
                            <div className="text-[9px] opacity-70 truncate" style={{ color: theme.textColor }}>
                              {theme.fontFamily}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/10">
                            <div 
                              className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                              style={{ backgroundColor: theme.cardStyle.fillColor, color: theme.primaryColor, border: `1px solid ${theme.cardStyle.borderColor}` }}
                            >
                              Card
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: theme.primaryColor }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end">
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted text-slate-700 dark:text-slate-300 transition-colors"
                onClick={() => setShowThemeGallery(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Chủ đề
        </span>
      </div>

      {/* ── 2. Group: BIẾN THỂ (Variants) ─────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Quick Color Swatches */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-border">
            {COLOR_PALETTES.slice(0, 4).map(pal => (
              <button
                key={pal.id}
                className="w-7 h-12 rounded border border-slate-300 dark:border-slate-700 hover:border-orange-500 overflow-hidden flex flex-col transition-all hover:scale-105"
                onClick={() => onApplyColorPalette(pal)}
                title={pal.name}
              >
                <div className="h-3 w-full" style={{ backgroundColor: pal.primary }} />
                <div className="h-3 w-full" style={{ backgroundColor: pal.secondary }} />
                <div className="h-3 w-full" style={{ backgroundColor: pal.accent1 }} />
                <div className="h-3 w-full" style={{ backgroundColor: pal.accent2 }} />
              </button>
            ))}
          </div>

          {/* Color Palette Dropdown */}
          <div className="relative" ref={colorRef}>
            <button
              className={`h-14 px-2 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showColorMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowColorMenu(!showColorMenu)}
              title="Bảng màu sắc chủ đề"
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-blue-500 rounded-xs" />
                <div className="bg-orange-500 rounded-xs" />
                <div className="bg-emerald-500 rounded-xs" />
                <div className="bg-purple-500 rounded-xs" />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Màu sắc</span>
                <IconChevronDown size={8} className={showColorMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showColorMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  BẢNG MÀU SẮC CHỦ ĐỀ
                </div>
                {COLOR_PALETTES.map(pal => (
                  <button
                    key={pal.id}
                    className="w-full p-2 text-left rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors group"
                    onClick={() => {
                      onApplyColorPalette(pal);
                      setShowColorMenu(false);
                    }}
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600">
                      {pal.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-4 rounded-xs shadow-xs" style={{ backgroundColor: pal.primary }} />
                      <span className="w-2.5 h-4 rounded-xs shadow-xs" style={{ backgroundColor: pal.secondary }} />
                      <span className="w-2.5 h-4 rounded-xs shadow-xs" style={{ backgroundColor: pal.accent1 }} />
                      <span className="w-2.5 h-4 rounded-xs shadow-xs" style={{ backgroundColor: pal.accent2 }} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fonts Pair Dropdown */}
          <div className="relative" ref={fontRef}>
            <button
              className={`h-14 px-2 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showFontMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowFontMenu(!showFontMenu)}
              title="Cặp phông chữ thiết kế"
            >
              <div className="text-sm font-serif font-extrabold leading-none">
                A<span className="text-xs font-sans font-normal">a</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Phông chữ</span>
                <IconChevronDown size={8} className={showFontMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showFontMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  CẶP PHÔNG CHỮ TIÊU CHUẨN
                </div>
                {FONT_PAIRS.map(fp => (
                  <button
                    key={fp.id}
                    className="w-full p-2 text-left rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors group"
                    onClick={() => {
                      onApplyFontPair(fp);
                      setShowFontMenu(false);
                    }}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600" style={{ fontFamily: fp.titleFont }}>
                        {fp.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground" style={{ fontFamily: fp.bodyFont }}>
                        Tiêu đề: {fp.titleFont} / Thân: {fp.bodyFont}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-orange-500">{fp.preview}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Background Styles Dropdown */}
          <div className="relative" ref={bgStyleRef}>
            <button
              className={`h-14 px-2 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showBgStyleMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowBgStyleMenu(!showBgStyleMenu)}
              title="Kiểu nền có sẵn (Background Styles)"
            >
              <div className="w-5 h-4 border border-current rounded-xs flex items-center justify-center bg-gradient-to-tr from-slate-700 to-slate-200 text-white shadow-xs" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Kiểu nền</span>
                <IconChevronDown size={8} className={showBgStyleMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showBgStyleMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2.5 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-1 mb-2 uppercase tracking-wider">
                  MẪU KIỂU NỀN TRANG CHIẾU
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {BACKGROUND_PRESETS.map(bg => (
                    <button
                      key={bg.id}
                      className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-orange-500 p-1 flex flex-col justify-end transition-all hover:scale-105 shadow-xs group"
                      style={{ background: bg.value }}
                      onClick={() => {
                        onApplyBackground(bg.value, true);
                        setShowBgStyleMenu(false);
                      }}
                      title={`${bg.name} - ${bg.desc}`}
                    >
                      <span className="text-[8px] font-bold px-1 rounded bg-black/40 text-white truncate max-w-full">
                        {bg.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Biến thể
        </span>
      </div>

      {/* ── 3. Group: TÙY CHỈNH (Customize) ────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Slide Size Dropdown */}
          <div className="relative" ref={sizeRef}>
            <button
              className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showSlideSizeMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowSlideSizeMenu(!showSlideSizeMenu)}
              title="Chọn tỷ lệ & kích cỡ trang chiếu"
            >
              <div className="w-5 h-4 border-2 border-current rounded-xs flex items-center justify-center text-[9px] font-bold">
                16:9
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Cỡ trang</span>
                <IconChevronDown size={8} className={showSlideSizeMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showSlideSizeMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  KÍCH CỠ TRANG CHIẾU (SLIDE SIZE)
                </div>
                {SLIDE_SIZES.map(sz => (
                  <button
                    key={sz.id}
                    className="w-full p-2 text-left rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-start gap-2.5 transition-colors group"
                    onClick={() => {
                      onSetSlideSize(sz);
                      setShowSlideSizeMenu(false);
                    }}
                  >
                    <span className="text-lg leading-none">{sz.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 flex items-center justify-between">
                        <span>{sz.name}</span>
                        {currentSlideSize === sz.id && <IconCheck size={14} className="text-orange-600" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{sz.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Format Background Button */}
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={() => setShowFormatBgModal(true)}
            title="Tùy chỉnh định dạng màu nền, gradient hoặc ảnh nền"
          >
            <div className="w-5 h-5 rounded border border-orange-500 bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 font-bold text-xs">
              🖼️
            </div>
            <span className="text-[10px] font-semibold leading-none">Định dạng nền</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Tùy chỉnh
        </span>
      </div>

      {/* ── 4. Group: Ý TƯỞNG THIẾT KẾ (Designer AI) ────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <button
          className={`h-14 px-3.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${isDesignerOpen ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-105' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
          onClick={onToggleDesigner}
          title="Mở bảng trợ lý Designer AI gợi ý bố cục thông minh"
        >
          <div className="flex items-center gap-1">
            <IconSparkles size={16} className={isDesignerOpen ? 'text-white animate-spin' : 'text-orange-500'} />
            <IconAI size={14} className={isDesignerOpen ? 'text-white' : 'text-amber-500'} />
          </div>
          <span className="text-[10px] font-bold leading-none">Ý tưởng thiết kế</span>
        </button>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Designer
        </span>
      </div>

      {/* ── Format Background Modal Dialog ────────────────────────── */}
      {showFormatBgModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🖼️</span>
                <h3 className="text-sm font-bold text-foreground">Định dạng Nền (Format Background)</h3>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                onClick={() => setShowFormatBgModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Background Type Tabs */}
            <div className="flex border-b border-border text-xs font-semibold">
              <button
                className={`flex-1 py-1.5 border-b-2 transition-colors ${bgTab === 'solid' ? 'border-orange-500 text-orange-600' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setBgTab('solid')}
              >
                Tô Đơn sắc
              </button>
              <button
                className={`flex-1 py-1.5 border-b-2 transition-colors ${bgTab === 'gradient' ? 'border-orange-500 text-orange-600' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setBgTab('gradient')}
              >
                Tô Chuyển sắc
              </button>
              <button
                className={`flex-1 py-1.5 border-b-2 transition-colors ${bgTab === 'image' ? 'border-orange-500 text-orange-600' : 'border-transparent text-muted-foreground'}`}
                onClick={() => setBgTab('image')}
              >
                Tô bằng Ảnh
              </button>
            </div>

            {/* Tab: Solid Fill */}
            {bgTab === 'solid' && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Chọn màu đơn sắc:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customSolidColor}
                    onChange={(e) => setCustomSolidColor(e.target.value)}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customSolidColor}
                    onChange={(e) => setCustomSolidColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Tab: Gradient Fill */}
            {bgTab === 'gradient' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Màu bắt đầu:</span>
                  <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Màu kết thúc:</span>
                  <input
                    type="color"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Góc xoay ({gradientAngle}°):</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                    className="w-32 accent-orange-600"
                  />
                </div>

                {/* Preview Box */}
                <div
                  className="h-16 rounded-xl border border-border shadow-inner"
                  style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)` }}
                />
              </div>
            )}

            {/* Tab: Image Fill */}
            {bgTab === 'image' && (
              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors text-orange-600"
                  onClick={() => bgFileInputRef.current?.click()}
                >
                  <IconUpload size={14} />
                  <span>Tải ảnh nền từ máy tính...</span>
                </button>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Hoặc nhập link URL ảnh nền:</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={onlineBgUrl}
                    onChange={(e) => setOnlineBgUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-border rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="applyAll"
                checked={applyAllSlides}
                onChange={(e) => setApplyAllSlides(e.target.checked)}
                className="accent-orange-600"
              />
              <label htmlFor="applyAll" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                Áp dụng cho tất cả các trang chiếu (Apply to All)
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                onClick={() => {
                  onApplyBackground('#ffffff', applyAllSlides);
                  setShowFormatBgModal(false);
                }}
              >
                Đặt lại nền trắng
              </button>

              <button
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow transition-colors"
                onClick={() => {
                  if (bgTab === 'solid') {
                    onApplyBackground(customSolidColor, applyAllSlides);
                  } else if (bgTab === 'gradient') {
                    onApplyBackground(`linear-gradient(${gradientAngle}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`, applyAllSlides);
                  } else if (bgTab === 'image' && onlineBgUrl.trim()) {
                    onApplyBackground(`url('${onlineBgUrl.trim()}') center / cover no-repeat`, applyAllSlides);
                  }
                  setShowFormatBgModal(false);
                }}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
