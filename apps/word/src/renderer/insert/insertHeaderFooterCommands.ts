import { CommandDefinition } from '../CommandDispatcher';
import { InsertHeaderFooterEngine } from './InsertHeaderFooterEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertHeaderFooterCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.HEADER', 'Header', () => InsertHeaderFooterEngine.Header()),
      cmd('WORD.INSERT.FOOTER', 'Footer', () => InsertHeaderFooterEngine.Footer()),
      cmd('WORD.INSERT.PAGE_NUMBER', 'Page Number', () => InsertHeaderFooterEngine.PageNumber()),
      cmd('WORD.INSERT.DATE', 'Date & Time', () => {}),
      cmd('WORD.INSERT.QUICKPART', 'Quick Parts', () => {}),
      cmd('WORD.INSERT.FIELD', 'Field', () => InsertHeaderFooterEngine.Field()),
      cmd('WORD.INSERT.DOCINFO', 'Document Info', () => {}),

      // HEADER
      cmd('WORD.INSERT.HEADER.DIALOG', 'Insert Header Dialog', () => InsertHeaderFooterEngine.Header('dialog')),
      cmd('WORD.INSERT.HEADER', 'Insert Header', () => InsertHeaderFooterEngine.Header('dialog')),
      cmd('WORD.INSERT.HEADER.DEFAULT', 'Default Header', () => InsertHeaderFooterEngine.Header('default')),
      cmd('WORD.INSERT.HEADER.BLANK', 'Blank Header', () => InsertHeaderFooterEngine.Header('blank')),
      cmd('WORD.INSERT.HEADER.MODERN', 'Modern Header', () => InsertHeaderFooterEngine.Header('modern')),
      cmd('WORD.INSERT.HEADER.CLASSIC', 'Classic Header', () => InsertHeaderFooterEngine.Header('classic')),
      cmd('WORD.INSERT.HEADER.BUSINESS', 'Business Header', () => InsertHeaderFooterEngine.Header('business')),
      cmd('WORD.INSERT.HEADER.CORPORATE', 'Corporate Header', () => InsertHeaderFooterEngine.Header('corporate')),
      cmd('WORD.INSERT.HEADER.CUSTOM', 'Custom Header', () => InsertHeaderFooterEngine.Header('custom')),
      cmd('WORD.INSERT.HEADER.REMOVE', 'Remove Header', () => InsertHeaderFooterEngine.Header('remove')),
      cmd('WORD.INSERT.HEADER.EDIT', 'Edit Header', () => InsertHeaderFooterEngine.Header('edit')),

      // FOOTER
      cmd('WORD.INSERT.FOOTER', 'Insert Footer', () => InsertHeaderFooterEngine.Footer('dialog')),
      cmd('WORD.INSERT.FOOTER.DEFAULT', 'Default Footer', () => InsertHeaderFooterEngine.Footer('default')),
      cmd('WORD.INSERT.FOOTER.BLANK', 'Blank Footer', () => InsertHeaderFooterEngine.Footer('blank')),
      cmd('WORD.INSERT.FOOTER.MODERN', 'Modern Footer', () => InsertHeaderFooterEngine.Footer('modern')),
      cmd('WORD.INSERT.FOOTER.CLASSIC', 'Classic Footer', () => InsertHeaderFooterEngine.Footer('classic')),
      cmd('WORD.INSERT.FOOTER.BUSINESS', 'Business Footer', () => InsertHeaderFooterEngine.Footer('business')),
      cmd('WORD.INSERT.FOOTER.CORPORATE', 'Corporate Footer', () => InsertHeaderFooterEngine.Footer('corporate')),
      cmd('WORD.INSERT.FOOTER.CUSTOM', 'Custom Footer', () => InsertHeaderFooterEngine.Footer('custom')),
      cmd('WORD.INSERT.FOOTER.REMOVE', 'Remove Footer', () => InsertHeaderFooterEngine.Footer('remove')),
      cmd('WORD.INSERT.FOOTER.EDIT', 'Edit Footer', () => InsertHeaderFooterEngine.Footer('edit')),

      // PAGE NUMBER
      cmd('WORD.INSERT.PAGENUMBER', 'Insert Page Number', () => InsertHeaderFooterEngine.PageNumber('dialog')),
      cmd('WORD.INSERT.PAGENUMBER.TOP', 'Top Of Page', () => InsertHeaderFooterEngine.PageNumber('top')),
      cmd('WORD.INSERT.PAGENUMBER.BOTTOM', 'Bottom Of Page', () => InsertHeaderFooterEngine.PageNumber('bottom')),
      cmd('WORD.INSERT.PAGENUMBER.LEFT', 'Left', () => InsertHeaderFooterEngine.PageNumber('left')),
      cmd('WORD.INSERT.PAGENUMBER.CENTER', 'Center', () => InsertHeaderFooterEngine.PageNumber('center')),
      cmd('WORD.INSERT.PAGENUMBER.RIGHT', 'Right', () => InsertHeaderFooterEngine.PageNumber('right')),
      cmd('WORD.INSERT.PAGENUMBER.MARGIN', 'Page Margin', () => InsertHeaderFooterEngine.PageNumber('margin')),
      cmd('WORD.INSERT.PAGENUMBER.CURRENTPOSITION', 'Current Position', () => InsertHeaderFooterEngine.PageNumber('currentposition')),
      cmd('WORD.INSERT.PAGENUMBER.FORMAT', 'Format Page Number', () => InsertHeaderFooterEngine.PageNumber('format')),
      cmd('WORD.INSERT.PAGENUMBER.REMOVE', 'Remove Page Number', () => InsertHeaderFooterEngine.PageNumber('remove')),

      // DATE TIME
      cmd('WORD.INSERT.HEADER.DATE', 'Insert Date', () => InsertHeaderFooterEngine.Date('date')),
      cmd('WORD.INSERT.HEADER.TIME', 'Insert Time', () => InsertHeaderFooterEngine.Time()),
      cmd('WORD.INSERT.HEADER.DATETIME', 'Insert Date Time', () => InsertHeaderFooterEngine.Date('datetime')),
      cmd('WORD.INSERT.HEADER.AUTOUPDATE', 'Auto Update Date', () => InsertHeaderFooterEngine.Date('autoupdate')),

      // FIELDS
      cmd('WORD.INSERT.HEADER.FIELD', 'Insert Header Field', () => InsertHeaderFooterEngine.Field('dialog')),
      cmd('WORD.INSERT.HEADER.FIELD.PAGE', 'Page Number Field', () => InsertHeaderFooterEngine.Field('page')),
      cmd('WORD.INSERT.HEADER.FIELD.NUMPAGES', 'Total Pages', () => InsertHeaderFooterEngine.Field('numpages')),
      cmd('WORD.INSERT.HEADER.FIELD.SECTION', 'Section Number', () => InsertHeaderFooterEngine.Field('section')),
      cmd('WORD.INSERT.HEADER.FIELD.SECTIONPAGES', 'Section Pages', () => InsertHeaderFooterEngine.Field('sectionpages')),
      cmd('WORD.INSERT.HEADER.FIELD.FILENAME', 'File Name', () => InsertHeaderFooterEngine.Field('filename')),
      cmd('WORD.INSERT.HEADER.FIELD.FILEPATH', 'File Path', () => InsertHeaderFooterEngine.Field('filepath')),
      cmd('WORD.INSERT.HEADER.FIELD.AUTHOR', 'Author', () => InsertHeaderFooterEngine.Field('author')),
      cmd('WORD.INSERT.HEADER.FIELD.TITLE', 'Title', () => InsertHeaderFooterEngine.Field('title')),
      cmd('WORD.INSERT.HEADER.FIELD.SUBJECT', 'Subject', () => InsertHeaderFooterEngine.Field('subject')),
      cmd('WORD.INSERT.HEADER.FIELD.COMPANY', 'Company', () => InsertHeaderFooterEngine.Field('company')),
      cmd('WORD.INSERT.HEADER.FIELD.CREATEDATE', 'Create Date', () => InsertHeaderFooterEngine.Field('createdate')),
      cmd('WORD.INSERT.HEADER.FIELD.SAVEDATE', 'Save Date', () => InsertHeaderFooterEngine.Field('savedate')),
      cmd('WORD.INSERT.HEADER.FIELD.CUSTOM', 'Custom Field', () => InsertHeaderFooterEngine.Field('custom')),

      // SECTION
      cmd('WORD.INSERT.HEADER.SECTION', 'Section Header', () => InsertHeaderFooterEngine.Section('header')),
      cmd('WORD.INSERT.FOOTER.SECTION', 'Section Footer', () => InsertHeaderFooterEngine.Section('footer')),
      cmd('WORD.INSERT.HEADER.LINKPREVIOUS', 'Link To Previous', () => InsertHeaderFooterEngine.LinkPrevious('header', 'link')),
      cmd('WORD.INSERT.HEADER.UNLINKPREVIOUS', 'Unlink Previous', () => InsertHeaderFooterEngine.LinkPrevious('header', 'unlink')),
      cmd('WORD.INSERT.FOOTER.LINKPREVIOUS', 'Link Footer To Previous', () => InsertHeaderFooterEngine.LinkPrevious('footer', 'link')),
      cmd('WORD.INSERT.FOOTER.UNLINKPREVIOUS', 'Unlink Footer', () => InsertHeaderFooterEngine.LinkPrevious('footer', 'unlink')),

      // PAGE OPTIONS
      cmd('WORD.INSERT.HEADER.DIFFERENTFIRSTPAGE', 'Different First Page', () => InsertHeaderFooterEngine.PageOptions('firstpage')),
      cmd('WORD.INSERT.HEADER.DIFFERENTODDEVEN', 'Different Odd Even', () => InsertHeaderFooterEngine.PageOptions('oddeven')),
      cmd('WORD.INSERT.HEADER.FIRSTPAGE', 'First Page Header', () => InsertHeaderFooterEngine.PageOptions('firstpage')),
      cmd('WORD.INSERT.FOOTER.FIRSTPAGE', 'First Page Footer', () => InsertHeaderFooterEngine.PageOptions('firstpage')),

      // TEMPLATE
      cmd('WORD.INSERT.HEADER.TEMPLATE', 'Header Template', () => InsertHeaderFooterEngine.Template('header', 'apply')),
      cmd('WORD.INSERT.FOOTER.TEMPLATE', 'Footer Template', () => InsertHeaderFooterEngine.Template('footer', 'apply')),
      cmd('WORD.INSERT.HEADER.TEMPLATE.SAVE', 'Save Template', () => InsertHeaderFooterEngine.Template('header', 'save')),
      cmd('WORD.INSERT.HEADER.TEMPLATE.LOAD', 'Load Template', () => InsertHeaderFooterEngine.Template('header', 'load')),
      cmd('WORD.INSERT.HEADER.TEMPLATE.DELETE', 'Delete Template', () => InsertHeaderFooterEngine.Template('header', 'delete')),

      cmd('WORD.INSERT.HEADER.BUILDINGBLOCK.SAVE', 'Save Building Block', () => InsertHeaderFooterEngine.BuildingBlock('header')),

      // HEADER FOOTER CONTEXTUAL TAB COMMANDS
      cmd('WORD.HEADER_FOOTER.CLOSE', 'Close Header and Footer', () => {}),
      cmd('WORD.HEADER_FOOTER.GO_TO_HEADER', 'Go to Header', () => document.getElementById('header-input-c')?.focus()),
      cmd('WORD.HEADER_FOOTER.GO_TO_FOOTER', 'Go to Footer', () => document.getElementById('footer-input-c')?.focus()),
      cmd('WORD.HEADER_FOOTER.PREV', 'Previous Header', () => {
        // Trong mockup hiện tại: Trước nhảy lên Đầu trang
        document.getElementById('header-input-c')?.focus();
      }),
      cmd('WORD.HEADER_FOOTER.NEXT', 'Next Header', () => {
        // Trong mockup hiện tại: Tiếp nhảy xuống Chân trang
        document.getElementById('footer-input-c')?.focus();
      }),
      cmd('WORD.HEADER_FOOTER.REMOVE_HEADER', 'Remove Header', () => InsertHeaderFooterEngine.Header('remove')),
      cmd('WORD.HEADER_FOOTER.REMOVE_FOOTER', 'Remove Footer', () => InsertHeaderFooterEngine.Footer('remove')),
    ];
  }
}
