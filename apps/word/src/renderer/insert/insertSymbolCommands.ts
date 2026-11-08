import { CommandDefinition } from '../CommandDispatcher';
import { InsertSymbolEngine } from './InsertSymbolEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertSymbolCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.EQUATION', 'Equation', () => {}),
      cmd('WORD.INSERT.SYMBOL', 'Symbol', () => InsertSymbolEngine.Symbol('recent')),
      cmd('WORD.INSERT.SPECIAL_CHARACTER', 'Special Character', () => InsertSymbolEngine.Symbol('special')),

      // SYMBOL
      cmd('WORD.INSERT.SYMBOL', 'Insert Symbol', () => InsertSymbolEngine.Symbol('dialog')),
      cmd('WORD.INSERT.SYMBOL.DIALOG', 'Open Symbol Dialog', () => InsertSymbolEngine.Symbol('dialog')),
      cmd('WORD.INSERT.SYMBOL.RECENT', 'Recent Symbols', () => InsertSymbolEngine.Symbol('recent')),
      cmd('WORD.INSERT.SYMBOL.FAVORITES', 'Favorite Symbols', () => InsertSymbolEngine.Symbol('favorites')),
      cmd('WORD.INSERT.SYMBOL.UNICODE', 'Unicode Character', () => InsertSymbolEngine.Unicode()),

      // MATH
      cmd('WORD.INSERT.SYMBOL.MATH', 'Mathematical Symbols', () => InsertSymbolEngine.MathSymbol('dialog')),
      cmd('WORD.INSERT.SYMBOL.MATH.OPERATOR', 'Operators', () => InsertSymbolEngine.MathSymbol('operator')),
      cmd('WORD.INSERT.SYMBOL.MATH.RELATION', 'Relations', () => InsertSymbolEngine.MathSymbol('relation')),
      cmd('WORD.INSERT.SYMBOL.MATH.LOGIC', 'Logic', () => InsertSymbolEngine.MathSymbol('logic')),
      cmd('WORD.INSERT.SYMBOL.MATH.SET', 'Set Theory', () => InsertSymbolEngine.MathSymbol('set')),
      cmd('WORD.INSERT.SYMBOL.MATH.CALCULUS', 'Calculus', () => InsertSymbolEngine.MathSymbol('calculus')),
      cmd('WORD.INSERT.SYMBOL.MATH.GEOMETRY', 'Geometry', () => InsertSymbolEngine.MathSymbol('geometry')),
      cmd('WORD.INSERT.SYMBOL.MATH.ALGEBRA', 'Algebra', () => InsertSymbolEngine.MathSymbol('algebra')),

      // GREEK
      cmd('WORD.INSERT.SYMBOL.GREEK', 'Greek Alphabet', () => InsertSymbolEngine.Greek('dialog')),
      cmd('WORD.INSERT.SYMBOL.GREEK.UPPER', 'Uppercase Greek', () => InsertSymbolEngine.Greek('upper')),
      cmd('WORD.INSERT.SYMBOL.GREEK.LOWER', 'Lowercase Greek', () => InsertSymbolEngine.Greek('lower')),

      // ARROW
      cmd('WORD.INSERT.SYMBOL.ARROW', 'Arrow Symbols', () => InsertSymbolEngine.Arrow('dialog')),
      cmd('WORD.INSERT.SYMBOL.ARROW.LEFT', 'Left Arrow', () => InsertSymbolEngine.Arrow('left')),
      cmd('WORD.INSERT.SYMBOL.ARROW.RIGHT', 'Right Arrow', () => InsertSymbolEngine.Arrow('right')),
      cmd('WORD.INSERT.SYMBOL.ARROW.UP', 'Up Arrow', () => InsertSymbolEngine.Arrow('up')),
      cmd('WORD.INSERT.SYMBOL.ARROW.DOWN', 'Down Arrow', () => InsertSymbolEngine.Arrow('down')),
      cmd('WORD.INSERT.SYMBOL.ARROW.DOUBLE', 'Double Arrow', () => InsertSymbolEngine.Arrow('double')),
      cmd('WORD.INSERT.SYMBOL.ARROW.CURVED', 'Curved Arrow', () => InsertSymbolEngine.Arrow('curved')),

      // CURRENCY
      cmd('WORD.INSERT.SYMBOL.CURRENCY', 'Currency Symbols', () => InsertSymbolEngine.Currency('dialog')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.USD', 'Dollar', () => InsertSymbolEngine.Currency('usd')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.EUR', 'Euro', () => InsertSymbolEngine.Currency('eur')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.GBP', 'Pound', () => InsertSymbolEngine.Currency('gbp')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.JPY', 'Yen', () => InsertSymbolEngine.Currency('jpy')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.CNY', 'Yuan', () => InsertSymbolEngine.Currency('cny')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.VND', 'Vietnamese Dong', () => InsertSymbolEngine.Currency('vnd')),
      cmd('WORD.INSERT.SYMBOL.CURRENCY.BTC', 'Bitcoin', () => InsertSymbolEngine.Currency('btc')),

      // TECHNICAL
      cmd('WORD.INSERT.SYMBOL.TECHNICAL', 'Technical Symbols', () => InsertSymbolEngine.Technical('dialog')),
      cmd('WORD.INSERT.SYMBOL.ELECTRICAL', 'Electrical Symbols', () => InsertSymbolEngine.Technical('electrical')),
      cmd('WORD.INSERT.SYMBOL.UNITS', 'Engineering Units', () => InsertSymbolEngine.Technical('units')),
      cmd('WORD.INSERT.SYMBOL.PHYSICS', 'Physics Symbols', () => InsertSymbolEngine.Technical('physics')),
      cmd('WORD.INSERT.SYMBOL.CHEMISTRY', 'Chemistry Symbols', () => InsertSymbolEngine.Technical('chemistry')),

      // LETTERLIKE
      cmd('WORD.INSERT.SYMBOL.LETTERLIKE', 'Letterlike Symbols', () => InsertSymbolEngine.Letterlike('dialog')),
      cmd('WORD.INSERT.SYMBOL.PHONETIC', 'Phonetic Symbols', () => InsertSymbolEngine.Letterlike('phonetic')),
      cmd('WORD.INSERT.SYMBOL.IPA', 'IPA Symbols', () => InsertSymbolEngine.Letterlike('ipa')),

      // SPECIAL CHARACTERS
      cmd('WORD.INSERT.CHARACTER', 'Special Characters', () => InsertSymbolEngine.SpecialCharacter('dialog')),
      cmd('WORD.INSERT.CHARACTER.NONBREAKINGSPACE', 'Non-breaking Space', () => InsertSymbolEngine.SpecialCharacter('nonbreakingspace')),
      cmd('WORD.INSERT.CHARACTER.SOFTHYPHEN', 'Soft Hyphen', () => InsertSymbolEngine.SpecialCharacter('softhyphen')),
      cmd('WORD.INSERT.CHARACTER.EMDASH', 'Em Dash', () => InsertSymbolEngine.SpecialCharacter('emdash')),
      cmd('WORD.INSERT.CHARACTER.ENDASH', 'En Dash', () => InsertSymbolEngine.SpecialCharacter('endash')),
      cmd('WORD.INSERT.CHARACTER.ELLIPSIS', 'Ellipsis', () => InsertSymbolEngine.SpecialCharacter('ellipsis')),
      cmd('WORD.INSERT.CHARACTER.COPYRIGHT', 'Copyright', () => InsertSymbolEngine.SpecialCharacter('copyright')),
      cmd('WORD.INSERT.CHARACTER.REGISTERED', 'Registered', () => InsertSymbolEngine.SpecialCharacter('registered')),
      cmd('WORD.INSERT.CHARACTER.TRADEMARK', 'Trademark', () => InsertSymbolEngine.SpecialCharacter('trademark')),

      // EMOJI
      cmd('WORD.INSERT.EMOJI', 'Insert Emoji', () => InsertSymbolEngine.Emoji('dialog')),
      cmd('WORD.INSERT.EMOJI.SMILEYS', 'Smileys', () => InsertSymbolEngine.Emoji('smileys')),
      cmd('WORD.INSERT.EMOJI.PEOPLE', 'People', () => InsertSymbolEngine.Emoji('people')),
      cmd('WORD.INSERT.EMOJI.ANIMALS', 'Animals', () => InsertSymbolEngine.Emoji('animals')),
      cmd('WORD.INSERT.EMOJI.FOOD', 'Food', () => InsertSymbolEngine.Emoji('food')),
      cmd('WORD.INSERT.EMOJI.TRAVEL', 'Travel', () => InsertSymbolEngine.Emoji('travel')),
      cmd('WORD.INSERT.EMOJI.OBJECTS', 'Objects', () => InsertSymbolEngine.Emoji('objects')),
      cmd('WORD.INSERT.EMOJI.SYMBOLS', 'Emoji Symbols', () => InsertSymbolEngine.Emoji('symbols')),
      cmd('WORD.INSERT.EMOJI.FLAGS', 'Flags', () => InsertSymbolEngine.Emoji('flags')),

      // DINGBATS
      cmd('WORD.INSERT.DINGBAT', 'Dingbats', () => InsertSymbolEngine.Dingbat('dialog')),
      cmd('WORD.INSERT.DINGBAT.STAR', 'Stars', () => InsertSymbolEngine.Dingbat('star')),
      cmd('WORD.INSERT.DINGBAT.CHECK', 'Check Marks', () => InsertSymbolEngine.Dingbat('check')),
      cmd('WORD.INSERT.DINGBAT.BULLET', 'Bullets', () => InsertSymbolEngine.Dingbat('bullet')),
      cmd('WORD.INSERT.DINGBAT.SHAPES', 'Decorative Shapes', () => InsertSymbolEngine.Dingbat('shapes')),

      // ICONS
      cmd('WORD.INSERT.ICON', 'Insert Icon', () => InsertSymbolEngine.Icon('dialog')),
      cmd('WORD.INSERT.ICON.FILLED', 'Filled Icons', () => InsertSymbolEngine.Icon('filled')),
      cmd('WORD.INSERT.ICON.OUTLINE', 'Outline Icons', () => InsertSymbolEngine.Icon('outline')),
      cmd('WORD.INSERT.ICON.SVG', 'SVG Icons', () => InsertSymbolEngine.Icon('svg')),

      // FONT GLYPHS
      cmd('WORD.INSERT.GLYPH', 'Insert Glyph', () => InsertSymbolEngine.Glyph('dialog')),
      cmd('WORD.INSERT.GLYPH.FONT', 'Font Glyph Browser', () => InsertSymbolEngine.Glyph('font')),
      cmd('WORD.INSERT.GLYPH.OPENTYPE', 'OpenType Glyphs', () => InsertSymbolEngine.Glyph('opentype')),
      cmd('WORD.INSERT.GLYPH.VARIANT', 'Glyph Variants', () => InsertSymbolEngine.Glyph('variant')),

      // FAVORITES
      cmd('WORD.INSERT.SYMBOL.ADD_FAVORITE', 'Add Favorite', () => InsertSymbolEngine.Favorites('add')),
      cmd('WORD.INSERT.SYMBOL.REMOVE_FAVORITE', 'Remove Favorite', () => InsertSymbolEngine.Favorites('remove')),
      cmd('WORD.INSERT.SYMBOL.CLEAR_RECENT', 'Clear Recent Symbols', () => InsertSymbolEngine.Favorites('clear_recent')),

      // AI
      cmd('WORD.INSERT.SYMBOL.AI.SEARCH', 'AI Symbol Search', () => InsertSymbolEngine.AI('search')),
      cmd('WORD.INSERT.SYMBOL.AI.RECOMMEND', 'Recommend Symbol', () => InsertSymbolEngine.AI('recommend')),
      cmd('WORD.INSERT.SYMBOL.AI.EXPLAIN', 'Explain Symbol', () => InsertSymbolEngine.AI('explain')),
      cmd('WORD.INSERT.SYMBOL.AI.RELATED', 'Related Symbols', () => InsertSymbolEngine.AI('related')),
    ];
  }
}
