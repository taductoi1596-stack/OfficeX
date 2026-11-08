import React, { useState } from 'react';
import { Dialog } from '@officex/ui';

interface SmartArtGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (type: string, subType: string) => void;
}

const CATEGORIES = ['All', 'List', 'Process', 'Cycle', 'Hierarchy', 'Relationship', 'Matrix', 'Pyramid', 'Picture'];

export const SmartArtGalleryModal: React.FC<SmartArtGalleryModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [activeCategory, setActiveCategory] = useState('Hierarchy');
  const [selectedLayout, setSelectedLayout] = useState<{type: string, subType: string, name: string} | null>(null);

  const layouts = [
    { type: 'hierarchy', subType: 'orgchart', name: 'Organization Chart' },
    { type: 'hierarchy', subType: 'horizontal', name: 'Horizontal Hierarchy' },
    { type: 'cycle', subType: 'basic', name: 'Basic Cycle' },
    { type: 'list', subType: 'basic', name: 'Basic List' },
    { type: 'process', subType: 'basic', name: 'Basic Process' },
  ];

  const filteredLayouts = layouts.filter(l => activeCategory === 'All' || l.type.toLowerCase() === activeCategory.toLowerCase());

  const handleConfirm = () => {
    if (selectedLayout) {
      onInsert(selectedLayout.type, selectedLayout.subType);
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Choose a SmartArt Graphic" className="max-w-4xl h-[600px] flex flex-col p-0">
      <div className="flex flex-1 overflow-hidden h-[500px]">
        {/* Left Sidebar */}
        <div className="w-48 border-r border-slate-200 overflow-y-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`w-full text-left px-4 py-2 text-sm ${activeCategory === cat ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-slate-100'}`}
              onClick={() => { setActiveCategory(cat); setSelectedLayout(null); }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Main Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-4 gap-4 content-start">
          {filteredLayouts.map(l => (
            <div 
              key={`${l.type}-${l.subType}`}
              className={`border rounded p-2 cursor-pointer flex flex-col items-center gap-2 ${selectedLayout?.subType === l.subType ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}`}
              onClick={() => setSelectedLayout(l)}
              onDoubleClick={() => { setSelectedLayout(l); onInsert(l.type, l.subType); onClose(); }}
            >
              <div className="w-full h-24 bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                <span className="text-[10px] text-slate-400 text-center px-1">{l.name}</span>
              </div>
            </div>
          ))}
          {filteredLayouts.length === 0 && (
            <div className="col-span-4 text-center text-slate-500 py-10">
              No layouts available in this category yet.
            </div>
          )}
        </div>
        
        {/* Right Info Pane */}
        <div className="w-64 border-l border-slate-200 p-4 bg-slate-50 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-800">{selectedLayout ? selectedLayout.name : 'SmartArt Information'}</h3>
          <p className="text-sm text-slate-600">
            {selectedLayout ? `Use the ${selectedLayout.name} to show hierarchical information or reporting relationships.` : 'Select a layout to see a larger preview and a description of how to use it.'}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 p-4 flex justify-end gap-2 shrink-0 bg-white">
        <button onClick={onClose} className="px-4 py-1.5 border border-slate-300 rounded text-sm hover:bg-slate-50">Cancel</button>
        <button 
          onClick={handleConfirm}
          disabled={!selectedLayout}
          className={`px-4 py-1.5 rounded text-sm text-white ${selectedLayout ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
        >
          OK
        </button>
      </div>
    </Dialog>
  );
};
