// 函数防抖

import { useRef, useCallback } from 'react';

function useDebounce (callback, delay = 0) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runNow = useCallback((...args) => {
    callbackRef.current(...args);
  }, []);

  const run = useCallback(
    (...args) => {
      clear();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        clear();
      }, delay);
    },
    [delay, clear]
  );

  return { run, runNow, clear };
}

export default useDebounce;
