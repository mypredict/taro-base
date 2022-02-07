import { Text } from '@tarojs/components';
import { classnames } from '@/utils';
import './Tag.scss';

function Tag(props) {
  const { className, style, title, color, fill = true, status = 'ok', children } = props;

  return (
    <Text
      className={classnames([
        'my-tag',
        `my-tag__${status}`,
        fill ? `my-tag-fill__${status}` : '',
        className,
      ])}
      style={{ ...style, color }}
    >
      {title}
      {children}
    </Text>
  );
}

export default Tag;
