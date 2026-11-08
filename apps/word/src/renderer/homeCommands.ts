/**
 * HOME COMMAND REGISTRY
 * 
 * Registrar trung tâm cho toàn bộ lệnh của Home Tab.
 * 
 * Mỗi CommandDef khai báo:
 *   - id:           WORD.HOME.BOLD
 *   - label:        "Bold"
 *   - shortcut:     "Ctrl+B"
 *   - group:        "Font" | "Clipboard" | "Paragraph" | "Styles" | "Editing"
 *   - handler:      (api, payload?) => void
 *   - isActive:     (state) => boolean   — ribbon button lit up
 *   - isEnabled:    (state) => boolean   — button enabled/disabled
 */

import { EditorAPI, EditorState } from './editorApi';
import { StyleEngine } from './StyleEngine';

export type CommandGroup =
  | 'Clipboard' | 'Font' | 'Paragraph' | 'Styles' | 'Editing' | 'Voice' | 'AI';

export interface CommandDef {
  id: string;
  name: string;
  label: string;
  tooltip?: string;
  shortcut?: string;        // display string e.g. "Ctrl+B"
  group: CommandGroup;
  handler: (api: typeof EditorAPI, payload?: unknown) => void;
  isActive?: (state: EditorState) => boolean;
  isEnabled?: (state: EditorState) => boolean;
}

// ─── Command Registry ─────────────────────────────────────────────────────────

const registry = new Map<string, CommandDef>();

function reg(def: Omit<CommandDef, 'name'>) {
  registry.set(def.id, { ...def, name: def.label });
}

// ═══════════════════════════════════════════════════
// CLIPBOARD GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.SELECTION.SELECT_ALL', label: 'Select All', shortcut: 'Ctrl+A', group: 'Editing', handler: a => a.getLegacy()!.selectAll() });
reg({ id: 'WORD.SELECTION.SELECT_WORD', label: 'Select Word', group: 'Editing', handler: () => {} });
reg({ id: 'WORD.SELECTION.SELECT_PARAGRAPH', label: 'Select Paragraph', group: 'Editing', handler: () => {} });
reg({ id: 'WORD.SELECTION.CLEAR', label: 'Clear Selection', shortcut: 'Esc', group: 'Editing', handler: () => {} });
reg({ id: 'WORD.GOTO.OPEN', label: 'Go To', shortcut: 'Ctrl+G', group: 'Editing', handler: () => {} });
reg({ id: 'WORD.AI.REWRITE', label: 'AI Rewrite', shortcut: 'Ctrl+Shift+A', group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.SUMMARIZE', label: 'AI Summarize', shortcut: 'Ctrl+Shift+S', group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.TRANSLATE', label: 'AI Translate', shortcut: 'Ctrl+Shift+T', group: 'AI', handler: () => {} });
reg({ id: 'WORD.DICTATE.START', label: 'Dictate', shortcut: 'Ctrl+Shift+D', group: 'Voice', handler: () => {} });
reg({ id: 'WORD.AI.CHAT.OPEN', label: 'AI Chat', shortcut: 'Ctrl+Shift+C', group: 'AI', handler: () => {} });
reg({ id: 'WORD.HOME.PASTE',          label: 'Paste',          shortcut: 'Ctrl+V',       group: 'Clipboard', handler: a => a.getLegacy()!.paste() });
reg({ id: 'WORD.HOME.PASTE.SPECIAL',  label: 'Paste Special',                            group: 'Clipboard', handler: a => a.getLegacy()!.pasteSpecial() });
reg({ id: 'WORD.HOME.PASTE.TEXT',     label: 'Paste Text',     shortcut: 'Ctrl+Shift+V', group: 'Clipboard', handler: a => a.getLegacy()!.pasteText() });
reg({ id: 'WORD.HOME.CUT',            label: 'Cut',            shortcut: 'Ctrl+X',       group: 'Clipboard', handler: a => a.getLegacy()!.cut() });
reg({ id: 'WORD.HOME.COPY',           label: 'Copy',           shortcut: 'Ctrl+C',       group: 'Clipboard', handler: a => a.getLegacy()!.copy() });
reg({ id: 'WORD.FIND.OPEN', label: 'Find', shortcut: 'Ctrl+F', group: 'Editing', handler: () => {} });
reg({ 
  id: 'WORD.HOME.FORMAT.PAINTER', label: 'Format Painter', shortcut: 'Ctrl+Shift+C', group: 'Clipboard', 
  handler: a => a.getLegacy()!.toggleFormatPainter(),
  isActive: s => s.formatPainterActive 
});
reg({
  id: 'WORD.HOME.CLIPBOARD.PANEL', label: 'Clipboard History', group: 'Clipboard',
  handler: a => a.getLegacy()!.toggleClipboardPanel(),
  isActive: s => s.clipboardPanelOpen
});

