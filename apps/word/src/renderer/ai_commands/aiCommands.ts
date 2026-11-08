import { CommandDefinition } from '../CommandDispatcher';
import { AIEngine } from './AIEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void, shortcut?: string): CommandDefinition {
  return { id, name, handler, shortcut };
}

export class AICommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // OFFICEX AI
      cmd('WORD.AI.OPEN', 'Open OfficeX AI', () => AIEngine.Panel('chat'), 'ctrl+shift+a'),

      // GENERATE
      cmd('WORD.AI.GENERATE', 'Generate', () => AIEngine.Rewrite('dialog'), 'ctrl+shift+g'),
      cmd('WORD.AI.GENERATE.PARAGRAPH', 'Generate Paragraph', () => AIEngine.Rewrite('paragraph')),
      cmd('WORD.AI.GENERATE.ARTICLE', 'Generate Article', () => AIEngine.Rewrite('article')),
      cmd('WORD.AI.GENERATE.REPORT', 'Generate Report', () => AIEngine.Rewrite('report')),
      cmd('WORD.AI.GENERATE.RESUME', 'Generate Resume', () => AIEngine.Rewrite('resume')),
      cmd('WORD.AI.GENERATE.CONTRACT', 'Generate Contract', () => AIEngine.Rewrite('contract')),
      cmd('WORD.AI.GENERATE.PROPOSAL', 'Generate Proposal', () => AIEngine.Rewrite('proposal')),
      cmd('WORD.AI.GENERATE.EMAIL', 'Generate Email', () => AIEngine.Rewrite('email')),
      cmd('WORD.AI.GENERATE.MEETING', 'Generate Meeting Notes', () => AIEngine.Rewrite('meeting')),
      cmd('WORD.AI.GENERATE.CHECKLIST', 'Generate Checklist', () => AIEngine.Rewrite('checklist')),
      cmd('WORD.AI.GENERATE.TABLE', 'Generate Table', () => AIEngine.Rewrite('table')),
      cmd('WORD.AI.GENERATE.TIMELINE', 'Generate Timeline', () => AIEngine.Rewrite('timeline')),
      cmd('WORD.AI.GENERATE.SMARTART', 'Generate SmartArt', () => AIEngine.Rewrite('smartart')),
      cmd('WORD.AI.GENERATE.FLOWCHART', 'Generate Flowchart', () => AIEngine.Rewrite('flowchart')),
      cmd('WORD.AI.GENERATE.DIAGRAM', 'Generate Diagram', () => AIEngine.Rewrite('diagram')),
      cmd('WORD.AI.GENERATE.CODE', 'Generate Code', () => AIEngine.Rewrite('code')),
      cmd('WORD.AI.GENERATE.FORMULA', 'Generate Formula', () => AIEngine.Rewrite('formula')),
      cmd('WORD.AI.GENERATE.IMAGEPROMPT', 'Generate Image Prompt', () => AIEngine.Rewrite('imageprompt')),
      cmd('WORD.AI.GENERATE.CAPTION', 'Generate Caption', () => AIEngine.Rewrite('caption')),
      cmd('WORD.AI.GENERATE.REFERENCES', 'Generate References', () => AIEngine.Rewrite('references')),
      cmd('WORD.AI.GENERATE.BIBLIOGRAPHY', 'Generate Bibliography', () => AIEngine.Rewrite('bibliography')),

      // REWRITE
      cmd('WORD.AI.REWRITE', 'Rewrite', () => AIEngine.Rewrite('dialog'), 'ctrl+shift+r'),
      cmd('WORD.AI.REWRITE.PROFESSIONAL', 'Professional', () => AIEngine.Rewrite('professional')),
      cmd('WORD.AI.REWRITE.ACADEMIC', 'Academic', () => AIEngine.Rewrite('academic')),
      cmd('WORD.AI.REWRITE.FRIENDLY', 'Friendly', () => AIEngine.Rewrite('friendly')),
      cmd('WORD.AI.REWRITE.BUSINESS', 'Business', () => AIEngine.Rewrite('business')),
      cmd('WORD.AI.REWRITE.TECHNICAL', 'Technical', () => AIEngine.Rewrite('technical')),
      cmd('WORD.AI.REWRITE.FORMAL', 'Formal', () => AIEngine.Rewrite('formal')),
      cmd('WORD.AI.REWRITE.CASUAL', 'Casual', () => AIEngine.Rewrite('casual')),
      cmd('WORD.AI.REWRITE.SIMPLIFY', 'Simplify', () => AIEngine.Rewrite('simplify')),
      cmd('WORD.AI.REWRITE.EXPAND', 'Expand', () => AIEngine.Rewrite('expand')),
      cmd('WORD.AI.REWRITE.SHORTEN', 'Shorten', () => AIEngine.Rewrite('shorten')),
      cmd('WORD.AI.REWRITE.IMPROVE_WRITING', 'Improve Writing', () => AIEngine.Rewrite('improve_writing')),
      cmd('WORD.AI.REWRITE.FIX_GRAMMAR', 'Fix Grammar', () => AIEngine.Rewrite('fix_grammar')),
      cmd('WORD.AI.REWRITE.IMPROVE_TONE', 'Improve Tone', () => AIEngine.Rewrite('improve_tone')),
      cmd('WORD.AI.REWRITE.IMPROVE_READABILITY', 'Improve Readability', () => AIEngine.Rewrite('improve_readability')),
      cmd('WORD.AI.REWRITE.FIX_PUNCTUATION', 'Fix Punctuation', () => AIEngine.Rewrite('fix_punctuation')),

      // SUMMARIZE
      cmd('WORD.AI.SUMMARIZE', 'Summarize', () => AIEngine.Summarize('dialog'), 'ctrl+shift+s'),
      cmd('WORD.AI.SUMMARIZE.SHORT', 'Short Summary', () => AIEngine.Summarize('short')),
      cmd('WORD.AI.SUMMARIZE.DETAILED', 'Detailed Summary', () => AIEngine.Summarize('detailed')),
      cmd('WORD.AI.SUMMARIZE.EXECUTIVE', 'Executive Summary', () => AIEngine.Summarize('executive')),
      cmd('WORD.AI.SUMMARIZE.BULLET', 'Bullet Summary', () => AIEngine.Summarize('bullet')),
      cmd('WORD.AI.SUMMARIZE.KEY_POINTS', 'Key Points', () => AIEngine.Summarize('key_points')),
      cmd('WORD.AI.SUMMARIZE.ONE_SENTENCE', 'One Sentence', () => AIEngine.Summarize('one_sentence')),

      // TRANSLATE
      cmd('WORD.AI.TRANSLATE', 'Translate', () => AIEngine.Translate('dialog'), 'ctrl+shift+t'),
      cmd('WORD.AI.TRANSLATE.AUTO', 'Auto Detect', () => AIEngine.Translate('auto')),
      cmd('WORD.AI.TRANSLATE.EN', 'English', () => AIEngine.Translate('en')),
      cmd('WORD.AI.TRANSLATE.VI', 'Vietnamese', () => AIEngine.Translate('vi')),
      cmd('WORD.AI.TRANSLATE.ZH', 'Chinese', () => AIEngine.Translate('zh')),
      cmd('WORD.AI.TRANSLATE.JA', 'Japanese', () => AIEngine.Translate('ja')),
      cmd('WORD.AI.TRANSLATE.KO', 'Korean', () => AIEngine.Translate('ko')),
      cmd('WORD.AI.TRANSLATE.FR', 'French', () => AIEngine.Translate('fr')),
      cmd('WORD.AI.TRANSLATE.DE', 'German', () => AIEngine.Translate('de')),
      cmd('WORD.AI.TRANSLATE.ES', 'Spanish', () => AIEngine.Translate('es')),
      cmd('WORD.AI.TRANSLATE.RU', 'Russian', () => AIEngine.Translate('ru')),
      cmd('WORD.AI.TRANSLATE.TH', 'Thai', () => AIEngine.Translate('th')),

      // ASSISTANT & CHAT
      cmd('WORD.AI.CHAT', 'Open AI Chat', () => AIEngine.Panel('chat'), 'ctrl+shift+c'),
      cmd('WORD.AI.CHAT.OPEN', 'Open AI Chat', () => AIEngine.Panel('chat')),
      cmd('WORD.AI.NEW_CHAT', 'New Chat', () => AIEngine.Chat('newchat')),
      cmd('WORD.AI.OPEN_SIDEBAR', 'Open AI Sidebar', () => AIEngine.Panel('chat')),
      cmd('WORD.AI.RECENT_CHATS', 'Recent Chats', () => AIEngine.Panel('chat')),
      cmd('WORD.AI.PINNED_CHATS', 'Pinned Chats', () => AIEngine.Panel('chat')),
      cmd('WORD.AI.HISTORY', 'Chat History', () => AIEngine.Panel('chat')),

      // WRITING
      cmd('WORD.AI.CONTINUE', 'Continue Writing', () => AIEngine.Rewrite('continue')),
      cmd('WORD.AI.SHORTEN', 'Shorten', () => AIEngine.Rewrite('shorten')),
      cmd('WORD.AI.EXPAND', 'Expand', () => AIEngine.Rewrite('expand')),
      cmd('WORD.AI.GRAMMAR', 'Fix Grammar & Spelling', () => AIEngine.Rewrite('fix_grammar')),
      cmd('WORD.AI.TONE', 'Adjust Tone', () => AIEngine.Rewrite('improve_tone')),

      // REVIEW
      cmd('WORD.AI.REVIEW_SELECTION', 'Review Selection', () => AIEngine.Review('selection')),
      cmd('WORD.AI.ACCESSIBILITY', 'Accessibility Review', () => AIEngine.Review('accessibility')),
      cmd('WORD.AI.READABILITY', 'Readability Analysis', () => AIEngine.Review('readability')),
      cmd('WORD.AI.DUPLICATE', 'Duplicate Detection', () => AIEngine.Review('duplicate')),
      cmd('WORD.AI.CONTRADICTION', 'Contradiction Detection', () => AIEngine.Review('contradiction')),
      cmd('WORD.AI.TRACK_CHANGES_REVIEW', 'Track Changes Review', () => AIEngine.Review('track_changes')),

      // TRANSLATE
      cmd('WORD.AI.TRANSLATE_PAGE', 'Translate Page', () => AIEngine.Translate('page')),
      cmd('WORD.AI.TRANSLATE_DOCUMENT', 'Translate Document', () => AIEngine.Translate('document')),

      // GENERATE
      cmd('WORD.AI.OUTLINE', 'Generate Outline', () => AIEngine.Rewrite('outline')),
      cmd('WORD.AI.TITLE', 'Generate Title', () => AIEngine.Rewrite('title')),
      cmd('WORD.AI.TOC', 'Generate TOC', () => AIEngine.Rewrite('toc')),
      cmd('WORD.AI.FAQ', 'Generate FAQ', () => AIEngine.Rewrite('faq')),
      cmd('WORD.AI.REFERENCE', 'Generate References', () => AIEngine.Rewrite('references')),
      cmd('WORD.AI.METADATA', 'Generate Metadata', () => AIEngine.Rewrite('metadata')),

      // INSERT
      cmd('WORD.AI.TABLE', 'Generate Table', () => AIEngine.Rewrite('table')),
      cmd('WORD.AI.SMARTART', 'Generate SmartArt', () => AIEngine.Rewrite('smartart')),
      cmd('WORD.AI.DIAGRAM', 'Generate Diagram', () => AIEngine.Rewrite('diagram')),
      cmd('WORD.AI.TIMELINE', 'Generate Timeline', () => AIEngine.Rewrite('timeline')),
      cmd('WORD.AI.MINDMAP', 'Generate Mind Map', () => AIEngine.Rewrite('mindmap')),
      cmd('WORD.AI.FLOWCHART', 'Generate Flowchart', () => AIEngine.Rewrite('flowchart')),
      cmd('WORD.AI.IMAGEPROMPT', 'Generate Image Prompt', () => AIEngine.Rewrite('imageprompt')),

      // RESEARCH
      cmd('WORD.AI.ASK', 'Ask AI', () => AIEngine.Panel('chat')),
      cmd('WORD.AI.SEARCH', 'Search Document', () => AIEngine.Chat('search')),
      cmd('WORD.AI.FIND_SIMILAR', 'Find Similar', () => AIEngine.Chat('find_similar')),
      cmd('WORD.AI.QUESTIONS', 'Generate Questions', () => AIEngine.Rewrite('questions')),
      cmd('WORD.AI.FLASHCARD', 'Flash Cards', () => AIEngine.Rewrite('flashcards')),

      // SETTINGS
      cmd('WORD.AI.SETTINGS', 'AI Settings', () => AIEngine.Panel('settings')),
    ];
  }
}
