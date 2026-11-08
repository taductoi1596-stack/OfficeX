export class DateTimeEngine {
  private static readonly EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30)); // Dec 30, 1899

  private static toSerial(date: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = date.getTime() - this.EXCEL_EPOCH.getTime();
    return diff / msPerDay;
  }

  private static fromSerial(serial: number): Date {
    const msPerDay = 24 * 60 * 60 * 1000;
    return new Date(this.EXCEL_EPOCH.getTime() + serial * msPerDay);
  }

  private static isLeapYear(y: number): boolean {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  }

  private static daysInMonth(y: number, m: number): number {
    // m is 0-indexed (JS month)
    return new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  }

  private static parseHolidays(holidays: any): Set<number> {
    const set = new Set<number>();
    if (!holidays) return set;
    const arr = Array.isArray(holidays) ? holidays.flat() : [holidays];
    for (const h of arr) {
      const v = parseFloat(h);
      if (!isNaN(v)) set.add(Math.floor(v));
    }
    return set;
  }

  private static isWeekend(d: Date): boolean {
    const dow = d.getUTCDay();
    return dow === 0 || dow === 6;
  }

  public static registerFunctions(registry: any) {

    // ====== VOLATILE: TODAY / NOW ======

    registry.register('TODAY', () => {
      const now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      return this.toSerial(now);
    }, true);

    registry.register('NOW', () => {
      return this.toSerial(new Date());
    }, true);

    // ====== DATE CONSTRUCTION ======

    registry.register('DATE', (year: any, month: any, day: any) => {
      let y = parseInt(year);
      const m = parseInt(month);
      const d = parseInt(day);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return '#VALUE!';
      if (y >= 0 && y <= 1899) y += 1900;
      // JS Date handles month/day overflow automatically
      return this.toSerial(new Date(Date.UTC(y, m - 1, d)));
    });

    registry.register('TIME', (hour: any, minute: any, second: any) => {
      const h = parseFloat(hour) || 0;
      const m = parseFloat(minute) || 0;
      const s = parseFloat(second) || 0;
      const totalSeconds = h * 3600 + m * 60 + s;
      return (totalSeconds % 86400) / 86400;
    });

    registry.register('DATEVALUE', (dateText: any) => {
      const d = new Date(String(dateText));
      if (isNaN(d.getTime())) return '#VALUE!';
      d.setUTCHours(0, 0, 0, 0);
      return this.toSerial(d);
    });

    registry.register('TIMEVALUE', (timeText: any) => {
      const parts = String(timeText).split(':');
      if (parts.length < 2) return '#VALUE!';
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseFloat(parts[2] || '0') || 0;
      return (h * 3600 + m * 60 + s) / 86400;
    });

    // ====== DATE / TIME EXTRACTION ======

    registry.register('YEAR', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      return this.fromSerial(serial).getUTCFullYear();
    });

    registry.register('MONTH', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      return this.fromSerial(serial).getUTCMonth() + 1;
    });

    registry.register('DAY', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      return this.fromSerial(serial).getUTCDate();
    });

    registry.register('HOUR', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const totalSeconds = Math.round((serial % 1) * 86400);
      return Math.floor(totalSeconds / 3600) % 24;
    });

    registry.register('MINUTE', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const totalSeconds = Math.round((serial % 1) * 86400);
      return Math.floor((totalSeconds % 3600) / 60);
    });

    registry.register('SECOND', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const totalSeconds = Math.round((serial % 1) * 86400);
      return totalSeconds % 60;
    });

    // WEEKDAY: day of week
    // return_type 1 = 1(Sun)..7(Sat) | 2 = 1(Mon)..7(Sun) | 3 = 0(Mon)..6(Sun)
    registry.register('WEEKDAY', (serialNum: any, returnType: any = 1) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const dow = this.fromSerial(serial).getUTCDay(); // 0=Sun..6=Sat
      const rt = parseInt(returnType) || 1;
      if (rt === 2) return dow === 0 ? 7 : dow;
      if (rt === 3) return dow === 0 ? 6 : dow - 1;
      return dow + 1; // default type 1
    });

    // WEEKNUM: week number in year
    registry.register('WEEKNUM', (serialNum: any, returnType: any = 1) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const d = this.fromSerial(serial);
      const y = d.getUTCFullYear();
      const jan1 = new Date(Date.UTC(y, 0, 1));
      const jan1Dow = jan1.getUTCDay(); // 0=Sun
      const dayOfYear = Math.floor((d.getTime() - jan1.getTime()) / 86400000);
      const rt = parseInt(returnType) || 1;
      if (rt === 2) {
        // Week starts Monday
        const offset = jan1Dow === 0 ? 6 : jan1Dow - 1;
        return Math.floor((dayOfYear + offset) / 7) + 1;
      }
      return Math.floor((dayOfYear + jan1Dow) / 7) + 1;
    });

    // ISOWEEKNUM: ISO 8601 week number
    registry.register('ISOWEEKNUM', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const d = this.fromSerial(serial);
      const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      // Thursday of current week (ISO: week contains Thursday)
      date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7) + 3);
      const jan4 = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
      const firstThur = new Date(jan4);
      firstThur.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7) + 3);
      return Math.round((date.getTime() - firstThur.getTime()) / 604800000) + 1;
    });

    // ====== DATE ARITHMETIC ======

    registry.register('DAYS', (endDate: any, startDate: any) => {
      const e = parseFloat(endDate), s = parseFloat(startDate);
      if (isNaN(e) || isNaN(s)) return '#VALUE!';
      return Math.floor(e) - Math.floor(s);
    });

    registry.register('DAYS360', (startDate: any, endDate: any, method: any = false) => {
      const sd = parseFloat(startDate), ed = parseFloat(endDate);
      if (isNaN(sd) || isNaN(ed)) return '#VALUE!';
      const s = this.fromSerial(sd), e = this.fromSerial(ed);
      const sy = s.getUTCFullYear(), sm = s.getUTCMonth() + 1;
      let sd2 = s.getUTCDate();
      const ey = e.getUTCFullYear(), em = e.getUTCMonth() + 1;
      let ed2 = e.getUTCDate();
      if (method) {
        if (sd2 === 31) sd2 = 30;
        if (ed2 === 31) ed2 = 30;
      } else {
        if (sd2 === 31) sd2 = 30;
        if (ed2 === 31 && sd2 === 30) ed2 = 30;
      }
      return 360 * (ey - sy) + 30 * (em - sm) + (ed2 - sd2);
    });

    // DATEDIF: difference in Y, M, D, MD, YM, YD
    registry.register('DATEDIF', (startDate: any, endDate: any, unit: any) => {
      const sd = parseFloat(startDate), ed = parseFloat(endDate);
      if (isNaN(sd) || isNaN(ed) || sd > ed) return '#NUM!';
      const s = this.fromSerial(sd), e = this.fromSerial(ed);
      const sy = s.getUTCFullYear(), sm = s.getUTCMonth(), sd2 = s.getUTCDate();
      const ey = e.getUTCFullYear(), em = e.getUTCMonth(), ed2 = e.getUTCDate();
      const u = String(unit).toUpperCase();
      switch (u) {
        case 'Y':
          return ey - sy - (em < sm || (em === sm && ed2 < sd2) ? 1 : 0);
        case 'M': {
          let months = (ey - sy) * 12 + (em - sm);
          if (ed2 < sd2) months--;
          return months;
        }
        case 'D':
          return Math.floor(ed - sd);
        case 'MD': {
          const diff = ed2 - sd2;
          return diff < 0 ? diff + this.daysInMonth(ey, em === 0 ? 11 : em - 1) : diff;
        }
        case 'YM': {
          let m = em - sm;
          if (m < 0) m += 12;
          if (ed2 < sd2) m = (m - 1 + 12) % 12;
          return m;
        }
        case 'YD': {
          let tempS = new Date(Date.UTC(ey, sm, sd2));
          if (tempS > e) tempS = new Date(Date.UTC(ey - 1, sm, sd2));
          return Math.floor((e.getTime() - tempS.getTime()) / 86400000);
        }
        default: return '#VALUE!';
      }
    });

    // EDATE: same day, n months later
    registry.register('EDATE', (startDate: any, months: any) => {
      const sd = parseFloat(startDate), m = parseInt(months);
      if (isNaN(sd) || isNaN(m)) return '#VALUE!';
      const d = this.fromSerial(sd);
      return this.toSerial(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m, d.getUTCDate())));
    });

    // EOMONTH: last day of month n months away
    registry.register('EOMONTH', (startDate: any, months: any) => {
      const sd = parseFloat(startDate), m = parseInt(months);
      if (isNaN(sd) || isNaN(m)) return '#VALUE!';
      const d = this.fromSerial(sd);
      return this.toSerial(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m + 1, 0)));
    });

    // YEARFRAC: fraction of year between two dates
    registry.register('YEARFRAC', (startDate: any, endDate: any, basis: any = 0) => {
      const sd = parseFloat(startDate), ed = parseFloat(endDate);
      if (isNaN(sd) || isNaN(ed)) return '#VALUE!';
      const s = this.fromSerial(sd), e = this.fromSerial(ed);
      const b = parseInt(basis) || 0;
      const days = (e.getTime() - s.getTime()) / 86400000;
      switch (b) {
        case 0: { // US 30/360
          const sy = s.getUTCFullYear(), sm = s.getUTCMonth() + 1;
          let sd2 = s.getUTCDate();
          const ey = e.getUTCFullYear(), em = e.getUTCMonth() + 1;
          let ed2 = e.getUTCDate();
          if (sd2 === 31) sd2 = 30;
          if (ed2 === 31 && sd2 === 30) ed2 = 30;
          return (360 * (ey - sy) + 30 * (em - sm) + (ed2 - sd2)) / 360;
        }
        case 1: { // Actual/Actual
          const sy = s.getUTCFullYear(), ey = e.getUTCFullYear();
          const avgDays = (this.isLeapYear(sy) ? 366 : 365 + (this.isLeapYear(ey) ? 366 : 365)) / 2;
          return days / avgDays;
        }
        case 2: return days / 360;
        case 3: return days / 365;
        case 4: { // European 30/360
          const sy = s.getUTCFullYear(), sm = s.getUTCMonth() + 1;
          const sd2 = Math.min(s.getUTCDate(), 30);
          const ey = e.getUTCFullYear(), em = e.getUTCMonth() + 1;
          const ed2 = Math.min(e.getUTCDate(), 30);
          return (360 * (ey - sy) + 30 * (em - sm) + (ed2 - sd2)) / 360;
        }
        default: return '#VALUE!';
      }
    });

    // ====== WORKDAY FUNCTIONS ======

    registry.register('NETWORKDAYS', (startDate: any, endDate: any, holidays: any = null) => {
      const sd = parseFloat(startDate), ed = parseFloat(endDate);
      if (isNaN(sd) || isNaN(ed)) return '#VALUE!';
      const holidaySet = this.parseHolidays(holidays);
      const sign = sd <= ed ? 1 : -1;
      const [from, to] = sd <= ed ? [Math.floor(sd), Math.floor(ed)] : [Math.floor(ed), Math.floor(sd)];
      let count = 0;
      for (let day = from; day <= to; day++) {
        const d = this.fromSerial(day);
        if (!this.isWeekend(d) && !holidaySet.has(day)) count++;
      }
      return sign * count;
    });

    registry.register('WORKDAY', (startDate: any, days: any, holidays: any = null) => {
      const sd = parseFloat(startDate);
      let remaining = parseInt(days);
      if (isNaN(sd) || isNaN(remaining)) return '#VALUE!';
      const holidaySet = this.parseHolidays(holidays);
      let current = Math.floor(sd);
      const step = remaining >= 0 ? 1 : -1;
      remaining = Math.abs(remaining);
      while (remaining > 0) {
        current += step;
        const d = this.fromSerial(current);
        if (!this.isWeekend(d) && !holidaySet.has(current)) remaining--;
      }
      return current;
    });

    // Make a custom weekend checker from Excel's weekend codes
    const makeWkndChecker = (weekend: any) => {
      return (dow: number): boolean => {
        if (typeof weekend === 'string' && weekend.length === 7) {
          // "MTWTFSS" string: 1=weekend, 0=workday
          const idx = dow === 0 ? 6 : dow - 1; // Mon=0..Sun=6
          return weekend[idx] === '1';
        }
        const wkndNum = parseInt(weekend) || 1;
        const patterns: number[][] = [
          [6, 0],  // 1: Sat+Sun
          [0, 1],  // 2: Sun+Mon
          [1, 2],  // 3: Mon+Tue
          [2, 3],  // 4: Tue+Wed
          [3, 4],  // 5: Wed+Thu
          [4, 5],  // 6: Thu+Fri
          [5, 6],  // 7: Fri+Sat
          [6],     // 11: Sun only
          [0],     // 12: Mon only
          [1],     // 13: Tue only
          [2],     // 14: Wed only
          [3],     // 15: Thu only
          [4],     // 16: Fri only
          [5],     // 17: Sat only
        ];
        const idx = wkndNum <= 7 ? wkndNum - 1 : wkndNum - 4; // map 11-17 to indices 7-13
        const pattern = patterns[Math.min(idx, patterns.length - 1)] || [6, 0];
        return pattern.includes(dow);
      };
    };

    registry.register('NETWORKDAYS.INTL', (startDate: any, endDate: any, weekend: any = 1, holidays: any = null) => {
      const sd = parseFloat(startDate), ed = parseFloat(endDate);
      if (isNaN(sd) || isNaN(ed)) return '#VALUE!';
      const holidaySet = this.parseHolidays(holidays);
      const isWknd = makeWkndChecker(weekend);
      const sign = sd <= ed ? 1 : -1;
      const [from, to] = sd <= ed ? [Math.floor(sd), Math.floor(ed)] : [Math.floor(ed), Math.floor(sd)];
      let count = 0;
      for (let day = from; day <= to; day++) {
        const d = this.fromSerial(day);
        if (!isWknd(d.getUTCDay()) && !holidaySet.has(day)) count++;
      }
      return sign * count;
    });

    registry.register('WORKDAY.INTL', (startDate: any, days: any, weekend: any = 1, holidays: any = null) => {
      const sd = parseFloat(startDate);
      let remaining = parseInt(days);
      if (isNaN(sd) || isNaN(remaining)) return '#VALUE!';
      const holidaySet = this.parseHolidays(holidays);
      const isWknd = makeWkndChecker(weekend);
      let current = Math.floor(sd);
      const step = remaining >= 0 ? 1 : -1;
      remaining = Math.abs(remaining);
      while (remaining > 0) {
        current += step;
        const d = this.fromSerial(current);
        if (!isWknd(d.getUTCDay()) && !holidaySet.has(current)) remaining--;
      }
      return current;
    });

    // ====== FORMATTING ======

    // TEXT: Format a number/date as text using a format string
    registry.register('TEXT', (value: any, formatText: any) => {
      const v = parseFloat(value);
      if (isNaN(v)) return String(value ?? '');
      const fmt = String(formatText);
      // Detect if it's a date format
      const isDateFmt = /[yYmMdD]/.test(fmt) && !/[eE]/.test(fmt);
      if (isDateFmt) {
        const d = this.fromSerial(Math.floor(v));
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const dow = d.getUTCDay();
        return fmt
          .replace(/yyyy/g, String(year))
          .replace(/yy/g, String(year).slice(-2))
          .replace(/mmmm/g, MONTH_NAMES[month - 1])
          .replace(/mmm/g, MONTH_SHORT[month - 1])
          .replace(/mm/g, String(month).padStart(2, '0'))
          .replace(/m/g, String(month))
          .replace(/dddd/g, DAY_NAMES[dow])
          .replace(/ddd/g, DAY_SHORT[dow])
          .replace(/dd/g, String(day).padStart(2, '0'))
          .replace(/d/g, String(day));
      }
      // Number format
      if (fmt.includes('%')) {
        const dec = (fmt.match(/\.0+/) || [''])[0].length - 1;
        return (v * 100).toFixed(Math.max(0, dec)) + '%';
      }
      const decMatch = fmt.match(/\.0+/);
      const decPlaces = decMatch ? decMatch[0].length - 1 : 0;
      if (fmt.includes('#,##') || fmt.includes('n,n')) {
        return v.toLocaleString(undefined, { minimumFractionDigits: decPlaces, maximumFractionDigits: decPlaces });
      }
      if (decPlaces > 0) return v.toFixed(decPlaces);
      return String(v);
    });

    // DATESTRING: Date serial to ISO date string
    registry.register('DATESTRING', (serialNum: any) => {
      const serial = parseFloat(serialNum);
      if (isNaN(serial)) return '#VALUE!';
      const d = this.fromSerial(serial);
      return d.toISOString().slice(0, 10);
    });
  }
}
