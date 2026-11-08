# OfficeX Word Command System Specification

Version: 1.0
Status: Enterprise Design Specification
Author: OfficeX Lead Software Architect

---

## 1. Overview

The OfficeX Word Command System is the central UI Command Layer that acts as a robust bridge between the user interface (Ribbon, Context Menus, Keyboard Shortcuts) and the underlying OfficeX Engines.

This is **not** a processing engine. It is the **Orchestrator** that guarantees predictable execution, state management, and rollback capabilities for every user action.

### Command Architecture
The architecture is based on the **Command Pattern**. Every user action is encapsulated into a discrete, self-contained `ICommand` object. This object contains all necessary parameters to execute, undo, and redo the action.

### Command Pattern & Lifecycle
1. **Validation**: Before execution, the command queries the validation flow to check permissions, read-only states, and context feasibility.
2. **Execution**: The command invokes one or more Engines in a defined pipeline (e.g., `StyleEngine` -> `TextEngine` -> `LayoutEngine`).
3. **Event Dispatch**: Emits `beforeExecute` and `afterExecute` events via the `EventEngine`.
4. **History Tracking**: On success, the command is serialized and pushed to the `HistoryEngine`.

### Undo/Redo & History Integration
Commands must implement `undo()` and `redo()` methods. The `HistoryEngine` maintains two stacks (Undo and Redo). When `undo()` is called, the command reverses its state mutations through the exact engines it originally called.

### Macro Support & Future Scripting
Because every action is an explicit Command object, macros are simply a serialized array of Commands. In the future, JavaScript/VBA macros will hook into the `CommandRegistry` to record or playback these arrays.

---

## 2. Command API & Interfaces

```typescript
export interface ICommandContext {
  documentId: string;
  selection: SelectionRange;
  userToken: string;
}

export interface ICommandResult {
  success: boolean;
  affectedNodes: string[];
  errorMessage?: string;
}

export interface ICommand {
  id: string;
  displayName: string;
  category: string;
  execute(context: ICommandContext): Promise<ICommandResult>;
  undo(context: ICommandContext): Promise<ICommandResult>;
  redo(context: ICommandContext): Promise<ICommandResult>;
  canExecute(context: ICommandContext): boolean;
  serialize(): string;
}
```

---

## 3. Command Registry & Dispatcher

### Command Registry
A centralized singleton mapping `CommandID` to `CommandFactory`. Plugins can register new commands here.

### Command Dispatcher
The `CommandDispatcher` receives requests from the Ribbon UI, instantiates the command via the Registry, executes the Validation Flow, runs the command, and pushes it to the `HistoryEngine`.

### Command Routing
```text
UI (Ribbon Button / Shortcut) 
  ↓ (Command ID + Payload)
Command Dispatcher
  ↓ 
Validation Flow (Policy Engine, Rights Management)
  ↓
Command Execution (Engine Pipeline)
  ↓
History Engine (Push to Undo Stack)
  ↓
UI (Update state, e.g. dirty flag)
```

---

## 4. HOME TAB Commands

### Clipboard Group

#### Paste Command
- **Command ID**: `Cmd_Paste`
- **Display Name**: Paste
- **Description**: Pastes content from the clipboard into the document.
- **Ribbon Group**: Clipboard
- **Shortcut**: `Ctrl+V`
- **Target Engine**: `InputEngine`, `TextEngine`, `ObjectEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> InputEngine -> TextEngine -> LayoutEngine -> RenderEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: DLP (Data Loss Prevention) checks required before pasting external data.
- **Telemetry**: Count format types pasted.
- **Accessibility**: Narrator announces "Pasted".
- **Dependencies**: Clipboard API.
- **Pseudo Code**: 
  ```typescript
  async execute() {
    const data = await clipboard.read();
    const nodes = parseClipboardData(data);
    textEngine.insertNodes(context.selection, nodes);
    layoutEngine.reflow();
  }
  ```

#### Copy Command
- **Command ID**: `Cmd_Copy`
- **Display Name**: Copy
- **Description**: Copies selected content to the clipboard.
- **Ribbon Group**: Clipboard
- **Shortcut**: `Ctrl+C`
- **Target Engine**: `SelectionEngine`, `SerializationEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> SelectionEngine -> SerializationEngine -> Clipboard
- **Undo Support**: No (Stateless)
- **Redo Support**: No
- **Permission Requirement**: Read Access
- **Enterprise Policy**: Blocked if RightsManagementEngine restricts copy (IRM).
- **Telemetry**: Track volume of copy events.
- **Accessibility**: Narrator announces "Copied".
- **Dependencies**: None.
- **Pseudo Code**:
  ```typescript
  async execute() {
    const selectedNodes = selectionEngine.getNodes();
    const serialized = serializationEngine.serialize(selectedNodes);
    await clipboard.write(serialized);
  }
  ```

*(Note: Similar structures apply to Cut, Paste Special, Format Painter, etc.)*

---

### Font Group

