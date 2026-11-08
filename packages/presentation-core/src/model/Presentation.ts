import { v4 as uuidv4 } from 'uuid';

export type ShapeType = 
  | string
  | 'text' 
  | 'image' 
  | 'shape' 
  | 'rectangle' 
  | 'rounded-rect' 
  | 'circle' 
  | 'triangle' 
  | 'star' 
  | 'arrow-right' 
  | 'arrow-left' 
  | 'line' 
  | 'diamond' 
  | 'heart';

export type SlideLayout = 
  | 'title' 
  | 'titleAndContent' 
  | 'sectionHeader' 
  | 'twoContent' 
  | 'comparison' 
  | 'titleOnly' 
  | 'blank';

export interface ShapeFormat {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  highlightColor?: string;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  bullet?: boolean;
  numbering?: boolean;
  shapeType?: string;
  opacity?: number;
  rotation?: number;
  zIndex?: number;
  isTitle?: boolean;
  isSubtitle?: boolean;
  isContent?: boolean;
}

export interface ShapeAnimation {
  id: string;
  type: string;
  category: 'entrance' | 'emphasis' | 'exit' | 'motion';
  effectOption?: string;
  duration: number;
  delay: number;
  trigger: 'onClick' | 'withPrev' | 'afterPrev';
}

export class Shape {
  public id: string;
  public type: ShapeType;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public content: any;
  public format: ShapeFormat = {
    fontFamily: 'Inter',
    fontSize: 18,
    color: '#1e293b',
    textAlign: 'left',
    fillColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    opacity: 1,
  };

  public imageUrl?: string;
  public tableData?: string[][];
  public chartData?: any;
  public videoUrl?: string;
  public audioUrl?: string;
  public animation?: ShapeAnimation;

  constructor(
    type: ShapeType = 'text', 
    x: number = 100, 
    y: number = 100, 
    width: number = 300, 
    height: number = 150, 
    content: any = null,
    format?: Partial<ShapeFormat>,
    imageUrl?: string,
    tableData?: string[][],
    chartData?: any
  ) {
    this.id = uuidv4();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.content = content;
    this.imageUrl = imageUrl;
    this.tableData = tableData;
    this.chartData = chartData;
    if (format) {
      this.format = { ...this.format, ...format };
    }
  }

  public clone(): Shape {
    const s = new Shape(this.type, this.x + 20, this.y + 20, this.width, this.height, this.content, { ...this.format }, this.imageUrl, this.tableData ? JSON.parse(JSON.stringify(this.tableData)) : undefined, this.chartData ? JSON.parse(JSON.stringify(this.chartData)) : undefined);
    s.videoUrl = this.videoUrl;
    s.audioUrl = this.audioUrl;
    if (this.animation) s.animation = { ...this.animation };
    return s;
  }
}

export interface SlideTransition {
  type: string;
  effectOption?: string;
  duration: number;
  sound?: string;
  advanceOnClick: boolean;
  advanceAfterSeconds?: number;
}

export class Slide {
  public id: string;
  public shapes: Shape[] = [];
  public order: number;
  public layout: SlideLayout = 'titleAndContent';
  public background: string = '#ffffff';
  public isHidden: boolean = false;
  public notes: string = '';
  public transition: SlideTransition = {
    type: 'none',
    duration: 1.0,
    sound: 'none',
    advanceOnClick: true,
  };

  constructor(order: number, layout: SlideLayout = 'titleAndContent') {
    this.id = uuidv4();
    this.order = order;
    this.layout = layout;
  }

  public addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  public removeShape(id: string) {
    this.shapes = this.shapes.filter(s => s.id !== id);
  }

  public clone(newOrder: number): Slide {
    const newSlide = new Slide(newOrder, this.layout);
    newSlide.background = this.background;
    newSlide.isHidden = this.isHidden;
    newSlide.notes = this.notes;
    newSlide.transition = { ...this.transition };
    newSlide.shapes = this.shapes.map(s => {
      const clone = s.clone();
      clone.x = s.x;
      clone.y = s.y;
      return clone;
    });
    return newSlide;
  }

