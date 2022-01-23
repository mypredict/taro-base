import { View } from '@tarojs/components';
import MyCard from '../Card/Card';
import './CardRouter.scss';

function CardRouter(props) {
  const {
    className,
    style,
    title,
    desc,
    result,
    color = 'rgba(0, 0, 0, 0.9)',
    resultColor = 'rgba(0, 0, 0, 0.6)',
    iconColor = 'rgba(0, 0, 0, 0.7)',
    children,
  } = props;

  return (
    <MyCard
      {...props}
      className={`card-router-container click-active ${className}`}
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
        <View className="at-icon at-icon-chevron-right" style={{ color: iconColor }} />
      </View>
    </MyCard>
  );
}

export default CardRouter;
