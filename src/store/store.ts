import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import counterReducer from './slices/counterSlice';
import libraryReducer from './slices/librarySlice';
import playerReducer from './slices/playerSlice';
import recentSearchesReducer from './slices/recentSearchesSlice';

// Persist configuration for recent searches
const recentSearchesPersistConfig = {
  key: 'recentSearches',
  storage: AsyncStorage,
  whitelist: ['searches'], // Only persist the searches array
};

const libraryPersistConfig = {
  key: 'library',
  storage: AsyncStorage,
  whitelist: ['history', 'stats'],
};

const persistedRecentSearchesReducer = persistReducer(
  recentSearchesPersistConfig,
  recentSearchesReducer
);

const persistedLibraryReducer = persistReducer(
  libraryPersistConfig,
  libraryReducer
);

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    recentSearches: persistedRecentSearchesReducer,
    library: persistedLibraryReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
