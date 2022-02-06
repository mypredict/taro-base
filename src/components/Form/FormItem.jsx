import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { View } from '@tarojs/components';
import { FormContext } from './Form';
import './FormItem.scss';

function FormItem(props) {
  const { type, name, className, style, children } = props;
  const { disabled, resetFieldsValue, onChange } = useContext(FormContext);

  const formItemRef = useRef();

  // 手动设置值
  useEffect(() => {
    if (type === 'customFields') {
      formItemRef.current.setValue({
        checked: resetFieldsValue[name]?.length ? true : false,
        value: resetFieldsValue[name],
      });
      return;
    }
    formItemRef.current.setValue(resetFieldsValue[name]);
  }, [type, name, resetFieldsValue]);

  // 自动设置值得回调
  const propsMemo = useMemo(() => {
    if (['input', 'textarea'].includes(type)) {
      return {
        ref: formItemRef,
        disabled,
        onInput: (e) => {
          onChange(name, e.target.value);
        },
      };
    }

    if (type === 'customFields') {
      return {
        ref: formItemRef,
        onChange: (value) => {
          onChange(name, value);
        },
      };
    }

    if (type === 'datePicker') {
      return {
        ref: formItemRef,
        onChange: (value) => {
          onChange(name, value.valueOf());
        },
      };
    }
  }, [type, name, disabled, onChange]);

  return (
    <View className={`form-item-comp ${className}`} style={style}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, propsMemo);
      })}
    </View>
  );
}

export default FormItem;
