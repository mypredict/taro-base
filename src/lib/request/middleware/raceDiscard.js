export function raceDiscard() {
  const apiInfoMap = {};

  return async (ctx, next) => {
    const { method, url, middlewareConfig } = ctx;

    const { raceDiscard: raceDiscardConfig } = middlewareConfig || {};

    if (raceDiscardConfig) {
      const startTime = new Date().getTime();

      await next();

      const { apiId } = raceDiscardConfig || {};
      const raceId = apiId || `${method}_${url}`;

      if (startTime > apiInfoMap[raceId]?.lastTime) {
        apiInfoMap[raceId] = {
          lastTime: startTime,
          lastRes: ctx.res,
        };
      } else {
        ctx.res = apiInfoMap[raceId].lastRes;
      }

    } else {
      await next();
    }
  };
}
