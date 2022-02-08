import { useEffect, useRef, useState } from 'react';
import { useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {
  PageContainer,
  Form,
  FormItem,
  Input,
  Textarea,
  DateCard,
  CustomFieldsCard,
  CardRouter,
  Progress,
  Tabs,
  TabPane,
  Tag,
} from '@/components';
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
      closable: true,
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
        c: ['姓名', '手机号'],
        d: new Date().valueOf() + 10001234,
      });

      console.log(formRef.current.getFieldsValue());
    }, 2000);
  }, []);

  const [value, setValue] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setValue((old) => old + 30);
    }, 500);

    setTimeout(() => {
      setValue((old) => old + 60);
    }, 500);
  }, []);

  return (
    <PageContainer header={<View>456</View>} footer={<View>123</View>}>
      <Progress value={value} style={{ margin: '40px 0' }} />

      <View style={{ backgroundColor: '#fff' }}>
        <Tag status="ok" fill={false} style={{ margin: 30 }}>
          123
        </Tag>
        <Tag status="error" fill={false} style={{ margin: 30 }}>
          123
        </Tag>
        <Tag status="fail" fill={false} style={{ margin: 30 }}>
          123
        </Tag>
        <Tag status="ok" style={{ margin: 30 }}>
          123
        </Tag>
        <Tag status="error" style={{ margin: 30 }}>
          123
        </Tag>
        <Tag status="fail" style={{ margin: 30 }}>
          123
        </Tag>
      </View>

      <Tabs
        defaultActiveKey="1"
        onChange={(value) => {
          console.log(value);
        }}
      >
        <TabPane tab="1" key="1">
          <View>1111</View>
          <View>1111</View>
          <View>1111</View>
          <View>1111</View>
        </TabPane>
        <TabPane tab="2" key="2">
          <Textarea
            label="textarea"
            required={true}
            placeholder={'测试form textarea'}
            maxlength={200}
            limit={200}
          />
        </TabPane>
        <TabPane tab="3" key="3">
          3
        </TabPane>
      </Tabs>

      <Tabs
        style={{ height: '20vh' }}
        scroll={true}
        destroyInactiveTabPane={false}
        defaultActiveKey="1"
        onChange={(value) => {
          console.log(value);
        }}
      >
        <TabPane tab="1" key="1">
          <View>1111</View>
          <View>1111</View>
          <View>1111</View>
          <View>1111</View>
        </TabPane>
        <TabPane tab="2" key="2">
          <Textarea
            label="textarea"
            required={true}
            placeholder={'测试form textarea'}
            maxlength={200}
            limit={200}
          />
        </TabPane>
        <TabPane tab="3" key="3">
          3
        </TabPane>
      </Tabs>

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
        initialValues={{ a: 'a', b: 'b', c: ['nihao'], d: new Date().valueOf() }}
        onChange={(value) => {
          console.log('form 改变了', value);
        }}
      >
        <FormItem type="input" name="a">
          <Input
            label="input"
            required={true}
            placeholder={'测试form input'}
            maxlength={20}
            limit={20}
          />
        </FormItem>

        <FormItem type="textarea" name="b">
          <Textarea
            label="textarea"
            required={true}
            placeholder={'测试form textarea'}
            maxlength={200}
            limit={200}
          />
        </FormItem>

        <FormItem type="customFields" name="c">
          <CustomFieldsCard title="重命名" />
        </FormItem>

        <FormItem type="datePicker" name="d">
          <DateCard />
        </FormItem>

        <CardRouter title="查看已提交人、文件" desc="你是此任务发起人，仅你可见" />
      </Form>
    </PageContainer>
  );
}

export default Index;
