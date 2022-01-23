import { useMemo, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import './Drawer.scss';

function MyDrawer(props) {
  const {
    className = '',
    childrenClassName = '',
    visible,
    placement = 'bottom',
    delay = 200,
    onClose = () => {},
    children,
  } = props;

  const [viewStyle, setViewStyle] = useState({ display: 'none', animationDuration: `${delay}ms` });
  useEffect(() => {
    let timer = null;

    if (visible) {
      setViewStyle({ display: 'block', animationDuration: `${delay}ms` });
    } else {
      timer = setTimeout(() => {
        setViewStyle({ display: 'none', animationDuration: `${delay}ms` });
      }, delay);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, delay]);

  const [maskVisibleClass, childrenVisibleClass] = useMemo(() => {
    if (visible) {
      return ['my-drawer-mask__fade-in', `my-drawer-children__slide-in-${placement}`];
    }

    return ['my-drawer-mask__fade-out', `my-drawer-children__slide-out-${placement}`];
  }, [visible, placement]);

  return (
    <View
      className={`my-drawer-mask ${className} ${maskVisibleClass}`}
      style={viewStyle}
      onClick={onClose}
    >
      <View
        className={`my-drawer-children ${childrenClassName} ${childrenVisibleClass}`}
        style={viewStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </View>
    </View>
  );
}

export default MyDrawer;
