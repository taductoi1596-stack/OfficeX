import React, { useState } from 'react';
import { ArrowDownToLine, ArrowRightToLine, ArrowUpToLine, ArrowLeftToLine, ChevronDown, ListEnd } from 'lucide-react';
import { Dropdown } from '@officex/ui';
import { CommandDispatcher } from '../CommandDispatcher';

export function FillDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFill = (direction: string) => {
    CommandDispatcher.dispatch(`EXCEL.EDIT.FILL_${direction}`);
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Xuống dưới', icon: <ArrowDownToLine size={16} />, shortcut: 'Ctrl+D', onClick: () => handleFill('DOWN') },
    { label: 'Sang phải', icon: <ArrowRightToLine size={16} />, shortcut: 'Ctrl+R', onClick: () => handleFill('RIGHT') },
    { label: 'Lên trên', icon: <ArrowUpToLine size={16} />, onClick: () => handleFill('UP') },
    { label: 'Sang trái', icon: <ArrowLeftToLine size={16} />, onClick: () => handleFill('LEFT') },
    { label: 'Chuỗi... (Series)', icon: <ListEnd size={16} />, onClick: () => CommandDispatcher.dispatch('EXCEL.EDIT.SERIES') },
  ];

  return (
    <div className="relative">
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={
          <div className="flex bg-transparent hover:bg-slate-200 border border-transparent hover:border-slate-300 rounded cursor-pointer group">
            <button
              className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-xs text-slate-700"
              title="Điền"
              onClick={(e) => {
                e.stopPropagation();
                handleFill('DOWN');
              }}
            >
              <div className="flex items-center gap-1">
                <ArrowDownToLine size={18} className="text-blue-600" />
                <div className="flex flex-col items-start leading-[10px]">
                  <span>Điền</span>
                  <ChevronDown size={10} className="text-slate-500" />
                </div>
              </div>
            </button>
          </div>
        }
        content={
          <div className="w-56 bg-white border border-slate-200 rounded shadow-lg py-1 z-[100] text-sm">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-slate-700"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 w-4 flex justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.shortcut && <span className="text-xs text-slate-400">{item.shortcut}</span>}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}