// Canonical Clipboard IDs (per ribbon_home.md spec)
reg({ id: 'WORD.CLIPBOARD.PASTE',           label: 'Paste',                    shortcut: 'Ctrl+V',       group: 'Clipboard', handler: a => a.getLegacy()!.paste() });
reg({ id: 'WORD.CLIPBOARD.PASTE_SPECIAL',   label: 'Paste Special',            group: 'Clipboard',       handler: a => a.getLegacy()!.pasteSpecial() });
reg({ id: 'WORD.CLIPBOARD.PASTE_KEEP_SOURCE',label: 'Paste Keep Source',       shortcut: 'Ctrl+Shift+K', group: 'Clipboard', handler: a => a.getLegacy()!.paste() });
reg({ id: 'WORD.CLIPBOARD.PASTE_MERGE',     label: 'Paste Merge Formatting',   group: 'Clipboard',       handler: a => a.getLegacy()!.paste() });
reg({ id: 'WORD.CLIPBOARD.PASTE_TEXT',      label: 'Paste Text Only',          shortcut: 'Ctrl+Shift+V', group: 'Clipboard', handler: a => a.getLegacy()!.pasteText() });
reg({ id: 'WORD.CLIPBOARD.CUT',             label: 'Cut',                      shortcut: 'Ctrl+X',       group: 'Clipboard', handler: a => a.getLegacy()!.cut() });
reg({ id: 'WORD.CLIPBOARD.COPY',            label: 'Copy',                     shortcut: 'Ctrl+C',       group: 'Clipboard', handler: a => a.getLegacy()!.copy() });
reg({ id: 'WORD.CLIPBOARD.COPY_AS_IMAGE',   label: 'Copy As Picture',          group: 'Clipboard',       handler: () => {} });
reg({ id: 'WORD.CLIPBOARD.FORMAT_PAINTER',  label: 'Format Painter',           shortcut: 'Ctrl+Shift+C', group: 'Clipboard', handler: a => a.getLegacy()!.toggleFormatPainter(), isActive: s => s.formatPainterActive });
reg({ id: 'WORD.CLIPBOARD.PANE',            label: 'Clipboard Pane',           group: 'Clipboard',       handler: a => a.getLegacy()!.toggleClipboardPanel(), isActive: s => s.clipboardPanelOpen });

// ═══════════════════════════════════════════════════
// FONT GROUP
// ═══════════════════════════════════════════════════

