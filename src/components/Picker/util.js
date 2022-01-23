export const dateFields = ['year', 'month', 'day', 'hour', 'minute'];

export const dateFieldsMap = {
  YYYY: 'year',
  MM: 'month',
  DD: 'day',
  hh: 'hour',
  mm: 'minute',
};

export const dateFieldsTextMap = {
  year: '年',
  month: '月',
  day: '日',
  hour: '时',
  minute: '分',
};

// 二分查找
export function binarySearch(arr, target) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const index = Math.floor((end - start) / 2) + start;
    if (arr[index] === target) return index;
    if (arr[index] > target) {
      end = index - 1;
    } else {
      start = index + 1;
    }
  }

  return -1;
}

export function dateZeroPadding(num) {
  return String(num).length === 1 ? `0${num}` : String(num);
}

// 取数字范围内
export function getRangeNumber(min, max, count) {
  return Math.min(Math.max(min, count), max);
}

// 获取相应日期的时间对应时间段
export function getDate(date = new Date(), dual = false) {
  if (dual) {
    return {
      year: date.getFullYear(),
      month: dateZeroPadding(date.getMonth() + 1),
      week: date.getDay() || 7,
      day: dateZeroPadding(date.getDate()),
      hour: dateZeroPadding(date.getHours()),
      minute: dateZeroPadding(date.getMinutes()),
      second: dateZeroPadding(date.getSeconds()),
    }
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: date.getDay() || 7,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  }
}

// 获取对应年月有几天
export function getMonthDays(year, month) {
  const { year: currentYear, month: currentMonth } = getDate();
  const targetDay = new Date(year || currentYear, month || currentMonth, 0);

  return targetDay.getDate();
}

export function getArrayFromRange(start, end) {
  const result = [start];

  while(start < end) {
    start++;
    result.push(start);
  }

  return result;
}

export function limitDate({ dateFields, minDate, maxDate, curDate }) {
  const newDate = {};

  let minDateStr = '';
  let maxDateStr = '';
  let curDateStr = '';

  dateFields.forEach((field) => {
    let value = curDate[field];

    if (minDateStr === curDateStr) {
      value = Math.max(minDate[field], value);
    }

    if (maxDateStr === curDateStr) {
      value = Math.min(maxDate[field], value);
    }

    minDateStr += dateZeroPadding(minDate[field]);
    maxDateStr += dateZeroPadding(maxDate[field]);
    curDateStr += dateZeroPadding(value);

    newDate[field] = value;
  });

  return newDate;
}

/*
  return {
    field: 'year' | 'month' | 'day' | 'hour' | 'minute'; // 时间单位
    dates: Array<number>; // 对应时间单位取值区间
    value: number; // 当前时间单位对应值
    count: number; // 当前时间在区间中的坐标
  }
*/
export function getDateList({ dateFields, minDate, maxDate, curDate }) {
  const { year: minYear, month: minMonth, day: minDay, hour: minHour, minute: minMinute } = minDate;
  const { year: maxYear, month: maxMonth, day: maxDay, hour: maxHour, minute: maxMinute } = maxDate;
  const { year: curYear, month: curMonth } = curDate;

  let minDateStr = '';
  let maxDateStr = '';
  let curDateStr = '';
  const concatDate = (field) => {
    minDateStr += dateZeroPadding(minDate[field]);
    maxDateStr += dateZeroPadding(maxDate[field]);
    curDateStr += dateZeroPadding(curDate[field]);
  };

  const newDate = curDate;

  const dateInfoMap = {};
  const giveDateInfo = (field, dates, min, max) => {
    const value = Math.min(Math.max(curDate[field], min), max);
    if (value !== curDate[field]) {
      newDate[field] = value;
    }
    dateInfoMap[field] = { field, dates, value, count: binarySearch(dates, value) };
    concatDate(field);
  };

  dateFields.forEach((field) => {
    switch(field) {
      case 'year': {
        const min = minYear;
        const max = maxYear;
        const yearRange = getArrayFromRange(min, max);
        giveDateInfo(field, yearRange, min, max);
        break;
      }

      case 'month': {
        const min = curDateStr === minDateStr ? minMonth : 1;
        const max = curDateStr === maxDateStr ? maxMonth : 12;
        const monthRange = getArrayFromRange(min, max);
        giveDateInfo(field, monthRange, min, max);
        break;
      }

      case 'day': {
        const min = curDateStr === minDateStr ? minDay : 1;
        const max = curDateStr === maxDateStr ? maxDay : getMonthDays(curYear, curMonth);
        const dayRange = getArrayFromRange(min, max);
        giveDateInfo(field, dayRange, min, max);
        break;
      }

      case 'hour': {
        const min = curDateStr === minDateStr ? minHour : 0;
        const max = curDateStr === maxDateStr ? maxHour : 23;
        const hourRange = getArrayFromRange(min, max);
        giveDateInfo(field, hourRange, min, max);
        break;
      }

      case 'minute': {
        const min = curDateStr === minDateStr ? minMinute : 0;
        const max = curDateStr === maxDateStr ? maxMinute : 59;
        const minuteRange = getArrayFromRange(min, max);
        giveDateInfo(field, minuteRange, min, max);
        break;
      }

      default:
        break;
    }
  });

  return [dateInfoMap, newDate];
}

const oneMinuteMs = 1000 * 60;
const oneHourMs = oneMinuteMs * 60;
const oneDayMs = oneHourMs * 24;
export function getFmtDiffTime(start, end) {
  const diffTime = end.getTime() - start.getTime();

  const computeTime = (ms, decimal = 1) => {
    if (decimal) {
      return String(Number((diffTime / ms).toFixed(decimal)));
    }

    return Math.floor(Number(diffTime / ms));
  };

  if (diffTime < oneHourMs) return [computeTime(oneMinuteMs), '分钟'];

  if (diffTime < oneDayMs) return [computeTime(oneHourMs), '小时'];

  return [computeTime(oneDayMs), '天'];
}

export function concatDate(dayInfo, fields = ['year', 'month', 'day', 'hour', 'minute']) {
  return fields
    .map(field => {
      if (field === 'month' || field === 'day') {
        return dateZeroPadding(dayInfo[field]);
      }
      return dayInfo[field];
    })
    .join('');
}
