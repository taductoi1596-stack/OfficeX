import React, { useState, useRef, useEffect } from 'react';
import { useRibbonState } from './RibbonController';
import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';
import { RGroup } from './SharedComponents';
import { ColorPicker } from '@officex/ui';
import { 
  IconBold, IconItalic, IconUnderline, IconStrikethrough, 
  IconSubscript, IconSuperscript, IconHighlight, IconFontColor,
  IconChevronDown, IconGrowFont, IconShrinkFont
} from '@officex/icons';

const BASE_FONTS = [
  'Arial', 'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 
  'Courier New', 'Georgia', 'Impact', 'Inter', 'Roboto', 
  'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
];

const FONT_SIZES = [
  8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
];

function FBtn({ icon: Icon, title, onCmd, active, disabled, size = 16 }: {
  icon: any; title?: string; onCmd?: () => void; active?: boolean; disabled?: boolean; size?: number;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onCmd?.();
      }}
      style={{ transition: 'background-color 150ms ease, border-color 150ms ease' }}
      className={`flex items-center justify-center p-[6px] rounded-[6px] border border-transparent outline-none
        ${disabled 
          ? 'text-[#B8B8B8] cursor-default' 
          : active 
            ? 'bg-[#D9E8FB] border-[#9BC2F5] text-[#0F6CBD]' 
            : 'text-[#202020] hover:bg-[#EAEAEA] active:bg-[#D9E8FB] active:text-[#1F5FBF]'
        }
      `}
    >
      <Icon size={size} color={disabled ? '#B8B8B8' : active ? '#0F6CBD' : 'currentColor'} />
    </button>
  );
}

