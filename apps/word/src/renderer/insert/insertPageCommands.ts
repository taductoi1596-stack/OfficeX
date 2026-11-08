import { CommandDefinition } from '../CommandDispatcher';
import { InsertPageEngine } from './InsertPageEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertPageCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.COVER_PAGE', 'Cover Page', () => InsertPageEngine.CoverPage()),
      cmd('WORD.INSERT.BLANK_PAGE', 'Blank Page', () => InsertPageEngine.BlankPage()),
      cmd('WORD.INSERT.PAGE_BREAK', 'Page Break', () => InsertPageEngine.PageBreak()),
      cmd('WORD.INSERT.SECTION_BREAK', 'Section Break', () => InsertPageEngine.SectionBreak()),
      cmd('WORD.INSERT.NEXT_PAGE', 'Next Page', () => InsertPageEngine.SectionBreak('nextpage')),
      cmd('WORD.INSERT.CONTINUOUS', 'Continuous', () => InsertPageEngine.SectionBreak('continuous')),
      cmd('WORD.INSERT.ODD_PAGE', 'Odd Page', () => InsertPageEngine.SectionBreak('oddpage')),
      cmd('WORD.INSERT.EVEN_PAGE', 'Even Page', () => InsertPageEngine.SectionBreak('evenpage')),

      // BLANK PAGE
      cmd('WORD.INSERT.PAGE.BLANK', 'Insert Blank Page', () => InsertPageEngine.BlankPage()),
      cmd('WORD.INSERT.PAGE.BLANK.BEFORE', 'Insert Blank Page Before', () => InsertPageEngine.BlankPage({ position: 'before' })),
      cmd('WORD.INSERT.PAGE.BLANK.AFTER', 'Insert Blank Page After', () => InsertPageEngine.BlankPage({ position: 'after' })),
      cmd('WORD.INSERT.PAGE.BLANK.START', 'Insert Blank Page At Beginning', () => InsertPageEngine.BlankPage({ position: 'start' })),
      cmd('WORD.INSERT.PAGE.BLANK.END', 'Insert Blank Page At End', () => InsertPageEngine.BlankPage({ position: 'end' })),
      cmd('WORD.INSERT.PAGE.BLANK.MULTIPLE', 'Insert Multiple Blank Pages', (payload: any) => InsertPageEngine.BlankPage({ count: payload?.count || 1 })),

      // COVER PAGE
      cmd('WORD.INSERT.PAGE.COVER', 'Insert Cover Page', () => InsertPageEngine.CoverPage()),
      cmd('WORD.INSERT.PAGE.COVER.DEFAULT', 'Default Cover', () => InsertPageEngine.CoverPage('default')),
      cmd('WORD.INSERT.PAGE.COVER.MODERN', 'Modern Cover', () => InsertPageEngine.CoverPage('modern')),
      cmd('WORD.INSERT.PAGE.COVER.CLASSIC', 'Classic Cover', () => InsertPageEngine.CoverPage('classic')),
      cmd('WORD.INSERT.PAGE.COVER.CORPORATE', 'Corporate Cover', () => InsertPageEngine.CoverPage('corporate')),
      cmd('WORD.INSERT.PAGE.COVER.REPORT', 'Report Cover', () => InsertPageEngine.CoverPage('report')),
      cmd('WORD.INSERT.PAGE.COVER.CUSTOM', 'Custom Cover', () => InsertPageEngine.CoverPage('custom')),
      cmd('WORD.INSERT.PAGE.COVER.TEMPLATE', 'Insert Template Cover', (payload: any) => InsertPageEngine.CoverPage(payload?.templateId || 'default')),
      cmd('WORD.INSERT.PAGE.COVER.REMOVE', 'Remove Cover Page', () => InsertPageEngine.CoverPage('remove')),
      cmd('WORD.INSERT.PAGE.COVER.REPLACE', 'Replace Cover Page', () => InsertPageEngine.CoverPage('replace')),

      // PAGE BREAK
      cmd('WORD.INSERT.PAGEBREAK', 'Insert Page Break', () => InsertPageEngine.PageBreak()),
      cmd('WORD.INSERT.PAGEBREAK.BEFORE', 'Insert Page Break Before', () => InsertPageEngine.PageBreak('before')),
      cmd('WORD.INSERT.PAGEBREAK.AFTER', 'Insert Page Break After', () => InsertPageEngine.PageBreak('after')),
      cmd('WORD.INSERT.PAGEBREAK.SOFT', 'Soft Page Break', () => InsertPageEngine.PageBreak('soft')),
      cmd('WORD.INSERT.PAGEBREAK.HARD', 'Hard Page Break', () => InsertPageEngine.PageBreak('hard')),

      // SECTION BREAK
      cmd('WORD.INSERT.SECTIONBREAK', 'Insert Section Break', () => InsertPageEngine.SectionBreak()),
      cmd('WORD.INSERT.SECTIONBREAK.NEXTPAGE', 'Next Page Section', () => InsertPageEngine.SectionBreak('nextpage')),
      cmd('WORD.INSERT.SECTIONBREAK.CONTINUOUS', 'Continuous Section', () => InsertPageEngine.SectionBreak('continuous')),
      cmd('WORD.INSERT.SECTIONBREAK.ODDPAGE', 'Odd Page Section', () => InsertPageEngine.SectionBreak('oddpage')),
      cmd('WORD.INSERT.SECTIONBREAK.EVENPAGE', 'Even Page Section', () => InsertPageEngine.SectionBreak('evenpage')),

      // NEXT PAGE
      cmd('WORD.INSERT.PAGE.NEXT', 'Insert Next Page', () => InsertPageEngine.NextPage(false)),
      cmd('WORD.INSERT.PAGE.NEXT.SECTION', 'Next Section Page', () => InsertPageEngine.NextPage(true)),

      // ODD PAGE
      cmd('WORD.INSERT.PAGE.ODD', 'Insert Odd Page', () => InsertPageEngine.OddPage(false)),
      cmd('WORD.INSERT.PAGE.ODD.SECTION', 'Odd Page Section', () => InsertPageEngine.OddPage(true)),

      // EVEN PAGE
      cmd('WORD.INSERT.PAGE.EVEN', 'Insert Even Page', () => InsertPageEngine.EvenPage(false)),
      cmd('WORD.INSERT.PAGE.EVEN.SECTION', 'Even Page Section', () => InsertPageEngine.EvenPage(true)),

      // PAGE ORIENTATION
      cmd('WORD.INSERT.PAGE.ORIENTATION.PORTRAIT', 'Portrait Page', () => InsertPageEngine.PageOrientation('portrait')),
      cmd('WORD.INSERT.PAGE.ORIENTATION.LANDSCAPE', 'Landscape Page', () => InsertPageEngine.PageOrientation('landscape')),
      cmd('WORD.INSERT.PAGE.ORIENTATION.SECTION', 'Orientation For Section', () => InsertPageEngine.PageOrientation('portrait', 'section')),

      // PAGE SIZE
      cmd('WORD.INSERT.PAGE.SIZE.A4', 'A4', () => InsertPageEngine.PageSize('A4')),
      cmd('WORD.INSERT.PAGE.SIZE.A3', 'A3', () => InsertPageEngine.PageSize('A3')),
      cmd('WORD.INSERT.PAGE.SIZE.A5', 'A5', () => InsertPageEngine.PageSize('A5')),
      cmd('WORD.INSERT.PAGE.SIZE.LETTER', 'Letter', () => InsertPageEngine.PageSize('Letter')),
      cmd('WORD.INSERT.PAGE.SIZE.LEGAL', 'Legal', () => InsertPageEngine.PageSize('Legal')),
      cmd('WORD.INSERT.PAGE.SIZE.CUSTOM', 'Custom Size', () => InsertPageEngine.PageSize('Custom')),

      // PAGE NUMBERING
      cmd('WORD.INSERT.PAGE.NUMBER', 'Insert Page Number', () => InsertPageEngine.PageNumber({ position: 'bottom' })),
      cmd('WORD.INSERT.PAGE.NUMBER.TOP', 'Top Of Page', () => InsertPageEngine.PageNumber({ position: 'top' })),
      cmd('WORD.INSERT.PAGE.NUMBER.BOTTOM', 'Bottom Of Page', () => InsertPageEngine.PageNumber({ position: 'bottom' })),
      cmd('WORD.INSERT.PAGE.NUMBER.MARGIN', 'Page Margin', () => InsertPageEngine.PageNumber({ position: 'margin' })),
      cmd('WORD.INSERT.PAGE.NUMBER.CURRENT', 'Current Position', () => InsertPageEngine.PageNumber({ position: 'current' })),
      cmd('WORD.INSERT.PAGE.NUMBER.FORMAT', 'Format Page Numbers', () => InsertPageEngine.PageNumber({ position: 'format' })),
      cmd('WORD.INSERT.PAGE.NUMBER.REMOVE', 'Remove Page Numbers', () => InsertPageEngine.PageNumber({ position: 'remove' })),

      // PAGE TEMPLATE
      cmd('WORD.INSERT.PAGE.TEMPLATE', 'Insert Page Template', () => InsertPageEngine.PageTemplate('blank')),
      cmd('WORD.INSERT.PAGE.TEMPLATE.BLANK', 'Blank Template', () => InsertPageEngine.PageTemplate('blank')),
      cmd('WORD.INSERT.PAGE.TEMPLATE.BUSINESS', 'Business Template', () => InsertPageEngine.PageTemplate('business')),
      cmd('WORD.INSERT.PAGE.TEMPLATE.REPORT', 'Report Template', () => InsertPageEngine.PageTemplate('report')),
      cmd('WORD.INSERT.PAGE.TEMPLATE.LETTER', 'Letter Template', () => InsertPageEngine.PageTemplate('letter')),
      cmd('WORD.INSERT.PAGE.TEMPLATE.CUSTOM', 'Custom Template', () => InsertPageEngine.PageTemplate('custom')),

      // PAGE NAVIGATION
      cmd('WORD.INSERT.PAGE.GOTO', 'Go To Page', () => InsertPageEngine.NavigateTo('goto')),
      cmd('WORD.INSERT.PAGE.PREVIOUS', 'Previous Page', () => InsertPageEngine.NavigateTo('previous')),
      cmd('WORD.INSERT.PAGE.NEXTPAGE', 'Next Page', () => InsertPageEngine.NavigateTo('next')),
      cmd('WORD.INSERT.PAGE.FIRST', 'First Page', () => InsertPageEngine.NavigateTo('first')),
      cmd('WORD.INSERT.PAGE.LAST', 'Last Page', () => InsertPageEngine.NavigateTo('last')),
    ];
  }
}
