import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleLike } from '../../store/slices/librarySlice';
import { setRepeat, toggleShuffle } from '../../store/slices/playerSlice';
import { RootStackParamList } from '../../types/navigation';
import QueueList from './QueueList';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const { width } = Dimensions.get('window');

const Player = ({ route, navigation }: Props) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [isSeeking, setIsSeeking] = useState(false);
  const [isQueueVisible, setQueueVisible] = useState(false);

  const {
    currentTrack,
    isPlaying,
    position,
    duration: audioDuration,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    skipToNext,
    skipToPrevious,
    queue,
    currentIndex,
    reorderQueue,
    removeFromQueue,
    playTrackAtIndex,
  } = useAudioPlayer();

  const { shuffle: isShuffle, repeat: repeatMode } = useAppSelector((state) => state.player);
  const { likedSongs } = useAppSelector((state) => state.library);

  const isLiked = currentTrack ? likedSongs.some(item => item.id === currentTrack.id) : false;

  const handleToggleLike = () => {
    if (currentTrack) {
      dispatch(toggleLike({
        id: currentTrack.id,
        type: 'song',
        title: currentTrack.title,
        subtitle: currentTrack.artist,
        image: currentTrack.coverUrl,
        timestamp: Date.now(),
        data: currentTrack.data || {},
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    dispatch(setRepeat(modes[(currentIndex + 1) % modes.length]));
  };

  const handleToggleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return 'repeat-outline';
    return 'repeat';
  };

  if (!currentTrack) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text }}>No track loaded</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Album Cover */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: currentTrack.coverUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={audioDuration || currentTrack.duration}
          value={isSeeking ? undefined : position}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={(value) => {
            setIsSeeking(false);
            seekTo(value);
          }}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.textSecondary + '40'}
          thumbTintColor={colors.primary}
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: colors.text }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.time, { color: colors.text }]}>
            {formatTime(audioDuration || currentTrack.duration)}
          </Text>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={36} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipBackward}>
          <View style={styles.skipButton}>
            <Ionicons name="refresh" size={35} color={colors.text}  style={{ transform: [{ scaleX: -1 }] }}/>
            <Text style={[styles.skipText, { color: colors.text }]}>10</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayPause}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={45}
            color="#FFFFFF"
            style={{ marginLeft: isPlaying ? 0 : 5 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward}>
          <View style={styles.skipButton}>
            <Ionicons name="refresh" size={35} color={colors.text}  />
            <Text style={[styles.skipText, { color: colors.text }]}>10</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward" size={36} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        <TouchableOpacity onPress={handleToggleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color={isLiked ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setQueueVisible(true)}>
          <Ionicons name="list" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isQueueVisible}
        onBackdropPress={() => setQueueVisible(false)}
        onSwipeComplete={() => setQueueVisible(false)}
        swipeDirection="down"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={{ height: '70%', backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <View style={{ alignItems: 'center', padding: 10 }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 2.5 }} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Queue</Text>
          </View>
          <QueueList
            queue={queue}
            currentTrack={currentTrack}
            currentIndex={currentIndex}
            onReorder={reorderQueue}
            onRemove={removeFromQueue}
            onPlay={(index) => {
              playTrackAtIndex(index);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  headerButton: {
    padding: 8,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  coverImage: {
    width: width - 80,
    height: width - 80,
    borderRadius: 20,
  },
  songInfo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    top: 12,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default Player;
