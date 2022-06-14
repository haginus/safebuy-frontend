import { combineReducers, configureStore, createAsyncThunk as _createAsyncThunk } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import paymentSlice from './paymentSlice';
import userSlice from './userSlice'
import storage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  keyPrefix: "",
  storage,
}

const reducers = combineReducers({
  user: userSlice,
  payment: paymentSlice,
 });

const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
  }),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;