import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { 
  IconPlus, 
  IconTable, 
  IconUpload, 
  IconSparkles, 
  IconChevronDown, 
  IconSearch,
  IconTrash,
  IconReadAloud,
  IconDictate
} from '@officex/icons';
import { ShapeType, SlideLayout } from '@officex/presentation-core';
import { ALL_SHAPE_SECTIONS } from './ribbons/DrawingGroup';

interface InsertRibbonProps {
  onNewSlide: (layout?: SlideLayout) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onDeleteTable?: () => void;
  onInsertTableRowAbove?: () => void;
  onInsertTableRowBelow?: () => void;
  onInsertTableColLeft?: () => void;
  onInsertTableColRight?: () => void;
  onDeleteTableRow?: () => void;
  onDeleteTableCol?: () => void;
  isTableSelected?: boolean;

  onInsertImage: (imageUrl: string) => void;
  onInsertShape: (type: ShapeType) => void;
  onInsertSmartArt: (type: 'process' | 'cycle' | 'hierarchy' | 'matrix' | 'pyramid') => void;
  onInsertChart: (type: 'bar' | 'pie' | 'line' | 'area') => void;
  onInsertTextBox: () => void;
  onInsertWordArt: (style: { text: string; color: string; gradient: string }) => void;
  onInsertEquation: (latex: string) => void;
  onInsertSymbol: (symbol: string) => void;
  onInsertVideo: (videoUrl: string) => void;
  onInsertAudio: (audioUrl: string, title?: string) => void;
}

const SMARTART_TYPES = [
  { id: 'process', label: 'Quy trình liên tục (Process)', icon: '➔ ➔ ➔', desc: 'Các bước thực hiện tuần tự' },
  { id: 'cycle', label: 'Chu trình khép kín (Cycle)', icon: '🔄', desc: 'Vòng lặp tuần hoàn liên tục' },
  { id: 'hierarchy', label: 'Cây phân cấp (Hierarchy)', icon: '🗂️', desc: 'Sơ đồ tổ chức & phân nhánh' },
  { id: 'matrix', label: 'Ma trận 4 ô (Matrix)', icon: '⊞', desc: 'Phân tích 4 góc phần tư SWOT' },
  { id: 'pyramid', label: 'Kim tự tháp (Pyramid)', icon: '▲', desc: 'Các cấp bậc nền tảng đến đỉnh' },
] as const;

const CHART_TYPES = [
  { id: 'bar', label: 'Biểu đồ Cột (Column / Bar)', icon: '📊', desc: 'So sánh dữ liệu giữa các danh mục' },
  { id: 'line', label: 'Biểu đồ Đường (Line Trend)', icon: '📈', desc: 'Thể hiện xu hướng biến động theo thời gian' },
  { id: 'pie', label: 'Biểu đồ Tròn (Pie Share)', icon: '🥧', desc: 'Tỷ trọng phần trăm cơ cấu' },
  { id: 'area', label: 'Biểu đồ Vùng (Area Flow)', icon: '📉', desc: 'Tập hợp khối lượng tăng trưởng' },
] as const;

