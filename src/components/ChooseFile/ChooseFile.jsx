import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { SIZE_20_MB, fmtSize } from '@/utils';
import './ChooseFile.scss';

function ChooseFile(props) {
  const {
    className,
    layout = 'column',
    icon,
    text = '',
    type = 'all',
    iconSize = 40,
    maxSize = SIZE_20_MB,
    count = 1,
    extension,
    sourceType = ['album', 'camera'], // 从 [相册, 相机] 选
    sizeType = ['original', 'compressed'], // [原图, 压缩图]
    onSuccess = () => {},
    onFail = () => {},
    children,
  } = props;

  const successCallback = (target) => {
    const fmtTarget = target;
    if (type === 'video') {
      fmtTarget.tempFiles = [
        { ...target, path: target.tempFilePath, name: target.tempFilePath, type: 'video' },
      ];
    }

    const checkTempFiles = fmtTarget.tempFiles.every((file) => {
      if (file.size > maxSize) {
        Taro.atMessage({
          message: `${file.name}文件大小超出${fmtSize(maxSize)}，请重新选择`,
          type: 'error',
          duration: 4000,
        });
        return false;
      }
      return true;
    });

    if (checkTempFiles) {
      onSuccess(fmtTarget);
    }
  };

  const failCallback = (msg) => {
    if (!msg?.errMsg?.includes('cancel')) {
      Taro.atMessage({
        message: '选择文件失败',
        type: 'error',
      });
      onFail(msg);
    }
  };

  const handleChooseFile = () => {
    if (type === 'video') {
      Taro.chooseVideo({
        sourceType,
        success: successCallback,
        fail: failCallback,
      });
      return;
    }
    if (type === 'album') {
      Taro.chooseImage({
        count,
        sourceType,
        sizeType,
        success: successCallback,
        fail: failCallback,
      });
      return;
    }

    Taro.chooseMessageFile({
      type,
      count,
      extension,
      success: successCallback,
      fail: failCallback,
    });
  };

  if (children) {
    return <View onClick={handleChooseFile}>{children}</View>;
  }

  if (layout === 'column') {
    return (
      <View
        className={`choose-file-component-column click-active ${className}`}
        onClick={handleChooseFile}
      >
        <Image
          src={icon}
          mode="aspectFill"
          style={`width: ${iconSize}px; height: ${iconSize}px; margin-bottom: 5px;`}
        />
        {text}
      </View>
    );
  }

  return (
    <Button
      className={`choose-file-component-row click-active ${className}`}
      onClick={handleChooseFile}
    >
      <Image src={icon} mode="aspectFill" style={`width: ${iconSize}px; height: ${iconSize}px;`} />
      {text}
    </Button>
  );
}

export default ChooseFile;
