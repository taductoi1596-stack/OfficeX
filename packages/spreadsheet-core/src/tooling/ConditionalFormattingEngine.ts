export type CFRuleType = 
  | 'cellIs' 
  | 'expression' 
  | 'colorScale' 
  | 'dataBar' 
  | 'iconSet' 
  | 'top10' 
  | 'uniqueValues' 
  | 'duplicateValues' 
  | 'containsText' 
  | 'notContainsText' 
  | 'beginsWith' 
  | 'endsWith' 
  | 'containsBlanks' 
  | 'notContainsBlanks' 
  | 'containsErrors' 
  | 'notContainsErrors' 
  | 'timePeriod' 
  | 'aboveAverage';

export type CFOperator = 
  | 'lessThan' | 'lessThanOrEqual' | 'equal' | 'notEqual' 
  | 'greaterThanOrEqual' | 'greaterThan' | 'between' | 'notBetween'
  | 'containsText' | 'notContains' | 'beginsWith' | 'endsWith';

export type CFTimePeriod = 
  | 'today' | 'yesterday' | 'tomorrow' 
  | 'last7Days' | 'thisMonth' | 'lastMonth' | 'nextMonth' 
  | 'thisWeek' | 'lastWeek' | 'nextWeek';

export interface ConditionalStyle {
  fontColor?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  borders?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  // Advanced Visuals
  dataBar?: { percent: number; color: string; negative?: boolean };
  colorScale?: { color: string };
  iconSet?: { icon: string };
}

export interface CFDataBar {
  minLength?: number;
  maxLength?: number;
  color?: string;
  gradient?: boolean;
  border?: boolean;
  borderColor?: string;
  negativeBarColor?: string;
  negativeBarBorderColor?: string;
  axisPosition?: 'automatic' | 'middle' | 'none';
  direction?: 'leftToRight' | 'rightToLeft' | 'context';
  showValue?: boolean;
}

export interface CFColorScale {
  type: '2-color' | '3-color';
  minColor: string;
  midColor?: string;
  maxColor: string;
  minType?: 'num' | 'percent' | 'max' | 'min' | 'formula' | 'percentile';
  minValue?: string;
  midType?: 'num' | 'percent' | 'max' | 'min' | 'formula' | 'percentile';
  midValue?: string;
  maxType?: 'num' | 'percent' | 'max' | 'min' | 'formula' | 'percentile';
  maxValue?: string;
}

export interface CFIconSet {
  iconSet: '3Arrows' | '4Arrows' | '5Arrows' | '3TrafficLights1' | '3TrafficLights2' | '3Signs' | '4RedToBlack' | '4Rating' | '5Rating' | string;
  reverse?: boolean;
  showValue?: boolean;
  percent?: boolean;
}

export interface CFRule {
  id: string;
  type: CFRuleType;
  priority: number;
  stopIfTrue: boolean;
  appliesTo: string; // e.g. "A1:B10"
  
  operator?: CFOperator;
  formulas?: string[]; // e.g. ["50", "100"] for between
  text?: string;
  timePeriod?: CFTimePeriod;
  
  rank?: number; // for top10
  percent?: boolean; // for top10
  bottom?: boolean; // for top10
  
  aboveAverage?: boolean;
  equalAverage?: boolean;
  stdDev?: number;
  
  style?: ConditionalStyle;
  
  dataBar?: CFDataBar;
  colorScale?: CFColorScale;
  iconSet?: CFIconSet;
}

export interface CFContext {
  getCellValue: (r: number, c: number) => any;
  getRangeValues: (appliesTo: string) => any[];
  evalFormula: (formula: string, r: number, c: number) => any;
}

