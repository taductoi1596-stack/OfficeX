/**
 * The contract that any external engine (Word, Excel, PDF Viewer) must implement
 * to be embeddable within OfficeX as an OLE Object.
 */
export interface ObjectAdapter {
  /** The MIME type this adapter can handle */
  supportedType: string;
  
  /** Called when the user double clicks the static preview */
  activate(data: string, bounds: { width: number, height: number }): void;
  
  /** Called when the user clicks outside the object to stop editing */
  deactivate(): void;
  
  /** Ask the external engine to serialize its current state back into a binary blob */
  save(): string;
  
  /** Ask the external engine to render a quick static thumbnail of its current state */
  generatePreview(): Promise<string>;
}
