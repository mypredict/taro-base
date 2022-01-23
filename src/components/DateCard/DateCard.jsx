import { memo } from 'react';
import { View } from '@tarojs/components';
import dayjs from 'dayjs';
import { MyDatePicker, MyCard } from '../basic_components/index';
import './DateCard.scss';

function DateCard(props) {
  const {
    title = '',
    minDate = new Date(dayjs().add(10, 'minute').valueOf()),
    maxDate = new Date(dayjs().add(2, 'month').valueOf()),
    defaultDate,
    date,
    onChange = () => {},
  } = props;

  return (
    <MyCard className="card-container">
      <View className="card-date-input-label">
        <View className="card-input-label-title input-label-must-mark">截止时间</View>
        <MyDatePicker
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

export default memo(DateCard);
