import React, { useState, useMemo } from 'react';
import { Button } from '@officex/ui';
import { IconAI, IconSparkles, IconSearch } from '@officex/icons';

export interface DesignTheme {
  id: string;
  name: string;
  category: 'Doanh nghiệp' | 'Tối & Sang trọng' | 'Sáng tạo' | 'Học thuật & Tối giản';
  description: string;
  background: string;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
  cardStyle: {
    fillColor: string;
    borderColor: string;
    borderWidth: number;
  };
}

export const DESIGN_THEMES: DesignTheme[] = [
  // ── 1. Tối & Sang trọng (Dark & Luxury) ──────────────────────────
  {
    id: 'modern-dark',
    name: 'Midnight Modern',
    category: 'Tối & Sang trọng',
    description: 'Phong cách công nghệ tối đỉnh cao với điểm nhấn xanh Cyber Cyan.',
    background: '#0f172a',
    primaryColor: '#38bdf8',
    textColor: '#f8fafc',
    fontFamily: 'Inter',
    cardStyle: {
      fillColor: '#1e293b',
      borderColor: '#38bdf8',
      borderWidth: 1,
    }
  },
  {
    id: 'luxury-gold',
    name: 'Golden Elegance',
    category: 'Tối & Sang trọng',
    description: 'Đẳng cấp hoàng gia với nền than chì và viền ánh kim vàng.',
    background: '#18181b',
    primaryColor: '#eab308',
    textColor: '#fef08a',
    fontFamily: 'Playfair Display',
    cardStyle: {
      fillColor: '#27272a',
      borderColor: '#ca8a04',
      borderWidth: 1,
    }
  },
  {
    id: 'velvet-obsidian',
    name: 'Deep Velvet',
    category: 'Tối & Sang trọng',
    description: 'Nền tím thẫm huyền bí kết hợp ánh hồng Rose Gold quyền lực.',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    primaryColor: '#f43f5e',
    textColor: '#fdf2f8',
    fontFamily: 'Montserrat',
    cardStyle: {
      fillColor: '#312e81',
      borderColor: '#f43f5e',
      borderWidth: 1,
    }
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyberpunk',
    category: 'Tối & Sang trọng',
    description: 'Táo bạo với tông màu neon tương lai trên nền đen thuần khiết.',
    background: '#050505',
    primaryColor: '#22d3ee',
    textColor: '#ffffff',
    fontFamily: 'Fira Code',
    cardStyle: {
      fillColor: '#111827',
      borderColor: '#ec4899',
      borderWidth: 2,
    }
  },
  {
    id: 'titanium-stealth',
    name: 'Titanium Stealth',
    category: 'Tối & Sang trọng',
    description: 'Kim loại xám nòng súng cao cấp với điểm nhấn màu hổ phách.',
    background: '#1c1917',
    primaryColor: '#f59e0b',
    textColor: '#f5f5f4',
    fontFamily: 'Inter',
    cardStyle: {
      fillColor: '#292524',
      borderColor: '#d97706',
      borderWidth: 1,
    }
  },

  // ── 2. Doanh nghiệp & Startup (Corporate & Tech) ─────────────────
  {
    id: 'emerald-corporate',
    name: 'Emerald Clean',
    category: 'Doanh nghiệp',
    description: 'Xanh ngọc lục bảo tươi sáng, thể hiện sự phát triển và bền vững.',
    background: '#f8fafc',
    primaryColor: '#059669',
    textColor: '#0f172a',
    fontFamily: 'Segoe UI',
    cardStyle: {
      fillColor: '#ecfdf5',
      borderColor: '#10b981',
      borderWidth: 2,
    }
  },
  {
    id: 'ocean-deep',
    name: 'Deep Ocean Blue',
    category: 'Doanh nghiệp',
    description: 'Xanh biển sâu thăm thẳm mang lại độ tin cậy và sự chuyên nghiệp.',
    background: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
    primaryColor: '#38bdf8',
    textColor: '#ffffff',
    fontFamily: 'Poppins',
    cardStyle: {
      fillColor: '#0369a1',
      borderColor: '#0284c7',
      borderWidth: 1,
    }
  },
  {
    id: 'fintech-indigo',
    name: 'Fintech Indigo',
    category: 'Doanh nghiệp',
    description: 'Tông màu tím than tài chính hiện đại dành cho ngân hàng & startup.',
    background: '#ffffff',
    primaryColor: '#4f46e5',
    textColor: '#1e1b4b',
    fontFamily: 'Montserrat',
    cardStyle: {
      fillColor: '#eef2ff',
      borderColor: '#6366f1',
      borderWidth: 1.5,
    }
  },
  {
    id: 'enterprise-slate',
    name: 'Executive Cobalt',
    category: 'Doanh nghiệp',
    description: 'Sạch sẽ, vững chãi, tiêu chuẩn thuyết trình phòng hội đồng quản trị.',
    background: '#f1f5f9',
    primaryColor: '#1d4ed8',
    textColor: '#0f172a',
    fontFamily: 'Calibri',
    cardStyle: {
      fillColor: '#ffffff',
      borderColor: '#cbd5e1',
      borderWidth: 1,
    }
  },
  {
    id: 'saas-frost',
    name: 'SaaS Purple Frost',
    category: 'Doanh nghiệp',
    description: 'Phong cách thiết kế sản phẩm phần mềm SaaS với sắc tím Violet.',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    primaryColor: '#7c3aed',
    textColor: '#3b0764',
    fontFamily: 'Inter',
    cardStyle: {
      fillColor: '#ffffff',
      borderColor: '#c084fc',
      borderWidth: 1,
    }
  },

  // ── 3. Sáng tạo & Nghệ thuật (Creative & Aesthetic) ─────────────
  {
    id: 'sunset-gradient',
    name: 'Sunset Vibrant',
    category: 'Sáng tạo',
    description: 'Ấm áp, tràn đầy năng lượng sáng tạo với dải màu hoàng hôn.',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    primaryColor: '#ea580c',
    textColor: '#431407',
    fontFamily: 'Poppins',
    cardStyle: {
      fillColor: '#ffffff',
      borderColor: '#fdba74',
      borderWidth: 1,
    }
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'Sáng tạo',
    description: 'Hồng hoa anh đào dịu nhẹ, nữ tính và thanh lịch.',
    background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    primaryColor: '#e11d48',
    textColor: '#881337',
    fontFamily: 'Playfair Display',
    cardStyle: {
      fillColor: '#ffffff',
      borderColor: '#fda4af',
      borderWidth: 1,
    }
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Sáng tạo',
    description: 'Cực quang huyền ảo đan xen giữa xanh ngọc Teal và tím Violet.',
    background: 'linear-gradient(135deg, #042f2e 0%, #1e1b4b 100%)',
    primaryColor: '#2dd4bf',
    textColor: '#f0fdfa',
    fontFamily: 'Montserrat',
    cardStyle: {
      fillColor: '#134e4a',
      borderColor: '#2dd4bf',
      borderWidth: 1,
    }
  },
  {
    id: 'terracotta-warm',
    name: 'Warm Terracotta',
    category: 'Sáng tạo',
    description: 'Màu đất nung mộc mạc phong cách Địa Trung Hải đầy cảm xúc.',
    background: '#fffbeb',
    primaryColor: '#b45309',
    textColor: '#451a03',
    fontFamily: 'Georgia',
    cardStyle: {
      fillColor: '#fef3c7',
      borderColor: '#f59e0b',
      borderWidth: 1.5,
    }
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Mist',
    category: 'Sáng tạo',
    description: 'Hoa oải hương êm dịu, tinh tế cho các bài thuyết trình ý tưởng mới.',
    background: '#fbfbfe',
    primaryColor: '#8b5cf6',
    textColor: '#2e1065',
    fontFamily: 'Dancing Script',
    cardStyle: {
      fillColor: '#ede9fe',
      borderColor: '#a78bfa',
      borderWidth: 1,
    }
  },

  // ── 4. Học thuật & Tối giản (Academic & Minimalist) ──────────────
  {
    id: 'minimal-light',
    name: 'Minimalist Light',
    category: 'Học thuật & Tối giản',
    description: 'Trắng tinh khiết tối giản chuẩn Thụy Điển, tập trung 100% vào nội dung.',
    background: '#ffffff',
    primaryColor: '#2563eb',
    textColor: '#1e293b',
    fontFamily: 'Inter',
    cardStyle: {
      fillColor: '#f8fafc',
      borderColor: '#e2e8f0',
      borderWidth: 1,
    }
  },
  {
    id: 'vintage-editorial',
    name: 'Vintage Editorial',
    category: 'Học thuật & Tối giản',
    description: 'Báo chí & học thuật kinh điển với giấy ngả vàng và chữ Serif.',
    background: '#fefce8',
    primaryColor: '#991b1b',
    textColor: '#1c1917',
    fontFamily: 'Times New Roman',
    cardStyle: {
      fillColor: '#fef9c3',
      borderColor: '#ca8a04',
      borderWidth: 1,
    }
  },
  {
    id: 'monochrome-studio',
    name: 'Monochrome Studio',
    category: 'Học thuật & Tối giản',
    description: 'Đen trắng tương phản cao chuẩn phong cách tạp chí thời trang Vogue.',
    background: '#ffffff',
    primaryColor: '#000000',
    textColor: '#0a0a0a',
    fontFamily: 'Helvetica',
    cardStyle: {
      fillColor: '#f4f4f5',
      borderColor: '#000000',
      borderWidth: 2,
    }
  },
  {
    id: 'nordic-sage',
    name: 'Nordic Sage',
    category: 'Học thuật & Tối giản',
    description: 'Xanh lá xô thơm Bắc Âu êm dịu cho mắt, tạo cảm giác thư thái.',
    background: '#f0fdf4',
    primaryColor: '#15803d',
    textColor: '#14532d',
    fontFamily: 'Lato',
    cardStyle: {
      fillColor: '#dcfce7',
      borderColor: '#86efac',
      borderWidth: 1,
    }
  },
  {
    id: 'classic-manuscript',
    name: 'Classic Manuscript',
    category: 'Học thuật & Tối giản',
    description: 'Mẫu thuyết trình học thuật, báo cáo luận văn và tài liệu nghiên cứu.',
    background: '#fafaf9',
    primaryColor: '#44403c',
    textColor: '#1c1917',
    fontFamily: 'Merriweather',
    cardStyle: {
      fillColor: '#f5f5f4',
      borderColor: '#a8a29e',
      borderWidth: 1,
    }
  },
];

