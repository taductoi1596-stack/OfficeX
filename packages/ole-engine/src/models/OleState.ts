/**
 * Represents the lifecycle state of an embedded OLE object.
 */
export enum OleState {
  /** The object is created but data hasn't been loaded into memory */
  Created = 'created',
  
  /** Metadata and bounding box are loaded, but the heavy engine is not */
  Loaded = 'loaded',
  
  /** 
   * The default visible state. 
   * Displays a static preview image to save RAM/CPU.
   */
  Preview = 'preview',
  
  /** 
   * The object is actively being edited. 
   * The heavy host engine (e.g. Excel) is loaded into memory and takes over the UI.
   */
  Activated = 'activated',
  
  /** The object is closed and changes are serialized back to the host document */
  Closed = 'closed'
}
