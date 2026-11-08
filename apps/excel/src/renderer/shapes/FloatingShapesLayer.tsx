import React, { useState, useEffect, useRef } from 'react';
import { ShapeData } from '@officex/spreadsheet-core';

export interface FloatingShapesLayerProps {
  shapes: ShapeData[];
  zoom: number;
  onUpdateShape: (id: string, updates: Partial<ShapeData>) => void;
  onDeleteShape: (id: string) => void;
}

export function FloatingShapesLayer({ shapes, zoom, onUpdateShape, onDeleteShape }: FloatingShapesLayerProps) {
  const [activeShapeId, setActiveShapeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number, y: number, initialX: number, initialY: number, initialW: number, initialH: number } | null>(null);
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);

  // Delete key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeShapeId && !editingShapeId) {
        e.preventDefault();
        onDeleteShape(activeShapeId);
        setActiveShapeId(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeShapeId, editingShapeId, onDeleteShape]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
      setDragStart(null);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeShapeId || !dragStart) return;
      
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;

      if (isDragging) {
        onUpdateShape(activeShapeId, {
          x: Math.max(0, dragStart.initialX + dx),
          y: Math.max(0, dragStart.initialY + dy)
        });
      } else if (isResizing) {
        let newX = dragStart.initialX;
        let newY = dragStart.initialY;
        let newW = dragStart.initialW;
        let newH = dragStart.initialH;

        if (isResizing.includes('e')) newW = Math.max(10, dragStart.initialW + dx);
        if (isResizing.includes('s')) newH = Math.max(10, dragStart.initialH + dy);
        if (isResizing.includes('w')) {
          const proposedW = dragStart.initialW - dx;
          if (proposedW >= 10) {
            newW = proposedW;
            newX = dragStart.initialX + dx;
          }
        }
        if (isResizing.includes('n')) {
          const proposedH = dragStart.initialH - dy;
          if (proposedH >= 10) {
            newH = proposedH;
            newY = dragStart.initialY + dy;
          }
        }
        onUpdateShape(activeShapeId, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeShapeId, isDragging, isResizing, dragStart, zoom, onUpdateShape]);

  // Click outside to deselect
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.shape-element')) {
        setActiveShapeId(null);
        setEditingShapeId(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const handleShapeMouseDown = (e: React.MouseEvent, shape: ShapeData) => {
    if (editingShapeId === shape.id) return; // Don't drag while editing text
    e.stopPropagation();
    setActiveShapeId(shape.id);
    setEditingShapeId(null);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, initialX: shape.x, initialY: shape.y, initialW: shape.width, initialH: shape.height });
  };

  const handleShapeDoubleClick = (e: React.MouseEvent, shape: ShapeData) => {
    e.stopPropagation();
    setEditingShapeId(shape.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, shape: ShapeData, handle: string) => {
    e.stopPropagation();
    setActiveShapeId(shape.id);
    setIsResizing(handle);
    setDragStart({ x: e.clientX, y: e.clientY, initialX: shape.x, initialY: shape.y, initialW: shape.width, initialH: shape.height });
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'visible', zIndex: 40 }}>
      {shapes.map(shape => {
        const isActive = activeShapeId === shape.id;
        const isEditing = editingShapeId === shape.id;
        
        return (
          <div 
            key={shape.id} 
            className="shape-element"
            style={{ 
              position: 'absolute', 
              left: shape.x, 
              top: shape.y, 
              width: shape.width, 
              height: shape.height,
              cursor: isEditing ? 'text' : (isDragging && isActive ? 'grabbing' : 'grab')
            }}
            onMouseDown={(e) => handleShapeMouseDown(e, shape)}
            onDoubleClick={(e) => handleShapeDoubleClick(e, shape)}
          >
            {/* SVG Content */}
            <svg width="100%" height="100%" style={{ overflow: 'visible', pointerEvents: 'none' }}>
              {shape.type === 'rect' && (
                <rect x="0" y="0" width="100%" height="100%" fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'circle' && (
                <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'triangle' && (
                <polygon points={`50,0 100,100 0,100`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'diamond' && (
                <polygon points={`50,0 100,50 50,100 0,50`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'star' && (
                <polygon points={`50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'line' && (
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke={shape.stroke} strokeWidth={Math.max(shape.strokeWidth || 2, shape.height)} />
              )}
              {shape.type === 'arrow' && (
                <g>
                   <line x1="0" y1="50%" x2="100%" y2="50%" stroke={shape.stroke} strokeWidth={Math.max(shape.strokeWidth || 2, shape.height)} />
                   {/* Simple arrow head at the end */}
                   <polygon points={`${shape.width},${shape.height/2} ${shape.width - 10},${shape.height/2 - 5} ${shape.width - 10},${shape.height/2 + 5}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'hexagon' && (
                <polygon points={`25,0 75,0 100,50 75,100 25,100 0,50`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'octagon' && (
                <polygon points={`30,0 70,0 100,30 100,70 70,100 30,100 0,70 0,30`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'pentagon' && (
                <polygon points={`50,0 100,38 81,100 19,100 0,38`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'cylinder' && (
                <g transform={`scale(${shape.width/100}, ${shape.height/100})`}>
                  <path d="M0,20 v60 a50,20 0 0,0 100,0 v-60" fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
                  <ellipse cx="50" cy="20" rx="50" ry="20" fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
                </g>
              )}
              {shape.type === 'cloud' && (
                <path d="M 25 60 a 20 20 0 0 1 0 -40 a 20 20 0 0 1 15 10 a 30 30 0 0 1 50 -10 a 30 30 0 0 1 10 50 a 15 15 0 0 1 -10 25 l -65 0 a 15 15 0 0 1 0 -35 z" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'moon' && (
                <path d="M 50 0 A 50 50 0 1 0 100 50 A 40 40 0 1 1 50 0" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'sun' && (
                <path d="M 50 15 A 35 35 0 1 0 50 85 A 35 35 0 1 0 50 15 M 50 0 L 50 10 M 50 90 L 50 100 M 0 50 L 10 50 M 90 50 L 100 50 M 15 15 L 22 22 M 78 78 L 85 85 M 15 85 L 22 78 M 78 22 L 85 15" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'message-square' && (
                <path d="M 0 0 h 100 v 80 h -70 l -30 20 v -20 z" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'cross' && (
                <polygon points={`35,0 65,0 65,35 100,35 100,65 65,65 65,100 35,100 35,65 0,65 0,35 35,35`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'flag' && (
                <path d="M 0 0 v 100 m 0 -100 c 25 10 25 -10 50 0 s 25 -10 50 0 v 50 c -25 -10 -25 10 -50 0 s -25 10 -50 0" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'rect-rounded' && (
                <rect x="0" y="0" width="100%" height="100%" rx="12" ry="12" fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'parallelogram' && (
                <polygon points={`15,0 100,0 85,100 0,100`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'xshape' && (
                <polygon points={`25,0 50,25 75,0 100,25 75,50 100,75 75,100 50,75 25,100 0,75 25,50 0,25`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'lightning' && (
                <polygon points={`60,0 30,55 55,55 40,100 70,45 45,45`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'shield' && (
                <path d="M 50 0 L 100 20 L 100 55 C 100 80 75 95 50 100 C 25 95 0 80 0 55 L 0 20 Z" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'heart' && (
                <path d="M 50 85 C 20 65 0 50 0 30 A 25 25 0 0 1 50 15 A 25 25 0 0 1 100 30 C 100 50 80 65 50 85 Z" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'bookmark' && (
                <path d="M 10 0 h 80 v 100 L 50 75 L 10 100 Z" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'message-circle' && (
                <path d="M 50 5 A 45 45 0 1 0 85 85 L 95 100 L 75 80 A 45 45 0 0 0 50 5" transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'arc' && (
                <path d="M 10 90 A 50 50 0 0 1 90 90" fill="none" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} transform={`scale(${shape.width/100}, ${shape.height/100})`} />
              )}
              {/* Block arrows */}
              {shape.type === 'block-arrow-right' && (
                <polygon points={`0,30 60,30 60,10 100,50 60,90 60,70 0,70`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'block-arrow-left' && (
                <polygon points={`100,30 40,30 40,10 0,50 40,90 40,70 100,70`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'block-arrow-up' && (
                <polygon points={`30,100 30,40 10,40 50,0 90,40 70,40 70,100`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'block-arrow-down' && (
                <polygon points={`30,0 30,60 10,60 50,100 90,60 70,60 70,0`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {shape.type === 'block-arrow-both' && (
                <polygon points={`0,50 20,20 20,35 80,35 80,20 100,50 80,80 80,65 20,65 20,80`} transform={`scale(${shape.width/100}, ${shape.height/100})`} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} />
              )}
              {/* Directional arrows */}
              {shape.type === 'arrow-left' && (
                <g>
                  <line x1="100%" y1="50%" x2="0" y2="50%" stroke={shape.stroke} strokeWidth={Math.max(shape.strokeWidth || 2, shape.height)} />
                  <polygon points={`0,${shape.height/2} 10,${shape.height/2-5} 10,${shape.height/2+5}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-up' && (
                <g>
                  <line x1="50%" y1="100%" x2="50%" y2="0" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
                  <polygon points={`${shape.width/2},0 ${shape.width/2-5},10 ${shape.width/2+5},10`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-down' && (
                <g>
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
                  <polygon points={`${shape.width/2},${shape.height} ${shape.width/2-5},${shape.height-10} ${shape.width/2+5},${shape.height-10}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-both' && (
                <g>
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
                  <polygon points={`0,${shape.height/2} 10,${shape.height/2-5} 10,${shape.height/2+5}`} fill={shape.stroke} />
                  <polygon points={`${shape.width},${shape.height/2} ${shape.width-10},${shape.height/2-5} ${shape.width-10},${shape.height/2+5}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-both-v' && (
                <g>
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
                  <polygon points={`${shape.width/2},0 ${shape.width/2-5},10 ${shape.width/2+5},10`} fill={shape.stroke} />
                  <polygon points={`${shape.width/2},${shape.height} ${shape.width/2-5},${shape.height-10} ${shape.width/2+5},${shape.height-10}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-diagonal' && (
                <g>
                  <line x1="0" y1="0" x2="100%" y2="100%" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
                  <polygon points={`${shape.width},${shape.height} ${shape.width-10},${shape.height-3} ${shape.width-3},${shape.height-10}`} fill={shape.stroke} />
                </g>
              )}
              {shape.type === 'arrow-bend' && (
                <path d={`M 0 ${shape.height} Q ${shape.width/2} 0 ${shape.width} ${shape.height}`} fill="none" stroke={shape.stroke} strokeWidth={shape.strokeWidth || 2} />
              )}
              {/* Fallback for others */}
              {!['rect','rect-rounded','circle','triangle','diamond','star','line','arrow','arrow-left','arrow-up','arrow-down','arrow-both','arrow-both-v','arrow-diagonal','arrow-bend','hexagon','octagon','pentagon','cylinder','cloud','moon','sun','message-square','message-circle','cross','xshape','flag','parallelogram','lightning','shield','heart','bookmark','arc','block-arrow-right','block-arrow-left','block-arrow-up','block-arrow-down','block-arrow-both'].includes(shape.type) && (
                <rect x="0" y="0" width="100%" height="100%" fill={shape.fill || '#e2e8f0'} stroke={shape.stroke || '#94a3b8'} strokeWidth="2" />
              )}
            </svg>
            
            {/* Text Overlay */}
            {shape.type !== 'line' && shape.type !== 'arrow' && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                pointerEvents: isEditing ? 'auto' : 'none'
              }}>
                {isEditing ? (
                  <textarea
                    autoFocus
                    defaultValue={shape.text || ''}
                    onBlur={(e) => {
                      setEditingShapeId(null);
                      onUpdateShape(shape.id, { text: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditingShapeId(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      border: 'none',
                      resize: 'none',
                      outline: 'none',
                      textAlign: 'center',
                      color: shape.textColor || '#000',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                ) : (
                  <div style={{ 
                    color: shape.textColor || '#000', 
                    textAlign: 'center', 
                    wordBreak: 'break-word',
                    userSelect: 'none'
                  }}>
                    {shape.text}
                  </div>
                )}
              </div>
            )}

            {/* Selection Outline & Handles */}
            {isActive && !isEditing && (
              <>
                <div style={{ position: 'absolute', inset: -2, border: '1px solid #107C41', pointerEvents: 'none' }} />
                
                {/* Resize Handles */}
                {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => {
                  const style: any = { position: 'absolute', width: 8, height: 8, backgroundColor: 'white', border: '1px solid #107C41', borderRadius: '50%', zIndex: 10 };
                  if (handle.includes('n')) style.top = -4;
                  if (handle.includes('s')) style.bottom = -4;
                  if (handle.includes('w')) style.left = -4;
                  if (handle.includes('e')) style.right = -4;
                  if (handle === 'n' || handle === 's') style.left = '50%';
                  if (handle === 'e' || handle === 'w') style.top = '50%';
                  if (style.left === '50%') style.transform = 'translateX(-50%)';
                  if (style.top === '50%') style.transform = 'translateY(-50%)';
                  
                  return (
                    <div 
                      key={handle}
                      style={{ ...style, cursor: `${handle}-resize` }}
                      onMouseDown={(e) => handleResizeMouseDown(e, shape, handle)}
                    />
                  );
                })}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
