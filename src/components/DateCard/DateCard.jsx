import { forwardRef, useImperativeHandle, memo, useRef } from 'react';
import { View } from '@tarojs/components';
import dayjs from 'dayjs';
import { MyDatePicker, MyCard } from '../index';
import './DateCard.scss';

function DateCard(props, ref) {
  const {
    title = '',
    required = false,
    minDate = new Date(dayjs().add(10, 'minute').valueOf()),
    maxDate = new Date(dayjs().add(2, 'month').valueOf()),
    defaultDate,
    date,
    onChange = () => {},
  } = props;

  const dateRef = useRef();
  useImperativeHandle(ref, () => ({
    setValue: dateRef.current.setValue,
  }));

  return (
    <MyCard className="card-container">
      <View className="card-date-input-label">
        <View className={`card-input-label-title ${required ? 'input-label-must-mark' : ''}`}>
          截止时间
        </View>
        <MyDatePicker
          ref={dateRef}
          title={title}
          className="card-input-label-date-picker"
          minDate={minDate}
          maxDate={maxDate}
          defaultDate={defaultDate}
          date={date}
          onChange={onChange}
        />
      </View>
    </MyCard>
  );
}

export default memo(forwardRef(DateCard));
