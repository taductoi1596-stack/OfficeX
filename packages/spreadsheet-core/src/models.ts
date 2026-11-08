export interface WorkbookModel { id: string; name: string; sheets: SheetModel[]; }
export interface SheetModel { id: string; name: string; cells: Record<string, CellModel>; }
export interface CellModel { value: string; formula?: string; format?: any; }
