import React from 'react';
import { Dropdown, Button } from '@officex/ui';
import { LayoutGrid } from 'lucide-react';
import { CommandDispatcher } from '../CommandDispatcher';

export const CellStylesDropdown = () => {
  const applyStyle = (styleName: string, format: any) => {
    CommandDispatcher.dispatch('EXCEL.FORMAT.APPLY_PRESET', { name: styleName, format });
  };

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" className="h-[60px] flex-col gap-1 px-2 hover:bg-slate-200 text-xs font-normal text-slate-700">
          <LayoutGrid size={20} className="text-blue-600" />
          Kiểu ô
        </Button>
      }
      className="p-4 w-[600px] h-[400px] overflow-y-auto"
    >
      <div className="flex flex-col gap-6 text-[13px] text-slate-800">
        
        {/* Good, Bad and Neutral */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold pb-1 border-b border-slate-200">Tốt, xấu và trung lập</div>
          <div className="grid grid-cols-4 gap-2">
            <button className="border border-slate-400 p-2 text-left hover:bg-slate-100 bg-white" onClick={() => applyStyle('Bình thường', { backgroundColor: 'transparent', color: '#000' })}>
              Bình thường
            </button>
            <button className="border border-transparent p-2 text-left bg-[#c6efce] text-[#006100] hover:border-slate-400" onClick={() => applyStyle('Tốt', { backgroundColor: '#c6efce', color: '#006100' })}>
              Tốt
            </button>
            <button className="border border-transparent p-2 text-left bg-[#ffeb9c] text-[#9c6500] hover:border-slate-400" onClick={() => applyStyle('Trung lập', { backgroundColor: '#ffeb9c', color: '#9c6500' })}>
              Trung lập
            </button>
            <button className="border border-transparent p-2 text-left bg-[#ffc7ce] text-[#9c0006] hover:border-slate-400" onClick={() => applyStyle('Xấu', { backgroundColor: '#ffc7ce', color: '#9c0006' })}>
              Xấu
            </button>
          </div>
        </div>

        {/* Data and Model */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold pb-1 border-b border-slate-200">Dữ liệu và mô hình</div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <button className="border border-slate-400 p-2 text-left bg-[#f2f2f2] text-black font-bold hover:bg-slate-100" onClick={() => applyStyle('Đầu ra', { backgroundColor: '#f2f2f2', color: '#000', fontWeight: 'bold', borders: { top: '1px solid #333', bottom: '1px solid #333', left: '1px solid #333', right: '1px solid #333' } })}>
              Đầu ra
            </button>
            <button className="border border-transparent p-2 text-left bg-[#ffcc99] text-[#3f3f76] hover:border-slate-400" onClick={() => applyStyle('Đầu vào', { backgroundColor: '#ffcc99', color: '#3f3f76' })}>
              Đầu vào
            </button>
            <button className="border border-transparent p-2 text-left text-purple-600 underline hover:bg-slate-100" onClick={() => applyStyle('Followed Hyperlink', { color: '#800080', textDecoration: 'underline' })}>
              Followed Hy...
            </button>
            <button className="border border-transparent p-2 text-left bg-[#ffffcc] hover:border-slate-400" onClick={() => applyStyle('Ghi chú', { backgroundColor: '#ffffcc' })}>
              Ghi chú
            </button>
            <button className="border border-transparent p-2 text-left text-blue-600 underline hover:bg-slate-100" onClick={() => applyStyle('Hyperlink', { color: '#0000ff', textDecoration: 'underline' })}>
              Hyperlink
            </button>
            <button className="border border-transparent p-2 text-left text-orange-500 font-bold border-b-2 border-orange-500 hover:bg-slate-100" onClick={() => applyStyle('Ô được Nối', { color: '#ff8000', fontWeight: 'bold', borders: { bottom: '2px solid #ff8000' } })}>
              Ô được Nối ...
            </button>
            <button className="border border-slate-400 p-2 text-left bg-[#f2f2f2] text-orange-500 font-bold hover:bg-slate-100" onClick={() => applyStyle('Tính toán', { backgroundColor: '#f2f2f2', color: '#ff8000', fontWeight: 'bold', borders: { top: '1px solid #7f7f7f', bottom: '1px solid #7f7f7f', left: '1px solid #7f7f7f', right: '1px solid #7f7f7f' } })}>
              Tính toán
            </button>
            <button className="border border-transparent p-2 text-left text-red-500 hover:bg-slate-100" onClick={() => applyStyle('Văn bản Cảnh báo', { color: '#ff0000' })}>
              Văn bản Cảnh...
            </button>
            <button className="border border-transparent p-2 text-left text-slate-500 italic hover:bg-slate-100" onClick={() => applyStyle('Văn bản Giải thích', { color: '#7f7f7f', fontStyle: 'italic' })}>
              Văn bản Giải...
            </button>
            <button className="border-4 border-slate-500 p-2 text-left bg-slate-400 text-white font-bold hover:bg-slate-500" onClick={() => applyStyle('Kiểm tra Ô', { backgroundColor: '#a5a5a5', color: '#fff', fontWeight: 'bold', borders: { top: '4px solid #7f7f7f', bottom: '4px solid #7f7f7f', left: '4px solid #7f7f7f', right: '4px solid #7f7f7f' } })}>
              Kiểm tra Ô
            </button>
          </div>
        </div>

        {/* Titles and Headings */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold pb-1 border-b border-slate-200">Tiêu đề và đầu đề</div>
          <div className="grid grid-cols-6 gap-2 items-end">
            <button className="border border-transparent p-2 text-left text-blue-800 text-lg font-bold border-b-2 border-blue-800 hover:bg-slate-100" onClick={() => applyStyle('Đầu đề 1', { fontSize: '15', fontWeight: 'bold', color: '#1f497d', borders: { bottom: '2px solid #1f497d' } })}>
              Đầu đề 1
            </button>
            <button className="border border-transparent p-2 text-left text-blue-700 text-base font-bold border-b border-blue-700 hover:bg-slate-100" onClick={() => applyStyle('Đầu đề 2', { fontSize: '13', fontWeight: 'bold', color: '#1f497d', borders: { bottom: '1px solid #1f497d' } })}>
              Đầu đề 2
            </button>
            <button className="border border-transparent p-2 text-left text-blue-600 text-sm font-bold border-b border-blue-400 hover:bg-slate-100" onClick={() => applyStyle('Đầu đề 3', { fontSize: '11', fontWeight: 'bold', color: '#1f497d', borders: { bottom: '1px solid #95b3d7' } })}>
              Đầu đề 3
            </button>
            <button className="border border-transparent p-2 text-left text-blue-500 text-sm font-bold hover:bg-slate-100" onClick={() => applyStyle('Đầu đề 4', { fontSize: '11', fontWeight: 'bold', color: '#1f497d' })}>
              Đầu đề 4
            </button>
            <button className="border border-transparent p-2 text-left text-blue-900 text-xl font-bold hover:bg-slate-100" onClick={() => applyStyle('Tiêu đề', { fontSize: '18', fontWeight: 'bold', color: '#1f497d' })}>
              Tiêu đề
            </button>
            <button className="border border-transparent p-2 text-left text-black font-bold border-t border-b-4 border-blue-600 hover:bg-slate-100" onClick={() => applyStyle('Tổng', { fontWeight: 'bold', borders: { top: '1px solid #1f497d', bottom: '4px double #1f497d' } })}>
              Tổng
            </button>
          </div>
        </div>

        {/* Themed Cell Styles */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold pb-1 border-b border-slate-200">Các kiểu ô theo chủ đề</div>
          <div className="grid grid-cols-6 gap-2 text-xs">
            {/* 20% */}
            {['#dce6f1', '#fce4d6', '#ededed', '#fff2cc', '#ddebf7', '#e2efda'].map((color, i) => (
              <button key={i} className="border border-transparent p-2 text-left hover:border-slate-400" style={{ backgroundColor: color }} onClick={() => applyStyle(`20% - Accent${i+1}`, { backgroundColor: color })}>
                20% - Accent{i+1}
              </button>
            ))}
            {/* 40% */}
            {['#b8cce4', '#f8cbad', '#dbdbdb', '#ffe699', '#bdd7ee', '#c6e0b4'].map((color, i) => (
              <button key={i} className="border border-transparent p-2 text-left hover:border-slate-400" style={{ backgroundColor: color }} onClick={() => applyStyle(`40% - Accent${i+1}`, { backgroundColor: color })}>
                40% - Accent{i+1}
              </button>
            ))}
            {/* 60% */}
            {['#95b3d7', '#f4b084', '#c9c9c9', '#ffd966', '#9bc2e6', '#a9d08e'].map((color, i) => (
              <button key={i} className="border border-transparent p-2 text-left text-white hover:border-slate-400" style={{ backgroundColor: color }} onClick={() => applyStyle(`60% - Accent${i+1}`, { backgroundColor: color, color: '#fff' })}>
                60% - Accent{i+1}
              </button>
            ))}
            {/* 100% */}
            {['#4a7ebb', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'].map((color, i) => (
              <button key={i} className="border border-transparent p-2 text-left text-white font-bold hover:border-slate-400" style={{ backgroundColor: color }} onClick={() => applyStyle(`Accent${i+1}`, { backgroundColor: color, color: '#fff' })}>
                Accent{i+1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </Dropdown>
  );
};
