import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { View } from '@tarojs/components';
import { FormContext } from './Form';
import './FormItem.scss';

function FormItem(props) {
  const { type, name, children } = props;
  const { disabled, resetFieldsValue, onChange } = useContext(FormContext);

  const formItemRef = useRef();

  // 手动设置值
  useEffect(() => {
    if (type === 'input') {
      formItemRef.current.setValue(resetFieldsValue[name]);
      return;
    }

    formItemRef.current.setValue(resetFieldsValue[name]);
  }, [type, name, resetFieldsValue]);

  // 自动设置值得回调
  const propsMemo = useMemo(() => {
    if (type === 'input') {
      return {
        ref: formItemRef,
        disabled,
        onInput: (e) => {
          onChange(name, e.target.value);
        },
      };
    }

    return {
      ref: formItemRef,
      disabled,
      onChange: () => {
        onChange();
      },
    };
  }, [type, name, disabled, onChange]);

  return (
    <View className="form-item-comp">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, propsMemo);
      })}
    </View>
  );
}

export default FormItem;
