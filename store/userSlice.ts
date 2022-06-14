import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { User } from '../lib/model/User';
import { apiCall } from '../lib/util';
import type { RootState } from './index'

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
}

export const fetchCurrentUser = createAsyncThunk<User>('user/fetchCurrentUser', async () => {
  const user = await apiCall<User>(Service.USER, "/1", "GET");
  return user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { setCurrentUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export default userSlice.reducer;