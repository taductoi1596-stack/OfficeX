import React, { useState } from 'react';
import { Scissors, Copy, Clipboard, Filter, ArrowDownAZ, Link, MessageSquarePlus, StickyNote, Undo, Italic, Bold, AlignLeft, AlignCenter, AlignRight, PaintBucket, Baseline, Languages } from 'lucide-react';
import { CommandDispatcher } from './CommandDispatcher';
import { FontComboBox, FontSizeComboBox, ColorPickerButton } from './ribbons/ExcelFontGroup';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  fontState: any;
  currentFormat: any;
  activeCell?: { row: number, col: number };
  activeCellValue?: string;
}

export function CellContextMenu({ x, y, onClose, fontState, currentFormat, activeCell, activeCellValue }: ContextMenuProps) {
  const getColumnLetter = (col: number) => {
    let temp, letter = '';
    while (col > 0) {
      temp = (col - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      col = (col - temp - 1) / 26;
    }
    return letter || 'A';
  };

  const rowLabel = `Hàng ${activeCell?.row || 1}`;
  const colLabel = `Cột ${getColumnLetter(activeCell?.col || 1)}`;
  const filterValLabel = `Giá trị ô ${activeCellValue === undefined || activeCellValue === '' ? 'Blank' : activeCellValue}`;
  const handleAction = (commandId: string, payload?: any) => {
    CommandDispatcher.dispatch(commandId, payload);
    onClose();
  };

  const Divider = () => <div className="h-px bg-slate-200 my-1 mx-2" />;

  const MenuItem = ({ icon, label, shortcut, commandId, hasSubmenu, disabled, children }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`relative flex items-center justify-between px-4 py-1.5 text-sm ${disabled ? 'text-slate-400 cursor-default' : 'text-slate-700 hover:bg-slate-100 cursor-pointer'}`}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && commandId) handleAction(commandId);
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 flex justify-center text-slate-500">{icon}</div>
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {shortcut && <span className="text-xs text-slate-400">{shortcut}</span>}
          {hasSubmenu && <span className="text-slate-400 text-xs ml-2">▶</span>}
        </div>
        
        {isHovered && hasSubmenu && children && (
          <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded shadow-lg py-1 w-48 z-50">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed z-[9999] flex flex-col gap-2"
      style={{ left: Math.min(x, window.innerWidth - 300), top: Math.min(y, window.innerHeight - 500) }}
    >
      {/* Mini Toolbar */}
      <div className="bg-white border border-slate-200 rounded shadow-lg p-1 flex items-center gap-1 w-max" onClick={(e) => e.stopPropagation()}>
        <FontComboBox
          className="w-[120px] h-6"
          value={fontState?.fontFamily || 'Calibri'}
          onChange={(f) => handleAction('EXCEL.FORMAT.FONT_FAMILY', f)}
        />
        <FontSizeComboBox
          value={fontState?.fontSize || 11}
          onChange={(s) => handleAction('EXCEL.FORMAT.FONT_SIZE', s)}
        />
        
        <div className="w-px h-4 bg-slate-300 mx-1" />
        
        <button className={`p-1 rounded hover:bg-slate-200 ${fontState?.bold ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-700'}`} onClick={() => handleAction('EXCEL.FORMAT.BOLD')}>
          <Bold size={14} />
        </button>
        <button className={`p-1 rounded hover:bg-slate-200 ${fontState?.italic ? 'bg-slate-200 text-slate-900 shadow-sm' : 'text-slate-700'}`} onClick={() => handleAction('EXCEL.FORMAT.ITALIC')}>
          <Italic size={14} />
        </button>
        
        <div className="w-px h-4 bg-slate-300 mx-1" />
        
        <ColorPickerButton 
          title="Màu tô ô" 
          value={fontState?.bgColor} 
          onChange={c => handleAction('EXCEL.FORMAT.FILL_COLOR', c)} 
          isBg 
        />
        <ColorPickerButton 
          title="Màu chữ" 
          value={fontState?.fontColor} 
          onChange={c => handleAction('EXCEL.FORMAT.TEXT_COLOR', c)} 
        />

        <div className="w-px h-4 bg-slate-300 mx-1" />
        
        <button className={`p-1 rounded hover:bg-slate-200 ${currentFormat?.textAlign === 'left' ? 'bg-slate-200' : ''}`} onClick={() => handleAction('EXCEL.FORMAT.ALIGN_LEFT')}><AlignLeft size={14} /></button>
        <button className={`p-1 rounded hover:bg-slate-200 ${currentFormat?.textAlign === 'center' ? 'bg-slate-200' : ''}`} onClick={() => handleAction('EXCEL.FORMAT.ALIGN_CENTER')}><AlignCenter size={14} /></button>
        <button className={`p-1 rounded hover:bg-slate-200 ${currentFormat?.textAlign === 'right' ? 'bg-slate-200' : ''}`} onClick={() => handleAction('EXCEL.FORMAT.ALIGN_RIGHT')}><AlignRight size={14} /></button>
      </div>

      {/* Context Menu List */}
      <div className="bg-white border border-slate-200 rounded shadow-lg py-1 w-64" onClick={(e) => e.stopPropagation()}>
        <MenuItem icon={<Scissors size={14} className="text-blue-600" />} label="Cắt" shortcut="Ctrl+X" commandId="EXCEL.EDIT.CUT" />
        <MenuItem icon={<Copy size={14} className="text-slate-700" />} label="Sao chép" shortcut="Ctrl+C" commandId="EXCEL.EDIT.COPY" />
        <MenuItem icon={<Clipboard size={14} className="text-orange-500" />} label="Dán" shortcut="Ctrl+V" commandId="EXCEL.EDIT.PASTE" />
        <MenuItem label="Dán đặc biệt" hasSubmenu>
          <MenuItem icon={<Clipboard size={14} className="text-blue-600" />} label="Chỉ giá trị" shortcut="Ctrl+Shift+V" commandId="EXCEL.EDIT.PASTE_VALUES" />
          <MenuItem icon={<Clipboard size={14} className="text-slate-400" />} label="Chỉ Công thức" disabled />
          <MenuItem icon={<Clipboard size={14} className="text-slate-400" />} label="Chỉ định dạng" disabled />
          <MenuItem icon={<Link size={14} className="text-slate-400" />} label="Liên kết đến Nguồn" disabled />
          <MenuItem icon={<Baseline size={14} className="text-slate-400" />} label="Giữ Chiều rộng của Cột Nguồn" disabled />
          <MenuItem icon={<Clipboard size={14} className="text-slate-400" />} label="Hoán đổi hàng và cột" disabled />
        </MenuItem>
        <Divider />
        <MenuItem icon={<span className="text-green-600 font-bold">+</span>} label="Chèn" hasSubmenu>
          <MenuItem icon={<span className="text-blue-500 text-lg">⊞</span>} label="1 Hàng Ở trên" commandId="EXCEL.CELL.INSERT_ROWS_ABOVE" />
          <MenuItem icon={<span className="text-green-500 text-lg">⊞</span>} label="1 Hàng Ở dưới" commandId="EXCEL.CELL.INSERT_ROWS_BELOW" />
          <Divider />
          <MenuItem icon={<span className="text-blue-500 text-lg">⊟</span>} label="1 Cột bên trái" commandId="EXCEL.CELL.INSERT_COLS_LEFT" />
          <MenuItem icon={<span className="text-green-500 text-lg">⊟</span>} label="1 Cột Bên Phải" commandId="EXCEL.CELL.INSERT_COLS_RIGHT" />
          <Divider />
          <MenuItem icon={<span className="text-slate-500 text-lg">⊞</span>} label="Dịch các ô sang phải" commandId="EXCEL.CELL.INSERT_CELLS" disabled />
          <MenuItem icon={<span className="text-slate-500 text-lg">⊞</span>} label="Dịch các ô xuống dưới" commandId="EXCEL.CELL.INSERT_CELLS" disabled />
        </MenuItem>
        <MenuItem icon={<span className="text-red-600 font-bold">×</span>} label="Xóa" hasSubmenu>
          <MenuItem icon={<span className="text-red-500 text-lg">⊟</span>} label={rowLabel} commandId="EXCEL.CELL.DELETE_ROWS" />
          <MenuItem icon={<span className="text-red-500 text-lg">⊟</span>} label={colLabel} commandId="EXCEL.CELL.DELETE_COLS" />
          <Divider />
          <MenuItem icon={<span className="text-slate-500 text-lg">⊟</span>} label="Dịch các ô sang trái" commandId="EXCEL.CELL.DELETE_CELLS" disabled />
          <MenuItem icon={<span className="text-slate-500 text-lg">⊟</span>} label="Chuyển các ô lên trên" commandId="EXCEL.CELL.DELETE_CELLS" disabled />
        </MenuItem>
        <MenuItem icon={<Undo size={14} className="text-purple-600" />} label="Xóa Nội dung" commandId="EXCEL.EDIT.CLEAR_CONTENTS" />
        <Divider />
        <MenuItem icon={<Filter size={14} className="text-slate-600" />} label="Bộ lọc" hasSubmenu>
          <MenuItem label={filterValLabel} commandId="EXCEL.DATA.FILTER_BY_VALUE" />
          <MenuItem label="Màu Ô" commandId="EXCEL.DATA.FILTER_BY_COLOR" />
          <MenuItem label="Màu phông chữ" commandId="EXCEL.DATA.FILTER_BY_TEXT_COLOR" />
          <MenuItem label="Biểu tượng ô" commandId="EXCEL.DATA.FILTER_BY_ICON" />
        </MenuItem>
        <MenuItem icon={<ArrowDownAZ size={14} className="text-slate-600" />} label="Sắp xếp" hasSubmenu>
          <MenuItem label="Từ A đến Z" commandId="EXCEL.DATA.SORT_ASC" />
          <MenuItem label="Từ Z đến A" commandId="EXCEL.DATA.SORT_DESC" />
        </MenuItem>
        <Divider />
        <MenuItem icon={<Languages size={14} className="text-emerald-600" />} label="Dịch ô này (AI Translate)" shortcut="Ctrl+Shift+T" commandId="EXCEL.AI.TRANSLATE" />
        <MenuItem icon={<PaintBucket size={14} className="text-blue-600" />} label="Định dạng ô" shortcut="Ctrl+1" commandId="EXCEL.VIEW.TOGGLE_FORMAT_SIDEBAR" />
      </div>
    </div>
  );
}
