import React from 'react';
import { RBtn, RGroup } from '../SharedComponents';
import { Button } from '@officex/ui';
import { Dropdown } from '@officex/ui';
import { 
  Table2, Table, ClipboardList, Image, Shapes, CheckSquare,
  BarChart2, LineChart, ScatterChart, PieChart, BarChart, AreaChart, GitMerge,
  Filter, Link, MessageSquarePlus, Type, ChevronDown, Sparkles, Database,
  ArrowUpCircle, Search, Globe
} from 'lucide-react';
import { CommandDispatcher } from '../CommandDispatcher';
import { ShapesMenu } from './ShapesMenu';

export function InsertRibbon() {
  const handleInsertImagePC = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Đã chọn ảnh: ${file.name}\n(Tính năng chèn ảnh vào bảng tính đang được phát triển)`);
      }
    };
    input.click();
  };

  const handleInsertImageStock = () => {
    alert('Tính năng "Hình ảnh trong kho ảnh dự trữ" đang được phát triển!');
  };

  const handleInsertImageWeb = () => {
    alert('Tính năng "Tìm kiếm trên web" đang được phát triển!');
  };

  return (
    <div className="flex h-24 px-2 py-1 items-start gap-1 bg-[#F3F2F1] text-xs">
      
      {/* Bảng */}
      <RGroup label="Bảng">
        <div className="flex gap-1">
          <Dropdown
            trigger={
              <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded hover:bg-slate-200">
                <button 
                  className="flex-1 w-full flex items-center justify-center p-1 rounded-t hover:bg-slate-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    CommandDispatcher.dispatch('EXCEL.INSERT.PIVOT_TABLE');
                  }}
                >
                  <Table2 size={24} className="text-blue-600" />
                </button>
                <div className="flex items-center gap-1 p-1 text-[11px] leading-none hover:bg-slate-300 rounded-b w-full justify-center">
                  PivotTable <ChevronDown size={10} />
                </div>
              </div>
            }
            items={[
              { 
                id: 'from_table', 
                label: <div className="flex items-center gap-2"><Table2 size={16} className="text-slate-600" /><span>Từ Bảng/Dải ô</span></div>, 
                onClick: () => CommandDispatcher.dispatch('EXCEL.INSERT.PIVOT_TABLE') 
              },
              { 
                id: 'from_external', 
                label: <div className="flex items-center gap-2"><Database size={16} className="text-slate-600" /><span>Từ Dữ liệu bên ngoài</span></div>, 
                onClick: () => {} 
              }
            ]}
          />
          <button 
            className="flex flex-col items-center justify-center p-1 hover:bg-slate-200 rounded min-w-[50px] h-[60px]"
            onClick={() => {
              CommandDispatcher.dispatch('EXCEL.DIALOG.INSERT_TABLE');
            }}
          >
            <Table size={24} className="text-blue-600 mb-1" />
            <span>Bảng</span>
          </button>
        </div>
      </RGroup>


      {/* Hình minh họa */}
      <RGroup label="Hình minh họa">
        <div className="flex gap-1">
          <Dropdown
            trigger={
              <button className="flex flex-col items-center justify-center p-1 hover:bg-slate-200 rounded min-w-[60px] h-[60px]">
                <Image size={24} className="text-slate-600 mb-1" />
                <span className="flex items-center gap-1">Hình ảnh <ChevronDown size={10} /></span>
              </button>
            }
            items={[
              { 
                id: 'header', 
                label: <div className="text-[12px] font-semibold text-[#B95B14] pb-1 mb-1 cursor-default">Chèn Hình ảnh Từ</div>, 
                onClick: (e) => { e.stopPropagation(); } 
              },
              { 
                id: 'from_pc', 
                label: (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0 w-4 h-4">
                      <Image size={16} className="text-slate-700" />
                      <ArrowUpCircle size={10} className="absolute -bottom-1 -right-1 bg-white rounded-full text-blue-500" />
                    </div>
                    <span>Thiết bị này...</span>
                  </div>
                ), 
                onClick: handleInsertImagePC 
              },
              { 
                id: 'from_stock', 
                label: (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0 w-4 h-4">
                      <Image size={16} className="text-slate-700" />
                      <Search size={10} className="absolute -bottom-1 -right-1 bg-white rounded-full text-blue-500 p-[1px]" />
                    </div>
                    <span>Hình ảnh trong kho ảnh dự trữ...</span>
                  </div>
                ), 
                onClick: handleInsertImageStock 
              },
              { 
                id: 'from_web', 
                label: (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0 w-4 h-4">
                      <Image size={16} className="text-slate-700" />
                      <Globe size={10} className="absolute -bottom-1 -right-1 bg-white rounded-full text-blue-500 p-[1px]" />
                    </div>
                    <span>Tìm kiếm trên web...</span>
                  </div>
                ), 
                onClick: handleInsertImageWeb 
              }
            ]}
          />
          <Dropdown
            trigger={
              <button className="flex flex-col items-center justify-center p-1 hover:bg-slate-200 rounded min-w-[50px] h-[60px]">
                <Shapes size={24} className="text-slate-600 mb-1" />
                <span className="flex items-center gap-1">Hình <ChevronDown size={10} /></span>
              </button>
            }
          >
            <ShapesMenu />
          </Dropdown>
        </div>
      </RGroup>

      {/* Hộp kiểm */}
      <RGroup label="Kiểm soát ô">
        <button
          className="flex flex-col items-center justify-center p-1 hover:bg-slate-200 rounded min-w-[60px] h-[60px]"
          onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHECKBOX', {})}
        >
          <CheckSquare size={24} className="text-slate-600 mb-1" />
          <span>Hộp kiểm</span>
        </button>
      </RGroup>

      {/* Biểu đồ */}
      <RGroup label="Biểu đồ">
        <div className="flex flex-col gap-0.5 h-full justify-center">
          <div className="flex gap-0.5">
            <button title="Biểu đồ Cột" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'bar' })}>
              <BarChart2 size={16} className="text-blue-600" />
            </button>
            <button title="Biểu đồ Đường" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'line' })}>
              <LineChart size={16} className="text-blue-600" />
            </button>
            <button title="Biểu đồ Vùng" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'area' })}>
              <AreaChart size={16} className="text-blue-600" />
            </button>
            <button title="Biểu đồ Tròn" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'pie' })}>
              <PieChart size={16} className="text-blue-600" />
            </button>
          </div>
          <div className="flex gap-0.5">
            <button title="Biểu đồ Donut" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'donut' })}>
              <PieChart size={16} className="text-purple-600" strokeWidth={1} />
            </button>
            <button title="Biểu đồ Phân tán" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'scatter' })}>
              <ScatterChart size={16} className="text-blue-600" />
            </button>
            <button title="Biểu đồ Radar" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'radar' })}>
              <GitMerge size={16} className="text-blue-600" />
            </button>
            <button title="Biểu đồ Thác nước" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200"
              onClick={() => CommandDispatcher.dispatch('EXCEL.INSERT.CHART', { type: 'waterfall' })}>
              <BarChart size={16} className="text-blue-600" />
            </button>
          </div>
        </div>
      </RGroup>


    
    </div>
  );
}
