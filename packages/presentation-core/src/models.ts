export interface PresentationModel { id: string; title: string; slides: SlideModel[]; }
export interface SlideModel { id: string; order: number; shapes: ShapeModel[]; }
export interface ShapeModel { id: string; type: 'text' | 'image' | 'shape'; x: number; y: number; width: number; height: number; content: any; }
