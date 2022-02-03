import { useContext } from 'react';
import { Context } from './Provider';

export function useStore() {
  const { state, setState } = useContext(Context);

  return {
    state,
    setState,
  };
}
