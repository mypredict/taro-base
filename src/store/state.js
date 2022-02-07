export const defaultModalInfo = {
  visible: false,
  destroyOnClose: false,
  title: '',
  content: '',
  showCancelBtn: true,
  showOkBtn: true,
  onCancel: () => {},
  onOk: () => {},
};

export const defaultToastInfo = {
  visible: false,
  type: 'info',
  content: '',
  delay: 3000,
  transitionDuration: 300,
  onClose: () => {},
};

export const state = {
  modalInfo: defaultModalInfo,
  toastInfo: defaultToastInfo,
};
