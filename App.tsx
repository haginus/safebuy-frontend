import store from './store/index';
import SafebuyApp from './SafebuyApp';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

export default function App() {
  const persistor = persistStore(store);
  return (
    <Provider store={ store }>
      <PersistGate loading={null} persistor={persistor}>
        <SafebuyApp />
      </PersistGate>
    </Provider>
  );
}