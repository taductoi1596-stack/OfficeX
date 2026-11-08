import { OleObject } from './models/OleObject';
import { OleState } from './models/OleState';
import { ObjectAdapter } from './adapters/ObjectAdapter';
import { PreviewGenerator } from './managers/PreviewGenerator';

export class OleManager {
  private objects: Map<string, OleObject> = new Map();
  private adapters: Map<string, ObjectAdapter> = new Map();
  private previewGenerator: PreviewGenerator = new PreviewGenerator();
  
  // Track which object is currently taking over the UI
  private activeObjectId: string | null = null;

  /**
   * Registers a plugin (e.g. Excel Adapter) that knows how to handle a specific MIME type.
   */
  public registerAdapter(adapter: ObjectAdapter): void {
    this.adapters.set(adapter.supportedType, adapter);
  }

  /**
   * Embeds a new object into the host document.
   */
  public async embedObject(obj: OleObject): Promise<void> {
    obj.state = OleState.Loaded;
    
    // Immediately generate a static preview so the host document can render it
    obj.previewImage = await this.previewGenerator.generate(obj);
    obj.state = OleState.Preview;
    
    this.objects.set(obj.id, obj);
  }

  public getObject(id: string): OleObject | undefined {
    return this.objects.get(id);
  }

  /**
   * Called when user double-clicks the static preview.
   * This awakens the heavy engine.
   */
  public activateObject(id: string): void {
    const obj = this.objects.get(id);
    if (!obj) return;
    
    const adapter = this.adapters.get(obj.type);
    if (!adapter) {
      console.warn(`No adapter registered for OLE type: ${obj.type}`);
      return;
    }

    // If another object was active, deactivate it first
    if (this.activeObjectId && this.activeObjectId !== id) {
      this.deactivateObject(this.activeObjectId);
    }

    obj.state = OleState.Activated;
    this.activeObjectId = id;
    
    // Hand over control to the external engine
    adapter.activate(obj.rawData, obj.bounds);
  }

  /**
   * Called when user clicks outside the embedded object's bounds.
   */
  public async deactivateObject(id: string): Promise<void> {
    const obj = this.objects.get(id);
    if (!obj || obj.state !== OleState.Activated) return;
    
    const adapter = this.adapters.get(obj.type);
    if (adapter) {
      // 1. Ask the engine to serialize its new changes
      obj.rawData = adapter.save();
      // 2. Ask the engine to generate a new static thumbnail for the host to display
      obj.previewImage = await adapter.generatePreview();
      // 3. Tell the engine to release UI resources
      adapter.deactivate();
    }

    obj.state = OleState.Closed; // Or back to Preview
    if (this.activeObjectId === id) {
      this.activeObjectId = null;
    }
  }
}
