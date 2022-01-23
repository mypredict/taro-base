import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';

function useSystem() {
  const [systemInfo, setSystenInfo] = useState({});

  useEffect(() => {
    try {
      const res = Taro.getSystemInfoSync();
      setSystenInfo(res);
    } catch(error) {
      setSystenInfo({ error });
    }
  }, []);

  return {
    ...systemInfo,
    lowerModel: (systemInfo.model || '').toLowerCase(),
    lowerPlatform: (systemInfo.platform || '').toLowerCase(),
  };
}

export default useSystem;
