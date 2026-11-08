/**
 * FINANCIAL ENGINE
 *
 * Implements Excel-compatible financial functions.
 * All date serial numbers use Excel's 1900 date system (Jan 1, 1900 = 1).
 */
// Helper: convert Excel serial date to JS Date (UTC)
function serialToDate(serial) {
    const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
    return new Date(EXCEL_EPOCH.getTime() + serial * 86400000);
}
// Helper: convert JS Date to Excel serial
function dateToSerial(d) {
    const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
    return (d.getTime() - EXCEL_EPOCH.getTime()) / 86400000;
}
// Helper: parse a value as number
function n(v) {
    const num = parseFloat(v);
    return isNaN(num) ? 0 : num;
}
// Day count fraction for basis
// 0 = US 30/360, 1 = actual/actual, 2 = actual/360, 3 = actual/365, 4 = European 30/360
function dayCountFraction(d1, d2, basis = 0) {
    const y1 = d1.getUTCFullYear(), m1 = d1.getUTCMonth() + 1, dd1 = d1.getUTCDate();
    const y2 = d2.getUTCFullYear(), m2 = d2.getUTCMonth() + 1, dd2 = d2.getUTCDate();
    switch (basis) {
        case 0: { // US 30/360
            let D1 = dd1, D2 = dd2;
            if (D1 === 31)
                D1 = 30;
            if (D2 === 31 && D1 === 30)
                D2 = 30;
            return (360 * (y2 - y1) + 30 * (m2 - m1) + (D2 - D1)) / 360;
        }
        case 1: { // Actual/Actual
            const days = (d2.getTime() - d1.getTime()) / 86400000;
            const yearDays = (new Date(y1 + 1, 0, 1).getTime() - new Date(y1, 0, 1).getTime()) / 86400000;
            return days / yearDays;
        }
        case 2: // Actual/360
            return (d2.getTime() - d1.getTime()) / (86400000 * 360);
        case 3: // Actual/365
            return (d2.getTime() - d1.getTime()) / (86400000 * 365);
        case 4: { // European 30/360
            let D1 = Math.min(dd1, 30), D2 = Math.min(dd2, 30);
            return (360 * (y2 - y1) + 30 * (m2 - m1) + (D2 - D1)) / 360;
        }
        default:
            return (d2.getTime() - d1.getTime()) / (86400000 * 365);
    }
}
// Calculate days in coupon period
function couponDays(settlement, maturity, frequency) {
    return 365 / frequency; // simplified
}
// Coupon dates helper: returns previous coupon date before settlement
function prevCouponDate(settlement, maturity, frequency) {
    const period = 12 / frequency;
    let d = new Date(maturity);
    while (d > settlement) {
        d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - period, d.getUTCDate()));
    }
    return d;
}
// Next coupon date after settlement
function nextCouponDate(settlement, maturity, frequency) {
    let d = prevCouponDate(settlement, maturity, frequency);
    const period = 12 / frequency;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + period, d.getUTCDate()));
}
export class FinancialEngine {
    static registerFunctions(registry) {
        // ====== BOND FUNCTIONS ======
        // ACCRINT: Accrued interest for a security that pays periodic interest
        registry.register('ACCRINT', (issue, first_interest, settlement, rate, par, frequency, basis = 0) => {
            try {
                const issueDate = serialToDate(n(issue));
                const settlDate = serialToDate(n(settlement));
                const r = n(rate), p = n(par) || 1000, f = n(frequency), b = n(basis);
                const fraction = dayCountFraction(issueDate, settlDate, b);
                return p * r * fraction;
            }
            catch {
                return '#VALUE!';
            }
        });
        // ACCRINTM: Accrued interest at maturity
        registry.register('ACCRINTM', (issue, settlement, rate, par, basis = 0) => {
            try {
                const issueDate = serialToDate(n(issue));
                const settlDate = serialToDate(n(settlement));
                const r = n(rate), p = n(par) || 1000, b = n(basis);
                const fraction = dayCountFraction(issueDate, settlDate, b);
                return p * r * fraction;
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPDAYBS: Days from beginning of coupon period to settlement
        registry.register('COUPDAYBS', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                const prev = prevCouponDate(settl, mat, freq);
                return Math.round((settl.getTime() - prev.getTime()) / 86400000);
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPDAYS: Days in coupon period containing settlement
        registry.register('COUPDAYS', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                const prev = prevCouponDate(settl, mat, freq);
                const next = nextCouponDate(settl, mat, freq);
                return Math.round((next.getTime() - prev.getTime()) / 86400000);
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPDAYSNC: Days from settlement to next coupon date
        registry.register('COUPDAYSNC', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                const next = nextCouponDate(settl, mat, freq);
                return Math.round((next.getTime() - settl.getTime()) / 86400000);
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPNCD: Next coupon date after settlement
        registry.register('COUPNCD', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                return dateToSerial(nextCouponDate(settl, mat, freq));
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPNUM: Number of coupons payable between settlement and maturity
        registry.register('COUPNUM', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                const years = (mat.getTime() - settl.getTime()) / (86400000 * 365.25);
                return Math.ceil(years * freq);
            }
            catch {
                return '#VALUE!';
            }
        });
        // COUPPCD: Previous coupon date before settlement
        registry.register('COUPPCD', (settlement, maturity, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const freq = n(frequency);
                return dateToSerial(prevCouponDate(settl, mat, freq));
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== CUMULATIVE FUNCTIONS ======
        // CUMIPMT: Cumulative interest paid between two periods
        registry.register('CUMIPMT', (rate, nper, pv, start_period, end_period, type = 0) => {
            try {
                const r = n(rate), np = n(nper), p = n(pv), s = Math.round(n(start_period)), e = Math.round(n(end_period)), t = n(type);
                if (r <= 0 || np <= 0 || p <= 0 || s < 1 || e < s || e > np)
                    return '#NUM!';
                let total = 0;
                for (let per = s; per <= e; per++) {
                    // PMT = PV * r / (1 - (1+r)^-nper)
                    const pmt = p * r / (1 - Math.pow(1 + r, -np));
                    // Balance at beginning of period per
                    const bal = p * Math.pow(1 + r, per - 1) - pmt * (Math.pow(1 + r, per - 1) - 1) / r;
                    total += -bal * r;
                }
                return total;
            }
            catch {
                return '#VALUE!';
            }
        });
        // CUMPRINC: Cumulative principal paid between two periods
        registry.register('CUMPRINC', (rate, nper, pv, start_period, end_period, type = 0) => {
            try {
                const r = n(rate), np = n(nper), p = n(pv), s = Math.round(n(start_period)), e = Math.round(n(end_period));
                if (r <= 0 || np <= 0 || p <= 0 || s < 1 || e < s || e > np)
                    return '#NUM!';
                const pmt = p * r / (1 - Math.pow(1 + r, -np));
                let total = 0;
                for (let per = s; per <= e; per++) {
                    const bal = p * Math.pow(1 + r, per - 1) - pmt * (Math.pow(1 + r, per - 1) - 1) / r;
                    const interest = bal * r;
                    total += -(pmt - interest);
                }
                return total;
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== DEPRECIATION FUNCTIONS ======
        // DB: Declining balance depreciation
        registry.register('DB', (cost, salvage, life, period, month = 12) => {
            try {
                const c = n(cost), s = n(salvage), l = n(life), p = n(period), m = n(month);
                if (c <= 0 || s < 0 || l <= 0 || p <= 0)
                    return '#NUM!';
                const rate = 1 - Math.pow(s / c, 1 / l);
                const rateRounded = Math.round(rate * 1000) / 1000;
                if (p === 1)
                    return c * rateRounded * m / 12;
                let book = c - c * rateRounded * m / 12;
                for (let i = 2; i < p; i++) {
                    book = book - book * rateRounded;
                }
                if (p === l) {
                    const prevBook = book;
                    book = prevBook - prevBook * rateRounded;
                    return prevBook * rateRounded * (12 - m) / 12;
                }
                return book * rateRounded;
            }
            catch {
                return '#VALUE!';
            }
        });
        // DDB: Double-declining balance depreciation
        registry.register('DDB', (cost, salvage, life, period, factor = 2) => {
            try {
                const c = n(cost), s = n(salvage), l = n(life), p = n(period), f = n(factor);
                if (c <= 0 || s < 0 || l <= 0 || p <= 0)
                    return '#NUM!';
                let book = c;
                const rate = f / l;
                let dep = 0;
                for (let i = 1; i <= p; i++) {
                    dep = Math.min(book * rate, book - s);
                    if (dep < 0)
                        dep = 0;
                    if (i === p)
                        return dep;
                    book -= dep;
                }
                return dep;
            }
            catch {
                return '#VALUE!';
            }
        });
        // SLN: Straight-line depreciation
        registry.register('SLN', (cost, salvage, life) => {
            try {
                const c = n(cost), s = n(salvage), l = n(life);
                if (l === 0)
                    return '#DIV/0!';
                return (c - s) / l;
            }
            catch {
                return '#VALUE!';
            }
        });
        // SYD: Sum-of-years' digits depreciation
        registry.register('SYD', (cost, salvage, life, per) => {
            try {
                const c = n(cost), s = n(salvage), l = n(life), p = n(per);
                if (l <= 0 || p <= 0 || p > l)
                    return '#NUM!';
                const syd = (l * (l + 1)) / 2;
                return (c - s) * (l - p + 1) / syd;
            }
            catch {
                return '#VALUE!';
            }
        });
        // VDB: Variable declining balance depreciation
        registry.register('VDB', (cost, salvage, life, start_period, end_period, factor = 2, no_switch = 0) => {
            try {
                const c = n(cost), s = n(salvage), l = n(life), sp = n(start_period), ep = n(end_period), f = n(factor);
                let dep = 0;
                const rate = f / l;
                let book = c;
                for (let i = 0; i < ep; i++) {
                    const ddbDep = book * rate;
                    const slnDep = (book - s) / (l - i);
                    const curDep = (!no_switch && slnDep > ddbDep) ? slnDep : ddbDep;
                    const actualDep = Math.min(curDep, book - s);
                    if (i >= sp)
                        dep += actualDep;
                    book -= actualDep;
                }
                return dep;
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== YIELD / PRICE FUNCTIONS ======
        // DISC: Discount rate for a security
        registry.register('DISC', (settlement, maturity, pr, redemption, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const p = n(pr), red = n(redemption), b = n(basis);
                const frac = dayCountFraction(settl, mat, b);
                if (frac === 0)
                    return '#DIV/0!';
                return (red - p) / red / frac;
            }
            catch {
                return '#VALUE!';
            }
        });
        // DOLLARDE: Dollar price in decimal notation
        registry.register('DOLLARDE', (fractional_dollar, fraction) => {
            try {
                const fd = n(fractional_dollar), fr = Math.floor(n(fraction));
                if (fr === 0)
                    return '#DIV/0!';
                const intPart = Math.floor(Math.abs(fd));
                const fracPart = (Math.abs(fd) - intPart) * 100;
                const sign = fd < 0 ? -1 : 1;
                return sign * (intPart + fracPart / fr);
            }
            catch {
                return '#VALUE!';
            }
        });
        // DOLLARFR: Dollar price in fractional notation
        registry.register('DOLLARFR', (decimal_dollar, fraction) => {
            try {
                const dd = n(decimal_dollar), fr = Math.floor(n(fraction));
                if (fr === 0)
                    return '#DIV/0!';
                const intPart = Math.floor(Math.abs(dd));
                const fracPart = (Math.abs(dd) - intPart) * fr / 100;
                const sign = dd < 0 ? -1 : 1;
                return sign * (intPart + fracPart);
            }
            catch {
                return '#VALUE!';
            }
        });
        // DURATION: Macaulay duration
        registry.register('DURATION', (settlement, maturity, coupon, yld, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const c = n(coupon), y = n(yld), freq = n(frequency);
                const num = Math.ceil((mat.getTime() - settl.getTime()) / (86400000 * 365.25 / freq));
                let pv = 0, pvt = 0;
                for (let t = 1; t <= num; t++) {
                    const cf = c / freq + (t === num ? 1 : 0);
                    const discount = Math.pow(1 + y / freq, t);
                    pv += cf / discount;
                    pvt += (t / freq) * cf / discount;
                }
                return pv === 0 ? '#DIV/0!' : pvt / pv;
            }
            catch {
                return '#VALUE!';
            }
        });
        // MDURATION: Modified Macaulay duration
        registry.register('MDURATION', (settlement, maturity, coupon, yld, frequency, basis = 0) => {
            try {
                const dur = registry.getFunction('DURATION')(settlement, maturity, coupon, yld, frequency, basis);
                if (typeof dur !== 'number')
                    return dur;
                return dur / (1 + n(yld) / n(frequency));
            }
            catch {
                return '#VALUE!';
            }
        });
        // EFFECT: Effective annual interest rate
        registry.register('EFFECT', (nominal_rate, npery) => {
            try {
                const r = n(nominal_rate), np = Math.floor(n(npery));
                if (r <= 0 || np < 1)
                    return '#NUM!';
                return Math.pow(1 + r / np, np) - 1;
            }
            catch {
                return '#VALUE!';
            }
        });
        // NOMINAL: Nominal interest rate
        registry.register('NOMINAL', (effect_rate, npery) => {
            try {
                const r = n(effect_rate), np = Math.floor(n(npery));
                if (r <= 0 || np < 1)
                    return '#NUM!';
                return np * (Math.pow(1 + r, 1 / np) - 1);
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== CORE TIME VALUE OF MONEY ======
        // FV: Future value
        registry.register('FV', (rate, nper, pmt, pv = 0, type = 0) => {
            try {
                const r = n(rate), np = n(nper), p = n(pmt), pv_ = n(pv), t = n(type);
                if (r === 0)
                    return -pv_ - p * np;
                const factor = Math.pow(1 + r, np);
                return -pv_ * factor - p * (1 + r * t) * (factor - 1) / r;
            }
            catch {
                return '#VALUE!';
            }
        });
        // FVSCHEDULE: Future value with variable interest rates
        registry.register('FVSCHEDULE', (principal, schedule) => {
            try {
                let fv = n(principal);
                const rates = Array.isArray(schedule) ? schedule.flat().map(n) : [n(schedule)];
                for (const r of rates) {
                    fv *= (1 + r);
                }
                return fv;
            }
            catch {
                return '#VALUE!';
            }
        });
        // PV: Present value
        registry.register('PV', (rate, nper, pmt, fv = 0, type = 0) => {
            try {
                const r = n(rate), np = n(nper), p = n(pmt), fv_ = n(fv), t = n(type);
                if (r === 0)
                    return -p * np - fv_;
                const factor = Math.pow(1 + r, np);
                return -(fv_ / factor + p * (1 + r * t) * (factor - 1) / (r * factor));
            }
            catch {
                return '#VALUE!';
            }
        });
        // PMT: Periodic payment for a loan
        registry.register('PMT', (rate, nper, pv, fv = 0, type = 0) => {
            try {
                const r = n(rate), np = n(nper), pv_ = n(pv), fv_ = n(fv), t = n(type);
                if (np === 0)
                    return '#DIV/0!';
                if (r === 0)
                    return -(pv_ + fv_) / np;
                const factor = Math.pow(1 + r, np);
                return -r * (pv_ * factor + fv_) / ((1 + r * t) * (factor - 1));
            }
            catch {
                return '#VALUE!';
            }
        });
        // IPMT: Interest payment for a given period
        registry.register('IPMT', (rate, per, nper, pv, fv = 0, type = 0) => {
            try {
                const r = n(rate), period = n(per), np = n(nper), pv_ = n(pv), fv_ = n(fv), t = n(type);
                const pmt = -(r * (pv_ * Math.pow(1 + r, np) + fv_) / ((1 + r * t) * (Math.pow(1 + r, np) - 1)));
                const ipmt = -(pv_ * Math.pow(1 + r, period - 1) * r + pmt * (1 + r * t) * (Math.pow(1 + r, period - 1) - 1) / r * r);
                return ipmt;
            }
            catch {
                return '#VALUE!';
            }
        });
        // PPMT: Principal payment for a given period
        registry.register('PPMT', (rate, per, nper, pv, fv = 0, type = 0) => {
            try {
                const r = n(rate), period = n(per), np = n(nper), pv_ = n(pv), fv_ = n(fv), t = n(type);
                const pmtFn = registry.getFunction('PMT');
                const ipmtFn = registry.getFunction('IPMT');
                const pmt = pmtFn(r, np, pv_, fv_, t);
                const ipmt = ipmtFn(r, period, np, pv_, fv_, t);
                if (typeof pmt !== 'number' || typeof ipmt !== 'number')
                    return '#VALUE!';
                return pmt - ipmt;
            }
            catch {
                return '#VALUE!';
            }
        });
        // NPER: Number of periods for an investment
        registry.register('NPER', (rate, pmt, pv, fv = 0, type = 0) => {
            try {
                const r = n(rate), p = n(pmt), pv_ = n(pv), fv_ = n(fv), t = n(type);
                if (r === 0) {
                    if (p === 0)
                        return '#NUM!';
                    return -(pv_ + fv_) / p;
                }
                const top = p * (1 + r * t) / r - fv_;
                const bot = pv_ + p * (1 + r * t) / r;
                if (bot === 0 || top / bot <= 0)
                    return '#NUM!';
                return Math.log(top / bot) / Math.log(1 + r);
            }
            catch {
                return '#VALUE!';
            }
        });
        // RATE: Interest rate per period
        registry.register('RATE', (nper, pmt, pv, fv = 0, type = 0, guess = 0.1) => {
            try {
                const np = n(nper), p = n(pmt), pv_ = n(pv), fv_ = n(fv), t = n(type);
                let r = n(guess);
                // Newton-Raphson iteration
                for (let i = 0; i < 100; i++) {
                    const factor = Math.pow(1 + r, np);
                    const f = pv_ * factor + p * (1 + r * t) * (factor - 1) / r + fv_;
                    const df = pv_ * np * Math.pow(1 + r, np - 1) + p * t * (factor - 1) / r + p * (1 + r * t) * np * Math.pow(1 + r, np - 1) / r - p * (1 + r * t) * (factor - 1) / (r * r);
                    const newR = r - f / df;
                    if (Math.abs(newR - r) < 1e-10)
                        return newR;
                    r = newR;
                }
                return '#NUM!';
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== IRR / NPV ======
        // NPV: Net present value
        registry.register('NPV', (rate, ...values) => {
            try {
                const r = n(rate);
                const vals = values.flat().map(n);
                let npv = 0;
                for (let i = 0; i < vals.length; i++) {
                    npv += vals[i] / Math.pow(1 + r, i + 1);
                }
                return npv;
            }
            catch {
                return '#VALUE!';
            }
        });
        // IRR: Internal rate of return
        registry.register('IRR', (values, guess = 0.1) => {
            try {
                const vals = (Array.isArray(values) ? values.flat() : [values]).map(n);
                let r = n(guess);
                for (let iter = 0; iter < 1000; iter++) {
                    let f = 0, df = 0;
                    for (let i = 0; i < vals.length; i++) {
                        const disc = Math.pow(1 + r, i);
                        f += vals[i] / disc;
                        df -= i * vals[i] / (disc * (1 + r));
                    }
                    if (Math.abs(df) < 1e-15)
                        break;
                    const newR = r - f / df;
                    if (Math.abs(newR - r) < 1e-10)
                        return newR;
                    r = newR;
                }
                return '#NUM!';
            }
            catch {
                return '#VALUE!';
            }
        });
        // MIRR: Modified internal rate of return
        registry.register('MIRR', (values, finance_rate, reinvest_rate) => {
            try {
                const vals = (Array.isArray(values) ? values.flat() : [values]).map(n);
                const fr = n(finance_rate), rr = n(reinvest_rate);
                const n_ = vals.length;
                let positiveNPV = 0, negativePV = 0;
                for (let i = 0; i < n_; i++) {
                    if (vals[i] > 0)
                        positiveNPV += vals[i] * Math.pow(1 + rr, n_ - 1 - i);
                    else
                        negativePV += vals[i] / Math.pow(1 + fr, i);
                }
                if (negativePV === 0)
                    return '#DIV/0!';
                return Math.pow(-positiveNPV / negativePV, 1 / (n_ - 1)) - 1;
            }
            catch {
                return '#VALUE!';
            }
        });
        // XNPV: Net present value with irregular cash flows
        registry.register('XNPV', (rate, values, dates) => {
            try {
                const r = n(rate);
                const vals = (Array.isArray(values) ? values.flat() : [values]).map(n);
                const dts = (Array.isArray(dates) ? dates.flat() : [dates]).map(n);
                if (vals.length !== dts.length)
                    return '#VALUE!';
                const d0 = dts[0];
                let xnpv = 0;
                for (let i = 0; i < vals.length; i++) {
                    const frac = (dts[i] - d0) / 365;
                    xnpv += vals[i] / Math.pow(1 + r, frac);
                }
                return xnpv;
            }
            catch {
                return '#VALUE!';
            }
        });
        // XIRR: Internal rate of return with irregular cash flows
        registry.register('XIRR', (values, dates, guess = 0.1) => {
            try {
                const vals = (Array.isArray(values) ? values.flat() : [values]).map(n);
                const dts = (Array.isArray(dates) ? dates.flat() : [dates]).map(n);
                if (vals.length !== dts.length)
                    return '#VALUE!';
                const d0 = dts[0];
                let r = n(guess);
                for (let iter = 0; iter < 1000; iter++) {
                    let f = 0, df = 0;
                    for (let i = 0; i < vals.length; i++) {
                        const t = (dts[i] - d0) / 365;
                        const disc = Math.pow(1 + r, t);
                        f += vals[i] / disc;
                        df -= t * vals[i] / (disc * (1 + r));
                    }
                    if (Math.abs(df) < 1e-15)
                        break;
                    const newR = r - f / df;
                    if (Math.abs(newR - r) < 1e-10)
                        return newR;
                    r = newR;
                }
                return '#NUM!';
            }
            catch {
                return '#VALUE!';
            }
        });
        // ====== PRICE / YIELD ======
        // INTRATE: Interest rate for fully invested security
        registry.register('INTRATE', (settlement, maturity, investment, redemption, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const inv = n(investment), red = n(redemption), b = n(basis);
                const frac = dayCountFraction(settl, mat, b);
                if (frac === 0 || inv === 0)
                    return '#DIV/0!';
                return (red - inv) / inv / frac;
            }
            catch {
                return '#VALUE!';
            }
        });
        // RECEIVED: Amount received at maturity for a fully invested security
        registry.register('RECEIVED', (settlement, maturity, investment, discount, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const inv = n(investment), d = n(discount), b = n(basis);
                const frac = dayCountFraction(settl, mat, b);
                const denom = 1 - d * frac;
                if (denom === 0)
                    return '#DIV/0!';
                return inv / denom;
            }
            catch {
                return '#VALUE!';
            }
        });
        // TBILLEQ: Treasury bill equivalent yield
        registry.register('TBILLEQ', (settlement, maturity, discount) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const d = n(discount);
                const dsm = (mat.getTime() - settl.getTime()) / 86400000;
                if (dsm > 182) {
                    const p = 100 * (1 - d * dsm / 360);
                    return 365 * d / (360 - d * dsm);
                }
                return 365 * d / (360 - d * dsm);
            }
            catch {
                return '#VALUE!';
            }
        });
        // TBILLPRICE: Treasury bill price per $100 face value
        registry.register('TBILLPRICE', (settlement, maturity, discount) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const d = n(discount);
                const dsm = (mat.getTime() - settl.getTime()) / 86400000;
                return 100 * (1 - d * dsm / 360);
            }
            catch {
                return '#VALUE!';
            }
        });
        // TBILLYIELD: Treasury bill yield
        registry.register('TBILLYIELD', (settlement, maturity, pr) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const p = n(pr);
                const dsm = (mat.getTime() - settl.getTime()) / 86400000;
                if (p === 0)
                    return '#DIV/0!';
                return (100 - p) / p * 365 / dsm;
            }
            catch {
                return '#VALUE!';
            }
        });
        // PRICE: Price per $100 for a security paying periodic interest
        registry.register('PRICE', (settlement, maturity, rate, yld, redemption, frequency, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const r = n(rate), y = n(yld), red = n(redemption), freq = n(frequency);
                const dsm = dayCountFraction(settl, mat, basis);
                const numCoupons = Math.ceil(dsm * freq);
                let price = 0;
                const coupon = 100 * r / freq;
                for (let i = 1; i <= numCoupons; i++) {
                    price += coupon / Math.pow(1 + y / freq, i);
                }
                price += red / Math.pow(1 + y / freq, numCoupons);
                return price;
            }
            catch {
                return '#VALUE!';
            }
        });
        // YIELD: Yield on a security that pays periodic interest
        registry.register('YIELD', (settlement, maturity, rate, pr, redemption, frequency, basis = 0) => {
            try {
                // Use Newton-Raphson to find yield from price
                const priceFn = registry.getFunction('PRICE');
                const targetPrice = n(pr);
                let yld = n(rate); // Initial guess
                for (let iter = 0; iter < 100; iter++) {
                    const calcPrice = priceFn(settlement, maturity, rate, yld, redemption, frequency, basis);
                    if (typeof calcPrice !== 'number')
                        return '#VALUE!';
                    const diff = calcPrice - targetPrice;
                    if (Math.abs(diff) < 1e-8)
                        return yld;
                    yld += diff * 0.001;
                }
                return '#NUM!';
            }
            catch {
                return '#VALUE!';
            }
        });
        // YIELDDISC: Annual yield for a discounted security
        registry.register('YIELDDISC', (settlement, maturity, pr, redemption, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const p = n(pr), red = n(redemption), b = n(basis);
                const frac = dayCountFraction(settl, mat, b);
                if (frac === 0 || p === 0)
                    return '#DIV/0!';
                return (red - p) / p / frac;
            }
            catch {
                return '#VALUE!';
            }
        });
        // YIELDMAT: Annual yield for a security that pays interest at maturity
        registry.register('YIELDMAT', (settlement, maturity, issue, rate, pr, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const iss = serialToDate(n(issue));
                const r = n(rate), p = n(pr) / 100, b = n(basis);
                const dim = dayCountFraction(iss, mat, b);
                const dis = dayCountFraction(iss, settl, b);
                const dsm = dayCountFraction(settl, mat, b);
                const numer = (1 + r * dim) / (p + r * dis) - 1;
                if (dsm === 0)
                    return '#DIV/0!';
                return numer / dsm;
            }
            catch {
                return '#VALUE!';
            }
        });
        // PRICEDISC: Price per $100 for a discounted security
        registry.register('PRICEDISC', (settlement, maturity, discount, redemption, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const d = n(discount), red = n(redemption), b = n(basis);
                const frac = dayCountFraction(settl, mat, b);
                return red - d * red * frac;
            }
            catch {
                return '#VALUE!';
            }
        });
        // PRICEMAT: Price per $100 for a security paying interest at maturity
        registry.register('PRICEMAT', (settlement, maturity, issue, rate, yld, basis = 0) => {
            try {
                const settl = serialToDate(n(settlement));
                const mat = serialToDate(n(maturity));
                const iss = serialToDate(n(issue));
                const r = n(rate), y = n(yld), b = n(basis);
                const dim = dayCountFraction(iss, mat, b);
                const dis = dayCountFraction(iss, settl, b);
                const dsm = dayCountFraction(settl, mat, b);
                return 100 * (1 + r * dim) / (1 + y * dsm) - 100 * r * dis;
            }
            catch {
                return '#VALUE!';
            }
        });
        // AMORLINC: Depreciation for each accounting period (French)
        registry.register('AMORLINC', (cost, date_purchased, first_period, salvage, period, rate, basis = 0) => {
            try {
                const c = n(cost), s = n(salvage), p = Math.floor(n(period)), r = n(rate);
                const dep = c * r;
                if (p === 0)
                    return dep; // First period
                const remaining = c - dep * p;
                if (remaining <= s)
                    return 0;
                return Math.min(dep, remaining - s);
            }
            catch {
                return '#VALUE!';
            }
        });
        // AMORDEGRC: Depreciation for each accounting period (French, degressive)
        registry.register('AMORDEGRC', (cost, date_purchased, first_period, salvage, period, rate, basis = 0) => {
            try {
                const c = n(cost), s = n(salvage), p = Math.floor(n(period)), r = n(rate);
                // Apply coefficient based on life
                let coeff = 1.0;
                const life = 1 / r;
                if (life < 3)
                    coeff = 1.0;
                else if (life < 5)
                    coeff = 1.5;
                else if (life <= 6)
                    coeff = 2.0;
                else
                    coeff = 2.5;
                const adjRate = Math.min(r * coeff, 1);
                let book = c;
                for (let i = 0; i < p; i++) {
                    const dep = book * adjRate;
                    if (book - dep < s)
                        return Math.max(0, book - s);
                    book -= dep;
                }
                return Math.max(0, book * adjRate);
            }
            catch {
                return '#VALUE!';
            }
        });
        // ODDLPRICE / ODDLYIELD (simplified)
        registry.register('ODDLPRICE', (settlement, maturity, last_interest, rate, yld, redemption, frequency, basis = 0) => {
            // Simplified version
            try {
                return registry.getFunction('PRICE')(settlement, maturity, rate, yld, redemption, frequency, basis);
            }
            catch {
                return '#VALUE!';
            }
        });
        registry.register('ODDLYIELD', (settlement, maturity, last_interest, rate, pr, redemption, frequency, basis = 0) => {
            try {
                return registry.getFunction('YIELD')(settlement, maturity, rate, pr, redemption, frequency, basis);
            }
            catch {
                return '#VALUE!';
            }
        });
        // ODDFPRICE / ODDFYIELD (simplified)
        registry.register('ODDFPRICE', (settlement, maturity, issue, first_coupon, rate, yld, redemption, frequency, basis = 0) => {
            try {
                return registry.getFunction('PRICE')(settlement, maturity, rate, yld, redemption, frequency, basis);
            }
            catch {
                return '#VALUE!';
            }
        });
        registry.register('ODDFYIELD', (settlement, maturity, issue, first_coupon, rate, pr, redemption, frequency, basis = 0) => {
            try {
                return registry.getFunction('YIELD')(settlement, maturity, rate, pr, redemption, frequency, basis);
            }
            catch {
                return '#VALUE!';
            }
        });
        // RRI: Equivalent interest rate for an investment
        registry.register('RRI', (nper, pv, fv) => {
            try {
                const np = n(nper), p = n(pv), f = n(fv);
                if (np <= 0 || p === 0)
                    return '#NUM!';
                return Math.pow(f / p, 1 / np) - 1;
            }
            catch {
                return '#VALUE!';
            }
        });
        // ISPMT: Interest paid for straight-line loans
        registry.register('ISPMT', (rate, per, nper, pv) => {
            try {
                const r = n(rate), p = n(per), np = n(nper), pv_ = n(pv);
                return pv_ * r * (p / np - 1);
            }
            catch {
                return '#VALUE!';
            }
        });
        // PDURATION: Number of periods for an investment to reach a specified value
        registry.register('PDURATION', (rate, pv, fv) => {
            try {
                const r = n(rate), p = n(pv), f = n(fv);
                if (r <= 0 || p <= 0 || f <= 0)
                    return '#NUM!';
                return (Math.log(f) - Math.log(p)) / Math.log(1 + r);
            }
            catch {
                return '#VALUE!';
            }
        });
    }
}
//# sourceMappingURL=FinancialEngine.js.map