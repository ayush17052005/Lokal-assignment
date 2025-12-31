import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ItemType = 'song' | 'album' | 'artist' | 'playlist';

export interface HistoryItem {
  id: string;
  type: ItemType;
  title: string;
  subtitle: string; // Artist name or "Album" etc.
  image: string;
  timestamp: number;
  data: any; // Store the full original object to allow re-playing/navigating
}

export interface PlayStats {
  id: string;
  count: number;
  lastPlayed: number;
  item: HistoryItem; // Keep a copy of item details for easy display
}

interface LibraryState {
  history: HistoryItem[];
  stats: Record<string, PlayStats>;
}

const initialState: LibraryState = {
  history: [],
  stats: {},
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<HistoryItem>) => {
      const newItem = action.payload;
      
      // 1. Update History (Recently Played)
      // Remove existing entry of same ID to avoid duplicates in recent list
      state.history = state.history.filter(item => item.id !== newItem.id);
      // Add to front
      state.history.unshift(newItem);
      // Limit to 20 items
      if (state.history.length > 20) {
        state.history.pop();
      }

      // 2. Update Stats (Most Played)
      if (!state.stats[newItem.id]) {
        state.stats[newItem.id] = {
          id: newItem.id,
          count: 1,
          lastPlayed: newItem.timestamp,
          item: newItem,
        };
      } else {
        state.stats[newItem.id].count += 1;
        state.stats[newItem.id].lastPlayed = newItem.timestamp;
        // Update item details in case they changed (e.g. better image)
        state.stats[newItem.id].item = newItem;
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
    resetStats: (state) => {
      state.stats = {};
    },
  },
});

export const { addToHistory, clearHistory, resetStats } = librarySlice.actions;
export default librarySlice.reducer;
