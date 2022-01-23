import { Button, View } from '@tarojs/components';
import Loading from '../Loading/Loading';
import './Button.scss';

function MyButton(props) {
  const {
    disabled,
    loading,
    className,
    style,
    theme = 'common',
    onClick = () => {},
    children,
  } = props;

  return (
    <Button
      disabled={loading || disabled}
      className={`my-button my-button-${theme} ${className} ${
        (loading || disabled) && 'my-button-disabled'
      }`}
      style={style}
      onClick={onClick}
    >
      {loading && (
        <View className="my-button-loading">
          <Loading size={20} color="#fff" />
        </View>
      )}

      {children}
    </Button>
  );
}

export default MyButton;
