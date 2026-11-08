import { PageSetup, Caret } from '../document/DocumentTypes';
import { LayoutLine } from '../layout/LayoutTypes';

export interface PageBox {
  pageIdx: number;
  lines: LayoutLine[];
  globalTop: number;
  section: import('../section/SectionTypes').DocSection;
  headerLayout?: import('../layout/LayoutTypes').LayoutResult;
  footerLayout?: import('../layout/LayoutTypes').LayoutResult;
}

export interface PrintableArea {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export type PaginationEventType = 'PageCreated' | 'PageDeleted' | 'PageReflow';

export interface PaginationEvent {
  type: PaginationEventType;
  pageIdx?: number;
  totalPages?: number;
}
