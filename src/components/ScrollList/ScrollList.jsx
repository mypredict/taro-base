import { memo, useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';
import { MyLoading } from '../index';
import './ScrollList.scss';

const boxShadowsMap = {
  top: '0 15px 10px -10px #eee inset',
  bottom: '0 -15px 10px -10px #eee inset',
  left: '15px 0 10px -10px #eee inset',
  right: '-15px 0 10px -10px #eee inset',
};

function ScrollList(props) {
  const { className, style, noscrollbar, height, offset = 10, loading, children } = props;

  const [scrollTop, setScrollTop] = useState(2);
  const [scrollLeft, setScrollLeft] = useState(2);

  const [containerOffset, setContainerOffset] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select('.scroll-list-container')
        .boundingClientRect()
        .selectViewport()
        .scrollOffset()
        .exec((res) => {
          setContainerOffset(res[0]);
          setScrollTop(0);
          setScrollLeft(0);
        });
    });
  }, []);

  const [boxShadows, setBoxShadows] = useState([]);
  const onScroll = (e) => {
    const { width: containerWidth } = containerOffset;
    const { scrollHeight, scrollTop, scrollWidth, scrollLeft } = e.target || {};
    const newBoxShadows = [];

    if (scrollTop > offset) {
      newBoxShadows.push(boxShadowsMap.top);
    }

    if (scrollTop + height + offset < scrollHeight) {
      newBoxShadows.push(boxShadowsMap.bottom);
    }

    if (scrollLeft > offset) {
      newBoxShadows.push(boxShadowsMap.left);
    }

    if (scrollLeft + containerWidth + offset < scrollWidth) {
      newBoxShadows.push(boxShadowsMap.right);
    }

    setBoxShadows(newBoxShadows);
  };

  const onScrollEnd = (e) => {
    setBoxShadows((oldBoxShadows) => {
      return oldBoxShadows.filter((boxShadow) => boxShadow !== boxShadowsMap[e.detail.direction]);
    });
  };

  return (
    <ScrollView
      scrollX
      scrollY
      scrollTop={scrollTop}
      scrollLeft={scrollLeft}
      upperThreshold={2}
      lowerThreshold={2}
      {...props}
      className={`scroll-list-container ${
        noscrollbar ? 'scroll-list-container-noscrollbar' : ''
      } ${className}`}
      style={{ ...style, height, boxShadow: boxShadows.join(',') }}
      onScroll={onScroll}
      onScrollToUpper={onScrollEnd}
      onScrollToLower={onScrollEnd}
    >
      {loading && <MyLoading size={30} color="#999" />}
      <View className="scroll-list-wrap">{children}</View>
    </ScrollView>
  );
}

export default memo(ScrollList);
