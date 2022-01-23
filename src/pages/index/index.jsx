import { useEffect, useDidShow } from '@tarojs/taro';
import { View, Image, OpenData } from '@tarojs/components';
import { navigater } from '@/utils';
import './index.scss';

function Index() {
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
    <View className="home-page">
      <View>123</View>
    </View>
  );
}

export default Index;
