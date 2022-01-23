export function getUuid() {
  const timestamp = new Date().getTime();
  const randomNum1 = Math.random().toString(16).slice(-10);
  const randomNum2 = Math.random().toString(16).slice(-10);

  return `${timestamp}-${randomNum1}-${randomNum2}`;
}
