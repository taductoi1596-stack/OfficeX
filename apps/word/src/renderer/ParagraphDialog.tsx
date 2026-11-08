import React, { useState, useEffect } from 'react';
import { EditorAPI } from './editorApi';
import { ParaFmt } from './document/DocumentTypes';

export interface ParagraphDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ParagraphDialog({ isOpen, onClose }: ParagraphDialogProps) {
  const [activeTab, setActiveTab] = useState('indents');
  const [fmt, setFmt] = useState<ParaFmt>({});

  useEffect(() => {
    if (isOpen) {
      const currentFmt = EditorAPI.getState().currentParaFmt || {};
      setFmt({ ...currentFmt });
      setActiveTab('indents');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof ParaFmt, val: any) => {
    const newFmt = { ...fmt, [key]: val };
    setFmt(newFmt);
    EditorAPI.getLegacy()?.applyLivePreviewPara(newFmt);
  };

  const handleOk = () => {
    EditorAPI.getLegacy()?.clearLivePreview();
    EditorAPI.getLegacy()?.setParaFmt(fmt);
    onClose();
  };

  const handleCancel = () => {
    EditorAPI.getLegacy()?.clearLivePreview();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-md shadow-2xl w-[500px] flex flex-col text-sm border border-[#E5E5E5]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[15px] text-[#333]">Paragraph</h2>
          <button onClick={handleCancel} className="text-[#666] hover:text-[#000] hover:bg-[#E5E5E5] w-6 h-6 flex items-center justify-center rounded">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 mt-2 border-b border-[#E5E5E5]">
          <button 
            className={`px-3 py-1.5 -mb-px border-b-2 ${activeTab === 'indents' ? 'border-[#2B579A] text-[#2B579A] font-semibold' : 'border-transparent text-[#666] hover:text-[#333]'}`}
            onClick={() => setActiveTab('indents')}
          >
            Indents and Spacing
          </button>
          <button 
            className={`px-3 py-1.5 -mb-px border-b-2 ${activeTab === 'breaks' ? 'border-[#2B579A] text-[#2B579A] font-semibold' : 'border-transparent text-[#666] hover:text-[#333]'}`}
            onClick={() => setActiveTab('breaks')}
          >
            Line and Page Breaks
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1">
          {activeTab === 'indents' && (
            <div className="space-y-4">
              {/* General */}
              <div>
                <h3 className="font-semibold text-[#555] mb-2 border-b border-[#E5E5E5] pb-1">General</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-[#666]">Alignment:</label>
                    <select 
                      className="border border-[#CCC] rounded px-2 py-1 flex-1"
                      value={fmt.align || 'left'}
                      onChange={e => handleChange('align', e.target.value)}
                    >
                      <option value="left">Left</option>
                      <option value="center">Centered</option>
                      <option value="right">Right</option>
                      <option value="justify">Justified</option>
                      <option value="distributed">Distributed</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-[#666]">Outline level:</label>
                    <select className="border border-[#CCC] rounded px-2 py-1 flex-1" disabled>
                      <option>Body Text</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Indentation */}
              <div>
                <h3 className="font-semibold text-[#555] mb-2 border-b border-[#E5E5E5] pb-1">Indentation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-16 text-[#666]">Left:</label>
                      <input 
                        type="number" step="10" className="border border-[#CCC] rounded px-2 py-1 w-20"
                        value={fmt.leftIndent || 0}
                        onChange={e => handleChange('leftIndent', Number(e.target.value))}
                      />
                      <span className="text-[#666]">px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-16 text-[#666]">Right:</label>
                      <input 
                        type="number" step="10" className="border border-[#CCC] rounded px-2 py-1 w-20"
                        value={fmt.rightIndent || 0}
                        onChange={e => handleChange('rightIndent', Number(e.target.value))}
                      />
                      <span className="text-[#666]">px</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-16 text-[#666]">Special:</label>
                      <select 
                        className="border border-[#CCC] rounded px-2 py-1 flex-1"
                        value={fmt.hangingIndent ? 'hanging' : (fmt.firstLineIndent ? 'firstLine' : 'none')}
                        onChange={e => {
                          const v = e.target.value;
                          const w = 48;
                          handleChange('firstLineIndent', v === 'firstLine' ? w : undefined);
                          handleChange('hangingIndent', v === 'hanging' ? w : undefined);
                        }}
                      >
                        <option value="none">(none)</option>
                        <option value="firstLine">First line</option>
                        <option value="hanging">Hanging</option>
                      </select>
                    </div>
                    {(fmt.firstLineIndent || fmt.hangingIndent) && (
                      <div className="flex items-center gap-2">
                        <label className="w-16 text-[#666]">By:</label>
                        <input 
                          type="number" step="10" className="border border-[#CCC] rounded px-2 py-1 w-20"
                          value={fmt.firstLineIndent || fmt.hangingIndent || 0}
                          onChange={e => {
                            if (fmt.firstLineIndent) handleChange('firstLineIndent', Number(e.target.value));
                            if (fmt.hangingIndent) handleChange('hangingIndent', Number(e.target.value));
                          }}
                        />
                        <span className="text-[#666]">px</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <h3 className="font-semibold text-[#555] mb-2 border-b border-[#E5E5E5] pb-1">Spacing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-16 text-[#666]">Before:</label>
                      <input 
                        type="number" step="6" className="border border-[#CCC] rounded px-2 py-1 w-20"
                        value={fmt.spaceBefore || 0}
                        onChange={e => handleChange('spaceBefore', Number(e.target.value))}
                      />
                      <span className="text-[#666]">px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-16 text-[#666]">After:</label>
                      <input 
                        type="number" step="6" className="border border-[#CCC] rounded px-2 py-1 w-20"
                        value={fmt.spaceAfter || 0}
                        onChange={e => handleChange('spaceAfter', Number(e.target.value))}
                      />
                      <span className="text-[#666]">px</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-20 text-[#666]">Line spacing:</label>
                      <select 
                        className="border border-[#CCC] rounded px-2 py-1 flex-1"
                        value={fmt.lineSpacing || 1.0}
                        onChange={e => handleChange('lineSpacing', Number(e.target.value))}
                      >
                        <option value={1.0}>Single</option>
                        <option value={1.15}>1.15 lines</option>
                        <option value={1.5}>1.5 lines</option>
                        <option value={2.0}>Double</option>
                        <option value={2.5}>2.5 lines</option>
                        <option value={3.0}>3.0 lines</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breaks' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#555] mb-2 border-b border-[#E5E5E5] pb-1">Pagination</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="rounded text-[#2B579A] focus:ring-[#2B579A]" />
                    <span>Widow/Orphan control</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!fmt.keepNext}
                      onChange={e => handleChange('keepNext', e.target.checked ? true : undefined)}
                      className="rounded text-[#2B579A] focus:ring-[#2B579A]" 
                    />
                    <span>Keep with next</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!fmt.keepTogether}
                      onChange={e => handleChange('keepTogether', e.target.checked ? true : undefined)}
                      className="rounded text-[#2B579A] focus:ring-[#2B579A]" 
                    />
                    <span>Keep lines together</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!fmt.pageBreak}
                      onChange={e => handleChange('pageBreak', e.target.checked ? true : undefined)}
                      className="rounded text-[#2B579A] focus:ring-[#2B579A]" 
                    />
                    <span>Page break before</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F3F3F3] border-t border-[#E5E5E5] rounded-b-md">
          <button className="px-4 py-1 border border-[#CCC] rounded bg-white hover:bg-[#F9F9F9] text-[#333]">Tabs...</button>
          <div className="flex gap-2">
            <button onClick={handleOk} className="px-6 py-1 bg-[#2B579A] text-white rounded hover:bg-[#1A3B6C]">OK</button>
            <button onClick={handleCancel} className="px-4 py-1 border border-[#CCC] rounded bg-white hover:bg-[#F9F9F9] text-[#333]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
