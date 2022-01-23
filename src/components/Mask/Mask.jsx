import { useMemo, useEffect, useState, useRef } from 'react';
import { View } from '@tarojs/components';
import './Mask.scss';

function MyMask(props) {
  const {
    className = '',
    visible,
    delay = 300,
    onClick = () => {},
    onCancel = () => {},
    children,
  } = props;

  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  const [viewStyle, setViewStyle] = useState({ display: 'none', animationDuration: `${delay}ms` });
  useEffect(() => {
    let timer = null;

    if (visible) {
      setViewStyle({ display: 'flex', animationDuration: `${delay}ms` });
    } else {
      timer = setTimeout(() => {
        setViewStyle({ display: 'none', animationDuration: `${delay}ms` });
        onCancelRef.current();
      }, delay);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, delay]);

  const maskVisibleClass = useMemo(() => {
    if (visible) {
      return 'my-mask__fade-in';
    }

    return 'my-mask__fade-out';
  }, [visible]);

  return (
    <View
      className={`my-mask ${className} ${maskVisibleClass}`}
      style={viewStyle}
      onClick={onClick}
    >
      <View onClick={(e) => e.stopPropagation()}>{children}</View>
    </View>
  );
}

export default MyMask;
