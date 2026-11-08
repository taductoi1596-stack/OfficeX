import React, { useState, useMemo } from 'react';
import { RewriteDiffEngine, DiffGranularity, TextDiffHunk } from '../../ai/diff/RewriteDiffEngine';

export interface DiffViewerProps {
  originalText: string;
  rewrittenText: string;
}

export function DiffViewer({ originalText, rewrittenText }: DiffViewerProps) {
  const [mode, setMode] = useState<'inline' | 'side-by-side'>('inline');
  const [granularity, setGranularity] = useState<DiffGranularity>('word');

  const hunks = useMemo(() => {
    return RewriteDiffEngine.compare(originalText, rewrittenText, granularity);
  }, [originalText, rewrittenText, granularity]);

  const stats = useMemo(() => {
    return RewriteDiffEngine.computeStatistics(hunks);
  }, [hunks]);

  const renderInline = () => {
    return (
      <div className="p-3 bg-white border border-[#E1DFDD] rounded h-[240px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed shadow-inner font-segoe">
        {hunks.map((hunk, i) => {
          if (hunk.operation === 'insert') {
            return <ins key={i} className="bg-[#DFF6DD] text-[#107C41] no-underline px-0.5 rounded mr-[1px]">{hunk.text}</ins>;
          }
          if (hunk.operation === 'delete') {
            return <del key={i} className="bg-[#FDE7E9] text-[#A80000] px-0.5 rounded mr-[1px] line-through opacity-75">{hunk.text}</del>;
          }
          return <span key={i}>{hunk.text}</span>;
        })}
      </div>
    );
  };

  const renderSideBySide = () => {
    // For side-by-side, we align the text in two separate blocks.
    // To keep it simple in HTML without a complex virtualized grid, we render them side-by-side.
    // Insertions appear on the right, Deletions on the left.
    return (
      <div className="flex gap-2 h-[240px]">
        {/* Left Pane: Original */}
        <div className="flex-1 p-3 bg-white border border-[#E1DFDD] rounded overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed shadow-inner font-segoe">
          {hunks.map((hunk, i) => {
            if (hunk.operation === 'delete') {
              return <span key={i} className="bg-[#FDE7E9] text-[#A80000] px-0.5 rounded mr-[1px]">{hunk.text}</span>;
            }
            if (hunk.operation === 'equal') {
              return <span key={i}>{hunk.text}</span>;
            }
            return null; // Don't show insertions on the left
          })}
        </div>
        
        {/* Right Pane: Rewrite */}
        <div className="flex-1 p-3 bg-white border border-[#E1DFDD] rounded overflow-y-auto whitespace-pre-wrap text-[13px] leading-relaxed shadow-inner font-segoe">
          {hunks.map((hunk, i) => {
            if (hunk.operation === 'insert') {
              return <span key={i} className="bg-[#DFF6DD] text-[#107C41] px-0.5 rounded mr-[1px]">{hunk.text}</span>;
            }
            if (hunk.operation === 'equal') {
              return <span key={i}>{hunk.text}</span>;
            }
            return null; // Don't show deletions on the right
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold uppercase">
        <div className="flex gap-2">
          <button 
            className={`px-2 py-1 rounded transition-colors ${mode === 'inline' ? 'bg-[#2B579A] text-white' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
            onClick={() => setMode('inline')}
          >
            Inline
          </button>
          <button 
            className={`px-2 py-1 rounded transition-colors ${mode === 'side-by-side' ? 'bg-[#2B579A] text-white' : 'bg-[#F3F2F1] hover:bg-[#E1DFDD]'}`}
            onClick={() => setMode('side-by-side')}
          >
            Side-by-Side
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="p-1 border border-[#C6C6C6] rounded focus:outline-none bg-white font-normal capitalize"
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as DiffGranularity)}
          >
            <option value="character">Character Diff</option>
            <option value="word">Word Diff</option>
            <option value="sentence">Sentence Diff</option>
            <option value="paragraph">Paragraph Diff</option>
          </select>
        </div>
      </div>

      {mode === 'inline' ? renderInline() : renderSideBySide()}

      {/* Statistics */}
      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 px-1">
        <div className="flex gap-4">
          <span className="text-[#107C41]">+{stats.wordsAdded} Words Added</span>
          <span className="text-[#A80000]">-{stats.wordsRemoved} Words Removed</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#107C41]">+{stats.charsAdded} Chars</span>
          <span className="text-[#A80000]">-{stats.charsRemoved} Chars</span>
        </div>
      </div>
    </div>
  );
}
