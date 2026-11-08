import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import { CommandDispatcher } from '../CommandDispatcher';

// Inline SVG Icons
const I = {
  Pen: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  Highlighter: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12l5.66-5.66 8.94 8.94z"/><path d="M12.93 19.07L16 22h4.5l-4.5-4.5"/><path d="M18.83 5.17l-3.53 3.54"/></svg>,
  Eraser: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 13"/><path d="M17.5 15.5L10 8"/></svg>,
  Pointer: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>,
  Zap: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Menu: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Copy: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Plus: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Maximize: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Minimize: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>,
  Video: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Pause: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  StopCircle: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>,
  Grid: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Layout: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Image: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Cpu: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Share: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
};

function d(id: string) {
  return () => CommandDispatcher.dispatch(id);
}

export function DrawRibbonGroups() {
  return (
    <>
      <RGroup label="Pens">
        <RBtn icon={I.Pen} title="Pen" onCmd={d('WORD.DRAW.PEN')} />
        <RBtn icon={I.Pen} title="Ballpoint Pen" onCmd={d('WORD.DRAW.BALLPOINT')} />
        <RBtn icon={I.Pen} title="Pencil" onCmd={d('WORD.DRAW.PENCIL')} />
        <RBtn icon={I.Pen} title="Calligraphy Pen" onCmd={d('WORD.DRAW.CALLIGRAPHY')} />
        <RBtn icon={I.Pen} title="Marker" onCmd={d('WORD.DRAW.MARKER')} />
        <RBtn icon={I.Pen} title="Brush" onCmd={d('WORD.DRAW.BRUSH')} />
        <RBtn icon={I.Pen} title="Custom Pen" onCmd={d('WORD.DRAW.CUSTOM')} />
        <RBtn icon={I.Zap} title="Favorites" onCmd={d('WORD.DRAW.FAVORITE')} />
      </RGroup>

      <RGroup label="Highlighter">
        <RBtn icon={I.Highlighter} title="Highlighter" onCmd={d('WORD.DRAW.HIGHLIGHT')} />
        <RBtn icon={I.Highlighter} title="Color" onCmd={d('WORD.DRAW.HIGHLIGHT_COLOR')} />
      </RGroup>

      <RGroup label="Eraser">
        <RBtn icon={I.Eraser} title="Stroke Eraser" onCmd={d('WORD.DRAW.STROKE_ERASER')} />
        <RBtn icon={I.Eraser} title="Point Eraser" onCmd={d('WORD.DRAW.POINT_ERASER')} />
        <RBtn icon={I.Eraser} title="Object Eraser" onCmd={d('WORD.DRAW.OBJECT_ERASER')} />
        <RBtn icon={I.Eraser} title="Clear Ink" onCmd={d('WORD.DRAW.CLEAR')} />
      </RGroup>

      <RGroup label="Lasso">
        <RBtn icon={I.Pointer} title="Lasso Select" onCmd={d('WORD.DRAW.LASSO')} />
        <RBtn icon={I.Pointer} title="Rectangle Select" onCmd={d('WORD.DRAW.RECT_SELECT')} />
        <RBtn icon={I.Pointer} title="Free Select" onCmd={d('WORD.DRAW.FREE_SELECT')} />
      </RGroup>

      <RGroup label="Ink Tools">
        <RBtn icon={I.Menu} title="Undo Stroke" onCmd={d('WORD.DRAW.UNDO')} />
        <RBtn icon={I.Menu} title="Redo Stroke" onCmd={d('WORD.DRAW.REDO')} />
        <RBtn icon={I.Copy} title="Duplicate Ink" onCmd={d('WORD.DRAW.DUPLICATE')} />
        <RBtn icon={I.Eraser} title="Delete Ink" onCmd={d('WORD.DRAW.DELETE')} />
        <RBtn icon={I.Share} title="Group Ink" onCmd={d('WORD.DRAW.GROUP')} />
        <RBtn icon={I.Share} title="Ungroup Ink" onCmd={d('WORD.DRAW.UNGROUP')} />
        <RBtn icon={I.Maximize} title="Bring Forward" onCmd={d('WORD.DRAW.FRONT')} />
        <RBtn icon={I.Minimize} title="Send Backward" onCmd={d('WORD.DRAW.BACK')} />
      </RGroup>

      <RGroup label="Ink To Shape">
        <RBtn icon={I.Layout} title="Convert Shape" onCmd={d('WORD.DRAW.INK_TO_SHAPE')} />
        <RBtn icon={I.Zap} title="Recognize Shape" onCmd={d('WORD.DRAW.SHAPE_RECOGNITION')} />
        <RBtn icon={I.Zap} title="Auto Correct Shape" onCmd={d('WORD.DRAW.SHAPE_AUTOCORRECT')} />
      </RGroup>

      <RGroup label="Ink To Text">
        <RBtn icon={I.Pen} title="Convert Text" onCmd={d('WORD.DRAW.INK_TO_TEXT')} />
        <RBtn icon={I.Zap} title="Recognize Handwriting" onCmd={d('WORD.DRAW.HANDWRITING')} />
        <RBtn icon={I.Menu} title="Language" onCmd={d('WORD.DRAW.LANGUAGE')} />
      </RGroup>

      <RGroup label="Ink To Math">
        <RBtn icon={I.Plus} title="Convert Equation" onCmd={d('WORD.DRAW.INK_TO_MATH')} />
        <RBtn icon={I.Zap} title="Recognize Formula" onCmd={d('WORD.DRAW.FORMULA')} />
        <RBtn icon={I.Menu} title="Math Editor" onCmd={d('WORD.DRAW.MATH_EDITOR')} />
      </RGroup>

      <RGroup label="Ink Replay">
        <RBtn icon={I.Video} title="Replay" onCmd={d('WORD.DRAW.REPLAY')} />
        <RBtn icon={I.Pause} title="Pause" onCmd={d('WORD.DRAW.REPLAY_PAUSE')} />
        <RBtn icon={I.StopCircle} title="Stop" onCmd={d('WORD.DRAW.REPLAY_STOP')} />
        <RBtn icon={I.Menu} title="Speed" onCmd={d('WORD.DRAW.REPLAY_SPEED')} />
      </RGroup>

      <RGroup label="Ruler">
        <RBtn icon={I.Menu} title="Show Ruler" onCmd={d('WORD.DRAW.RULER')} />
        <RBtn icon={I.Menu} title="Rotate" onCmd={d('WORD.DRAW.RULER_ROTATE')} />
        <RBtn icon={I.Menu} title="Snap" onCmd={d('WORD.DRAW.RULER_SNAP')} />
      </RGroup>

      <RGroup label="Canvas">
        <RBtn icon={I.Layout} title="New Canvas" onCmd={d('WORD.DRAW.CANVAS_NEW')} />
        <RBtn icon={I.Layout} title="Resize Canvas" onCmd={d('WORD.DRAW.CANVAS_RESIZE')} />
        <RBtn icon={I.Image} title="Background" onCmd={d('WORD.DRAW.CANVAS_BACKGROUND')} />
        <RBtn icon={I.Grid} title="Grid" onCmd={d('WORD.DRAW.CANVAS_GRID')} />
        <RBtn icon={I.Grid} title="Guides" onCmd={d('WORD.DRAW.CANVAS_GUIDES')} />
      </RGroup>

      <RGroup label="AI Ink">
        <RBtn icon={I.Cpu} title="Beautify Ink" onCmd={d('WORD.AI.INK_BEAUTIFY')} />
        <RBtn icon={I.Cpu} title="Clean Handwriting" onCmd={d('WORD.AI.INK_CLEAN')} />
        <RBtn icon={I.Cpu} title="Convert Sketch" onCmd={d('WORD.AI.INK_SKETCH')} />
        <RBtn icon={I.Cpu} title="Generate Diagram" onCmd={d('WORD.AI.INK_DIAGRAM')} />
        <RBtn icon={I.Cpu} title="Generate Shape" onCmd={d('WORD.AI.INK_SHAPE')} />
        <RBtn icon={I.Cpu} title="Explain Drawing" onCmd={d('WORD.AI.INK_EXPLAIN')} />
      </RGroup>
    </>
  );
}
