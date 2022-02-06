import { memo } from 'react';
import { View } from '@tarojs/components';
import { Card, IconFont } from '../index';
import './CardRouter.scss';

function CardRouter(props) {
  const {
    className,
    style,
    title,
    desc,
    result,
    canClick = true,
    color = 'rgba(0, 0, 0, 0.9)',
    resultColor = 'rgba(0, 0, 0, 0.6)',
    iconColor = 'rgba(0, 0, 0, 0.7)',
    children,
  } = props;

  return (
    <Card
      {...props}
      className={`card-router-container ${canClick ? 'click-active' : ''} ${className}`}
      style={{ ...style, color }}
    >
      {title && (
        <View className="card-router-left">
          <View className="card-router-title" style={{ color }}>
            {title}
          </View>
          {desc && <View className="card-router-desc">{desc}</View>}
        </View>
      )}
      {children}
      <View className="card-router-right">
        {result && (
          <View className="card-router-result" style={{ color: resultColor }}>
            {result}
          </View>
        )}

        {canClick && <IconFont className="card-router-icon" name="right" color={iconColor} />}
      </View>
    </Card>
  );
}

export default memo(CardRouter);
