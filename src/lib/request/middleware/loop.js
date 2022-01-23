export function loop() {
  const apiInfoMap = {};

  return async (ctx, next) => {
    const { method, url, middlewareConfig } = ctx;

    const { loop: loopConfig } = middlewareConfig || {};

    if (loopConfig) {
      const startTime = new Date().getTime();
      await next();
    } else {
      await next();
    }
  };
}
