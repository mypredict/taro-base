import { memo, useEffect, useState, useRef, useMemo } from 'react';
import { View } from '@tarojs/components';
import './Toast.scss';

function Toast(props) {
  const {
    type = 'info', // 'info' | 'success' | 'error' | 'warning'
    visible = true,
    className,
    style,
    delay = 3000,
    transitionDuration = 300,
    content,
    children,
    onClose = () => {},
  } = props || {};

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [status, setStatus] = useState(visible);
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(false);
    }, [delay]);
    setStatus(visible);

    return () => {
      clearTimeout(timer);
    };
  }, [type, visible, delay, content, children]);

  useEffect(() => {
    if (!status) {
      onCloseRef.current();
    }
  }, [status]);

  const classNames = useMemo(() => {
    return [
      'toast-comp',
      `toast-comp__${type}`,
      status ? 'toast-comp__show' : 'toast-comp__hidden',
      className,
    ];
  }, [type, status, className]);

  return (
    <View
      className={classNames}
      style={{
        ...style,
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      {content}
      {children}
    </View>
  );
}

export default memo(Toast);
