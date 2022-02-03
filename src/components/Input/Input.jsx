import { useEffect, useState, forwardRef, useImperativeHandle, memo } from 'react';
import { Input, View, Label } from '@tarojs/components';
import './Input.scss';

function MyInput(props, ref) {
  const {
    className,
    labelClassName,
    inputClassName,
    limitClassName,
    layout = 'row',
    label = '',
    required = false,
    defaultValue,
    resetValue,
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

  useEffect(() => {
    if (resetValue !== undefined) {
      setFreeValue(resetValue);
    }
  }, [resetValue]);

  const handleInput = (e) => {
    if (typeof onInput === 'function') {
      onInput(e);
    }

    if (value === undefined) {
      setFreeValue(e.target.value);
    }
  };

  const realValue = value !== undefined ? value : freeValue;

  if (layout === 'row') {
    return (
      <View className={`my-row-input-container ${className}`}>
        {label && (
          <Label
            className={`my-row-input-label ${
              required ? 'my-row-input-label-required' : ''
            } ${labelClassName}`}
          >
            {label}
          </Label>
        )}
        <Input
          {...props}
          value={realValue}
          onInput={handleInput}
          className={`my-row-input ${inputClassName}`}
          placeholderClass="my-row-input-placeholder"
          alwaysEmbed
        />
        {limit && (
          <View className={`my-row-input-limit ${limitClassName}`}>
            {realValue?.length || 0}/{limit}
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className={`my-column-input-container ${
        label ? 'my-column-input-container-label' : ''
      } ${className}`}
    >
      {label && (
        <Label
          className={`my-column-input-label ${
            required ? 'my-column-input-label-required' : ''
          } ${labelClassName}`}
        >
          {label}
        </Label>
      )}
      <Input
        {...props}
        value={realValue}
        onInput={handleInput}
        className={`my-column-input ${inputClassName}`}
        placeholderClass="my-column-input-placeholder"
        alwaysEmbed
      />
      {limit && (
        <View className={`my-column-input-limit ${limitClassName}`}>
          {realValue?.length || 0}/{limit}
        </View>
      )}
    </View>
  );
}

export default memo(forwardRef(MyInput));
