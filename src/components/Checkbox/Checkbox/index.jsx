import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Label, Switch, View } from '@tarojs/components';
import CheckboxGroup, { CheckboxGroupContext } from '../CheckboxGroup';
import './index.scss';

function Checkbox(props) {
  const {
    disabled = false,
    stopPropagation = true,
    className = '',
    inputClassName = '',
    position = 'right',
    size = 22,
    defaultChecked,
    checked,
    value,
    onChange = () => {},
    children,
  } = props;

  // 有CheckboxGroup包裹时的group值
  const {
    disabled: groupDisabled,
    value: groupValue,
    onChange: groupOnChange,
  } = useContext(CheckboxGroupContext);

  // 根据group值和本身值计算出的值
  const infoMemo = useMemo(() => {
    const isDefaultChecked = typeof checked === 'boolean' ? undefined : defaultChecked;

    return {
      defaultChecked: groupValue ? undefined : isDefaultChecked,
      disabled: groupDisabled ? groupDisabled : disabled,
      checked: groupValue ? groupValue.includes(value) : checked,
    };
  }, [disabled, groupDisabled, defaultChecked, checked, value, groupValue]);

  const [realChecked, setRealChecked] = useState(infoMemo.checked || infoMemo.defaultChecked);
  useEffect(() => {
    if (typeof infoMemo.checked === 'boolean') {
      setRealChecked(infoMemo.checked);
    }
  }, [infoMemo]);

  const handleChange = (event) => {
    if (infoMemo.disabled) return;
    onChange(event.detail.value);
    groupOnChange(value);
    if (typeof infoMemo.checked !== 'boolean') {
      setRealChecked(event.detail.value);
    }
  };

  const handleStopPropagation = (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
  };

  return (
    <Label className={`checkbox-comp ${className}`} onClick={handleStopPropagation}>
      {position === 'right' && children}
      <View className={`checkbox-container checkbox-container__${position}`}>
        <Switch
          disabled={infoMemo.disabled}
          className={`checkbox-comp-input ${inputClassName}`}
          style={{ width: size, height: size }}
          type="checkbox"
          defaultChecked={infoMemo.defaultChecked}
          checked={infoMemo.checked}
          onChange={handleChange}
        />
        <View
          className={`checkbox-shadow checkbox-shadow__${
            realChecked ? 'checked' : ''
          } checkbox-shadow__${infoMemo.disabled ? 'disabled' : ''}`}
        />
      </View>
      {position === 'left' && children}
    </Label>
  );
}

Checkbox.Group = CheckboxGroup;

export default Checkbox;
