import store from './store/index';
import SafebuyApp from './SafebuyApp';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <Provider store={ store }>
      <SafebuyApp />
    </Provider>
  );
}