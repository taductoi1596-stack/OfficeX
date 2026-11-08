export type ValidationType = 'Any' | 'WholeNumber' | 'Decimal' | 'List' | 'Date' | 'Time' | 'TextLength' | 'Custom';

export type ComparisonOperator = 'Between' | 'NotBetween' | 'Equal' | 'NotEqual' | 'GreaterThan' | 'LessThan' | 'GreaterOrEqual' | 'LessOrEqual';

export type ErrorAlertType = 'Stop' | 'Warning' | 'Information';

export interface DataValidationRule {
  type: ValidationType;
  operator?: ComparisonOperator;
  formula1?: string; // value 1, list reference, or custom formula
  formula2?: string; // value 2 for 'Between'
  ignoreBlank: boolean;
  showDropDown?: boolean;
  
  inputMessage?: {
    title: string;
    description: string;
    show: boolean;
  };

  errorAlert?: {
    type: ErrorAlertType;
    title: string;
    message: string;
    show: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errorType?: 'Stop' | 'Warning' | 'Information';
  message?: string;
}

export class DataValidationEngine {
  private rules = new Map<string, DataValidationRule>(); // key could be cell reference or range

  public addRule(rangeRef: string, rule: DataValidationRule) {
    this.rules.set(rangeRef, rule);
  }

  public getRule(rangeRef: string): DataValidationRule | undefined {
    return this.rules.get(rangeRef);
  }

  public validateCell(rangeRef: string, inputValue: any): ValidationResult {
    const rule = this.rules.get(rangeRef);
    if (!rule || rule.type === 'Any') {
      return { isValid: true };
    }

    if (inputValue === '' || inputValue === null || inputValue === undefined) {
      if (rule.ignoreBlank) return { isValid: true };
      return this.reject(rule, "Value cannot be blank.");
    }

    switch (rule.type) {
      case 'WholeNumber':
        return this.validateNumber(inputValue, rule, true);
      case 'Decimal':
        return this.validateNumber(inputValue, rule, false);
      case 'List':
        return this.validateList(inputValue, rule);
      case 'TextLength':
        return this.validateTextLength(inputValue, rule);
      case 'Custom':
        return this.validateCustom(inputValue, rule);
      // Date and Time handled similarly
    }

    return { isValid: true };
  }

  private validateNumber(val: any, rule: DataValidationRule, isWhole: boolean): ValidationResult {
    const num = Number(val);
    if (isNaN(num)) return this.reject(rule, "Must be a number.");
    if (isWhole && !Number.isInteger(num)) return this.reject(rule, "Must be a whole number.");
    
    // Evaluate operator against formula1 and formula2 (mocked)
    return { isValid: true };
  }

  private validateList(val: any, rule: DataValidationRule): ValidationResult {
    // Check if val is in the list defined by formula1
    return { isValid: true }; // scaffolded
  }

  private validateTextLength(val: any, rule: DataValidationRule): ValidationResult {
    const len = String(val).length;
    // Compare len using operator
    return { isValid: true }; // scaffolded
  }

  private validateCustom(val: any, rule: DataValidationRule): ValidationResult {
    // Evaluate rule.formula1 using CalculationEngine
    return { isValid: true }; // scaffolded
  }

  private reject(rule: DataValidationRule, defaultMsg: string): ValidationResult {
    return {
      isValid: false,
      errorType: rule.errorAlert?.type || 'Stop',
      message: rule.errorAlert?.message || defaultMsg
    };
  }
}
