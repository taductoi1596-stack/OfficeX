# OfficeX Word Command Registry — Home Tab

Version: 1.0

Status: Enterprise Registry

---

# 1. Overview

This registry defines every command available under the **Home** tab of OfficeX Word.

Each command is uniquely identified by a **Command ID** and is executed through the **Command Engine**.

```
Ribbon

↓

Command Registry

↓

Command Engine

↓

Target Engine

↓

History Engine

↓

Render Engine
```

---

# 2. Metadata Format

Every command contains:

- Command ID
- Display Name
- Ribbon Group
- Shortcut
- Target Engine
- Undo
- Redo
- Enabled Condition
- Category

---

# Clipboard Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.PASTE | Paste | Clipboard Engine |
| WORD.HOME.PASTE.SPECIAL | Paste Special | Clipboard Engine |
| WORD.HOME.PASTE.TEXT | Paste as Text | Clipboard Engine |
| WORD.HOME.PASTE.LINK | Paste Link | Clipboard Engine |
| WORD.HOME.CUT | Cut | Clipboard Engine |
| WORD.HOME.COPY | Copy | Clipboard Engine |
| WORD.HOME.COPY.FORMATTING | Copy Formatting | Clipboard Engine |
| WORD.HOME.FORMAT.PAINTER | Format Painter | Style Engine |
| WORD.HOME.CLIPBOARD.CLEAR | Clear Clipboard | Clipboard Engine |
| WORD.HOME.CLIPBOARD.OPEN | Clipboard Pane | Clipboard Engine |
| WORD.HOME.CLIPBOARD.PIN | Pin Clipboard Item | Clipboard Engine |
| WORD.HOME.CLIPBOARD.DELETE | Delete Clipboard Item | Clipboard Engine |

---

# Font Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.FONT.NAME | Font Name | Font Engine |
| WORD.HOME.FONT.SIZE | Font Size | Font Engine |
| WORD.HOME.FONT.GROW | Increase Font Size | Font Engine |
| WORD.HOME.FONT.SHRINK | Decrease Font Size | Font Engine |
| WORD.HOME.BOLD | Bold | Style Engine |
| WORD.HOME.ITALIC | Italic | Style Engine |
| WORD.HOME.UNDERLINE | Underline | Style Engine |
| WORD.HOME.DOUBLE.UNDERLINE | Double Underline | Style Engine |
| WORD.HOME.STRIKETHROUGH | Strikethrough | Style Engine |
| WORD.HOME.SUBSCRIPT | Subscript | Style Engine |
| WORD.HOME.SUPERSCRIPT | Superscript | Style Engine |
| WORD.HOME.SMALLCAPS | Small Caps | Style Engine |
| WORD.HOME.ALLCAPS | All Caps | Style Engine |
| WORD.HOME.HIDDEN | Hidden Text | Style Engine |
| WORD.HOME.CHANGECASE | Change Case | Text Engine |
| WORD.HOME.CLEARFORMATTING | Clear Formatting | Style Engine |
| WORD.HOME.HIGHLIGHT | Text Highlight | Style Engine |
| WORD.HOME.FONTCOLOR | Font Color | Style Engine |
| WORD.HOME.TEXTEFFECT | Text Effects | Style Engine |
| WORD.HOME.CHARACTER.SPACING | Character Spacing | Font Engine |
| WORD.HOME.OPEN.FONTDIALOG | Font Dialog | Font Engine |

---

# Paragraph Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.ALIGN.LEFT | Align Left | Layout Engine |
| WORD.HOME.ALIGN.CENTER | Center | Layout Engine |
| WORD.HOME.ALIGN.RIGHT | Align Right | Layout Engine |
| WORD.HOME.ALIGN.JUSTIFY | Justify | Layout Engine |
| WORD.HOME.INDENT.INCREASE | Increase Indent | Layout Engine |
| WORD.HOME.INDENT.DECREASE | Decrease Indent | Layout Engine |
| WORD.HOME.BULLETS | Bullets | Numbering Engine |
| WORD.HOME.NUMBERING | Numbering | Numbering Engine |
| WORD.HOME.MULTILEVEL | Multi-Level List | Numbering Engine |
| WORD.HOME.LINE.SPACING | Line Spacing | Layout Engine |
| WORD.HOME.PARAGRAPH.SPACING | Paragraph Spacing | Layout Engine |
| WORD.HOME.BORDERS | Borders | Table Engine |
| WORD.HOME.SHADING | Shading | Style Engine |
| WORD.HOME.SORT | Sort | Document Engine |
| WORD.HOME.SHOWMARKS | Show Formatting Marks | Render Engine |
| WORD.HOME.KEEPTOGETHER | Keep Lines Together | Pagination Engine |
| WORD.HOME.KEEPNEXT | Keep With Next | Pagination Engine |
| WORD.HOME.PAGEBREAKBEFORE | Page Break Before | Pagination Engine |
| WORD.HOME.WIDOWORPHAN | Widow Orphan Control | Pagination Engine |
| WORD.HOME.TABS | Tabs | Layout Engine |
| WORD.HOME.PARAGRAPH.DIALOG | Paragraph Dialog | Layout Engine |