reg({
  id: 'WORD.HOME.BOLD', label: 'Bold', shortcut: 'Ctrl+B', group: 'Font',
  handler: a => a.getLegacy()!.toggleBold(),
  isActive: s => s.bold,
});
reg({
  id: 'WORD.HOME.ITALIC', label: 'Italic', shortcut: 'Ctrl+I', group: 'Font',
  handler: a => a.getLegacy()!.toggleItalic(),
  isActive: s => s.italic,
});
reg({
  id: 'WORD.HOME.UNDERLINE', label: 'Underline', shortcut: 'Ctrl+U', group: 'Font',
  handler: a => a.getLegacy()!.toggleUnderline(),
  isActive: s => s.underline,
});
reg({
  id: 'WORD.HOME.STRIKETHROUGH', label: 'Strikethrough', group: 'Font',
  handler: a => a.getLegacy()!.toggleStrike(),
  isActive: s => s.strike,
});
reg({
  id: 'WORD.HOME.SUPERSCRIPT', label: 'Superscript', shortcut: 'Ctrl+Shift+=', group: 'Font',
  handler: a => a.getLegacy()!.toggleSuperscript(),
  isActive: s => s.superscript,
});
reg({
  id: 'WORD.HOME.SUBSCRIPT', label: 'Subscript', shortcut: 'Ctrl+=', group: 'Font',
  handler: a => a.getLegacy()!.toggleSubscript(),
  isActive: s => s.subscript,
});
reg({ id: 'WORD.HOME.FONT.GROW',   label: 'Grow Font',   shortcut: 'Ctrl+Shift+.', group: 'Font', handler: a => a.getLegacy()!.increaseFontSize() });
reg({ id: 'WORD.HOME.FONT.SHRINK', label: 'Shrink Font', shortcut: 'Ctrl+Shift+,', group: 'Font', handler: a => a.getLegacy()!.decreaseFontSize() });
reg({ id: 'WORD.HOME.FONT.FAMILY', label: 'Font Family', group: 'Font', handler: (a, p) => a.getLegacy()!.setFontFamily(p as string) });
reg({ id: 'WORD.HOME.FONT.SIZE',   label: 'Font Size',   group: 'Font', handler: (a, p) => a.getLegacy()!.setFontSize(Number(p)) });
reg({ id: 'WORD.HOME.FONTCOLOR',   label: 'Font Color',  group: 'Font', handler: (a, p) => a.getLegacy()!.setFontColor(p as string ?? '#FF0000') });
reg({ id: 'WORD.HOME.HIGHLIGHT',   label: 'Highlight',   group: 'Font', handler: (a, p) => a.getLegacy()!.setHighlight(p as string ?? '#FFFF00') });
reg({ id: 'WORD.HOME.CHANGECASE',  label: 'Change Case', group: 'Font', handler: a => {} /* TODO */ });
reg({ id: 'WORD.HOME.DOUBLE_UNDERLINE', label: 'Double Underline', shortcut: 'Ctrl+Shift+D', group: 'Font', handler: a => a.getLegacy()!.toggleDoubleUnderline(), isActive: s => s.doubleUnderline });
reg({ id: 'WORD.HOME.DOUBLE_STRIKETHROUGH', label: 'Double Strikethrough', group: 'Font', handler: a => a.getLegacy()!.toggleDoubleStrike(), isActive: s => s.doubleStrike });
reg({ id: 'WORD.HOME.SMALL_CAPS', label: 'Small Caps', shortcut: 'Ctrl+Shift+K', group: 'Font', handler: a => a.getLegacy()!.toggleSmallCaps(), isActive: s => s.smallCaps });
reg({ id: 'WORD.HOME.ALL_CAPS', label: 'All Caps', shortcut: 'Ctrl+Shift+A', group: 'Font', handler: a => a.getLegacy()!.toggleAllCaps(), isActive: s => s.allCaps });
reg({ id: 'WORD.HOME.HIDDEN', label: 'Hidden Text', shortcut: 'Ctrl+Shift+H', group: 'Font', handler: a => a.getLegacy()!.toggleHidden(), isActive: s => s.hiddenText });
reg({ id: 'WORD.HOME.CLEAR.FORMAT',label: 'Clear Formatting', shortcut: 'Ctrl+Space', group: 'Font', handler: a => a.getLegacy()!.clearFormatting() });

