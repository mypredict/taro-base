import React, { useContext, memo } from 'react';
import { View } from '@tarojs/components';
import { TabsContext } from './Tabs';
import './TabPane.scss';

function TabPane(props) {
  const { className, style, _key, children } = props;

  const { activeKey, onClick } = useContext(TabsContext);

  return (
    <View
      className={`tab-pane-comp ${activeKey === _key ? 'tab-pane-comp__active' : ''} ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

export default memo(TabPane);
