import React, { useState, useRef, useEffect } from 'react';
import { 
  IconBullets, 
  IconNumbering, 
  IconIndentDecrease, 
  IconIndentIncrease, 
  IconAlignLeft, 
  IconAlignCenter, 
  IconAlignRight, 
  IconAlignJustify, 
  IconLineSpacing, 
  IconChevronDown 
} from '@officex/icons';
import { ShapeFormat } from '@officex/presentation-core';

interface ParagraphGroupProps {
  currentFormat: ShapeFormat;
  onFormatChange: (format: Partial<ShapeFormat>) => void;
  onToggleBullets: (bulletChar?: string) => void;
  onToggleNumbering: (numStyle?: string) => void;
  onIndentIncrease: () => void;
  onIndentDecrease: () => void;
  disabled?: boolean;
}

const BULLET_STYLES = [
  { char: '•', label: 'Chấm tròn đặc (•)' },
  { char: '○', label: 'Chấm tròn rỗng (○)' },
  { char: '■', label: 'Hình vuông (■)' },
  { char: '➢', label: 'Mũi tên (➢)' },
  { char: '✔', label: 'Dấu tích (✔)' },
  { char: '-', label: 'Gạch đầu dòng (-)' },
];

const NUMBER_STYLES = [
  { style: '1.', label: '1. 2. 3.' },
  { style: '1)', label: '1) 2) 3)' },
  { style: 'A.', label: 'A. B. C.' },
  { style: 'a.', label: 'a. b. c.' },
  { style: 'I.', label: 'I. II. III.' },
  { style: 'i.', label: 'i. ii. iii.' },
];

const LINE_SPACINGS = [1.0, 1.15, 1.5, 2.0, 2.5, 3.0];

