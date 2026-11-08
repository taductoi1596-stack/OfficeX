import React, { useState, useEffect, useRef } from 'react';
import { 
  DEFAULT_THEME, 
  getAccentVariants, 
  getNeutralVariants, 
  STANDARD_COLORS 
} from './ColorUtils';
import { ColorPickerStore } from './ColorPickerStore';

export interface ColorPickerProps {
  onSelectColor: (color: string) => void;
  onHoverColor?: (color: string) => void;
  onLeaveColor?: () => void;
  onClose?: () => void;
  allowAutomatic?: boolean;
  allowNoColor?: boolean;
}

export function ColorPicker({
  onSelectColor,
  onHoverColor,
  onLeaveColor,
  onClose,
  allowAutomatic = true,
  allowNoColor = false,
}: ColorPickerProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const hoverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setRecentColors(ColorPickerStore.getRecentColors());
    const unsubscribe = ColorPickerStore.subscribe(() => {
      setRecentColors(ColorPickerStore.getRecentColors());
    });
    return () => { unsubscribe(); };
  }, []);

  const handleHover = (color: string) => {
    if (!onHoverColor) return;
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      onHoverColor(color);
    }, 150);
  };

  const handleLeave = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    onLeaveColor?.();
  };

  const handleSelect = (color: string) => {
    if (color !== 'transparent' && color !== 'automatic') {
      ColorPickerStore.addRecentColor(color);
    }
    onSelectColor(color);
    onClose?.();
  };

  const renderColorBlock = (color: string, title?: string) => (
    <button
      key={color}
      className="w-[18px] h-[18px] border border-transparent hover:border-[#F29511] hover:shadow-[0_0_0_1px_#F29511] focus:outline-none focus:border-[#F29511] transition-all cursor-pointer"
      style={{ backgroundColor: color }}
      title={title || color}
      onMouseEnter={() => handleHover(color)}
      onMouseLeave={handleLeave}
      onClick={() => handleSelect(color)}
    />
  );

  // Generate Theme Grid
  const themeBaseColors = [
    DEFAULT_THEME.light1,
    DEFAULT_THEME.dark1,
    DEFAULT_THEME.light2,
    DEFAULT_THEME.dark2,
    DEFAULT_THEME.accent1,
    DEFAULT_THEME.accent2,
    DEFAULT_THEME.accent3,
    DEFAULT_THEME.accent4,
    DEFAULT_THEME.accent5,
    DEFAULT_THEME.accent6,
  ];

  const themeVariants = themeBaseColors.map((base, idx) => {
    if (idx < 4) return getNeutralVariants(base, idx % 2 === 0);
    return getAccentVariants(base);
  });

  return (
    <div 
      className="w-[230px] bg-white border border-[#D8D8D8] rounded-[8px] p-[12px] flex flex-col gap-2 font-sans text-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] z-50 select-none"
    >
      {/* Automatic / No Color */}
      {(allowAutomatic || allowNoColor) && (
        <div className="flex flex-col gap-1 border-b border-[#E5E5E5] pb-2">
          {allowAutomatic && (
            <button 
              className="flex items-center gap-2 px-2 py-1 hover:bg-[#EAEAEA] rounded-[4px] text-left transition-colors"
              onMouseEnter={() => handleHover('automatic')}
              onMouseLeave={handleLeave}
              onClick={() => handleSelect('automatic')}
            >
              <div className="w-[18px] h-[18px] bg-black border border-[#D0D0D0]" />
              <span>Automatic</span>
            </button>
          )}
          {allowNoColor && (
            <button 
              className="flex items-center gap-2 px-2 py-1 hover:bg-[#EAEAEA] rounded-[4px] text-left transition-colors"
              onMouseEnter={() => handleHover('transparent')}
              onMouseLeave={handleLeave}
              onClick={() => handleSelect('transparent')}
            >
              <div className="w-[18px] h-[18px] border border-[#D0D0D0] bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[24px] h-[1px] bg-red-500 origin-top-left rotate-45" />
              </div>
              <span>No Color</span>
            </button>
          )}
        </div>
      )}

      {/* Theme Colors */}
      <div className="flex flex-col gap-1">
        <div className="text-[#808080] font-semibold text-[11px] uppercase tracking-wide">Theme Colors</div>
        <div className="flex flex-col gap-[2px]">
          {/* Base Row */}
          <div className="flex justify-between">
            {themeBaseColors.map((c, i) => (
              <div key={i} className="flex flex-col gap-[2px]">
                <button
                  className="w-[18px] h-[18px] border border-[#D0D0D0] hover:border-[#F29511] hover:shadow-[0_0_0_1px_#F29511] focus:outline-none transition-all cursor-pointer"
                  style={{ backgroundColor: c }}
                  onMouseEnter={() => handleHover(c)}
                  onMouseLeave={handleLeave}
                  onClick={() => handleSelect(c)}
                  title="Theme Color"
                />
              </div>
            ))}
          </div>
          {/* Variants Grid */}
          <div className="flex justify-between mt-1">
            {themeBaseColors.map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[2px]">
                {themeVariants[colIdx].map((variantColor, rowIdx) => (
                  <button
                    key={rowIdx}
                    className="w-[18px] h-[14px] hover:scale-110 focus:outline-none hover:shadow-[0_0_0_1px_#F29511] transition-all cursor-pointer"
                    style={{ backgroundColor: variantColor }}
                    onMouseEnter={() => handleHover(variantColor)}
                    onMouseLeave={handleLeave}
                    onClick={() => handleSelect(variantColor)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standard Colors */}
      <div className="flex flex-col gap-1 border-t border-[#E5E5E5] pt-2">
        <div className="text-[#808080] font-semibold text-[11px] uppercase tracking-wide">Standard Colors</div>
        <div className="flex justify-between">
          {STANDARD_COLORS.map(c => renderColorBlock(c, 'Standard Color'))}
        </div>
      </div>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-[#E5E5E5] pt-2">
          <div className="text-[#808080] font-semibold text-[11px] uppercase tracking-wide">Recent Colors</div>
          <div className="flex flex-wrap gap-[3px]">
            {recentColors.map(c => (
              <button
                key={c}
                className="w-[18px] h-[18px] border border-[#D0D0D0] hover:border-[#F29511] hover:shadow-[0_0_0_1px_#F29511] focus:outline-none transition-all cursor-pointer"
                style={{ backgroundColor: c }}
                onMouseEnter={() => handleHover(c)}
                onMouseLeave={handleLeave}
                onClick={() => handleSelect(c)}
                title={c}
              />
            ))}
          </div>
        </div>
      )}

      {/* More Colors */}
      <div className="border-t border-[#E5E5E5] pt-2 mt-1">
        <button 
          className="w-full text-center py-1 hover:bg-[#EAEAEA] rounded-[4px] text-[#202020] transition-colors"
          onClick={() => {
            // Temporary Native Color Picker hook for V1
            const input = document.createElement('input');
            input.type = 'color';
            input.oninput = (e) => handleHover((e.target as HTMLInputElement).value);
            input.onchange = (e) => handleSelect((e.target as HTMLInputElement).value);
            input.click();
          }}
        >
          More Colors...
        </button>
      </div>
    </div>
  );
}
