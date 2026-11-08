import { CommandDefinition } from '../CommandDispatcher';
import { InsertShapeEngine } from './InsertShapeEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertShapeCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.SHAPE', 'Shapes Gallery', () => InsertShapeEngine.Shape('rectangle')),
      cmd('WORD.INSERT.TEXTBOX', 'Text Box', () => InsertShapeEngine.Shape('textbox')),
      cmd('WORD.INSERT.WORDART', 'WordArt', () => InsertShapeEngine.Shape('wordart')),
      cmd('WORD.INSERT.CANVAS', 'Drawing Canvas', () => InsertShapeEngine.Shape('canvas')),
      cmd('WORD.INSERT.CONNECTOR', 'Connector', () => InsertShapeEngine.Shape('connector')),
      cmd('WORD.INSERT.CALLOUT', 'Callout', () => InsertShapeEngine.Shape('callout')),

      // BASIC SHAPES
      cmd('WORD.INSERT.SHAPE', 'Insert Shape', () => InsertShapeEngine.Shape()),
      cmd('WORD.INSERT.SHAPE.RECTANGLE', 'Rectangle', () => InsertShapeEngine.Shape('rectangle')),
      cmd('WORD.INSERT.SHAPE.ROUNDED_RECTANGLE', 'Rounded Rectangle', () => InsertShapeEngine.Shape('rounded_rectangle')),
      cmd('WORD.INSERT.SHAPE.SQUARE', 'Square', () => InsertShapeEngine.Shape('square')),
      cmd('WORD.INSERT.SHAPE.ELLIPSE', 'Ellipse', () => InsertShapeEngine.Shape('ellipse')),
      cmd('WORD.INSERT.SHAPE.CIRCLE', 'Circle', () => InsertShapeEngine.Shape('circle')),
      cmd('WORD.INSERT.SHAPE.TRIANGLE', 'Triangle', () => InsertShapeEngine.Shape('triangle')),
      cmd('WORD.INSERT.SHAPE.RIGHT_TRIANGLE', 'Right Triangle', () => InsertShapeEngine.Shape('right_triangle')),
      cmd('WORD.INSERT.SHAPE.DIAMOND', 'Diamond', () => InsertShapeEngine.Shape('diamond')),
      cmd('WORD.INSERT.SHAPE.PENTAGON', 'Pentagon', () => InsertShapeEngine.Shape('pentagon')),
      cmd('WORD.INSERT.SHAPE.HEXAGON', 'Hexagon', () => InsertShapeEngine.Shape('hexagon')),
      cmd('WORD.INSERT.SHAPE.OCTAGON', 'Octagon', () => InsertShapeEngine.Shape('octagon')),
      cmd('WORD.INSERT.SHAPE.PARALLELOGRAM', 'Parallelogram', () => InsertShapeEngine.Shape('parallelogram')),
      cmd('WORD.INSERT.SHAPE.TRAPEZOID', 'Trapezoid', () => InsertShapeEngine.Shape('trapezoid')),
      cmd('WORD.INSERT.SHAPE.CHORD', 'Chord', () => InsertShapeEngine.Shape('chord')),
      cmd('WORD.INSERT.SHAPE.PIE', 'Pie', () => InsertShapeEngine.Shape('pie')),
      cmd('WORD.INSERT.SHAPE.CLOUD', 'Cloud', () => InsertShapeEngine.Shape('cloud')),
      cmd('WORD.INSERT.SHAPE.HEART', 'Heart', () => InsertShapeEngine.Shape('heart')),
      cmd('WORD.INSERT.SHAPE.MOON', 'Moon', () => InsertShapeEngine.Shape('moon')),
      cmd('WORD.INSERT.SHAPE.SUN', 'Sun', () => InsertShapeEngine.Shape('sun')),

      // LINES
      cmd('WORD.INSERT.SHAPE.LINE', 'Straight Line', () => InsertShapeEngine.Line('line')),
      cmd('WORD.INSERT.SHAPE.LINE.ARROW', 'Arrow Line', () => InsertShapeEngine.Line('arrow')),
      cmd('WORD.INSERT.SHAPE.LINE.DOUBLE_ARROW', 'Double Arrow', () => InsertShapeEngine.Line('double_arrow')),
      cmd('WORD.INSERT.SHAPE.LINE.CURVE', 'Curve', () => InsertShapeEngine.Line('curve')),
      cmd('WORD.INSERT.SHAPE.LINE.POLYLINE', 'Polyline', () => InsertShapeEngine.Line('polyline')),
      cmd('WORD.INSERT.SHAPE.LINE.FREEFORM', 'Freeform Line', () => InsertShapeEngine.Line('freeform')),

      // BLOCK ARROWS
      cmd('WORD.INSERT.SHAPE.ARROW.LEFT', 'Left Arrow', () => InsertShapeEngine.Arrow('left')),
      cmd('WORD.INSERT.SHAPE.ARROW.RIGHT', 'Right Arrow', () => InsertShapeEngine.Arrow('right')),
      cmd('WORD.INSERT.SHAPE.ARROW.UP', 'Up Arrow', () => InsertShapeEngine.Arrow('up')),
      cmd('WORD.INSERT.SHAPE.ARROW.DOWN', 'Down Arrow', () => InsertShapeEngine.Arrow('down')),
      cmd('WORD.INSERT.SHAPE.ARROW.LEFT_RIGHT', 'Left Right Arrow', () => InsertShapeEngine.Arrow('left_right')),
      cmd('WORD.INSERT.SHAPE.ARROW.QUAD', 'Quad Arrow', () => InsertShapeEngine.Arrow('quad')),
      cmd('WORD.INSERT.SHAPE.ARROW.CIRCULAR', 'Circular Arrow', () => InsertShapeEngine.Arrow('circular')),

      // FLOWCHART
      cmd('WORD.INSERT.SHAPE.FLOW.START', 'Start', () => InsertShapeEngine.Flowchart('start')),
      cmd('WORD.INSERT.SHAPE.FLOW.PROCESS', 'Process', () => InsertShapeEngine.Flowchart('process')),
      cmd('WORD.INSERT.SHAPE.FLOW.DECISION', 'Decision', () => InsertShapeEngine.Flowchart('decision')),
      cmd('WORD.INSERT.SHAPE.FLOW.DATA', 'Data', () => InsertShapeEngine.Flowchart('data')),
      cmd('WORD.INSERT.SHAPE.FLOW.DOCUMENT', 'Document', () => InsertShapeEngine.Flowchart('document')),
      cmd('WORD.INSERT.SHAPE.FLOW.DELAY', 'Delay', () => InsertShapeEngine.Flowchart('delay')),
      cmd('WORD.INSERT.SHAPE.FLOW.CONNECTOR', 'Connector', () => InsertShapeEngine.Flowchart('connector')),
      cmd('WORD.INSERT.SHAPE.FLOW.TERMINATOR', 'Terminator', () => InsertShapeEngine.Flowchart('terminator')),

      // STARS & BANNERS
      cmd('WORD.INSERT.SHAPE.STAR', 'Star', () => InsertShapeEngine.Shape('star')),
      cmd('WORD.INSERT.SHAPE.STAR5', 'Five Point Star', () => InsertShapeEngine.Shape('star5')),
      cmd('WORD.INSERT.SHAPE.STAR8', 'Eight Point Star', () => InsertShapeEngine.Shape('star8')),
      cmd('WORD.INSERT.SHAPE.STAR16', 'Sixteen Point Star', () => InsertShapeEngine.Shape('star16')),
      cmd('WORD.INSERT.SHAPE.BANNER', 'Banner', () => InsertShapeEngine.Shape('banner')),
      cmd('WORD.INSERT.SHAPE.RIBBON', 'Ribbon', () => InsertShapeEngine.Shape('ribbon')),

      // CALLOUTS
      cmd('WORD.INSERT.SHAPE.CALLOUT', 'Callout', () => InsertShapeEngine.Callout('callout')),
      cmd('WORD.INSERT.SHAPE.CALLOUT.RECTANGLE', 'Rectangle Callout', () => InsertShapeEngine.Callout('rectangle')),
      cmd('WORD.INSERT.SHAPE.CALLOUT.OVAL', 'Oval Callout', () => InsertShapeEngine.Callout('oval')),
      cmd('WORD.INSERT.SHAPE.CALLOUT.CLOUD', 'Cloud Callout', () => InsertShapeEngine.Callout('cloud')),

      // EQUATION SHAPES
      cmd('WORD.INSERT.SHAPE.PLUS', 'Plus', () => InsertShapeEngine.Shape('plus')),
      cmd('WORD.INSERT.SHAPE.MINUS', 'Minus', () => InsertShapeEngine.Shape('minus')),
      cmd('WORD.INSERT.SHAPE.MULTIPLY', 'Multiply', () => InsertShapeEngine.Shape('multiply')),
      cmd('WORD.INSERT.SHAPE.DIVIDE', 'Divide', () => InsertShapeEngine.Shape('divide')),

      // CONNECTORS
      cmd('WORD.INSERT.SHAPE.CONNECTOR.STRAIGHT', 'Straight Connector', () => InsertShapeEngine.Connector('straight')),
      cmd('WORD.INSERT.SHAPE.CONNECTOR.ELBOW', 'Elbow Connector', () => InsertShapeEngine.Connector('elbow')),
      cmd('WORD.INSERT.SHAPE.CONNECTOR.CURVE', 'Curved Connector', () => InsertShapeEngine.Connector('curve')),

      // FREEFORM
      cmd('WORD.INSERT.SHAPE.FREEFORM', 'Freeform Shape', () => InsertShapeEngine.Shape('freeform')),
      cmd('WORD.INSERT.SHAPE.SCRIBBLE', 'Scribble', () => InsertShapeEngine.Shape('scribble')),
      cmd('WORD.INSERT.SHAPE.POLYGON', 'Polygon', () => InsertShapeEngine.Shape('polygon')),

      // DRAWING CANVAS
      cmd('WORD.INSERT.SHAPE.CANVAS', 'Insert Drawing Canvas', () => InsertShapeEngine.Canvas('insert')),
      cmd('WORD.INSERT.SHAPE.CANVAS.RESIZE', 'Resize Canvas', () => InsertShapeEngine.Canvas('resize')),
      cmd('WORD.INSERT.SHAPE.CANVAS.DELETE', 'Delete Canvas', () => InsertShapeEngine.Canvas('delete')),

      // SHAPE STYLE
      cmd('WORD.INSERT.SHAPE.FILL', 'Fill Color', () => InsertShapeEngine.Style('fill')),
      cmd('WORD.INSERT.SHAPE.OUTLINE', 'Outline Color', () => InsertShapeEngine.Style('outline')),
      cmd('WORD.INSERT.SHAPE.WEIGHT', 'Outline Weight', () => InsertShapeEngine.Style('weight')),
      cmd('WORD.INSERT.SHAPE.DASH', 'Dash Style', () => InsertShapeEngine.Style('dash')),
      cmd('WORD.INSERT.SHAPE.GRADIENT', 'Gradient Fill', () => InsertShapeEngine.Style('gradient')),
      cmd('WORD.INSERT.SHAPE.TEXTURE', 'Texture Fill', () => InsertShapeEngine.Style('texture')),
      cmd('WORD.INSERT.SHAPE.PATTERN', 'Pattern Fill', () => InsertShapeEngine.Style('pattern')),
      cmd('WORD.INSERT.SHAPE.TRANSPARENCY', 'Transparency', () => InsertShapeEngine.Style('transparency')),

      // SHAPE EFFECTS
      cmd('WORD.INSERT.SHAPE.SHADOW', 'Shadow', () => InsertShapeEngine.Style('shadow')),
      cmd('WORD.INSERT.SHAPE.REFLECTION', 'Reflection', () => InsertShapeEngine.Style('reflection')),
      cmd('WORD.INSERT.SHAPE.GLOW', 'Glow', () => InsertShapeEngine.Style('glow')),
      cmd('WORD.INSERT.SHAPE.SOFTEDGE', 'Soft Edge', () => InsertShapeEngine.Style('softedge')),
      cmd('WORD.INSERT.SHAPE.BEVEL', 'Bevel', () => InsertShapeEngine.Style('bevel')),
      cmd('WORD.INSERT.SHAPE.THREED', '3D Format', () => InsertShapeEngine.Style('3d')),

      // ARRANGE
      cmd('WORD.INSERT.SHAPE.ALIGN', 'Align', () => InsertShapeEngine.Align('align')),
      cmd('WORD.INSERT.SHAPE.DISTRIBUTE', 'Distribute', () => InsertShapeEngine.Align('distribute')),
      cmd('WORD.INSERT.SHAPE.GROUP', 'Group', () => InsertShapeEngine.Group('group')),
      cmd('WORD.INSERT.SHAPE.UNGROUP', 'Ungroup', () => InsertShapeEngine.Group('ungroup')),
      cmd('WORD.INSERT.SHAPE.BRINGTOFRONT', 'Bring To Front', () => InsertShapeEngine.Arrange('bringtofront')),
      cmd('WORD.INSERT.SHAPE.SENDTOBACK', 'Send To Back', () => InsertShapeEngine.Arrange('sendtoback')),
      cmd('WORD.INSERT.SHAPE.ROTATE', 'Rotate', () => InsertShapeEngine.Rotate('rotate')),
      cmd('WORD.INSERT.SHAPE.FLIP', 'Flip', () => InsertShapeEngine.Rotate('flip')),
      cmd('WORD.INSERT.SHAPE.LOCK', 'Lock Shape', () => InsertShapeEngine.Arrange('lock')),

      // SHAPE TEMPLATE
      cmd('WORD.INSERT.SHAPE.TEMPLATE', 'Shape Template', () => InsertShapeEngine.Template('apply')),
      cmd('WORD.INSERT.SHAPE.TEMPLATE.SAVE', 'Save Template', () => InsertShapeEngine.Template('save')),
      cmd('WORD.INSERT.SHAPE.TEMPLATE.LOAD', 'Load Template', () => InsertShapeEngine.Template('load')),
      cmd('WORD.INSERT.SHAPE.TEMPLATE.DELETE', 'Delete Template', () => InsertShapeEngine.Template('delete')),
    ];
  }
}
