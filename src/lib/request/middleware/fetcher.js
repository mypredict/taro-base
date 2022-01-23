import Taro from '@tarojs/taro';

export function fetcher() {
  return async (ctx, next) => {
    ctx.res = await Taro.request(ctx);
    ctx._stage = 'res';
    await next();
  };
}
