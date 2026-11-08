import { CommandDefinition } from '../CommandDispatcher';
import { InsertAIEngine } from './InsertAIEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertAICommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.AI.GENERATE_IMAGE', 'Generate Image', () => InsertAIEngine.Generate('image')),
      cmd('WORD.AI.GENERATE_DIAGRAM', 'Generate Diagram', () => InsertAIEngine.Generate('diagram')),
      cmd('WORD.AI.GENERATE_TABLE', 'Generate Table', () => InsertAIEngine.Generate('table')),
      cmd('WORD.AI.GENERATE_SUMMARY', 'Generate Summary Box', () => InsertAIEngine.Generate('summary')),
      cmd('WORD.AI.GENERATE_COVER', 'Generate Cover Page', () => InsertAIEngine.Generate('cover')),

      // AI PANEL
      cmd('WORD.INSERT.AI', 'Open AI Panel', () => InsertAIEngine.Panel('main')),
      cmd('WORD.INSERT.AI.CHAT', 'Open AI Chat', () => InsertAIEngine.Panel('chat')),
      cmd('WORD.INSERT.AI.FLOATING', 'Floating AI Window', () => InsertAIEngine.Panel('floating')),
      cmd('WORD.INSERT.AI.SIDEBAR', 'Sidebar AI', () => InsertAIEngine.Panel('sidebar')),

      // WRITING
      cmd('WORD.INSERT.AI.WRITE', 'Generate Text', () => InsertAIEngine.Generate('text')),
      cmd('WORD.INSERT.AI.CONTINUE', 'Continue Writing', () => InsertAIEngine.Generate('continue')),
      cmd('WORD.INSERT.AI.PARAGRAPH', 'Generate Paragraph', () => InsertAIEngine.Generate('paragraph')),
      cmd('WORD.INSERT.AI.ARTICLE', 'Generate Article', () => InsertAIEngine.Generate('article')),
      cmd('WORD.INSERT.AI.REPORT', 'Generate Report', () => InsertAIEngine.Generate('report')),
      cmd('WORD.INSERT.AI.LETTER', 'Generate Letter', () => InsertAIEngine.Generate('letter')),
      cmd('WORD.INSERT.AI.EMAIL', 'Generate Email', () => InsertAIEngine.Generate('email')),
      cmd('WORD.INSERT.AI.BLOG', 'Generate Blog', () => InsertAIEngine.Generate('blog')),
      cmd('WORD.INSERT.AI.OUTLINE', 'Generate Outline', () => InsertAIEngine.Generate('outline')),

      // REWRITE
      cmd('WORD.INSERT.AI.REWRITE', 'Rewrite', () => InsertAIEngine.Rewrite('default')),
      cmd('WORD.INSERT.AI.REWRITE.SHORTER', 'Rewrite Shorter', () => InsertAIEngine.Rewrite('shorter')),
      cmd('WORD.INSERT.AI.REWRITE.LONGER', 'Rewrite Longer', () => InsertAIEngine.Rewrite('longer')),
      cmd('WORD.INSERT.AI.REWRITE.PROFESSIONAL', 'Professional Tone', () => InsertAIEngine.Rewrite('professional')),
      cmd('WORD.INSERT.AI.REWRITE.FRIENDLY', 'Friendly Tone', () => InsertAIEngine.Rewrite('friendly')),
      cmd('WORD.INSERT.AI.REWRITE.ACADEMIC', 'Academic Tone', () => InsertAIEngine.Rewrite('academic')),
      cmd('WORD.INSERT.AI.REWRITE.FORMAL', 'Formal Tone', () => InsertAIEngine.Rewrite('formal')),
      cmd('WORD.INSERT.AI.REWRITE.SIMPLE', 'Simplify', () => InsertAIEngine.Rewrite('simplify')),

      // TRANSLATE
      cmd('WORD.INSERT.AI.TRANSLATE', 'Translate', () => InsertAIEngine.Translate('dialog')),
      cmd('WORD.INSERT.AI.TRANSLATE.ENGLISH', 'Translate English', () => InsertAIEngine.Translate('english')),
      cmd('WORD.INSERT.AI.TRANSLATE.VIETNAMESE', 'Translate Vietnamese', () => InsertAIEngine.Translate('vietnamese')),
      cmd('WORD.INSERT.AI.TRANSLATE.AUTO', 'Auto Detect', () => InsertAIEngine.Translate('auto')),

      // SUMMARIZE
      cmd('WORD.INSERT.AI.SUMMARIZE', 'Summarize', () => InsertAIEngine.Summarize('dialog')),
      cmd('WORD.INSERT.AI.SUMMARIZE.SHORT', 'Short Summary', () => InsertAIEngine.Summarize('short')),
      cmd('WORD.INSERT.AI.SUMMARIZE.DETAILED', 'Detailed Summary', () => InsertAIEngine.Summarize('detailed')),
      cmd('WORD.INSERT.AI.SUMMARIZE.BULLETS', 'Bullet Summary', () => InsertAIEngine.Summarize('bullets')),

      // REVIEW
      cmd('WORD.INSERT.AI.REVIEW', 'Review Document', () => InsertAIEngine.Review('document')),
      cmd('WORD.INSERT.AI.SPELLCHECK', 'Spell Check', () => InsertAIEngine.Review('spell')),
      cmd('WORD.INSERT.AI.GRAMMAR', 'Grammar Check', () => InsertAIEngine.Review('grammar')),
      cmd('WORD.INSERT.AI.STYLE', 'Style Suggestions', () => InsertAIEngine.Review('style')),
      cmd('WORD.INSERT.AI.CLARITY', 'Improve Clarity', () => InsertAIEngine.Review('clarity')),

      // EXPLAIN
      cmd('WORD.INSERT.AI.EXPLAIN', 'Explain', () => InsertAIEngine.Explain('selection')),
      cmd('WORD.INSERT.AI.EXPLAIN.PARAGRAPH', 'Explain Paragraph', () => InsertAIEngine.Explain('paragraph')),
      cmd('WORD.INSERT.AI.EXPLAIN.TABLE', 'Explain Table', () => InsertAIEngine.Explain('table')),
      cmd('WORD.INSERT.AI.EXPLAIN.CHART', 'Explain Chart', () => InsertAIEngine.Explain('chart')),

      // TABLES
      cmd('WORD.INSERT.AI.TABLE', 'Generate Table', () => InsertAIEngine.GenerateTable('default')),
      cmd('WORD.INSERT.AI.TABLE.SCHEDULE', 'Schedule', () => InsertAIEngine.GenerateTable('schedule')),
      cmd('WORD.INSERT.AI.TABLE.BUDGET', 'Budget', () => InsertAIEngine.GenerateTable('budget')),
      cmd('WORD.INSERT.AI.TABLE.COMPARE', 'Comparison Table', () => InsertAIEngine.GenerateTable('compare')),

      // CHARTS
      cmd('WORD.INSERT.AI.CHART', 'Generate Chart', () => InsertAIEngine.GenerateChart('default')),
      cmd('WORD.INSERT.AI.CHART.BAR', 'Bar Chart', () => InsertAIEngine.GenerateChart('bar')),
      cmd('WORD.INSERT.AI.CHART.LINE', 'Line Chart', () => InsertAIEngine.GenerateChart('line')),
      cmd('WORD.INSERT.AI.CHART.PIE', 'Pie Chart', () => InsertAIEngine.GenerateChart('pie')),
      cmd('WORD.INSERT.AI.CHART.SCATTER', 'Scatter Chart', () => InsertAIEngine.GenerateChart('scatter')),

      // IMAGES
      cmd('WORD.INSERT.AI.IMAGE', 'Generate Image', () => InsertAIEngine.GenerateImage('default')),
      cmd('WORD.INSERT.AI.IMAGE.ILLUSTRATION', 'Illustration', () => InsertAIEngine.GenerateImage('illustration')),
      cmd('WORD.INSERT.AI.IMAGE.ICON', 'Icon', () => InsertAIEngine.GenerateImage('icon')),
      cmd('WORD.INSERT.AI.IMAGE.BANNER', 'Banner', () => InsertAIEngine.GenerateImage('banner')),
      cmd('WORD.INSERT.AI.IMAGE.BACKGROUND', 'Background', () => InsertAIEngine.GenerateImage('background')),

      // SMARTART
      cmd('WORD.INSERT.AI.SMARTART', 'Generate SmartArt', () => InsertAIEngine.GenerateSmartArt('default')),
      cmd('WORD.INSERT.AI.ORGCHART', 'Organization Chart', () => InsertAIEngine.GenerateSmartArt('orgchart')),
      cmd('WORD.INSERT.AI.TIMELINE', 'Timeline', () => InsertAIEngine.GenerateSmartArt('timeline')),
      cmd('WORD.INSERT.AI.PROCESS', 'Process Diagram', () => InsertAIEngine.GenerateSmartArt('process')),
      cmd('WORD.INSERT.AI.MINDMAP', 'Mind Map', () => InsertAIEngine.GenerateSmartArt('mindmap')),
      cmd('WORD.INSERT.AI.FLOWCHART', 'Flowchart', () => InsertAIEngine.GenerateSmartArt('flowchart')),

      // CODE
      cmd('WORD.INSERT.AI.CODE', 'Generate Code', () => InsertAIEngine.GenerateCode('default')),
      cmd('WORD.INSERT.AI.CODE.PYTHON', 'Python', () => InsertAIEngine.GenerateCode('python')),
      cmd('WORD.INSERT.AI.CODE.CSHARP', 'C#', () => InsertAIEngine.GenerateCode('csharp')),
      cmd('WORD.INSERT.AI.CODE.JAVASCRIPT', 'JavaScript', () => InsertAIEngine.GenerateCode('javascript')),
      cmd('WORD.INSERT.AI.CODE.SQL', 'SQL', () => InsertAIEngine.GenerateCode('sql')),

      // EQUATIONS
      cmd('WORD.INSERT.AI.EQUATION', 'Generate Equation', () => InsertAIEngine.GenerateEquation('equation')),
      cmd('WORD.INSERT.AI.FORMULA', 'Generate Formula', () => InsertAIEngine.GenerateEquation('formula')),

      // REFERENCES
      cmd('WORD.INSERT.AI.CITATION', 'Generate Citation', () => InsertAIEngine.GenerateCitation('citation')),
      cmd('WORD.INSERT.AI.BIBLIOGRAPHY', 'Generate Bibliography', () => InsertAIEngine.GenerateCitation('bibliography')),
      cmd('WORD.INSERT.AI.REFERENCE', 'Reference Finder', () => InsertAIEngine.GenerateCitation('reference')),

      // TEMPLATE
      cmd('WORD.INSERT.AI.TEMPLATE', 'Generate Template', () => InsertAIEngine.Template('default')),
      cmd('WORD.INSERT.AI.RESUME', 'Resume', () => InsertAIEngine.Template('resume')),
      cmd('WORD.INSERT.AI.CONTRACT', 'Contract', () => InsertAIEngine.Template('contract')),
      cmd('WORD.INSERT.AI.INVOICE', 'Invoice', () => InsertAIEngine.Template('invoice')),
      cmd('WORD.INSERT.AI.PROPOSAL', 'Proposal', () => InsertAIEngine.Template('proposal')),

      // PROMPTS
      cmd('WORD.INSERT.AI.PROMPT.SAVE', 'Save Prompt', () => InsertAIEngine.Prompt('save')),
      cmd('WORD.INSERT.AI.PROMPT.LOAD', 'Load Prompt', () => InsertAIEngine.Prompt('load')),
      cmd('WORD.INSERT.AI.PROMPT.FAVORITE', 'Favorite Prompt', () => InsertAIEngine.Prompt('favorite')),
      cmd('WORD.INSERT.AI.PROMPT.DELETE', 'Delete Prompt', () => InsertAIEngine.Prompt('delete')),
    ];
  }
}
