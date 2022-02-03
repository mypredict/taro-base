import { useEffect, useState, memo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, Switch } from '@tarojs/components';
import { MyCard } from '@/components';
import './CardAccordion.scss';

function MyCardAccordion(props, ref) {
  const {
    title = '',
    desc = '',
    showDesc = false,
    className = '',
    headerClassName = '',
    defaultChecked = false,
    resetChecked,
    checked,
    onChange = () => {},
    clear = false,
    children,
  } = props;

  const [realChecked, setRealChecked] = useState(
    checked || resetChecked || defaultChecked || false
  );

  useEffect(() => {
    if (resetChecked !== undefined) {
      setRealChecked(resetChecked);
    }
  }, [resetChecked]);

  const onCheckedChange = (e) => {
    if (!(typeof checked === 'boolean')) {
      setRealChecked(e.detail.value);
    }
    onChange(e);
  };

  useEffect(() => {
    if (typeof checked === 'boolean') {
      setRealChecked(checked);
    }
  }, [checked]);

  useImperativeHandle(ref, () => ({
    setValue: (value) => {
      setRealChecked(value);
      onChange({ detail: { value } });
    },
  }));

  return (
    <MyCard
      className={`card-accordion ${
        realChecked && !clear ? 'card-accordion-checked' : ''
      } ${className}`}
    >
      <View className={`card-accordion-header ${headerClassName}`}>
        <View className="card-accordion-title-container">
          <Text className="card-accordion-title">{title}</Text>
          {showDesc && <Text className="card-accordion-desc">{desc}</Text>}
        </View>
        <Switch color="#7fc3fb" checked={realChecked} onChange={onCheckedChange} />
      </View>
      {realChecked && !clear && (
        <View className={`${!realChecked ? 'card-accordion-packup' : ''}`}>{children}</View>
      )}
    </MyCard>
  );
}

export default memo(forwardRef(MyCardAccordion));
