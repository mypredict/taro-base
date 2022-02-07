import { memo } from 'react';
import { View } from '@tarojs/components';
import './Progress.scss';

function Progress(props) {
  const {
    status = 'ok',
    className,
    style,
    isHidePercent,
    value = 0,
    maxValue = 100,
    strokeWidth = 10,
    color,
  } = props || {};

  const percent = Math.floor((value / maxValue) * 100);

  return (
    <View className={`progress-comp ${className}`} style={{ ...style, height: strokeWidth }}>
      <View className="progress-percent-container">
        <View
          className={`progress-percent progress-percent__${status}`}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </View>

      {!isHidePercent && <View className="progress-percent-number">{`${percent}%`}</View>}
    </View>
  );
}

export default memo(Progress);
