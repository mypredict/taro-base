import { memo } from 'react';
import { View, Image } from '@tarojs/components';
import './Avatar.scss';

function MyAvatar(props) {
  const { className, style, src, size } = props;

  return (
    <View
      className={`my-avatar ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <Image src={src} mode="aspectFill" style="width: 100%; height: 100%;" />
    </View>
  );
}

export default memo(MyAvatar);
