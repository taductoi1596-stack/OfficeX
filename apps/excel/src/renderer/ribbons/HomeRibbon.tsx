import React from 'react';
import { RBtn, RGroup } from '../SharedComponents';
import { Button } from '@officex/ui';
import { Dropdown } from '@officex/ui';
import { ExcelFontGroup, type ExcelFontState } from './ExcelFontGroup';
import { CellStylesDropdown } from './CellStylesDropdown';
import { FormatAsTableDropdown } from './FormatAsTableDropdown';
import { AutoSumDropdown } from './AutoSumDropdown';
import { FillDropdown } from './FillDropdown';
import { 
  Undo2, Redo2, Printer, Paintbrush, 
  AlignLeft, AlignCenter, AlignRight, 
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
  WrapText, Combine, 
  DollarSign, Percent, ArrowLeftToLine, ArrowRightToLine,
  LayoutGrid, Table, TableCellsSplit, 
  Plus, Minus, Settings2, Sigma, Eraser, Filter, Search, Sparkles,
  Clock, Calendar, Coins, Calculator, Type, Superscript, Hash, ListTodo, CircleSlash,
  Clock4, CalendarDays, CoinsIcon, PercentIcon,
  ChevronRight, Highlighter, ArrowUpDown, ArrowLeftRight, BarChart, Grid2X2, Shapes, PlusSquare, Settings, Copy, Clipboard, Trash2
} from 'lucide-react';
import { CommandDispatcher } from '../CommandDispatcher';

