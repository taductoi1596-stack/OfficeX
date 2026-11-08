import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@officex/ui';

interface PivotTableDialogProps {
  onClose: () => void;
  defaultRange?: string;
  defaultLocation?: string;
}

export function PivotTableDialog({ onClose, defaultRange = '', defaultLocation = "'Trang_tính1'!$F$16" }: PivotTableDialogProps) {
  const [range, setRange] = useState(defaultRange);
  const [locationType, setLocationType] = useState<'new' | 'existing'>('existing');
  const [location, setLocation] = useState(defaultLocation);

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
      <div className="bg-white border border-slate-300 shadow-xl w-[380px] flex flex-col text-sm text-[#333]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="text-[15px] font-normal">Tạo PivotTable</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-2 flex flex-col gap-4">
          <div>
            <div className="mb-2">Chọn dữ liệu bạn muốn phân tích</div>
            <div className="mb-2">Chọn bảng hoặc dải ô</div>
            <div className="flex items-center gap-2 pl-4">
              <label className="min-w-[80px] text-right">Bảng/Dải ô:</label>
              <input 
                type="text" 
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="flex-1 border-2 border-slate-800 outline-none px-2 py-1 text-[13px] rounded-sm"
              />
            </div>
          </div>

          <div>
            <div className="mb-2">Chọn nơi bạn muốn đặt báo cáo PivotTable</div>
            <div className="flex flex-col gap-2 pl-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="pivotLocation" 
                  checked={locationType === 'new'} 
                  onChange={() => setLocationType('new')}
                  className="w-3.5 h-3.5 accent-[#0078d4]"
                />
                Trang tính Mới
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="pivotLocation" 
                  checked={locationType === 'existing'} 
                  onChange={() => setLocationType('existing')}
                  className="w-3.5 h-3.5 accent-[#0078d4]"
                />
                Trang tính Hiện có
              </label>
              <div className="flex items-center gap-2 pl-4 mt-1">
                <label className="min-w-[80px] text-right">Vị trí:</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={locationType === 'new'}
                  className={`flex-1 border border-slate-600 outline-none px-2 py-1 text-[13px] ${locationType === 'new' ? 'bg-slate-100' : 'bg-white'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 flex justify-end gap-2 mt-2">
          <Button 
            className="bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#333] border border-slate-300 font-normal rounded-sm px-6 h-7 text-[13px]" 
            onClick={() => {
              console.log("Create PivotTable", { range, locationType, location });
              onClose();
            }}
          >
            OK
          </Button>
          <Button 
            className="bg-white hover:bg-[#f0f0f0] text-[#333] border border-slate-300 font-normal rounded-sm px-4 h-7 text-[13px]" 
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
        </div>

      </div>
    </div>
  );
}
