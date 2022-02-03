import Taro, { useMemo, useRouter } from '@tarojs/taro';

let store = null;

export function navigater(options) {
  const { routerType, url, params = {}, data = null } = options || {};

  store = data;

  const paramsList = Object.entries(params).map(([key, value]) => {
    return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
  });
  const combineUrl = paramsList?.length ? `${url}?${paramsList.join('&')}` : url;

  if (routerType === 'back') {
    Taro.navigateBack();
    return;
  }

  if (routerType === 'redirect') {
    Taro.redirectTo({
      ...options,
      url: combineUrl,
    });
    return;
  }

  if (!combineUrl) return;

  Taro.navigateTo({
    ...options,
    url: combineUrl,
  });
}

export function useNavigater() {
  const routerInfo = useRouter();

  const params = useMemo(() => {
    return Object.entries(routerInfo?.params || {}).reduce((result, [key, value]) => {
      result[key] = JSON.parse(decodeURIComponent(value));
      return result;
    }, {});
  }, [routerInfo?.params]);

  return {
    ...routerInfo,
    data: store,
    params,
  };
}
