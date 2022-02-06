import { useEffect, useMemo, useState, memo, useImperativeHandle, forwardRef } from 'react';
import { useImmer } from 'use-immer';
import { View } from '@tarojs/components';
import { MyInput, MyCardAccordion, IconFont } from '../index';
import './CustomFieldsCard.scss';

const defaultValue = ['姓名'];

function CustomFieldsCard(props, ref) {
  const {
    className = '',
    headerClassName = '',
    title = '',
    showDesc = false,
    descLabel = '重命名文件',
    desc = '根据提交者信息，重命名文件',
    placeholder = '如姓名、手机号',
    defaultChecked = false,
    checked,
    onCheckedChange = () => {},
    maxLength = 10,
    maxCount = 5,
    value = defaultValue,
    onChange = () => {},
  } = props;

  const [realChecked, setRealChecked] = useState(defaultChecked || checked || false);
  useEffect(() => {
    if (typeof checked === 'boolean') {
      setRealChecked(checked);
    }
  }, [checked]);

  const handleCheckedChange = (e) => {
    if (!(typeof checked === 'boolean')) {
      setRealChecked(e.detail.value);
    }
    onCheckedChange(e);
  };

  const [fields, setFields] = useImmer([]);
  useEffect(() => {
    const newValue = value.map((field, index) => ({ field, index }));
    const newFields = [...newValue, { field: '', index: newValue.length }];
    setFields(newFields);
  }, [value]);

  const onInput = (value, index) => {
    setFields((draft) => {
      draft[index].field = value;
    });
  };

  // 增删
  const handleAction = (type, index) => {
    setFields((draft) => {
      if (type === 'add') {
        draft.push({ field: '', index: draft.length });
      }
      if (type == 'delete') {
        setFields((draft) => {
          const filterList = draft.filter((item) => item.index !== index);
          const newFields = filterList.map((item, index) => ({ ...item, index }));
          if (newFields[newFields.length - 1].field) {
            newFields.push({ field: '', index: newFields.length });
          }
          return newFields;
        });
      }
    });
  };

  const fieldsMemo = useMemo(() => {
    return fields.filter(({ field }) => field.trim()).map(({ field }) => field);
  }, [fields]);

  useEffect(() => {
    if (realChecked) {
      onChange(fieldsMemo);
    } else {
      onChange([]);
    }
  }, [realChecked, fieldsMemo]);

  const onFocus = (index) => {
    if (index === fields.length - 1 && fields.length < maxCount) handleAction('add');
  };

  useImperativeHandle(ref, () => ({
    setValue: ({ checked, value }) => {
      setRealChecked(checked);
      onCheckedChange({ detail: { checked } });

      if (Array.isArray(value)) {
        const newValue = value.map((field, index) => ({ field, index }));
        const newFields = [...newValue, { field: '', index: newValue.length }];
        setFields(newFields);

        const fmtFields = newValue.filter(({ field }) => field.trim()).map(({ field }) => field);
        onChange(checked ? fmtFields : []);
      }
    },
  }));

  return (
    <MyCardAccordion
      headerClassName={headerClassName}
      title={title}
      showDesc={showDesc}
      desc={realChecked ? `${descLabel}：${fieldsMemo.join('-')}` : desc}
      checked={realChecked}
      onChange={handleCheckedChange}
    >
      <View className="fields-list">
        {fields.map(({ field, index }) => {
          const actionIsAdd = index === fields.length - 1 && (fields.length < maxCount || !field);
          const realPlaceholder = actionIsAdd && maxCount > 1 ? '添加新的字段' : placeholder;

          return (
            <View className={`fields-list-item ${className}`}>
              <MyInput
                key={index}
                className="fields-input"
                type="text"
                placeholder={realPlaceholder}
                maxlength={maxLength}
                limit={maxLength}
                value={field}
                onFocus={() => onFocus(index)}
                onInput={(e) => onInput(e.target.value, index)}
              />
              {maxCount > 1 && (
                <IconFont
                  className={`fields-input-icon ${
                    actionIsAdd && 'fields-input-icon-hidden'
                  } click-active`}
                  name="delete"
                  onClick={() => !actionIsAdd && handleAction('delete', index)}
                />
              )}
            </View>
          );
        })}
      </View>
    </MyCardAccordion>
  );
}

export default memo(forwardRef(CustomFieldsCard));
