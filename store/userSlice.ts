import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../lib/model/User';
import type { RootState } from './index'

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  }
});

export const { setCurrentUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export default userSlice.reducer;