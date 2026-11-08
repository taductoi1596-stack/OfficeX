import React from 'react';
import { RGroup, RBtn } from '../SharedComponents';
import { CommandDispatcher } from '../CommandDispatcher';

// Inline SVG Icons
const I = {
  Palette: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.5 2 12 2z"/></svg>,
  Save: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Refresh: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Sun: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Briefcase: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Book: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Type: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  AlignLeft: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  Star: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Layers: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>,
  Image: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Square: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
  Box: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Download: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Cpu: (p: any) => <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
};

function d(id: string) {
  return () => CommandDispatcher.dispatch(id);
}

export function DesignRibbonGroups() {
  return (
    <>
      <RGroup label="Themes">
        <RBtn icon={I.Palette} title="Themes Gallery" onCmd={d('WORD.DESIGN.THEME')} />
        <RBtn icon={I.Palette} title="Browse Themes" onCmd={d('WORD.DESIGN.THEME_BROWSE')} />
        <RBtn icon={I.Save} title="Save Current Theme" onCmd={d('WORD.DESIGN.THEME_SAVE')} />
        <RBtn icon={I.Refresh} title="Reset Theme" onCmd={d('WORD.DESIGN.THEME_RESET')} />
        <RBtn icon={I.Briefcase} title="Office Theme" onCmd={d('WORD.DESIGN.THEME_OFFICE')} />
        <RBtn icon={I.Moon} title="Dark Theme" onCmd={d('WORD.DESIGN.THEME_DARK')} />
        <RBtn icon={I.Sun} title="Light Theme" onCmd={d('WORD.DESIGN.THEME_LIGHT')} />
        <RBtn icon={I.Briefcase} title="Corporate Theme" onCmd={d('WORD.DESIGN.THEME_CORPORATE')} />
        <RBtn icon={I.Book} title="Academic Theme" onCmd={d('WORD.DESIGN.THEME_ACADEMIC')} />
        <RBtn icon={I.Briefcase} title="Business Theme" onCmd={d('WORD.DESIGN.THEME_BUSINESS')} />
      </RGroup>

      <RGroup label="Colors">
        <RBtn icon={I.Palette} title="Theme Colors" onCmd={d('WORD.DESIGN.COLORS')} />
        <RBtn icon={I.Palette} title="Accent Colors" onCmd={d('WORD.DESIGN.ACCENT_COLORS')} />
        <RBtn icon={I.Palette} title="Custom Colors" onCmd={d('WORD.DESIGN.CUSTOM_COLORS')} />
        <RBtn icon={I.Refresh} title="Reset Colors" onCmd={d('WORD.DESIGN.RESET_COLORS')} />
      </RGroup>

      <RGroup label="Fonts">
        <RBtn icon={I.Type} title="Theme Fonts" onCmd={d('WORD.DESIGN.FONTS')} />
        <RBtn icon={I.Type} title="Heading Font" onCmd={d('WORD.DESIGN.HEADING_FONT')} />
        <RBtn icon={I.Type} title="Body Font" onCmd={d('WORD.DESIGN.BODY_FONT')} />
        <RBtn icon={I.Type} title="Custom Font Pair" onCmd={d('WORD.DESIGN.FONT_PAIR')} />
        <RBtn icon={I.Refresh} title="Reset Fonts" onCmd={d('WORD.DESIGN.FONT_RESET')} />
      </RGroup>

      <RGroup label="Paragraph Spacing">
        <RBtn icon={I.AlignLeft} title="Compact" onCmd={d('WORD.DESIGN.SPACING_COMPACT')} />
        <RBtn icon={I.AlignLeft} title="Open" onCmd={d('WORD.DESIGN.SPACING_OPEN')} />
        <RBtn icon={I.AlignLeft} title="Relaxed" onCmd={d('WORD.DESIGN.SPACING_RELAXED')} />
        <RBtn icon={I.AlignLeft} title="No Paragraph Space" onCmd={d('WORD.DESIGN.SPACING_NONE')} />
        <RBtn icon={I.AlignLeft} title="Custom Spacing" onCmd={d('WORD.DESIGN.SPACING_CUSTOM')} />
      </RGroup>

      <RGroup label="Effects">
        <RBtn icon={I.Star} title="Shadow" onCmd={d('WORD.DESIGN.SHADOW')} />
        <RBtn icon={I.Star} title="Reflection" onCmd={d('WORD.DESIGN.REFLECTION')} />
        <RBtn icon={I.Star} title="Glow" onCmd={d('WORD.DESIGN.GLOW')} />
        <RBtn icon={I.Star} title="Soft Edge" onCmd={d('WORD.DESIGN.SOFT_EDGE')} />
        <RBtn icon={I.Star} title="Bevel" onCmd={d('WORD.DESIGN.BEVEL')} />
        <RBtn icon={I.Star} title="3D Rotation" onCmd={d('WORD.DESIGN.ROTATION')} />
      </RGroup>

      <RGroup label="Style Set">
        <RBtn icon={I.Layers} title="Modern" onCmd={d('WORD.DESIGN.STYLE_MODERN')} />
        <RBtn icon={I.Layers} title="Classic" onCmd={d('WORD.DESIGN.STYLE_CLASSIC')} />
        <RBtn icon={I.Layers} title="Elegant" onCmd={d('WORD.DESIGN.STYLE_ELEGANT')} />
        <RBtn icon={I.Layers} title="Professional" onCmd={d('WORD.DESIGN.STYLE_PRO')} />
        <RBtn icon={I.Layers} title="Minimal" onCmd={d('WORD.DESIGN.STYLE_MINIMAL')} />
        <RBtn icon={I.Layers} title="Custom Style Set" onCmd={d('WORD.DESIGN.STYLE_CUSTOM')} />
        <RBtn icon={I.Save} title="Save Style Set" onCmd={d('WORD.DESIGN.STYLE_SAVE')} />
      </RGroup>

      <RGroup label="Page Background">
        <RBtn icon={I.Image} title="Background Image" onCmd={d('WORD.DESIGN.BACKGROUND_IMAGE')} />
        <RBtn icon={I.Image} title="Background Texture" onCmd={d('WORD.DESIGN.BACKGROUND_TEXTURE')} />
        <RBtn icon={I.Image} title="Background Pattern" onCmd={d('WORD.DESIGN.BACKGROUND_PATTERN')} />
        <RBtn icon={I.Refresh} title="Remove Background" onCmd={d('WORD.DESIGN.BACKGROUND_REMOVE')} />
      </RGroup>

      <RGroup label="Watermark">
        <RBtn icon={I.Type} title="Confidential" onCmd={d('WORD.DESIGN.WATERMARK')} />
        <RBtn icon={I.Type} title="Draft" onCmd={d('WORD.DESIGN.WATERMARK')} />
        <RBtn icon={I.Type} title="Sample" onCmd={d('WORD.DESIGN.WATERMARK')} />
        <RBtn icon={I.Type} title="Custom Text" onCmd={d('WORD.DESIGN.WATERMARK_TEXT')} />
        <RBtn icon={I.Image} title="Picture Watermark" onCmd={d('WORD.DESIGN.WATERMARK_IMAGE')} />
        <RBtn icon={I.Refresh} title="Remove Watermark" onCmd={d('WORD.DESIGN.WATERMARK_REMOVE')} />
      </RGroup>

      <RGroup label="Page Color">
        <RBtn icon={I.Palette} title="Theme Color" onCmd={d('WORD.DESIGN.PAGE_COLOR')} />
        <RBtn icon={I.Palette} title="Standard Color" onCmd={d('WORD.DESIGN.PAGE_COLOR')} />
        <RBtn icon={I.Palette} title="Gradient" onCmd={d('WORD.DESIGN.PAGE_GRADIENT')} />
        <RBtn icon={I.Palette} title="Texture" onCmd={d('WORD.DESIGN.PAGE_TEXTURE')} />
        <RBtn icon={I.Palette} title="Pattern" onCmd={d('WORD.DESIGN.PAGE_PATTERN')} />
        <RBtn icon={I.Palette} title="Fill Effects" onCmd={d('WORD.DESIGN.PAGE_FILL')} />
        <RBtn icon={I.Refresh} title="No Color" onCmd={d('WORD.DESIGN.PAGE_CLEAR')} />
      </RGroup>

      <RGroup label="Page Borders">
        <RBtn icon={I.Square} title="Border Gallery" onCmd={d('WORD.DESIGN.BORDER')} />
        <RBtn icon={I.Square} title="Box" onCmd={d('WORD.DESIGN.BORDER_BOX')} />
        <RBtn icon={I.Square} title="Shadow" onCmd={d('WORD.DESIGN.BORDER_SHADOW')} />
        <RBtn icon={I.Box} title="3D" onCmd={d('WORD.DESIGN.BORDER_3D')} />
        <RBtn icon={I.Square} title="Custom Border" onCmd={d('WORD.DESIGN.BORDER_CUSTOM')} />
        <RBtn icon={I.Square} title="Border Art" onCmd={d('WORD.DESIGN.BORDER_ART')} />
        <RBtn icon={I.Refresh} title="Remove Border" onCmd={d('WORD.DESIGN.BORDER_REMOVE')} />
      </RGroup>

      <RGroup label="Document Formatting">
        <RBtn icon={I.Type} title="Format Gallery" onCmd={d('WORD.DESIGN.FORMAT')} />
        <RBtn icon={I.Refresh} title="Reset Formatting" onCmd={d('WORD.DESIGN.FORMAT_RESET')} />
        <RBtn icon={I.Download} title="Import Formatting" onCmd={d('WORD.DESIGN.FORMAT_IMPORT')} />
        <RBtn icon={I.Upload} title="Export Formatting" onCmd={d('WORD.DESIGN.FORMAT_EXPORT')} />
      </RGroup>

      <RGroup label="AI Design">
        <RBtn icon={I.Cpu} title="Suggest Theme" onCmd={d('WORD.AI.DESIGN_THEME')} />
        <RBtn icon={I.Cpu} title="Improve Formatting" onCmd={d('WORD.AI.DESIGN_FORMAT')} />
        <RBtn icon={I.Cpu} title="Modernize Document" onCmd={d('WORD.AI.DESIGN_MODERN')} />
        <RBtn icon={I.Cpu} title="Corporate Style" onCmd={d('WORD.AI.DESIGN_CORPORATE')} />
        <RBtn icon={I.Cpu} title="Academic Style" onCmd={d('WORD.AI.DESIGN_ACADEMIC')} />
        <RBtn icon={I.Cpu} title="Accessibility Check" onCmd={d('WORD.AI.DESIGN_ACCESSIBILITY')} />
        <RBtn icon={I.Cpu} title="Generate Cover" onCmd={d('WORD.AI.DESIGN_COVER')} />
      </RGroup>
    </>
  );
}