// ═══════════════════════════════════════════════════
// PARAGRAPH GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.PARAGRAPH.DIALOG', label: 'Paragraph Settings...', group: 'Paragraph', handler: () => {} });

// STYLE GROUP
reg({
  id: 'WORD.STYLE.APPLY',
  label: 'Apply Style',
  group: 'Styles',
  handler: (a, styleId: any) => {
    const style = StyleEngine.getStyle(styleId);
    if (style) {
      // Merge format
      a.getLegacy()!.setParaFmt({ ...style.paraFmt, styleId });
      // Clear run format on apply paragraph style? Optional.
    }
  }
});
reg({
  id: 'WORD.STYLE.CLEAR_FORMATTING',
  label: 'Clear Formatting',
  group: 'Styles',
  handler: (a) => {
    const state = a.getState();
    const styleId = state.currentParaFmt?.styleId || 'Normal';
    const style = StyleEngine.getStyle(styleId);
    if (style) {
      a.getLegacy()!.setParaFmt({ ...style.paraFmt, styleId });
    }
  }
});
reg({
  id: 'WORD.STYLE.GALLERY.PIN',
  label: 'Pin Style',
  group: 'Styles',
  handler: (a, styleId: any) => StyleEngine.togglePin(styleId)
});
reg({
  id: 'WORD.STYLE.GALLERY.FAVORITE',
  label: 'Favorite Style',
  group: 'Styles',
  handler: (a, styleId: any) => StyleEngine.toggleFavorite(styleId)
});
reg({ id: 'WORD.STYLEPANE.TOGGLE', label: 'Toggle Style Pane', group: 'Styles', handler: () => {} });
reg({ id: 'WORD.STYLEMANAGER.OPEN', label: 'Manage Styles', group: 'Styles', handler: () => {} });
reg({ id: 'WORD.STYLEMANAGER.REFRESH', label: 'Refresh Editor Styles', group: 'Styles', handler: (a) => {
  const rs = a.getState();
  if (rs.currentParaFmt?.styleId) a.getLegacy()!.setParaFmt({ styleId: rs.currentParaFmt.styleId });
} });
reg({ id: 'WORD.STYLEINSPECTOR.TOGGLE', label: 'Toggle Style Inspector', group: 'Styles', handler: () => {} });
reg({
  id: 'WORD.STYLEINSPECTOR.CLEAR_PARAGRAPH',
  label: 'Clear Paragraph Direct Formatting',
  group: 'Styles',
  handler: (a) => {
    const s = a.getState().currentParaFmt;
    if (s?.styleId) a.getLegacy()!.setParaFmt({ styleId: s.styleId });
  }
});
reg({
  id: 'WORD.STYLEINSPECTOR.CLEAR_CHARACTER',
  label: 'Clear Character Direct Formatting',
  group: 'Styles',
  handler: (a) => {
    const s = a.getState().currentRunFmt;
    if (s?.styleId) a.getLegacy()!.setRunFmt({ styleId: s.styleId });
    else a.getLegacy()!.setRunFmt({});
  }
});
reg({
  id: 'WORD.STYLEINSPECTOR.CLEAR_ALL',
  label: 'Clear All Direct Formatting',
  group: 'Styles',
  handler: (a) => {
    const rs = a.getState();
    if (rs.currentParaFmt?.styleId) a.getLegacy()!.setParaFmt({ styleId: rs.currentParaFmt.styleId });
    if (rs.currentRunFmt?.styleId) a.getLegacy()!.setRunFmt({ styleId: rs.currentRunFmt.styleId });
    else a.getLegacy()!.setRunFmt({});
  }
});

