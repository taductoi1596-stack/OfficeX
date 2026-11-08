import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { 
  IconChevronDown, 
  IconCheck,
  IconSparkles,
  IconTrash
} from '@officex/icons';
import { Shape, ShapeAnimation } from '@officex/presentation-core';

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'emphasis' | 'exit' | 'motion';
  icon: string;
  desc: string;
  defaultDuration: number;
  effectOptions?: { id: string; name: string; icon: string }[];
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ── 1. Entrance (Lối vào / Màu xanh lá) ──────────────────────────
  { id: 'appear', name: 'Xuất hiện (Appear)', category: 'entrance', icon: '🟢', desc: 'Hiện ra ngay lập tức', defaultDuration: 0.5 },
  { id: 'fade-in', name: 'Mờ dần (Fade In)', category: 'entrance', icon: '🟢', desc: 'Mờ dần hiện rõ', defaultDuration: 0.75 },
  { 
    id: 'fly-in', 
    name: 'Bay vào (Fly In)', 
    category: 'entrance', 
    icon: '🟢', 
    desc: 'Bay từ ngoài mép màn hình vào vị trí', 
    defaultDuration: 0.75,
    effectOptions: [
      { id: 'from-bottom', name: 'Từ dưới lên', icon: '⬆️' },
      { id: 'from-left', name: 'Từ trái sang', icon: '➡️' },
      { id: 'from-right', name: 'Từ phải sang', icon: '⬅️' },
      { id: 'from-top', name: 'Từ trên xuống', icon: '⬇️' }
    ]
  },
  { 
    id: 'float-in', 
    name: 'Nổi lên (Float In)', 
    category: 'entrance', 
    icon: '🟢', 
    desc: 'Nổi nhẹ nhàng vào vị trí', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'float-up', name: 'Nổi lên trên', icon: '⬆️' },
      { id: 'float-down', name: 'Nổi xuống dưới', icon: '⬇️' }
    ]
  },
  { 
    id: 'split', 
    name: 'Tách đôi (Split)', 
    category: 'entrance', 
    icon: '🟢', 
    desc: 'Mở rộng từ tâm ra hai bên', 
    defaultDuration: 0.75,
    effectOptions: [
      { id: 'vertical-out', name: 'Dọc mở ra', icon: '↔️' },
      { id: 'horizontal-out', name: 'Ngang mở ra', icon: '↕️' }
    ]
  },
  { 
    id: 'wipe', 
    name: 'Lướt qua (Wipe)', 
    category: 'entrance', 
    icon: '🟢', 
    desc: 'Quét dần qua đối tượng', 
    defaultDuration: 0.75,
    effectOptions: [
      { id: 'from-bottom', name: 'Từ dưới lên', icon: '⬆️' },
      { id: 'from-left', name: 'Từ trái sang', icon: '➡️' },
      { id: 'from-right', name: 'Từ phải sang', icon: '⬅️' },
      { id: 'from-top', name: 'Từ trên xuống', icon: '⬇️' }
    ]
  },
  { 
    id: 'zoom-in', 
    name: 'Thu phóng (Zoom In)', 
    category: 'entrance', 
    icon: '🟢', 
    desc: 'Phóng to từ tâm màn hình', 
    defaultDuration: 0.75,
    effectOptions: [
      { id: 'object-center', name: 'Tâm đối tượng', icon: '🎯' },
      { id: 'slide-center', name: 'Tâm trang chiếu', icon: '🔲' }
    ]
  },
  { id: 'bounce', name: 'Bật nảy (Bounce)', category: 'entrance', icon: '🟢', desc: 'Rơi xuống và nảy tung tăng sinh động', defaultDuration: 1.0 },

  // ── 2. Emphasis (Nhấn mạnh / Màu vàng) ───────────────────────────
  { id: 'pulse', name: 'Xung lực (Pulse)', category: 'emphasis', icon: '🟡', desc: 'Nhấp nháy co giãn nhẹ thu hút chú ý', defaultDuration: 0.5 },
  { id: 'color-pulse', name: 'Đổi màu (Color Pulse)', category: 'emphasis', icon: '🟡', desc: 'Ánh lên dải màu rực rỡ', defaultDuration: 0.75 },
  { 
    id: 'spin', 
    name: 'Xoay tròn (Spin)', 
    category: 'emphasis', 
    icon: '🟡', 
    desc: 'Xoay quanh tâm $360^\\circ$', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'full-spin', name: 'Xoay trọn 1 vòng (360°)', icon: '🔄' },
      { id: 'half-spin', name: 'Xoay nửa vòng (180°)', icon: '↩️' },
      { id: 'counter-clockwise', name: 'Xoay ngược chiều kim đồng hồ', icon: '🔃' }
    ]
  },
  { 
    id: 'grow-shrink', 
    name: 'Phóng to / Thu nhỏ (Grow/Shrink)', 
    category: 'emphasis', 
    icon: '🟡', 
    desc: 'Phóng to nhấn mạnh rồi thu lại', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'huge', name: 'Rất lớn (150%)', icon: '➕' },
      { id: 'tiny', name: 'Nhỏ lại (50%)', icon: '➖' }
    ]
  },
  { id: 'teeter', name: 'Lắc lư (Teeter)', category: 'emphasis', icon: '🟡', desc: 'Lắc qua lắc lại sống động', defaultDuration: 0.75 },

  // ── 3. Exit (Lối ra / Màu đỏ) ────────────────────────────────────
  { id: 'disappear', name: 'Biến mất (Disappear)', category: 'exit', icon: '🔴', desc: 'Biến mất ngay lập tức', defaultDuration: 0.5 },
  { id: 'fade-out', name: 'Mờ dần thoát (Fade Out)', category: 'exit', icon: '🔴', desc: 'Mờ dần rồi biến mất', defaultDuration: 0.75 },
  { 
    id: 'fly-out', 
    name: 'Bay ra ngoài (Fly Out)', 
    category: 'exit', 
    icon: '🔴', 
    desc: 'Bay vút ra ngoài mép màn hình', 
    defaultDuration: 0.75,
    effectOptions: [
      { id: 'to-bottom', name: 'Xuống dưới đáy', icon: '⬇️' },
      { id: 'to-left', name: 'Sang bên trái', icon: '⬅️' },
      { id: 'to-right', name: 'Sang bên phải', icon: '➡️' },
      { id: 'to-top', name: 'Lên đỉnh màn hình', icon: '⬆️' }
    ]
  },
  { id: 'zoom-out', name: 'Thu nhỏ thoát (Zoom Out)', category: 'exit', icon: '🔴', desc: 'Thu nhỏ dần biến mất', defaultDuration: 0.75 },
];

