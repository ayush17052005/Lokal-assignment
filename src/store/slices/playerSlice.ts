import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  isLoading: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  isLoading: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
      state.position = 0;
      state.duration = action.payload?.duration || 0;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    setRepeat: (state, action: PayloadAction<'off' | 'all' | 'one'>) => {
      state.repeat = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetPlayer: (state) => {
      state.currentTrack = null;
      state.isPlaying = false;
      state.position = 0;
      state.duration = 0;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlaying,
  setPosition,
  setDuration,
  toggleShuffle,
  setRepeat,
  setIsLoading,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
