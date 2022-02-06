import { memo } from 'react';
import { View } from '@tarojs/components';
import Iconfont from '@/assets/iconfont';
import './IconFont.scss';

function IconFont(props) {
  const { className, onClick = () => {}, color = 'rgba(0, 0, 0, 0.8)', size = 28 } = props;

  return (
    <View className={`iconfont-comp ${className}`} onClick={onClick}>
      <Iconfont {...props} color={color} size={size} />
    </View>
  );
}

export default memo(IconFont);
