import { useEffect, useState, useReducer, useMemo, useCallback } from 'react';
import { View, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import MyDrawer from '../Drawer/Drawer';
import {
  dateFields,
  dateFieldsMap,
  dateFieldsTextMap,
  dateZeroPadding,
  getDate,
  getDateList,
  getFmtDiffTime,
  concatDate,
} from './util';
import './DatePicker.scss';

const initDatesOffsetY = {
  year: 0,
  month: 0,
  day: 0,
  hour: 0,
  minute: 0,
};
function datesOffsetYReducer(state = initDatesOffsetY, action) {
  switch (action.type) {
    case 'year':
    case 'month':
    case 'day':
    case 'hour':
    case 'minute':
      return { ...state, [action.type]: action.value };
    case 'init':
      return action.value;
    default:
      return state;
  }
}

const TTF1 = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const TTF2 = 'cubic-bezier(0.44, 0.16, 0.91, 0.61)';

const initDateFieldsInfo = dateFields.reduce((result, date) => {
  result[date] = {
    isMoving: false, // 当前是否在移动
    transitionDuration: 0, // 滑动的消耗时间
    transitionTimingFunction: TTF1, // 滑动的动画
    field: '', // 当前是哪列
    startY: 0, // 开始点击下的位置对应屏幕偏移量
    fieldOffsetY: 0, // 开始点击下的当前列的整体偏移量
    lastMoveTimeStamp: 0, // 最后手动移动的时间戳
    lastMoveOffsetY: 0, // 最后手动移动的对应偏移位置
  };
  return result;
}, {});
const touchInfo = {
  status: {
    currentField: '',
  },
  ...initDateFieldsInfo,
};

function MyDatePicker(props) {
  const {
    mode = 'YYYY-MM-DD-hh-mm',
    className = '',
    title = '',
    diffTime = true,
    rowHeight = 50,
    defaultVisible = false,
    deceleration = -0.003, // 反向加速度
    visible,
    onVisibleChange,
    date,
    defaultDate,
    minDate,
    maxDate,
    onChange = () => {},
    children,
  } = props;

  const [isVisible, setIsVisible] = useState(visible || defaultVisible);
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const [dateInfo, setDateInfo] = useState(getDate(date || defaultDate));
  const titleMemo = useMemo(() => {
    if (title) return title;

    if (diffTime) {
      const { year, month, day, hour, minute } = dateInfo;
      const [count, unit] = getFmtDiffTime(
        new Date(),
        new Date(year, month - 1, day, hour, minute, 0)
      );
      return `${count}${unit}后`;
    }

    return '';
  }, [title, diffTime, dateInfo]);

  const dateFieldsMemo = useMemo(() => {
    return mode.split('-').map((field) => dateFieldsMap[field]);
  }, [mode]);

  const [minDateMemo, maxDateMemo] = useMemo(() => {
    return [getDate(minDate || new Date('2000')), getDate(maxDate || new Date('2030'))];
  }, [minDate, maxDate]);

  const [datesOffsetY, dispatchDatesOffsetY] = useReducer(datesOffsetYReducer, initDatesOffsetY);
  const dateFieldsListMemo = useMemo(() => {
    const [dateFieldsList, newDateInfo] = getDateList({
      dateFields: dateFieldsMemo,
      minDate: minDateMemo,
      maxDate: maxDateMemo,
      curDate: { ...dateInfo },
    });

    const dateInfoDiff = concatDate(newDateInfo) !== concatDate(dateInfo);
    if (dateInfoDiff) {
      setDateInfo(newDateInfo);
    }

    const newDatesOffsetY = Object.values(dateFieldsList).reduce((result, { field, count }) => {
      result[field] = count * rowHeight;
      return result;
    }, {});
    dispatchDatesOffsetY({ type: 'init', value: newDatesOffsetY });

    return dateFieldsList;
  }, [dateFieldsMemo, minDateMemo, maxDateMemo, dateInfo, rowHeight]);

  const getDateFromOffset = () => {
    const newDateInfo = dateFields.reduce((result, date) => {
      const index = Math.abs(datesOffsetY[date]) / rowHeight;
      result[date] = dateFieldsListMemo[date].dates[index];
      return result;
    }, {});

    setDateInfo(newDateInfo);
  };

  const limitMove = (field) => {
    // 当前列的总偏移量
    const offsetY = datesOffsetY[field];
    // 当前列的向上最大偏移量
    const maxOffsetY = (dateFieldsListMemo[field].dates.length - 1) * rowHeight;
    // 限制后的真实总偏移量
    const realOffsetY = Math.min(Math.max(0, offsetY), maxOffsetY);

    if (realOffsetY === offsetY) {
      touchInfo[field].isMoving = false;
      touchInfo[field].transitionDuration = 0;
      const allStopMoving = dateFields.every((field) => !touchInfo[field].isMoving);
      if (allStopMoving) getDateFromOffset();
    } else {
      touchInfo[field].transitionDuration = 200;
      touchInfo[field].transitionTimingFunction = TTF2;
      dispatchDatesOffsetY({ type: field, value: realOffsetY });
    }
  };

  const onTouchStart = useCallback(
    (e, field, columnHeight) => {
      const { timeStamp, changedTouches } = e;
      const { pageY } = changedTouches[0];

      touchInfo.status.currentField = field;
      touchInfo[field] = {
        field,
        columnHeight,
        isMoving: true,
        transitionDuration: 0,
        transitionTimingFunction: TTF1,
        startY: Math.round(pageY),
        fieldOffsetY: datesOffsetY[field],
        lastMoveTimeStamp: timeStamp,
        lastMoveOffsetY: Math.round(pageY),
      };
    },
    [datesOffsetY]
  );

  const onTouchMove = useCallback(
    (e) => {
      const { timeStamp, changedTouches } = e;
      const { pageY } = changedTouches[0];
      const {
        status: { currentField },
      } = touchInfo;
      const { columnHeight, fieldOffsetY, startY, lastMoveTimeStamp } = touchInfo[currentField];

      // 目标位置
      let destination = Math.round(fieldOffsetY - pageY + startY);
      const maxOffset = columnHeight - rowHeight;
      if (destination > maxOffset) {
        destination = (destination - maxOffset) / 5 + maxOffset;
      }
      if (destination < 0) {
        destination = destination / 5;
      }

      dispatchDatesOffsetY({ type: currentField, value: destination });

      if (timeStamp - lastMoveTimeStamp > 300) {
        touchInfo[currentField].lastMoveTimeStamp = timeStamp;
        touchInfo[currentField].lastMoveOffsetY = Math.round(pageY);
      }
    },
    [rowHeight]
  );

  const onTouchEnd = useCallback(
    (e) => {
      const { timeStamp, changedTouches } = e;
      const { pageY } = changedTouches[0];
      const {
        status: { currentField },
      } = touchInfo;
      const { columnHeight, lastMoveTimeStamp, lastMoveOffsetY } = touchInfo[currentField];

      const maxOffset = columnHeight - rowHeight;

      if (datesOffsetY[currentField] > maxOffset || datesOffsetY[currentField] < 0) {
        limitMove(currentField);
        return;
      }

      touchInfo[currentField].transitionDuration = 500;
      // 平均速度
      const speed = (pageY - lastMoveOffsetY) / (timeStamp - lastMoveTimeStamp);
      // 最终停止的位置
      let destination =
        Math.round((datesOffsetY[currentField] + speed / deceleration) / rowHeight) * rowHeight;

      if (destination > maxOffset) {
        touchInfo[currentField].transitionDuration = 250;
        destination = (destination - maxOffset) / 5 + maxOffset;
        destination = Math.min(destination, maxOffset + rowHeight);
      }
      if (destination < 0) {
        touchInfo[currentField].transitionDuration = 250;
        destination = destination / 5;
        destination = Math.max(destination, -rowHeight);
      }

      dispatchDatesOffsetY({
        type: currentField,
        value: destination,
      });
    },
    [datesOffsetY, rowHeight, deceleration]
  );

  const dateFieldsZeroPadding = (dateInfo) => {
    return dateFieldsMemo.reduce((result, field) => {
      result[field] = dateZeroPadding(dateInfo[field]);
      return result;
    }, {});
  };

  const [showDate, setShowDate] = useState(dateFieldsZeroPadding(getDate(date || defaultDate)));
  useEffect(() => {
    if (date) {
      setDateInfo(getDate(date));
      setShowDate(dateFieldsZeroPadding(getDate(date)));
    }
  }, [date]);

  const onClose = () => {
    if (typeof visible === 'boolean' && onVisibleChange) {
      onVisibleChange(false);
    } else {
      setIsVisible(false);
    }
  };

  const onConfirm = () => {
    if (!date) {
      setShowDate(dateFieldsZeroPadding(dateInfo));
    }
    const { year, month, day, hour, minute } = dateInfo;
    onChange(new Date(year, month - 1, day, hour, minute));
    onClose();
  };

  return (
    <View className={`my-date-picker-container ${className}`}>
      <View className="my-date-picker-input" onClick={() => setIsVisible(true)}>
        {children || (
          <>
            <View className="my-date-picker-input-date">
              <View className="my-date-picker-input-day">
                {`${showDate.year}年${showDate.month}月${showDate.day}日`}
              </View>
              <View className="my-date-picker-input-time">{`${showDate.hour}点${showDate.minute}分`}</View>
            </View>
            <View className="at-icon at-icon-chevron-right my-date-picker__icon" />
          </>
        )}
      </View>

      <MyDrawer visible={isVisible} onClose={onClose}>
        <View className="my-date-picker-drawer">
          <View className="my-date-picker-drawer-header">
            <Button
              className="my-date-picker-drawer-header-btn my-date-picker-drawer-header-btn__cancel"
              onClick={onClose}
            >
              取消
            </Button>
            <View>{titleMemo}</View>
            <Button
              className="my-date-picker-drawer-header-btn my-date-picker-drawer-header-btn__confirm"
              onClick={onConfirm}
            >
              确定
            </Button>
          </View>

          <View className="my-date-picker-drawer-content" catchMove catchEvent>
            <View
              className="my-date-picker-date"
              style={{ transform: `translateY(-${rowHeight / 2}px)` }}
            >
              {Object.values(dateFieldsListMemo).map(({ field, dates }) => (
                <View
                  key={field}
                  className="my-date-picker-column"
                  style={{
                    transform: `translateY(${-datesOffsetY[field]}px)`,
                    transitionDuration: `${touchInfo[field].transitionDuration}ms`,
                    transitionTimingFunction: touchInfo[field].transitionTimingFunction,
                  }}
                  onTransitionEnd={() => limitMove(field)}
                >
                  {dates.map((date) => (
                    <View key={date} className="my-date-picker-row" style={{ height: rowHeight }}>
                      {`${dateZeroPadding(date)}${dateFieldsTextMap[field]}`}
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View className="my-date-picker-mask">
              <View className="my-date-picker-mask-up" />
              <View className="my-date-picker-mask-center" style={{ height: rowHeight }} />
              <View className="my-date-picker-mask-down" />

              <View className="my-date-picker-mask-column-container">
                {Object.values(dateFieldsListMemo).map(({ field, dates }) => (
                  <View
                    catchMove
                    catchEvent
                    key={field}
                    className="my-date-picker-mask-column"
                    onTouchStart={(e) => onTouchStart(e, field, dates.length * rowHeight)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </MyDrawer>
    </View>
  );
}

export default MyDatePicker;
