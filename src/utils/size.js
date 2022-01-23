export const SIZE_20_MB = 1024 * 1024 * 20;

export function fmtSize(size, options) {
  const { decimal = 1, unit } = options || {};

  const fmtDecimal = (num) => {
    return parseFloat(num.toFixed(decimal));
  };

  const fmtNum = (size, unit) => {
    switch (unit) {
      case 'B': return `${fmtDecimal(size)} B`;
      case 'KB': return `${fmtDecimal(size / 1024)} KB`;
      case 'MB': return `${fmtDecimal(size / 1048576)} MB`;
      case 'GB': return `${fmtDecimal(size / 1073741824)} GB`;
      default: return `${fmtDecimal(size / 1099511627776)} TB`;
    }
  }

  if (unit) return fmtNum(size, unit);

  if (size < 1024) return fmtNum(size, 'B');
  if (size < 1048576) return  fmtNum(size, 'KB');
  if (size < 1073741824) return  fmtNum(size, 'MB');
  if (size < 1099511627776) return  fmtNum(size, 'GB');
  return  fmtNum(size, 'TB');
}
