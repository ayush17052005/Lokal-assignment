import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MiniPlayer = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { currentTrack, isPlaying, togglePlayPause, skipToNext, position, duration, seekTo } = useAudioPlayer();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  if (!currentTrack) {
    return null;
  }

  const handlePress = () => {
    navigation.navigate('Player', {
      songId: currentTrack.id,
    });
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: currentTrack.coverUrl }} style={styles.cover} />

        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            style={styles.controlButton}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              skipToNext();
            }}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <Slider
            style={{ width: '100%', height: 20 }}
            minimumValue={0}
            maximumValue={duration || currentTrack.duration || 1}
            value={isSeeking ? seekValue : position}
            onSlidingStart={(value) => {
                setIsSeeking(true);
                setSeekValue(value);
            }}
            onValueChange={(value) => {
                setSeekValue(value);
            }}
            onSlidingComplete={(value) => {
                seekTo(value);
                setIsSeeking(false);
            }}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.textSecondary + '40'}
            thumbTintColor={colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 8,
  },
  progressBar: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
  }
});

export default MiniPlayer;
