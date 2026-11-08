import React, { useState, useEffect } from 'react'
import { AlertCircle, FileText, Check, Trash2 } from 'lucide-react'

interface RecoveryItem {
  id: string;
  appName: string;
  fileName: string;
  timestamp: number;
}

export function App() {
  const [items, setItems] = useState<RecoveryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((window as any).electronAPI?.getRecoveryItems) {
      (window as any).electronAPI.getRecoveryItems().then((res: RecoveryItem[]) => {
        setItems(res);
        setLoading(false);
      });
    } else {
      // Mock data
      setTimeout(() => {
        setItems([
          { id: '1', appName: 'Word', fileName: 'Q3_Report_Draft.docx', timestamp: Date.now() - 3600000 },
          { id: '2', appName: 'Excel', fileName: 'Budget_2027.xlsx', timestamp: Date.now() - 1800000 }
        ]);
        setLoading(false);
      }, 500);
    }
  }, []);

  const handleResolve = (action: 'recover' | 'discard') => {
    if ((window as any).electronAPI?.resolveRecovery) {
      (window as any).electronAPI.resolveRecovery(action);
    } else {
      alert(Mock:  all items);
      window.close();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-white font-sans relative" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex flex-col items-center justify-center p-8 border-b border-zinc-800">
        <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-2xl font-bold">Recovery Center</h1>
        <p className="text-zinc-400 mt-2 text-center">OfficeX closed unexpectedly. We saved the following files for you.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {loading ? (
          <div className="text-center text-zinc-500 mt-10">Scanning recovery data...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10">No files to recover.</div>
        ) : items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center gap-4 hover:border-zinc-700 transition-colors">
            <div className="text-blue-400"><FileText size={24} /></div>
            <div className="flex-1">
              <h3 className="font-medium">{item.fileName}</h3>
              <p className="text-sm text-zinc-500">{item.appName} • {new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-950" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
          onClick={() => handleResolve('discard')}
          className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} /> Discard
        </button>
        <button 
          onClick={() => handleResolve('recover')}
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Check size={16} /> Recover All
        </button>
      </div>
    </div>
  )
}
