import { useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './PreviewFile.scss';

const imageTypes = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'];
// const videoTypes = ['mp4', '3gp', 'm3u8'];
const fileTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];

function PreviewFile(props) {
  const { children, className = '', filePath = '', filePaths } = props;

  const fileSuffix = useMemo(() => {
    if (!filePath) return '';
    return filePath.slice(filePath.lastIndexOf('.') + 1);
  }, [filePath]);

  const isCanPreview = useMemo(() => {
    return [...imageTypes, ...fileTypes].includes(fileSuffix);
  }, [fileSuffix]);

  const openImage = () => {
    Taro.showLoading({ mask: true, title: '加载中...' });
    Taro.previewImage({
      current: filePath,
      urls: filePaths || [filePath],
      fail: () => {
        Taro.atMessage({
          message: '打开图片失败',
          type: 'error',
        });
      },
      complete: () => {
        Taro.hideLoading();
      },
    });
  };

  const openDocument = () => {
    Taro.showLoading({ mask: true, title: '加载中...' });
    Taro.openDocument({
      filePath,
      fileType: fileSuffix,
      fail: () => {
        Taro.atMessage({
          message: '打开文件失败',
          type: 'error',
        });
      },
      complete: () => {
        Taro.hideLoading();
      },
    });
  };

  const handlePreviewFile = () => {
    if (imageTypes.includes(fileSuffix)) {
      openImage();
    }

    if (fileTypes.includes(fileSuffix)) {
      openDocument();
    }
  };

  return (
    <View
      className={`preview-file ${isCanPreview ? 'click-active' : ''} ${className}`}
      onClick={handlePreviewFile}
    >
      {isCanPreview ? children || '预览' : '不支持预览此文件'}
    </View>
  );
}

export default PreviewFile;
