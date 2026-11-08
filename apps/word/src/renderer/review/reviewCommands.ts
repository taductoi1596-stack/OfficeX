import { CommandDefinition } from '../CommandDispatcher';
import { ReviewEngine } from './ReviewEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class ReviewCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // PROOFING
      cmd('WORD.REVIEW.PROOFING', 'Proofing', () => ReviewEngine.Proofing('dialog')),
      cmd('WORD.REVIEW.SPELLING', 'Spelling', () => ReviewEngine.Proofing('spelling')),
      cmd('WORD.REVIEW.GRAMMAR', 'Grammar', () => ReviewEngine.Proofing('grammar')),
      cmd('WORD.REVIEW.EDITOR', 'Editor', () => ReviewEngine.Proofing('editor')),
      cmd('WORD.REVIEW.THESAURUS', 'Thesaurus', () => ReviewEngine.Proofing('thesaurus')),
      cmd('WORD.REVIEW.AUTOCORRECT', 'Auto Correct', () => ReviewEngine.Proofing('autocorrect')),
      cmd('WORD.REVIEW.CUSTOMDICTIONARY', 'Custom Dictionary', () => ReviewEngine.Proofing('customdictionary')),

      // TRACK CHANGES
      cmd('WORD.REVIEW.TRACK', 'Track Changes', () => ReviewEngine.TrackChanges('toggle')),
      cmd('WORD.REVIEW.TRACK.ON', 'Enable Track Changes', () => ReviewEngine.TrackChanges('on')),
      cmd('WORD.REVIEW.TRACK.OFF', 'Disable Track Changes', () => ReviewEngine.TrackChanges('off')),
      cmd('WORD.REVIEW.TRACK.LOCK', 'Lock Tracking', () => ReviewEngine.TrackChanges('lock')),
      cmd('WORD.REVIEW.TRACK.UNLOCK', 'Unlock Tracking', () => ReviewEngine.TrackChanges('unlock')),
      cmd('WORD.REVIEW.TRACK.OPTIONS', 'Tracking Options', () => ReviewEngine.TrackChanges('options')),

      // DISPLAY
      cmd('WORD.REVIEW.DISPLAY', 'Display Review', () => ReviewEngine.DisplayReview('dialog')),
      cmd('WORD.REVIEW.DISPLAY.ALL', 'All Markup', () => ReviewEngine.DisplayReview('all')),
      cmd('WORD.REVIEW.DISPLAY.SIMPLE', 'Simple Markup', () => ReviewEngine.DisplayReview('simple')),
      cmd('WORD.REVIEW.DISPLAY.NONE', 'No Markup', () => ReviewEngine.DisplayReview('none')),
      cmd('WORD.REVIEW.DISPLAY.ORIGINAL', 'Original Document', () => ReviewEngine.DisplayReview('original')),

      // CHANGES
      cmd('WORD.REVIEW.ACCEPT', 'Accept Change', () => ReviewEngine.Changes('accept')),
      cmd('WORD.REVIEW.ACCEPT.ALL', 'Accept All', () => ReviewEngine.Changes('acceptall')),
      cmd('WORD.REVIEW.REJECT', 'Reject Change', () => ReviewEngine.Changes('reject')),
      cmd('WORD.REVIEW.REJECT.ALL', 'Reject All', () => ReviewEngine.Changes('rejectall')),
      cmd('WORD.REVIEW.NEXT', 'Next Change', () => ReviewEngine.Changes('next')),
      cmd('WORD.REVIEW.PREVIOUS', 'Previous Change', () => ReviewEngine.Changes('previous')),

      // COMMENTS
      cmd('WORD.REVIEW.COMMENT', 'New Comment', () => ReviewEngine.Comment('new')),
      cmd('WORD.REVIEW.COMMENT.REPLY', 'Reply Comment', () => ReviewEngine.Comment('reply')),
      cmd('WORD.REVIEW.COMMENT.RESOLVE', 'Resolve Comment', () => ReviewEngine.Comment('resolve')),
      cmd('WORD.REVIEW.COMMENT.REOPEN', 'Reopen Comment', () => ReviewEngine.Comment('reopen')),
      cmd('WORD.REVIEW.COMMENT.DELETE', 'Delete Comment', () => ReviewEngine.Comment('delete')),
      cmd('WORD.REVIEW.COMMENT.DELETEALL', 'Delete All Comments', () => ReviewEngine.Comment('deleteall')),
      cmd('WORD.REVIEW.COMMENT.NEXT', 'Next Comment', () => ReviewEngine.Comment('next')),
      cmd('WORD.REVIEW.COMMENT.PREVIOUS', 'Previous Comment', () => ReviewEngine.Comment('previous')),

      // REVIEW PANE
      cmd('WORD.REVIEW.PANE', 'Reviewing Pane', () => ReviewEngine.ReviewPane('toggle')),
      cmd('WORD.REVIEW.PANE.VERTICAL', 'Vertical Pane', () => ReviewEngine.ReviewPane('vertical')),
      cmd('WORD.REVIEW.PANE.HORIZONTAL', 'Horizontal Pane', () => ReviewEngine.ReviewPane('horizontal')),

      // COMPARE
      cmd('WORD.REVIEW.COMPARE', 'Compare Documents', () => ReviewEngine.Compare('documents')),
      cmd('WORD.REVIEW.COMPARE.VERSION', 'Compare Versions', () => ReviewEngine.Compare('versions')),
      cmd('WORD.REVIEW.COMPARE.FORMAT', 'Compare Formatting', () => ReviewEngine.Compare('format')),
      cmd('WORD.REVIEW.COMPARE.TEXT', 'Compare Text', () => ReviewEngine.Compare('text')),

      // MERGE
      cmd('WORD.REVIEW.MERGE', 'Merge Documents', () => ReviewEngine.Merge('documents')),
      cmd('WORD.REVIEW.MERGE.CHANGES', 'Merge Changes', () => ReviewEngine.Merge('changes')),
      cmd('WORD.REVIEW.MERGE.COMMENTS', 'Merge Comments', () => ReviewEngine.Merge('comments')),

      // LANGUAGE
      cmd('WORD.REVIEW.LANGUAGE', 'Language', () => ReviewEngine.Language('dialog')),
      cmd('WORD.REVIEW.LANGUAGE.SET', 'Set Proofing Language', () => ReviewEngine.Language('set')),
      cmd('WORD.REVIEW.TRANSLATE', 'Translate', () => ReviewEngine.Translate('dialog')),
      cmd('WORD.REVIEW.TRANSLATE.SELECTION', 'Translate Selection', () => ReviewEngine.Translate('selection')),
      cmd('WORD.REVIEW.TRANSLATE.DOCUMENT', 'Translate Document', () => ReviewEngine.Translate('document')),

      // ACCESSIBILITY
      cmd('WORD.REVIEW.ACCESSIBILITY', 'Accessibility Checker', () => ReviewEngine.Accessibility('dialog')),
      cmd('WORD.REVIEW.ACCESSIBILITY.RUN', 'Run Checker', () => ReviewEngine.Accessibility('run')),
      cmd('WORD.REVIEW.ACCESSIBILITY.REPORT', 'Accessibility Report', () => ReviewEngine.Accessibility('report')),

      // PROTECTION
      cmd('WORD.REVIEW.PROTECT', 'Protect Document', () => ReviewEngine.Protect('dialog')),
      cmd('WORD.REVIEW.RESTRICT', 'Restrict Editing', () => ReviewEngine.Protect('restrict')),
      cmd('WORD.REVIEW.UNPROTECT', 'Remove Protection', () => ReviewEngine.Protect('unprotect')),

      // INSPECT
      cmd('WORD.REVIEW.INSPECT', 'Inspect Document', () => ReviewEngine.Inspect('dialog')),
      cmd('WORD.REVIEW.METADATA', 'Metadata Inspector', () => ReviewEngine.Inspect('metadata')),
      cmd('WORD.REVIEW.HIDDENDATA', 'Hidden Data', () => ReviewEngine.Inspect('hiddendata')),
      cmd('WORD.REVIEW.COMPATIBILITY', 'Compatibility Checker', () => ReviewEngine.Inspect('compatibility')),

      // AI REVIEW
      cmd('WORD.REVIEW.AI', 'AI Review', () => ReviewEngine.AI('review')),
      cmd('WORD.REVIEW.AI.SUMMARIZE', 'Summarize', () => ReviewEngine.AI('summarize')),
      cmd('WORD.REVIEW.AI.REWRITE', 'Rewrite', () => ReviewEngine.AI('rewrite')),
      cmd('WORD.REVIEW.AI.IMPROVE', 'Improve Writing', () => ReviewEngine.AI('improve')),
      cmd('WORD.REVIEW.AI.EXPLAIN', 'Explain Selection', () => ReviewEngine.AI('explain')),
      cmd('WORD.REVIEW.AI.FACTCHECK', 'Fact Check', () => ReviewEngine.AI('factcheck')),
      cmd('WORD.REVIEW.AI.CHECKSTYLE', 'Style Review', () => ReviewEngine.AI('checkstyle')),
      cmd('WORD.REVIEW.AI.CHECKTONE', 'Tone Review', () => ReviewEngine.AI('checktone')),
      cmd('WORD.REVIEW.AI.CHECKGRAMMAR', 'Grammar Review', () => ReviewEngine.AI('checkgrammar')),
      cmd('WORD.REVIEW.AI.CHECKCONSISTENCY', 'Consistency Review', () => ReviewEngine.AI('checkconsistency')),
    ];
  }
}
