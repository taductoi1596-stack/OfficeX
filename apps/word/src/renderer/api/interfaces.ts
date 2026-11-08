import { CommandResult } from './types';

// Used for Style/Text
export type Align = 'left' | 'center' | 'right' | 'justify' | 'distributed';

export interface IDocumentAPI {
  New(): Promise<CommandResult>;
  Open(path: string): Promise<CommandResult>;
  Save(): Promise<CommandResult>;
  SaveAs(path: string): Promise<CommandResult>;
  Close(): Promise<CommandResult>;
  Export(format: string): Promise<CommandResult>;
  Import(path: string): Promise<CommandResult>;
  GetMetadata(): Promise<CommandResult<Record<string, string>>>;
  SetMetadata(data: Record<string, string>): Promise<CommandResult>;
}

export interface ITextAPI {
  Insert(text: string): Promise<CommandResult>;
  Delete(): Promise<CommandResult>;
  Replace(oldText: string, newText: string): Promise<CommandResult>;
  Copy(): Promise<CommandResult>;
  Cut(): Promise<CommandResult>;
  Paste(): Promise<CommandResult>;
  Select(start: number, end: number): Promise<CommandResult>;
  GetSelection(): Promise<CommandResult<any>>;
  ClearSelection(): Promise<CommandResult>;
}

export interface IStyleAPI {
  Apply(styleName: string): Promise<CommandResult>;
  Remove(): Promise<CommandResult>;
  Get(): Promise<CommandResult<any>>;
  Create(styleDef: any): Promise<CommandResult>;
  Delete(styleName: string): Promise<CommandResult>;
  Reset(): Promise<CommandResult>;
}

export interface ILayoutAPI {
  Refresh(): Promise<CommandResult>;
  Invalidate(): Promise<CommandResult>;
  Calculate(): Promise<CommandResult>;
  UpdateVisible(): Promise<CommandResult>;
}

export interface IPaginationAPI {
  Rebuild(): Promise<CommandResult>;
  InsertBreak(): Promise<CommandResult>;
  RemoveBreak(): Promise<CommandResult>;
  GetPage(pageNum: number): Promise<CommandResult<any>>;
  GetCount(): Promise<CommandResult<number>>;
}

export interface IRenderAPI {
  Refresh(): Promise<CommandResult>;
  Invalidate(): Promise<CommandResult>;
  RenderPage(pageNum: number): Promise<CommandResult>;
  RenderDocument(): Promise<CommandResult>;
  ExportPDF(path: string): Promise<CommandResult>;
  Print(): Promise<CommandResult>;
}

export interface IViewportAPI {
  Scroll(x: number, y: number): Promise<CommandResult>;
  ScrollTo(elementId: string): Promise<CommandResult>;
  Zoom(level: number): Promise<CommandResult>;
  GoToPage(pageNum: number): Promise<CommandResult>;
  Refresh(): Promise<CommandResult>;
}

export interface ITableAPI {
  Insert(rows: number, cols: number): Promise<CommandResult>;
  Delete(): Promise<CommandResult>;
  Merge(): Promise<CommandResult>;
  Split(): Promise<CommandResult>;
  AutoFit(): Promise<CommandResult>;
  InsertRow(position: 'above' | 'below'): Promise<CommandResult>;
  InsertColumn(position: 'left' | 'right'): Promise<CommandResult>;
  DeleteRow(): Promise<CommandResult>;
  DeleteColumn(): Promise<CommandResult>;
  DeleteTable(): Promise<CommandResult>;
}

export interface IImageAPI {
  Insert(src: string, width?: number, height?: number): Promise<CommandResult>;
  Replace(src: string): Promise<CommandResult>;
  Crop(rect: any): Promise<CommandResult>;
  Resize(width: number, height: number): Promise<CommandResult>;
  Rotate(angle: number): Promise<CommandResult>;
}

export interface IShapeAPI {
  Insert(type: string): Promise<CommandResult>;
  Delete(): Promise<CommandResult>;
  Group(shapeIds: string[]): Promise<CommandResult>;
  Ungroup(groupId: string): Promise<CommandResult>;
  Align(alignment: string): Promise<CommandResult>;
}

export interface IChartAPI {
  Insert(type: string): Promise<CommandResult>;
  Edit(chartId: string): Promise<CommandResult>;
  ChangeType(chartId: string, newType: string): Promise<CommandResult>;
  UpdateData(chartId: string, data: any): Promise<CommandResult>;
}

export interface ISmartArtAPI {
  Insert(type: string): Promise<CommandResult>;
  Convert(smartArtId: string, targetType: string): Promise<CommandResult>;
  Update(smartArtId: string, data: any): Promise<CommandResult>;
}

export interface IEquationAPI {
  Insert(latex: string): Promise<CommandResult>;
  Edit(equationId: string): Promise<CommandResult>;
  Convert(equationId: string, format: string): Promise<CommandResult>;
}

export interface IHeaderFooterAPI {
  SetHeader(content: string): Promise<CommandResult>;
  SetFooter(content: string): Promise<CommandResult>;
  ClearHeader(): Promise<CommandResult>;
  ClearFooter(): Promise<CommandResult>;
  InsertPageNumber(): Promise<CommandResult>;
  InsertField(field: string): Promise<CommandResult>;
}

export interface ICommentAPI {
  Add(text: string): Promise<CommandResult>;
  Edit(commentId: string, text: string): Promise<CommandResult>;
  Delete(commentId: string): Promise<CommandResult>;
  Resolve(commentId: string): Promise<CommandResult>;
}

export interface ITrackChangesAPI {
  Enable(): Promise<CommandResult>;
  Disable(): Promise<CommandResult>;
  Accept(changeId: string): Promise<CommandResult>;
  Reject(changeId: string): Promise<CommandResult>;
  AcceptAll(): Promise<CommandResult>;
  RejectAll(): Promise<CommandResult>;
}

export interface IBookmarkAPI {
  Add(name: string): Promise<CommandResult>;
  Remove(name: string): Promise<CommandResult>;
  GoTo(name: string): Promise<CommandResult>;
}

export interface IAIAPI {
  Summarize(text: string): Promise<CommandResult<string>>;
  Translate(text: string, lang: string): Promise<CommandResult<string>>;
  Rewrite(text: string): Promise<CommandResult<string>>;
  Explain(text: string): Promise<CommandResult<string>>;
  Review(text: string): Promise<CommandResult<string>>;
  Chat(prompt: string): Promise<CommandResult<string>>;
}

export interface IPluginAPI {
  Execute(pluginId: string, action: string, args: any): Promise<CommandResult>;
  Register(pluginDef: any): Promise<CommandResult>;
  Unregister(pluginId: string): Promise<CommandResult>;
  GetCommands(): Promise<CommandResult<any[]>>;
}
