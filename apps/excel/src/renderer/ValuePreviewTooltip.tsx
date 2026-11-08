import React, { useEffect, useState, useRef } from 'react';
import { FormulaParser } from '@officex/spreadsheet-core';

interface ValuePreviewTooltipProps {
  inputId: string;
  formulaText: string;
  getCellValue: (ref: string) => any;
}

export function ValuePreviewTooltip({ inputId, formulaText, getCellValue }: ValuePreviewTooltipProps) {
  const [previewValue, setPreviewValue] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number, left: number } | null>(null);
  const parserRef = useRef(new FormulaParser());

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;

    const handleSelect = () => {
      const start = input.selectionStart;
      const end = input.selectionEnd;

      if (start !== null && end !== null && start < end) {
        try {
          if (formulaText.startsWith('=')) {
            const val = parserRef.current.parseAndEvaluate(formulaText, getCellValue);
            if (val !== null && val !== undefined && val !== '#ERROR!' && val !== '#NAME?' && val !== '#DIV/0!') {
              // Format to 2 decimal places if it's a float
              let displayVal = val.toString();
              if (typeof val === 'number' && !Number.isInteger(val)) {
                displayVal = val.toFixed(2);
                if (displayVal.endsWith('.00')) displayVal = displayVal.slice(0, -3);
              }

              setPreviewValue(displayVal);
              
              // Calculate position above the selection
              setPosition({
                top: -32, // 32px above the input
                left: (start + (end - start) / 2) * 8 + 10 // center of selection roughly
              });
              return;
            }
          }
        } catch (e) {
          // ignore
        }
      }
      setPreviewValue(null);
    };

    // Give it a tiny delay to allow selection to update
    const delayedHandleSelect = () => setTimeout(handleSelect, 10);

    document.addEventListener('selectionchange', delayedHandleSelect);
    input.addEventListener('focus', delayedHandleSelect);

    return () => {
      document.removeEventListener('selectionchange', delayedHandleSelect);
      input.removeEventListener('focus', delayedHandleSelect);
    };
  }, [inputId, formulaText, getCellValue]);

  if (!previewValue || !position) return null;

  return (
    <div 
      className="absolute z-[3000] bg-white border border-slate-200 shadow-md rounded-[4px] px-2 py-0.5 text-[12px] font-sans text-slate-700 whitespace-nowrap"
      style={{ 
        top: position.top, 
        left: position.left,
        transform: 'translateX(-50%)'
      }}
    >
      {previewValue}
      <div 
        className="absolute w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45"
        style={{ bottom: '-4.5px', left: '50%', marginLeft: '-4px' }}
      />
    </div>
  );
}
