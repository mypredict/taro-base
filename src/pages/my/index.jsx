import { useEffect, useDidShow } from '@tarojs/taro';
import { View, Image, OpenData } from '@tarojs/components';
import { AtMessage } from 'taro-ui';
import { PageContainer } from '@/components';
import { useRequest, getMyCreateList } from '@/apis';
import { useInteract } from '@/store';
import './index.scss';

function My() {
  const { showModal, showToast } = useInteract();

  const { run, loading, data } = useRequest(getMyCreateList);

  useDidShow(() => {
    run({ type: 'myCreate', size: 100 }).then((data) => {
      // console.log(9999, data);
    });
  });

  const onClick = () => {
    showModal({
      visible: true,
      footerType: '',
      title: '这是标题',
      content: '这是内容',
      onCancel: () => {
        console.log(111);
      },
      onOk: () => {
        console.log(2222);
      },
    });
  };

  return (
    <PageContainer footer={<View>123</View>}>
      <AtMessage />
      <View onClick={onClick}>123</View>
      <View
        onClick={() =>
          showToast({
            type: 'info',
            content: '这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示',
          })
        }
      >
        4
      </View>
      <View
        onClick={() =>
          showToast({
            type: 'success',
            content: '这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示',
          })
        }
      >
        5
      </View>
      <View
        onClick={() =>
          showToast({
            type: 'error',
            content: '这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示',
          })
        }
      >
        6
      </View>
      <View
        onClick={() =>
          showToast({
            type: 'warning',
            content: '这是提示这是提示这是提示这是提示这是提示这是提示这是提示这是提示',
          })
        }
      >
        7
      </View>
    </PageContainer>
  );
}

export default My;
