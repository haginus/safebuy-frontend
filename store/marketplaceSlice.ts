import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { Listing, ListingBase, ListingCreate, ListingDetails } from '../lib/model/Listing';
import { ListingCategory } from '../lib/model/ListingCategory';
import { User } from '../lib/model/User';
import { apiCall } from '../lib/util';
import type { RootState } from './index'
import { createAsyncThunk } from './util';

interface MarketplaceState {
  listingIndex: { [id: number]: Listing };
  listingCategories: ListingCategory[];
  myListings: ListingDetails[];
}

const initialState: MarketplaceState = {
  listingIndex: {},
  listingCategories: [],
  myListings: [],
}

export const createListing = createAsyncThunk<ListingDetails, ListingCreate>('marketplace/createListing', async (data, { getState }) => {
  const listing = await apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/`, "POST", data);
  return listing;
});

export const userSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    updateListingIndex: (state, action: PayloadAction<Listing>) => {
      _updateListingIndex(state, [action.payload]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createListing.fulfilled, (state, action) => {
        state.myListings.push(action.payload);
        _updateListingIndex(state, [action.payload]);
      })
  }
});

function _updateListingIndex(state: MarketplaceState, listings: Listing[]) {
  listings.forEach(listing => {
    state.listingIndex[listing.id] = listing;
  });
}


export const { updateListingIndex } = userSlice.actions;

export default userSlice.reducer;