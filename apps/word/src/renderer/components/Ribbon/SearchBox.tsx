import React, { useState } from 'react';
import { IconFind } from '@officex/icons';

export function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex items-center bg-white/20 hover:bg-white/30 rounded px-2 py-1 mx-4 w-64 transition-colors" style={{ WebkitAppRegion: 'no-drag' } as any}>
      <IconFind size={12} className="text-white/70 mr-2" />
      <input
        type="text"
        placeholder="Search (Alt+Q)"
        className="bg-transparent border-none outline-none text-xs text-white placeholder-white/50 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
