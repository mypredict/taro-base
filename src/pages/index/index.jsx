import { useEffect, useDidShow } from '@tarojs/taro';
import { View, Image, OpenData } from '@tarojs/components';
import { AtMessage } from 'taro-ui';
import { PageContainer } from '@/components';
import { useRequest, getMyCreateList } from '@/apis';
import { useInteract } from '@/store';
import './index.scss';

function Index() {
  const { showModal, showToast } = useInteract();

  const { run, loading, data } = useRequest(getMyCreateList, { successMsg: 'nihao' });

  useDidShow(() => {
    run({ type: 'myCreate', size: 100 }).then((data) => {
      // console.log(9999, data);
    });
  });

  const onClick = () => {
    showModal({
      title: '这是标题',
      content:
        '这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容',
      onCancel: () => {
        console.log(111);
      },
      onOk: () => {
        console.log(2222);
      },
    });
  };

  return (
    <PageContainer header={<View>456</View>} footer={<View>123</View>}>
      <AtMessage />
      <View onClick={onClick}>123</View>
      <View
        onClick={() =>
          showToast({
            type: 'info',
            content: '这是提示',
          })
        }
      >
        456
      </View>
    </PageContainer>
  );
}

export default Index;