---

# Styles Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.STYLE.NORMAL | Normal | Style Engine |
| WORD.HOME.STYLE.NO.SPACING | No Spacing | Style Engine |
| WORD.HOME.STYLE.HEADING1 | Heading 1 | Style Engine |
| WORD.HOME.STYLE.HEADING2 | Heading 2 | Style Engine |
| WORD.HOME.STYLE.HEADING3 | Heading 3 | Style Engine |
| WORD.HOME.STYLE.TITLE | Title | Style Engine |
| WORD.HOME.STYLE.SUBTITLE | Subtitle | Style Engine |
| WORD.HOME.STYLE.QUOTE | Quote | Style Engine |
| WORD.HOME.STYLE.INTENSEQUOTE | Intense Quote | Style Engine |
| WORD.HOME.STYLE.CODE | Code | Style Engine |
| WORD.HOME.STYLE.CREATE | Create Style | Style Engine |
| WORD.HOME.STYLE.MODIFY | Modify Style | Style Engine |
| WORD.HOME.STYLE.DELETE | Delete Style | Style Engine |
| WORD.HOME.STYLE.MANAGE | Manage Styles | Style Engine |
| WORD.HOME.STYLE.INSPECTOR | Style Inspector | Style Engine |

---

# Editing Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.FIND | Find | Search Engine |
| WORD.HOME.ADVANCEDFIND | Advanced Find | Search Engine |
| WORD.HOME.REPLACE | Replace | Search Engine |
| WORD.HOME.REPLACEALL | Replace All | Search Engine |
| WORD.HOME.GOTO | Go To | Search Engine |
| WORD.HOME.SELECT.ALL | Select All | Selection Engine |
| WORD.HOME.SELECT.OBJECT | Select Objects | Selection Engine |
| WORD.HOME.SELECT.PANE | Selection Pane | Selection Engine |
| WORD.HOME.SELECT.TEXT | Select Text | Selection Engine |
| WORD.HOME.SELECT.SHAPE | Select Shapes | Selection Engine |

---

# Voice Group (Future)

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.DICTATE | Dictation | Speech Engine |
| WORD.HOME.TRANSCRIBE | Transcribe | Speech Engine |
| WORD.HOME.VOICE.COMMAND | Voice Command | Speech Engine |

---

# AI Group

| Command ID | Display | Engine |
|------------|---------|--------|
| WORD.HOME.AI.REWRITE | Rewrite | AI Engine |
| WORD.HOME.AI.SUMMARIZE | Summarize | AI Engine |
| WORD.HOME.AI.TRANSLATE | Translate | AI Engine |
| WORD.HOME.AI.IMPROVE | Improve Writing | AI Engine |
| WORD.HOME.AI.EXPLAIN | Explain | AI Engine |
| WORD.HOME.AI.EXPAND | Expand | AI Engine |
| WORD.HOME.AI.SHORTEN | Shorten | AI Engine |
| WORD.HOME.AI.CHANGETONE | Change Tone | AI Engine |

---

# Home Tab Statistics

| Group | Commands |
|--------|---------:|
| Clipboard | 12 |
| Font | 21 |
| Paragraph | 21 |
| Styles | 15 |
| Editing | 10 |
| Voice | 3 |
| AI | 8 |

**Total Home Commands:** **90**

---

# Command Execution Flow

```
Ribbon Button

↓

Lookup Command Registry

↓

Permission Check

↓

Enabled Check

↓

Create Command

↓

Command Engine

↓

Target Engine

↓

History Engine

↓

Render Engine

↓

UI Refresh
```

---

# Notes

- Every command has a globally unique **Command ID**.
- Commands are discoverable by Ribbon, keyboard shortcuts, context menus, macros, plugins, and AI.
- Commands are undoable unless explicitly marked as non-undoable.
- New commands can be registered dynamically by plugins through the Command Registry.
