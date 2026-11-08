import { CommandDefinition } from '../CommandDispatcher';
import { InsertTextEngine } from './InsertTextEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertTextCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.TEXTBOX', 'Text Box', () => InsertTextEngine.TextBox('simple')),
      cmd('WORD.INSERT.QUICKPART', 'Quick Parts', () => InsertTextEngine.QuickPart('dialog')),
      cmd('WORD.INSERT.SIGNATURE', 'Signature Line', () => InsertTextEngine.Signature('dialog')),
      cmd('WORD.INSERT.DATE', 'Date', () => InsertTextEngine.DateTime('date')),
      cmd('WORD.INSERT.DROPCAP', 'Drop Cap', () => InsertTextEngine.DropCap('dropped')),
      cmd('WORD.INSERT.OBJECT', 'Object', () => InsertTextEngine.Object('dialog')),
      cmd('WORD.INSERT.FILE', 'File Attachment', () => {}),

      // TEXT BOX
      cmd('WORD.INSERT.TEXTBOX', 'Insert Text Box', () => InsertTextEngine.TextBox('simple')),
      cmd('WORD.INSERT.TEXTBOX.SIMPLE', 'Simple Text Box', () => InsertTextEngine.TextBox('simple')),
      cmd('WORD.INSERT.TEXTBOX.SIDEBAR', 'Sidebar Text Box', () => InsertTextEngine.TextBox('sidebar')),
      cmd('WORD.INSERT.TEXTBOX.QUOTE', 'Quote Text Box', () => InsertTextEngine.TextBox('quote')),
      cmd('WORD.INSERT.TEXTBOX.CAPTION', 'Caption Text Box', () => InsertTextEngine.TextBox('caption')),
      cmd('WORD.INSERT.TEXTBOX.VERTICAL', 'Vertical Text Box', () => InsertTextEngine.TextBox('vertical')),
      cmd('WORD.INSERT.TEXTBOX.HORIZONTAL', 'Horizontal Text Box', () => InsertTextEngine.TextBox('horizontal')),
      cmd('WORD.INSERT.TEXTBOX.CUSTOM', 'Custom Text Box', () => InsertTextEngine.TextBox('custom')),

      // RICH TEXT
      cmd('WORD.INSERT.RICHTEXT', 'Insert Rich Text', () => InsertTextEngine.RichText('html')),
      cmd('WORD.INSERT.RICHTEXT.HTML', 'Insert HTML', () => InsertTextEngine.RichText('html')),
      cmd('WORD.INSERT.RICHTEXT.MARKDOWN', 'Insert Markdown', () => InsertTextEngine.RichText('markdown')),
      cmd('WORD.INSERT.RICHTEXT.UNICODE', 'Insert Unicode Text', () => InsertTextEngine.RichText('unicode')),

      // PLAIN TEXT
      cmd('WORD.INSERT.PLAINTEXT', 'Insert Plain Text', () => InsertTextEngine.PlainText('clipboard')),
      cmd('WORD.INSERT.PLAINTEXT.FILE', 'Insert Text From File', () => InsertTextEngine.PlainText('file')),
      cmd('WORD.INSERT.PLAINTEXT.CLIPBOARD', 'Insert Clipboard Text', () => InsertTextEngine.PlainText('clipboard')),

      // WORDART
      cmd('WORD.INSERT.WORDART', 'Insert WordArt', () => InsertTextEngine.WordArt('classic')),
      cmd('WORD.INSERT.WORDART.CLASSIC', 'Classic WordArt', () => InsertTextEngine.WordArt('classic')),
      cmd('WORD.INSERT.WORDART.MODERN', 'Modern WordArt', () => InsertTextEngine.WordArt('modern')),
      cmd('WORD.INSERT.WORDART.OUTLINE', 'Outline WordArt', () => InsertTextEngine.WordArt('outline')),
      cmd('WORD.INSERT.WORDART.GRADIENT', 'Gradient WordArt', () => InsertTextEngine.WordArt('gradient')),
      cmd('WORD.INSERT.WORDART.SHADOW', 'Shadow WordArt', () => InsertTextEngine.WordArt('shadow')),
      cmd('WORD.INSERT.WORDART.GLOW', 'Glow WordArt', () => InsertTextEngine.WordArt('glow')),

      // DROP CAP
      cmd('WORD.INSERT.DROPCAP', 'Insert Drop Cap', () => InsertTextEngine.DropCap('dropped')),
      cmd('WORD.INSERT.DROPCAP.NONE', 'Remove Drop Cap', () => InsertTextEngine.DropCap('none')),
      cmd('WORD.INSERT.DROPCAP.DROPPED', 'Dropped', () => InsertTextEngine.DropCap('dropped')),
      cmd('WORD.INSERT.DROPCAP.MARGIN', 'In Margin', () => InsertTextEngine.DropCap('margin')),

      // SIGNATURE
      cmd('WORD.INSERT.SIGNATURE', 'Insert Signature Line', () => InsertTextEngine.Signature('dialog')),
      cmd('WORD.INSERT.SIGNATURE.DIGITAL', 'Digital Signature', () => InsertTextEngine.Signature('digital')),
      cmd('WORD.INSERT.SIGNATURE.IMAGE', 'Image Signature', () => InsertTextEngine.Signature('image')),
      cmd('WORD.INSERT.SIGNATURE.HANDWRITING', 'Handwriting Signature', () => InsertTextEngine.Signature('handwriting')),

      // DATE & TIME
      cmd('WORD.INSERT.DATE', 'Insert Date', () => InsertTextEngine.DateTime('date')),
      cmd('WORD.INSERT.TIME', 'Insert Time', () => InsertTextEngine.DateTime('time')),
      cmd('WORD.INSERT.DATETIME', 'Insert Date And Time', () => InsertTextEngine.DateTime('datetime')),
      cmd('WORD.INSERT.DATETIME.AUTOUPDATE', 'Auto Update Date', () => InsertTextEngine.DateTime('autoupdate')),

      // QUICK PARTS
      cmd('WORD.INSERT.QUICKPART', 'Insert Quick Part', () => InsertTextEngine.QuickPart('dialog')),
      cmd('WORD.INSERT.QUICKPART.DOCUMENTPROPERTY', 'Document Property', () => InsertTextEngine.QuickPart('property')),
      cmd('WORD.INSERT.QUICKPART.FIELD', 'Insert Field', () => InsertTextEngine.QuickPart('field')),
      cmd('WORD.INSERT.QUICKPART.BUILDINGBLOCK', 'Building Block', () => InsertTextEngine.QuickPart('buildingblock')),
      cmd('WORD.INSERT.QUICKPART.AUTOTEXT', 'AutoText', () => InsertTextEngine.QuickPart('autotext')),
      cmd('WORD.INSERT.QUICKPART.SAVE', 'Save Selection To Quick Parts', () => InsertTextEngine.QuickPart('save')),

      // FIELD
      cmd('WORD.INSERT.FIELD', 'Insert Field', () => InsertTextEngine.Field('dialog')),
      cmd('WORD.INSERT.FIELD.PAGE', 'Page Field', () => InsertTextEngine.Field('page')),
      cmd('WORD.INSERT.FIELD.NUMPAGES', 'Number Of Pages', () => InsertTextEngine.Field('numpages')),
      cmd('WORD.INSERT.FIELD.FILENAME', 'File Name', () => InsertTextEngine.Field('filename')),
      cmd('WORD.INSERT.FIELD.AUTHOR', 'Author', () => InsertTextEngine.Field('author')),
      cmd('WORD.INSERT.FIELD.CREATEDATE', 'Create Date', () => InsertTextEngine.Field('createdate')),
      cmd('WORD.INSERT.FIELD.SAVEDATE', 'Save Date', () => InsertTextEngine.Field('savedate')),
      cmd('WORD.INSERT.FIELD.TIME', 'Time', () => InsertTextEngine.Field('time')),
      cmd('WORD.INSERT.FIELD.CUSTOM', 'Custom Field', () => InsertTextEngine.Field('custom')),

      // DOCUMENT PROPERTY
      cmd('WORD.INSERT.PROPERTY', 'Insert Property', () => InsertTextEngine.Property('title')),
      cmd('WORD.INSERT.PROPERTY.TITLE', 'Title', () => InsertTextEngine.Property('title')),
      cmd('WORD.INSERT.PROPERTY.SUBJECT', 'Subject', () => InsertTextEngine.Property('subject')),
      cmd('WORD.INSERT.PROPERTY.AUTHOR', 'Author', () => InsertTextEngine.Property('author')),
      cmd('WORD.INSERT.PROPERTY.COMPANY', 'Company', () => InsertTextEngine.Property('company')),
      cmd('WORD.INSERT.PROPERTY.KEYWORDS', 'Keywords', () => InsertTextEngine.Property('keywords')),

      // OBJECT
      cmd('WORD.INSERT.OBJECT', 'Insert Object', () => InsertTextEngine.Object('dialog')),
      cmd('WORD.INSERT.OBJECT.OLE', 'OLE Object', () => InsertTextEngine.Object('ole')),
      cmd('WORD.INSERT.OBJECT.EMBEDDED', 'Embedded Object', () => InsertTextEngine.Object('embedded')),
      cmd('WORD.INSERT.OBJECT.LINKED', 'Linked Object', () => InsertTextEngine.Object('linked')),

      // BUILDING BLOCKS
      cmd('WORD.INSERT.BLOCK', 'Insert Building Block', () => InsertTextEngine.BuildingBlock('text')),
      cmd('WORD.INSERT.BLOCK.HEADER', 'Header Block', () => InsertTextEngine.BuildingBlock('header')),
      cmd('WORD.INSERT.BLOCK.FOOTER', 'Footer Block', () => InsertTextEngine.BuildingBlock('footer')),
      cmd('WORD.INSERT.BLOCK.COVER', 'Cover Block', () => InsertTextEngine.BuildingBlock('cover')),
      cmd('WORD.INSERT.BLOCK.TEXT', 'Text Block', () => InsertTextEngine.BuildingBlock('text')),

      // AI
      cmd('WORD.INSERT.TEXT.AI', 'Generate AI Text', () => InsertTextEngine.AIText('generate')),
      cmd('WORD.INSERT.TEXT.AI.SUMMARIZE', 'Insert Summary', () => InsertTextEngine.AIText('summarize')),
      cmd('WORD.INSERT.TEXT.AI.REWRITE', 'Rewrite Text', () => InsertTextEngine.AIText('rewrite')),
      cmd('WORD.INSERT.TEXT.AI.EXPLAIN', 'Explain Text', () => InsertTextEngine.AIText('explain')),
      cmd('WORD.INSERT.TEXT.AI.TRANSLATE', 'Translate Text', () => InsertTextEngine.AIText('translate')),
      cmd('WORD.INSERT.TEXT.AI.CONTINUE', 'Continue Writing', () => InsertTextEngine.AIText('continue')),

      // SNIPPETS
      cmd('WORD.INSERT.SNIPPET', 'Insert Snippet', () => InsertTextEngine.Snippet('dialog')),
      cmd('WORD.INSERT.SNIPPET.CODE', 'Code Snippet', () => InsertTextEngine.Snippet('code')),
      cmd('WORD.INSERT.SNIPPET.EMAIL', 'Email Template', () => InsertTextEngine.Snippet('email')),
      cmd('WORD.INSERT.SNIPPET.LETTER', 'Letter Template', () => InsertTextEngine.Snippet('letter')),
      cmd('WORD.INSERT.SNIPPET.REPORT', 'Report Template', () => InsertTextEngine.Snippet('report')),
    ];
  }
}
