import React, { useState, useRef } from 'react';
import * as I from 'lucide-react';
import { ColorPicker } from '@officex/ui';

interface DrawingModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function DrawingModal({ onClose, onSave }: DrawingModalProps) {
  type ShapeInfo = {
    id: number;
    type: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    text?: string;
    fill?: string;
    stroke?: string;
    points?: {x: number, y: number}[];
    fontFamily?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    textColor?: string;
    opacity?: number;
    strokeWidth?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
  };

  const [activeTab, setActiveTab] = useState<'insert' | 'draw' | 'shape' | 'text'>('insert');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedShapeType, setSelectedShapeType] = useState<number | null>(null);
  const [shapes, setShapes] = useState<ShapeInfo[]>([]);
  const [drawingShape, setDrawingShape] = useState<ShapeInfo | null>(null);
  const [selectedCanvasShapeId, setSelectedCanvasShapeId] = useState<number | null>(null);
  const [clipboardShape, setClipboardShape] = useState<ShapeInfo | null>(null);
  const [rotatingState, setRotatingState] = useState<{ id: number, centerX: number, centerY: number, startAngle: number, initialRotation: number } | null>(null);
  const [resizingState, setResizingState] = useState<{ id: number, handle: string, startX: number, startY: number, initialX: number, initialY: number, initialW: number, initialH: number, initialRotation: number } | null>(null);
  const [movingState, setMovingState] = useState<{ id: number, startX: number, startY: number, initialX: number, initialY: number } | null>(null);
  
  const [activeDrawTool, setActiveDrawTool] = useState<'select' | 'lasso' | 'eraser' | 'pen1' | 'pen2' | 'highlighter'>('select');
  const [drawColor, setDrawColor] = useState({ pen1: '#000000', pen2: '#ff0000', highlighter: '#ffff00' });
  const [isDrawingFreehand, setIsDrawingFreehand] = useState(false);
  const [freehandPoints, setFreehandPoints] = useState<{x: number, y: number}[]>([]);
  const freehandPointsRef = useRef<{x: number, y: number}[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const isShapeSelected = selectedCanvasShapeId !== null;
  const currentShape = shapes.find(s => s.id === selectedCanvasShapeId);

  const toggleTextProp = (prop: keyof ShapeInfo) => {
    if (!selectedCanvasShapeId) return;
    setShapes(shapes.map(s => {
      if (s.id === selectedCanvasShapeId) {
        return { ...s, [prop]: !s[prop] };
      }
      return s;
    }));
  };

  React.useEffect(() => {
    if (selectedCanvasShapeId) {
      setActiveTab('shape');
    } else {
      setActiveTab(prev => prev === 'shape' ? 'insert' : prev);
    }
  }, [selectedCanvasShapeId]);

  const handleUndo = React.useCallback(() => {
    setShapes(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
    setSelectedCanvasShapeId(null);
  }, []);

  const handleCut = React.useCallback(() => {
    if (!selectedCanvasShapeId) return;
    setShapes(prev => {
      const target = prev.find(s => s.id === selectedCanvasShapeId);
      if (target) setClipboardShape(target);
      return prev.filter(s => s.id !== selectedCanvasShapeId);
    });
    setSelectedCanvasShapeId(null);
  }, [selectedCanvasShapeId]);

  const handleCopy = React.useCallback(() => {
    if (!selectedCanvasShapeId) return;
    setShapes(prev => {
      const target = prev.find(s => s.id === selectedCanvasShapeId);
      if (target) setClipboardShape(target);
      return prev;
    });
  }, [selectedCanvasShapeId]);

  const handlePaste = React.useCallback(() => {
    if (!clipboardShape) return;
    const newShape = {
      ...clipboardShape,
      id: Date.now(),
      x: clipboardShape.x + 20,
      y: clipboardShape.y + 20
    };
    setShapes(prev => [...prev, newShape]);
    setSelectedCanvasShapeId(newShape.id);
  }, [clipboardShape]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        handleCut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        handlePaste();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCanvasShapeId) {
          setShapes(prev => prev.filter(s => s.id !== selectedCanvasShapeId));
          setSelectedCanvasShapeId(null);
        }
      } else if (e.key === 'Escape') {
        setSelectedShapeType(null);
        setSelectedCanvasShapeId(null);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleCopy, handleCut, handlePaste, selectedCanvasShapeId]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const renderShapeMenu = (onSelectShape?: (type: number, uniqueId: string) => void) => {
    const categories = [
      { title: 'Hình Gần đây', items: [0, 1, 2, 8, 4, 11] },
      { title: 'Đường', items: [8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
      { title: 'Hình chữ nhật', items: [0, 11, 23, 24, 25, 26, 27, 28, 29] },
      { title: 'Hình Cơ bản', items: [6, 1, 2, 3, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57] },
      { title: 'Mũi tên Hình khối', items: [5, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76] },
      { title: 'Hình Phương trình', items: [77, 78, 79, 80, 81, 82] },
      { title: 'Lưu đồ', items: [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108] },
      { title: 'Sao và Biểu ngữ', items: [4, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123] }
    ];

    const getIcon = (type: number) => {
      // Map to basic icons for mockup purposes since we only have SVGs for 0-6 right now
      const mapped = type <= 6 ? type : type % 6;
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.2">
          {mapped === 0 && <rect x="4" y="4" width="16" height="16" />}
          {mapped === 1 && <circle cx="12" cy="12" r="8" />}
          {mapped === 2 && <polygon points="12 4 20 20 4 20" />}
          {mapped === 3 && <path d="M4 4l16 16M20 20l-4 0M20 20l0 -4" />}
          {mapped === 4 && <polygon points="12 3 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9" />}
          {mapped === 5 && <path d="M4 12h16M20 12l-4-4M20 12l-4 4" />}
          {mapped === 6 && <path d="M6 6L18 6M12 6L12 18M8 18L16 18" />}
        </svg>
      );
    };

    return (
      <div className="flex flex-col gap-3">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="text-[12px] font-semibold text-slate-700 mb-1">{cat.title}</div>
            <div className="flex flex-wrap gap-1">
              {cat.items.map((type, i) => {
                const uniqueId = `shape-${idx}-${i}`;
                return (
                  <div 
                    key={uniqueId} 
                    className={`w-[24px] h-[24px] border ${selectedShapeId === uniqueId ? 'border-blue-600 bg-blue-100' : 'border-transparent hover:border-blue-400 hover:bg-blue-50'} flex items-center justify-center cursor-pointer`}
                    onClick={() => {
                      if (onSelectShape) {
                        onSelectShape(type, uniqueId);
                      } else {
                        setSelectedShapeId(uniqueId);
                        setSelectedShapeType(type <= 6 ? type : type % 6);
                        setActiveDropdown(null);
                      }
                    }}
                  >
                    {getIcon(type)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getViewportPos = (x: number, y: number, w: number, h: number, rotDeg: number, ox: number, oy: number) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rot = rotDeg * (Math.PI / 180);
    const lx = (ox - 0.5) * w;
    const ly = (oy - 0.5) * h;
    return {
      vx: cx + lx * Math.cos(rot) - ly * Math.sin(rot),
      vy: cy + lx * Math.sin(rot) + ly * Math.cos(rot)
    };
  };

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rotatingState) {
        const angle = Math.atan2(e.clientY - rotatingState.centerY, e.clientX - rotatingState.centerX) * (180 / Math.PI);
        const deltaAngle = angle - rotatingState.startAngle;
        setShapes(prev => prev.map(s => s.id === rotatingState.id ? { ...s, rotation: rotatingState.initialRotation + deltaAngle } : s));
      }
      if (movingState) {
        const dx = e.clientX - movingState.startX;
        const dy = e.clientY - movingState.startY;
        setShapes(prev => prev.map(s => s.id === movingState.id ? { ...s, x: movingState.initialX + dx, y: movingState.initialY + dy } : s));
      }
      if (resizingState) {
        const { id, handle, startX, startY, initialX, initialY, initialW, initialH, initialRotation } = resizingState;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const rot = initialRotation * (Math.PI / 180);
        const localDx = dx * Math.cos(rot) + dy * Math.sin(rot);
        const localDy = -dx * Math.sin(rot) + dy * Math.cos(rot);

        let newW = initialW;
        let newH = initialH;

        if (handle.includes('e')) newW = Math.max(5, initialW + localDx);
        if (handle.includes('w')) newW = Math.max(5, initialW - localDx);
        if (handle.includes('s')) newH = Math.max(5, initialH + localDy);
        if (handle.includes('n')) newH = Math.max(5, initialH - localDy);

        let ox = 0.5, oy = 0.5;
        if (handle.includes('e')) ox = 0;
        if (handle.includes('w')) ox = 1;
        if (handle.includes('s')) oy = 0;
        if (handle.includes('n')) oy = 1;

        const oldVP = getViewportPos(initialX, initialY, initialW, initialH, initialRotation, ox, oy);
        
        const lx = (ox - 0.5) * newW;
        const ly = (oy - 0.5) * newH;
        
        const newCx = oldVP.vx - (lx * Math.cos(rot) - ly * Math.sin(rot));
        const newCy = oldVP.vy - (lx * Math.sin(rot) + ly * Math.cos(rot));
        
        const newX = newCx - newW / 2;
        const newY = newCy - newH / 2;

        setShapes(prev => prev.map(s => s.id === id ? { ...s, x: newX, y: newY, width: newW, height: newH } : s));
      }
    };
    
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (rotatingState) {
        const angle = Math.atan2(e.clientY - rotatingState.centerY, e.clientX - rotatingState.centerX) * (180 / Math.PI);
        let deltaAngle = angle - rotatingState.startAngle;
        
        // Handle the crossover from 180 to -180
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        if (Math.abs(deltaAngle) < 2) {
          setShapes(prev => prev.map(s => s.id === rotatingState.id ? { ...s, rotation: rotatingState.initialRotation + 90 } : s));
        }
        setRotatingState(null);
      }
      if (movingState) setMovingState(null);
      if (resizingState) setResizingState(null);
    };

    if (rotatingState || movingState || resizingState) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [rotatingState, movingState, resizingState]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTab === 'draw' && ['pen1', 'pen2', 'highlighter'].includes(activeDrawTool)) {
      setIsDrawingFreehand(true);
      setFreehandPoints([{ x, y }]);
      setSelectedCanvasShapeId(null);
      setActiveDropdown(null);
      return;
    }
    
    if (activeTab === 'draw' && activeDrawTool === 'eraser') {
      setIsDrawingFreehand(true);
      // Immediately try to erase on click
      eraseShapeAt(x, y);
      return;
    }

    if (selectedShapeType === null) {
      setSelectedShapeType(null);
      setSelectedCanvasShapeId(null);
      setActiveDropdown(null);
      return;
    }
    
    setDrawingShape({
      id: Date.now(),
      type: selectedShapeType,
      x: x,
      y: y,
      width: 0,
      height: 0
    });
  };

  const eraseShapeAt = (x: number, y: number) => {
    setShapes(prev => prev.filter(s => {
      const xMin = s.width < 0 ? s.x + s.width : s.x;
      const yMin = s.height < 0 ? s.y + s.height : s.y;
      
      if (s.type === 7 && s.points) {
        // Freehand line: check if mouse is near any point
        return !s.points.some(p => {
          const px = xMin + p.x;
          const py = yMin + p.y;
          return Math.hypot(px - x, py - y) < 15;
        });
      }
      
      // Bounding box for other shapes
      const xMax = xMin + Math.abs(s.width);
      const yMax = yMin + Math.abs(s.height);
      const hit = x >= xMin && x <= xMax && y >= yMin && y <= yMax;
      return !hit;
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rotatingState) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawingFreehand) {
      if (activeDrawTool === 'eraser') {
        eraseShapeAt(x, y);
      } else {
        setFreehandPoints(prev => [...prev, { x, y }]);
      }
      return;
    }

    if (!drawingShape) return;
    setDrawingShape({
      ...drawingShape,
      width: x - drawingShape.x,
      height: y - drawingShape.y
    });
  };

  const handleMouseUp = () => {
    if (rotatingState) return;
    
    if (isDrawingFreehand) {
      setIsDrawingFreehand(false);
      if (activeDrawTool === 'eraser') return;
      
      if (freehandPoints.length > 1) {
        const xs = freehandPoints.map(p => p.x);
        const ys = freehandPoints.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        const width = maxX - minX;
        const height = maxY - minY;
        const normPoints = freehandPoints.map(p => ({ 
          x: width === 0 ? 0 : ((p.x - minX) / width) * 100, 
          y: height === 0 ? 0 : ((p.y - minY) / height) * 100 
        }));
        
        const finalShape: ShapeInfo = {
          id: Date.now(),
          type: 7,
          x: minX,
          y: minY,
          width: width,
          height: height,
          points: normPoints,
          stroke: drawColor[activeDrawTool as 'pen1' | 'pen2' | 'highlighter'],
          fill: 'transparent',
          strokeWidth: activeDrawTool === 'highlighter' ? 12 : 2,
          opacity: activeDrawTool === 'highlighter' ? 0.5 : 1
        };
        setShapes([...shapes, finalShape]);
      }
      setFreehandPoints([]);
      return;
    }

    if (drawingShape) {
      const finalShape = {
        ...drawingShape,
        x: drawingShape.width < 0 ? drawingShape.x + drawingShape.width : drawingShape.x,
        y: drawingShape.height < 0 ? drawingShape.y + drawingShape.height : drawingShape.y,
        width: Math.abs(drawingShape.width),
        height: Math.abs(drawingShape.height),
      };
      if (finalShape.width > 5 && finalShape.height > 5) {
        setShapes([...shapes, finalShape]);
        setSelectedCanvasShapeId(finalShape.id);
        setSelectedShapeType(null);
      } else {
        setSelectedShapeType(null);
      }
      setDrawingShape(null);
    }
  };

  const renderShapeOnCanvas = (s: ShapeInfo, isDrawing: boolean = false) => {
    const x = s.width < 0 ? s.x + s.width : s.x;
    const y = s.height < 0 ? s.y + s.height : s.y;
    const w = Math.abs(s.width);
    const h = Math.abs(s.height);
    
    // Draw using standard SVGs
    let shapeSvg;
    let shapeType = s.type;
    if (shapeType > 7) shapeType = shapeType % 6;

    const isTextBox = shapeType === 6;
    const isFreehand = shapeType === 7;
    const fill = s.fill !== undefined ? s.fill : (isTextBox ? "#ffffff" : (isFreehand ? "transparent" : "#1d6b8b"));
    const stroke = s.stroke !== undefined ? s.stroke : (isTextBox ? "#475569" : (isFreehand ? "#000000" : "transparent"));
    const props = { 
      fill: isFreehand ? "none" : fill, 
      stroke, 
      strokeWidth: s.strokeWidth !== undefined ? s.strokeWidth : (stroke === 'transparent' ? 0 : (isTextBox ? 1 : 2)), 
      opacity: s.opacity !== undefined ? s.opacity : 1,
      vectorEffect: "non-scaling-stroke" as const 
    };
    
    if (shapeType === 0 || shapeType === 6) shapeSvg = <rect x="0" y="0" width="100" height="100" {...props} />;
    else if (shapeType === 1) shapeSvg = <ellipse cx="50" cy="50" rx="50" ry="50" {...props} />;
    else if (shapeType === 2) shapeSvg = <polygon points="50,0 100,100 0,100" {...props} />;
    else if (shapeType === 3) shapeSvg = <polygon points="0,0 75,0 100,25 100,100 0,100" {...props} />;
    else if (shapeType === 4) shapeSvg = <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" {...props} />;
    else if (shapeType === 5) shapeSvg = <polygon points="0,25 50,25 50,0 100,50 50,100 50,75 0,75" {...props} />;
    else if (shapeType === 7 && s.points) {
      shapeSvg = <polyline points={s.points.map(p => `${p.x},${p.y}`).join(' ')} strokeLinecap="round" strokeLinejoin="round" {...props} />;
    }
    
    const isSelected = selectedCanvasShapeId === s.id && !(activeTab === 'draw' && activeDrawTool !== 'select');
    const rotation = s.rotation || 0;
    const isRotatingThis = rotatingState?.id === s.id;
    const isMovingThis = movingState?.id === s.id;

    const handles = [
      { id: 'nw', top: 0, left: 0, mt: '-4px', ml: '-4px', cursor: 'nwse-resize' },
      { id: 'n', top: 0, left: '50%', mt: '-4px', ml: '-4px', cursor: 'ns-resize' },
      { id: 'ne', top: 0, left: '100%', mt: '-4px', ml: '-4px', cursor: 'nesw-resize' },
      { id: 'w', top: '50%', left: 0, mt: '-4px', ml: '-4px', cursor: 'ew-resize' },
      { id: 'e', top: '50%', left: '100%', mt: '-4px', ml: '-4px', cursor: 'ew-resize' },
      { id: 'sw', top: '100%', left: 0, mt: '-4px', ml: '-4px', cursor: 'nesw-resize' },
      { id: 's', top: '100%', left: '50%', mt: '-4px', ml: '-4px', cursor: 'ns-resize' },
      { id: 'se', top: '100%', left: '100%', mt: '-4px', ml: '-4px', cursor: 'nwse-resize' },
    ];

    return (
      <div 
        key={s.id} 
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: (isDrawing || (activeTab === 'draw' && activeDrawTool !== 'select')) ? 'none' : 'auto',
          transform: `rotate(${rotation}deg)`
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setSelectedShapeType(null);
          setSelectedCanvasShapeId(s.id);
          setMovingState({ id: s.id, startX: e.clientX, startY: e.clientY, initialX: s.x, initialY: s.y });
        }}
      >
        {isRotatingThis && (
          <div className="absolute -top-10 -left-6 bg-white border border-slate-300 px-1 py-0.5 text-[11px] rounded shadow-sm text-slate-700 font-sans pointer-events-none whitespace-nowrap z-50">
            {Math.round(rotation)}°
          </div>
        )}

        {isSelected && !isRotatingThis && !isMovingThis && (
          <>
            <div className="absolute inset-0 border border-[#a0a0a0] pointer-events-none" />
            
            {handles.map(h => (
              <div 
                key={h.id}
                className="absolute w-[8px] h-[8px] rounded-full bg-white border border-[#a0a0a0]"
                style={{
                  top: h.top,
                  left: h.left,
                  marginTop: h.mt,
                  marginLeft: h.ml,
                  cursor: h.cursor
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setResizingState({ id: s.id, handle: h.id, startX: e.clientX, startY: e.clientY, initialX: s.x, initialY: s.y, initialW: s.width, initialH: s.height, initialRotation: s.rotation || 0 });
                }}
              />
            ))}
            
            <div className="absolute -top-[24px] left-1/2 -ml-[0.5px] flex flex-col items-center">
              <div className="w-[1px] h-[12px] bg-[#a0a0a0]" />
            </div>
            <div 
              className="absolute -top-[30px] left-1/2 -ml-[8px] w-[16px] h-[16px] rounded-full bg-white border border-[#a0a0a0] flex items-center justify-center cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                setRotatingState({ id: s.id, centerX, centerY, startAngle, initialRotation: s.rotation || 0 });
              }}
            >
               <I.RotateCw size={10} className="text-slate-600 pointer-events-none" />
            </div>
          </>
        )}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none overflow-visible">
          {shapeSvg}
        </svg>

        <div className={`absolute inset-0 flex pointer-events-none p-2 z-10 ${isTextBox ? 'items-start justify-start' : 'items-center justify-center'}`}>
          {isSelected ? (
            <textarea
              value={s.text || ''}
              onChange={(e) => setShapes(prev => prev.map(shape => shape.id === s.id ? { ...shape, text: e.target.value } : shape))}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full bg-transparent outline-none resize-none pointer-events-auto leading-tight"
              rows={s.text ? s.text.split('\n').length || 1 : 1}
              style={{
                fontFamily: s.fontFamily || 'Aptos, sans-serif',
                fontSize: `${s.fontSize || 14}px`,
                fontWeight: s.bold ? 'bold' : 'normal',
                fontStyle: s.italic ? 'italic' : 'normal',
                textDecoration: `${s.underline ? 'underline ' : ''}${s.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                color: s.textColor || (isTextBox ? '#000000' : '#ffffff'),
                textAlign: s.textAlign || (isTextBox ? 'left' : 'center'),
                textShadow: (isTextBox || s.textColor) ? 'none' : '0px 0px 2px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
              autoFocus
            />
          ) : s.text ? (
            <div 
              className="w-full whitespace-pre-wrap pointer-events-none leading-tight"
              style={{
                fontFamily: s.fontFamily || 'Aptos, sans-serif',
                fontSize: `${s.fontSize || 14}px`,
                fontWeight: s.bold ? 'bold' : 'normal',
                fontStyle: s.italic ? 'italic' : 'normal',
                textDecoration: `${s.underline ? 'underline ' : ''}${s.strikethrough ? 'line-through' : ''}`.trim() || 'none',
                color: s.textColor || (isTextBox ? '#000000' : '#ffffff'),
                textAlign: s.textAlign || (isTextBox ? 'left' : 'center'),
                textShadow: (isTextBox || s.textColor) ? 'none' : '0px 0px 2px rgba(0,0,0,0.5)'
              }}
            >
              {s.text}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]" onClick={() => setActiveDropdown(null)}>
      <div 
        className="bg-[#f3f4f6] w-[1000px] h-[650px] rounded shadow-2xl flex flex-col overflow-hidden border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >

        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
          <div className="text-[16px] font-medium text-slate-800">Vẽ</div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              onClick={onClose}
            >
              Loại bỏ những Thay đổi
            </button>
            <button 
              className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#1a73e8] rounded hover:bg-[#1557b0] transition-colors"
              onClick={onSave}
            >
              Lưu và Đóng
            </button>
          </div>
        </div>

        {/* Toolbar - Top Row (Menus) */}
        <div className="flex items-center px-4 py-1 bg-white gap-4 text-[13px] text-slate-700 border-b border-slate-100 relative z-20">
          <div 
            className={`px-2 py-1 rounded cursor-pointer border-b-2 ${activeTab === 'insert' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent hover:bg-slate-100 hover:border-slate-300'}`}
            onClick={() => setActiveTab('insert')}
          >
            Chèn
          </div>
          
          <div 
            className={`px-2 py-1 rounded cursor-pointer border-b-2 flex items-center gap-1 ${activeTab === 'draw' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent hover:bg-slate-100 hover:border-slate-300'}`}
            onClick={() => { setActiveTab('draw'); if (activeDrawTool === 'select') setActiveDrawTool('pen1'); }}
          >
            Vẽ <I.ChevronDown size={14} />
          </div>

          {selectedCanvasShapeId && (
            <>
              <div 
                className={`px-2 py-1 rounded cursor-pointer border-b-2 ${activeTab === 'shape' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent hover:bg-slate-100 hover:border-slate-300'}`}
                onClick={() => setActiveTab('shape')}
              >
                Hình
              </div>
              
              <div 
                className={`px-2 py-1 rounded cursor-pointer border-b-2 flex items-center gap-1 ${activeTab === 'text' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent hover:bg-slate-100 hover:border-slate-300'}`}
                onClick={() => setActiveTab('text')}
              >
                Văn bản <I.ChevronDown size={14} />
              </div>
            </>
          )}
        </div>

        {/* Toolbar - Bottom Row (Icons) */}
        <div className="flex items-center px-3 py-1.5 bg-white border-b border-slate-200 gap-1 rounded-b-md shadow-sm mb-2 mx-2 relative z-10">
          
          {/* UNDO */}
          <div className="relative flex items-center bg-white rounded hover:bg-slate-100 text-slate-600">
            <button className="p-1.5 flex items-center gap-0.5" onClick={handleUndo} title="Hoàn tác (Ctrl+Z)">
              <I.Undo2 size={16} />
            </button>
            <button className="p-1 flex items-center rounded-r hover:bg-slate-200">
              <I.ChevronDown size={12} />
            </button>
          </div>

          {/* CLIPBOARD */}
          <div className="relative flex items-center bg-white rounded hover:bg-slate-100 text-slate-600">
            <button className="p-1.5 flex items-center gap-0.5" onClick={() => toggleDropdown('clipboard')}>
              <I.Clipboard size={16} /> <I.ChevronDown size={12} />
            </button>
            {activeDropdown === 'clipboard' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-lg py-1 flex flex-col rounded-sm">
                <button 
                  className={`flex items-center justify-between px-3 py-1.5 ${selectedCanvasShapeId ? 'hover:bg-slate-100 text-[#1a73e8]' : 'text-slate-300'} text-[13px]`}
                  onClick={() => { handleCut(); setActiveDropdown(null); }}
                  disabled={!selectedCanvasShapeId}
                >
                  <div className="flex items-center gap-3"><I.Scissors size={16} /> Cắt</div>
                  <span>Ctrl+X</span>
                </button>
                <button 
                  className={`flex items-center justify-between px-3 py-1.5 ${selectedCanvasShapeId ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300'} text-[13px]`}
                  onClick={() => { handleCopy(); setActiveDropdown(null); }}
                  disabled={!selectedCanvasShapeId}
                >
                  <div className="flex items-center gap-3"><I.Copy size={16} /> Sao chép</div>
                  <span>Ctrl+C</span>
                </button>
                <button 
                  className={`flex items-center justify-between px-3 py-1.5 ${clipboardShape ? 'hover:bg-slate-100 text-[#0f172a]' : 'text-slate-300'} text-[13px]`}
                  onClick={() => { handlePaste(); setActiveDropdown(null); }}
                  disabled={!clipboardShape}
                >
                  <div className="flex items-center gap-3"><I.ClipboardPaste size={16} className={clipboardShape ? 'text-[#d97706]' : 'text-slate-300'} /> Dán</div>
                  <span>Ctrl+V</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />
          
          {activeTab === 'insert' ? (
            <>
              {/* Insert Tools */}
              <div className="relative">
                <button 
                  className={`px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700 ${activeDropdown === 'shapes' ? 'bg-slate-100' : ''}`}
                  onClick={() => toggleDropdown('shapes')}
                >
                  <I.Shapes size={16} className="text-blue-600" />
                  <span className="text-[13px]">Hình</span>
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
                {activeDropdown === 'shapes' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl p-3 z-50 w-[320px] max-h-[400px] overflow-y-auto rounded-md">
                    {renderShapeMenu()}
                  </div>
                )}
              </div>

              <button 
                className={`px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700 ${selectedShapeType === 6 ? 'bg-slate-200 ring-1 ring-slate-300' : ''}`}
                onClick={() => {
                  setSelectedShapeType(6);
                  setIsDrawingFreehand(false);
                }}
              >
                <I.Type size={16} className="text-blue-600" />
                <span className="text-[13px]">Hộp Văn bản</span>
              </button>

              <button className="px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700">
                <I.Image size={16} className="text-blue-600" />
                <span className="text-[13px]">Hình ảnh</span>
              </button>
            </>
          ) : activeTab === 'draw' ? (
            <>
              {/* Drawing Tools */}
              <button className={`p-1.5 rounded text-slate-600 ${activeDrawTool === 'select' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`} onClick={() => setActiveDrawTool('select')}>
                <I.MousePointer2 size={18} />
              </button>
              
              <button className={`p-1.5 rounded text-slate-600 ${activeDrawTool === 'lasso' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`} onClick={() => setActiveDrawTool('lasso')} title="Chọn bằng dây thòng lọng">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2">
                  <circle cx="12" cy="10" r="7" />
                  <path d="M14.5 16.5 18 21" strokeDasharray="none" />
                </svg>
              </button>
              
              <button className={`p-1.5 rounded text-slate-600 ${activeDrawTool === 'eraser' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`} onClick={() => setActiveDrawTool('eraser')} title="Tẩy">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                  <rect x="5" y="2" width="10" height="12" fill="#ffe4b5" stroke="#000" strokeWidth="1" />
                  <rect x="5" y="14" width="10" height="4" fill="#000" />
                  <rect x="5" y="18" width="10" height="4" fill="#dda0dd" stroke="#000" strokeWidth="1" />
                </svg>
              </button>
              
              <div className="relative">
                <button 
                  className={`p-1.5 rounded flex flex-col items-center justify-center gap-[2px] ${activeDrawTool === 'pen1' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`}
                  onClick={() => { 
                    if (activeDrawTool === 'pen1') toggleDropdown('pen1');
                    else setActiveDrawTool('pen1'); 
                  }}
                >
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                    <rect x="6" y="2" width="8" height="14" fill="#000" />
                    <polygon points="6,16 14,16 10,22" fill="#000" />
                    <rect x="8" y="4" width="4" height="2" fill="#333" />
                  </svg>
                </button>
                {activeDropdown === 'pen1' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={false}
                      allowNoColor={false}
                      onSelectColor={(c) => {
                        if (c) setDrawColor({ ...drawColor, pen1: c });
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  className={`p-1.5 rounded flex flex-col items-center justify-center gap-[2px] ${activeDrawTool === 'pen2' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`}
                  onClick={() => { 
                    if (activeDrawTool === 'pen2') toggleDropdown('pen2');
                    else setActiveDrawTool('pen2'); 
                  }}
                >
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                    <rect x="6" y="2" width="8" height="14" fill="#dc2626" />
                    <polygon points="6,16 14,16 10,22" fill="#dc2626" />
                    <rect x="8" y="4" width="4" height="2" fill="#991b1b" />
                    <polygon points="9,22 11,22 10,24" fill="#000" />
                  </svg>
                </button>
                {activeDropdown === 'pen2' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={false}
                      allowNoColor={false}
                      onSelectColor={(c) => {
                        if (c) setDrawColor({ ...drawColor, pen2: c });
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  className={`p-1.5 rounded flex flex-col items-center justify-center gap-[2px] ${activeDrawTool === 'highlighter' ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`}
                  onClick={() => { 
                    if (activeDrawTool === 'highlighter') toggleDropdown('highlighter');
                    else setActiveDrawTool('highlighter'); 
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="2" width="16" height="12" fill="#eab308" stroke="#000" strokeWidth="1" />
                    <polygon points="4,14 20,14 16,20 8,20" fill="#333" />
                    <polygon points="8,20 16,20 14,23 10,23" fill="#eab308" />
                  </svg>
                </button>
                {activeDropdown === 'highlighter' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={false}
                      allowNoColor={false}
                      onSelectColor={(c) => {
                        if (c) setDrawColor({ ...drawColor, highlighter: c });
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="w-px h-5 bg-slate-300 mx-1" />
              
              <button 
                className={`p-1.5 rounded text-slate-600 ${['pen1', 'pen2', 'highlighter'].includes(activeDrawTool) ? 'bg-slate-200 ring-1 ring-slate-300' : 'hover:bg-slate-100'}`} 
                onClick={() => setActiveDrawTool(activeDrawTool === 'select' ? 'pen1' : 'select')}
                title="Vẽ bằng Cảm ứng"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                  <path d="M14 2c1.5 2 4.5 1 5 3.5" stroke="#ef4444" strokeWidth="1.5" />
                </svg>
              </button>
            </>
          ) : activeTab === 'shape' ? (
            <>
              {/* Shape Formatting Tools */}
              <div className="relative">
                <button className="px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700" onClick={() => toggleDropdown('changeShape')}>
                  <I.Shapes size={16} className="text-blue-600" />
                  <span className="text-[13px]">Thay đổi Hình</span>
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
                {activeDropdown === 'changeShape' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl p-3 z-50 w-[320px] max-h-[400px] overflow-y-auto rounded-md">
                    {renderShapeMenu((type) => {
                      if (selectedCanvasShapeId) {
                        setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, type } : s));
                      }
                      setActiveDropdown(null);
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <button className="px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700" onClick={() => toggleDropdown('fill')}>
                  <I.PaintBucket size={16} className="text-orange-500" />
                  <span className="text-[13px]">Tô Hình</span>
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
                {activeDropdown === 'fill' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={false}
                      allowNoColor={true}
                      onSelectColor={(c) => {
                        if (c) {
                          setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, fill: c } : s));
                        }
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button className="px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700" onClick={() => toggleDropdown('stroke')}>
                  <I.PenTool size={16} className="text-blue-600" />
                  <span className="text-[13px]">Viền ngoài Hình</span>
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
                {activeDropdown === 'stroke' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={false}
                      allowNoColor={true}
                      onSelectColor={(c) => {
                        if (c) {
                          setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, stroke: c } : s));
                        }
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <div className="relative">
                <button className="px-2 py-1.5 flex items-center gap-1.5 rounded hover:bg-slate-100 text-slate-700">
                  <I.BringToFront size={16} className="text-orange-500" />
                  <span className="text-[13px]">Sắp xếp</span>
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
              </div>
            </>
          ) : activeTab === 'text' ? (
            <>
              {/* Text Formatting Tools */}
              <div className="relative">
                <button className="px-2 py-1 flex items-center gap-2 border border-slate-300 rounded bg-white hover:bg-slate-50 w-[100px]" onClick={() => toggleDropdown('fontFamily')}>
                  <span className="text-[13px] truncate">{currentShape?.fontFamily || 'Aptos'}</span>
                  <I.ChevronDown size={12} className="text-slate-500 ml-auto" />
                </button>
                {activeDropdown === 'fontFamily' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-md py-1 w-[150px] z-50 max-h-[250px] overflow-y-auto">
                    {['Aptos', 'Arial', 'Calibri', 'Times New Roman', 'Verdana', 'Tahoma', 'Roboto', 'Inter', 'Open Sans'].map(font => (
                      <div 
                        key={font}
                        className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px] text-slate-700"
                        style={{ fontFamily: font }}
                        onClick={() => {
                          if (selectedCanvasShapeId) {
                            setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, fontFamily: font } : s));
                          }
                          setActiveDropdown(null);
                        }}
                      >
                        {font}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button className="px-2 py-1 flex items-center gap-2 border border-slate-300 rounded bg-white hover:bg-slate-50 w-[60px]" onClick={() => toggleDropdown('fontSize')}>
                  <span className="text-[13px]">{currentShape?.fontSize || 14}</span>
                  <I.ChevronDown size={12} className="text-slate-500 ml-auto" />
                </button>
                {activeDropdown === 'fontSize' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-md py-1 w-[60px] z-50 max-h-[250px] overflow-y-auto">
                    {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(size => (
                      <div 
                        key={size}
                        className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-[13px] text-slate-700 text-center"
                        onClick={() => {
                          if (selectedCanvasShapeId) {
                            setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, fontSize: size } : s));
                          }
                          setActiveDropdown(null);
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-slate-300 mx-1" />

              <div className="flex bg-white rounded border border-slate-200 overflow-hidden">
                <button className={`p-1.5 hover:bg-slate-100 text-slate-700 ${currentShape?.bold ? 'bg-slate-200' : ''}`} onClick={() => toggleTextProp('bold')}><I.Bold size={16} /></button>
                <div className="w-px bg-slate-200" />
                <button className={`p-1.5 hover:bg-slate-100 text-slate-700 ${currentShape?.italic ? 'bg-slate-200' : ''}`} onClick={() => toggleTextProp('italic')}><I.Italic size={16} /></button>
                <div className="w-px bg-slate-200" />
                <button className={`p-1.5 hover:bg-slate-100 text-slate-700 ${currentShape?.underline ? 'bg-slate-200' : ''}`} onClick={() => toggleTextProp('underline')}><I.Underline size={16} /></button>
                <div className="w-px bg-slate-200" />
                <button className={`p-1.5 hover:bg-slate-100 text-slate-700 ${currentShape?.strikethrough ? 'bg-slate-200' : ''}`} onClick={() => toggleTextProp('strikethrough')}><I.Strikethrough size={16} /></button>
              </div>

              <div className="relative flex" onClick={() => toggleDropdown('textColor')}>
                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-700 flex flex-col items-center justify-center gap-[2px]">
                  <span className="font-serif font-bold text-[14px] leading-none">A</span>
                  <div className="w-3 h-1 rounded-full" style={{ backgroundColor: currentShape?.textColor || '#000000' }} />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><I.ChevronDown size={12} /></button>
                
                {activeDropdown === 'textColor' && (
                  <div className="absolute top-full left-0 mt-1 shadow-xl z-50">
                    <ColorPicker
                      allowAutomatic={true}
                      allowNoColor={false}
                      onSelectColor={(c) => {
                        if (c) {
                          setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, textColor: c } : s));
                        }
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-slate-300 mx-1" />
              
              <div className="relative">
                <button className="px-2 py-1.5 flex items-center gap-1 rounded hover:bg-slate-100 text-slate-700" onClick={() => {
                  const aligns: ShapeInfo['textAlign'][] = ['left', 'center', 'right', 'justify'];
                  const cur = currentShape?.textAlign || (currentShape?.type === 6 ? 'left' : 'center');
                  const next = aligns[(aligns.indexOf(cur) + 1) % aligns.length];
                  if (selectedCanvasShapeId) {
                    setShapes(shapes.map(s => s.id === selectedCanvasShapeId ? { ...s, textAlign: next } : s));
                  }
                }}>
                  {(currentShape?.textAlign || (currentShape?.type === 6 ? 'left' : 'center')) === 'left' ? <I.AlignLeft size={16} /> :
                   (currentShape?.textAlign || (currentShape?.type === 6 ? 'left' : 'center')) === 'right' ? <I.AlignRight size={16} /> :
                   (currentShape?.textAlign || (currentShape?.type === 6 ? 'left' : 'center')) === 'justify' ? <I.AlignJustify size={16} /> :
                   <I.AlignCenter size={16} />}
                  <I.ChevronDown size={12} className="text-slate-500" />
                </button>
              </div>
            </>
          ) : null}
          
          <div className="flex-1" />
          
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded"><I.ChevronDown size={16} /></button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#f3f4f6] flex items-start justify-center">
          <div 
            className={`w-full h-full shadow-sm border border-slate-200 relative overflow-hidden bg-white ${selectedShapeType !== null ? 'cursor-crosshair' : 'cursor-default'}`}
            style={{ backgroundColor: '#ffffff' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {shapes.map(s => renderShapeOnCanvas(s))}
            {drawingShape && renderShapeOnCanvas(drawingShape, true)}
            
            {/* Draw Freehand Line in Progress */}
            {isDrawingFreehand && freehandPoints.length > 1 && (
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }} width="100%" height="100%">
                <polyline 
                  points={freehandPoints.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill="none" 
                  stroke={drawColor[activeDrawTool as 'pen1' | 'pen2' | 'highlighter'] || '#000'}
                  strokeWidth={activeDrawTool === 'highlighter' ? 12 : 2}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity={activeDrawTool === 'highlighter' ? 0.5 : 1}
                />
              </svg>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
