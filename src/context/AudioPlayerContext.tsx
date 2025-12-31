import { useAudioPlayerStatus, useAudioPlayer as useExpoAudioPlayer } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    addToQueue,
    playNextInQueue,
    playNextTrack,
    playPreviousTrack,
    playTrackAtIndex,
    setDuration,
    setIsLoading,
    setIsPlaying,
    setPosition,
    setQueue,
    toggleShuffle,
    Track
} from '../store/slices/playerSlice';

interface AudioPlayerContextType {
  loadTrack: (track: Track) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  skipForward: () => Promise<void>;
  skipBackward: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  playAlbum: (tracks: Track[], startIndex?: number) => Promise<void>;
  addTrackToQueue: (track: Track) => void;
  playTrackNext: (track: Track) => void;
  shuffleQueue: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  queue: Track[];
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const player = useExpoAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const { currentTrack, shuffle, repeat, queue, currentIndex } = useAppSelector(
    (state) => state.player
  );

  // Update Redux state based on player status
  useEffect(() => {
    if (status.playing !== undefined) {
      dispatch(setIsPlaying(status.playing));
    }
    if (status.currentTime !== undefined) {
      dispatch(setPosition(status.currentTime));
    }
    if (status.duration !== undefined) {
      dispatch(setDuration(status.duration));
    }
  }, [status.playing, status.currentTime, status.duration, dispatch]);

  // Handle track completion
  useEffect(() => {
    if (status.didJustFinish) {
      if (repeat === 'one') {
        player.seekTo(0);
        player.play();
      } else {
        // Auto play next track
        if (currentIndex < queue.length - 1 || repeat === 'all') {
           dispatch(playNextTrack());
        } else {
           dispatch(setIsPlaying(false));
        }
      }
    }
  }, [status.didJustFinish, repeat, dispatch, player, currentIndex, queue.length]);

  // Effect to load track when currentTrack changes in Redux
  useEffect(() => {
    const loadCurrentTrack = async () => {
        if (currentTrack && currentTrack.audioUrl) {
             try {
                dispatch(setIsLoading(true));
                console.log('Loading track from Redux change:', currentTrack.title);
                player.replace({ uri: currentTrack.audioUrl });
                player.play();
             } catch (error) {
                 console.error('Error loading track:', error);
             } finally {
                 dispatch(setIsLoading(false));
             }
        }
    };
    
    loadCurrentTrack();
  }, [currentTrack?.id]); // Only re-run if track ID changes

  const loadTrack = useCallback(
    async (track: Track) => {
        // This is for playing a single track immediately (replacing queue or just playing?)
        // Let's assume it replaces queue with single track for now, or just plays it.
        // Existing behavior was: dispatch(setCurrentTrack(track)); player.replace...
        
        // Let's make it set a single track queue
        dispatch(setQueue([track]));
    },
    [dispatch]
  );

  const playAlbum = useCallback(async (tracks: Track[], startIndex = 0) => {
      dispatch(setQueue(tracks));
      if (startIndex > 0) {
          dispatch(playTrackAtIndex(startIndex));
      }
  }, [dispatch]);

  const addTrackToQueue = useCallback((track: Track) => {
      dispatch(addToQueue(track));
  }, [dispatch]);

  const playTrackNext = useCallback((track: Track) => {
      dispatch(playNextInQueue(track));
  }, [dispatch]);
  
  const shuffleQueue = useCallback(() => {
      dispatch(toggleShuffle());
  }, [dispatch]);

  const play = useCallback(async () => {
    try {
      if (status.isLoaded) {
        player.play();
        dispatch(setIsPlaying(true));
      } else if (currentTrack) {
          // If we have a current track but not loaded (e.g. app restart), try to load
          player.replace({ uri: currentTrack.audioUrl });
          player.play();
      }
    } catch (error) {
      console.error('Error playing:', error);
    }
  }, [dispatch, player, status.isLoaded, currentTrack]);

  const pause = useCallback(async () => {
    try {
      if (status.isLoaded) {
        player.pause();
        dispatch(setIsPlaying(false));
      }
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, [dispatch, player, status.isLoaded]);

  const togglePlayPause = useCallback(async () => {
    if (status.playing) {
        await pause();
    } else {
        await play();
    }
  }, [play, pause, status.playing]);

  const seekTo = useCallback(
    async (seconds: number) => {
      try {
        if (status.isLoaded) {
          player.seekTo(seconds);
          dispatch(setPosition(seconds));
        }
      } catch (error) {
        console.error('Error seeking:', error);
      }
    },
    [dispatch, player, status.isLoaded]
  );

  const skip = useCallback(
    async (seconds: number) => {
      try {
        if (!status.isLoaded) {
          return;
        }
        const currentPos = status.currentTime || 0;
        const totalDuration = status.duration || 0;
        const newPosition = Math.max(0, Math.min(currentPos + seconds, totalDuration));
        player.seekTo(newPosition);
      } catch (error) {
        console.error('Error skipping:', error);
      }
    },
    [player, status.currentTime, status.duration, status.isLoaded]
  );

  const skipForward = useCallback(() => skip(10), [skip]);
  const skipBackward = useCallback(() => skip(-10), [skip]);

  const skipToNext = useCallback(async () => {
    dispatch(playNextTrack());
  }, [dispatch]);

  const skipToPrevious = useCallback(async () => {
    const currentPos = status.currentTime || 0;
    if (currentPos > 3) {
        player.seekTo(0);
    } else {
        dispatch(playPreviousTrack());
    }
  }, [player, status.currentTime, dispatch]);

  const value = {
    loadTrack,
    play,
    pause,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    skipToNext,
    skipToPrevious,
    playAlbum,
    addTrackToQueue,
    playTrackNext,
    shuffleQueue,
    currentTrack,
    isPlaying: status.playing || false,
    position: status.currentTime || 0,
    duration: status.duration || 0,
    shuffle,
    repeat,
    queue
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
};
