import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  data?: any; // Original data object
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  originalQueue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  isLoading: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
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
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
      state.originalQueue = action.payload;
      state.currentIndex = 0;
      if (action.payload.length > 0) {
        state.currentTrack = action.payload[0];
        state.position = 0;
        state.duration = action.payload[0].duration || 0;
      }
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
      state.originalQueue.push(action.payload);
    },
    playNextInQueue: (state, action: PayloadAction<Track>) => {
      if (state.currentIndex === -1) {
        state.queue.push(action.payload);
        state.originalQueue.push(action.payload);
      } else {
        state.queue.splice(state.currentIndex + 1, 0, action.payload);
        state.originalQueue.splice(state.currentIndex + 1, 0, action.payload);
      }
    },
    playTrackAtIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.queue.length) {
        state.currentIndex = action.payload;
        state.currentTrack = state.queue[action.payload];
        state.position = 0;
        state.duration = state.queue[action.payload].duration || 0;
      }
    },
    playNextTrack: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.position = 0;
        state.duration = state.queue[state.currentIndex].duration || 0;
      } else if (state.repeat === 'all' && state.queue.length > 0) {
        state.currentIndex = 0;
        state.currentTrack = state.queue[0];
        state.position = 0;
        state.duration = state.queue[0].duration || 0;
      }
    },
    playPreviousTrack: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.position = 0;
        state.duration = state.queue[state.currentIndex].duration || 0;
      } else if (state.repeat === 'all' && state.queue.length > 0) {
        state.currentIndex = state.queue.length - 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.position = 0;
        state.duration = state.queue[state.currentIndex].duration || 0;
      }
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
      if (state.shuffle) {
        // Shuffle the queue but keep current track first if playing
        const currentTrack = state.currentTrack;
        const remainingTracks = state.queue.filter(t => t.id !== currentTrack?.id);
        for (let i = remainingTracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingTracks[i], remainingTracks[j]] = [remainingTracks[j], remainingTracks[i]];
        }
        if (currentTrack) {
          state.queue = [currentTrack, ...remainingTracks];
          state.currentIndex = 0;
        } else {
          state.queue = remainingTracks;
        }
      } else {
        // Restore original queue order
        state.queue = [...state.originalQueue];
        if (state.currentTrack) {
          state.currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
        }
      }
    },
    setRepeat: (state, action: PayloadAction<'off' | 'all' | 'one'>) => {
      state.repeat = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetPlayer: (state) => {
      state.currentTrack = null;
      state.queue = [];
      state.originalQueue = [];
      state.currentIndex = -1;
      state.isPlaying = false;
      state.position = 0;
      state.duration = 0;
    },
  },
});

export const {
  setCurrentTrack,
  setQueue,
  addToQueue,
  playNextInQueue,
  playTrackAtIndex,
  playNextTrack,
  playPreviousTrack,
  setIsPlaying,
  setPosition,
  setDuration,
  toggleShuffle,
  setRepeat,
  setIsLoading,
  resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
