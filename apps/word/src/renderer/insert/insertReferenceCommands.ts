import { CommandDefinition } from '../CommandDispatcher';
import { InsertReferenceEngine } from './InsertReferenceEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertReferenceCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.HYPERLINK', 'Hyperlink', () => InsertReferenceEngine.Hyperlink()),
      cmd('WORD.INSERT.BOOKMARK', 'Bookmark', () => InsertReferenceEngine.Bookmark()),
      cmd('WORD.INSERT.CROSS_REFERENCE', 'Cross Reference', () => InsertReferenceEngine.CrossReference()),
      cmd('WORD.INSERT.TOC_LINK', 'Table of Contents Link', () => {}),

      // TABLE OF CONTENTS
      cmd('WORD.INSERT.REFERENCE.TOC', 'Insert Table Of Contents', () => InsertReferenceEngine.TableOfContents('dialog')),
      cmd('WORD.INSERT.REFERENCE.TOC.AUTOMATIC', 'Automatic Table Of Contents', () => InsertReferenceEngine.TableOfContents('automatic')),
      cmd('WORD.INSERT.REFERENCE.TOC.MANUAL', 'Manual Table Of Contents', () => InsertReferenceEngine.TableOfContents('manual')),
      cmd('WORD.INSERT.REFERENCE.TOC.CUSTOM', 'Custom TOC', () => InsertReferenceEngine.TableOfContents('custom')),
      cmd('WORD.INSERT.REFERENCE.TOC.UPDATE', 'Update TOC', () => InsertReferenceEngine.TableOfContents('update')),
      cmd('WORD.INSERT.REFERENCE.TOC.REMOVE', 'Remove TOC', () => InsertReferenceEngine.TableOfContents('remove')),

      // FOOTNOTE
      cmd('WORD.INSERT.REFERENCE.FOOTNOTE', 'Insert Footnote', () => InsertReferenceEngine.Footnote('dialog')),
      cmd('WORD.INSERT.REFERENCE.FOOTNOTE.NEXT', 'Next Footnote', () => InsertReferenceEngine.Footnote('next')),
      cmd('WORD.INSERT.REFERENCE.FOOTNOTE.PREVIOUS', 'Previous Footnote', () => InsertReferenceEngine.Footnote('previous')),
      cmd('WORD.INSERT.REFERENCE.FOOTNOTE.DELETE', 'Delete Footnote', () => InsertReferenceEngine.Footnote('delete')),
      cmd('WORD.INSERT.REFERENCE.FOOTNOTE.CONVERT', 'Convert To Endnote', () => InsertReferenceEngine.Footnote('convert')),

      // ENDNOTE
      cmd('WORD.INSERT.REFERENCE.ENDNOTE', 'Insert Endnote', () => InsertReferenceEngine.Endnote('dialog')),
      cmd('WORD.INSERT.REFERENCE.ENDNOTE.NEXT', 'Next Endnote', () => InsertReferenceEngine.Endnote('next')),
      cmd('WORD.INSERT.REFERENCE.ENDNOTE.PREVIOUS', 'Previous Endnote', () => InsertReferenceEngine.Endnote('previous')),
      cmd('WORD.INSERT.REFERENCE.ENDNOTE.DELETE', 'Delete Endnote', () => InsertReferenceEngine.Endnote('delete')),
      cmd('WORD.INSERT.REFERENCE.ENDNOTE.CONVERT', 'Convert To Footnote', () => InsertReferenceEngine.Endnote('convert')),

      // CITATION
      cmd('WORD.INSERT.REFERENCE.CITATION', 'Insert Citation', () => InsertReferenceEngine.Citation('dialog')),
      cmd('WORD.INSERT.REFERENCE.CITATION.NEW', 'New Citation', () => InsertReferenceEngine.Citation('new')),
      cmd('WORD.INSERT.REFERENCE.CITATION.EXISTING', 'Existing Citation', () => InsertReferenceEngine.Citation('existing')),
      cmd('WORD.INSERT.REFERENCE.CITATION.EDIT', 'Edit Citation', () => InsertReferenceEngine.Citation('edit')),
      cmd('WORD.INSERT.REFERENCE.CITATION.DELETE', 'Delete Citation', () => InsertReferenceEngine.Citation('delete')),
      cmd('WORD.INSERT.REFERENCE.CITATION.MANAGER', 'Citation Manager', () => InsertReferenceEngine.Citation('manager')),

      // BIBLIOGRAPHY
      cmd('WORD.INSERT.REFERENCE.BIBLIOGRAPHY', 'Insert Bibliography', () => InsertReferenceEngine.Bibliography('dialog')),
      cmd('WORD.INSERT.REFERENCE.BIBLIOGRAPHY.WORKSCITED', 'Works Cited', () => InsertReferenceEngine.Bibliography('workscited')),
      cmd('WORD.INSERT.REFERENCE.BIBLIOGRAPHY.REFERENCES', 'References', () => InsertReferenceEngine.Bibliography('references')),
      cmd('WORD.INSERT.REFERENCE.BIBLIOGRAPHY.UPDATE', 'Update Bibliography', () => InsertReferenceEngine.Bibliography('update')),
      cmd('WORD.INSERT.REFERENCE.BIBLIOGRAPHY.STYLE', 'Citation Style', () => InsertReferenceEngine.Bibliography('style')),

      // CAPTION
      cmd('WORD.INSERT.REFERENCE.CAPTION', 'Insert Caption', () => InsertReferenceEngine.Caption('dialog')),
      cmd('WORD.INSERT.REFERENCE.CAPTION.FIGURE', 'Figure Caption', () => InsertReferenceEngine.Caption('figure')),
      cmd('WORD.INSERT.REFERENCE.CAPTION.TABLE', 'Table Caption', () => InsertReferenceEngine.Caption('table')),
      cmd('WORD.INSERT.REFERENCE.CAPTION.EQUATION', 'Equation Caption', () => InsertReferenceEngine.Caption('equation')),
      cmd('WORD.INSERT.REFERENCE.CAPTION.UPDATE', 'Update Caption', () => InsertReferenceEngine.Caption('update')),

      // CROSS REFERENCE
      cmd('WORD.INSERT.REFERENCE.CROSS', 'Insert Cross Reference', () => InsertReferenceEngine.CrossReference('dialog')),
      cmd('WORD.INSERT.REFERENCE.CROSS.HEADING', 'Heading Reference', () => InsertReferenceEngine.CrossReference('heading')),
      cmd('WORD.INSERT.REFERENCE.CROSS.BOOKMARK', 'Bookmark Reference', () => InsertReferenceEngine.CrossReference('bookmark')),
      cmd('WORD.INSERT.REFERENCE.CROSS.FIGURE', 'Figure Reference', () => InsertReferenceEngine.CrossReference('figure')),
      cmd('WORD.INSERT.REFERENCE.CROSS.TABLE', 'Table Reference', () => InsertReferenceEngine.CrossReference('table')),
      cmd('WORD.INSERT.REFERENCE.CROSS.EQUATION', 'Equation Reference', () => InsertReferenceEngine.CrossReference('equation')),
      cmd('WORD.INSERT.REFERENCE.CROSS.FOOTNOTE', 'Footnote Reference', () => InsertReferenceEngine.CrossReference('footnote')),

      // BOOKMARK
      cmd('WORD.INSERT.REFERENCE.BOOKMARK', 'Insert Bookmark', () => InsertReferenceEngine.Bookmark('dialog')),
      cmd('WORD.INSERT.REFERENCE.BOOKMARK.GOTO', 'Go To Bookmark', () => InsertReferenceEngine.Bookmark('goto')),
      cmd('WORD.INSERT.REFERENCE.BOOKMARK.EDIT', 'Edit Bookmark', () => InsertReferenceEngine.Bookmark('edit')),
      cmd('WORD.INSERT.REFERENCE.BOOKMARK.DELETE', 'Delete Bookmark', () => InsertReferenceEngine.Bookmark('delete')),

      // INDEX
      cmd('WORD.INSERT.REFERENCE.INDEX', 'Insert Index', () => InsertReferenceEngine.Index('dialog')),
      cmd('WORD.INSERT.REFERENCE.INDEX.MARK', 'Mark Entry', () => InsertReferenceEngine.Index('mark')),
      cmd('WORD.INSERT.REFERENCE.INDEX.UPDATE', 'Update Index', () => InsertReferenceEngine.Index('update')),
      cmd('WORD.INSERT.REFERENCE.INDEX.DELETE', 'Delete Index', () => InsertReferenceEngine.Index('delete')),

      // TABLE OF FIGURES
      cmd('WORD.INSERT.REFERENCE.TABLEFIGURES', 'Insert Table Of Figures', () => InsertReferenceEngine.TableOfFigures('dialog')),
      cmd('WORD.INSERT.REFERENCE.TABLEFIGURES.UPDATE', 'Update Table Of Figures', () => InsertReferenceEngine.TableOfFigures('update')),
      cmd('WORD.INSERT.REFERENCE.TABLEFIGURES.DELETE', 'Delete Table Of Figures', () => InsertReferenceEngine.TableOfFigures('delete')),

      // TABLE OF AUTHORITIES
      cmd('WORD.INSERT.REFERENCE.AUTHORITY', 'Insert Table Of Authorities', () => InsertReferenceEngine.TableOfAuthorities('dialog')),
      cmd('WORD.INSERT.REFERENCE.AUTHORITY.MARK', 'Mark Citation', () => InsertReferenceEngine.TableOfAuthorities('mark')),
      cmd('WORD.INSERT.REFERENCE.AUTHORITY.UPDATE', 'Update Authorities', () => InsertReferenceEngine.TableOfAuthorities('update')),

      // HYPERLINK
      cmd('WORD.INSERT.REFERENCE.HYPERLINK', 'Insert Hyperlink', () => InsertReferenceEngine.Hyperlink('dialog')),
      cmd('WORD.INSERT.REFERENCE.HYPERLINK.EMAIL', 'Email Link', () => InsertReferenceEngine.Hyperlink('email')),
      cmd('WORD.INSERT.REFERENCE.HYPERLINK.FILE', 'File Link', () => InsertReferenceEngine.Hyperlink('file')),
      cmd('WORD.INSERT.REFERENCE.HYPERLINK.WEB', 'Web Link', () => InsertReferenceEngine.Hyperlink('web')),
      cmd('WORD.INSERT.REFERENCE.HYPERLINK.BOOKMARK', 'Bookmark Link', () => InsertReferenceEngine.Hyperlink('bookmark')),

      // FIELD
      cmd('WORD.INSERT.REFERENCE.FIELD', 'Insert Reference Field', () => InsertReferenceEngine.Field('dialog')),
      cmd('WORD.INSERT.REFERENCE.FIELD.PAGE', 'Page Reference', () => InsertReferenceEngine.Field('page')),
      cmd('WORD.INSERT.REFERENCE.FIELD.SECTION', 'Section Reference', () => InsertReferenceEngine.Field('section')),
      cmd('WORD.INSERT.REFERENCE.FIELD.NUMPAGES', 'Number Of Pages', () => InsertReferenceEngine.Field('numpages')),
      cmd('WORD.INSERT.REFERENCE.FIELD.CUSTOM', 'Custom Field', () => InsertReferenceEngine.Field('custom')),

      // AI REFERENCES
      cmd('WORD.INSERT.REFERENCE.AI.CITATION', 'Generate Citation', () => InsertReferenceEngine.AI('citation')),
      cmd('WORD.INSERT.REFERENCE.AI.BIBLIOGRAPHY', 'Generate Bibliography', () => InsertReferenceEngine.AI('bibliography')),
      cmd('WORD.INSERT.REFERENCE.AI.CHECK', 'Validate References', () => InsertReferenceEngine.AI('check')),
      cmd('WORD.INSERT.REFERENCE.AI.FORMAT', 'Auto Format References', () => InsertReferenceEngine.AI('format')),
    ];
  }
}