reg({
  id: 'WORD.PARAGRAPH.ALIGN.LEFT', label: 'Align Left', shortcut: 'Ctrl+L', group: 'Paragraph',
  handler: a => a.getLegacy()!.setAlign('left'),
  isActive: s => s.align === 'left',
});
reg({
  id: 'WORD.PARAGRAPH.ALIGN.CENTER', label: 'Center', shortcut: 'Ctrl+E', group: 'Paragraph',
  handler: a => a.getLegacy()!.setAlign('center'),
  isActive: s => s.align === 'center',
});
reg({
  id: 'WORD.PARAGRAPH.ALIGN.RIGHT', label: 'Align Right', shortcut: 'Ctrl+R', group: 'Paragraph',
  handler: a => a.getLegacy()!.setAlign('right'),
  isActive: s => s.align === 'right',
});
reg({
  id: 'WORD.PARAGRAPH.ALIGN.JUSTIFY', label: 'Justify', shortcut: 'Ctrl+J', group: 'Paragraph',
  handler: a => a.getLegacy()!.setAlign('justify'),
  isActive: s => s.align === 'justify',
});
reg({
  id: 'WORD.PARAGRAPH.ALIGN.DISTRIBUTED', label: 'Distributed', shortcut: 'Ctrl+Shift+J', group: 'Paragraph',
  handler: a => a.getLegacy()!.setAlign('distributed'),
  isActive: s => s.align === 'distributed',
});
reg({ id: 'WORD.PARAGRAPH.INDENT.INCREASE', label: 'Increase Indent', shortcut: 'Ctrl+M', group: 'Paragraph', handler: a => a.getLegacy()!.indentIncrease() });
reg({ id: 'WORD.PARAGRAPH.INDENT.DECREASE', label: 'Decrease Indent', shortcut: 'Ctrl+Shift+M', group: 'Paragraph', handler: a => a.getLegacy()!.indentDecrease() });
reg({ id: 'WORD.PARAGRAPH.INDENT.LEFT',     label: 'Left Indent', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setLeftIndent(Number(p)) });
reg({ id: 'WORD.PARAGRAPH.INDENT.RIGHT',    label: 'Right Indent', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setRightIndent(Number(p)) });
reg({ id: 'WORD.PARAGRAPH.INDENT.FIRSTLINE',label: 'First Line Indent', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setFirstLineIndent(Number(p)) });
reg({ id: 'WORD.PARAGRAPH.INDENT.HANGING',  label: 'Hanging Indent', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setHangingIndent(Number(p)) });
reg({ id: 'WORD.PARAGRAPH.INDENT.MIRROR',   label: 'Mirror Indents', group: 'Paragraph', handler: (a, p) => {} });
reg({ id: 'WORD.PARAGRAPH.INDENT.DIALOG',   label: 'Paragraph Dialog', group: 'Paragraph', handler: () => {} });
reg({
  id: 'WORD.BULLET.DEFAULT', label: 'Bullets', group: 'Paragraph',
  handler: a => a.getLegacy()!.toggleBullets(),
  isActive: s => s.bullets,
});
reg({ id: 'WORD.BULLET.REMOVE', label: 'Remove Bullets', group: 'Paragraph', handler: a => a.getLegacy()!.setParaFmt({ listType: null }) });
reg({ id: 'WORD.BULLET.GALLERY', label: 'Bullet Gallery', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.BULLET.CUSTOM', label: 'Custom Bullet', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.BULLET.IMAGE', label: 'Image Bullet', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBulletImage(String(p)) });
reg({ id: 'WORD.BULLET.SYMBOL', label: 'Symbol Bullet', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBulletChar(String(p)) });
reg({ id: 'WORD.BULLET.COLOR', label: 'Bullet Color', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBulletColor(String(p)) });
reg({ id: 'WORD.BULLET.SIZE', label: 'Bullet Size', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBulletSize(Number(p)) });
reg({ id: 'WORD.BULLET.FONT', label: 'Bullet Font', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setParaFmt({ listType: 'bullet', bulletType: 'symbol', bulletFont: String(p) }) });
reg({ id: 'WORD.BULLET.RECENT', label: 'Recent Bullets', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.BULLET.FAVORITE', label: 'Favorite Bullets', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.BULLET.DIALOG', label: 'Bullet Dialog', group: 'Paragraph', handler: () => {} });
reg({
  id: 'WORD.NUMBER.DEFAULT', label: 'Numbering', group: 'Paragraph',
  handler: a => a.getLegacy()!.toggleNumbering(),
  isActive: s => s.numbering,
});
reg({ id: 'WORD.NUMBER.REMOVE', label: 'Remove Numbering', group: 'Paragraph', handler: a => a.getLegacy()!.setParaFmt({ listType: null }) });
reg({ id: 'WORD.NUMBER.GALLERY', label: 'Number Gallery', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.NUMBER.FORMAT', label: 'Number Format', group: 'Paragraph', handler: (a, p) => {
  const { format, prefix = '', suffix = '.' } = p as any;
  a.getLegacy()!.setNumberingFormat(format, prefix, suffix);
}});
reg({ id: 'WORD.NUMBER.START_AT', label: 'Set Numbering Value', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setNumberingStart(Number(p)) });
reg({ id: 'WORD.NUMBER.RESTART', label: 'Restart at 1', group: 'Paragraph', handler: (a) => a.getLegacy()!.setNumberingStart(1) });
reg({ id: 'WORD.NUMBER.DIALOG', label: 'Define New Number Format', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.MULTILEVEL.DEFAULT', label: 'Multi-level List', group: 'Paragraph', handler: a => a.getLegacy()!.setParaFmt({ listType: 'multilevel', listFormatTemplate: '%0.%1.%2.', listFormatArray: ['decimal', 'decimal', 'decimal'] }) });
reg({ id: 'WORD.MULTILEVEL.REMOVE', label: 'Remove Multi-level', group: 'Paragraph', handler: a => a.getLegacy()!.setParaFmt({ listType: null }) });
reg({ id: 'WORD.MULTILEVEL.PROMOTE', label: 'Promote', group: 'Paragraph', handler: a => a.getLegacy()!.promoteListLevel() });
reg({ id: 'WORD.MULTILEVEL.DEMOTE', label: 'Demote', group: 'Paragraph', handler: a => a.getLegacy()!.demoteListLevel() });
reg({ id: 'WORD.MULTILEVEL.FORMAT', label: 'Multi-level Format', group: 'Paragraph', handler: (a, p) => {
  const { template, formats = [] } = p as any;
  a.getLegacy()!.setParaFmt({ listType: 'multilevel', listFormatTemplate: template, listFormatArray: formats });
}});
reg({ id: 'WORD.MULTILEVEL.DIALOG', label: 'Define New Multi-level List', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.HOME.LINE.SPACING', label: 'Line Spacing',     group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setLineSpacing(Number(p) || 1.0) });
reg({ id: 'WORD.HOME.BORDERS',      label: 'Borders',           group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setParaFmt({ borders: p }) });
reg({ id: 'WORD.HOME.SHADING',      label: 'Shading',           group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setParaFmt({ shading: p === 'transparent' ? undefined : p }) });
reg({ id: 'WORD.SHADING.NONE', label: 'No Color', group: 'Paragraph', handler: a => a.getLegacy()!.setParaFmt({ shading: undefined }) });
reg({ id: 'WORD.SHADING.APPLY', label: 'Apply Shading', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setParaFmt({ shading: p === 'transparent' ? undefined : p }) });
reg({ id: 'WORD.SHADING.DIALOG', label: 'More Colors...', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.BORDER.NONE', label: 'No Border', group: 'Paragraph', handler: a => a.getLegacy()!.setBorder('none') });
reg({ id: 'WORD.BORDER.TOP', label: 'Top Border', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBorder('top', p || { style: 'single', width: 1, color: '#000000' }) });
reg({ id: 'WORD.BORDER.BOTTOM', label: 'Bottom Border', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBorder('bottom', p || { style: 'single', width: 1, color: '#000000' }) });
reg({ id: 'WORD.BORDER.LEFT', label: 'Left Border', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBorder('left', p || { style: 'single', width: 1, color: '#000000' }) });
reg({ id: 'WORD.BORDER.RIGHT', label: 'Right Border', group: 'Paragraph', handler: (a, p) => a.getLegacy()!.setBorder('right', p || { style: 'single', width: 1, color: '#000000' }) });
reg({ id: 'WORD.BORDER.OUTSIDE', label: 'Outside Borders', group: 'Paragraph', handler: (a, p) => { const d = p || { style: 'single', width: 1, color: '#000000' }; a.getLegacy()!.setBorder('outside', d); } });
reg({ id: 'WORD.BORDER.INSIDE', label: 'Inside Borders', group: 'Paragraph', handler: (a, p) => { const d = p || { style: 'single', width: 1, color: '#000000' }; a.getLegacy()!.setBorder('inside', d); } });
reg({ id: 'WORD.BORDER.ALL', label: 'All Borders', group: 'Paragraph', handler: (a, p) => { const d = p || { style: 'single', width: 1, color: '#000000' }; a.getLegacy()!.setBorder('all', d); } });
reg({ id: 'WORD.BORDER.DIALOG', label: 'Borders and Shading...', group: 'Paragraph', handler: () => {} });
reg({ id: 'WORD.HOME.SORT',         label: 'Sort',              group: 'Paragraph', handler: a => a.getLegacy()!.sortParagraphs() });
reg({ id: 'WORD.HOME.SHOW_FORMATTING', label: 'Show Formatting Marks', group: 'Paragraph', handler: a => a.getLegacy()!.toggleFormatMarks() });

// ═══════════════════════════════════════════════════
// STYLES GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.HOME.STYLE.NORMAL',   label: 'Normal',    group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Normal') });
reg({ id: 'WORD.HOME.STYLE.HEADING1', label: 'Heading 1', group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Heading1') });
reg({ id: 'WORD.HOME.STYLE.HEADING2', label: 'Heading 2', group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Heading2') });
reg({ id: 'WORD.HOME.STYLE.HEADING3', label: 'Heading 3', group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Heading3') });
reg({ id: 'WORD.HOME.STYLE.TITLE',    label: 'Title',     group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Title') });
reg({ id: 'WORD.HOME.STYLE.SUBTITLE', label: 'Subtitle',  group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Subtitle') });
reg({ id: 'WORD.HOME.STYLE.QUOTE',    label: 'Quote',     group: 'Styles', handler: a => a.getLegacy()!.applyStyle('Quote') });
reg({ id: 'WORD.HOME.STYLE.MANAGE',   label: 'More Styles', group: 'Styles', handler: a => {} /* TODO: style panel */ });

// ═══════════════════════════════════════════════════
// EDITING GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.HOME.FIND',        label: 'Find',       shortcut: 'Ctrl+F',         group: 'Editing', handler: a => a.getLegacy()!.showFind() });
reg({ id: 'WORD.HOME.REPLACE',     label: 'Replace',    shortcut: 'Ctrl+H',         group: 'Editing', handler: a => a.getLegacy()!.showReplace() });
reg({ id: 'WORD.HOME.SELECT.ALL',  label: 'Select All', shortcut: 'Ctrl+A',         group: 'Editing', handler: a => a.getLegacy()!.selectAll() });
reg({ id: 'WORD.HOME.UNDO',        label: 'Undo',       shortcut: 'Ctrl+Z',         group: 'Editing',
  handler: a => a.getLegacy()!.undo(), isEnabled: s => s.canUndo });
reg({ id: 'WORD.HOME.REDO',        label: 'Redo',       shortcut: 'Ctrl+Y',         group: 'Editing',
  handler: a => a.getLegacy()!.redo(), isEnabled: s => s.canRedo });

// Canonical Editing IDs (per ribbon_home.md spec)
reg({ id: 'WORD.EDIT.FIND',           label: 'Find',              shortcut: 'Ctrl+F', group: 'Editing', handler: a => a.getLegacy()!.showFind() });
reg({ id: 'WORD.EDIT.ADVANCED_FIND',  label: 'Advanced Find',     group: 'Editing',   handler: () => {} });
reg({ id: 'WORD.EDIT.REPLACE',        label: 'Replace',           shortcut: 'Ctrl+H', group: 'Editing', handler: a => a.getLegacy()!.showReplace() });
reg({ id: 'WORD.EDIT.GOTO',           label: 'Go To',             shortcut: 'Ctrl+G', group: 'Editing', handler: () => {} });
reg({ id: 'WORD.EDIT.SELECT',         label: 'Select',            group: 'Editing',   handler: () => {} });
reg({ id: 'WORD.EDIT.SELECT_ALL',     label: 'Select All',        shortcut: 'Ctrl+A', group: 'Editing', handler: a => a.getLegacy()!.selectAll() });
reg({ id: 'WORD.EDIT.SELECT_OBJECT',  label: 'Select Objects',    group: 'Editing',   handler: () => {} });
reg({ id: 'WORD.EDIT.SELECTION_PANE', label: 'Selection Pane',    group: 'Editing',   handler: () => {} });

// ═══════════════════════════════════════════════════
// VOICE GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.VOICE.DICTATE',     label: 'Dictate',       shortcut: 'Ctrl+Shift+D', group: 'Voice', handler: () => {} });
reg({ id: 'WORD.VOICE.TRANSCRIBE',  label: 'Transcribe',    group: 'Voice',           handler: () => {} });
reg({ id: 'WORD.VOICE.READ_ALOUD',  label: 'Read Aloud',    group: 'Voice',           handler: () => {} });
reg({ id: 'WORD.VOICE.SETTINGS',    label: 'Voice Settings',group: 'Voice',           handler: () => {} });

// ═══════════════════════════════════════════════════
// AI GROUP
// ═══════════════════════════════════════════════════

reg({ id: 'WORD.HOME.AI.REWRITE',   label: 'Rewrite',   group: 'AI', handler: a => {} /* TODO */ });
reg({ id: 'WORD.HOME.AI.SUMMARIZE', label: 'Summarize', group: 'AI', handler: a => {} /* TODO */ });
reg({ id: 'WORD.HOME.AI.TRANSLATE', label: 'Translate', group: 'AI', handler: a => {} /* TODO */ });
reg({ id: 'WORD.HOME.DICTATE',      label: 'Dictate',   group: 'Voice', handler: a => {} /* TODO */ });

// Canonical AI IDs (per ribbon_home.md spec)
reg({ id: 'WORD.AI.EXPLAIN',   label: 'Explain',          group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.GRAMMAR',   label: 'Grammar',          group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.CONTINUE',  label: 'Continue Writing', group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.OUTLINE',   label: 'Generate Outline', group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.TABLE',     label: 'Generate Table',   group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.IMAGE',     label: 'Generate Image',   group: 'AI', handler: () => {} });
reg({ id: 'WORD.AI.CHAT',      label: 'Chat',             shortcut: 'Ctrl+Shift+C', group: 'AI', handler: () => {} });

// ─── Public API ───────────────────────────────────────────────────────────────

export const HomeCommandRegistry = {
  /** Get a command definition by ID */
  get(id: string): CommandDef | undefined {
    return registry.get(id);
  },

  /** Get all commands in a specific group */
  getGroup(group: CommandGroup): CommandDef[] {
    return Array.from(registry.values()).filter(c => c.group === group);
  },

  /** All registered commands */
  all(): CommandDef[] {
    return Array.from(registry.values());
  },

  /** Check whether a command ID is registered */
  has(id: string): boolean {
    return registry.has(id);
  },
};
