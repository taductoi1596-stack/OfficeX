import React, { useState } from 'react';
import { X, Search, Pencil, Grid, Eraser, Palette, ChevronDown } from 'lucide-react';
import { Button } from '@officex/ui';
import { FontComboBox } from './ribbons/ExcelFontGroup';

interface FormatCellsSidebarProps {
  onClose: () => void;
  format: any;
  onChange: (key: string, value: any) => void;
  onMultiChange?: (changes: any) => void;
  drawMode?: 'draw' | 'drawGrid' | 'erase' | null;
  penColor?: string;
  penStyle?: string;
}

export function FormatCellsSidebar({ onClose, format, onChange, onMultiChange, drawMode, penColor = '#000000', penStyle = 'medium' }: FormatCellsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'number' | 'alignment' | 'font' | 'border'>('border');

  const tabs = [
    { id: 'number', label: 'Số' },
    { id: 'alignment', label: 'Căn chỉnh' },
    { id: 'font', label: 'Phông chữ' },
    { id: 'border', label: 'Viền' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl font-sans text-sm" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={onClose}>
            <X size={16} className="text-gray-500" />
          </Button>
          <span className="font-semibold text-gray-700">Tất cả tùy chọn định dạng</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-2 pt-2 gap-4">
        {tabs.map(t => (
          <button
            key={t.id}
            className={"pb-2 px-1 text-xs font-medium border-b-2 transition-colors "}
            onClick={() => setActiveTab(t.id as any)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        {activeTab === 'alignment' && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Căn ngang</label>
              <select 
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
                value={format?.textAlign || 'left'}
                onChange={e => onChange('textAlign', e.target.value)}
              >
                <option value="left">Trái (Thụt lề)</option>
                <option value="center">Giữa</option>
                <option value="right">Phải</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Căn dọc</label>
              <select 
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
                value={format?.verticalAlign || 'bottom'}
                onChange={e => onChange('verticalAlign', e.target.value)}
              >
                <option value="top">Trên cùng</option>
                <option value="middle">Ở giữa</option>
                <option value="bottom">Dưới cùng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Điều khiển văn bản</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    checked={format?.whiteSpace === 'normal'}
                    onChange={e => onChange('whiteSpace', e.target.checked ? 'normal' : 'nowrap')}
                  />
                  <span className="text-xs text-gray-700">Ngắt dòng</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Hướng (độ)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="w-20 border border-gray-300 rounded p-1 text-xs" 
                  value={format?.rotation || 0}
                  onChange={e => onChange('rotation', parseInt(e.target.value) || 0)}
                />
                <span className="text-xs text-gray-500">Dọc theo Chữ cái</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'font' && (
          <div className="flex flex-col gap-4">
             <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Chọn Phông chữ</label>
              <FontComboBox 
                value={format?.fontFamily || 'Calibri'} 
                onChange={val => onChange('fontFamily', val)}
                className="w-full h-[28px] border-gray-300 rounded"
                dropdownClassName="w-full min-w-[220px]"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Kích cỡ</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded p-1.5 text-xs" 
                  value={format?.fontSize || 11}
                  onChange={e => onChange('fontSize', parseInt(e.target.value) || 11)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Màu sắc</label>
                <input 
                  type="color" 
                  className="w-full h-[30px] border border-gray-300 rounded p-0.5 cursor-pointer" 
                  value={format?.color || '#000000'}
                  onChange={e => onChange('color', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Hiệu ứng</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={"h-8 w-8 p-0 "} onClick={() => onChange('fontWeight', format?.fontWeight === 'bold' ? 'normal' : 'bold')}>
                  <span className="font-bold">B</span>
                </Button>
                <Button variant="outline" size="sm" className={"h-8 w-8 p-0 "} onClick={() => onChange('fontStyle', format?.fontStyle === 'italic' ? 'normal' : 'italic')}>
                  <span className="italic">I</span>
                </Button>
                <Button variant="outline" size="sm" className={"h-8 w-8 p-0 "} onClick={() => onChange('textDecoration', format?.textDecoration?.includes('underline') ? 'none' : 'underline')}>
                  <span className="underline">U</span>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'border' && (
           <div className="flex flex-col gap-4">
             {/* Grid of presets */}
             <div className="grid grid-cols-5 gap-y-3 gap-x-1 justify-items-center">
                {/* 1. Bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { bottom: true })}>
                  <div className="w-[18px] h-[18px] border-b border-gray-800 relative" style={{ borderTop: '1px dotted #ccc', borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 2. Top */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { top: true })}>
                  <div className="w-[18px] h-[18px] border-t border-gray-800 relative" style={{ borderBottom: '1px dotted #ccc', borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 3. Left */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { left: true })}>
                  <div className="w-[18px] h-[18px] border-l border-gray-800 relative" style={{ borderTop: '1px dotted #ccc', borderBottom: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 4. Right */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { right: true })}>
                  <div className="w-[18px] h-[18px] border-r border-gray-800 relative" style={{ borderTop: '1px dotted #ccc', borderLeft: '1px dotted #ccc', borderBottom: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 5. None */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', undefined)}>
                  <div className="w-[18px] h-[18px] border border-dotted border-gray-400 relative">
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                
                {/* 6. All */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { all: true, top: true, bottom: true, left: true, right: true })}>
                  <div className="w-[18px] h-[18px] border border-gray-800 relative">
                     <div className="absolute top-1/2 left-0 right-0 border-t border-gray-800"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-gray-800"></div>
                  </div>
                </button>
                {/* 7. Outside */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { outside: true, top: true, bottom: true, left: true, right: true })}>
                  <div className="w-[18px] h-[18px] border border-gray-800 relative">
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 8. Thick outside */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { outside: true, thick: true, top: true, bottom: true, left: true, right: true })}>
                  <div className="w-[18px] h-[18px] border-[2px] border-gray-800 relative">
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400" style={{ transform: 'translateY(-1px)' }}></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400" style={{ transform: 'translateX(-1px)' }}></div>
                  </div>
                </button>
                {/* 9. Double bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { bottom: true, doubleBottom: true })}>
                  <div className="w-[18px] h-[18px] border-b-[3px] border-double border-gray-800 relative" style={{ borderTop: '1px dotted #ccc', borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 10. Thick bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { bottom: true, thickBottom: true })}>
                  <div className="w-[18px] h-[18px] border-b-[2px] border-gray-800 relative" style={{ borderTop: '1px dotted #ccc', borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>

                {/* 11. Top and Bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { top: true, bottom: true })}>
                  <div className="w-[18px] h-[18px] border-t border-b border-gray-800 relative" style={{ borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 12. Top and Thick Bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { top: true, bottom: true, thickBottom: true })}>
                  <div className="w-[18px] h-[18px] border-t border-b-[2px] border-gray-800 relative" style={{ borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
                {/* 13. Top and Double Bottom */}
                <button className="w-8 h-8 flex justify-center items-center hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded" onClick={() => onChange('borders', { top: true, bottom: true, doubleBottom: true })}>
                  <div className="w-[18px] h-[18px] border-t border-b-[3px] border-double border-gray-800 relative" style={{ borderLeft: '1px dotted #ccc', borderRight: '1px dotted #ccc' }}>
                     <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-400"></div>
                     <div className="absolute left-1/2 top-0 bottom-0 border-l border-dotted border-gray-400"></div>
                  </div>
                </button>
             </div>

             {/* Tùy chọn đường viền */}
             <div>
                <label className="block text-xs font-medium text-[#404040] mb-2 mt-4">Tùy chọn đường viền</label>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                   <button 
                     className={`flex items-center gap-2 text-[13px] text-[#202020] p-1 rounded transition-colors w-full text-left ${drawMode === 'draw' ? 'bg-[#f3f2f1] font-medium' : 'hover:bg-gray-100'}`}
                     onClick={() => onChange('drawMode', drawMode === 'draw' ? null : 'draw')}
                   >
                     <div className="w-[18px] h-[18px] flex justify-center items-center relative">
                       <div className="absolute top-1 right-1 w-[12px] h-[12px] border-b border-l border-gray-400"></div>
                       <Pencil size={12} className="text-[#005fb8] absolute bottom-0 left-0" style={{ transform: 'rotate(90deg)' }}/>
                     </div>
                     Vẽ viền
                   </button>
                   <button 
                     className={`flex items-center gap-2 text-[13px] text-[#202020] p-1 rounded transition-colors w-full text-left ${drawMode === 'drawGrid' ? 'bg-[#f3f2f1] font-medium' : 'hover:bg-gray-100'}`}
                     onClick={() => onChange('drawMode', drawMode === 'drawGrid' ? null : 'drawGrid')}
                   >
                     <div className="w-[18px] h-[18px] flex justify-center items-center relative">
                       <Grid size={14} className="text-gray-400 absolute top-0 right-0"/>
                       <Pencil size={12} className="text-[#005fb8] absolute bottom-0 left-0" style={{ transform: 'rotate(90deg)' }}/>
                     </div>
                     Vẽ lưới viền
                   </button>
                   <button 
                     className={`flex items-center gap-2 text-[13px] text-[#202020] p-1 rounded transition-colors w-full text-left ${drawMode === 'erase' ? 'bg-[#f3f2f1] font-medium' : 'hover:bg-gray-100'}`}
                     onClick={() => onChange('drawMode', drawMode === 'erase' ? null : 'erase')}
                   >
                     <div className="w-[18px] h-[18px] flex justify-center items-center">
                       <Eraser size={14} className="text-[#c13054]"/>
                     </div>
                     Xóa viền
                   </button>
                   <button className="flex items-center gap-2 text-[13px] text-[#202020] hover:bg-gray-100 p-1 rounded transition-colors w-full text-left relative overflow-hidden">
                     <div className="w-[18px] h-[18px] flex justify-center items-center flex-col gap-[2px]">
                       <Palette size={13} className="text-[#202020]"/>
                       <div className="w-[12px] h-[3px]" style={{ backgroundColor: penColor }}></div>
                     </div>
                     Màu viền <ChevronDown size={12} className="ml-[-4px] text-gray-500"/>
                     <input type="color" className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" value={penColor} onChange={(e) => onChange('penColor', e.target.value)} />
                   </button>
                </div>
             </div>

             {/* Kiểu viền */}
             <div>
                <label className="block text-xs font-medium text-[#404040] mb-2 mt-4">Kiểu viền</label>
                <div className="border border-gray-300 p-1 grid grid-cols-2 gap-x-2 gap-y-1 bg-white">
                   <div className="flex flex-col gap-1">
                      {/* 1. Medium Solid */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'medium' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'medium')}>
                         <div className="h-[1px] w-full bg-[#404040]"></div>
                      </div>
                      {/* 2. Dotted */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'dotted' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'dotted')}>
                         <div className="h-[1px] w-full border-b-[1.5px] border-dotted border-[#404040]"></div>
                      </div>
                      {/* 3. Thick Solid */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'thick' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'thick')}>
                         <div className="h-[2px] w-full bg-[#404040]"></div>
                      </div>
                   </div>
                   <div className="flex flex-col gap-1">
                      {/* 4. Dashed */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'dashed' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'dashed')}>
                         <div className="h-[1px] w-full border-b-[1.5px] border-dashed border-[#404040]"></div>
                      </div>
                      {/* 5. Thin Solid */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'thin' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'thin')}>
                         <div className="h-[1px] w-full bg-[#202020]"></div>
                      </div>
                      {/* 6. Double Solid */}
                      <div className={`p-1.5 cursor-pointer flex items-center h-[28px] ${penStyle === 'double' ? 'border-[2px] border-[#8a8a8a] bg-[#e6e6e6]' : 'border-[2px] border-transparent hover:bg-[#f3f2f1]'}`} onClick={() => onChange('penStyle', 'double')}>
                         <div className="h-[3px] w-full border-t-[1px] border-b-[1px] border-[#404040]"></div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}
        
        {activeTab === 'number' && (
           <div className="flex flex-col gap-4">
             <div>
               <label className="block text-xs font-medium text-gray-600 mb-2">Loại (Danh mục)</label>
               <select 
                 className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
                 value={format?.numberFormat || 'general'}
                 onChange={e => onChange('numberFormat', e.target.value)}
                 size={10}
               >
                 <option value="general">Tổng quát</option>
                 <option value="number">Số</option>
                 <option value="currency">Tiền tệ</option>
                 <option value="accounting">Kế toán</option>
                 <option value="short_date">Ngày dạng Ngắn</option>
                 <option value="long_date">Ngày dạng Dài</option>
                 <option value="time">Thời gian</option>
                 <option value="percentage">Phần Trăm</option>
                 <option value="fraction">Phân số</option>
                 <option value="scientific">Khoa học</option>
                 <option value="text">Văn bản</option>
               </select>
             </div>
             {(format?.numberFormat === 'number' || format?.numberFormat === 'currency' || format?.numberFormat === 'accounting' || format?.numberFormat === 'percentage') && (
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Số chữ số thập phân</label>
                 <input 
                   type="number" 
                   className="w-full border border-gray-300 rounded p-1.5 text-xs" 
                   value={format?.decimalPlaces ?? 2}
                   onChange={e => onChange('decimalPlaces', parseInt(e.target.value) || 0)}
                 />
               </div>
             )}
             {(format?.numberFormat === 'currency' || format?.numberFormat === 'accounting') && (
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Ký hiệu</label>
                 <select 
                   className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
                   value={format?.currencySymbol || '$'}
                   onChange={e => onChange('currencySymbol', e.target.value)}
                 >
                   <option value="None">Không có</option>
                   <option value="$">$ (Tiếng Anh)</option>
                   <option value="₫">₫ (Tiếng Việt)</option>
                   <option value="€">€ (Euro)</option>
                   <option value="£">£ (Bảng Anh)</option>
                   <option value="¥">¥ (Yên Nhật)</option>
                 </select>
               </div>
             )}
           </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
        <span>Giúp cải thiện cách định dạng</span>
      </div>
    </div>
  );
}
