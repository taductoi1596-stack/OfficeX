import React, { useState, useEffect } from 'react'
import { DownloadCloud, CheckCircle2, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function App() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Checking for updates...');

  useEffect(() => {
    // Listen to IPC updates
    if ((window as any).electronAPI) {
      (window as any).electronAPI.onUpdateProgress((event: any, data: any) => {
        setProgress(data.progress);
        setStatus(data.status);
      });
    } else {
      // Mock progress for dev
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('Update Complete! Restarting...');
            return 100;
          }
          setStatus('Downloading update...');
          return p + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-900 text-white font-sans overflow-hidden relative" style={{ WebkitAppRegion: 'drag' } as any}>
      <button 
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        style={{ WebkitAppRegion: 'no-drag' } as any}
        onClick={() => (window as any).electronAPI?.close()}
      >
        <X size={20} />
      </button>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-6 w-full max-w-md px-8"
      >
        <div className="p-4 bg-blue-500/20 text-blue-400 rounded-full">
          {progress >= 100 ? <CheckCircle2 size={48} className="text-green-400"/> : <DownloadCloud size={48} />}
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">OfficeX Updater</h1>
          <p className="text-zinc-400">{status}</p>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden mt-4">
          <motion.div 
            className="bg-blue-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: ${progress}% }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>
        
        <div className="text-sm font-medium text-zinc-500">{Math.round(progress)}%</div>
      </motion.div>
    </div>
  )
}
