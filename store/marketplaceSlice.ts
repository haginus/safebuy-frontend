import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Listing } from '../lib/model/Listing';
import { ListingCategory } from '../lib/model/ListingCategory';
import { User } from '../lib/model/User';
import type { RootState } from './index'

interface MarketplaceState {
  listingIndex: { [id: number]: Listing };
  listingCategories: ListingCategory[];
  
}

const initialState: MarketplaceState = {
  listingIndex: {},
  listingCategories: [],
}

export const userSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
});


export const { setCurrentUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export default userSlice.reducer;