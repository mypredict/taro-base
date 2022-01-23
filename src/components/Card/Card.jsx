import { View } from '@tarojs/components';
import './Card.scss';

function MyCard(props) {
  const { className, style, children } = props;

  return (
    <View {...props} className={`my-card ${className}`} style={style}>
      {children}
    </View>
  );
}

export default MyCard;
