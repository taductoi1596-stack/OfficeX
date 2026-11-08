/**
 * HomeRibbon.tsx
 *
 * Master wrapper for the complete Home tab ribbon.
 * Per ribbon_home.md — 7 groups in order:
 *   Clipboard | Font | Paragraph | Styles | Editing | Voice | AI
 *
 * APIs:
 *   RibbonHome.Initialize()
 *   RibbonHome.Load()
 *   RibbonHome.Reload()
 *   RibbonHome.Register()
 *   RibbonHome.Reset()
 *
 * Events emitted via CommandDispatcher:
 *   HomeLoaded | StyleChanged | ClipboardChanged | SelectionChanged
 *   FontChanged | ParagraphChanged | AIAvailable
 */

import React, { useEffect } from 'react';
import { CommandDispatcher } from './CommandDispatcher';
import { ClipboardGroup } from './ClipboardGroup';
import { FontGroup } from './FontGroup';
import { ParagraphGroup } from './ParagraphGroup';
import { StylesGroup } from './StylesGroup';
import { EditingGroup } from './EditingGroup';
import { VoiceGroup } from './VoiceGroup';
import { AIRibbonGroup } from './AIRibbonGroup';

// ─── RibbonHome API (per spec) ────────────────────────────────────────────────

export const RibbonHome = {
  Initialize(): void {
    CommandDispatcher.dispatch('HOME.LOADED');
  },

  Load(): void {
    CommandDispatcher.dispatch('HOME.LOADED');
  },

  Reload(): void {
    CommandDispatcher.dispatch('HOME.LOADED');
  },

  Register(): void {
    // All groups self-register via their imports
  },

  Reset(): void {
    // Reset group states
  },
};

// ─── HomeRibbon Component ─────────────────────────────────────────────────────

export function HomeRibbon() {
  // Emit HomeLoaded event on mount
  useEffect(() => {
    // Defer so the rest of ribbon is ready
    const t = setTimeout(() => RibbonHome.Load(), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── 1. Clipboard ──────────────────────────── */}
      <ClipboardGroup />

      {/* ── 2. Font ───────────────────────────────── */}
      <FontGroup />

      {/* ── 3. Paragraph ──────────────────────────── */}
      <ParagraphGroup />

      {/* ── 4. Styles ─────────────────────────────── */}
      <StylesGroup />

      {/* ── 5. Editing ────────────────────────────── */}
      <EditingGroup />

      {/* ── 6. Voice (dynamic — hidden if unavailable) */}
      <VoiceGroup />

      {/* ── 7. AI ─────────────────────────────────── */}
      <AIRibbonGroup />
    </>
  );
}
