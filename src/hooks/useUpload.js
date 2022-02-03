import { useCallback, useMemo, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { useSystem } from '@/hooks';
import { getUuid } from '@/utils';
import { getUploadProgress } from '@/apis';

export const FILE_STATUS = {
  uploading: 'uploading',
  pendding: 'pendding',
  ok: 'ok',
  error: 'error',
};

function useUpload(options) {
  const {
    url,
    name = 'file',
    formData,
    header = {},
    limit = 3,
    loopTime = 1000,
    onSuccess = () => {},
    onFail = () => {},
  } = options || {};

  const { lowerPlatform } = useSystem();

  const filesRef = useRef([]);

  const [files, setFiles] = useState([]);
  const filesMap = useMemo(() => {
    return files.reduce((result, file) => {
      result[file.id] = file;
      return result;
    }, {});
  }, [files]);

  const fileClearInterval = useCallback((file) => {
    if (file?.handles?.timer) {
      clearInterval(file.handles.timer);
      file.handles.timer = null;
    }
  }, []);

  const getNextFile = () => {
    let uploadingCount = 0;
    let nextFile = null;
    filesRef.current.forEach((file) => {
      const { status } = file;
      if (status === FILE_STATUS.uploading) uploadingCount++;
      // 遇到的第一个pendding文件存下
      if (status === FILE_STATUS.pendding && !nextFile) {
        nextFile = file;
      }
    });
    if (!nextFile || uploadingCount >= limit) {
      setFiles([...filesRef.current]);
      return null;
    }

    nextFile.status = FILE_STATUS.uploading;
    nextFile.uploadId = getUuid();
    nextFile.uploadSize = 0;
    if (!nextFile.handles) {
      nextFile.handles = {};
    }
    return nextFile;
  };

  const uploadFile = () => {
    const nextFile = getNextFile();
    if (!nextFile) return;

    const uploadTask = Taro.uploadFile({
      url,
      filePath: nextFile.path,
      name,
      formData,
      header: {
        uploadId: nextFile.uploadId,
        ...header,
      },
      success(res) {
        fileClearInterval(nextFile);
        const data = JSON.parse(res.data);
        if (res.statusCode === 200 && data.code === 0) {
          nextFile.status = FILE_STATUS.ok;
          nextFile.progress = 100;
          nextFile.uploadSize = nextFile.size;
          nextFile.fileId = data.data.fileId;
          onSuccess(nextFile, filesRef.current);
        } else {
          nextFile.status = FILE_STATUS.error;
          onFail(nextFile, filesRef.current);
        }
        uploadFile();
      },
      fail() {
        fileClearInterval(nextFile);
        nextFile.status = FILE_STATUS.error;
        onFail(nextFile);
        uploadFile();
      },
    });

    nextFile.handles.uploadTask = uploadTask;

    if (lowerPlatform.includes('iphone')) {
      uploadTask.progress(({ progress }) => {
        if (nextFile.status === FILE_STATUS.uploading) {
          nextFile.progress = Math.min(Math.max(progress, nextFile.progress), 99);
          nextFile.uploadSize = Math.floor(nextFile.size * (nextFile.progress / 100));
          setFiles([...filesRef.current]);
        }
      });
    } else {
      nextFile.handles.timer = setInterval(() => {
        getUploadProgress({ uploadId: nextFile.uploadId })
          .then(({ res }) => {
            if (nextFile.status === FILE_STATUS.uploading) {
              const progress = res?.data?.data?.progress;
              nextFile.progress = Math.min(Math.max(progress, nextFile.progress), 99);
              nextFile.uploadSize = Math.floor(nextFile.size * (nextFile.progress / 100));
              setFiles([...filesRef.current]);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, loopTime);
    }

    uploadFile();
  };

  const uploadFileRef = useRef(uploadFile);
  uploadFileRef.current = uploadFile;

  const pushFiles = useCallback((newFiles) => {
    if (Array.isArray(newFiles)) {
      const filterNewFiles = newFiles.filter((newFile) => {
        return !filesRef.current.find((file) => file.id === newFile.id);
      });
      const fmtNewFiles = filterNewFiles.map((file) => {
        return { status: FILE_STATUS.pendding, progress: 0, uploadSize: 0, ...file };
      });
      filesRef.current = [...filesRef.current, ...fmtNewFiles];
    }
    uploadFileRef.current();
  }, []);

  const resetFiles = useCallback((arg) => {
    if (typeof arg === 'function') {
      filesRef.current = arg(filesRef.current);
    }
    if (Array.isArray(arg)) {
      filesRef.current = arg;
    }
    uploadFileRef.current();
  }, []);

  const reUploadFiles = useCallback((ids) => {
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        const targetFile = filesRef.current.find((file) => file.id === id);
        if (targetFile.status !== FILE_STATUS.ok) {
          targetFile.status = FILE_STATUS.pendding;
        }
      });
    }
    uploadFileRef.current();
  }, []);

  const reUploadAllFiles = useCallback(() => {
    filesRef.current.forEach((file) => {
      if (file.status !== FILE_STATUS.ok) {
        file.status = FILE_STATUS.pendding;
      }
    });
    uploadFileRef.current();
  }, []);

  const deleteFiles = useCallback((ids) => {
    if (Array.isArray(ids)) {
      const newFiles = filesRef.current.filter((file) => {
        if (ids.includes(file.id)) {
          fileClearInterval(file);
          if (file?.handles?.uploadTask) {
            file.handles.uploadTask.abort();
          }
          return false;
        }
        return true;
      });
      filesRef.current = newFiles;
    }
    uploadFileRef.current();
  }, []);

  return {
    files,
    filesMap,
    pushFiles,
    resetFiles,
    reUploadFiles,
    reUploadAllFiles,
    deleteFiles,
  };
}

export default useUpload;
