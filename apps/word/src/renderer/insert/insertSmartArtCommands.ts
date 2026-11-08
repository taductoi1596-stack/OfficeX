import { CommandDefinition } from '../CommandDispatcher';
import { InsertSmartArtEngine } from './InsertSmartArtEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertSmartArtCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.SMARTART.ADD_SHAPE', 'Add Shape', () => {
        import('../editorApi').then(({ EditorAPI }) => {
          (EditorAPI.getLegacy() as any)?.addSmartArtNode?.();
        });
      }),
      cmd('WORD.SMARTART.PROMOTE', 'Promote', () => {
        import('../editorApi').then(({ EditorAPI }) => {
          (EditorAPI.getLegacy() as any)?.promoteSmartArtNode?.();
        });
      }),
      cmd('WORD.SMARTART.DEMOTE', 'Demote', () => {
        import('../editorApi').then(({ EditorAPI }) => {
          (EditorAPI.getLegacy() as any)?.demoteSmartArtNode?.();
        });
      }),

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.SMARTART', 'SmartArt', () => InsertSmartArtEngine.SmartArt('list')),
      cmd('WORD.INSERT.SMARTART_HIERARCHY', 'Hierarchy', () => InsertSmartArtEngine.SmartArt('hierarchy')),
      cmd('WORD.INSERT.SMARTART_PROCESS', 'Process', () => InsertSmartArtEngine.SmartArt('process')),
      cmd('WORD.INSERT.SMARTART_CYCLE', 'Cycle', () => InsertSmartArtEngine.SmartArt('cycle')),
      cmd('WORD.INSERT.SMARTART_RELATION', 'Relationship', () => InsertSmartArtEngine.SmartArt('relationship')),
      cmd('WORD.INSERT.SMARTART_MATRIX', 'Matrix', () => InsertSmartArtEngine.SmartArt('matrix')),
      cmd('WORD.INSERT.SMARTART_PYRAMID', 'Pyramid', () => InsertSmartArtEngine.SmartArt('pyramid')),
      cmd('WORD.INSERT.SMARTART_PICTURE', 'Picture SmartArt', () => InsertSmartArtEngine.SmartArt('picture')),

      // SMARTART
      cmd('WORD.INSERT.SMARTART', 'Insert SmartArt', () => InsertSmartArtEngine.SmartArt('dialog')),
      cmd('WORD.INSERT.SMARTART.DIALOG', 'Open SmartArt Gallery', () => InsertSmartArtEngine.SmartArt('dialog')),
      cmd('WORD.INSERT.SMARTART.BLANK', 'Blank SmartArt', () => InsertSmartArtEngine.SmartArt('blank')),
      cmd('WORD.INSERT.SMARTART.TEMPLATE', 'SmartArt Template', () => InsertSmartArtEngine.SmartArt('template')),

      // LIST
      cmd('WORD.INSERT.SMARTART.LIST', 'List SmartArt', () => InsertSmartArtEngine.List('basic')),
      cmd('WORD.INSERT.SMARTART.LIST.BASIC', 'Basic List', () => InsertSmartArtEngine.List('basic')),
      cmd('WORD.INSERT.SMARTART.LIST.VERTICAL', 'Vertical List', () => InsertSmartArtEngine.List('vertical')),
      cmd('WORD.INSERT.SMARTART.LIST.HORIZONTAL', 'Horizontal List', () => InsertSmartArtEngine.List('horizontal')),
      cmd('WORD.INSERT.SMARTART.LIST.ACCENT', 'Accent List', () => InsertSmartArtEngine.List('accent')),
      cmd('WORD.INSERT.SMARTART.LIST.GROUPED', 'Grouped List', () => InsertSmartArtEngine.List('grouped')),

      // PROCESS
      cmd('WORD.INSERT.SMARTART.PROCESS', 'Process', () => InsertSmartArtEngine.Process('basic')),
      cmd('WORD.INSERT.SMARTART.PROCESS.BASIC', 'Basic Process', () => InsertSmartArtEngine.Process('basic')),
      cmd('WORD.INSERT.SMARTART.PROCESS.CHEVRON', 'Chevron Process', () => InsertSmartArtEngine.Process('chevron')),
      cmd('WORD.INSERT.SMARTART.PROCESS.CONTINUOUS', 'Continuous Process', () => InsertSmartArtEngine.Process('continuous')),
      cmd('WORD.INSERT.SMARTART.PROCESS.CIRCULAR', 'Circular Process', () => InsertSmartArtEngine.Process('circular')),
      cmd('WORD.INSERT.SMARTART.PROCESS.STEP', 'Step Process', () => InsertSmartArtEngine.Process('step')),

      // CYCLE
      cmd('WORD.INSERT.SMARTART.CYCLE', 'Cycle', () => InsertSmartArtEngine.Cycle('basic')),
      cmd('WORD.INSERT.SMARTART.CYCLE.BASIC', 'Basic Cycle', () => InsertSmartArtEngine.Cycle('basic')),
      cmd('WORD.INSERT.SMARTART.CYCLE.RADIAL', 'Radial Cycle', () => InsertSmartArtEngine.Cycle('radial')),
      cmd('WORD.INSERT.SMARTART.CYCLE.REPEATING', 'Repeating Cycle', () => InsertSmartArtEngine.Cycle('repeating')),

      // HIERARCHY
      cmd('WORD.INSERT.SMARTART.HIERARCHY', 'Hierarchy', () => InsertSmartArtEngine.Hierarchy('orgchart')),
      cmd('WORD.INSERT.SMARTART.ORGCHART', 'Organization Chart', () => InsertSmartArtEngine.Hierarchy('orgchart')),
      cmd('WORD.INSERT.SMARTART.HIERARCHY.LABEL', 'Labeled Hierarchy', () => InsertSmartArtEngine.Hierarchy('label')),
      cmd('WORD.INSERT.SMARTART.HIERARCHY.TABLE', 'Table Hierarchy', () => InsertSmartArtEngine.Hierarchy('table')),

      // RELATIONSHIP
      cmd('WORD.INSERT.SMARTART.RELATIONSHIP', 'Relationship', () => InsertSmartArtEngine.Relationship('basic')),
      cmd('WORD.INSERT.SMARTART.RELATIONSHIP.BASIC', 'Basic Relationship', () => InsertSmartArtEngine.Relationship('basic')),
      cmd('WORD.INSERT.SMARTART.RELATIONSHIP.VENN', 'Venn Diagram', () => InsertSmartArtEngine.Relationship('venn')),
      cmd('WORD.INSERT.SMARTART.RELATIONSHIP.BALANCE', 'Balance Diagram', () => InsertSmartArtEngine.Relationship('balance')),

      // MATRIX
      cmd('WORD.INSERT.SMARTART.MATRIX', 'Matrix', () => InsertSmartArtEngine.Matrix('basic')),
      cmd('WORD.INSERT.SMARTART.MATRIX.BASIC', 'Basic Matrix', () => InsertSmartArtEngine.Matrix('basic')),
      cmd('WORD.INSERT.SMARTART.MATRIX.GRID', 'Grid Matrix', () => InsertSmartArtEngine.Matrix('grid')),

      // PYRAMID
      cmd('WORD.INSERT.SMARTART.PYRAMID', 'Pyramid', () => InsertSmartArtEngine.Pyramid('basic')),
      cmd('WORD.INSERT.SMARTART.PYRAMID.BASIC', 'Basic Pyramid', () => InsertSmartArtEngine.Pyramid('basic')),
      cmd('WORD.INSERT.SMARTART.PYRAMID.INVERTED', 'Inverted Pyramid', () => InsertSmartArtEngine.Pyramid('inverted')),

      // PICTURE
      cmd('WORD.INSERT.SMARTART.PICTURE', 'Picture SmartArt', () => InsertSmartArtEngine.Picture('caption')),
      cmd('WORD.INSERT.SMARTART.PICTURE.CAPTION', 'Caption Picture', () => InsertSmartArtEngine.Picture('caption')),
      cmd('WORD.INSERT.SMARTART.PICTURE.LIST', 'Picture List', () => InsertSmartArtEngine.Picture('list')),
      cmd('WORD.INSERT.SMARTART.PICTURE.ACCENT', 'Accent Picture', () => InsertSmartArtEngine.Picture('accent')),

      // AI
      cmd('WORD.INSERT.SMARTART.AI', 'Generate SmartArt', () => InsertSmartArtEngine.GenerateAI('generate')),
      cmd('WORD.INSERT.SMARTART.AI.OUTLINE', 'Generate From Outline', () => InsertSmartArtEngine.GenerateAI('outline')),
      cmd('WORD.INSERT.SMARTART.AI.TEXT', 'Generate From Text', () => InsertSmartArtEngine.GenerateAI('text')),
      cmd('WORD.INSERT.SMARTART.AI.DOCUMENT', 'Generate From Document', () => InsertSmartArtEngine.GenerateAI('document')),

      // CONVERT
      cmd('WORD.INSERT.SMARTART.CONVERT.TEXT', 'Convert Text To SmartArt', () => InsertSmartArtEngine.Convert('text')),
      cmd('WORD.INSERT.SMARTART.CONVERT.SHAPE', 'Convert Shapes', () => InsertSmartArtEngine.Convert('shape')),
      cmd('WORD.INSERT.SMARTART.CONVERT.LIST', 'Convert List', () => InsertSmartArtEngine.Convert('list')),
      cmd('WORD.INSERT.SMARTART.CONVERT.TABLE', 'Convert Table', () => InsertSmartArtEngine.Convert('table')),

      // LAYOUT
      cmd('WORD.INSERT.SMARTART.LAYOUT', 'Change Layout', () => InsertSmartArtEngine.ChangeLayout('dialog')),
      cmd('WORD.INSERT.SMARTART.LAYOUT.LEFT', 'Left Layout', () => InsertSmartArtEngine.ChangeLayout('left')),
      cmd('WORD.INSERT.SMARTART.LAYOUT.RIGHT', 'Right Layout', () => InsertSmartArtEngine.ChangeLayout('right')),
      cmd('WORD.INSERT.SMARTART.LAYOUT.VERTICAL', 'Vertical Layout', () => InsertSmartArtEngine.ChangeLayout('vertical')),
      cmd('WORD.INSERT.SMARTART.LAYOUT.HORIZONTAL', 'Horizontal Layout', () => InsertSmartArtEngine.ChangeLayout('horizontal')),

      // STYLE
      cmd('WORD.INSERT.SMARTART.STYLE', 'SmartArt Style', () => InsertSmartArtEngine.Style('style')),
      cmd('WORD.INSERT.SMARTART.COLOR', 'Change Colors', () => InsertSmartArtEngine.Style('color')),
      cmd('WORD.INSERT.SMARTART.THEME', 'Theme', () => InsertSmartArtEngine.Style('theme')),
      cmd('WORD.INSERT.SMARTART.FONT', 'Font', () => InsertSmartArtEngine.Style('font')),
      cmd('WORD.INSERT.SMARTART.BACKGROUND', 'Background', () => InsertSmartArtEngine.Style('background')),

      // NODE
      cmd('WORD.INSERT.SMARTART.NODE.ADD', 'Add Node', () => InsertSmartArtEngine.Node('add')),
      cmd('WORD.INSERT.SMARTART.NODE.DELETE', 'Delete Node', () => InsertSmartArtEngine.Node('delete')),
      cmd('WORD.INSERT.SMARTART.NODE.PROMOTE', 'Promote Node', () => InsertSmartArtEngine.Node('promote')),
      cmd('WORD.INSERT.SMARTART.NODE.DEMOTE', 'Demote Node', () => InsertSmartArtEngine.Node('demote')),
      cmd('WORD.INSERT.SMARTART.NODE.MOVEUP', 'Move Up', () => InsertSmartArtEngine.Node('moveup')),
      cmd('WORD.INSERT.SMARTART.NODE.MOVEDOWN', 'Move Down', () => InsertSmartArtEngine.Node('movedown')),

      // TEMPLATE
      cmd('WORD.INSERT.SMARTART.TEMPLATE.SAVE', 'Save Template', () => InsertSmartArtEngine.Template('save')),
      cmd('WORD.INSERT.SMARTART.TEMPLATE.LOAD', 'Load Template', () => InsertSmartArtEngine.Template('load')),
      cmd('WORD.INSERT.SMARTART.TEMPLATE.DELETE', 'Delete Template', () => InsertSmartArtEngine.Template('delete')),
    ];
  }
}
