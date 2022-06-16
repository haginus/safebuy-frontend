import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service } from '../lib/constants';
import { Listing, ListingBase, ListingCreate, ListingDetails } from '../lib/model/Listing';
import { ListingCategory } from '../lib/model/ListingCategory';
import { apiCall, formatUrlParams } from '../lib/util';
import { createAsyncThunk } from './util';

interface MarketplaceState {
  listingCategories: ListingCategory[];
  myListings: ListingDetails[];
  searchListingsResult: Listing[];
  searchString: string;
  searchSelectedCategory: ListingCategory | null;
  searchListingsIndex: { [id: number]: Listing };
  myListingsIndex: { [id: number]: ListingDetails };
}

const initialState: MarketplaceState = {
  listingCategories: [],
  myListings: [],
  searchListingsResult: [],
  searchString: '',
  searchSelectedCategory: null,
  searchListingsIndex: {},
  myListingsIndex: {}
}

export const createListing = createAsyncThunk<ListingDetails, ListingCreate>('marketplace/createListing', async (data, { getState }) => {
  const listing = await apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/`, "POST", data);
  return listing;
});

export const searchListings = createAsyncThunk<Listing[]>('marketplace/searchListings', async (arg, { getState }) => {
  const state = getState();
  const search = state.marketplace.searchString;
  const categoryId = state.marketplace.searchSelectedCategory?.id;
  const url = formatUrlParams("/listings", { search, categoryId, isAvailable: true });
  return apiCall<Listing[]>(Service.MARKETPLACE, url, "GET");
});

export const fetchListingCategories = createAsyncThunk<ListingCategory[]>('marketplace/fetchListingCategories', async (_, { getState }) => {
  return apiCall<ListingCategory[]>(Service.MARKETPLACE, `/categories/`, "GET");;
});

export const fetchMyListings = createAsyncThunk<ListingDetails[]>('marketplace/fetchMyListings', async (_, { getState }) => {
  const userId = getState().user.currentUser?.id;
  return apiCall<ListingDetails[]>(Service.MARKETPLACE, `/listings/for/${userId}`, "GET");;
});

export const userSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<ListingCategory | null>) => {
      state.searchSelectedCategory = action.payload;
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createListing.fulfilled, (state, action) => {
        state.myListings.push(action.payload);
        _updateListingIndex(state, [action.payload], 'myListingsIndex');
      })
      .addCase(searchListings.rejected, (state, action) => {
        state.searchListingsResult = [];
        state.searchListingsIndex = {};
      })
      .addCase(searchListings.fulfilled, (state, action) => {
        state.searchListingsResult = action.payload;
        _updateListingIndex(state, action.payload, 'searchListingsIndex');
      })
      .addCase(fetchListingCategories.fulfilled, (state, action) => {
        state.listingCategories = action.payload;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.myListings = action.payload;
        _updateListingIndex(state, action.payload, 'myListingsIndex');
      });
  }
});

function _updateListingIndex(state: MarketplaceState, listings: Listing[], index: 'searchListingsIndex' | 'myListingsIndex') {
  listings.forEach(listing => {
    state[index][listing.id] = listing;
  });
}


export const { setSelectedCategory, setSearchString } = userSlice.actions;

export default userSlice.reducer;