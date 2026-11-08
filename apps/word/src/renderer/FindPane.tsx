import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useEngines } from './EngineContext';
import { FindEngine, SearchResult } from './FindEngine';
import { EditorAPI } from './editorApi';
import { paraText } from './document/DocumentEngine';
import type { DocModel } from './document/DocumentTypes';

export function FindPane({ onClose }: { onClose: () => void }) {
  const { documentRoot } = useEngines() as any;
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Headings');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
      } else {
        const res = FindEngine.searchAll(documentRoot, query, false);
        setResults(res);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query, documentRoot]);

  // Handle Result Click -> Navigate
  const handleResultClick = (res: SearchResult) => {
    const api = EditorAPI.getLegacy();
    if (api) {
      // Set selection and scroll into view (if editor supports it)
      api.setSelection(res.paraId, res.matchStart, res.matchStart + res.matchLength);
      // Let's force focus the editor element as well
      const editorEl = document.getElementById('canvas-editor-container');
      if (editorEl) editorEl.focus();
    }
  };

  const tabs = ['Headings', 'Pages', 'Results'];

  return (
    <div className="w-80 bg-[#F3F3F3] border-l border-r border-[#C6C6C6] flex flex-col shadow-[-2px_0_5px_rgba(0,0,0,0.05)] text-[12px] text-[#333] select-none h-full z-[100]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 pl-4 border-b border-[#E5E5E5]">
        <div className="font-semibold text-sm">Navigation</div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center hover:bg-[#EAEAEA] rounded">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 bg-white border-b border-[#E5E5E5]">
        <div className="relative flex items-center">
          <input 
            ref={inputRef}
            type="text"
            className="w-full pl-8 pr-8 py-1.5 border border-[#C6C6C6] rounded hover:border-[#999] focus:border-[#2B579A] focus:outline-none placeholder:text-slate-400"
            placeholder="Search document"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute left-2.5 text-slate-400">🔍</span>
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-2.5 w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5E5] bg-[#F9F9F9]">
        {tabs.map(t => (
          <div 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 text-center py-2 cursor-pointer transition-colors ${activeTab === t ? 'border-b-2 border-[#2B579A] text-[#2B579A] font-semibold bg-white' : 'hover:bg-[#EAEAEA] text-slate-600'}`}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Results Body */}
      <div className="flex-1 overflow-y-auto bg-white p-2">
        {activeTab === 'Headings' && (
          <HeadingsTree documentRoot={documentRoot} searchQuery={query} />
        )}
        
        {activeTab === 'Pages' && (
          <PagesThumbnails documentRoot={documentRoot} />
        )}

        {activeTab === 'Results' && (
          <div>
            {query.trim() === '' ? (
              <div className="text-slate-500 italic p-2 text-center text-[11px]">Enter text to search.</div>
            ) : results.length === 0 ? (
              <div className="text-slate-500 italic p-2 text-center text-[11px]">No matches found.</div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 uppercase">{results.length} results</div>
                {results.map((res, i) => {
                  // Split the preview text by the query to highlight it
                  const lowerPreview = res.textPreview.toLowerCase();
                  const lowerQuery = query.toLowerCase();
                  const matchIdx = lowerPreview.indexOf(lowerQuery);
                  
                  let before = res.textPreview;
                  let matchStr = '';
                  let after = '';

                  if (matchIdx !== -1) {
                    before = res.textPreview.substring(0, matchIdx);
                    matchStr = res.textPreview.substring(matchIdx, matchIdx + query.length);
                    after = res.textPreview.substring(matchIdx + query.length);
                  }

                  return (
                    <div 
                      key={`${res.paraId}-${i}`}
                      className="p-2 border border-transparent hover:border-[#C6C6C6] hover:bg-[#F3F2F1] rounded cursor-pointer leading-tight"
                      onClick={() => handleResultClick(res)}
                    >
                      <span>{before}</span>
                      <span className="bg-yellow-200 font-medium text-black">{matchStr}</span>
                      <span>{after}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HEADINGS TREE COMPONENT ───────────────────────────────────────────────
function HeadingsTree({ documentRoot, searchQuery }: { documentRoot: DocModel, searchQuery: string }) {
  // Extract all headings
  const headings = useMemo(() => {
    const list: { id: string, text: string, level: number }[] = [];
    documentRoot.paras.forEach((para: any) => {
      const styleId = para.fmt?.styleId || '';
      if (styleId.startsWith('Heading ')) {
        const level = parseInt(styleId.replace('Heading ', ''), 10) || 1;
        list.push({ id: para.id, text: paraText(para) || '(No title)', level });
      }
    });
    return list;
  }, [documentRoot]);

  const filtered = useMemo(() => {
    if (!searchQuery) return headings;
    const q = searchQuery.toLowerCase();
    return headings.filter(h => h.text.toLowerCase().includes(q));
  }, [headings, searchQuery]);

  const handleJump = (id: string) => {
    const api = EditorAPI.getLegacy();
    if (api) {
      api.setSelection(id, 0, 0);
      document.getElementById('canvas-editor-container')?.focus();
    }
  };

  if (headings.length === 0) {
    return <div className="text-slate-500 italic p-2 text-center text-[11px]">This document does not contain headings.<br/>To create navigation headings, apply Heading styles from the Home tab.</div>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {filtered.map((h, i) => {
        // Simple indentation math
        const indent = (h.level - 1) * 12;
        return (
          <div 
            key={`${h.id}-${i}`}
            className="py-1 px-2 hover:bg-[#F3F2F1] cursor-pointer text-[#333] rounded truncate"
            style={{ paddingLeft: `${indent + 8}px` }}
            title={h.text}
            onClick={() => handleJump(h.id)}
          >
            {h.text}
          </div>
        );
      })}
    </div>
  );
}

// ─── PAGES THUMBNAILS COMPONENT ────────────────────────────────────────────
function PagesThumbnails({ documentRoot }: { documentRoot: any }) {
  // Since we don't have a real pagination engine, we'll fake pagination
  // by grouping paragraphs. Assume ~30 paragraphs per page.
  const pages = useMemo(() => {
    const pgs = [];
    let pCount = documentRoot.paras.length;
    let pageCount = Math.ceil(pCount / 30);
    if (pageCount === 0) pageCount = 1;

    for (let i = 0; i < pageCount; i++) {
      // Get snippet from first paragraph of the page
      const firstParaIndex = i * 30;
      const firstPara = documentRoot.children[firstParaIndex];
      let snippet = '';
      if (firstPara) snippet = firstPara.getText().substring(0, 100);

      pgs.push({
        pageNumber: i + 1,
        snippet,
        paraId: firstPara ? firstPara.id : documentRoot.children[0]?.id
      });
    }
    return pgs;
  }, [documentRoot]);

  const handleJump = (id: string | undefined) => {
    if (!id) return;
    const api = EditorAPI.getLegacy();
    if (api) {
      api.setSelection(id, 0, 0);
      document.getElementById('canvas-editor-container')?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 bg-[#F3F3F3] min-h-full">
      {pages.map(p => (
        <div key={p.pageNumber} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => handleJump(p.paraId)}>
          <div className="w-32 h-44 bg-white border border-[#C6C6C6] shadow-sm group-hover:border-[#2B579A] group-hover:shadow-md transition-all p-2 overflow-hidden flex flex-col relative">
            <div className="text-[4px] text-slate-300 leading-tight">
              {/* Fake text lines */}
              <div className="h-[2px] bg-slate-200 w-full mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-11/12 mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-full mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-4/5 mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-full mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-full mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-10/12 mb-1"></div>
              <div className="h-[2px] bg-slate-200 w-full mb-1"></div>
            </div>
            <div className="text-[6px] text-slate-400 mt-2 line-clamp-6 leading-tight">
              {p.snippet}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Page {p.pageNumber}</div>
        </div>
      ))}
    </div>
  );
}
