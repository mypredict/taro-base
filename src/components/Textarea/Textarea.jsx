import { useState, forwardRef, useImperativeHandle, memo } from 'react';
import { View, Textarea, Label } from '@tarojs/components';
import './Textarea.scss';

function MyTextarea(props, ref) {
  const {
    className,
    textareaClassName,
    labelClassName,
    label,
    required = false,
    defaultValue,
    value,
    onInput,
    limit,
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
    <View className={`textarea-comp ${className}`}>
      <View className="textarea-container">
        {label && (
          <Label
            className={`textarea-label ${
              required ? 'textarea-label-required' : ''
            } ${labelClassName}`}
          >
            {label}
          </Label>
        )}
        <Textarea
          {...props}
          value={realValue}
          onInput={handleInput}
          className={`textarea ${textareaClassName}`}
          placeholderClass="textarea-placeholder"
        />
      </View>
      {limit && (
        <View className="textarea-limit">
          {realValue?.length || 0}/{limit}
        </View>
      )}
    </View>
  );
}

export default memo(forwardRef(MyTextarea));