interface AnimationsRibbonProps {
  selectedShape: Shape | null;
  onApplyAnimation: (anim: ShapeAnimation | null) => void;
  onPreviewAnimation: () => void;
  onToggleAnimationPane: () => void;
  isAnimationPaneOpen: boolean;
}

export const AnimationsRibbon: React.FC<AnimationsRibbonProps> = ({
  selectedShape,
  onApplyAnimation,
  onPreviewAnimation,
  onToggleAnimationPane,
  isAnimationPaneOpen,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [showEffectOptions, setShowEffectOptions] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (galleryRef.current && !galleryRef.current.contains(e.target as Node)) setShowGallery(false);
      if (effectRef.current && !effectRef.current.contains(e.target as Node)) setShowEffectOptions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentAnim = selectedShape?.animation;
  const activePreset = currentAnim ? ANIMATION_PRESETS.find(p => p.id === currentAnim.type) : null;

  const previewStrip = [
    ANIMATION_PRESETS.find(p => p.id === 'appear')!,
    ANIMATION_PRESETS.find(p => p.id === 'fade-in')!,
    ANIMATION_PRESETS.find(p => p.id === 'fly-in')!,
    ANIMATION_PRESETS.find(p => p.id === 'zoom-in')!,
    ANIMATION_PRESETS.find(p => p.id === 'pulse')!,
    ANIMATION_PRESETS.find(p => p.id === 'spin')!,
  ];

  const handleSelectPreset = (preset: AnimationPreset) => {
    if (!selectedShape) return;
    const newAnim: ShapeAnimation = {
      id: preset.id,
      type: preset.id,
      category: preset.category,
      duration: preset.defaultDuration || 0.75,
      delay: 0,
      trigger: 'onClick',
      effectOption: preset.effectOptions?.[0]?.id,
    };
    onApplyAnimation(newAnim);
  };

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      {/* ── 1. Group: XEM TRƯỚC (Preview) ──────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <button
          disabled={!selectedShape}
          className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40"
          onClick={onPreviewAnimation}
          title="Xem trước hoạt hình đối tượng đang chọn"
        >
          <div className="w-6 h-5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 flex items-center justify-center text-emerald-600">
            <span className="text-xs">▶</span>
          </div>
          <span className="text-[10px] font-semibold leading-none">Xem trước</span>
        </button>
        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Xem trước
        </span>
      </div>

      {/* ── 2. Group: HOẠT HÌNH (Animation Gallery) ─────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Quick Preview Strip */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-border">
            {/* None Option */}
            <button
              disabled={!selectedShape}
              className={`w-12 h-12 rounded border flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 shadow-xs ${!currentAnim ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500/50' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-orange-500 text-slate-800 dark:text-slate-200'}`}
              onClick={() => onApplyAnimation(null)}
              title="Không có hoạt hình"
            >
              <span className="text-base leading-none">🚫</span>
              <span className="text-[8px] font-bold">Không</span>
            </button>

            {previewStrip.map((preset) => {
              const isSelected = currentAnim?.type === preset.id;
              return (
                <button
                  key={preset.id}
                  disabled={!selectedShape}
                  className={`w-14 h-12 rounded border flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 shadow-xs disabled:opacity-40 ${isSelected ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500/50' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-orange-500 text-slate-800 dark:text-slate-200'}`}
                  onClick={() => handleSelectPreset(preset)}
                  title={`${preset.name}: ${preset.desc}`}
                >
                  <span className="text-base leading-none">{preset.icon}</span>
                  <span className="text-[9px] font-bold truncate max-w-[50px] leading-tight">{preset.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Expand Full Animations Gallery Dropdown Button */}
          <div className="relative" ref={galleryRef}>
            <button
              disabled={!selectedShape}
              className={`h-14 px-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all disabled:opacity-40 ${showGallery ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowGallery(!showGallery)}
              title="Mở toàn bộ Thư viện Hoạt hình đối tượng"
            >
              <div className="w-4 h-3 border border-current rounded-xs flex items-center justify-center text-[8px] font-bold text-emerald-500">
                ★
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[9px] font-bold">Thêm</span>
                <IconChevronDown size={8} className={showGallery ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {/* Animations Gallery Dropdown */}
            {showGallery && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-[560px] max-h-[500px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col animate-in fade-in duration-150">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-emerald-500">🟢</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      THƯ VIỆN HOẠT HÌNH (ANIMATIONS)
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">{ANIMATION_PRESETS.length} Hiệu ứng</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[400px]">
                  {/* Entrance */}
                  <div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 border-b pb-1 flex items-center gap-1.5">
                      <span>🟢 Lối vào (Entrance)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ANIMATION_PRESETS.filter(p => p.category === 'entrance').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all hover:scale-105 ${currentAnim?.type === preset.id ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-sm">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name.split(' ')[0]}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emphasis */}
                  <div>
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 border-b pb-1 flex items-center gap-1.5">
                      <span>🟡 Nhấn mạnh (Emphasis)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ANIMATION_PRESETS.filter(p => p.category === 'emphasis').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all hover:scale-105 ${currentAnim?.type === preset.id ? 'bg-amber-500 text-white border-amber-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-sm">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name.split(' ')[0]}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exit */}
                  <div>
                    <div className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-2 border-b pb-1 flex items-center gap-1.5">
                      <span>🔴 Lối ra (Exit)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ANIMATION_PRESETS.filter(p => p.category === 'exit').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all hover:scale-105 ${currentAnim?.type === preset.id ? 'bg-rose-500 text-white border-rose-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-rose-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-sm">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name.split(' ')[0]}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 transition-colors"
                    onClick={() => {
                      onApplyAnimation(null);
                      setShowGallery(false);
                    }}
                  >
                    <IconTrash size={13} />
                    <span>Xóa Hoạt hình</span>
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
          </div>

          {/* Effect Options Button */}
          <div className="relative" ref={effectRef}>
            <button
              disabled={!activePreset?.effectOptions || activePreset.effectOptions.length === 0}
              className={`h-14 px-2.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${showEffectOptions ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none'}`}
              onClick={() => setShowEffectOptions(!showEffectOptions)}
              title="Tùy chọn hướng hiệu ứng"
            >
              <div className="text-sm font-bold leading-none">⚙️</div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Tùy chọn</span>
                <IconChevronDown size={8} className={showEffectOptions ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showEffectOptions && activePreset?.effectOptions && currentAnim && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  HƯỚNG HIỆU ỨNG
                </div>
                {activePreset.effectOptions.map(opt => (
                  <button
                    key={opt.id}
                    className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors"
                    onClick={() => {
                      onApplyAnimation({ ...currentAnim, effectOption: opt.id });
                      setShowEffectOptions(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </div>
                    {currentAnim.effectOption === opt.id && <IconCheck size={13} className="text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Hoạt hình
        </span>
      </div>

      {/* ── 3. Group: THỜI GIAN (Timing) & ANIMATION PANE ────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <div className="flex items-center gap-3">
          {/* Animation Pane Button */}
          <button
            className={`h-14 px-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${isAnimationPaneOpen ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={onToggleAnimationPane}
            title="Mở Ngăn Hoạt hình (Animation Pane) sắp xếp thứ tự"
          >
            <div className="text-base leading-none">📋</div>
            <span className="text-[10px] font-bold leading-none">Ngăn hoạt hình</span>
          </button>

          {/* Trigger, Duration & Delay Controls */}
          {currentAnim && (
            <div className="flex flex-col gap-1 text-[11px] border-l border-border pl-3">
              {/* Trigger */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-12 text-right">Bắt đầu:</span>
                <select
                  value={currentAnim.trigger}
                  onChange={(e) => onApplyAnimation({ ...currentAnim, trigger: e.target.value as any })}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-border rounded text-xs font-semibold outline-none"
                >
                  <option value="onClick">Khi nhấp chuột</option>
                  <option value="withPrev">Cùng lúc với trước đó</option>
                  <option value="afterPrev">Sau khi kết thúc trước đó</option>
                </select>
              </div>

              {/* Duration & Delay */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground w-12 text-right">Thời lượng:</span>
                  <input
                    type="number"
                    step={0.25}
                    min={0.1}
                    max={10.0}
                    value={currentAnim.duration}
                    onChange={(e) => onApplyAnimation({ ...currentAnim, duration: Math.max(0.1, parseFloat(e.target.value) || 0.75) })}
                    className="w-14 px-1 py-0.2 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center text-xs font-bold"
                  />
                  <span className="text-[10px] text-muted-foreground">s</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Độ trễ:</span>
                  <input
                    type="number"
                    step={0.25}
                    min={0}
                    max={10.0}
                    value={currentAnim.delay}
                    onChange={(e) => onApplyAnimation({ ...currentAnim, delay: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-14 px-1 py-0.2 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center text-xs font-bold"
                  />
                  <span className="text-[10px] text-muted-foreground">s</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Thời gian
        </span>
      </div>
    </div>
  );
};
