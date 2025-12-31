import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSongSuggestions } from '../../../api/hooks';
import Songinfo from '../../../components/Songs/Songinfo';
import { useTheme } from '../../../context/ThemeContext';
import { useSongActions } from '../../../hooks';
import { useAppSelector } from '../../../store/hooks';

const SongsScreen = () => {
  const { colors } = useTheme();
  const { playSong, openSongInfo, closeSongInfo, selectedSong, isSongInfoVisible, getImageUrl, getArtistName } = useSongActions();
  
  const { history } = useAppSelector((state) => state.library);
  const recentlyPlayed = history.filter(item => item.type === 'song');
  const lastPlayedSongId = recentlyPlayed[0]?.id || '';

  const { data: suggestionsData, isLoading } = useSongSuggestions(lastPlayedSongId, {
    enabled: !!lastPlayedSongId,
  });

  const songs = suggestionsData?.data || [];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => playSong(item)}>
      <Image source={{ uri: getImageUrl(item) }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {getArtistName(item)} | {formatDuration(item.duration)}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => playSong(item)}>
        <Ionicons name="play-circle" size={40} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton} onPress={() => openSongInfo(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>{songs.length} songs</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Recommended</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {lastPlayedSongId ? 'No recommendations found' : 'Play a song to get recommendations'}
            </Text>
          </View>
        }
      />
      
      {selectedSong && (
        <Songinfo
          isVisible={isSongInfoVisible}
          onClose={closeSongInfo}
          song={selectedSong}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  songCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  playButton: {
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SongsScreen;
