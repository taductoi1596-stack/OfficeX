import React, { useState } from 'react';
import { Sigma, ChevronDown, Settings } from 'lucide-react';
import { Dropdown } from '@officex/ui';
import { CommandDispatcher } from '../CommandDispatcher';

interface TooltipInfo {
  title: string;
  desc: string;
  x: number;
  y: number;
}

export function AutoSumDropdown() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const insertFormula = (funcName: string) => {
    CommandDispatcher.dispatch('EXCEL.INSERT.AUTOSUM', { funcName });
    setTooltip(null);
  };

  const insertArithmetic = (operator: string, label: string) => {
    CommandDispatcher.dispatch('EXCEL.INSERT.ARITHMETIC', { operator, label });
    setTooltip(null);
  };

  const menuItems = [
    { label: 'Tổng', icon: <Sigma size={16} />, shortcut: 'Alt+=', onClick: () => insertFormula('SUM'), title: 'Sử dụng Tổng', desc: 'Thêm tất cả số trong một vùng ô.' },
    { label: 'Trung bình', onClick: () => insertFormula('AVERAGE'), title: 'Sử dụng Trung bình', desc: 'Tính giá trị trung bình (trung bình cộng) của các số trong một vùng.' },
    { label: 'Đếm Số', onClick: () => insertFormula('COUNT'), title: 'Sử dụng Đếm Số', desc: 'Đếm số ô có chứa số trong một vùng.' },
    { label: 'Tối đa', onClick: () => insertFormula('MAX'), title: 'Sử dụng Tối đa', desc: 'Trả về giá trị lớn nhất trong một tập số.' },
    { label: 'Tối thiểu', onClick: () => insertFormula('MIN'), title: 'Sử dụng Tối thiểu', desc: 'Trả về giá trị nhỏ nhất trong một tập số.' },
    { label: 'Thêm', onClick: () => insertArithmetic('+', 'Thêm'), title: 'Sử dụng Thêm', desc: "Sử dụng toán tử '+' số học để Thêm giá trị trong hai ô. Chọn ô nguồn và đích, rồi nhấn Enter." },
    { label: 'Dấu trừ', onClick: () => insertArithmetic('-', 'Trừ'), title: 'Sử dụng Trừ', desc: "Sử dụng toán tử '-' số học để trừ giá trị của một ô với ô khác." },
    { label: 'Nhân', onClick: () => insertArithmetic('*', 'Nhân'), title: 'Sử dụng Nhân', desc: "Sử dụng toán tử '*' số học để nhân giá trị trong hai ô." },
    { label: 'Chia', onClick: () => insertArithmetic('/', 'Chia'), title: 'Sử dụng Chia', desc: "Sử dụng toán tử '/' số học để chia giá trị của một ô cho ô khác." },
  ];

  return (
    <div className="relative">
      <Dropdown
        trigger={
          <div className="flex bg-transparent hover:bg-slate-200 border border-transparent hover:border-slate-300 rounded cursor-pointer">
            <button
              className="flex items-center gap-1 px-2 h-6 text-xs text-slate-700"
              title="Tự động tính tổng (Alt+=)"
              onClick={(e) => {
                e.stopPropagation();
                insertFormula('SUM');
              }}
            >
              <Sigma size={14} className="text-blue-600" />
              <span className="sr-only">Tổng</span>
            </button>
            <button className="flex items-center px-1 h-6 text-slate-600 hover:bg-slate-300 border-l border-transparent hover:border-slate-300 rounded-r">
              <ChevronDown size={12} />
            </button>
          </div>
        }
        className="py-1 w-52"
      >
        <div className="flex flex-col text-[13px] text-slate-700">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="relative flex justify-between items-center px-3 py-1.5 hover:bg-slate-100 cursor-pointer"
              onClick={item.onClick}
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setTooltip({ title: item.title, desc: item.desc, x: rect.right + 8, y: rect.top });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <div className="flex items-center gap-2">
                {item.icon ?? <span className="w-4" />}
                {item.label}
              </div>
              {item.shortcut && <span className="text-xs text-slate-400">{item.shortcut}</span>}
            </div>
          ))}

          <div className="h-px bg-slate-200 my-1 mx-2" />

          <div
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 cursor-pointer"
            onClick={() => { CommandDispatcher.dispatch('EXCEL.VIEW.OPEN_INSERT_FUNCTION'); setTooltip(null); }}
            onMouseLeave={() => setTooltip(null)}
          >
            <Settings size={16} className="text-slate-500" /> Hàm khác...
          </div>
        </div>
      </Dropdown>

      {tooltip && (
        <div
          className="fixed z-[9999] bg-[#1f1f1f] text-white text-xs rounded shadow-xl px-3 py-2 max-w-[220px] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold mb-1">{tooltip.title}</div>
          <div className="text-slate-300 leading-relaxed">{tooltip.desc}</div>
        </div>
      )}
    </div>
  );
}