const WORDART_STYLES = [
  { name: 'Hoàng gia Gold', text: 'WordArt', color: '#eab308', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' },
  { name: 'Cyber Neon', text: 'WordArt', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
  { name: 'Sunset Ruby', text: 'WordArt', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)' },
  { name: 'Emerald Glow', text: 'WordArt', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  { name: 'Deep Violet', text: 'WordArt', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
  { name: 'Metallic Chrome', text: 'WordArt', color: '#64748b', gradient: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)' },
];

const EQUATION_PRESETS = [
  { label: 'Định lý Pythagoras', latex: 'a² + b² = c²' },
  { label: 'Năng lượng Einstein', latex: 'E = mc²' },
  { label: 'Phương trình bậc 2', latex: 'x = (-b ± √(b² - 4ac)) / (2a)' },
  { label: 'Diện tích hình tròn', latex: 'S = π r²' },
  { label: 'Tổng chuỗi số', latex: '∑_{i=1}^n x_i' },
  { label: 'Tích phân', latex: '∫_a^b f(x)dx' },
];

const COMMON_SYMBOLS = [
  '©', '®', '™', '§', '¶', '°', '±', '×', '÷', '≠', '≤', '≥', '≈', '∞',
  'α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'Ω', 'Δ',
  '→', '←', '↑', '↓', '↔', '⇒', '⇔', '✓', '✔', '✕', '✖', '★', '♥', '♦'
];

const SAMPLE_VIDEOS = [
  { title: 'Video Thiên nhiên & Phong cảnh', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', desc: '4K Cảnh quan biển đẹp mắt' },
  { title: 'Video Công nghệ Tương lai', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', desc: 'Hiệu ứng đồ họa sống động' },
  { title: 'Video Hoạt hình Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', desc: 'Phim hoạt hình 3D sắc nét' },
];

const SAMPLE_AUDIOS = [
  { title: 'Nhạc nền Acoustic Vibes', url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3', desc: 'Giai điệu thư giãn thuyết trình' },
  { title: 'Chuông thông báo Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', desc: 'Âm thanh thông báo ngắn' },
  { title: 'Tiếng chim hót thiên nhiên', url: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3', desc: 'Âm thanh không gian thư thái' },
];

export const InsertRibbon: React.FC<InsertRibbonProps> = ({
  onNewSlide,
  onInsertTable,
  onDeleteTable,
  onInsertTableRowAbove,
  onInsertTableRowBelow,
  onInsertTableColLeft,
  onInsertTableColRight,
  onDeleteTableRow,
  onDeleteTableCol,
  isTableSelected,

  onInsertImage,
  onInsertShape,
  onInsertSmartArt,
  onInsertChart,
  onInsertTextBox,
  onInsertWordArt,
  onInsertEquation,
  onInsertSymbol,
  onInsertVideo,
  onInsertAudio,
}) => {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showCustomTableModal, setShowCustomTableModal] = useState(false);
  const [customCols, setCustomCols] = useState(4);
  const [customRows, setCustomRows] = useState(3);
  const [hoverGrid, setHoverGrid] = useState<{ r: number; c: number }>({ r: 3, c: 3 });

  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showSmartArtMenu, setShowSmartArtMenu] = useState(false);
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [showWordArtMenu, setShowWordArtMenu] = useState(false);
  const [showEquationMenu, setShowEquationMenu] = useState(false);
  const [showSymbolMenu, setShowSymbolMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showOnlineVideoModal, setShowOnlineVideoModal] = useState(false);
  const [onlineVideoInput, setOnlineVideoInput] = useState('');
  
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showRecordAudioModal, setShowRecordAudioModal] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  const [shapeSearch, setShapeSearch] = useState('');

  const tableRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const smartArtRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const wordArtRef = useRef<HTMLDivElement>(null);
  const equationRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) setShowTableMenu(false);
      if (shapeRef.current && !shapeRef.current.contains(e.target as Node)) setShowShapeMenu(false);
      if (smartArtRef.current && !smartArtRef.current.contains(e.target as Node)) setShowSmartArtMenu(false);
      if (chartRef.current && !chartRef.current.contains(e.target as Node)) setShowChartMenu(false);
      if (wordArtRef.current && !wordArtRef.current.contains(e.target as Node)) setShowWordArtMenu(false);
      if (equationRef.current && !equationRef.current.contains(e.target as Node)) setShowEquationMenu(false);
      if (symbolRef.current && !symbolRef.current.contains(e.target as Node)) setShowSymbolMenu(false);
      if (videoRef.current && !videoRef.current.contains(e.target as Node)) setShowVideoMenu(false);
      if (audioRef.current && !audioRef.current.contains(e.target as Node)) setShowAudioMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onInsertImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onInsertVideo(videoUrl);
      setShowVideoMenu(false);
    }
  };

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      onInsertAudio(audioUrl, file.name);
      setShowAudioMenu(false);
    }
  };

  // Audio Recording Handlers
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setRecordDuration(0);
      setRecordedBlobUrl(null);

      recordTimerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Không thể kết nối mic: Vui lòng cấp quyền Microphone để ghi âm.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  return (
    <div className="h-24 px-3 py-1.5 flex items-stretch gap-3 overflow-visible relative z-30 select-none">
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageFile} 
      />

      {/* Hidden File Input for Video Upload */}
      <input 
        type="file" 
        ref={videoFileInputRef} 
        accept="video/mp4,video/webm,video/ogg,video/*" 
        className="hidden" 
        onChange={handleVideoFile} 
      />

      {/* Hidden File Input for Audio Upload */}
      <input 
        type="file" 
        ref={audioFileInputRef} 
        accept="audio/mp3,audio/wav,audio/m4a,audio/ogg,audio/*" 
        className="hidden" 
        onChange={handleAudioFile} 
      />

      {/* ── 1. Slides Group ────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <button
          className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
          onClick={() => onNewSlide('titleAndContent')}
          title="Chèn thêm trang chiếu mới (Ctrl+M)"
        >
          <div className="w-6 h-5 border-2 border-orange-500 bg-orange-100 dark:bg-orange-950/60 rounded flex items-center justify-center">
            <IconPlus size={14} className="text-orange-600 dark:text-orange-400" />
          </div>
          <span className="text-[10px] font-semibold leading-none">Trang mới</span>
        </button>
        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Trang chiếu
        </span>
      </div>

      {/* ── 2. Tables Group ────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0 relative" ref={tableRef}>
        <div className="flex items-center gap-1">
          <button
            className={`h-14 px-3 border rounded flex flex-col items-center justify-center gap-1 transition-all ${showTableMenu ? 'bg-orange-500 text-white border-orange-600' : 'bg-background hover:bg-muted border-border hover:border-orange-500'}`}
            onClick={() => setShowTableMenu(!showTableMenu)}
            title="Chèn bảng dữ liệu & Tùy chọn bảng"
          >
            <IconTable size={20} className={showTableMenu ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-semibold leading-none">Bảng</span>
              <IconChevronDown size={8} className={showTableMenu ? 'text-white' : 'text-muted-foreground'} />
            </div>
          </button>

          {/* Quick Delete Table Button (Enabled when table is selected) */}
          {isTableSelected && (
            <button
              className="h-14 px-2.5 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-800 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={onDeleteTable}
              title="Xóa bảng đang chọn"
            >
              <IconTrash size={16} />
              <span className="text-[10px] font-semibold leading-none">Xóa bảng</span>
            </button>
          )}
        </div>

        {/* Table Dropdown Menu */}
        {showTableMenu && (
          <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-3 animate-in fade-in duration-100">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
              <span>CHÈN BẢNG THEO LƯỚI</span>
              <span className="text-orange-600 font-bold">{hoverGrid.c} x {hoverGrid.r}</span>
            </div>

            {/* 6x6 Grid cells */}
            <div className="grid grid-cols-6 gap-1 mb-2.5">
              {Array.from({ length: 6 }).map((_, rIdx) =>
                Array.from({ length: 6 }).map((_, cIdx) => {
                  const isHovered = rIdx < hoverGrid.r && cIdx < hoverGrid.c;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-6 h-6 border rounded-xs cursor-pointer transition-colors ${isHovered ? 'bg-orange-200 border-orange-500 dark:bg-orange-950' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                      onMouseEnter={() => setHoverGrid({ r: rIdx + 1, c: cIdx + 1 })}
                      onClick={() => {
                        onInsertTable(rIdx + 1, cIdx + 1);
                        setShowTableMenu(false);
                      }}
                    />
                  );
                })
              )}
            </div>

            {/* Chèn Bảng... (Custom Dialog) */}
            <button
              className="w-full py-1.5 px-2 bg-slate-50 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-orange-950/60 text-left text-xs font-semibold rounded-lg transition-colors flex items-center justify-between mb-1 text-slate-800 dark:text-slate-200"
              onClick={() => {
                setShowTableMenu(false);
                setShowCustomTableModal(true);
              }}
            >
              <div className="flex items-center gap-2">
                <IconTable size={14} className="text-blue-500" />
                <span>Chèn Bảng...</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Tùy biến</span>
            </button>

            {/* Table Operations if Table is selected */}
            {isTableSelected && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 mt-2 flex flex-col gap-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                  THAO TÁC VỚI BẢNG ĐANG CHỌN
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    className="py-1 px-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-left"
                    onClick={() => { onInsertTableRowAbove?.(); setShowTableMenu(false); }}
                  >
                    + Hàng bên trên
                  </button>
                  <button
                    className="py-1 px-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-left"
                    onClick={() => { onInsertTableRowBelow?.(); setShowTableMenu(false); }}
                  >
                    + Hàng bên dưới
                  </button>
                  <button
                    className="py-1 px-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-left"
                    onClick={() => { onInsertTableColLeft?.(); setShowTableMenu(false); }}
                  >
                    + Cột bên trái
                  </button>
                  <button
                    className="py-1 px-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-left"
                    onClick={() => { onInsertTableColRight?.(); setShowTableMenu(false); }}
                  >
                    + Cột bên phải
                  </button>
                  <button
                    className="py-1 px-1.5 text-[11px] bg-red-50 text-red-600 hover:bg-red-100 rounded text-left"
                    onClick={() => { onDeleteTableRow?.(); setShowTableMenu(false); }}
                  >
                    - Xóa hàng
                  </button>
                  <button
                    className="py-1 px-1.5 text-[11px] bg-red-50 text-red-600 hover:bg-red-100 rounded text-left"
                    onClick={() => { onDeleteTableCol?.(); setShowTableMenu(false); }}
                  >
                    - Xóa cột
                  </button>
                </div>

                <button
                  className="w-full py-1.5 mt-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  onClick={() => {
                    onDeleteTable?.();
                    setShowTableMenu(false);
                  }}
                >
                  <IconTrash size={13} />
                  <span>Xóa Bảng Này</span>
                </button>
              </div>
            )}
          </div>
        )}

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Bảng
        </span>
      </div>

      {/* ── Custom Insert Table Modal Dialog ──────────────────────── */}
      {showCustomTableModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <IconTable size={18} className="text-orange-600" />
                <h3 className="text-sm font-bold text-foreground">Chèn Bảng</h3>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                onClick={() => setShowCustomTableModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Số cột (Columns):</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={customCols}
                  onChange={(e) => setCustomCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center font-bold text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Số hàng (Rows):</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={customRows}
                  onChange={(e) => setCustomRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-border rounded text-center font-bold text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                onClick={() => setShowCustomTableModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow transition-colors"
                onClick={() => {
                  onInsertTable(customRows, customCols);
                  setShowCustomTableModal(false);
                }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Pictures & Media Group ───────────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={() => fileInputRef.current?.click()}
            title="Chèn ảnh từ máy tính"
          >
            <IconUpload size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-semibold leading-none">Hình ảnh</span>
          </button>

          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={() => {
              const url = prompt('Nhập đường dẫn hình ảnh (URL) hoặc ảnh minh họa trực tuyến:');
              if (url && url.trim()) {
                onInsertImage(url.trim());
              }
            }}
            title="Chèn ảnh từ đường dẫn trực tuyến URL"
          >
            <span className="text-base">🌐</span>
            <span className="text-[10px] font-semibold leading-none">Ảnh Online</span>
          </button>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Hình ảnh
        </span>
      </div>

      {/* ── 4. Illustrations: Shapes, SmartArt, Charts ─────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Shapes Dropdown */}
          <div className="relative" ref={shapeRef}>
            <button
              className="h-14 px-2.5 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              title="Chèn hình vẽ vector"
            >
              <div className="flex items-center gap-0.5">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 bg-blue-100 rounded-full"></div>
                <div className="w-3.5 h-3.5 border-2 border-orange-500 bg-orange-100"></div>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Hình vẽ</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {/* Shapes Palette Popup */}
            {showShapeMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-[420px] max-h-[480px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl flex flex-col animate-in fade-in duration-100">
                <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
                  <IconSearch size={13} className="text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hình khối..."
                    value={shapeSearch}
                    onChange={(e) => setShapeSearch(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 max-h-[400px] flex flex-col gap-3">
                  {ALL_SHAPE_SECTIONS.map(sec => (
                    <div key={sec.title} className="flex flex-col gap-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        {sec.title}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {sec.items.map(item => (
                          <button
                            key={item.type}
                            className="h-10 w-12 flex items-center justify-center rounded hover:bg-orange-100 dark:hover:bg-orange-950/70 border border-transparent hover:border-orange-500 transition-all hover:scale-105"
                            onClick={() => {
                              onInsertShape(item.type);
                              setShowShapeMenu(false);
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

          {/* SmartArt Sơ đồ thông minh */}
          <div className="relative" ref={smartArtRef}>
            <button
              className="h-14 px-2.5 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowSmartArtMenu(!showSmartArtMenu)}
              title="Chèn sơ đồ SmartArt thông minh"
            >
              <div className="flex items-center gap-0.5 text-xs text-purple-600 dark:text-purple-400">
                <span>🗂️</span>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">SmartArt</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showSmartArtMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  CHỌN KIỂU SƠ ĐỒ SMARTART
                </div>
                {SMARTART_TYPES.map(sa => (
                  <button
                    key={sa.id}
                    className="w-full p-2 text-left rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-start gap-2.5 transition-colors group"
                    onClick={() => {
                      onInsertSmartArt(sa.id);
                      setShowSmartArtMenu(false);
                    }}
                  >
                    <span className="text-lg leading-none">{sa.icon}</span>
                    <div>
                      <div className="text-xs font-bold group-hover:text-orange-600">{sa.label}</div>
                      <div className="text-[10px] text-muted-foreground">{sa.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Charts Biểu đồ */}
          <div className="relative" ref={chartRef}>
            <button
              className="h-14 px-2.5 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowChartMenu(!showChartMenu)}
              title="Chèn biểu đồ thống kê"
            >
              <span className="text-base leading-none text-cyan-600 dark:text-cyan-400">📊</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Biểu đồ</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showChartMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  CHỌN KIỂU BIỂU ĐỒ
                </div>
                {CHART_TYPES.map(ch => (
                  <button
                    key={ch.id}
                    className="w-full p-2 text-left rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/40 flex items-start gap-2.5 transition-colors group"
                    onClick={() => {
                      onInsertChart(ch.id);
                      setShowChartMenu(false);
                    }}
                  >
                    <span className="text-lg leading-none">{ch.icon}</span>
                    <div>
                      <div className="text-xs font-bold group-hover:text-cyan-600">{ch.label}</div>
                      <div className="text-[10px] text-muted-foreground">{ch.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Hình minh họa
        </span>
      </div>

      {/* ── 5. Text Group: Text Box, WordArt ──────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
            onClick={onInsertTextBox}
            title="Chèn hộp văn bản tùy biến"
          >
            <div className="w-5 h-5 border border-dashed border-slate-600 rounded flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="text-[10px] font-semibold leading-none">Hộp văn bản</span>
          </button>

          {/* WordArt Dropdown */}
          <div className="relative" ref={wordArtRef}>
            <button
              className="h-14 px-3 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowWordArtMenu(!showWordArtMenu)}
              title="Chèn chữ nghệ thuật WordArt"
            >
              <span className="text-base font-extrabold text-amber-500 leading-none drop-shadow-sm font-serif">A</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">WordArt</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showWordArtMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  MẪU CHỮ NGHỆ THUẬT WORDART
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {WORDART_STYLES.map(wa => (
                    <button
                      key={wa.name}
                      className="h-12 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-500 p-2 flex items-center justify-center transition-all hover:scale-105"
                      style={{ background: wa.gradient }}
                      onClick={() => {
                        onInsertWordArt({ text: 'WordArt', color: wa.color, gradient: wa.gradient });
                        setShowWordArtMenu(false);
                      }}
                      title={wa.name}
                    >
                      <span className="text-sm font-extrabold text-white drop-shadow font-serif">
                        {wa.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Văn bản
        </span>
      </div>

      {/* ── 6. Symbols & Equations Group ───────────────────────────── */}
      <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
        <div className="flex items-center gap-1">
          {/* Equation Dropdown */}
          <div className="relative" ref={equationRef}>
            <button
              className="h-14 px-2.5 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowEquationMenu(!showEquationMenu)}
              title="Chèn phương trình toán học"
            >
              <span className="text-base font-serif font-bold text-rose-600 dark:text-rose-400">π</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Phương trình</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showEquationMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  CÔNG THỨC TOÁN HỌC PHỔ BIẾN
                </div>
                {EQUATION_PRESETS.map(eq => (
                  <button
                    key={eq.label}
                    className="w-full p-2 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors group"
                    onClick={() => {
                      onInsertEquation(eq.latex);
                      setShowEquationMenu(false);
                    }}
                  >
                    <div className="text-[11px] font-semibold text-muted-foreground">{eq.label}</div>
                    <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{eq.latex}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Symbol Picker */}
          <div className="relative" ref={symbolRef}>
            <button
              className="h-14 px-2.5 bg-background hover:bg-muted border border-border hover:border-orange-500 rounded flex flex-col items-center justify-center gap-1 transition-all"
              onClick={() => setShowSymbolMenu(!showSymbolMenu)}
              title="Chèn ký hiệu đặc biệt"
            >
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">Ω</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Ký hiệu</span>
                <IconChevronDown size={8} className="text-muted-foreground" />
              </div>
            </button>

            {showSymbolMenu && (
              <div className="absolute left-0 top-full mt-1 z-[999] w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-3 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  BẢNG KÝ HIỆU ĐẶC BIỆT
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {COMMON_SYMBOLS.map(sym => (
                    <button
                      key={sym}
                      className="h-7 w-7 rounded flex items-center justify-center text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        onInsertSymbol(sym);
                        setShowSymbolMenu(false);
                      }}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Ký hiệu
        </span>
      </div>

      {/* ── 7. Media: Video & Audio (ĐA PHƯƠNG TIỆN) ────────────────── */}
      <div className="flex flex-col gap-1 pr-1 shrink-0">
        <div className="flex items-center gap-1">
          {/* 1. Video Button */}
          <div className="relative" ref={videoRef}>
            <button
              className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showVideoMenu ? 'bg-blue-500 text-white border-blue-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-blue-400'}`}
              onClick={() => setShowVideoMenu(!showVideoMenu)}
              title="Chèn video từ thiết bị này, video trực tuyến, hoặc video mẫu"
            >
              {/* Microsoft Office Blue Video Icon */}
              <div className="w-5 h-4 rounded-xs bg-[#0078d4] flex items-center justify-center shadow-xs">
                <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Video</span>
                <IconChevronDown size={8} className={showVideoMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {/* Video Dropdown Menu */}
            {showVideoMenu && (
              <div className="absolute right-0 top-full mt-1 z-[999] w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  TÙY CHỌN CHÈN VIDEO
                </div>

                <button
                  className="w-full p-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2.5 transition-colors group"
                  onClick={() => {
                    videoFileInputRef.current?.click();
                  }}
                >
                  <span className="text-lg leading-none">💻</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">Video từ Thiết bị này...</div>
                    <div className="text-[10px] text-muted-foreground">Chọn file MP4, WebM từ máy tính</div>
                  </div>
                </button>

                <button
                  className="w-full p-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2.5 transition-colors group"
                  onClick={() => {
                    setShowVideoMenu(false);
                    setShowOnlineVideoModal(true);
                  }}
                >
                  <span className="text-lg leading-none">🌐</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">Video Trực tuyến (Online)...</div>
                    <div className="text-[10px] text-muted-foreground">Nhập link YouTube hoặc URL video</div>
                  </div>
                </button>

                <div className="border-t border-slate-200 dark:border-slate-800 my-1.5 pt-1">
                  <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                    VIDEO MẪU TEST NHANH (SẴN CÓ)
                  </div>
                  {SAMPLE_VIDEOS.map((sv, idx) => (
                    <button
                      key={idx}
                      className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/50 flex items-center justify-between transition-colors group"
                      onClick={() => {
                        onInsertVideo(sv.url);
                        setShowVideoMenu(false);
                      }}
                    >
                      <div>
                        <div className="text-xs font-semibold group-hover:text-orange-600 text-slate-800 dark:text-slate-200">{sv.title}</div>
                        <div className="text-[10px] text-muted-foreground">{sv.desc}</div>
                      </div>
                      <span className="text-xs text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Chèn ▶</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Audio Button */}
          <div className="relative" ref={audioRef}>
            <button
              className={`h-14 px-2.5 rounded flex flex-col items-center justify-center gap-1 border transition-all ${showAudioMenu ? 'bg-indigo-500 text-white border-indigo-600 shadow-md' : 'bg-background hover:bg-muted border-border hover:border-indigo-400'}`}
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              title="Chèn âm thanh từ máy tính, ghi âm trực tiếp, hoặc âm thanh mẫu"
            >
              {/* Microsoft Office Audio Speaker Icon */}
              <div className="w-5 h-4 rounded-xs bg-[#4f46e5] flex items-center justify-center shadow-xs text-white">
                <IconReadAloud size={12} />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold leading-none">Âm thanh</span>
                <IconChevronDown size={8} className={showAudioMenu ? 'text-white' : 'text-muted-foreground'} />
              </div>
            </button>

            {/* Audio Dropdown Menu */}
            {showAudioMenu && (
              <div className="absolute right-0 top-full mt-1 z-[999] w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-2 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  TÙY CHỌN CHÈN ÂM THANH
                </div>

                {/* Audio on PC */}
                <button
                  className="w-full p-2 text-left rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2.5 transition-colors group"
                  onClick={() => {
                    audioFileInputRef.current?.click();
                  }}
                >
                  <span className="text-lg leading-none">💻</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Âm thanh trên Máy tính của tôi...</div>
                    <div className="text-[10px] text-muted-foreground">Chọn file MP3, WAV, M4A</div>
                  </div>
                </button>

                {/* Record Audio */}
                <button
                  className="w-full p-2 text-left rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2.5 transition-colors group"
                  onClick={() => {
                    setShowAudioMenu(false);
                    setShowRecordAudioModal(true);
                  }}
                >
                  <span className="text-lg leading-none">🎙️</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">Ghi Âm thanh Trực tiếp...</div>
                    <div className="text-[10px] text-muted-foreground">Thu âm giọng nói và chèn vào slide</div>
                  </div>
                </button>

                {/* Sample Audio clips */}
                <div className="border-t border-slate-200 dark:border-slate-800 my-1.5 pt-1">
                  <div className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider">
                    ÂM THANH MẪU SẴN CÓ
                  </div>
                  {SAMPLE_AUDIOS.map((sa, idx) => (
                    <button
                      key={idx}
                      className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors group"
                      onClick={() => {
                        onInsertAudio(sa.url, sa.title);
                        setShowAudioMenu(false);
                      }}
                    >
                      <div>
                        <div className="text-xs font-semibold group-hover:text-indigo-600 text-slate-800 dark:text-slate-200">{sa.title}</div>
                        <div className="text-[10px] text-muted-foreground">{sa.desc}</div>
                      </div>
                      <span className="text-xs text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Chèn 🎵</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
          Đa phương tiện
        </span>
      </div>

      {/* ── Online Video Modal Dialog ─────────────────────────────── */}
      {showOnlineVideoModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 rounded-xs bg-[#0078d4] flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-white ml-0.5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Chèn Video Trực tuyến</h3>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                onClick={() => setShowOnlineVideoModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nhập đường dẫn URL của Video (YouTube, Vimeo hoặc file MP4):
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=... hoặc .mp4"
                value={onlineVideoInput}
                onChange={(e) => setOnlineVideoInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-border rounded-lg text-xs outline-none focus:border-blue-500 font-mono"
              />
              <span className="text-[11px] text-muted-foreground italic">
                Ví dụ: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                onClick={() => setShowOnlineVideoModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors"
                onClick={() => {
                  if (onlineVideoInput.trim()) {
                    onInsertVideo(onlineVideoInput.trim());
                    setShowOnlineVideoModal(false);
                    setOnlineVideoInput('');
                  }
                }}
              >
                Chèn Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Record Audio Modal Dialog ─────────────────────────────── */}
      {showRecordAudioModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center">
                  <IconReadAloud size={13} />
                </div>
                <h3 className="text-sm font-bold text-foreground">Ghi Âm thanh Trực tiếp</h3>
              </div>
              <button 
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                onClick={() => {
                  handleStopRecording();
                  setShowRecordAudioModal(false);
                }}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-3 gap-3">
              {/* Pulsing visualizer */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecordingVoice ? 'bg-red-500 text-white shadow-xl shadow-red-500/40 animate-pulse scale-110' : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600'}`}>
                <IconDictate size={36} />
              </div>

              {/* Timer */}
              <div className="font-mono font-bold text-xl text-slate-800 dark:text-slate-100">
                00:{recordDuration.toString().padStart(2, '0')}
              </div>

              <div className="text-xs text-muted-foreground text-center">
                {isRecordingVoice ? 'Đang ghi âm qua Micro của bạn...' : (recordedBlobUrl ? 'Đã hoàn tất ghi âm! Bạn có thể nghe lại bên dưới.' : 'Bấm Ghi âm để bắt đầu thu tiếng.')}
              </div>

              {/* Audio Preview Player if recorded */}
              {recordedBlobUrl && (
                <audio src={recordedBlobUrl} controls className="w-full h-8 mt-1" />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              {!isRecordingVoice ? (
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition-colors flex items-center gap-1.5"
                  onClick={handleStartRecording}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>{recordedBlobUrl ? 'Thu âm lại' : 'Bắt đầu Ghi âm'}</span>
                </button>
              ) : (
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow transition-colors flex items-center gap-1.5"
                  onClick={handleStopRecording}
                >
                  <span>■ Dừng ghi âm</span>
                </button>
              )}

              {recordedBlobUrl && (
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-colors"
                  onClick={() => {
                    onInsertAudio(recordedBlobUrl, `Bản ghi âm 00:${recordDuration.toString().padStart(2, '0')}`);
                    setShowRecordAudioModal(false);
                  }}
                >
                  Chèn vào Slide
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
