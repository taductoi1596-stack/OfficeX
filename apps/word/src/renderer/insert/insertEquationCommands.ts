import { CommandDefinition } from '../CommandDispatcher';
import { InsertEquationEngine } from './InsertEquationEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertEquationCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // EQUATION
      cmd('WORD.INSERT.EQUATION', 'Insert Equation', () => InsertEquationEngine.Equation('dialog')),
      cmd('WORD.INSERT.EQUATION.NEW', 'New Equation', () => InsertEquationEngine.Equation('new')),
      cmd('WORD.INSERT.EQUATION.INLINE', 'Inline Equation', () => InsertEquationEngine.Equation('inline')),
      cmd('WORD.INSERT.EQUATION.DISPLAY', 'Display Equation', () => InsertEquationEngine.Equation('display')),
      cmd('WORD.INSERT.EQUATION.EMPTY', 'Blank Equation', () => InsertEquationEngine.Equation('empty')),
      cmd('WORD.INSERT.EQUATION.EDIT', 'Edit Equation', () => InsertEquationEngine.Equation('edit')),
      cmd('WORD.INSERT.EQUATION.DELETE', 'Delete Equation', () => InsertEquationEngine.Equation('delete')),

      // EQUATION FORMAT
      cmd('WORD.INSERT.EQUATION.PROFESSIONAL', 'Professional Format', () => InsertEquationEngine.Equation('professional')),
      cmd('WORD.INSERT.EQUATION.LINEAR', 'Linear Format', () => InsertEquationEngine.Equation('linear')),
      cmd('WORD.INSERT.EQUATION.OMML', 'OMML Format', () => InsertEquationEngine.Equation('omml')),
      cmd('WORD.INSERT.EQUATION.LATEX', 'LaTeX Format', () => InsertEquationEngine.Equation('latex')),
      cmd('WORD.INSERT.EQUATION.MATHML', 'MathML Format', () => InsertEquationEngine.Equation('mathml')),
      cmd('WORD.INSERT.EQUATION.UNICODEMATH', 'UnicodeMath Format', () => InsertEquationEngine.Equation('unicodemath')),

      // FRACTIONS
      cmd('WORD.INSERT.EQUATION.FRACTION', 'Fraction', () => InsertEquationEngine.Fraction('dialog')),
      cmd('WORD.INSERT.EQUATION.FRACTION.STACKED', 'Stacked Fraction', () => InsertEquationEngine.Fraction('stacked')),
      cmd('WORD.INSERT.EQUATION.FRACTION.SKEWED', 'Skewed Fraction', () => InsertEquationEngine.Fraction('skewed')),
      cmd('WORD.INSERT.EQUATION.FRACTION.LINEAR', 'Linear Fraction', () => InsertEquationEngine.Fraction('linear')),
      cmd('WORD.INSERT.EQUATION.FRACTION.SMALL', 'Small Fraction', () => InsertEquationEngine.Fraction('small')),

      // SCRIPTS
      cmd('WORD.INSERT.EQUATION.SUPERSCRIPT', 'Superscript', () => InsertEquationEngine.Script('superscript')),
      cmd('WORD.INSERT.EQUATION.SUBSCRIPT', 'Subscript', () => InsertEquationEngine.Script('subscript')),
      cmd('WORD.INSERT.EQUATION.SUBSUP', 'Subscript Superscript', () => InsertEquationEngine.Script('subsup')),

      // RADICALS
      cmd('WORD.INSERT.EQUATION.RADICAL', 'Square Root', () => InsertEquationEngine.Radical('radical')),
      cmd('WORD.INSERT.EQUATION.CUBEROOT', 'Cube Root', () => InsertEquationEngine.Radical('cuberoot')),
      cmd('WORD.INSERT.EQUATION.NROOT', 'Nth Root', () => InsertEquationEngine.Radical('nroot')),

      // INTEGRALS
      cmd('WORD.INSERT.EQUATION.INTEGRAL', 'Integral', () => InsertEquationEngine.Integral('integral')),
      cmd('WORD.INSERT.EQUATION.DOUBLEINTEGRAL', 'Double Integral', () => InsertEquationEngine.Integral('double')),
      cmd('WORD.INSERT.EQUATION.TRIPLEINTEGRAL', 'Triple Integral', () => InsertEquationEngine.Integral('triple')),
      cmd('WORD.INSERT.EQUATION.CONTOUR', 'Contour Integral', () => InsertEquationEngine.Integral('contour')),

      // OPERATORS
      cmd('WORD.INSERT.EQUATION.SUM', 'Summation', () => InsertEquationEngine.Operator('sum')),
      cmd('WORD.INSERT.EQUATION.PRODUCT', 'Product', () => InsertEquationEngine.Operator('product')),
      cmd('WORD.INSERT.EQUATION.COPRODUCT', 'CoProduct', () => InsertEquationEngine.Operator('coproduct')),
      cmd('WORD.INSERT.EQUATION.LIMIT', 'Limit', () => InsertEquationEngine.Operator('limit')),
      cmd('WORD.INSERT.EQUATION.MINMAX', 'Min Max', () => InsertEquationEngine.Operator('minmax')),

      // BRACKETS
      cmd('WORD.INSERT.EQUATION.BRACKET', 'Brackets', () => InsertEquationEngine.Bracket('bracket')),
      cmd('WORD.INSERT.EQUATION.PARENTHESIS', 'Parentheses', () => InsertEquationEngine.Bracket('parenthesis')),
      cmd('WORD.INSERT.EQUATION.BRACES', 'Braces', () => InsertEquationEngine.Bracket('braces')),
      cmd('WORD.INSERT.EQUATION.ABS', 'Absolute Value', () => InsertEquationEngine.Bracket('abs')),
      cmd('WORD.INSERT.EQUATION.NORM', 'Norm', () => InsertEquationEngine.Bracket('norm')),

      // MATRICES
      cmd('WORD.INSERT.EQUATION.MATRIX', 'Matrix', () => InsertEquationEngine.Matrix('dialog')),
      cmd('WORD.INSERT.EQUATION.MATRIX.2X2', '2x2 Matrix', () => InsertEquationEngine.Matrix('2x2')),
      cmd('WORD.INSERT.EQUATION.MATRIX.3X3', '3x3 Matrix', () => InsertEquationEngine.Matrix('3x3')),
      cmd('WORD.INSERT.EQUATION.MATRIX.NXN', 'NxN Matrix', () => InsertEquationEngine.Matrix('nxn')),
      cmd('WORD.INSERT.EQUATION.DETERMINANT', 'Determinant', () => InsertEquationEngine.Matrix('determinant')),
      cmd('WORD.INSERT.EQUATION.CASES', 'Cases', () => InsertEquationEngine.Matrix('cases')),

      // FUNCTIONS
      cmd('WORD.INSERT.EQUATION.FUNCTION', 'Function', () => InsertEquationEngine.Function('function')),
      cmd('WORD.INSERT.EQUATION.SIN', 'Sine', () => InsertEquationEngine.Function('sin')),
      cmd('WORD.INSERT.EQUATION.COS', 'Cosine', () => InsertEquationEngine.Function('cos')),
      cmd('WORD.INSERT.EQUATION.TAN', 'Tangent', () => InsertEquationEngine.Function('tan')),
      cmd('WORD.INSERT.EQUATION.LOG', 'Logarithm', () => InsertEquationEngine.Function('log')),
      cmd('WORD.INSERT.EQUATION.LN', 'Natural Logarithm', () => InsertEquationEngine.Function('ln')),
      cmd('WORD.INSERT.EQUATION.EXP', 'Exponential', () => InsertEquationEngine.Function('exp')),

      // SYMBOLS
      cmd('WORD.INSERT.EQUATION.SYMBOL', 'Insert Symbol', () => InsertEquationEngine.Symbol('dialog')),
      cmd('WORD.INSERT.EQUATION.GREEK', 'Greek Letters', () => InsertEquationEngine.Symbol('greek')),
      cmd('WORD.INSERT.EQUATION.ARROWS', 'Math Arrows', () => InsertEquationEngine.Symbol('arrows')),
      cmd('WORD.INSERT.EQUATION.RELATIONS', 'Relations', () => InsertEquationEngine.Symbol('relations')),
      cmd('WORD.INSERT.EQUATION.SETS', 'Set Symbols', () => InsertEquationEngine.Symbol('sets')),
      cmd('WORD.INSERT.EQUATION.LOGIC', 'Logic Symbols', () => InsertEquationEngine.Symbol('logic')),
      cmd('WORD.INSERT.EQUATION.GEOMETRY', 'Geometry Symbols', () => InsertEquationEngine.Symbol('geometry')),
      cmd('WORD.INSERT.EQUATION.CALCULUS', 'Calculus Symbols', () => InsertEquationEngine.Symbol('calculus')),

      // TEMPLATES
      cmd('WORD.INSERT.EQUATION.TEMPLATE', 'Equation Template', () => InsertEquationEngine.Template('dialog')),
      cmd('WORD.INSERT.EQUATION.TEMPLATE.SAVE', 'Save Template', () => InsertEquationEngine.Template('save')),
      cmd('WORD.INSERT.EQUATION.TEMPLATE.LOAD', 'Load Template', () => InsertEquationEngine.Template('load')),
      cmd('WORD.INSERT.EQUATION.TEMPLATE.DELETE', 'Delete Template', () => InsertEquationEngine.Template('delete')),

      // IMPORT
      cmd('WORD.INSERT.EQUATION.IMPORT.LATEX', 'Import LaTeX', () => InsertEquationEngine.Import('latex')),
      cmd('WORD.INSERT.EQUATION.IMPORT.MATHML', 'Import MathML', () => InsertEquationEngine.Import('mathml')),
      cmd('WORD.INSERT.EQUATION.IMPORT.OMML', 'Import OMML', () => InsertEquationEngine.Import('omml')),

      // EXPORT
      cmd('WORD.INSERT.EQUATION.EXPORT.LATEX', 'Export LaTeX', () => InsertEquationEngine.Export('latex')),
      cmd('WORD.INSERT.EQUATION.EXPORT.MATHML', 'Export MathML', () => InsertEquationEngine.Export('mathml')),
      cmd('WORD.INSERT.EQUATION.EXPORT.OMML', 'Export OMML', () => InsertEquationEngine.Export('omml')),
      cmd('WORD.INSERT.EQUATION.EXPORT.SVG', 'Export SVG', () => InsertEquationEngine.Export('svg')),
      cmd('WORD.INSERT.EQUATION.EXPORT.PNG', 'Export PNG', () => InsertEquationEngine.Export('png')),

      // AI
      cmd('WORD.INSERT.EQUATION.AI.GENERATE', 'Generate Equation', () => InsertEquationEngine.AI('generate')),
      cmd('WORD.INSERT.EQUATION.AI.SOLVE', 'Solve Equation', () => InsertEquationEngine.AI('solve')),
      cmd('WORD.INSERT.EQUATION.AI.SIMPLIFY', 'Simplify Equation', () => InsertEquationEngine.AI('simplify')),
      cmd('WORD.INSERT.EQUATION.AI.CONVERT', 'Convert Equation Format', () => InsertEquationEngine.AI('convert')),
      cmd('WORD.INSERT.EQUATION.AI.EXPLAIN', 'Explain Equation', () => InsertEquationEngine.AI('explain')),
    ];
  }
}