#### Bold Command
- **Command ID**: `Cmd_Bold`
- **Display Name**: Bold
- **Description**: Toggles bold formatting on the selected text.
- **Ribbon Group**: Font
- **Shortcut**: `Ctrl+B`
- **Target Engine**: `StyleEngine`, `TextEngine`
- **Command Pipeline**: Ribbon Button -> Command Engine -> Style Engine -> Text Engine -> Layout Engine -> Render Engine -> History Engine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: None
- **Telemetry**: Track usage.
- **Accessibility**: Toggle state announced.
- **Dependencies**: SelectionEngine.
- **Pseudo Code**:
  ```typescript
  async execute() {
    const isBold = styleEngine.isBold(context.selection);
    styleEngine.applyFormatting(context.selection, { bold: !isBold });
    layoutEngine.reflow(context.selection);
  }
  ```

*(Note: Applies to Italic, Underline, Strikethrough, Subscript, Superscript, Font Size, Font Color, Clear Formatting, etc.)*

---

### Paragraph Group

#### Alignment Command (Left/Center/Right/Justify)
- **Command ID**: `Cmd_Align`
- **Display Name**: Align Paragraph
- **Description**: Changes the alignment of the current paragraph.
- **Ribbon Group**: Paragraph
- **Shortcut**: `Ctrl+L / E / R / J`
- **Target Engine**: `StyleEngine`, `LayoutEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> StyleEngine -> LayoutEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: None
- **Telemetry**: Track alignment choices.
- **Accessibility**: Announces alignment change.
- **Dependencies**: None.
- **Pseudo Code**:
  ```typescript
  async execute(payload: { align: 'left'|'center'|'right'|'justify' }) {
    styleEngine.setParagraphStyle(context.selection.paragraph, { alignment: payload.align });
    layoutEngine.reflowParagraph(context.selection.paragraph);
  }
  ```

*(Note: Applies to Indent, Bullets, Numbering, Line Spacing, Borders, Shading, etc.)*

---

### Styles Group

#### Apply Style Command
- **Command ID**: `Cmd_ApplyStyle`
- **Display Name**: Apply Style
- **Description**: Applies a specific style (e.g., Heading 1, Normal) to the selection.
- **Ribbon Group**: Styles
- **Shortcut**: `Ctrl+Alt+1` (Heading 1)
- **Target Engine**: `StyleEngine`, `ThemeEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> StyleEngine -> ThemeEngine -> LayoutEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: May be restricted if Corporate Templates lock styles.
- **Telemetry**: Track style popularity.
- **Accessibility**: Announces style name applied.
- **Dependencies**: TemplateEngine.
- **Pseudo Code**:
  ```typescript
  async execute(payload: { styleId: string }) {
    styleEngine.applyStyleHierarchy(context.selection, payload.styleId);
    layoutEngine.reflowDocument();
  }
  ```

---

## 5. INSERT TAB Commands

### Table Command
- **Command ID**: `Cmd_InsertTable`
- **Display Name**: Insert Table
- **Description**: Inserts a table with specified rows and columns.
- **Ribbon Group**: Table
- **Shortcut**: None
- **Target Engine**: `TableEngine`, `ObjectEngine`, `LayoutEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> TableEngine -> ObjectEngine -> LayoutEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: None
- **Telemetry**: Track table dimensions.
- **Accessibility**: Announces table insertion and dimensions.
- **Dependencies**: None.
- **Pseudo Code**:
  ```typescript
  async execute(payload: { rows: number, cols: number }) {
    const tableNode = tableEngine.createTable(payload.rows, payload.cols);
    objectEngine.insertAtSelection(context.selection, tableNode);
    layoutEngine.reflow();
  }
  ```

### Picture Command
- **Command ID**: `Cmd_InsertPicture`
- **Display Name**: Insert Picture
- **Description**: Inserts an image from the local filesystem.
- **Ribbon Group**: Illustrations
- **Shortcut**: None
- **Target Engine**: `ImageEngine`, `MediaEngine`, `LayoutEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> File IO -> ImageEngine -> LayoutEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: Image size limits, malware scanning integration.
- **Telemetry**: Image formats and sizes.
- **Accessibility**: Prompts for Alt Text.
- **Dependencies**: FileSystem API.

*(Note: Applies to Shapes, Charts, Equations, Headers, Footers, Hyperlinks, Cross References, etc.)*

---

## 6. LAYOUT TAB Commands