export function HomeRibbon({ 
  currentFormat, 
  toggleFormat,
  applyFormat,
  fontState,
  onFontChange,
  formatPainterActive,
  onFormatPainterToggle
}: { 
  currentFormat: any; 
  toggleFormat: (key: string, value: any) => void;
  applyFormat: (key: string, value: any) => void;
  fontState: ExcelFontState;
  onFontChange: (change: Partial<ExcelFontState>) => void;
  formatPainterActive: boolean;
  onFormatPainterToggle: () => void;
}) {
  return (
    <div className="flex h-24 px-2 py-1 items-start gap-1 bg-[#F3F2F1] text-xs">
      
      {/* Clipboard Group */}
      <RGroup label="Bảng tạm">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <RBtn icon={Undo2} title="Hoàn tác" onCmd={() => CommandDispatcher.dispatch('EXCEL.UNDO')} />
            <RBtn icon={Redo2} title="Làm lại" onCmd={() => CommandDispatcher.dispatch('EXCEL.REDO')} />
          </div>
          <div className="flex gap-1">
            <RBtn icon={Printer} title="In" onCmd={() => CommandDispatcher.dispatch('EXCEL.FILE.PRINT')} />
            <RBtn icon={Paintbrush} title="Sao chép định dạng" active={formatPainterActive} onCmd={onFormatPainterToggle} />
          </div>
        </div>
      </RGroup>

      {/* Font Group — giống Word, có font dropdown tìm kiếm + cỡ chữ */}
      <ExcelFontGroup fontState={fontState} onFontChange={onFontChange} />

      {/* Alignment Group */}
      <RGroup label="Căn chỉnh" onDialogClick={() => {}}>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <RBtn icon={() => <AlignVerticalJustifyStart size={14} />} title="Căn trên" />
              <RBtn icon={() => <AlignVerticalJustifyCenter size={14} />} title="Căn giữa" />
              <RBtn icon={() => <AlignVerticalJustifyEnd size={14} />} title="Căn dưới" />
            </div>
            <div className="flex gap-1">
              <RBtn icon={AlignLeft} active={currentFormat?.textAlign === 'left'} onCmd={() => toggleFormat('textAlign', 'left')} />
              <RBtn icon={AlignCenter} active={currentFormat?.textAlign === 'center'} onCmd={() => toggleFormat('textAlign', 'center')} />
              <RBtn icon={AlignRight} active={currentFormat?.textAlign === 'right'} onCmd={() => toggleFormat('textAlign', 'right')} />
            </div>
          </div>
          <div className="flex flex-col gap-1 ml-1 border-l border-gray-200 pl-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-6 px-2 text-xs font-normal justify-start gap-2 text-slate-700 hover:bg-slate-200 ${currentFormat?.whiteSpace === 'normal' ? 'bg-slate-200' : ''}`}
              onClick={() => CommandDispatcher.dispatch('EXCEL.CELL.TOGGLE_WRAP')}
            >
              <WrapText size={14} /> Ngắt dòng
            </Button>
            <Dropdown 
              trigger={<Button variant="ghost" size="sm" className="h-6 px-2 text-xs font-normal justify-start gap-2 text-slate-700 hover:bg-slate-200"><Combine size={14} /> Phối & bỏ phối ô v</Button>} 
              items={[
                {id: 'merge_center', label: 'Phối & căn giữa', onClick: () => CommandDispatcher.dispatch('EXCEL.CELL.MERGE_CENTER')}, 
                {id: 'merge_across', label: 'Phối Chéo', onClick: () => CommandDispatcher.dispatch('EXCEL.CELL.MERGE_ACROSS')}, 
                {id: 'merge_cells', label: 'Phối Ô', onClick: () => CommandDispatcher.dispatch('EXCEL.CELL.MERGE_CELLS')}, 
                {id: 'unmerge', label: 'Bỏ phối Ô', onClick: () => CommandDispatcher.dispatch('EXCEL.CELL.UNMERGE')}
              ]} 
            />
          </div>
        </div>
      </RGroup>

      {/* Number Group */}
      <RGroup label="Số" onDialogClick={() => CommandDispatcher.dispatch('EXCEL.VIEW.TOGGLE_FORMAT_SIDEBAR')}>
        <div className="flex flex-col gap-1">
          {(() => {
            const formatLabels: Record<string, string> = {
              general: 'Tổng quát', number: 'Số', currency: 'Tiền tệ', accounting: 'Kế toán',
              short_date: 'Ngày Ngắn', long_date: 'Ngày Dài', time: 'Thời gian',
              comma: 'Dấu phẩy', percentage: 'Phần Trăm', fraction: 'Phân số',
              scientific: 'Khoa học', text: 'Văn bản'
            };
            const curFmt = currentFormat?.numberFormat || 'general';
            const curLabel = formatLabels[curFmt] || 'Tổng quát';
            return (
              <Dropdown 
                trigger={<Button variant="outline" size="sm" className="h-6 w-52 justify-between text-xs px-2 bg-white font-normal border-[#C8C6C4]">{curLabel}</Button>} 
                className="min-w-[13rem]"
                items={[
                  {id: 'general', label: <div className="flex items-center gap-2"><ListTodo size={14} className="text-gray-500" /> Tổng quát</div>, onClick: () => applyFormat('numberFormat', 'general')}, 
                  {id: 'number', label: <div className="flex items-center gap-2"><Hash size={14} className="text-gray-500" /> Số</div>, onClick: () => applyFormat('numberFormat', 'number')}, 
                  {id: 'currency', label: <div className="flex items-center gap-2"><CoinsIcon size={14} className="text-amber-500" /> Tiền tệ</div>, onClick: () => applyFormat('numberFormat', 'currency')},
                  {id: 'accounting', label: <div className="flex items-center gap-2"><Calculator size={14} className="text-gray-500" /> Kế toán</div>, onClick: () => applyFormat('numberFormat', 'accounting')},
                  {id: 'short_date', label: <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-500" /> Ngày dạng Ngắn</div>, onClick: () => applyFormat('numberFormat', 'short_date')},
                  {id: 'long_date', label: <div className="flex items-center gap-2"><CalendarDays size={14} className="text-gray-500" /> Ngày dạng Dài</div>, onClick: () => applyFormat('numberFormat', 'long_date')},
                  {id: 'time', label: <div className="flex items-center gap-2"><Clock4 size={14} className="text-gray-500" /> Thời gian</div>, onClick: () => applyFormat('numberFormat', 'time')},
                  {id: 'comma', label: <div className="flex items-center gap-2"><span className="text-gray-500 font-bold w-[14px] text-center">,</span> Dấu phẩy</div>, onClick: () => applyFormat('numberFormat', 'comma')},
                  {id: 'percentage', label: <div className="flex items-center gap-2"><PercentIcon size={14} className="text-gray-500" /> Phần Trăm</div>, onClick: () => applyFormat('numberFormat', 'percentage')},
                  {id: 'fraction', label: <div className="flex items-center gap-2"><span className="text-gray-500 w-[14px] text-center text-[10px]">½</span> Phân số</div>, onClick: () => applyFormat('numberFormat', 'fraction')},
                  {id: 'scientific', label: <div className="flex items-center gap-2"><Superscript size={14} className="text-gray-500" /> Khoa học</div>, onClick: () => applyFormat('numberFormat', 'scientific')},
                  {id: 'text', label: <div className="flex items-center gap-2"><Type size={14} className="text-gray-500" /> Văn bản</div>, onClick: () => applyFormat('numberFormat', 'text')},
                  {id: 'more', label: <div className="border-t mt-1 pt-1 text-blue-600">Xem thêm Định dạng Số...</div>, onClick: () => CommandDispatcher.dispatch('EXCEL.VIEW.TOGGLE_FORMAT_SIDEBAR')}
                ]} 
              />
            );
          })()}
          <div className="flex gap-1">
            <RBtn icon={DollarSign} title="Định dạng số kế toán" />
            <RBtn icon={Percent} title="Kiểu phần trăm" />
            <RBtn icon={() => <div className="font-bold">,</div>} title="Kiểu dấu phẩy" />
            <RBtn icon={() => <div className="flex gap-0.5 items-center"><ArrowLeftToLine size={12}/><span className="text-[10px]">.0</span></div>} title="Tăng phần thập phân" />
            <RBtn icon={() => <div className="flex gap-0.5 items-center"><span className="text-[10px]">.0</span><ArrowRightToLine size={12}/></div>} title="Giảm phần thập phân" />
          </div>
        </div>
      </RGroup>

      {/* Styles Group */}
      <RGroup label="Kiểu">
        <div className="flex gap-1">
          <Dropdown
            trigger={
              <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
                <TableCellsSplit size={20} className="text-blue-600" />
                Định dạng<br/>có điều kiện
              </Button>
            }
            className="min-w-[240px] pt-0 pb-0"
          >
            <div className="flex flex-col py-1 text-[13px] text-[#202020]">
              <div className="px-3 py-1.5 text-[#202020] font-semibold">Định dạng có điều kiện</div>
              
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.HIGHLIGHT')}>
                <div className="w-6 flex justify-center mr-2"><Highlighter size={16} className="text-blue-600" /></div>
                Quy tắc Tô sáng Ô
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.TOP_BOTTOM')}>
                <div className="w-6 flex justify-center mr-2"><ArrowUpDown size={16} className="text-orange-500" /></div>
                Quy tắc Trên cùng/Dưới cùng
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>

              <div className="h-[1px] bg-gray-200 my-1 mx-2"></div>

              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.DATA_BARS')}>
                <div className="w-6 flex justify-center mr-2"><BarChart size={16} className="text-blue-500" /></div>
                Thanh Dữ liệu
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.COLOR_SCALES')}>
                <div className="w-6 flex justify-center mr-2"><Grid2X2 size={16} className="text-red-500" /></div>
                Thang Màu
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.ICON_SETS')}>
                <div className="w-6 flex justify-center mr-2"><Shapes size={16} className="text-green-600" /></div>
                Bộ Biểu tượng
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>

              <div className="h-[1px] bg-gray-200 my-1 mx-2"></div>

              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.NEW_RULE')}>
                <div className="w-6 flex justify-center mr-2"><PlusSquare size={16} className="text-green-600" /></div>
                Quy tắc Mới
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.CLEAR_RULES')}>
                <div className="w-6 flex justify-center mr-2"><Eraser size={16} className="text-purple-600" /></div>
                Xóa Quy tắc
                <ChevronRight size={14} className="ml-auto text-gray-500" />
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center hover:bg-slate-100" onClick={() => CommandDispatcher.dispatch('EXCEL.CF.MANAGE_RULES')}>
                <div className="w-6 flex justify-center mr-2"><Settings size={16} className="text-blue-600" /></div>
                Quản lý Quy tắc
              </button>
            </div>
          </Dropdown>
          <FormatAsTableDropdown />
          <CellStylesDropdown />
        </div>
      </RGroup>

      {/* Cells Group */}
      <RGroup label="Ô">
        <div className="flex gap-1">
          {/* Insert — direct action */}
          <Button
            variant="ghost"
            className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700"
            onClick={() => CommandDispatcher.dispatch('EXCEL.CELL.INSERT_ROWS_ABOVE')}
          >
            <Plus size={20} className="text-green-600" />
            Chèn
          </Button>

          {/* Delete — direct action */}
          <Button
            variant="ghost"
            className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700"
            onClick={() => CommandDispatcher.dispatch('EXCEL.CELL.DELETE_ROWS')}
          >
            <Minus size={20} className="text-red-600" />
            Xóa
          </Button>

          {/* Format dropdown */}
          <Dropdown
            trigger={
              <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
                <Settings2 size={20} className="text-slate-600" />
                Định dạng
              </Button>
            }
            className="py-1 w-56"
          >
            <div className="flex flex-col text-[13px] text-slate-700">
              <div className="px-3 py-1 text-[12px] font-semibold">Kích thước Ô</div>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.ROW.HEIGHT')}>
                <ArrowUpDown size={16} className="text-slate-500" />
                Độ cao Hàng...
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.ROW.AUTOFIT')}>
                <div className="relative">
                  <ArrowUpDown size={16} className="text-slate-500" />
                  <Sparkles size={8} className="absolute -top-1 -right-1 text-orange-500" />
                </div>
                Tự khớp độ cao hàng
              </button>
              <div className="h-px bg-slate-200 my-1 mx-2" />
              
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.COL.WIDTH')}>
                <ArrowLeftRight size={16} className="text-slate-500" />
                Độ rộng cột...
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.COL.AUTOFIT')}>
                <div className="relative">
                  <ArrowLeftRight size={16} className="text-slate-500" />
                  <Sparkles size={8} className="absolute -top-1 -right-1 text-orange-500" />
                </div>
                Tự khớp độ rộng cột
              </button>
              <div className="h-px bg-slate-200 my-1 mx-2" />

              <div className="px-3 py-1 text-[12px] font-semibold">Khả năng hiển thị</div>
              <div className="relative group">
                <button className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 text-left">
                  <span className="pl-6">Ẩn &amp; bỏ ẩn</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </button>
                {/* Submenu flyout */}
                <div className="absolute top-0 left-full -ml-1 hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-lg rounded-sm py-1 w-40 z-[300]">
                  <button className="px-4 py-1.5 text-left hover:bg-slate-100 text-[13px]" onClick={() => CommandDispatcher.dispatch('EXCEL.ROW.HIDE')}>Ẩn Hàng</button>
                  <button className="px-4 py-1.5 text-left hover:bg-slate-100 text-[13px]" onClick={() => CommandDispatcher.dispatch('EXCEL.COL.HIDE')}>Ẩn Cột</button>
                  <div className="h-px bg-slate-200 my-1 mx-2" />
                  <button className="px-4 py-1.5 text-left hover:bg-slate-100 text-[13px]" onClick={() => CommandDispatcher.dispatch('EXCEL.ROW.UNHIDE')}>Bỏ ẩn Hàng</button>
                  <button className="px-4 py-1.5 text-left hover:bg-slate-100 text-[13px]" onClick={() => CommandDispatcher.dispatch('EXCEL.COL.UNHIDE')}>Bỏ ẩn Cột</button>
                </div>
              </div>
              <div className="h-px bg-slate-200 my-1 mx-2" />

              <div className="px-3 py-1 text-[12px] font-semibold">Sắp xếp Trang tính</div>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.SHEET.RENAME')}>
                <span className="w-4" /> Đổi tên trang tính...
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-slate-400 text-left cursor-default">
                <span className="w-4" /> Sắp xếp lại Trang tính...
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.SHEET.COPY')}>
                <Copy size={16} className="text-slate-500" />
                Sao chép trang tính
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.SHEET.DELETE')}>
                <Trash2 size={16} className="text-red-500" />
                Xóa trang tính
              </button>
              <div className="h-px bg-slate-200 my-1 mx-2" />
              
              <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left" onClick={() => CommandDispatcher.dispatch('EXCEL.VIEW.TOGGLE_FORMAT_SIDEBAR')}>
                <Paintbrush size={16} className="text-blue-600" />
                Định dạng ô
              </button>
            </div>
          </Dropdown>
        </div>
      </RGroup>

      {/* Editing Group */}
      <RGroup label="Chỉnh sửa">
        <div className="flex gap-2 items-start">
          <div className="flex flex-col gap-1">
            <AutoSumDropdown />

          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
              <Filter size={20} className="text-slate-600" />
              Sắp xếp & Bộ lọc
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
              <Search size={20} className="text-slate-600" />
              Tìm & Chọn
            </Button>
          </div>
        </div>
      </RGroup>

      {/* Analyze Group */}
      <RGroup label="Phân tích">
        <div className="flex gap-1">
          <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
            <Sparkles size={20} className="text-yellow-600" />
            Phân tích<br/>Dữ liệu
          </Button>
        </div>
      </RGroup>
      
    </div>
  );
}
