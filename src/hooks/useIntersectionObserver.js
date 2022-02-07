import { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';

function useIntersectionObserver(callback, options) {
  const {
    selector, // 要显示的参照对象(默认可视窗口)
    target, // 要显示的对象
    margins, // { top, right, bottom, left }
    initialRatio = 0,
    observeAll,
    thresholds,
    intersectionRatio = 0, // 相交区域占目标节点的布局区域的比例
  } = options || {};
  
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    setTimeout(() => {
      const intersectionObserver = Taro.createIntersectionObserver(this, {
        initialRatio,
        observeAll,
        thresholds,
      });

      if (selector) {
        intersectionObserver.relativeTo(selector, margins);
      } else {
        // 参照整个视口
        intersectionObserver.relativeToViewport(margins || { bottom: 10 });
      }

      intersectionObserver.observe(target, (res) => {
        if (res.intersectionRatio >= intersectionRatio) {
          callbackRef.current(res);
        }
      });

      return () => {
        intersectionObserver.disconnect();
      };
    });
  }, [target, selector, margins, initialRatio, observeAll, thresholds, intersectionRatio]);
}

export default useIntersectionObserver;
