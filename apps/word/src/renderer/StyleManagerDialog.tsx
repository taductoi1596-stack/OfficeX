import React, { useState, useMemo } from 'react';
import { StyleEngine, StyleDef } from './StyleEngine';
import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';

export function StyleManagerDialog({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('Edit');
  const tabs = ['Edit', 'Recommend', 'Restrict', 'Set Defaults', 'Import/Export', 'Statistics', 'Advanced'];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-5xl flex flex-col overflow-hidden text-sm text-[#333]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-[#E5E5E5] bg-[#F3F3F3]">
            <h2 className="font-semibold text-base text-[#2B579A]">Manage Styles</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-[#EAEAEA] rounded transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-48 border-r border-[#E5E5E5] bg-[#F9F9F9] flex flex-col p-2 gap-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`text-left px-3 py-2 rounded text-[12px] font-medium transition-colors
                    ${activeTab === tab ? 'bg-[#E5F3FF] text-[#0066CC]' : 'hover:bg-[#EAEAEA] text-[#555]'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-4 bg-white relative">
              {activeTab === 'Edit' && <EditTab onClose={onClose} />}
              {activeTab !== 'Edit' && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{activeTab} Configuration</p>
                    <p className="text-xs mt-2">Under construction. Interface will be wired in next phase.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EditTab({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('Normal');
  const [stylesList, setStylesList] = useState<StyleDef[]>(StyleEngine.getStylesList());

  const exec = CommandDispatcher.dispatch.bind(CommandDispatcher);
  
  const filteredStyles = useMemo(() => {
    let list = stylesList;
    if (search) list = StyleEngine.searchStyles(search);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, stylesList]);

  const activeStyle = stylesList.find(s => s.id === selectedId) || stylesList[0];

  const handleUpdateStyle = (updates: Partial<StyleDef>) => {
    StyleEngine.updateStyle(selectedId, updates);
    // Refresh local list
    setStylesList(StyleEngine.getStylesList());
    
    // Force refresh in editor by reapplying style to selection
    // In real app, we might fire a global REFRESH event
    exec('WORD.STYLEMANAGER.REFRESH'); 
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left: Style List */}
      <div className="w-64 border border-[#E5E5E5] rounded flex flex-col">
        <div className="p-2 border-b border-[#E5E5E5] bg-[#F9F9F9]">
          <input 
            type="text" 
            placeholder="Search style..." 
            className="w-full px-2 py-1 text-xs border border-[#C6C6C6] rounded outline-none focus:border-[#2B579A]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredStyles.map(s => (
            <div 
              key={s.id} 
              className={`px-3 py-1.5 text-xs cursor-pointer ${selectedId === s.id ? 'bg-[#0078D4] text-white' : 'hover:bg-[#F3F2F1]'}`}
              onClick={() => setSelectedId(s.id)}
            >
              {s.name}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-[#E5E5E5] flex gap-2">
          <button className="flex-1 py-1 text-xs bg-[#EAEAEA] hover:bg-[#D4D4D4] rounded">New</button>
          <button 
            className={`flex-1 py-1 text-xs rounded ${activeStyle?.category === 'Custom' ? 'bg-[#EAEAEA] hover:bg-[#D4D4D4]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            disabled={activeStyle?.category !== 'Custom'}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Right: Properties Form */}
      <div className="flex-1 overflow-y-auto pr-4 pb-12">
        {activeStyle ? (
          <div className="flex flex-col gap-5">
            {/* Header Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Style Name:</label>
                <input 
                  type="text" 
                  value={activeStyle.name} 
                  onChange={e => handleUpdateStyle({ name: e.target.value })}
                  className="px-2 py-1.5 text-sm border border-[#C6C6C6] rounded outline-none focus:border-[#2B579A]"
                  disabled={activeStyle.category === 'Builtin'}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Style Type:</label>
                <select 
                  value={activeStyle.type}
                  onChange={e => handleUpdateStyle({ type: e.target.value as any })}
                  className="px-2 py-1.5 text-sm border border-[#C6C6C6] rounded outline-none"
                  disabled={activeStyle.category === 'Builtin'}
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="character">Character</option>
                  <option value="linked">Linked (Paragraph and Character)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Style based on:</label>
                <select 
                  value={activeStyle.basedOn || ''}
                  onChange={e => handleUpdateStyle({ basedOn: e.target.value || undefined })}
                  className="px-2 py-1.5 text-sm border border-[#C6C6C6] rounded outline-none"
                >
                  <option value="">(no style)</option>
                  {stylesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Style for following paragraph:</label>
                <select 
                  value={activeStyle.nextStyle || ''}
                  onChange={e => handleUpdateStyle({ nextStyle: e.target.value || undefined })}
                  className="px-2 py-1.5 text-sm border border-[#C6C6C6] rounded outline-none"
                >
                  <option value="">(same style)</option>
                  {stylesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Formatter */}
            <div className="border border-[#E5E5E5] rounded p-4 bg-[#FAFAFA] flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-slate-600 mb-2">Formatting</h3>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2 border border-[#C6C6C6] bg-white p-1 rounded">
                <select 
                  value={activeStyle.runFmt?.fontFamily || 'Calibri'}
                  onChange={e => handleUpdateStyle({ runFmt: { fontFamily: e.target.value } })}
                  className="px-2 py-1 text-xs border border-transparent hover:border-[#C6C6C6] rounded outline-none w-32"
                >
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
                <input 
                  type="number" 
                  value={activeStyle.runFmt?.fontSize || 11}
                  onChange={e => handleUpdateStyle({ runFmt: { fontSize: Number(e.target.value) } })}
                  className="w-12 px-1 py-1 text-xs border border-transparent hover:border-[#C6C6C6] rounded outline-none text-center"
                />
                <div className="w-[1px] h-4 bg-[#E5E5E5] mx-1" />
                <button 
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold ${activeStyle.runFmt?.bold ? 'bg-[#CDE6F7]' : 'hover:bg-[#EAEAEA]'}`}
                  onClick={() => handleUpdateStyle({ runFmt: { bold: !activeStyle.runFmt?.bold } })}
                >B</button>
                <button 
                  className={`w-6 h-6 rounded flex items-center justify-center italic ${activeStyle.runFmt?.italic ? 'bg-[#CDE6F7]' : 'hover:bg-[#EAEAEA]'}`}
                  onClick={() => handleUpdateStyle({ runFmt: { italic: !activeStyle.runFmt?.italic } })}
                >I</button>
                <button 
                  className={`w-6 h-6 rounded flex items-center justify-center underline ${activeStyle.runFmt?.underline ? 'bg-[#CDE6F7]' : 'hover:bg-[#EAEAEA]'}`}
                  onClick={() => handleUpdateStyle({ runFmt: { underline: !activeStyle.runFmt?.underline } })}
                >U</button>
                <div className="w-[1px] h-4 bg-[#E5E5E5] mx-1" />
                <input 
                  type="color" 
                  value={activeStyle.runFmt?.color || '#000000'}
                  onChange={e => handleUpdateStyle({ runFmt: { color: e.target.value } })}
                  className="w-6 h-6 p-0 border-0 outline-none cursor-pointer"
                />
                <div className="w-[1px] h-4 bg-[#E5E5E5] mx-1" />
                <select 
                  value={activeStyle.paraFmt?.align || 'left'}
                  onChange={e => handleUpdateStyle({ paraFmt: { align: e.target.value } })}
                  className="px-2 py-1 text-xs border border-transparent hover:border-[#C6C6C6] rounded outline-none"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>

              {/* Preview */}
              <div className="border border-[#C6C6C6] bg-white h-32 flex items-center justify-center p-4 overflow-hidden relative">
                <div 
                  className="max-w-[400px] w-full border border-dashed border-[#E5E5E5] p-2 leading-tight"
                  style={{
                    fontFamily: activeStyle.runFmt?.fontFamily || 'Calibri',
                    fontSize: activeStyle.runFmt?.fontSize || 11,
                    fontWeight: activeStyle.runFmt?.bold ? 'bold' : 'normal',
                    fontStyle: activeStyle.runFmt?.italic ? 'italic' : 'normal',
                    textDecoration: activeStyle.runFmt?.underline ? 'underline' : 'none',
                    color: activeStyle.runFmt?.color || '#000000',
                    textAlign: activeStyle.paraFmt?.align || 'left'
                  }}
                >
                  Previous Paragraph Previous Paragraph Previous Paragraph.
                  <br />
                  <span className="bg-[#FFFFCC]">Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text.</span>
                  <br />
                  Following Paragraph Following Paragraph Following Paragraph.
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={activeStyle.quickStyle} 
                  onChange={e => handleUpdateStyle({ quickStyle: e.target.checked })}
                />
                <span className="text-xs">Add to the Styles gallery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={activeStyle.isPinned} 
                  onChange={e => handleUpdateStyle({ isPinned: e.target.checked })}
                />
                <span className="text-xs">Pin to Top</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">Select a style to edit</div>
        )}

        <div className="absolute bottom-4 right-4 flex gap-2 bg-white pt-2">
          <button className="px-6 py-1.5 bg-[#0078D4] text-white rounded hover:bg-[#005A9E] font-semibold" onClick={onClose}>OK</button>
          <button className="px-6 py-1.5 bg-[#F3F2F1] text-[#333] border border-[#C6C6C6] rounded hover:bg-[#EAEAEA]" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
