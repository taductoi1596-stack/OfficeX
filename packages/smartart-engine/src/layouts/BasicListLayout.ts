import { SmartArtModel } from '../models/SmartArtModel';
import { LayoutNode } from '../models/SmartArtNode';
import { LayoutGenerator, SmartArtLayoutResult } from './LayoutGenerator';

/**
 * A simple sequential list layout.
 * Distributes nodes evenly from top to bottom within the bounds.
 */
export class BasicListLayout implements LayoutGenerator {
  
  public generateLayout(model: SmartArtModel): SmartArtLayoutResult {
    const layoutNodes: LayoutNode[] = [];
    const totalNodes = model.nodes.size;
    
    if (totalNodes === 0) {
      return { nodes: [], connectors: [] };
    }

    const PADDING = 10;
    // Calculate the height available for each node, accounting for padding between them
    const availableHeight = model.bounds.height - (PADDING * (totalNodes - 1));
    const nodeHeight = Math.max(20, availableHeight / totalNodes); // Minimum 20px height
    const nodeWidth = model.bounds.width;

    let currentY = 0;

    // We assume a simple sequential rendering order for this basic layout.
    // In a real implementation, we would traverse the relationships graph.
    for (const node of model.nodes.values()) {
      layoutNodes.push({
        ...node,
        x: 0,
        y: currentY,
        width: nodeWidth,
        height: nodeHeight
      });
      
      currentY += nodeHeight + PADDING;
    }

    return {
      nodes: layoutNodes,
      connectors: [] // Basic list usually doesn't have connectors
    };
  }
}
