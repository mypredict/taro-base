import React, {
  memo,
  createContext,
  useMemo,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

export const FormContext = createContext({});

function Form(props, ref) {
  const { disabled, initialValues = {}, onChange = () => {}, children } = props;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 真正的使用的values
  const [fieldsValue, setFieldsValue] = useState(initialValues);

  // 从外面设置值
  const [resetFieldsValue, setResetFieldsValue] = useState(initialValues);
  useImperativeHandle(ref, () => ({
    setFieldsValue: (newValue) => {
      const newFieldsValue = { ...fieldsValue, ...newValue };
      setResetFieldsValue(newFieldsValue);
      setFieldsValue(newFieldsValue);
      onChangeRef.current(newFieldsValue);
    },
    getFieldsValue: (field) => {
      if (field) return fieldsValue[field];
      return fieldsValue;
    },
  }));

  // 内部托管值
  const handleChange = useCallback((name, value) => {
    setFieldsValue((old) => {
      const newFieldsValue = { ...old, [name]: value };
      onChangeRef.current(newFieldsValue);
      return newFieldsValue;
    });
  }, []);

  const storeMemo = useMemo(
    () => ({
      disabled,
      resetFieldsValue,
      onChange: handleChange,
    }),
    [disabled, resetFieldsValue, handleChange]
  );

  return <FormContext.Provider value={storeMemo}>{children}</FormContext.Provider>;
}

export default memo(forwardRef(Form));
