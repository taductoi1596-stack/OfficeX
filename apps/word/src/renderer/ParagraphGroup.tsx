import React, { useState, useRef, useEffect } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';
import { RGroup, RBtn } from './SharedComponents';
import { ColorPicker, Dropdown } from '@officex/ui';
import { 
  IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify,
  IconIndentIncrease, IconIndentDecrease,
  IconBullets, IconNumbering, IconMultiLevel,
  IconLineSpacing, IconBorders, IconShading, IconSort,
  IconShowMarks as IconShowFormatting,
  IconAlignDistributed
} from '@officex/icons';
import { useRibbonState } from './RibbonController';

// A specialized FBtn that mimics Microsoft Word Ribbon button styles
function FBtn({ icon: Icon, title, onCmd, active, size = 16, onMouseEnter, onMouseLeave }: any) {
  return (
    <button 
      onMouseDown={(e) => { e.preventDefault(); onCmd(); }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`w-7 h-7 flex items-center justify-center rounded-[6px] transition-colors duration-150 ${active ? 'bg-[#D9E8FB] shadow-[inset_0_0_0_1px_#9BC2F5]' : 'hover:bg-[#EAEAEA] border border-transparent'}`}
      title={title}
    >
      {typeof Icon === 'function' ? <Icon size={size} className={active ? 'text-[#0F6CBD]' : 'text-[#424242]'} /> : <Icon />}
    </button>
  );
}

