import { useState, forwardRef, useImperativeHandle, memo } from 'react';
import { View, Input } from '@tarojs/components';
import './Search.scss';

function Search(props, ref) {
  const {
    className,
    text = '搜索',
    placeholder = '输入内容',
    defaultValue,
    value,
    onInput,
  } = props;

  const [freeValue, setFreeValue] = useState(defaultValue);

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      setFreeValue(value);
      onInput({ target: { value } });
    },
  }));

  const handleInput = (e) => {
    if (typeof onInput === 'function') {
      onInput(e);
    }

    if (value === undefined) {
      setFreeValue(e.target.value);
    }
  };

  const realValue = value !== undefined ? value : freeValue;

  return (
    <View className={`search-comp ${className}`}>
      <View className="search-container">
        <Input
          className="search-input"
          placeholder={placeholder}
          value={realValue}
          onInput={handleInput}
        />
      </View>
      <View className="search-btn click-active">{text}</View>
    </View>
  );
}

export default memo(forwardRef(Search));
