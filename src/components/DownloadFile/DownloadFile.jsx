import React, { memo, useState, useMemo, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { AtFloatLayout, AtProgress, AtMessage } from 'taro-ui';
import { View } from '@tarojs/components';
import { MyButton } from '../index';
import { fmtSize } from '@/utils/index';
import useRequest from '@/hooks/useRequest';
import { getUserToken, postPackFile, queryPackInfo, fileBaseUrl } from '@/apis';
import './DownloadFile.scss';

function DownloadFile(props) {
  const { visible, className, style, onClose, url, name, suffix = '', taskId } = props;

  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSize, setDownloadSize] = useState(0);

  useEffect(() => {
    const resetFile = () => {
      setFile(undefined);
      setProgress(0);
      setDownloadSize(0);
    };
    Taro.eventCenter.on('fileChange', resetFile);
    return () => {
      Taro.eventCenter.off('fileChange', resetFile);
    };
  }, []);

  const downloadFile = async (fileUrl, standbyUrl) => {
    setError(false);
    setLoading(true);
    setDownloadSize(0);
    setGenerating(false);
    const token = await getUserToken();
    const downloadTask = Taro.downloadFile({
      url: fileUrl || url,
      filePath: `${Taro.env.USER_DATA_PATH}/${name}${suffix}`,
      header: { 'X-LOGIN-TOKEN': token },
      success: (res) => {
        if (res.statusCode === 200) {
          setFile(res);
          setProgress(100);
          shareFile(res);
          setLoading(false);
          return;
        }

        if (standbyUrl) {
          downloadFile(standbyUrl);
          return;
        }

        setError(true);
        Taro.atMessage({
          message: '文件下载失败，请稍后重试',
          type: 'error',
        });
      },
      fail: () => {
        if (standbyUrl) {
          downloadFile(standbyUrl);
          return;
        }
        setError(true);
        setLoading(false);
        Taro.atMessage({
          message: '文件下载失败，请稍后重试',
          type: 'error',
        });
      },
    });

    downloadTask.progress(({ progress, totalBytesWritten }) => {
      setProgress((old) => (progress > old ? progress : old));
      setDownloadSize(totalBytesWritten);
    });
  };

  const { run, res: packFileRes } = useRequest(postPackFile);
  // 点击下载
  const onClickDownload = () => {
    // 可以直接下载的
    if (!taskId) {
      downloadFile();
      return;
    }

    // 有taskId需要先生成文件再下载的
    setGenerating(true);
    setLoading(true);
    run({ taskId }).catch(() => {
      setGenerating(false);
      setLoading(false);
    });
  };

  // 打包下载文件及轮询
  useEffect(() => {
    let timer = null;
    if (generating && packFileRes?.packId) {
      timer = setInterval(() => {
        queryPackInfo({ packId: packFileRes.packId })
          .then(({ res }) => {
            const downLoadPath = res?.data?.data?.downLoadPath;
            const fastDownUrl = res?.data?.data?.fastDownUrl;
            if (downLoadPath && timer) {
              clearInterval(timer);
              timer = null;
              if (fastDownUrl) {
                downloadFile(fastDownUrl, `${fileBaseUrl}${downLoadPath}`);
              } else {
                downloadFile(`${fileBaseUrl}${downLoadPath}`);
              }
            }
          })
          .catch(() => {
            setGenerating(false);
            setLoading(false);
          });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [generating, packFileRes]);

  // 文件已经下载完毕, 分享操作
  const shareFile = (fileInfo) => {
    const filePath = fileInfo?.filePath || fileInfo?.tempFilePath || file?.filePath;
    Taro.shareFileMessage({ filePath });
  };

  // 不同状态下按钮的展示文本
  const btnText = useMemo(() => {
    if (generating) return '文件生成中';

    if (loading) return '正在下载';

    if (file) return '发送到微信';

    return '开始下载';
  }, [loading, generating, file]);

  return (
    <>
      <AtMessage />
      <AtFloatLayout
        isOpened={visible}
        title="下载文件"
        onClose={onClose}
        style={{ zIndex: 10000 }}
      >
        <View className={`download-file-container ${className}`} style={style}>
          <View>
            {file ? '下载完成' : '已下载'}：{fmtSize(downloadSize)}
          </View>
          <AtProgress
            className="download-file-progress"
            percent={progress}
            strokeWidth={6}
            color={error ? '#999' : 'rgba(127, 195, 251, 0.8)'}
          />
          <MyButton
            loading={loading}
            className="download-file-btn"
            onClick={file ? shareFile : onClickDownload}
          >
            {btnText}
          </MyButton>
        </View>
      </AtFloatLayout>
    </>
  );
}

export default memo(DownloadFile);
