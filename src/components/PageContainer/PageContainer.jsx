import { View } from '@tarojs/components';
import Modal from '../Modal/Modal';
import Toast from '../Toast/Toast';
import { useStore } from '@/store';
import './PageContainer.scss';

function PageContainer(props) {
  const {
    className = '',
    style = {},
    header,
    headerClassName = '',
    footer,
    footerClassName = '',
    children,
  } = props;

  const { state } = useStore();
  const { toastInfo, modalInfo } = state;

  return (
    <View
      className={`page-container ${header || footer ? 'page-container-fixed' : ''} ${className}`}
      style={style}
    >
      <Toast {...toastInfo} />
      <Modal {...modalInfo} />
      {header && <View className={`page-header ${headerClassName}`}>{header}</View>}
      <View className="page-content-layout">{children}</View>
      {footer && <View className={`page-footer ${footerClassName}`}>{footer}</View>}
    </View>
  );
}

export default PageContainer;
