// @officex/spellcheck-engine — Public API
export type {
  SpellIssue,
  Suggestion,
  IssueType,
  IssueSeverity,
} from './models/Issue';

export { DictionaryManager } from './DictionaryManager';
export { SpellChecker } from './SpellChecker';
export { GrammarChecker } from './GrammarChecker';
export { AutoCorrectManager } from './AutoCorrectManager';
export { SpellCheckManager } from './SpellCheckManager';
