import { useRef, useCallback, useState } from 'react';
import Taro from '@tarojs/taro';
import { useInteract } from '@/store';

export function useRequest(fetcher, params) {
  const { initValue = null, autoLoading, successMsg, errorMsg } = params || {};

  const { showModal, showToast } = useInteract();

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(null);

  const run = useCallback((...params) => {
    setLoading(true);

    if (autoLoading) {
      Taro.showLoading({ title: '加载中...' });
    }

    return new Promise((resolve, reject) => {
      fetcherRef.current(...params)
        .then((res) => {
          setError(null);
          const { code, data, tip } = res.data || {};

          if (code === 0) {
            setData(data);
            if (successMsg) {
              showToast({ type: 'success', content: successMsg });
            }
            return resolve(data);
          }

          if (tip || errorMsg) {
            showToast({ type: 'error', content: res.data.tip || errorMsg });
          } else {
            showToast({ type: 'error', content: '网络错误' });
          }
          return reject(res.data);
        })
        .catch((err) => {
          setError(err);

          if (err.errMsg === 'getUserProfile:fail auth deny') {
            showModal({
              closable: false,
              title: '为了向提交人展示您的头像和昵称，请同意基本信息的授权',
            });
            return reject(err);
          }

          showToast({ type: 'error', content: '网络错误' });
          return reject(err);
        })
        .finally(() => {
          setLoading(false);
          if (autoLoading) {
            Taro.hideLoading();
          }
        });
    });
  }, [autoLoading, successMsg, errorMsg]);

  return { run, loading, data, error };
}
