/**
 * STATISTICAL ENGINE
 * 
 * Full Excel-compatible statistical functions.
 * Covers: descriptive stats, distributions, regression, ranking, etc.
 */

// ── helpers ─────────────────────────────────────────────────────────────────

function flatNums(...args: any[]): number[] {
  const result: number[] = [];
  for (const arg of args) {
    const arr = Array.isArray(arg) ? (arg as any[]).flat(Infinity) : [arg];
    for (const v of arr) {
      if (typeof v === 'number') result.push(v);
      else if (typeof v === 'string') { const n = parseFloat(v); if (!isNaN(n)) result.push(n); }
    }
  }
  return result;
}

function flatAll(...args: any[]): any[] {
  const result: any[] = [];
  for (const arg of args) {
    const arr = Array.isArray(arg) ? (arg as any[]).flat(Infinity) : [arg];
    for (const v of arr) {
      if (v !== null && v !== undefined && v !== '') result.push(v);
    }
  }
  return result;
}

const n = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const p = parseFloat(v);
  return isNaN(p) ? 0 : p;
};

// sample mean
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

// sample variance (ddof=1 default)
const variance = (xs: number[], ddof = 1) => {
  if (xs.length < ddof + 1) return 0;
  const m = mean(xs);
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - ddof);
};

// sample stdev
const stdev = (xs: number[], ddof = 1) => Math.sqrt(variance(xs, ddof));

// sort asc
const sortAsc = (xs: number[]) => [...xs].sort((a, b) => a - b);

// ── normal distribution helpers ──────────────────────────────────────────────

// Approx error function
function erf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x >= 0 ? 1 : -1;
  const t = 1 / (1 + p * Math.abs(x));
  const poly = (((a5 * t + a4) * t + a3) * t + a2) * t + a1;
  return sign * (1 - poly * t * Math.exp(-x * x));
}

function erfc(x: number): number { return 1 - erf(x); }

// Standard normal CDF
function normCDF(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

// Inverse normal CDF (rational approximation)
function normInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < 0.5) return -normInv(1 - p);
  const q = Math.sqrt(-2 * Math.log(p));
  const c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
  const d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
  return -(q - (c0 + c1 * q + c2 * q * q) / (1 + d1 * q + d2 * q * q + d3 * q * q * q));
}

// Standard normal PDF
function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// ── t-distribution helpers ───────────────────────────────────────────────────

// Regularised incomplete beta function via continued fraction
function betaInc(a: number, b: number, x: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;
  // Use Lentz's method
  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
  let C = 1, D = 1 - (a + b) * x / (a + 1);
  if (Math.abs(D) < 1e-30) D = 1e-30;
  D = 1 / D;
  let result = D;
  for (let m = 1; m <= 200; m++) {
    // even step
    let num = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    D = 1 + num * D; if (Math.abs(D) < 1e-30) D = 1e-30; D = 1 / D;
    C = 1 + num / C; if (Math.abs(C) < 1e-30) C = 1e-30;
    result *= C * D;
    // odd step
    num = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    D = 1 + num * D; if (Math.abs(D) < 1e-30) D = 1e-30; D = 1 / D;
    C = 1 + num / C; if (Math.abs(C) < 1e-30) C = 1e-30;
    const delta = C * D;
    result *= delta;
    if (Math.abs(delta - 1) < 1e-10) break;
  }
  return front * result;
}

function lgamma(x: number): number {
  // Lanczos approximation
  const g = 7;
  const c = [0.99999999999980993,676.5203681218851,-1259.1392167224028,
    771.32342877765313,-176.61502916214059,12.507343278686905,
    -0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x--;
  let ag = c[0];
  for (let i = 1; i < g + 2; i++) ag += c[i] / (x + i);
  const t = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(ag);
}

// t CDF (two-tailed = 2 * one-tail, one-tail toward zero)
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  const ib = betaInc(df / 2, 0.5, x);
  return t >= 0 ? 1 - ib / 2 : ib / 2;
}

// t distribution: probability of getting abs(t) or more extreme (two-tail)
function tDistTwoTail(t: number, df: number): number {
  return 2 * (1 - tCDF(Math.abs(t), df));
}

// Inverse t-distribution (two-tailed)
function tInv(p: number, df: number): number {
  // Newton's method
  let t = normInv(1 - p / 2);
  for (let i = 0; i < 100; i++) {
    const f = tDistTwoTail(t, df) - p;
    const pdf = 2 * Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + t * t / df));
    if (Math.abs(pdf) < 1e-15) break;
    const newT = t - f / (-pdf);
    if (Math.abs(newT - t) < 1e-10) return newT;
    t = newT;
  }
  return t;
}

// F distribution CDF
function fCDF(f: number, d1: number, d2: number): number {
  const x = d1 * f / (d1 * f + d2);
  return betaInc(d1 / 2, d2 / 2, x);
}

// Chi-squared CDF
function chiCDF(x: number, df: number): number {
  return gammaCDF(x / 2, df / 2);
}

// Gamma CDF (regularised lower incomplete gamma)
function gammaCDF(x: number, a: number): number {
  if (x < 0) return 0;
  // Series representation
  if (x < a + 1) {
    let term = 1 / a, sum = term;
    for (let i = 1; i < 500; i++) {
      term *= x / (a + i);
      sum += term;
      if (Math.abs(term) < sum * 1e-12) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  // Continued fraction
  let C = 1, D = x - a + 1;
  if (Math.abs(D) < 1e-30) D = 1e-30;
  D = 1 / D;
  let result = D;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - a);
    D = x + an * D; if (Math.abs(D) < 1e-30) D = 1e-30;
    C = x + an / C; if (Math.abs(C) < 1e-30) C = 1e-30;
    D = 1 / D;
    const delta = C * D;
    result *= delta;
    if (Math.abs(delta - 1) < 1e-12) break;
  }
  return 1 - result * Math.exp(-x + a * Math.log(x) - lgamma(a));
}

// Binomial CDF
function binomCDF(k: number, n: number, p: number): number {
  let cdf = 0;
  for (let i = 0; i <= k; i++) cdf += binomPMF(i, n, p);
  return cdf;
}

function binomPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  return Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

// Poisson PMF
function poissonPMF(k: number, lambda: number): number {
  return Math.exp(-lambda + k * Math.log(lambda) - lgamma(k + 1));
}

// Hypergeometric PMF
function hypergeomPMF(k: number, N: number, K: number, n: number): number {
  const logC = (a: number, b: number) => lgamma(a + 1) - lgamma(b + 1) - lgamma(a - b + 1);
  return Math.exp(logC(K, k) + logC(N - K, n - k) - logC(N, n));
}

