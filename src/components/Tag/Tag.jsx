import { Text } from '@tarojs/components';
import './Tag.scss';

function Tag(props) {
  const { className, style, title, color, status } = props;

  return (
    <Text className={`my-tag my-tag__${status} ${className}`} style={{ ...style, color }}>
      {title}
    </Text>
  );
}

export default Tag;
