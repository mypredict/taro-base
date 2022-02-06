import { memo } from 'react';
import { View } from '@tarojs/components';
import { Mask, IconFont } from '../index';
import './Modal.scss';

function Modal(props) {
  const {
    visible,
    destroyOnClose,
    className,
    style,
    title,
    closable = false,
    header,
    headerClassName,
    content,
    bodyClassName,
    footerType = 'divide',
    footer,
    footerClassName,
    cancelBtn = '取消',
    showCancelBtn = true,
    okBtn = '确定',
    showOkBtn = true,
    onCancel = () => {},
    onOk = () => {},
    children,
  } = props || {};

  return (
    <Mask visible={visible} destroyOnClose={destroyOnClose}>
      <View className={`modal-comp ${className}`} style={style}>
        <View className={`modal-header ${headerClassName}`}>
          {header || <View className="modal-title">{title}</View>}
          {closable && (
            <IconFont className="modal-close click-active" name="close" onClick={onCancel} />
          )}
        </View>
        <View className={`modal-body ${bodyClassName}`}>
          {children || <View className="modal-content">{content}</View>}
        </View>
        {footerType === 'divide' ? (
          <View className={`modal-footer__divide ${footerClassName}`}>
            {footer || (
              <>
                {showCancelBtn && (
                  <View className="modal-btn modal-btn__cancel btn-click-active" onClick={onCancel}>
                    {cancelBtn}
                  </View>
                )}
                {showOkBtn && (
                  <View className="modal-btn modal-btn__ok btn-click-active" onClick={onOk}>
                    {okBtn}
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <View className={`modal-footer ${footerClassName}`}>
            {footer || (
              <>
                {showCancelBtn && (
                  <View className="modal-btn modal-btn__cancel btn-click-active" onClick={onCancel}>
                    {cancelBtn}
                  </View>
                )}
                {showOkBtn && (
                  <View className="modal-btn modal-btn__ok btn-click-active" onClick={onOk}>
                    {okBtn}
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </Mask>
  );
}

export default memo(Modal);
