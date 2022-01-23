import React, {
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
  useMemo,
  useImperativeHandle,
} from 'react';
import Taro from '@tarojs/taro';
import { AtIcon } from 'taro-ui';
import { View, Image } from '@tarojs/components';
import { MyDrawer } from '../basic_components';
import useUploadFile from './useUploadFile';
import { fmtSize } from '@/utils/index';
import { statusMapIcon, fileChooseTypes, imageChooseTypes } from './constants';
import './UploadFile.scss';

function UploadFile(props, ref) {
  const {
    className = '',
    showDashboard = true,
    preview = 'file', // file | image 预览效果
    chooseTypes, // 选择来源
    extension, // 过滤扩展名
    count = 9, // 每次选择最多个数
    maxSize = 52428800, // 总体积
    unit = 'MB', // 总体积单位
    limit = 3, // 并发数
    url, // 上传 url
    name = 'file', // 上传类型
    scene, // 上传来源
    token, // 上传携带token
    onChange = () => {},
  } = props;

  const {
    fileList,
    successCount,
    totalSize,
    fileListMap,
    addFiles,
    deleteFile,
    reUploadFile,
    setFiles,
  } = useUploadFile({ limit, url, name, scene, token });

  useImperativeHandle(ref, () => {
    return {
      setFiles(files) {
        setFiles(files);
      },
      addFiles(newFiles) {
        setFiles((oldFiles) => [...newFiles, ...oldFiles]);
      },
    };
  });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const onChooseType = (option) => {
    setDrawerVisible(false);
    handleChooseFile(option);
  };

  const chooseTypesMemo = useMemo(() => {
    if (chooseTypes) return chooseTypes;
    if (preview === 'image') return imageChooseTypes;
    return fileChooseTypes;
  }, [chooseTypes, preview]);

  // 选择文件
  const albumCountRef = useRef(0);
  const handleChooseFile = ({ from, type }) => {
    const successCallback = (tempFiles) => {
      // 过滤掉重复和超出大小限制的文件
      let newTotalSize = 0;
      const filterFiles = tempFiles.filter(({ type, name, size }) => {
        const isRepeat = fileListMap[`${type}_${name}_${size}`];
        if (isRepeat) return false;

        if (newTotalSize + size + totalSize <= maxSize) {
          newTotalSize += size;
          return true;
        }
        return false;
      });

      // 格式化文件参数
      const newFiles = filterFiles.map((file) => ({
        ...file,
        progress: 0,
        status: 'pendding',
        handles: null,
      }));

      addFiles(newFiles);
    };

    const errorCallback = (errMsg) => {
      if (!errMsg.includes('cancel')) {
        console.log(errMsg);
      }
    };

    if (from === 'wechat') {
      Taro.chooseMessageFile({
        type,
        extension,
        count,
        success({ tempFiles }) {
          successCallback(tempFiles);
        },
        fail({ errMsg }) {
          errorCallback(errMsg);
        },
      });
      return;
    }

    if (from === 'album') {
      Taro.chooseImage({
        count,
        sourceType: 'album',
        success({ tempFiles }) {
          const newTempFiles = tempFiles.map((file) => {
            albumCountRef.current++;
            return {
              ...file,
              type: 'image',
              name: `相册图片_${albumCountRef.current}.${file.path.split('.')[1]}`,
            };
          });
          successCallback(newTempFiles);
        },
        fail({ errMsg }) {
          errorCallback(errMsg);
        },
      });
    }
  };

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    if (typeof onChangeRef.current === 'function') {
      const isComplate = fileList.every(({ status }) => status === 'error' || status === 'ok');
      onChangeRef.current({ isComplate, fileList });
    }
  }, [fileList]);

  return (
    <View className={`upload-file-container ${className}`}>
      <MyDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
        <View className="upload-choose-container">
          {chooseTypesMemo.map((item) => (
            <View
              key={`${item.from}_${item.type}`}
              className="upload-choose"
              onClick={() => onChooseType(item)}
            >
              {item.text}
            </View>
          ))}
          <View className="upload-choose" onClick={() => setDrawerVisible(false)}>
            取消
          </View>
        </View>
      </MyDrawer>
      <View className="upload-btn" onClick={() => setDrawerVisible(true)}>
        {preview === 'file' ? '上传文件' : '上传图片'}
      </View>
      {showDashboard && (
        <View className="upload-dashboard">
          <View className="upload-file-count">
            数量: {successCount}/{fileList.length}
          </View>
          <View className="upload-file-size">
            大小: {fmtSize(totalSize, { unit })}/{fmtSize(maxSize, { unit })}
          </View>
        </View>
      )}
      {preview === 'file' ? (
        <View className="upload-file-list">
          {fileList.map((file) => {
            const { name, path, size, status, progress } = file;
            return (
              <View key={path} className="upload-item">
                <View
                  className={`
                    upload-file-info
                    ${status === 'pause' ? 'upload-file-info-pause' : ''}
                    ${status === 'error' ? 'upload-file-info-error' : ''}
                  `}
                >
                  <View className="upload-file-text">
                    <View className="upload-file-name">{name}</View>
                    <View className="upload-file-size">{fmtSize(size)}</View>
                  </View>
                  <View className="upload-file-progress__container">
                    <View className="upload-file-progress" style={{ width: `${progress}%` }} />
                  </View>
                </View>
                <View className="upload-file-operation">
                  {status === 'pendding' || status === 'uploading' ? (
                    <View className="upload-progress-text">{`${Math.floor(progress)}%`}</View>
                  ) : (
                    <AtIcon
                      className="upload-file-icon"
                      value={statusMapIcon[status]}
                      size={20}
                      onClick={() => status === 'error' && reUploadFile(file)}
                    />
                  )}
                  <AtIcon
                    className="upload-file-icon"
                    value="close"
                    size={20}
                    onClick={() => deleteFile(file)}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View className="upload-image-list">
          {fileList.map((file) => {
            const { path, status, progress } = file;
            return (
              <View key={path} className={`upload-image-item upload-image-item__${status}`}>
                <Image src={path} mode="aspectFill" style="width: 100%; height: 100%;" />
                <View className="upload-image-item-delete-mask">
                  <AtIcon
                    className="upload-file-icon"
                    value="close"
                    size={15}
                    color={'#fff'}
                    onClick={() => deleteFile(file)}
                  />
                </View>
                {(status === 'pendding' || status === 'uploading') && (
                  <View
                    className="upload-image-item-progress-mask"
                    style={{ height: `${100 - progress}%` }}
                  />
                )}
                {status === 'error' && (
                  <View className="upload-image-item-error-mask" onClick={() => reUploadFile(file)}>
                    <AtIcon
                      className="upload-file-icon"
                      value={statusMapIcon.error}
                      size={40}
                      color={'#fff'}
                    />
                  </View>
                )}
              </View>
            );
          })}
          <View className="upload-image-item-fill" />
        </View>
      )}
    </View>
  );
}

export default memo(forwardRef(UploadFile));
