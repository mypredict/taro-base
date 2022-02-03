import request, { raceDiscard, fetcher } from '@/lib/request';
import { getUserToken, getUser } from './login';
import { baseUrl } from './config';

export * from './useRequest';
export * from './config';
export * from './login';
export * from './test';

// 同一个请求发起多次时保留最后一个的数据
request.use(raceDiscard());

// 注册访问任意接口前检查是否登录了
request.use(async (ctx, next) => {
  // 如果是登录接口本身则跳过检查
  if (ctx.url === `${baseUrl}/user/loginByMiniProgram`) {
    return await next();
  }

  const token = await getUserToken();
  ctx.header = {
    'content-type': 'application/json',
    'X-LOGIN-TOKEN': token,
  };
  await next();
});

// 需要检查是否注册过的接口
request.use(async (ctx, next) => {
  // 如果_middlewareCtx上绑定了checkLogin则进行检查
  if (ctx._middlewareCtx.checkLogin) {
    await getUser();
    return await next();
  }

  await next();
});

// 发起请求的中间件
request.use(fetcher());

// 最终处理输出
request.use(async (ctx, next) => {
  await next();
  return ctx?.res?.data;
});
