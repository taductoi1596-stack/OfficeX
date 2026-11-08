import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { 
  IconChevronDown, 
  IconCheck,
  IconReadAloud,
  IconSparkles
} from '@officex/icons';
import { SlideTransition } from '@officex/presentation-core';

export interface TransitionPreset {
  id: string;
  name: string;
  category: 'none' | 'subtle' | 'exciting' | 'dynamic';
  icon: string;
  desc: string;
  defaultDuration: number;
  effectOptions?: { id: string; name: string; icon: string }[];
}

export const TRANSITION_PRESETS: TransitionPreset[] = [
  // 1. None
  { id: 'none', name: 'Không có (None)', category: 'none', icon: '🚫', desc: 'Chuyển trang tức thì không hiệu ứng', defaultDuration: 0 },

  // 2. Subtle (Tế nhị)
  { 
    id: 'morph', 
    name: 'Morph (Hình thái học)', 
    category: 'subtle', 
    icon: '✨', 
    desc: 'Hiệu ứng chuyển đổi hình thể và vị trí thông minh', 
    defaultDuration: 1.5,
    effectOptions: [
      { id: 'objects', name: 'Theo Đối tượng', icon: '◻️' },
      { id: 'words', name: 'Theo Từ ngữ', icon: '🔤' },
      { id: 'characters', name: 'Theo Ký tự', icon: '🔠' }
    ]
  },
  { 
    id: 'fade', 
    name: 'Mờ dần (Fade)', 
    category: 'subtle', 
    icon: '🌫️', 
    desc: 'Chuyển cảnh mờ dần sang trang chiếu mới êm ái', 
    defaultDuration: 0.8,
    effectOptions: [
      { id: 'smooth', name: 'Mịn màng', icon: '〰️' },
      { id: 'through-black', name: 'Qua màu đen', icon: '⬛' }
    ]
  },
  { 
    id: 'push', 
    name: 'Đẩy (Push)', 
    category: 'subtle', 
    icon: '⏩', 
    desc: 'Đẩy trang chiếu hiện tại ra ngoài', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'from-bottom', name: 'Từ dưới lên', icon: '⬆️' },
      { id: 'from-left', name: 'Từ trái sang', icon: '➡️' },
      { id: 'from-right', name: 'Từ phải sang', icon: '⬅️' },
      { id: 'from-top', name: 'Từ trên xuống', icon: '⬇️' }
    ]
  },
  { 
    id: 'wipe', 
    name: 'Lướt qua (Wipe)', 
    category: 'subtle', 
    icon: '🧹', 
    desc: 'Lướt theo vệt quét qua màn hình', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'from-right', name: 'Từ phải sang trái', icon: '⬅️' },
      { id: 'from-left', name: 'Từ trái sang phải', icon: '➡️' },
      { id: 'from-top', name: 'Từ trên xuống dưới', icon: '⬇️' },
      { id: 'from-bottom', name: 'Từ dưới lên trên', icon: '⬆️' }
    ]
  },
  { 
    id: 'split', 
    name: 'Tách đôi (Split)', 
    category: 'subtle', 
    icon: '↔️', 
    desc: 'Mở rộng hoặc khép lại từ giữa trang', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'vertical-out', name: 'Dọc mở ra ngoài', icon: '↔️' },
      { id: 'vertical-in', name: 'Dọc khép vào trong', icon: '><' },
      { id: 'horizontal-out', name: 'Ngang mở ra ngoài', icon: '↕️' },
      { id: 'horizontal-in', name: 'Ngang khép vào trong', icon: '🠿🠽' }
    ]
  },
  { 
    id: 'bars', 
    name: 'Thanh ngang (Bars)', 
    category: 'subtle', 
    icon: '📶', 
    desc: 'Dải thanh song song hiện dần', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'horizontal', name: 'Thanh ngang', icon: '☰' },
      { id: 'vertical', name: 'Thanh dọc', icon: '☱' }
    ]
  },
  { 
    id: 'reveal', 
    name: 'Hiển thị (Reveal)', 
    category: 'subtle', 
    icon: '👁️', 
    desc: 'Lột bỏ trang chiếu cũ để lộ trang mới', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'from-right', name: 'Từ phải sang', icon: '⬅️' },
      { id: 'from-left', name: 'Từ trái sang', icon: '➡️' }
    ]
  },

  // 3. Exciting (Hấp dẫn & Nổi bật)
  { 
    id: 'zoom', 
    name: 'Thu phóng (Zoom)', 
    category: 'exciting', 
    icon: '🔍', 
    desc: 'Phóng to hoặc thu nhỏ từ tâm', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'in', name: 'Phóng to vào trong', icon: '➕' },
      { id: 'out', name: 'Thu nhỏ ra ngoài', icon: '➖' }
    ]
  },
  { 
    id: 'wheel', 
    name: 'Cánh quạt (Wheel)', 
    category: 'exciting', 
    icon: '🎡', 
    desc: 'Quay vòng nan quạt từ tâm', 
    defaultDuration: 1.2,
    effectOptions: [
      { id: '1-spoke', name: '1 Cánh quạt', icon: '1️⃣' },
      { id: '2-spoke', name: '2 Cánh quạt', icon: '2️⃣' },
      { id: '4-spoke', name: '4 Cánh quạt', icon: '4️⃣' }
    ]
  },
  { id: 'dissolve', name: 'Hòa trộn (Dissolve)', category: 'exciting', icon: '✨', desc: 'Hàng triệu điểm ảnh hòa trộn pixel', defaultDuration: 1.2 },
  { id: 'checkerboard', name: 'Bàn cờ (Checkerboard)', category: 'exciting', icon: '🏁', desc: 'Ô cờ caro lật mở linh hoạt', defaultDuration: 1.5 },
  { id: 'curtains', name: 'Rèm mở (Curtains)', category: 'exciting', icon: '🎭', desc: 'Rèm sân khấu kéo sang hai bên rực rỡ', defaultDuration: 2.0 },
  { id: 'wind', name: 'Gió cuốn (Wind)', category: 'exciting', icon: '💨', desc: 'Gió thổi bay các mảnh slide sinh động', defaultDuration: 1.5 },

  // 4. Dynamic Content (Năng động)
  { 
    id: 'rotate', 
    name: 'Xoay tròn (Rotate)', 
    category: 'dynamic', 
    icon: '🔄', 
    desc: 'Xoay quanh trục không gian 3D', 
    defaultDuration: 1.2,
    effectOptions: [
      { id: 'from-right', name: 'Xoay từ phải', icon: '↩️' },
      { id: 'from-left', name: 'Xoay từ trái', icon: '↪️' }
    ]
  },
  { 
    id: 'flip', 
    name: 'Lật trang (Flip)', 
    category: 'dynamic', 
    icon: '📖', 
    desc: 'Lật qua trang mới như cuốn sách', 
    defaultDuration: 1.0,
    effectOptions: [
      { id: 'left', name: 'Lật sang trái', icon: '◀️' },
      { id: 'right', name: 'Lật sang phải', icon: '▶️' }
    ]
  },
  { 
    id: 'cube', 
    name: 'Khối 3D (Cube)', 
    category: 'dynamic', 
    icon: '🎲', 
    desc: 'Khối hộp lập phương không gian 3 chiều', 
    defaultDuration: 1.2,
    effectOptions: [
      { id: 'from-right', name: 'Từ bên phải', icon: '➡️' },
      { id: 'from-left', name: 'Từ bên trái', icon: '⬅️' },
      { id: 'from-top', name: 'Từ trên xuống', icon: '⬇️' },
      { id: 'from-bottom', name: 'Từ dưới lên', icon: '⬆️' }
    ]
  },
  { id: 'doors', name: 'Cửa mở (Doors)', category: 'dynamic', icon: '🚪', desc: 'Cánh cửa mở ra đón trang mới', defaultDuration: 1.4 },
  { id: 'conveyor', name: 'Băng chuyền (Conveyor)', category: 'dynamic', icon: '🔁', desc: 'Trượt ngang như băng chuyền triển lãm', defaultDuration: 1.3 },
];

