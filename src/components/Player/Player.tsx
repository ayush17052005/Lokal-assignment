import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const { width } = Dimensions.get('window');

const Player = ({ route, navigation }: Props) => {
  const { colors, isDark } = useTheme();
  const { title, artist, coverUrl, duration = '03:50' } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [showLyrics, setShowLyrics] = useState(false);

  // Convert duration string to seconds
  const durationInSeconds = duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, durationInSeconds));
    setCurrentTime(newTime);
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return 'repeat-outline';
    return 'repeat';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'dark-content' : 'dark-content'}
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
          source={{ uri: coverUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
          {artist}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          
          minimumValue={0}
          maximumValue={durationInSeconds}
          value={currentTime}
          onValueChange={setCurrentTime}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.textSecondary + '40'}
          thumbTintColor={colors.primary}
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: colors.text }]}>
            {formatTime(currentTime)}
          </Text>
          <Text style={[styles.time, { color: colors.text }]}>
            {duration}
          </Text>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.mainControls}>
        <TouchableOpacity onPress={() => handleSkip(-durationInSeconds)}>
          <Ionicons name="play-skip-back" size={36} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSkip(-10)}>
          <View style={styles.skipButton}>
            <Ionicons name="refresh" size={35} color={colors.text}  style={{ transform: [{ scaleX: -1 }] }}/>
            <Text style={[styles.skipText, { color: colors.text }]}>10</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={45}
            color="#FFFFFF"
            style={{ marginLeft: isPlaying ? 0 : 5 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSkip(10)}>
          <View style={styles.skipButton}>
            <Ionicons name="refresh" size={35} color={colors.text}  />
            <Text style={[styles.skipText, { color: colors.text }]}>10</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSkip(durationInSeconds)}>
          <Ionicons name="play-skip-forward" size={36} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffle ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat}>
          <Ionicons
            name={getRepeatIcon()}
            size={24}
            color={repeatMode !== 'off' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="wifi" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Lyrics Section */}
      <TouchableOpacity
        style={styles.lyricsToggle}
        onPress={() => setShowLyrics(!showLyrics)}
      >
        <Ionicons
          name={showLyrics ? 'chevron-down' : 'chevron-up'}
          size={24}
          color={colors.textSecondary}
        />
        <Text style={[styles.lyricsText, { color: colors.text }]}>Lyrics</Text>
      </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  coverContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  coverImage: {
    width: width - 70,
    height: width - 70,
    borderRadius: 32,
  },
  songInfo: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  time: {
    fontSize: 14,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    position: 'absolute',
    top: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  lyricsToggle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  lyricsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default Player;