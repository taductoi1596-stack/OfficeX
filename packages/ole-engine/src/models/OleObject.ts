import { OleState } from './OleState';

export class OleObject {
  public id: string;
  
  // The MIME type or generic identifier of the embedded app (e.g. 'application/vnd.ms-excel')
  public type: string;
  
  // The current lifecycle state
  public state: OleState = OleState.Created;
  
  // Base64 encoded binary data of the original file (e.g. the .xlsx file content)
  public rawData: string = '';
  
  // A static image (base64) used when in Preview state
  public previewImage: string | null = null;
  
  // Bounding box within the host document
  public bounds: { width: number, height: number } = { width: 400, height: 300 };

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}
