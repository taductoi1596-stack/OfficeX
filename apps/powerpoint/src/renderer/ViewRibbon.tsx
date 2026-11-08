import React, { useState } from 'react';
import { Button } from '@officex/ui';
import { 
  IconChevronDown, 
  IconCheck,
  IconGrowFont,
  IconShrinkFont
} from '@officex/icons';

interface ViewRibbonProps {
  currentView: 'normal' | 'sorter' | 'notes' | 'reading';
  onChangeView: (view: 'normal' | 'sorter' | 'notes' | 'reading') => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  showNotesDrawer: boolean;
  onToggleNotesDrawer: () => void;
  zoomLevel: number;
  onSetZoomLevel: (zoom: number) => void;
  onFitToWindow: () => void;
  colorMode: 'color' | 'grayscale' | 'blackAndWhite';
  onChangeColorMode: (mode: 'color' | 'grayscale' | 'blackAndWhite') => void;
}

export const ViewRibbon: React.FC<ViewRibbonProps> = ({
  currentView,
  onChangeView,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showGuides,
  onToggleGuides,
  showNotesDrawer,
  onToggleNotesDrawer,
  zoomLevel,
  onSetZoomLevel,
  onFitToWindow,
  colorMode,
  onChangeColorMode,
}) => {
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      {/* ── 1. Group: CHẾ ĐỘ XEM BẢN TRÌNH BÀY (Presentation Views) ── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Normal View */}
          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${currentView === 'normal' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeView('normal')}
            title="Chế độ xem thông thường với cây trang chiếu và khung vẽ"
          >
            <span className="text-base leading-none">📄</span>
            <span className="text-[10px] font-semibold leading-none">Bình thường</span>
          </button>

          {/* Slide Sorter View */}
          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${currentView === 'sorter' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeView('sorter')}
            title="Bộ sắp xếp trang chiếu dạng lưới"
          >
            <span className="text-base leading-none">🗂️</span>
            <span className="text-[10px] font-semibold leading-none">Bộ sắp xếp</span>
          </button>

          {/* Notes Page */}
          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${currentView === 'notes' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeView('notes')}
            title="Trang ghi chú của người thuyết trình"
          >
            <span className="text-base leading-none">📝</span>
            <span className="text-[10px] font-semibold leading-none">Trang ghi chú</span>
          </button>

          {/* Reading View */}
          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${currentView === 'reading' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeView('reading')}
            title="Chế độ đọc toàn màn hình tinh gọn"
          >
            <span className="text-base leading-none">📖</span>
            <span className="text-[10px] font-semibold leading-none">Chế độ đọc</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Chế độ xem
        </span>
      </div>

      {/* ── 2. Group: HIỂN THỊ (Show) ───────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={onToggleRuler}
              className="accent-orange-600 rounded"
            />
            <span>Thước đo (Ruler)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={onToggleGridlines}
              className="accent-orange-600 rounded"
            />
            <span>Lưới (Gridlines)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={onToggleGuides}
              className="accent-orange-600 rounded"
            />
            <span>Đường dẫn (Guides)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
            <input
              type="checkbox"
              checked={showNotesDrawer}
              onChange={onToggleNotesDrawer}
              className="accent-orange-600 rounded"
            />
            <span>Ghi chú (Notes)</span>
          </label>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Hiển thị
        </span>
      </div>

      {/* ── 3. Group: THU PHÓNG (Zoom) ──────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Zoom Level Button */}
          <div className="relative">
            <button
              className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowZoomMenu(!showZoomMenu)}
              title="Tùy chỉnh tỷ lệ thu phóng"
            >
              <span className="text-xs font-bold font-mono">{zoomLevel}%</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Thu phóng</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showZoomMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 animate-in fade-in duration-100">
                {[50, 66, 75, 100, 125, 150, 200].map(z => (
                  <button
                    key={z}
                    className="w-full px-2 py-1.5 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors font-mono"
                    onClick={() => {
                      onSetZoomLevel(z);
                      setShowZoomMenu(false);
                    }}
                  >
                    <span>{z}%</span>
                    {zoomLevel === z && <IconCheck size={12} className="text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fit to Window */}
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={onFitToWindow}
            title="Tự động thu phóng vừa vặn khung hình cửa sổ"
          >
            <span className="text-base leading-none">🔳</span>
            <span className="text-[10px] font-semibold leading-none">Vừa cửa sổ</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Thu phóng
        </span>
      </div>

      {/* ── 4. Group: MÀU SẮC (Color Mode) ─────────────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <div className="flex items-center gap-1">
          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${colorMode === 'color' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeColorMode('color')}
            title="Chế độ hiển thị đầy đủ màu sắc (Color)"
          >
            <span className="text-base leading-none">🌈</span>
            <span className="text-[10px] font-semibold leading-none">Màu sắc</span>
          </button>

          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${colorMode === 'grayscale' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeColorMode('grayscale')}
            title="Chế độ hiển thị Thang độ xám (Grayscale)"
          >
            <span className="text-base leading-none">🔲</span>
            <span className="text-[10px] font-semibold leading-none">Thang xám</span>
          </button>

          <button
            className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${colorMode === 'blackAndWhite' ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => onChangeColorMode('blackAndWhite')}
            title="Chế độ hiển thị Đen trắng thuần túy (Black & White)"
          >
            <span className="text-base leading-none">⬛</span>
            <span className="text-[10px] font-semibold leading-none">Đen trắng</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Màu sắc
        </span>
      </div>
    </div>
  );
};