interface DesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: DesignTheme) => void;
}

const CATEGORIES = ['Tất cả', 'Doanh nghiệp', 'Tối & Sang trọng', 'Sáng tạo', 'Học thuật & Tối giản'] as const;

export const DesignerModal: React.FC<DesignerModalProps> = ({
  isOpen,
  onClose,
  onApplyTheme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThemes = useMemo(() => {
    return DESIGN_THEMES.filter(theme => {
      const matchCat = selectedCategory === 'Tất cả' || theme.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || theme.name.toLowerCase().includes(q) || theme.description.toLowerCase().includes(q) || theme.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-background/95 backdrop-blur border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md">
            <IconSparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Designer <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-1.5 py-0.5 rounded font-bold shadow-xs">AI</span>
            </h3>
            <p className="text-[11px] text-muted-foreground">Kho ý tưởng thiết kế slide ({DESIGN_THEMES.length} mẫu)</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="relative flex items-center">
          <IconSearch size={13} className="absolute left-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm phong cách giao diện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-background border border-input rounded-md text-xs outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Tabs */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 bg-muted/20">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-xs' : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Body Big 16:9 Slide Preview Cards with Smooth Scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
        {filteredThemes.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Không tìm thấy giao diện phù hợp với từ khóa
          </div>
        ) : (
          filteredThemes.map(theme => (
            <div
              key={theme.id}
              className="group cursor-pointer rounded-2xl border-2 border-border/80 hover:border-orange-500 overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 shrink-0"
              onClick={() => {
                onApplyTheme(theme);
              }}
            >
              {/* Big 16:9 Slide Visual Preview */}
              <div
                className="h-44 p-4 flex flex-col justify-between relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01] shrink-0"
                style={{ background: theme.background }}
              >
                {/* Header Row */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-base font-extrabold tracking-tight truncate max-w-[240px]"
                      style={{ color: theme.primaryColor, fontFamily: theme.fontFamily }}
                    >
                      {theme.name}
                    </span>
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-xs"
                      style={{ 
                        backgroundColor: theme.cardStyle.fillColor, 
                        color: theme.textColor,
                        border: `1px solid ${theme.cardStyle.borderColor}`
                      }}
                    >
                      {theme.fontFamily}
                    </span>
                  </div>
                  <div
                    className="text-[11px] line-clamp-1 opacity-90 leading-tight font-medium"
                    style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
                  >
                    {theme.description}
                  </div>
                </div>

                {/* Subtitle / Bullet preview */}
                <div 
                  className="text-[10px] opacity-80 flex items-center gap-1.5"
                  style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }}></span>
                  <span>Thiết kế chuyên nghiệp, nổi bật thông điệp trình chiếu</span>
                </div>

                {/* Mini Mockup Visual Cards */}
                <div className="flex gap-2.5 items-center mt-1">
                  <div
                    className="h-9 flex-1 rounded-lg px-3 flex items-center justify-between text-[10px] font-semibold shadow-sm"
                    style={{
                      backgroundColor: theme.cardStyle.fillColor,
                      borderColor: theme.cardStyle.borderColor,
                      borderWidth: `${theme.cardStyle.borderWidth}px`,
                      color: theme.textColor,
                    }}
                  >
                    <span className="truncate">📊 Báo cáo dự án</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primaryColor }}></span>
                  </div>
                  <div
                    className="h-9 flex-1 rounded-lg px-3 flex items-center justify-between text-[10px] font-semibold shadow-sm"
                    style={{
                      backgroundColor: theme.cardStyle.fillColor,
                      borderColor: theme.cardStyle.borderColor,
                      borderWidth: `${theme.cardStyle.borderWidth}px`,
                      color: theme.textColor,
                    }}
                  >
                    <span>🎯 Hiệu suất</span>
                    <span className="text-[10px] font-bold" style={{ color: theme.primaryColor }}>+42%</span>
                  </div>
                </div>
              </div>

              {/* Theme Info Footer & Apply Action */}
              <div className="px-4 py-2.5 bg-card flex items-center justify-between text-xs border-t border-border">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-xs">{theme.name}</span>
                  <span className="text-[10px] text-muted-foreground">{theme.category}</span>
                </div>
                <button
                  className="px-3.5 py-1.5 bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-500 hover:text-white text-orange-600 text-xs font-bold rounded-lg transition-all shadow-xs group-hover:bg-orange-500 group-hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyTheme(theme);
                  }}
                >
                  Áp dụng giao diện
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
