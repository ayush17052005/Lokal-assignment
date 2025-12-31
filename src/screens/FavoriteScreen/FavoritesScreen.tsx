import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Songinfo from '../../components/Songs/Songinfo';
import { useTheme } from '../../context/ThemeContext';
import { useAudioPlayer, useSongActions } from '../../hooks';
import { useAppSelector } from '../../store/hooks';
import { Track } from '../../store/slices/playerSlice';

const FavoritesScreen = () => {
  const { colors } = useTheme();
  const { playAlbum, currentTrack } = useAudioPlayer();
  const { likedSongs } = useAppSelector((state) => state.library);
  const { openSongInfo, closeSongInfo, selectedSong, isSongInfoVisible } = useSongActions();

  const getTrackFromHistoryItem = (item: any): Track => {
    return {
      id: item.id,
      title: item.title,
      artist: item.subtitle,
      coverUrl: item.image,
      audioUrl: item.data?.downloadUrl?.[item.data?.downloadUrl?.length - 1]?.url || item.data?.url || '',
      duration: item.data?.duration || 0,
      data: item.data,
    };
  };

  const handlePlaySong = (index: number) => {
    const tracks = likedSongs.map(getTrackFromHistoryItem);
    playAlbum(tracks, index);
  };

  const renderSongItem = ({ item, index }: { item: any; index: number }) => {
    const isCurrentSong = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.songItem, isCurrentSong && { backgroundColor: colors.primary + '20' }]} 
        onPress={() => handlePlaySong(index)}
      >
        <Image source={{ uri: item.image }} style={styles.songCover} />
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={() => handlePlaySong(index)}>
          <Ionicons name="play-circle" size={40} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} onPress={() => openSongInfo(item.data)}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Liked Songs</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>{likedSongs.length} songs</Text>
      </View>
      
      <FlatList
        data={likedSongs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No liked songs yet
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 12,
  },
  songCover: {
    width: 50,
    height: 50,
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
    padding: 4,
  },
  moreButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default FavoritesScreen;
