import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Shape, Slide, Presentation } from '@officex/presentation-core';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'generate_deck' | 'insert_slide' | 'insert_text' | 'insert_chart' | 'apply_theme';
    label: string;
    payload?: any;
  }[];
}

// ─── Preset Deck Templates Generator ──────────────────────────────────────────
export interface AIDeckTemplate {
  topic: string;
  description: string;
  icon: string;
  theme: {
    bg: string;
    primary: string;
    secondary: string;
    cardBg: string;
    font: string;
  };
  slides: {
    layout: 'title' | 'titleAndContent' | 'twoContent' | 'cards' | 'chart' | 'conclusion';
    title: string;
    subtitle?: string;
    content?: string[];
    cards?: { title: string; desc: string; icon?: string }[];
    chartType?: 'bar' | 'pie' | 'line';
  }[];
}

export const AI_DECK_PRESETS: Record<string, AIDeckTemplate> = {
  business: {
    topic: 'Kế hoạch Kinh doanh Chiến lược 2026',
    description: 'Bản kế hoạch kinh doanh toàn diện với tầm nhìn, phân tích thị trường và tài chính',
    icon: '💼',
    theme: {
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      primary: '#38bdf8',
      secondary: '#94a3b8',
      cardBg: '#1e293b',
      font: 'Inter',
    },
    slides: [
      {
        layout: 'title',
        title: 'KẾ HOẠCH KINH DOANH CHIẾN LƯỢC 2026',
        subtitle: 'Đột phá Doanh thu — Mở rộng Quy mô — Dẫn đầu Thị trường\nTrình bày bởi: Ban Điều hành',
      },
      {
        layout: 'cards',
        title: 'Mục tiêu Trọng tâm Năm 2026',
        cards: [
          { title: 'Tăng trưởng Doanh thu', desc: 'Đạt mục tiêu tăng trưởng 45% so với cùng kỳ năm trước', icon: '📈' },
          { title: 'Mở rộng Thị phần', desc: 'Chiếm lĩnh 30% phân khúc khách hàng doanh nghiệp vừa và lớn', icon: '🎯' },
          { title: 'Tối ưu Vận hành', desc: 'Ứng dụng AI giúp giảm 25% chi phí vận hành thường niên', icon: '⚡' },
        ],
      },
      {
        layout: 'twoContent',
        title: 'Phân tích Thị trường & Cơ hội',
        content: [
          '• Nhu cầu chuyển đổi số doanh nghiệp tăng 60%\n• Khách hàng ưu tiên giải pháp tích hợp thông minh\n• Khoảng trống lớn tại thị trường Đông Nam Á',
          '• Đối thủ truyền thống chậm đổi mới công nghệ\n• Chính sách hỗ trợ mạnh mẽ từ chính phủ\n• Tiềm năng mở rộng dịch vụ theo gói B2B',
        ],
      },
      {
        layout: 'chart',
        title: 'Dự báo Tăng trưởng Doanh thu (Tỷ VNĐ)',
        chartType: 'bar',
        content: ['• Quý 1: 15.2 Tỷ\n• Quý 2: 24.5 Tỷ\n• Quý 3: 32.8 Tỷ\n• Quý 4: 48.6 Tỷ'],
      },
      {
        layout: 'conclusion',
        title: 'Hành động Ngay Hôm nay',
        subtitle: 'Sẵn sàng bứt phá và kiến tạo giá trị bền vững cùng OfficeX\nLiên hệ: contact@officex.vn | Hotline: 1900 6868',
      },
    ],
  },

  startup: {
    topic: 'Pitch Deck Gọi vốn Khởi nghiệp AI',
    description: 'Bài thuyết trình gọi vốn chuyên nghiệp chuẩn Silicon Valley',
    icon: '🚀',
    theme: {
      bg: 'linear-gradient(135deg, #180033 0%, #300066 100%)',
      primary: '#c084fc',
      secondary: '#e9d5ff',
      cardBg: '#2a084e',
      font: 'Inter',
    },
    slides: [
      {
        layout: 'title',
        title: 'NEXUS AI — TRÍ TUỆ NHÂN TẠO DOANH NGHIỆP',
        subtitle: 'Giải pháp Tự động hóa Văn phòng Thế hệ Mới\nPitch Deck Gọi Vốn Vòng Seed (1.5M USD)',
      },
      {
        layout: 'cards',
        title: 'Vấn đề & Giải pháp Đột phá',
        cards: [
          { title: 'Vấn đề Hiện tại', desc: '80% thời gian nhân viên lãng phí vào các tác vụ thủ công lặp lại', icon: '❌' },
          { title: 'Giải pháp Nexus AI', desc: 'Tự động hóa 90% quy trình tạo tài liệu, bảng biểu và báo cáo', icon: '✨' },
          { title: 'Giá trị Vượt trội', desc: 'Tăng gấp 3 lần năng suất, hoàn vốn chỉ sau 2 tháng triển khai', icon: '💎' },
        ],
      },
      {
        layout: 'chart',
        title: 'Thị trường Tiềm năng (TAM / SAM / SOM)',
        chartType: 'pie',
        content: ['• TAM: 120 Tỷ USD toàn cầu\n• SAM: 15 Tỷ USD Đông Nam Á\n• SOM: 500 Triệu USD mục tiêu 3 năm'],
      },
      {
        layout: 'cards',
        title: 'Mô hình Kinh doanh & Tăng trưởng',
        cards: [
          { title: 'B2B SaaS', desc: 'Gói thuê bao tháng 19$/người dùng, cam kết tối thiểu 1 năm', icon: '🏢' },
          { title: 'Enterprise Custom', desc: 'Giải pháp triển khai on-premise cho tập đoàn lớn từ 50K$', icon: '🛡️' },
          { title: 'Tăng trưởng MoM', desc: 'Tốc độ tăng trưởng doanh thu 28% mỗi tháng liên tục 6 tháng', icon: '🔥' },
        ],
      },
      {
        layout: 'conclusion',
        title: 'Kêu gọi Đầu tư: 1.5 Triệu USD',
        subtitle: '40% R&D Sản phẩm — 40% Mở rộng Thị trường — 20% Đội ngũ\nEmail: founders@nexusai.io',
      },
    ],
  },

  marketing: {
    topic: 'Chiến dịch Marketing Đa kênh 2026',
    description: 'Chiến lược truyền thông số, thu hút khách hàng tiềm năng và tối ưu chuyển đổi',
    icon: '📣',
    theme: {
      bg: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
      primary: '#fb923c',
      secondary: '#fed7aa',
      cardBg: '#292524',
      font: 'Inter',
    },
    slides: [
      {
        layout: 'title',
        title: 'CHIẾN DỊCH MARKETING ĐA KÊNH 2026',
        subtitle: 'Tăng tốc Nhận diện — Chuyển đổi Vượt bậc — Giữ chân Khách hàng\nPhòng Tiếp thị & Truyền thông',
      },
      {
        layout: 'cards',
        title: '3 Trụ cột Truyền thông Chính',
        cards: [
          { title: 'Social & Viral Video', desc: 'TikTok, Reels, Shorts tiếp cận 5M+ người dùng trẻ', icon: '📱' },
          { title: 'Performance Ads', desc: 'Google Search, Meta Ads tối ưu hóa CPA dưới 50.000đ', icon: '🎯' },
          { title: 'KOL / KOC Review', desc: 'Hợp tác cùng 50+ chuyên gia công nghệ và reviewer uy tín', icon: '⭐' },
        ],
      },
      {
        layout: 'twoContent',
        title: 'Hành trình Khách hàng & Phễu Chuyển đổi',
        content: [
          '• Giai đoạn 1: Nhận biết (Awareness)\n  - Bài viết viral, video ngắn, bài PR báo chí\n• Giai đoạn 2: Cân nhắc (Consideration)\n  - Trải nghiệm thử miễn phí, xem demo, case study',
          '• Giai đoạn 3: Chuyển đổi (Conversion)\n  - Ưu đãi giới hạn, tư vấn 1-1 trực tiếp\n• Giai đoạn 4: Trung thành (Retention)\n  - Chăm sóc VIP, nâng cấp tính năng định kỳ',
        ],
      },
      {
        layout: 'chart',
        title: 'Hiệu quả Chuyển đổi theo Kênh',
        chartType: 'bar',
        content: ['• Tỷ lệ chuyển đổi Social: 4.2%\n• Tỷ lệ Search Ads: 6.8%\n• Tỷ lệ Giới thiệu (Referral): 12.5%'],
      },
      {
        layout: 'conclusion',
        title: 'Mục tiêu: Đạt 100.000 Khách hàng Mới',
        subtitle: 'Bắt đầu chiến dịch từ Tháng 3/2026\nCùng nhau kiến tạo kỷ lục mới!',
      },
    ],
  },

  report: {
    topic: 'Báo cáo Tổng kết Hoạt động Năm',
    description: 'Mẫu báo cáo kết quả tài chính, thành tựu và phương hướng năm mới',
    icon: '📊',
    theme: {
      bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      primary: '#34d399',
      secondary: '#a7f3d0',
      cardBg: '#064e3b',
      font: 'Inter',
    },
    slides: [
      {
        layout: 'title',
        title: 'BÁO CÁO TỔNG KẾT HOẠT ĐỘNG NĂM',
        subtitle: 'Đánh giá Kết quả — Tuyên dương Thành tích — Định hướng Phát triển',
      },
      {
        layout: 'cards',
        title: 'Những Thành tựu Nổi bật',
        cards: [
          { title: 'Doanh thu Vượt 120%', desc: 'Hoàn thành vượt mức chỉ tiêu đề ra đầu năm', icon: '🏆' },
          { title: '98% Khách Hài Lòng', desc: 'Chỉ số NPS đạt kỷ lục cao nhất từ trước đến nay', icon: '❤️' },
          { title: 'Mở rộng 3 Chi nhánh', desc: 'Phủ sóng thêm các thành phố trọng điểm miền Trung', icon: '🏢' },
        ],
      },
      {
        layout: 'chart',
        title: 'Biểu đồ Doanh thu 4 Quý',
        chartType: 'line',
        content: ['• Tăng trưởng đều đặn qua từng quý\n• Đạt đỉnh vào Quý 4 mùa mua sắm'],
      },
      {
        layout: 'conclusion',
        title: 'Cảm ơn Đội ngũ & Đối tác',
        subtitle: 'Hướng tới năm mới với nhiều thắng lợi rực rỡ hơn nữa!\nOfficeX Corporation',
      },
    ],
  },
};

