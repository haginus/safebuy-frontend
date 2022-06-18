import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { Account } from '../lib/model/Account';
import { Listing } from '../lib/model/Listing';
import { PaymentMethod } from '../lib/model/PaymentMethod';
import { Transaction } from '../lib/model/Transaction';
import { apiCall } from '../lib/util';
import { RootState } from './index'
import { createAsyncThunk } from './util';

interface PaymentState {
  balance: number;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | 'balance' | null;
  selectedListing: Listing | null;
}

const initialState: PaymentState = {
  balance: 0,
  paymentMethods: [],
  selectedPaymentMethod: null,
  selectedListing: null,
}

export const fetchAccount = createAsyncThunk<Account>('payment/fetchAccount', async (arg, { getState }) => {
  const userId = getState().user.currentUser?.id;
  const user = await apiCall<Account>(Service.PAYMENT, `/accounts/${userId}`, "GET");
  return user;
});

export interface MakeAccountTransactionData {
  amount: number;
  paymentMethod: PaymentMethod | 'balance';
  type: "top-up" | "withdraw";
}

export const makeAccountTransaction = createAsyncThunk<Transaction, MakeAccountTransactionData>('payment/makeAccountTransaction', async (data, { getState }) => {
  const type = data.type;
  data = { amount: Math.abs(data.amount), paymentMethod: data.paymentMethod === 'balance' ? null : data.paymentMethod } as any;
  const accountId = getState().user.currentUser?.id;
  return apiCall<Transaction>(Service.PAYMENT, `/transactions/${type}/${accountId}/`, "POST", data);
});

export interface MakeListingTransactionData {
  amount: number;
  paymentMethod: PaymentMethod | 'balance';
  listingId: number;
  accountId?: number;
}

export const buyListing = createAsyncThunk<Transaction, MakeListingTransactionData>('payment/buyListing', async (data, { getState }) => {
  const accountId = getState().user.currentUser?.id;
  data = { ...data, accountId, paymentMethod: undefined } as any;
  return apiCall<Transaction>(Service.PAYMENT, `/transactions/marketplace/buy/`, "POST", data);
});

export type PaymentCurrentAction = { type: 'topup' } | { type: 'withdraw' } | { type: 'buyListing', listingId: number } | null;

export const userSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod | 'balance' | null>) => {
      state.selectedPaymentMethod = action.payload;
    },
    setSelectedListing(state, action: PayloadAction<Listing | null>) {
      state.selectedListing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeAccountTransaction.fulfilled, (state, action) => {
        state.balance += action.payload.amount;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.paymentMethods = action.payload.paymentMethods;
      })
      .addCase(buyListing.fulfilled, (state, action) => {
        state.balance -= action.payload.amount;
      });
  },
});

export const { setBalance, setSelectedPaymentMethod, setSelectedListing } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUser = (state: RootState) => state.user.currentUser;

export default userSlice.reducer;