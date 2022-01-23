function compose(middlewares, ctx) {
  let middlewareIndex = 0;

  const dispatch = () => {
    if (middlewareIndex >= middlewares.length) {
      return Promise.resolve(ctx);
    }

    const currentMiddleware = middlewares[middlewareIndex];
    middlewareIndex++;

    return Promise.resolve(
      currentMiddleware(ctx, () => dispatch())
    );
  }

  return dispatch();
}

export default compose;
