import Taro from '@tarojs/taro';
import { Image } from '@tarojs/components';

function MyShareImage(props) {
  const { src } = props;

  const onClick = () => {
    Taro.showShareImageMenu({
      path: src,
      fail({ errMsg }) {
        if (errMsg.includes('cancel')) return;
        Taro.atMessage({
          message: '打开二维码失败',
          type: 'error',
        });
      },
    });
  };

  return <Image mode="aspectFit" {...props} onClick={onClick} />;
}

export default MyShareImage;