### Page Margins Command
- **Command ID**: `Cmd_SetMargins`
- **Display Name**: Set Margins
- **Description**: Adjusts the document or section margins.
- **Ribbon Group**: Page Setup
- **Shortcut**: None
- **Target Engine**: `PageSetupEngine`, `LayoutEngine`, `PaginationEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> PageSetupEngine -> PaginationEngine -> RenderEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: Corporate templates may lock margins.
- **Telemetry**: Track margin usage.
- **Accessibility**: Announces margin change.
- **Dependencies**: None.
- **Pseudo Code**:
  ```typescript
  async execute(payload: { top, bottom, left, right }) {
    pageSetupEngine.setMargins(context.selection.section, payload);
    paginationEngine.repaginate(context.selection.section);
  }
  ```

---

## 7. REFERENCES TAB Commands

### Insert TOC Command
- **Command ID**: `Cmd_InsertTOC`
- **Display Name**: Table of Contents
- **Description**: Generates and inserts a Table of Contents based on headings.
- **Ribbon Group**: Table of Contents
- **Shortcut**: None
- **Target Engine**: `FieldEngine`, `ReferenceEngine`, `LayoutEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> ReferenceEngine -> FieldEngine -> LayoutEngine -> HistoryEngine
- **Undo Support**: Yes
- **Redo Support**: Yes
- **Permission Requirement**: Write Access
- **Enterprise Policy**: None
- **Telemetry**: Track TOC generation.
- **Accessibility**: Generates accessible anchor links.
- **Dependencies**: StyleEngine (for heading detection).
- **Pseudo Code**:
  ```typescript
  async execute() {
    const headings = referenceEngine.collectHeadings();
    const tocNode = fieldEngine.generateTOC(headings);
    objectEngine.insertAtSelection(context.selection, tocNode);
    paginationEngine.repaginate();
  }
  ```

---

## 8. REVIEW TAB Commands

### Track Changes Command
- **Command ID**: `Cmd_ToggleTrackChanges`
- **Display Name**: Track Changes
- **Description**: Toggles the recording of document revisions.
- **Ribbon Group**: Tracking
- **Shortcut**: `Ctrl+Shift+E`
- **Target Engine**: `TrackChangesEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> TrackChangesEngine
- **Undo Support**: No (It's a state toggle, not a document mutation)
- **Redo Support**: No
- **Permission Requirement**: Review/Write Access
- **Enterprise Policy**: Forced ON for strict compliance documents via PolicyEngine.
- **Telemetry**: Track usage.
- **Accessibility**: Announces "Track Changes On/Off".
- **Dependencies**: None.
- **Pseudo Code**:
  ```typescript
  async execute() {
    trackChangesEngine.toggle();
  }
  ```

---

## 9. VIEW TAB Commands

### Zoom Command
- **Command ID**: `Cmd_SetZoom`
- **Display Name**: Zoom
- **Description**: Adjusts the viewport magnification.
- **Ribbon Group**: Zoom
- **Shortcut**: `Ctrl + MouseWheel`
- **Target Engine**: `ViewportEngine`, `RenderEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> ViewportEngine -> RenderEngine
- **Undo Support**: No
- **Redo Support**: No
- **Permission Requirement**: Read Access
- **Enterprise Policy**: None
- **Telemetry**: Track zoom levels.
- **Accessibility**: Announces zoom percentage.
- **Dependencies**: None.

---

## 10. FILE TAB Commands

### Export PDF Command
- **Command ID**: `Cmd_ExportPDF`
- **Display Name**: Export to PDF
- **Description**: Renders and saves the document as a PDF file.
- **Ribbon Group**: Export
- **Shortcut**: None
- **Target Engine**: `ExportEngine`, `PaginationEngine`, `RenderEngine`
- **Command Pipeline**: Ribbon -> Command Engine -> ExportEngine -> PaginationEngine -> RenderEngine -> FileSystem
- **Undo Support**: No
- **Redo Support**: No
- **Permission Requirement**: Export Access
- **Enterprise Policy**: Blocked if RightsManagementEngine restricts export.
- **Telemetry**: Track export frequency and document size.
- **Accessibility**: Ensures PDF tagging is generated.
- **Dependencies**: None.

---

## 11. Core Command Flows & Maps

### Validation Flow
Every command passes through `CommandDispatcher.validate()`:
1. Check `RightsManagementEngine` (Can user edit?)
2. Check `PolicyEngine` (Is feature restricted by enterprise?)
3. Check `SelectionEngine` (Is selection valid for this command?)
If false, execution halts, and UI receives a denied event.

### Keyboard Shortcut Map (Registry)
The `CommandRegistry` maps hotkeys to Command IDs.
- `Ctrl+B` -> `Cmd_Bold`
- `Ctrl+Z` -> `Cmd_Undo`
- `Ctrl+Y` -> `Cmd_Redo`
- `Ctrl+S` -> `Cmd_Save`

### Command Serialization
To support Macros and collaborative undo, `ICommand` implementations must return a JSON payload from `.serialize()`.
```json
{
  "id": "Cmd_InsertTable",
  "payload": { "rows": 3, "cols": 3 },
  "user": "user-01",
  "timestamp": 1689345000
}
```

### Plugin Extension Points
Plugins can add commands by calling:
`CommandRegistry.registerCommand(myCustomCommand)`
And binding it to the ribbon via:
`RibbonManager.addButton('myTab', 'myCustomCommand')`

---
*End of WORD_COMMANDS.md*
