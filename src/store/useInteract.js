import { useContext } from 'react';
import { Context } from './Provider';

export function useInteract() {
  const { showModal, showToast } = useContext(Context);

  return {
    showModal,
    showToast,
  };
}
