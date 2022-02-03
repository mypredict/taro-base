import compose from './compose';

const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

export function initRequest(initOptions = {}) {
  let commonOptions = initOptions;

  const _middleware = [];

  const run = async (ctx) => {
    await compose(_middleware, ctx);
    return ctx;
  };

  const runner = async (params, options) => {
    if (typeof params === 'string') {
      const ctx = {
        _middlewareCtx: {},
        _stage: 'req',
        method: 'get',
        url: params,
        ...commonOptions,
        ...options,
      };
      return await run(ctx);
    }

    if (!params?.url) {
      throw new Error('Missing url')
    }

    const ctx = {
      _middlewareCtx: {},
      _stage: 'req',
      method: 'get',
      ...commonOptions,
      ...params,
      ...options,
    };
    const { res } = await run(ctx);
    return res;
  };

  runner.setOptions = (callback) => {
    commonOptions = callback(commonOptions);
  };

  methods.forEach((method) => {
    runner[method] = async (params, options) => {
      if (typeof params === 'string') {
        return await runner(params, { ...options, method });
      }

      return await runner({ ...params, ...options, method });
    };
  });

  runner.use = (middleware) => {
    _middleware.push(middleware);
  };

  return runner;
}
