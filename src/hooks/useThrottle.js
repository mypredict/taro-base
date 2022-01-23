// 函数节流

import { useState, useRef, useCallback } from 'react';

function useThrottle (callback, delay = 0) {
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

  const [pendding, setPendding] = useState(false);
  const run = useCallback(
    (...args) => {
      if (!pendding) {
        setPendding(true);
        clear();
        timerRef.current = setTimeout(() => {
          setPendding(false);
          callbackRef.current(...args);
        }, delay);
      }
    },
    [clear, pendding, delay]
  );

  return { run, runNow, clear };
}

export default useThrottle;