export const TRANSITION_SOUNDS = [
  { id: 'none', name: '[Không có âm thanh]' },
  { id: 'applause', name: 'Vỗ tay (Applause)' },
  { id: 'bomb', name: 'Tiếng bom nổ (Bomb)' },
  { id: 'breeze', name: 'Gió lướt êm (Breeze)' },
  { id: 'camera', name: 'Máy ảnh chụp (Camera)' },
  { id: 'cash', name: 'Tiền xu (Cash Register)' },
  { id: 'chime', name: 'Chuông ngân (Chime)' },
  { id: 'click', name: 'Tiếng gõ phím (Click)' },
  { id: 'drum', name: 'Trống dồn (Drum Roll)' },
  { id: 'laser', name: 'Tia Laser (Laser)' },
  { id: 'push', name: 'Đẩy lướt (Push)' },
  { id: 'voltage', name: 'Điện áp (Voltage)' },
];

interface TransitionsRibbonProps {
  currentTransition?: SlideTransition;
  onPreviewTransition: () => void;
  onApplyTransition: (transition: SlideTransition) => void;
  onApplyToAllSlides: (transition: SlideTransition) => void;
}

export const TransitionsRibbon: React.FC<TransitionsRibbonProps> = ({
  currentTransition = { type: 'none', duration: 1.0, sound: 'none', advanceOnClick: true },
  onPreviewTransition,
  onApplyTransition,
  onApplyToAllSlides,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [showEffectOptions, setShowEffectOptions] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (galleryRef.current && !galleryRef.current.contains(e.target as Node)) setShowGallery(false);
      if (effectRef.current && !effectRef.current.contains(e.target as Node)) setShowEffectOptions(false);
      if (soundRef.current && !soundRef.current.contains(e.target as Node)) setShowSoundMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePreset = TRANSITION_PRESETS.find(p => p.id === currentTransition.type) || TRANSITION_PRESETS[0];

  const previewStrip = [
    TRANSITION_PRESETS.find(p => p.id === 'none')!,
    TRANSITION_PRESETS.find(p => p.id === 'morph')!,
    TRANSITION_PRESETS.find(p => p.id === 'fade')!,
    TRANSITION_PRESETS.find(p => p.id === 'push')!,
    TRANSITION_PRESETS.find(p => p.id === 'wipe')!,
    TRANSITION_PRESETS.find(p => p.id === 'split')!,
  ];

  const handleSelectPreset = (preset: TransitionPreset) => {
    const newTransition: SlideTransition = {
      ...currentTransition,
      type: preset.id,
      duration: preset.defaultDuration || 1.0,
      effectOption: preset.effectOptions?.[0]?.id,
    };
    onApplyTransition(newTransition);
  };

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none bg-card">
      {/* ── 1. Group: XEM TRƯỚC (Preview) ──────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <button
          className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
          onClick={onPreviewTransition}
          title="Xem trước hiệu ứng chuyển tiếp của trang chiếu này"
        >
          <div className="w-6 h-5 rounded bg-orange-100 dark:bg-orange-950/60 border border-orange-500 flex items-center justify-center text-orange-600">
            <span className="text-xs">▶</span>
          </div>
          <span className="text-[10px] font-semibold leading-none">Xem trước</span>
        </button>
        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Xem trước
        </span>
      </div>

      {/* ── 2. Group: CHUYỂN TIẾP ĐẾN TRANG CHIẾU NÀY (Transition Gallery) ─ */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Quick Preview Strip */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-border">
            {previewStrip.map((preset) => {
              const isSelected = currentTransition.type === preset.id;
              return (
                <button
                  key={preset.id}
                  className={`w-14 h-12 rounded border flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 shadow-xs ${isSelected ? 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-500/50' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-orange-500 text-slate-800 dark:text-slate-200'}`}
                  onClick={() => handleSelectPreset(preset)}
                  title={`${preset.name}: ${preset.desc}`}
                >
                  <span className="text-base leading-none">{preset.icon}</span>
                  <span className="text-[9px] font-bold truncate max-w-[50px] leading-tight">{preset.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Expand Full Transitions Gallery Dropdown Button */}
          <div className="relative" ref={galleryRef}>
            <button
              className={`h-14 px-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${showGallery ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
              onClick={() => setShowGallery(!showGallery)}
              title="Mở toàn bộ Thư viện Hiệu ứng Chuyển tiếp"
            >
              <div className="w-4 h-3 border border-current rounded-xs flex items-center justify-center text-[8px] font-bold">
                ★
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[9px] font-bold">Thêm</span>
                <IconChevronDown size={8} className={showGallery ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {/* Transitions Gallery Dropdown */}
            {showGallery && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-[560px] max-h-[500px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl flex flex-col animate-in fade-in duration-150">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      THƯ VIỆN HIỆU ỨNG CHUYỂN TIẾP (TRANSITIONS)
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">{TRANSITION_PRESETS.length} Hiệu ứng</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[400px]">
                  {/* Subtle */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-1">
                      Tế nhị (Subtle)
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TRANSITION_PRESETS.filter(p => p.category === 'subtle').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all hover:scale-105 ${currentTransition.type === preset.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-orange-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-xl">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exciting */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-1">
                      Hấp dẫn & Nổi bật (Exciting)
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TRANSITION_PRESETS.filter(p => p.category === 'exciting').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all hover:scale-105 ${currentTransition.type === preset.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-orange-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-xl">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 border-b pb-1">
                      Năng động (Dynamic Content)
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TRANSITION_PRESETS.filter(p => p.category === 'dynamic').map(preset => (
                        <button
                          key={preset.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all hover:scale-105 ${currentTransition.type === preset.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-orange-500'}`}
                          onClick={() => {
                            handleSelectPreset(preset);
                            setShowGallery(false);
                          }}
                        >
                          <span className="text-xl">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name}</div>
                            <div className="text-[9px] opacity-75 truncate">{preset.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* None */}
                  <div>
                    <button
                      className="p-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 text-xs font-semibold text-muted-foreground flex items-center gap-2"
                      onClick={() => {
                        handleSelectPreset(TRANSITION_PRESETS[0]);
                        setShowGallery(false);
                      }}
                    >
                      <span>🚫 Không sử dụng hiệu ứng (None)</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end">
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

          {/* Effect Options Button (Enabled when transition has sub-options) */}
          <div className="relative" ref={effectRef}>
            <button
              disabled={!activePreset.effectOptions || activePreset.effectOptions.length === 0}
              className={`h-14 px-2.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${showEffectOptions ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-orange-500 disabled:opacity-40 disabled:pointer-events-none'}`}
              onClick={() => setShowEffectOptions(!showEffectOptions)}
              title="Tùy chọn hướng và phong cách hiệu ứng"
            >
              <div className="text-sm font-bold leading-none">⚙️</div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Tùy chọn</span>
                <IconChevronDown size={8} className={showEffectOptions ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {showEffectOptions && activePreset.effectOptions && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  HƯỚNG HIỆU ỨNG
                </div>
                {activePreset.effectOptions.map(opt => (
                  <button
                    key={opt.id}
                    className="w-full px-2 py-1.5 text-left text-xs rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors"
                    onClick={() => {
                      onApplyTransition({ ...currentTransition, effectOption: opt.id });
                      setShowEffectOptions(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </div>
                    {currentTransition.effectOption === opt.id && <IconCheck size={13} className="text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Chuyển tiếp đến Trang chiếu này
        </span>
      </div>

      {/* ── 3. Group: THỜI GIAN (Timing) ───────────────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <div className="flex items-center gap-3">
          {/* Sound & Duration Column */}
          <div className="flex flex-col gap-1 text-[11px]">
            {/* Sound Dropdown */}
            <div className="flex items-center gap-1.5 relative" ref={soundRef}>
              <span className="text-muted-foreground w-16 text-right font-medium">Âm thanh:</span>
              <button
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-border rounded text-left text-xs font-semibold flex items-center justify-between w-36 transition-colors"
                onClick={() => setShowSoundMenu(!showSoundMenu)}
              >
                <span className="truncate">{TRANSITION_SOUNDS.find(s => s.id === currentTransition.sound)?.name || '[Không có âm thanh]'}</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </button>

              {showSoundMenu && (
                <div className="absolute left-16 top-full mt-1 z-[999] w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 max-h-48 overflow-y-auto animate-in fade-in duration-100">
                  {TRANSITION_SOUNDS.map(snd => (
                    <button
                      key={snd.id}
                      className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors"
                      onClick={() => {
                        onApplyTransition({ ...currentTransition, sound: snd.id });
                        setShowSoundMenu(false);
                      }}
                    >
                      <span className="truncate">{snd.name}</span>
                      {currentTransition.sound === snd.id && <IconCheck size={12} className="text-orange-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Duration Input */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground w-16 text-right font-medium">Thời lượng:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step={0.25}
                  min={0.1}
                  max={10.0}
                  value={currentTransition.duration}
                  onChange={(e) => onApplyTransition({ ...currentTransition, duration: Math.max(0.1, parseFloat(e.target.value) || 1.0) })}
                  className="w-20 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center text-xs font-bold outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-muted-foreground">giây</span>
              </div>
            </div>
          </div>

          {/* Apply to All Button */}
          <button
            className="h-14 px-3 bg-background hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={() => onApplyToAllSlides(currentTransition)}
            title="Áp dụng hiệu ứng chuyển tiếp, âm thanh và thời lượng này cho tất cả trang chiếu"
          >
            <span className="text-base leading-none text-orange-600">🌐</span>
            <span className="text-[10px] font-bold leading-none">Áp dụng tất cả</span>
          </button>

          {/* Advance Slide Options */}
          <div className="flex flex-col gap-1 text-[11px] pl-2 border-l border-border">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              CHUYỂN TRANG
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
              <input
                type="checkbox"
                checked={currentTransition.advanceOnClick}
                onChange={(e) => onApplyTransition({ ...currentTransition, advanceOnClick: e.target.checked })}
                className="accent-orange-600 rounded"
              />
              <span>Khi nhấp chuột</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-orange-600">
              <input
                type="checkbox"
                checked={!!currentTransition.advanceAfterSeconds}
                onChange={(e) => onApplyTransition({ ...currentTransition, advanceAfterSeconds: e.target.checked ? 3 : undefined })}
                className="accent-orange-600 rounded"
              />
              <span>Sau:</span>
              <input
                type="number"
                min={1}
                max={60}
                value={currentTransition.advanceAfterSeconds || 3}
                disabled={!currentTransition.advanceAfterSeconds}
                onChange={(e) => onApplyTransition({ ...currentTransition, advanceAfterSeconds: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-12 px-1 py-0.2 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center text-xs font-bold outline-none focus:border-orange-500 disabled:opacity-40"
              />
              <span className="text-[10px] text-muted-foreground">s</span>
            </label>
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Thời gian
        </span>
      </div>
    </div>
  );
};
