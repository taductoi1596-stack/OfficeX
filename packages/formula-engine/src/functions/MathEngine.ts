// Helper to flatten all args into an array of numbers
function flattenNums(...args: any[]): number[] {
  const result: number[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      for (const item of arg.flat(Infinity)) {
        if (typeof item === 'number') result.push(item);
        else if (typeof item === 'string') {
          const n = parseFloat(item);
          if (!isNaN(n)) result.push(n);
        }
      }
    } else if (typeof arg === 'number') {
      result.push(arg);
    } else if (typeof arg === 'string') {
      const n = parseFloat(arg);
      if (!isNaN(n)) result.push(n);
    }
  }
  return result;
}

// Parse a single value to number
function num(v: any): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export class MathEngine {
  public static registerFunctions(registry: any) {

    // ====== AGGREGATES ======

    registry.register('SUM', (...args: any[]) => {
      return flattenNums(...args).reduce((a, b) => a + b, 0);
    });

    registry.register('AVERAGE', (...args: any[]) => {
      const nums = flattenNums(...args);
      return nums.length === 0 ? '#DIV/0!' : nums.reduce((a, b) => a + b, 0) / nums.length;
    });

    registry.register('AVERAGEA', (...args: any[]) => {
      // Like AVERAGE but counts text as 0 and TRUE=1, FALSE=0
      let sum = 0, count = 0;
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (v === null || v === undefined || v === '') continue;
          if (typeof v === 'boolean') { sum += v ? 1 : 0; count++; }
          else if (typeof v === 'string') { count++; } // text = 0
          else { sum += parseFloat(v) || 0; count++; }
        }
      }
      return count === 0 ? '#DIV/0!' : sum / count;
    });

    registry.register('MIN', (...args: any[]) => {
      const nums = flattenNums(...args);
      return nums.length === 0 ? 0 : Math.min(...nums);
    });

    registry.register('MAX', (...args: any[]) => {
      const nums = flattenNums(...args);
      return nums.length === 0 ? 0 : Math.max(...nums);
    });

    registry.register('MINA', (...args: any[]) => {
      const nums: number[] = [];
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (v === null || v === undefined || v === '') continue;
          if (typeof v === 'boolean') nums.push(v ? 1 : 0);
          else nums.push(parseFloat(v) || 0);
        }
      }
      return nums.length === 0 ? 0 : Math.min(...nums);
    });

    registry.register('MAXA', (...args: any[]) => {
      const nums: number[] = [];
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (v === null || v === undefined || v === '') continue;
          if (typeof v === 'boolean') nums.push(v ? 1 : 0);
          else nums.push(parseFloat(v) || 0);
        }
      }
      return nums.length === 0 ? 0 : Math.max(...nums);
    });

    registry.register('COUNT', (...args: any[]) => {
      let count = 0;
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)))) count++;
        }
      }
      return count;
    });

    registry.register('COUNTA', (...args: any[]) => {
      let count = 0;
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (v !== null && v !== undefined && v !== '') count++;
        }
      }
      return count;
    });

    registry.register('COUNTBLANK', (...args: any[]) => {
      let count = 0;
      for (const arg of args) {
        const arr = Array.isArray(arg) ? arg.flat(Infinity) : [arg];
        for (const v of arr) {
          if (v === null || v === undefined || v === '') count++;
        }
      }
      return count;
    });

    registry.register('PRODUCT', (...args: any[]) => {
      const nums = flattenNums(...args);
      return nums.reduce((a, b) => a * b, 1);
    });

    registry.register('SUMPRODUCT', (...arrays: any[]) => {
      // Each arg should be an array; multiply element-wise then sum
      const flattened = arrays.map(a => (Array.isArray(a) ? a.flat(Infinity) : [a]).map(num));
      if (flattened.length === 0) return 0;
      const len = flattened[0].length;
      let sum = 0;
      for (let i = 0; i < len; i++) {
        let product = 1;
        for (const arr of flattened) {
          product *= arr[i] ?? 0;
        }
        sum += product;
      }
      return sum;
    });

    registry.register('SUMSQ', (...args: any[]) => {
      return flattenNums(...args).reduce((a, b) => a + b * b, 0);
    });

    registry.register('SUMIF', (range: any, criteria: any, sumRange: any = null) => {
      const rangeArr = (Array.isArray(range) ? range.flat(Infinity) : [range]);
      const sumArr = sumRange ? (Array.isArray(sumRange) ? sumRange.flat(Infinity) : [sumRange]) : rangeArr;
      let sum = 0;
      for (let i = 0; i < rangeArr.length; i++) {
        const v = rangeArr[i];
        let match = false;
        const crit = String(criteria);
        if (typeof criteria === 'number') {
          match = num(v) === criteria;
        } else if (crit.startsWith('>=')) {
          match = num(v) >= parseFloat(crit.slice(2));
        } else if (crit.startsWith('<=')) {
          match = num(v) <= parseFloat(crit.slice(2));
        } else if (crit.startsWith('<>')) {
          match = String(v) !== crit.slice(2);
        } else if (crit.startsWith('>')) {
          match = num(v) > parseFloat(crit.slice(1));
        } else if (crit.startsWith('<')) {
          match = num(v) < parseFloat(crit.slice(1));
        } else if (crit.includes('*') || crit.includes('?')) {
          const pattern = '^' + crit.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
          match = new RegExp(pattern, 'i').test(String(v));
        } else {
          match = String(v).toLowerCase() === crit.toLowerCase();
        }
        if (match) {
          const sv = num(sumArr[i] ?? 0);
          sum += isNaN(sv) ? 0 : sv;
        }
      }
      return sum;
    });

    registry.register('COUNTIF', (range: any, criteria: any) => {
      const rangeArr = (Array.isArray(range) ? range.flat(Infinity) : [range]);
      let count = 0;
      const crit = String(criteria);
      for (const v of rangeArr) {
        let match = false;
        if (typeof criteria === 'number') {
          match = num(v) === criteria;
        } else if (crit.startsWith('>=')) {
          match = num(v) >= parseFloat(crit.slice(2));
        } else if (crit.startsWith('<=')) {
          match = num(v) <= parseFloat(crit.slice(2));
        } else if (crit.startsWith('<>')) {
          match = String(v) !== crit.slice(2);
        } else if (crit.startsWith('>')) {
          match = num(v) > parseFloat(crit.slice(1));
        } else if (crit.startsWith('<')) {
          match = num(v) < parseFloat(crit.slice(1));
        } else if (crit.includes('*') || crit.includes('?')) {
          const pattern = '^' + crit.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
          match = new RegExp(pattern, 'i').test(String(v));
        } else {
          match = String(v).toLowerCase() === crit.toLowerCase();
        }
        if (match) count++;
      }
      return count;
    });

    // ====== ROUNDING ======

    registry.register('ABS', (n: any) => {
      const v = parseFloat(n);
      return isNaN(v) ? '#VALUE!' : Math.abs(v);
    });

    registry.register('ROUND', (n: any, digits: any) => {
      const v = parseFloat(n), d = parseInt(digits, 10);
      if (isNaN(v) || isNaN(d)) return '#VALUE!';
      const factor = Math.pow(10, d);
      return Math.round(v * factor) / factor;
    });

    registry.register('ROUNDUP', (n: any, digits: any) => {
      const v = parseFloat(n), d = parseInt(digits, 10);
      if (isNaN(v) || isNaN(d)) return '#VALUE!';
      const factor = Math.pow(10, d);
      return (v >= 0 ? Math.ceil(v * factor) : -Math.floor(-v * factor)) / factor;
    });

    registry.register('ROUNDDOWN', (n: any, digits: any) => {
      const v = parseFloat(n), d = parseInt(digits, 10);
      if (isNaN(v) || isNaN(d)) return '#VALUE!';
      const factor = Math.pow(10, d);
      return (v >= 0 ? Math.floor(v * factor) : -Math.ceil(-v * factor)) / factor;
    });

    registry.register('MROUND', (n: any, multiple: any) => {
      const v = parseFloat(n), m = parseFloat(multiple);
      if (isNaN(v) || isNaN(m) || m === 0) return '#NUM!';
      return Math.round(v / m) * m;
    });

    registry.register('CEILING', (n: any, significance: any = 1) => {
      const v = parseFloat(n), s = parseFloat(significance);
      if (isNaN(v) || isNaN(s) || s === 0) return '#NUM!';
      return Math.ceil(v / s) * s;
    });

    registry.register('CEILING.MATH', (n: any, significance: any = 1, mode: any = 0) => {
      const v = parseFloat(n), s = Math.abs(parseFloat(significance) || 1);
      if (isNaN(v)) return '#VALUE!';
      if (v >= 0) return Math.ceil(v / s) * s;
      return num(mode) === 0 ? Math.ceil(v / s) * s : Math.floor(v / s) * s;
    });

    registry.register('CEILING.PRECISE', (n: any, significance: any = 1) => {
      const v = parseFloat(n), s = Math.abs(parseFloat(significance) || 1);
      if (isNaN(v)) return '#VALUE!';
      return Math.ceil(v / s) * s;
    });

    registry.register('FLOOR', (n: any, significance: any = 1) => {
      const v = parseFloat(n), s = parseFloat(significance);
      if (isNaN(v) || isNaN(s) || s === 0) return '#NUM!';
      if (v >= 0 && s < 0) return '#NUM!';
      return Math.floor(v / s) * s;
    });

    registry.register('FLOOR.MATH', (n: any, significance: any = 1, mode: any = 0) => {
      const v = parseFloat(n), s = Math.abs(parseFloat(significance) || 1);
      if (isNaN(v)) return '#VALUE!';
      if (v >= 0) return Math.floor(v / s) * s;
      return num(mode) === 0 ? Math.floor(v / s) * s : Math.ceil(v / s) * s;
    });

    registry.register('FLOOR.PRECISE', (n: any, significance: any = 1) => {
      const v = parseFloat(n), s = Math.abs(parseFloat(significance) || 1);
      if (isNaN(v)) return '#VALUE!';
      return Math.floor(v / s) * s;
    });

    registry.register('INT', (n: any) => {
      const v = parseFloat(n);
      return isNaN(v) ? '#VALUE!' : Math.floor(v);
    });

    registry.register('TRUNC', (n: any, digits: any = 0) => {
      const v = parseFloat(n), d = parseInt(digits, 10) || 0;
      if (isNaN(v)) return '#VALUE!';
      const factor = Math.pow(10, d);
      return Math.trunc(v * factor) / factor;
    });

    registry.register('EVEN', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v)) return '#VALUE!';
      const c = Math.ceil(Math.abs(v) / 2) * 2;
      return v < 0 ? -c : c;
    });

    registry.register('ODD', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v)) return '#VALUE!';
      if (v === 0) return 1;
      const abs = Math.abs(v);
      const c = Math.floor(abs) % 2 === 0 ? Math.floor(abs) + 1 : Math.ceil(abs);
      return v < 0 ? -c : c;
    });

    // ====== BASIC MATH ======

    registry.register('MOD', (n: any, divisor: any) => {
      const v = parseFloat(n), d = parseFloat(divisor);
      if (isNaN(v) || isNaN(d)) return '#VALUE!';
      if (d === 0) return '#DIV/0!';
      return v - Math.floor(v / d) * d; // Excel MOD matches sign of divisor
    });

    registry.register('QUOTIENT', (numerator: any, denominator: any) => {
      const n = parseFloat(numerator), d = parseFloat(denominator);
      if (isNaN(n) || isNaN(d)) return '#VALUE!';
      if (d === 0) return '#DIV/0!';
      return Math.trunc(n / d);
    });

    registry.register('SIGN', (n: any) => {
      const v = parseFloat(n);
      return isNaN(v) ? '#VALUE!' : Math.sign(v);
    });

    registry.register('POWER', (base: any, exponent: any) => {
      const b = parseFloat(base), e = parseFloat(exponent);
      if (isNaN(b) || isNaN(e)) return '#VALUE!';
      return Math.pow(b, e);
    });

    registry.register('SQRT', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v)) return '#VALUE!';
      if (v < 0) return '#NUM!';
      return Math.sqrt(v);
    });

    registry.register('SQRTPI', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v)) return '#VALUE!';
      if (v < 0) return '#NUM!';
      return Math.sqrt(v * Math.PI);
    });

    registry.register('PI', () => Math.PI);

    registry.register('EXP', (n: any) => {
      const v = parseFloat(n);
      return isNaN(v) ? '#VALUE!' : Math.exp(v);
    });

    registry.register('LN', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v) || v <= 0) return '#NUM!';
      return Math.log(v);
    });

    registry.register('LOG', (n: any, base: any = 10) => {
      const v = parseFloat(n), b = parseFloat(base);
      if (isNaN(v) || isNaN(b) || v <= 0 || b <= 0 || b === 1) return '#NUM!';
      return Math.log(v) / Math.log(b);
    });

    registry.register('LOG10', (n: any) => {
      const v = parseFloat(n);
      if (isNaN(v) || v <= 0) return '#NUM!';
      return Math.log10(v);
    });

    registry.register('FACT', (n: any) => {
      const v = Math.floor(parseFloat(n));
      if (isNaN(v) || v < 0) return '#NUM!';
      if (v > 170) return '#NUM!';
      let f = 1;
      for (let i = 2; i <= v; i++) f *= i;
      return f;
    });

    registry.register('FACTDOUBLE', (n: any) => {
      const v = Math.floor(parseFloat(n));
      if (isNaN(v) || v < -1) return '#NUM!';
      if (v <= 0) return 1;
      let f = 1;
      for (let i = v; i >= 2; i -= 2) f *= i;
      return f;
    });

    registry.register('COMBIN', (n: any, k: any) => {
      const nv = Math.floor(parseFloat(n)), kv = Math.floor(parseFloat(k));
      if (isNaN(nv) || isNaN(kv) || nv < 0 || kv < 0 || kv > nv) return '#NUM!';
      if (kv === 0 || kv === nv) return 1;
      let result = 1;
      for (let i = 0; i < Math.min(kv, nv - kv); i++) {
        result = result * (nv - i) / (i + 1);
      }
      return Math.round(result);
    });

    registry.register('COMBINA', (n: any, k: any) => {
      const nv = Math.floor(parseFloat(n)), kv = Math.floor(parseFloat(k));
      if (isNaN(nv) || isNaN(kv) || nv < 0 || kv < 0) return '#NUM!';
      if (kv === 0) return 1;
      return registry.getFunction('COMBIN')(nv + kv - 1, kv);
    });

    registry.register('PERMUT', (n: any, k: any) => {
      const nv = Math.floor(parseFloat(n)), kv = Math.floor(parseFloat(k));
      if (isNaN(nv) || isNaN(kv) || nv < 0 || kv < 0 || kv > nv) return '#NUM!';
      let result = 1;
      for (let i = nv; i > nv - kv; i--) result *= i;
      return result;
    });

    registry.register('PERMUTATIONA', (n: any, k: any) => {
      const nv = Math.floor(parseFloat(n)), kv = Math.floor(parseFloat(k));
      if (isNaN(nv) || isNaN(kv) || nv < 0 || kv < 0) return '#NUM!';
      return Math.pow(nv, kv);
    });

    registry.register('GCD', (...args: any[]) => {
      const gcd2 = (a: number, b: number): number => b === 0 ? a : gcd2(b, a % b);
      const nums = flattenNums(...args).map(Math.abs).map(Math.floor);
      if (nums.some(v => v < 0)) return '#NUM!';
      return nums.reduce(gcd2);
    });

    registry.register('LCM', (...args: any[]) => {
      const gcd2 = (a: number, b: number): number => b === 0 ? a : gcd2(b, a % b);
      const lcm2 = (a: number, b: number) => a / gcd2(a, b) * b;
      const nums = flattenNums(...args).map(Math.abs).map(Math.floor);
      if (nums.some(v => v < 0)) return '#NUM!';
      return nums.reduce(lcm2);
    });

    registry.register('MULTINOMIAL', (...args: any[]) => {
      const nums = flattenNums(...args).map(Math.floor);
      if (nums.some(v => v < 0)) return '#NUM!';
      const total = nums.reduce((a, b) => a + b, 0);
      let factTotal = 1;
      for (let i = 2; i <= total; i++) factTotal *= i;
      let factProd = 1;
      for (const n of nums) {
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        factProd *= f;
      }
      return factProd === 0 ? '#DIV/0!' : factTotal / factProd;
    });

    registry.register('SERIESSUM', (x: any, n: any, m: any, coefficients: any) => {
      const xv = parseFloat(x), nv = parseFloat(n), mv = parseFloat(m);
      if (isNaN(xv) || isNaN(nv) || isNaN(mv)) return '#VALUE!';
      const coeffs = (Array.isArray(coefficients) ? coefficients.flat(Infinity) : [coefficients]).map(parseFloat);
      let sum = 0;
      for (let i = 0; i < coeffs.length; i++) {
        sum += coeffs[i] * Math.pow(xv, nv + i * mv);
      }
      return sum;
    });

    registry.register('SUBTOTAL', (functionNum: any, ...refs: any[]) => {
      const fn = Math.floor(parseFloat(functionNum));
      const vals = flattenNums(...refs);
      // 1-11: include hidden, 101-111: exclude hidden (we treat them the same here)
      const code = fn > 100 ? fn - 100 : fn;
      switch (code) {
        case 1: return vals.reduce((a, b) => a + b, 0) / (vals.length || 1); // AVERAGE
        case 2: return vals.length; // COUNT
        case 3: return vals.length; // COUNTA
        case 4: return vals.length === 0 ? 0 : Math.max(...vals); // MAX
        case 5: return vals.length === 0 ? 0 : Math.min(...vals); // MIN
        case 6: return vals.reduce((a, b) => a * b, 1); // PRODUCT
        case 7: { // STDEV
          if (vals.length < 2) return '#DIV/0!';
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          return Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (vals.length - 1));
        }
        case 8: { // STDEVP
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          return Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
        }
        case 9: return vals.reduce((a, b) => a + b, 0); // SUM
        case 10: { // VAR
          if (vals.length < 2) return '#DIV/0!';
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          return vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (vals.length - 1);
        }
        case 11: { // VARP
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          return vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
        }
        default: return '#VALUE!';
      }
    });

    registry.register('AGGREGATE', (functionNum: any, options: any, ...refs: any[]) => {
      // Options for ignoring errors, hidden rows, nested subtotals — simplified
      return registry.getFunction('SUBTOTAL')(functionNum, ...refs);
    });

    // ====== TRIGONOMETRY ======

    registry.register('SIN', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.sin(v); });
    registry.register('COS', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.cos(v); });
    registry.register('TAN', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.tan(v); });
    registry.register('ASIN', (n: any) => { const v = parseFloat(n); if (isNaN(v) || v < -1 || v > 1) return '#NUM!'; return Math.asin(v); });
    registry.register('ACOS', (n: any) => { const v = parseFloat(n); if (isNaN(v) || v < -1 || v > 1) return '#NUM!'; return Math.acos(v); });
    registry.register('ATAN', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.atan(v); });
    registry.register('ATAN2', (x: any, y: any) => {
      const xv = parseFloat(x), yv = parseFloat(y);
      if (isNaN(xv) || isNaN(yv)) return '#VALUE!';
      if (xv === 0 && yv === 0) return '#DIV/0!';
      return Math.atan2(yv, xv); // Note: Excel ATAN2(x,y) not (y,x)
    });
    registry.register('SINH', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.sinh(v); });
    registry.register('COSH', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.cosh(v); });
    registry.register('TANH', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.tanh(v); });
    registry.register('ASINH', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.asinh(v); });
    registry.register('ACOSH', (n: any) => { const v = parseFloat(n); if (isNaN(v) || v < 1) return '#NUM!'; return Math.acosh(v); });
    registry.register('ATANH', (n: any) => { const v = parseFloat(n); if (isNaN(v) || Math.abs(v) >= 1) return '#NUM!'; return Math.atanh(v); });
    registry.register('SEC', (n: any) => { const v = parseFloat(n); if (isNaN(v)) return '#VALUE!'; const c = Math.cos(v); return c === 0 ? '#DIV/0!' : 1 / c; });
    registry.register('CSC', (n: any) => { const v = parseFloat(n); if (isNaN(v)) return '#VALUE!'; const s = Math.sin(v); return s === 0 ? '#DIV/0!' : 1 / s; });
    registry.register('COT', (n: any) => { const v = parseFloat(n); if (isNaN(v)) return '#VALUE!'; const t = Math.tan(v); return t === 0 ? '#DIV/0!' : 1 / t; });
    registry.register('SECH', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : 1 / Math.cosh(v); });
    registry.register('CSCH', (n: any) => { const v = parseFloat(n); if (isNaN(v)) return '#VALUE!'; const s = Math.sinh(v); return s === 0 ? '#DIV/0!' : 1 / s; });
    registry.register('COTH', (n: any) => { const v = parseFloat(n); if (isNaN(v)) return '#VALUE!'; const t = Math.tanh(v); return t === 0 ? '#DIV/0!' : 1 / t; });
    registry.register('ACOT', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : Math.PI / 2 - Math.atan(v); });
    registry.register('ACOTH', (n: any) => { const v = parseFloat(n); if (isNaN(v) || Math.abs(v) <= 1) return '#NUM!'; return 0.5 * Math.log((v + 1) / (v - 1)); });

    registry.register('DEGREES', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : v * 180 / Math.PI; });
    registry.register('RADIANS', (n: any) => { const v = parseFloat(n); return isNaN(v) ? '#VALUE!' : v * Math.PI / 180; });

    // ====== RANDOM ======

    registry.register('RAND', () => Math.random(), true);

    registry.register('RANDBETWEEN', (bottom: any, top: any) => {
      const b = Math.ceil(parseFloat(bottom)), t = Math.floor(parseFloat(top));
      if (isNaN(b) || isNaN(t) || b > t) return '#NUM!';
      return Math.floor(Math.random() * (t - b + 1)) + b;
    }, true);

    registry.register('RANDARRAY', (rows: any = 1, cols: any = 1, min: any = 0, max: any = 1, isInteger: any = false) => {
      const r = Math.max(1, Math.floor(parseFloat(rows))), c = Math.max(1, Math.floor(parseFloat(cols)));
      const lo = parseFloat(min), hi = parseFloat(max);
      const result: number[][] = [];
      for (let i = 0; i < r; i++) {
        const row: number[] = [];
        for (let j = 0; j < c; j++) {
          const v = lo + Math.random() * (hi - lo);
          row.push(isInteger ? Math.floor(v) : v);
        }
        result.push(row);
      }
      return r === 1 && c === 1 ? result[0][0] : result;
    }, true);

    // ====== NUMBER THEORY ======

    registry.register('ROMAN', (n: any, form: any = 0) => {
      const v = Math.floor(parseFloat(n));
      if (isNaN(v) || v < 0 || v > 3999) return '#VALUE!';
      const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
      const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
      let num = v, result = '';
      for (let i = 0; i < vals.length; i++) {
        while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
      }
      return result;
    });

    registry.register('ARABIC', (text: any) => {
      const s = String(text).toUpperCase().trim();
      if (!s) return 0;
      const vals: Record<string, number> = { M:1000, D:500, C:100, L:50, X:10, V:5, I:1 };
      let result = 0, prev = 0;
      for (let i = s.length - 1; i >= 0; i--) {
        const curr = vals[s[i]] ?? 0;
        result += curr < prev ? -curr : curr;
        prev = curr;
      }
      return result;
    });

    registry.register('BASE', (n: any, radix: any, minLength: any = 0) => {
      const v = Math.floor(parseFloat(n)), r = Math.floor(parseFloat(radix)), ml = Math.floor(parseFloat(minLength)) || 0;
      if (isNaN(v) || isNaN(r) || v < 0 || r < 2 || r > 36) return '#NUM!';
      const result = v.toString(r).toUpperCase();
      return result.padStart(ml, '0');
    });

    registry.register('DECIMAL', (text: any, radix: any) => {
      const r = Math.floor(parseFloat(radix));
      if (isNaN(r) || r < 2 || r > 36) return '#NUM!';
      const result = parseInt(String(text), r);
      return isNaN(result) ? '#NUM!' : result;
    });

    // ====== MATRIX / ARRAY ======

    registry.register('SEQUENCE', (rows: any = 1, cols: any = 1, start: any = 1, step: any = 1) => {
      const r = Math.max(1, Math.floor(parseFloat(rows)));
      const c = Math.max(1, Math.floor(parseFloat(cols)));
      const s = parseFloat(start) || 1;
      const st = parseFloat(step) || 1;
      const result: number[][] = [];
      let current = s;
      for (let i = 0; i < r; i++) {
        const row: number[] = [];
        for (let j = 0; j < c; j++) {
          row.push(current);
          current += st;
        }
        result.push(row);
      }
      return r === 1 && c === 1 ? result[0][0] : result;
    });

    registry.register('MMULT', (array1: any, array2: any) => {
      const a = Array.isArray(array1) ? array1 : [[parseFloat(array1)]];
      const b = Array.isArray(array2) ? array2 : [[parseFloat(array2)]];
      const rows1 = a.length, cols1 = (a[0] || []).length;
      const rows2 = b.length, cols2 = (b[0] || []).length;
      if (cols1 !== rows2) return '#VALUE!';
      const result: number[][] = [];
      for (let i = 0; i < rows1; i++) {
        result[i] = [];
        for (let j = 0; j < cols2; j++) {
          let sum = 0;
          for (let k = 0; k < cols1; k++) sum += (a[i][k] || 0) * (b[k][j] || 0);
          result[i][j] = sum;
        }
      }
      return rows1 === 1 && cols2 === 1 ? result[0][0] : result;
    });

    registry.register('MDETERM', (array: any) => {
      const a = Array.isArray(array) ? array : [[parseFloat(array)]];
      const n = a.length;
      if (n === 1) return a[0][0];
      if (n === 2) return a[0][0]*a[1][1] - a[0][1]*a[1][0];
      // Gaussian elimination
      const mat = a.map((row: number[]) => [...row]);
      let det = 1;
      for (let i = 0; i < n; i++) {
        let pivot = i;
        for (let j = i + 1; j < n; j++) if (Math.abs(mat[j][i]) > Math.abs(mat[pivot][i])) pivot = j;
        if (pivot !== i) { [mat[i], mat[pivot]] = [mat[pivot], mat[i]]; det = -det; }
        if (mat[i][i] === 0) return 0;
        det *= mat[i][i];
        for (let j = i + 1; j < n; j++) {
          const f = mat[j][i] / mat[i][i];
          for (let k = i + 1; k < n; k++) mat[j][k] -= f * mat[i][k];
        }
      }
      return det;
    });

    registry.register('MINVERSE', (array: any) => {
      const a = Array.isArray(array) ? array : [[parseFloat(array)]];
      const n = a.length;
      // Augmented matrix with identity
      const aug = a.map((row: number[], i: number) => {
        const ext = new Array(n).fill(0);
        ext[i] = 1;
        return [...row, ...ext];
      });
      for (let i = 0; i < n; i++) {
        let pivot = i;
        for (let j = i + 1; j < n; j++) if (Math.abs(aug[j][i]) > Math.abs(aug[pivot][i])) pivot = j;
        [aug[i], aug[pivot]] = [aug[pivot], aug[i]];
        if (aug[i][i] === 0) return '#NUM!';
        const f = aug[i][i];
        for (let k = 0; k < 2 * n; k++) aug[i][k] /= f;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            const fj = aug[j][i];
            for (let k = 0; k < 2 * n; k++) aug[j][k] -= fj * aug[i][k];
          }
        }
      }
      return aug.map(row => row.slice(n));
    });

    registry.register('TRANSPOSE', (array: any) => {
      if (!Array.isArray(array)) return array;
      const a = array.map((r: any) => Array.isArray(r) ? r : [r]);
      const rows = a.length, cols = a[0]?.length ?? 1;
      return Array.from({ length: cols }, (_, j) => Array.from({ length: rows }, (_, i) => a[i][j]));
    });

    // ====== MISC ======

    registry.register('ISNUMBER', (v: any) => typeof v === 'number' || (!isNaN(parseFloat(v)) && v !== ''));
    registry.register('ISTEXT', (v: any) => typeof v === 'string');
    registry.register('ISBLANK', (v: any) => v === null || v === undefined || v === '');
    registry.register('ISERROR', (v: any) => typeof v === 'string' && v.startsWith('#'));
    registry.register('ISERR', (v: any) => typeof v === 'string' && v.startsWith('#') && v !== '#N/A');
    registry.register('ISNA', (v: any) => v === '#N/A');
    registry.register('ISLOGICAL', (v: any) => typeof v === 'boolean');
    registry.register('ISEVEN', (n: any) => { const v = Math.floor(parseFloat(n)); return isNaN(v) ? '#VALUE!' : v % 2 === 0; });
    registry.register('ISODD', (n: any) => { const v = Math.floor(parseFloat(n)); return isNaN(v) ? '#VALUE!' : Math.abs(v) % 2 === 1; });
    registry.register('N', (v: any) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'boolean') return v ? 1 : 0;
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    });
    registry.register('NA', () => '#N/A');
    registry.register('TYPE', (v: any) => {
      if (typeof v === 'number') return 1;
      if (typeof v === 'string') return 2;
      if (typeof v === 'boolean') return 4;
      if (typeof v === 'string' && (v as string).startsWith('#')) return 16;
      if (Array.isArray(v)) return 64;
      return 1;
    });
  }
}
