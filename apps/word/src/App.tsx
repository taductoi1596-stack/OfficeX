import React, { useState, useEffect } from 'react'
import { FileText, X, Square, Minus, Moon, Sun } from 'lucide-react'

export function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground font-sans">
      <div className="h-10 w-full flex justify-between items-center px-4 bg-black/5 dark:bg-white/5 backdrop-blur-md" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="font-semibold text-sm opacity-80 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          OfficeX Word
        </div>
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors">
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => (window as any).electronAPI?.minimize()} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"><Minus size={14} /></button>
          <button onClick={() => (window as any).electronAPI?.maximize()} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"><Square size={14} /></button>
          <button onClick={() => (window as any).electronAPI?.close()} className="p-1.5 hover:bg-red-500 hover:text-white rounded-md transition-colors"><X size={14} /></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900">
         <FileText size={64} className="text-blue-500 mb-6" />
         <h1 className="text-3xl font-bold">OfficeX Word Core</h1>
         <p className="text-foreground/60 mt-2">Editor Core Engine is currently starting up...</p>
      </div>
    </div>
  )
}
