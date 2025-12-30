import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecentSearchesState {
  searches: string[];
}

const initialState: RecentSearchesState = {
  searches: [],
};

const recentSearchesSlice = createSlice({
  name: 'recentSearches',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const searchQuery = action.payload.trim();
      
      if (!searchQuery) return;
      
      // Remove if already exists
      state.searches = state.searches.filter(search => search !== searchQuery);
      
      // Add to the beginning (most recent)
      state.searches.unshift(searchQuery);
      
      // Keep only last 10 searches
      if (state.searches.length > 10) {
        state.searches = state.searches.slice(0, 10);
      }
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.searches = state.searches.filter(search => search !== action.payload);
    },
    clearAllRecentSearches: (state) => {
      state.searches = [];
    },
  },
});

export const { addRecentSearch, removeRecentSearch, clearAllRecentSearches } = recentSearchesSlice.actions;
export default recentSearchesSlice.reducer;
