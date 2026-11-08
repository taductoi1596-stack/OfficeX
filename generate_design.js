const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/word/src/renderer/design';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  'designThemesCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignThemesCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.THEME', 'Themes Gallery', () => {}),
      cmd('WORD.DESIGN.THEME_BROWSE', 'Browse Themes', () => {}),
      cmd('WORD.DESIGN.THEME_SAVE', 'Save Current Theme', () => {}),
      cmd('WORD.DESIGN.THEME_RESET', 'Reset Theme', () => {}),
      cmd('WORD.DESIGN.THEME_OFFICE', 'Office Theme', () => {}),
      cmd('WORD.DESIGN.THEME_DARK', 'Dark Theme', () => {}),
      cmd('WORD.DESIGN.THEME_LIGHT', 'Light Theme', () => {}),
      cmd('WORD.DESIGN.THEME_CORPORATE', 'Corporate Theme', () => {}),
      cmd('WORD.DESIGN.THEME_ACADEMIC', 'Academic Theme', () => {}),
      cmd('WORD.DESIGN.THEME_BUSINESS', 'Business Theme', () => {}),
    ];
  }
}`,
  'designColorsCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignColorsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.COLORS', 'Theme Colors', () => {}),
      cmd('WORD.DESIGN.ACCENT_COLORS', 'Accent Colors', () => {}),
      cmd('WORD.DESIGN.CUSTOM_COLORS', 'Custom Colors', () => {}),
      cmd('WORD.DESIGN.RESET_COLORS', 'Reset Colors', () => {}),
    ];
  }
}`,
  'designFontsCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignFontsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.FONTS', 'Theme Fonts', () => {}),
      cmd('WORD.DESIGN.HEADING_FONT', 'Heading Font', () => {}),
      cmd('WORD.DESIGN.BODY_FONT', 'Body Font', () => {}),
      cmd('WORD.DESIGN.FONT_PAIR', 'Custom Font Pair', () => {}),
      cmd('WORD.DESIGN.FONT_RESET', 'Reset Fonts', () => {}),
    ];
  }
}`,
  'designSpacingCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignSpacingCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.SPACING', 'Paragraph Spacing', () => {}),
      cmd('WORD.DESIGN.SPACING_COMPACT', 'Compact', () => {}),
      cmd('WORD.DESIGN.SPACING_OPEN', 'Open', () => {}),
      cmd('WORD.DESIGN.SPACING_RELAXED', 'Relaxed', () => {}),
      cmd('WORD.DESIGN.SPACING_NONE', 'No Paragraph Space', () => {}),
      cmd('WORD.DESIGN.SPACING_CUSTOM', 'Custom Spacing', () => {}),
    ];
  }
}`,
  'designEffectsCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignEffectsCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.EFFECT', 'Effects', () => {}),
      cmd('WORD.DESIGN.SHADOW', 'Shadow', () => {}),
      cmd('WORD.DESIGN.REFLECTION', 'Reflection', () => {}),
      cmd('WORD.DESIGN.GLOW', 'Glow', () => {}),
      cmd('WORD.DESIGN.SOFT_EDGE', 'Soft Edge', () => {}),
      cmd('WORD.DESIGN.BEVEL', 'Bevel', () => {}),
      cmd('WORD.DESIGN.ROTATION', '3D Rotation', () => {}),
    ];
  }
}`,
  'designStyleSetCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignStyleSetCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.STYLE_SET', 'Style Gallery', () => {}),
      cmd('WORD.DESIGN.STYLE_MODERN', 'Modern', () => {}),
      cmd('WORD.DESIGN.STYLE_CLASSIC', 'Classic', () => {}),
      cmd('WORD.DESIGN.STYLE_ELEGANT', 'Elegant', () => {}),
      cmd('WORD.DESIGN.STYLE_PRO', 'Professional', () => {}),
      cmd('WORD.DESIGN.STYLE_MINIMAL', 'Minimal', () => {}),
      cmd('WORD.DESIGN.STYLE_CUSTOM', 'Custom Style Set', () => {}),
      cmd('WORD.DESIGN.STYLE_SAVE', 'Save Style Set', () => {}),
    ];
  }
}`,
  'designPageBackgroundCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageBackgroundCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.PAGE_BACKGROUND', 'Page Background', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_IMAGE', 'Background Image', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_TEXTURE', 'Background Texture', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_PATTERN', 'Background Pattern', () => {}),
      cmd('WORD.DESIGN.BACKGROUND_REMOVE', 'Remove Background', () => {}),
    ];
  }
}`,
  'designWatermarkCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignWatermarkCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.WATERMARK', 'Watermark', () => {}),
      cmd('WORD.DESIGN.WATERMARK_TEXT', 'Custom Text', () => {}),
      cmd('WORD.DESIGN.WATERMARK_IMAGE', 'Picture Watermark', () => {}),
      cmd('WORD.DESIGN.WATERMARK_REMOVE', 'Remove Watermark', () => {}),
    ];
  }
}`,
  'designPageColorCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageColorCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.PAGE_COLOR', 'Page Color', () => {}),
      cmd('WORD.DESIGN.PAGE_GRADIENT', 'Gradient', () => {}),
      cmd('WORD.DESIGN.PAGE_TEXTURE', 'Texture', () => {}),
      cmd('WORD.DESIGN.PAGE_PATTERN', 'Pattern', () => {}),
      cmd('WORD.DESIGN.PAGE_FILL', 'Fill Effects', () => {}),
      cmd('WORD.DESIGN.PAGE_CLEAR', 'No Color', () => {}),
    ];
  }
}`,
  'designPageBordersCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignPageBordersCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.BORDER', 'Border Gallery', () => {}),
      cmd('WORD.DESIGN.BORDER_BOX', 'Box', () => {}),
      cmd('WORD.DESIGN.BORDER_SHADOW', 'Shadow', () => {}),
      cmd('WORD.DESIGN.BORDER_3D', '3D', () => {}),
      cmd('WORD.DESIGN.BORDER_CUSTOM', 'Custom Border', () => {}),
      cmd('WORD.DESIGN.BORDER_ART', 'Border Art', () => {}),
      cmd('WORD.DESIGN.BORDER_REMOVE', 'Remove Border', () => {}),
    ];
  }
}`,
  'designFormatCommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignFormatCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.DESIGN.FORMAT', 'Format Gallery', () => {}),
      cmd('WORD.DESIGN.FORMAT_RESET', 'Reset Formatting', () => {}),
      cmd('WORD.DESIGN.FORMAT_IMPORT', 'Import Formatting', () => {}),
      cmd('WORD.DESIGN.FORMAT_EXPORT', 'Export Formatting', () => {}),
    ];
  }
}`,
  'designAICommands.ts': `import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition { return { id, name, handler }; }
export class DesignAICommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.AI.DESIGN_THEME', 'Suggest Theme', () => {}),
      cmd('WORD.AI.DESIGN_FORMAT', 'Improve Formatting', () => {}),
      cmd('WORD.AI.DESIGN_MODERN', 'Modernize Document', () => {}),
      cmd('WORD.AI.DESIGN_CORPORATE', 'Corporate Style', () => {}),
      cmd('WORD.AI.DESIGN_ACADEMIC', 'Academic Style', () => {}),
      cmd('WORD.AI.DESIGN_ACCESSIBILITY', 'Accessibility Check', () => {}),
      cmd('WORD.AI.DESIGN_COVER', 'Generate Cover', () => {}),
    ];
  }
}`
};

for (const [file, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
  console.log('Created ' + file);
}