// ─── AI Service Helper ────────────────────────────────────────────────────────
export function buildSlidesFromTemplate(template: AIDeckTemplate, presentation: Presentation): Slide[] {
  const newSlides: Slide[] = [];

  template.slides.forEach((sData, idx) => {
    const slide = new Slide(presentation.slides.length + idx + 1, 'titleAndContent');
    slide.background = template.theme.bg;

    if (sData.layout === 'title') {
      const titleShape = new Shape('text', 80, 140, 800, 140, sData.title, {
        fontFamily: template.theme.font,
        fontSize: 40,
        bold: true,
        textAlign: 'center',
        color: template.theme.primary,
        isTitle: true,
      });
      const subShape = new Shape('text', 120, 300, 720, 100, sData.subtitle || '', {
        fontFamily: template.theme.font,
        fontSize: 20,
        textAlign: 'center',
        color: '#e2e8f0',
        lineHeight: 1.5,
      });
      slide.shapes = [titleShape, subShape];
    } else if (sData.layout === 'cards' && sData.cards) {
      const titleShape = new Shape('text', 60, 40, 840, 60, sData.title, {
        fontFamily: template.theme.font,
        fontSize: 32,
        bold: true,
        textAlign: 'left',
        color: template.theme.primary,
        isTitle: true,
      });
      slide.shapes = [titleShape];

      const cardWidth = 260;
      const cardGap = 20;
      const startX = 60;

      sData.cards.forEach((c, cIdx) => {
        const x = startX + cIdx * (cardWidth + cardGap);
        const cardBox = new Shape('rounded-rect', x, 130, cardWidth, 340, '', {
          fillColor: 'rgba(255,255,255,0.06)',
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1,
        });

        const iconBox = new Shape('text', x + 15, 145, 60, 60, c.icon || '📌', {
          fontSize: 32,
          textAlign: 'left',
        });

        const cardTitle = new Shape('text', x + 15, 215, cardWidth - 30, 50, c.title, {
          fontFamily: template.theme.font,
          fontSize: 18,
          bold: true,
          color: '#ffffff',
        });

        const cardDesc = new Shape('text', x + 15, 275, cardWidth - 30, 170, c.desc, {
          fontFamily: template.theme.font,
          fontSize: 14,
          color: '#cbd5e1',
          lineHeight: 1.5,
        });

        slide.shapes.push(cardBox, iconBox, cardTitle, cardDesc);
      });
    } else if (sData.layout === 'twoContent' && sData.content) {
      const titleShape = new Shape('text', 60, 40, 840, 60, sData.title, {
        fontFamily: template.theme.font,
        fontSize: 32,
        bold: true,
        textAlign: 'left',
        color: template.theme.primary,
        isTitle: true,
      });

      const col1 = new Shape('rounded-rect', 60, 130, 400, 340, '', {
        fillColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
      });
      const text1 = new Shape('text', 80, 150, 360, 300, sData.content[0] || '', {
        fontSize: 16,
        color: '#e2e8f0',
        lineHeight: 1.6,
      });

      const col2 = new Shape('rounded-rect', 500, 130, 400, 340, '', {
        fillColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
      });
      const text2 = new Shape('text', 520, 150, 360, 300, sData.content[1] || '', {
        fontSize: 16,
        color: '#e2e8f0',
        lineHeight: 1.6,
      });

      slide.shapes = [titleShape, col1, text1, col2, text2];
    } else if (sData.layout === 'chart') {
      const titleShape = new Shape('text', 60, 40, 840, 60, sData.title, {
        fontFamily: template.theme.font,
        fontSize: 32,
        bold: true,
        color: template.theme.primary,
        isTitle: true,
      });

      const chartType = sData.chartType === 'pie' ? 'chart-pie' : (sData.chartType === 'line' ? 'chart-line' : 'chart-bar');
      const chartShape = new Shape(chartType as any, 60, 120, 460, 340, '', {
        fillColor: '#ffffff',
        borderColor: 'transparent',
      });

      const textBox = new Shape('text', 560, 140, 340, 300, (sData.content && sData.content.join('\n')) || '• Số liệu tăng trưởng vượt trội\n• Đạt 120% kế hoạch', {
        fontSize: 18,
        color: '#e2e8f0',
        lineHeight: 1.8,
      });

      slide.shapes = [titleShape, chartShape, textBox];
    } else {
      // conclusion
      const titleShape = new Shape('text', 80, 160, 800, 100, sData.title, {
        fontFamily: template.theme.font,
        fontSize: 42,
        bold: true,
        textAlign: 'center',
        color: template.theme.primary,
        isTitle: true,
      });
      const subShape = new Shape('text', 100, 280, 760, 120, sData.subtitle || '', {
        fontFamily: template.theme.font,
        fontSize: 20,
        textAlign: 'center',
        color: '#cbd5e1',
        lineHeight: 1.6,
      });
      slide.shapes = [titleShape, subShape];
    }

    newSlides.push(slide);
  });

  return newSlides;
}

