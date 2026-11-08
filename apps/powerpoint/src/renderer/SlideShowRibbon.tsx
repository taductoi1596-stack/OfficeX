import React, { useState } from 'react';
import { Button } from '@officex/ui';
import { 
  IconChevronDown, 
  IconCheck,
  IconReadAloud
} from '@officex/icons';
import { Slide } from '@officex/presentation-core';

interface SlideShowRibbonProps {
  onStartFromBeginning: () => void;
  onStartFromCurrent: () => void;
  onToggleHideSlide: () => void;
  isCurrentSlideHidden?: boolean;
  onStartRehearsal: () => void;
  onTogglePresenterMode: () => void;
  isPresenterMode: boolean;
}

export const SlideShowRibbon: React.FC<SlideShowRibbonProps> = ({
  onStartFromBeginning,
  onStartFromCurrent,
  onToggleHideSlide,
  isCurrentSlideHidden,
  onStartRehearsal,
  onTogglePresenterMode,
  isPresenterMode,
}) => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [loopContinuously, setLoopContinuously] = useState(false);
  const [showWithNarration, setShowWithNarration] = useState(true);
  const [showWithAnimation, setShowWithAnimation] = useState(true);

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      {/* ── 1. Group: BẮT ĐẦU TRÌNH CHIẾU (Start Slide Show) ────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* From Beginning */}
          <button
            className="h-14 px-3 bg-background hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all group"
            onClick={onStartFromBeginning}
            title="Bắt đầu trình chiếu từ trang đầu tiên (F5)"
          >
            <div className="w-6 h-5 rounded bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold">🖥️</span>
            </div>
            <span className="text-[10px] font-bold leading-none group-hover:text-orange-600">Từ đầu (F5)</span>
          </button>

          {/* From Current Slide */}
          <button
            className="h-14 px-3 bg-background hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all group"
            onClick={onStartFromCurrent}
            title="Bắt đầu trình chiếu từ trang chiếu đang chọn (Shift+F5)"
          >
            <div className="w-6 h-5 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold">📍</span>
            </div>
            <span className="text-[10px] font-bold leading-none group-hover:text-orange-600">Từ trang hiện tại</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Bắt đầu Trình chiếu
        </span>
      </div>

      {/* ── 2. Group: THIẾT LẬP (Set Up) ────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Set Up Show */}
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={() => setShowSetupModal(true)}
            title="Thiết lập các tùy chọn nâng cao cho bài trình chiếu"
          >
            <span className="text-base leading-none">⚙️</span>
            <span className="text-[10px] font-semibold leading-none">Thiết lập</span>
          </button>

          {/* Hide Slide Toggle */}
          <button
            className={`h-14 px-3 rounded flex flex-col items-center justify-center gap-1 border transition-all ${isCurrentSlideHidden ? 'bg-red-500 text-white border-red-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={onToggleHideSlide}
            title="Ẩn trang chiếu này trong khi trình chiếu"
          >
            <span className="text-base leading-none">{isCurrentSlideHidden ? '🙈' : '👁️'}</span>
            <span className="text-[10px] font-semibold leading-none">
              {isCurrentSlideHidden ? 'Đã ẩn slide' : 'Ẩn trang chiếu'}
            </span>
          </button>

          {/* Rehearse Timings */}
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={onStartRehearsal}
            title="Thử trước thời gian thuyết trình với đồng hồ bấm giờ"
          >
            <span className="text-base leading-none">⏱️</span>
            <span className="text-[10px] font-semibold leading-none">Thử thời gian</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Thiết lập
        </span>
      </div>

      {/* ── 3. Group: MÀN HÌNH (Monitors) ──────────────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <button
          className={`h-14 px-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${isPresenterMode ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
          onClick={onTogglePresenterMode}
          title="Bật chế độ xem Người thuyết trình (kèm ghi chú và trang tiếp theo)"
        >
          <div className="text-base leading-none">👔</div>
          <span className="text-[10px] font-bold leading-none">Người thuyết trình</span>
        </button>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Màn hình
        </span>
      </div>

      {/* ── Set Up Show Modal Dialog ──────────────────────────────── */}
      {showSetupModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="text-sm font-bold text-foreground">Thiết lập Trình chiếu (Set Up Show)</h3>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                onClick={() => setShowSetupModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                TÙY CHỌN TRÌNH CHIẾU
              </div>

              <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                <input
                  type="checkbox"
                  checked={loopContinuously}
                  onChange={(e) => setLoopContinuously(e.target.checked)}
                  className="accent-orange-600 rounded"
                />
                <span>Lặp liên tục cho đến khi bấm 'Esc' (Kiosk Mode)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                <input
                  type="checkbox"
                  checked={showWithNarration}
                  onChange={(e) => setShowWithNarration(e.target.checked)}
                  className="accent-orange-600 rounded"
                />
                <span>Phát kèm giọng đọc thuyết minh & âm thanh</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                <input
                  type="checkbox"
                  checked={showWithAnimation}
                  onChange={(e) => setShowWithAnimation(e.target.checked)}
                  className="accent-orange-600 rounded"
                />
                <span>Phát đầy đủ hiệu ứng Hoạt hình (Animations)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow transition-colors"
                onClick={() => setShowSetupModal(false)}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