export class RuleEvaluator {
  public evaluateCell(val: any, row: number, col: number, rule: CFRule, ctx: CFContext): boolean {
    if (val === undefined || val === null || val === '') {
      if (rule.type === 'containsBlanks') return true;
      if (rule.type === 'cellIs' || rule.type === 'expression') return false; // Usually blanks are ignored unless explicitly checked
    }

    switch (rule.type) {
      case 'containsBlanks':
        return val === undefined || val === null || val === '';
      case 'notContainsBlanks':
        return val !== undefined && val !== null && val !== '';
      case 'cellIs':
        return this.evaluateCellIs(val, row, col, rule, ctx);
      case 'containsText':
        return String(val).toLowerCase().includes((rule.text || '').toLowerCase());
      case 'notContainsText':
        return !String(val).toLowerCase().includes((rule.text || '').toLowerCase());
      case 'beginsWith':
        return String(val).toLowerCase().startsWith((rule.text || '').toLowerCase());
      case 'endsWith':
        return String(val).toLowerCase().endsWith((rule.text || '').toLowerCase());
      case 'expression':
        if (!rule.formulas || !rule.formulas[0]) return false;
        return !!ctx.evalFormula(rule.formulas[0], row, col);
      case 'top10':
      case 'aboveAverage':
      case 'duplicateValues':
      case 'uniqueValues':
        return this.evaluateRangeRule(val, rule, ctx);
      case 'dataBar':
      case 'colorScale':
        return this.evaluateAdvancedVisuals(val, rule, ctx);
      default:
        return false; 
    }
  }

  private evaluateAdvancedVisuals(val: any, rule: CFRule, ctx: CFContext): any {
    const cVal = Number(val);
    if (isNaN(cVal)) return false;

    const nums = ctx.getRangeValues(rule.appliesTo).map(v => Number(v)).filter(n => !isNaN(n));
    if (nums.length === 0) return false;

    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const range = max - min;

    if (rule.type === 'dataBar') {
      const percent = range === 0 ? 100 : ((cVal - Math.min(0, min)) / (max - Math.min(0, min))) * 100;
      return { 
        isDataBar: true, 
        percent: Math.max(0, Math.min(100, percent)), 
        color: rule.dataBar?.color || '#3b82f6',
        negative: cVal < 0
      };
    }

    if (rule.type === 'colorScale') {
      const percent = range === 0 ? 0.5 : (cVal - min) / range;
      // Simple 2-color interpolation (white to green) for testing
      const r = Math.round(255 + (97 - 255) * percent);
      const g = Math.round(255 + (193 - 255) * percent);
      const b = Math.round(255 + (107 - 255) * percent);
      return { isColorScale: true, color: `rgb(${r},${g},${b})` };
    }

    if (rule.type === 'iconSet') {
      const percent = range === 0 ? 100 : ((cVal - min) / range) * 100;
      let icon = 'Circle'; // middle
      if (percent >= 67) icon = 'ArrowUp';
      else if (percent < 33) icon = 'ArrowDown';
      else icon = 'ArrowRight';
      return { isIconSet: true, icon };
    }
    return false;
  }

  private evaluateRangeRule(val: any, rule: CFRule, ctx: CFContext): boolean {
    const rangeValues = ctx.getRangeValues(rule.appliesTo).filter(v => v !== undefined && v !== null && v !== '');
    
    if (rule.type === 'duplicateValues') {
      const count = rangeValues.filter(v => v === val).length;
      return count > 1;
    }
    
    if (rule.type === 'uniqueValues') {
      const count = rangeValues.filter(v => v === val).length;
      return count === 1;
    }

    // Convert all to numbers for top10 / aboveAverage
    const nums = rangeValues.map(v => Number(v)).filter(n => !isNaN(n));
    if (nums.length === 0) return false;
    
    const cVal = Number(val);
    if (isNaN(cVal)) return false;

    if (rule.type === 'aboveAverage') {
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = sum / nums.length;
      if (rule.stdDev) {
        // Calculate std dev
        const variance = nums.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / nums.length;
        const std = Math.sqrt(variance);
        if (rule.aboveAverage) return cVal > avg + rule.stdDev * std;
        else return cVal < avg - rule.stdDev * std;
      }
      if (rule.equalAverage) {
        return rule.aboveAverage ? cVal >= avg : cVal <= avg;
      }
      return rule.aboveAverage ? cVal > avg : cVal < avg;
    }

    if (rule.type === 'top10') {
      nums.sort((a, b) => b - a); // Descending
      const rank = rule.rank || 10;
      let limitIndex = rule.percent ? Math.max(1, Math.ceil(nums.length * (rank / 100))) - 1 : rank - 1;
      limitIndex = Math.min(limitIndex, nums.length - 1);
      
      if (rule.bottom) {
        const threshold = nums[nums.length - 1 - limitIndex];
        return cVal <= threshold;
      } else {
        const threshold = nums[limitIndex];
        return cVal >= threshold;
      }
    }

    return false;
  }

