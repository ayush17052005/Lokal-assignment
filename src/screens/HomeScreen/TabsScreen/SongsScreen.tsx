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
import Songinfo from '../../../components/Songs/Songinfo';
import { useTheme } from '../../../context/ThemeContext';
import { useSongActions } from '../../../hooks';

const SongsScreen = () => {
  const { colors } = useTheme();
  const { playSong, openSongInfo, closeSongInfo, selectedSong, isSongInfoVisible } = useSongActions();

  const songs = [
    { id: '1', name: 'Starboy', artists: { primary: [{ name: 'The Weeknd, Daft Punk' }] }, duration: 230, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=1' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }] },
    { id: '2', name: 'Disaster', artists: { primary: [{ name: 'Conan Gray' }] }, duration: 238, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=2' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }] },
    { id: '3', name: 'HANDSOME', artists: { primary: [{ name: 'Warren Hue' }] }, duration: 285, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=3' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }] },
    { id: '4', name: 'Sharks', artists: { primary: [{ name: 'Imagine Dragons' }] }, duration: 383, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=4' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }] },
    { id: '5', name: 'Fly Me To The Sun', artists: { primary: [{ name: 'Romantic Echoes' }] }, duration: 260, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=5' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }] },
    { id: '6', name: 'The Bended Man', artists: { primary: [{ name: 'Sunwich' }] }, duration: 228, image: [{ quality: '500x500', url: 'https://picsum.photos/200/200?random=6' }], downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }] },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => playSong(item)}>
      <Image source={{ uri: item.image[0].url }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.artists.primary[0].name} | {formatDuration(item.duration)}
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.count, { color: colors.text }]}>560 songs</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: colors.primary }]}>Ascending</Text>
          <Ionicons name="swap-vertical" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  songCover: {
    width: 80,
    height: 80,
    borderRadius: 15,
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
    fontSize: 13,
  },
  playButton: {
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
});

export default SongsScreen;
