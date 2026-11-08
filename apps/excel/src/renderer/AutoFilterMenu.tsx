import React, { useState } from 'react';
import { Search, ArrowUp, ArrowDown, Eye, FilterX } from 'lucide-react';
import { Button } from '@officex/ui';

interface AutoFilterMenuProps {
  x: number;
  y: number;
  columnName: string;
  uniqueValues: string[];
  onClose: () => void;
  onApplySort: (direction: 'asc' | 'desc') => void;
  onApplyFilter: (selectedValues: string[]) => void;
}

export function AutoFilterMenu({ x, y, columnName, uniqueValues, onClose, onApplySort, onApplyFilter }: AutoFilterMenuProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(uniqueValues));

  const filteredValues = uniqueValues.filter(v => v.toLowerCase().includes(searchText.toLowerCase()));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedValues(new Set(uniqueValues));
    } else {
      setSelectedValues(new Set());
    }
  };

  const handleToggleValue = (val: string, checked: boolean) => {
    const newSet = new Set(selectedValues);
    if (checked) newSet.add(val);
    else newSet.delete(val);
    setSelectedValues(newSet);
  };

  const isAllSelected = selectedValues.size === uniqueValues.length && uniqueValues.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="fixed z-50 bg-white shadow-xl border border-slate-300 flex flex-col text-[13px] text-slate-800"
        style={{ left: x, top: y, minWidth: 260, maxHeight: 400 }}
      >
        <div className="py-1 flex flex-col">
          <button className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left relative" onClick={() => { onApplySort('asc'); onClose(); }}>
            <ArrowDown size={14} className="text-slate-500 absolute left-2" />
            <span>Sắp xếp từ A đến Z</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left relative" onClick={() => { onApplySort('desc'); onClose(); }}>
            <ArrowDown size={14} className="text-slate-500 absolute left-2" />
            <span>Sắp xếp từ Z đến A</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-1 text-slate-400 text-left cursor-default w-full justify-between relative">
            <span>Sắp xếp theo màu</span>
            <span className="text-slate-300">{'>'}</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left relative">
            <span>Sắp xếp tùy chỉnh...</span>
          </button>
        </div>

        <div className="border-t border-slate-200 py-1">
          <button className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left w-full justify-between relative">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-slate-500 absolute left-2" />
              <span>Dạng xem trang tính</span>
            </div>
            <span className="text-slate-500">{'>'}</span>
          </button>
        </div>

        <div className="border-t border-slate-200 py-1">
          <button 
            className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left relative w-full"
            onClick={() => {
              onApplyFilter(uniqueValues);
              onClose();
            }}
          >
            <FilterX size={14} className="text-slate-500 absolute left-2" />
            <span>Bỏ chọn Bộ lọc khỏi '{columnName}'</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-1 text-slate-400 text-left cursor-default w-full justify-between relative">
            <span>Lọc theo màu</span>
            <span className="text-slate-300">{'>'}</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-1 hover:bg-slate-100 text-left w-full justify-between relative">
            <span>Bộ lọc Văn bản</span>
            <span className="text-slate-500">{'>'}</span>
          </button>
        </div>

        <div className="border-t border-slate-200 p-2 flex flex-col flex-1 min-h-[150px]">
          <div className="relative mb-2">
            <Search size={14} className="absolute left-2 top-1.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full border border-slate-400 rounded-sm px-7 py-1 outline-none focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-slate-300 bg-white p-1 max-h-[120px]">
            <label className="flex items-center gap-2 px-1 hover:bg-slate-100 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={e => handleToggleAll(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#107C41]"
              />
              <span>Chọn Tất cả</span>
            </label>
            {filteredValues.map(val => (
              <label key={val} className="flex items-center gap-2 px-1 hover:bg-slate-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedValues.has(val)}
                  onChange={e => handleToggleValue(val, e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#107C41]"
                />
                <span>{val || '(Trống)'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 p-2 flex justify-start bg-white">
          <button onClick={() => { onApplyFilter(Array.from(selectedValues)); onClose(); }} className="px-5 py-1.5 bg-[#188038] hover:bg-[#146c2e] text-white rounded-sm text-[13px] font-medium shadow-sm">Áp dụng</button>
        </div>
      </div>
    </>
  );
}