function ColorPickerButton({ 
  icon: Icon, 
  title, 
  defaultColor, 
  onCmd, 
  onHover,
  onLeave,
  allowNoColor 
}: { 
  icon: any; 
  title: string; 
  defaultColor: string; 
  onCmd: (c: string) => void;
  onHover?: (c: string) => void;
  onLeave?: () => void;
  allowNoColor?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeColor, setActiveColor] = useState(defaultColor);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        onLeave?.();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onLeave]);

  return (
    <div className="relative flex items-center border border-transparent hover:bg-[#EAEAEA] rounded-[6px] transition-colors duration-150" ref={wrapperRef}>
      <FBtn 
        icon={() => (
          <div className="flex flex-col items-center">
            <Icon size={16} />
            <div className="w-3.5 h-[3px] mt-[1px]" style={{ backgroundColor: activeColor === 'transparent' ? 'transparent' : activeColor }} />
          </div>
        )} 
        title={title} 
        onCmd={() => onCmd(activeColor)} 
      />
      <button 
        className="w-3.5 h-[28px] flex items-center justify-center hover:bg-[#D0D0D0] rounded-r-[6px]"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <IconChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <ColorPicker
            allowAutomatic={!allowNoColor}
            allowNoColor={allowNoColor}
            onHoverColor={onHover}
            onLeaveColor={onLeave}
            onSelectColor={(c) => {
              setActiveColor(c);
              onCmd(c);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FontComboBox() {
  const rs = useRibbonState();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [fontFamilies, setFontFamilies] = useState<string[]>(BASE_FONTS);
  
  const currentFont = rs.editorState.fontFamily;
  const displayFont = search !== '' ? search : currentFont;

  useEffect(() => {
    // Load real local fonts if supported
    async function loadRealFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const localFonts = await (window as any).queryLocalFonts();
          const fontNames = Array.from(new Set(localFonts.map((f: any) => f.family))) as string[];
          if (fontNames.length > 0) {
            setFontFamilies(fontNames.sort());
          }
        } catch (e) {
          console.warn('Local Font Access denied or failed', e);
        }
      }
    }
    loadRealFonts();

    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        EditorAPI.getLegacy()?.clearLivePreview();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filteredFonts = fontFamilies.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  // Virtualization calculations
  const ITEM_HEIGHT = 24;
  const VISIBLE_ITEMS = 14; // roughly 300px max height / 24px
  const totalHeight = filteredFonts.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 2);
  const endIndex = Math.min(filteredFonts.length, startIndex + VISIBLE_ITEMS + 4);
  const visibleFonts = filteredFonts.slice(startIndex, endIndex);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`flex items-center bg-white border rounded-[4px] h-[26px] w-[130px] transition-colors duration-150
          ${open ? 'border-[#0F6CBD] ring-1 ring-[#0F6CBD]' : 'border-[#D0D0D0] hover:border-[#7AA7E8]'}
        `}
        onClick={() => setOpen(true)}
      >
        <input 
          type="text" 
          className="w-full h-full bg-transparent outline-none px-1.5 text-[11px]"
          value={displayFont}
          onChange={e => { setSearch(e.target.value); setOpen(true); setScrollTop(0); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              CommandDispatcher.dispatch('WORD.HOME.FONT.FAMILY', search);
              setOpen(false);
            }
          }}
        />
        <button className="px-1 text-slate-400 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          <IconChevronDown size={10} />
        </button>
      </div>

      {open && (
        <div 
          className="absolute top-full left-0 mt-1 w-[220px] max-h-[300px] overflow-auto bg-white border border-[#D6D6D6] rounded-[6px] shadow-lg z-50 py-1 font-sans"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
        >
          <div className="px-2 py-1 text-[11px] font-semibold text-[#808080] sticky top-0 bg-white/95 z-10 backdrop-blur-sm border-b border-[#F0F0F0]">
            All Fonts ({filteredFonts.length})
          </div>
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleFonts.map((font, i) => {
              const actualIndex = startIndex + i;
              return (
                <div 
                  key={font}
                  className={`absolute left-0 right-0 px-3 text-[12px] cursor-pointer flex items-center justify-between group transition-colors duration-150
                    ${font === currentFont ? 'bg-[#D9E8FB] text-[#202020]' : 'text-[#202020] hover:bg-[#EAF2FD]'}
                  `}
                  style={{ 
                    top: actualIndex * ITEM_HEIGHT, 
                    height: ITEM_HEIGHT,
                    fontFamily: font.startsWith('Custom') ? 'sans-serif' : font 
                  }}
                  onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreview({ fontFamily: font })}
                  onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                  onClick={() => {
                    CommandDispatcher.dispatch('WORD.HOME.FONT.FAMILY', font);
                    setSearch('');
                    setOpen(false);
                    EditorAPI.getLegacy()?.clearLivePreview();
                  }}
                >
                  <span className="truncate pr-2">{font}</span>
                  {font === currentFont && <span className="text-blue-500 text-[10px] shrink-0">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FontSizeComboBox() {
  const rs = useRibbonState();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const currentSize = rs.editorState.fontSize;
  const displaySize = search !== '' ? search : currentSize.toString();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        EditorAPI.getLegacy()?.clearLivePreview();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`flex items-center bg-white border rounded-[4px] h-[26px] w-[50px] transition-colors duration-150
          ${open ? 'border-[#0F6CBD] ring-1 ring-[#0F6CBD]' : 'border-[#D0D0D0] hover:border-[#7AA7E8]'}
        `}
        onClick={() => setOpen(true)}
      >
        <input 
          type="text" 
          className="w-full h-full bg-transparent outline-none px-1 text-[11px] text-center"
          value={displaySize}
          onChange={e => { setSearch(e.target.value); setOpen(true); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = parseFloat(search);
              if (!isNaN(val) && val > 0 && val <= 1000) {
                CommandDispatcher.dispatch('WORD.HOME.FONT.SIZE', val);
              }
              setOpen(false);
            }
          }}
        />
        <button className="pr-1 text-slate-400 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          <IconChevronDown size={9} />
        </button>
      </div>

      {open && (
        <div 
          className="absolute top-full left-0 mt-1 w-[60px] max-h-[250px] overflow-auto bg-white border border-[#D6D6D6] rounded-[6px] shadow-lg z-50 py-1"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {FONT_SIZES.map(sz => (
            <div 
              key={sz}
              className={`px-3 py-1 text-[12px] text-center cursor-pointer transition-colors duration-150
                ${sz.toString() === currentSize.toString() ? 'bg-[#D9E8FB] text-[#202020]' : 'text-[#202020] hover:bg-[#EAF2FD]'}
              `}
              onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreview({ fontSize: sz })}
              onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
              onClick={() => {
                CommandDispatcher.dispatch('WORD.HOME.FONT.SIZE', sz);
                setSearch('');
                setOpen(false);
                EditorAPI.getLegacy()?.clearLivePreview();
              }}
            >
              {sz}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FontGroup() {
  const rs = useRibbonState();
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  return (
    <RGroup label="Font" onDialogClick={() => exec('WORD.HOME.FONT.DIALOG')}>
      <div className="flex flex-col gap-1 w-full pl-1">
        {/* Row 1 */}
        <div className="flex items-center gap-1">
          <FontComboBox />
          <FontSizeComboBox />
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          <FBtn icon={IconGrowFont} title="Increase Font Size (Ctrl+Shift+>)" onCmd={() => exec('WORD.HOME.FONT.GROW')} />
          <FBtn icon={IconShrinkFont} title="Decrease Font Size (Ctrl+Shift+<)" onCmd={() => exec('WORD.HOME.FONT.SHRINK')} />
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          <FBtn 
            icon={() => <span className="font-serif font-semibold text-[14px] leading-none">Aa</span>} 
            title="Change Case" 
            onCmd={() => exec('WORD.HOME.CHANGECASE')} 
          />
          <FBtn 
            icon={() => <span className="text-[14px] text-red-500 font-semibold underline decoration-2 leading-none">A</span>} 
            title="Clear All Formatting (Ctrl+Space)" 
            onCmd={() => exec('WORD.HOME.CLEAR.FORMAT')} 
          />
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-1">
          <FBtn icon={IconBold} title="Bold (Ctrl+B)" onCmd={() => exec('WORD.HOME.BOLD')} active={rs.active('WORD.HOME.BOLD')} />
          <FBtn icon={IconItalic} title="Italic (Ctrl+I)" onCmd={() => exec('WORD.HOME.ITALIC')} active={rs.active('WORD.HOME.ITALIC')} />
          
          <div className="flex items-center border border-transparent hover:bg-[#EAEAEA] rounded-[6px] transition-colors duration-150">
            <FBtn icon={IconUnderline} title="Underline (Ctrl+U)" onCmd={() => exec('WORD.HOME.UNDERLINE')} active={rs.active('WORD.HOME.UNDERLINE')} />
            <button 
              className="w-3.5 h-[28px] flex items-center justify-center hover:bg-[#D0D0D0] rounded-r-[6px]"
              onClick={(e) => { e.stopPropagation(); exec('WORD.HOME.DOUBLE_UNDERLINE'); }}
              title="Double Underline"
            >
              <IconChevronDown size={10} />
            </button>
          </div>

          <FBtn icon={IconStrikethrough} title="Strikethrough" onCmd={() => exec('WORD.HOME.STRIKETHROUGH')} active={rs.active('WORD.HOME.STRIKETHROUGH')} />
          <FBtn icon={IconSubscript} title="Subscript (Ctrl+=)" onCmd={() => exec('WORD.HOME.SUBSCRIPT')} active={rs.active('WORD.HOME.SUBSCRIPT')} />
          <FBtn icon={IconSuperscript} title="Superscript (Ctrl+Shift++)" onCmd={() => exec('WORD.HOME.SUPERSCRIPT')} active={rs.active('WORD.HOME.SUPERSCRIPT')} />
          
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          
          {/* Typography / Effects Toggle */}
          <FBtn 
            icon={() => <span className="font-serif font-bold text-[15px] text-blue-600 drop-shadow-md leading-none">A</span>} 
            title="Text Effects and Typography" 
            onCmd={() => EditorAPI.getLegacy()?.setTextEffects({ shadow: true, engrave: true })} 
          />
          
          <ColorPickerButton 
            icon={IconHighlight}
            title="Text Highlight Color"
            defaultColor="#FFFF00"
            allowNoColor={true}
            onHover={(c) => EditorAPI.getLegacy()?.applyLivePreview({ highlight: c })}
            onLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
            onCmd={(c) => exec('WORD.HOME.HIGHLIGHT', c)}
          />

          <ColorPickerButton 
            icon={IconFontColor}
            title="Font Color"
            defaultColor="#FF0000"
            allowNoColor={false}
            onHover={(c) => EditorAPI.getLegacy()?.applyLivePreview({ color: c === 'automatic' ? '#000000' : c })}
            onLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
            onCmd={(c) => exec('WORD.HOME.FONTCOLOR', c === 'automatic' ? '' : c)}
          />
        </div>
      </div>
    </RGroup>
  );
}
