export enum RelationshipType {
  ParentChild = 'parent_child',
  Sequential = 'sequential',
  Bidirectional = 'bidirectional'
}

/**
 * Defines a directed edge in the SmartArt graph connecting two nodes.
 */
export class SmartArtRelationship {
  public sourceId: string;
  public targetId: string;
  public type: RelationshipType;

  constructor(sourceId: string, targetId: string, type: RelationshipType = RelationshipType.ParentChild) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.type = type;
  }
}

/**
 * Output of the LayoutGenerator: The physical path coordinates of the connector.
 */
export interface LayoutConnector {
  sourceId: string;
  targetId: string;
  points: { x: number, y: number }[];
}
