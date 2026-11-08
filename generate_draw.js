const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/word/src/renderer/draw';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  'drawPensCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawPensCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.PEN', 'Pen', () => {}),
      cmd('WORD.DRAW.BALLPOINT', 'Ballpoint Pen', () => {}),
      cmd('WORD.DRAW.PENCIL', 'Pencil', () => {}),
      cmd('WORD.DRAW.CALLIGRAPHY', 'Calligraphy Pen', () => {}),
      cmd('WORD.DRAW.MARKER', 'Marker', () => {}),
      cmd('WORD.DRAW.BRUSH', 'Brush', () => {}),
      cmd('WORD.DRAW.CUSTOM', 'Custom Pen', () => {}),
      cmd('WORD.DRAW.FAVORITE', 'Favorites', () => {}),
      cmd('WORD.DRAW.COLOR', 'Color', () => {}),
      cmd('WORD.DRAW.THICKNESS', 'Thickness', () => {}),
      cmd('WORD.DRAW.OPACITY', 'Opacity', () => {}),
      cmd('WORD.DRAW.PRESSURE', 'Pressure', () => {}),
      cmd('WORD.DRAW.TIP', 'Tip Shape', () => {}),
      cmd('WORD.DRAW.SMOOTHING', 'Smoothing', () => {}),
    ];
  }
}`,
  'drawHighlighterCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawHighlighterCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.HIGHLIGHT', 'Highlighter', () => {}),
      cmd('WORD.DRAW.HIGHLIGHT_COLOR', 'Highlighter Color', () => {}),
    ];
  }
}`,
  'drawEraserCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawEraserCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.ERASER', 'Eraser', () => {}),
      cmd('WORD.DRAW.POINT_ERASER', 'Point Eraser', () => {}),
      cmd('WORD.DRAW.STROKE_ERASER', 'Stroke Eraser', () => {}),
      cmd('WORD.DRAW.OBJECT_ERASER', 'Object Eraser', () => {}),
      cmd('WORD.DRAW.CLEAR', 'Clear Ink', () => {}),
    ];
  }
}`,
  'drawLassoCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawLassoCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.LASSO', 'Lasso Select', () => {}),
      cmd('WORD.DRAW.RECT_SELECT', 'Rectangle Select', () => {}),
      cmd('WORD.DRAW.FREE_SELECT', 'Free Select', () => {}),
    ];
  }
}`,
  'drawInkToolsCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToolsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.UNDO', 'Undo Stroke', () => {}),
      cmd('WORD.DRAW.REDO', 'Redo Stroke', () => {}),
      cmd('WORD.DRAW.DUPLICATE', 'Duplicate Ink', () => {}),
      cmd('WORD.DRAW.DELETE', 'Delete Ink', () => {}),
      cmd('WORD.DRAW.GROUP', 'Group Ink', () => {}),
      cmd('WORD.DRAW.UNGROUP', 'Ungroup Ink', () => {}),
      cmd('WORD.DRAW.FRONT', 'Bring Forward', () => {}),
      cmd('WORD.DRAW.BACK', 'Send Backward', () => {}),
    ];
  }
}`,
  'drawInkToShapeCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToShapeCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_SHAPE', 'Convert Shape', () => {}),
      cmd('WORD.DRAW.SHAPE_RECOGNITION', 'Recognize Shape', () => {}),
      cmd('WORD.DRAW.SHAPE_AUTOCORRECT', 'Auto Correct Shape', () => {}),
    ];
  }
}`,
  'drawInkToTextCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToTextCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_TEXT', 'Convert Text', () => {}),
      cmd('WORD.DRAW.HANDWRITING', 'Recognize Handwriting', () => {}),
      cmd('WORD.DRAW.LANGUAGE', 'Language', () => {}),
    ];
  }
}`,
  'drawInkToMathCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkToMathCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.INK_TO_MATH', 'Convert Equation', () => {}),
      cmd('WORD.DRAW.FORMULA', 'Recognize Formula', () => {}),
      cmd('WORD.DRAW.MATH_EDITOR', 'Math Editor', () => {}),
    ];
  }
}`,
  'drawInkReplayCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawInkReplayCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.REPLAY', 'Replay', () => {}),
      cmd('WORD.DRAW.REPLAY_PAUSE', 'Pause', () => {}),
      cmd('WORD.DRAW.REPLAY_STOP', 'Stop', () => {}),
      cmd('WORD.DRAW.REPLAY_SPEED', 'Speed', () => {}),
    ];
  }
}`,
  'drawRulerCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawRulerCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.RULER', 'Show Ruler', () => {}),
      cmd('WORD.DRAW.RULER_ROTATE', 'Rotate', () => {}),
      cmd('WORD.DRAW.RULER_SNAP', 'Snap', () => {}),
    ];
  }
}`,
  'drawCanvasCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawCanvasCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DRAW.CANVAS_NEW', 'New Canvas', () => {}),
      cmd('WORD.DRAW.CANVAS_RESIZE', 'Resize Canvas', () => {}),
      cmd('WORD.DRAW.CANVAS_BACKGROUND', 'Background', () => {}),
      cmd('WORD.DRAW.CANVAS_GRID', 'Grid', () => {}),
      cmd('WORD.DRAW.CANVAS_GUIDES', 'Guides', () => {}),
    ];
  }
}`,
  'drawAICommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawAICommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.AI.INK_BEAUTIFY', 'Beautify Ink', () => {}),
      cmd('WORD.AI.INK_CLEAN', 'Clean Handwriting', () => {}),
      cmd('WORD.AI.INK_SKETCH', 'Convert Sketch', () => {}),
      cmd('WORD.AI.INK_DIAGRAM', 'Generate Diagram', () => {}),
      cmd('WORD.AI.INK_SHAPE', 'Generate Shape', () => {}),
      cmd('WORD.AI.INK_EXPLAIN', 'Explain Drawing', () => {}),
    ];
  }
}`
};

for (const [file, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
  console.log('Created ' + file);
}