export const ParagraphGroup: React.FC<ParagraphGroupProps> = ({
  currentFormat,
  onFormatChange,
  onToggleBullets,
  onToggleNumbering,
  onIndentIncrease,
  onIndentDecrease,
}) => {
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const [showNumberMenu, setShowNumberMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);

  const bulletMenuRef = useRef<HTMLDivElement>(null);
  const numberMenuRef = useRef<HTMLDivElement>(null);
  const spacingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bulletMenuRef.current && !bulletMenuRef.current.contains(e.target as Node)) setShowBulletMenu(false);
      if (numberMenuRef.current && !numberMenuRef.current.contains(e.target as Node)) setShowNumberMenu(false);
      if (spacingMenuRef.current && !spacingMenuRef.current.contains(e.target as Node)) setShowSpacingMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 border-r border-border pr-3 shrink-0">
      {/* Row 1: Bullets, Numbering, Indent Dec, Indent Inc, Line Spacing */}
      <div className="flex items-center gap-0.5">
        {/* Bullets with Split Dropdown */}
        <div className="relative flex items-center rounded border border-transparent hover:bg-muted transition-colors" ref={bulletMenuRef}>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onToggleBullets('•');
            }}
            className={`h-6 px-1.5 flex items-center justify-center rounded-l transition-colors ${currentFormat.bullet ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold' : 'hover:bg-muted'}`}
            title="Dấu đầu dòng (Nhấp để bật/tắt)"
          >
            <IconBullets size={14} />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-0.5 flex items-center justify-center hover:bg-muted-foreground/20 rounded-r"
            onClick={() => setShowBulletMenu(!showBulletMenu)}
            title="Chọn kiểu dấu đầu dòng"
          >
            <IconChevronDown size={8} className="text-muted-foreground" />
          </button>

          {showBulletMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-44 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg p-1.5 animate-in fade-in duration-100">
              <div className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 uppercase">KIỂU DẤU ĐẦU DÒNG</div>
              {BULLET_STYLES.map(b => (
                <button
                  key={b.char}
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    onToggleBullets(b.char);
                    setShowBulletMenu(false);
                  }}
                >
                  <span className="w-5 text-center font-bold text-orange-600">{b.char}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Numbering with Split Dropdown */}
        <div className="relative flex items-center rounded border border-transparent hover:bg-muted transition-colors" ref={numberMenuRef}>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onToggleNumbering('1.');
            }}
            className={`h-6 px-1.5 flex items-center justify-center rounded-l transition-colors ${currentFormat.numbering ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold' : 'hover:bg-muted'}`}
            title="Đánh số thứ tự (Nhấp để bật/tắt)"
          >
            <IconNumbering size={14} />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-0.5 flex items-center justify-center hover:bg-muted-foreground/20 rounded-r"
            onClick={() => setShowNumberMenu(!showNumberMenu)}
            title="Chọn kiểu đánh số"
          >
            <IconChevronDown size={8} className="text-muted-foreground" />
          </button>

          {showNumberMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-40 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-lg p-1.5 animate-in fade-in duration-100">
              <div className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 uppercase">KIỂU ĐÁNH SỐ</div>
              {NUMBER_STYLES.map(n => (
                <button
                  key={n.style}
                  onMouseDown={(e) => e.preventDefault()}
                  className="w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center gap-2 transition-colors font-mono"
                  onClick={() => {
                    onToggleNumbering(n.style);
                    setShowNumberMenu(false);
                  }}
                >
                  <span className="w-6 text-center font-bold text-orange-600">{n.style}</span>
                  <span>{n.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decrease Indent */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onIndentDecrease();
          }}
          className="h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors"
          title="Giảm thụt lề (Decrease Indent)"
        >
          <IconIndentDecrease size={14} />
        </button>

        {/* Increase Indent */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onIndentIncrease();
          }}
          className="h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors"
          title="Tăng thụt lề (Increase Indent)"
        >
          <IconIndentIncrease size={14} />
        </button>

        {/* Line Spacing Dropdown */}
        <div className="relative" ref={spacingMenuRef}>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-6 px-1 hover:bg-muted rounded flex items-center gap-0.5 transition-colors"
            onClick={() => setShowSpacingMenu(!showSpacingMenu)}
            title="Khoảng cách dòng (Line Spacing)"
          >
            <IconLineSpacing size={13} />
            <IconChevronDown size={8} className="text-muted-foreground" />
          </button>

          {showSpacingMenu && (
            <div className="absolute left-0 top-full mt-1 z-[999] w-28 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-md p-1">
              <div className="text-[10px] font-semibold text-muted-foreground px-2 py-0.5">GIÃN DÒNG</div>
              {LINE_SPACINGS.map(spacing => (
                <button
                  key={spacing}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`w-full px-2 py-1 text-left text-xs rounded hover:bg-orange-50 dark:hover:bg-orange-950/40 ${currentFormat.lineHeight === spacing ? 'bg-orange-100 dark:bg-orange-950 font-semibold text-orange-600' : ''}`}
                  onClick={() => {
                    onFormatChange({ lineHeight: spacing });
                    setShowSpacingMenu(false);
                  }}
                >
                  {spacing.toFixed(2)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Align Left, Center, Right, Justify */}
      <div className="flex items-center gap-0.5">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ textAlign: 'left' });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${(currentFormat.textAlign || 'left') === 'left' ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Căn lề trái (Ctrl+L)"
        >
          <IconAlignLeft size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ textAlign: 'center' });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.textAlign === 'center' ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Căn giữa (Ctrl+E)"
        >
          <IconAlignCenter size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ textAlign: 'right' });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.textAlign === 'right' ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Căn lề phải (Ctrl+R)"
        >
          <IconAlignRight size={13} />
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onFormatChange({ textAlign: 'justify' });
          }}
          className={`h-6 w-6 p-0 hover:bg-muted rounded flex items-center justify-center transition-colors ${currentFormat.textAlign === 'justify' ? 'bg-orange-100 dark:bg-orange-950 text-orange-600' : ''}`}
          title="Căn đều hai bên (Ctrl+J)"
        >
          <IconAlignJustify size={13} />
        </button>
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-auto uppercase tracking-wider font-semibold">
        Đoạn văn
      </span>
    </div>
  );
};
