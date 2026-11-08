import React from 'react';
import { SmartArtObject, SmartArtNode } from '../DocumentTypes';

interface SmartArtRendererProps {
  smartArt: SmartArtObject;
  width?: number;
  height?: number;
  selectedNodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string, x: number, y: number, w: number, h: number) => void;
}

export const SmartArtRenderer: React.FC<SmartArtRendererProps> = ({ 
  smartArt, 
  width = 400, 
  height = 300,
  selectedNodeId,
  onNodeClick,
  onNodeDoubleClick
}) => {
  // Very basic renderer for Hierarchy
  const renderHierarchy = () => {
    const nodes = smartArt.nodes;
    const roots = smartArt.rootNodes;
    
    const elements: React.ReactNode[] = [];
    const levelHeight = 80;
    const nodeWidth = 100;
    const nodeHeight = 40;
    
    const drawNode = (nodeId: string, level: number, x: number, y: number, parentX?: number, parentY?: number) => {
      const node = nodes[nodeId];
      if (!node) return;
      
      if (parentX !== undefined && parentY !== undefined) {
        elements.push(
          <path
            key={`link-${nodeId}`}
            d={`M ${parentX} ${parentY} L ${parentX} ${y - 20} L ${x} ${y - 20} L ${x} ${y - nodeHeight/2}`}
            stroke="#5b9bd5"
            strokeWidth="2"
            fill="none"
          />
        );
      }
      
      const isSelected = selectedNodeId === nodeId;

      elements.push(
        <g 
          key={`node-${nodeId}`} 
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNodeClick?.(nodeId); }}
          onDoubleClick={(e) => { e.stopPropagation(); onNodeDoubleClick?.(nodeId, x - nodeWidth/2, y - nodeHeight/2, nodeWidth, nodeHeight); }}
        >
          {isSelected && (
            <rect
              x={x - nodeWidth/2 - 4}
              y={y - nodeHeight/2 - 4}
              width={nodeWidth + 8}
              height={nodeHeight + 8}
              fill="none"
              stroke="#0078d4"
              strokeWidth="2"
              strokeDasharray="4,4"
              rx="6"
            />
          )}
          <rect
            x={x - nodeWidth/2}
            y={y - nodeHeight/2}
            width={nodeWidth}
            height={nodeHeight}
            fill={node.fill || "#5b9bd5"}
            stroke={node.outline || "#41719c"}
            strokeWidth={isSelected ? "2" : "1"}
            rx="4"
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fill="white"
            fontSize={node.font?.fontSize || 12}
            fontFamily={node.font?.fontFamily || 'Calibri'}
          >
            {node.text}
          </text>
        </g>
      );
      
      if (node.children.length > 0) {
        const totalWidth = node.children.length * (nodeWidth + 20) - 20;
        let childX = x - totalWidth/2 + nodeWidth/2;
        const childY = y + levelHeight;
        
        node.children.forEach(childId => {
          drawNode(childId, level + 1, childX, childY, x, y + nodeHeight/2);
          childX += nodeWidth + 20;
        });
      }
    };
    
    if (roots.length > 0) {
      const startX = width / 2;
      const startY = 40;
      roots.forEach((rootId, idx) => {
        const rx = startX + (idx - (roots.length - 1)/2) * (nodeWidth + 40);
        drawNode(rootId, 0, rx, startY);
      });
    }
    
    return elements;
    return elements;
  };

  const renderList = () => {
    const nodes = smartArt.nodes;
    const roots = smartArt.rootNodes;
    const elements: React.ReactNode[] = [];
    
    const nodeWidth = 200;
    const nodeHeight = 40;
    const gap = 10;
    const startX = width / 2;
    let currentY = 40;

    roots.forEach((rootId, idx) => {
      const node = nodes[rootId];
      if (!node) return;
      const isSelected = selectedNodeId === rootId;
      const fill = ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5"][idx % 5];
      
      elements.push(
        <g 
          key={`node-${rootId}`} 
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNodeClick?.(rootId); }}
          onDoubleClick={(e) => { e.stopPropagation(); onNodeDoubleClick?.(rootId, startX - nodeWidth/2, currentY - nodeHeight/2, nodeWidth, nodeHeight); }}
        >
          {isSelected && (
            <rect
              x={startX - nodeWidth/2 - 4} y={currentY - nodeHeight/2 - 4}
              width={nodeWidth + 8} height={nodeHeight + 8}
              fill="none" stroke="#0078d4" strokeWidth="2" strokeDasharray="4,4" rx="6"
            />
          )}
          <rect
            x={startX - nodeWidth/2} y={currentY - nodeHeight/2}
            width={nodeWidth} height={nodeHeight}
            fill={node.fill || fill} stroke={node.outline || "none"} strokeWidth={isSelected ? "2" : "0"} rx="4"
          />
          <text
            x={startX} y={currentY + 5} textAnchor="middle" fill="white"
            fontSize={node.font?.fontSize || 14} fontFamily={node.font?.fontFamily || 'Calibri'} fontWeight="bold"
          >
            {node.text}
          </text>
        </g>
      );
      currentY += nodeHeight + gap;
    });

    return elements;
  };

  const renderProcess = () => {
    const nodes = smartArt.nodes;
    const roots = smartArt.rootNodes;
    const elements: React.ReactNode[] = [];
    
    const nodeWidth = 80;
    const nodeHeight = 50;
    const gap = 30; // space for arrow
    const totalWidth = roots.length * nodeWidth + (roots.length - 1) * gap;
    let currentX = (width - totalWidth) / 2 + nodeWidth / 2;
    const centerY = height / 2;

    roots.forEach((rootId, idx) => {
      const node = nodes[rootId];
      if (!node) return;
      const isSelected = selectedNodeId === rootId;
      const fill = ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5"][idx % 5];
      
      elements.push(
        <g 
          key={`node-${rootId}`} 
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNodeClick?.(rootId); }}
          onDoubleClick={(e) => { e.stopPropagation(); onNodeDoubleClick?.(rootId, currentX - nodeWidth/2, centerY - nodeHeight/2, nodeWidth, nodeHeight); }}
        >
          {isSelected && (
            <rect
              x={currentX - nodeWidth/2 - 4} y={centerY - nodeHeight/2 - 4}
              width={nodeWidth + 8} height={nodeHeight + 8}
              fill="none" stroke="#0078d4" strokeWidth="2" strokeDasharray="4,4" rx="6"
            />
          )}
          <rect
            x={currentX - nodeWidth/2} y={centerY - nodeHeight/2}
            width={nodeWidth} height={nodeHeight}
            fill={node.fill || fill} stroke={node.outline || "none"} strokeWidth={isSelected ? "2" : "0"} rx="4"
          />
          <text
            x={currentX} y={centerY + 5} textAnchor="middle" fill="white"
            fontSize={node.font?.fontSize || 14} fontFamily={node.font?.fontFamily || 'Calibri'} fontWeight="bold"
          >
            {node.text}
          </text>
        </g>
      );

      if (idx < roots.length - 1) {
         elements.push(
            <path key={`arrow-${idx}`} d={`M ${currentX + nodeWidth/2 + 5} ${centerY} L ${currentX + nodeWidth/2 + 25} ${centerY}`} stroke="#7f7f7f" strokeWidth="3" markerEnd="url(#arrowhead)" />
         );
      }
      
      currentX += nodeWidth + gap;
    });

    return (
       <>
         <defs>
           <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
             <polygon points="0 0, 10 3.5, 0 7" fill="#7f7f7f" />
           </marker>
         </defs>
         {elements}
       </>
    );
  };

  const renderCycle = () => {
    const nodes = smartArt.nodes;
    const roots = smartArt.rootNodes;
    const elements: React.ReactNode[] = [];
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    const nodeRadius = 30;

    roots.forEach((rootId, idx) => {
      const node = nodes[rootId];
      if (!node) return;
      const isSelected = selectedNodeId === rootId;
      const fill = ["#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5"][idx % 5];
      
      const angle = (idx / roots.length) * 2 * Math.PI - Math.PI / 2; // start at top
      const cx = centerX + radius * Math.cos(angle);
      const cy = centerY + radius * Math.sin(angle);

      // Draw arrow to next node
      const nextIdx = (idx + 1) % roots.length;
      const nextAngle = (nextIdx / roots.length) * 2 * Math.PI - Math.PI / 2;
      const nx = centerX + radius * Math.cos(nextAngle);
      const ny = centerY + radius * Math.sin(nextAngle);
      
      elements.push(
         <path key={`arrow-${idx}`} d={`M ${cx} ${cy} Q ${centerX} ${centerY} ${nx} ${ny}`} stroke="#7f7f7f" strokeWidth="3" fill="none" markerEnd="url(#arrowhead_cycle)" />
      );

      elements.push(
        <g 
          key={`node-${rootId}`} 
          className="cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNodeClick?.(rootId); }}
          onDoubleClick={(e) => { e.stopPropagation(); onNodeDoubleClick?.(rootId, cx - nodeRadius, cy - nodeRadius, nodeRadius*2, nodeRadius*2); }}
        >
          {isSelected && (
            <circle cx={cx} cy={cy} r={nodeRadius + 4} fill="none" stroke="#0078d4" strokeWidth="2" strokeDasharray="4,4" />
          )}
          <circle cx={cx} cy={cy} r={nodeRadius} fill={node.fill || fill} stroke={node.outline || "none"} strokeWidth={isSelected ? "2" : "0"} />
          <text
            x={cx} y={cy + 5} textAnchor="middle" fill="white"
            fontSize={node.font?.fontSize || 12} fontFamily={node.font?.fontFamily || 'Calibri'} fontWeight="bold"
          >
            {node.text}
          </text>
        </g>
      );
    });

    return (
       <>
         <defs>
           <marker id="arrowhead_cycle" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
             <polygon points="0 0, 10 3.5, 0 7" fill="#7f7f7f" />
           </marker>
         </defs>
         {elements}
       </>
    );
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="smartart-svg">
      {smartArt.type === 'hierarchy' && renderHierarchy()}
      {smartArt.type === 'list' && renderList()}
      {smartArt.type === 'process' && renderProcess()}
      {smartArt.type === 'cycle' && renderCycle()}
      {!['hierarchy', 'list', 'process', 'cycle'].includes(smartArt.type) && (
        <text x={20} y={20} fill="red">Unsupported SmartArt Type: {smartArt.type}</text>
      )}
    </svg>
  );
};
