import React, {
  createContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

const checkboxGroupContext = {
  disabled: false,
  defaultValue: [],
  value: undefined,
  onChange: () => {},
};
export const CheckboxGroupContext = createContext(checkboxGroupContext);

function CheckboxGroup(props, ref) {
  const {
    disabled = false,
    defaultValue = [],
    value = undefined,
    onChange = () => {},
    children,
  } = props;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 真正的使用的values
  const [checkedValues, setCheckedValues] = useState(value || defaultValue);

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      setCheckedValues(value);
      onChange(value);
    },
  }));

  useEffect(() => {
    if (value) setCheckedValues(value);
  }, [value]);

  // 托管onChange, 区别可控不可控
  const handleChange = useCallback(
    (val) => {
      if (value) {
        const newCheckedValues = operationArray(val, [...value]);
        onChangeRef.current(newCheckedValues);
      } else {
        const newCheckedValues = operationArray(val, [...checkedValues]);
        setCheckedValues(newCheckedValues);
        onChangeRef.current(newCheckedValues);
      }
    },
    [value, checkedValues]
  );

  const storeMemo = useMemo(
    () => ({
      disabled,
      value: checkedValues,
      onChange: handleChange,
    }),
    [disabled, checkedValues, handleChange]
  );

  return (
    <CheckboxGroupContext.Provider value={storeMemo}>{children}</CheckboxGroupContext.Provider>
  );
}

// 控制数组的增删
function operationArray(target, array) {
  const targetIndex = array.indexOf(target);

  if (targetIndex > -1) {
    array.splice(targetIndex, 1);
  } else {
    array.push(target);
  }

  return array;
}

export default forwardRef(CheckboxGroup);