  public applyLayout(layout: SlideLayout) {
    this.layout = layout;
    this.shapes = [];

    switch (layout) {
      case 'title': {
        const title = new Shape('text', 100, 140, 760, 120, 'Click to add title', {
          fontSize: 44,
          bold: true,
          textAlign: 'center',
          color: '#0f172a',
          isTitle: true,
        });
        const subtitle = new Shape('text', 140, 290, 680, 80, 'Click to add subtitle', {
          fontSize: 24,
          textAlign: 'center',
          color: '#64748b',
          isSubtitle: true,
        });
        this.addShape(title);
        this.addShape(subtitle);
        break;
      }
      case 'titleAndContent': {
        const title = new Shape('text', 60, 40, 840, 70, 'Click to add title', {
          fontSize: 36,
          bold: true,
          textAlign: 'left',
          color: '#0f172a',
          isTitle: true,
        });
        const content = new Shape('text', 60, 130, 840, 360, '• Click to add text\n• Click to add text\n• Click to add text', {
          fontSize: 20,
          textAlign: 'left',
          color: '#334155',
          isContent: true,
          bullet: true,
        });
        this.addShape(title);
        this.addShape(content);
        break;
      }
      case 'twoContent': {
        const title = new Shape('text', 60, 40, 840, 70, 'Click to add title', {
          fontSize: 36,
          bold: true,
          textAlign: 'left',
          color: '#0f172a',
          isTitle: true,
        });
        const col1 = new Shape('text', 60, 130, 400, 360, '• First column point 1\n• First column point 2', {
          fontSize: 18,
          textAlign: 'left',
          color: '#334155',
          isContent: true,
          bullet: true,
        });
        const col2 = new Shape('text', 500, 130, 400, 360, '• Second column point 1\n• Second column point 2', {
          fontSize: 18,
          textAlign: 'left',
          color: '#334155',
          isContent: true,
          bullet: true,
        });
        this.addShape(title);
        this.addShape(col1);
        this.addShape(col2);
        break;
      }
      case 'comparison': {
        const title = new Shape('text', 60, 30, 840, 60, 'Comparison Title', {
          fontSize: 32,
          bold: true,
          textAlign: 'left',
          color: '#0f172a',
        });
        const sub1 = new Shape('text', 60, 100, 400, 40, 'Option A', {
          fontSize: 20,
          bold: true,
          textAlign: 'center',
          fillColor: '#f1f5f9',
          color: '#0f172a',
        });
        const col1 = new Shape('text', 60, 150, 400, 340, '• Feature 1\n• Feature 2\n• Advantage', {
          fontSize: 16,
          color: '#334155',
          bullet: true,
        });
        const sub2 = new Shape('text', 500, 100, 400, 40, 'Option B', {
          fontSize: 20,
          bold: true,
          textAlign: 'center',
          fillColor: '#f1f5f9',
          color: '#0f172a',
        });
        const col2 = new Shape('text', 500, 150, 400, 340, '• Feature 1\n• Feature 2\n• Advantage', {
          fontSize: 16,
          color: '#334155',
          bullet: true,
        });
        this.addShape(title);
        this.addShape(sub1);
        this.addShape(col1);
        this.addShape(sub2);
        this.addShape(col2);
        break;
      }
      case 'sectionHeader': {
        const section = new Shape('text', 80, 200, 800, 100, 'Section Title', {
          fontSize: 48,
          bold: true,
          textAlign: 'left',
          color: '#d97706',
        });
        const desc = new Shape('text', 80, 310, 800, 60, 'Section description goes here', {
          fontSize: 20,
          textAlign: 'left',
          color: '#64748b',
        });
        this.addShape(section);
        this.addShape(desc);
        break;
      }
      case 'titleOnly': {
        const title = new Shape('text', 60, 50, 840, 80, 'Click to add title', {
          fontSize: 36,
          bold: true,
          textAlign: 'left',
          color: '#0f172a',
          isTitle: true,
        });
        this.addShape(title);
        break;
      }
      case 'blank':
      default:
        break;
    }
  }
}

export class Presentation {
  public id: string;
  public title: string;
  public slides: Slide[] = [];
  public activeSlideId: string | null = null;

  constructor(title: string = 'Presentation 1') {
    this.id = uuidv4();
    this.title = title;
  }

  public addSlide(layout: SlideLayout = 'titleAndContent'): Slide {
    const slide = new Slide(this.slides.length, layout);
    slide.applyLayout(layout);
    this.slides.push(slide);
    this.activeSlideId = slide.id;
    return slide;
  }

  public duplicateSlide(id: string): Slide | null {
    const index = this.slides.findIndex(s => s.id === id);
    if (index === -1) return null;
    const original = this.slides[index];
    const cloned = original.clone(index + 1);
    this.slides.splice(index + 1, 0, cloned);
    this.activeSlideId = cloned.id;
    this.reindexSlides();
    return cloned;
  }

  public reindexSlides() {
    this.slides.forEach((s, idx) => s.order = idx);
  }

  public moveSlide(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= this.slides.length || toIndex < 0 || toIndex >= this.slides.length) return;
    const [moved] = this.slides.splice(fromIndex, 1);
    this.slides.splice(toIndex, 0, moved);
    this.reindexSlides();
  }

  public getActiveSlide(): Slide | null {
    return this.slides.find(s => s.id === this.activeSlideId) || (this.slides.length > 0 ? this.slides[0] : null);
  }

  public removeSlide(id: string) {
    const idx = this.slides.findIndex(s => s.id === id);
    this.slides = this.slides.filter(s => s.id !== id);
    if (this.activeSlideId === id) {
      if (this.slides.length > 0) {
        const nextIdx = Math.min(idx, this.slides.length - 1);
        this.activeSlideId = this.slides[nextIdx].id;
      } else {
        this.activeSlideId = null;
      }
    }
    this.reindexSlides();
  }

  public serialize(): string {
    return JSON.stringify(this);
  }

  public static deserialize(json: string): Presentation {
    const p = new Presentation();
    try {
      const data = JSON.parse(json);
      p.id = data.id || p.id;
      p.title = data.title || p.title;
      p.activeSlideId = data.activeSlideId;
      if (data.slides && data.slides.length > 0) {
        p.slides = data.slides.map((sData: any) => {
          const slide = new Slide(sData.order, sData.layout || 'titleAndContent');
          slide.id = sData.id;
          slide.background = sData.background || '#ffffff';
          if (sData.shapes) {
            slide.shapes = sData.shapes.map((shapeData: any) => {
              const shape = new Shape(
                shapeData.type, 
                shapeData.x, 
                shapeData.y, 
                shapeData.width, 
                shapeData.height, 
                shapeData.content,
                shapeData.format || {}
              );
              shape.id = shapeData.id;
              return shape;
            });
          }
          return slide;
        });
      }
    } catch (e) {
      console.error('Failed to deserialize presentation', e);
    }
    return p;
  }
}
