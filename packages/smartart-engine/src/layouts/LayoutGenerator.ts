import { SmartArtModel } from '../models/SmartArtModel';
import { LayoutNode } from '../models/SmartArtNode';
import { LayoutConnector } from '../models/SmartArtRelationship';

export interface SmartArtLayoutResult {
  nodes: LayoutNode[];
  connectors: LayoutConnector[]; // We'll expand on this for complex layouts
}

/**
 * Strategy interface for different SmartArt Layout Algorithms
 * (e.g. List, Process, Cycle, Hierarchy).
 */
export interface LayoutGenerator {
  generateLayout(model: SmartArtModel): SmartArtLayoutResult;
}
