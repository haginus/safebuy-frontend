import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { Listing, ListingBase, ListingCreate, ListingDetails } from '../lib/model/Listing';
import { ListingCategory } from '../lib/model/ListingCategory';
import { User } from '../lib/model/User';
import { apiCall, formatUrlParams } from '../lib/util';
import type { RootState } from './index'
import { createAsyncThunk } from './util';

interface MarketplaceState {
  listingIndex: { [id: number]: Listing };
  listingCategories: ListingCategory[];
  myListings: ListingDetails[];
  searchListingsResult: Listing[];
  searchString: string;
  searchSelectedCategory: ListingCategory | null;
}

const initialState: MarketplaceState = {
  listingIndex: {},
  listingCategories: [],
  myListings: [],
  searchListingsResult: [],
  searchString: '',
  searchSelectedCategory: null
}

export const createListing = createAsyncThunk<ListingDetails, ListingCreate>('marketplace/createListing', async (data, { getState }) => {
  const listing = await apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/`, "POST", data);
  return listing;
});

export const searchListings = createAsyncThunk<Listing[]>('marketplace/searchListings', async (arg, { getState }) => {
  const state = getState();
  const search = state.marketplace.searchString;
  const categoryId = state.marketplace.searchSelectedCategory?.id;
  const url = formatUrlParams("/listings", { search, categoryId });
  return apiCall<Listing[]>(Service.MARKETPLACE, url, "GET");
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
      .addCase(searchListings.rejected, (state, action) => {
        state.searchListingsResult = [];
      })
      .addCase(searchListings.fulfilled, (state, action) => {
        state.searchListingsResult = action.payload;
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