// ─── AI Deck Generator Modal ──────────────────────────────────────────────────
export function AIDeckGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (template: AIDeckTemplate) => void;
}) {
  const [selectedKey, setSelectedKey] = useState<string>('business');
  const [customTopic, setCustomTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleStart = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let tpl = { ...AI_DECK_PRESETS[selectedKey] };
      if (customTopic.trim()) {
        tpl = {
          ...tpl,
          topic: customTopic,
          slides: tpl.slides.map((s, idx) => {
            if (idx === 0) return { ...s, title: customTopic.toUpperCase() };
            return s;
          }),
        };
      }
      onGenerate(tpl);
      setIsGenerating(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-violet-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 p-6 flex items-center justify-between border-b border-violet-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-3xl shadow-inner backdrop-blur-md">
              ✨
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Trình tạo Slide Tự động AI (Deck Generator)</h2>
              <p className="text-xs text-violet-200 mt-0.5">Tạo toàn bộ bộ slide hoàn chỉnh với tiêu đề, nội dung thẻ, biểu đồ và bố cục chuyên nghiệp chỉ với 1 cú click.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Custom Topic Input */}
          <div>
            <label className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-2">
              1. Nhập chủ đề bài thuyết trình của bạn (Hoặc chọn mẫu bên dưới)
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="VD: Kế hoạch ra mắt sản phẩm mới 2026, Giới thiệu Công ty, Báo cáo Doanh thu..."
              className="w-full bg-slate-800/80 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-2">
              2. Chọn Mẫu & Phong cách AI phù hợp
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(AI_DECK_PRESETS).map(([key, tpl]) => {
                const isSelected = selectedKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setSelectedKey(key);
                      if (!customTopic) setCustomTopic(tpl.topic);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-950/60 border-violet-500 ring-2 ring-violet-500/40 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{tpl.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{tpl.topic}</h4>
                        <span className="text-[11px] text-slate-400">{tpl.slides.length} slide chuẩn layout</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{tpl.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Count */}
          <div>
            <label className="text-xs font-bold text-violet-300 uppercase tracking-wider block mb-2">
              3. Số lượng Slide
            </label>
            <div className="flex items-center gap-2">
              {[3, 5, 8, 10].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setSlideCount(cnt)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    slideCount === cnt
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cnt} Slide
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Tự động tạo layout, thẻ highlight, biểu đồ & màu sắc
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleStart}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Đang khởi tạo các slide...</span>
                </>
              ) : (
                <>
                  <span>🚀 Tạo Bộ Slide Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Ribbon Tab Bar ─────────────────────────────────────────────────────────
export function AIRibbon({
  onOpenDeckGenerator,
  onAddAISlide,
  onRewriteText,
  onTranslateSlide,
  onInsertSmartChart,
  onInsertSmartArtAI,
  onAutoDesignAI,
  onTogglePanel,
  isPanelOpen,
  hasSelection,
}: {
  onOpenDeckGenerator: () => void;
  onAddAISlide: (type?: string) => void;
  onRewriteText: (style: 'professional' | 'summarize' | 'expand' | 'bullet' | 'fix') => void;
  onTranslateSlide: (targetLang: 'en' | 'vi') => void;
  onInsertSmartChart: (type: 'bar' | 'pie' | 'line') => void;
  onInsertSmartArtAI: (type: 'process' | 'cycle' | 'hierarchy' | 'matrix') => void;
  onAutoDesignAI: () => void;
  onTogglePanel: () => void;
  isPanelOpen: boolean;
  hasSelection: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 h-[76px] select-none overflow-x-auto">
      {/* ── GROUP 1: GENERATE SLIDES ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 pr-2 border-r border-border shrink-0">
        <button
          onClick={onOpenDeckGenerator}
          className="flex flex-col items-center justify-center px-4 py-1.5 h-[64px] rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 hover:shadow-lg hover:shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all group shrink-0"
          title="Tạo bộ slide hoàn chỉnh tự động theo chủ đề"
        >
          <span className="text-xl leading-none group-hover:rotate-12 transition-transform">✨</span>
          <span className="text-[11px] font-extrabold mt-1 tracking-wide whitespace-nowrap">Tạo Toàn bộ Slide</span>
          <span className="text-[9px] text-violet-200 opacity-90">AI Generator</span>
        </button>

        <button
          onClick={() => onAddAISlide('smart')}
          className="flex flex-col items-center justify-center px-3 py-1.5 h-[64px] rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 transition-all text-violet-700 dark:text-violet-300 shrink-0"
          title="Thêm 1 trang slide mới được AI soạn sẵn nội dung & thẻ"
        >
          <span className="text-lg leading-none">📑</span>
          <span className="text-[10px] font-bold mt-1 whitespace-nowrap">Thêm Slide AI</span>
          <span className="text-[8px] text-muted-foreground">Tự động dàn trang</span>
        </button>
      </div>

      {/* ── GROUP 2: REWRITE & ENHANCE ─────────────────────────────────────── */}
      <div className="flex flex-col justify-between h-[64px] px-2 border-r border-border shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Viết lại & Tối ưu</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onRewriteText('professional')}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-foreground"
            title="Làm cho câu chữ chuyên nghiệp, trang trọng hơn"
          >
            <span>👔</span>
            <span>Chuyên nghiệp</span>
          </button>

          <button
            onClick={() => onRewriteText('summarize')}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-foreground"
            title="Tóm tắt nội dung ngắn gọn súc tích"
          >
            <span>✂️</span>
            <span>Tóm tắt</span>
          </button>

          <button
            onClick={() => onRewriteText('bullet')}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-foreground"
            title="Chuyển đoạn văn thành các gạch đầu dòng rõ ràng"
          >
            <span>•</span>
            <span>Gạch đầu dòng</span>
          </button>

          <button
            onClick={() => onRewriteText('fix')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-foreground"
            title="Sửa lỗi chính tả và ngữ pháp tiếng Việt"
          >
            <span>✔</span>
            <span>Sửa chính tả</span>
          </button>
        </div>
      </div>

      {/* ── GROUP 3: TRANSLATE & SMART VISUALS ─────────────────────────────── */}
      <div className="flex flex-col justify-between h-[64px] px-2 border-r border-border shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Dịch thuật & Đồ họa</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTranslateSlide('en')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors"
            title="Dịch toàn bộ chữ trên slide sang Tiếng Anh"
          >
            <span>🌐</span>
            <span>Sang EN</span>
          </button>

          <button
            onClick={() => onTranslateSlide('vi')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors"
            title="Dịch toàn bộ chữ trên slide sang Tiếng Việt"
          >
            <span>🇻🇳</span>
            <span>Sang VI</span>
          </button>

          <button
            onClick={() => onInsertSmartChart('bar')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-blue-600 dark:text-blue-400"
            title="Chèn biểu đồ số liệu thông minh"
          >
            <span>📊</span>
            <span>Biểu đồ AI</span>
          </button>

          <button
            onClick={() => onInsertSmartArtAI('process')}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-card hover:bg-muted border border-border transition-colors text-amber-600 dark:text-amber-400"
            title="Chèn sơ đồ quy trình tự động"
          >
            <span>🔄</span>
            <span>Sơ đồ AI</span>
          </button>
        </div>
      </div>

      {/* ── GROUP 4: DESIGN & CHAT SIDEBAR ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5 pl-2 shrink-0">
        <button
          onClick={onAutoDesignAI}
          className="flex flex-col items-center justify-center px-3 py-1.5 h-[64px] rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 transition-all text-amber-700 dark:text-amber-300 shrink-0"
          title="Tự động phối màu sắc, font chữ và căn chỉnh thẻ"
        >
          <span className="text-lg leading-none">🎨</span>
          <span className="text-[10px] font-bold mt-1 whitespace-nowrap">Tự Đổi Giao diện</span>
          <span className="text-[8px] text-muted-foreground">Designer Theme</span>
        </button>

        <button
          onClick={onTogglePanel}
          className={`flex flex-col items-center justify-center px-4 py-1.5 h-[64px] rounded-xl transition-all shrink-0 ${
            isPanelOpen
              ? 'bg-violet-700 text-white shadow-md ring-2 ring-violet-400'
              : 'bg-slate-850 hover:bg-slate-800 text-white border border-slate-700 shadow-xs'
          }`}
          style={{ backgroundColor: isPanelOpen ? '#6d28d9' : '#1e1b4b' }}
          title="Mở bảng trò chuyện Trợ lý AI bên phải"
        >
          <span className="text-lg leading-none">🤖</span>
          <span className="text-[10px] font-bold mt-1 whitespace-nowrap">{isPanelOpen ? 'Đóng AI Chat' : 'Mở AI Chat'}</span>
          <span className="text-[8px] text-violet-200">Trợ lý hỗ trợ</span>
        </button>
      </div>
    </div>
  );
}

// ─── AI Floating Chat Panel ───────────────────────────────────────────────────
export function AIPanelFloat({
  isOpen,
  onClose,
  onInsertText,
  onAddSlideWithContent,
  onGenerateFullDeck,
  onApplyTheme,
  slideCount,
  currentSlideIndex,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
  onAddSlideWithContent: (title: string, bullets: string[]) => void;
  onGenerateFullDeck: (topic: string) => void;
  onApplyTheme: (themeKey: string) => void;
  slideCount: number;
  currentSlideIndex: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `## Xin chào! Tôi là Trợ lý AI OfficeX PowerPoint 🤖

Tôi có thể trực tiếp thao tác và tạo nội dung trên bài thuyết trình của bạn:

- 🚀 **Tạo toàn bộ bộ slide theo chủ đề**
- 📑 **Soạn thảo và thêm slide mới tự động**
- ✍️ **Viết lại, tóm tắt và sửa chính tả cho ô đang chọn**
- 📊 **Tạo số liệu & biểu đồ thống kê**
- 🎨 **Đổi màu sắc & giao diện chuyên nghiệp**

*Hãy nhấp vào các nút gợi ý bên dưới hoặc gõ yêu cầu của bạn!*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      const lower = text.toLowerCase();

      setTimeout(() => {
        let aiContent = '';
        let actions: ChatMessage['actions'] = [];

        if (lower.includes('kinh doanh') || lower.includes('business') || lower.includes('kế hoạch')) {
          aiContent = `## 💼 Đã soạn Kế hoạch Kinh doanh 2026

**1. Mục tiêu trọng tâm:** Tăng trưởng 45% doanh thu, mở rộng 30% thị phần B2B
**2. Thị trường:** Đông Nam Á tăng trưởng số 60%
**3. Dự báo tài chính:** Quý 1 (15.2 Tỷ) ➔ Quý 4 (48.6 Tỷ)`;
          actions = [
            { type: 'generate_deck', label: '🚀 Tạo toàn bộ 5 Slide Kinh Doanh', payload: 'business' },
            { type: 'insert_slide', label: '📑 Thêm thành 1 Slide Mới' },
          ];
        } else if (lower.includes('startup') || lower.includes('gọi vốn') || lower.includes('pitch')) {
          aiContent = `## 🚀 Đã soạn Pitch Deck Khởi nghiệp AI

**1. Vấn đề:** 80% thời gian lãng phí vào tác vụ thủ công
**2. Giải pháp:** Tự động hóa 90% quy trình với AI
**3. Kêu gọi vốn:** 1.5M USD cho R&D và mở rộng thị trường`;
          actions = [
            { type: 'generate_deck', label: '🚀 Tạo toàn bộ 5 Slide Pitch Deck', payload: 'startup' },
            { type: 'insert_slide', label: '📑 Thêm thành 1 Slide Mới' },
          ];
        } else if (lower.includes('marketing') || lower.includes('quảng cáo') || lower.includes('truyền thông')) {
          aiContent = `## 📣 Chiến dịch Marketing Đa kênh 2026

- **Kênh Social:** Video ngắn TikTok/Reels tiếp cận 5M+
- **Kênh Performance:** Search & Meta Ads tối ưu CPA < 50k
- **KOL/KOC:** Hợp tác 50+ chuyên gia công nghệ hàng đầu`;
          actions = [
            { type: 'generate_deck', label: '🚀 Tạo toàn bộ 5 Slide Marketing', payload: 'marketing' },
            { type: 'insert_slide', label: '📑 Thêm thành 1 Slide Mới' },
          ];
        } else if (lower.includes('biểu đồ') || lower.includes('dữ liệu') || lower.includes('doanh thu')) {
          aiContent = `## 📊 Đề xuất Biểu đồ Tăng trưởng Doanh thu

- **Doanh thu Quý 1:** 15.2 Tỷ VNĐ (Tăng 18%)
- **Doanh thu Quý 2:** 24.5 Tỷ VNĐ (Tăng 25%)
- **Doanh thu Quý 3:** 32.8 Tỷ VNĐ (Tăng 35%)
- **Doanh thu Quý 4:** 48.6 Tỷ VNĐ (Đỉnh điểm)`;
          actions = [
            { type: 'insert_chart', label: '📊 Chèn Biểu đồ Cột vào Slide' },
            { type: 'insert_text', label: '✍️ Chèn Số liệu vào Slide' },
          ];
        } else if (lower.includes('thiết kế') || lower.includes('màu') || lower.includes('giao diện')) {
          aiContent = `## 🎨 Đề xuất Phong cách Thiết kế Hiện đại

- **Màu chủ đạo:** Tím Gradient (#7c3aed) + Đen Sang trọng (#0f172a)
- **Font chữ:** Inter Bold cho Tiêu đề & Regular cho Nội dung
- **Bố cục:** Dạng thẻ (Card Layout) bo góc 16px với hiệu ứng bóng mờ`;
          actions = [
            { type: 'apply_theme', label: '🎨 Áp dụng Giao diện Tím Công nghệ' },
          ];
        } else {
          aiContent = `## 💡 Ý tưởng Nội dung: "${text.slice(0, 30)}..."

- **Điểm 1:** Trình bày giải pháp cốt lõi một cách trực quan, mạch lạc
- **Điểm 2:** Bổ sung dẫn chứng số liệu thực tế để tăng tính thuyết phục
- **Điểm 3:** Kêu gọi hành động rõ ràng ở phần kết luận slide`;
          actions = [
            { type: 'insert_slide', label: '📑 Thêm thành Slide Mới' },
            { type: 'insert_text', label: '✍️ Chèn vào ô đang chọn' },
          ];
        }

        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: aiContent,
            timestamp: new Date(),
            actions,
          },
        ]);
        setIsLoading(false);
      }, 700);
    },
    [isLoading]
  );

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number], msg: ChatMessage) => {
    if (action.type === 'generate_deck') {
      const key = action.payload || 'business';
      onGenerateFullDeck(key);
    } else if (action.type === 'insert_slide') {
      onAddSlideWithContent('Slide Được Tạo Bởi AI', msg.content.split('\n').filter(l => l.trim()));
    } else if (action.type === 'insert_text') {
      onInsertText(msg.content);
    } else if (action.type === 'insert_chart') {
      onInsertText(msg.content);
    } else if (action.type === 'apply_theme') {
      onApplyTheme('startup');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: 390,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0a0614 0%, #0f0a1e 100%)',
        borderLeft: '1px solid rgba(124,58,237,0.35)',
        boxShadow: '-8px 0 40px rgba(124,58,237,0.15)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 60%, #a855f7 100%)',
          padding: '14px 16px 10px',
          borderBottom: '1px solid rgba(124,58,237,0.4)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Trợ lý AI OfficeX PowerPoint</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Slide {currentSlideIndex + 1}/{slideCount} · Trực tiếp thao tác bài giảng
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          >
            ✕
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
          {[
            { icon: '💼', text: 'Kế hoạch kinh doanh' },
            { icon: '🚀', text: 'Pitch deck gọi vốn' },
            { icon: '📣', text: 'Kế hoạch marketing' },
            { icon: '📊', text: 'Tạo biểu đồ doanh thu' },
            { icon: '🎨', text: 'Đổi giao diện đẹp' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(chip.text)}
              disabled={isLoading}
              style={{
                padding: '3px 9px',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              {chip.icon} {chip.text}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.role === 'user' ? (
              <div
                style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '14px 14px 4px 14px',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: '#fff',
                  fontSize: 12,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                {/* Bubble */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '4px 14px 14px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(124,58,237,0.25)',
                    color: '#e2e8f0',
                    fontSize: 12,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>

                {/* Real-time Interactive Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {msg.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act, msg)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Utility Buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content).catch(() => {});
                      setCopiedId(msg.id);
                      setTimeout(() => setCopiedId(null), 1800);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: copiedId === msg.id ? '#4ade80' : '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedId === msg.id ? '✅ Đã sao chép' : '📋 Sao chép'}
                  </button>
                  <button
                    onClick={() => onInsertText(msg.content)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      background: 'rgba(124,58,237,0.2)',
                      border: '1px solid rgba(124,58,237,0.4)',
                      color: '#a78bfa',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.2)')}
                  >
                    ➕ Chèn vào slide
                  </button>
                </div>
              </div>
            )}
            <span style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>
              {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#7c3aed',
                    animation: `aiBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>AI đang soạn thảo trực tiếp...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: '10px 12px 14px',
          borderTop: '1px solid rgba(124,58,237,0.2)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 12,
            padding: '8px 10px',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            onMouseDown={e => e.stopPropagation()}
            placeholder="Yêu cầu AI (VD: Tạo 5 slide về startup, viết lại chuyên nghiệp...)"
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e2e8f0',
              fontSize: 12,
              resize: 'none',
              lineHeight: 1.5,
              maxHeight: 96,
              overflowY: 'auto',
              fontFamily: 'Inter, sans-serif',
            }}
            onInput={e => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 96) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              flexShrink: 0,
              background:
                input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'rgba(255,255,255,0.05)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              color: '#fff',
              opacity: input.trim() && !isLoading ? 1 : 0.35,
              transition: 'all 0.2s',
            }}
          >
            ➤
          </button>
        </div>
        <div style={{ fontSize: 9, color: '#64748b', marginTop: 5, textAlign: 'center' }}>
          Enter gửi tin nhắn · Shift+Enter xuống dòng
        </div>
      </div>

      <style>{`@keyframes aiBounce{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-5px);opacity:1;}}`}</style>
    </div>
  );
}
