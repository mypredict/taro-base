import { useCallback, useRef, useState, useMemo } from 'react';
import Taro from '@tarojs/taro';

function useUploadFiles(options) {
  const { url, limit = 3, name = 'file', scene, token } = options;

  const fileListRef = useRef([]);

  const [fileList, setFileList] = useState([]);

  const [successCount, totalSize, fileListMap] = useMemo(() => {
    let successCount = 0;
    let totalSize = 0;
    const fileListMap = {};
    fileList.forEach((file, index) => {
      if (file.status === 'ok') successCount++;
      totalSize += file.size;
      fileListMap[`${file.type}_${file.name}_${file.size}`] = { ...file, index };
    });
    return [successCount, totalSize, fileListMap];
  }, [fileList]);

  const uploadFile = useCallback(() => {
    let uploadingCount = 0;
    let nextUploadFile = null;
    fileListRef.current.forEach((file) => {
      const { status } = file;
      if (status === 'uploading') uploadingCount++;
      // 遇到的第一个pendding文件存下
      if (status === 'pendding' && !nextUploadFile) {
        nextUploadFile = file;
      }
    });

    if (!nextUploadFile || uploadingCount >= limit) {
      setFileList([...fileListRef.current]);
      return;
    }

    nextUploadFile.status = 'uploading';

    const uploadTask = Taro.uploadFile({
      url,
      filePath: nextUploadFile.path,
      name,
      formData: { scene },
      header: {
        'content-type': 'multipart/form-data',
        'X-LOGIN-TOKEN': token,
      },
      success(res) {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          nextUploadFile.status = data.code === 0 ? 'ok' : 'error';
          if (data.code === 0) {
            nextUploadFile.progress = 100;
            nextUploadFile.fileId = data.data.fileId;
          }
        } else {
          nextUploadFile.status = 'error';
        }

        uploadFile();
      },
      fail() {
        nextUploadFile.status = 'error';
        uploadFile();
      },
    });

    nextUploadFile.handles = uploadTask;

    uploadTask.progress(({ progress }) => {
      if (nextUploadFile.status === 'uploading') {
        const realProgress = progress === 100 ? 99 : progress;
        nextUploadFile.progress = realProgress;
        setFileList([...fileListRef.current]);
      }
    });

    if (uploadingCount < limit - 1) {
      uploadFile();
    }
  }, [url, limit, name, scene, token]);

  const addFiles = useCallback((files = []) => {
    fileListRef.current = [...fileListRef.current, ...files];
    uploadFile();
  }, [uploadFile]);

  const deleteFile = useCallback((file) => {
    const newFileList = fileListRef.current.filter(({ path }) => {
      const hitTarget = file.path === path;
      if (hitTarget && file?.handles) {
        file.handles.abort();
      }
      return !hitTarget;
    });
    fileListRef.current = newFileList;
    uploadFile();
  }, [uploadFile]);

  const reUploadFile = useCallback((file) => {
    const targetFile = fileListRef.current.find(({ path }) => file.path === path);
    targetFile.status = 'pendding'
    uploadFile();
  }, [uploadFile]);

  const setFiles = useCallback((arg) => {
    if (typeof arg === 'function') {
      fileListRef.current = arg(fileListRef.current);
    }
    if (Array.isArray(arg)) {
      fileListRef.current = arg;
    }
    uploadFile();
  }, []);

  return {
    fileList,
    successCount,
    totalSize,
    fileListMap,
    addFiles,
    deleteFile,
    reUploadFile,
    setFiles,
  };
}

export default useUploadFiles;
