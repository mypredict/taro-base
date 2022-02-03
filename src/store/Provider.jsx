import React, { createContext, useMemo, useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { defaultModalInfo, defaultToastInfo } from './state';

export const Context = createContext({});

function Provider(props) {
  const { state: initState, children } = props;

  const [state, setState] = useImmer(initState);
  useEffect(() => {
    setState(() => initState);
  }, [initState]);

  // 全局弹窗
  const showModal = useCallback((options) => {
    const { onCancel = () => {}, onOk = () => {} } = options || {};
    setState((draft) => {
      draft.modalInfo = {
        ...defaultModalInfo,
        ...options,
        visible: true,
        onOk: () => {
          setState((draft) => {
            draft.modalInfo.visible = false;
          });
          onOk();
        },
        onCancel: () => {
          setState((draft) => {
            draft.modalInfo.visible = false;
          });
          onCancel();
        },
      };
    });
  }, []);

  const showToast = useCallback((options) => {
    const { onClose = () => {} } = options || {};
    setState((draft) => {
      draft.toastInfo = {
        ...defaultToastInfo,
        ...options,
        visible: true,
        onClose: () => {
          setState((draft) => {
            draft.toastInfo.visible = false;
          });
          onClose();
        },
      };
    });
  }, []);

  const storeMemo = useMemo(
    () => ({
      state,
      setState,
      showModal,
      showToast,
    }),
    [state, setState, showModal, showToast]
  );

  return <Context.Provider value={storeMemo}>{children}</Context.Provider>;
}

export default Provider;
