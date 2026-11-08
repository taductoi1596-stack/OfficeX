import { CommandDefinition } from '../CommandDispatcher';
import { ReferenceEngine } from './ReferenceEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class ReferenceCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // TABLE OF CONTENTS
      cmd('WORD.REFERENCE.TOC', 'Insert Table Of Contents', () => ReferenceEngine.InsertTOC('dialog')),
      cmd('WORD.REFERENCE.TOC.AUTO', 'Automatic TOC', () => ReferenceEngine.InsertTOC('auto')),
      cmd('WORD.REFERENCE.TOC.MANUAL', 'Manual TOC', () => ReferenceEngine.InsertTOC('manual')),
      cmd('WORD.REFERENCE.TOC.CUSTOM', 'Custom TOC', () => ReferenceEngine.InsertTOC('custom')),
      cmd('WORD.REFERENCE.TOC.UPDATE', 'Update TOC', () => ReferenceEngine.UpdateTOC('dialog')),
      cmd('WORD.REFERENCE.TOC.UPDATE.PAGE', 'Update Page Numbers', () => ReferenceEngine.UpdateTOC('page')),
      cmd('WORD.REFERENCE.TOC.UPDATE.ALL', 'Update Entire TOC', () => ReferenceEngine.UpdateTOC('all')),
      cmd('WORD.REFERENCE.TOC.DELETE', 'Remove TOC', () => ReferenceEngine.UpdateTOC('delete')),
      cmd('WORD.REFERENCE.TOC.OPTIONS', 'TOC Options', () => ReferenceEngine.UpdateTOC('options')),

      // FOOTNOTES
      cmd('WORD.REFERENCE.FOOTNOTE', 'Insert Footnote', () => ReferenceEngine.InsertFootnote('insert')),
      cmd('WORD.REFERENCE.FOOTNOTE.NEXT', 'Next Footnote', () => ReferenceEngine.InsertFootnote('next')),
      cmd('WORD.REFERENCE.FOOTNOTE.PREVIOUS', 'Previous Footnote', () => ReferenceEngine.InsertFootnote('previous')),
      cmd('WORD.REFERENCE.FOOTNOTE.DELETE', 'Delete Footnote', () => ReferenceEngine.InsertFootnote('delete')),
      cmd('WORD.REFERENCE.FOOTNOTE.CONVERT', 'Convert To Endnote', () => ReferenceEngine.InsertFootnote('convert')),
      cmd('WORD.REFERENCE.FOOTNOTE.OPTIONS', 'Footnote Options', () => ReferenceEngine.InsertFootnote('options')),

      // ENDNOTES
      cmd('WORD.REFERENCE.ENDNOTE', 'Insert Endnote', () => ReferenceEngine.InsertEndnote('insert')),
      cmd('WORD.REFERENCE.ENDNOTE.NEXT', 'Next Endnote', () => ReferenceEngine.InsertEndnote('next')),
      cmd('WORD.REFERENCE.ENDNOTE.PREVIOUS', 'Previous Endnote', () => ReferenceEngine.InsertEndnote('previous')),
      cmd('WORD.REFERENCE.ENDNOTE.DELETE', 'Delete Endnote', () => ReferenceEngine.InsertEndnote('delete')),
      cmd('WORD.REFERENCE.ENDNOTE.CONVERT', 'Convert To Footnote', () => ReferenceEngine.InsertEndnote('convert')),
      cmd('WORD.REFERENCE.ENDNOTE.OPTIONS', 'Endnote Options', () => ReferenceEngine.InsertEndnote('options')),

      // CITATIONS
      cmd('WORD.REFERENCE.CITATION', 'Insert Citation', () => ReferenceEngine.InsertCitation('dialog')),
      cmd('WORD.REFERENCE.CITATION.NEW', 'New Source', () => ReferenceEngine.InsertCitation('new')),
      cmd('WORD.REFERENCE.CITATION.EXISTING', 'Existing Source', () => ReferenceEngine.InsertCitation('existing')),
      cmd('WORD.REFERENCE.CITATION.EDIT', 'Edit Source', () => ReferenceEngine.InsertCitation('edit')),
      cmd('WORD.REFERENCE.CITATION.DELETE', 'Delete Source', () => ReferenceEngine.InsertCitation('delete')),
      cmd('WORD.REFERENCE.CITATION.MANAGE', 'Manage Sources', () => ReferenceEngine.InsertCitation('manage')),
      cmd('WORD.REFERENCE.CITATION.STYLE', 'Citation Style', () => ReferenceEngine.InsertCitation('style')),
      cmd('WORD.REFERENCE.CITATION.IMPORT', 'Import Sources', () => ReferenceEngine.InsertCitation('import')),
      cmd('WORD.REFERENCE.CITATION.EXPORT', 'Export Sources', () => ReferenceEngine.InsertCitation('export')),

      // BIBLIOGRAPHY
      cmd('WORD.REFERENCE.BIBLIOGRAPHY', 'Insert Bibliography', () => ReferenceEngine.InsertBibliography('dialog')),
      cmd('WORD.REFERENCE.BIBLIOGRAPHY.REFERENCES', 'References', () => ReferenceEngine.InsertBibliography('references')),
      cmd('WORD.REFERENCE.BIBLIOGRAPHY.WORKSCITED', 'Works Cited', () => ReferenceEngine.InsertBibliography('workscited')),
      cmd('WORD.REFERENCE.BIBLIOGRAPHY.UPDATE', 'Update Bibliography', () => ReferenceEngine.InsertBibliography('update')),
      cmd('WORD.REFERENCE.BIBLIOGRAPHY.DELETE', 'Remove Bibliography', () => ReferenceEngine.InsertBibliography('delete')),

      // CAPTIONS
      cmd('WORD.REFERENCE.CAPTION', 'Insert Caption', () => ReferenceEngine.InsertCaption('dialog')),
      cmd('WORD.REFERENCE.CAPTION.FIGURE', 'Figure Caption', () => ReferenceEngine.InsertCaption('figure')),
      cmd('WORD.REFERENCE.CAPTION.TABLE', 'Table Caption', () => ReferenceEngine.InsertCaption('table')),
      cmd('WORD.REFERENCE.CAPTION.EQUATION', 'Equation Caption', () => ReferenceEngine.InsertCaption('equation')),
      cmd('WORD.REFERENCE.CAPTION.NUMBERING', 'Caption Numbering', () => ReferenceEngine.InsertCaption('numbering')),
      cmd('WORD.REFERENCE.CAPTION.UPDATE', 'Update Captions', () => ReferenceEngine.InsertCaption('update')),

      // CROSS REFERENCES
      cmd('WORD.REFERENCE.CROSS', 'Insert Cross Reference', () => ReferenceEngine.InsertCrossReference('dialog')),
      cmd('WORD.REFERENCE.CROSS.HEADING', 'Heading Reference', () => ReferenceEngine.InsertCrossReference('heading')),
      cmd('WORD.REFERENCE.CROSS.BOOKMARK', 'Bookmark Reference', () => ReferenceEngine.InsertCrossReference('bookmark')),
      cmd('WORD.REFERENCE.CROSS.TABLE', 'Table Reference', () => ReferenceEngine.InsertCrossReference('table')),
      cmd('WORD.REFERENCE.CROSS.FIGURE', 'Figure Reference', () => ReferenceEngine.InsertCrossReference('figure')),
      cmd('WORD.REFERENCE.CROSS.EQUATION', 'Equation Reference', () => ReferenceEngine.InsertCrossReference('equation')),
      cmd('WORD.REFERENCE.CROSS.FOOTNOTE', 'Footnote Reference', () => ReferenceEngine.InsertCrossReference('footnote')),
      cmd('WORD.REFERENCE.CROSS.ENDNOTE', 'Endnote Reference', () => ReferenceEngine.InsertCrossReference('endnote')),

      // BOOKMARKS
      cmd('WORD.REFERENCE.BOOKMARK', 'Insert Bookmark', () => ReferenceEngine.InsertBookmark('insert')),
      cmd('WORD.REFERENCE.BOOKMARK.GOTO', 'Go To Bookmark', () => ReferenceEngine.InsertBookmark('goto')),
      cmd('WORD.REFERENCE.BOOKMARK.RENAME', 'Rename Bookmark', () => ReferenceEngine.InsertBookmark('rename')),
      cmd('WORD.REFERENCE.BOOKMARK.DELETE', 'Delete Bookmark', () => ReferenceEngine.InsertBookmark('delete')),
      cmd('WORD.REFERENCE.BOOKMARK.LIST', 'Bookmark List', () => ReferenceEngine.InsertBookmark('list')),

      // INDEX
      cmd('WORD.REFERENCE.INDEX', 'Insert Index', () => ReferenceEngine.InsertIndex('dialog')),
      cmd('WORD.REFERENCE.INDEX.MARK', 'Mark Entry', () => ReferenceEngine.InsertIndex('mark')),
      cmd('WORD.REFERENCE.INDEX.UPDATE', 'Update Index', () => ReferenceEngine.InsertIndex('update')),
      cmd('WORD.REFERENCE.INDEX.DELETE', 'Delete Index', () => ReferenceEngine.InsertIndex('delete')),
      cmd('WORD.REFERENCE.INDEX.OPTIONS', 'Index Options', () => ReferenceEngine.InsertIndex('options')),

      // TABLE OF FIGURES
      cmd('WORD.REFERENCE.TABLEFIGURES', 'Insert Table Of Figures', () => ReferenceEngine.InsertTableFigures('dialog')),
      cmd('WORD.REFERENCE.TABLEFIGURES.UPDATE', 'Update Table Of Figures', () => ReferenceEngine.InsertTableFigures('update')),
      cmd('WORD.REFERENCE.TABLEFIGURES.DELETE', 'Delete Table Of Figures', () => ReferenceEngine.InsertTableFigures('delete')),

      // TABLE OF AUTHORITIES
      cmd('WORD.REFERENCE.AUTHORITIES', 'Insert Table Of Authorities', () => ReferenceEngine.InsertAuthorities('dialog')),
      cmd('WORD.REFERENCE.AUTHORITIES.MARK', 'Mark Citation', () => ReferenceEngine.InsertAuthorities('mark')),
      cmd('WORD.REFERENCE.AUTHORITIES.UPDATE', 'Update Authorities', () => ReferenceEngine.InsertAuthorities('update')),
      cmd('WORD.REFERENCE.AUTHORITIES.DELETE', 'Delete Authorities', () => ReferenceEngine.InsertAuthorities('delete')),

      // NAVIGATION
      cmd('WORD.REFERENCE.GOTO', 'Go To Reference', () => ReferenceEngine.Navigation('goto')),
      cmd('WORD.REFERENCE.NEXT', 'Next Reference', () => ReferenceEngine.Navigation('next')),
      cmd('WORD.REFERENCE.PREVIOUS', 'Previous Reference', () => ReferenceEngine.Navigation('previous')),
      cmd('WORD.REFERENCE.FIND', 'Find Reference', () => ReferenceEngine.Navigation('find')),

      // FIELDS
      cmd('WORD.REFERENCE.FIELD.UPDATE', 'Update Fields', () => ReferenceEngine.UpdateFields('single')),
      cmd('WORD.REFERENCE.FIELD.UPDATEALL', 'Update All Fields', () => ReferenceEngine.UpdateFields('all')),
      cmd('WORD.REFERENCE.FIELD.LOCK', 'Lock Field', () => ReferenceEngine.UpdateFields('lock')),
      cmd('WORD.REFERENCE.FIELD.UNLOCK', 'Unlock Field', () => ReferenceEngine.UpdateFields('unlock')),
      cmd('WORD.REFERENCE.FIELD.TOGGLE', 'Toggle Field Code', () => ReferenceEngine.UpdateFields('toggle')),

      // ACADEMIC
      cmd('WORD.REFERENCE.APA', 'APA Style', () => ReferenceEngine.AcademicStyle('APA')),
      cmd('WORD.REFERENCE.MLA', 'MLA Style', () => ReferenceEngine.AcademicStyle('MLA')),
      cmd('WORD.REFERENCE.CHICAGO', 'Chicago Style', () => ReferenceEngine.AcademicStyle('Chicago')),
      cmd('WORD.REFERENCE.IEEE', 'IEEE Style', () => ReferenceEngine.AcademicStyle('IEEE')),
      cmd('WORD.REFERENCE.ISO690', 'ISO 690', () => ReferenceEngine.AcademicStyle('ISO690')),
      cmd('WORD.REFERENCE.HARVARD', 'Harvard Style', () => ReferenceEngine.AcademicStyle('Harvard')),

      // AI
      cmd('WORD.REFERENCE.AI.CITATION', 'Generate Citation', () => ReferenceEngine.GenerateAI('citation')),
      cmd('WORD.REFERENCE.AI.BIBLIOGRAPHY', 'Generate Bibliography', () => ReferenceEngine.GenerateAI('bibliography')),
      cmd('WORD.REFERENCE.AI.VALIDATE', 'Validate References', () => ReferenceEngine.GenerateAI('validate')),
      cmd('WORD.REFERENCE.AI.FORMAT', 'Format References', () => ReferenceEngine.GenerateAI('format')),
      cmd('WORD.REFERENCE.AI.FIND', 'Find Missing References', () => ReferenceEngine.GenerateAI('find')),
    ];
  }
}
