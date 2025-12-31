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
    playIndependentTrack: (state, action: PayloadAction<Track>) => {
      // Keep history (0 to currentIndex), add new track, discard future
      const history = state.queue.slice(0, state.currentIndex + 1);
      state.queue = [...history, action.payload];
      state.originalQueue = [...history, action.payload]; // Update original queue too
      state.currentIndex = state.queue.length - 1;
      state.currentTrack = action.payload;
      state.position = 0;
      state.duration = action.payload.duration || 0;
    },
    playAlbumWithHistory: (state, action: PayloadAction<{ tracks: Track[]; startIndex: number }>) => {
      const { tracks, startIndex } = action.payload;
      // Keep history (0 to currentIndex)
      const history = state.queue.slice(0, state.currentIndex + 1);
      
      // Append new tracks
      state.queue = [...history, ...tracks];
      state.originalQueue = [...history, ...tracks];
      
      // Set current index to the start of the new tracks + startIndex
      state.currentIndex = history.length + startIndex;
      state.currentTrack = state.queue[state.currentIndex];
      state.position = 0;
      state.duration = state.queue[state.currentIndex].duration || 0;
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      // Remove by ID. If multiple, remove the first one found after current index?
      // Or better, remove by index to be safe. Let's use index.
      // Actually, the UI will likely provide an index.
      // But let's stick to ID for now if the user didn't specify, or Index.
      // Index is safer for duplicates.
    },
    removeTrackFromQueue: (state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload;
      if (indexToRemove > state.currentIndex) {
        // Removing from future
        state.queue.splice(indexToRemove, 1);
        state.originalQueue.splice(indexToRemove, 1);
      } else if (indexToRemove < state.currentIndex) {
        // Removing from history
        state.queue.splice(indexToRemove, 1);
        state.originalQueue.splice(indexToRemove, 1);
        state.currentIndex -= 1; // Adjust current index
      } else {
        // Removing current track
        state.queue.splice(indexToRemove, 1);
        state.originalQueue.splice(indexToRemove, 1);
        // If there are more tracks, play the next one (which is now at the same index)
        if (state.queue.length > state.currentIndex) {
            state.currentTrack = state.queue[state.currentIndex];
            state.position = 0;
            state.duration = state.queue[state.currentIndex].duration || 0;
        } else if (state.queue.length > 0) {
            // If we removed the last track, go to the previous one
            state.currentIndex = state.queue.length - 1;
            state.currentTrack = state.queue[state.currentIndex];
            state.position = 0;
            state.duration = state.queue[state.currentIndex].duration || 0;
        } else {
            // Queue is empty
            state.currentTrack = null;
            state.isPlaying = false;
            state.position = 0;
            state.duration = 0;
        }
      }
    },
    reorderQueue: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      // Don't allow moving the current track or moving things before current track for simplicity?
      // Or allow full reorder.
      // If we move current track, currentIndex changes.
      
      const item = state.queue[from];
      state.queue.splice(from, 1);
      state.queue.splice(to, 0, item);
      
      // Update currentIndex if needed
      if (state.currentIndex === from) {
        state.currentIndex = to;
      } else if (state.currentIndex > from && state.currentIndex <= to) {
        state.currentIndex -= 1;
      } else if (state.currentIndex < from && state.currentIndex >= to) {
        state.currentIndex += 1;
      }
      
      state.originalQueue = [...state.queue];
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
  playIndependentTrack,
  playAlbumWithHistory,
  removeTrackFromQueue,
  reorderQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
