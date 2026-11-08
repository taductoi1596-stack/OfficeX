// ─────────────────────────────────────────────────────────────────────────────
// List Manager — Central orchestrator for the Numbering Engine
// Ref: NUMBERING_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { List, ListItem, ListType } from './models/List';
import { NumberGenerator } from './NumberGenerator';
import { LevelManager } from './LevelManager';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export class ListManager {
  private generator = new NumberGenerator();
  private levelManager = new LevelManager();
  
  private lists = new Map<string, List>();
  private items = new Map<string, ListItem>();

  createList(type: ListType): List {
    const list: List = {
      listId: generateId('list'),
      listType: type,
      levels: {},
      status: 'active',
      metadata: {}
    };

    // Setup some default levels depending on type
    if (type === 'bullet') {
      list.levels[0] = { levelIndex: 0, format: 'bullet', startAt: 1, prefix: '', suffix: ' ', bulletChar: '•' };
      list.levels[1] = { levelIndex: 1, format: 'bullet', startAt: 1, prefix: '', suffix: ' ', bulletChar: '◦' };
    } else {
      list.levels[0] = { levelIndex: 0, format: 'arabic', startAt: 1, prefix: '', suffix: '.' };
      list.levels[1] = { levelIndex: 1, format: 'alpha-lower', startAt: 1, prefix: '', suffix: ')' };
    }

    this.lists.set(list.listId, list);
    this.levelManager.initializeList(list.listId);
    return list;
  }

  getList(listId: string): List | undefined {
    return this.lists.get(listId);
  }

  /**
   * Registers a paragraph to a list and calculates its number string.
   */
  addListItem(listId: string, targetObjectId: string, levelIndex: number = 0): ListItem {
    const list = this.lists.get(listId);
    if (!list) throw new Error(`List ${listId} not found`);

    const levelDef = list.levels[levelIndex] || list.levels[0]; // fallback
    
    // Calculate the number mathematically
    const rawNumber = this.levelManager.getNextCount(list, levelIndex);
    
    // Format the number into a string (e.g. "1.", "a)", "•")
    const formattedNum = this.generator.generate(rawNumber, levelDef.format, levelDef.bulletChar);
    const renderedText = `${levelDef.prefix}${formattedNum}${levelDef.suffix}`;

    const item: ListItem = {
      itemId: generateId('li'),
      listId,
      levelIndex,
      targetObjectId,
      renderedText
    };

    this.items.set(item.itemId, item);
    return item;
  }

  restartList(listId: string): void {
    this.levelManager.resetList(listId);
  }
}
