// 后缀
export const SUFFIX = {
  YEAR: '年',
  MONTH: '月',
  DAY: '日',
  HOUR: '时',
  MINUTE: '分',
  SECOND: '秒'
};
// 相对应的月份天数
export const MONTH_DAYS_MAP = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
};
export const YEAR_DELTA = 200;
export const CURRENT_YEAR = new Date().getFullYear();
// 默认日期
export const DEFAULT_VALUES = [2020, 1, 1, 0, 0, 0, 0];
// 支持的fields
export const FIELDS = ['year', 'month', 'day', 'hour', 'minute', 'second'];