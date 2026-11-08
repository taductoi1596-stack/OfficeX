import { SmartArtNode } from './SmartArtNode';
import { SmartArtRelationship, RelationshipType } from './SmartArtRelationship';

/**
 * The master Graph Data Model representing the entire SmartArt semantic structure.
 */
export class SmartArtModel {
  public id: string;
  
  // The available physical bounding box that the layout engine is allowed to use.
  public bounds: { width: number, height: number } = { width: 800, height: 600 };
  
  public nodes: Map<string, SmartArtNode> = new Map();
  public relationships: SmartArtRelationship[] = [];

  constructor(id: string) {
    this.id = id;
  }

  public addNode(node: SmartArtNode): void {
    this.nodes.set(node.id, node);
  }

  public addRelationship(sourceId: string, targetId: string, type: RelationshipType = RelationshipType.Sequential): void {
    this.relationships.push(new SmartArtRelationship(sourceId, targetId, type));
  }

  public getRootNodes(): SmartArtNode[] {
    const targetIds = new Set(this.relationships.map(r => r.targetId));
    return Array.from(this.nodes.values()).filter(node => !targetIds.has(node.id));
  }
}
