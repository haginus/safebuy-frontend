import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { Account } from '../lib/model/Account';
import { PaymentMethod } from '../lib/model/PaymentMethod';
import { apiCall } from '../lib/util';
import { RootState } from './index'
import { createAsyncThunk } from './util';

interface PaymentState {
  balance: number;
  paymentMethods: PaymentMethod[];
}

const initialState: PaymentState = {
  balance: 0,
  paymentMethods: [],
}

export const fetchAccount = createAsyncThunk<Account>('payment/fetchAccount', async (arg, { getState }) => {
  const userId = getState().user.currentUser?.id;
  const user = await apiCall<Account>(Service.PAYMENT, `/accounts/${userId}`, "GET");
  return user;
});

export type PaymentCurrentAction = { type: 'topup' } | { type: 'withdraw' } | { type: 'buyListing', listingId: number } | null;

export const userSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.paymentMethods = action.payload.paymentMethods;
      });
  },
});

export const { setBalance } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export default userSlice.reducer;