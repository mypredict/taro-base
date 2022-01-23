import { memo, useState, useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import MyMask from '../Mask/Mask';
import './Dropdown.scss';

function Dropdown(props) {
  const {
    className,
    style,
    overlayClassName,
    overlayStyle,
    children,
    trigger = 'onLongPress',
    overlay,
    placement = 'bottomRight',
    defaultVisible = false,
    resetVisible,
    visible,
    onCancel = () => {},
  } = props;

  const [freeVisible, setFreeVisible] = useState(visible || resetVisible || defaultVisible);
  useEffect(() => {
    if (resetVisible !== undefined) {
      setFreeVisible(resetVisible);
    }
  }, [resetVisible]);

  const onClickCancel = () => {
    onCancel();
    if (visible !== undefined) {
      return;
    }
    setFreeVisible(false);
  };

  return (
    <View
      {...props}
      className={`my-dropdown ${className}`}
      style={style}
      onClick={() => trigger === 'click' && setFreeVisible(true)}
      onLongPress={() => trigger === 'onLongPress' && setFreeVisible(true)}
      catchEvent
    >
      {children}
      {freeVisible && (
        <>
          <MyMask visible={freeVisible} onClick={onClickCancel} onCancel={onClickCancel} />
          <ScrollView
            className={`dropdown-list dropdown-list__${placement} ${overlayClassName}`}
            style={overlayStyle}
            onClick={onClickCancel}
          >
            {overlay}
          </ScrollView>
        </>
      )}
    </View>
  );
}

export default memo(Dropdown);
