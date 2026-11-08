import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@officex/ui';
import { IconPlus, IconTrash, IconCopy, IconChevronDown } from '@officex/icons';
import { SlideLayout } from '@officex/presentation-core';

interface SlidesGroupProps {
  onNewSlide: (layout?: SlideLayout) => void;
  onChangeLayout: (layout: SlideLayout) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  canDeleteSlide: boolean;
}

const LAYOUT_OPTIONS: Array<{ id: SlideLayout; label: string; desc: string; icon: React.ReactNode }> = [
  {
    id: 'title',
    label: 'Trang bìa (Title Slide)',
    desc: 'Tiêu đề lớn và phụ đề',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col items-center justify-center gap-0.5">
        <div className="w-6 h-1.5 bg-orange-500 rounded-sm"></div>
        <div className="w-4 h-1 bg-slate-400 rounded-sm"></div>
      </div>
    ),
  },
  {
    id: 'titleAndContent',
    label: 'Tiêu đề & Nội dung',
    desc: 'Tiêu đề trên và khối nội dung',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col gap-0.5">
        <div className="w-7 h-1.5 bg-orange-500 rounded-sm"></div>
        <div className="w-8 h-3.5 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
      </div>
    ),
  },
  {
    id: 'sectionHeader',
    label: 'Tiêu đề phần (Section)',
    desc: 'Phân cách giữa các phần',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col justify-center gap-0.5">
        <div className="w-7 h-2 bg-orange-500 rounded-sm"></div>
        <div className="w-5 h-1 bg-slate-400 rounded-sm"></div>
      </div>
    ),
  },
  {
    id: 'twoContent',
    label: 'Hai nội dung (2 Columns)',
    desc: 'Tiêu đề và 2 cột văn bản',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col gap-0.5">
        <div className="w-7 h-1.5 bg-orange-500 rounded-sm"></div>
        <div className="flex gap-0.5 flex-1">
          <div className="w-3.5 h-3 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
          <div className="w-3.5 h-3 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
        </div>
      </div>
    ),
  },
  {
    id: 'comparison',
    label: 'So sánh (Comparison)',
    desc: 'So sánh 2 mục với tiêu đề riêng',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col gap-0.5">
        <div className="w-7 h-1 bg-orange-500 rounded-sm"></div>
        <div className="flex gap-0.5 flex-1">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 bg-slate-400 rounded-sm"></div>
            <div className="h-2.5 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="h-1 bg-slate-400 rounded-sm"></div>
            <div className="h-2.5 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'titleOnly',
    label: 'Chỉ tiêu đề',
    desc: 'Chỉ có thanh tiêu đề trên',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5 flex flex-col gap-0.5">
        <div className="w-7 h-1.5 bg-orange-500 rounded-sm"></div>
      </div>
    ),
  },
  {
    id: 'blank',
    label: 'Trang trống (Blank)',
    desc: 'Trang trắng tự do thiết kế',
    icon: (
      <div className="w-10 h-7 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-800 p-0.5"></div>
    ),
  },
];

export const SlidesGroup: React.FC<SlidesGroupProps> = ({
  onNewSlide,
  onChangeLayout,
  onDuplicateSlide,
  onDeleteSlide,
  canDeleteSlide,
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const newMenuRef = useRef<HTMLDivElement>(null);
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(e.target as Node)) {
        setShowLayoutMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      <div className="flex items-center gap-1">
        {/* New Slide Button with Split Dropdown */}
        <div className="relative flex flex-col" ref={newMenuRef}>
          <div className="flex rounded border border-border overflow-hidden hover:border-orange-500 transition-colors">
            <button
              className="h-14 px-2 bg-background hover:bg-muted/80 flex flex-col items-center justify-center gap-0.5 text-foreground transition-colors"
              onClick={() => onNewSlide('titleAndContent')}
              title="Thêm Trang chiếu Mới (Ctrl+M)"
            >
              <div className="w-6 h-4 border border-orange-500 rounded-sm flex items-center justify-center bg-orange-50 dark:bg-orange-950/30">
                <IconPlus size={10} className="text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-[10px] font-medium leading-none whitespace-nowrap">Trang chiếu Mới</span>
            </button>
            <button
              className="w-4 h-14 bg-background hover:bg-muted/80 flex items-center justify-center border-l border-border transition-colors"
              onClick={() => setShowNewMenu(!showNewMenu)}
              title="Chọn bố cục trang mới"
            >
              <IconChevronDown size={11} />
            </button>
          </div>

          {/* New Slide Layouts Popup Menu */}
          {showNewMenu && (
            <div className="absolute left-0 top-full mt-2 z-[999] w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg p-2 grid grid-cols-1 gap-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 border-b border-slate-200 dark:border-slate-800 mb-1">
                CHỌN BỐ CỤC TRANG CHIẾU MỚI
              </div>
              {LAYOUT_OPTIONS.map((layout) => (
                <button
                  key={layout.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left transition-colors group"
                  onClick={() => {
                    onNewSlide(layout.id);
                    setShowNewMenu(false);
                  }}
                >
                  <div className="shrink-0">{layout.icon}</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold leading-tight group-hover:text-orange-600">{layout.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{layout.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout & Slide Actions */}
        <div className="flex flex-col gap-0.5">
          {/* Layout Dropdown Button */}
          <div className="relative" ref={layoutMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px] flex items-center gap-1 hover:bg-muted font-normal"
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              title="Đổi bố cục slide hiện tại"
            >
              <span className="text-[10px]">Bố cục</span>
              <IconChevronDown size={10} />
            </Button>

            {showLayoutMenu && (
              <div className="absolute left-0 top-full mt-2 z-[999] w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg p-2 grid grid-cols-1 gap-1">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 border-b border-slate-200 dark:border-slate-800 mb-1">
                  ĐỔI BỐ CỤC SLIDE ĐANG CHỌN
                </div>
                {LAYOUT_OPTIONS.map((layout) => (
                  <button
                    key={layout.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left transition-colors group"
                    onClick={() => {
                      onChangeLayout(layout.id);
                      setShowLayoutMenu(false);
                    }}
                  >
                    <div className="shrink-0">{layout.icon}</div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold leading-tight group-hover:text-orange-600">{layout.label}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">{layout.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-[10px] hover:bg-muted"
              onClick={onDuplicateSlide}
              title="Nhân bản Slide này"
            >
              <IconCopy size={11} className="mr-1" />
              <span>Nhân bản</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40"
              disabled={!canDeleteSlide}
              onClick={onDeleteSlide}
              title="Xóa Slide này"
            >
              <IconTrash size={11} className="mr-1" />
              <span>Xóa</span>
            </Button>
          </div>
        </div>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Trang chiếu
      </span>
    </div>
  );
};
