import { Point2D, UnitType, Matrix3x3, Rect2D } from './CoordinateTypes';

export class CoordinateEngine {
  private static instance: CoordinateEngine;

  private dpiX: number = 96;
  private dpiY: number = 96;

  private constructor() {}

  public static get(): CoordinateEngine {
    if (!CoordinateEngine.instance) {
      CoordinateEngine.instance = new CoordinateEngine();
    }
    return CoordinateEngine.instance;
  }

  public Initialize(dpiX: number = 96, dpiY: number = 96) {
    this.dpiX = dpiX;
    this.dpiY = dpiY;
  }

  // ── Unit Conversion Engine ───────────────────────────────────────

  public ConvertUnit(value: number, from: UnitType, to: UnitType): number {
    if (from === to) return value;
    const valueInInches = this.toInches(value, from);
    return this.fromInches(valueInInches, to);
  }

  private toInches(value: number, unit: UnitType): number {
    switch (unit) {
      case 'inch': return value;
      case 'pixel': return value / this.dpiX; // Using horizontal DPI as base
      case 'dip': return value / 96; // Device Independent Pixel (96 per inch)
      case 'point': return value / 72;
      case 'twip': return value / 1440;
      case 'emu': return value / 914400;
      case 'mm': return value / 25.4;
      case 'cm': return value / 2.54;
      case 'pica': return value / 6;
      default: return value;
    }
  }

  private fromInches(value: number, unit: UnitType): number {
    switch (unit) {
      case 'inch': return value;
      case 'pixel': return value * this.dpiX;
      case 'dip': return value * 96;
      case 'point': return value * 72;
      case 'twip': return value * 1440;
      case 'emu': return value * 914400;
      case 'mm': return value * 25.4;
      case 'cm': return value * 2.54;
      case 'pica': return value * 6;
      default: return value;
    }
  }

  // ── Matrix Engine ────────────────────────────────────────────────

  public GetIdentityMatrix(): Matrix3x3 {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }

  public Translate(m: Matrix3x3, tx: number, ty: number): Matrix3x3 {
    return [
      m[0], m[1], m[2] + tx,
      m[3], m[4], m[5] + ty,
      m[6], m[7], m[8]
    ];
  }

  public Scale(m: Matrix3x3, sx: number, sy: number): Matrix3x3 {
    return [
      m[0] * sx, m[1] * sx, m[2] * sx,
      m[3] * sy, m[4] * sy, m[5] * sy,
      m[6], m[7], m[8]
    ];
  }

  public Rotate(m: Matrix3x3, angleRad: number): Matrix3x3 {
    const c = Math.cos(angleRad);
    const s = Math.sin(angleRad);
    return [
      m[0]*c - m[3]*s, m[1]*c - m[4]*s, m[2]*c - m[5]*s,
      m[0]*s + m[3]*c, m[1]*s + m[4]*c, m[2]*s + m[5]*c,
      m[6], m[7], m[8]
    ];
  }

  public Transform(m: Matrix3x3, pt: Point2D): Point2D {
    return {
      x: m[0] * pt.x + m[1] * pt.y + m[2],
      y: m[3] * pt.x + m[4] * pt.y + m[5]
    };
  }

  public InverseTransform(m: Matrix3x3, pt: Point2D): Point2D {
    const det = m[0] * m[4] - m[1] * m[3];
    if (Math.abs(det) < 1e-6) return pt; // singular matrix fallback
    
    // Compute inverse components for a 2D affine transform matrix
    const inv0 = m[4] / det;
    const inv1 = -m[1] / det;
    const inv2 = (m[1] * m[5] - m[2] * m[4]) / det;
    const inv3 = -m[3] / det;
    const inv4 = m[0] / det;
    const inv5 = (m[2] * m[3] - m[0] * m[5]) / det;

    return {
      x: inv0 * pt.x + inv1 * pt.y + inv2,
      y: inv3 * pt.x + inv4 * pt.y + inv5
    };
  }

  // ── Coordinate Mapping Engine ────────────────────────────────────

  public ScreenToWindow(screenPt: Point2D, windowOffset: Point2D): Point2D {
    return { x: screenPt.x - windowOffset.x, y: screenPt.y - windowOffset.y };
  }

  public WindowToScreen(windowPt: Point2D, windowOffset: Point2D): Point2D {
    return { x: windowPt.x + windowOffset.x, y: windowPt.y + windowOffset.y };
  }

  public WindowToViewport(windowPt: Point2D, containerRect: DOMRect): Point2D {
    return { x: windowPt.x - containerRect.left, y: windowPt.y - containerRect.top };
  }

  public ViewportToWindow(viewportPt: Point2D, containerRect: DOMRect): Point2D {
    return { x: viewportPt.x + containerRect.left, y: viewportPt.y + containerRect.top };
  }

  public ViewportToCanvas(viewportPt: Point2D, zoom: number): Point2D {
    return { x: viewportPt.x / zoom, y: viewportPt.y / zoom };
  }

  public CanvasToViewport(canvasPt: Point2D, zoom: number): Point2D {
    return { x: canvasPt.x * zoom, y: canvasPt.y * zoom };
  }

  public CanvasToPage(canvasPt: Point2D, pageIdx: number, pageTotalHeight: number): Point2D {
    return { x: canvasPt.x, y: canvasPt.y - pageIdx * pageTotalHeight };
  }

  public PageToCanvas(pagePt: Point2D, pageIdx: number, pageTotalHeight: number): Point2D {
    return { x: pagePt.x, y: pagePt.y + pageIdx * pageTotalHeight };
  }

  public PageToDocument(pagePt: Point2D, pageMargins: { top: number, left: number }): Point2D {
    return { x: pagePt.x - pageMargins.left, y: pagePt.y - pageMargins.top };
  }

  public DocumentToPage(docPt: Point2D, pageMargins: { top: number, left: number }): Point2D {
    return { x: docPt.x + pageMargins.left, y: docPt.y + pageMargins.top };
  }

  // Combined convenience mappers
  public ScreenToDocument(
    screenX: number, screenY: number, 
    containerRect: DOMRect, zoom: number, 
    pageIdx: number, pageTotalHeight: number, 
    pageMargins: { top: number, left: number }
  ): Point2D {
    const windowPt = { x: screenX, y: screenY }; // Assuming screenX is clientX (window relative)
    const viewportPt = this.WindowToViewport(windowPt, containerRect);
    const canvasPt = this.ViewportToCanvas(viewportPt, zoom);
    const pagePt = this.CanvasToPage(canvasPt, pageIdx, pageTotalHeight);
    return this.PageToDocument(pagePt, pageMargins);
  }

  public ClearCache() {
    // TBD: Placeholder for Matrix/Coordinate cache flushes
  }
}
