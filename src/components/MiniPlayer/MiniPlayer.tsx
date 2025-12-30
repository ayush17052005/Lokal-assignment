import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { RootStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MiniPlayer = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { currentTrack, isPlaying, togglePlayPause, skipToNext } = useAudioPlayer();

  if (!currentTrack) {
    return null;
  }

  const handlePress = () => {
    navigation.navigate('Player', {
      songId: currentTrack.id,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
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
});

export default MiniPlayer;