  private evaluateCellIs(val: any, row: number, col: number, rule: CFRule, ctx: CFContext): boolean {
    if (!rule.formulas || rule.formulas.length === 0) return false;
    
    let cVal = Number(val);
    let isNum = !isNaN(cVal);
    if (!isNum) cVal = val;

    // Evaluate formula if it starts with =
    let f1Raw = rule.formulas[0];
    let f1Val = f1Raw.startsWith('=') ? ctx.evalFormula(f1Raw, row, col) : f1Raw;
    let f1 = Number(f1Val);
    let f1Num = !isNaN(f1);
    if (!f1Num) f1 = f1Val as any;

    let f2 = 0;
    if (rule.formulas[1]) {
      let f2Raw = rule.formulas[1];
      let f2Val = f2Raw.startsWith('=') ? ctx.evalFormula(f2Raw, row, col) : f2Raw;
      f2 = Number(f2Val);
      let f2Num = !isNaN(f2);
      if (!f2Num) f2 = f2Val as any;
    }

    switch (rule.operator) {
      case 'greaterThan': return cVal > f1;
      case 'greaterThanOrEqual': return cVal >= f1;
      case 'lessThan': return cVal < f1;
      case 'lessThanOrEqual': return cVal <= f1;
      case 'equal': return cVal == f1;
      case 'notEqual': return cVal != f1;
      case 'between': return cVal >= f1 && cVal <= f2;
      case 'notBetween': return cVal < f1 || cVal > f2;
      default: return false;
    }
  }
}

export class FormatResolver {
  public resolveFormat(cellVal: any, matchedResults: {rule: CFRule, result: any}[]): ConditionalStyle {
    matchedResults.sort((a, b) => a.rule.priority - b.rule.priority);

    let finalStyle: ConditionalStyle = {};
    for (const match of matchedResults) {
      if (match.rule.style) {
        finalStyle = { ...match.rule.style, ...finalStyle };
      }
      
      if (match.result?.isDataBar) {
        finalStyle.dataBar = { percent: match.result.percent, color: match.result.color, negative: match.result.negative };
      }
      if (match.result?.isColorScale) {
        finalStyle.backgroundColor = match.result.color;
      }
      if (match.result?.isIconSet) {
        finalStyle.iconSet = { icon: match.result.icon };
      }

      if (match.rule.stopIfTrue) break;
    }
    return finalStyle;
  }
}

export class ConditionalFormattingEngine {
  private rules: CFRule[] = []; // Global list of rules for the sheet
  private evaluator = new RuleEvaluator();
  private resolver = new FormatResolver();

  public addRule(rule: CFRule) {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  public getRules(): CFRule[] {
    return this.rules;
  }

  public clearRules() {
    this.rules = [];
  }

  public evaluateCell(row: number, col: number, cellValue: any, ctx: CFContext): ConditionalStyle | undefined {
    if (this.rules.length === 0) return undefined;

    // Filter rules that apply to this cell
    const matchedResults: {rule: CFRule, result: any}[] = [];
    for (const rule of this.rules) {
      const res = this.evaluator.evaluateCell(cellValue, row, col, rule, ctx);
      if (res) {
        matchedResults.push({rule, result: res});
        if (rule.stopIfTrue) break;
      }
    }

    if (matchedResults.length === 0) return undefined;
    return this.resolver.resolveFormat(cellValue, matchedResults);
  }
}