// Negative binomial PMF
function negbinomPMF(k: number, r: number, p: number): number {
  return Math.exp(lgamma(k + r) - lgamma(k + 1) - lgamma(r) + r * Math.log(p) + k * Math.log(1 - p));
}

// Lognormal CDF
function lognormCDF(x: number, mu: number, sigma: number): number {
  if (x <= 0) return 0;
  return normCDF((Math.log(x) - mu) / sigma);
}

// Weibull CDF
function weibullCDF(x: number, alpha: number, beta: number): number {
  if (x < 0) return 0;
  return 1 - Math.exp(-Math.pow(x / beta, alpha));
}

// Beta distribution CDF
function betaCDF(x: number, alpha: number, beta: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return betaInc(alpha, beta, x);
}

// Exponential CDF
function exponCDF(x: number, lambda: number): number {
  if (x < 0) return 0;
  return 1 - Math.exp(-lambda * x);
}

// ── main class ───────────────────────────────────────────────────────────────

export class StatisticalEngine {
  public static registerFunctions(registry: any) {

    // ── DESCRIPTIVE ────────────────────────────────────────────────────────

    registry.register('STDEV', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length < 2 ? '#DIV/0!' : stdev(xs, 1);
    });
    registry.register('STDEV.S', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length < 2 ? '#DIV/0!' : stdev(xs, 1);
    });
    registry.register('STDEVP', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length === 0 ? '#DIV/0!' : stdev(xs, 0);
    });
    registry.register('STDEV.P', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length === 0 ? '#DIV/0!' : stdev(xs, 0);
    });
    registry.register('STDEVA', (...args: any[]) => {
      const xs: number[] = [];
      for (const arg of args) {
        const arr = Array.isArray(arg) ? (arg as any[]).flat(Infinity) : [arg];
        for (const v of arr) {
          if (v !== null && v !== undefined && v !== '') {
            if (typeof v === 'boolean') xs.push(v ? 1 : 0);
            else xs.push(parseFloat(v) || 0);
          }
        }
      }
      return xs.length < 2 ? '#DIV/0!' : stdev(xs, 1);
    });
    registry.register('STDEVPA', (...args: any[]) => {
      const xs: number[] = [];
      for (const arg of args) {
        const arr = Array.isArray(arg) ? (arg as any[]).flat(Infinity) : [arg];
        for (const v of arr) {
          if (v !== null && v !== undefined && v !== '') {
            if (typeof v === 'boolean') xs.push(v ? 1 : 0);
            else xs.push(parseFloat(v) || 0);
          }
        }
      }
      return xs.length === 0 ? '#DIV/0!' : stdev(xs, 0);
    });

    registry.register('VAR', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length < 2 ? '#DIV/0!' : variance(xs, 1);
    });
    registry.register('VAR.S', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length < 2 ? '#DIV/0!' : variance(xs, 1);
    });
    registry.register('VARP', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length === 0 ? '#DIV/0!' : variance(xs, 0);
    });
    registry.register('VAR.P', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length === 0 ? '#DIV/0!' : variance(xs, 0);
    });
    registry.register('VARA', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length < 2 ? '#DIV/0!' : variance(xs, 1);
    });
    registry.register('VARPA', (...args: any[]) => {
      const xs = flatNums(...args);
      return xs.length === 0 ? '#DIV/0!' : variance(xs, 0);
    });

    registry.register('MEDIAN', (...args: any[]) => {
      const xs = sortAsc(flatNums(...args));
      if (xs.length === 0) return '#NUM!';
      const mid = Math.floor(xs.length / 2);
      return xs.length % 2 === 0 ? (xs[mid - 1] + xs[mid]) / 2 : xs[mid];
    });

    registry.register('MODE', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.length === 0) return '#N/A';
      const freq = new Map<number, number>();
      let maxF = 0, mode = xs[0];
      for (const v of xs) {
        const f = (freq.get(v) ?? 0) + 1;
        freq.set(v, f);
        if (f > maxF) { maxF = f; mode = v; }
      }
      return maxF === 1 ? '#N/A' : mode;
    });
    registry.register('MODE.SNGL', (...args: any[]) => registry.getFunction('MODE')(...args));

    registry.register('MODE.MULT', (...args: any[]) => {
      const xs = flatNums(...args);
      const freq = new Map<number, number>();
      let maxF = 0;
      for (const v of xs) { const f = (freq.get(v) ?? 0) + 1; freq.set(v, f); if (f > maxF) maxF = f; }
      const modes = [...freq.entries()].filter(([, f]) => f === maxF).map(([v]) => v).sort((a, b) => a - b);
      return modes.length === 0 ? '#N/A' : modes.length === 1 ? modes[0] : [modes];
    });

    // SKEW: sample skewness
    registry.register('SKEW', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.length < 3) return '#DIV/0!';
      const m = mean(xs), s = stdev(xs, 1);
      if (s === 0) return '#DIV/0!';
      const k = xs.length;
      const sum3 = xs.reduce((a, v) => a + ((v - m) / s) ** 3, 0);
      return (k / ((k - 1) * (k - 2))) * sum3;
    });

    registry.register('SKEW.P', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.length < 3) return '#DIV/0!';
      const m = mean(xs), s = stdev(xs, 0);
      if (s === 0) return '#DIV/0!';
      const k = xs.length;
      return xs.reduce((a, v) => a + ((v - m) / s) ** 3, 0) / k;
    });

    // KURT: excess kurtosis
    registry.register('KURT', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.length < 4) return '#DIV/0!';
      const m = mean(xs), s = stdev(xs, 1), k = xs.length;
      if (s === 0) return '#DIV/0!';
      const sum4 = xs.reduce((a, v) => a + ((v - m) / s) ** 4, 0);
      return (k * (k + 1)) / ((k - 1) * (k - 2) * (k - 3)) * sum4 - 3 * (k - 1) ** 2 / ((k - 2) * (k - 3));
    });

    // GEOMEAN
    registry.register('GEOMEAN', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.some(v => v <= 0)) return '#NUM!';
      return Math.exp(xs.reduce((a, v) => a + Math.log(v), 0) / xs.length);
    });

    // HARMEAN
    registry.register('HARMEAN', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.some(v => v <= 0)) return '#NUM!';
      return xs.length / xs.reduce((a, v) => a + 1 / v, 0);
    });

    // DEVSQ: sum of squares of deviations from mean
    registry.register('DEVSQ', (...args: any[]) => {
      const xs = flatNums(...args);
      const m = mean(xs);
      return xs.reduce((a, v) => a + (v - m) ** 2, 0);
    });

    // AVEDEV: average absolute deviation
    registry.register('AVEDEV', (...args: any[]) => {
      const xs = flatNums(...args);
      if (xs.length === 0) return '#NUM!';
      const m = mean(xs);
      return xs.reduce((a, v) => a + Math.abs(v - m), 0) / xs.length;
    });

    // COVARIANCE
    registry.register('COVAR', (array1: any, array2: any) => {
      const xs = flatNums(array1), ys = flatNums(array2);
      if (xs.length !== ys.length || xs.length === 0) return '#N/A';
      const mx = mean(xs), my = mean(ys);
      return xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.length;
    });
    registry.register('COVARIANCE.P', (array1: any, array2: any) => registry.getFunction('COVAR')(array1, array2));
    registry.register('COVARIANCE.S', (array1: any, array2: any) => {
      const xs = flatNums(array1), ys = flatNums(array2);
      if (xs.length !== ys.length || xs.length < 2) return '#N/A';
      const mx = mean(xs), my = mean(ys);
      return xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / (xs.length - 1);
    });

    // CORREL / PEARSON
    registry.register('CORREL', (array1: any, array2: any) => {
      const xs = flatNums(array1), ys = flatNums(array2);
      if (xs.length !== ys.length || xs.length < 2) return '#N/A';
      const mx = mean(xs), my = mean(ys);
      const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
      const den = Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0) * ys.reduce((a, y) => a + (y - my) ** 2, 0));
      return den === 0 ? '#DIV/0!' : num / den;
    });
    registry.register('PEARSON', (array1: any, array2: any) => registry.getFunction('CORREL')(array1, array2));

    // RSQ: coefficient of determination
    registry.register('RSQ', (known_y: any, known_x: any) => {
      const r = registry.getFunction('CORREL')(known_y, known_x);
      return typeof r === 'number' ? r * r : r;
    });

    // ── RANKING ─────────────────────────────────────────────────────────────

    registry.register('RANK', (number: any, ref: any, order: any = 0) => {
      const v = parseFloat(number);
      const xs = flatNums(ref);
      const sorted = sortAsc(xs);
      const idx = order ? sorted.indexOf(v) : sorted.reverse().indexOf(v);
      return idx === -1 ? '#N/A' : idx + 1;
    });
    registry.register('RANK.EQ', (number: any, ref: any, order: any = 0) => registry.getFunction('RANK')(number, ref, order));
    registry.register('RANK.AVG', (number: any, ref: any, order: any = 0) => {
      const v = parseFloat(number);
      const xs = flatNums(ref);
      const sorted = order ? sortAsc(xs) : sortAsc(xs).reverse();
      const ties = sorted.reduce((acc: number[], x, i) => { if (x === v) acc.push(i + 1); return acc; }, []);
      if (ties.length === 0) return '#N/A';
      return mean(ties);
    });

    // PERCENTRANK
    registry.register('PERCENTRANK', (array: any, x: any, significance: any = 3) => {
      const xs = sortAsc(flatNums(array));
      const v = parseFloat(x), sig = Math.floor(parseFloat(significance)) || 3;
      if (xs.length === 0) return '#NUM!';
      const below = xs.filter(val => val < v).length;
      const equal = xs.filter(val => val === v).length;
      if (equal === 0) return '#N/A';
      const pct = below / (xs.length - 1);
      const factor = Math.pow(10, sig);
      return Math.floor(pct * factor) / factor;
    });
    registry.register('PERCENTRANK.INC', (array: any, x: any, significance: any = 3) => registry.getFunction('PERCENTRANK')(array, x, significance));
    registry.register('PERCENTRANK.EXC', (array: any, x: any, significance: any = 3) => {
      const xs = sortAsc(flatNums(array));
      const v = parseFloat(x), sig = Math.floor(parseFloat(significance)) || 3;
      const rank = xs.indexOf(v);
      if (rank === -1) return '#N/A';
      const pct = (rank + 1) / (xs.length + 1);
      const factor = Math.pow(10, sig);
      return Math.floor(pct * factor) / factor;
    });

    // PERCENTILE
    registry.register('PERCENTILE', (array: any, k: any) => {
      const xs = sortAsc(flatNums(array));
      const p = parseFloat(k);
      if (p < 0 || p > 1) return '#NUM!';
      const pos = p * (xs.length - 1);
      const low = Math.floor(pos);
      return xs[low] + (pos - low) * (xs[Math.min(low + 1, xs.length - 1)] - xs[low]);
    });
    registry.register('PERCENTILE.INC', (array: any, k: any) => registry.getFunction('PERCENTILE')(array, k));
    registry.register('PERCENTILE.EXC', (array: any, k: any) => {
      const xs = sortAsc(flatNums(array));
      const p = parseFloat(k);
      if (p <= 0 || p >= 1) return '#NUM!';
      const pos = p * (xs.length + 1) - 1;
      const low = Math.floor(pos);
      return xs[low] + (pos - low) * ((xs[low + 1] ?? xs[low]) - xs[low]);
    });

    // QUARTILE
    registry.register('QUARTILE', (array: any, quart: any) => {
      const q = Math.floor(parseFloat(quart));
      if (q < 0 || q > 4) return '#NUM!';
      const pFn = registry.getFunction('PERCENTILE');
      return pFn(array, q / 4);
    });
    registry.register('QUARTILE.INC', (array: any, quart: any) => registry.getFunction('QUARTILE')(array, quart));
    registry.register('QUARTILE.EXC', (array: any, quart: any) => {
      const q = Math.floor(parseFloat(quart));
      if (q < 1 || q > 3) return '#NUM!';
      return registry.getFunction('PERCENTILE.EXC')(array, q / 4);
    });

    // LARGE / SMALL
    registry.register('LARGE', (array: any, k: any) => {
      const xs = sortAsc(flatNums(array)).reverse();
      const ki = Math.floor(parseFloat(k));
      if (ki < 1 || ki > xs.length) return '#NUM!';
      return xs[ki - 1];
    });
    registry.register('SMALL', (array: any, k: any) => {
      const xs = sortAsc(flatNums(array));
      const ki = Math.floor(parseFloat(k));
      if (ki < 1 || ki > xs.length) return '#NUM!';
      return xs[ki - 1];
    });

    // ── REGRESSION / TRENDLINE ───────────────────────────────────────────────

    // SLOPE / INTERCEPT: simple linear regression y = a + b*x
    registry.register('SLOPE', (known_y: any, known_x: any) => {
      const ys = flatNums(known_y), xs = flatNums(known_x);
      if (ys.length !== xs.length || xs.length < 2) return '#N/A';
      const mx = mean(xs), my = mean(ys);
      const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
      const den = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
      return den === 0 ? '#DIV/0!' : num / den;
    });
    registry.register('INTERCEPT', (known_y: any, known_x: any) => {
      const slope = registry.getFunction('SLOPE')(known_y, known_x);
      if (typeof slope !== 'number') return slope;
      return mean(flatNums(known_y)) - slope * mean(flatNums(known_x));
    });

    // FORECAST
    registry.register('FORECAST', (x: any, known_y: any, known_x: any) => {
      const xv = parseFloat(x);
      const slope = registry.getFunction('SLOPE')(known_y, known_x);
      const intercept = registry.getFunction('INTERCEPT')(known_y, known_x);
      if (typeof slope !== 'number' || typeof intercept !== 'number') return '#N/A';
      return intercept + slope * xv;
    });
    registry.register('FORECAST.LINEAR', (x: any, known_y: any, known_x: any) =>
      registry.getFunction('FORECAST')(x, known_y, known_x));

    // TREND: returns array of fitted values
    registry.register('TREND', (known_y: any, known_x: any = null, new_x: any = null) => {
      const ys = flatNums(known_y);
      const xs = known_x ? flatNums(known_x) : Array.from({ length: ys.length }, (_, i) => i + 1);
      const nxs = new_x ? flatNums(new_x) : xs;
      const slope = registry.getFunction('SLOPE')(ys, xs);
      const intercept = registry.getFunction('INTERCEPT')(ys, xs);
      if (typeof slope !== 'number') return slope;
      return nxs.map(x => intercept + slope * x);
    });

    // LINEST: {slope, intercept, se_slope, se_intercept, r2, se_y, F, df, SSreg, SSres}
    registry.register('LINEST', (known_y: any, known_x: any = null, _const: any = true, stats: any = false) => {
      const ys = flatNums(known_y);
      const xs = known_x ? flatNums(known_x) : Array.from({ length: ys.length }, (_, i) => i + 1);
      const slope = registry.getFunction('SLOPE')(ys, xs);
      const intercept = registry.getFunction('INTERCEPT')(ys, xs);
      if (!stats) return [[slope, intercept]];
      const predicted = xs.map(x => intercept + slope * x);
      const my = mean(ys);
      const SSres = ys.reduce((a, y, i) => a + (y - predicted[i]) ** 2, 0);
      const SStot = ys.reduce((a, y) => a + (y - my) ** 2, 0);
      const r2 = SStot === 0 ? 0 : 1 - SSres / SStot;
      const n = ys.length, df = n - 2;
      const se_y = df > 0 ? Math.sqrt(SSres / df) : 0;
      const Sxx = xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0);
      const se_slope = Sxx === 0 ? 0 : se_y / Math.sqrt(Sxx);
      const se_intercept = Sxx === 0 ? 0 : se_y * Math.sqrt(xs.reduce((a, x) => a + x * x, 0) / (n * Sxx));
      const SSreg = SStot - SSres;
      const F = SSres === 0 ? 0 : (SSreg / 1) / (SSres / df);
      return [[slope, intercept], [se_slope, se_intercept], [r2, se_y], [F, df], [SSreg, SSres]];
    });

    // GROWTH: returns array of predicted exponential values
    registry.register('GROWTH', (known_y: any, known_x: any = null, new_x: any = null) => {
      const ys = flatNums(known_y).map(y => Math.log(y));
      const xs = known_x ? flatNums(known_x) : Array.from({ length: ys.length }, (_, i) => i + 1);
      const nxs = new_x ? flatNums(new_x) : xs;
      const slope = registry.getFunction('SLOPE')(ys, xs);
      const intercept = registry.getFunction('INTERCEPT')(ys, xs);
      if (typeof slope !== 'number') return slope;
      return nxs.map(x => Math.exp(intercept + slope * x));
    });

    // LOGEST: exponential regression
    registry.register('LOGEST', (known_y: any, known_x: any = null, _const: any = true, stats: any = false) => {
      const ys = flatNums(known_y);
      const logy = ys.map(y => (y > 0 ? Math.log(y) : NaN));
      return registry.getFunction('LINEST')(logy, known_x, _const, stats);
    });

    // STEYX: standard error of predicted y
    registry.register('STEYX', (known_y: any, known_x: any) => {
      const ys = flatNums(known_y), xs = flatNums(known_x);
      if (ys.length !== xs.length || ys.length < 3) return '#N/A';
      const slope = registry.getFunction('SLOPE')(ys, xs);
      const intercept = registry.getFunction('INTERCEPT')(ys, xs);
      const SSres = ys.reduce((a, y, i) => a + (y - (intercept + slope * xs[i])) ** 2, 0);
      return Math.sqrt(SSres / (ys.length - 2));
    });

    // ── HYPOTHESIS TESTING ───────────────────────────────────────────────────

    // TTEST / T.TEST
    registry.register('TTEST', (array1: any, array2: any, tails: any = 2, type: any = 1) => {
      const xs = flatNums(array1), ys = flatNums(array2);
      const t2 = Math.floor(parseFloat(tails));
      const ty = Math.floor(parseFloat(type));
      if (xs.length < 2 || ys.length < 2) return '#N/A';
      let t: number, df: number;
      if (ty === 1) {
        // Paired
        if (xs.length !== ys.length) return '#N/A';
        const diffs = xs.map((x, i) => x - ys[i]);
        const md = mean(diffs), sd = stdev(diffs, 1);
        t = md / (sd / Math.sqrt(diffs.length));
        df = diffs.length - 1;
      } else if (ty === 2) {
        // Two-sample equal variance
        const sp = Math.sqrt(((xs.length - 1) * variance(xs, 1) + (ys.length - 1) * variance(ys, 1)) / (xs.length + ys.length - 2));
        t = (mean(xs) - mean(ys)) / (sp * Math.sqrt(1 / xs.length + 1 / ys.length));
        df = xs.length + ys.length - 2;
      } else {
        // Two-sample unequal variance (Welch)
        const s1 = variance(xs, 1) / xs.length, s2 = variance(ys, 1) / ys.length;
        t = (mean(xs) - mean(ys)) / Math.sqrt(s1 + s2);
        df = (s1 + s2) ** 2 / (s1 * s1 / (xs.length - 1) + s2 * s2 / (ys.length - 1));
      }
      const pval = tDistTwoTail(t, df);
      return t2 === 1 ? pval / 2 : pval;
    });
    registry.register('T.TEST', (a1: any, a2: any, tails: any, type: any) => registry.getFunction('TTEST')(a1, a2, tails, type));

    // FTEST / F.TEST
    registry.register('FTEST', (array1: any, array2: any) => {
      const xs = flatNums(array1), ys = flatNums(array2);
      if (xs.length < 2 || ys.length < 2) return '#N/A';
      const f = variance(xs, 1) / variance(ys, 1);
      const d1 = xs.length - 1, d2 = ys.length - 1;
      const p = fCDF(f, d1, d2);
      return 2 * Math.min(p, 1 - p);
    });
    registry.register('F.TEST', (a1: any, a2: any) => registry.getFunction('FTEST')(a1, a2));

    // CHITEST / CHISQ.TEST
    registry.register('CHITEST', (actual_range: any, expected_range: any) => {
      const act = flatNums(actual_range), exp = flatNums(expected_range);
      if (act.length !== exp.length) return '#N/A';
      const chi2 = act.reduce((a, o, i) => a + (o - exp[i]) ** 2 / exp[i], 0);
      const df = act.length - 1;
      return 1 - chiCDF(chi2, df);
    });
    registry.register('CHISQ.TEST', (a: any, e: any) => registry.getFunction('CHITEST')(a, e));

    // ZTEST / Z.TEST
    registry.register('ZTEST', (array: any, x: any, sigma: any = null) => {
      const xs = flatNums(array), v = parseFloat(x);
      if (xs.length === 0) return '#N/A';
      const s = sigma !== null ? parseFloat(sigma) : stdev(xs, 1);
      const z = (mean(xs) - v) / (s / Math.sqrt(xs.length));
      return 1 - normCDF(z);
    });
    registry.register('Z.TEST', (a: any, x: any, s: any = null) => registry.getFunction('ZTEST')(a, x, s));

    // ── DISTRIBUTIONS ────────────────────────────────────────────────────────

    // Normal distribution
    registry.register('NORM.DIST', (x: any, mu: any, sigma: any, cumulative: any) => {
      const xv = parseFloat(x), m = parseFloat(mu), s = parseFloat(sigma);
      if (s <= 0) return '#NUM!';
      if (cumulative) return normCDF((xv - m) / s);
      return normPDF((xv - m) / s) / s;
    });
    registry.register('NORMDIST', (x: any, mu: any, sigma: any, cumulative: any) =>
      registry.getFunction('NORM.DIST')(x, mu, sigma, cumulative));

    registry.register('NORM.INV', (probability: any, mu: any, sigma: any) => {
      const p = parseFloat(probability), m = parseFloat(mu), s = parseFloat(sigma);
      if (p <= 0 || p >= 1 || s <= 0) return '#NUM!';
      return m + s * normInv(p);
    });
    registry.register('NORMINV', (p: any, mu: any, sigma: any) => registry.getFunction('NORM.INV')(p, mu, sigma));

    // Standard normal
    registry.register('NORM.S.DIST', (z: any, cumulative: any) => {
      const v = parseFloat(z);
      return cumulative ? normCDF(v) : normPDF(v);
    });
    registry.register('NORMSDIST', (z: any) => normCDF(parseFloat(z)));
    registry.register('NORM.S.INV', (probability: any) => {
      const p = parseFloat(probability);
      if (p <= 0 || p >= 1) return '#NUM!';
      return normInv(p);
    });
    registry.register('NORMSINV', (p: any) => registry.getFunction('NORM.S.INV')(p));

    // Standard error
    registry.register('STANDARDIZE', (x: any, mu: any, sigma: any) => {
      const s = parseFloat(sigma);
      if (s <= 0) return '#NUM!';
      return (parseFloat(x) - parseFloat(mu)) / s;
    });

    // t distribution
    registry.register('T.DIST', (x: any, deg_freedom: any, cumulative: any) => {
      const xv = parseFloat(x), df = parseFloat(deg_freedom);
      if (df < 1) return '#NUM!';
      if (cumulative) return tCDF(xv, df);
      return Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + xv * xv / df));
    });
    registry.register('T.DIST.2T', (x: any, deg_freedom: any) => {
      const xv = parseFloat(x), df = parseFloat(deg_freedom);
      if (df < 1 || xv < 0) return '#NUM!';
      return tDistTwoTail(xv, df);
    });
    registry.register('T.DIST.RT', (x: any, deg_freedom: any) => {
      const xv = parseFloat(x), df = parseFloat(deg_freedom);
      return 1 - tCDF(xv, df);
    });
    registry.register('TDIST', (x: any, deg_freedom: any, tails: any) => {
      const xv = Math.abs(parseFloat(x)), df = parseFloat(deg_freedom), t = parseFloat(tails);
      const p = tDistTwoTail(xv, df);
      return t === 1 ? p / 2 : p;
    });
    registry.register('T.INV', (probability: any, deg_freedom: any) => {
      const p = parseFloat(probability), df = parseFloat(deg_freedom);
      if (p <= 0 || p >= 1 || df < 1) return '#NUM!';
      // One-tailed: p is the left-tail probability
      return tInv(2 * (1 - p), df) * (p < 0.5 ? -1 : 1);
    });
    registry.register('T.INV.2T', (probability: any, deg_freedom: any) => {
      const p = parseFloat(probability), df = parseFloat(deg_freedom);
      if (p <= 0 || p > 1 || df < 1) return '#NUM!';
      return tInv(p, df);
    });
    registry.register('TINV', (probability: any, deg_freedom: any) =>
      registry.getFunction('T.INV.2T')(probability, deg_freedom));

    // F distribution
    registry.register('F.DIST', (x: any, d1: any, d2: any, cumulative: any) => {
      const xv = parseFloat(x), d1v = parseFloat(d1), d2v = parseFloat(d2);
      if (xv < 0 || d1v < 1 || d2v < 1) return '#NUM!';
      if (cumulative) return fCDF(xv, d1v, d2v);
      const lbeta = lgamma(d1v / 2) + lgamma(d2v / 2) - lgamma((d1v + d2v) / 2);
      return Math.exp((d1v / 2 - 1) * Math.log(xv) + (d1v / 2) * Math.log(d1v) + (d2v / 2) * Math.log(d2v) - ((d1v + d2v) / 2) * Math.log(d1v * xv + d2v) - lbeta);
    });
    registry.register('F.DIST.RT', (x: any, d1: any, d2: any) => {
      const xv = parseFloat(x), d1v = parseFloat(d1), d2v = parseFloat(d2);
      return 1 - fCDF(xv, d1v, d2v);
    });
    registry.register('FDIST', (x: any, d1: any, d2: any) => registry.getFunction('F.DIST.RT')(x, d1, d2));
    registry.register('F.INV', (probability: any, d1: any, d2: any) => {
      const p = parseFloat(probability), d1v = parseFloat(d1), d2v = parseFloat(d2);
      if (p <= 0 || p >= 1) return '#NUM!';
      let f = 1;
      for (let i = 0; i < 100; i++) {
        const fp = fCDF(f, d1v, d2v) - p;
        const pdf = registry.getFunction('F.DIST')(f, d1v, d2v, false);
        if (Math.abs(pdf) < 1e-15) break;
        const nf = f - fp / pdf;
        if (Math.abs(nf - f) < 1e-10) return nf;
        f = Math.max(nf, 1e-10);
      }
      return f;
    });
    registry.register('F.INV.RT', (probability: any, d1: any, d2: any) =>
      registry.getFunction('F.INV')(1 - parseFloat(probability), d1, d2));
    registry.register('FINV', (probability: any, d1: any, d2: any) =>
      registry.getFunction('F.INV.RT')(probability, d1, d2));

    // Chi-squared distribution
    registry.register('CHISQ.DIST', (x: any, deg_freedom: any, cumulative: any) => {
      const xv = parseFloat(x), df = parseFloat(deg_freedom);
      if (xv < 0 || df < 1) return '#NUM!';
      if (cumulative) return chiCDF(xv, df);
      return Math.exp((df / 2 - 1) * Math.log(xv) - xv / 2 - (df / 2) * Math.log(2) - lgamma(df / 2));
    });
    registry.register('CHISQ.DIST.RT', (x: any, deg_freedom: any) => 1 - chiCDF(parseFloat(x), parseFloat(deg_freedom)));
    registry.register('CHIDIST', (x: any, df: any) => registry.getFunction('CHISQ.DIST.RT')(x, df));
    registry.register('CHISQ.INV', (probability: any, deg_freedom: any) => {
      const p = parseFloat(probability), df = parseFloat(deg_freedom);
      if (p < 0 || p > 1 || df < 1) return '#NUM!';
      let x = df;
      for (let i = 0; i < 200; i++) {
        const fp = chiCDF(x, df) - p;
        const pdf = registry.getFunction('CHISQ.DIST')(x, df, false);
        if (Math.abs(pdf) < 1e-15) break;
        const nx = x - fp / pdf;
        if (Math.abs(nx - x) < 1e-10) return nx;
        x = Math.max(nx, 1e-10);
      }
      return x;
    });
    registry.register('CHISQ.INV.RT', (probability: any, df: any) =>
      registry.getFunction('CHISQ.INV')(1 - parseFloat(probability), df));
    registry.register('CHIINV', (p: any, df: any) => registry.getFunction('CHISQ.INV.RT')(p, df));

    // Binomial distribution
    registry.register('BINOM.DIST', (number_s: any, trials: any, probability_s: any, cumulative: any) => {
      const k = Math.floor(parseFloat(number_s)), nv = Math.floor(parseFloat(trials)), p = parseFloat(probability_s);
      if (k < 0 || nv < 0 || p < 0 || p > 1 || k > nv) return '#NUM!';
      return cumulative ? binomCDF(k, nv, p) : binomPMF(k, nv, p);
    });
    registry.register('BINOMDIST', (k: any, n: any, p: any, cum: any) => registry.getFunction('BINOM.DIST')(k, n, p, cum));
    registry.register('BINOM.DIST.RANGE', (trials: any, probability_s: any, number_s: any, number_s2: any = null) => {
      const nv = Math.floor(parseFloat(trials)), p = parseFloat(probability_s);
      const lo = Math.floor(parseFloat(number_s));
      const hi = number_s2 !== null ? Math.floor(parseFloat(number_s2)) : lo;
      let sum = 0;
      for (let k = lo; k <= hi; k++) sum += binomPMF(k, nv, p);
      return sum;
    });
    registry.register('BINOM.INV', (trials: any, probability_s: any, alpha: any) => {
      const nv = Math.floor(parseFloat(trials)), p = parseFloat(probability_s), a = parseFloat(alpha);
      let cdf = 0;
      for (let k = 0; k <= nv; k++) {
        cdf += binomPMF(k, nv, p);
        if (cdf >= a) return k;
      }
      return nv;
    });
    registry.register('CRITBINOM', (n: any, p: any, a: any) => registry.getFunction('BINOM.INV')(n, p, a));

    // Poisson distribution
    registry.register('POISSON.DIST', (x: any, mean_: any, cumulative: any) => {
      const k = Math.floor(parseFloat(x)), lam = parseFloat(mean_);
      if (k < 0 || lam < 0) return '#NUM!';
      if (cumulative) {
        let cdf = 0;
        for (let i = 0; i <= k; i++) cdf += poissonPMF(i, lam);
        return cdf;
      }
      return poissonPMF(k, lam);
    });
    registry.register('POISSON', (x: any, mu: any, cum: any) => registry.getFunction('POISSON.DIST')(x, mu, cum));

    // Hypergeometric distribution
    registry.register('HYPGEOM.DIST', (sample_s: any, number_sample: any, population_s: any, number_pop: any, cumulative: any) => {
      const k = Math.floor(parseFloat(sample_s));
      const n = Math.floor(parseFloat(number_sample));
      const K = Math.floor(parseFloat(population_s));
      const N = Math.floor(parseFloat(number_pop));
      if (cumulative) {
        let cdf = 0;
        for (let i = 0; i <= k; i++) cdf += hypergeomPMF(i, N, K, n);
        return cdf;
      }
      return hypergeomPMF(k, N, K, n);
    });
    registry.register('HYPGEOMDIST', (s: any, ns: any, ps: any, np: any) => registry.getFunction('HYPGEOM.DIST')(s, ns, ps, np, false));

    // Negative binomial
    registry.register('NEGBINOM.DIST', (number_f: any, number_s: any, probability_s: any, cumulative: any) => {
      const k = Math.floor(parseFloat(number_f)), r = Math.floor(parseFloat(number_s)), p = parseFloat(probability_s);
      if (k < 0 || r < 1 || p < 0 || p > 1) return '#NUM!';
      if (cumulative) {
        let cdf = 0;
        for (let i = 0; i <= k; i++) cdf += negbinomPMF(i, r, p);
        return cdf;
      }
      return negbinomPMF(k, r, p);
    });
    registry.register('NEGBINOMDIST', (f: any, s: any, p: any) => registry.getFunction('NEGBINOM.DIST')(f, s, p, false));

    // Lognormal distribution
    registry.register('LOGNORM.DIST', (x: any, mu: any, sigma: any, cumulative: any) => {
      const xv = parseFloat(x), m = parseFloat(mu), s = parseFloat(sigma);
      if (xv <= 0 || s <= 0) return '#NUM!';
      if (cumulative) return lognormCDF(xv, m, s);
      return Math.exp(-((Math.log(xv) - m) ** 2) / (2 * s * s)) / (xv * s * Math.sqrt(2 * Math.PI));
    });
    registry.register('LOGNORMDIST', (x: any, mu: any, s: any) => registry.getFunction('LOGNORM.DIST')(x, mu, s, true));
    registry.register('LOGNORM.INV', (probability: any, mu: any, sigma: any) => {
      const p = parseFloat(probability), m = parseFloat(mu), s = parseFloat(sigma);
      if (p <= 0 || p >= 1 || s <= 0) return '#NUM!';
      return Math.exp(m + s * normInv(p));
    });
    registry.register('LOGINV', (p: any, mu: any, s: any) => registry.getFunction('LOGNORM.INV')(p, mu, s));

    // Exponential distribution
    registry.register('EXPON.DIST', (x: any, lambda: any, cumulative: any) => {
      const xv = parseFloat(x), lam = parseFloat(lambda);
      if (xv < 0 || lam <= 0) return '#NUM!';
      return cumulative ? exponCDF(xv, lam) : lam * Math.exp(-lam * xv);
    });
    registry.register('EXPONDIST', (x: any, lam: any, cum: any) => registry.getFunction('EXPON.DIST')(x, lam, cum));

    // Weibull distribution
    registry.register('WEIBULL.DIST', (x: any, alpha: any, beta: any, cumulative: any) => {
      const xv = parseFloat(x), a = parseFloat(alpha), b = parseFloat(beta);
      if (xv < 0 || a <= 0 || b <= 0) return '#NUM!';
      if (cumulative) return weibullCDF(xv, a, b);
      return (a / b) * Math.pow(xv / b, a - 1) * Math.exp(-Math.pow(xv / b, a));
    });
    registry.register('WEIBULL', (x: any, a: any, b: any, cum: any) => registry.getFunction('WEIBULL.DIST')(x, a, b, cum));

    // Beta distribution
    registry.register('BETA.DIST', (x: any, alpha: any, beta: any, cumulative: any, A: any = 0, B: any = 1) => {
      const xv = parseFloat(x), a = parseFloat(alpha), b = parseFloat(beta);
      const lo = parseFloat(A), hi = parseFloat(B);
      if (xv < lo || xv > hi || a <= 0 || b <= 0) return '#NUM!';
      const xn = (xv - lo) / (hi - lo);
      if (cumulative) return betaCDF(xn, a, b);
      return Math.exp((a - 1) * Math.log(xn) + (b - 1) * Math.log(1 - xn) - lgamma(a) - lgamma(b) + lgamma(a + b)) / (hi - lo);
    });
    registry.register('BETADIST', (x: any, a: any, b: any, A: any = 0, B: any = 1) =>
      registry.getFunction('BETA.DIST')(x, a, b, true, A, B));
    registry.register('BETA.INV', (probability: any, alpha: any, beta_: any, A: any = 0, B: any = 1) => {
      const p = parseFloat(probability), a = parseFloat(alpha), b = parseFloat(beta_);
      const lo = parseFloat(A), hi = parseFloat(B);
      if (p < 0 || p > 1 || a <= 0 || b <= 0) return '#NUM!';
      let x = 0.5;
      for (let i = 0; i < 200; i++) {
        const fp = betaCDF(x, a, b) - p;
        const pdf = Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lgamma(a) - lgamma(b) + lgamma(a + b));
        if (Math.abs(pdf) < 1e-15) break;
        const nx = x - fp / pdf;
        if (Math.abs(nx - x) < 1e-10) return lo + nx * (hi - lo);
        x = Math.max(0.0001, Math.min(0.9999, nx));
      }
      return lo + x * (hi - lo);
    });
    registry.register('BETAINV', (p: any, a: any, b: any, A: any = 0, B: any = 1) =>
      registry.getFunction('BETA.INV')(p, a, b, A, B));

    // Gamma distribution
    registry.register('GAMMA.DIST', (x: any, alpha: any, beta: any, cumulative: any) => {
      const xv = parseFloat(x), a = parseFloat(alpha), b = parseFloat(beta);
      if (xv < 0 || a <= 0 || b <= 0) return '#NUM!';
      if (cumulative) return gammaCDF(xv / b, a);
      return Math.exp((a - 1) * Math.log(xv) - xv / b - lgamma(a) - a * Math.log(b));
    });
    registry.register('GAMMADIST', (x: any, a: any, b: any, cum: any) => registry.getFunction('GAMMA.DIST')(x, a, b, cum));
    registry.register('GAMMA.INV', (probability: any, alpha: any, beta: any) => {
      const p = parseFloat(probability), a = parseFloat(alpha), b = parseFloat(beta);
      if (p < 0 || p > 1 || a <= 0 || b <= 0) return '#NUM!';
      let x = a * b;
      for (let i = 0; i < 200; i++) {
        const fp = gammaCDF(x / b, a) - p;
        const pdf = registry.getFunction('GAMMA.DIST')(x, a, b, false);
        if (Math.abs(pdf) < 1e-15) break;
        const nx = x - fp / pdf;
        if (Math.abs(nx - x) < 1e-10) return nx;
        x = Math.max(nx, 1e-10);
      }
      return x;
    });
    registry.register('GAMMAINV', (p: any, a: any, b: any) => registry.getFunction('GAMMA.INV')(p, a, b));
    registry.register('GAMMALN', (x: any) => {
      const v = parseFloat(x);
      if (v <= 0) return '#NUM!';
      return lgamma(v);
    });
    registry.register('GAMMALN.PRECISE', (x: any) => registry.getFunction('GAMMALN')(x));
    registry.register('GAMMA', (x: any) => {
      const v = parseFloat(x);
      return Math.exp(lgamma(v));
    });

    // ── CONFIDENCE INTERVALS ─────────────────────────────────────────────────

    registry.register('CONFIDENCE', (alpha: any, standard_dev: any, size: any) => {
      const a = parseFloat(alpha), s = parseFloat(standard_dev), n = parseFloat(size);
      if (a <= 0 || a >= 1 || s <= 0 || n < 1) return '#NUM!';
      return normInv(1 - a / 2) * s / Math.sqrt(n);
    });
    registry.register('CONFIDENCE.NORM', (a: any, s: any, n: any) => registry.getFunction('CONFIDENCE')(a, s, n));
    registry.register('CONFIDENCE.T', (alpha: any, standard_dev: any, size: any) => {
      const a = parseFloat(alpha), s = parseFloat(standard_dev), n = parseFloat(size);
      if (a <= 0 || a >= 1 || s <= 0 || n < 2) return '#NUM!';
      return tInv(a, n - 1) * s / Math.sqrt(n);
    });

    // ── MISC ─────────────────────────────────────────────────────────────────

    // FISHER / FISHERINV
    registry.register('FISHER', (x: any) => {
      const v = parseFloat(x);
      if (Math.abs(v) >= 1) return '#NUM!';
      return 0.5 * Math.log((1 + v) / (1 - v));
    });
    registry.register('FISHERINV', (y: any) => {
      const v = parseFloat(y);
      return (Math.exp(2 * v) - 1) / (Math.exp(2 * v) + 1);
    });

    // FREQUENCY: histogram
    registry.register('FREQUENCY', (data_array: any, bins_array: any) => {
      const data = sortAsc(flatNums(data_array));
      const bins = sortAsc(flatNums(bins_array));
      const result = new Array(bins.length + 1).fill(0);
      for (const v of data) {
        let placed = false;
        for (let i = 0; i < bins.length; i++) {
          if (v <= bins[i]) { result[i]++; placed = true; break; }
        }
        if (!placed) result[bins.length]++;
      }
      return [result];
    });

    // COUNTIFS: multiple criteria
    registry.register('COUNTIFS', (...args: any[]) => {
      if (args.length % 2 !== 0) return '#VALUE!';
      const pairs: [any[], string][] = [];
      for (let i = 0; i < args.length; i += 2) {
        const range = Array.isArray(args[i]) ? (args[i] as any[]).flat(Infinity) : [args[i]];
        pairs.push([range, String(args[i + 1])]);
      }
      const len = pairs[0][0].length;
      let count = 0;
      for (let j = 0; j < len; j++) {
        const pass = pairs.every(([range, crit]) => {
          const v = range[j];
          if (crit.startsWith('>=')) return parseFloat(v) >= parseFloat(crit.slice(2));
          if (crit.startsWith('<=')) return parseFloat(v) <= parseFloat(crit.slice(2));
          if (crit.startsWith('<>')) return String(v) !== crit.slice(2);
          if (crit.startsWith('>')) return parseFloat(v) > parseFloat(crit.slice(1));
          if (crit.startsWith('<')) return parseFloat(v) < parseFloat(crit.slice(1));
          if (crit.includes('*') || crit.includes('?')) {
            const pat = '^' + crit.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
            return new RegExp(pat, 'i').test(String(v));
          }
          return String(v).toLowerCase() === crit.toLowerCase();
        });
        if (pass) count++;
      }
      return count;
    });

    // AVERAGEIF / AVERAGEIFS
    registry.register('AVERAGEIF', (range: any, criteria: any, average_range: any = null) => {
      const rangeArr = (Array.isArray(range) ? range : [range]).flat(Infinity);
      const avgArr = average_range ? (Array.isArray(average_range) ? average_range : [average_range]).flat(Infinity) : rangeArr;
      const crit = String(criteria);
      const matched: number[] = [];
      for (let i = 0; i < rangeArr.length; i++) {
        const v = rangeArr[i];
        let match = false;
        if (typeof criteria === 'number') match = parseFloat(v) === criteria;
        else if (crit.startsWith('>=')) match = parseFloat(v) >= parseFloat(crit.slice(2));
        else if (crit.startsWith('<=')) match = parseFloat(v) <= parseFloat(crit.slice(2));
        else if (crit.startsWith('<>')) match = String(v) !== crit.slice(2);
        else if (crit.startsWith('>')) match = parseFloat(v) > parseFloat(crit.slice(1));
        else if (crit.startsWith('<')) match = parseFloat(v) < parseFloat(crit.slice(1));
        else match = String(v).toLowerCase() === crit.toLowerCase();
        if (match) { const sv = parseFloat(avgArr[i]); if (!isNaN(sv)) matched.push(sv); }
      }
      return matched.length === 0 ? '#DIV/0!' : matched.reduce((a, b) => a + b, 0) / matched.length;
    });

    // SUMIFS: multiple criteria sum
    registry.register('SUMIFS', (sum_range: any, ...args: any[]) => {
      const sumArr = (Array.isArray(sum_range) ? sum_range : [sum_range]).flat(Infinity);
      if (args.length % 2 !== 0) return '#VALUE!';
      const pairs: [any[], string][] = [];
      for (let i = 0; i < args.length; i += 2) {
        const range = (Array.isArray(args[i]) ? args[i] : [args[i]]).flat(Infinity);
        pairs.push([range, String(args[i + 1])]);
      }
      let total = 0;
      for (let j = 0; j < sumArr.length; j++) {
        const pass = pairs.every(([range, crit]) => {
          const v = range[j];
          if (crit.startsWith('>=')) return parseFloat(v) >= parseFloat(crit.slice(2));
          if (crit.startsWith('<=')) return parseFloat(v) <= parseFloat(crit.slice(2));
          if (crit.startsWith('<>')) return String(v) !== crit.slice(2);
          if (crit.startsWith('>')) return parseFloat(v) > parseFloat(crit.slice(1));
          if (crit.startsWith('<')) return parseFloat(v) < parseFloat(crit.slice(1));
          return String(v).toLowerCase() === crit.toLowerCase();
        });
        if (pass) { const sv = parseFloat(sumArr[j]); if (!isNaN(sv)) total += sv; }
      }
      return total;
    });

    // PROB: probability of value falling in range
    registry.register('PROB', (x_range: any, prob_range: any, lower_limit: any, upper_limit: any = null) => {
      const xs = flatNums(x_range), ps = flatNums(prob_range);
      if (xs.length !== ps.length) return '#N/A';
      const lo = parseFloat(lower_limit), hi = upper_limit !== null ? parseFloat(upper_limit) : lo;
      return xs.reduce((a, x, i) => x >= lo && x <= hi ? a + ps[i] : a, 0);
    });
  }
}
