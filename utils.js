import { SUFFIX, MONTH_DAYS_MAP, FIELDS, YEAR_DELTA, CURRENT_YEAR, DEFAULT_VALUES } from './config';

// 日期函数的方法
const DATE_METHODS = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds'];

function padZero(n) {
  return (n < 10 ? '0' : '') + n;
}
// 生成选项数组
function genDateStrat() {
  const years = [];
  const months = [];
  const days = [];
  const hours = [];
  const minutes = [];
  const seconds = [];

  for (let start = CURRENT_YEAR - YEAR_DELTA, end = CURRENT_YEAR + YEAR_DELTA; start <= end; start++) {
    years.push(start + SUFFIX.YEAR);
  }

  for (let i = 1; i <= 12; i++) {
    months.push(padZero(i) + SUFFIX.MONTH);
  }

  for (let i = 1; i <= 31; i++) {
    days.push(padZero(i) + SUFFIX.DAY);
  }

  for (let i = 0; i <= 23; i++) {
    hours.push(padZero(i) + SUFFIX.HOUR);
  }

  for (let i = 0; i <= 59; i++) {
    minutes.push(padZero(i) + SUFFIX.MINUTE);
  }

  for (let i = 0; i <= 59; i++) {
    seconds.push(padZero(i) + SUFFIX.SECOND);
  }

  return {
    YEAR: years,
    MONTH: months,
    DAY: days,
    HOUR: hours,
    MINUTE: minutes,
    SECOND: seconds
  };
}

const DATE_STRAT = genDateStrat();

// 类型检测
const _toString = Object.prototype.toString;
/**
 * @param {Any} type
 * @returns {Function}
 * @description 返回类型检测函数
 */
function isType(type) {
  return function _isType(o) {
    return _toString.call(o) === `[object ${type}]`;
  };
}

const isString = isType('String');
const isNumber = isType('Number');
const isDate = isType('Date');
const isArray = Array.isArray || isType('Array');

function isEmptyValue(v) {
  return v == null || v === '';
}
// 转换为十进制整数
function toInteger(s) {
  return parseInt(s, 10);
}

// 将字符串诸如 2020-04-06 10:23:45 转换成日期对象
function stringToDate(v) {
  let date = new Date();
  let ary = v.trim().split(/(?:\s+|-|:)/);

  DATE_METHODS.forEach((m, i) => {
    let v = ary[i];

    if (isEmptyValue(v)) {
      v = DEFAULT_VALUES[i];
    } else {
      v = toInteger(v);
    }
    // 月份 -1
    date[`set${m}`](i === 1 ? v - 1 : v);
  });

  return date;
}
// 将相关的数组下标转换为日期对象
function arrayToDate(ary) {
  let date = new Date();

  DATE_METHODS.forEach((m, i) => {
    let v = ary[i];

    if (isEmptyValue(v)) {
      v = DEFAULT_VALUES[i];
    } else {
      let dates = DATE_STRAT[FIELDS[i].toUpperCase()];
      v = toInteger(dates[v]);
      // 月份 -1
      v = i === 1 ? v - 1 : v;
    }

    date[`set${m}`](v);
  });

  return date;
}
// 相关类型转换为日期对象
export function toDate(v) {
  if (isEmptyValue(v)) {
    return new Date();
  }

  if (isString(v)) {
    return stringToDate(v);
  }

  if (isNumber(v)) {
    return new Date(v);
  }

  if (isDate(v)) {
    return v;
  }

  if (isArray(v)) {
    return arrayToDate(v);
  }

  return new Date();
}

/**
 * @param {Number} year
 * @returns {Boolean}
 * @description 是否为闰年
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
// 根据strats下标找到对应月份的天数
export function getMonthDays(y, m) {
  let year = toInteger(DATE_STRAT.YEAR[y]);
  let month = toInteger(DATE_STRAT.MONTH[m]);

  let day = MONTH_DAYS_MAP[month];

  if (month === 2 && isLeapYear(year)) {
    day = 29;
  }

  return day;
}

// 寻找相关选项的在DATE_STRATS中的index O(1)
function findIndex(i, v) {
  // 年份 根据当前年和delta计算
  if (i === 0) {
    return v - (CURRENT_YEAR - YEAR_DELTA);
  }
  // 日 直接-1
  if (i === 2) {
    return v - 1;
  }
  // 月 时分秒 直接返回就行了
  return v;
}

function returnZeroIfNegative(v) {
  return v < 0 ? 0 : v;
}

export function genDateTime(v) {
  let ary = [];
  let date = toDate(v);

  FIELDS.forEach((_, i) => {
    let m = DATE_METHODS[i];
    let v = date['get' + m]();

    ary.push(returnZeroIfNegative(findIndex(i, v)));
  });

  return ary;
}

export function genRangesByField(field) {
  let ranges = [];
  let i = FIELDS.indexOf(field);

  if (i === -1) {
    i = FIELDS.length - 1;
  }

  for (let k = 0; k <= i; k++) {
    ranges.push(DATE_STRAT[FIELDS[k].toUpperCase()]);
  }

  return ranges;
}

/**
 * @param {Date | Number} date
 * @param {String} fmt
 * @returns {String}
 * @description 格式化日期
 */
export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!isNumber(date) && !isDate(date)) {
    return date;
  }

  if (isNumber(date)) {
    date = new Date(date);
  }

  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return fmt;
}
