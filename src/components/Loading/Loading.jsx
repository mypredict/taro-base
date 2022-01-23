import React from 'react';
import { View } from '@tarojs/components';
import MyMask from '../Mask/Mask';
import './Loading.scss';

function Loading(props) {
  const {
    className,
    style,
    visible = true,
    mask = false,
    size = 15,
    title = '',
    color = '#999',
  } = props;

  if (!visible) return null;

  if (mask) {
    return (
      <MyMask>
        <View className={`my-loading ${className}`} style={style}>
          <View className="my-loading-circle" style={{ width: size, height: size }} />
        </View>
      </MyMask>
    );
  }

  return (
    <View className={`my-loading ${className}`} style={style}>
      <View
        className="my-loading-circle"
        style={{ width: size, height: size, borderColor: color, marginRight: title ? 10 : 0 }}
      />
      {title}
    </View>
  );
}

export default Loading;
