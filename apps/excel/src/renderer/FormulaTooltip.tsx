import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface ArgDef {
  name: string;
  isOptional: boolean;
  description: string;
}

interface FuncMeta {
  name: string;
  description: string;
  example: string;
  args: ArgDef[];
}

const FUNC_DATABASE: Record<string, FuncMeta> = {
  'AVERAGE': {
    name: 'AVERAGE',
    description: 'Trả về giá trị trung bình (trung bình số học) của các tham đối, chúng có thể là các số, tên, mảng hoặc các tham chiếu có chứa số',
    example: '=AVERAGE(A2:A6)',
    args: [
      { name: 'number1', isOptional: false, description: 'number1,number2,... từ 1 đến 255 tham đối dạng số bạn cần tính trung bình' },
      { name: 'number2', isOptional: true, description: 'number1,number2,... từ 1 đến 255 tham đối dạng số bạn cần tính trung bình' }
    ]
  },
  'SUM': {
    name: 'SUM',
    description: 'Cộng tất cả các số trong một dải ô.',
    example: '=SUM(A1:A10)',
    args: [
      { name: 'number1', isOptional: false, description: '1 đến 255 đối số mà bạn muốn cộng.' },
      { name: 'number2', isOptional: true, description: '1 đến 255 đối số mà bạn muốn cộng.' }
    ]
  },
};

function parseFormula(text: string): { funcName: string, argIndex: number } | null {
  if (!text.startsWith('=')) return null;
  
  let depth = 0;
  let argIndex = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    const char = text[i];
    if (char === ')') {
      depth++;
    } else if (char === '(') {
      if (depth === 0) {
        const before = text.substring(0, i);
        const match = before.match(/[a-zA-Z0-9_]+$/);
        if (match) {
          return { funcName: match[0].toUpperCase(), argIndex };
        }
        return null;
      }
      depth--;
    } else if ((char === ',' || char === ';') && depth === 0) {
      argIndex++;
    }
  }
  return null;
}

interface FormulaTooltipProps {
  value: string; // The raw formula text from the input
  onClose?: () => void;
}

export function FormulaTooltip({ value, onClose }: FormulaTooltipProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const parsed = parseFormula(value);
  if (!parsed) return null;
  
  const meta = FUNC_DATABASE[parsed.funcName];
  if (!meta) return null;

  const activeArgIndex = Math.min(parsed.argIndex, meta.args.length - 1);

  return (
    <div className="absolute top-full left-0 mt-1 z-[2000] bg-white border border-slate-300 shadow-xl rounded-sm w-[350px] text-[13px] text-slate-800 flex flex-col font-sans select-none">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <div className="flex flex-wrap gap-1 items-center font-mono text-xs">
          <span>{meta.name}(</span>
          {meta.args.map((arg, idx) => {
            const isLast = idx === meta.args.length - 1;
            const isAct = idx === activeArgIndex;
            const argText = arg.isOptional ? `[${arg.name}]` : arg.name;
            return (
              <span key={arg.name}>
                <span className={isAct ? "text-green-700 font-bold" : "text-slate-600"}>{argText}</span>
                {!isLast && <span>; </span>}
                {isLast && <span>; ...)</span>}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <button className="hover:bg-slate-100 p-0.5 rounded" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button className="hover:bg-slate-100 p-0.5 rounded" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          <div className="px-3 py-3 border-b border-slate-200 bg-white">
            <h4 className="font-semibold text-slate-700 mb-1">Mô tả</h4>
            <p className="text-slate-600 mb-3 leading-relaxed">{meta.description}</p>
            
            <h4 className="font-semibold text-slate-700 mb-1">Ví dụ</h4>
            <p className="font-mono text-slate-600 bg-slate-50 p-1.5 rounded">{meta.example}</p>
          </div>

          <div className="flex flex-col bg-white">
            {meta.args.map((arg, idx) => {
              const isAct = idx === activeArgIndex;
              return (
                <div key={arg.name} className={`flex text-xs ${isAct ? 'bg-[#e5f3eb]' : 'bg-slate-50'} border-b border-slate-200 last:border-b-0`}>
                  <div className={`w-1/4 px-2 py-2 font-semibold ${isAct ? 'text-green-800' : 'text-slate-600'} border-r border-slate-200/50`}>
                    {arg.isOptional ? `[${arg.name}]` : arg.name}
                  </div>
                  <div className={`w-3/4 px-2 py-2 ${isAct ? 'text-slate-800' : 'text-slate-500'}`}>
                    {arg.description}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-3 py-3 bg-white flex justify-between">
            <a href="#" className="text-green-700 hover:underline font-medium text-xs">Tìm hiểu thêm về {meta.name}</a>
            <a href="#" className="text-green-700 hover:underline font-medium text-xs">Cung cấp thông tin phản hồi</a>
          </div>
        </div>
      )}
    </div>
  );
}
