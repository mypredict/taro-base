import { memo } from 'react';
import { View, Image } from '@tarojs/components';
import './CardButton.scss';

function CardButton(props) {
  const {
    className,
    layout = 'column',
    icon,
    iconSize = 40,
    text = '',
    onClick = () => {},
  } = props;

  if (layout === 'column') {
    return (
      <View className={`card-button-component-column click-active ${className}`} onClick={onClick}>
        <Image
          src={icon}
          mode="aspectFill"
          style={`width: ${iconSize}px; height: ${iconSize}px; margin-bottom: 5px;`}
        />
        {text}
      </View>
    );
  }

  return (
    <Button className={`card-button-component-row click-active ${className}`} onClick={onClick}>
      <Image src={icon} mode="aspectFill" style={`width: ${iconSize}px; height: ${iconSize}px;`} />
      {text}
    </Button>
  );
}

export default memo(CardButton);
