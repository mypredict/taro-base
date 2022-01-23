import { View } from '@tarojs/components';
import './PageContainer.scss';

function PageContainer(props) {
  const {
    header,
    footer,
    children,
    className = '',
    headerClassName = '',
    footerClassName = '',
  } = props;

  return (
    <View
      className={`page-container ${!header && !footer ? 'page-container-auto' : ''} ${className}`}
    >
      {header && <View className={`page-header ${headerClassName}`}>{header}</View>}
      <View className="page-content-layout">{children}</View>
      {footer && <View className={`page-footer ${footerClassName}`}>{footer}</View>}
    </View>
  );
}

export default PageContainer;
