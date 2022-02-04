import { useEffect, useRef } from 'react';
import { useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtMessage } from 'taro-ui';
import { PageContainer, Form, FormItem, Input, Textarea } from '@/components';
import { useRequest, getMyCreateList } from '@/apis';
import { useInteract } from '@/store';
import './index.scss';

function Index() {
  const { showModal, showToast } = useInteract();

  const { run } = useRequest(getMyCreateList, { successMsg: 'nihao' });

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

  const formRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      formRef.current.setFieldsValue({
        a: '123',
        b: '456',
      });

      console.log(formRef.current.getFieldsValue());
    }, 2000);
  }, []);

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

      <Form
        ref={formRef}
        initialValues={{ a: 'a', b: 'b' }}
        onChange={(value) => {
          console.log('form 改变了', value);
        }}
      >
        <FormItem type="input" name="a">
          <Input placeholder={'测试form input'} maxlength={20} limit={20} />
        </FormItem>

        <FormItem type="input" name="b">
          <Textarea placeholder={'测试form textarea'} maxlength={200} limit={200} />
        </FormItem>
      </Form>
    </PageContainer>
  );
}

export default Index;
