import { createSuccessResult, CommandResult } from './types';
import * as Interfaces from './interfaces';

const stub = async <T = any>(payload?: T): Promise<CommandResult<T>> => createSuccessResult(payload);

export const DocumentStub: Interfaces.IDocumentAPI = {
  New: async () => stub(),
  Open: async () => stub(),
  Save: async () => stub(),
  SaveAs: async () => stub(),
  Close: async () => stub(),
  Export: async () => stub(),
  Import: async () => stub(),
  GetMetadata: async () => stub({}),
  SetMetadata: async () => stub()
};

export const TextStub: Interfaces.ITextAPI = {
  Insert: async () => stub(),
  Delete: async () => stub(),
  Replace: async () => stub(),
  Copy: async () => stub(),
  Cut: async () => stub(),
  Paste: async () => stub(),
  Select: async () => stub(),
  GetSelection: async () => stub(),
  ClearSelection: async () => stub()
};

export const StyleStub: Interfaces.IStyleAPI = {
  Apply: async () => stub(),
  Remove: async () => stub(),
  Get: async () => stub(),
  Create: async () => stub(),
  Delete: async () => stub(),
  Reset: async () => stub()
};

export const LayoutStub: Interfaces.ILayoutAPI = {
  Refresh: async () => stub(),
  Invalidate: async () => stub(),
  Calculate: async () => stub(),
  UpdateVisible: async () => stub()
};

export const PaginationStub: Interfaces.IPaginationAPI = {
  Rebuild: async () => stub(),
  InsertBreak: async () => stub(),
  RemoveBreak: async () => stub(),
  GetPage: async () => stub({}),
  GetCount: async () => stub(1)
};

export const RenderStub: Interfaces.IRenderAPI = {
  Refresh: async () => stub(),
  Invalidate: async () => stub(),
  RenderPage: async () => stub(),
  RenderDocument: async () => stub(),
  ExportPDF: async () => stub(),
  Print: async () => stub()
};

export const ViewportStub: Interfaces.IViewportAPI = {
  Scroll: async () => stub(),
  ScrollTo: async () => stub(),
  Zoom: async () => stub(),
  GoToPage: async () => stub(),
  Refresh: async () => stub()
};

export const TableStub: Interfaces.ITableAPI = {
  Insert: async () => stub(),
  Delete: async () => stub(),
  Merge: async () => stub(),
  Split: async () => stub(),
  AutoFit: async () => stub(),
  InsertRow: async () => stub(),
  InsertColumn: async () => stub(),
  DeleteRow: async () => stub(),
  DeleteColumn: async () => stub(),
  DeleteTable: async () => stub(),
};

export const ImageStub: Interfaces.IImageAPI = {
  Insert: async () => stub(),
  Replace: async () => stub(),
  Crop: async () => stub(),
  Resize: async () => stub(),
  Rotate: async () => stub()
};

export const ShapeStub: Interfaces.IShapeAPI = {
  Insert: async () => stub(),
  Delete: async () => stub(),
  Group: async () => stub(),
  Ungroup: async () => stub(),
  Align: async () => stub()
};

export const ChartStub: Interfaces.IChartAPI = {
  Insert: async () => stub(),
  Edit: async () => stub(),
  ChangeType: async () => stub(),
  UpdateData: async () => stub()
};

export const SmartArtStub: Interfaces.ISmartArtAPI = {
  Insert: async () => stub(),
  Convert: async () => stub(),
  Update: async () => stub()
};

export const EquationStub: Interfaces.IEquationAPI = {
  Insert: async () => stub(),
  Edit: async () => stub(),
  Convert: async () => stub()
};

export const HeaderFooterStub: Interfaces.IHeaderFooterAPI = {
  SetHeader: async () => stub(),
  SetFooter: async () => stub(),
  ClearHeader: async () => stub(),
  ClearFooter: async () => stub(),
  InsertPageNumber: async () => stub(),
  InsertField: async () => stub()
};

export const CommentStub: Interfaces.ICommentAPI = {
  Add: async () => stub(),
  Edit: async () => stub(),
  Delete: async () => stub(),
  Resolve: async () => stub()
};

export const TrackChangesStub: Interfaces.ITrackChangesAPI = {
  Enable: async () => stub(),
  Disable: async () => stub(),
  Accept: async () => stub(),
  Reject: async () => stub(),
  AcceptAll: async () => stub(),
  RejectAll: async () => stub()
};

export const BookmarkStub: Interfaces.IBookmarkAPI = {
  Add: async () => stub(),
  Remove: async () => stub(),
  GoTo: async () => stub()
};

export const AIStub: Interfaces.IAIAPI = {
  Summarize: async () => stub(''),
  Translate: async () => stub(''),
  Rewrite: async () => stub(''),
  Explain: async () => stub(''),
  Review: async () => stub(''),
  Chat: async () => stub('')
};

export const PluginStub: Interfaces.IPluginAPI = {
  Execute: async () => stub(),
  Register: async () => stub(),
  Unregister: async () => stub(),
  GetCommands: async () => stub([])
};
