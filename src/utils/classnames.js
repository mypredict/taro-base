export function classnames(...args) {
  return args.reduce((result, item) => {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
    return result
  }, []).join(' ');
}