// Hover wrapper for Live Preview Alignment
function AlignBtn({ icon, title, cmd, alignVal, rs, exec }: any) {
  return (
    <FBtn 
      icon={icon} 
      title={title} 
      onCmd={() => exec(cmd)} 
      active={rs.active(cmd)} 
      onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreviewPara({ align: alignVal })}
      onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
    />
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
}: any) {
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
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <ColorPicker
            allowAutomatic={false}
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

export function ParagraphGroup() {
  const rs = useRibbonState();
  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);

  return (
    <RGroup label="Paragraph" onDialogClick={() => exec('WORD.PARAGRAPH.DIALOG')}>
      <div className="flex flex-col gap-1 w-full pl-1">
        {/* Row 1: lists + indent + sort + show formatting */}
        <div className="flex items-center gap-1">
          <Dropdown
            trigger={
              <div className="flex items-stretch h-7 group/bullet relative">
                <FBtn icon={IconBullets} title="Bullets" onCmd={() => exec('WORD.BULLET.DEFAULT')} active={rs.active('WORD.BULLET.DEFAULT')} />
                <button className="flex items-center justify-center w-4 hover:bg-[#EAEAEA] rounded-r border-l border-transparent hover:border-[#C6C6C6]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
            }
          >
            <div className="p-2 w-64 bg-white border border-[#C6C6C6] shadow-lg rounded">
              <div className="text-xs font-semibold text-gray-500 mb-2">Bullet Library</div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {['None', '•', '○', '■', '□', '◆', '➜', '✓'].map(char => (
                  <button key={char} 
                    className="w-12 h-12 flex items-center justify-center border border-transparent hover:bg-[#EAEAEA] hover:border-[#C6C6C6] rounded text-xl"
                    onClick={() => {
                      if (char === 'None') exec('WORD.BULLET.REMOVE');
                      else exec('WORD.BULLET.SYMBOL', char);
                      EditorAPI.getLegacy()?.clearLivePreview();
                    }}
                    onMouseEnter={() => {
                      if (char === 'None') EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: null });
                      else EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: 'bullet', bulletType: 'symbol', bulletChar: char });
                    }}
                    onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                  >
                    {char === 'None' ? <span className="text-xs text-gray-400">None</span> : char}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-1">
                <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#EAEAEA] rounded" onClick={() => exec('WORD.BULLET.CUSTOM')}>Define New Bullet...</button>
              </div>
            </div>
          </Dropdown>
          <Dropdown
            trigger={
              <div className="flex items-stretch h-7 group/number relative">
                <FBtn icon={IconNumbering} title="Numbering" onCmd={() => exec('WORD.NUMBER.DEFAULT')} active={rs.active('WORD.NUMBER.DEFAULT')} />
                <button className="flex items-center justify-center w-4 hover:bg-[#EAEAEA] rounded-r border-l border-transparent hover:border-[#C6C6C6]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
            }
          >
            <div className="p-2 w-[340px] bg-white border border-[#C6C6C6] shadow-lg rounded">
              <div className="text-xs font-semibold text-gray-500 mb-2">Numbering Library</div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <button className="h-16 flex flex-col items-center justify-center border border-transparent hover:bg-[#EAEAEA] hover:border-[#C6C6C6] rounded"
                  onClick={() => { exec('WORD.NUMBER.REMOVE'); EditorAPI.getLegacy()?.clearLivePreview(); }}
                  onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: null })}
                  onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                >
                  <span className="text-sm font-semibold text-gray-400">None</span>
                </button>
                {[
                  { format: 'decimal', prefix: '', suffix: '.', preview: ['1.', '2.', '3.'] },
                  { format: 'decimal', prefix: '', suffix: ')', preview: ['1)', '2)', '3)'] },
                  { format: 'upper-roman', prefix: '', suffix: '.', preview: ['I.', 'II.', 'III.'] },
                  { format: 'upper-alpha', prefix: '', suffix: '.', preview: ['A.', 'B.', 'C.'] },
                  { format: 'lower-alpha', prefix: '', suffix: ')', preview: ['a)', 'b)', 'c)'] },
                  { format: 'lower-roman', prefix: '', suffix: '.', preview: ['i.', 'ii.', 'iii.'] },
                ].map((item, idx) => (
                  <button key={idx} 
                    className="h-16 flex flex-col items-start justify-center pl-4 border border-transparent hover:bg-[#EAEAEA] hover:border-[#C6C6C6] rounded text-sm text-[#444]"
                    onClick={() => {
                      exec('WORD.NUMBER.FORMAT', { format: item.format, prefix: item.prefix, suffix: item.suffix });
                      EditorAPI.getLegacy()?.clearLivePreview();
                    }}
                    onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: 'number', listFormat: item.format, numberPrefix: item.prefix, numberSuffix: item.suffix })}
                    onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                  >
                    {item.preview.map(line => <div key={line} className="flex gap-2 leading-tight"><span>{line}</span><div className="h-2 w-8 mt-1.5 bg-gray-200"></div></div>)}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-1">
                <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#EAEAEA] rounded" onClick={() => exec('WORD.NUMBER.DIALOG')}>Define New Number Format...</button>
                <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#EAEAEA] rounded" onClick={() => exec('WORD.NUMBER.START_AT')}>Set Numbering Value...</button>
              </div>
            </div>
          </Dropdown>
          <Dropdown
            trigger={
              <div className="flex items-stretch h-7 group/multilevel relative">
                <FBtn icon={IconMultiLevel} title="Multi-level List" onCmd={() => exec('WORD.MULTILEVEL.DEFAULT')} active={rs.active('WORD.MULTILEVEL.DEFAULT')} />
                <button className="flex items-center justify-center w-4 hover:bg-[#EAEAEA] rounded-r border-l border-transparent hover:border-[#C6C6C6]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
            }
          >
            <div className="p-2 w-[340px] bg-white border border-[#C6C6C6] shadow-lg rounded">
              <div className="text-xs font-semibold text-gray-500 mb-2">List Library</div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                <button className="h-16 flex flex-col items-center justify-center border border-transparent hover:bg-[#EAEAEA] hover:border-[#C6C6C6] rounded"
                  onClick={() => { exec('WORD.MULTILEVEL.REMOVE'); EditorAPI.getLegacy()?.clearLivePreview(); }}
                  onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: null })}
                  onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                >
                  <span className="text-sm font-semibold text-gray-400">None</span>
                </button>
                {[
                  { template: '%0.%1.%2.', formats: ['decimal', 'decimal', 'decimal'], preview: ['1.', '  1.1.', '    1.1.1.'] },
                  { template: '%0) %1) %2)', formats: ['decimal', 'lower-alpha', 'lower-roman'], preview: ['1)', '  a)', '    i)'] },
                  { template: '%0. %1. %2.', formats: ['upper-roman', 'upper-alpha', 'decimal'], preview: ['I.', '  A.', '    1.'] },
                  { template: '%0.%1.%2', formats: ['decimal', 'decimal', 'decimal'], preview: ['1', '  1.1', '    1.1.1'] },
                  { template: 'Article %0.', formats: ['upper-roman', 'decimal', 'lower-alpha'], preview: ['Article I.', '  Section 1.', '    (a)'] },
                ].map((item, idx) => (
                  <button key={idx} 
                    className="h-16 flex flex-col items-start justify-center pl-2 border border-transparent hover:bg-[#EAEAEA] hover:border-[#C6C6C6] rounded text-xs text-[#444]"
                    onClick={() => {
                      exec('WORD.MULTILEVEL.FORMAT', { template: item.template, formats: item.formats });
                      EditorAPI.getLegacy()?.clearLivePreview();
                    }}
                    onMouseEnter={() => EditorAPI.getLegacy()?.applyLivePreviewPara({ listType: 'multilevel', listFormatTemplate: item.template, listFormatArray: item.formats })}
                    onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                  >
                    {item.preview.map((line, i) => <div key={i} className="flex gap-1 whitespace-pre leading-tight"><span>{line}</span><div className="h-1.5 w-6 mt-1 bg-gray-200"></div></div>)}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-1">
                <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#EAEAEA] rounded" onClick={() => exec('WORD.MULTILEVEL.DIALOG')}>Define New Multi-level List...</button>
              </div>
            </div>
          </Dropdown>
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          <FBtn 
            icon={IconIndentDecrease} 
            title="Decrease Indent" 
            onCmd={() => exec('WORD.PARAGRAPH.INDENT.DECREASE')} 
            onMouseEnter={() => EditorAPI.getLegacy()?.previewIndentDecrease()}
            onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
          />
          <FBtn 
            icon={IconIndentIncrease} 
            title="Increase Indent" 
            onCmd={() => exec('WORD.PARAGRAPH.INDENT.INCREASE')} 
            onMouseEnter={() => EditorAPI.getLegacy()?.previewIndentIncrease()}
            onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
          />
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          <FBtn icon={IconSort} title="Sort" onCmd={() => exec('WORD.HOME.SORT')} />
          <FBtn icon={IconShowFormatting} title="Show/Hide ¶ (Ctrl+*)" onCmd={() => exec('WORD.HOME.SHOW_FORMATTING')} active={rs.active('WORD.HOME.SHOW_FORMATTING')} />
        </div>

        {/* Row 2: align + spacing + borders */}
        <div className="flex items-center gap-1">
          <AlignBtn icon={IconAlignLeft} title="Align Left (Ctrl+L)" cmd="WORD.PARAGRAPH.ALIGN.LEFT" alignVal="left" rs={rs} exec={exec} />
          <AlignBtn icon={IconAlignCenter} title="Center (Ctrl+E)" cmd="WORD.PARAGRAPH.ALIGN.CENTER" alignVal="center" rs={rs} exec={exec} />
          <AlignBtn icon={IconAlignRight} title="Align Right (Ctrl+R)" cmd="WORD.PARAGRAPH.ALIGN.RIGHT" alignVal="right" rs={rs} exec={exec} />
          <AlignBtn icon={IconAlignJustify} title="Justify (Ctrl+J)" cmd="WORD.PARAGRAPH.ALIGN.JUSTIFY" alignVal="justify" rs={rs} exec={exec} />
          <AlignBtn icon={IconAlignDistributed} title="Distributed (Ctrl+Shift+J)" cmd="WORD.PARAGRAPH.ALIGN.DISTRIBUTED" alignVal="distributed" rs={rs} exec={exec} />
          <div className="w-px h-5 bg-[#E5E5E5] mx-1" />
          
          <Dropdown
            trigger={
              <button className="flex items-center justify-center w-8 h-7 rounded hover:bg-[#EAEAEA] transition-colors gap-0.5">
                <IconLineSpacing size={16} className="text-[#424242]" />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            }
            items={[
              { id: '1.0', label: '1.0', onClick: () => exec('WORD.HOME.LINE.SPACING', 1.0) },
              { id: '1.15', label: '1.15', onClick: () => exec('WORD.HOME.LINE.SPACING', 1.15) },
              { id: '1.5', label: '1.5', onClick: () => exec('WORD.HOME.LINE.SPACING', 1.5) },
              { id: '2.0', label: '2.0', onClick: () => exec('WORD.HOME.LINE.SPACING', 2.0) },
              { id: '2.5', label: '2.5', onClick: () => exec('WORD.HOME.LINE.SPACING', 2.5) },
              { id: '3.0', label: '3.0', onClick: () => exec('WORD.HOME.LINE.SPACING', 3.0) },
            ]}
          />

          <ColorPickerButton 
            icon={IconShading}
            title="Shading"
            defaultColor="transparent"
            allowNoColor={true}
            onHover={(c: string) => EditorAPI.getLegacy()?.applyLivePreviewPara({ shading: c === 'transparent' ? undefined : c })}
            onLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
            onCmd={(c: string) => exec('WORD.SHADING.APPLY', c)}
          />

          <Dropdown
            trigger={
              <button className="flex items-center justify-center w-8 h-7 rounded hover:bg-[#EAEAEA] transition-colors gap-0.5" title="Borders">
                <IconBorders size={16} className="text-[#424242]" />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            }
          >
            <div className="py-1 min-w-[180px] bg-white border border-[#C6C6C6] shadow-lg rounded">
              {[
                { id: 'bottom', label: 'Bottom Border', cmd: 'WORD.BORDER.BOTTOM', def: { style: 'single', width: 1, color: '#000' } },
                { id: 'top', label: 'Top Border', cmd: 'WORD.BORDER.TOP', def: { style: 'single', width: 1, color: '#000' } },
                { id: 'left', label: 'Left Border', cmd: 'WORD.BORDER.LEFT', def: { style: 'single', width: 1, color: '#000' } },
                { id: 'right', label: 'Right Border', cmd: 'WORD.BORDER.RIGHT', def: { style: 'single', width: 1, color: '#000' } },
                { divider: true },
                { id: 'none', label: 'No Border', cmd: 'WORD.BORDER.NONE', def: undefined },
                { divider: true },
                { id: 'all', label: 'All Borders', cmd: 'WORD.BORDER.ALL', def: { style: 'single', width: 1, color: '#000' } },
                { id: 'outside', label: 'Outside Borders', cmd: 'WORD.BORDER.OUTSIDE', def: { style: 'single', width: 1, color: '#000' } },
                { id: 'inside', label: 'Inside Borders', cmd: 'WORD.BORDER.INSIDE', def: { style: 'single', width: 1, color: '#000' } },
              ].map((item, idx) => item.divider ? <div key={idx} className="my-1 border-t border-[#E5E5E5]" /> : (
                <button key={idx} className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#EAEAEA]"
                  onClick={() => { exec(item.cmd!, item.def); EditorAPI.getLegacy()?.clearLivePreview(); }}
                  onMouseEnter={() => {
                    const b: any = {};
                    if (item.id === 'none') { /* empty */ }
                    else if (item.id === 'all' || item.id === 'outside') { b.top=item.def; b.bottom=item.def; b.left=item.def; b.right=item.def; if(item.id==='all') b.between=item.def; }
                    else if (item.id === 'inside') { b.between=item.def; }
                    else { b[item.id!] = item.def; }
                    EditorAPI.getLegacy()?.applyLivePreviewPara({ borders: item.id === 'none' ? {} : b });
                  }}
                  onMouseLeave={() => EditorAPI.getLegacy()?.clearLivePreview()}
                >
                  {item.label}
                </button>
              ))}
              <div className="my-1 border-t border-[#E5E5E5]" />
              <button className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#EAEAEA]" onClick={() => exec('WORD.BORDER.DIALOG')}>Borders and Shading...</button>
            </div>
          </Dropdown>
        </div>
      </div>
    </RGroup>
  );
}
