import { useRef, useCallback, useState } from 'react';
import Taro from '@tarojs/taro';

function useRequest(fetcher, params) {
  const { initValue = null, autoLoading, successMsg, errorMsg } = params || {};

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(initValue);
  const [error, setError] = useState(null);

  const run = useCallback((...params) => {
    setLoading(true);

    if (autoLoading) {
      Taro.showLoading({ mask: true });
    }
    return fetcherRef.current(...params)
      .then((resp) => {
        setLoading(false);
        setError(null);

        if (autoLoading) {
          Taro.hideLoading();
        }

        const { res } = resp;
        if (res.data.code === 0) {
          setRes(res.data.data);
          if (successMsg) {
            Taro.atMessage({ type: 'success', message: successMsg });
          }
          return res;
        }

        if (res?.data?.tip || errorMsg) {
          Taro.atMessage({ type: 'error', message: res.data.tip || errorMsg });
        }
        return res;
      })
      .catch((err) => {
        setLoading(false);
        setError(err);

        if (autoLoading) {
          Taro.hideLoading();
        }

        if (err.errMsg === 'getUserProfile:fail auth deny') {
          Taro.showModal({
            content: '为了向提交人展示您的头像和昵称，请同意基本信息的授权',
          });
          return Promise.reject(err);
        }

        Taro.atMessage({ type: 'error', message: '网络错误' });
        return Promise.reject(err);
      });
  }, [autoLoading, successMsg, errorMsg]);

  return { run, loading, res, error };
}

export default useRequest;
