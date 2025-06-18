import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listings: null,
    shouldFetchListings: true,
    allListings: null,
    shouldFetchAllListings: true,
    initialFetchListings: null,
    shouldFetchInitialListings: true
}

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        fetchListings: (state, action) => {
            state.listings = action.payload;
        },
        setShouldFetchListingsTrue: (state) => {
            state.shouldFetchListings = true;
        },
        setShouldFetchListingsFalse: (state) => {
            state.shouldFetchListings = false;
        },
        deleteAdminListingById: (state, action) => {
            const id = action.payload.id;
            state.listings = state.listings.filter(listing => listing._id !== id);
            state.allListings = state.allListings.filter(listing => listing._id !== id);
            Object.keys(state.initialFetchListings).forEach((key) => {
                if (Array.isArray(state.initialFetchListings[key])) {
                    state.initialFetchListings[key] = state.initialFetchListings[key].filter(
                        (listing) => listing._id !== id
                    );
                }
            });
        },

        setShouldFetchAllListingsFalse: (state) => {
            state.shouldFetchAllListings = false;
        },
        setShouldFetchAllListingsTrue: (state) => {
            state.shouldFetchAllListings = true;
        },
        deleteListingById: (state, action) => {
            const id = action.payload.id;
            state.listings = state.listings.filter(listing => listing._id !== id)
            state.allListings = state.allListings.filter(listing => listing._id !== id);
            Object.keys(state.initialFetchListings).forEach((key) => {
                if (Array.isArray(state.initialFetchListings[key])) {
                    state.initialFetchListings[key] = state.initialFetchListings[key].filter(
                        (listing) => listing._id !== id
                    );
                }
            });
        },
        fetchAllListings: (state, action) => {
            state.allListings = action.payload;
        },

        setShouldFetchInitialListingsTrue: (state) => {
            state.shouldFetchInitialListings = true;
        },
        setShouldFetchInitialListingsFalse: (state) => {
            state.shouldFetchInitialListings = false;
        },
        fetchInitialFetchListings: (state, action) => {
            state.initialFetchListings = action.payload;
        },
        deleteInitialListingById: (state, action) => {
            const id = action.payload._id;
            state.listings = state.listings.filter(listing => listing._id !== id);
            state.allListings = state.allListings.filter(listing => listing._id !== id);
            Object.keys(state.initialFetchListings).forEach((key) => {
                if (Array.isArray(state.initialFetchListings[key])) {
                    state.initialFetchListings[key] = state.initialFetchListings[key].filter(
                        (listing) => listing._id !== id
                    );
                }
            });
        }

    }
});

export const { setShouldFetchListingsFalse, setShouldFetchListingsTrue, fetchListings, deleteListingById, deleteAdminListingById, fetchAllListings, setShouldFetchAllListingsFalse, setShouldFetchAllListingsTrue, setShouldFetchInitialListingsFalse, setShouldFetchInitialListingsTrue, fetchInitialFetchListings, deleteInitialListingById } = listingSlice.actions;

export default listingSlice.reducer;