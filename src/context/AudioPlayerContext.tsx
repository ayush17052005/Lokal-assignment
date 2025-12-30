import { useAudioPlayerStatus, useAudioPlayer as useExpoAudioPlayer } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setCurrentTrack,
    setDuration,
    setIsLoading,
    setIsPlaying,
    setPosition,
    Track,
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
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const player = useExpoAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const { currentTrack, shuffle, repeat } = useAppSelector(
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
        dispatch(setIsPlaying(false));
      }
    }
  }, [status.didJustFinish, repeat, dispatch, player]);

  const loadTrack = useCallback(
    async (track: Track) => {
      try {
        dispatch(setIsLoading(true));

        if (!track.audioUrl) {
          console.error('No audio URL provided for track:', track.title);
          dispatch(setIsLoading(false));
          return;
        }

        // If the same track is already loaded, just play it
        if (currentTrack?.id === track.id && status.isLoaded) {
          console.log('Track already loaded, resuming playback');
          player.play();
          dispatch(setIsPlaying(true));
          dispatch(setIsLoading(false));
          return;
        }

        console.log('Loading new track:', track.title);
        dispatch(setCurrentTrack(track));

        // Replace the current source with new track
        player.replace({ uri: track.audioUrl });
        player.play();
        
        console.log('Track loaded and playing');
        dispatch(setIsPlaying(true));
      } catch (error) {
        console.error('Error loading track:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, player, currentTrack, status.isLoaded]
  );

  const play = useCallback(async () => {
    try {
      if (status.isLoaded) {
        player.play();
        dispatch(setIsPlaying(true));
      } else {
        console.warn('Cannot play: No source loaded');
      }
    } catch (error) {
      console.error('Error playing:', error);
    }
  }, [dispatch, player, status.isLoaded]);

  const pause = useCallback(async () => {
    try {
      if (status.isLoaded) {
        player.pause();
        dispatch(setIsPlaying(false));
      } else {
        console.warn('Cannot pause: No source loaded');
      }
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, [dispatch, player, status.isLoaded]);

  const togglePlayPause = useCallback(async () => {
    try {
      console.log('togglePlayPause called, isLoaded:', status.isLoaded);
      
      if (!status.isLoaded) {
        console.warn('No source loaded, cannot toggle playback');
        // Try to reload the current track if we have one
        if (currentTrack?.audioUrl) {
          console.log('Attempting to reload current track');
          player.replace({ uri: currentTrack.audioUrl });
          player.play();
          dispatch(setIsPlaying(true));
        }
        return;
      }

      if (status.playing) {
        console.log('Pausing playback');
        player.pause();
        dispatch(setIsPlaying(false));
      } else {
        console.log('Resuming playback');
        player.play();
        dispatch(setIsPlaying(true));
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }, [dispatch, currentTrack, player, status.playing, status.isLoaded]);

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
          console.warn('Cannot skip: No source loaded');
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
    console.log('Skip to next track');
  }, []);

  const skipToPrevious = useCallback(async () => {
    try {
      if (!status.isLoaded) {
        console.warn('Cannot skip to previous: No source loaded');
        return;
      }
      const currentPos = status.currentTime || 0;
      if (currentPos > 3) {
        player.seekTo(0);
      } else {
        console.log('Skip to previous track');
      }
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  }, [player, status.currentTime, status.isLoaded]);

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
    currentTrack,
    isPlaying: status.playing || false,
    position: status.currentTime || 0,
    duration: status.duration || 0,
    shuffle,
    repeat,
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
