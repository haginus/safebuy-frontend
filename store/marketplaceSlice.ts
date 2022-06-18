import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.';
import { Service } from '../lib/constants';
import { Asset } from '../lib/model/Asset';
import { Listing, ListingBase, ListingCreate, ListingDetails, ListingUpdate } from '../lib/model/Listing';
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

export const updateListing = createAsyncThunk<ListingDetails, ListingUpdate>('marketplace/updateListing', async (data, { getState }) => {
  const listing = await apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/${data.id}`, "PUT", data);
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

export const fetchListing = createAsyncThunk<ListingDetails, number>('marketplace/fetchListing', async (id, { getState }) => {
  return apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/${id}/details`, "GET");;
});

type AddAssetsPayload = {
  listingId: number;
  assets: Asset[];
}

export const addAssets = createAsyncThunk<ListingDetails, AddAssetsPayload>('marketplace/addAssets', async (payload, { getState }) => {
  return apiCall<ListingDetails>(Service.MARKETPLACE, `/listings/${payload.listingId}/assets`, "POST", payload.assets);;
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
      .addCase(updateListing.fulfilled, (state, action) => {
        const index = state.myListings.findIndex(l => l.id === action.payload.id);
        if (index >= 0) {
          state.myListings[index] = action.payload;
        }
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
      })
      .addCase(fetchListing.fulfilled, (state, action) => {
        _updateListingIndex(state, [action.payload], 'myListingsIndex');
      })
      .addCase(addAssets.fulfilled, (state, action) => {
        const idx = state.myListings.findIndex(listing => listing.id === action.payload.id);
        if (idx >= 0) {
          state.myListings[idx] = action.payload;
        }
        state.myListingsIndex[action.payload.id] = action.payload;
      })
  }
});

function _updateListingIndex(state: MarketplaceState, listings: Listing[], index: 'searchListingsIndex' | 'myListingsIndex') {
  const idx = { ...state[index] };
  listings.forEach(listing => {
    idx[listing.id] = listing;
  });
  state[index] = { ...idx } as any;
}

export const { setSelectedCategory, setSearchString } = userSlice.actions;

export const selectListing = (state: RootState, listingId: number) => (
  state.marketplace.myListingsIndex[listingId] || state.marketplace.searchListingsIndex[listingId]
);

export default userSlice.reducer;