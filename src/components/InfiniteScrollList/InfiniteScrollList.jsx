import { memo, useMemo } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { Loading } from '../index';
import { useIntersectionObserver } from '@/hooks';
import './InfiniteScrollList.scss';

function InfiniteScrollList(props) {
  const {
    className,
    list,
    render,
    loading,
    selector,
    lowerThreshold = 10,
    onScrollToLower,
  } = props;

  const margins = useMemo(() => {
    return {
      bottom: lowerThreshold,
    };
  }, [lowerThreshold]);

  useIntersectionObserver(onScrollToLower, {
    selector,
    target: '.infinite-scroll-list-footer',
    margins,
  });

  return (
    <ScrollView className={`infinite-scroll-list-comp ${className}`}>
      {list.map((stockInfo, index) => render(stockInfo, index))}

      <View className="infinite-scroll-list-footer">
        {loading ? <Loading size={15} color="#666" title="加载中..." /> : '没有更多了'}
      </View>
    </ScrollView>
  );
}

export default memo(InfiniteScrollList);
