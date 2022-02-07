import React, { createContext, memo, useEffect, useMemo, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import './Tabs.scss';

export const TabsContext = createContext({
  defaultActiveKey: '',
  activeKey: '',
  onChange: () => {},
});

const emptyFun = () => {};

function Tabs(props) {
  const {
    className,
    style,
    scroll = false,
    mutationLen = 40,
    destroyInactiveTabPane = true,
    defaultActiveKey,
    activeKey,
    onChange = emptyFun,
    children,
  } = props;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [currentActiveKey, setCurrentActiveKey] = useState(activeKey || defaultActiveKey);
  useEffect(() => {
    if (activeKey) {
      setCurrentActiveKey(activeKey);
    }
  }, [activeKey]);

  const [tabsCursorStyle, tabsBodyStyle] = useMemo(() => {
    const len = children.length;
    const currentIndex = children.findIndex((child) => child.key === currentActiveKey);

    return [
      {
        width: `${Math.floor((1 / len) * 100)}%`,
        transform: `translateX(${currentIndex * 100}%)`,
      },
      {
        width: `${children.length * 100}%`,
        transform: `translateX(${-(currentIndex / len) * 100}%)`,
      },
    ];
  }, [children, currentActiveKey]);

  const touchRef = useRef({
    isMove: false,
    touchStartX: 0,
    currentIndex: 0,
    itemLen: children.length,
  });
  const handleTouchStart = (e) => {
    touchRef.current = {
      isMove: true,
      touchStartX: e.touches[0].pageX,
      currentIndex: children.findIndex((child) => child.key === currentActiveKey),
      itemLen: children.length,
    };
  };
  const handleTouchMove = (e) => {
    if (touchRef.current.isMove) {
    }
  };
  const handleTouchEnd = (e) => {
    touchRef.current.isMove = false;
    const { touchStartX, currentIndex, itemLen } = touchRef.current;
    const touchEndX = e.changedTouches[0].pageX;

    if (touchEndX - touchStartX >= mutationLen && currentIndex > 0) {
      setCurrentActiveKey(children[currentIndex - 1].key);
    }
    if (touchEndX - touchStartX <= -mutationLen && currentIndex < itemLen - 1) {
      setCurrentActiveKey(children[currentIndex + 1].key);
    }
  };

  const valueMemo = useMemo(() => {
    return {
      activeKey: currentActiveKey,
      onClick: (key) => {
        setCurrentActiveKey(key);
        onChangeRef.current(key);
      },
    };
  }, [currentActiveKey]);

  return (
    <TabsContext.Provider value={valueMemo}>
      <View className={`tabs-comp ${scroll ? 'tabs-comp__scroll' : ''} ${className}`} style={style}>
        <View className="tabs-header">
          {React.Children.map(children, ({ key, props }) => (
            <View
              key={key}
              className={`tabs-header-container ${
                currentActiveKey === key ? 'tabs-header-container__active' : ''
              }`}
              onClick={() => {
                setCurrentActiveKey(key);
                onChangeRef.current(key);
              }}
            >
              {props.tab}
            </View>
          ))}
          <View className="tabs-cursor" style={tabsCursorStyle} />
        </View>

        <View className="tabs-body" style={tabsBodyStyle}>
          {React.Children.map(children, (child) => {
            return (
              <View
                key={child.key}
                className="tabs-body-container"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
              >
                {!(destroyInactiveTabPane && currentActiveKey !== child.key) &&
                  React.cloneElement(child, { _key: child.key })}
              </View>
            );
          })}
        </View>
      </View>
    </TabsContext.Provider>
  );
}

export default memo(Tabs);
