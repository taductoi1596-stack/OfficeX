/**
 * InsertSymbolEngine
 * 
 * Manages insertions for Unicode Symbols, Emoji, Icons, Dingbats, Special Characters.
 * Connects to UnicodeEngine and FontEngine under the hood.
 */
class InsertSymbolEngineImpl {
  private events: Record<string, Function[]> = {};

  initialize() {
    // Engine boot sequence
  }

  dispose() {
    this.events = {};
  }

  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, payload?: any) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(payload));
    }
  }

  // APIs from spec
  Symbol(category: string = 'dialog') {
    console.log('[InsertSymbolEngine] Symbol', category);
    if (category === 'dialog') this.emit('SymbolDialogOpened');
    else if (category === 'recent') this.emit('RecentSymbolsOpened');
    else if (category === 'favorites') this.emit('FavoriteSymbolsOpened');
    else this.emit('SymbolInserted', { category });
  }

  Unicode() {
    console.log('[InsertSymbolEngine] Unicode');
    this.emit('SymbolInserted', { category: 'unicode' });
  }

  Emoji(category: string = 'dialog') {
    console.log('[InsertSymbolEngine] Emoji', category);
    this.emit('EmojiInserted', { category });
  }

  Icon(type: string = 'dialog') {
    console.log('[InsertSymbolEngine] Icon', type);
    this.emit('IconInserted', { type });
  }

  Glyph(type: string = 'dialog') {
    console.log('[InsertSymbolEngine] Glyph', type);
    this.emit('GlyphInserted', { type });
  }

  Currency(type: string) {
    console.log('[InsertSymbolEngine] Currency', type);
    this.emit('SymbolInserted', { category: 'currency', type });
  }

  Greek(type: string) {
    console.log('[InsertSymbolEngine] Greek', type);
    this.emit('SymbolInserted', { category: 'greek', type });
  }

  MathSymbol(type: string) {
    console.log('[InsertSymbolEngine] MathSymbol', type);
    this.emit('SymbolInserted', { category: 'math', type });
  }

  SpecialCharacter(type: string) {
    console.log('[InsertSymbolEngine] SpecialCharacter', type);
    this.emit('SymbolInserted', { category: 'special', type });
  }

  Arrow(type: string) {
    console.log('[InsertSymbolEngine] Arrow', type);
    this.emit('SymbolInserted', { category: 'arrow', type });
  }

  Technical(type: string) {
    console.log('[InsertSymbolEngine] Technical', type);
    this.emit('SymbolInserted', { category: 'technical', type });
  }

  Letterlike(type: string) {
    console.log('[InsertSymbolEngine] Letterlike', type);
    this.emit('SymbolInserted', { category: 'letterlike', type });
  }

  Dingbat(type: string) {
    console.log('[InsertSymbolEngine] Dingbat', type);
    this.emit('SymbolInserted', { category: 'dingbat', type });
  }

  Favorites(action: 'add' | 'remove' | 'clear_recent') {
    console.log('[InsertSymbolEngine] Favorites', action);
    if (action === 'add') this.emit('FavoriteAdded');
    else if (action === 'remove') this.emit('FavoriteRemoved');
    else if (action === 'clear_recent') this.emit('RecentUpdated');
  }

  AI(action: 'search' | 'recommend' | 'explain' | 'related') {
    console.log('[InsertSymbolEngine] AI', action);
    if (action === 'search' || action === 'recommend') this.emit('AISymbolSuggested');
  }
}

export const InsertSymbolEngine = new InsertSymbolEngineImpl();
