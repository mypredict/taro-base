import Taro from '@tarojs/taro';
import { Image } from '@tarojs/components';

function MyImage(props) {
  const { src, urls } = props;

  const onClick = () => {
    Taro.previewImage({
      current: src,
      urls: urls || [src],
    });
  };

  return <Image mode="aspectFit" {...props} onClick={onClick} />;
}

export default MyImage;
