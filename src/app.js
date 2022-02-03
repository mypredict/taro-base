import { Provider, state } from '@/store';
import './app.scss';

function App(props) {
  return (
    <Provider state={state}>
      {props.children}
    </Provider>
  );
}

export default App;
