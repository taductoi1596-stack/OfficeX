import React, { useState } from 'react';
import { Dialog, Button, Input } from '@officex/ui';
import { CFRule, CFRuleType, CFOperator, ConditionalStyle } from 'spreadsheet-core/src/tooling/ConditionalFormattingEngine';

interface CFDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (rule: CFRule) => void;
  mode: 'highlight' | 'topBottom' | 'newRule' | 'manageRules';
}

export function CFDialog({ isOpen, onClose, onApply, mode }: CFDialogProps) {
  const [operator, setOperator] = useState<CFOperator>('greaterThan');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  
  // Format preset
  const [formatPreset, setFormatPreset] = useState<'red' | 'yellow' | 'green' | 'custom'>('red');

  if (!isOpen) return null;

  const handleApply = () => {
    let style: ConditionalStyle = {};
    if (formatPreset === 'red') {
      style = { backgroundColor: '#ffc7ce', fontColor: '#9c0006' };
    } else if (formatPreset === 'yellow') {
      style = { backgroundColor: '#ffeb9c', fontColor: '#9c6500' };
    } else if (formatPreset === 'green') {
      style = { backgroundColor: '#c6efce', fontColor: '#006100' };
    }

    const rule: CFRule = {
      id: 'cf_' + Date.now(),
      type: 'cellIs',
      priority: 1,
      stopIfTrue: false,
      appliesTo: 'A1:Z100', // TODO: get active range
      operator: operator,
      formulas: [val1, val2],
      style
    };

    if (mode === 'topBottom') {
      rule.type = 'top10';
      rule.rank = Number(val1) || 10;
      rule.percent = operator === 'endsWith'; // hack for storing percent flag
      rule.bottom = operator === 'lessThan';
      rule.operator = undefined;
      rule.formulas = undefined;
    }

    onApply(rule);
    onClose();
  };

  if (mode === 'highlight' || mode === 'topBottom') {
    return (
      <Dialog title={mode === 'highlight' ? 'Tô sáng Ô' : 'Quy tắc Trên/Dưới'} isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col gap-4 w-[400px]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Loại Quy tắc</label>
            <select 
              className="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
              value={operator} 
              onChange={e => setOperator(e.target.value as CFOperator)}
            >
              {mode === 'highlight' ? (
                <>
                  <option value="greaterThan">Lớn hơn (Greater Than)</option>
                  <option value="lessThan">Nhỏ hơn (Less Than)</option>
                  <option value="between">Nằm giữa (Between)</option>
                  <option value="equal">Bằng (Equal To)</option>
                  <option value="containsText">Chứa văn bản (Text Contains)</option>
                </>
              ) : (
                <>
                  <option value="greaterThan">10 mục đầu tiên (Top 10 Items)</option>
                  <option value="lessThan">10 mục cuối cùng (Bottom 10 Items)</option>
                  <option value="endsWith">10% đầu tiên (Top 10%)</option>
                  <option value="beginsWith">10% cuối cùng (Bottom 10%)</option>
                </>
              )}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Giá trị {mode === 'topBottom' ? '(N)' : '1'}</label>
              <Input value={val1} onChange={e => setVal1(e.target.value)} placeholder="VD: 50, =A1, 10" />
            </div>
            {operator === 'between' && (
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm">Giá trị 2</label>
                <Input value={val2} onChange={e => setVal2(e.target.value)} placeholder="VD: 100" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Định dạng áp dụng</label>
            <select 
              className="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
              value={formatPreset} 
              onChange={e => setFormatPreset(e.target.value as any)}
            >
              <option value="red">Tô Đỏ Nhạt với Văn bản Đỏ Đậm</option>
              <option value="yellow">Tô Vàng với Văn bản Vàng Đậm</option>
              <option value="green">Tô Xanh Lục với Văn bản Xanh Lục Đậm</option>
              <option value="custom">Định dạng Tùy chỉnh...</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={handleApply} className="bg-green-600 text-white hover:bg-green-700">Áp dụng</Button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog title="Quản lý Quy tắc / Quy tắc Mới" isOpen={isOpen} onClose={onClose}>
      <div className="w-[500px] h-[300px] flex flex-col items-center justify-center text-slate-500 gap-4">
        <p>(Giao diện Quản lý Quy tắc nâng cao sẽ được thêm sau ở Phase 4)</p>
        <Button variant="outline" onClick={onClose}>Đóng</Button>
      </div>
    </Dialog>
  );
}
