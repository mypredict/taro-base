import { useEffect, useDidShow } from '@tarojs/taro';
import { View, Image, OpenData } from '@tarojs/components';
import { MyCard, MyLoading } from '@/components';
import { getCollectingCount } from '@/apis';
import { navigater } from '@/utils';
import './index.scss';

function My() {
  useDidShow(() => {
    console.log(999);
  });

  // useEffect(() => {
  //   navigater({
  //     url: '/package-toolkit/toolkit/index',
  //     url: '/package-toolkit/file-conversion-toolkit/index',
  //   });
  // }, []);

  return (
    <View className="my-page">
      <View>123</View>
    </View>
  );
}

export default My;
