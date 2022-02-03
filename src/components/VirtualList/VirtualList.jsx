import { memo } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { MyLoading } from '../index';
import './VirtualList.scss';

function VirtualList(props) {
  const { className, list, render, loading, onScrollToLower } = props;

  return (
    <ScrollView
      className={`virtual-list-container ${className}`}
      scrollY
      lowerThreshold={100}
      onScrollToLower={onScrollToLower}
    >
      {list.map((stockInfo, index) => render(stockInfo, index))}

      <View className="virtual-list-footer">
        {loading ? <MyLoading size={15} color="#666" title="加载中..." /> : '没有更多了'}
      </View>
    </ScrollView>
  );
}

export default memo(VirtualList);
