import { useState, forwardRef, useImperativeHandle, memo } from 'react';
import { View, Textarea } from '@tarojs/components';
import './Textarea.scss';

function MyTextarea(props, ref) {
  const { className = '', textareaClassName = '', defaultValue, value, onInput, limit } = props;

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
    <View className={`my-textarea-container ${className}`}>
      <Textarea
        {...props}
        value={realValue}
        onInput={handleInput}
        className={`my-textarea ${textareaClassName}`}
        placeholderClass="my-textarea-placeholder"
      />
      {limit && (
        <View className="my-textarea-limit">
          {realValue?.length || 0}/{limit}
        </View>
      )}
    </View>
  );
}

export default memo(forwardRef(MyTextarea));
