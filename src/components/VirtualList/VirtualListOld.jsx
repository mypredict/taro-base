import { memo, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { useVirtualList } from '@/hooks';
import { MyLoading } from '../index';
import './VirtualList.scss';

function VirtualList(props, ref) {
  const {
    className,
    list,
    render,
    itemHeight,
    renderCount = 100,
    offsetTopCount = 50,
    delay = 100,
    footerStatus,
    onChange,
  } = props;

  const {
    list: renderList,
    isScrolling,
    containerProps,
    wrapperProps,
    startIndex,
    endIndex,
    locateIndex,
  } = useVirtualList(list, { itemHeight, renderCount, offsetTopCount, delay });

  useImperativeHandle(ref, () => {
    return {
      locateIndex(index) {
        locateIndex(index);
      },
    };
  });

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current({
        list,
        isScrolling,
        startIndex,
        endIndex,
      });
    }
  }, [list, isScrolling, startIndex, endIndex]);

  return (
    <ScrollView className={`virtual-list-container ${className}`} {...containerProps} scrollY>
      <View
        className="virtual-list-wrap"
        {...wrapperProps}
        style={{ ...wrapperProps.style, height: wrapperProps.style.minHeight + 50 }}
      >
        {renderList.map((stockInfo, index) =>
          render(stockInfo, startIndex + index, { isScrolling, startIndex, endIndex })
        )}

        <View className="virtual-list-footer">
          {footerStatus === 'loading' && <MyLoading size={15} color="#666" title="加载中..." />}
          {footerStatus === 'none' && '没有更多了'}
        </View>
      </View>
    </ScrollView>
  );
}

export default memo(forwardRef(VirtualList));
