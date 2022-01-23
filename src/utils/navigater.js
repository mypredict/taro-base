import Taro, { useMemo, useRouter } from '@tarojs/taro';

function navigaterStore() {
  let state = null;
  return {
    setState(data) {
      state = data;
    },
    getState() {
      return state;
    },
  };
}

const navigaterState = navigaterStore();

export function navigater(options) {
  const { url, data = {}, state, routerType } = options || {};

  const dataArr = Object.entries(data).map(([key, value]) => {
    return `${key}=${encodeURIComponent(value || '')}`;
  });
  const newUrl = dataArr?.length ? `${url}?${dataArr.join('&')}` : url;

  navigaterState.setState(state);

  if (routerType === 'back') {
    Taro.navigateBack();
    return;
  }

  if (routerType === 'redirect') {
    Taro.redirectTo({
      ...options,
      url: newUrl,
    });
    return;
  }

  Taro.navigateTo({
    ...options,
    url: newUrl,
  });
}

export function useNavigater() {
  const routerInfo = useRouter();

  const data = useMemo(() => {
    return Object.entries(routerInfo?.params || {}).reduce((result, [key, value]) => {
      result[key] = decodeURIComponent(value);
      return result;
    }, {});
  }, [routerInfo?.params]);

  return {
    ...routerInfo,
    data,
    state: navigaterState.getState(),
  };
}
