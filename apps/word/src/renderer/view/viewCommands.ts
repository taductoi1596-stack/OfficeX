import { CommandDefinition } from '../CommandDispatcher';
import { ViewEngine } from './ViewEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class ViewCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // DOCUMENT VIEW
      cmd('WORD.VIEW', 'View', () => ViewEngine.SetMode('dialog')),
      cmd('WORD.VIEW.PRINT', 'Print Layout', () => ViewEngine.SetMode('print')),
      cmd('WORD.VIEW.READ', 'Read Mode', () => ViewEngine.SetMode('read')),
      cmd('WORD.VIEW.WEB', 'Web Layout', () => ViewEngine.SetMode('web')),
      cmd('WORD.VIEW.OUTLINE', 'Outline View', () => ViewEngine.SetMode('outline')),
      cmd('WORD.VIEW.DRAFT', 'Draft View', () => ViewEngine.SetMode('draft')),
      cmd('WORD.VIEW.FULLSCREEN', 'Full Screen', () => ViewEngine.SetMode('fullscreen')),
      cmd('WORD.VIEW.FOCUS', 'Focus Mode', () => ViewEngine.SetMode('focus')),

      // SHOW
      cmd('WORD.VIEW.SHOW', 'Show', () => ViewEngine.Show('dialog')),
      cmd('WORD.VIEW.SHOW.RULER', 'Ruler', () => ViewEngine.Show('ruler')),
      cmd('WORD.VIEW.SHOW.GRIDLINES', 'Gridlines', () => ViewEngine.Show('gridlines')),
      cmd('WORD.VIEW.SHOW.NAVIGATION', 'Navigation Pane', () => ViewEngine.Show('navigation')),
      cmd('WORD.VIEW.SHOW.STATUSBAR', 'Status Bar', () => ViewEngine.Show('statusbar')),
      cmd('WORD.VIEW.SHOW.SCROLLBAR', 'Scroll Bars', () => ViewEngine.Show('scrollbar')),
      cmd('WORD.VIEW.SHOW.MINIMAP', 'Mini Map', () => ViewEngine.Show('minimap')),
      cmd('WORD.VIEW.SHOW.BOOKMARKS', 'Bookmarks', () => ViewEngine.Show('bookmarks')),
      cmd('WORD.VIEW.SHOW.COMMENTS', 'Comments', () => ViewEngine.Show('comments')),
      cmd('WORD.VIEW.SHOW.REVISIONS', 'Track Changes', () => ViewEngine.Show('revisions')),

      // ZOOM
      cmd('WORD.VIEW.ZOOM', 'Zoom', () => ViewEngine.Zoom('dialog')),
      cmd('WORD.VIEW.ZOOM.IN', 'Zoom In', () => ViewEngine.Zoom('in')),
      cmd('WORD.VIEW.ZOOM.OUT', 'Zoom Out', () => ViewEngine.Zoom('out')),
      cmd('WORD.VIEW.ZOOM.100', '100%', () => ViewEngine.Zoom('100')),
      cmd('WORD.VIEW.ZOOM.PAGEWIDTH', 'Page Width', () => ViewEngine.Zoom('pagewidth')),
      cmd('WORD.VIEW.ZOOM.WHOLEPAGE', 'Whole Page', () => ViewEngine.Zoom('wholepage')),
      cmd('WORD.VIEW.ZOOM.MULTIPAGE', 'Multiple Pages', () => ViewEngine.Zoom('multipage')),
      cmd('WORD.VIEW.ZOOM.CUSTOM', 'Custom Zoom', () => ViewEngine.Zoom('custom')),

      // WINDOW
      cmd('WORD.VIEW.WINDOW', 'Window', () => ViewEngine.Window('dialog')),
      cmd('WORD.VIEW.WINDOW.NEW', 'New Window', () => ViewEngine.Window('new')),
      cmd('WORD.VIEW.WINDOW.SPLIT', 'Split Window', () => ViewEngine.Window('split')),
      cmd('WORD.VIEW.WINDOW.REMOVE_SPLIT', 'Remove Split', () => ViewEngine.Window('remove_split')),
      cmd('WORD.VIEW.WINDOW.SIDEBYSIDE', 'View Side By Side', () => ViewEngine.Window('sidebyside')),
      cmd('WORD.VIEW.WINDOW.SYNCHRONOUS', 'Synchronous Scrolling', () => ViewEngine.Window('synchronous')),
      cmd('WORD.VIEW.WINDOW.RESET', 'Reset Window Position', () => ViewEngine.Window('reset')),
      cmd('WORD.VIEW.WINDOW.SWITCH', 'Switch Windows', () => ViewEngine.Window('switch')),
      cmd('WORD.VIEW.WINDOW.CASCADE', 'Cascade', () => ViewEngine.Window('cascade')),
      cmd('WORD.VIEW.WINDOW.TILE', 'Tile Windows', () => ViewEngine.Window('tile')),

      // NAVIGATION
      cmd('WORD.VIEW.NAVIGATION', 'Navigation Pane', () => ViewEngine.Navigation('dialog')),
      cmd('WORD.VIEW.NAVIGATION.HEADINGS', 'Headings', () => ViewEngine.Navigation('headings')),
      cmd('WORD.VIEW.NAVIGATION.PAGES', 'Pages', () => ViewEngine.Navigation('pages')),
      cmd('WORD.VIEW.NAVIGATION.RESULTS', 'Search Results', () => ViewEngine.Navigation('results')),

      // PANELS
      cmd('WORD.VIEW.PANEL', 'Panels', () => ViewEngine.ShowPane('dialog')),
      cmd('WORD.VIEW.PANEL.STYLES', 'Styles Pane', () => ViewEngine.ShowPane('styles')),
      cmd('WORD.VIEW.PANEL.CLIPBOARD', 'Clipboard Pane', () => ViewEngine.ShowPane('clipboard')),
      cmd('WORD.VIEW.PANEL.SELECTION', 'Selection Pane', () => ViewEngine.ShowPane('selection')),
      cmd('WORD.VIEW.PANEL.TASK', 'Task Pane', () => ViewEngine.ShowPane('task')),
      cmd('WORD.VIEW.PANEL.PROPERTIES', 'Properties Pane', () => ViewEngine.ShowPane('properties')),

      // PAGE DISPLAY
      cmd('WORD.VIEW.PAGE', 'Page Display', () => ViewEngine.PageDisplay('dialog')),
      cmd('WORD.VIEW.PAGE.SINGLE', 'Single Page', () => ViewEngine.PageDisplay('single')),
      cmd('WORD.VIEW.PAGE.DOUBLE', 'Two Pages', () => ViewEngine.PageDisplay('double')),
      cmd('WORD.VIEW.PAGE.CONTINUOUS', 'Continuous Pages', () => ViewEngine.PageDisplay('continuous')),
      cmd('WORD.VIEW.PAGE.HORIZONTAL', 'Horizontal Scroll', () => ViewEngine.PageDisplay('horizontal')),
      cmd('WORD.VIEW.PAGE.VERTICAL', 'Vertical Scroll', () => ViewEngine.PageDisplay('vertical')),

      // DARK MODE
      cmd('WORD.VIEW.DARKMODE', 'Dark Mode', () => ViewEngine.DarkMode('dialog')),
      cmd('WORD.VIEW.DARKMODE.PAGE', 'Dark Page', () => ViewEngine.DarkMode('page')),
      cmd('WORD.VIEW.DARKMODE.UI', 'Dark Interface', () => ViewEngine.DarkMode('ui')),
      cmd('WORD.VIEW.LIGHTMODE', 'Light Mode', () => ViewEngine.DarkMode('light')),

      // IMMERSIVE
      cmd('WORD.VIEW.IMMERSIVE', 'Immersive Reader', () => ViewEngine.Immersive('dialog')),
      cmd('WORD.VIEW.IMMERSIVE.LINEFOCUS', 'Line Focus', () => ViewEngine.Immersive('linefocus')),
      cmd('WORD.VIEW.IMMERSIVE.READCOLOR', 'Reading Color', () => ViewEngine.Immersive('readcolor')),
      cmd('WORD.VIEW.IMMERSIVE.TEXTSPACING', 'Text Spacing', () => ViewEngine.Immersive('textspacing')),

      // PERFORMANCE
      cmd('WORD.VIEW.PERFORMANCE', 'Performance Mode', () => ViewEngine.Performance('dialog')),
      cmd('WORD.VIEW.GPU', 'GPU Rendering', () => ViewEngine.Performance('gpu')),
      cmd('WORD.VIEW.LOWQUALITY', 'Low Quality Rendering', () => ViewEngine.Performance('lowquality')),
      cmd('WORD.VIEW.HIGHQUALITY', 'High Quality Rendering', () => ViewEngine.Performance('highquality')),

      // AI VIEW
      cmd('WORD.VIEW.AI', 'AI View', () => ViewEngine.AI('dialog')),
      cmd('WORD.VIEW.AI.OUTLINE', 'AI Outline', () => ViewEngine.AI('outline')),
      cmd('WORD.VIEW.AI.SUMMARIZE', 'AI Summary Panel', () => ViewEngine.AI('summarize')),
      cmd('WORD.VIEW.AI.KEYPOINTS', 'AI Key Points', () => ViewEngine.AI('keypoints')),
      cmd('WORD.VIEW.AI.NAVIGATION', 'AI Navigation', () => ViewEngine.AI('navigation')),
    ];
  }
}
